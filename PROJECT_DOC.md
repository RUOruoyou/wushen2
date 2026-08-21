# wsmud2 项目说明文档

本文档基于当前仓库代码结构整理，目标是让维护者能快速理解项目定位、运行方式、前后端边界、游戏引擎机制、数据存储、部署方式和常见修改入口。

## 1. 项目定位

wsmud2 是一个 Node.js 版 Web MUD 项目，仓库内同时包含：

- Web 静态/API 服务：`web.js`，负责托管前端构建产物、登录注册等 HTTP API、健康检查和 API 热加载。
- 游戏 WebSocket 服务：`main.js` 加载 `os/` 引擎和 `world/` 内容后启动，负责玩家连接、命令解析、战斗、地图、技能、任务、存档等核心逻辑。
- Web 前端：`src/` 下的 Vite + jQuery 客户端，构建后输出到 `www/`，由 `web.js` 静态托管。
- 数据层：SQLite 数据库 `data/database.db` 管理账号、服务器列表和角色主记录，`data/<serverId>/` 管理全局数据、日志、请求记录和本地备份。

当前项目不是前后端完全分离部署的形态。Web 服务和游戏服务共享同一个代码仓库、配置和 SQLite 数据库，默认部署方式是同机运行两个 Node 进程。

## 2. 快速启动

### 环境要求

- 推荐 Node.js：`>= 24.10.0`。
- 当前代码也包含 `better-sqlite3` 到 `node:sqlite` 的回退逻辑，但 `node:sqlite` 在较旧 Node 版本上可能有实验警告或兼容差异。
- 依赖管理：npm。

### 安装与启动

```bash
npm install
npm start
```

`npm start` 会执行 `scripts/start.js`，同时启动：

- `node web.js`：Web/API/静态服务。
- `node main.js`：游戏 WebSocket 服务。

### 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm start` | 同时启动 Web 服务和游戏服务 |
| `npm run web` | 只启动 Web/API/静态服务 |
| `npm run os` | 只启动游戏 WebSocket 服务 |
| `npm run dev` | 启动 Vite 前端开发服务器，默认 `3333` |
| `npm run build` | 构建前端到 `www/` |
| `npm run preview` | 预览 Vite 构建结果 |
| `npm run validate:custom-equipment` | 校验自制装备规则、真实资源、存档、事务和禁用模式 |
| `npm run validate:custom-equipment-ui -- <URL>` | 用 Chromium 校验自制装备弹窗命令和 390px/768px 布局 |
| `npm run web-debug` | Web 服务断点调试 |
| `npm run os-debug` | 游戏服务断点调试 |

### 关键环境变量

配置由 `env.js` / `.env` 加载，`config.js` 统一读取。

| 变量 | 用途 |
| --- | --- |
| `WEB_PORT` | Web/API 服务端口 |
| `WS_PORT` | 游戏 WebSocket 服务端口 |
| `MD5_PREFIX` | 用户密码 MD5 加盐前缀 |
| `SESSION_SECRET` | 会话密钥 |
| `DESIV` | AES-128-CBC 登录凭证加密向量，必须是 16 字节 |
| `ADMIN_SOCKET_PATH` | Web 管理 API 与游戏进程通信的本机 Unix Socket 路径，默认 `data/admin.sock` |
| `WSMUD_CUSTOM_EQUIPMENT_ENABLED` | 自制装备写入口开关；默认开启，设为 `0` 后需重启游戏服务，已有装备仍可读取和穿戴 |

生产环境部署后应更换默认密钥和默认管理员密码。

### 默认管理员

数据库初始化时会创建默认管理员：

- 账号：`administrator`
- 密码：`123456`
- 权限等级：`6`

该账号主要用于游戏内高级命令和维护。正式服应第一时间修改密码。

## 3. 架构总览

```text
浏览器
  |
  | HTTP/HTTPS
  v
Nginx 或直接访问
  |
  +--> web.js
  |      +--> www/ 静态前端
  |      +--> /admin.html 运营管理后台
  |      +--> /api/user/*
  |      +--> /api/game/*
  |      +--> /api/admin/*
  |      +--> /health
  |              |
  |              +--> data/admin.sock --> main.js / WORLD.MESSAGE
  |
  +--> /ws 反向代理到 main.js
         |
         v
      os/ws.js
         |
      os/net-ws.js
         |
      WORLD.request(command)
         |
      world/cmd/* + os/* 引擎

SQLite: data/database.db
文件存档: data/<serverId>/*
```

项目整体分为三层：

1. 前端层：`src/` 负责登录、角色选择、游戏主界面、弹窗、地图、背包、技能、任务、聊天等 UI。
2. Web/API 层：`web.js` 和 `api/` 负责账号、验证码、服务器列表、HTTP 会话、静态资源。
3. 游戏引擎层：`main.js`、`os/`、`world/` 负责游戏状态和命令执行。

## 4. 目录结构

| 路径 | 说明 |
| --- | --- |
| `api/` | HTTP API 模块，当前主要有 `user` 和 `game` |
| `data/` | SQLite 数据库、默认数据模板、各服务器运行数据和日志 |
| `deploy/` | 部署配置，目前包含 `ruox.top` 的 Nginx 配置 |
| `os/` | MUD 核心引擎，包括对象、角色、房间、技能、任务、WebSocket、存档工具 |
| `scripts/` | 启动脚本和部署辅助脚本 |
| `src/` | 前端源码，Vite 项目根目录 |
| `www/` | 前端构建产物，由 `web.js` 托管 |
| `world/` | 游戏世界内容，包括命令、地图、NPC、物品、技能、门派、任务和扩展 |
| `web.js` | Web/API/静态资源服务入口 |
| `main.js` | 游戏服务入口 |
| `config.js` | 运行配置和数据库初始化入口 |
| `vite.config.js` | 前端构建配置 |

建议：尽量不要直接改 `os/`。`os/` 是历史核心代码，耦合和全局变量较多。新增玩法或覆盖行为优先放在 `world/extends/` 或对应 `world/*` 内容目录。

## 5. 启动流程

### 5.1 Web 服务启动流程

入口：`web.js`

1. 加载 `.env`。
2. 将 `config.js` 挂到 `globalThis.__CONFIG`。
3. 调用 `__CONFIG.init()`，检查端口、密钥、数据库配置并连接 `data/database.db`。
4. 注册 API 模块：
   - `api/user.js`
   - `api/game.js`
5. 创建原生 Node HTTP 服务。
6. 按路径处理请求：
   - `/api/:className/:methodName`
   - `/sse/:className/:methodName`
   - `/reload`
   - `/health`
   - 静态文件 `www/`

`web.js` 使用内存 `Map` 保存 HTTP session，并通过 `sid` cookie 关联请求。进程重启后 HTTP session 会丢失，但登录凭证 cookie 仍可能存在。

### 5.2 游戏服务启动流程

入口：`main.js`

1. 定义全局 `__PATH`，包括 `os/`、`world/`、`data/` 等目录。
2. 加载 `.env`。
3. 递归加载 `os/` 下所有核心脚本。
4. 调用 `__CONFIG.init()` 连接数据库。
5. 调用 `WORLD.startup(serverId)`。
6. 初始化服务器数据目录。
7. 加载世界资源。
8. 加载全局数据。
9. 启动 WebSocket 监听端口。
10. 启动心跳定时器。

`WORLD.startup()` 未传入 serverId 时使用 `config.js` 中的默认服务器配置。

### 5.3 世界资源加载顺序

资源加载由 `os/world.js` 中的 `loadResource()` 完成，顺序如下：

1. `world/extends/`
2. `world/cmd/`
3. `world/family/`
4. `world/obj/`
5. `world/area/`
6. `world/skill/`
7. `world/map/`
8. `world/task/`

