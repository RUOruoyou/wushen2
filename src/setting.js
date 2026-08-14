import { applyTheme, normalizeThemeName } from './theme.js';
import { storage } from './utils/util.js';

const THEME_STORAGE_KEY = "setting_theme";
const THEME_CUSTOM_STORAGE_KEY = "setting_theme_custom";

function normalizeStoredTheme(theme) {
    return theme === "custom" ? "custom" : normalizeThemeName(theme);
}

const Setting = {
    keep_msg: 0,
    show_hpnum: 0,
    show_hp: 0,
    item_autoheight: 0,
    item_firstme: 0,
    hide_roomdesc: 0,
    exits_dir: 0,
    show_sa: 0,
    show_command: 0,
    fontsize: "0.875rem",
    font: "",
    no_spmsg: 0,
    fontcolor: "#24312f",
    backcolor: "#f4f0e6",
    theme: normalizeStoredTheme(storage.getItem(THEME_STORAGE_KEY, "moyun")),
    theme_custom: storage.getItem(THEME_CUSTOM_STORAGE_KEY, ""),
    auto_showcombat: 0,
    auto_sortitem: 0,
    auto_hideroom: 0,
    show_roomitem: 0,
    fullscreen: 0,
    channel_chat: 1,
    channel_tm: 1,
    channel_fam: 1,
    channel_es: 1,
    ban_pk: 0,
    off_plist: 0,
    combat_wrap: 0,
    combat_size: "1em",
    dialog_size: "1em",
    menu_size: "1em",
    action_wrap: 0,
    off_hp: 0,
    show_damage: 0,
    auto_recovery: 0,
    auto_recovery_hp: 80,
    auto_recovery_mp: 60,
    auto_get_filter: "",
    no_master: 0,
    no_team: 0,
    no_load: true,
    load: function (data) {
        this.auto_recovery = 0;
        this.auto_recovery_hp = 80;
        this.auto_recovery_mp = 60;
        Dialog.keys.init_key();
        Dialog.extend.init_extend();
        if (!data) {
            this.apply_theme();
            return;
        }
        var hasTheme = false;
        for (var key in data) {
            if (key == "fullscreen" || key == "fontcolor" || key == "backcolor") {
                continue;
            }
            this[key] = data[key];
            if (key == "theme" || key == "theme_custom") {
                hasTheme = true;
                continue;
            }
            this.set_prop(key, data[key]);
        }
        if (hasTheme) this.apply_theme();
        if (Dialog.extend.syncAutoRecoveryControls) Dialog.extend.syncAutoRecoveryControls();
    }, set_prop: function (key, value) {
        switch (key) {
            case "theme":
                this.theme = value === 'custom' ? 'custom' : normalizeThemeName(value);
                this.apply_theme();
                break;
            case "theme_custom":
                this.theme_custom = value || "";
                if (this.theme === "custom") this.apply_theme();
                break;
            case "fontsize":
                $(".container").css("font-size", value);
                $(".dialog-confirm").css("font-size", value);
                // $(".right-bar")[0].style.bottom = ($(".combat-panel").height() + $(".bottom-bar").height()) + "px";
                break;
            case "font":
                if (value === 'none') value = "";
                $(".container").css("font-family", value);
                break;
            case "combat_size":
                $(".content-bottom").css("font-size", value);
                break;
            case "dialog_size":
                $(".dialog").css("font-size", value);
                break;
            case "show_sa":
                Combat.refActions();
                break;
            case "menu_size":
                $(".bottom-bar").css("font-size", value);
                break;
            case "fontcolor":
            case "backcolor":
                break;
            case "hide_roomdesc":
                if (value)
                    $(".room_desc").hide()
                else
                    $(".room_desc").show();
                break;
            case "exits_dir":
                Process.exits();
                break;
            case "off_hp":
                if (value) {
                    $('.item-status').hide();
                } else {
                    $('.item-status').show();
                }
                break;
            case "combat_wrap":
                if (value) {
                    $(".combat-commands").addClass('combat-wrap');
                }
                else {
                    $(".combat-commands").removeClass('combat-wrap');
                }
                break;
            case "action_wrap":
                if (value) {
                    $(".room-commands").addClass('combat-wrap');
                }
                else {
                    $(".room-commands").removeClass('combat-wrap');
                }
                break;
            case "item_autoheight":
                if (value) $(".room_items").removeAttr("style");
                else $(".room_items").attr("style", "max-height: 8rem; overflow-y: auto;");
                break;
            case "item_firstme":
                if (value == 1) {
                    var elem = $(".room_items>.room-item[itemid='" + Process.player + "']");
                    $(".room_items").prepend(elem);
                }
                break;
            case "show_hp":
                if (!Combat.IsShow) {
                    if (value == 1)
                        $(".room-item>.item-status").show();
                    else
                        $(".room-item>.item-status").hide();
                }
                break;
            case "show_hpnum":
                Process.cur_room && Process.items(Process.cur_room);
                break;
            case "show_damage":
                $('.item-damage').remove();
                break;
            case "fullscreen":
                if (value) {
                    Setting.launchFullScreen();
                } else {
                    Setting.exitFullscreen();
                }
                break;
            case "show_command":
                Process.itemsElement.find(".item-commands").remove();
                break;
            case "no_spmsg":
                if (value) {
                    Process.ChannelElement.hide();
                } else {
                    Process.ChannelElement.show();
                }
                break;

        }
    },
    apply_theme: function () {
        this.theme = normalizeStoredTheme(this.theme);
        var colors = applyTheme(this.theme, this.theme_custom);
        this.persist_theme();
        return colors;
    },
    persist_theme: function () {
        storage.setItem(THEME_STORAGE_KEY, this.theme);
        if (this.theme_custom) storage.setItem(THEME_CUSTOM_STORAGE_KEY, this.theme_custom);
    },
    save: function (key, value) {
        this[key] = value;

        this.set_prop(key, value);
        var sendValue = key === "auto_get_filter" && value ? encodeURIComponent(value) : value;
        SendCommand("setting " + key + " " + (sendValue || 0));
    },
    launchFullScreen: function (element) {
        element = element || document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    exitFullscreen: function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
Setting.apply_theme();
export default Setting;
