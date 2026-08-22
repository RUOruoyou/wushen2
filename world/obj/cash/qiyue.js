this.inherits(OBJ);
this.set({
    unit: "张",
    name: "随从契约",
    desc: "在自己家使用后随机召唤一名江湖人士加入随从，不可指定；出现重复角色时，可以为家中的同名随从改名。",
    grade: 5,
    value: 0
});
this.on_use = function (me, par) {
    if (!me.is_player) return me.notify_fail("你不能使用随从契约。");
    if (!me.environment || !me.environment.parent || me.environment.parent.id != "home") return me.notify_fail("你只能在自己家使用随从契约。");
    var base = OBJ.CREATE("sp/npc");
    var npcs = base && base.npcs;
    if (!npcs) return me.notify_fail("契约暂时无法使用。");
    var max = me.query_temp("max_follower", 3);
    if (par) {
        var key = me.query_temp("qiyue_key");
        var path = key && npcs[key];
        if (!path) return me.notify_fail("这份召唤已经失效，请重新使用随从契约。");
        var npc = NPC.CLONE(path);
        var follower = FOLLOWER.GET(me, { id: par });
        if (!npc || !follower) return me.notify_fail("契约召唤失败，请重新使用随从契约。");
        for (var i = 0; i < me.follower.length; i++) {
            if (me.follower[i].path == npc.path && me.follower[i].id != par) {
                return me.notify_fail("你已经拥有" + npc.name + "了。");
            }
        }
        me.remove_temp("qiyue_key");
        var old_name = follower.name;
        FOLLOWER.REPLACE(me, follower, npc);
        follower.master_json = null;
        if (follower.actions) {
            for (var j = 0; j < follower.actions.length; j++) {
                follower.actions[j].name = follower.actions[j].name.replace(old_name, npc.name);
            }
        }
        me.notify("<him>恭喜你获得了" + npc.name + "的追随。</him>");
        return;
    }
    var keys = [];
    Object.keys(npcs).forEach(function (k) {
        if (NPC.CLONE(npcs[k])) keys.push(k);
    });
    if (!keys.length) return me.notify_fail("契约暂时无法使用。");
    // 随机召唤，不可指定。
    var rolled = keys[Math.floor(Math.random() * keys.length)];
    var npc = NPC.CLONE(npcs[rolled]);
    for (var i = 0; i < me.follower.length; i++) {
        if (me.follower[i].path == npc.path) {
            var dup = FOLLOWER.GET(me, me.follower[i]);
            me.notify("契约中浮现出" + npc.name + "的身影，但你的家中已经有一位" + npc.name + "了，契约定格了下来。");
            if (dup) {
                me.set_temp("qiyue_rename_id", dup.id);
                me.notify("作为补偿，你可以给这位" + npc.name + "改一个新的名字(打开聊天框任意频道输入)：");
                me.send_commands("clearwait", "取消改名");
                me.wait_input = rename_input;
            }
            return;
        }
    }
    if (me.follower && me.follower.length >= max) {
        // 满员：记录召唤结果，由玩家选择继承谁的属性。
        me.set_temp("qiyue_key", rolled);
        var str = ['{type:"cmds",items:['];
        for (var i = 0; i < me.follower.length; i++) {
            var follower = FOLLOWER.GET(me, me.follower[i]);
            if (!follower) return me.notify_fail("未能读取到你的追随者，请尝试重新进入住所。");
            if (str.length > 1) str.push(",");
            str.push('{cmd:"use ' + this.id + " " + follower.id + '",name:"继承' + follower.name + '的属性"}');
        }
        str.push("]}");
        me.notify("契约召唤出了" + npc.name + "，但你家的位置已经不多了，请选择如何安置：");
        me.send("<hir>会继承你选择的随从的经验，潜能，背包，装备。技能取两者的最高等级，进阶后的技能将保持等级不变</hir>");
        me.send(str.join(""));
        return false;
    }
    if (me.add_follower(npc)) {
        me.notify("<him>契约闪光过后，" + npc.name + "出现在你面前，恭喜你获得了" + npc.name + "的追随。</him>");
        me.environment.item_changed(FOLLOWER.GET(me, npc), true);
    } else {
        return me.notify_fail("召唤失败。");
    }
}
function rename_input(me, cmd) {
    if (cmd == "clearwait") {
        me.wait_input = null;
        me.remove_temp("qiyue_rename_id");
        return me.notify("取消改名。");
    }
    if (!cmd) return me.send("请说出新的名字(打开聊天框任意频道输入)：");
    var ss = cmd.split(' ');
    if (ss.length != 2) return me.notify("请说出新的名字(打开聊天框任意频道输入)：");
    var name = ss[1];
    var name_reg = /^[\u4E00-\u9FA5]{2,5}$/;
    if (!name_reg.test(name)) return me.send('随从的名字需要是2-5个中文字符');
    if (!UTIL.check_word(name)) return me.send('你不能用这个名字');
    var id = me.query_temp("qiyue_rename_id");
    var follower = id && FOLLOWER.GET(me, { id: id });
    if (!follower) {
        me.wait_input = null;
        me.remove_temp("qiyue_rename_id");
        return me.send('没有找到这名随从，改名失败。');
    }
    me.wait_input = null;
    me.remove_temp("qiyue_rename_id");
    var old_name = follower.name;
    follower.name = name;
    follower.color_name = null;
    follower.master_json = null;
    if (follower.actions) {
        for (var i = 0; i < follower.actions.length; i++) {
            follower.actions[i].name = follower.actions[i].name.replace(old_name, name);
        }
    }
    follower.environment && follower.environment.item_changed(follower, true);
    me.send("<him>" + old_name + "的名字已经改为：" + name + "。</him>");
    return false;
}