加载方式不是标准 `require` 业务模块导出，而是通过 `BASE.CREATE()` 读取脚本内容并执行。脚本中通常使用 `this.inherits(...)`、`this.command = ...`、`this.id = ...`、`this.enter = ...` 这类方式注册到全局对象体系。

## 6. 前端说明

### 6.1 技术形态

前端位于 `src/`，使用：

- Vite 构建。
- jQuery 操作 DOM。
- 自定义 `Page` / `Dialog` 体系。
- 全局对象：`SendCommand`、`ReceiveMessage`、`Process`、`Dialog`、`Confirm`、`Warn`。

入口链路：

1. `src/index.html`
2. `src/startup.js`
3. `src/main.js`
4. `src/login/*` 和 `src/game/main.js`
5. `src/process.js`
6. `src/dialog/*`

### 6.2 页面组成

`src/main.js` 会一次性渲染两个大区块：

- 登录/注册/服务器/角色选择区域：`src/login/*`
- 游戏主界面区域：`src/game/main.js`

登录成功并建立 WebSocket 后，前端隐藏登录区，显示游戏主界面。

### 6.3 前端数据流

HTTP API 调用集中在 `src/api.js`，底层工具在 `src/utils/util.js`。当前有效的新接口形态是：

- `api/user/login`
- `api/user/regist`
- `api/user/validimage`
- `api/user/getphone`
- `api/user/bindphone`
- `api/user/resetpwd`
- `api/user/changepassword`
- `api/game/servers`

`src/api.js` 中仍保留部分旧接口名，例如 `UserAPI/GetRoles`、`UserAPI/AddRole` 等。当前 `web.js` 并没有提供这些旧路由，相关调用要么已经不在主流程使用，要么属于旧服务遗留。

### 6.4 WebSocket 客户端

`src/client.js` 负责连接游戏服务。

- 同域且服务器端口为 `31300` 时，前端连接 `ws(s)://当前域名/ws`，适配 Nginx 反向代理。
- 否则直接连接 `ws://server.ip:server.port`。
- 发送命令使用 `SendCommand(cmd)`。
- 接收文本消息时直接进入消息队列。
- 接收 `{...}` 或 `[...]` 开头的数据时使用 `new Function("return " + data)` 转成对象，然后交给 `Process[data.type]` 和 `Dialog.extend.process()`。

注意：服务端下发的数据并不是严格 JSON，很多地方是 JavaScript 对象字面量字符串。前端因此没有使用 `JSON.parse()`。这意味着 WebSocket 数据必须来自可信游戏服务，不能接入不可信来源。

### 6.5 Process 和 Dialog

`src/process.js` 是游戏事件分发中心，按照服务端消息的 `type` 字段调用对应处理函数，例如：

- `login`
- `roles`
- `items`
- `itemadd`
- `itemremove`
- `dialog`
- `warn`
- `state`

`src/dialog/base.js` 注册了主要弹窗模块：

- 背包：`packet` / `packet2` / `packmanage`
- 技能：`skills`
- 任务：`tasks`
- 商店：`shop`
- 地图：`map` / `jh`
- 聊天：`channel`
- 属性：`score`
- 排行：`stats`
- 帮派、队伍、交易、拍卖等。

### 6.6 侍从背包与包裹整理

- `packet`保留玩家背包入口，`packet2`负责当前侍从背包；侍从装备、物品、锁定和数量增量消息携带`owner_id`，优先通过当前命令监听器发送，没有监听器时直接推送给在线主人，关闭侍从背包后不会写入玩家背包缓存。
- 侍从背包复用玩家背包的物品详情标题、命令生成和详情弹层能力；侍从物品详情仍通过带侍从命令前缀的`checkobj`读取，不会回退到玩家背包上下文。
- 玩家或当前在场的自有侍从点击“整理包裹”后，客户端立即切换到加载中的独立整理弹窗，再通过`packmanage open/preview/execute`读取、预览和执行；打开失败会保留错误提示和重试入口。
- `packmanage`响应超过28,000字符时会以UTF-8/Base64编码拆成16,000字符的传输分片，规避玩家消息超过30,240字符后被底层发送接口丢弃的问题；客户端校验传输ID、分片数量、原始阶段和操作类型后再重组，打开、预览或执行阶段缺包及格式异常都会在10秒内结束等待并显示可恢复错误。
- 整理弹窗在打开、预览和执行响应之间复用同一DOM节点并保留委托事件，复选框、页签、预览和执行按钮不会因响应重绘失去监听；执行确认会阻止点击事件冒泡到游戏主容器，避免确认框被通用容器逻辑立即关闭。
- 玩家背包底栏在桌面端同时显示技能组、银两和整理入口；手机窄屏隐藏冗长银两文本，保留技能组`1/2/3`与“整理包裹”按钮，避免入口被横向挤出视口。侍从背包沿用相同底栏布局。
- 整理弹窗提供一键出售、一键存仓和一键分解，三个页签分别保存当前会话内的分类、品质、搜索、选择、排除和预览状态。
- `world/extends/item/management.js`集中计算分类、品质适用性、任务及特殊物品保护、出售收益、仓库占用和分解产物；前端显示结果，服务端重新裁决。
- 预览最多处理200个物品实例，请求限制16KB；执行令牌使用密码学随机数生成，默认60秒过期，绑定玩家、背包所有者、操作类型和物品关键状态。
- 同一玩家只允许一个批量执行；执行时逐件复核并允许部分成功。重复提交已经完成的令牌只返回历史结果，不会重复增加银两、仓库物品或分解产物。
- 普通挂机或跟随状态不阻止整理；死亡、昏迷、战斗和真实动作忙碌状态仍会在执行前被服务端拦截。
- 批量分解在移除装备前计算并预检全部产物；产物加入异常时恢复原背包数组和堆叠数量。紫色以上物品显示风险提示，橙色和红色装备分解需要额外二次确认。
- 基本招架、基本轻功、基本拳脚等`book/book`或`book/bk`白色基础武功秘籍虽然沿用不可交易标记，但在整理包裹的一键出售中按物品自身价值正常回收；其他不可交易秘籍仍受保护。
- 侍从出售所得进入主人银两，侍从存仓进入主人仓库，侍从分解产物进入侍从背包。

### 6.7 社交公告与邮箱

社交弹窗由 `src/dialog/message.js` 实现，底部页签依次为公告、邮箱、队伍、关系和帮派。

- 公告由 `world/cmd/admin/notice.js` 发布，支持标题、摘要、正文和公告类型；前端默认折叠全部公告。
- 邮箱按单封邮件展示，桌面端为左侧摘要列表、右侧详情，窄屏下切换为列表和详情两级视图。
- 每封邮件保存未读、已读、附件待领取和附件已领取状态。
- 邮箱命令位于 `world/cmd/dialog/message.js`，附件领取仍由 `world/cmd/obj/receive.js` 执行。
- 一键删除只清理已读且没有未领取附件的邮件，避免奖励误删。
- `world/cmd/admin/send.js` 是统一系统邮件入口，排行榜奖励、月卡每日奖励等通过邮件附件发放。

旧消息存档没有已读字段时按已读处理，避免升级后把全部历史消息误标为未读。加载层同时兼容数组、对象映射、字符串序列化、旧字段名和旧附件结构；数据进入内存后统一归一化，下一次正常保存时写回标准邮件结构。

### 6.8 运营管理后台

独立管理页面位于 `/admin.html`，源码为 `src/admin.html`、`src/admin.js` 和 `src/styles/admin.css`。页面沿用 Vite、jQuery 和项目现有 glyphicon 字体，构建后与游戏前端一起输出到 `www/`。

