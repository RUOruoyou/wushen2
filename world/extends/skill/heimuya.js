if (!SKILL.FB_HEIMUYA_TANGSHI_HOOK) {
    SKILL.FB_HEIMUYA_TANGSHI_HOOK = true;
    const previousSkillUpdate = SKILL.prototype.update;
    SKILL.prototype.update = function (fname) {
        const result = previousSkillUpdate.call(this, fname);
        if (this.id !== "tangshijianfa" || !this.pfm || !this.pfm.wu || this.pfm.wu.fbHeimuyaWrapped) return result;
        const perform = this.pfm.wu;
        const previousUse = perform.use;
        perform.fbHeimuyaWrapped = true;
        perform.use = function (me, target, lv) {
            if (!me || typeof me.end_fight !== "function") return previousUse.call(this, me, target, lv);
            const hadOwnEndFight = Object.prototype.hasOwnProperty.call(me, "end_fight");
            const originalEndFight = me.end_fight;
            let didFakeDeath = false;
            me.end_fight = function () {
                didFakeDeath = true;
                return originalEndFight.apply(this, arguments);
            };
            let useResult;
            try {
                useResult = previousUse.call(this, me, target, lv);
            } finally {
                if (hadOwnEndFight) me.end_fight = originalEndFight;
                else delete me.end_fight;
            }
            if (!didFakeDeath) return useResult;
            const room = me.environment;
            if (!room || !room.is_fb || !room.is_fb() || !room.parent || room.parent.id !== "heimuya"
                || !room.query_fb_state || !room.query_temp || !room.set_temp) return useResult;
            const state = room.query_fb_state(me);
            if (!state || !state.milestones["杨莲亭二"] || state.milestones["东方不败"]
                || room.query_temp(me, "fb/heimuya/yang2_suppressed", 0)) return useResult;
            room.set_temp(me, "fb/heimuya/yang2_suppressed", 1);
            me.notify("你以躺尸骗过杨莲亭，他已无法再次替东方不败挡刀。");
            return useResult;
        };
        return result;
    };
}
