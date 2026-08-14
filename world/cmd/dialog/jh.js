
this.inherits(COMMAND);
this.command = "jh";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.fbs_json = null;
this.fbs = [];
this.regex = /^(\w+)?\s?(lock|\d+)?(?:\s(start[1|2|3]?))?$/;
function fb_count_desc(me, fb, count) {
    var desc = count ? "，该模式累计完成" + count + "次" : "";
    return desc + "，本副本今日" + fb.query_daily_fb_count(me) + "/" + fb.fb_daily_limit;
}
function fb_expend_desc(me, fb, can_sweep) {
    var desc = "，本次副本需要消耗" + fb.expend + "点精力。";
    if (can_sweep && WORLD.is_admin && WORLD.is_admin(me)) {
        desc = "，进入副本需要消耗" + fb.expend + "点精力；管理员扫荡不消耗精力。";
    }
    return desc + "\n当前精力：" + me.query_jingli();
}
this.enter = function (me, type, arg, isstart) {
    if (!me.is_player) return;
    var unlock2 = me.query_temp("fb2", 0);
    var is_admin = !!(WORLD.is_admin && WORLD.is_admin(me));
    if (!this.map_json) {
        this.map_json = this.getAllMaps();
    }
    AREA.ensure_record_indexes(me);
    var unlock = me.query_temp("fb", 0);
    if (is_admin && this.fbs && this.fbs.length) {
        unlock = this.fbs.length - 1;
    }
    if (arg == "lock")
        return me.send(`{type:"dialog",dialog:"jh",unlock:${unlock},unlock2:${unlock2}}`);
    if (!arg && !type) {
        me.send(this.map_json);
        me.send(`{type:"dialog",dialog:"jh",unlock:${unlock},unlock2:${unlock2}}`);
    } else {

        if (type === "mj") {
            const task = TASK.GET("duanjianzhong");
            if (!task) return me.notify("秘境暂未开放。");
            if (!isstart) return this.return_mijingdesc(me, parseInt(arg));
            if (isstart !== "start") return me.notify("断剑冢操作无效。");
            return task.enter(me);
        }

        var index = parseInt(arg);
        if (!isstart) {
            if (type == "fb") return this.return_fbdesc(me, index);
            if (type == "fam") return this.return_famdesc(me, index);
            else return this.return_areadesc(me, index);
        } else {
            if (me.check_command({
                allow_busy: false, allow_state: false,
                allow_die: false, allow_faint: false,
                allow_fight: false
            }) == false) return;

            if (type == "fb") {
                var fb = this.fbs[index];
                if (!fb || !fb.id) return me.notify("没有这个副本。");
                const recordIndex = fb.query_record_index();
                if (fb.is_lock) {
                    return me.notify("暂未开放，正在修复");
                }
                if (!is_admin) {
                    if (fb.unlock_index) {
                        if (fb.unlock_index > unlock) {
                            return me.notify("你需要完成" + this.fbs[fb.unlock_index - 1].name + "才能解锁" + fb.name + "。");
                        }
                    } else if (index > unlock) {
                        return me.notify(fb.name + "尚未解锁。");
                    }
                }
                if (!me.environment) return me.notify("你不知道在哪。");
                if (me.environment.is_fb()) return me.notify("你现在正在副本区域。");

                if (fb.start_room && !me.is_in(fb.start_room))
                    return me.notify('你要进入哪个副本？');
                if (isstart == "start1") {
                    //  if (me.team) return me.notify("你目前处于队伍当中，无法进入单人副本。");
                    var count = me.query_temp("fbc_0_" + recordIndex, 0);
                    me.notify("即将进入副本(" + fb.name + ")区域" + fb_count_desc(me, fb, count)
                        + fb_expend_desc(me, fb, true));
                    let can_sd = is_admin;
                    can_sd = can_sd || me.query_temp('fb_sao' + recordIndex, 0) >= 1;
                    if (can_sd) {
                        return me.send_commands('cr ' + fb.id, "进入副本", "cr " + fb.id + " 0 1", "扫荡一次",
                            "cr " + fb.id + " 0 10", "扫荡十次");
                    } else {
                        return me.send_commands('cr ' + fb.id, "进入副本");
                    }
                } else if (isstart == "start2") {
                    //   if (me.team) return me.notify("你目前处于队伍当中，无法进入单人副本。");
                    let count = me.query_temp("fbc_1_" + recordIndex, 0);
                    me.notify("即将进入副本(" + fb.name + ")<hir>困难区域</hir>" + fb_count_desc(me, fb, count)
                        + fb_expend_desc(me, fb, true));
                    let can_sd = is_admin;
                    can_sd = can_sd || me.query_temp('fb_sao' + recordIndex, 0) >= 2;
                    if (can_sd) {
                        return me.send_commands('cr ' + fb.id + " 1 0", "进入副本", "cr " + fb.id + " 1 1",
                            "扫荡一次", "cr " + fb.id + " 1 10", "扫荡十次");
                    } else {
                        return me.send_commands('cr ' + fb.id + " 1 0", "进入副本");
                    }

                } else if (isstart == "start3") {
                    if (!me.team) return me.notify("你目前没有在队伍当中，无法进入组队副本。");
                    for (var i = 0; i < me.team.length; i++) {
                        var tm = me.team[i];
                        if (tm.environment && tm.environment.is_fb() &&
                            tm.environment.parent != fb) {
                            return me.notify(tm.name + "现在正在副本【" + tm.environment.parent.name + "】区域，无法开启其它副本。");
                        }
                    }


                    var count = me.query_temp("fbc_2_" + recordIndex, 0);
                    me.send("即将组队进入副本(" + fb.name + ")区域" + fb_count_desc(me, fb, count)
                        + "，本次副本需要消耗" + fb.expend + "点精力。\n当前精力：" + me.query_jingli() + "/100");
                    return me.send_commands('cr ' + fb.id + " 2 0", "进入副本");

                }

            } else if (type === 'ar') {
                if (!me.can_trans()) return;
                let fb = this.areas[index];
                if (!fb || !fb.id) return me.notify("没有这个禁地区域。");
                if (!(fb.jd_index >= 0)) return me.notify("没有这个禁地区域。");
                if (fb.is_lock) return me.notify("暂未开放，正在修复");
                let diff = 0;
                if (me.team) diff = 2;
                if (!me.isenable_area(fb)) return me.notify("未解锁区域");

                if (fb.is_copy && !fb.not_fb) {//禁地类型的副本
                    this.enter_ar_fb(me, fb, diff);
                } else {
                    if (fb.on_enter(me) == false) {
                        return;
                    }
                    me.moveto(fb.first, me.name + "走了。", me.name + "来了。");
                }
            } else {
                if (!me.can_trans()) return;
                let fb = this.families[index];
                if (!fb || !fb.first) return me.notify("没有这个门派。");
                if (fb.on_enter(me) == false) {
                    return;
                }
                me.moveto(ROOM.Get(fb.first), me.name + "走了。", me.name + "来了。");
            }
            me.send('{type:"dialog",dialog:"jh",close:true}');

        }


    }

}

