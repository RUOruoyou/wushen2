const fs = require("fs");
const http = require("http");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

require("./env").config();
globalThis["__CONFIG"] = require("./config");

const PORT = __CONFIG.WEB_PORT;
const STATIC_ROOT = path.join(__dirname, "www");
const API_PATHS = ["./api/user", "./api/game", "./api/admin"];
const APIS = {};
const sessions = new Map();
const BODY_LIMIT = 512 * 1024;

for (const api of API_PATHS) {
	APIS[api.replace("./api/", "")] = require(api);
}

function parseCookies(header = "") {
	const cookies = {};
	for (const part of header.split(";")) {
		const index = part.indexOf("=");
		if (index < 0) continue;
		const key = part.slice(0, index).trim();
		const value = part.slice(index + 1).trim();
		if (key) cookies[key] = decodeURIComponent(value);
	}
	return cookies;
}

function serializeCookie(name, value, options = {}) {
	const parts = [`${name}=${encodeURIComponent(value)}`];
	if (options.maxAge) parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
	parts.push("Path=/");
	if (options.httpOnly) parts.push("HttpOnly");
	return parts.join("; ");
}

function attachResponseHelpers(res) {
	res.status = function (code) {
		res.statusCode = code;
		return res;
	};
	res.json = function (data) {
		if (!res.headersSent) {
			res.setHeader("Content-Type", "application/json; charset=utf-8");
		}
		res.end(JSON.stringify(data));
	};
	res.cookie = function (name, value, options) {
		const cookie = serializeCookie(name, value, options);
		const existing = res.getHeader("Set-Cookie");
		if (!existing) {
			res.setHeader("Set-Cookie", cookie);
		} else if (Array.isArray(existing)) {
			res.setHeader("Set-Cookie", existing.concat(cookie));
		} else {
			res.setHeader("Set-Cookie", [existing, cookie]);
		}
	};
}

function attachRequestState(req, url) {
	req.query = Object.fromEntries(url.searchParams.entries());
	req.cookies = parseCookies(req.headers.cookie);
	let sid = req.cookies.sid;
	if (!sid || !sessions.has(sid)) {
		sid = crypto.randomBytes(16).toString("hex");
		sessions.set(sid, { id: sid, data: {} });
	}
	const session = sessions.get(sid);
	req.session = session.data;
	req.session.id = sid;
	req._sessionId = sid;
}

async function readBody(req) {
	if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return {};
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		size += chunk.length;
		if (size > BODY_LIMIT) {
			const error = new Error("Request body too large");
			error.statusCode = 413;
			throw error;
		}
		chunks.push(chunk);
	}
	const raw = Buffer.concat(chunks).toString("utf8");
	if (!raw) return {};
	const type = req.headers["content-type"] || "";
	if (type.includes("application/json")) {
		return JSON.parse(raw);
	}
	if (type.includes("application/x-www-form-urlencoded")) {
		return Object.fromEntries(new URLSearchParams(raw).entries());
	}
	return { raw };
}

function contentType(filePath) {
	switch (path.extname(filePath).toLowerCase()) {
		case ".html": return "text/html; charset=utf-8";
		case ".js": return "application/javascript; charset=utf-8";
		case ".css": return "text/css; charset=utf-8";
		case ".json": return "application/json; charset=utf-8";
		case ".svg": return "image/svg+xml";
		case ".png": return "image/png";
		case ".jpg":
		case ".jpeg": return "image/jpeg";
		case ".gif": return "image/gif";
		case ".woff": return "font/woff";
		case ".ttf": return "font/ttf";
		case ".eot": return "application/vnd.ms-fontobject";
		default: return "application/octet-stream";
	}
}

function serveStatic(url, res) {
	let pathname = decodeURIComponent(url.pathname);
	if (pathname === "/") pathname = "/index.html";
	const filePath = path.normalize(path.join(STATIC_ROOT, pathname));
	if (!filePath.startsWith(STATIC_ROOT)) {
		res.status(403).end("Forbidden");
		return true;
	}
	if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
	res.setHeader("Content-Type", contentType(filePath));
	fs.createReadStream(filePath).pipe(res);
	return true;
}

async function callApi(req, res, className, methodName, sse = false) {
	const ClassModule = APIS[className];
	if (!ClassModule) return res.status(404).json({ error: "Method not found" });
	if (ClassModule.allowedMethods && !ClassModule.allowedMethods.has(methodName)) {
		return res.status(404).json({ error: "Method not found" });
	}
	const instance = new ClassModule(req, res);
	if (typeof instance[methodName] !== "function") {
		return res.status(404).json({ error: "Method not found" });
	}
	const body = await readBody(req);
	const params = { ...req.query, ...body };
	if (sse) {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");
		res.flushHeaders();
		const handler = await instance[methodName](params);
		if (!res.writableEnded) {
			if (handler && handler.end) {
				res.on("close", () => handler.end());
			} else {
				res.end();
			}
		}
		return;
	}
	const result = await instance[methodName](params);
	res.json(result);
}

async function reloadApi(req, res) {
	const admin = new APIS.admin(req, res);
	const auth = await admin.me();
	if (!auth || auth.code !== 1) {
		return res.status(403).json({ error: auth && auth.result || "Forbidden" });
	}
	for (const modulePath of API_PATHS) {
		const resolvedPath = require.resolve(modulePath);
		delete require.cache[resolvedPath];
		APIS[modulePath.replace("./api/", "")] = require(resolvedPath);
	}
	res.json({ msg: "api reload" });
}

async function handleRequest(req, res) {
	attachResponseHelpers(res);
	const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
	attachRequestState(req, url);
	res.cookie("sid", req._sessionId, { maxAge: 1000 * 60 * 30 });
	try {
		let match = /^\/api\/([^/]+)\/([^/]+)\/?$/.exec(url.pathname);
		if (match) return await callApi(req, res, match[1], match[2]);
		match = /^\/sse\/([^/]+)\/([^/]+)\/?$/.exec(url.pathname);
		if (match) return await callApi(req, res, match[1], match[2], true);
		if (url.pathname === "/reload") return await reloadApi(req, res);
		if (url.pathname === "/health") return res.json({ ok: true });
		if (serveStatic(url, res)) return;
		res.status(404).end("Not Found");
	} catch (error) {
		if (!error.statusCode) console.error("API Error:", error);
		if (!res.headersSent) {
			const status = error.statusCode || 500;
			res.status(status).json({ error: status === 413 ? "Request body too large" : "Internal server error" });
		}
		else res.end();
	}
}

async function start() {
	await __CONFIG.init();
	const server = http.createServer(handleRequest);
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(PORT, () => {
			server.off("error", reject);
			console.log(`Server running on port ${PORT}`);
			console.log(`Static files served from ${STATIC_ROOT}`);
			resolve();
		});
	});
}

start().catch((error) => {
	console.error("Web server startup failed:", error);
	process.exit(1);
});

process.on("uncaughtException", (error) => {
	console.error("未捕获的异常:", error);
});
process.on("unhandledRejection", (reason) => {
	console.error("未处理的Promise拒绝:", reason);
});
