this.inherits(ROOM);
this.can_practice_meridian = true;
this.name = "练功房";
this.desc = "这里陈设简单，墙边挂着木剑，地上摆着几个蒲团。再往西是一片露天剑坪，全真弟子常在此演练剑法和吐纳内息。";
this.exits = { "east": "quanzhen/guangchang", "west": "quanzhen/jianping" };
this.set_npc("pub/muren");
