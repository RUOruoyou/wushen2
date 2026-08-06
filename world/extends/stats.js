

const STATS = WORLD.STATS;
STATS.isRankedPlayer = function (me) {
    if (!me) return false;
    if (WORLD.is_admin && WORLD.is_admin(me)) return false;
    if (WORLD.is_server && !WORLD.is_server(me)) return false;
    return true;
}
STATS.removeScoreById = function (ary, id) {
    if (!ary || !id) return false;
    let removed = false;
    for (let i = ary.length - 1; i >= 0; i--) {
        if (ary[i] && ary[i].id === id) {
            ary.splice(i, 1);
            removed = true;
        }
    }
    return removed;
}
STATS.removeEqByUser = function (id) {
    if (!id || !this.EQ_STATS) return false;
    let removed = false;
    for (let ary of this.EQ_STATS) {
        if (!ary) continue;
        for (let i = ary.length - 1; i >= 0; i--) {
            if (ary[i] && ary[i].user === id) {
                ary.splice(i, 1);
                removed = true;
            }
        }
    }
    return removed;
}
STATS.createDefaultTop = function (index, defname, key) {
    let npc = NPC.CLONE("pub/gaoshou1");
    npc.name = defname || "武林高手";
    npc.score = Math.max(1, 10 - index);
    npc.top_index = index + 1;
    npc.id = "top_" + (key || "") + "_" + index;
    return npc;
}
STATS.reindexTops = function (tops, key) {
    if (!tops) return;
    let top_key = key ? "top_fam" : "top";
    for (let i = 0; i < tops.length; i++) {
        let top = tops[i];
        if (!top) continue;
        top.top_index = i + 1;
        top.id = "top_" + (key || "") + "_" + i;
        let top_user = top.userid ? WORLD.getUser(top.userid) : null;
        if (top_user) {
            top_user.set_temp(top_key, i + 1);
            if (!key && WORLD.COMMANDS.biwu) {
                WORLD.COMMANDS.biwu.setStatsTitle(top_user, i);
            }
        }
    }
}
STATS.removeTopById = function (tops, id, defname, key) {
    if (!tops || !id) return false;
    let removed = false;
    for (let i = tops.length - 1; i >= 0; i--) {
        if (tops[i] && tops[i].userid === id) {
            tops.splice(i, 1);
            removed = true;
        }
    }
    if (!removed) return false;
    while (tops.length < 10) {
        tops.push(this.createDefaultTop(tops.length, defname, key));
    }
    this.reindexTops(tops, key);
    return true;
}
STATS.removePlayerStats = function (me) {
    let id = typeof me === "string" ? me : me && me.id;
    if (!id) return false;
    let removed = this.removeScoreById(this.SCORE, id);
    if (this.SC_STATS) {
        for (let key in this.SC_STATS) {
            if (this.removeScoreById(this.SC_STATS[key], id)) removed = true;
        }
    }
    if (this.removeEqByUser(id)) removed = true;
    if (this.removeTopById(this.TOPS, id, "武林高手", "")) removed = true;
    if (typeof FAMILIES !== "undefined") {
        for (let key in FAMILIES) {
            let tops = this["tops_" + key];
            if (tops && this.removeTopById(tops, id, FAMILIES[key].name + "弟子", key)) {
                removed = true;
            }
        }
    }
    if (me && typeof me !== "string") {
        me.remove_temp && me.remove_temp("top");
        me.remove_temp && me.remove_temp("top_sc");
        me.remove_temp && me.remove_temp("top_fam");
        me.remove_temp && me.remove_temp("top_fam_sc");
        me.add_title && me.add_title(null, "top");
    }
    return removed;
}
STATS.load_tops = function (tops, defname = '武林高手', key = "") {
    tops = tops ?? new Array(10).fill({ path: "pub/gaoshou1" });
    const ary = [];
    for (let i = 0; i < tops.length; i++) {
        let item = tops[i];
        let npc;
        npc = NPC.CLONE("pub/gaoshou1");
        npc.name = defname;
        if (item.userid) {
            this.loadTopUser(item, npc);
        } else {
            npc.score = 10 - i;
        }
        npc.top_index = i + 1;
        npc.id = "top_" + key + "_" + i;
        ary.push(npc);
    }
    return ary;
}

STATS.loadTopUser = function (data, npc) {
    npc.title = data.title;
    npc.name = data.name;
    for (let i = 0; i < COPY_PROPS.length; i++) {
        npc[COPY_PROPS[i]] = data[COPY_PROPS[i]];
    }
    npc.skills = data.skills;
    if (data.eq) {
        npc.equipment = [];
        for (let i = 0; i < data.eq.length; i++) {
            let item = data.eq[i];
            if (!item) continue;
            let obj = OBJ.CREATE(item[0]);
            if (!obj) continue;
            obj.load_db(item);
            npc.equipment[i] = obj;
        }
    }
    npc.userid = data.userid;
    npc.temp = data.temp;
    npc.clear_prop();
    npc.init();
    npc.recount();
}
STATS.checkStats = function (player) {
    if (!this.isRankedPlayer(player)) {
        this.removePlayerStats(player);
        return;
    }
    this.updateScore(player);
    WORLD.COMMANDS.biwu.checkStats(player);
}

