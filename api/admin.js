const crypto = require("crypto");
const http = require("http");
const APIBASE = require("./base");

const { DB } = __CONFIG;
const ADMIN_LEVEL = 5;
const ADMIN_HEADER = "x-wsmud-admin";
const BRIDGE_RESPONSE_LIMIT = 5 * 1024 * 1024;

function bridgeToken() {
    return crypto.createHash("sha256")
        .update(__CONFIG.SESSION_SECRET + "|" + __CONFIG.ADMIN_SOCKET_PATH)
        .digest("hex");
}

class AdminAPI extends APIBASE {
    async requireAdmin() {
        if (this.req.headers[ADMIN_HEADER] !== "1") {
            throw new Error("非法的管理请求");
        }
        const sessionUser = this.getUser();
        if (!sessionUser) throw new Error("请先登录管理员账号");
        const user = await DB.getUserBy("id", sessionUser.id);
        if (!user || user.pwd !== sessionUser.pwd || parseInt(user.state || 0) !== 1) {
            throw new Error("登录状态已经失效");
        }
        if (parseInt(user.level || 0) < ADMIN_LEVEL) {
            throw new Error("当前账号没有管理权限");
        }
        return {
            id: user.id,
            name: user.name,
            level: parseInt(user.level || 0)
        };
    }

    async execute(handler) {
        try {
            const actor = await this.requireAdmin();
            const result = await handler.call(this, actor);
            return { code: 1, result: result };
        } catch (error) {
            return { code: 0, result: error.message || "管理操作失败" };
        }
    }

    callBridge(action, data, actor) {
        const body = JSON.stringify({ action: action, data: data || {}, actor: actor });
        return new Promise((resolve, reject) => {
            const request = http.request({
                socketPath: __CONFIG.ADMIN_SOCKET_PATH,
                path: "/admin",
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Content-Length": Buffer.byteLength(body),
                    "X-Admin-Bridge-Token": bridgeToken()
                },
                timeout: 60000
            }, (response) => {
                const chunks = [];
                let size = 0;
                response.on("data", (chunk) => {
                    size += chunk.length;
                    if (size > BRIDGE_RESPONSE_LIMIT) {
                        request.destroy(new Error("游戏服务管理响应过大"));
                        return;
                    }
                    chunks.push(chunk);
                });
                response.on("end", () => {
                    try {
                        const result = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
                        if (response.statusCode !== 200 || result.ok !== true) {
                            return reject(new Error(result.error || "游戏服务管理操作失败"));
                        }
                        resolve(result.result);
                    } catch (error) {
                        reject(new Error("游戏服务返回了无效数据"));
                    }
                });
            });
            request.on("timeout", () => request.destroy(new Error("游戏服务管理操作超时")));
            request.on("error", (error) => {
                if (error.code === "ENOENT" || error.code === "ECONNREFUSED") {
                    return reject(new Error("游戏服务管理通道尚未启动"));
                }
                reject(error);
            });
            request.end(body);
        });
    }

    async me() {
        return this.execute(async (actor) => actor);
    }

    async state() {
        return this.execute(async (actor) => this.callBridge("state", {}, actor));
    }

    async roles(data) {
        return this.execute(async () => {
            const query = String(data.query || "").trim();
            if (query.length > 40) return [];
            return DB.searchRoles(query, __CONFIG.def_server.id, 100);
        });
    }

    async noticeCreate(data) {
        return this.execute(async (actor) => this.callBridge("notice.create", data, actor));
    }

    async noticeUpdate(data) {
        return this.execute(async (actor) => this.callBridge("notice.update", data, actor));
    }

    async noticeWithdraw(data) {
        return this.execute(async (actor) => this.callBridge("notice.withdraw", data, actor));
    }

    async noticePublish(data) {
        return this.execute(async (actor) => this.callBridge("notice.publish", data, actor));
    }

    async mailSend(data) {
        return this.execute(async (actor) => this.callBridge("mail.send", data, actor));
    }

    async mailUpdate(data) {
        return this.execute(async (actor) => this.callBridge("mail.update", data, actor));
    }

    async mailWithdraw(data) {
        return this.execute(async (actor) => this.callBridge("mail.withdraw", data, actor));
    }

    async logout() {
        return this.execute(async () => {
            this.res.cookie("u", "", { maxAge: -1000 });
            this.res.cookie("p", "", { maxAge: -1000 });
            return true;
        });
    }
}

AdminAPI.allowedMethods = new Set([
    "me",
    "state",
    "roles",
    "noticeCreate",
    "noticeUpdate",
    "noticeWithdraw",
    "noticePublish",
    "mailSend",
    "mailUpdate",
    "mailWithdraw",
    "logout"
]);

module.exports = AdminAPI;
