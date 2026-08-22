this.inherits(COMMAND);
this.command = "relation";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.enter = function (me, arg) {

    var str = ['{"type":"dialog","dialog":"relation"'];
    if (me.query_temp("shifu")) {
        var shifu = WORLD.getUser(me.query_temp("shifu"));
        str.push(",shifu:\"");
        if (shifu) {
            str.push(shifu.color_name);
        } else {
            str.push(me.query_temp("shifu_n"));
        }
        str.push("\"");
        if (shifu) {
            str.push(",sid:\"");
            str.push(shifu.id);
            str.push("\"");
        }
    } else if (me.query_temp("tudi")) {
        var tudi = WORLD.getUser(me.query_temp("tudi"));
        str.push(",tudi:\"");
        if (tudi) {
            str.push(tudi.color_name);

        } else {
            str.push(me.query_temp("tudi_n"));
        }
        str.push("\",st:");
        str.push(me.query_temp("st_count", 0));
        if (tudi) {
            str.push(",tid:\"");
            str.push(tudi.id);
            str.push("\"");
            var lv = tudi.level ? tudi.level : 1;
            if (lv < 3) {
                str.push(",reward:\"你的徒弟境界提升到");
                str.push(["<wht>武士</wht>", "<hig>武师</hig>", "<hiy>宗师</hiy>"][lv]);
                str.push("后，你将获得一个");
                str.push(["<hig>精铁宝箱</hig>", "<hic>白银宝箱</hic>", "<hiy>黄金宝箱</hiy>"][lv]);
                str.push("\"");
            }
        }
    }
    if (me.query_temp("st_leave")) {
        var time = new Date(me.temp["st_leave"].e) - Date.now();
        str.push(",reward:\"你需要");
        str.push(parseInt(time / 3600000));
        str.push("小时");
        str.push(parseInt((time % 3600000) / 60000));
        str.push("分后才可以另行收徒或拜师\"");
    }
    if (me.query_temp("husband")) {
        var husband = null;// WORLD.getUser(me.query_temp("husband"));
        str.push(",husband:\"");
        if (husband) {
            str.push(husband.color_name);
        } else {
            str.push(me.query_temp("husband_n"));
        }
        str.push("\"");
    } else if (me.query_temp("wife")) {
        var wife = null;// WORLD.getUser(me.query_temp("wife"));
        str.push(",wife:\"");
        if (wife) {
            str.push(wife.color_name);
        } else {
            str.push(me.query_temp("wife_n"));
        }
        str.push("\"");
    }
    if (me.follower) {
        str.push(",fls:[");
        let now = Date.now();
        for (let item of me.follower) {
            let follower = FOLLOWER.GET(me, item);
            if (follower) {
                str.push('["', follower.long_name(), '","', follower.id, '"');
                // 家族成员的岗位状态以家族数据为准，旧实时工作状态仅作回退。
                let title = null;
                let since = 0;
                if (typeof HOUSEHOLD !== "undefined" && HOUSEHOLD.memberStateInfo) {
                    let info = HOUSEHOLD.memberStateInfo(me, follower.id);
                    if (info) {
                        title = String(info.title || "").replace(/中$/, "");
                        since = now - info.since;
                    }
                }
                if (!title && follower.state) {
                    title = follower.state.title;
                    since = now - follower.state.stime;
                }
                if (title) {
                    str.push(',"', title, '",', Math.max(0, since));
                }
                str.push('],');
            }
        }
        str.push("0]");
    }


    str.push("}");
    me.send(str.join(""));
}