this.enter_ar_fb = function (me, fb, diff = 0) {
    const recordIndex = fb.query_record_index();
    var count =
        me.query_temp(fb.count_key ?? ("fbc_0_" + recordIndex), 0);

    me.notify("即将进入禁地副本(" + fb.name + ")区域" + fb_count_desc(me, fb, count)
        + "，本次副本需要消耗<hic>" + fb.expend
        + "</hic>点精力。\n当前精力：" + me.query_jingli());
    let can_sd = me.query_temp('fb_sao' + recordIndex, 0) === 1;

    if (can_sd) {
        let sd_diff = diff;
        if (sd_diff === 2) sd_diff = 0;
        return me.send_commands('cr ' + fb.id + " " + diff + " 0",
            "进入副本", "cr " + fb.id + " " + sd_diff + " 1",
            "扫荡一次", "cr " + fb.id + " " + sd_diff + " 10", "扫荡十次");
    } else {
        return me.send_commands('cr ' + fb.id + " " + diff + " 0",
            "进入副本");
    }
}

this.return_famdesc = function (me, index) {

    if (!(index >= 0 && index < this.families.length)) return me.notify("没有这个门派。");
    var fb = this.families[index];
    if (!fb) return me.notify("没有这个门派。");
    if (fb.json) return me.send(fb.json);
    var obj = {};
    obj.type = "dialog";
    obj.dialog = "jh";
    obj.index = index;
    obj.ref = fb.no_cache ? 0 : 1;
    obj.desc = fb.query_desc();
    obj.actions = fb.query_actions(me);
    obj.sp = fb.sp;
    obj.t = "fam";

    if (fb.family) {
        var fam = FAMILIES[fb.family];
        if (fam) {
            fb.skills = fam.skills;
            fb.skills2 = fam.skills2;
            fb.skills4 = fam.skills4;
        }
    }
    var skills = [];
    if (fb.skills) {
        for (var i = 0; i < fb.skills.length; i++) {
            skills.push({
                id: fb.skills[i].id,
                name: fb.skills[i].name,
                color_name: fb.skills[i].color_name,
                grade: fb.skills[i].grade
            });
        }
    }

    if (skills.length) obj.skills = skills;
    fb.json = JSON.stringify(obj);
    me.send(fb.json);
}

