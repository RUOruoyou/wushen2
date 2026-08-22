const household_css = `
.dialog-household { height: 100%; overflow-y: auto; padding: 0.5em; box-sizing: border-box; }
.household-summary, .household-section { margin-bottom: 0.6em; padding: 0.6em; background: var(--theme-panel); border: 1px solid var(--theme-border); }
.household-summary { line-height: 1.8; }
.household-section-title { color: var(--theme-accent); font-weight: bold; margin-bottom: 0.4em; }
.household-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(10em, 1fr)); gap: 0.4em; }
.household-cell { padding: 0.35em; border: 1px solid var(--theme-border); background: var(--theme-surface); min-width: 0; }
.household-member, .household-task { margin-top: 0.4em; padding: 0.45em; border-left: 3px solid var(--theme-accent); background: var(--theme-surface); }
.household-muted { color: var(--theme-muted); }
.household-actions { display: flex; flex-wrap: wrap; gap: 0.35em; margin-top: 0.35em; }
.household-actions [cmd] { display: inline-block; padding: 0.3em 0.55em; border: 1px solid var(--theme-border); color: var(--theme-text); background: var(--theme-surface-2); cursor: pointer; }
@media (max-width: 480px) { .household-grid { grid-template-columns: 1fr; } .household-actions [cmd] { flex: 1 1 8em; text-align: center; } }
`;

function amount(bucket, key) {
    return bucket && bucket[key] ? bucket[key] : 0;
}

function format_span(ms) {
    if (!ms || ms <= 0) return "";
    const totalMin = Math.floor(ms / 60000);
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hours > 0) return hours + "小时" + mins + "分";
    return mins + "分钟";
}

const TASK_STATUS_LABELS = { running: "运行中", paused: "已暂停", awaiting_collect: "待领取", stopped: "已停止", completed: "已完成", failed: "失败" };
const ORDER_STATUS_LABELS = { offered: "待接取", accepted: "已接取", completed: "已完成", expired: "已过期", claimed: "已交付" };
const GOODS_LABELS = { ore: "矿石", herb: "药材", pill: "丹药", tuition: "学费", tool: "工具", seed: "种子", "宣传费": "宣传费" };

function goodsLabel(key) {
    return GOODS_LABELS[key] || key;
}

function jobLabel(job, jobDefs) {
    const def = jobDefs && jobDefs[job];
    return (def && def.name) || job || "";
}

function jobHours(job, jobDefs, cycles) {
    const def = jobDefs && jobDefs[job];
    if (!def || !def.period) return "";
    return Math.round(def.period * cycles / 3600000 * 10) / 10;
}

function memberName(id, data) {
    if (data && data.name) return data.name;
    if (typeof Process !== "undefined" && Process.cur_room && Process.cur_room.items) {
        const item = Process.cur_room.items.find(function (x) { return x && x.id === id; });
        if (item) return item.name || id;
    }
    return id;
}

function facilityLabel(id, item) {
    const names = { main: "主屋", warehouse: "仓库", mine: "矿场", garden: "药圃", alchemy: "炼药房", school: "武馆", training: "练功房", rest: "休息设施" };
    return (names[id] || id) + " Lv." + ((item && item.level) || 0) + " / 耐久" + ((item && item.durability) || 0);
}