- 使用现有账号系统登录，只允许账号状态正常且权限等级不低于 5 的管理员访问。
- 公告支持创建、修改、撤回和重新发布；新发布及重新发布会即时刷新在线玩家公告并显示公告提示。
- 邮件支持发送给多个指定角色或当前服务器全部角色，离线角色也会收到邮件。指定角色使用可搜索的复选下拉框，支持全选当前搜索结果和清空选择；发送后保存角色 ID 与名称快照，收件范围不可修改。
- 附件从游戏服务提供的分类白名单中选择，按货币资源、丹药消耗品、武学书籍与残页、材料与晶石、武器装备、活动与特殊物品分组；支持名称或对象路径搜索、复选多选和逐项数量设置，单项数量范围为1至100,000,000。附件选择菜单会根据屏幕可用空间自动向上或向下展开，并将物品列表限制在当前视口内滚动。
- 附件目录只开放可稳定创建和领取的奖励对象，剧情钥匙、NPC 契约、临时任务对象及动态奖励箱不会出现在目录中；服务端会再次校验目录、数量和重复路径。
- 已发送邮件可以修改标题、摘要、正文和发件人；没有玩家领取附件时也可以修改附件。
- 邮件撤回会删除仍在玩家邮箱中的邮件副本，但已经领取的奖励不会反向扣除，后台会保留撤回时的领取统计。
- 公告和管理邮件使用稳定 ID，管理记录、状态、操作人和时间随全局数据持久化。
- 桌面端采用记录列表与编辑区双栏布局，窄屏下改为上下布局。

### 6.9 奇经八脉

属性弹窗新增“经脉”页，服务端由 `world/extends/char/meridian.js` 统一维护十条经脉配置、进度规范化、属性派生、预览、贯通、存档包装和“周天圆满”状态；`world/cmd/dialog/meridian.js` 处理逐穴贯通，`score meridian` 返回当前经脉视图。

- 任脉、督脉初始开放；两脉全通并达到宗师后开放其余八脉。旧角色保留原境界，但经脉从0进度开始。
- 单条经脉第 `N` 穴消耗 `10000 × N` 点已修炼最大内力 `max_mp`，不降低内力封顶 `limit_mp`；后续打坐可以重新练回。单穴必须一次性支付，最高单次需求为240,000。
- 经脉进度作为角色存档顶层 `meridians` 字段保存；属性根据进度实时派生，不保存独立累计消耗或重复属性值。
- 任脉增加学习、练习效率，督脉增加打坐效率，阴跷脉提高内力封顶，其余经脉增加战斗属性；十脉全通后永久获得最终伤害、伤害减免和忽视防御，并补发“周天圆满”展示称号。
- 宗师突破不再读取旧 `rdem` 临时标记，改为检查任脉、督脉全通，同时继续要求现有技能条件和当前最大内力达到100,000。
- 正式卧室和练功房使用 `can_practice_meridian` 显式标记；副本同名房间不会因名称自动获得资格，住宅和帮派的 `not_fb` 复制区域可以正常修炼。
- 前端每穴二次确认，展示扣减后的最大内力、当前内力、气血上限和本穴奖励；客户端按钮锁定、服务端玩家级锁和预期进度校验共同防止重复扣除。
- 经脉页支持194穴状态、未开放原因和累计投入展示；已验证768px桌面与390px手机宽度无横向溢出。

## 7. Web/API 服务

### 7.1 路由表

| 路由 | 说明 |
| --- | --- |
| `/` | 返回 `www/index.html` |
| `/admin.html` | 返回运营管理后台 |
| `/api/:className/:methodName` | 调用 `api/<className>.js` 中的实例方法 |
| `/sse/:className/:methodName` | SSE 形式调用 API 方法 |
| `/reload` | 清理并重新加载 API 模块缓存，仅允许已登录的 5 级以上管理员调用 |
| `/health` | 返回 `{ ok: true }` |
| 其他静态路径 | 从 `www/` 读取静态文件 |

### 7.2 API 基类

`api/base.js` 提供：

- 登录凭证加密和解密。
- MD5 密码哈希。
- cookie 写入。
- session 读写。
- SSE 辅助方法。

登录凭证使用两个 cookie：

- `u`：会话 key。
- `p`：用 AES-128-CBC 加密后的用户凭证。

游戏 WebSocket 登录时，前端会把这两个 cookie 拼成命令发给游戏服务，由 `os/login.js` 解密验证。

### 7.3 用户 API

`api/user.js` 包含：

- `login`
- `regist`
- `validimage`
- `getphone`
- `bindphone`
- `resetpwd`
- `changepassword`

密码存储方式是 `MD5(明文密码 + MD5_PREFIX)` 后转大写。该方案能兼容旧项目，但安全性不如 bcrypt、argon2 等现代密码哈希算法。

### 7.4 游戏 API

`api/game.js` 目前主要提供：

- `servers`：返回数据库服务器列表；如果数据库为空，返回 `config.js` 中的默认服务器，并把 IP 替换为当前请求 Host。
- `reload`：清理服务器列表缓存。
- `search_role`：遗留/管理查询能力，但依赖的方法需要进一步核对。

### 7.5 管理 API 与游戏进程桥接

`api/admin.js` 提供公告和系统邮件管理 API。管理 API 先重新读取数据库账号状态和权限，再通过 `data/admin.sock` 把操作交给游戏进程执行，避免 Web 进程直接修改另一进程的内存状态。

管理通道由 `world/extends/admin_bridge.js` 启动：

- Unix Socket 默认权限为 `0600`，只允许本机进程访问。
- Web 与游戏进程使用基于 `SESSION_SECRET` 和 Socket 路径派生的 SHA-256 令牌认证。
- 写操作串行执行，并在 `WORLD.DATA.save()` 成功后再刷新在线玩家界面。
- 管理请求体上限为 256KB，普通 HTTP API 请求体上限为 512KB。
- 管理 API 使用显式方法白名单，内部桥接辅助方法不能通过动态 API 路由调用。

主要接口包括：`me`、`state`、`roles`、`noticeCreate`、`noticeUpdate`、`noticeWithdraw`、`noticePublish`、`mailSend`、`mailUpdate`、`mailWithdraw` 和 `logout`。

首次部署管理模块时需要重启 Web 和游戏进程，使 API 模块、世界扩展和 Socket 生命周期钩子完成加载。之后创建、修改、撤回公告或邮件均直接在运行时生效，不需要重启服务。

## 8. 游戏服务和引擎

### 8.1 核心全局对象

游戏服务高度依赖全局对象：

- `WORLD`：服务器状态、玩家列表、命令表、技能表、房间表、全局数据、心跳、日志、存档和网络入口。
- `BASE`：动态脚本对象加载器。
- `COMMAND`：命令基类和命令注册。
- `ITEM` / `OBJ` / `EQUIPMENT`：物品体系。
- `CHARACTER` / `USER` / `NPC` / `MONSTER`：角色体系。
- `ROOM` / `AREA` / `FAMILY_AREA`：房间、地图区域、副本和门派区域。
- `SKILL` / `PERFORM` / `FAMILY`：技能、绝招、门派。
- `TASK` / `EVENTS`：任务和事件。

这种写法更接近早期 MUD 驱动：脚本文件不是普通业务模块，而是被动态加载成游戏对象。

### 8.2 动态脚本加载

`os/base.js` 是对象加载核心。

- `BASE.CREATE(basePath, fname)`：读取 `basePath + fname + ".js"`，用 `vm.compileFunction()` 编译后执行，生成新对象。
- `BASE.UPDATE(basePath, fname)`：重新读取脚本并替换缓存，用于热更新。
- `BASE.PATH_REG` 限制资源路径格式为 `xxx/yyy#param` 这类安全格式。