this.return_areadesc = function (me, index) {
    if (!(index >= 0 && index < this.areas.length)) return me.notify("没有这个副本。");
    var fb = this.areas[index];
    if (!fb) return me.notify("没有这个区域。");
    if (fb.json) return me.send(fb.json);

    var obj = {};
    obj.type = "dialog";
    obj.dialog = "jh";
    obj.t = "ar";
    obj.index = index;
    obj.desc = fb.desc;
    obj.actions = fb.query_actions(me);
    // if (fb.is_copy && !fb.not_fb)
    //     obj.status = this.fb_status(fb);

    obj.reward = "";
    obj.drops = this.fb_drops(fb);
    fb.json = JSON.stringify(obj);
    me.send(fb.json);
}

this.return_fbdesc = function (me, index) {
    if (!(index >= 0 && index < this.fbs.length)) return me.notify("没有这个副本。");
    var fb = this.fbs[index];
    if (!fb) return me.notify("没有这个副本。");
    if (fb.json) return me.send(fb.json);;
    var obj = {};
    obj.type = "dialog";
    obj.dialog = "jh";
    obj.t = "fb";
    obj.index = index;
    obj.desc = fb.desc;

    obj.status = this.fb_status(fb);
    var str = [];
    var exp = fb.query_exp();
    var pot = fb.query_pot ? fb.query_pot() : exp;
    str.push("获得");
    str.push(exp);
    str.push("点经验，");
    str.push(pot);
    str.push("点潜能");
    obj.reward = str.join("");
    obj.drops = this.fb_drops(fb);
    obj.diffs = [1, fb.is_diffi ? 1 : 0, fb.is_multi ? 1 : 0];
    fb.json = JSON.stringify(obj);
    me.send(fb.json);
}
this.return_mijingdesc = function (me, index) {
    if (!(index >= 0 && index < this.mijings.length)) return me.notify("没有这个秘境。");
    const area = this.mijings[index];
    if (!area) return me.notify("没有这个秘境。");
    const task = TASK.GET("duanjianzhong");
    if (!task) return me.notify("秘境暂未开放。");
    const obj = {
        type: "dialog",
        dialog: "jh",
        t: "mj",
        index: index,
        desc: area.desc,
        drops: [
            { name: "潜能", color_name: "潜能", grade: 2 },
            { name: "经验", color_name: "经验", grade: 2 }
        ],
        status: task.query_status(me),
        actions: [
            ["jh mj " + index + " start", "进入秘境", "消耗1枚归墟种，不消耗精力。"]
        ]
    };
    me.send(JSON.stringify(obj));
};
this.fb_drops = function (fb) {
    var json = [];
    var drops = fb.drops || [];
    fb.drop_items = [];
    for (var i = 0; i < drops.length; i++) {
        var oitem = OBJ.CREATE(drops[i]);
        if (oitem) {
            var drop_index = fb.drop_items.length;
            json.push({
                index: drop_index,
                name: oitem.name,
                color_name: oitem.color_name,
                grade: oitem.grade || 0,
                cmd: "look3 " + drop_index + " of fb_" + fb.area_index
            });
            fb.drop_items.push(oitem);
        }
    }
    return json;
}

