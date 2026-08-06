
WORLD.on_startup = function () {
    init_fams();
    WORLD.COMMANDS.jh.init();
    if (WORLD.ADMIN_BRIDGE) WORLD.ADMIN_BRIDGE.start();
}

function init_fams() {
    for (let fam in FAMILIES) {
        FAMILIES[fam].init();
    }
}

WORLD.on_user_quit = function (user) {
    //在玩家退出游戏时调用
    if (WORLD.is_server(user)) {
        if (user.query_temp('pt')) {
            WORLD.COMMANDS['party'].on_user_login(user, false);//帮派初始化
        }
        WORLD.on_user_save(user);
    } else {
        if (user.query_temp('cross_type') == 'duizhan') {
            WORLD.PUB_USERS.push(user);
            user.disconnect_time = 0;
        }
    }
}
WORLD.on_user_save = function (user) {
    //在玩家退出游戏，或者游戏关闭时候调用

}


WORLD.on_heart_beat = function (now) {

}

// Recovery storage is optional in this distribution and must not interrupt gameplay.
if (typeof WORLD.add_recover_obj !== "function") {
    WORLD.add_recover_obj = function () {
        return false;
    }
}

const illegalUARegex = /node|python|java|curl|wget|postman|robot|spider|bot/i;
const Origins = [];
WORLD.check_connect = function (socket) {
    if (WORLD.SERVER.istest) return true;

    return true;
}

WORLD.close = async function () {
    if (this._closePromise) return this._closePromise;

    this._closePromise = (async () => {
        WORLD.status = -1;
        WORLD.is_closing = true;
        console.log('正在关闭服务器，等待在线角色完成存档');

        if (this.heart_beat_service) {
            clearInterval(this.heart_beat_service);
            this.heart_beat_service = null;
        }

        if (this.ADMIN_BRIDGE) await this.ADMIN_BRIDGE.close();

        if (this.LISTENER && this.LISTENER.tcpServer && this.LISTENER.tcpServer.listening) {
            await this.LISTENER.close();
        }
        console.log('关闭网络连接');

        for (let user of this.USERS) {
            if (!user.socket) continue;
            const socket = user.socket;
            user.socket = null;
            socket.user = null;
            socket.end();
        }

        if (await WORLD.save()) {
            await this.DB.close();
            console.log('关闭数据连接');
            return true;
        }
        return false;
    })();

    return this._closePromise;
}
