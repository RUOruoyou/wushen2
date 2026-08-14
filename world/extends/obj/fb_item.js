// Shared constructors for persistent dungeon equipment and material resources.
// Reference equipment descriptions and properties come from the approved
// public-dungeon drop document; resource paths remain unchanged for saves.
const FB_EQUIPMENT_REFERENCE = globalThis.FB_EQUIPMENT_REFERENCE = {
    "灵蛇杖": { desc: "这是白驼山的灵蛇杖，一条毒蛇环绕其上，仿若活物", prop: { gj: 260, str: 32, zj: 210, mz: 192 } },
    "离火珠": { desc: "这是一颗在火山里面找到神奇珠子，通体发红，却又带有一丝丝凉意，带在身上使人神清气爽，精气十足", prop: { gj: 110, mz: 79, str: 20, dex: 20 } },
    "屠龙刀": { desc: "武林至尊，宝刀屠龙。号令天下，莫敢不从。倚天不出，谁与争锋！这就是武林至尊屠龙宝刀！", prop: { gj: 450, str: 65, con: 40, add_sh_per: 5, desc: "当攻击命中后有几率产生双倍伤害" } },
    "彼岸花": { desc: "传说中连接阴阳的彼岸花所制的项链", prop: { gj: 280, mz: 280, diff_fy_per: 5, mz_per: 5 } },
    "飞翼剑": { desc: "身无彩凤双飞翼，心有灵犀一点通", prop: { gj: 489, int: 60, lianxi_per: 15, desc: "使用后增加你的悟性和练习效率" } },
    "圣火令": { desc: "一块非金非木的牌子，坚硬异常", holeCount: 0, prop: { fy: 350, con: 30, max_hp: 2000 } },
    "韦一笑的逃命鞋": { desc: "明教青翼蝠王韦一笑的鞋子，不知道穿过没", prop: { fy: 220, dex: 35, ds: 160, ds_per: 1 } },
    "杨不悔的项链": { desc: "", prop: { con: 30, int: 35, dex: 35, per: 5 } },
    "倚天剑": { desc: "武林至尊，宝刀屠龙。号令天下，莫敢不从。倚天不出，谁与争锋！这就是号令天下的倚天剑", prop: { gj: 500, int: 60, add_sh_per: 6, bj_per: 4, desc: "攻击时有几率无视对方防御" } },
    "赵敏的戒指": { desc: "不知道是赵敏给张无忌的，还是张无忌准备给赵敏的", prop: { mz: 180, add_sh_per: 3, diff_fy_per: 3, distime_per: 3 } },
    "周芷若的手镯": { desc: "明教教主张无忌随身携带的峨眉派周芷若的手镯...", prop: { fy: 160, limit_mp: 2000, expend_mp_per: 10, con: 10 } },
    "冰魄银针": { desc: "古墓派的独门暗器", prop: { gj: 128, mz: 112, con: 12, diff_fy_per: 5 } },
    "金铃索": { desc: "这是一条白色的绸带，绸带末端系着一个金色的小球", prop: { gj: 230, mz: 130, diff_fy_per: 8, busy_per: 10 } },
    "龙骨环": { desc: "白色的龙骨做成的戒指，坚硬无比", prop: { gj: 278, mz: 198, bj_per: 6, releasetime: 1000 } },
    "盘龙簪": { desc: "古朴剔透，身似龙形", prop: { fy: 300, int: 150, con: 150, lianxi_per: 20 } },
    "东方不败的绣花针": { desc: "只是一根简单的绣花针，却使人感到剑气森森，不寒而栗", prop: { gj: 250, gjsd_per: 20, bj_per: 5, diff_fy_per: 10, skill: { pixiejian: 100, kuihuashengong: 100 } } },
    "贾布的护腰锁": { desc: "青龙堂堂主贾布的护腰锁", prop: { fy: 150, con: 20, max_hp: 2500 } },
    "上官云的披风": { desc: "白虎堂堂主上官云的披风，", prop: { fy: 98, ds: 90, diff_bj: 2 } },
    "童百熊的戒指": { desc: "风雷堂童百熊的戒指，做工粗犷，材质精良", prop: { gj: 98, mz: 80, bj_per: 2 } },
    "杨莲亭的项圈": { desc: "日月神教一人之下万人之上的杨莲亭的神秘项圈，不知道干什么用的", prop: { con: 20, dex: 21, distime_per: 5, per: 5 } },
    "天龙鞶": { desc: "不细看你还以为是一条龙", holeCount: 5, prop: { fy: 220, dex: 100, hp_per: 5, fy_per: 5, dazuo_per: 10 } },
    "玉箫": { desc: "东邪黄药师的玉箫", prop: { gj: 200, dex: 35, distime_per: 7, releasetime_per: 7 } },
    "玉竹杖": { desc: "一根泛着淡淡青光的竹杖，是历代丐帮帮主的信物。", holeCount: 0, prop: { gj: 310, dex: 30, ds: 290, zj: 290, diff_fy_per: 5 } },
    "金刚伏魔杖": { desc: "佛家神器", prop: { gj: 560, mz: 550, str: 82, add_sh_per: 6, zj_per: 7 } },
    "邪帝舍利": { desc: "传说中「邪极宗」一脉相传的黄色晶体，为历代魔门圣君於临死前，将毕生元精灌注其中，所以蕴含了数代魔君元精及元气", prop: { con: 100, dazuo_per: 13, limit_mp: 30000, desc: "可将其中蕴含的功力吸收转为己有" } },
    "天龙遗珠": { desc: "一颗颗细小的珠子组成的项链，据说是天龙的骨头磨成的，古朴晶莹", prop: { fy: 230, con: 78, mz_per: 5, distime: 1000, per: 5 } },
    "软猬甲": { desc: "是黄药师送给妻子冯氏的定情之物", prop: { fy: 250, dex: 22, diff_sh_per: 8, desc: "当你受到攻击后会反弹一部分伤害，冷却3秒" } },
    "龙骨舍利": { desc: "传说中天龙死亡后遗留的舍利", prop: { con: 80, int: 50, fy: 300, max_hp: 8000, diff_sh_per: 8 } },
    "逆鳞手环": { desc: "龙之逆鳞，触者杀之", prop: { fy: 200, gj: 200, mz: 200, diff_fy_per: 14 } },
    "天龙逐日靴": { desc: "天龙套装的靴子，穿上它可以追风逐日", prop: { fy: 380, ds: 200, dex: 50, ds_per: 5, diff_busy_per: 10 } },
    "碧磷针": { desc: "星宿老仙的独门暗器", prop: { gj: 98, mz: 67, dex: 10 } },
    "神木王鼎": { desc: "一个小小的木鼎，彤琢甚是精细，木质坚润似似玉，木理之中隐隐约约的泛出红丝。", prop: { lianyao1: 6, hp_per: 10, desc: "增加你的化功大法练习速度" } },
    "龙血斗篷": { desc: "一件黑乎乎的斗篷，据说是沾染的龙血，有些淡淡的微光，", prop: { fy: 398, ds_per: 10, zj_per: 10, diff_bj: 4, diff_sh: 500 } },
    "血刀": { desc: "血刀老祖的武器，刀身暗红，犹有血迹！", prop: { gj: 430, str: 65, mz: 400, add_sh_per: 5, desc: "当你攻击命中后吸取敌人鲜血强化自身" } },
    "阿朱的易容面具": { desc: "慕容家的丫鬟阿朱用来易容的面具", prop: { desc: "使用后你可以易容成当前房间的某一个人" } },
    "碧血照丹青": { desc: "剑长一尺七寸的墨绿色短剑，骤看似乎没有什么光泽，但若多看两眼，便会觉得剑气森森，逼人眉睫，连眼睛都难睁开。", prop: { gj: 480, mz: 150, mz_per: 10, diff_fy_per: 10, skill: { mingyugong: 100 } } },
    "花无缺的玉佩": { desc: "花无缺随身携带的玉佩，佩戴上潇洒异常", holeCount: 0, prop: { con: 30, lianxi_per: 15, diff_busy: 2000 } },
    "怜星的冰玉簪": { desc: "移花宫二宫主的冰玉簪，玲珑剔透毫无瑕疵", prop: { int: 20, lianxi_per: 10, distime: 1000 } },
    "邀月的手镯": { desc: "移花宫大宫主邀月的手镯", holeCount: 1, prop: { fy: 60, releasetime: 1000, expend_mp: 120 } },
    "移花宫履": { desc: "移花宫女弟子的装束，华丽而优雅", condition: { gender: 2 }, prop: { fy: 280, max_hp: 1480, ds: 220, dex: 20 } },
    "移花宫装": { desc: "移花宫女弟子的装束，华丽而优雅", condition: { gender: 2 }, prop: { fy: 300, max_hp: 1550, fy_per: 10, per: 5 } },
    "阴阳环": { desc: "一枚未知材质的指环，半黑半白，阴阳互衔", prop: { gj: 280, hp_per: 5, diff_fy_per: 5, diff_sh_per: 5 } },
    "火猊斗篷": { desc: "火红的火猊皮毛所制的斗篷，防风御寒", prop: { fy: 458, zj_per: 10, con: 40, add_sh_per: 5, diff_sh: 1000 } },
    "金狴骨冠": { desc: "似乎是金狴的头骨所制，看上去有些吓人", prop: { fy: 420, int: 50, distime_per: 10, expend_mp_per: 10, bj_per: 8 } },
    "魔龙战甲": { desc: "魔龙皮所制的甲胄，防御力惊人", prop: { fy: 550, fy_per: 10, str: 50, diff_sh_per: 10, diff_bj: 10 } },
    "木凤羽靴": { desc: "木凤的羽毛做的靴子，轻便耐用", prop: { fy: 480, ds: 400, dex: 50, ds_per: 10, diff_downside_per: 10 } }
};