脚本中常见写法：

```javascript
this.inherits(COMMAND);
this.command = "example";

this.enter = function (me, arg) {
    me.notify("example command");
};
```

### 8.3 命令体系

`world/cmd/` 下的文件会继承 `COMMAND` 并注册到 `WORLD.COMMANDS`。

例如 `world/cmd/action/go.js` 注册 `go` 命令，负责解析方向、检查房间出口、判断战斗逃跑、进入下一个房间。

命令常见属性：

- `this.command`：命令名，多个命令可用逗号分隔。
- `this.allow_level`：权限等级。
- `this.allow_busy`：忙乱状态是否允许。
- `this.allow_fight`：战斗中是否允许。
- `this.enter(me, arg1, arg2, ...)`：命令入口。

### 8.4 角色和战斗

角色相关核心位于：

- `os/char/character.js`
- `os/char/user.js`
- `os/char/npc.js`
- `os/char/combat.js`
- `world/extends/char/user.js`
- `world/extends/char/combat.js`
- `world/extends/char/auto_combat.js`

玩家属性会由基础属性、技能、装备、临时状态等共同计算。当前玩家命中公式在 `world/extends/char/user.js`：

```javascript
this.mz = parseInt((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
```

即：

```text
命中 = floor((身法 / 2 + 固定命中加成) * (100 + 命中百分比加成) / 100)
```

NPC/普通角色也有类似公式，位于 `world/extends/char/combat.js`。

#### 自动绝招配置

技能面板的“技能配置”按当前技能组列出可用绝招。三个技能组分别保存：

- 自动出招总开关。
- 每个绝招的启用/停用状态。
- 战斗中的尝试顺序。

配置命令位于 `world/cmd/skill/auto_pfm.js`，角色数据保存在 `auto_pfm_groups` 字段。玩家战斗循环由 `world/extends/char/auto_combat.js` 按顺序查找第一个当前可释放的绝招；冷却中、内力不足、武器或状态不符以及已失效的绝招会被跳过，没有可用绝招时继续普通攻击。

手动和自动释放都通过 `world/cmd/battle/pfm.js` 的 `try_perform()` 执行，因此共用内力消耗、出招时间、服务器冷却和前端动作栏冷却消息。

### 8.5 打坐和内力

打坐命令位于 `world/cmd/action/dazuo.js`。

关键限制：

```text
可打坐到的最大内力 = me.limit_mp + me.query_prop("limit_mp")
```

打坐恢复/提升效率主要受：

- 基本内功等级：`me.query_skill("force")`
- 根骨：`me.con`
- 固定打坐效率：`me.query_prop("dazuo")`
- 打坐百分比：`me.query_prop("dazuo_per")`
- 门派临时加成：`me.family.query_temp("dazuo_per", 0)`
- 全局活动加成：`WORLD.DATA.query_temp("dazuo_per", 0)`

其中一段核心计算为：

```javascript
let exp = parseInt((me.query_skill("force") / 100 + me.query_prop("dazuo")
    + 1 + me.con / 10) * (100 + me.family.query_temp('dazuo_per', 0)
        + WORLD.DATA.query_temp("dazuo_per", 0) + me.query_prop("dazuo_per")) / 100);
```

因此：

```text
单次打坐效率 = floor((基本内功等级 / 100 + 固定打坐效率 + 1 + 根骨 / 10)
    * (100 + 门派打坐百分比 + 全局打坐百分比 + 个人打坐百分比) / 100)
```

内力上限来源包括：

- 玩家自身 `limit_mp`。
- 技能属性 `limit_mp`。
- 装备属性 `limit_mp`。
- 丹药或任务奖励直接增加 `limit_mp`。
- 境界提升在 `world/extends/char/user.js` 中直接增加 `limit_mp`。

### 8.6 心跳与保存

`WORLD.heart_beat()` 默认每 `__CONFIG.HEARTBEAT` 毫秒执行一次，当前配置为 5000ms。

心跳做的事：

- 遍历在线玩家并执行玩家心跳。
- 执行 `WORLD.on_heart_beat()` 扩展钩子。
- 遍历运行中的房间并执行房间心跳。
- 统计连接数。
- 每 720 次心跳触发一次 `WORLD.save()`。

按 5 秒一次计算，720 次约等于 1 小时。

`WORLD.save()` 会：

- 保存当前服务器在线玩家角色数据到 SQLite。
- 保存全局数据到 `data/<serverId>/data.js`。
- 写入游戏日志和请求日志。
- 生成本地备份片段。

## 9. 数据库和存档

### 9.1 SQLite

数据库入口：

- `data/db.js`：底层 SQLite 封装。
- `data/sql.js`：业务 SQL 方法。
- `config.js`：通过 `DB.connect("database.db")` 初始化。

数据库文件：

```text
data/database.db
```

初始化表：

| 表 | 说明 |
| --- | --- |
| `users` | 账号、密码、手机号、状态、权限等级 |
| `servers` | 服务器列表 |
| `players` | 角色主记录和角色序列化数据 |
| `players_bak` | 删除角色前的备份 |

### 9.2 文件数据

游戏运行数据位于：

```text
data/<serverId>/
```

默认 serverId 是 `100`，所以当前主要目录是：

```text
data/100/
```

常见文件/目录：

- `data/100/data.js`：全局游戏数据。
- `data/100/log/`：游戏日志。
- `data/100/req/`：玩家请求/命令记录。
- `data/100/bak/`：角色本地备份。
- `data/100/temp/`：全局数据写入前的临时备份。

邮箱和公告由 `WORLD.MESSAGE` 管理，并随全局数据写入 `data/100/data.js` 的 `messages`、`notices` 和 `mail_campaigns` 字段。邮件当前保留 30 天，公告和管理邮件发送记录分别最多保存 500 条，客户端展示最近 50 条公告。

邮件加载会先兼容解析历史格式，再由 `WORLD.MESSAGE.save()` 输出统一的用户、发件类型和单封邮件三级结构。迁移只改变序列化格式，不删除正文、附件、领取状态、已读状态或去重标记。

首次启动某个 serverId 时，`os/util/data.js` 会从 `data/def/` 复制默认文件和目录。

### 9.3 备份建议

涉及生产数据前，至少备份：

```bash
cp data/database.db data/database.db.$(date +%Y%m%d%H%M%S).bak
tar czf data-runtime-$(date +%Y%m%d%H%M%S).tgz data/100
```

不要在游戏进程运行中手工修改 `data/100/data.js`，除非明确知道当前保存时机会覆盖哪些字段。

## 10. 通信协议

### 10.1 HTTP API

HTTP API 返回标准 JSON。`web.js` 会合并 query string 和 request body 后传给 API 方法。

支持 body 类型：

- `application/json`
- `application/x-www-form-urlencoded`
- 其他类型会作为 `{ raw }` 传入。

### 10.2 游戏 WebSocket

游戏 WebSocket 使用文本命令协议。

客户端发送：

```text
命令 参数1 参数2 ...
```

例如：

```javascript
SendCommand("go north");
SendCommand("dazuo");
SendCommand("status <playerId>");
SendCommand("message");
SendCommand("message read <from> <index>");
SendCommand("message readall");
SendCommand("message deleteall");
SendCommand("receive");
```

服务端响应分两类：

1. 普通文本：直接显示在消息区。
2. 对象字面量字符串：例如 `{type:"items",items:[...]}`，前端解析后分发给 `Process` 和 `Dialog`。

### 10.3 WebSocket 服务实现

`os/net-ws.js` 是自定义 WebSocket 实现，基于 Node `net` / `tls` 直接处理握手和帧。

