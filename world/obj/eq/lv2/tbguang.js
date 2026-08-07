this.inherits(EQUIPMENT);
this.set({
    name: "田伯光的面罩",
    desc: "采花大盗田伯光行凶时所戴的黑色面罩，罩上以金线绣着诡异花纹，戴上后令人身法飘忽。",
    unit: "顶",
    grade: 2,
    eq_type: EQUIP_TYPE.HEAD,
    value: 30000,
    hole_count: 1,
    prop: {
        ds: 18,
        dex: 5,
        mz: 6
    }
});
this.group_name = "hsn2";
this.group_prop = function (count) {
    if (count == 2) {
        return {
            max_hp: 100
        };
    } else if (count == 3) {
        return {
            fy: 15
        };
    }
}
