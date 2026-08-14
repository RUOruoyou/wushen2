const XIAKEDAO_SHANGSHAN_LAYERS = [
    { name: "第一层石室", skillId: "force", answers: ["force", "内功", "基本内功"] },
    { name: "第二层石室", skillId: "dodge", answers: ["dodge", "轻功", "基本轻功"] },
    { name: "第三层石室", skillId: "parry", answers: ["parry", "招架", "基本招架"] },
    { name: "第四层石室", skillId: "unarmed", answers: ["unarmed", "拳脚", "基本拳脚"] },
    { name: "第五层石室", skillId: "sword", answers: ["sword", "剑法", "基本剑法"] },
    { name: "第六层石室" }
];

ROOM.prototype.setup_xiakedao_shangshan_layer = function (layerIndex) {
    const layer = XIAKEDAO_SHANGSHAN_LAYERS[layerIndex];
    if (!layer) throw new Error("侠客岛赏善石室层数无效: " + layerIndex);
    const roomPath = index => "fb/xiakedao/shangshan" + (index > 0 ? index + 1 : "");
    this.name = layer.name;
    this.desc = layerIndex < 5
        ? "石壁上的诗句暗藏一项基本技能，答出后需以真实修习印证领悟。"
        : "最后一层石壁没有熟悉的武学痕迹，只有承认所知有限才能继续。";
    this.exits = {
        south: layerIndex === 0 ? "fb/xiakedao/entry" : roomPath(layerIndex - 1),
        north: layerIndex === 5 ? "fb/xiakedao/shangshan_boss" : roomPath(layerIndex + 1)
    };
    this.xiakeLayerIndex = layerIndex;
    this.query_xiake_layer = function (me) {
        return this.query_temp(me, "fb/xiakedao/shangshan/layer", 0) || 0;
    };
    this.query_xiake_skill_progress = function (me, skillId) {
        const skill = me.skills && me.skills[skillId];
        if (!skill) return null;
        return {
            id: skillId,
            layer: layerIndex,
            actorId: me.id === undefined || me.id === null ? "" : String(me.id),
            level: Number(skill.level) || 0,
            exp: Number(skill.exp) || 0
        };
    };
    this.on_leave = function (me, dir) {
        if (dir !== "north") return;
        if (this.query_temp(me, "fb/xiakedao/route", 0) !== "赏善") {
            me.notify("你没有选择赏善路线。");
            return false;
        }
        if (this.query_xiake_layer(me) <= layerIndex) {
            me.notify("当前石室尚未领悟，不能进入下一层。");
            return false;
        }
    };
    this.answer_xiake_poem = function (me, par) {
        if (this.query_temp(me, "fb/xiakedao/route", 0) !== "赏善") return me.notify("当前不是赏善路线。");
        const currentLayer = this.query_xiake_layer(me);
        if (currentLayer < layerIndex) return me.notify("请先完成前一层石室的领悟。");
        if (currentLayer > layerIndex) return me.notify("这一层石壁已经领悟完成。");
        const answer = String(par || "").trim();
        if (layerIndex < 5) {
            if (!answer) return me.notify("请回答本层对应的基本技能。");
            if (!layer.answers.includes(answer)) return me.notify("石壁没有回应，这不是当前一层的答案。");
            if (this.query_temp(me, "fb/xiakedao/shangshan/pending", 0)) return me.notify("请先印证已经识别的技能。");
            const progress = this.query_xiake_skill_progress(me, layer.skillId);
            if (!progress) return me.notify("你尚未掌握这一层对应的基本技能。");
            this.set_temp(me, "fb/xiakedao/shangshan/pending", progress);
            me.notify("答案正确。让对应的基本技能有所增长后，再来印证石壁领悟。");
            return;
        }
        if (answer !== "不知道") return me.notify("第六层石壁归于沉默，请先尝试领悟。");
        if (!this.query_temp(me, "fb/xiakedao/shangshan/sixth_failed", 0)) return me.notify("你还没有经历第六层的领悟失败。");
        this.set_temp(me, "fb/xiakedao/shangshan/layer", 6);
        this.grant_fb_milestone(me, "第六层", 15);
        me.notify("你坦然回答“不知道”，石壁终于向你敞开。");
    };
    this.add_action("answer", "回答诗句", function (me, par) {
        if (par) return this.answer_xiake_poem(me, par);
        return me.notify(layerIndex < 5 ? "请点击本层诗句对应的基本技能。" : "请先尝试领悟，再点击合适的回答。");
    });
    this.add_fb_click_choices("answer", [
        { id: "force", name: "回答：内功", value: "内功" },
        { id: "dodge", name: "回答：轻功", value: "轻功" },
        { id: "parry", name: "回答：招架", value: "招架" },
        { id: "unarmed", name: "回答：拳脚", value: "拳脚" },
        { id: "sword", name: "回答：剑法", value: "剑法" },
        { id: "unknown", name: "回答：不知道", value: "不知道" }
    ], this.answer_xiake_poem);
    this.add_action("understand", "领悟", function (me) {
        if (this.query_temp(me, "fb/xiakedao/route", 0) !== "赏善") return me.notify("当前不是赏善路线。");
        const currentLayer = this.query_xiake_layer(me);
        if (currentLayer < layerIndex) return me.notify("请先完成前一层石室的领悟。");
        if (currentLayer > layerIndex) return me.notify("这一层石壁已经领悟完成。");
        if (layerIndex < 5) {
            const pending = this.query_temp(me, "fb/xiakedao/shangshan/pending", 0);
            if (!pending || pending.layer !== layerIndex || pending.id !== layer.skillId) return me.notify("请先回答当前石壁诗句。");
            const actorId = me.id === undefined || me.id === null ? "" : String(me.id);
            if (pending.actorId !== actorId) return me.notify("这层石壁需要由刚才的答题者完成修习印证。");
            const progress = this.query_xiake_skill_progress(me, layer.skillId);
            if (!progress) return me.notify("你暂时无法印证这层基本技能。");
            const hasProgressed = progress.level > pending.level
                || (progress.level === pending.level && progress.exp > pending.exp);
            if (!hasProgressed) return me.notify("这项基本技能还没有新的领悟，请修习后再来印证。");
            this.set_temp(me, "fb/xiakedao/shangshan/pending", 0);
            this.set_temp(me, "fb/xiakedao/shangshan/layer", layerIndex + 1);
            if (layerIndex === 4) this.grant_fb_milestone(me, "问答", 50);
            me.notify("你领悟了第" + (layerIndex + 1) + "层基本技能。");
            return;
        }
        if (this.query_temp(me, "fb/xiakedao/shangshan/sixth_failed", 0)) return me.notify("请回答“不知道”完成第六层。");
        this.set_temp(me, "fb/xiakedao/shangshan/sixth_failed", 1);
        me.notify("第六层的领悟失败了。石壁问你所知为何，你应回答“不知道”。");
    });
};