支持：

- 现代 WebSocket 握手。
- 旧版 WebSocket 握手。
- 自定义 TCP 长度帧协议。

浏览器正常走现代 WebSocket。生产环境如果经 Nginx 代理，应确保 `/ws` 保留 Upgrade 头。

## 11. 游戏内容扩展

### 11.1 内容目录

| 路径 | 用途 |
| --- | --- |
| `world/cmd/` | 玩家命令、管理命令、弹窗命令、技能命令 |
| `world/family/` | 门派定义 |
| `world/obj/` | 物品、装备、药品、资源 |
| `world/area/` | 区域、副本、门派区域 |
| `world/map/` | 具体房间 |
| `world/npc/` | NPC、怪物、师父、随从 |
| `world/skill/` | 基础技能、门派技能、绝招、知识技能 |
| `world/task/` | 任务脚本 |
| `world/extends/` | 对 `os/` 或世界行为的覆盖和增强 |

### 11.2 门派内容

当前完整接入的门派区域包含明教和日月神教：

- 明教：门派 ID `MINGJIAO`，区域 ID `mingjiao`，区域编号 `13`。武学以九阳神功、乾坤大挪移和圣火令法为核心，侧重反击、恢复与状态压制。
- 日月神教：门派 ID `RIYUE`，区域 ID `riyue`，区域编号 `14`。任我行路线使用吸星大法和天魔剑法，东方不败路线使用日月光华和辟邪剑法。
- 两派均已接入师承、首席弟子、门派物资和门派战争；相关路径分别位于 `world/family/`、`world/area/map/`、`world/map/`、`world/npc/` 和 `world/skill/`。

### 11.3 门派武学品质规则

技能基础品质用于定义门派传承层级，强化词条和融合绝招只提升当前有效品质，不改变技能本身的基础层级。实际完成的词条进阶还会按进阶重数强化武学装备时提供的基础属性。

- 技能列表中的名称颜色按基础品质显示，确保黄色上乘武学不会因强化后变成橙色而从门派分布中“消失”。
- 技能列表在当前有效品质高于基础品质时显示“强化+N”；技能详情仍按当前有效品质展示属性和词条效果。
- 符合条件的特殊武功达到1000级后可以消耗武学进阶残页进行进阶，不再限制技能所属门派必须等于玩家当前门派。确认参悟时随机生成三个不重复候选，玩家再指定其中一个词条；候选写入技能存档，关闭面板或重新登录不会刷新。
- 每个词条只能选择一次，每完成一重进阶有效品质提高一级，显示品质最高为红色；达到红色后仍可继续进阶，直到完成五重。进阶费用按目标品质档位为蓝、黄、紫、橙、红色分别需要10、30、50、100、200份武学进阶残页，红色档位可用于后续重数。
- 进阶词条池由稳定的通用词条和武功专属词条组成。通用词条覆盖攻击、防御、命中、躲闪、招架、气血、内力上限、暴击、破防和减伤；武功已定义的专属词条继续参与随机候选。
- 每完成一重词条进阶，武学装备时提供的正数攻击、防御、命中、招架、躲闪、气血上限和内力上限统一提高5%。倍率只按 `addin` 中实际完成的进阶重数计算，所有符合条件的武学最多获得25%基础属性加成；融合绝招 `ref` 不计入该倍率。
- 进阶基础属性倍率不放大先天及后天四维、暴击、破防、减伤、绝招伤害、冷却、控制时间、攻击次数和其他特殊机制。技能详情展示倍率生效后的装备属性，并额外标明当前进阶基础属性加成。
- 取消进阶只撤销最后一重并返还该重实际消耗的残页。尚未选择的三个候选会保留，必须先完成选择，避免通过关闭面板或重新登录反复刷新。
- 师门物资不再直接产出武学进阶残页，原额外物品位置统一改为对应师门职位等级的内力上限药；残页改由师门环任务随机奖励和门派功绩商店产出。
- 历史存档中的 `addin` 词条和 `ref` 融合绝招继续兼容读取；当前只开放词条进阶，未完成的融合入口不再显示。
- 每个玩家门派最多保留一门基础紫色武学，黄色武学承担主要的进阶和上乘传承。
- 公共武功池除通用武功外，暂时收录尚未实装为可加入门派的势力武功，包括胡家、白驼山、铁剑门、神龙岛、天地会、恒山、桃花岛、黑龙会、密宗、蒙古、泰山、净念禅宗、神龙教、五毒教、古墓派及云龙门等。即使武功背景属于已实装门派，只要没有出现在任何可拜师 NPC 的正式教学技能表中，也归入公共武功池；只有存在正式师父传授的技能才设置对应 `family`。技能 ID、秘籍和已有玩家存档保持兼容。
- 桃花岛至战神殿新增副本使用的 36 门公共武学按副本掉落参考资料定义基本功类别、装备属性和绝招；当前共提供 58 个可执行绝招。48 件副本专属装备同步按资料定义说明、部位、品质、孔位、穿戴条件、基础属性和特殊词条，战神殿四件装备提供文档声明的四件套加成。技能 ID、残页路径和装备资源路径保持不变，已有学习等级、进阶词条、自动绝招配置和装备存档继续按原 ID/路径兼容读取。
- 紫色武学必须由高阶师父、隐藏师父或严格前置条件控制，不允许入门师父直接提供多门基础紫色武学。
- 门派之间不强求技能数量完全相同，平衡重点是传承节奏、学习门槛、战斗定位和绝招组合，而不是机械对齐数量。

当前各门派唯一基础紫色武学如下：

| 门派 | 基础紫色武学 | 主要黄色层 |
| --- | --- | --- |
| 武当派 | 太极剑法 | 太极拳、太极神功 |
| 少林派 | 易筋经 | 燃木刀法、一指禅 |
| 华山派 | 独孤九剑 | 狂风快剑、紫霞神功 |
| 峨眉派 | 倚天剑法 | 九阴白骨爪、临济十二庄 |
| 逍遥派 | 小无相功 | 北冥神功、凌波微步、天山六阳掌 |
| 全真教 | 空明拳 | 天罡剑法、北斗阵法、先天功、重阳神掌 |
| 丐帮 | 降龙十八掌 | 打狗棒、混天气功 |
| 杀手楼 | 漫天花雨 | 杀生决、踏雪寻梅 |
| 血刀门 | 血刀经 | 血海魔功、神空行、血刀刀法、金刚瑜伽母拳 |
| 明教 | 乾坤大挪移 | 寒冰绵掌、七伤拳、九阳神功、圣火令法 |
| 日月神教 | 吸星大法 | 幻魔龙天舞、天魔剑法、日月光华、辟邪剑法 |
| 移花宫 | 移花接木 | 移风剑法、明玉神功、绝情掌诀 |

高级绝招应优先形成门派内部联动。例如全真剑阵积累并引爆星位、血刀刀法制造流血后由血刀经撕裂、明玉神功在护体蓄势和疗伤之间取舍、辟邪剑法以气血和防御换取鬼影爆发。避免仅通过修改攻击次数、百分比和状态名称复制同一套绝招模板。

### 11.4 师门环任务与门派套装