export default {
    init: function () { Dialog.injectStyle(household_css); },
    createElement: function () { return $("<div class='dialog-household'></div>"); },
    show: function () {
        if (!this.element) this.element = this.createElement();
        this.element.appendTo(Dialog.contentElement);
        this.isShow = true;
        Dialog.title("武道家族");
        Dialog.icon("home");
        SendCommand("household view");
    },
    close: function () { if (this.element) this.element.detach(); this.isShow = false; },
    hide: function () { this.close(); },
    onData: function (message) {
        const data = message.data || message;
        if (!data) return;
        if (Dialog.curItem !== "household") Dialog.select("household");
        if (!this.element) this.element = this.createElement();
        if (this.element.parent()[0] !== Dialog.contentElement[0]) Dialog.contentElement.empty().append(this.element);
        Dialog.title("武道家族");
        Dialog.icon("home");
        this.isShow = true;
        this.data = data;
        this.render();
    },
    render: function () {
        const data = this.data || {};
        const facilities = data.facilities || {};
        const members = data.members || {};
        const tasks = data.tasks || {};
        const warehouse = data.warehouse || {};
        const jobDefs = data.jobDefs || {};
        const defaultCycles = data.defaultCycles || 2;
        const str = [];
        str.push("<div class='household-summary'>");
        str.push("<strong>住宅等级 ", data.level || 0, "</strong>　成员位 ", data.memberSlots || 0, "　仓库容量 ", data.capacity || 0);
        str.push("<br>家族资金 ", data.funds || 0, "两　声望 ", data.reputation || 0, "　待维护 ", data.upkeepDue || 0);
        str.push("<div class='household-actions'><span cmd='household upgrade 住宅'>扩建住宅</span><span cmd='household collect'>领取全部产出</span><span cmd='household upgrade 仓库'>升级仓库</span><span cmd='household pay'>支付维护费</span><span cmd='household playertrain'>练功房训练</span></div></div>");
        str.push("<div class='household-section'><div class='household-section-title'>设施</div><div class='household-grid'>");
        Object.keys(facilities).forEach(function (id) { str.push("<div class='household-cell'>", facilityLabel(id, facilities[id]), "</div>"); });
        str.push("</div><div class='household-actions'><span cmd='household upgrade 矿场'>升级矿场</span><span cmd='household upgrade 药圃'>升级药圃</span><span cmd='household upgrade 炼药房'>升级炼药房</span><span cmd='household upgrade 武馆'>升级武馆</span></div></div>");
        str.push("<div class='household-section'><div class='household-section-title'>家族成员</div>");
        const memberIds = Object.keys(members);
        if (!memberIds.length) str.push("<div class='household-muted'>暂无成员；已有随从会在登录后自动加入家族资料。</div>");
        memberIds.forEach(function (id) {
            const item = members[id] || {};
            const remain = format_span(item.remainMs);
            str.push("<div class='household-member'><strong>", memberName(id, item), "</strong>　", item.statusText || (item.job || "待命"), remain ? "　剩余" + remain : "", "　职业Lv.", item.jobLevel || 1, "<br>资质 ", item.aptitude || 0, "　疲劳 ", item.fatigue || 0, "　心情 ", item.mood || 0, "　忠诚 ", item.loyalty || 0);
            const jobs = [["mining", "挖矿"], ["planting", "种植"], ["alchemy", "炼药"], ["teaching", "授课"]];
            str.push("<div class='household-actions'>");
            jobs.forEach(function (job) {
                str.push("<span cmd='household assign ", id, " ", job[0], " ", defaultCycles, "'>", job[1], "(", jobHours(job[0], jobDefs, defaultCycles), "小时)</span>");
            });
            str.push("<span cmd='household stop ", id, "'>停止</span><span cmd='household rest ", id, "'>休息</span><span cmd='household train ", id, "'>培训</span></div></div>");
        });
        str.push("</div><div class='household-section'><div class='household-section-title'>生产任务</div>");
        const taskIds = Object.keys(tasks);
        if (!taskIds.length) str.push("<div class='household-muted'>暂无生产任务，给家族成员派工后即可开始生产。</div>");
        taskIds.forEach(function (id) {
            const task = tasks[id] || {};
            const output = task.pendingOutput || {};
            const outputText = Object.keys(output).map(function (key) { return goodsLabel(key) + " x" + output[key]; }).join("、") || "暂无待领取产出";
            const taskMember = task.memberId && members[task.memberId];
            const remain = format_span(task.remainMs);
            str.push("<div class='household-task'><strong>", memberName(task.memberId, taskMember), " ", jobLabel(task.job, jobDefs), "</strong>　周期 ", task.cycles || 0, "/", task.plannedCycles || "-", "　状态 ", TASK_STATUS_LABELS[task.status] || task.status || "", remain ? "　剩余" + remain : "", task.reason ? "<br>说明：" + task.reason : "", "<br>待领取：", outputText, "</div>");
        });
        str.push("</div><div class='household-section'><div class='household-section-title'>家族事件</div>");
        const events = Array.isArray(data.events) ? data.events : [];
        if (!events.length) str.push("<div class='household-muted'>暂无待处理事件。</div>");
        events.forEach(function (event) {
            if (!event) return;
            str.push("<div class='household-task'><strong>", event.type || "经营事件", "</strong>　", event.handled ? (event.result || "已处理") : "待处理");
            if (!event.handled) str.push("<div class='household-actions'><span cmd='household event ", event.id, " continue'>维持现状</span><span cmd='household event ", event.id, " invest'>投入资源</span><span cmd='household event ", event.id, " rest'>暂停岗位</span></div>");
            str.push("</div>");
        });
        str.push("</div><div class='household-section'><div class='household-section-title'>订单</div>");
        const orders = Array.isArray(data.orders) ? data.orders : [];
        if (!orders.length) str.push("<div class='household-muted'>暂无订单，持续经营后会有新订单。</div>");
        orders.forEach(function (order) {
            if (!order) return;
            str.push("<div class='household-task'><strong>", goodsLabel(order.product) || "订单", " x", order.count || 0, "</strong>　奖励 ", order.rewardFunds || 0, "两 / 声望", order.rewardReputation || 0, "　状态 ", ORDER_STATUS_LABELS[order.status] || order.status || "");
            if (order.status === "offered") str.push("<div class='household-actions'><span cmd='household order accept ", order.id, "'>接取订单</span></div>");
            if (order.status === "accepted") str.push("<div class='household-actions'><span cmd='household order complete ", order.id, "'>交付订单</span></div>");
            str.push("</div>");
        });
        str.push("</div><div class='household-section'><div class='household-section-title'>成就</div>");
        const defs = data.achievementDefs || {};
        const achievements = data.achievements || {};
        const achievementIds = Object.keys(defs);
        if (!achievementIds.length) str.push("<div class='household-muted'>暂无成就记录。</div>");
        achievementIds.forEach(function (id) {
            const def = defs[id] || {};
            const state = achievements[id] || {};
            str.push("<div class='household-task'><strong>", def.name || id, "</strong>　进度 ", state.progress || 0, "/", def.target || 0, "　");
            if (state.completedAt && !state.claimed) str.push("<span cmd='household achievement claim ", id, "'>领取奖励</span>");
            else str.push(state.claimed ? "已领取" : "进行中");
            str.push("</div>");
        });
        const prices = data.prices || {};
        str.push("</div><div class='household-section'><div class='household-section-title'>仓库</div><div class='household-grid'>");
        Object.keys(warehouse.products || {}).forEach(function (key) {
            const count = amount(warehouse.products, key);
            const oreHint = key === "ore" && data.oreTierName && data.oreTierName !== "铁矿石" ? "　领取为" + data.oreTierName : "";
            str.push("<div class='household-cell'>", goodsLabel(key), " x", count, prices.sell && prices.sell[key] ? "　" + prices.sell[key] + "两/份" : "", oreHint);
            const actions = [];
            if (["ore", "herb", "pill", "tuition"].indexOf(key) >= 0) actions.push("<span cmd='household withdraw ", key, " 1'>领取1份</span>");
            if (prices.sell && prices.sell[key] && count > 0) {
                const sellCount = Math.min(5, count);
                actions.push("<span cmd='household sell ", key, " ", sellCount, "'>出售", sellCount, "份</span>");
            }
            if (actions.length) str.push("<div class='household-actions'>", actions.join(""), "</div>");
            str.push("</div>");
        });
        Object.keys(warehouse.materials || {}).forEach(function (key) {
            str.push("<div class='household-cell'>", goodsLabel(key), " x", amount(warehouse.materials, key), prices.buy && prices.buy[key] ? "　" + prices.buy[key] + "两/份" : "");
            if (prices.buy && prices.buy[key]) str.push("<div class='household-actions'><span cmd='household buy ", key, " 5'>购5份</span></div>");
            str.push("</div>");
        });
        if (!Object.keys(warehouse.products || {}).length && !Object.keys(warehouse.materials || {}).length) str.push("<div class='household-muted'>仓库暂时为空。</div>");
        str.push("</div></div>");
        this.element.html(str.join(""));
        Dialog.footer("");
    }
};
