EQUIPMENT.prototype.query_score = function () {
    if (this.grade) {
        var sc = this.score;
        if (!sc) sc = this.grade * 100;
        sc += this.level * this.grade * 10;
        if (this.st_prop) {
            for (var i = 0; i < this.st_prop.length; i++) {
                sc += this.st_prop[i].grade * 10;
            }
        }
        if (WORLD.CUSTOM_EQUIPMENT && WORLD.CUSTOM_EQUIPMENT.isCustom(this)) {
            sc += WORLD.CUSTOM_EQUIPMENT.queryScore(this);
        }
        return sc;
    }
    return 0;
}

