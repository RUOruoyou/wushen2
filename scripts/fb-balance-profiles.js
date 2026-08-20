"use strict";

function profile(lower, upper, requirements) {
    return {
        lower,
        upper,
        requirements: requirements || {}
    };
}

module.exports = {
    runsPerCell: 20,
    tiers: ["under", "lower", "upper"],
    archetypes: ["output", "defense", "sustain"],
    metrics: [
        "completed",
        "bossDurationMs",
        "routeDurationMs",
        "deathPoint",
        "consumables",
        "revives",
        "missRate"
    ],
    profiles: {
        taohuadao: {
            normal: profile({ gj: 13000, mz: 13000 }, { gj: 14000, mz: 14000 }),
            hard: profile({ gj: 15000, mz: 15000 }, { gj: 16000, mz: 16000 })
        },
        baituo: {
            normal: profile({ gj: 14000, mz: 13000 }, { gj: 15400, mz: 14300 })
        },
        xingxiu: {
            normal: profile({ gj: 14000, mz: 14000 }, { gj: 15400, mz: 15400 })
        },
        binghuo: {
            normal: profile({ gj: 14000, mz: 14000 }, { gj: 15000, mz: 15000 }),
            hard: profile({ gj: 26000, mz: 23000 }, { gj: 27000, mz: 24000 })
        },
        yihuagong: {
            normal: profile({ gj: 15000, mz: 14200 }, { gj: 19000, mz: 19000 }),
            hard: profile({ gj: 24000, mz: 23000 }, { gj: 32000, mz: 30000 })
        },
        yanziwu: {
            normal: profile({ gj: 25000, mz: 25000, maxMp: 750000 }, { gj: 33000, mz: 30000, maxMp: 1050000 }),
            hard: profile({ gj: 41000, mz: 33000, maxMp: 1800000 }, { gj: 45100, mz: 36300, maxMp: 2000000 })
        },
        heimuya: {
            normal: profile({ gj: 42000, mz: 33000, zj: 16000 }, { gj: 46200, mz: 36300, zj: 34000 }),
            hard: profile({ gj: 50000, mz: 40000, zj: 23000 }, { gj: 55000, mz: 45000, zj: 47000 })
        },
        piaomiaofeng: {
            normal: profile({ gj: 33000, mz: 30000, ds: 9000 }, { gj: 36300, mz: 33000, ds: 15000 }, { str: 25, dex: 25, ds: 9000 }),
            hard: profile({ gj: 40000, mz: 36000, ds: 15000 }, { gj: 45000, mz: 40000, ds: 16500 }, { str: 25, dex: 25, ds: 15000 })
        },
        guangmingding: {
            normal: profile({ gj: 43000, mz: 34000, maxHp: 700000 }, { gj: 45000, mz: 39000, maxHp: 770000 })
        },
        tianlongsi: {
            normal: profile({ gj: 45000, mz: 35000, zj: 33000, maxHp: 700000 }, { gj: 47000, mz: 38500, zj: 36300, maxHp: 900000 }),
            hard: profile({ gj: 47000, mz: 35000, zj: 63000, maxHp: 700000 }, { gj: 48000, mz: 40000, zj: 70000, maxHp: 1200000 })
        },
        xuedaomen: {
            normal: profile({ gj: 43000, mz: 37000, maxHp: 2500000 }, { gj: 50000, mz: 50000, maxHp: 2750000 })
        },
        gumu: {
            normal: profile({ gj: 53000, mz: 50000, zj: 100000 }, { gj: 55000, mz: 60000, zj: 110000 }),
            hard: profile({ gj: 89000, mz: 56000, maxHp: 4000000 }, { gj: 98000, mz: 61600, maxHp: 4400000 })
        },
        huashanlunjian: {
            normal: profile({ gj: 52000, mz: 50000 }, { gj: 60000, mz: 55000 }, { orangePublicSkill: 1 })
        },
        xiakedao: {
            normal: {
                routes: {
                    "赏善": profile({ gj: 60000, mz: 100000 }, { gj: 80000, mz: 110000 }, { energy: 60 }),
                    "罚恶": profile({ gj: 80000, mz: 90000 }, { gj: 100000, mz: 110000 }, { energy: 60 })
                }
            }
        },
        jingnian: {
            normal: {
                routes: {
                    "僧王": profile({ gj: 70000, mz: 100000 }, { gj: 80000, mz: 110000 }),
                    "少帅": profile({ gj: 130000, mz: 140000 }, { gj: 143000, mz: 154000 }),
                    "盗帅": profile({ gj: 80000, mz: 100000 }, { gj: 90000, mz: 110000 }, { dodgeSkill: 4000, strength: 9000 })
                }
            },
            hard: {
                routes: {
                    "邪王": profile({ gj: 80000, mz: 110000, maxMp: 3000000 }, { gj: 90000, mz: 121000, maxMp: 4000000 }, { strength: 10000, blockMonks: 3 }),
                    "困难僧王": profile({ gj: 70000, mz: 97000, maxMp: 3000000 }, { gj: 80000, mz: 110000, maxMp: 4000000 })
                }
            }
        },
        cihang: {
            normal: {
                routes: {
                    "浪子": profile({ gj: 120000, mz: 180000 }, { gj: 140000, mz: 190000 }),
                    "国师": profile({ gj: 120000, mz: 180000 }, { gj: 140000, mz: 190000 }, { changshengjue: 1 })
                }
            },
            hard: {
                routes: {
                    "剑魔": profile({ gj: 140000, mz: 180000 }, { gj: 160000, mz: 200000 }),
                    "魔师": profile({ gj: 140000, mz: 180000 }, { gj: 160000, mz: 200000 })
                }
            }
        },
        yinyanggu: {
            normal: {
                routes: {
                    "烛龙": profile({ gj: 130000, mz: 170000, maxHp: 9600000 }, { gj: 143000, mz: 187000, maxHp: 10560000 }, { routeSkill: 1 }),
                    "幽冥": profile({ gj: 130000, mz: 170000 }, { gj: 143000, mz: 187000 }, { changshengjue: 1 })
                }
            }
        },
        zhanshendian: {
            normal: profile({ gj: 150000, mz: 180000 }, { gj: 180000, mz: 220000 }),
            hard: profile({ gj: 150000, mz: 180000, maxMp: 11000000, diffFyPer: 60 }, { gj: 180000, mz: 220000, maxMp: 12000000, diffFyPer: 66 }, { dex: 59, currentMp: 10000000, maxMp: 10000000, redSkillLevel: 5000, redSkillCount: 5 })
        }
    }
};
