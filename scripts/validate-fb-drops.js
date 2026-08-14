"use strict";

// Static audit for persistent副本 drops. It deliberately does not execute
// world scripts: dynamic resource loading can mutate global state or require
// a running server. The audit is conservative and reports every unresolved
// path or forbidden skill reference for manual review.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const world = path.join(root, "world");
const areaDir = path.join(world, "area", "fb1");
const npcDir = path.join(world, "npc", "fb");
const baseSkills = new Set([
    "force", "dodge", "parry", "unarmed", "sword", "blade", "club",
    "staff", "whip", "throwing", "literate", "bite"
]);
const replacement = new Map([
    ["jinyangong", "yunlongshenfa"], ["kongmingquan", "canhezhi"],
    ["qingfushenfa", "sixiangbu"], ["qishangquan", "qianzhuwandushou"],
    ["lianhuazhang", "taishanquanfa"], ["feihuazhaiye", "songfengjianfa"],
    ["yihuajieyu", "xuanxubu"], ["mingyugong", "hanbingzhenqi"],
    ["pixiejian", "xuantiejianfa"], ["yingzhuagong", "baguaquan"],
    ["shenghuoling", "yunlongjian"], ["jiuyangshengong", "longxianggong"],
    ["qiankundanuoyi", "douzhuanxingyi"], ["xuedunbu", "chuanyunzong"],
    ["xuehaimogong", "huagongdafa"], ["xuedaodaofa", "hujiadaofa"],
    ["quanzhenjian", "songshanjianfa"]
]);
const newSkills = new Map([
    ["zhaixinggong", 2], ["feixingshu", 2], ["shenjianjue", 2], ["tiannanbu", 2],
    ["anyingfuxiang", 3], ["luoyingshenjian", 3], ["sanyinwugongzhao", 3], ["tianyuqijian", 3],
    ["shenghuoshengong", 3], ["duanjiajian", 3], ["yunvxinjing", 3], ["yinsuojinling", 3],
    ["tanzhishentong", 4], ["lingshezhangfa", 4], ["hamagong", 4], ["huagongdafa", 4],
    ["canhezhi", 4], ["kuihuashengong", 4], ["kumushengong", 4], ["yiyangzhi", 4],
    ["xuanxubu", 4], ["bianjianfa", 4], ["douzhuanxingyi", 5], ["bulaochangchungong", 5],
    ["liumaishenjian", 5], ["anranxiaohunzhang", 5], ["xuantiejianfa", 5], ["jiuyinshengong", 5],
    ["taixuangong", 5], ["wunianchangong", 5], ["rulaishenzhang", 5], ["lingxibu", 5],
    ["changshengjue", 6], ["cihangjiandian", 6], ["yinyangjiuzhuan", 6], ["zhanshentulu", 6]
]);
const expectedAreaSkills = new Map([
    ["fb21.js", ["yunlongshenfa", "biboshengong", "anyingfuxiang", "luoyingshenjian", "tanzhishentong", "canhezhi"]],
    ["fb22.js", ["lingshezhangfa", "chanchubufa", "hamagong"]],
    ["fb23.js", ["zhaixinggong", "feixingshu", "sanyinwugongzhao", "huagongdafa"]],
    ["fb24.js", ["sixiangbu", "qianzhuwandushou"]],
    ["fb25.js", ["taishanquanfa", "songfengjianfa", "xuanxubu", "hanbingzhenqi"]],
    ["fb26.js", ["canhezhi", "douzhuanxingyi"]],
    ["fb27.js", ["xuantiejianfa", "kuihuashengong"]],
    ["fb28.js", ["shenjianjue", "tianyuqijian", "bulaochangchungong"]],
    ["fb29.js", ["shenghuoshengong", "sixiangbu", "baguaquan", "yunlongjian", "longxianggong", "douzhuanxingyi"]],
    ["fb30.js", ["tiannanbu", "duanjiajian", "kumushengong", "liumaishenjian"]],
    ["fb31.js", ["chuanyunzong", "shenzhaojing", "huagongdafa", "hujiadaofa"]],
    ["fb32.js", ["yunvxinjing", "yinsuojinling", "anranxiaohunzhang", "xuantiejianfa"]],
    ["fb33.js", ["duanjiajian", "kumushengong", "tiannanbu", "yunlongshenfa", "songshanjianfa", "chanchubufa", "anyingfuxiang", "biboshengong", "luoyingshenjian", "hamagong", "lingshezhangfa", "tanzhishentong", "yiyangzhi", "jiuyinshengong"]],
    ["fb34.js", ["xuanxubu", "taixuangong"]],
    ["fb35.js", ["wunianchangong", "fumozhang", "rulaishenzhang", "changshengjue"]],
    ["fb36.js", ["bianjianfa", "lingxibu", "cihangjiandian"]],
    ["fb37.js", ["yinyangjiuzhuan"]],
    ["fb38.js", ["zhanshentulu"]]
]);

