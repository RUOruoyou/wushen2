const CIHANG_QIKU_NAMES = ["生", "老", "病", "死", "爱别离", "怨憎会", "求不得"];

ROOM.prototype.setup_cihang_qiku_gate = function (gateIndex) {
    if (!Number.isInteger(gateIndex) || gateIndex < 0 || gateIndex >= CIHANG_QIKU_NAMES.length) {
        throw new Error("慈航七苦门层数无效: " + gateIndex);
    }
    const gatePath = index => "fb/cihang/qikumenu" + (index > 0 ? index + 1 : "");
    this.name = "第" + (gateIndex + 1) + "重苦门";
    this.desc = "门上字迹随副本实例变化。查看门序并通过当前门，方可继续北行。";
    this.exits = {
        south: gateIndex === 0 ? "fb/cihang/entry" : gatePath(gateIndex - 1),
        north: gateIndex === 6 ? "fb/cihang/fenlu" : gatePath(gateIndex + 1)
    };
    this.cihangGateIndex = gateIndex;
    this.ensure_cihang_qiku_order = function (me) {
        let order = this.query_temp(me, "fb/cihang/qiku_order", 0);
        if (Array.isArray(order) && order.length === CIHANG_QIKU_NAMES.length) return order;
        order = CIHANG_QIKU_NAMES.slice();
        for (let index = order.length - 1; index > 0; index--) {
            const randomIndex = Math.max(0, Math.min(index, Number(me.random(index + 1)) || 0));
            const value = order[index];
            order[index] = order[randomIndex];
            order[randomIndex] = value;
        }
        this.set_temp(me, "fb/cihang/qiku_order", order);
        this.set_temp(me, "fb/cihang/qiku_index", 0);
        return order;
    };
    this.on_enter = function (me) {
        const route = this.query_temp(me, "fb/cihang/route", 0);
        if (!route) return me.notify("请先在入口选择慈航路线。");
        const order = this.ensure_cihang_qiku_order(me);
        this.name = order[gateIndex] + "门";
        this.desc = "这是本实例第" + (gateIndex + 1) + "重“" + order[gateIndex] + "”门。";
    };
    this.add_action("view_order", "查看七苦门", function (me) {
        const route = this.query_temp(me, "fb/cihang/route", 0);
        if (!route) return me.notify("请先在入口选择慈航路线。");
        const order = this.ensure_cihang_qiku_order(me);
        const index = this.query_temp(me, "fb/cihang/qiku_index", 0) || 0;
        me.notify("本实例七苦门顺序：" + order.join("、") + "。当前已通过" + index + "重。");
    });
    this.pass_cihang_gate = function (me, par) {
        const route = this.query_temp(me, "fb/cihang/route", 0);
        if (!route) return me.notify("请先在入口选择慈航路线。");
        const order = this.ensure_cihang_qiku_order(me);
        const index = this.query_temp(me, "fb/cihang/qiku_index", 0) || 0;
        if (index < gateIndex) return me.notify("前一重苦门尚未通过。");
        if (index > gateIndex) return me.notify("这一重苦门已经通过。");
        const answer = String(par || "").trim();
        if (answer !== order[gateIndex]) return me.notify("门名不合，当前苦门将你挡了回来。进度没有变化。");
        const nextIndex = gateIndex + 1;
        this.set_temp(me, "fb/cihang/qiku_index", nextIndex);
        if (nextIndex < order.length) return me.notify("你通过了“" + answer + "”门，还剩" + (order.length - nextIndex) + "重。");
        this.set_temp(me, "fb/cihang/qiku_done", 1);
        this.grant_fb_milestone(me, "七苦门", route === "剑魔" || route === "魔师" ? 15 : 20);
        me.notify("七苦门全部通过，前方出现左右两条山路。");
    };
    this.add_action("pass_gate", "通过七苦", function (me, par) {
        if (par) return this.pass_cihang_gate(me, par);
        const order = this.ensure_cihang_qiku_order(me);
        return me.notify("当前是“" + order[gateIndex] + "”门，请点击对应门名通过。");
    });
    this.add_fb_click_choices("pass_gate", CIHANG_QIKU_NAMES.map(function (name, index) {
        return { id: "gate" + (index + 1), name: "通过“" + name + "”门", value: name };
    }), this.pass_cihang_gate);
    this.on_leave = function (me, dir) {
        if (dir !== "north") return;
        if (!this.query_temp(me, "fb/cihang/route", 0)) {
            me.notify("请先在入口选择慈航路线。");
            return false;
        }
        if ((this.query_temp(me, "fb/cihang/qiku_index", 0) || 0) <= gateIndex) {
            me.notify("当前苦门尚未通过。");
            return false;
        }
    };
};
