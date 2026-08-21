import { SendCommand, ReceiveMessage } from './client.js';

// Phase display names & color classes
const PHASE_NAMES = {
    rally: '集结准备',
    normal: '常规战斗',
    side: '副位机制',
    aspect: '四象化劫',
    vulnerability: '逆脉易伤',
    enrage: '七灭归劫',
    terminal: '战斗终结'
};

const PHASE_CLASSES = {
    rally: 'phase-rally',
    normal: 'phase-normal',
    side: 'phase-side',
    aspect: 'phase-aspect',
    vulnerability: 'phase-vulnerability',
    enrage: 'phase-enrage',
    terminal: 'phase-terminal'
};

const ASPECT_DIRECTIONS = ['东', '南', '西', '北'];

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export const QimieEvent = {
    currentEventId: null,
    isTest: false,
    stateData: null,
    playerId: null,
    expanded: false,
    raidMessages: [],
    raidMembers: [],
    timerHandle: null,
    serverTimeOffset: 0,
    domMounted: false,

    getPlayerId(candidate) {
        const extractId = (val) => {
            if (val === null || val === undefined) return null;
            if (typeof val === 'object') {
                if (val.id !== undefined && val.id !== null) return String(val.id);
                if (val.playerId !== undefined && val.playerId !== null) return String(val.playerId);
                if (val.userid !== undefined && val.userid !== null) return String(val.userid);
                if (val.user_id !== undefined && val.user_id !== null) return String(val.user_id);
                return null;
            }
            const str = String(val).trim();
            return str.length > 0 ? str : null;
        };

        if (candidate !== undefined && candidate !== null) {
            const id = extractId(candidate);
            if (id) return id;
        }
        if (typeof Process !== 'undefined' && Process.player) {
            const id = extractId(Process.player);
            if (id) return id;
        }
        return extractId(this.playerId);
    },

    init() {
        if (this.domMounted) return;
        this.bindEvents();
        this.domMounted = true;
    },

    bindEvents() {
        const container = $('.container');
        if (!container.length) return;

        // Use namespaced events to avoid duplicates and ensure idempotent binding
        container.off('.qimie');

        // Toggle expand/collapse
        container.on('click.qimie', '.qimie-bar-toggle, .qimie-summary-clickable', (e) => {
            e.stopPropagation();
            this.toggleExpand();
        });

        // Raid quick send click
        container.on('click.qimie', '.qimie-raid-btn', (e) => {
            e.stopPropagation();
            this.openRaidChat();
        });
    },

    toggleExpand() {
        this.expanded = !this.expanded;
        const panel = $('.qimie-status-bar');
        if (panel.length) {
            panel.toggleClass('expanded', this.expanded);
            const toggleIcon = panel.find('.qimie-bar-toggle .glyphicon');
            if (this.expanded) {
                toggleIcon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                panel.find('.qimie-bar-toggle .toggle-text').text('收起');
            } else {
                toggleIcon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
                panel.find('.qimie-bar-toggle .toggle-text').text('详情');
            }
        }
    },

    openRaidChat() {
        const chatPanel = $('.chat-panel');
        if (chatPanel.length) {
            chatPanel.removeClass('hide');
            const channelBox = chatPanel.find('.channel-box');
            channelBox.find('span').removeClass('selected');
            let raidTab = channelBox.find('span[channel="raid"]');
            if (!raidTab.length) {
                const ptyTab = channelBox.find('span[channel="pty"]');
                if (ptyTab.length) {
                    raidTab = $('<span channel="raid">战团</span>').insertAfter(ptyTab);
                } else {
                    raidTab = $('<span channel="raid">战团</span>').appendTo(channelBox);
                }
            }
            raidTab.addClass('selected');
            channelBox.attr('channel', 'raid');
            const senderBox = chatPanel.find('.sender-box');
            if (senderBox.length) {
                senderBox.val('').focus();
            }
        } else {
            // Fallback if chat panel is not present
            if (typeof SendCommand === 'function') {
                SendCommand('raid ');
            }
        }
    },

    onBossEvent(data, playerId) {
        if (!data) return;
        if (playerId) {
            this.playerId = playerId;
        } else if (typeof Process !== 'undefined' && Process.player) {
            this.playerId = Process.player;
        }
        this.init();

        if (data.action === 'clear') {
            if (!this.currentEventId || !data.eventId || this.currentEventId === data.eventId) {
                this.clear();
            }
            return;
        }

        // Drop stale events if eventId changes
        if (data.eventId && this.currentEventId && this.currentEventId !== data.eventId) {
            this.clear();
            if (playerId) {
                this.playerId = playerId;
            } else if (typeof Process !== 'undefined' && Process.player) {
                this.playerId = Process.player;
            }
            this.init();
        }

        this.currentEventId = data.eventId || this.currentEventId;
        this.isTest = !!(this.currentEventId && String(this.currentEventId).indexOf('test') >= 0);

        if (typeof data.serverNow === 'number' && !isNaN(data.serverNow) && data.serverNow > 0) {
            this.serverTimeOffset = data.serverNow - Date.now();
        }

        this.stateData = Object.assign({}, this.stateData || {}, data);
        this.render();
        this.startTimer();
    },

    onRaid(data) {
        if (!data) return;
        this.init();

        if (data.action === 'close') {
            if (!this.currentEventId || !data.eventId || this.currentEventId === data.eventId) {
                this.raidMessages = [];
                this.raidMembers = [];
                this.renderRaidSection();
            }
            return;
        }

        if (data.eventId && this.currentEventId && this.currentEventId !== data.eventId) {
            this.raidMessages = [];
            this.raidMembers = [];
        }

        if (data.eventId) {
            this.currentEventId = data.eventId;
        }

        if (data.action === 'state') {
            if (Array.isArray(data.members)) {
                this.raidMembers = data.members;
            } else if (data.members && typeof data.members === 'object') {
                this.raidMembers = Object.values(data.members);
            }
            if (data.messages && Array.isArray(data.messages)) {
                this.raidMessages = data.messages.slice(-20).map(m => ({
                    id: m.id || m.playerId || m.senderId,
                    name: m.name || m.senderName || '侠士',
                    content: m.content || m.message || '',
                    time: m.time || m.at || Date.now()
                }));
            }
            this.renderRaidSection();
        } else if (data.action === 'message' || data.content || data.message) {
            const msg = {
                id: data.id || data.playerId || data.senderId,
                name: data.name || data.senderName || '侠士',
                content: data.content || data.message || '',
                time: data.time || data.at || Date.now()
            };
            this.raidMessages.push(msg);
            if (this.raidMessages.length > 20) {
                this.raidMessages.splice(0, this.raidMessages.length - 20);
            }
            this.renderRaidSection();
        }
    },

    clear() {
        if (this.timerHandle) {
            clearInterval(this.timerHandle);
            this.timerHandle = null;
        }
        this.currentEventId = null;
        this.stateData = null;
        this.raidMessages = [];
        this.raidMembers = [];
        this.isTest = false;
        this.playerId = null;
        this.serverTimeOffset = 0;
        $('.qimie-status-bar').remove();
    },

    startTimer() {
        if (this.timerHandle) return;
        this.timerHandle = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    },

    getNow() {
        return Date.now() + (this.serverTimeOffset || 0);
    },

    updateCountdown() {
        if (!this.stateData) return;
        const now = this.getNow();

        // Main event / phase timer
        const expiresAt = Number(this.stateData.expiresAt);
        if (!isNaN(expiresAt) && expiresAt > 0) {
            const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
            const min = Math.floor(remaining / 60);
            const sec = remaining % 60;
            const timeStr = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
            $('.qimie-timer-val').text(timeStr);
        } else {
            $('.qimie-timer-val').text('--:--');
        }

        // Mechanic timer
        const mech = this.stateData.mechanic;
        const mechExpiresAt = mech ? Number(mech.expiresAt) : NaN;
        if (!isNaN(mechExpiresAt) && mechExpiresAt > 0) {
            const mechRem = Math.max(0, Math.ceil((mechExpiresAt - now) / 1000));
            $('.qimie-mech-timer').text(mechRem + 's');
        } else {
            $('.qimie-mech-timer').text('');
        }
    },

    render() {
        if (!this.stateData) return;

        let bar = $('.qimie-status-bar');
        if (!bar.length) {
            bar = $('<div class="qimie-status-bar"></div>');
            // Insert right above content-message or under channel
            const contentMsg = $('.content-message');
            if (contentMsg.length) {
                bar.insertBefore(contentMsg);
            } else {
                $('.container').append(bar);
            }
        }

        const data = this.stateData;
        const phase = data.phase || 'rally';
        const phaseName = (this.isTest ? '【测试】' : '') + (PHASE_NAMES[phase] || phase);
        const phaseClass = PHASE_CLASSES[phase] || 'phase-normal';

        // Stacks (劫印)
        const stacks = data.stacks || 0;
        const stacksClass = stacks >= 6 ? 'stacks-danger' : (stacks >= 3 ? 'stacks-warn' : 'stacks-normal');

        // Boss HP
        const hp = Math.max(0, Number(data.bossHp) || 0);
        const maxHp = Math.max(1, Number(data.bossMaxHp) || 1);
        const hpPct = Math.min(100, Math.max(0, Math.round((hp / maxHp) * 1000) / 10));

        // Mechanic check & naming
        let mechSummaryHtml = '';
        let isPlayerTarget = false;
        if (data.mechanic && data.mechanic.type) {
            const m = data.mechanic;
            const myId = this.getPlayerId();
            if (Array.isArray(m.targetIds) && myId && m.targetIds.some(id => this.getPlayerId(id) === myId || String(id) === myId)) {
                isPlayerTarget = true;
            }
            let mName = m.type;
            if (m.type === 'yinyang') mName = '阴阳断脉';
            else if (m.type === 'tiangang') mName = '天罡共劫';
            else if (m.type === 'aspect') mName = '四象化劫';
            else if (m.type === 'miehun' || m.type === '灭魂指') mName = '灭魂指';
            else if (m.type === 'tianyin' || m.type === '七灭天音') mName = '七灭天音';
            let targetText = '';
            if (isPlayerTarget) {
                targetText = '<span class="qimie-target-me">【你被点名】</span>';
            } else if (m.targetRoom) {
                const roomDisplay = {
                    center: '镇劫中宫',
                    east: '东·问剑台',
                    south: '南·焚天台',
                    west: '西·断金台',
                    north: '北·镇魂台'
                }[m.targetRoom] || m.targetRoom;
                targetText = `<span>地点: ${escapeHtml(roomDisplay)}</span>`;
            } else if (Array.isArray(m.targetRooms) && m.targetRooms.length) {
                const roomDisplayNames = m.targetRooms.map(r => {
                    return {
                        center: '镇劫中宫',
                        east: '东·问剑台',
                        south: '南·焚天台',
                        west: '西·断金台',
                        north: '北·镇魂台'
                    }[r] || r;
                });
                targetText = `<span>地点: ${escapeHtml(roomDisplayNames.join('/'))}</span>`;
            } else if (Array.isArray(m.targetIds) && m.targetIds.length) {
                targetText = `<span>点名: ${m.targetIds.length}人</span>`;
            }

            let countText = '';
            if (m.requiredCount) {
                let participantCount = 0;
                if (Array.isArray(m.participants)) {
                    participantCount = m.participants.length;
                } else if (typeof m.participants === 'number') {
                    participantCount = m.participants;
                } else if (m.participants && typeof m.participants === 'object') {
                    participantCount = Object.keys(m.participants).length;
                }
                countText = `<span>分摊: ${participantCount}/${m.requiredCount}</span>`;
            }

            mechSummaryHtml = `
                <div class="qimie-mech-pill ${isPlayerTarget ? 'mech-danger' : ''}">
                    <span class="mech-name">${escapeHtml(mName)}</span>
                    <span class="qimie-mech-timer"></span>
                    ${targetText}
                    ${countText}
                </div>
            `;
        }
        // Aspects (四象)
        let aspectsHtml = '';
        if (data.aspects && Array.isArray(data.aspects) && data.aspects.length) {
            aspectsHtml = '<div class="qimie-aspects-grid">';
            for (let i = 0; i < data.aspects.length; i++) {
                const asp = data.aspects[i] || {};
                const dir = ASPECT_DIRECTIONS[i] || '';
                const aHp = Math.max(0, Number(asp.hp) || 0);
                const aMaxHp = Math.max(1, Number(asp.maxHp) || 1);
                const aPct = Math.min(100, Math.max(0, Math.round((aHp / aMaxHp) * 100)));
                const alive = asp.alive !== false && aHp > 0;
                const statusClass = alive ? 'aspect-alive' : 'aspect-dead';

                aspectsHtml += `
                    <div class="qimie-aspect-card ${statusClass}">
                        <div class="aspect-header">
                            <span class="aspect-dir">${escapeHtml(dir)}</span>
                            <span class="aspect-name">${escapeHtml(asp.name || '法身')}</span>
                            <span class="aspect-status">${alive ? '存活' : '已灭'}</span>
                        </div>
                        <div class="aspect-bar-box">
                            <div class="aspect-hp-bar" style="width: ${alive ? aPct : 0}%"></div>
                        </div>
                        <div class="aspect-details">
                            <span class="aspect-room">${escapeHtml(asp.room || '')}</span>
                            <span class="aspect-buff">${escapeHtml(asp.buff || '')}</span>
                        </div>
                    </div>
                `;
            }
            aspectsHtml += '</div>';
        }

        // Build main container HTML
        const html = `
            <!-- Compact summary bar (visible both desktop & mobile) -->
            <div class="qimie-bar-summary qimie-summary-clickable">
                <div class="qimie-summary-left">
                    <span class="qimie-phase-badge ${phaseClass}">${escapeHtml(phaseName)}</span>
                    <span class="qimie-timer"><span class="glyphicon glyphicon-time"></span> <span class="qimie-timer-val">--:--</span></span>
                    <span class="qimie-stacks ${stacksClass}">劫印: <strong>${stacks}</strong>/6</span>
                </div>
                <div class="qimie-summary-mid">
                    <div class="qimie-boss-hp-wrap">
                        <div class="qimie-boss-hp-bar" style="width: ${hpPct}%"></div>
                        <span class="qimie-boss-hp-text">七灭尊者: ${hpPct}% (${escapeHtml(hp)}/${escapeHtml(maxHp)})</span>
                    </div>
                    ${mechSummaryHtml}
                </div>
                <div class="qimie-summary-right">
                    <button type="button" class="qimie-raid-btn" title="战团发言"><span class="glyphicon glyphicon-bullhorn"></span> 战团</button>
                    <button type="button" class="qimie-bar-toggle"><span class="toggle-text">${this.expanded ? '收起' : '详情'}</span> <span class="glyphicon ${this.expanded ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'}"></span></button>
                </div>
            </div>

            <!-- Expandable detail panel -->
            <div class="qimie-bar-detail">
                <div class="qimie-detail-section">
                    <div class="qimie-section-title">四象法身状态</div>
                    ${aspectsHtml || '<div class="qimie-no-aspects">暂无法身</div>'}
                </div>
                <div class="qimie-detail-section qimie-raid-section">
                    <div class="qimie-section-title">
                        <span>战团动态 (${Array.isArray(this.raidMembers) ? this.raidMembers.length : 0}人参战)</span>
                        <span class="qimie-raid-tip">发送命令: <code>raid &lt;内容&gt;</code></span>
                    </div>
                    <div class="qimie-raid-messages">
                        <!-- Populated by renderRaidSection -->
                    </div>
                </div>
            </div>
        `;

        bar.html(html);
        bar.toggleClass('expanded', this.expanded);
        this.renderRaidSection();
        this.updateCountdown();
    },

    renderRaidSection() {
        const msgContainer = $('.qimie-raid-messages');
        if (!msgContainer.length) return;

        if (!this.raidMessages.length) {
            msgContainer.html('<div class="qimie-raid-empty">暂无战团消息，使用战团频道或发送 raid &lt;内容&gt; 交流</div>');
            return;
        }

        let html = '';
        for (const msg of this.raidMessages) {
            const name = escapeHtml(msg.name || '侠士');
            const content = escapeHtml(msg.content || '');
            let timeStr = '';
            if (msg.time) {
                const d = new Date(msg.time);
                timeStr = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + ':' +
                          (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
            }
            html += `
                <div class="qimie-raid-msg-item">
                    <span class="raid-msg-time">[${timeStr}]</span>
                    <span class="raid-msg-sender">【战团】${name}：</span>
                    <span class="raid-msg-body">${content}</span>
                </div>
            `;
        }
        msgContainer.html(html);
        // Scroll to end of raid messages
        if (msgContainer[0]) {
            msgContainer.scrollTop(msgContainer[0].scrollHeight);
        }
    }
};

export default QimieEvent;
