"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const areaSource = fs.readFileSync(path.join(root, "world", "extends", "map", "area.js"), "utf8");
function loadAreaExtension() {
    function Area() {}
    Area.FBS = [];
    const context = { AREA: Area, WORLD: {}, UTIL: {}, console: { error() {} } };
    vm.runInNewContext(areaSource, context, { filename: "world/extends/map/area.js" });
    return context.AREA;
}

function createCharacter(temp) {
    return {
        query_temp(key, fallback) { return temp[key] === undefined ? fallback : temp[key]; },
        set_temp(key, value) { temp[key] = value; },
        remove_temp(key) { delete temp[key]; }
    };
}

function migrate(initial) {
    const Area = loadAreaExtension();
    Area.FBS = Array.from({ length: 38 }, (_, displayIndex) => {
        const area = new Area();
        area.id = displayIndex === 37 ? "lcj" : "fb" + displayIndex;
        area.fb_index = displayIndex;
        area.record_index = displayIndex === 37 ? 16 : (displayIndex >= 19 ? displayIndex + 1 : displayIndex);
        return area;
    });
    const temp = { ...initial };
    const me = createCharacter(temp);
    Area.ensure_record_indexes(me);
    return temp;
}

const errors = [];
function expect(label, actual, expected) {
    if (actual !== expected) errors.push(`${label}: 期望 ${expected}，实际 ${actual}`);
}

// 未到旧末段：解锁值和已完成的普通扫荡保持原语义。
let temp = migrate({ fb: 10, fb_sao0: 11 });
expect("fb<19 解锁值", temp.fb, 10);
expect("fb<19 记录10普通扫荡", temp.fb_sao10, 1);
expect("fb<19 未误开记录11", temp.fb_sao11, undefined);

// 已解锁旧连城诀：清除连城诀状态，新主线从桃花岛开始。
temp = migrate({ fb: 19, fb_sao0: 17, fb_sao1: 18 });
expect("fb==19 主线解锁值", temp.fb, 19);
expect("旧泰山困难扫荡", temp.fb_sao17, 2);
expect("旧嵩山困难扫荡", temp.fb_sao18, 2);
expect("旧连城诀未提前开启", temp.fb_sao16, undefined);
expect("新桃花岛未继承旧扫荡", temp.fb_sao20, undefined);

// 已通关旧连城诀：完成次数和扫荡资格清零，不提前开放新增副本。
temp = migrate({ fb: 20, fb_sao0: 20, fb_sao1: 20, fb_sao16: 2, fbc_0_16: 4, fbc_1_16: 2, fbc_2_16: 1, fb_sao17: 2 });
expect("fb>=20 主线解锁值", temp.fb, 19);
expect("连城诀普通完成清零", temp.fbc_0_16, undefined);
expect("连城诀困难完成清零", temp.fbc_1_16, undefined);
expect("连城诀组队完成清零", temp.fbc_2_16, undefined);
expect("连城诀扫荡资格清零", temp.fb_sao16, undefined);
expect("旧末段困难扫荡", temp.fb_sao19, 2);
expect("已有更高扫荡等级保留", temp.fb_sao17, 2);

// 已被 v2 错误放开的角色按连续通关记录纠偏，越级记录保留但不解锁前置副本。
temp = migrate({ fb: 37, fb_record_index_v2: 1, fbc_0_16: 1, fb_sao16: 1, fbc_0_30: 1 });
expect("v2 越级角色回到桃花岛", temp.fb, 19);
expect("v2 连城诀完成清零", temp.fbc_0_16, undefined);
expect("v2 连城诀扫荡清零", temp.fb_sao16, undefined);
expect("血刀门越级记录保留", temp.fbc_0_30, 1);

// 连续完成桃花岛、白驼山后，只解锁到星宿海。
temp = migrate({ fb: 37, fb_record_index_v2: 1, fbc_0_20: 1, fbc_2_21: 1, fbc_0_30: 1 });
expect("连续通关恢复正确主线", temp.fb, 21);
expect("非连续血刀门记录不抬高主线", temp.fbc_0_30, 1);

// 即使已有天龙寺、血刀门越级记录，光明顶未通关时仍不能进入血刀门。
const missingGuangmingding = { fb: 37, fb_record_index_v2: 1, fbc_0_29: 1, fbc_0_30: 1 };
for (let recordIndex = 20; recordIndex <= 27; recordIndex++) missingGuangmingding["fbc_0_" + recordIndex] = 1;
temp = migrate(missingGuangmingding);
expect("光明顶未通关时主线停在光明顶", temp.fb, 27);
const UnlockArea = loadAreaExtension();
const xuedaomen = new UnlockArea();
xuedaomen.fb_index = 29;
expect("光明顶未通关时血刀门锁定", xuedaomen.is_unlock(createCharacter(temp)), false);

// 连续完成至天龙寺后才解锁血刀门。
const completedTianlongsi = { fb: 37, fb_record_index_v2: 1 };
for (let recordIndex = 20; recordIndex <= 29; recordIndex++) completedTianlongsi["fbc_0_" + recordIndex] = 1;
temp = migrate(completedTianlongsi);
expect("天龙寺通关后主线到血刀门", temp.fb, 29);
expect("天龙寺通关后血刀门解锁", xuedaomen.is_unlock(createCharacter(temp)), true);

// 完成全部新增副本后解锁连城诀，但连城诀仍视为未通关。
const allNewCompletions = { fb: 38, fb_record_index_v2: 1, fbc_0_16: 1, fb_sao16: 2 };
for (let recordIndex = 20; recordIndex <= 37; recordIndex++) allNewCompletions["fbc_0_" + recordIndex] = 1;
temp = migrate(allNewCompletions);
expect("全部新增副本连续完成", temp.fb, 37);
expect("最终连城诀完成清零", temp.fbc_0_16, undefined);
expect("最终连城诀扫荡清零", temp.fb_sao16, undefined);

const snapshot = JSON.stringify(temp);
const me = createCharacter(temp);
const Area = loadAreaExtension();
Area.FBS = [{ record_index: 16, query_record_index() { return this.record_index; } }];
Area.ensure_record_indexes(me);
expect("迁移标记幂等", JSON.stringify(temp), snapshot);

if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    console.log("副本解锁迁移校验通过：连城诀状态清零、连续进度重算、越级纠偏及幂等场景均符合预期。");
}
