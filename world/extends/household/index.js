/*
 * 武道家族经营服务。家族数据独立于 follower 的战斗属性和 temp，
 * 通过用户存档包装持久化，所有在线/离线生产都从这里统一结算。
 */
(function () {
    const MAX_OFFLINE = 72 * 60 * 60 * 1000;
    const MAX_LEDGER = 60;
    const JOBS = {
        mining: {
            name: "挖矿", facility: "mine", period: 60 * 60 * 1000,
            base: 1, member: 0.65, product: "ore", material: "tool",
            event: "矿脉", outputName: "矿石"
        },
        planting: {
            name: "种植", facility: "garden", period: 2 * 60 * 60 * 1000,
            base: 1, member: 0.85, product: "herb", material: "seed",
            event: "收成", outputName: "药材"
        },
        alchemy: {
            name: "炼药", facility: "alchemy", period: 3 * 60 * 60 * 1000,
            base: 1, member: 0.55, product: "pill", material: "herb",
            event: "药炉", outputName: "丹药"
        },
        teaching: {
            name: "授课", facility: "school", period: 4 * 60 * 60 * 1000,
            base: 1, member: 0.45, product: "tuition", material: "宣传费",
            event: "学员", outputName: "学费"
        }
    };
    const JOB_ALIASES = {
        wk: "mining", kuang: "mining", mining: "mining", 挖矿: "mining",
        caiyao: "planting", planting: "planting", plant: "planting", 种植: "planting", 采药: "planting",
        lianyao: "alchemy", alchemy: "alchemy", 炼药: "alchemy",
        teaching: "teaching", teach: "teaching", wuguan: "teaching", 授课: "teaching", 武馆: "teaching"
    };
    const FACILITY_NAMES = {
        main: "主屋", warehouse: "仓库", mine: "矿场", garden: "药圃",
        alchemy: "炼药房", school: "武馆", training: "练功房", rest: "休息设施"
    };
    const FACILITY_UNLOCK = {
        main: 1, warehouse: 1, garden: 1, rest: 1, training: 2,
        mine: 1, alchemy: 2, school: 3
    };
    const LEVELS = [
        { members: 0, capacity: 0 },
        { members: 1, capacity: 30 },
        { members: 3, capacity: 70 },
        { members: 5, capacity: 150 },
        { members: 7, capacity: 280 },
        { members: 10, capacity: 480 }
    ];
    const STARTER_RESOURCES = { tool: 3, seed: 3, herb: 3, "宣传费": 3 };
    const STARTER_GRANT_VERSION = 1;
    // 有时限派遣：默认 2 个生产周期，玩家可指定 1-8 个。
    const DEFAULT_CYCLES = 2;
    const MAX_CYCLES = 8;
    // 派工后随从进驻的场所；休息与待命都留在院子里，避免卧室的既有交互。
    const JOB_STATUS = { mining: "挖矿中", planting: "种植中", alchemy: "炼药中", teaching: "授课中" };
    const JOB_ROOMS = {
        mining: "home/kuangchang",
        planting: "home/yaopu",
        alchemy: "home/lianyao",
        teaching: "home/wuguan"
    };
    const IDLE_ROOM = "home/yuanzi";
    // 领地扩建：住宅等级达到要求后，对应房间才出现在领地地图与出口中。
    // 炼药房属于住宅基础房间（存量玩家在用实时炼药），不设房间门槛，只限派工门槛。
    const ROOM_UNLOCK = {
        "home/kuangchang": 1,
        "home/yaopu": 1,
        "home/wuguan": 3,
        "home/xuetang": 3,
        "home/gongfang": 4
    };
    const PRODUCT_OBJECTS = {
        ore: "res/kuang#0",
        herb: "res/cao#0",
        pill: "drug/yao#0"
    };
    // 面板与提示统一使用中文品名，避免把协议 key 直接暴露给玩家。
    const GOODS_LABELS = { ore: "矿石", herb: "药材", pill: "丹药", tuition: "学费", tool: "工具", seed: "种子", "宣传费": "宣传费" };
    // 家族内部经济：材料买入与产物卖出的参考价（家族资金·两）。
    // 卖出价约为订单单价的六到七成，让订单仍是首选出货渠道。
    const MATERIAL_PRICES = { tool: 50, seed: 30, herb: 40, "宣传费": 20 };
    const SELL_PRICES = { ore: 35, herb: 25, pill: 90 };
    const GOODS_ALIASES = {
        tool: "tool", "工具": "tool", "铁镐": "tool",
        seed: "seed", "种子": "seed",
        herb: "herb", "药材": "herb",
        "宣传费": "宣传费",
        ore: "ore", "矿石": "ore",
        pill: "pill", "丹药": "pill",
        tuition: "tuition", "学费": "tuition"
    };
    const ACHIEVEMENTS = {
        first_collect: { name: "首次收获", type: "collect", target: 1, rewardFunds: 100 },
        output_100: { name: "百工之始", type: "output", target: 100, rewardReputation: 20 },
        order_1: { name: "首张订单", type: "order", target: 1, rewardFunds: 300 },
        member_level_5: { name: "良才可造", type: "member_level", target: 5, rewardReputation: 50 },
        facility_level_3: { name: "百业俱兴", type: "facility_level", target: 3, rewardFunds: 500 }
    };

    function number(value, fallback) {
        return Number.isFinite(Number(value)) ? Number(value) : fallback;
    }

    function queryHome(user) {
        if (!user) return 0;
        if (typeof user.query_temp === "function") return number(user.query_temp("home", 0), 0);
        return number(user.temp && user.temp.home, 0);
    }

    function newHousehold(level) {
        const safeLevel = Math.max(0, Math.min(5, number(level, 0)));
        const facilities = {};
        Object.keys(FACILITY_NAMES).forEach(function (id) {
            facilities[id] = { level: safeLevel > 0 && FACILITY_UNLOCK[id] <= safeLevel ? 1 : 0, durability: 100 };
        });
        return {
            version: 1,
            level: safeLevel,
            exp: 0,
            reputation: 0,
            renown: 0,
            funds: 0,
            treasury: 0,
            upkeepDue: 0,
            rooms: {},
            facilities: facilities,
            members: {},
            tasks: {},
            queue: [],
            warehouse: { materials: {}, products: {}, capacity: LEVELS[safeLevel].capacity, ledger: [] },
            pendingRewards: {},
            achievements: {},
            events: [],
            orders: [],
            stats: { collected: 0, ordersCompleted: 0 },
            playerBenefits: { withdrawn: 0, training: 0 },
            lastTickAt: 0,
            starterGranted: false,
            starterGrantVersion: 0
        };
    }

    function normalizeHousehold(h, level) {
        if (!h || typeof h !== "object") h = newHousehold(level);
        h.version = number(h.version, 1);
        h.level = Math.max(0, Math.min(5, number(h.level, level)));
        h.exp = Math.max(0, number(h.exp, 0));
        h.reputation = Math.max(0, number(h.reputation, number(h.renown, 0)));
        h.renown = h.reputation;
        h.funds = Math.max(0, number(h.funds, number(h.treasury, 0)));
        h.treasury = h.funds;
        h.upkeepDue = Math.max(0, number(h.upkeepDue, 0));
        h.rooms = h.rooms && typeof h.rooms === "object" ? h.rooms : {};
        h.facilities = h.facilities && typeof h.facilities === "object" ? h.facilities : {};
        Object.keys(FACILITY_NAMES).forEach(function (id) {
            const item = h.facilities[id] && typeof h.facilities[id] === "object" ? h.facilities[id] : {};
            item.level = Math.max(0, number(item.level, FACILITY_UNLOCK[id] <= h.level ? 1 : 0));
            item.durability = Math.max(0, Math.min(100, number(item.durability, 100)));
            h.facilities[id] = item;
        });
        h.members = h.members && typeof h.members === "object" ? h.members : {};
        h.tasks = h.tasks && typeof h.tasks === "object" ? h.tasks : {};
        h.queue = Array.isArray(h.queue) ? h.queue : [];
        h.warehouse = h.warehouse && typeof h.warehouse === "object" ? h.warehouse : {};
        h.warehouse.materials = h.warehouse.materials && typeof h.warehouse.materials === "object" ? h.warehouse.materials : {};
        h.warehouse.products = h.warehouse.products && typeof h.warehouse.products === "object" ? h.warehouse.products : {};
        h.warehouse.capacity = Math.max(0, number(h.warehouse.capacity, LEVELS[h.level].capacity));
        h.warehouse.ledger = Array.isArray(h.warehouse.ledger) ? h.warehouse.ledger : [];
        h.pendingRewards = h.pendingRewards && typeof h.pendingRewards === "object" ? h.pendingRewards : {};
        h.achievements = h.achievements && typeof h.achievements === "object" ? h.achievements : {};
        h.events = Array.isArray(h.events) ? h.events : [];
        h.orders = Array.isArray(h.orders) ? h.orders : [];
        h.stats = h.stats && typeof h.stats === "object" ? h.stats : {};
        h.stats.collected = Math.max(0, number(h.stats.collected, 0));
        h.stats.ordersCompleted = Math.max(0, number(h.stats.ordersCompleted, 0));
        h.playerBenefits = h.playerBenefits && typeof h.playerBenefits === "object" ? h.playerBenefits : {};
        h.playerBenefits.withdrawn = Math.max(0, number(h.playerBenefits.withdrawn, 0));
        h.playerBenefits.training = Math.max(0, number(h.playerBenefits.training, 0));
        h.lastTickAt = Math.max(0, number(h.lastTickAt, 0));
        h.starterGrantVersion = Math.max(0, number(h.starterGrantVersion, 0));
        h.starterGranted = !!h.starterGranted;
        return h;
    }

    function memberFor(user, id) {
        const h = user && user.household;
        return h && h.members && h.members[id];
    }

    function stableAptitude(id) {
        let score = 0;
        for (let i = 0; i < String(id).length; i++) score = (score + String(id).charCodeAt(i) * (i + 3)) % 41;
        return 20 + score;
    }

    function syncMembers(user, h) {
        const followers = Array.isArray(user.follower) ? user.follower : [];
        const live = {};
        for (const item of followers) {
            if (!item || !item.id) continue;
            const follower = typeof FOLLOWER !== "undefined" && FOLLOWER.GET
                ? FOLLOWER.GET(user, { id: item.id }) : item;
            live[item.id] = true;
            const old = h.members[item.id] || {};
            h.members[item.id] = {
                followerId: item.id,
                job: old.job || null,
                name: old.name || (follower && follower.name) || item.name || item.id,
                jobLevel: Math.max(1, number(old.jobLevel, 1)),
                jobExp: Math.max(0, number(old.jobExp !== undefined ? old.jobExp : old.exp, 0)),
                aptitude: Math.max(0, number(old.aptitude, stableAptitude(item.id))),
                traits: Array.isArray(old.traits) && old.traits.length ? old.traits.slice(0, 4) : [stableAptitude(item.id) > 45 ? "勤勉" : "谨慎"],
                fatigue: Math.max(0, Math.min(100, number(old.fatigue, 0))),
                mood: Math.max(0, Math.min(100, number(old.mood, 70))),
                loyalty: Math.max(0, Math.min(100, number(old.loyalty, 50))),
                status: old.status || "idle",
                since: Math.max(0, number(old.since, 0)),
                milestones: old.milestones && typeof old.milestones === "object" ? old.milestones : {},
                history: Array.isArray(old.history) ? old.history.slice(-20) : [],
                lifetimeOutput: old.lifetimeOutput && typeof old.lifetimeOutput === "object" ? old.lifetimeOutput : {}
            };
        }
        Object.keys(h.members).forEach(function (id) {
            if (!live[id]) {
                const member = h.members[id];
                if (member.status !== "working") member.status = "unavailable";
            }
        });
    }

    function warehouseCount(h) {
        let count = 0;
        [h.warehouse.materials, h.warehouse.products].forEach(function (bucket) {
            Object.keys(bucket).forEach(function (key) { count += Math.max(0, number(bucket[key], 0)); });
        });
        return count;
    }

    function ledger(h, entry) {
        h.warehouse.ledger.push(Object.assign({ at: Date.now() }, entry));
        if (h.warehouse.ledger.length > MAX_LEDGER) h.warehouse.ledger.splice(0, h.warehouse.ledger.length - MAX_LEDGER);
    }

    function bucketFor(h, key) {
        if (Object.prototype.hasOwnProperty.call(h.warehouse.materials, key)) return h.warehouse.materials;
        if (Object.prototype.hasOwnProperty.call(h.warehouse.products, key)) return h.warehouse.products;
        return h.warehouse.products;
    }

    function bucketCount(h, key) {
        return Math.max(0, number(h.warehouse.materials[key], 0))
            + Math.max(0, number(h.warehouse.products[key], 0));
    }

    function removeFromWarehouse(h, key, count) {
        let remaining = Math.max(0, number(count, 0));
        if (!(remaining > 0)) return 0;
        for (const bucket of [h.warehouse.products, h.warehouse.materials]) {
            const available = Math.max(0, number(bucket[key], 0));
            const take = Math.min(available, remaining);
            if (take > 0) {
                bucket[key] = available - take;
                remaining -= take;
            }
            if (!(remaining > 0)) break;
        }
        return Math.max(0, number(count, 0)) - remaining;
    }

    function createOrder(h, jobName) {
        const job = JOBS[jobName];
        if (!job) return null;
        // 同岗活跃订单上限 = 设施等级：升级设施能同时挂更多订单，出货通道随成长扩容。
        const facility = h.facilities[job.facility] || {};
        const limit = Math.max(1, number(facility.level, 1));
        const active = h.orders.filter(function (order) {
            return order && (order.status === "offered" || order.status === "accepted") && order.job === jobName;
        }).length;
        if (active >= limit) return null;
        const order = {
            id: "order_" + Date.now().toString(36) + "_" + jobName,
            job: jobName,
            product: job.product,
            count: 3 + (h.level >= 3 ? 1 : 0),
            rewardFunds: 120 + h.level * 40,
            rewardReputation: 5 + h.level,
            status: "offered",
            createdAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
        };
        h.orders.push(order);
        if (h.orders.length > 30) h.orders.splice(0, h.orders.length - 30);
        return order;
    }

    function maybeCreateOrder(h, task) {
        if (!task || task.base || task.cycles <= 0 || task.cycles % 4 !== 0) return;
        createOrder(h, task.job);
    }

    function achievementState(h, id) {
        const def = ACHIEVEMENTS[id];
        if (!def) return null;
        const current = h.achievements[id];
        if (current && typeof current === "object") return current;
        if (current) {
            h.achievements[id] = { completedAt: current, claimed: true, progress: def.target };
            return h.achievements[id];
        }
        h.achievements[id] = { progress: 0, claimed: false };
        return h.achievements[id];
    }

    function markAchievement(h, id, progress) {
        const def = ACHIEVEMENTS[id];
        if (!def) return;
        const state = achievementState(h, id);
        if (!state.completedAt) state.progress = Math.max(number(state.progress, 0), Math.min(def.target, number(progress, 0)));
        if (state.progress >= def.target && !state.completedAt) {
            state.completedAt = Date.now();
            state.claimed = false;
        }
    }

    function updateAchievements(h) {
        markAchievement(h, "first_collect", h.stats.collected);
        markAchievement(h, "output_100", h.stats.collected);
        markAchievement(h, "order_1", h.stats.ordersCompleted);
        let maxMemberLevel = 0;
        Object.keys(h.members).forEach(function (id) { maxMemberLevel = Math.max(maxMemberLevel, number(h.members[id].jobLevel, 1)); });
        markAchievement(h, "member_level_5", maxMemberLevel);
        let maxFacilityLevel = 0;
        Object.keys(h.facilities).forEach(function (id) { maxFacilityLevel = Math.max(maxFacilityLevel, number(h.facilities[id].level, 0)); });
        markAchievement(h, "facility_level_3", maxFacilityLevel);
    }

    function addPending(task, key, count) {
        if (!(count > 0)) return;
        if (!task.pendingOutput || typeof task.pendingOutput !== "object") task.pendingOutput = {};
        task.pendingOutput[key] = number(task.pendingOutput[key], 0) + count;
    }

    function consumeMaterial(h, key) {
        // 材料优先从材料桶扣，不足时扣产物桶，让"种植药材→炼药"这类内部循环成立。
        for (const bucket of [h.warehouse.materials, h.warehouse.products]) {
            const amount = number(bucket[key], 0);
            if (amount > 0) {
                bucket[key] = amount - 1;
                return true;
            }
        }
        return false;
    }

    function hasPendingOutput(task) {
        return Object.keys(task.pendingOutput || {}).some(function (key) {
            return number(task.pendingOutput[key], 0) > 0;
        });
    }

    // 终结任务：有产出转待领取，没有产出直接清理，避免任务列表堆积死记录。
    function retireTask(h, task, at) {
        if (!task) return;
        if (hasPendingOutput(task)) {
            task.status = "awaiting_collect";
            task.stoppedAt = at || Date.now();
        } else {
            delete h.tasks[task.id];
        }
    }

    function settleCycle(h, task, member, job) {
        const facility = h.facilities[job.facility] || { level: 0, durability: 0 };
        const supplied = consumeMaterial(h, job.material);
        if (member && !supplied) {
            task.status = "paused";
            task.reason = "缺少" + (GOODS_LABELS[job.material] || job.material) + "，补充材料后请重新派工。";
            return false;
        }
        // 产量 = 基础 + 成长档位（职业/设施每2级+1、高资质+1、状态佳+1、过劳-1），再乘维护与耐久系数。
        // 档位制保证每次升级都有可感知的收益，不会被取整吞掉。
        const jobLevel = member ? Math.max(1, number(member.jobLevel, 1)) : 1;
        const aptitude = member ? number(member.aptitude, 0) : 0;
        const fatigue = member ? number(member.fatigue, 0) : 0;
        const condition = member ? number(member.mood, 70) - fatigue : 100;
        const facilityLevel = Math.max(1, number(facility.level, 1));
        let amount = job.base
            + Math.floor(jobLevel / 2)
            + Math.floor(facilityLevel / 2)
            + (aptitude >= 55 ? 1 : 0)
            + (condition >= 50 ? 1 : 0)
            - (fatigue >= 60 ? 1 : 0);
        const upkeepPenalty = h.upkeepDue > h.funds ? 0.7 : 1;
        const durabilityPenalty = number(facility.durability, 0) <= 0 ? 0.5 : 1;
        const quality = Math.max(1, Math.floor(amount * upkeepPenalty * durabilityPenalty));
        addPending(task, job.product, quality);        task.quality = Math.max(number(task.quality, 0), quality);
        task.cycles = number(task.cycles, 0) + 1;
        if (member) {
            member.jobExp = number(member.jobExp, 0) + quality * 5;
            member.fatigue = Math.min(100, number(member.fatigue, 0) + 3);
            member.mood = Math.max(0, number(member.mood, 70) - 1);
            member.lifetimeOutput[job.product] = number(member.lifetimeOutput[job.product], 0) + quality;
            while (member.jobExp >= member.jobLevel * 100) {
                member.jobExp -= member.jobLevel * 100;
                member.jobLevel += 1;
                member.milestones["job_" + member.jobLevel] = Date.now();
            }
        }
        facility.durability = Math.max(0, number(facility.durability, 100) - 1);
        h.exp += quality * 2;
        h.upkeepDue += 1;
        if (task.job === "teaching") {
            // 授课只产声望；资金收益走学费凭证（领取后可兑换或交付订单），避免同一周期双重给钱。
            h.reputation += quality;
            ledger(h, { type: "teaching", taskId: task.id, reputation: quality });
        }
        if (task.cycles % 5 === 0) {
            h.events.push({
                id: task.id + "_event_" + task.cycles,
                type: job.event,
                job: task.job,
                taskId: task.id,
                options: ["continue", "invest", "rest"],
                choice: "继续经营或调整岗位",
                createdAt: Date.now(),
                handled: false
            });
            if (h.events.length > 30) h.events.splice(0, h.events.length - 30);
        }
        maybeCreateOrder(h, task);
        return true;
    }

    const HOUSEHOLD = globalThis.HOUSEHOLD || {};
    HOUSEHOLD.VERSION = 1;
    HOUSEHOLD.MAX_OFFLINE = MAX_OFFLINE;
    HOUSEHOLD.JOBS = JOBS;
    HOUSEHOLD.JOB_STATUS = JOB_STATUS;
    HOUSEHOLD.DEFAULT_CYCLES = DEFAULT_CYCLES;
    HOUSEHOLD.MAX_CYCLES = MAX_CYCLES;
    HOUSEHOLD.ACHIEVEMENTS = ACHIEVEMENTS;
    HOUSEHOLD.PRODUCT_OBJECTS = PRODUCT_OBJECTS;
    function grantStarter(h) {
        if (h.level <= 0 || h.starterGrantVersion >= STARTER_GRANT_VERSION) return;
        h.funds += 500;
        Object.keys(STARTER_RESOURCES).forEach(function (key) {
            h.warehouse.materials[key] = number(h.warehouse.materials[key], 0) + STARTER_RESOURCES[key];
        });
        h.starterGrantVersion = STARTER_GRANT_VERSION;
        h.starterGranted = true;
        ledger(h, { type: "starter", funds: 500, materials: Object.assign({}, STARTER_RESOURCES) });
    }
    function unlockFacilities(h) {
        Object.keys(FACILITY_UNLOCK).forEach(function (id) {
            if (!h.facilities[id]) h.facilities[id] = { level: 0, durability: 100 };
            if (FACILITY_UNLOCK[id] <= h.level && h.facilities[id].level < 1) h.facilities[id].level = 1;
        });
    }
    HOUSEHOLD.ensure = function (user) {
        if (!user) return null;
        const home = queryHome(user);
        let h = normalizeHousehold(user.household, home);
        if (home > h.level) h.level = Math.min(5, home);
        const level = LEVELS[h.level];
        unlockFacilities(h);
        if (!h.warehouse.capacity || h.warehouse.capacity < level.capacity) h.warehouse.capacity = level.capacity;
        syncMembers(user, h);
        grantStarter(h);
        // 生产只由随从任务驱动：存量无人值守任务转终态（已产出的保留待领取），
        // 旧的无限期任务补一个明确的结束时间，到点自然收尾。
        const now = Date.now();
        Object.keys(h.tasks).forEach(function (id) {
            const task = h.tasks[id];
            if (!task) return;
            // 存量清理：已终结且没有待领取产出的任务直接删除。
            if (task.stoppedAt || task.status === "failed" || task.status === "stopped" || task.status === "completed") {
                if (!hasPendingOutput(task)) delete h.tasks[id];
                return;
            }
            if (task.base) {
                if (hasPendingOutput(task)) {
                    task.status = "awaiting_collect";
                    task.stoppedAt = now;
                } else {
                    delete h.tasks[id];
                }
                return;
            }
            if ((task.status === "running" || task.status === "paused") && !task.endAt) {
                const job = JOBS[task.job];
                task.endAt = now + (job ? DEFAULT_CYCLES * job.period : 0);
                task.plannedCycles = number(task.plannedCycles, DEFAULT_CYCLES);
            }
        });
        user.household = h;
        return h;
    };
    HOUSEHOLD.save = function (user) {
        const h = HOUSEHOLD.ensure(user);
        if (!h) return null;
        return JSON.parse(JSON.stringify(h));
    };
    HOUSEHOLD.normalizeJob = function (job) {
        return JOB_ALIASES[String(job || "").toLowerCase()] || null;
    };
    HOUSEHOLD.tick = function (user, now) {
        const h = HOUSEHOLD.ensure(user);
        if (!h) return null;
        now = Math.max(number(now, Date.now()), h.lastTickAt);
        if (!h.lastTickAt) {
            h.lastTickAt = now;
            return h;
        }
        const elapsed = Math.min(MAX_OFFLINE, now - h.lastTickAt);
        if (!(elapsed > 0)) return h;
        let membersChanged = false;
        Object.keys(h.tasks).forEach(function (id) {
            const task = h.tasks[id];
            if (!task || task.stoppedAt || (task.status !== "running" && task.status !== "paused")) return;
            const job = JOBS[task.job];
            if (!job) { task.status = "failed"; task.reason = "未知职业"; return; }
            const endAt = number(task.endAt, 0);
            const until = Math.min(now, h.lastTickAt + MAX_OFFLINE, endAt > 0 ? endAt : now);
            if (task.status === "running" && until > number(task.lastSettledAt, task.startedAt)) {
                const cycles = Math.floor((until - Math.max(h.lastTickAt, number(task.lastSettledAt, task.startedAt))) / job.period);
                if (cycles > 0) {
                    const member = memberFor(user, task.memberId);
                    const start = Math.max(number(task.lastSettledAt, task.startedAt), h.lastTickAt);
                    let settled = 0;
                    for (let i = 0; i < Math.min(cycles, 240); i++) {
                        if (settleCycle(h, task, member, job) === false) break;
                        settled += 1;
                    }
                    task.lastSettledAt = start + settled * job.period;
                }
            }
            if (endAt > 0 && endAt <= now) {
                // 有时限派遣到点：产出保留待领取，无产出直接清理，成员回待命。
                if (hasPendingOutput(task)) {
                    task.status = "awaiting_collect";
                    task.stoppedAt = endAt;
                } else {
                    delete h.tasks[id];
                }
                const member = memberFor(user, task.memberId);
                if (member && member.status === "working") {
                    member.status = "idle";
                    member.job = null;
                    member.since = now;
                    membersChanged = true;
                }
            }
        });
        Object.keys(h.members).forEach(function (id) {
            const member = h.members[id];
            if (!member || member.status !== "resting") return;
            const recovery = Math.floor(elapsed / (60 * 60 * 1000)) * 5;
            if (!(recovery > 0)) return;
            member.fatigue = Math.max(0, number(member.fatigue, 0) - recovery);
            member.mood = Math.min(100, number(member.mood, 70) + recovery);
            if (member.fatigue === 0 && member.mood >= 85) {
                member.status = "idle";
                member.since = now;
                membersChanged = true;
            }
        });
        if (membersChanged) HOUSEHOLD.placeMembers(user);
        h.orders.forEach(function (order) {
            if (!order || order.status === "completed" || order.status === "claimed") return;
            if (number(order.expiresAt, 0) > 0 && order.expiresAt <= now) order.status = "expired";
        });
        updateAchievements(h);
        h.lastTickAt = now;
        h.treasury = h.funds;
        h.renown = h.reputation;
        return h;
    };
    function memberTask(h, followerId) {
        let found = null;
        Object.keys(h.tasks).forEach(function (id) {
            const task = h.tasks[id];
            if (!found && task && task.memberId === followerId && !task.stoppedAt
                && (task.status === "running" || task.status === "paused")) found = task;
        });
        return found;
    }

    function memberStatusText(h, member) {
        if (member.status === "working" && member.job) {
            const task = memberTask(h, member.followerId);
            if (task && task.status === "paused") return "暂停·缺材料";
            return JOB_STATUS[member.job] || "工作中";
        }
        if (member.status === "resting") return "休息中";
        if (member.status === "unavailable") return "已离队";
        return "待命";
    }

    HOUSEHOLD.view = function (user) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return null;
        const now = Date.now();
        const members = {};
        Object.keys(h.members).forEach(function (id) {
            const member = h.members[id];
            const task = memberTask(h, id);
            members[id] = Object.assign({}, member, {
                id: id,
                statusText: memberStatusText(h, member),
                endAt: task ? number(task.endAt, 0) : 0,
                remainMs: task && number(task.endAt, 0) > now ? task.endAt - now : 0
            });
        });
        const tasks = {};
        Object.keys(h.tasks).forEach(function (id) {
            const task = h.tasks[id];
            tasks[id] = Object.assign({}, task, {
                pendingOutput: Object.assign({}, task.pendingOutput || {}),
                remainMs: !task.stoppedAt && number(task.endAt, 0) > now ? task.endAt - now : 0
            });
        });
        return {
            version: h.version, level: h.level, exp: h.exp, reputation: h.reputation, renown: h.reputation,
            funds: h.funds, treasury: h.funds, upkeepDue: h.upkeepDue,
            rooms: Object.assign({}, h.rooms), facilities: JSON.parse(JSON.stringify(h.facilities)),
            members: members, tasks: tasks, warehouse: JSON.parse(JSON.stringify(h.warehouse)),
            pendingRewards: JSON.parse(JSON.stringify(h.pendingRewards)), achievements: Object.assign({}, h.achievements),
            achievementDefs: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
            stats: Object.assign({}, h.stats), playerBenefits: Object.assign({}, h.playerBenefits),
            events: h.events.slice(-10), orders: h.orders.slice(-10), lastTickAt: h.lastTickAt,
            memberSlots: LEVELS[h.level].members, capacity: h.warehouse.capacity,
            jobDefs: JSON.parse(JSON.stringify(JOBS)), defaultCycles: DEFAULT_CYCLES, maxCycles: MAX_CYCLES,
            prices: { buy: Object.assign({}, MATERIAL_PRICES), sell: Object.assign({}, SELL_PRICES) },
            oreTierName: oreTierFor(h).name
        };
    };
    HOUSEHOLD.assign = function (user, followerId, jobName, cycles) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        if (!h.level) return { ok: false, message: "你还没有住宅，请先购买住宅。" };
        const job = HOUSEHOLD.normalizeJob(jobName);
        if (!job || !JOBS[job]) return { ok: false, message: "可安排的岗位只有挖矿、种植、炼药和授课。" };
        const member = memberFor(user, followerId);
        if (!member) return { ok: false, message: "没有找到这名家族成员。" };
        if (member.status === "unavailable") return { ok: false, message: "这名成员已经离队。" };
        const planned = Math.floor(number(cycles, DEFAULT_CYCLES));
        if (!(planned >= 1 && planned <= MAX_CYCLES)) return { ok: false, message: "派遣时长必须是1到" + MAX_CYCLES + "个生产周期。" };
        if (member.status === "resting") return { ok: false, message: member.name + "正在休息中，请先停止休息再派工。" };
        if (number(member.fatigue, 0) >= 80) return { ok: false, message: member.name + "已经非常疲惫，请先安排休息。" };
        const facility = h.facilities[JOBS[job].facility];
        if (!facility || facility.level < FACILITY_UNLOCK[JOBS[job].facility]) return { ok: false, message: "请先升级" + FACILITY_NAMES[JOBS[job].facility] + "。" };
        const roomNeed = ROOM_UNLOCK[JOB_ROOMS[job]] || 0;
        if (roomNeed && h.level < roomNeed) return { ok: false, message: "领地尚未修建" + FACILITY_NAMES[JOBS[job].facility] + "，请先扩建住宅。" };
        if (bucketCount(h, JOBS[job].material) <= 0) {
            return { ok: false, message: "仓库中没有" + (GOODS_LABELS[JOBS[job].material] || JOBS[job].material) + "，请先 household buy " + JOBS[job].material + " 补充。" };
        }
        const slots = LEVELS[h.level].members;
        const running = Object.keys(h.tasks).filter(function (id) {
            const task = h.tasks[id];
            return task && task.memberId && !task.stoppedAt
                && (task.status === "running" || task.status === "paused");
        }).length;
        if (running >= slots && !member.job) return { ok: false, message: "住宅成员岗位已满，请先扩建住宅或停止其他任务。" };
        const started = Date.now();
        Object.keys(h.tasks).forEach(function (id) {
            const oldTask = h.tasks[id];
            if (!oldTask || oldTask.memberId !== followerId || oldTask.stoppedAt) return;
            if (oldTask.status === "running" || oldTask.status === "paused" || oldTask.status === "awaiting_collect") {
                retireTask(h, oldTask, started);
            }
        });
        const id = "job_" + Date.now().toString(36) + "_" + String(followerId).replace(/[^\w-]/g, "");
        h.tasks[id] = {
            id: id, memberId: followerId, job: job, facility: JOBS[job].facility,
            startedAt: started, lastSettledAt: started, endAt: started + planned * JOBS[job].period,
            plannedCycles: planned, input: { [JOBS[job].material]: 1 },
            pendingOutput: {}, status: "running", cycles: 0, quality: 0
        };
        member.job = job;
        member.status = "working";
        member.since = started;
        member.history.push({ at: started, action: "assign", job: job });
        member.history = member.history.slice(-20);
        HOUSEHOLD.placeMembers(user);
        return { ok: true, task: h.tasks[id], cycles: planned, period: JOBS[job].period, jobName: JOBS[job].name, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.stop = function (user, followerId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        let found = false;
        Object.keys(h.tasks).forEach(function (id) {
            const task = h.tasks[id];
            if (!task || task.memberId !== followerId || (task.status !== "running" && task.status !== "paused" && task.status !== "awaiting_collect")) return;
            retireTask(h, task, Date.now());
            found = true;
        });
        const member = memberFor(user, followerId);
        if (member) {
            if (member.status === "resting") found = true;
            member.job = null;
            member.status = "idle";
            member.since = Date.now();
        }
        if (!found) return { ok: false, message: "这名成员当前没有进行中的任务。" };
        HOUSEHOLD.placeMembers(user);
        return { ok: true, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.collect = function (user, taskId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const ids = taskId ? [taskId] : Object.keys(h.tasks);
        let collected = {};
        for (const id of ids) {
            const task = h.tasks[id];
            if (!task || !task.pendingOutput || !Object.keys(task.pendingOutput).length) continue;
            for (const key of Object.keys(task.pendingOutput)) {
                const count = Math.max(0, number(task.pendingOutput[key], 0));
                const room = Math.max(0, h.warehouse.capacity - warehouseCount(h));
                const add = Math.min(count, room);
                if (!(add > 0)) continue;
                const bucket = key === "tuition" ? h.warehouse.products : h.warehouse.products;
                bucket[key] = number(bucket[key], 0) + add;
                task.pendingOutput[key] = count - add;
                collected[key] = number(collected[key], 0) + add;
                h.stats.collected += add;
                ledger(h, { type: "collect", taskId: id, product: key, count: add });
            }
            if (!hasPendingOutput(task)) {
                task.pendingOutput = {};
                if (task.stoppedAt) delete h.tasks[id];
                else task.status = "running";
            }
        }
        if (!Object.keys(collected).length) return { ok: false, message: "没有可领取的产出，或仓库已满。" };
        updateAchievements(h);
        return { ok: true, collected: collected, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.upgrade = function (user, target) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const text = String(target || "");
        if (text === "home" || text === "住宅" || text === "level") {
            if (h.level >= 5) return { ok: false, message: "住宅已达到最高等级。" };
            const cost = h.level * 1000 + 1000;
            if (h.funds < cost) return { ok: false, message: "家族资金不足，需要" + cost + "两。" };
            h.funds -= cost;
            h.level += 1;
            h.warehouse.capacity = Math.max(h.warehouse.capacity, LEVELS[h.level].capacity);
            Object.keys(FACILITY_UNLOCK).forEach(function (id) {
                if (FACILITY_UNLOCK[id] <= h.level && h.facilities[id].level < 1) h.facilities[id].level = 1;
            });
            h.achievements["level_" + h.level] = Date.now();
            const expanded = typeof WORLD !== "undefined" && WORLD.ROOMS
                ? Object.keys(ROOM_UNLOCK).filter(function (path) {
                    return ROOM_UNLOCK[path] === h.level && WORLD.ROOMS[path];
                }).map(function (path) { return WORLD.ROOMS[path].name; })
                : [];
            return { ok: true, expanded: expanded, view: HOUSEHOLD.view(user) };
        }
        const id = text === "仓库" ? "warehouse" : (text === "矿场" ? "mine" : text === "药圃" ? "garden" : text === "炼药房" ? "alchemy" : text === "武馆" || text === "学堂" ? "school" : text);
        if (!FACILITY_NAMES[id]) return { ok: false, message: "未知设施，请查看家族面板中的升级条件。" };
        const facility = h.facilities[id];
        const cost = Math.max(500, (facility.level + 1) * 500);
        if (h.level < FACILITY_UNLOCK[id]) return { ok: false, message: "住宅等级不足，无法升级" + FACILITY_NAMES[id] + "。" };
        if (h.funds < cost) return { ok: false, message: "家族资金不足，需要" + cost + "两。" };
        h.funds -= cost;
        facility.level += 1;
        if (id === "warehouse") h.warehouse.capacity += 20 * facility.level;
        return { ok: true, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.rest = function (user, followerId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        const member = h && memberFor(user, followerId);
        if (!member) return { ok: false, message: "没有找到这名家族成员。" };
        const stoppedAt = Date.now();
        Object.keys(h.tasks).forEach(function (id) {
            const task = h.tasks[id];
            if (!task || task.memberId !== followerId || task.stoppedAt
                || (task.status !== "running" && task.status !== "paused" && task.status !== "awaiting_collect")) return;
            retireTask(h, task, stoppedAt);
        });
        member.fatigue = Math.max(0, member.fatigue - 25);
        member.mood = Math.min(100, member.mood + 15);
        member.status = "resting";
        member.job = null;
        member.since = stoppedAt;
        HOUSEHOLD.placeMembers(user);
        return { ok: true, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.train = function (user, followerId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        const member = h && memberFor(user, followerId);
        if (!member) return { ok: false, message: "没有找到这名家族成员。" };
        if (h.funds < 100) return { ok: false, message: "家族资金不足，需要100两培训费。" };
        h.funds -= 100;
        member.jobExp += 25;
        while (member.jobExp >= member.jobLevel * 100) {
            member.jobExp -= member.jobLevel * 100;
            member.jobLevel += 1;
            member.milestones["job_" + member.jobLevel] = Date.now();
        }
        member.fatigue = Math.min(100, member.fatigue + 5);
        member.history.push({ at: Date.now(), action: "train" });
        return { ok: true, view: HOUSEHOLD.view(user) };
    };

    HOUSEHOLD.payUpkeep = function (user, amount) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const due = Math.max(0, number(h.upkeepDue, 0));
        if (!(due > 0)) return { ok: false, message: "当前没有待缴维护费。" };
        const requested = amount === undefined || amount === null || amount === ""
            ? due : Math.floor(number(amount, NaN));
        if (!(requested > 0)) return { ok: false, message: "维护费数量必须是正整数。" };
        const pay = Math.min(due, requested);
        if (h.funds < pay) return { ok: false, message: "家族资金不足，需要至少" + pay + "两维护费。" };
        h.funds -= pay;
        h.upkeepDue -= pay;
        ledger(h, { type: "upkeep", amount: pay });
        return { ok: true, paid: pay, remaining: h.upkeepDue, view: HOUSEHOLD.view(user) };
    };

    HOUSEHOLD.handleEvent = function (user, eventId, choice) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const event = h.events.find(function (item) { return item && item.id === eventId; });
        if (!event) return { ok: false, message: "没有找到这项家族事件。" };
        if (event.handled) return { ok: false, message: "这项事件已经处理过了。" };
        const selected = String(choice || "continue").toLowerCase();
        if (["continue", "继续", "ignore"].indexOf(selected) >= 0) {
            h.exp += 10;
            event.result = "经营稳定，家族经验增加。";
        } else if (["invest", "投入", "repair"].indexOf(selected) >= 0) {
            if (h.funds < 50) return { ok: false, message: "家族资金不足，投入处理需要50两。" };
            h.funds -= 50;
            const facility = event.job && JOBS[event.job] && h.facilities[JOBS[event.job].facility];
            if (facility) facility.durability = Math.min(100, number(facility.durability, 0) + 15);
            h.reputation += 2;
            event.result = "投入资源后，设施耐久和家族声望得到提升。";
        } else if (["rest", "休息", "pause"].indexOf(selected) >= 0) {
            const task = event.taskId && h.tasks[event.taskId];
            if (task && task.status === "running") task.status = "paused";
            event.result = "相关岗位已暂停，成员可以先休息。";
        } else {
            return { ok: false, message: "可选处理方式：continue、invest 或 rest。" };
        }
        event.choice = selected;
        event.handled = true;
        event.handledAt = Date.now();
        ledger(h, { type: "event", eventId: event.id, choice: selected });
        return { ok: true, event: event, view: HOUSEHOLD.view(user) };
    };

    HOUSEHOLD.acceptOrder = function (user, orderId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const order = h.orders.find(function (item) { return item && item.id === orderId; });
        if (!order) return { ok: false, message: "没有找到这张订单。" };
        if (order.status !== "offered") return { ok: false, message: "这张订单当前不能接取。" };
        order.status = "accepted";
        order.acceptedAt = Date.now();
        return { ok: true, order: order, view: HOUSEHOLD.view(user) };
    };

    HOUSEHOLD.completeOrder = function (user, orderId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const order = h.orders.find(function (item) { return item && item.id === orderId; });
        if (!order) return { ok: false, message: "没有找到这张订单。" };
        if (order.status !== "accepted") return { ok: false, message: "请先接取订单，或订单已经完成。" };
        if (bucketCount(h, order.product) < order.count) return { ok: false, message: "仓库中的" + (GOODS_LABELS[order.product] || order.product) + "不足，需要" + order.count + "份。" };
        const consumed = removeFromWarehouse(h, order.product, order.count);
        if (consumed !== order.count) return { ok: false, message: "订单材料扣除失败，请稍后重试。" };
        h.funds += Math.max(0, number(order.rewardFunds, 0));
        h.reputation += Math.max(0, number(order.rewardReputation, 0));
        h.stats.ordersCompleted += 1;
        order.status = "completed";
        order.completedAt = Date.now();
        ledger(h, { type: "order", orderId: order.id, product: order.product, count: order.count, funds: order.rewardFunds });
        updateAchievements(h);
        return { ok: true, order: order, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.claimOrder = HOUSEHOLD.completeOrder;
    HOUSEHOLD.order = function (user, action, orderId) {
        action = String(action || "list").toLowerCase();
        if (action === "accept" || action === "take") return HOUSEHOLD.acceptOrder(user, orderId);
        if (action === "complete" || action === "deliver" || action === "claim") return HOUSEHOLD.completeOrder(user, orderId);
        const h = HOUSEHOLD.tick(user, Date.now());
        return h ? { ok: true, orders: h.orders.slice(-10), view: HOUSEHOLD.view(user) } : { ok: false, message: "家族数据不可用。" };
    };

    HOUSEHOLD.claimAchievement = function (user, achievementId) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        updateAchievements(h);
        const def = ACHIEVEMENTS[achievementId];
        const state = h.achievements[achievementId];
        if (!def || !state || !state.completedAt) return { ok: false, message: "该成就尚未完成。" };
        if (state.claimed) return { ok: false, message: "该成就奖励已经领取。" };
        h.funds += Math.max(0, number(def.rewardFunds, 0));
        h.reputation += Math.max(0, number(def.rewardReputation, 0));
        state.claimed = true;
        state.claimedAt = Date.now();
        ledger(h, { type: "achievement", achievementId: achievementId });
        return { ok: true, rewardFunds: def.rewardFunds || 0, rewardReputation: def.rewardReputation || 0, view: HOUSEHOLD.view(user) };
    };

    // 矿场等级决定领取的矿石档位：Lv1铁矿石、Lv2赤铜矿、Lv3寒铁矿、Lv4起玄金矿。
    // 星纹矿及以上保留给后续高级矿脉玩法。
    const ORE_TIERS = [
        { tier: 0, name: "铁矿石" },
        { tier: 1, name: "赤铜矿" },
        { tier: 2, name: "寒铁矿" },
        { tier: 3, name: "玄金矿" }
    ];

    function oreTierFor(h) {
        const mineLevel = Math.max(1, number(h.facilities.mine && h.facilities.mine.level, 1));
        return ORE_TIERS[Math.max(0, Math.min(ORE_TIERS.length - 1, mineLevel - 1))];
    }

    HOUSEHOLD.withdraw = function (user, key, count) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        key = String(key || "");
        const take = Math.floor(number(count, 1));
        if (!(take > 0)) return { ok: false, message: "领取数量必须是正整数。" };
        if (key === "tuition") {
            const removed = removeFromWarehouse(h, key, take);
            if (removed !== take) return { ok: false, message: "仓库中的学费凭证不足。" };
            h.funds += removed * 20;
            h.playerBenefits.withdrawn += removed;
            ledger(h, { type: "redeem", product: key, count: removed, funds: removed * 20 });
            return { ok: true, key: key, count: removed, funds: removed * 20, view: HOUSEHOLD.view(user) };
        }
        let path = PRODUCT_OBJECTS[key];
        let itemName = null;
        if (key === "ore") {
            const ore = oreTierFor(h);
            path = "res/kuang#" + ore.tier;
            itemName = ore.name;
        }
        if (!path || !user || typeof user.add_obj !== "function") return { ok: false, message: "该产出暂不能直接领取，请用于订单或继续留在家族仓库。" };
        if (typeof user.can_add_obj === "function" && !user.can_add_obj(path, take)) return { ok: false, message: "你的背包空间不足。" };
        const added = user.add_obj(path, take, true);
        if (!added) return { ok: false, message: "领取失败，请检查背包空间。" };
        const removed = removeFromWarehouse(h, key, take);
        if (removed !== take) return { ok: false, message: "仓库扣除失败，请稍后重试。" };
        h.playerBenefits.withdrawn += removed;
        ledger(h, { type: "withdraw", product: key, count: removed, item: itemName });
        return { ok: true, key: key, count: removed, itemName: itemName, view: HOUSEHOLD.view(user) };
    };
    HOUSEHOLD.useProduct = HOUSEHOLD.withdraw;

    HOUSEHOLD.normalizeGoods = function (key) {
        const text = String(key || "").trim();
        if (!text) return null;
        return GOODS_ALIASES[text] || text;
    };

    // 用家族资金补充生产材料，形成"资金→材料→生产→产物→订单/出售→资金"的循环。
    HOUSEHOLD.buy = function (user, key, count) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        key = HOUSEHOLD.normalizeGoods(key);
        const price = key ? MATERIAL_PRICES[key] : 0;
        if (!price) return { ok: false, message: "可购买的材料：工具、种子、药材、宣传费。" };
        const num = Math.floor(number(count, 1));
        if (!(num >= 1 && num <= 99)) return { ok: false, message: "购买数量必须是1到99。" };
        const cost = price * num;
        if (h.funds < cost) return { ok: false, message: "家族资金不足，需要" + cost + "两。" };
        h.funds -= cost;
        h.warehouse.materials[key] = number(h.warehouse.materials[key], 0) + num;
        ledger(h, { type: "buy", material: key, count: num, cost: cost });
        return { ok: true, key: key, count: num, cost: cost, view: HOUSEHOLD.view(user) };
    };

    // 把仓库产物按内部低价出售换家族资金；订单单价更优，优先走订单。
    HOUSEHOLD.sell = function (user, key, count) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        key = HOUSEHOLD.normalizeGoods(key);
        const price = key ? SELL_PRICES[key] : 0;
        if (!price) return { ok: false, message: "可出售的产物：矿石、药材、丹药。" };
        const num = Math.floor(number(count, 1));
        if (!(num >= 1 && num <= 999)) return { ok: false, message: "出售数量必须是1到999。" };
        const owned = bucketCount(h, key);
        if (owned < num) return { ok: false, message: "仓库中的" + (GOODS_LABELS[key] || key) + "只有" + owned + "份。" };
        const removed = removeFromWarehouse(h, key, num);
        if (removed !== num) return { ok: false, message: "出货扣除失败，请稍后重试。" };
        const income = price * removed;
        h.funds += income;
        ledger(h, { type: "sell", product: key, count: removed, income: income });
        return { ok: true, key: key, count: removed, income: income, view: HOUSEHOLD.view(user) };
    };

    // 玩家向家族注入资金：1两家族资金 = 100文玩家货币。
    HOUSEHOLD.donate = function (user, amount) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const num = Math.floor(number(amount, NaN));
        if (!(num >= 1 && num <= 100000)) return { ok: false, message: "存入金额必须是1到100000两。" };
        const pay = num * 100;
        if (!user || typeof user.add_money !== "function" || !user.add_money(-pay)) {
            return { ok: false, message: "你身上的钱不够，存入" + num + "两需要" + pay + "文。" };
        }
        h.funds += num;
        ledger(h, { type: "donate", funds: num, player: user && user.name });
        return { ok: true, funds: num, view: HOUSEHOLD.view(user) };
    };

    HOUSEHOLD.trainPlayer = function (user) {
        const h = HOUSEHOLD.tick(user, Date.now());
        if (!h) return { ok: false, message: "家族数据不可用。" };
        const training = h.facilities.training;
        if (!training || training.level < 1) return { ok: false, message: "请先升级练功房。" };
        if (h.funds < 100) return { ok: false, message: "家族资金不足，需要100两训练费。" };
        h.funds -= 100;
        const exp = 0;
        const pot = 100 + training.level * 25;
        if (user && typeof user.add_exp === "function") user.add_exp(exp, pot, 0);
        else if (user) user.pot = Math.max(0, number(user.pot, 0)) + pot;
        h.playerBenefits.training += 1;
        ledger(h, { type: "player_training", pot: pot });
        return { ok: true, pot: pot, view: HOUSEHOLD.view(user) };
    };

    globalThis.HOUSEHOLD = HOUSEHOLD;

    // 协议 key 转中文品名，供命令提示等外部使用。
    HOUSEHOLD.label = function (key) {
        return GOODS_LABELS[key] || key;
    };

    // 供关系面板等外部读取成员的明确状态；返回 null 表示待命。
    HOUSEHOLD.memberStateInfo = function (user, followerId) {        const h = user && user.household;
        const member = h && h.members && h.members[followerId];
        if (!member) return null;
        if (member.status === "working" && member.job) {
            const task = memberTask(h, followerId);
            let title = JOB_STATUS[member.job] || "工作中";
            if (task && task.status === "paused") title = "暂停·缺材料";
            return { title: title, since: number(task && task.startedAt, number(member.since, 0)) };
        }
        if (member.status === "resting") return { title: "休息中", since: number(member.since, 0) };
        return null;
    };

    // 领地与随从进驻：以下方法只做展示与位置，不参与结算数据。
    function userInHome(user) {
        return !!(user && user.environment && user.environment.parent && user.environment.parent.id === "home");
    }

    function copyRoomFor(user, roomPath) {
        if (typeof WORLD === "undefined" || !WORLD.ROOMS || !WORLD.ROOMS[roomPath]) return null;
        if (!userInHome(user)) return null;
        return WORLD.ROOMS[roomPath].query_copy(user.id) || null;
    }

    HOUSEHOLD.roomUnlocked = function (user, roomPath) {
        const need = ROOM_UNLOCK[roomPath];
        if (!need) return true;
        const h = user && user.household;
        if (!h) return true;
        return number(h.level, 0) >= need;
    };

    HOUSEHOLD.filterExits = function (user, exits) {
        const filtered = {};
        Object.keys(exits || {}).forEach(function (dir) {
            const path = exits[dir];
            if (typeof path === "string" && !HOUSEHOLD.roomUnlocked(user, path)) return;
            filtered[dir] = path;
        });
        return filtered;
    };

    HOUSEHOLD.filterMap = function (user, map) {
        if (!Array.isArray(map)) return map;
        const h = user && user.household;
        if (!h) return map;
        return map.filter(function (item) { return !item || HOUSEHOLD.roomUnlocked(user, item.id); });
    };

    // 按成员当前状态把随从实体布置到对应场所：工作中进驻设施，休息与待命留在院子。
    // 玩家不在家园内时跳过，回家时由入口房间钩子重新调用。
    HOUSEHOLD.placeMembers = function (user) {
        const h = user && user.household;
        if (!h || !user.follower || !userInHome(user)) return;
        if (typeof FOLLOWER === "undefined" || !FOLLOWER.GET) return;
        Object.keys(h.members).forEach(function (id) {
            const member = h.members[id];
            if (!member) return;
            const npc = FOLLOWER.GET(user, { id: id });
            if (!npc) return;
            let roomPath = IDLE_ROOM;
            let stateId = null;
            let stateTitle = null;
            if (member.status === "working" && member.job && JOBS[member.job]) {
                roomPath = JOB_ROOMS[member.job] || IDLE_ROOM;
                stateId = "hh_" + member.job;
                stateTitle = JOB_STATUS[member.job];
                if (!HOUSEHOLD.roomUnlocked(user, roomPath)) {
                    roomPath = IDLE_ROOM;
                    stateId = null;
                    stateTitle = null;
                }
            } else if (member.status === "resting") {
                stateId = "hh_rest";
                stateTitle = "休息中";
            }
            if (stateTitle) {
                if (!npc.state || npc.state.id !== stateId) {
                    npc.set_state({
                        id: stateId,
                        type: "work",
                        title: stateTitle,
                        rate: 0x7fffffff,
                        on_enter: function () { },
                        stime: Date.now()
                    });
                }
            } else if (npc.state) {
                npc.set_state(null);
            }
            const room = copyRoomFor(user, roomPath);
            if (!room) return;
            if (npc.environment === room) return;
            if (!npc.hp) npc.hp = 1;
            npc.moveto(room, npc.name + "离开了。", npc.name + "走了过来。");
            if (npc.environment === user.environment && npc.on_master_enter) npc.on_master_enter(user);
        });
    };

    // 对象级兜底：即使命令或旧脚本绕过入口，也不能让家族成员发起战斗。
    if (typeof FOLLOWER !== "undefined" && !FOLLOWER.HOUSEHOLD_COMBAT_GUARD) {
        FOLLOWER.HOUSEHOLD_COMBAT_GUARD = true;
        const oldKill = FOLLOWER.prototype.do_kill;
        const oldBeginAttack = FOLLOWER.prototype.begin_attack;
        FOLLOWER.prototype.do_kill = function (target) {
            if (this.family_member) {
                this.notify("家族成员不参与战斗。");
                return false;
            }
            return oldKill && oldKill.call(this, target);
        };
        FOLLOWER.prototype.begin_attack = function (target, type) {
            if (this.family_member) {
                this.notify("家族成员不参与战斗。");
                return false;
            }
            return oldBeginAttack && oldBeginAttack.call(this, target, type);
        };
    }

    if (typeof USER !== "undefined" && !USER.HOUSEHOLD_STORAGE_HOOK) {
        USER.HOUSEHOLD_STORAGE_HOOK = true;
        const loadData = USER.prototype.loadData;
        const getData = USER.prototype.getData;
        USER.prototype.loadData = function (role) {
            loadData.call(this, role);
            const raw = JSON.toObject(role.data) || {};
            this.household = raw.household;
            HOUSEHOLD.ensure(this);
        };
        USER.prototype.getData = function () {
            HOUSEHOLD.tick(this, Date.now());
            const role = getData.call(this);
            const h = HOUSEHOLD.save(this);
            const data = String(role.data || "");
            const end = data.lastIndexOf("}");
            role.data = end >= 0 ? data.slice(0, end) + ",household:" + JSON.stringify(h) + data.slice(end) : data;
            return role;
        };
    }

})();
