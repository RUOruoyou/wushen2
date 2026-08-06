# 武器系统说明

本文记录当前武器系统的主要规则，便于后续维护普通武器、锻造武器、品质和属性逻辑。

## 核心对象

- 装备基类在 `os/item/equipment.js`，武器也是装备的一种。
- 武器槽位由 `EQUIP_TYPE.WEAPON` 表示，定义在 `os/const.js`。
- 武器类型由 `weapon_type` 决定，当前包括：
  - `sword`：剑
  - `blade`：刀
  - `club`：棍
  - `staff`：杖
  - `whip`：鞭
  - `unarmed`：拳套/空手类
  - `throwing`：暗器类，但暗器使用独立槽位 `EQUIP_TYPE.THROWING`

## 普通武器

普通武器是写在 `world/obj/eq/**` 下的静态装备定义。

普通武器常见字段：

- `name`：武器名称。
- `desc`：武器说明。
- `unit`：量词。
- `grade`：品质。未显式设置时走装备默认值 `0`。
- `eq_type`：装备槽位，普通武器为 `EQUIP_TYPE.WEAPON`。
- `weapon_type`：武器类型，影响可用的攻击技能。
- `value`：价值。
- `hole_count`：可镶嵌孔数，部分高阶武器有。
- `prop`：实际加到角色身上的属性表。

当前普通武器使用到的 `prop`：

| 属性 | 含义 | 说明 |
| --- | --- | --- |
| `gj` | 攻击 | 所有普通武器都有 |
| `str` | 臂力 | 部分刀、棍、杖、剑有 |
| `dex` | 身法 | 部分短剑、钓棍有 |
| `int` | 悟性 | 部分剑有 |
| `mz` | 命中 | 部分鞭、棍、剑有 |
| `zj` | 招架 | 部分棍、杖有 |
| `add_sh_per` | 最终伤害百分比 | 少数高阶剑有 |
| `busy` | 忙乱时间 | 当前普通武器里黑龙鞭使用 |
| `gjsd` | 攻击速度修正 | 当前普通武器里神龙杖使用，注意可能为负值 |

普通武器示例：

| 路径 | 名称 | 类型 | 品质 | 属性 |
| --- | --- | --- | --- | --- |
| `eq/lv0/jian` | 铁剑 | `sword` | `0` | `{ gj: 1 }` |
| `eq/lv1/dandao` | 黑虎单刀 | `blade` | `1` | `{ gj: 20, str: 3 }` |
| `eq/lv1/wd_jian` | 武当长剑 | `sword` | `1` | `{ gj: 15, int: 3 }` |
| `eq/lv2/ao_bishou` | 鳌拜匕首 | `sword` | `2` | `{ gj: 30, dex: 5, add_sh_per: 2 }` |
| `eq/lv2/hl_bian` | 黑龙鞭 | `whip` | `2` | `{ gj: 30, mz: 13, busy: 500 }` |
| `eq/lv2/sl_zhang` | 神龙杖 | `staff` | `2` | `{ gj: 50, str: 12, zj: 20, gjsd: -200 }` |
| `eq/lv2/lm_jian` | 龙纹剑 | `sword` | `3` | `{ gj: 80, int: 10, add_sh_per: 2 }` |

## 锻造武器

锻造武器是动态生成的自制武器，当前由 `world/cmd/obj/duanzao.js` 创建，装备对象为 `world/obj/eq/cp.js`。

和普通武器相比，锻造武器的区别：

- 来源不同：普通武器来自静态文件；锻造武器由 `duanzao` 命令消耗材料生成。
- 名称不同：普通武器名称固定；锻造武器支持玩家输入 2-5 个汉字命名。
- 类型不同：锻造时可选择剑、刀、棍、杖、鞭、拳套。
- 属性来源不同：普通武器的 `prop` 写死在装备文件里；锻造武器通过 `duanzao.default_template()` 从 `temp` 属性重建。
- 品质不同：当前锻造武器默认 `grade: 5`，即传说品质。
- 存档不同：锻造武器除路径、ID、精炼、宝石外，还依赖 `temp` 保存自定义名称、类型和扩展属性。
- 分解不同：锻造武器走 `eq/cp` 分解分支，会根据 `temp` 中的锻造属性返还属性晶石和元晶。

当前锻造武器默认模板：

- 路径：`eq/cp#类型`
- 默认品质：`grade: 5`
- 默认孔数：`hole_count: 2`
- 默认属性：`gj: 120`
- 默认材料：锻造时消耗 `10` 个 `st/yuanjing`

## 武器品质

武器品质由装备对象的 `grade` 字段决定。

品质不是动态评分计算出来的，而是由装备文件或锻造模板直接赋值：

- 普通武器：通常在 `world/obj/eq/**` 文件中直接设置 `grade`。
- 未设置 `grade` 的普通武器：使用 `EQUIPMENT` 默认值 `0`。
- 锻造武器：当前 `eq/cp.js` 默认设置为 `grade: 5`。
- 精炼不会改变品质，只改变 `level`、属性倍率和名字前缀。
- 镶嵌不会改变品质，只增加 `st_prop` 宝石属性。

品质映射：

| grade | 品质 |
| --- | --- |
| `0` | 普通 |
| `1` | 精良 |
| `2` | 高级 |
| `3` | 稀有 |
| `4` | 绝世 |
| `5` | 传说 |
| `6` | 神器 |

显示颜色由 `os/item/obj.js` 中的 `grade_color` 映射决定：

| grade | 颜色标记 |
| --- | --- |
| `0` | `wht` |
| `1` | `hig` |
| `2` | `hic` |
| `3` | `hiy` |
| `4` | `HIZ` |
| `5` | `hio` |
| `6` | `ord` |

## 属性生效流程

武器属性不会直接改角色面板，而是先进入角色的 `prop` 汇总表：

1. 玩家执行 `eq 武器ID`。
2. `world/cmd/obj/equip.js` 做战斗状态和技能释放状态检查。
3. `os/char/chara_equip.js` 调用 `obj.eq(this)`。
4. `os/item/equipment.js` 通过 `change_prop()` 把武器 `prop` 和宝石 `st_prop` 加到角色。
5. 角色执行 `recount()`，将 `query_prop()` 读到的属性换算成最终攻击、防御、命中、躲闪、招架、攻速等面板值。

玩家重算公式主要在 `world/extends/char/user.js`。

## 精炼和镶嵌

精炼：

- 命令：`jinglian`
- 文件：`world/cmd/obj/jinglian.js`
- 最高等级：`+12`
- 成长数据：`EQUIPMENT.prototype.levelData`
- 普通品质装备使用玄晶。
- `grade == 6` 的神器使用元晶。
- 取消精炼后返还对应精炼材料。

镶嵌：

- 命令：`xiangqian`
- 文件：`world/cmd/obj/xiangqian.js`
- 装备必须有 `hole_count`。
- 宝石属性保存到装备的 `st_prop`。
- 装备/卸装时，宝石属性跟基础属性一起加减。

## 维护注意

- 新增普通武器时，优先明确 `grade`、`weapon_type`、`prop`、`hole_count`。
- 新增武器属性前，要确认 `os/const.js` 的 `PROPERTIES` 有中文名称，并确认 `recount()` 或战斗逻辑会读取该属性。
- 新增装备槽位时，必须同步服务端 `EQUIP_TYPE`、装备说明 `parts`、前端背包槽位显示。
- 锻造武器的动态属性应写入 `temp`，并由 `duanzao.default_template()` 重建 `prop`，不要只改运行时 `prop`。
- 精炼只应调整 `level` 派生属性，不应改变 `grade`。
