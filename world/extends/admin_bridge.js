const ADMIN_HTTP = UTIL.require("http");
const ADMIN_FS = UTIL.require("fs");
const ADMIN_CRYPTO_BRIDGE = UTIL.require("crypto");
const ADMIN_SOCKET_PATH = __CONFIG.ADMIN_SOCKET_PATH;
const ADMIN_BODY_LIMIT = 256 * 1024;

function getBridgeToken() {
    return ADMIN_CRYPTO_BRIDGE.createHash("sha256")
        .update(__CONFIG.SESSION_SECRET + "|" + ADMIN_SOCKET_PATH)
        .digest("hex");
}

function isBridgeTokenValid(value) {
    const expected = Buffer.from(getBridgeToken(), "utf8");
    const actual = Buffer.from(String(value || ""), "utf8");
    return expected.length === actual.length && ADMIN_CRYPTO_BRIDGE.timingSafeEqual(expected, actual);
}

function readAdminBody(request) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        request.on("data", (chunk) => {
            size += chunk.length;
            if (size > ADMIN_BODY_LIMIT) {
                reject(new Error("管理请求内容过大"));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on("end", () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
            } catch (error) {
                reject(new Error("管理请求格式错误"));
            }
        });
        request.on("error", reject);
    });
}

function sendAdminResponse(response, status, body) {
    response.statusCode = status;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(body));
}

function getAdminState() {
    return {
        notices: WORLD.MESSAGE.getAdminNotices(),
        campaigns: WORLD.MESSAGE.getAdminCampaigns(),
        attachmentCatalog: WORLD.MESSAGE.getAdminAttachmentCatalog(),
        server: {
            id: WORLD.SERVERID,
            name: WORLD.SERVER && WORLD.SERVER.name,
            online: WORLD.CONNECT_COUNT
        }
    };
}

async function executeAdminAction(action, data, actor) {
    let item;
    let affectedUserIds = [];
    let shouldSave = true;
    let shouldBroadcastNotices = false;
    let shouldAnnounceNotice = false;
    switch (action) {
        case "state":
            shouldSave = false;
            break;
        case "notice.create":
            item = WORLD.MESSAGE.createAdminNotice(data, actor);
            shouldBroadcastNotices = true;
            shouldAnnounceNotice = true;
            break;
        case "notice.update":
            item = WORLD.MESSAGE.updateAdminNotice(data, actor);
            shouldBroadcastNotices = true;
            break;
        case "notice.withdraw":
            item = WORLD.MESSAGE.withdrawAdminNotice(data.id, actor);
            shouldBroadcastNotices = true;
            break;
        case "notice.publish":
            item = WORLD.MESSAGE.publishAdminNotice(data.id, actor);
            shouldBroadcastNotices = true;
            shouldAnnounceNotice = true;
            break;
        case "mail.send": {
            const result = await WORLD.MESSAGE.sendAdminMail(data, actor);
            item = result.item;
            affectedUserIds = result.affectedUserIds;
            break;
        }
        case "mail.update": {
            const result = WORLD.MESSAGE.updateAdminMail(data, actor);
            item = result.item;
            affectedUserIds = result.affectedUserIds;
            break;
        }
        case "mail.withdraw": {
            const result = WORLD.MESSAGE.withdrawAdminMail(data.id, actor);
            item = result.item;
            affectedUserIds = result.affectedUserIds;
            break;
        }
        default:
            throw new Error("未知的管理操作");
    }

    if (shouldSave) {
        await WORLD.DATA.save();
        if (shouldBroadcastNotices) {
            WORLD.MESSAGE.broadcastAdminNotices(item, shouldAnnounceNotice);
        }
        if (affectedUserIds.length) WORLD.MESSAGE.refreshAdminMailboxes(affectedUserIds);
        WORLD.log(null, "admin." + action, (actor && actor.name || "unknown") + " 完成内容管理操作");
    }
    return { item: item, state: getAdminState() };
}

WORLD.ADMIN_BRIDGE = {
    server: null,
    operationQueue: Promise.resolve(),

    run: function (action, data, actor) {
        if (action === "state") return executeAdminAction(action, data, actor);
        const operation = this.operationQueue.catch(() => null)
            .then(() => executeAdminAction(action, data, actor));
        this.operationQueue = operation;
        return operation;
    },

    handle: async function (request, response) {
        if (request.method !== "POST" || request.url !== "/admin") {
            return sendAdminResponse(response, 404, { ok: false, error: "Not Found" });
        }
        if (!isBridgeTokenValid(request.headers["x-admin-bridge-token"])) {
            return sendAdminResponse(response, 403, { ok: false, error: "管理通道认证失败" });
        }
        if (WORLD.is_closing) {
            return sendAdminResponse(response, 503, { ok: false, error: "游戏服务正在关闭" });
        }
        try {
            const body = await readAdminBody(request);
            const result = await this.run(body.action, body.data || {}, body.actor || null);
            sendAdminResponse(response, 200, { ok: true, result: result });
        } catch (error) {
            sendAdminResponse(response, 400, { ok: false, error: error.message || "管理操作失败" });
        }
    },

    start: function () {
        if (this.server && this.server.listening) return;
        try {
            if (ADMIN_FS.existsSync(ADMIN_SOCKET_PATH)) ADMIN_FS.unlinkSync(ADMIN_SOCKET_PATH);
        } catch (error) {
            console.error("清理管理通道失败:", error.message);
        }
        this.server = ADMIN_HTTP.createServer(this.handle.bind(this));
        this.server.on("error", (error) => console.error("管理通道错误:", error.message));
        this.server.listen(ADMIN_SOCKET_PATH, () => {
            try {
                ADMIN_FS.chmodSync(ADMIN_SOCKET_PATH, 0o600);
            } catch (error) {
                console.error("设置管理通道权限失败:", error.message);
            }
            console.log("管理员内容通道已启动");
        });
    },

    close: function () {
        return new Promise((resolve) => {
            if (!this.server || !this.server.listening) return resolve();
            this.server.close(() => {
                try {
                    if (ADMIN_FS.existsSync(ADMIN_SOCKET_PATH)) ADMIN_FS.unlinkSync(ADMIN_SOCKET_PATH);
                } catch (error) {
                    console.error("清理管理通道失败:", error.message);
                }
                resolve();
            });
        });
    }
};
