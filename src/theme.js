const LIGHT_GRADE_COLORS = {
    grade0: "#687168",
    grade1: "#4f7659",
    grade2: "#46777f",
    grade3: "#8a6d1f",
    grade4: "#7a658f",
    grade5: "#9c663c",
    grade6: "#a14a42"
};

const DARK_GRADE_COLORS = {
    grade0: "#c6cbc7",
    grade1: "#9cc195",
    grade2: "#8ab8c2",
    grade3: "#d6bc77",
    grade4: "#b9a4d6",
    grade5: "#d29e6f",
    grade6: "#df8a82"
};

export const THEME_PRESETS = {
    moyun: {
        name: "墨韵宣纸",
        desc: "宣纸暖灰，松烟墨绿，朱砂作点睛",
        colors: {
            background: "#f5f0e4",
            panel: "#faf6eb",
            surface: "#efe6d2",
            surface2: "#dfd2b6",
            text: "#2e312b",
            muted: "#71695c",
            border: "#d0c2a5",
            accent: "#3f5c4d",
            active: "#a04f37",
            danger: "#9d3b37",
            warning: "#8a671e",
            hp: "#9d3b37",
            mp: "#3f5c4d",
            buttonText: "#f8f3e5",
            ...LIGHT_GRADE_COLORS
        }
    },
    haobai: {
        name: "皓白晴窗",
        desc: "月白窗明，石青幽蓝，留白疏朗",
        colors: {
            background: "#f2f6f7",
            panel: "#fcfefe",
            surface: "#e9eff1",
            surface2: "#d7e0e4",
            text: "#283137",
            muted: "#68777d",
            border: "#c2cfd4",
            accent: "#315e70",
            active: "#3f7268",
            danger: "#9e3f3b",
            warning: "#8a651c",
            hp: "#9e3f3b",
            mp: "#315e70",
            buttonText: "#f8fbfc",
            ...LIGHT_GRADE_COLORS
        }
    },
    zhuxia: {
        name: "朱霞宫墙",
        desc: "宫墙暖赭，朱砂沉着，鎏金一点",
        colors: {
            background: "#f3eadf",
            panel: "#faf2e8",
            surface: "#eadbca",
            surface2: "#dbc3a8",
            text: "#382c27",
            muted: "#79695e",
            border: "#c8ac8b",
            accent: "#8f4c38",
            active: "#8e5427",
            danger: "#9c3733",
            warning: "#8d631d",
            hp: "#9c3733",
            mp: "#3f6a60",
            buttonText: "#faf1e5",
            ...LIGHT_GRADE_COLORS
        }
    },
    songyan: {
        name: "宋式烟岚",
        desc: "山岚灰绿，松烟入纸，远山含黛",
        colors: {
            background: "#edf0e9",
            panel: "#f6f8f2",
            surface: "#e4e8dd",
            surface2: "#d1d6c8",
            text: "#323a34",
            muted: "#69736b",
            border: "#b8beb1",
            accent: "#4d655a",
            active: "#8f6547",
            danger: "#9b3f3b",
            warning: "#88651d",
            hp: "#9b3f3b",
            mp: "#4d655a",
            buttonText: "#f4f6ef",
            ...LIGHT_GRADE_COLORS
        }
    },
    qingci: {
        name: "青瓷月白",
        desc: "青瓷冰裂，水色清透，似月入盏",
        colors: {
            background: "#eef4f0",
            panel: "#f6faf7",
            surface: "#e3ece6",
            surface2: "#d0ded6",
            text: "#293832",
            muted: "#60736b",
            border: "#b7c9bf",
            accent: "#3d6960",
            active: "#8d6748",
            danger: "#9c413b",
            warning: "#88671f",
            hp: "#9c413b",
            mp: "#3d6960",
            buttonText: "#f2f7f4",
            ...LIGHT_GRADE_COLORS
        }
    },
    ruyao: {
        name: "汝窑天青",
        desc: "雨过天青，似玉非玉，温润内敛",
        colors: {
            background: "#edf2f1",
            panel: "#f5f9f8",
            surface: "#e1e9e7",
            surface2: "#cdd9d6",
            text: "#293634",
            muted: "#607471",
            border: "#b6c7c3",
            accent: "#406b68",
            active: "#876546",
            danger: "#9b423c",
            warning: "#87671f",
            hp: "#9b423c",
            mp: "#406b68",
            buttonText: "#f1f6f4",
            ...LIGHT_GRADE_COLORS
        }
    },
    xuanhui: {
        name: "玄灰夜幕",
        desc: "玄灰入暮，铅华洗尽，月轮微明",
        colors: {
            background: "#181b1d",
            panel: "#1f2326",
            surface: "#272b2f",
            surface2: "#34393e",
            text: "#e3e5e5",
            muted: "#a2a8ab",
            border: "#4a5156",
            accent: "#bbc4c7",
            active: "#7f8a8e",
            danger: "#d87b72",
            warning: "#d8b66c",
            hp: "#d87b72",
            mp: "#9eb1b5",
            buttonText: "#181b1d",
            ...DARK_GRADE_COLORS
        }
    },
    daiqing: {
        name: "黛青夜泊",
        desc: "黛青夜色，江灯一点，水阔山遥",
        colors: {
            background: "#14201f",
            panel: "#1c2b29",
            surface: "#253733",
            surface2: "#304540",
            text: "#dbe3dc",
            muted: "#99a8a1",
            border: "#4a5f56",
            accent: "#9db6aa",
            active: "#b78d5c",
            danger: "#cf7b6b",
            warning: "#d0b268",
            hp: "#cf7b6b",
            mp: "#86aaa0",
            buttonText: "#14201f",
            ...DARK_GRADE_COLORS
        }
    },
    zhuying: {
        name: "竹影深庭",
        desc: "深庭竹影，苔痕上阶，青灯入卷",
        colors: {
            background: "#182019",
            panel: "#202a20",
            surface: "#2a3529",
            surface2: "#354332",
            text: "#dde3d7",
            muted: "#a3ad9e",
            border: "#4f5d4a",
            accent: "#a6b891",
            active: "#b99458",
            danger: "#cc786a",
            warning: "#cfae63",
            hp: "#cc786a",
            mp: "#8eab83",
            buttonText: "#182019",
            ...DARK_GRADE_COLORS
        }
    },
    ouhe: {
        name: "藕荷月影",
        desc: "藕荷微紫，月影轻纱，夜气温柔",
        colors: {
            background: "#231e24",
            panel: "#2d262e",
            surface: "#383139",
            surface2: "#453c46",
            text: "#e6dde1",
            muted: "#b2a4ab",
            border: "#62545f",
            accent: "#c29bae",
            active: "#9e826d",
            danger: "#d07b76",
            warning: "#d1ac6d",
            hp: "#d07b76",
            mp: "#9eb4a7",
            buttonText: "#231e24",
            ...DARK_GRADE_COLORS
        }
    },
    lanshan: {
        name: "岚山夜岫",
        desc: "夜雨岚山，黛蓝幽远，云岫微光",
        colors: {
            background: "#161f25",
            panel: "#1f2a31",
            surface: "#293640",
            surface2: "#35444e",
            text: "#dce2e5",
            muted: "#a0abb1",
            border: "#52636b",
            accent: "#9eb6bc",
            active: "#b08c63",
            danger: "#cc7a6c",
            warning: "#cfa965",
            hp: "#cc7a6c",
            mp: "#8fb3b4",
            buttonText: "#161f25",
            ...DARK_GRADE_COLORS
        }
    },
    zitan: {
        name: "紫檀夜读",
        desc: "紫檀木色，灯影温润，古卷沉香",
        colors: {
            background: "#221b19",
            panel: "#2d2421",
            surface: "#392f2a",
            surface2: "#483b35",
            text: "#e7dcd2",
            muted: "#b4a296",
            border: "#625147",
            accent: "#c19a7d",
            active: "#a87e55",
            danger: "#cf7a6c",
            warning: "#d0a765",
            hp: "#cf7a6c",
            mp: "#98b09b",
            buttonText: "#221b19",
            ...DARK_GRADE_COLORS
        }
    },
};
export const THEME_COLOR_FIELDS = [
    ["background", "背景"],
    ["panel", "主面板"],
    ["surface", "内容块"],
    ["surface2", "按钮"],
    ["text", "正文"],
    ["muted", "弱文本"],
    ["border", "边框"],
    ["accent", "强调"],
    ["active", "选中"],
    ["danger", "危险"],
    ["warning", "提示"],
    ["hp", "气血"],
    ["mp", "内力"],
    ["grade0", "品阶0"],
    ["grade1", "品阶1"],
    ["grade2", "品阶2"],
    ["grade3", "品阶3"],
    ["grade4", "品阶4"],
    ["grade5", "品阶5"],
    ["grade6", "品阶6"]
];