- 十二个正式门派的后勤管理员只提供“师门任务”和“放弃师门任务”入口。功绩商品统一放在全局商城的“功绩”页签，与“黄金”“元宝”并列；正式门派玩家显示本门商品，散人和未开放阵营没有门派套装商品。任务主逻辑位于 `world/task/family_ring.js`，统一配置位于 `world/extends/family_task.js`。
- 每日最多成功完成20次、最多两环，每环10次，并在北京时间每日5点刷新。只有成功击败自己的任务目标才增加每日次数、当前环进度和难度累计；失败或主动放弃保留每日成功次数和已完成环数，只清空当前环进度与难度累计。
- 难度倍率为 `80% + 连续成功次数 × 1%`，连续成功20次后回到玩家属性的100%；完成一环、跨日、掉线和重启不会重置，失败或放弃后恢复80%。敌人在生成时读取玩家气血、内力、攻防、命中、闪避、招架、暴击、基础属性和代表性基础技能等级形成快照，不复制特殊武学、绝招或自动出招顺序。
- 接取本环第一个目标后会自动前往并战斗，每次成功后继续生成下一名目标；第10次成功后停止，不会自动开启下一环。死亡、断线、其他战斗、传送失败和目标异常会暂停或进入失败处理。
- 每环第9、10次各触发一次系统随机特殊奖励，当前权重为师门功绩45%、武学进阶残页30%、本门装备25%。奖励槽位按日期、环次和节点独立记录，使用存档安全的编码字符串保存；未成功发放的奖励会在登录、重新接取或后续结算时重试，背包不足时转入系统邮件附件。
- 十二个正式门派各提供头部、衣服、鞋、护腕、腰带、饰品六个部位，覆盖普通至神器 `grade 0-6`，并采用2/4/6件套效果。散人没有套装，杀手楼有独立套装；任务装备品质受境界、当天环次和连续难度共同影响。
- 商城功绩页支持定向兑换当前门派六个部位。武学进阶残页为2500功绩/份，每周最多10份，在北京时间每周一5点刷新；装备品质按角色境界确定，价格按品质为150、250、450、750、1200、1800、2800功绩。
- 角色状态保存在 `temp` 中，主要字段为 `family_task_day`、`family_task_daily`、`family_task_ring_done`、`family_task_ring_step`、`family_task_streak`、`family_task_rewards`、`family_shop_week` 和 `family_shop_pages`。活动中的NPC实例不写入存档；重启后清理旧目标标识，玩家重新接取时生成同进度的新目标，不增加次数。
- 门派装备使用参数化对象路径 `eq/family#<FAMILY>_<part>_<grade>`。该路径、任务对象、全局配置和已有装备实例涉及初始化与缓存，生产启用前必须重启游戏服务，不能只依赖热更新。

当前尚未限制门派装备跨门派穿戴或交易；这属于后续产品确认项，不能在未确认时临时加入限制。

### 11.5 衙门追捕

- 衙门追捕每日三环、每环十次，完成首次追捕后获得“衙役”职位。
- 玩家选择本环难度并接取首个目标后，系统会自动前往目标、发起战斗，并在每次成功后自动接取下一名逃犯；完成本环第十次追捕后停止，不会自动开启下一环。
- 自动追捕遇到断线、死亡、超时、其他未结束战斗、无法传送或目标异常时暂停，玩家可以继续当前目标或主动放弃；放弃和失败仍按原规则重置当前环进度。
- 经验和武学评价门槛只用于职位晋升，不限制玩家继续接取追捕任务。
- 职位追捕次数达到要求但角色资格不足时，职位进度封顶保留；玩家仍可继续追捕，满足资格后的下一次成功追捕完成晋升。
- 放弃或任务失败会重置当前环进度，但保留当日成功次数和职位进度。

#### 自动任务间恢复

- 设置弹窗“扩展”页提供“任务间自动恢复”开关及气血、内力比例，允许范围均为1%至100%；旧角色默认关闭，未保存比例时使用气血80%、内力60%。设置通过角色现有`settings`字段持久化。
- 自动师门或自动追捕每完成一名目标后先进入恢复门控。气血低于设定比例时先自动疗伤，随后检查内力并自动打坐；两项达到设定比例后才生成下一名目标。
- 自动恢复只补充当前气血和当前内力，不会在达到比例后继续打坐提升最大内力。每次疗伤或打坐结束都会重新检查当前比例，允许单次恢复超过少量阈值。
- 手动停止恢复、放弃任务、死亡、昏迷或掉线会取消本次自动续接；战斗、忙乱和其他动作会短暂重试，持续无法恢复或连续无恢复进展时暂停并保留手动继续入口，避免无限循环。
- 共用状态机位于`world/extends/auto_recovery.js`，师门和追捕任务只提交续接类型；运行中的恢复上下文不写入角色存档，重新登录后由玩家手动继续当前环。

### 11.6 副本结算与难度

- 副本完成度由玩家在当前副本中的得分除以区域 `score` 计算，范围限制为 0% 到 100%。
- 经验和潜能分别读取区域 `exp`、`pot` 配置，并按实际完成度取整；完成确认和最终到账共用同一结算函数。
- 区域显式配置 `quick_drops` 或 `diff_quick_drops` 时，扫荡优先使用该配置；剧情钥匙不得写入扫荡奖励表。
- 每个副本每日最多完成 50 次，不同副本分别计数；同一副本的普通、困难、组队和扫荡共用这 50 次额度，并在每日凌晨 5 点重置。
- 普通、困难和组队完成次数分别保存到 `fbc_0_<index>`、`fbc_1_<index>`、`fbc_2_<index>`。
- 困难副本默认将敌人气血提高到 1.5 倍、主要属性提高到 1.2 倍；组队副本默认将气血提高到 2 倍、主要属性提高到 1.35 倍。房间有专用难度逻辑时可自行覆盖。
- 武道塔从40层开始按每10层设置守护者攻击、命中、躲闪、招架和防御的最低成长档位，并使用当前已加载且激活类型匹配的武学组合；属性下限写入角色属性后参与后续重算，避免绝招状态刷新后失效。挑战纪录、奖励和每日领取规则保持不变，`scripts/validate-wudao.js`负责检查1至99层技能有效性、属性下限及十层边界成长。
- 动态机关、隐藏房间和剧情分支必须允许玩家稳定取得区域满分，不能依赖 NPC 互相击杀或短时网络输入窗口。
- 复杂副本的路线进度由 `world/extends/map/fb_progress.js` 维护在副本首房间实例状态中；里程碑幂等、分支锁定和路线失败不会写入角色存档。新增副本使用独立 `record_index`，连城诀继续使用记录编号 16。`fb_record_index_v2` 负责历史记录号迁移，`fb_unlock_order_v3` 按桃花岛至战神殿的连续通关记录重算主线解锁，并清除全部角色原有的连城诀完成次数和扫荡资格；离线批量处理使用 `scripts/migrate-clear-lcj-progress.js`，必须在游戏服务停止并完成数据库备份后执行。
- 桃花岛桃花阵按参考攻略显示固定的 3×3 九宫房间，副本实例从八种九宫布局中随机选择，玩家从数字一开始按一至九逐房辨认，并沿八至九的方向走出阵法。迷宫移动、路线选择、机关数字、方向判断和答题均提供独立点击动作；前端进入含自定义动作的房间时自动展开动作栏，不依赖玩家手动输入命令参数。`scripts/validate-fb-routes.js` 会拒绝新增缺少点击选项的参数型副本动作。

### 11.7 山海异兽随机投放活动