const COPY_PROPS = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per"
    , "hp", "max_hp", "mp", 'age', 'score'];

STATS.saveTops = function (tops) {

    let str = ["["];
    for (let i = 0; i < tops.length; i++) {
        let top = tops[i];
        if (top.userid) {
            str.push("{userid:\"");
            str.push(top.userid);
            str.push("\",name:\"");
            str.push(top.name);
            str.push("\",title:\"");
            str.push(top.title);
            str.push("\"");
            for (let j = 0; j < COPY_PROPS.length; j++) {
                str.push(",");
                str.push(COPY_PROPS[j]);
                str.push(":");
                str.push(top[COPY_PROPS[j]]);
            }
            if (top.skills) {
                str.push(",skills:");
                str.push(JSON.stringify(top.skills));
            }
            if (top.equipment) {
                str.push(",eq:[");
                for (let j = 0; j < top.equipment.length; j++) {
                    if (j > 0) str.push(",");
                    if (top.equipment[j]) top.equipment[j].save_db(str);
                    else str.push("null");
                }
                str.push("]");
            }
            if (top.temp) {
                str.push(",temp:", JSON.stringify(top.temp));
            }

            str.push("}");

        } else {
            str.push('{ path: "pub/gaoshou1"}');
        }
        if (i !== this.TOPS.length - 1) str.push(",");
    }
    str.push("]");
    return str.join("");
}


STATS.saveWeapon = function () {

    return JSON.stringify(this.WEAPON);
}
STATS.saveScore = function () {
    return JSON.stringify(this.SCORE);
}
STATS.updateEqitem = function (me, wea, ary) {
    let score = wea.query_score();
    if (!score) return;
    let cur_index = -1;
    let new_index = -1;
    for (let i = ary.length - 1; i >= 0; i--) {
        let item = ary[i];
        if (item.user === me.id) {
            if (wea.id === item.id || score > item.score) {
                cur_index = i;
            } else {
                return;
            }
        }
        if (score > item.score) {
            new_index = i;
        }

    }
    if (cur_index === -1 && new_index === -1) return;

    if (cur_index === -1) {//新上榜的
        let item = {
            id: wea.id,
            user: me.id,
            score: score,
            name: me.name,
            desc: wea.get_desc(me),
            wname: wea.color_name
        };
        ary.splice(new_index, 0, item);
        if (ary.length > 15)
            ary.length = 15;
        return item;
    }

    let item = ary[cur_index];
    item.wname = wea.color_name;
    item.desc = wea.get_desc(me);
    item.id = wea.id;
    item.user = me.id;
    item.name = me.name;
    item.score = score;
    if (cur_index === new_index
        || new_index - cur_index === 1) {
        return item;
    }
    if (new_index === -1) {//掉出去，放最后
        ary.splice(cur_index, 1);
        ary.push(item);
    } else if (cur_index > new_index) { //提升了

        ary.splice(cur_index, 1);
        ary.splice(new_index, 0, item);
    } else {
        ary.splice(new_index, 0, item);
        ary.splice(cur_index, 1);
    }
}

STATS.updateWeapon = function (me, wea) {
    //if (wea.eq_type !== EQUIP_TYPE.WEAPON) return;
    if (!this.isRankedPlayer(me)) {
        this.removePlayerStats(me);
        return;
    }
    let eqs = this.EQ_STATS[wea.eq_type];
    this.updateEqitem(me, wea, eqs);

}
STATS.updateScoreItem = function (me, ary) {
    let score = me.score;
    let cur_index = -1;
    let new_index = -1;
    for (let i = ary.length - 1; i >= 0; i--) {
        let item = ary[i];
        if (item.id === me.id) {
            cur_index = i;
        }
        if (score > item.score) {
            new_index = i;
        }

    }
    if (cur_index === -1 && new_index === -1) return;

    if (cur_index === -1) {//新上榜的
        let item = { id: me.id, score: score, name: me.color_name || me.name };
        ary.splice(new_index, 0, item);
        if (ary.length > 30)
            ary.length = 30;
        return;
    }

    let item = ary[cur_index];
    item.score = score;

    item.name = me.color_name || me.name;
    if (cur_index === new_index
        || new_index - cur_index === 1) {
        return;
    }

    if (new_index === -1) {//掉出去，放最后
        ary.splice(cur_index, 1);
        ary.push(item);
    } else if (cur_index > new_index) { //提升了

        ary.splice(cur_index, 1);
        ary.splice(new_index, 0, item);
    } else {
        ary.splice(new_index, 0, item);
        ary.splice(cur_index, 1);
    }
}

STATS.updateScore = function (me) {
    if (!this.isRankedPlayer(me)) {
        this.removePlayerStats(me);
        return;
    }
    let ary = this.SCORE;
    this.updateScoreItem(me, ary);
    let fam = this.SC_STATS[me.family.id];
    if (!fam) return;
    this.updateScoreItem(me, fam);

}
