import Setting from '../setting.js';
import Util from '../utils/util.js';
import SCRIPT from '../script.js';


export default {
    isShow: false,
    selectItem: ".dialog-skills",
    init: function () {
        if (!this.created)
            Dialog.injectStyle(skills_css);
        this.created = true;
    },
    hide: function () {
        if (this.progression_element) {
            this.progression_element.remove();
            this.progression_element = null;
        }
        if (this.skill_element) {
            this.skill_element.remove();
            this.skill_element = null;
            this.element.removeClass("hide-item");
            this.create_footer();
            this.skill_element_id = null;
            return false;
        }
    },
    close: function () {
        this.hide();
        this.element.remove();
        Dialog.element.removeClass("dialog-skills-open");
        //Dialog.footerElement.addClass("hide");
        this.isShow = false;
        this.skill_element_id = null;
        this.element.removeClass("hide-item");
    },
    limit: 0,
    selected_item: -1,
    showdesc: function (data) {
        if (!this.isShow) return;
        this.element.find(".item-commands").remove();
        if (this.progression_element) {
            this.progression_element.remove();
            this.progression_element = null;
        }
        if (this.skill_element) this.skill_element.remove();
        this.skill_element = $("<pre></pre>").html(data.desc).appendTo(this.element);
        // Dialog.title(data.title);
        this.skill_element_id = data.id;
        this.element.addClass("hide-item");
        let html = ['<div class="item-commands">'];

        if (this.master) {
            html.push('<span cmd="xue ', data.id, ' from ', this.master, '">学习</span>');
            if (this.is_follower) {
                if (data.can_progression)
                    html.push('<span cmd="dc ', this.master, ' lingwu ', data.id, '">进阶</span>');
                if (data.can_fusion)
                    html.push('<span cmd="dc ', this.master, ' lingwu2 ', data.id, '">融合</span>');
                html.push('<span cmd="dc ', this.master, ' fangqi ', data.id, '">遗忘</span>');
            }

        } else {
            if (data.is_custom)
                html.push('<span cmd="zc ', data.id, '">推演</span>');
            if (data.can_progression)
                html.push('<span cmd="lingwu ', data.id, '">进阶</span>');
            if (data.can_fusion)
                html.push('<span cmd="lingwu2 ', data.id, '">融合</span>');
            if (data.dao_base && data.can_dao)
                html.push('<span class="skill-action" cmd="dao ', data.id, '">参悟</span>');
            html.push('<span cmd="fangqi ', data.id, '">遗忘</span>');
        }
        html.push('</div>');
        Dialog.footer(html.join(""));

    },
    showProgression: function (data) {
        if (!this.isShow || this.skill_element_id !== data.id) return;
        if (this.progression_element) this.progression_element.remove();
        const html = ['<div class="skill-progression-panel">',
            '<div class="skill-progression-message">', data.message, '</div>',
            '<div class="skill-progression-actions">'];
        const actions = data.actions || [];
        for (let i = 0; i < actions.length; i++) {
            html.push('<button type="button" class="skill-action" cmd="', actions[i].cmd,
                '">', actions[i].name, '</button>');
        }
        html.push('</div></div>');
        this.progression_element = $(html.join("")).appendTo(this.element);
        this.element.scrollTop(this.element[0].scrollHeight);
    },
    footerChanged: function (index, ref) {
        index = parseInt(index);
        if (index === this.selected_item && !ref) return;
        this.selected_item = index;
        Dialog.skills.element.find(".item-commands").remove();
        if (index === 2) {
            this.element.removeClass("dialog-auto-pfm");
            if (!this.books) SendCommand('sbook');
            else this.showBooks();
            return this.element.addClass("dialog-books");
        }
        if (this.element.is('.dialog-books')) {
            this.element.removeClass('dialog-books');
            this.createSkillItems(this.items || []);
        }
        if (index === 3) {
            this.element.addClass("dialog-auto-pfm");
            this.renderAutoPfm();
            this.create_footer();
            SendCommand("autopfm");
            return;
        }
        if (this.element.is(".dialog-auto-pfm")) {
            this.element.removeClass("dialog-auto-pfm");
            this.createSkillItems(this.items || []);
        }
        if (index === 0) {
            this.element.find('.base').removeClass('hide');
            this.element.find(".skill").addClass('hide');
        } else if (index === 1) {
            this.element.find('.base').addClass('hide');
            this.element.find(".skill").removeClass('hide');
        }
        this.create_footer();
    },
    footers: ["基础", "特殊", "书籍", "配置"],
    eq_group: 0,
    create_footer: function () {
        var footers = this.footers;
        var html = ['<div class="skills-footer-tabs">'];
        for (var i = 0; i < footers.length; i++) {
            html.push("<span class='footer-item" +
                (i === this.selected_item ? " select" : "") + "' for='" + i + "'>"
                + footers[i] + "</span>");
        }
        html.push('</div><div class="skills-footer-groups">');
        for (let i = 0; i < 3; i++) {
            html.push('<span class="sk-group',
                i === this.sk_group ? " select" : "",
                '" group="', i, '">', i + 1, '</span>');
        }
        html.push('</div>');
        Dialog.footer(html.join(""));
    },
    eq_group_click: function () {
        let group = parseInt($(this).attr('group'));
        if (group >= 0 && group !== Dialog.skills.sk_group) SendCommand('skgroup ' + group);
    },
    updateSkill: function (data) {
        if (!this.skills) return;
        var item = this.skills[data.id];
        if (!item) {
            return this.addSkill(data);
        }
        let displayChanged = false;
        if (data.name) {
            item.name = data.name;
            displayChanged = true;
        }
        if (data.grade >= 0 && data.grade !== item.grade) {
            item.grade = data.grade;
            if (item.can_enables) {
                for (let sk of item.can_enables) {
                    let base_skill = this.skills[sk];
                    if (base_skill && base_skill.enable_skill === data.id) {
                        this.updateSkillItem(base_skill);
                    }
                }
            }
        }
        if (data.effective_grade >= 0) {
            item.effective_grade = data.effective_grade;
        }
        if (data.dao_base) {
            item.dao_base = data.dao_base;
            item.dao = data.dao;
            item.dao_name = data.dao_name;
            item.dao_next = data.dao_next;
            item.dao_cost = data.dao_cost;
            item.dao_required_level = data.dao_required_level;
            item.dao_level_limit = data.dao_level_limit;
            item.can_dao = data.can_dao;
            displayChanged = true;
        }
        if (data.enable) {
            if (item.enable_skill) {
                var old_skill = item.enable_skill;
                item.enable_skill = null;
                this.skills[old_skill][data.id] = false;
                this.updateSkillItem(this.skills[old_skill]);
            }
            this.skills[data.enable][data.id] = true;
            item.enable_skill = data.enable;
            this.updateSkillItem(this.skills[data.enable]);
            this.updateSkillItem(this.skills[data.id]);
        } else if (data.exp != undefined || data.level != undefined) {
            if (data.level >= 0) item.level = data.level;
            if (data.exp >= 0) item.exp = data.exp;
            if (data.can_enables) item.can_enables = data.can_enables;
            this.updateSkillItem(item);
        }
        else if (data.enable == false) {
            if (item.enable_skill) {
                var old_skill = item.enable_skill;
                this.skills[old_skill][data.id] = false;
                item.enable_skill = null;
                this.updateSkillItem(this.skills[old_skill]);
                this.updateSkillItem(this.skills[data.id]);
            }
        }
        if (displayChanged) this.updateSkillItem(item);

    }, updateSkillItem: function (item) {
        var sk_elem = this.element.find(".skill-item[skid='" + item.id + "']");
        if (sk_elem) {
            let hide = sk_elem.css('display') === 'none';
            sk_elem.replaceWith(this.createSkillItem(item));
            if (hide) sk_elem.hide();
        }
    },
    addSkill: function (item) {

        if (!this.items || !item) return;
        if (this.skills[item.id]) {
            return this.updateSkill(item);
        }
        this.items.push(item);
        this.skills[item.id] = item;
        this.items = this.sort_items(this.items);
        this.createSkillItems(this.items);
    }, format_books: function (data) {
        let books = [];

        for (let i = 0; i < data.length; i++) {
            books.push({
                name: data[i][0],
                grade: data[i][1],
                id: i
            });
        }
        return books;
    },
    onData: function (data) {
        if (data.progression) {
            if (data.progression.from) {
                return this.showProgression.call(Dialog.master, data.progression);
            }
            return this.showProgression(data.progression);
        }
        if (data.autoPfm) {
            this.autoPfm = data.autoPfm;
            this.sk_group = data.autoPfm.group;
            if (this.isShow && this.selected_item === 3) this.renderAutoPfm();
            this.create_footer();
            return;
        }
        if (data.book) {
            if (!this.books) return;
            this.books.push({ name: data.book[0], grade: data.book[1], id: data.book[2] });
            if (this.isShow && this.selected_item == 2) {
                return this.showBooks();
            }
            return;
        }
        if (data.books) {
            this.books = this.format_books(data.books);
            if (this.isShow || !Dialog.master.isShow)
                return this.showBooks();
            else
                return Dialog.master.showBooks();
        }
        if (data.id && !data.desc) {
            if (data.from)
                return this.updateSkill.call(Dialog.master, data);
            return this.updateSkill(data);
        }
        if (data.item) {
            if (Dialog.master.isShow && Dialog.master.is_follower) {
                return this.addSkill.call(Dialog.master, data.item);
            }
            return this.addSkill(data.item);
        }
        if (!this.isShow) {
            if (Dialog.master.isShow)
                return Dialog.master.onData(data);
        }

        if (data.desc) {
            if (data.id) this.updateSkill(data);
            return this.showdesc(data);
        }


        if (data.remove && this.items) {
            if (data.from && data.from !== Process.player) return;
            this.items.Remove(this.skills[data.remove]);

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].enable_skill == data.remove) {
                    this.items[i].enable_skill = null;
                }
            }
            delete this.skills[data.remove];
            if (this.skill_element && this.skill_element_id === data.remove) {
                this.hide();
            }
            return this.createSkillItems(this.items);
        }
        if (data.items) {
            this.title = data.title;
            Dialog.title(this.title + "，等级上限" + data.limit + "级");
            Dialog.icon("book");
            this.items = this.sort_items(data.items);
            this.skills = {};
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                this.skills[item.id] = item;
            }
            if (this.selected_item < 0) this.selected_item = 0;
            this.createSkillItems(this.items);
            this.create_footer();
        }
        if (data.sk_group >= 0) {
            this.sk_group = data.sk_group;
            this.autoPfm = null;
            if (data.limit >= 0) this.limit = data.limit;
            this.create_footer();
            if (this.isShow && this.selected_item === 3) SendCommand("autopfm");
        }
        if (data.limit >= 0) {
            this.limit = data.limit;
            if (this.title) Dialog.title(this.title + "，等级上限" + this.limit + "级");
        }
    },
    show: function () {
        if (this.isShow) return;
        this.isShow = true;
        Dialog.element.addClass("dialog-skills-open");
        if (this.selected_item < 0) this.selected_item = 0;
        if (!this.element) {
            //  this.container = $('<div class="skill-container"><div class="skill-sider"><div class="skill-sider-item select">1</div><div class="skill-sider-item">2</div><div class="skill-sider-item">3</div></div></div>');
            this.element = $('<div class="dialog-skills"></div>');
            Dialog.footerElement.off("click.skillsGroup")
                .on("click.skillsGroup", ".sk-group", Dialog.skills.eq_group_click);
        }
        this.element.off(".skills")
            .on("click.skills", ".skill-item", Dialog.skills.item_click)
            .on("click.skills", ".skill-action", Dialog.skills.skillActionClick)
            .on("click.skills", ".auto-pfm-master", Dialog.skills.autoPfmMasterClick)
            .on("change.skills", ".auto-pfm-toggle", Dialog.skills.autoPfmToggleClick)
            .on("click.skills", ".auto-pfm-move", Dialog.skills.autoPfmMoveClick);
        Dialog.footerElement.off("click.skillsAction")
            .on("click.skillsAction", ".skill-action", Dialog.skills.skillActionClick);
        //Dialog.footerElement.remveClass("hide");
        this.element.appendTo(Dialog.contentElement);
        //this.container.appendTo(Dialog.contentElement);
        this.element.removeClass("hide-item");
        this.create_footer();
        if (!this.items) SendCommand("cha");
        else {
            SendCommand("cha none");
            Dialog.icon("book");
            this.create_footer();
        }
    },
    updatePerformSkills: function (items) {
        this.performSkills = items || [];
        if (this.isShow && this.selected_item === 3) SendCommand("autopfm");
    },
    renderAutoPfm: function () {
        if (!this.element) return;
        var config = this.autoPfm;
        if (!config || config.group !== this.sk_group) {
            this.element.html('<div class="auto-pfm-empty">正在加载技能配置...</div>');
            return;
        }

        const items = config.items || [];
        const enabledItems = items.filter(function (item) {
            return item.enabled;
        });
        const disabledItems = items.filter(function (item) {
            return !item.enabled;
        });
        const html = ['<div class="auto-pfm-config">'];
        html.push('<div class="auto-pfm-header"><span class="auto-pfm-title">自动出招</span>');
        html.push('<button type="button" class="auto-pfm-master', config.enabled ? ' on' : '',
            '" role="switch" aria-checked="', config.enabled ? 'true' : 'false',
            '" aria-label="自动出招" title="开启或关闭自动出招">',
            '<span class="auto-pfm-switch-thumb" aria-hidden="true"></span></button></div>');

        if (!items.length) {
            html.push('<div class="auto-pfm-empty">当前技能组没有可配置的绝招</div>');
        } else {
            html.push('<section class="auto-pfm-section configured"><div class="auto-pfm-section-title">自动释放</div>');
            if (!enabledItems.length) {
                html.push('<div class="auto-pfm-section-empty">尚未选择自动释放技能</div>');
            }
            for (let i = 0; i < enabledItems.length; i++) {
                const item = enabledItems[i];
                html.push('<div class="auto-pfm-item enabled', item.autoAllowed ? '' : ' manual-only',
                    '" data-id="', item.id, '">');
                html.push('<span class="auto-pfm-priority">', i + 1, '</span>');
                html.push('<input type="checkbox" class="auto-pfm-toggle" data-id="', item.id,
                    '" aria-label="启用或停用自动释放" title="',
                    item.autoAllowed ? '启用或停用自动释放' : '该绝招仅支持手动释放', '" checked',
                    item.autoAllowed ? '' : ' disabled', '>');
                html.push('<div class="auto-pfm-info"><div class="auto-pfm-name">', item.name,
                    '</div><div class="auto-pfm-meta">内力 ', item.mp,
                    ' · 出招 ', formatTime(item.releaseTime), ' · 冷却 ', formatTime(item.cooldown), '</div></div>');
                html.push('<div class="auto-pfm-order">');
                html.push('<button type="button" class="auto-pfm-move" data-id="', item.id,
                    '" data-direction="up" title="上移" aria-label="上移"', i === 0 ? ' disabled' : '',
                    '><span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span></button>');
                html.push('<button type="button" class="auto-pfm-move" data-id="', item.id,
                    '" data-direction="down" title="下移" aria-label="下移"', i === enabledItems.length - 1 ? ' disabled' : '',
                    '><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></button></div></div>');
            }
            html.push('</section><section class="auto-pfm-section unconfigured"><div class="auto-pfm-section-title">未配置</div>');
            if (!disabledItems.length) {
                html.push('<div class="auto-pfm-section-empty">全部技能均已配置</div>');
            }
            for (let j = 0; j < disabledItems.length; j++) {
                const disabledItem = disabledItems[j];
                html.push('<div class="auto-pfm-item', disabledItem.autoAllowed ? '' : ' manual-only',
                    '" data-id="', disabledItem.id, '">');
                html.push('<span class="auto-pfm-priority" aria-hidden="true"></span>');
                html.push('<input type="checkbox" class="auto-pfm-toggle" data-id="', disabledItem.id,
                    '" aria-label="启用或停用自动释放" title="',
                    disabledItem.autoAllowed ? '启用或停用自动释放' : '该绝招仅支持手动释放', '"',
                    disabledItem.autoAllowed ? '' : ' disabled', '>');
                html.push('<div class="auto-pfm-info"><div class="auto-pfm-name">', disabledItem.name,
                    '</div><div class="auto-pfm-meta">内力 ', disabledItem.mp,
                    ' · 出招 ', formatTime(disabledItem.releaseTime), ' · 冷却 ',
                    formatTime(disabledItem.cooldown), disabledItem.autoAllowed ? '' : ' · 仅手动',
                    '</div></div></div>');
            }
            html.push('</section>');
        }
        html.push('</div>');
        this.element.html(html.join(""));
    },
    autoPfmMasterClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        SendCommand("autopfm master " + ($(this).is(".on") ? 0 : 1));
    },
    autoPfmToggleClick: function (event) {
        event.stopPropagation();
        if (this.disabled) return;
        SendCommand("autopfm enable " + $(this).attr("data-id") + " " + ($(this).prop("checked") ? 1 : 0));
    },
    autoPfmMoveClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.disabled) return;
        SendCommand("autopfm move " + $(this).attr("data-id") + " " + $(this).attr("data-direction"));
    },
    skillActionClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        const command = $(this).attr("cmd");
        if (!command) return;
        SendCommand(command);
        $(this).closest(".item-commands").remove();
    },
    isEnable: function (item, skills) {
        if (!item.can_enables) return false;
        for (var i = 0; i < item.can_enables.length; i++) {
            var base_skill = skills[item.can_enables[i]];
            if (base_skill && base_skill.enable_skill == item.id) return true;
        }
        return false;
    },
    showBooks: function () {
        var html = [];
        var books = this.sort_items(this.books);
        for (let item of books) {
            html.push('<div class="book-item ');
            html.push('grade', item.grade, '" >');
            html.push('<div class="book-name">', item.name, '</div>');
            html.push('<div class="book-action border-right" cmd="sbook ', item.id, '">查看</div>');
            html.push('<div class="book-action" cmd="study ', item.id, '">学习</div>');
            html.push('</div>');
        }
        this.element.html(html.join(""));
        this.create_footer(true);
    },
    createSkillItem: function (item, skills) {
        skills = skills || this.skills;
        var html = [];
        html.push('<div class="skill-item ');
        html.push('grade' + item.grade);
        if (!this.master) {
            if (item.can_enables) {
                html.push(' skill');
                if (this.selected_item == 0) html.push(' hide');
            } else {
                html.push(' base');
                if (this.selected_item == 1) html.push(' hide');
            }
        }

        var is_enable = this.isEnable(item, skills);
        if (is_enable) {
            html.push(' enable');
        }
        html.push('" skid="' + item.id + '">');

        html.push('<span class="glyphicon glyphicon-ok enable-flag"></span>');
        html.push('<span class="skill-name">', item.name, '</span>');
        var effectiveGrade = parseInt(item.effective_grade);
        if (effectiveGrade > item.grade) {
            var displayGrade = Math.min(6, effectiveGrade);
            html.push('<span class="skill-grade-enhance grade', displayGrade,
                '">强化+', effectiveGrade - item.grade, '</span>');
        }
        //  html.push('</', lvcolor, '>');
        if (item.enable_skill && skills) {
            var sp_skill = skills[item.enable_skill];
            if (sp_skill) {
                html.push('<span class="enable_skill">已装备：');
                html.push(wrap_name(sp_skill));
                html.push("</span>");
            }

        }

        html.push('<span class="skill-level">');
        // var lv_desc = this.get_lvdesc(item.level);
        //push(lv_desc.replace(">", ">" + item.level + '级 / ' + item.exp + "%" + '&nbsp;'));
        html.push(item.level);
        html.push('级 / ');
        html.push(item.exp);
        html.push("%");
        html.push('&nbsp;');
        html.push(Dialog.skills.get_lvdesc(item.level));
        html.push('</span></div>');
        return html.join("");
    },
    sort_items: function (items) {
        if (!items || !Setting.auto_sortitem) return items;
        var list = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var isok = false;
            for (var j = 0; j < list.length; j++) {
                if (item.grade > list[j].grade) {
                    list.splice(j, 0, item);
                    isok = true;
                    break;
                }
            }
            if (!isok) {
                list.push(item);
            }
        }
        return list;
    },
    createSkillItems: function (items, skills) {
        let html = [];
        for (var i = 0; i < items.length; i++) {
            html.push(this.createSkillItem(items[i], skills));
        }
        this.element.html(html.join(""));

    }, level_color: ["wht", "hig", "hic", "hiy", "hiz", "hio", "ord"]
    , get_lvdesc: function (level) {
        if (level < 1000)
            return Dialog.skills.skill_levels[parseInt(level / 50)];
        var v = parseInt((level - 1000) / 500);
        if (v > 6) v = 6;
        return Dialog.skills.skill_levels[v + 20];
    },
    skill_levels: [
        "<BLU>初学乍练</BLU>", "<BLU>不知所以</BLU>", "<HIB>粗通皮毛</HIB>", "<HIB>渐有所悟</HIB>",
        "<YEL>半生不熟</YEL>", "<YEL>马马虎虎</YEL>", "<HIY>平淡无奇</HIY>", "<HIY>触类旁通</HIY>",
        "<HIG>心领神会</HIG>", "<HIG>挥洒自如</HIG>", "<HIC>驾轻就熟</HIC>", "<HIC>出类拔萃</HIC>",
        "<CYN>初入佳境</CYN>", "<CYN>神乎其技</CYN>", "<MAG>威不可当</MAG>",
        "<HIW>豁然贯通</HIW>", "<HIW>超群绝伦</HIW>", "<RED>登峰造极</RED>", "<WHT>登堂入室</WHT>",
        "<HIM>一代宗师</HIM>", "<WHT>超凡入圣</WHT>", "<HIO>出神入化</HIO>", "<HIO>独步天下</HIO>",
        "<HIR>空前绝后</HIR>", "<HIR>旷古绝伦</HIR>", "<HIW>深不可测</HIW>", "<HIW>返璞归真</HIW>"]
    ,
    item_click: function () {
        var elem = $(this);
        var html = ["<div class='item-commands'>"];
        var item = Dialog.skills.skills[elem.attr("skid")];
        if (!item) return;
        html.push('<span cmd="checkskill ' + item.id + '">查看详细</span>');
        if (item.can_enables) {
            for (var i = 0; i < item.can_enables.length; i++) {
                var baseSkill = Dialog.skills.skills[item.can_enables[i]];
                if (!baseSkill) continue;
                if (baseSkill.enable_skill != item.id)
                    html.push('<span cmd="enable ' + baseSkill.id + ' ' + item.id + '">装备' + baseSkill.name + '</span>');
                else {
                    html.push('<span cmd="enable ' + baseSkill.id + ' none">取消装备' + baseSkill.name + '</span>');
                }
            }
        }
        if (item.enable_skill) {
            var sp_skill = Dialog.skills.skills[item.enable_skill];
            if (sp_skill) html.push('<span cmd="enable ' + item.id + ' none">取消装备' + sp_skill.name + '</span>');
            else item.enable_skill = null;
        }
        if (item.dao_base && item.can_dao) {
            html.push('<span class="skill-action" cmd="dao ' + item.id + '">参悟</span>');
        }
        html.push('<span cmd="_confirm fangqi ' + item.id + '">遗忘</span>');
        html.push('<span cmd="lianxi ' + item.id + '">练习</span>');
        SCRIPT.LAST_OBJ = item;
        let commands = Dialog.extend.query('skill', item);
        for (let item of commands) {
            html.push('<span cmd="', item.cmd, '">', item.name, '</span>');
        }
        html.push("</div>");
        Dialog.skills.element.find(".item-commands").remove();
        $(html.join("")).insertAfter(elem);
        Util.checkScroll(elem.next());
    }
};
const level_desc = ["wht", "hig", "hic", "hiy", "hiz", "hio", 'ord'];
function wrap_name(obj) {
    let tag = level_desc[obj.grade];
    return `<${tag}>${obj.name}</${tag}>`;
}
const skills_css = `
.dialog.dialog-skills-open>.dialog-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    overflow: hidden;
}

.dialog.dialog-skills-open>.dialog-footer>.skills-footer-tabs,
.dialog.dialog-skills-open>.dialog-footer>.skills-footer-groups {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    height: 2.5em;
}

.dialog.dialog-skills-open>.dialog-footer>.skills-footer-tabs>.footer-item {
    width: 3.25em;
    height: 2.5em;
    line-height: 2.5em;
    text-align: center;
    font-weight: bold;
    color: var(--theme-muted);
    cursor: pointer;
}

.dialog.dialog-skills-open>.dialog-footer>.skills-footer-groups {
    gap: 0.35em;
    margin-left: auto;
    padding-right: 0.5em;
}

.dialog.dialog-skills-open>.dialog-footer>.skills-footer-groups>.sk-group {
    width: 2em;
    height: 2em;
    line-height: 2em;
    border-radius: 50%;
    background: var(--theme-surface);
    color: var(--theme-muted);
    text-align: center;
    cursor: pointer;
}

.dialog.dialog-skills-open>.dialog-footer>.skills-footer-tabs>.select,
.dialog.dialog-skills-open>.dialog-footer>.skills-footer-groups>.select {
    background: var(--theme-accent);
    color: var(--theme-button-text);
}

.dialog-skills {
    height: 100%;
    overflow-y: auto;
    min-height: 0;
    max-height: none;
    box-sizing: border-box;
}

.dialog-skills.dialog-auto-pfm {
    overflow-y: auto;
}

.auto-pfm-config {
    min-height: 100%;
}

.auto-pfm-header,
.auto-pfm-item {
    display: flex;
    align-items: center;
    min-height: 3.25em;
    border-bottom: 1px solid var(--theme-border);
}

.auto-pfm-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 0.5em 0.75em;
    background: var(--theme-surface-2);
}

.auto-pfm-title {
    flex: 1;
    font-weight: bold;
    color: var(--theme-accent);
}

.auto-pfm-master {
    position: relative;
    width: 3.25em;
    height: 1.75em;
    padding: 0;
    border: 1px solid var(--theme-border);
    border-radius: 1em;
    background: var(--theme-surface);
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
}

.auto-pfm-master.on {
    border-color: var(--theme-accent);
    background: var(--theme-accent);
}

.auto-pfm-switch-thumb {
    position: absolute;
    top: 0.2em;
    left: 0.2em;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background: var(--theme-button-text);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    transition: transform 0.15s ease;
}

.auto-pfm-master.on>.auto-pfm-switch-thumb {
    transform: translateX(1.5em);
}

.auto-pfm-master:focus-visible,
.auto-pfm-move:focus-visible,
.auto-pfm-toggle:focus-visible {
    outline: 2px solid var(--theme-accent);
    outline-offset: 2px;
}

.auto-pfm-section-title {
    padding: 0.55em 0.75em;
    border-bottom: 1px solid var(--theme-border);
    background: var(--theme-surface);
    color: var(--theme-muted);
    font-size: 0.85em;
    font-weight: bold;
}

.auto-pfm-section.configured>.auto-pfm-section-title {
    color: var(--theme-accent);
}

.auto-pfm-section-empty {
    padding: 1em 0.75em;
    border-bottom: 1px solid var(--theme-border);
    color: var(--theme-muted);
    text-align: center;
    font-size: 0.85em;
}

.auto-pfm-toggle {
    flex: 0 0 auto;
    width: 1.2em;
    height: 1.2em;
    margin: 0;
    accent-color: var(--theme-accent);
    cursor: pointer;
}

.auto-pfm-toggle:disabled {
    cursor: default;
    opacity: 0.65;
}

.auto-pfm-item {
    padding: 0.5em 0.75em;
    background: var(--theme-panel);
}

.auto-pfm-item.enabled {
    box-shadow: inset 3px 0 var(--theme-accent);
}

.auto-pfm-item.manual-only {
    opacity: 0.65;
}

.auto-pfm-priority {
    flex: 0 0 1.75em;
    color: var(--theme-accent);
    text-align: center;
    font-variant-numeric: tabular-nums;
}

.auto-pfm-info {
    flex: 1;
    min-width: 0;
    margin-left: 0.65em;
}

.auto-pfm-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.auto-pfm-meta {
    margin-top: 0.2em;
    color: var(--theme-muted);
    font-size: 0.8em;
    white-space: normal;
}

.auto-pfm-order {
    display: flex;
    flex: 0 0 auto;
    gap: 0.35em;
    margin-left: 0.5em;
}

.auto-pfm-move {
    width: 2.25em;
    height: 2.25em;
    padding: 0;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-surface);
    color: var(--theme-text);
    cursor: pointer;
}

.auto-pfm-move:disabled {
    color: var(--theme-muted);
    cursor: default;
    opacity: 0.4;
}

.auto-pfm-empty {
    padding: 2em 1em;
    color: var(--theme-muted);
    text-align: center;
}

.skill-progression-panel {
    margin-top: 0.75em;
    padding: 0.75em;
    border-top: 1px solid var(--theme-border);
    background: var(--theme-surface);
}

.skill-progression-message {
    color: var(--theme-text);
    line-height: 1.6;
    white-space: pre-wrap;
}

.skill-progression-actions {
    display: grid;
    gap: 0.5em;
    margin-top: 0.65em;
}

.skill-progression-actions>button {
    width: 100%;
    min-height: 2.75em;
    padding: 0.5em 0.75em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background: var(--theme-panel);
    color: var(--theme-text);
    text-align: left;
    line-height: 1.4;
    cursor: pointer;
}

.skill-progression-actions>button:active {
    background: var(--theme-surface-2);
}

.skill-progression-actions>button:focus-visible {
    outline: 2px solid var(--theme-accent);
    outline-offset: 2px;
}

@media (max-width: 480px) {
    .dialog.dialog-skills-open>.dialog-footer>.skills-footer-tabs>.footer-item {
        width: 3em;
    }

    .dialog.dialog-skills-open>.dialog-footer>.skills-footer-groups {
        gap: 0.2em;
        padding-right: 0.25em;
    }

    .dialog.dialog-skills-open>.dialog-footer>.skills-footer-groups>.sk-group {
        width: 1.85em;
        height: 1.85em;
        line-height: 1.85em;
    }

    .auto-pfm-header,
    .auto-pfm-item {
        padding-left: 0.5em;
        padding-right: 0.5em;
    }

    .auto-pfm-priority {
        flex-basis: 1.4em;
    }

    .auto-pfm-order {
        gap: 0.2em;
        margin-left: 0.35em;
    }

    .auto-pfm-move {
        width: 2em;
        height: 2em;
    }
}

.hide-item {}

.dialog-skills>pre {
    padding: 0px;
    margin: 0px;
    white-space: pre-wrap;
}

.dialog-skills>.skill-item {
    display: flex;
    align-items: center;
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}

.dialog-skills>.skill-item.hide {
    display: none;
}


.hide-item>.skill-item {
    display: none;
}

.dialog-skills>.dialog-books>.skill-item {
    display: none;
}

.dialog-skills>.skill-item>.skill-level {
    flex: 0 0 auto;
    margin-left: auto;
    margin-right: 0.625em;
}

.dialog-skills>.skill-item>.skill-name,
.dialog-skills>.skill-item>.enable_skill {
    flex: 0 0 auto;
}

.dialog-skills>.skill-item>.enable-flag {
    display: none;
    color: var(--border-color);
    line-height: 2em;
}

.dialog-skills>.enable {
    padding-left: 0px;
}

.dialog-skills>.enable>.enable-flag {
    display: inline-block;
    padding-left: 0.25em;
    padding-right: 0.25em;
}

.dialog-skills>.skill-item>.enable_skill {
    margin-left: 0.5em;
}

.dialog-skills>.skill-item>.skill-grade-enhance {
    display: inline-block;
    margin-left: 0.5em;
    padding: 0 0.35em;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--border-color);
    font-size: 0.72em;
    line-height: 1.45em;
    vertical-align: 0.08em;
}

.dialog-skills>.enable>.item-commands {
    padding-left: 1em;
}

.dialog-skills>.book-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.dialog-skills>.book-item>.book-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--border-color);
    overflow: hidden;
}

.dialog-skills>.book-item>.book-action {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

`;

function formatTime(milliseconds) {
    var seconds = Math.max(0, milliseconds || 0) / 1000;
    return (seconds % 1 ? seconds.toFixed(1) : seconds.toFixed(0)) + "秒";
}