const VARS = {
    background: "--theme-bg",
    panel: "--theme-panel",
    surface: "--theme-surface",
    surface2: "--theme-surface-2",
    text: "--theme-text",
    muted: "--theme-muted",
    border: "--theme-border",
    accent: "--theme-accent",
    active: "--theme-active",
    danger: "--theme-danger",
    warning: "--theme-warning",
    hp: "--theme-hp",
    mp: "--theme-mp",
    buttonText: "--theme-button-text",
    grade0: "--theme-grade-0",
    grade1: "--theme-grade-1",
    grade2: "--theme-grade-2",
    grade3: "--theme-grade-3",
    grade4: "--theme-grade-4",
    grade5: "--theme-grade-5",
    grade6: "--theme-grade-6"
};

const HEX = /^#[0-9a-f]{6}$/i;

function cloneColors(colors) {
    return { ...colors };
}

function getRelativeLuminance(color) {
    const channels = [1, 3, 5].map(function (index) {
        const value = parseInt(color.slice(index, index + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function normalizeThemeName(theme) {
    return THEME_PRESETS[theme] ? theme : "moyun";
}

export function parseThemeColors(value) {
    if (!value) return {};
    try {
        const data = typeof value === "string" ? JSON.parse(value) : value;
        const colors = {};
        for (const [key] of THEME_COLOR_FIELDS) {
            if (HEX.test(data[key])) colors[key] = data[key];
        }
        if (HEX.test(data.buttonText)) colors.buttonText = data.buttonText;
        return colors;
    } catch (error) {
        console.warn("自定义主题解析失败:", error);
        return {};
    }
}

export function stringifyThemeColors(colors) {
    const data = {};
    for (const [key] of THEME_COLOR_FIELDS) {
        if (HEX.test(colors[key])) data[key] = colors[key].toLowerCase();
    }
    return JSON.stringify(data);
}

export function getThemeColors(theme, customValue) {
    if (theme === "custom") {
        return {
            ...cloneColors(THEME_PRESETS.moyun.colors),
            ...parseThemeColors(customValue)
        };
    }
    return cloneColors(THEME_PRESETS[normalizeThemeName(theme)].colors);
}

export function applyTheme(theme, customValue) {
    const colors = getThemeColors(theme, customValue);
    const root = document.documentElement;
    const isLight = getRelativeLuminance(colors.background) >= 0.35;
    for (const key in VARS) {
        root.style.setProperty(VARS[key], colors[key]);
    }
    root.style.setProperty("--theme-sheen", isLight ? "rgba(255, 255, 255, 0.30)" : "rgba(255, 255, 255, 0.05)");
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    document.body.dataset.theme = theme === 'custom' ? 'custom' : normalizeThemeName(theme);
    document.body.dataset.themeMode = isLight ? "light" : "dark";
    return colors;
}