const FB_ZHANSHEN_SET = new Set(["火猊斗篷", "金狴骨冠", "魔龙战甲", "木凤羽靴"]);

if (!CHARACTER.FB_EQUIPMENT_DAMAGE_BASE) {
    CHARACTER.FB_EQUIPMENT_DAMAGE_BASE = CHARACTER.prototype.damage;
    CHARACTER.prototype.damage = function (damage, from, diffFy, context) {
        const actual = CHARACTER.FB_EQUIPMENT_DAMAGE_BASE.call(this, damage, from, diffFy, context);
        const cloth = this.equipment && this.equipment[EQUIP_TYPE.CLOTH];
        if (actual > 0 && from && from.hp > 0 && cloth && cloth.name === "软猬甲"
            && !this.query_temp("fb/ruanweijia/reflect")) {
            this.set_temp("fb/ruanweijia/reflect", 1, 3000);
            from.damage2(Math.max(1, Math.floor(actual * 0.1)), this);
        }
        return actual;
    };
}

function attachFbEquipmentBehavior(item, name) {
    if (FB_ZHANSHEN_SET.has(name)) {
        item.group_name = "fb_zhanshendian_set";
        item.group_prop = function (count) {
            if (count === 4) return { gj_per: 10, mz_per: 10, zj_per: 10, ds_per: 10, fy_per: 10 };
        };
    }
    if (name === "倚天剑") {
        item.do_attack = function (me, target, context) {
            if (me.random(100) < 10) context.diff_fy = 100;
            return 0;
        };
    }
    if (name === "屠龙刀") {
        item.on_attack_over = function (me, target, context, damage) {
            if (damage > 0 && me.random(100) < 10 && target.damage2) target.damage2(damage, me);
        };
    }
    if (name === "血刀") {
        item.on_attack_over = function (me, target, context, damage) {
            if (damage > 0 && me.add_hp) me.add_hp(Math.max(1, Math.floor(damage * 0.05)));
        };
    }
}