// Formal副本 equipment/material paths from the five-zone drop contract. These
// are kept explicit so a missing file cannot hide behind a dynamic drops list.
const expectedEquipment = new Map([
    ["eq/fb/taohuadao/yuxiao", [4, "WEAPON"]], ["eq/fb/taohuadao/ruanweijia", [4, "CLOTH"]],
    ["eq/fb/baituo/lingshezhang", [4, "WEAPON"]],
    ["eq/fb/xingxiu/bilinzheng", [3, "THROWING"]], ["eq/fb/xingxiu/shenmu_wangding", [4, "JEWELS"]],
    ["eq/fb/binghuo/lihuozhu", [4, "JEWELS"]], ["eq/fb/binghuo/tulongdao", [5, "WEAPON"]],
    ["eq/fb/yihuagong/lianxing_biyuzan", [3, "HEAD"]], ["eq/fb/yihuagong/yaoyue_shouhuan", [3, "WRIST"]],
    ["eq/fb/yihuagong/huawuque_yupei", [3, "JEWELS"]], ["eq/fb/yihuagong/yihuagongzhuang", [4, "CLOTH"]],
    ["eq/fb/yihuagong/yihuagonglv", [4, "SHOES"]], ["eq/fb/yihuagong/bixue_zhaodanqing", [5, "WEAPON"]],
    ["eq/fb/yanziwu/azhu_mianju", [4, "HEAD"]],
    ["eq/fb/heimuya/shangguanyun_pifeng", [3, "CAPE"]], ["eq/fb/heimuya/tongbaixiong_jiezhi", [3, "RING"]],
    ["eq/fb/heimuya/yanglianting_xiangquan", [3, "NECKLACE"]], ["eq/fb/heimuya/jiabu_yaodai", [3, "WAIST"]],
    ["eq/fb/heimuya/dongfang_xiuhuazhen", [4, "THROWING"]],
    ["eq/fb/piaomiaofeng/tianlong_yizhu", [5, "NECKLACE"]],
    ["eq/fb/guangmingding/shenghuoling", [4, "JEWELS"]], ["eq/fb/guangmingding/zhouzhiruo_shouhuan", [4, "WRIST"]],
    ["eq/fb/guangmingding/yangbuhui_xianglian", [4, "NECKLACE"]], ["eq/fb/guangmingding/zhaomin_jiezhi", [4, "RING"]],
    ["eq/fb/guangmingding/weiyixiao_taomingxie", [4, "SHOES"]], ["eq/fb/guangmingding/yitianjian", [5, "WEAPON"]],
    ["eq/fb/tianlongsi/longgu_sheli", [5, "JEWELS"]],
    ["eq/fb/xuedaomen/xuedao", [5, "WEAPON"]], ["eq/fb/xuedaomen/longxue_doupeng", [5, "CAPE"]],
    ["eq/fb/gumu/bingpo_yinzhen", [4, "THROWING"]], ["eq/fb/gumu/jinling_suo", [4, "WEAPON"]],
    ["eq/fb/gumu/panlongzan", [5, "HEAD"]], ["eq/fb/gumu/longgu_huan", [5, "RING"]],
    ["eq/fb/huashanlunjian/lingshezhang", [4, "WEAPON"]], ["eq/fb/huashanlunjian/yuxiao", [4, "WEAPON"]],
    ["eq/fb/huashanlunjian/yuzhuzhang", [4, "WEAPON"]], ["eq/fb/huashanlunjian/tianlong_pan", [5, "WAIST"]],
    ["eq/fb/xiakedao/tianlong_zhuri_xue", [5, "SHOES"]], ["eq/fb/xiakedao/nilin_shouhuan", [5, "WRIST"]],
    ["eq/fb/jingnian/xiedi_sheli", [5, "JEWELS"]], ["eq/fb/jingnian/jingang_fumozhang", [5, "WEAPON"]],
    ["eq/fb/cihang/feiyi_jian", [5, "WEAPON"]], ["eq/fb/cihang/bianan_hua", [5, "NECKLACE"]],
    ["eq/fb/yinyanggu/yinyang_huan", [5, "RING"]],
    ["eq/fb/zhanshendian/molong_zhanjia", [5, "CLOTH"]], ["eq/fb/zhanshendian/jinbi_guguan", [5, "HEAD"]],
    ["eq/fb/zhanshendian/mufeng_yuxue", [5, "SHOES"]], ["eq/fb/zhanshendian/huoni_doupeng", [5, "CAPE"]]
]);
const expectedMaterials = [
    "sp/fb/yinyanggu/pojun", "sp/fb/yinyanggu/tanlang", "sp/fb/yinyanggu/qisha", "sp/fb/yinyanggu/ziwei",
    "sp/fb/zhanshendian/shenqi_suipian", "sp/fb/yihuagong/biyu_xuelian", "drug/huoyan", "drug/age"
];
const diffOnlyDrops = new Map([
    ["fb24.js", ["eq/fb/binghuo/tulongdao"]],
    ["fb25.js", ["eq/fb/yihuagong/bixue_zhaodanqing"]],
    ["fb28.js", ["eq/fb/piaomiaofeng/tianlong_yizhu"]], ["fb30.js", ["eq/fb/tianlongsi/longgu_sheli"]],
    ["fb32.js", ["eq/fb/gumu/longgu_huan"]], ["fb36.js", ["eq/fb/cihang/bianan_hua"]]
]);
const normalOnlyDrops = new Map([
    ["fb32.js", ["eq/fb/gumu/panlongzan"]]
]);

