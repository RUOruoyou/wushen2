

export default {
    DIRS: ["west", "north", "south", "east", "northwest", "southwest", "northeast", "southeast",
        "down", "up", "westdown", "northdown", "southdown", "eastdown", "westup", "northup", "southup", "eastup", "enter", "out"],
    REG: /<(\w+)>(.+)<\/\w+>/,
    MOVE_DIRS: {
        w: { dir: "west", reverse: "east", x: -1, y: 0 },
        e: { dir: "east", reverse: "west", x: 1, y: 0 },
        n: { dir: "north", reverse: "south", x: 0, y: -1 },
        s: { dir: "south", reverse: "north", x: 0, y: 1 },
        nw: { dir: "northwest", reverse: "southeast", x: -1, y: -1 },
        ne: { dir: "northeast", reverse: "southwest", x: 1, y: -1 },
        sw: { dir: "southwest", reverse: "northeast", x: -1, y: 1 },
        se: { dir: "southeast", reverse: "northwest", x: 1, y: 1 },
        u: { dir: "up", reverse: "down", x: 0, y: -1 },
        d: { dir: "down", reverse: "up", x: 0, y: 1 }
    },
    CreateExitsMap: function (exits, w, name) {
        var str = name.split("-");
        if (str.length > 1) name = str[str.length - 1];
        name = name.replace(/\(.*?\)/, "");
        var unitY = 30;
        var unitX = 70;
        var unitW = 60;
        var unitH = 20;
        var height = unitY + 10;
        var l = (w - unitW) / 2, t = 10;
        var dirs = {};
        if (exits["north"] && exits["up"]) {
            exits["north_2"] = exits["up"];
            delete exits["up"];
        }
        if (exits["south"] && exits["down"]) {
            exits["south_2"] = exits["down"];
            delete exits["down"];
        }
        for (var dir in exits) {
            if (dir.indexOf("south") > -1 || dir == "down" || dir == "out") {
                dirs["s"] = true;
            } else if (dir.indexOf("north") > -1 || dir == "up" || dir == "enter") {
                dirs["n"] = true;
            }
        }
        if (dirs.s) height += unitY;
        if (dirs.n) {
            height += unitY;
            t += unitY;
        }
        var html = [];
        html.push('<svg style="margin-left:-2em" height="' + height + '" width="' + w + '">');
        html.push('<rect x="' + l + '" y="' + t + '"  fill="var(--theme-panel)" stroke-width="1" stroke="var(--theme-border)" ');
        html.push('width="' + unitW + '" height="' + unitH + '"></rect>');
        html.push(' <text x="' + (l + 30) + '" y="' + (t + 14) + '"  text-anchor="middle" style="font-size:12px;" ');
        this.pushName(html, name, true);
        for (var dir in exits) {
            var pos1, pos2, pos;
            switch (dir) {
                case "west":
                case "westup":
                case "westdown":
                    pos1 = [l - (unitX - unitW), t + unitH / 2];
                    pos2 = [l, t + unitH / 2];
                    pos = [l - unitX, t];

                    break;
                case "east":
                case "eastup":
                case "eastdown":
                    pos1 = [l + unitW, t + unitH / 2];
                    pos2 = [l + unitX, t + unitH / 2];
                    pos = [l + unitX, t];
                    break;
                case "south":
                case "southup":
                case "southdown":
                case "down":
                    pos1 = [l + unitW / 2, t + unitH];
                    pos2 = [l + unitW / 2, t + unitY];
                    pos = [l, t + unitY];
                    break;
                case "north":
                case "northup":
                case "northdown":
                case "up":
                    pos1 = [l + unitW / 2, t];
                    pos2 = [l + unitW / 2, t - (unitY - unitH)];
                    pos = [l, t - unitY];
                    break;
                case "northwest":
                    pos1 = [l - unitX + unitW, t - unitY + unitH];
                    pos2 = [l, t];
                    pos = [l - unitX, t - unitY];
                    break;
                case "northeast":
                case "north_2":
                case "enter":
                    pos1 = [l + unitX, t - unitY + unitH];
                    pos2 = [l + unitW, t];
                    pos = [l + unitX, t - unitY];
                    break;
                case "southeast":
                case "south_2":
                    pos1 = [l + unitX, t + unitY];
                    pos2 = [l + unitW, t + unitH];
                    pos = [l + unitX, t + unitY];
                    break;
                case "southwest":
                case "out":
                    pos1 = [l - unitX + unitW, t + unitY];
                    pos2 = [l, t + unitH];
                    pos = [l - unitX, t + unitY];
                    break;
            }
            var rm_name = exits[dir];
            if (dir == "south_2") dir = "down";
            else if (dir == "north_2") dir = "up";
            html.push('<rect x="' + pos[0] + '" y="' + pos[1] + '" dir="' + dir + '" fill="var(--theme-surface)" stroke-width="1" stroke="var(--theme-border)" ');
            html.push('width="' + unitW + '" height="' + unitH + '"></rect>');
            html.push(' <text x="' + (pos[0] + 30) + '" y="' + (pos[1] + 14) + '" dir="' + dir + '" text-anchor="middle" style="font-size:12px;"');
            this.pushName(html, rm_name, false);

            if (pos1) {
                html.push('<line  stroke="var(--theme-border)" ');
                html.push(" x1='" + pos1[0] + "' y1='" + pos1[1] + "' x2='" + pos2[0] + "' y2='" + pos2[1] + "'");
                if (dir.indexOf("up") > -1 || dir.indexOf("down") > -1) {
                    html.push(" stroke-dasharray='5,5'");
                    html.push(" stroke-width='10'");
                } else {
                    html.push(" stroke-width='1'");
                }
                html.push("></line >");
            }

        }

        html.push("</svg>");
        return html.join("");
    }, colors: {
        "hig": "var(--theme-warning)", "hir": "var(--theme-danger)", "him": "var(--theme-accent)",
        "hic": "var(--theme-accent)", "hiy": "var(--theme-warning)", "red": "var(--theme-danger)",
        "wht": "var(--theme-text)", "mag": "var(--theme-active)"
        , "hiw": "var(--theme-text)", "gre": "var(--theme-text)", "blu": "var(--theme-accent)", "hib": "var(--theme-accent)"
    }, GetColor: function (name, issel) {
        return this.colors[name.toLowerCase()] || "var(--theme-muted)";
    },
    ShowMap: function (map, id) {
        if (!map) return;
        this.CurMapID = id;
        var html = [];
        var pos = this.getMinPos(map);
        var offX = 0 - pos.minX;
        var offY = 0 - pos.minY;
        var unitY = 50;
        var unitX = 100;
        var unitW = 60;
        var unitH = 20;
        var content = $(".map-panel");
        this.MapWidth = (pos.maxX + offX + 1) * unitX;
        var off_x = 0;
        var content_width = content.width();
        if (this.MapWidth < content_width) {
            off_x = (content_width - this.MapWidth) / 2;
            this.MapWidth = content_width;
        }
        this.MapHeight = (pos.maxY + offY + 1) * unitY;
        if (this.MapWidth < 0 || this.MapHeight < 0) return;
        var reg = /^([a-z]{1,2})(\d)?([d|l])?$/;
        html.push('<svg class="map" height="' + this.MapHeight + '" width="' + this.MapWidth + '">');
        for (var i = 0; i < map.length; i++) {
            html.push("<rect class='map-room' rm='" + map[i].id + "' ");

            var l = (map[i].p[0] + offX) * unitX + off_x + 20;
            var t = (map[i].p[1] + offY) * unitY + 20;
            html.push("x='" + l + "' y='" + t + "'");
            html.push(' fill="var(--theme-panel)" stroke-width="1" stroke="var(--theme-border)" ');
            html.push('width="' + unitW + '" height="' + unitH + '"></rect>');
            var exits = map[i].exits;
            if (exits) {
                for (var j = 0; j < exits.length; j++) {
                    reg.test(exits[j]);
                    var length = RegExp.$2 ? parseInt(RegExp.$2) : 1;
                    var pos1;
                    var pos2;
                    switch (RegExp.$1) {
                        case "w":
                            pos1 = [l - (unitX - unitW) - unitX * (length - 1), t + unitH / 2];
                            pos2 = [l, t + unitH / 2];
                            break;
                        case "e":
                            pos1 = [l + unitW, t + unitH / 2];
                            pos2 = [l + unitX + unitX * (length - 1), t + unitH / 2];
                            break;
                        case "s":
                            pos1 = [l + unitW / 2, t + unitH];
                            pos2 = [l + unitW / 2, t + unitY + unitY * (length - 1)];
                            break;
                        case "n":
                            pos1 = [l + unitW / 2, t];
                            pos2 = [l + unitW / 2, t - (unitY - unitH) - unitY * (length - 1)];
                            break;
                        case "nw":
                            pos1 = [l - length * unitX + unitW, t - length * unitY + unitH];
                            pos2 = [l, t];
                            break;
                        case "ne":
                            pos1 = [l + unitW, t];
                            pos2 = [l + length * unitX, t - (unitY - unitH)];
                            break;
                        case "se":
                            pos1 = [l + unitW, t + unitH];
                            pos2 = [l + length * unitX, t + length * unitY];
                            break;
                        case "sw":
                            pos1 = [l, t + unitH];
                            pos2 = [l - (unitX - unitW) - unitX * (length - 1), t + length * unitY];
                            break;
                    }
                    if (pos1) {
                        html.push('<line  stroke="var(--theme-border)" ');
                        html.push(" x1='" + pos1[0] + "' y1='" + pos1[1] + "' x2='" + pos2[0] + "' y2='" + pos2[1] + "'");
                        if (RegExp.$3) {
                            html.push(" stroke-dasharray='5,5'");
                        }
                        if (RegExp.$3 == "l") {
                            html.push(" stroke-width='10'");
                        } else {
                            html.push(" stroke-width='1'");
                        }
                        html.push("></line >");
                    }

                }

            }
            html.push(' <text class="map-room-label" rm="' + map[i].id + '" x="' + (l + 30) + '" y="' + (t + 14) + '" text-anchor="middle" style="font-size:12px;" ');
            this.pushName(html, map[i].n, true);
        }
        html.push("</svg>");
        content.html(html.join(""));
        this.MapContent = content.find("svg.map");
        this.BindMapEvents();
        if (!this.IsShow) {
            this.IsShow = true;
            if (!this.OpenDialogAfterLoad) $(".map-panel").slideDown("fast");
        }
        this.SetRoom(this.Room);
    },
    pushName: function (html, rm_name, issel) {
        var mathch = this.REG.exec(rm_name);
        if (mathch) {
            html.push('  fill="' + this.GetColor(mathch[1]) + '"');
            html.push('>' + mathch[2] + '</text>');
        } else {
            html.push(' fill="');
            html.push(issel ? "var(--theme-text)" : "var(--theme-muted)");
            html.push('">' + rm_name + '</text>');
        }
    },
    BindMapEvents: function () {
        if (!this.MapContent) return;
        this.MapContent.off("click.mapPath").on("click.mapPath", ".map-room,.map-room-label", this.OnRoomClick.bind(this));
        this.BindMapDrag();
    },
    BindMapDrag: function () {
        var panel = this.MapContent.closest(".map-panel");
        if (!panel.length) return;
        panel.off(".mapDrag");

        var self = this;
        var drag = null;

        function startDrag(elem, point, pointerId) {
            drag = {
                pointerId: pointerId,
                startX: point.clientX,
                startY: point.clientY,
                scrollLeft: elem.scrollLeft,
                scrollTop: elem.scrollTop,
                moved: false,
                captured: false
            };
        }

        function moveDrag(elem, point) {
            if (!drag) return false;
            var dx = point.clientX - drag.startX;
            var dy = point.clientY - drag.startY;
            if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return false;
            drag.moved = true;
            elem.scrollLeft = drag.scrollLeft - dx;
            elem.scrollTop = drag.scrollTop - dy;
            return true;
        }

        function endDrag() {
            if (drag && drag.moved) {
                self.SuppressRoomClick = true;
                setTimeout(function () {
                    self.SuppressRoomClick = false;
                }, 80);
            }
            drag = null;
        }

        panel.on("pointerdown.mapDrag", function (e) {
            if (e.button && e.button !== 0) return;
            var original = e.originalEvent;
            startDrag(this, original, original.pointerId);
        }).on("pointermove.mapDrag", function (e) {
            if (!drag) return;
            var original = e.originalEvent;
            if (!drag.captured && this.setPointerCapture && drag.pointerId != null) {
                this.setPointerCapture(drag.pointerId);
                drag.captured = true;
            }
            if (moveDrag(this, original)) e.preventDefault();
        }).on("pointerup.mapDrag pointercancel.mapDrag lostpointercapture.mapDrag", endDrag)
            .on("touchstart.mapDrag", function (e) {
                var original = e.originalEvent;
                if (!original.touches || original.touches.length !== 1) return;
                startDrag(this, original.touches[0], null);
            }).on("touchmove.mapDrag", function (e) {
                var original = e.originalEvent;
                if (!original.touches || original.touches.length !== 1) return;
                if (moveDrag(this, original.touches[0])) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }).on("touchend.mapDrag touchcancel.mapDrag", function () {
                endDrag();
            }
            );
    },
    OnRoomClick: function (e) {
        if (this.SuppressRoomClick) return false;
        if (!$(e.currentTarget).closest(".dialog-map").length) return;
        var target = $(e.currentTarget).attr("rm");
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        this.StartAutoMove(target);
        return false;
    },
    StartAutoMove: function (target) {
        if (!this.Room || !target) return;
        if (this.Room.path == target) {
            ReceiveMessage("<hiy>你已经在这里了。</hiy>");
            return;
        }
        var path = this.FindPath(this.Room.path, target);
        this.StopAutoMove();
        this.AutoMove = {
            target: target,
            path: path || [],
            index: 0,
            waiting: false,
            expected: null,
            needNext: false,
            server: true
        };
        this.MarkAutoPath(path || [], target);
        if (this.AutoMoveTimer) clearTimeout(this.AutoMoveTimer);
        this.AutoMoveTimer = setTimeout(function () {
            this.StopAutoMove();
        }.bind(this), 60000);
        SendCommand("path " + target);
    },
    StopAutoMove: function (notify) {
        if (this.AutoMoveTimer) {
            clearTimeout(this.AutoMoveTimer);
            this.AutoMoveTimer = null;
        }
        this.AutoMove = null;
        this.ClearAutoPath();
        if (notify) ReceiveMessage("<hig>已到达目标位置。</hig>");
    },
    SendNextAutoMove: function () {
        if (!this.AutoMove || !this.Room) return;
        if (this.Room.path == this.AutoMove.target) {
            this.StopAutoMove(true);
            return;
        }
        var step = this.AutoMove.path[this.AutoMove.index];
        if (!step || step.from != this.Room.path) {
            var path = this.FindPath(this.Room.path, this.AutoMove.target);
            if (!path || !path.length) {
                ReceiveMessage("<hir>自动寻路已停止，当前位置无法到达目标。</hir>");
                this.StopAutoMove();
                return;
            }
            this.AutoMove.path = path;
            this.AutoMove.index = 0;
            this.MarkAutoPath(path, this.AutoMove.target);
            step = path[0];
        }
        var dir = this.ResolveMoveDir(step);
        if (!dir) {
            ReceiveMessage("<hir>自动寻路已停止，无法识别下一步方向。</hir>");
            this.StopAutoMove();
            return;
        }
        this.AutoMove.waiting = true;
        this.AutoMove.expected = step.to;
        this.AutoMove.index++;
        if (this.AutoMoveTimer) clearTimeout(this.AutoMoveTimer);
        this.AutoMoveTimer = setTimeout(function () {
            if (!this.AutoMove || !this.AutoMove.waiting) return;
            ReceiveMessage("<hir>自动寻路已停止，移动没有完成。</hir>");
            this.StopAutoMove();
        }.bind(this), 3500);
        SendCommand("go " + dir);
    },
    OnRoomChanged: function (rm) {
        if (!this.AutoMove || !rm) return;
        if (rm.path == this.AutoMove.target) {
            this.StopAutoMove(true);
            return;
        }
        if (this.AutoMove.server) return;
        if (this.AutoMove.waiting) {
            this.AutoMove.waiting = false;
            if (this.AutoMoveTimer) {
                clearTimeout(this.AutoMoveTimer);
                this.AutoMoveTimer = null;
            }
        }
        this.AutoMove.needNext = true;
    },
    SetExits: function (items) {
        this.CurrentExits = items || {};
        if (this.AutoMove && !this.AutoMove.server && this.AutoMove.needNext && !this.AutoMove.waiting) {
            this.AutoMove.needNext = false;
            setTimeout(this.SendNextAutoMove.bind(this), 80);
        }
    },
    ResolveMoveDir: function (step) {
        var exits = this.CurrentExits || {};
        var targetName = this.GetMapRoomName(step.to);
        var candidates = [];
        for (var dir in exits) {
            if (this.CleanRoomName(exits[dir]) == targetName) {
                candidates.push(dir);
            }
        }
        if (!candidates.length) return step.dir;
        if (candidates.length == 1) return candidates[0];
        candidates.sort(function (a, b) {
            return this.DirScore(b, step.dir) - this.DirScore(a, step.dir);
        }.bind(this));
        return candidates[0];
    },
    DirScore: function (dir, fallback) {
        if (dir == fallback) return 100;
        if (dir.indexOf(fallback) == 0) return 80;
        if (fallback.indexOf(dir) == 0) return 60;
        if (dir.indexOf("up") > -1 || dir.indexOf("down") > -1) {
            var simple = dir.replace("up", "").replace("down", "");
            if (simple == fallback) return 70;
        }
        return 0;
    },
    FindPath: function (from, to) {
        var graph = this.GetMapGraph();
        if (!graph || !graph[from] || !graph[to]) return null;
        var queue = [from];
        var visited = {};
        visited[from] = { prev: null, step: null };
        while (queue.length) {
            var room = queue.shift();
            if (room == to) break;
            var edges = graph[room] || [];
            for (var i = 0; i < edges.length; i++) {
                var edge = edges[i];
                if (visited[edge.to]) continue;
                visited[edge.to] = { prev: room, step: edge };
                queue.push(edge.to);
            }
        }
        if (!visited[to]) return null;
        var path = [];
        var cur = to;
        while (visited[cur] && visited[cur].step) {
            path.unshift(visited[cur].step);
            cur = visited[cur].prev;
        }
        return path;
    },
    GetMapGraph: function () {
        var map = this.Buffer[this.CurMapID];
        if (!map) return null;
        if (this.GraphID == this.CurMapID && this.Graph) return this.Graph;
        var graph = {};
        var posMap = {};
        for (var i = 0; i < map.length; i++) {
            graph[map[i].id] = [];
            posMap[map[i].p[0] + "," + map[i].p[1]] = map[i];
        }
        var reg = /^([a-z]{1,2})(\d+)?([dl])?$/;
        for (var j = 0; j < map.length; j++) {
            var room = map[j];
            if (!room.exits) continue;
            for (var k = 0; k < room.exits.length; k++) {
                var match = reg.exec(room.exits[k]);
                if (!match) continue;
                var move = this.MOVE_DIRS[match[1]];
                if (!move) continue;
                var length = match[2] ? parseInt(match[2]) : 1;
                var target = posMap[(room.p[0] + move.x * length) + "," + (room.p[1] + move.y * length)];
                if (!target) continue;
                graph[room.id].push({ from: room.id, to: target.id, dir: move.dir });
                graph[target.id].push({ from: target.id, to: room.id, dir: move.reverse });
            }
        }
        this.GraphID = this.CurMapID;
        this.Graph = graph;
        return graph;
    },
    GetMapRoomName: function (id) {
        var map = this.Buffer[this.CurMapID] || [];
        for (var i = 0; i < map.length; i++) {
            if (map[i].id == id) return this.CleanRoomName(map[i].n);
        }
        return "";
    },
    CleanRoomName: function (name) {
        if (!name) return "";
        return String(name).replace(/<\w+>(.*?)<\/\w+>/g, "$1").replace(/\(.*?\)/g, "");
    },
    MarkAutoPath: function (path, target) {
        if (!this.MapContent) return;
        this.ClearAutoPath();
        for (var i = 0; i < path.length; i++) {
            this.MapContent.find("rect[rm='" + path[i].to + "']").addClass("map-room-path");
        }
        this.MapContent.find("rect[rm='" + target + "']").addClass("map-room-target");
    },
    ClearAutoPath: function () {
        if (!this.MapContent) return;
        this.MapContent.find(".map-room-path,.map-room-target").removeClass("map-room-path map-room-target");
    },
    getMinPos: function (map) {
        var pos = {
            minX: 99999,
            minY: 99999,
            maxX: 0,
            maxY: 0
        };
        for (var i = 0; i < map.length; i++) {
            var x = map[i].p[0];
            var y = map[i].p[1];
            if (x < pos.minX) {
                pos.minX = x;
            } if (x > pos.maxX) pos.maxX = x;
            if (y < pos.minY) {
                pos.minY = y;
            } if (y > pos.maxY) pos.maxY = y;
        }
        return pos;
    },
    State: 0,
    ZoomState: 100,
    Buffer: {},
    HideItem: function () {
        if (this.State == 0) {
            this.State = 1;
            $(".room_desc").slideUp("fast");
        }
    },
    ShowItem: function () {
        if (this.State == 1) {
            this.State = 0;
            $(".room_desc").slideDown("fast");
        }
    }, ZoomIn: function (pars) {
        if (pars.zoom) return;
        this.ZoomState = this.ZoomState / pars.zoom;
        if (this.ZoomState > 200) this.ZoomState = 200;
        if (this.ZoomState < 80) this.ZoomState = 80;
        var pw = this.MapWidth * this.ZoomState / 100;
        var ph = this.MapHeight * this.ZoomState / 100;
        this.MapContent.attr("viewBox", "0,0," + pw + "," + ph);
    }, SetRoom: function (rm) {
        this.Room = rm;
        if (!this.IsShow) return;

        if (this.CurRoomItem) {
            this.CurRoomItem.attr("fill", "var(--theme-panel)");
            this.CurRoomItem.attr("stroke", "var(--theme-border)");
        }
        this.CurRoomItem = null;
        var item = this.MapContent.find("rect[rm='" + rm.path + "']");
        if (item.length) {
            this.CurRoomItem = item;
            this.CurRoomItem.attr("fill", "var(--theme-surface-2)");
            this.CurRoomItem.attr("stroke", "var(--theme-accent)");
            var pos = [item.attr("x"), item.attr("y"), item.attr("width"), item.attr("height")];
            var elem = document.querySelector(".map-panel");
            var height = elem.offsetHeight;
            var width = elem.offsetWidth;
            elem.scrollTop = pos[1] - (height - pos[3]) / 2;
            elem.scrollLeft = pos[0] - (width - pos[2]) / 2;
        }
        this.OnRoomChanged(rm);
        var map_path = rm.path.substr(0, rm.path.lastIndexOf("/"));
        if (map_path != this.CurMapID) {
            if (this.Buffer[map_path]) {
                return this.ShowMap(this.Buffer[map_path], map_path);
            }
            SendCommand("map " + map_path);
        }
    },
    OpenDialog: function () {
        var rm = this.Room;
        if (!rm) return;
        var name = rm.path.substr(0, rm.path.lastIndexOf("/"));
        this.OpenDialogAfterLoad = true;
        if (this.Buffer[name]) {
            this.ShowMap(this.Buffer[name], name);
            this.OpenDialogAfterLoad = false;
            $(".map-panel").hide();
            Dialog.show("map");
            return;
        }
        SendCommand("map " + name);
    },
    LoadMap: function () {
        return this.OpenDialog();
    }, SetMapBuffer: function (maps, id) {
        this.Buffer[id] = maps;
        if (this.GraphID == id) this.GraphID = null;
    }, UpdateMap: function (mapid, data) {
        var map = this.Buffer[mapid];
        if (!map) return;
        if (this.GraphID == mapid) this.GraphID = null;
        if (!data.id) {
            this.Buffer[mapid] = null;
            if (this.CurMapID == mapid) this.CurMapID = null;
            return;
        }
        for (var i = 0; i < map.length; i++) {
            if (map[i].id == data.id) {
                map[i].n = data.n || map[i].n;
                map[i].p = data.p || map[i].p;
                map[i].exits = data.exits || map[i].exits;
                break;
            }
        }
        if (mapid == this.CurMapID) {
            this.ShowMap(map, mapid);
        }
    }
}