globalThis.CREATE_FB_EQUIPMENT = function (item, config) {
    const reference = FB_EQUIPMENT_REFERENCE[config.name] || {};
    item.inherits(EQUIPMENT);
    item.set({
        name: reference.name || config.name,
        desc: reference.desc !== undefined ? reference.desc : (config.desc || ("副本中获得的" + config.name + "。")),
        unit: config.unit || "件",
        grade: config.grade,
        eq_type: reference.eqType || config.eqType,
        weapon_type: reference.weaponType || config.weaponType,
        value: config.value || 100000,
        hole_count: reference.holeCount ?? config.holeCount ?? 2,
        prop: { ...(reference.prop || config.prop || {}) }
    });
    if (reference.condition || config.condition) item.condition = { ...(reference.condition || config.condition) };
    if (config.stProp) item.st_prop = config.stProp;
    attachFbEquipmentBehavior(item, config.name);
};

globalThis.CREATE_FB_ITEM = function (item, config) {
    item.inherits(OBJ);
    item.set({
        name: config.name,
        desc: config.desc || ("副本中获得的" + config.name + "。"),
        unit: config.unit || "件",
        grade: config.grade ?? 1,
        value: config.value || 0,
        combined: config.combined ?? false,
        transable: config.transable ?? true
    });
    item.otype = config.otype ?? 3;
    if (config.prop) item.prop = { ...config.prop };
};