function files(dir) {
    if (!fs.existsSync(dir)) return [];
    const result = [];
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) result.push(...files(full));
        else if (name.endsWith(".js")) result.push(full);
    }
    return result;
}

function readAll(dir) {
    return files(dir).map(file => ({ file, source: fs.readFileSync(file, "utf8") }));
}

function collectForbiddenSkills() {
    const forbidden = new Set();
    for (const { source } of readAll(path.join(world, "family"))) {
        for (const match of source.matchAll(/\[\s*["']([a-z][a-z0-9_]*)["']\s*,\s*\d+/g)) {
            const id = match[1];
            if (!baseSkills.has(id)) forbidden.add(id);
        }
    }
    for (const { file, source } of readAll(path.join(world, "npc"))) {
        // Only formal family NPCs count toward the player门派 set. Ordinary
        // world/fb NPCs may intentionally use a public skill with the same
        // name and must not make every副本 drop fail the audit.
        if (!/family\s*:\s*FAMILIES\.[A-Z0-9_]+/.test(source)) continue;
        for (const match of source.matchAll(/skill_map\(([\s\S]*?)\);/g)) {
            for (const skill of match[1].matchAll(/\[\s*["']([a-z][a-z0-9_]*)["']\s*,\s*\d+/g)) {
                if (!baseSkills.has(skill[1])) forbidden.add(skill[1]);
            }
        }
    }
    return forbidden;
}

function collectKnownResources() {
    const known = new Set(baseSkills);
    for (const { source } of readAll(path.join(world, "skill"))) {
        for (const match of source.matchAll(/this\.id\s*=\s*["']([a-z][a-z0-9_]*)["']/g)) known.add(match[1]);
        for (const match of source.matchAll(/\bid\s*:\s*["']([a-z][a-z0-9_]*)["']/g)) known.add(match[1]);
    }
    return known;
}

function collectSkillGrades() {
    const grades = new Map();
    for (const { source } of readAll(path.join(world, "skill"))) {
        const helper = source.match(/\bid\s*:\s*["']([a-z][a-z0-9_]*)["'][\s\S]*?\bgrade\s*:\s*(\d+)/);
        const regular = source.match(/this\.id\s*=\s*["']([a-z][a-z0-9_]*)["'][\s\S]*?this\.grade\s*=\s*(\d+)/);
        const match = helper || regular;
        if (match) grades.set(match[1], Number(match[2]));
    }
    return grades;
}

function collectDropRefs() {
    const refs = [];
    for (const entry of [...readAll(areaDir), ...readAll(npcDir)]) {
        for (const match of entry.source.matchAll(/(?:book\/bc#|book\/book#)([a-z][a-z0-9_]*)/g)) {
            refs.push({ file: path.relative(root, entry.file), id: match[1] });
        }
        for (const match of entry.source.matchAll(/(?:obj\s*:\s*["']|this\.drops\s*=\s*\[[^\]]*["'])([^"']+)/g)) {
            const value = match[1];
            if (value.includes("/")) refs.push({ file: path.relative(root, entry.file), path: value });
        }
        // query_drops commonly uses an array-valued obj field. Restrict this
        // secondary scan to persisted resource namespaces to avoid treating
        // room and NPC IDs as drop paths.
        for (const match of entry.source.matchAll(/["']((?:eq|sp|st|res|drug|money|book)\/[^"']+)["']/g)) {
            refs.push({ file: path.relative(root, entry.file), path: match[1] });
        }
    }
    return refs;
}

const forbidden = collectForbiddenSkills();
const known = collectKnownResources();
const grades = collectSkillGrades();
const knownObjectPaths = new Set(files(path.join(world, "obj")).map(file => path.relative(path.join(world, "obj"), file).replace(/\.js$/, "")));
const errors = [];
const warnings = [];
for (const ref of collectDropRefs()) {
    if (ref.id) {
        if (!known.has(ref.id)) errors.push(`${ref.file}: 掉落武学资源不存在 ${ref.id}`);
        if (forbidden.has(ref.id)) {
            const approved = replacement.get(ref.id);
            errors.push(`${ref.file}: 掉落包含门派武学 ${ref.id}${approved ? `，应替换为 ${approved}` : ""}`);
        }
    }
    if (ref.path) {
        const basePath = ref.path.split("#", 1)[0];
        if (!knownObjectPaths.has(basePath)) errors.push(`${ref.file}: 掉落对象资源不存在 ${ref.path}`);
    }
}
for (const id of ["douzhuanxingyi", "xuanxubu", "canhezhi", "huagongdafa", "xuantiejianfa", "longxianggong", "yunlongjian", "baguaquan"]) {
    if (!known.has(id)) warnings.push(`批准替换资源尚未创建：${id}`);
}
for (const [id, expectedGrade] of newSkills) {
    if (!known.has(id)) errors.push(`计划武学资源尚未创建：${id}`);
    else if (grades.get(id) !== expectedGrade) errors.push(`计划武学 ${id} 品质为 ${grades.get(id) ?? "未知"}，应为 ${expectedGrade}`);
    if (forbidden.has(id)) errors.push(`计划武学 ${id} 被识别为门派武学，不能进入副本掉落`);
}
for (const [fileName, expectedIds] of expectedAreaSkills) {
    const source = fs.readFileSync(path.join(areaDir, fileName), "utf8");
    const block = source.match(/this\.drops\s*=\s*\[([\s\S]*?)\];/);
    const actual = new Set([...(block ? block[1] : "").matchAll(/book\/bc#([a-z][a-z0-9_]*)/g)].map(match => match[1]));
    const expectedSet = new Set(expectedIds);
    const missing = expectedIds.filter(id => !actual.has(id));
    const extra = [...actual].filter(id => !expectedSet.has(id));
    if (missing.length) errors.push(`${fileName}: 可见掉落缺少计划武学 ${missing.join(",")}`);
    if (extra.length) errors.push(`${fileName}: 可见掉落包含计划外武学 ${extra.join(",")}`);
}

function resourceSource(resourcePath) {
    const file = path.join(world, "obj", resourcePath + ".js");
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file, "utf8");
}

for (const [resourcePath, [grade, eqType]] of expectedEquipment) {
    const source = resourceSource(resourcePath);
    if (!source) {
        errors.push(`计划装备资源尚未创建：${resourcePath}`);
        continue;
    }
    if (!new RegExp(`grade\\s*:\\s*${grade}`).test(source)) errors.push(`${resourcePath}: 品质应为 ${grade}`);
    if (!new RegExp(`eqType\\s*:\\s*EQUIP_TYPE\\.${eqType}`).test(source)) errors.push(`${resourcePath}: 装备类型应为 ${eqType}`);
    if (!/value\s*:\s*\d+/.test(source) || !/holeCount\s*:\s*\d+/.test(source) || !/prop\s*:\s*\{/.test(source)) {
        errors.push(`${resourcePath}: 缺少 value/holeCount/prop 正式字段`);
    }
}
for (const resourcePath of expectedMaterials) {
    const source = resourceSource(resourcePath);
    if (!source) {
        errors.push(`计划材料资源尚未创建：${resourcePath}`);
    } else if (!/CREATE_FB_ITEM\s*\(/.test(source) && !/this\.inherits\(OBJ\)/.test(source)) {
        errors.push(`${resourcePath}: 不是可创建的普通材料资源`);
    } else if (!/grade\s*[:=]\s*\d+/.test(source) || !/value\s*[:=]\s*\d+/.test(source)) {
        errors.push(`${resourcePath}: 缺少 grade/value 字段`);
    }
}
for (const [fileName, paths] of diffOnlyDrops) {
    const source = fs.readFileSync(path.join(areaDir, fileName), "utf8");
    const queryStart = source.indexOf("this.query_drops");
    const diffStart = source.indexOf("if (isdiff)", queryStart);
    if (queryStart < 0 || diffStart < 0) {
        errors.push(`${fileName}: 困难专属掉落未按 isdiff 分支定义`);
        continue;
    }
    const beforeDiff = source.slice(queryStart, diffStart);
    for (const resourcePath of paths) {
        if (!source.includes(resourcePath)) errors.push(`${fileName}: 缺少掉落 ${resourcePath}`);
        if (beforeDiff.includes(resourcePath)) errors.push(`${fileName}: 困难专属掉落 ${resourcePath} 串入普通表`);
    }
}
for (const [fileName, paths] of normalOnlyDrops) {
    const source = fs.readFileSync(path.join(areaDir, fileName), "utf8");
    const queryStart = source.indexOf("this.query_drops");
    const diffStart = source.indexOf("if (isdiff)", queryStart);
    const elseStart = source.indexOf("else", diffStart);
    if (queryStart < 0 || diffStart < 0 || elseStart < 0) {
        errors.push(`${fileName}: 普通专属掉落未按 isdiff/else 分支定义`);
        continue;
    }
    const beforeElse = source.slice(queryStart, elseStart);
    for (const resourcePath of paths) {
        if (!source.includes(resourcePath)) errors.push(`${fileName}: 缺少掉落 ${resourcePath}`);
        if (beforeElse.includes(resourcePath)) errors.push(`${fileName}: 普通专属掉落 ${resourcePath} 串入困难表`);
    }
}

console.log(`门派禁止武学 ${forbidden.size} 项，已知武学 ${known.size} 项，计划新武学 ${newSkills.size} 项，扫描副本/NPC 掉落 ${collectDropRefs().length} 条。`);
for (const warning of warnings) console.warn("警告：" + warning);
if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    console.log("副本掉落静态审计通过：未发现未知或门派武学残页引用。");
}