- 系统每天按服务器本地日期生成并持久化一份随机日程，总计投放10至60只异兽。日程至少拆成10批，每批选择1至5个不同的非副本江湖区域，每个区域只生成1只异兽；批次在08:00至23:00之间均匀排布并保留少量随机偏移，正常相邻间隔约80至120分钟，避免连续数小时没有异兽出现。
- 日程保存在全局临时数据 `shanhai_event_schedule` 中。批次触发前先写入已处理状态，重启后只继续未来批次，已经过期或已经触发的批次不会补发或重复投放。异兽实例不写入存档。
- 每只异兽存活10分钟。超时后会结束相关战斗并自动消失；被击败后不刷新，尸体不产出普通掉落，活动武器也不会进入掉落。
- 难度优先参考高手榜中最强的正常玩家完整快照，回退到在线正常玩家中综合属性最高者；管理员、跨服角色和无效属性快照不参与参考。异兽攻击、防御、命中、躲闪、招架、暴击、内力和四维分别随机取参考值的70%至80%，最大气血固定为参考玩家最大气血的10倍，生成后不再动态变化。
- 异兽名称取自《山海经》异兽。每只异兽从全部已加载的门派及公共特殊武学中分别随机选择内功、轻功、招架和一门攻击武学，技能等级随机为参考玩家战斗基础技能的40%至120%。武器武学自动装备对应兵器；怪物专属、隐藏或已确认依赖玩家剧情状态的武学不进入池子，不满足当前状态的绝招会被跳过，绝招异常时会单独禁用并继续普通攻击。
- 伤害贡献按玩家本体和随从归属合并记录，并按异兽实际损失气血计算。累计伤害达到异兽最大气血3%的角色才有奖励资格；最后击杀者也必须达到3%才获得击杀奖励，同一角色对同一只异兽只结算一次，击杀奖励和参与奖励不重复。
- 当前击杀奖励为8至20两黄金、30000至60000潜能、3000至7000经验，并有25%概率获得1本武道残页；其他达标参与者获得1至4两黄金、5000至12000潜能、500至1500经验，并有3%概率获得1本武道残页。奖励没有每日领取次数限制；在线角色直接结算，离线角色或背包不足的残页通过带去重标识的系统邮件发放。
- 活动主逻辑位于 `world/task/shanhai_event.js`，异兽模板位于 `world/npc/pub/shanhai_beast.js`，离线经验附件位于 `world/obj/money/shanhai_exp.js`。任务注册、NPC模板和新物品首次生产启用需要重启游戏服务完成完整加载。

### 11.8 断剑冢限时秘境

- 江湖新增“秘境”页签，当前开放“断剑冢”。玩家每日服务器本地时间 05:00 刷新后可挑战 1 次，进入消耗 1 枚“归墟种”，不消耗精力；归墟种在商城黄金页以 1000 两黄金出售，在元宝页以 100 元宝出售，且不可交易。
- 秘境为单人私有区域，进入后限时 12 分钟，地图包含断剑台、葬锋坡、残刃林、洗剑池和无名冢五个互通房间，场内始终只保留 1 只“断剑残魂”，最多击杀 100 只。断剑残魂的基础、特殊、轻功、招架和攻击武学均为 500 级，内力上限按所带基本内功与随机特殊内功的 500 级上限合计后再提高 20%，气血按该内功配置计算后保持 2 倍倍率，并会自动释放随机武学技能。每次击杀立即随机获得 500-2000 点经验和 500-2000 点潜能，结束时按击杀数额外结算 0-9、10-24、25-49、50-74、75-99、100 六档奖励。
- 断剑残魂从已加载的非怪物、非隐藏武学中随机选择内功、轻功、招架和一门拳脚或兵器攻击武学，技能等级为 500；属性由技能初始化后整体提高 20%，最大气血在技能生成基础上乘 2，攻击间隔按 0.8 倍计算且不低于 500 毫秒。
- 玩家和随从进入秘境时获得“剑气”（防御、招架、躲闪 -10%）、“残魂”（内力消耗 +50%、治疗量 -50%）和“战意”（攻击速度 +50%）；离开、死亡、超时或结算时移除。挑战状态保存到角色临时字段并在重连时恢复，服务端负责校验门票、每日次数、时间、击杀归属和结算幂等性。
- 江湖秘境详情页仅展示挑战状态和“掉落物”标签（潜能、经验），规则说明和阶段结算明细以公告为准；拥有归墟种时显示“进入秘境”操作，无门票时提供商城入口。
- 残魂生成后自动向当前秘境玩家发起战斗；所有秘境房间均提供“结束挑战”操作，结束后按当前击杀数结算并离开秘境。
- 秘境区域标记为私有复制区域但不进入通用 `cr` 副本结算，相关命令为 `mijing`，江湖入口为 `jh mj`。任务、区域、地图、命令和门票对象首次生产启用必须重启游戏服务完成完整加载。

### 11.9 自制装备 3.4

- `world/extends/item/custom_equipment.js` 是统一领域服务，维护 11 个部位、40 个属性、五类槽位、扁平存档、属性重建、预览令牌、制作权限、分解产物和评分。其他命令不应复制这些配置。
- 玩家从铁匠铺、成衣店和药林东侧鉴宝阁制作装备；装备详情中的“重铸/改名”进入 `src/dialog/custom-equipment.js`，前端只提交装备 ID、选择和服务端签发的 60 秒一次性令牌。
- 存档版本 1 使用 `custom_version`、`custom_state_version`、`type`、`name`、`wash_count`、`fixed_level`、`affix_<key>`、可选 `affix_legacy_<key>`、`ability_skill`、`ability_base` 等扁平字段。旧武器字段兼容读取，数值按正式边界限幅，`prop` 和 `original_prop` 始终由状态重建。
- 已穿戴装备养成时先卸载旧属性，事务提交后挂载新属性；材料、黄金、装备状态或挂载后步骤异常时恢复背包、装备和角色属性快照。
- 能力词条只接受原始等级大于 0 的已学武学，并使用装备原生 `skill` 属性使有效等级 `+1`；单件、批量和自动分解统一经 `WORLD.ITEM_MANAGEMENT` 执行。通用 `EQUIPMENT.clone()` 会保留锁定状态，确保自制装备在克隆链路中不意外解锁。
- `WSMUD_CUSTOM_EQUIPMENT_ENABLED=0` 只关闭制作和养成写入。开关在游戏服务加载时读取，切换需要重启；旧装备查看、加载、穿戴和分解保持可用。
- 最终规则与验收记录见 `docs/自制装备3.4.md`、`docs/自制装备3.4开发计划.md`；专项回归使用 `npm run validate:custom-equipment` 和 `npm run validate:custom-equipment-ui -- <URL>`。
- 自制装备 3.4 已于 2026-08-21 完成生产备份、玩家公告、前后端重启和生产构建验收；此后调整存档、费用、属性或分解规则时，仍需按数据变更流程备份并重新执行专项回归。

### 11.10 推荐扩展方式

优先顺序：

1. 能放在 `world/extends/` 的行为增强，放 `world/extends/`。
2. 新地图、新 NPC、新物品、新技能，放对应 `world/*` 内容目录。
3. 只有底层对象模型必须变化时才修改 `os/`。

原因：`world/extends/` 最先加载，可以覆盖原型方法或挂接生命周期钩子，且更容易热更新和回滚。

### 11.11 热更新

管理员可以用 `update` 命令热更新 `world/` 下脚本：

```javascript
SendCommand("update cmd/admin/test");
SendCommand("update obj/drug/limit_mp");
SendCommand("update skill/emei/linjizhuang");
```

注意：

- `update` 命令定义在 `world/cmd/admin/update.js`。
- 需要管理员等级，当前 `allow_level = 6`。
- 热更新适合脚本逻辑变更，不等价于完整重启。
- 已经生成并存在于玩家背包、房间或缓存中的对象，不一定全部自动替换，需要按对象类型检查更新逻辑。

## 12. 部署说明

### 12.1 systemd

当前常见部署方式是通过 systemd 运行：

```bash
systemctl status wsmud2
systemctl restart wsmud2
journalctl -u wsmud2 -f
```

服务命令通常是：

```bash
npm start
```

即一个父进程拉起 `web.js` 和 `main.js` 两个子进程。任一子进程异常退出时，`scripts/start.js` 会尝试停止另一个进程并返回非零状态。