this.fb_status = function (fb) {
    let status = [];
    let fblock = fb.query_record_index() + 1;
    let fb_key = "fb_first_" + fblock + "_0";
    let ss_0 = WORLD.DATA.query_temp(fb_key);
    if (ss_0) {
        status[0] = [1, ss_0];
    } else {
        status[0] = [0, fb.is_diffi ? "" : fb.ss_title];
    }
    if (fb.is_diffi) {
        fb_key = "fb_first_" + fblock + "_1";
        ss_0 = WORLD.DATA.query_temp(fb_key);
        if (ss_0) {
            status[1] = [1, ss_0];
        } else {
            status[1] = [0, fb.ss_title ?? ""];
        }
    } else {
        status[1] = null;
    }
    if (fb.is_multi) {
        fb_key = "fb_first_" + fblock + "_2";
        ss_0 = WORLD.DATA.query_temp(fb_key);
        if (ss_0) {
            status[2] = [1, ss_0];
        } else {
            status[2] = [0, ""];
        }
    }
    return status;
}

this.init = function () {

    this.map_json = this.getAllMaps();
}

this.getAllMaps = function (me) {
    var map = {};
    map.type = "dialog";
    map.dialog = "jh";
    map.fbs = [];
    map.families = [];
    map.areas = [];
    map.mijings = [];

    this.fbs = [];
    this.families = [];
    this.areas = [];
    this.mijings = [];
    for (var i = 0; i < WORLD.AREAS.length; i++) {
        var area = WORLD.AREAS[i];
        area.area_index = i;
        if (AREAS[area.id] >= 0) {
            let index = AREAS[area.id];
            map.families[index] = area.name;
            this.families[index] = area;
            // AREAS[area.id] = area;
        } else if (FBS[area.id] >= 0) {
            area.fb_index = FBS[area.id];
            map.fbs[area.fb_index] = area.name;
            this.fbs[area.fb_index] = area;
            FB_AREAS[area.id] = area;
        } else if (JDS[area.id] >= 0) {
            let index = JDS[area.id];
            area.jd_index = index;

            this.areas[index] = area;
            map.areas[index] = area.name;
        } else if (area.mijing) {
            area.mijing_index = this.mijings.length;
            this.mijings.push(area);
            map.mijings.push(area.name);
        }
    }
    AREA.FBS = this.fbs;
    return JSON.stringify(map);
}

AREA.Get_FB = function (id) {
    return FB_AREAS[id];
}
this.get_area = function (id) {
    if (!this.areas) this.getAllMaps();
    let index = AREAS[id];
    if (index >= 0) {
        return this.areas[index];
    }
    return null;
}

const AREAS = {
    yz: 0, wudang: 1, shaolin: 2, huashan: 3, emei: 4,
    xiaoyao: 5, quanzhen: 6, gaibang: 7, shashou: 8, xuedao: 9,
    mingjiao: 10, riyue: 11, yihua: 12, xiangyang: 13, wudao: 14
};
const FBS = {
    "lw": 0, "cuifu": 1, "lmw": 2, "lcy": 3,
    "by": 4, "zhuang": 5, "ao": 6, "tdh": 7,
    "shenlong": 8, "guanwai": 9, "longmai": 10,
    "wenfu": 11, "wudu": 12, "hengshan": 13, "qingcheng": 14, "hengshan2": 15,
    "taishan": 16, "songshan": 17, "yunmeng": 18,
    "taohuadao": 19, "baituo": 20, "xingxiu": 21, "binghuo": 22,
    "yihuagong": 23, "yanziwu": 24, "heimuya": 25, "piaomiaofeng": 26,
    "guangmingding": 27, "tianlongsi": 28, "xuedaomen": 29, "gumu": 30,
    "huashanlunjian": 31, "xiakedao": 32, "jingnian": 33, "cihang": 34,
    "yinyanggu": 35, "zhanshendian": 36, "lcj": 37
}
const FB_AREAS = {};
const JDS = {
    heiying: 0,

    // gmp: 4,
    // gumen: 5,
    // gzc: 6,
    // gysd: 7,
    // yzjd: 8
};
