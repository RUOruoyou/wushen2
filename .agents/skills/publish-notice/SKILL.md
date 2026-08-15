---
name: publish-notice
description: wsmud2 项目玩家公告的拟稿、用户确认、发布、验证与记录完整流程。当用户要求发布玩家公告、拟稿公告、发公告、撤回公告，或功能开发/修复/配置调整完成需要按仓库规范发布面向玩家的公告时使用；涵盖公告格式与内容红线、游戏内 notice 管理命令发布通道、无头浏览器自动发布脚本、发布后验证与开发日志记录。
---

# wsmud2 玩家公告发布流程

## 硬性门槛（违反即停）

1. **未获得用户对公告稿的明确确认前，只拟稿，绝不写入生产公告数据。** 修改稿后需重新确认。
2. 只描述已完成并验证的变化；**不得**把待开发、未验证内容写成已上线。
3. 不暴露代码路径、管理命令、实现细节（如组件名、命令名、文件名）。
4. 仅管理后台内部改动（不改变玩家端界面/玩法/奖励/邮件/存档）无需公告。
5. 不得读取 `.env` 派生管理通道令牌（admin_bridge socket 认证需要 SESSION_SECRET，属密钥红线）；发布一律走游戏内 `notice` 管理命令通道。

## 流程

### 1. 拟稿（四要素）

| 要素 | 约束 |
| --- | --- |
| 标题 | ≤80 字，中文，沿用既有风格如 `【江湖优化】xxx`、`【交互优化】xxx` |
| 摘要 | ≤200 字，一句话说清玩家可感知的变化 |
| 主要更新内容 | 分条列出，只写已完成并验证的变化 |
| 玩家提示 | 操作注意事项（如何关闭/取消、兼容性说明等），没有可省略 |

- 分类 `category`：`update`（默认）/ `activity` / `maintenance` / `system`。
- 正文支持游戏颜色标签（`<hig>` `<hir>` `<yel>` 等）与 `<br>`；其他 HTML 会被服务端转义；换行用 `\n`。
- 语气参考 `docs/开发日志.md` 历史公告与既有游戏文案。

### 2. 交用户确认

完整展示四要素，明确等待授权（如用户回复"确认"）。不得以沉默、跑题回复当作确认。

### 3. 发布

**方式 A（推荐）——自动发布脚本**，管理测试账号由用户提供（账号密码不写入任何文件，脚本经参数或环境变量接收）：

```bash
node .agents/skills/publish-notice/scripts/publish-notice.mjs \
  --user <账号> --pwd <密码> \
  --file /tmp/notice.json
```

`/tmp/notice.json` 示例：

```json
{
  "title": "【交互优化】xxx",
  "summary": "一句话摘要",
  "content": "【主要更新】\n第一条。\n第二条。\n\n【玩家提示】\n提示内容。",
  "category": "update"
}
```

脚本会自动登录 → 定位运行中的游戏服 → 选角色 → 发送 `notice` 命令 → 校验游戏响应 → 在 `data/100/data.js` 中核对公告落库并提取公告 ID，末行输出 JSON 结果。

**方式 B——手动**：用等级 ≥5 的管理员账号登录游戏，输入 `notice {json}`（JSON 同上）或简写 `notice 标题|摘要|内容`（管道符格式不支持 category 与换行，仅应急用）。

### 4. 验证

- 游戏响应包含 `公告已发布并保存。`；失败会返回 `公告发布失败：...` 或权限错误，如实上报，不得重试发布（可能造成重复公告）。
- `data/<serverId>/data.js` 中该标题应只出现一条；记录公告 `id`（`notice_` 开头）。
- 公告创建即为 `active` 并向在线玩家广播，无需二次发布操作。

### 5. 记录

在 `docs/开发日志.md` 对应条目补充发布结果：发布时间、公告 ID、公告总数变化（对照发布前数量）。发布前先用脚本或 `data/100/data.js` 记下当前公告总数。

## 发布链路要点（排查问题时才需要读）

- 发布命令：`world/cmd/admin/notice.js`（游戏内 `notice`，`allow_level: 5`）→ `world/extends/admin_content.js` `createAdminNotice`（长度/标签校验、生成 `notice_` ID、状态 `active`）→ `WORLD.DATA.save()` → `broadcastAdminNotices` 推送在线玩家。
- 登录流程 DOM 选择器（脚本已内置）：`#login_name`/`#login_pwd` → `[command="LoginIn"]` → `#slist_panel` 选运行中的服务器（默认"本地测试1"，对应 127.0.0.1:31300）→ `#role_panel` 首个 `.role-item` → `[command="SelectRole"]` → `.container` 可见且 `Process.player` 存在即进入游戏；发命令用全局 `SendCommand(...)`。
- 无头浏览器环境坑：chromium 调试端口每次随机、profile 目录每次全新、**所有退出路径（含失败抛异常）都要杀掉 chromium**——僵尸实例会占用调试端口，让后续脚本连到旧页面产生灵异现象；`pkill -f` 匹配自身命令行时用 `[r]emote` 括号写法；页面偶发加载失败需导航重试（就绪判定：`typeof globalThis.$ !== "undefined" && document.readyState === "complete"`）。