### 12.2 Nginx

仓库提供了：

```text
deploy/ruox.top.nginx.conf
scripts/install-ruox-nginx.sh
```

当前 Nginx 配置意图：

- HTTP `80` 跳转 HTTPS。
- `/health` 代理到 `127.0.0.1:8088/health`。
- `/ws` 代理到 `127.0.0.1:31300`，并保留 WebSocket Upgrade。
- `/` 代理到 `127.0.0.1:8088`。

安装脚本会备份 `/etc/nginx/sites-available/default`，替换为仓库中的配置，执行 `nginx -t` 后 reload。

### 12.3 前端构建部署

生产环境修改前端后执行：

```bash
npm run build
systemctl restart wsmud2
```

`npm run build` 会清空并重建 `www/`。如果只改服务端或 `world/` 内容，通常不需要重新构建前端。

运营后台首次部署需要同时包含前端构建、`api/admin.js` 和 `world/extends/admin_*.js`，因此必须重启一次 `wsmud2`。后台启用后，日常公告和系统邮件操作直接通过 `/admin.html` 完成，不再为内容发布重启服务。

## 13. 常见修改入口

| 需求 | 主要文件 |
| --- | --- |
| 修改登录/注册 API | `api/user.js`、`api/base.js` |
| 修改运营管理后台 | `src/admin.*`、`src/styles/admin.css`、`api/admin.js`、`world/extends/admin_*.js` |
| 修改服务器列表 | `api/game.js`、`data/sql.js`、`config.js` |
| 修改前端登录页 | `src/login/*` |
| 修改游戏主界面 | `src/game/main.js`、`src/process.js`、`src/dialog/*` |
| 修改 WebSocket 连接策略 | `src/client.js`、`deploy/ruox.top.nginx.conf` |
| 新增玩家命令 | `world/cmd/*` |
| 修改地图移动 | `world/cmd/action/go.js`、`world/map/*` |
| 修改战斗计算 | `world/extends/char/combat.js`、`world/extends/char/user.js` |
| 修改玩家属性公式 | `world/extends/char/user.js` |
| 修改打坐 | `world/cmd/action/dazuo.js` |
| 修改自动师门/追捕的任务间恢复 | `world/extends/auto_recovery.js`、`world/task/family_ring.js`、`world/task/ym_task2.js`、`world/cmd/action/liaoshang.js`、`world/cmd/action/dazuo.js`、`src/dialog/extend.js` |
| 修改技能效果 | `world/skill/*`、`world/extends/skill/*` |
| 新增物品/装备/药品 | `world/obj/*` |
| 修改门派 | `world/family/*`、`world/extends/skill/family.js` |
| 修改师门环任务、门派套装或商城功绩页 | `world/task/family_ring.js`、`world/extends/family_task.js`、`world/obj/eq/family.js`、`world/cmd/dialog/shop.js`、`world/cmd/dialog/family_shop.js`、`world/npc/pub/mpguanli.js`、`src/dialog/shop.js` |
| 修改山海异兽随机投放活动 | `world/task/shanhai_event.js`、`world/npc/pub/shanhai_beast.js`、`world/obj/money/shanhai_exp.js` |
| 修改全局数据保存 | `world/extends/data.js`、`os/data.js` |
| 修改底层存档 | `data/sql.js`、`os/util/data.js` |

## 14. 开发和验证流程

### 14.1 前端修改

```bash
npm run dev
```

浏览器访问 Vite 开发服务，默认端口 `3333`。如果要验证生产构建：

```bash
npm run build
npm run web
```

### 14.2 服务端修改

语法检查：

```bash
node --check web.js
node --check main.js
```

局部启动：

```bash
npm run web
npm run os
```

完整启动：

```bash
npm start
```

### 14.3 游戏内容修改

推荐流程：

1. 修改 `world/*` 或 `world/extends/*`。
2. 用管理员账号进入游戏。
3. 执行 `SendCommand("update <path>")` 热更新。
4. 在游戏内验证命令、战斗、地图、UI 事件。
5. 必要时重启服务，确认启动加载无报错。
6. 观察 `journalctl -u wsmud2 -f` 或控制台输出。

自制装备相关改动还应执行：

```bash
npm run validate:custom-equipment
npm run validate:custom-equipment-ui -- http://127.0.0.1:3333/
```

### 14.4 数据修改

生产数据修改前：

1. 停止服务或确认不会触发保存覆盖。
2. 备份 `data/database.db` 和 `data/<serverId>/`。
3. 修改后启动服务。
4. 登录角色验证。
5. 检查日志是否有存档失败。

## 15. 已知风险和技术债

### 15.1 全局变量和动态执行

`os/` 和 `world/` 大量依赖全局变量，并通过 `vm.compileFunction()`、`new Function()` 动态执行脚本。优点是接近 MUD 热更新开发方式，缺点是类型边界弱、调试成本高、静态分析困难。

### 15.2 非严格 JSON 协议

游戏服务下发给前端的对象消息不是严格 JSON，前端使用 `new Function()` 解析。这对可信内网/同项目服务可运行，但不适合接收不可信服务端数据。

### 15.3 自定义 WebSocket

项目没有使用 `ws` 等成熟库，而是自行实现握手和帧解析。该实现能满足现有游戏需求，但需要谨慎处理代理、超时、大包、异常断线和协议兼容。

### 15.4 会话存储在内存

`web.js` 的 HTTP session 存在进程内存中，重启会丢失。多进程或多机器部署时需要改成外部 session 存储。

### 15.5 密码哈希较弱

当前密码为 MD5 加盐。正式用户系统建议迁移到 bcrypt 或 argon2，并设计兼容旧密码的渐进迁移方案。

### 15.6 旧 API 残留

前端 `src/api.js` 中有旧接口路径，当前 `web.js` 只支持 `/api/:class/:method` 和 `/sse/:class/:method`。清理或迁移前应先确认这些旧方法是否仍被 UI 调用。

### 15.7 测试覆盖不足

`package.json` 中 `npm test` 仍是占位命令。项目缺少自动化测试。建议至少补充：

- API 登录/注册/服务器列表测试。
- 数据库初始化测试。
- 关键命令测试。
- 前端构建测试。
- WebSocket 登录和基本命令 smoke test。

## 16. 维护建议

- 保持 `os/` 稳定，把玩法改动放到 `world/`。
- 所有线上数据变更先备份 SQLite 和 `data/<serverId>/`。
- 前端构建后确认 `www/index.html` 引用的 bundle 是最新产物。
- 改 WebSocket 或 Nginx 后必须验证 HTTPS 下 `/ws` 是否能正常连接。
- 改登录凭证、密码、cookie 逻辑时，要同时验证 HTTP 登录和 WebSocket 角色进入。
- 新增属性时，同步检查 `os/const.js`、角色保存字段、装备/技能属性聚合、前端属性展示。
- 新增命令时设置好 `allow_level`、战斗/忙乱/死亡状态限制，避免普通玩家误用管理能力。
- 热更新失败时优先重启游戏进程，避免缓存对象和新脚本状态不一致。

## 17. 建议的后续整理

如果后续要继续工程化，建议按优先级处理：

1. 给 README 保留快速启动，把本文档作为完整维护手册。
2. 给 `.env` 增加 `.env.example`，避免泄露真实密钥。
3. 清理 `src/api.js` 中已不用的旧接口。
4. 把 WebSocket 对象消息逐步改为严格 JSON，再替换前端 `new Function()`。
5. 给账号、角色、服务器列表、WebSocket 登录补基础测试。
6. 如果计划改造成 React，先保留 `src/client.js`、`src/process.js` 的协议层，再逐步替换 UI 层。
