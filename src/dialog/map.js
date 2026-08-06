
import MAP from '../map.js';

export default {
    onData: function (data) {
        Dialog.title(data.title || "地图");
    },
    init: function () {

    },
    show: function () {
        Dialog.init();
        var rm = MAP.Room.name;
        var index = rm.indexOf('-');
        if (index > -1) {
            rm = rm.substr(0, index);
        }
        Dialog.title(rm);
        Dialog.footer("");
        this.element = $(".map-panel");
        Dialog.element.addClass("dialog-map");
        this.element.detach();
        Dialog.contentElement.empty().append(this.element);
        this.element.show();
        Dialog.icon("map-marker");
        Dialog.iconElement.attr("class", "dialog-icon glyphicon glyphicon-map-marker");
        MAP.BindMapEvents();
        if (MAP.Room) MAP.SetRoom(MAP.Room);

    },
    hide: function () {
        if (this.element) {
            this.element.insertBefore(".content-room>.room-title");
        }
        $(".map-panel").hide();
        MAP.IsShow = false;
        Dialog.element.removeClass("dialog-map");

    },
    close: function () {
        this.hide();
    }
};
