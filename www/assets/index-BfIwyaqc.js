import{t as e}from"./jquery.module-ZeCXMkgB.js";var t=/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);function n(e){var t,n=RegExp(`(^| )`+e+`=([^;]*)(;|$)`);return(t=document.cookie.match(n))?unescape(t[2]):null}function r(e,t){var n=new Date;n.setTime(n.getTime()+300*24*60*60*1e3),document.cookie=e+`=`+t+`; expires=`+n.toGMTString()}function i(e){let t=e.parent(),n=t[0].getBoundingClientRect(),r=e[0].getBoundingClientRect();if(!(r.top>=n.top&&r.bottom<=n.bottom)){let e=t.scrollTop()+(r.bottom-n.bottom);t[0].scrollTop=e}}var a={setItem(e,t){try{if(!t)return this.removeItem(e);let n=t;return typeof t==`object`&&(n=JSON.stringify(t)),localStorage.setItem(e,n),!0}catch(e){return console.error(`存储数据失败:`,e),!1}},getItem(e,t=null){try{let n=localStorage.getItem(e);return n?n[0]===`{`||n[0]===`[`?JSON.parse(n):n:t}catch(e){return console.error(`获取数据失败:`,e),t}},removeItem(e){try{return localStorage.removeItem(e),!0}catch(e){return console.error(`移除数据失败:`,e),!1}},clearAll(){try{return localStorage.clear(),!0}catch(e){return console.error(`清除所有数据失败:`,e),!1}}};function o(e){return typeof e==`object`?e==null||e==null?``:JSON.stringify(e):e}function s(e){return e==null||e==null?``:JSON.stringify(e)}function c(e){return e.valueOf?`/Date(`+e.valueOf()+`)/`:e}function l(e){var t={};for(var n in e)t[n]=e[n];return t}function u(e){return e>0||(e=1e3),new Promise(t=>{setTimeout(t,e)})}async function d(e){for(;!e();)await u(1)}function f(e){return e.substring(0,1)!=`{`&&(e=`{`+e+`}`),Function(`return `+e)()}function p(e){return Function(`return `+e)()}function m(e){var t;return window.DOMParser?t=new DOMParser().parseFromString(e,`text/xml`):(t=new ActiveXObject(`Microsoft.XMLDOM`),t.async=`false`,t.loadXML(e)),$(t.documentElement)}var h={MaxUploadFileLength:1048576*30};function g(e){return encodeURIComponent(e)}var ee={setCookie:function(e,t,n){var r=e+`=`+escape(t);if(n){var i=new Date;i.setTime(i.getTime()+n*60*1e3),r+=`; expires=`+i.toGMTString()}document.cookie=r},getCookie:function(e){return document.cookie.length>0&&(begin=document.cookie.indexOf(e+`=`),begin!=-1)?(begin+=e.length+1,end=document.cookie.indexOf(`;`,begin),end==-1&&(end=document.cookie.length),unescape(document.cookie.substring(begin,end))):``},delCookie:function(e){if(this.getCookie(e)){var t=new Date;t.setYear(1e3),document.cookie=e+`=;`+t.toGMTString()}}},_=`零一二三四五六七八九`,v=[``,`十`,`百`,`千`,`万`,`亿`],y=[``,`万`,`亿`];function b(e){if(!e)return`零`;for(var t=``,n=0,r=0;e;){var i=e%10;n&&(n%4==0&&r!=3?(t=y[n/4]+t,r=3):i&&r!=2&&(t=v[n%4]+t,r=2)),i?((i!=1||e>10||n%4!=1)&&(t=_[i]+t),r=1):r==1&&(t=_[i]+t,r=0),e=parseInt(e/10),n++}return t}function te(e){if(!e)return``;var t=[];return e>=1e4&&(t.push(parseInt(e/1e4)+`两<hiy>黄金</hiy>`),e%=1e4),e>100&&(t.push(parseInt(e/100)+`两<wht>白银</wht>`),e%=100),e>0&&t.push(e+`个<yel>铜板</yel>`),t.join(``)}function ne(e,t,n){if(e){var r=[];if($.isPlainObject(t)){for(var i in t)t[i]&&r.push(i+`=`+g(o(t[i])));e=e+`?`+r.join(`&`)}else if(typeof t==`function`)n=t;else if($.isArray(t)){for(var a=0;a<t.length;a++)r.push(g(o(t[a])));e=e+`/`+r.join(`/`)}return ie({url:`/`+e,callBack:n,type:`get`})}}function re(e,t,n){var r=JSON.stringify(t);return ie({url:`/`+e,data:r,callBack:n,type:`post`})}async function ie(e){let{url:t,data:n,type:r=`post`,callBack:i,dataType:a=`json`}=e,o={method:r.toUpperCase(),credentials:`include`,headers:{"Content-Type":`application/json; charset=UTF-8`}};n&&(o.body=n);let s=await fetch(t,o);if(s.status===404)throw Error(`404 Not Found`);i(a===`json`?await s.json():await s.text())}function ae(){if(arguments.length==0)return new Date;if(arguments.length==1){var e=arguments[0].split(`-`);return new Date(e[0],parseInt(e[1])-1,e[2])}else return new Date(arguments[0],arguments[1],arguments[2])}function oe(e,t){for(var n=e.find(`input`),r=0;r<n.length;r++){var i=$(n[r]).val(),a=!1;if(t){for(var o=0;o<t.length;o++)if(t[o]==i){a=!0;continue}}a?$(n[r]).prop(`checked`,!0):$(n[r]).removeProp(`checked`)}}Array.prototype.Remove=function(e){for(var t=this.length,n=0;n<t;n++)if(this[n]==e)return this.splice(n,1),this;return this},Array.prototype.RemoveAt=function(e){for(var t=0;t<this.length;t++)e(this[t])&&(this.splice(t,1),t--)},Array.prototype.Has=function(e){for(var t=this.length,n=0;n<t;n++)if(this[n]==e)return!0;return!1},Array.prototype.Map=function(e){for(var t=this.length,n=[],r=0;r<t;r++){var i=e(this[r]);i&&n.push(i)}return n},Array.prototype.First=function(e){for(var t=this.length,n=0;n<t;n++){var r=this[n];if(e(r))return r}return null},Array.prototype.Where=function(e){for(var t=this.length,n=[],r=0;r<t;r++){var i=this[r];e(i)&&n.push(i)}return n},Date.prototype.AddDays=function(e){return this.setDate(this.getDate()+e),this},Date.prototype.AddMonths=function(e){return this.setMonth(this.getMonth()+e),this},Date.prototype.ToDateString=function(){var e=this.getMonth()+1;e<10&&(e=`0`+e);var t=this.getDate();return t<10&&(t=`0`+t),this.getFullYear()+`-`+e+`-`+t},Date.prototype.AddYears=function(e){return this.setFullYear(this.getFullYear()+e),this};var x={ProxyHost:`/`,isMobile:t,GetUserCookie:n,SetCookie:r,checkScroll:i,storage:a,Json2Str:o,Json2Str2:s,Date2Str:c,Clone:l,Sleep:u,Wait:d,Str2Json:f,Str2Json2:p,Str2XML:m,Settings:h,encode:g,CookieHelper:ee,C_STR:_,C_STR2:v,C_STR3:y,to_c:b,moneyToStr:te,Get:ne,Post:re,Request:ie,ToDate:ae,CheckInputs:oe},S={DEFAULT:{onOK:function(){},footer:!0,popup:!0,btn_text:`确认`},Show:function(e){this.Init(),this.Parameter=Object.assign({},this.DEFAULT,e),this.content.empty().append(this.Parameter.content),this.element.show(),this.Parameter.popup?(this.element.addClass(`popup`),this.mask.show()):(this.element.removeClass(`popup`),this.mask.hide()),this.Parameter.footer?(this.btn.show(),this.btn.find(`.btn-text`).html(this.Parameter.btn_text)):this.btn.hide(),this.isShow=!0},Close:function(e){S.isShow&&(S.element.hide(),S.mask.hide(),S.isShow=!1,!e&&this.Parameter.onCancle&&this.Parameter.onCancle())},Init:function(){this._init||=(this.mask=$(`<div class="dialog-confirm-mask" style="display:none;"></div>`).appendTo(document.body),this.element=$(`<div class="dialog-confirm" style="display:none;">
        <div class="dialog-content"></div>
        <span class="dialog-btn btn-ok"><span class="glyphicon glyphicon-ok-circle btn-icon"></span><span
                class="btn-text">确认</span></span>
    </div>`).appendTo(document.body),this.content=this.element.find(`.dialog-content`),this.btn=this.element.find(`.dialog-btn`),this.mask.on(`click`,function(e){return S.Parameter&&S.Parameter.popup&&S.Close(),!1}),this.element.on(`click`,`.btn-ok`,function(e){if(S.Parameter.content===S.count_element){var t=S.count_element.find(`input`),n=parseInt(t.val());n.toString()==`NaN`&&(n=0),n>S.max_count&&(n=S.max_count),S.Parameter.onOK(n)}else S.Parameter.onOK();return Dialog.isShow&&C.captureNext(),S.Close(!0),!1}),this.element.on(`click`,`.btn`,function(e){var t=S.max_count||1e3,n=$(e.target),r=parseInt(n.attr(`ac`)),i=n.parent().find(`input`),a=parseInt(i.val());return a.toString()==`NaN`&&(a=0),r==-10?a-=10:r==10?(a==1&&(a=0),a+=10):a=r==1?t:1,a<1?a=1:a>t&&(a=t),i.val(a),!1}),!0)},Process:function(e){var t=e[1],n=``;t==`dc`&&(t=e[3],n=e.splice(1,2),n=n[0]+` `+n[1]+` `);var r=this[`Show_`+t];r&&r.call(this,e,n)},get_countelement:function(e,t){return this.count_element||=$(`<div  class="confirm-count"><span class="btn" ac="0">最少</span><span ac="-10" class="btn">减10</span><input type="text" value="1" /><span class="btn"  ac="10" >加10</span><span class="btn" ac="1" >最多</span></div>`),e?this.count_element.find(`input`).val(e):this.count_element.find(`input`).val(1),t&&=parseInt(t),this.max_count=t||1e3,this.count_element},Show_shop:function(e,t){var n=e[2];if(!n)return;var r=Dialog.shop.get_item(n);if(!r)return;let i=e[3]?parseInt(e[3]):-1;this.Show({content:this.get_countelement(1,i==-1?9999:i),btn_text:`购买`+r.name,onOK:function(e){e>0&&SendCommand(`shop `+n+` `+e)}})},Show_buy:function(e){var t=e[3];if(t){var n=parseInt(e[2]);this.Show({content:this.get_countelement(1,n==-1?9999:n),btn_text:`购买`,onOK:function(n){n>0&&SendCommand(`buy `+n+` `+t+` from `+e[5])}})}},Show_greet:function(e){this.Show({content:this.get_countelement(1,99),btn_text:`送花`,onOK:function(e){e>0&&SendCommand(`greet `+e)}})},Show_sell:function(e){var t=e[3];t&&this.Show({content:this.get_countelement(e[2],e[2]),btn_text:`卖出`,onOK:function(n){n>0&&SendCommand(`sell `+n+` `+t+` to `+e[5])}})},Show_store:function(e,t){var n=e[3];if(n){if(e[2]==1)return SendCommand(t+(Dialog.list.is_bookshelf?`sj `:``)+`store `+n);this.Show({content:this.get_countelement(e[2],e[2]),btn_text:`存入`,onOK:function(e){e>0&&SendCommand(t+(Dialog.list.is_bookshelf?`sj `:``)+`store `+e+` `+n)}})}},Show_fenjie:function(e,t){var n=e[2];if(n){var r=Dialog.pack.isShow?Dialog.pack.get_item(n):Dialog.pack2.get_item(n);if(r){if(r.name.indexOf(`★`)==-1)return SendCommand(t+`fenjie `+n);this.Show({content:`是否确认分解`+r.name+`？`,btn_text:`确认分解`,onOK:function(){SendCommand(t+`fenjie `+n)}})}}},Show_qu:function(e){var t=e[2];if(t){var n=Dialog.list.find_item(3,t);if(n){if(n.count===1)return SendCommand((Dialog.list.is_bookshelf?`sj `:``)+`qu 1 `+t);this.Show({content:this.get_countelement(n.count,n.count),btn_text:`取出`,onOK:function(e){e>0&&SendCommand((Dialog.list.is_bookshelf?`sj `:``)+`qu `+e+` `+t)}})}}},Show_drop:function(e,t){var n=e[3];if(n){var r=Dialog.pack.isShow?Dialog.pack.get_item(n):Dialog.pack2.get_item(n);r&&this.Show({content:e[2]==1?`是否确认丢掉`+r.name+`？`:this.get_countelement(e[2],e[2]),btn_text:`丢掉`,onOK:function(r){if(e[2]==1)return SendCommand(t+`drop `+n);r>0&&SendCommand(t+`drop `+r+` `+n)}})}},Show_give:function(e,t){var n=e[4];if(n){var r=Dialog.pack2.get_item(n);if(r){if(r.count==1)return SendCommand(t+`give `+Process.player+` 1 `+n);this.Show({content:this.get_countelement(r.count,r.count),btn_text:`拿来`,onOK:function(e){e>0&&SendCommand(t+`give `+Process.player+` `+e+` `+n)}})}}},Show_trade_add:function(e){e&&this.Show({content:this.get_countelement(e.count,e.count),btn_text:`确定`,onOK:function(t){if(t>0){var n=x.Clone(e);n.count=t,Dialog.trade.add_trade(n)}}})},Show_fangqi:function(e,t){var n=e[2];if(n){var r=t?Dialog.master.skills[n]:Dialog.skills.skills[n];r&&this.Show({content:`是否确认放弃技能`+r.name+`？`,onOK:function(){SendCommand(t+`fangqi `+n)}})}},Show_combine:function(e,t){var n=e[2];if(n){var r=Dialog.pack.get_item(n);if(r){var i=parseInt(e[3]);if(i){var a=parseInt(r.count/i);if(a==1)return SendCommand(`combine `+n);this.Show({content:this.get_countelement(a),btn_text:`合成`,onOK:function(e){e>0&&SendCommand(t+`combine `+n+` `+e)}})}}}},Show_pay:function(){SendCommand(`pay 0 `+(/mobile/i.test(navigator.userAgent)?`m`:`c`))}},se={Elemes:[],Show:function(e){var t=[`<div class='warn-dialog'>`];t.push(`<div class='warn-content'>`),t.push(e.content),t.push(`</div>`),t.push(`<div class='item-commands'>`);for(var n=0;n<e.cmds.length;n++){var r=e.cmds[n];t.push(`<span cmd='`),t.push(r.cmd),t.push(`'>`),t.push(r.name),t.push(`</span>`)}t.push(`</div>`);var i=$(t.join(``)).appendTo(`.bottom-bar`);this.Elemes.push(i),this.Settop();var a=this.Close.bind(this,i);e.time&&window.setTimeout(a,e.time),i.on(`click`,`span`,a)},Close:function(e){this.Elemes.indexOf(e)>-1&&(e.remove(),this.Elemes.Remove(e),this.Settop())},Settop:function(){for(var e=$(`.bottom-bar`).height()+8,t=0;t<se.Elemes.length;t++){var n=se.Elemes[t];n.css(`bottom`,e),e+=n.height()+14}}},C={isShow:!1,captureUntil:0,chainUntil:0,Init:function(){this._init||=(this.mask=$(`<div class="dialog-confirm-mask" style="display:none;"></div>`).appendTo(document.body),this.element=$(`<div class="cmd-prompt" style="display:none;">
        <div class="cmd-prompt-header"><span class="cmd-prompt-title">提示</span><span class="cmd-prompt-close">关闭</span></div>
        <pre class="cmd-prompt-body"></pre>
        <div class="item-commands cmd-prompt-actions"></div>
    </div>`).appendTo(document.body),this.body=this.element.find(`.cmd-prompt-body`),this.actions=this.element.find(`.cmd-prompt-actions`),this.element.on(`click`,`.cmd-prompt-close`,function(){return C.Close(),!1}),this.mask.on(`click`,function(){return C.Close(),!1}),this.element.on(`click`,`.cmd-prompt-actions [cmd]`,function(){var e=$(this).attr(`cmd`);return C.actions.empty(),C.captureNext(),SendCommand(e),!1}),!0)},Show:function(e){this.Init(),Array.isArray(e)||(e=[e]);for(var t=[],n=0;n<e.length;n++)!e[n]||!e[n].cmd||t.push(`<span cmd='`+e[n].cmd+`'>`+(e[n].name||e[n].cmd)+`</span>`);this.actions.html(t.join(``)),this.body.toggle(this.body.html()!==``),this.element.show(),this.mask.show(),this.isShow=!0,this.body[0].scrollTop=this.body[0].scrollHeight},captureNext:function(){(Dialog.isShow||this.isShow)&&(this.captureUntil=Date.now()+3e3)},appendText:function(e){if(!e||!(Dialog.isShow||this.isShow))return!1;var t=Date.now();if(t>this.captureUntil&&!(this.isShow&&t<=this.chainUntil))return!1;t<=this.captureUntil&&(this.captureUntil=0),this.Init(),this.chainUntil=t+1500;var n=this.body.html();return this.body.html(n?n+`
`+e:e),this.body.show(),this.isShow||=(this.element.show(),this.mask.show(),!0),this.body[0].scrollTop=this.body[0].scrollHeight,!0},Close:function(){this._init&&(this.element.hide(),this.mask.hide(),this.body.empty(),this.actions.empty(),this.isShow=!1,this.captureUntil=0,this.chainUntil=0)}},w=!1,ce=!1,T=null,le=null,ue=null,de=`u`,fe=`p`;function pe(e,t){w||(le=e,console.log(`重新连接`,T==null?`未连接`:`已连接`),_e(),T=new ye(e.ip,e.port),w=!0,T.OnError=e=>{w=!1,e&&(e.isTrusted&&(e=`服务器没有响应，请稍后重试`),A(`<strong>连接失败：</strong>`+e))},T.OnConnect=()=>{w=!1,!t&&!Process.player?(A(`正在获取角色列表...`),E(n(de)+` `+n(fe))):E(t?n(de)+` `+n(fe)+` `+t+` `+e.ID:n(de)+` `+n(fe)+` `+Process.player)},T.OnClose=()=>{if(w=!1,ce){ce=!1;return}T.Connected()||(Process.player?(Process.clear(),D(`<red>你的连接中断了...</red>`)):setTimeout(()=>{k($(`#slist_panel`))},3e3))},T.OnData=ge,T.OnMessage=D,T.Connect())}function me(){return T?T.Connected():!1}function E(e){if(!w){if(!T||!T.Connected())return ue=e,D(`<red>连接中断，正在重新连线...</red>`),pe(le);Dialog.extend.record(e),T.Send(e)}}function he(){ue&&=(E(ue),null)}function D(e){if(!Dialog.extend.message_filter(e)){if(Dialog.item&&Dialog.item.appendPrompt&&Dialog.item.appendPrompt(e)){Dialog.extend.trigger(e);return}if(C.appendText(e)){Dialog.extend.trigger(e);return}Process.message.push(e),Process.message.scroll2end(),Dialog.extend.trigger(e)}}function ge(e){if(!Dialog.extend.data_filter(e)){var t=Process[e.type];t&&t(e),Dialog.extend.process(e)}}function _e(){T&&T.Connected()&&T.Destroy(),T=null}function O(e,t){$(e).focus().parent().find(`.input-error`).remove(),$(`<div class='input-error'>`+t+`</div>`).insertAfter(e)}function k(e,t){for(var n,r=$(`.login-content`).children(),i=0;i<r.length;i++)if($(r[i]).css(`display`)!=`none`){n=$(r[i]);break}n||=$(`#login_panel`),n.animate({opacity:0},`fast`,function(){n.hide(),e==`.container`?$(`.login-content`).hide():$(`.login-content`).show(),e&&(e=$(e),e.show(),e.css(`opacity`,`0`),e.animate({opacity:1},`slow`,t))})}function A(e,t){for(var n=$(`.login-content`).children(),r=0;r<n.length;r++)$(n[r]).css(`display`)!=`none`&&!$(n[r]).is(`.signinfo`)&&$(n[r]).hide();$(`#loader`).css(`opacity`,1).show().find(`#loader_msg`).html(e)}var ve=0,ye=class{constructor(e,t){this.IP=e,this.Port=t}Connect(e){try{var t=this.IP===location.hostname&&String(this.Port)===`31300`,n=(location.protocol==`https:`?`wss://`:`ws://`)+location.host+`/ws`,r=`ws://`+this.IP+`:`+this.Port;this.ws=new WebSocket(t?n:r),this.ws.onopen=this.OnConnect,this.ws.onclose=this.OnClose.bind(this),this.ws.onerror=this.OnError,this.ws.onmessage=this.OnReceived.bind(this),this.index=ve++}catch(e){this.OnError&&this.OnError(e)}}OnReceived(e){if(!(!e||!e.data)){var t=e.data;if(t[0]==`{`||t[0]==`[`){var n=Function(`return `+t+`;`);this.OnData(n())}else this.OnMessage(t)}}Send(e){try{this.ws.send(e)}catch(e){D(e)}}Destroy(){this.ws.onclose=null,this.ws.close()}Close(){this.ws.close()}Connected(){return this.ws&&this.ws.readyState==1}},be={footer:[[`属性`,null],[`详细`,null],[`称号`,null],[`经脉`,null]],selectIndex:0,onData:function(e){if(console.log(e),this.data=e,this.init_elem(),e.name&&Dialog.titleElement.html(e.name),Dialog.icon(`user`),e.meridians){this.meridians=e.meridians,this.create_meridians(),e.meridianResult&&e.meridianResult.completed&&e.meridianResult.ok&&SendCommand(`score`);return}if(e.titles)this.titles=e.titles,this.create_titles();else{e.id&&e.id!=this.uid&&(this.uid=e.id,this.uid==Process.player?Dialog.footerElement.find(`.footer-item:eq(2),.footer-item:eq(3)`).show():Dialog.footerElement.find(`.footer-item:eq(2),.footer-item:eq(3)`).hide());for(var t=$(e.name?this.footer[0][1]:this.footer[1][1]).find(`span`),n=0;n<t.length;n++){var r=$(t[n]),i=r.attr(`data-prop`);i&&r.html(e[i]||0)}}},init:function(){this.footer[0][1]=$(this.template_score),this.footer[1][1]=$(this.template_score2),this.footer[2][1]=$(this.template_title),this.footer[3][1]=$(this.template_meridian),Dialog.injectStyle(this.css)},init_elem:function(){if(Dialog.init(),Dialog.curItem=`score`,!this.isShow){Dialog.footer(``);for(var e=0;e<this.footer.length;e++)$(`<span class='footer-item `+(this.selectIndex==e?`select`:``)+`' for='`+e+`'>`+this.footer[e][0]+`</span>`).appendTo(Dialog.footerElement);this.isShow=!0,this.footerChanged(this.selectIndex)}},show:function(e){e||(this.selectIndex?this.selectIndex==1?SendCommand(`score2`):this.selectIndex==2?SendCommand(`score title`):SendCommand(`score meridian`):SendCommand(`score`)),this.init_elem()},close:function(){this.footer[this.selectIndex][1].remove(),Dialog.footer(``),this.isShow=!1},footerChanged:function(e){e=parseInt(e),this.footer[this.selectIndex][1].remove(),this.selectIndex=e;var t=$(this.footer[this.selectIndex][1]).appendTo(Dialog.contentElement.empty());e==1?this.uid&&Process.player!=this.uid?SendCommand(`score2 `+this.uid):SendCommand(`score2`):e==2?(this.titles||SendCommand(`score title`),t.off(`.scoreTitle`).on(`click.scoreTitle`,`.btn-noused`,function(e){var t=$(e.target);t.is(`red`)&&(t=t.parent());for(var n=parseInt(t.attr(`index`)),r=0;r<this.titles.length;r++)r==n?this.titles[r].use=!this.titles[r].use:this.titles[r].use=!1;SendCommand(`title `+n),this.create_titles()}.bind(this))):e==3&&(t.off(`.meridian`).on(`click.meridian`,`.meridian-practice`,function(e){var t=$(e.currentTarget);if(t.prop(`disabled`)||!this.meridians)return!1;var n=t.attr(`data-id`),r=this.meridians.items.find(function(e){return e.id===n});if(!r||!r.next||!r.canPractice)return!1;var i=r.next,a=i.afterMaxMp===0?` meridian-confirm-risk`:``,o=$(`<div class='meridian-confirm-content`+a+`'><div class='meridian-confirm-title'>贯通【`+r.name+`·`+i.name+`】</div><div>本次扣减：<strong>`+this.formatNumber(i.cost)+`</strong> 最大内力</div><div>最大内力：`+this.formatNumber(this.meridians.maxMp)+` → <strong>`+this.formatNumber(i.afterMaxMp)+`</strong></div><div>当前内力：`+this.formatNumber(this.meridians.mp)+` → `+this.formatNumber(i.afterMp)+`</div><div>气血上限：`+this.formatNumber(this.meridians.maxHp)+` → `+this.formatNumber(i.afterMaxHp)+`</div><div>本穴奖励：`+i.reward+`</div>`+(i.fullReward?`<div class='meridian-full-reward'>全通奖励：`+i.fullReward+`</div>`:``)+(i.afterMaxMp===0?`<div class='meridian-risk-text'>本次贯通会使最大内力降为0，并同步大幅降低气血上限。</div>`:``)+`</div>`);return Confirm.Show({content:o,btn_text:`确认贯通`,popup:!0,onOK:function(){t.prop(`disabled`,!0).addClass(`loading`).text(`处理中`),SendCommand(`meridian `+r.id+` `+r.progress)}}),!1}.bind(this)),SendCommand(`score meridian`),this.meridians&&this.create_meridians())},create_titles:function(){for(var e=$(`.dialog-titles`),t=[],n=0;n<this.titles.length;n++)t.push(`<div class='title-item`,this.titles[n].use?` selected`:``,`'>`),t.push(this.titles[n].title),t.push(`<span class='btn-noused' index='`),t.push(n),t.push(`'>`),t.push(this.titles[n].use?`<red>取消</red>`:`使用`),t.push(`</span>`),t.push(`</div>`);e.html(t.length?t.join(``):`<div class='empty'>你还没有获得任何称号</div>`)},formatNumber:function(e){return Number(e||0).toLocaleString(`en-US`)},create_meridians:function(){var e=this.footer[3][1];if(!(!this.meridians||!e)){var t=this.meridians,n=[];n.push(`<div class='meridian-summary'>`),n.push(`<div><strong>经脉贯通：</strong>`,t.totalProgress,`/`,t.totalNodes,`</div>`),n.push(`<div><strong>周天进度：</strong>`,t.completed,`/`,t.totalMeridians,`</div>`),n.push(`<div><strong>称号：</strong>`,t.title,`</div>`),n.push(`<div><strong>累计投入：</strong>`,this.formatNumber(t.totalSpent),` 最大内力</div>`),n.push(`<div><strong>最大内力：</strong>`,this.formatNumber(t.maxMp),` / `,this.formatNumber(t.limitMp),`</div>`),t.practicing&&n.push(`<div class='meridian-practicing'>正在贯通：<strong>`,t.practicing.name,`</strong>，还需约`,this.formatDuration(t.practicing.remaining),`</div>`),n.push(`<div class='meridian-room `,t.roomAllowed?`allowed`:`blocked`,`'>`,t.roomReason,`</div>`),n.push(`</div>`);for(var r=0;r<t.items.length;r++){var i=t.items[r];n.push(`<section class='meridian-card`,i.unlocked?``:` locked`,`'>`),n.push(`<div class='meridian-card-head'><strong>`,i.name,`</strong><span>`,i.progress,`/`,i.total,`</span></div>`),n.push(`<div class='meridian-effects'><div>单穴：`,i.effect,`</div><div>当前：`,i.currentEffect,`</div><div>全通：`,i.fullEffect,`</div></div>`),i.next&&n.push(`<div class='meridian-next'>下一穴：<strong>`,i.next.name,`</strong>　消耗：`,this.formatNumber(i.next.cost),` 最大内力</div>`),n.push(`<div class='meridian-holes'>`);for(var a=0;a<i.holes.length;a++){var o=i.unlocked?a<i.progress?`done`:a===i.progress?`current`:`pending`:`locked`;n.push(`<span class='meridian-hole `,o,`'>`,a+1,`.`,i.holes[a],`</span>`)}n.push(`</div>`),i.complete?n.push(`<div class='meridian-complete'>已全通</div>`):(n.push(`<button type='button' class='meridian-practice`,i.practicing?` practicing`:``,`' data-id='`,i.id,`'`,i.canPractice?``:` disabled`,`>`,i.practicing?`贯通中`:`贯通下一穴`,`</button>`),i.reason&&n.push(`<div class='meridian-reason'>`,i.reason,`</div>`)),n.push(`</section>`)}e.html(n.join(``))}},formatDuration:function(e){if(e=Number(e)||0,e<=0)return`即将完成`;var t=Math.ceil(e/1e3);if(t<60)return t+`秒`;var n=Math.floor(t/60),r=t%60;return r>0?n+`分`+r+`秒`:n+`分钟`},template_score:`
<div class="dialog-score" cellpadding="0" cellspacing="1">
            <div class="score-section">
                <span class="title">
                    <hic>【性别】</hic>
                </span><span data-prop="gender" class="value"></span>
                <span class="title">
                    <hic>【等级】</hic>
                </span><span data-prop="level" class="value"></span><br />
                <span class="title">
                    <hic>【年龄】</hic>
                </span><span data-prop="age" style="width:10em;" class="value">14</span><br />
                <span class="title">
                    <hic>【经验】</hic>
                </span>
                <hic><span data-prop="exp" class="value">0</span></hic>
                <span class="title">
                    <hic>【潜能】</hic>
                </span>
                <hic><span data-prop="pot" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <div><span class="title">
                        <hig>【气血】</hig>
                    </span>
                    <hig><span data-prop="hp" class="value"
                            style="text-align:right">0</span><span>&nbsp;/&nbsp;</span><span class="value"
                            data-prop="max_hp">0</span></hig>
                </div>
                <div><span class="title">
                        <hig>【内力】</hig>
                    </span>
                    <hig><span data-prop="mp" class="value"
                            style="text-align:right">0</span><span>&nbsp;/&nbsp;</span><span class="value"
                            data-prop="max_mp">0</span></hig>
                </div>
                <span class="title" style="width:6em;">
                    <hic>【内力上限】</hic>
                </span>
                <hic><span data-prop="limit_mp" class="value">0</span></hic><br />
                <span class="title" style="width:6em;">
                    <hic>【精力】</hic>
                </span>
                <hic><span data-prop="jingli" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <span class="title">
                    <hiy>【臂力】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="str">0</span></hiy>
                    <NOR> (+<span data-prop="str_add">0</span>)</NOR>
                </span>
                <span class="title">
                    <hiy>【根骨】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="con">0</span></hiy>
                    <NOR>(+<span data-prop="con_add">0</span>)</NOR>
                </span><br />
                <span class="title">
                    <hiy>【身法】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="dex">0</span></hiy>
                    <NOR>(+<span data-prop="dex_add">0</span>)</NOR>
                </span>
                <span class="title">
                    <hiy>【悟性】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="int">0</span></hiy>
                    <NOR>(+<span data-prop="int_add">0</span>)</NOR>
                </span><br />
                <span class="title">
                    <hiy>【容貌】</hiy>
                </span><span class="value">
                    <hiy><span data-prop="per">0</span></hiy>
                </span>
            </div>
            <div class="score-section">
                <span class="title">
                    <hic>【攻击】</hic>
                </span>
                <hic><span data-prop="gj" class="value">0</span></hic>
                <span class="title">
                    <hic>【防御】</hic>
                </span>
                <hic><span data-prop="fy" class="value">0</span></hic><br />
                <span class="title">
                    <hic>【命中】</hic>
                </span>
                <hic><span data-prop="mz" class="value">0</span></hic>
                <span class="title">
                    <hic>【躲闪】</hic>
                </span>
                <hic><span data-prop="ds" class="value">0</span></hic><br />
                <span class="title">
                    <hic>【招架】</hic>
                </span>
                <hic><span data-prop="zj" class="value">0</span></hic>
                <span class="title">
                    <hic>【暴击】</hic>
                </span>
                <hic><span data-prop="bj" class="value">0</span></hic><br />
                <span class="title" style="width:6em;">
                    <hic>【攻击速度】</hic>
                </span>
                <hic><span data-prop="gjsd" class="value">0</span></hic>
            </div>
            <div class="score-section">
                <span class="title">
                    <hic>【门派】</hic>
                </span>
                <hic><span data-prop="family" class="value">散人</span></hic><br />
                <span class="title">
                    <hic>【师傅】</hic>
                </span>
                <hic><span data-prop="master" class="value">无</span></hic><br />
                <span class="title">
                    <hic>【功绩】</hic>
                </span>
                <hic><span data-prop="gongji" class="value">0</span></hic><br />
            </div>
        </div>`,template_score2:`     <div class="dialog-score2">
            <span class="title">
                <hic>【最终伤害】</hic>
            </span>
            <hic>
                <span data-prop="add_sh" class="value">0</span>
            </hic>
            <br />
            <span class="title">
                <hic>【忽视防御】</hic>
            </span>
            <hic>
                <span data-prop="diff_fy" class="value">0</span>
            </hic><br />

            <span class="title">
                <hic>【暴击伤害】</hic>
            </span>
            <hic>
                <span data-prop="add_bj" class="value">0</span>
            </hic>
            <br />

            <span class="title">
                <hic>【伤害减免】</hic>
            </span>
            <hic>
                <span data-prop="diff_sh" class="value">0</span>
            </hic>
            <br />
            <span class="title">
                <hic>【暴击抵抗】</hic>
            </span>
            <hic>
                <span data-prop="diff_bj" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【释放时间减少】</hic>
            </span>
            <hic>
                <span data-prop="releasetime" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【忙乱时间】</hic>
            </span>
            <hic>
                <span data-prop="busy" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【忽视忙乱】</hic>
            </span>
            <hic>
                <span data-prop="diff_busy" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【冷却时间减少】</hic>
            </span>
            <hic>
                <span data-prop="distime" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【内力消耗减少】</hic>
            </span>
            <hic>
                <span data-prop="expend_mp" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【负面抵抗】</hic>
            </span>
            <hic>
                <span data-prop="downside_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【打坐效率】</hic>
            </span>
            <hic>
                <span data-prop="dazuo_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【学习效率】</hic>
            </span>
            <hic>
                <span data-prop="study_per" class="value">0</span>
            </hic><br />
            <span class="title">
                <hic>【练习效率】</hic>
            </span>
            <hic>
                <span data-prop="lianxi_per" class="value">0</span>
            </hic>
        </div>`,template_title:`      <div class="dialog-titles">
        </div>
`,template_meridian:`      <div class="dialog-meridian">
        </div>
`,css:``},j={DIRS:[`west`,`north`,`south`,`east`,`northwest`,`southwest`,`northeast`,`southeast`,`down`,`up`,`westdown`,`northdown`,`southdown`,`eastdown`,`westup`,`northup`,`southup`,`eastup`,`enter`,`out`],REG:/<(\w+)>(.+)<\/\w+>/,MOVE_DIRS:{w:{dir:`west`,reverse:`east`,x:-1,y:0},e:{dir:`east`,reverse:`west`,x:1,y:0},n:{dir:`north`,reverse:`south`,x:0,y:-1},s:{dir:`south`,reverse:`north`,x:0,y:1},nw:{dir:`northwest`,reverse:`southeast`,x:-1,y:-1},ne:{dir:`northeast`,reverse:`southwest`,x:1,y:-1},sw:{dir:`southwest`,reverse:`northeast`,x:-1,y:1},se:{dir:`southeast`,reverse:`northwest`,x:1,y:1},u:{dir:`up`,reverse:`down`,x:0,y:-1},d:{dir:`down`,reverse:`up`,x:0,y:1}},CreateExitsMap:function(e,t,n){var r=n.split(`-`);r.length>1&&(n=r[r.length-1]),n=n.replace(/\(.*?\)/,``);var i=30,a=70,o=60,s=20,c=i+10,l=(t-o)/2,u=10,d={};for(var f in e.north&&e.up&&(e.north_2=e.up,delete e.up),e.south&&e.down&&(e.south_2=e.down,delete e.down),e)f.indexOf(`south`)>-1||f==`down`||f==`out`?d.s=!0:(f.indexOf(`north`)>-1||f==`up`||f==`enter`)&&(d.n=!0);d.s&&(c+=i),d.n&&(c+=i,u+=i);var p=[];for(var f in p.push(`<svg style="margin-left:-2em" height="`+c+`" width="`+t+`">`),p.push(`<rect x="`+l+`" y="`+u+`"  fill="var(--theme-panel)" stroke-width="1" stroke="var(--theme-border)" `),p.push(`width="`+o+`" height="`+s+`"></rect>`),p.push(` <text x="`+(l+30)+`" y="`+(u+14)+`"  text-anchor="middle" style="font-size:12px;" `),this.pushName(p,n,!0),e){var m,h,g;switch(f){case`west`:case`westup`:case`westdown`:m=[l-(a-o),u+s/2],h=[l,u+s/2],g=[l-a,u];break;case`east`:case`eastup`:case`eastdown`:m=[l+o,u+s/2],h=[l+a,u+s/2],g=[l+a,u];break;case`south`:case`southup`:case`southdown`:case`down`:m=[l+o/2,u+s],h=[l+o/2,u+i],g=[l,u+i];break;case`north`:case`northup`:case`northdown`:case`up`:m=[l+o/2,u],h=[l+o/2,u-(i-s)],g=[l,u-i];break;case`northwest`:m=[l-a+o,u-i+s],h=[l,u],g=[l-a,u-i];break;case`northeast`:case`north_2`:case`enter`:m=[l+a,u-i+s],h=[l+o,u],g=[l+a,u-i];break;case`southeast`:case`south_2`:m=[l+a,u+i],h=[l+o,u+s],g=[l+a,u+i];break;case`southwest`:case`out`:m=[l-a+o,u+i],h=[l,u+s],g=[l-a,u+i];break}var ee=e[f];f==`south_2`?f=`down`:f==`north_2`&&(f=`up`),p.push(`<rect x="`+g[0]+`" y="`+g[1]+`" dir="`+f+`" fill="var(--theme-surface)" stroke-width="1" stroke="var(--theme-border)" `),p.push(`width="`+o+`" height="`+s+`"></rect>`),p.push(` <text x="`+(g[0]+30)+`" y="`+(g[1]+14)+`" dir="`+f+`" text-anchor="middle" style="font-size:12px;"`),this.pushName(p,ee,!1),m&&(p.push(`<line  stroke="var(--theme-border)" `),p.push(` x1='`+m[0]+`' y1='`+m[1]+`' x2='`+h[0]+`' y2='`+h[1]+`'`),f.indexOf(`up`)>-1||f.indexOf(`down`)>-1?(p.push(` stroke-dasharray='5,5'`),p.push(` stroke-width='10'`)):p.push(` stroke-width='1'`),p.push(`></line >`))}return p.push(`</svg>`),p.join(``)},colors:{hig:`var(--theme-warning)`,hir:`var(--theme-danger)`,him:`var(--theme-accent)`,hic:`var(--theme-accent)`,hiy:`var(--theme-warning)`,red:`var(--theme-danger)`,wht:`var(--theme-text)`,mag:`var(--theme-active)`,hiw:`var(--theme-text)`,gre:`var(--theme-text)`,blu:`var(--theme-accent)`,hib:`var(--theme-accent)`},GetColor:function(e,t){return this.colors[e.toLowerCase()]||`var(--theme-muted)`},ShowMap:function(e,t){if(e){this.CurMapID=t;var n=[],r=this.getMinPos(e),i=0-r.minX,a=0-r.minY,o=50,s=100,c=60,l=20,u=$(`.map-panel`);this.MapWidth=(r.maxX+i+1)*s;var d=0,f=u.width();if(this.MapWidth<f&&(d=(f-this.MapWidth)/2,this.MapWidth=f),this.MapHeight=(r.maxY+a+1)*o,!(this.MapWidth<0||this.MapHeight<0)){var p=/^([a-z]{1,2})(\d)?([d|l])?$/;n.push(`<svg class="map" height="`+this.MapHeight+`" width="`+this.MapWidth+`">`);for(var m=0;m<e.length;m++){n.push(`<rect class='map-room' rm='`+e[m].id+`' `);var h=(e[m].p[0]+i)*s+d+20,g=(e[m].p[1]+a)*o+20;n.push(`x='`+h+`' y='`+g+`'`),n.push(` fill="var(--theme-panel)" stroke-width="1" stroke="var(--theme-border)" `),n.push(`width="`+c+`" height="`+l+`"></rect>`);var ee=e[m].exits;if(ee)for(var _=0;_<ee.length;_++){p.test(ee[_]);var v=RegExp.$2?parseInt(RegExp.$2):1,y,b;switch(RegExp.$1){case`w`:y=[h-(s-c)-s*(v-1),g+l/2],b=[h,g+l/2];break;case`e`:y=[h+c,g+l/2],b=[h+s+s*(v-1),g+l/2];break;case`s`:y=[h+c/2,g+l],b=[h+c/2,g+o+o*(v-1)];break;case`n`:y=[h+c/2,g],b=[h+c/2,g-(o-l)-o*(v-1)];break;case`nw`:y=[h-v*s+c,g-v*o+l],b=[h,g];break;case`ne`:y=[h+c,g],b=[h+v*s,g-(o-l)];break;case`se`:y=[h+c,g+l],b=[h+v*s,g+v*o];break;case`sw`:y=[h,g+l],b=[h-(s-c)-s*(v-1),g+v*o];break}y&&(n.push(`<line  stroke="var(--theme-border)" `),n.push(` x1='`+y[0]+`' y1='`+y[1]+`' x2='`+b[0]+`' y2='`+b[1]+`'`),RegExp.$3&&n.push(` stroke-dasharray='5,5'`),RegExp.$3==`l`?n.push(` stroke-width='10'`):n.push(` stroke-width='1'`),n.push(`></line >`))}n.push(` <text class="map-room-label" rm="`+e[m].id+`" x="`+(h+30)+`" y="`+(g+14)+`" text-anchor="middle" style="font-size:12px;" `),this.pushName(n,e[m].n,!0)}n.push(`</svg>`),u.html(n.join(``)),this.MapContent=u.find(`svg.map`),this.BindMapEvents(),this.IsShow||(this.IsShow=!0,this.OpenDialogAfterLoad||$(`.map-panel`).slideDown(`fast`)),this.SetRoom(this.Room)}}},pushName:function(e,t,n){var r=this.REG.exec(t);r?(e.push(`  fill="`+this.GetColor(r[1])+`"`),e.push(`>`+r[2]+`</text>`)):(e.push(` fill="`),e.push(n?`var(--theme-text)`:`var(--theme-muted)`),e.push(`">`+t+`</text>`))},BindMapEvents:function(){this.MapContent&&(this.MapContent.off(`click.mapPath`).on(`click.mapPath`,`.map-room,.map-room-label`,this.OnRoomClick.bind(this)),this.BindMapDrag())},BindMapDrag:function(){var e=this.MapContent.closest(`.map-panel`);if(!e.length)return;e.off(`.mapDrag`);var t=this,n=null;function r(e,t,r){n={pointerId:r,startX:t.clientX,startY:t.clientY,scrollLeft:e.scrollLeft,scrollTop:e.scrollTop,moved:!1,captured:!1}}function i(e,t){if(!n)return!1;var r=t.clientX-n.startX,i=t.clientY-n.startY;return!n.moved&&Math.abs(r)+Math.abs(i)<4?!1:(n.moved=!0,e.scrollLeft=n.scrollLeft-r,e.scrollTop=n.scrollTop-i,!0)}function a(){n&&n.moved&&(t.SuppressRoomClick=!0,setTimeout(function(){t.SuppressRoomClick=!1},80)),n=null}e.on(`pointerdown.mapDrag`,function(e){if(!(e.button&&e.button!==0)){var t=e.originalEvent;r(this,t,t.pointerId)}}).on(`pointermove.mapDrag`,function(e){if(n){var t=e.originalEvent;!n.captured&&this.setPointerCapture&&n.pointerId!=null&&(this.setPointerCapture(n.pointerId),n.captured=!0),i(this,t)&&e.preventDefault()}}).on(`pointerup.mapDrag pointercancel.mapDrag lostpointercapture.mapDrag`,a).on(`touchstart.mapDrag`,function(e){var t=e.originalEvent;!t.touches||t.touches.length!==1||r(this,t.touches[0],null)}).on(`touchmove.mapDrag`,function(e){var t=e.originalEvent;!t.touches||t.touches.length!==1||i(this,t.touches[0])&&(e.preventDefault(),e.stopPropagation())}).on(`touchend.mapDrag touchcancel.mapDrag`,function(){a()})},OnRoomClick:function(e){if(this.SuppressRoomClick)return!1;if($(e.currentTarget).closest(`.dialog-map`).length){var t=$(e.currentTarget).attr(`rm`);if(t)return e.preventDefault(),e.stopPropagation(),this.StartAutoMove(t),!1}},StartAutoMove:function(e){if(!(!this.Room||!e)){if(this.Room.path==e){ReceiveMessage(`<hiy>你已经在这里了。</hiy>`);return}var t=this.FindPath(this.Room.path,e);this.StopAutoMove(),this.AutoMove={target:e,path:t||[],index:0,waiting:!1,expected:null,needNext:!1,server:!0},this.MarkAutoPath(t||[],e),this.AutoMoveTimer&&clearTimeout(this.AutoMoveTimer),this.AutoMoveTimer=setTimeout(function(){this.StopAutoMove()}.bind(this),6e4),SendCommand(`path `+e)}},StopAutoMove:function(e){this.AutoMoveTimer&&=(clearTimeout(this.AutoMoveTimer),null),this.AutoMove=null,this.ClearAutoPath(),e&&ReceiveMessage(`<hig>已到达目标位置。</hig>`)},SendNextAutoMove:function(){if(!(!this.AutoMove||!this.Room)){if(this.Room.path==this.AutoMove.target){this.StopAutoMove(!0);return}var e=this.AutoMove.path[this.AutoMove.index];if(!e||e.from!=this.Room.path){var t=this.FindPath(this.Room.path,this.AutoMove.target);if(!t||!t.length){ReceiveMessage(`<hir>自动寻路已停止，当前位置无法到达目标。</hir>`),this.StopAutoMove();return}this.AutoMove.path=t,this.AutoMove.index=0,this.MarkAutoPath(t,this.AutoMove.target),e=t[0]}var n=this.ResolveMoveDir(e);if(!n){ReceiveMessage(`<hir>自动寻路已停止，无法识别下一步方向。</hir>`),this.StopAutoMove();return}this.AutoMove.waiting=!0,this.AutoMove.expected=e.to,this.AutoMove.index++,this.AutoMoveTimer&&clearTimeout(this.AutoMoveTimer),this.AutoMoveTimer=setTimeout(function(){!this.AutoMove||!this.AutoMove.waiting||(ReceiveMessage(`<hir>自动寻路已停止，移动没有完成。</hir>`),this.StopAutoMove())}.bind(this),3500),SendCommand(`go `+n)}},OnRoomChanged:function(e){if(!(!this.AutoMove||!e)){if(e.path==this.AutoMove.target){this.StopAutoMove(!0);return}this.AutoMove.server||(this.AutoMove.waiting&&(this.AutoMove.waiting=!1,this.AutoMoveTimer&&=(clearTimeout(this.AutoMoveTimer),null)),this.AutoMove.needNext=!0)}},SetExits:function(e){this.CurrentExits=e||{},this.AutoMove&&!this.AutoMove.server&&this.AutoMove.needNext&&!this.AutoMove.waiting&&(this.AutoMove.needNext=!1,setTimeout(this.SendNextAutoMove.bind(this),80))},ResolveMoveDir:function(e){var t=this.CurrentExits||{},n=this.GetMapRoomName(e.to),r=[];for(var i in t)this.CleanRoomName(t[i])==n&&r.push(i);return r.length?(r.length==1||r.sort(function(t,n){return this.DirScore(n,e.dir)-this.DirScore(t,e.dir)}.bind(this)),r[0]):e.dir},DirScore:function(e,t){return e==t?100:e.indexOf(t)==0?80:t.indexOf(e)==0?60:(e.indexOf(`up`)>-1||e.indexOf(`down`)>-1)&&e.replace(`up`,``).replace(`down`,``)==t?70:0},FindPath:function(e,t){var n=this.GetMapGraph();if(!n||!n[e]||!n[t])return null;var r=[e],i={};for(i[e]={prev:null,step:null};r.length;){var a=r.shift();if(a==t)break;for(var o=n[a]||[],s=0;s<o.length;s++){var c=o[s];i[c.to]||(i[c.to]={prev:a,step:c},r.push(c.to))}}if(!i[t])return null;for(var l=[],u=t;i[u]&&i[u].step;)l.unshift(i[u].step),u=i[u].prev;return l},GetMapGraph:function(){var e=this.Buffer[this.CurMapID];if(!e)return null;if(this.GraphID==this.CurMapID&&this.Graph)return this.Graph;for(var t={},n={},r=0;r<e.length;r++)t[e[r].id]=[],n[e[r].p[0]+`,`+e[r].p[1]]=e[r];for(var i=/^([a-z]{1,2})(\d+)?([dl])?$/,a=0;a<e.length;a++){var o=e[a];if(o.exits)for(var s=0;s<o.exits.length;s++){var c=i.exec(o.exits[s]);if(c){var l=this.MOVE_DIRS[c[1]];if(l){var u=c[2]?parseInt(c[2]):1,d=n[o.p[0]+l.x*u+`,`+(o.p[1]+l.y*u)];d&&(t[o.id].push({from:o.id,to:d.id,dir:l.dir}),t[d.id].push({from:d.id,to:o.id,dir:l.reverse}))}}}}return this.GraphID=this.CurMapID,this.Graph=t,t},GetMapRoomName:function(e){for(var t=this.Buffer[this.CurMapID]||[],n=0;n<t.length;n++)if(t[n].id==e)return this.CleanRoomName(t[n].n);return``},CleanRoomName:function(e){return e?String(e).replace(/<\w+>(.*?)<\/\w+>/g,`$1`).replace(/\(.*?\)/g,``):``},MarkAutoPath:function(e,t){if(this.MapContent){this.ClearAutoPath();for(var n=0;n<e.length;n++)this.MapContent.find(`rect[rm='`+e[n].to+`']`).addClass(`map-room-path`);this.MapContent.find(`rect[rm='`+t+`']`).addClass(`map-room-target`)}},ClearAutoPath:function(){this.MapContent&&this.MapContent.find(`.map-room-path,.map-room-target`).removeClass(`map-room-path map-room-target`)},getMinPos:function(e){for(var t={minX:99999,minY:99999,maxX:0,maxY:0},n=0;n<e.length;n++){var r=e[n].p[0],i=e[n].p[1];r<t.minX&&(t.minX=r),r>t.maxX&&(t.maxX=r),i<t.minY&&(t.minY=i),i>t.maxY&&(t.maxY=i)}return t},State:0,ZoomState:100,Buffer:{},HideItem:function(){this.State==0&&(this.State=1,$(`.room_desc`).slideUp(`fast`))},ShowItem:function(){this.State==1&&(this.State=0,$(`.room_desc`).slideDown(`fast`))},ZoomIn:function(e){if(!e.zoom){this.ZoomState/=e.zoom,this.ZoomState>200&&(this.ZoomState=200),this.ZoomState<80&&(this.ZoomState=80);var t=this.MapWidth*this.ZoomState/100,n=this.MapHeight*this.ZoomState/100;this.MapContent.attr(`viewBox`,`0,0,`+t+`,`+n)}},SetRoom:function(e){if(this.Room=e,this.IsShow){this.CurRoomItem&&(this.CurRoomItem.attr(`fill`,`var(--theme-panel)`),this.CurRoomItem.attr(`stroke`,`var(--theme-border)`)),this.CurRoomItem=null;var t=this.MapContent.find(`rect[rm='`+e.path+`']`);if(t.length){this.CurRoomItem=t,this.CurRoomItem.attr(`fill`,`var(--theme-surface-2)`),this.CurRoomItem.attr(`stroke`,`var(--theme-accent)`);var n=[t.attr(`x`),t.attr(`y`),t.attr(`width`),t.attr(`height`)],r=document.querySelector(`.map-panel`),i=r.offsetHeight,a=r.offsetWidth;r.scrollTop=n[1]-(i-n[3])/2,r.scrollLeft=n[0]-(a-n[2])/2}this.OnRoomChanged(e);var o=e.path.substr(0,e.path.lastIndexOf(`/`));if(o!=this.CurMapID){if(this.Buffer[o])return this.ShowMap(this.Buffer[o],o);SendCommand(`map `+o)}}},OpenDialog:function(){var e=this.Room;if(e){var t=e.path.substr(0,e.path.lastIndexOf(`/`));if(this.OpenDialogAfterLoad=!0,this.Buffer[t]){this.ShowMap(this.Buffer[t],t),this.OpenDialogAfterLoad=!1,$(`.map-panel`).hide(),Dialog.show(`map`);return}SendCommand(`map `+t)}},LoadMap:function(){return this.OpenDialog()},SetMapBuffer:function(e,t){this.Buffer[t]=e,this.GraphID==t&&(this.GraphID=null)},UpdateMap:function(e,t){var n=this.Buffer[e];if(n){if(this.GraphID==e&&(this.GraphID=null),!t.id){this.Buffer[e]=null,this.CurMapID==e&&(this.CurMapID=null);return}for(var r=0;r<n.length;r++)if(n[r].id==t.id){n[r].n=t.n||n[r].n,n[r].p=t.p||n[r].p,n[r].exits=t.exits||n[r].exits;break}e==this.CurMapID&&this.ShowMap(n,e)}}},xe={onData:function(e){Dialog.title(e.title||`地图`)},init:function(){},show:function(){Dialog.init();var e=j.Room.name,t=e.indexOf(`-`);t>-1&&(e=e.substr(0,t)),Dialog.title(e),Dialog.footer(``),this.element=$(`.map-panel`),Dialog.element.addClass(`dialog-map`),this.element.detach(),Dialog.contentElement.empty().append(this.element),this.element.show(),Dialog.icon(`map-marker`),Dialog.iconElement.attr(`class`,`dialog-icon glyphicon glyphicon-map-marker`),j.BindMapEvents(),j.Room&&j.SetRoom(j.Room)},hide:function(){this.element&&this.element.insertBefore(`.content-room>.room-title`),$(`.map-panel`).hide(),j.IsShow=!1,Dialog.element.removeClass(`dialog-map`)},close:function(){this.hide()}},Se={left:[`west`,`westup`,`westdown`],right:[`east`,`eastup`,`eastdown`],up:[`north`,`northup`,`northdown`,`up`],down:[`south`,`southup`,`southdown`,`down`],leftup:[`northwest`],leftdown:[`southwest`],rightup:[`northeast`],rightdown:[`southeast`]},M={is_running:!1,run:async function(e){this.is_running=!0;try{let t=e.split(`;`);for(let e of t)await this.run_one(e)}catch(e){console.log(`扩展执行失败：`,e)}this.is_running=!1},var_reg:/^@(\w+)(?:\(([^)]*)\))?$/,run_one:async function(e){let t=e.split(` `),n=t[0],r=this.actions.def;n[0]===`#`&&(n=n.substring(1),r=this.actions[n]??this.actions.def);let i=[[]],a=null;for(let e=1;e<t.length&&i.length;e++)a=t[e],a[0]===`@`?await this.push_paras(i,a):i.map(e=>e.push(a));for(let e of i)await r(e,n)},push_paras:async function(e,t){let n=t.match(this.var_reg);if(!n)throw Error(`<cyn>错误的参数格式`+t+`</cyn>`);let r=n[1],i=n[2]?n[2].split(`,`).map(e=>e.trim()):[],a=this.vars[r];if(!a)throw Error(`<cyn>无效参数`+t+`</cyn>`);let o=await a(...i);if(!o)return e.length=0;if(!Array.isArray(o))return e.map(e=>e.push(o));if(!o.length)return e.length=0;let s=e.length;for(let t=1;t<o.length;t++)for(let n=0;n<s;n++)e.push([...e[n],o[t]]);for(let t=0;t<s;t++)e[t].push(o[0])},actions:{def:function(e,t){e.length?SendCommand(t+` `+e.join(` `)):SendCommand(t)},wait:function(e){return x.Sleep(parseInt(e[0]))},action:async function(e){let t=parseInt(e[0]);if(!(t>=0&&t<10))return;let n=$(`.room-commands`).children().eq(t).attr(`cmd`);n&&M.run(n)},pfm:function(e){let t=parseInt(e[0]);if(!(t>=0&&t<10))return SendCommand(`perform `+e[0]);let n=$(`.combat-commands`).children().eq(t).attr(`pid`);n&&M.run(`perform `+n)},menu:function(e){let t=e[0];t&&HandlerMenuCommand(t)},msg:function(e){e.length>0&&ReceiveMessage(e.join(``))}},vars:{me:function(){return Process.player},dir:function(e){let t=Se[e];if(t){for(let e of t)if(Process.room_exits[e])return e}},npc:function(...e){let t=Process.cur_room,n=[];for(let r of t.items)if(r&&r.hp>0&&!r.p){if(!e||!e.length)n.push(r.id);else for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}}return n},item:function(...e){let t=Process.cur_room,n=[];for(let r of t.items)if(r){if(!e||!e.length)n.push(r.id);else for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}}return n},id:function(){let e=M.LAST_OBJ;return e?e.id:``},obj:function(e){let t=M.LAST_OBJ;if(!(!e||!t))return t[e]},pack:function(...e){let t=Dialog.pack.isShow?Dialog.pack.items:Dialog.pack2.items;if(!t)return;let n=[];for(let r of t)for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}return n},goods:function(...e){let t=Dialog.list.selllist;if(!t)return;let n=[];for(let r of t)for(let t of e)if(r.name.indexOf(t)>-1){n.push(r.id);break}return n},input:function(){let e={btn_text:`确定`,min:0,max:0};for(let t=0;t<arguments.length;t++){let n=arguments[t];typeof n==`string`?e.btn_text=n:e.max>0?e.min=n:e.max=n}return e.content=S.get_countelement(e.min||1,e.max||9999),new Promise((t,n)=>{e.onOK=t,e.onCancle=n,S.Show(e)})},mat:function(e){let t=M.lAST_MATCHES;if(t)return t[e]},data:function(e){if(!(!e||!M.LAST_DATA))return M.LAST_DATA[e]},master:function(){return Dialog.master.master},dc:function(){return Dialog.master.isShow?`dc `+Dialog.master.master:Dialog.pack2.command_before}},helper:{actions:[`#wait 100：等待100毫秒执行`,`#msg 你好：输出提示消息`,`#menu score，打开对话框`,`#action (0-9)，执行动作栏对应位置的操作`,`#pfm (0-9)，释放对应位置的绝招`,`持续增加`],vars:[`@dir(left)：获取当前房间左边方向的出口命令`,`@npc(小二)：获取当前房间的npc ID，无参数返回所有npc`,`@item：获取当前房间所有物品ID，参数匹配名称`,`@id：当前正在操作的道具，技能，NPC等的ID`,`持续增加`],paras:[`参数用来判断所在位置的数据属性，比如地图的参数，有name,type,index`,`name(扬州)：名称里包含扬州二字的地图`,`index(>3)：索引大于3的地图`]}},Ce={groups:[{name:`移动`,items:[{name:`左`,key:null,cmd:`#go @dir(left)`},{name:`右`,key:null,cmd:`#go @dir(right)`},{name:`上`,key:null,cmd:`#go @dir(up)`},{name:`下`,key:null,cmd:`#go @dir(down)`},{name:`左上`,key:null,cmd:`#go @dir(leftup)`},{name:`左下`,key:null,cmd:`#go @dir(leftdown)`},{name:`右上`,key:null,cmd:`#go @dir(rightup)`},{name:`右下`,key:null,cmd:`#go @dir(rightdown)`}]},{name:`菜单`,items:[{name:`属性`,key:null,cmd:`#menu score`},{name:`背包`,key:null,cmd:`#menu pack`},{name:`技能`,key:null,cmd:`#menu skills`},{name:`任务`,key:null,cmd:`#menu tasks`},{name:`商城`,key:null,cmd:`#menu shop`},{name:`社交`,key:null,cmd:`#menu message`},{name:`排行`,key:null,cmd:`#menu stats`},{name:`设置`,key:null,cmd:`#menu setting`},{name:`动作`,key:null,cmd:`#menu showcombat`},{name:`活动`,key:null,cmd:`#menu events`},{name:`聊天`,key:null,cmd:`#menu showchat`},{name:`停止`,key:null,cmd:`#menu stopstate`},{name:`江湖`,key:null,cmd:`#menu jh`}]}],setting:null,show:function(e){this.element=e,this.init(),e.on(`click`,`.skey-item`,this.item_clicked),document.body.addEventListener(`keydown`,this.record_press)},hide:function(){document.body.removeEventListener(`keydown`,this.record_press)},close:function(){document.body.removeEventListener(`keydown`,this.record_press)},record_press:function(e){let t=Dialog.keys.select_item;if(!t)return;let n=Dialog.keys.get_item(t.attr(`sid`));if(!n)return;if(e.keyCode===8||e.keyCode===27)return Dialog.keys.save_setting(n,null),t.find(`.skey-key`).html(``);let r=Dialog.keys.get_key_code(e);Dialog.keys.save_setting(n,r),t.find(`.skey-key`).html(n.key),e.preventDefault(),e.stopPropagation()},get_key_code:function(e){let t=e.code;if(e.ctrlKey){if(e.key===`Control`)return;t=`Ctrl+`+t}if(e.altKey){if(e.key===`Alt`)return;t=`Alt+`+t}if(e.shiftKey){if(e.key===`Shift`)return;t=`Shift+`+t}return t},save_setting:function(e,t){if(e.key=t,this.setting||={},!t)t=this.id2keys[e.id],t&&delete this.setting[t],delete this.id2keys[e.id];else if(t){if(this.setting[t]){if(this.setting[t]===e.id)return;let n=this.get_item(this.setting[t]);n&&(n.key=null,this.element.find(`.skey-item[sid="`+n.id+`"]>.skey-key`).html(``))}this.setting[t]=e.id}x.storage.setItem(`keys`,this.setting)},get_item:function(e){this.groups.length===2&&this.init();let t=e.split(`_`),n=Dialog.keys.groups[parseInt(t[0])];if(n)return n.items[parseInt(t[1])]},default_keys:{KeyW:`0_2`,KeyA:`0_0`,KeyR:`0_6`,KeyD:`0_1`,KeyS:`0_3`,KeyQ:`0_4`},init_key:function(){if(!this.load_storage&&!x.isMobile&&(this.load_storage=!0,this.setting=x.storage.getItem(`keys`),window.addEventListener(`keydown`,this.keypress),this.id2keys={},this.setting))for(let e in this.setting)this.id2keys[this.setting[e]]=e},keypress:function(e){if(e.target!==document.body)return;let t=Dialog.keys.setting;if(!t)return;let n=Dialog.keys.get_key_code(e);if(t[n]){let r=Dialog.keys.get_item(t[n]);r&&(M.run(r.cmd),e.preventDefault())}},item_clicked:function(){let e=Dialog.keys.select_item;e&&e.removeClass(`selected`),Dialog.keys.select_item=$(this).addClass(`selected`)},init:function(){if(this.groups.length>2)return;let e=this.id2keys||{},t=null,n=0;for(let r of this.groups){for(let i=0;i<r.items.length;i++)t=n+`_`+i,r.items[i].id=t,r.items[i].key=e[t];n++}let r={name:`动作栏`,items:[]};for(let n=0;n<12;n++)t=`2_`+n,r.items.push({name:`栏位`+(n+1),id:t,cmd:`#action `+n,key:e[t]});this.groups.push(r),r={name:`技能栏`,items:[]};for(let n=0;n<12;n++)t=`3_`+n,r.items.push({name:`栏位`+(n+1),id:t,cmd:`#pfm `+n,key:e[t]});this.groups.push(r),this.element&&this.create_html()},create_html:function(){let e=[],t=0,n=0;for(let r of this.groups){e.push(`<h3>`,r.name,`</h3>`),n=0;for(let t of r.items)e.push(`<div class="skey-item" sid="`,t.id,`">`),e.push(`<div class="skey-name">`,t.name,`</div>`),e.push(`<div class="skey-key">`,t.key,`</div>`),e.push(`</div>`),n++;t++}this.element.html(e.join(``))}},N={grade0:`#687168`,grade1:`#4f7659`,grade2:`#46777f`,grade3:`#8a6d1f`,grade4:`#7a658f`,grade5:`#9c663c`,grade6:`#a14a42`},P={grade0:`#c6cbc7`,grade1:`#9cc195`,grade2:`#8ab8c2`,grade3:`#d6bc77`,grade4:`#b9a4d6`,grade5:`#d29e6f`,grade6:`#df8a82`},we={moyun:{name:`墨韵宣纸`,desc:`宣纸暖灰，松烟墨绿，朱砂作点睛`,colors:{background:`#f5f0e4`,panel:`#faf6eb`,surface:`#efe6d2`,surface2:`#dfd2b6`,text:`#2e312b`,muted:`#71695c`,border:`#d0c2a5`,accent:`#3f5c4d`,active:`#a04f37`,danger:`#9d3b37`,warning:`#8a671e`,hp:`#9d3b37`,mp:`#3f5c4d`,buttonText:`#f8f3e5`,...N}},haobai:{name:`皓白晴窗`,desc:`月白窗明，石青幽蓝，留白疏朗`,colors:{background:`#f2f6f7`,panel:`#fcfefe`,surface:`#e9eff1`,surface2:`#d7e0e4`,text:`#283137`,muted:`#68777d`,border:`#c2cfd4`,accent:`#315e70`,active:`#3f7268`,danger:`#9e3f3b`,warning:`#8a651c`,hp:`#9e3f3b`,mp:`#315e70`,buttonText:`#f8fbfc`,...N}},zhuxia:{name:`朱霞宫墙`,desc:`宫墙暖赭，朱砂沉着，鎏金一点`,colors:{background:`#f3eadf`,panel:`#faf2e8`,surface:`#eadbca`,surface2:`#dbc3a8`,text:`#382c27`,muted:`#79695e`,border:`#c8ac8b`,accent:`#8f4c38`,active:`#8e5427`,danger:`#9c3733`,warning:`#8d631d`,hp:`#9c3733`,mp:`#3f6a60`,buttonText:`#faf1e5`,...N}},songyan:{name:`宋式烟岚`,desc:`山岚灰绿，松烟入纸，远山含黛`,colors:{background:`#edf0e9`,panel:`#f6f8f2`,surface:`#e4e8dd`,surface2:`#d1d6c8`,text:`#323a34`,muted:`#69736b`,border:`#b8beb1`,accent:`#4d655a`,active:`#8f6547`,danger:`#9b3f3b`,warning:`#88651d`,hp:`#9b3f3b`,mp:`#4d655a`,buttonText:`#f4f6ef`,...N}},qingci:{name:`青瓷月白`,desc:`青瓷冰裂，水色清透，似月入盏`,colors:{background:`#eef4f0`,panel:`#f6faf7`,surface:`#e3ece6`,surface2:`#d0ded6`,text:`#293832`,muted:`#60736b`,border:`#b7c9bf`,accent:`#3d6960`,active:`#8d6748`,danger:`#9c413b`,warning:`#88671f`,hp:`#9c413b`,mp:`#3d6960`,buttonText:`#f2f7f4`,...N}},ruyao:{name:`汝窑天青`,desc:`雨过天青，似玉非玉，温润内敛`,colors:{background:`#edf2f1`,panel:`#f5f9f8`,surface:`#e1e9e7`,surface2:`#cdd9d6`,text:`#293634`,muted:`#607471`,border:`#b6c7c3`,accent:`#406b68`,active:`#876546`,danger:`#9b423c`,warning:`#87671f`,hp:`#9b423c`,mp:`#406b68`,buttonText:`#f1f6f4`,...N}},xuanhui:{name:`玄灰夜幕`,desc:`玄灰入暮，铅华洗尽，月轮微明`,colors:{background:`#181b1d`,panel:`#1f2326`,surface:`#272b2f`,surface2:`#34393e`,text:`#e3e5e5`,muted:`#a2a8ab`,border:`#4a5156`,accent:`#bbc4c7`,active:`#7f8a8e`,danger:`#d87b72`,warning:`#d8b66c`,hp:`#d87b72`,mp:`#9eb1b5`,buttonText:`#181b1d`,...P}},daiqing:{name:`黛青夜泊`,desc:`黛青夜色，江灯一点，水阔山遥`,colors:{background:`#14201f`,panel:`#1c2b29`,surface:`#253733`,surface2:`#304540`,text:`#dbe3dc`,muted:`#99a8a1`,border:`#4a5f56`,accent:`#9db6aa`,active:`#b78d5c`,danger:`#cf7b6b`,warning:`#d0b268`,hp:`#cf7b6b`,mp:`#86aaa0`,buttonText:`#14201f`,...P}},zhuying:{name:`竹影深庭`,desc:`深庭竹影，苔痕上阶，青灯入卷`,colors:{background:`#182019`,panel:`#202a20`,surface:`#2a3529`,surface2:`#354332`,text:`#dde3d7`,muted:`#a3ad9e`,border:`#4f5d4a`,accent:`#a6b891`,active:`#b99458`,danger:`#cc786a`,warning:`#cfae63`,hp:`#cc786a`,mp:`#8eab83`,buttonText:`#182019`,...P}},ouhe:{name:`藕荷月影`,desc:`藕荷微紫，月影轻纱，夜气温柔`,colors:{background:`#231e24`,panel:`#2d262e`,surface:`#383139`,surface2:`#453c46`,text:`#e6dde1`,muted:`#b2a4ab`,border:`#62545f`,accent:`#c29bae`,active:`#9e826d`,danger:`#d07b76`,warning:`#d1ac6d`,hp:`#d07b76`,mp:`#9eb4a7`,buttonText:`#231e24`,...P}},lanshan:{name:`岚山夜岫`,desc:`夜雨岚山，黛蓝幽远，云岫微光`,colors:{background:`#161f25`,panel:`#1f2a31`,surface:`#293640`,surface2:`#35444e`,text:`#dce2e5`,muted:`#a0abb1`,border:`#52636b`,accent:`#9eb6bc`,active:`#b08c63`,danger:`#cc7a6c`,warning:`#cfa965`,hp:`#cc7a6c`,mp:`#8fb3b4`,buttonText:`#161f25`,...P}},zitan:{name:`紫檀夜读`,desc:`紫檀木色，灯影温润，古卷沉香`,colors:{background:`#221b19`,panel:`#2d2421`,surface:`#392f2a`,surface2:`#483b35`,text:`#e7dcd2`,muted:`#b4a296`,border:`#625147`,accent:`#c19a7d`,active:`#a87e55`,danger:`#cf7a6c`,warning:`#d0a765`,hp:`#cf7a6c`,mp:`#98b09b`,buttonText:`#221b19`,...P}}},Te=[[`background`,`背景`],[`panel`,`主面板`],[`surface`,`内容块`],[`surface2`,`按钮`],[`text`,`正文`],[`muted`,`弱文本`],[`border`,`边框`],[`accent`,`强调`],[`active`,`选中`],[`danger`,`危险`],[`warning`,`提示`],[`hp`,`气血`],[`mp`,`内力`],[`grade0`,`品阶0`],[`grade1`,`品阶1`],[`grade2`,`品阶2`],[`grade3`,`品阶3`],[`grade4`,`品阶4`],[`grade5`,`品阶5`],[`grade6`,`品阶6`]],Ee={background:`--theme-bg`,panel:`--theme-panel`,surface:`--theme-surface`,surface2:`--theme-surface-2`,text:`--theme-text`,muted:`--theme-muted`,border:`--theme-border`,accent:`--theme-accent`,active:`--theme-active`,danger:`--theme-danger`,warning:`--theme-warning`,hp:`--theme-hp`,mp:`--theme-mp`,buttonText:`--theme-button-text`,grade0:`--theme-grade-0`,grade1:`--theme-grade-1`,grade2:`--theme-grade-2`,grade3:`--theme-grade-3`,grade4:`--theme-grade-4`,grade5:`--theme-grade-5`,grade6:`--theme-grade-6`},De=/^#[0-9a-f]{6}$/i;function Oe(e){return{...e}}function ke(e){let t=[1,3,5].map(function(t){let n=parseInt(e.slice(t,t+2),16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});return t[0]*.2126+t[1]*.7152+t[2]*.0722}function Ae(e){return we[e]?e:`moyun`}function je(e){if(!e)return{};try{let t=typeof e==`string`?JSON.parse(e):e,n={};for(let[e]of Te)De.test(t[e])&&(n[e]=t[e]);return De.test(t.buttonText)&&(n.buttonText=t.buttonText),n}catch(e){return console.warn(`自定义主题解析失败:`,e),{}}}function Me(e){let t={};for(let[n]of Te)De.test(e[n])&&(t[n]=e[n].toLowerCase());return JSON.stringify(t)}function Ne(e,t){return e===`custom`?{...Oe(we.moyun.colors),...je(t)}:Oe(we[Ae(e)].colors)}function Pe(e,t){let n=Ne(e,t),r=document.documentElement,i=ke(n.background)>=.35;for(let e in Ee)r.style.setProperty(Ee[e],n[e]);return r.style.setProperty(`--theme-sheen`,i?`rgba(255, 255, 255, 0.30)`:`rgba(255, 255, 255, 0.05)`),document.body.style.backgroundColor=n.background,document.body.style.color=n.text,document.body.dataset.theme=e===`custom`?`custom`:Ae(e),document.body.dataset.themeMode=i?`light`:`dark`,n}var Fe=`setting_theme`,Ie=`setting_theme_custom`;function Le(e){return e===`custom`?`custom`:Ae(e)}var F={keep_msg:0,show_hpnum:0,show_hp:0,item_autoheight:0,item_firstme:0,hide_roomdesc:0,exits_dir:0,show_sa:0,show_command:0,fontsize:`0.875rem`,font:``,no_spmsg:0,fontcolor:`#24312f`,backcolor:`#f4f0e6`,theme:Le(a.getItem(Fe,`moyun`)),theme_custom:a.getItem(Ie,``),auto_showcombat:0,auto_sortitem:0,auto_hideroom:0,show_roomitem:0,fullscreen:0,channel_chat:1,channel_tm:1,channel_fam:1,channel_es:1,ban_pk:0,off_plist:0,combat_wrap:0,combat_size:`1em`,dialog_size:`1em`,menu_size:`1em`,action_wrap:0,off_hp:0,show_damage:0,auto_recovery:0,auto_recovery_hp:80,auto_recovery_mp:60,auto_get_filter:``,no_master:0,no_team:0,no_load:!0,load:function(e){if(this.auto_recovery=0,this.auto_recovery_hp=80,this.auto_recovery_mp=60,Dialog.keys.init_key(),Dialog.extend.init_extend(),!e){this.apply_theme();return}var t=!1;for(var n in e)if(!(n==`fullscreen`||n==`fontcolor`||n==`backcolor`)){if(this[n]=e[n],n==`theme`||n==`theme_custom`){t=!0;continue}this.set_prop(n,e[n])}t&&this.apply_theme(),Dialog.extend.syncAutoRecoveryControls&&Dialog.extend.syncAutoRecoveryControls()},set_prop:function(e,t){switch(e){case`theme`:this.theme=t===`custom`?`custom`:Ae(t),this.apply_theme();break;case`theme_custom`:this.theme_custom=t||``,this.theme===`custom`&&this.apply_theme();break;case`fontsize`:$(`.container`).css(`font-size`,t),$(`.dialog-confirm`).css(`font-size`,t);break;case`font`:t===`none`&&(t=``),$(`.container`).css(`font-family`,t);break;case`combat_size`:$(`.content-bottom`).css(`font-size`,t);break;case`dialog_size`:$(`.dialog`).css(`font-size`,t);break;case`show_sa`:Combat.refActions();break;case`menu_size`:$(`.bottom-bar`).css(`font-size`,t);break;case`fontcolor`:case`backcolor`:break;case`hide_roomdesc`:t?$(`.room_desc`).hide():$(`.room_desc`).show();break;case`exits_dir`:Process.exits();break;case`off_hp`:t?$(`.item-status`).hide():$(`.item-status`).show();break;case`combat_wrap`:t?$(`.combat-commands`).addClass(`combat-wrap`):$(`.combat-commands`).removeClass(`combat-wrap`);break;case`action_wrap`:t?$(`.room-commands`).addClass(`combat-wrap`):$(`.room-commands`).removeClass(`combat-wrap`);break;case`item_autoheight`:t?$(`.room_items`).removeAttr(`style`):$(`.room_items`).attr(`style`,`max-height: 8rem; overflow-y: auto;`);break;case`item_firstme`:if(t==1){var n=$(`.room_items>.room-item[itemid='`+Process.player+`']`);$(`.room_items`).prepend(n)}break;case`show_hp`:Combat.IsShow||(t==1?$(`.room-item>.item-status`).show():$(`.room-item>.item-status`).hide());break;case`show_hpnum`:Process.cur_room&&Process.items(Process.cur_room);break;case`show_damage`:$(`.item-damage`).remove();break;case`fullscreen`:t?F.launchFullScreen():F.exitFullscreen();break;case`show_command`:Process.itemsElement.find(`.item-commands`).remove();break;case`no_spmsg`:t?Process.ChannelElement.hide():Process.ChannelElement.show();break}},apply_theme:function(){this.theme=Le(this.theme);var e=Pe(this.theme,this.theme_custom);return this.persist_theme(),e},persist_theme:function(){a.setItem(Fe,this.theme),this.theme_custom&&a.setItem(Ie,this.theme_custom)},save:function(e,t){this[e]=t,this.set_prop(e,t);var n=e===`auto_get_filter`&&t?encodeURIComponent(t):t;SendCommand(`setting `+e+` `+(n||0))},launchFullScreen:function(e){e||=document.documentElement,e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},exitFullscreen:function(){document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen&&document.webkitExitFullscreen()}};F.apply_theme();var Re=[[`pick`,`拾取`],[`sell`,`出售`],[`fenjie`,`分解`],[`ignore`,`不拾取`]],ze=[[``,`全部种类`],[`equip`,`装备`],[`stone`,`宝石`],[`book`,`秘籍`],[`res`,`资源`],[`item`,`道具`],[`drug`,`药品`],[`cash`,`元宝物品`],[`money`,`银两`]],Be=[[``,`任意品质`],[`0`,`普通`],[`1`,`精良`],[`2`,`高级`],[`3`,`稀有`],[`4`,`绝世`],[`5`,`传说`],[`6`,`神器`]],Ve=[[``,`任意部位`],[`weapon`,`武器`],[`cloth`,`衣服`],[`shoes`,`鞋`],[`head`,`头部`],[`cape`,`披风`],[`ring`,`戒指`],[`necklace`,`项链`],[`jewels`,`饰品`],[`wrist`,`护腕`],[`waist`,`腰带`],[`throwing`,`暗器`]],He=[[``,`不限`],[`>=`,`不低于`],[`<=`,`不高于`],[`=`,`等于`]],Ue=[[``,`不限价值`],[`>=`,`价值不低于`],[`<=`,`价值不高于`]];function I(e){return String(e??``).replace(/[&<>"']/g,function(e){return{"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`}[e]})}function L(e,t){for(var n=Array.isArray(t)?t.map(String):[String(t??``)],r=[],i=0;i<e.length;i++)r.push(`<option value="`,I(e[i][0]),`"`,n.indexOf(String(e[i][0]))>=0?` selected`:``,`>`,I(e[i][1]),`</option>`);return r.join(``)}function We(e){return e=String(e??``),/^[0-6]$/.test(e)?`grade`+e:``}function Ge(e){for(var t=Array.isArray(e)?e.map(String):[String(e??``)],n=[],r=0;r<Be.length;r++){var i=We(Be[r][0]);n.push(`<option value="`,I(Be[r][0]),`"`,i?` class="`+i+`"`:``,t.indexOf(String(Be[r][0]))>=0?` selected`:``,`>`,I(Be[r][1]),`</option>`)}return n.join(``)}function Ke(e){return e||={},{action:e.action||`pick`,type:e.type||``,gradeOp:e.gradeOp||``,grade:e.grade??``,eq:e.eq||``,name:e.name||``,valueOp:e.valueOp||``,value:e.value??``,force:+!!e.force}}function qe(e){for(var t=[],n={拾取:`pick`,pick:`pick`,出售:`sell`,sell:`sell`,卖掉:`sell`,分解:`fenjie`,fenjie:`fenjie`,忽略:`ignore`,不拾取:`ignore`,ignore:`ignore`},r={装备:`equip`,宝石:`stone`,秘籍:`book`,资源:`res`,道具:`item`,药品:`drug`,元宝:`cash`,银两:`money`},i=String(e||``).split(/[\n;；]+/),a=0;a<i.length;a++){var o=i[a].trim();if(o){var s=o.split(/\s+/),c=Ke({action:n[s[0]]||n[s[0]?.toLowerCase()]});if(c.action){var l=/(?:类型|种类|type)=([^ ]+)/i.exec(o);l&&(c.type=r[l[1]]||l[1]),l=/(?:品质|品阶|grade)(>=|<=|=)(\d+)/i.exec(o),l&&(c.gradeOp=l[1],c.grade=l[2]),l=/(?:名称|名字|name)=([^ ]+)/i.exec(o),l&&(c.name=l[1]),l=/(?:价值|value)(>=|<=|=)(\d+)/i.exec(o),l&&(c.valueOp=l[1]===`=`?`>=`:l[1],c.value=l[2]),t.push(c)}}}return t}function Je(e){if(!e||e===`0`)return[];try{var t=JSON.parse(e);if(Array.isArray(t))return t.map(Ke)}catch{return qe(e)}return[]}function Ye(e){return[[`--opt-bg`,`background`],[`--opt-panel`,`panel`],[`--opt-surface`,`surface`],[`--opt-surface2`,`surface2`],[`--opt-text`,`text`],[`--opt-muted`,`muted`],[`--opt-border`,`border`],[`--opt-accent`,`accent`],[`--opt-active`,`active`],[`--opt-button`,`buttonText`]].filter(function(t){return e[t[1]]}).map(function(t){return t[0]+`:`+e[t[1]]}).join(`;`)}var Xe={footer:[[`显示`,`setting`],[`<yel>高级</yel>`,`custom`],[`快捷键`,`keys`],[`扩展`,`extend`]],selectitem:null,init:function(){this.settingElement||(x.isMobile&&this.footer.splice(2,1),this.settingElement=$(Ze),this.extendElement=$(et),this.keysElement=$($e),this.customElement=$(Qe),this.buildThemeControls(),Dialog.injectStyle(tt),this.syncControls())},syncControls:function(){if(this.settingElement)for(var e=this.settingElement.add(this.customElement).find(`.setting-item`),t=0;t<e.length;t++){var n=$(e[t]),r=n.attr(`for`);if(r){var i=F[r],a=n.find(`.switch`);switch(a.removeClass(`on`).find(`.switch-text`).html(`关`),r){case`fontsize`:this.select_color(n.find(`.color-item`),i,`fontSize`);break;case`font`:this.select_color(n.find(`.color-item`),i,`fontFamily`);break;case`combat_size`:case`menu_size`:case`dialog_size`:this.select_value(n.find(`.color-item`),i);break;case`theme`:this.select_theme(i),this.fillThemeInputs();break;case`auto_pfm`:case`auto_pfm2`:i?(a.addClass(`on`),a.find(`.switch-text`).html(`开`),this.customElement.find(`#`+r).show().val(i)):this.customElement.find(`#`+r).hide().val(``);break;case`auto_get_filter`:this.renderLootFilterRules(i),i?(a.addClass(`on`),a.find(`.switch-text`).html(`开`),this.customElement.find(`#auto_get_filter`).show()):this.customElement.find(`#auto_get_filter`).hide();break;case`auto_work`:i?(a.addClass(`on`),a.find(`.switch-text`).html(`开`),this.customElement.find(`#`+r).show().val(i==1?``:i)):this.customElement.find(`#`+r).hide().val(``);break;default:i==1&&(a.addClass(`on`),a.find(`.switch-text`).html(`开`));break}}}},show:function(){if(!this.isShow){this.footerChanged(`setting`),Dialog.icon(`cog`),Dialog.title(`设置`),Dialog.footerElement.empty();for(var e=0;e<this.footer.length;e++){var t=$(`<span class='footer-item' for='`+this.footer[e][1]+`'>`+this.footer[e][0]+`</span>`).appendTo(Dialog.footerElement);e==0&&t.addClass(`select`)}this.isShow=!0}},select_color:function(e,t,n){for(var r=0;r<e.length;r++)e[r].style[n]==t?$(e[r]).addClass(`select`):$(e[r]).removeClass(`select`)},select_value:function(e,t){for(var n=0;n<e.length;n++)$(e[n]).attr(`value`)==t?$(e[n]).addClass(`select`):$(e[n]).removeClass(`select`)},footerChanged:function(e){let t=this[e+`Element`];if(!t||t===this.selectitem)return this.child?.command(e);this.selectitem&&this.selectitem.remove(),this.selectitem=t,this.child&&this.child.hide(),this.child=null,e==`setting`?(this.syncControls(),this.selectitem.off(`.dialogSetting`),this.selectitem.on(`click.dialogSetting`,`.switch`,this.switchClick),this.selectitem.on(`click.dialogSetting`,`.color-item`,this.colorClick),this.selectitem.on(`click.dialogSetting`,`.theme-option`,this.themeClick),this.selectitem.on(`input.dialogSetting change.dialogSetting`,`.theme-color-input`,this.themeInputChanged),this.selectitem.on(`click.dialogSetting`,`.theme-custom-save`,this.saveThemeCustom)):e==`custom`?(this.syncControls(),this.selectitem.off(`.dialogSetting`),this.selectitem.on(`click.dialogSetting`,`.switch`,this.switchClick),this.selectitem.on(`click.dialogSetting`,`.setting-ok`,this.save_custom),this.selectitem.on(`click.dialogSetting`,`.loot-filter-add`,this.addLootFilterRule),this.selectitem.on(`click.dialogSetting`,`.loot-filter-delete`,this.deleteLootFilterRule),this.selectitem.on(`change.dialogSetting`,`.loot-filter-grade`,function(){Dialog.setting.updateLootFilterGradeColor(this)})):(this.child=Dialog[e],this.child.show(this.selectitem)),this.selectitem.appendTo(Dialog.contentElement)},helpClick:function(){switch($(this).attr(`action`)){case`tologin`:break;case`torole`:T.Close(),k(`#role_panel`,function(){Process.player=null,Process.clear()});break;case`toserver`:Process.player=null,T.Close();break;default:break}},close_help:function(){this.frame&&=(this.frame.remove(),this.selectitem.removeClass(`help-detl`),null)},hide:function(){if(this.child&&this.child.hide()===!1)return!1;this.close()},close:function(){this.child?.close(),this.selectitem?.remove(),this.isShow=!1,this.selectitem=null,this.child=null},save_custom:function(){if($(`.dialog-custom>.setting-item[for='auto_work']>.switch`).is(`.on`)){var e=$(`#auto_work`).val();if(e&&e.length>400)return D(`<hir>你设置的过长。</hir>`);F.save(`auto_work`,e||1)}if($(`.dialog-custom>.setting-item[for='auto_get_filter']>.switch`).is(`.on`)){var e=Dialog.setting.collectLootFilterRules();if(!e.length)return D(`<hir>你没有设置战利品过滤规则。</hir>`);if(e=JSON.stringify(e),e.length>2e3)return D(`<hir>你设置的过滤规则过长。</hir>`);F.save(`auto_get_filter`,e)}D(`<hic>设置已保存。</hic>`)},get_pfms:function(e){if(!Combat.Skills)return D(`<hir>你没有可用的绝招设置。</hir>`);for(var t=[],n=0;n<Combat.Skills.length;n++)t.length>0&&t.push(`,`),t.push(Combat.Skills[n].id);$(`#`+e).val(t.join(``)),D(`已预设置为你默认的绝招(未保存)，你可以修改为适合你的出招顺序后点击保存`)},createLootFilterRule:function(e){e=Ke(e);var t=We(e.grade),n=[];return n.push(`<div class="loot-filter-rule">`),n.push(`<select data-key="action">`,L(Re,e.action),`</select>`),n.push(`<select data-key="type">`,L(ze,e.type),`</select>`),n.push(`<select data-key="gradeOp">`,L(He,e.gradeOp),`</select>`),n.push(`<select data-key="grade" class="loot-filter-grade`,t?` `+t:``,`">`,Ge(e.grade),`</select>`),n.push(`<select data-key="eq">`,L(Ve,e.eq),`</select>`),n.push(`<input data-key="name" type="text" maxlength="20" placeholder="名称包含" value="`,I(e.name),`">`),n.push(`<select data-key="valueOp">`,L(Ue,e.valueOp),`</select>`),n.push(`<input data-key="value" type="number" min="0" step="1" placeholder="价值" value="`,I(e.value),`">`),n.push(`<label class="loot-filter-force"><input data-key="force" type="checkbox"`,e.force?` checked`:``,`>确认高品分解</label>`),n.push(`<button type="button" class="loot-filter-delete">删除</button>`),n.push(`</div>`),n.join(``)},updateLootFilterGradeColor:function(e){var t=$(e),n=We(t.val());t.removeClass(`grade0 grade1 grade2 grade3 grade4 grade5 grade6`),n&&t.addClass(n)},renderLootFilterRules:function(e){var t=this.customElement.find(`#auto_get_filter`),n=t.find(`.loot-filter-rules`);if(n.length){for(var r=Je(e),i=[],a=0;a<r.length;a++)i.push(this.createLootFilterRule(r[a]));n.html(i.join(``)),t.find(`.loot-filter-empty`).toggle(!r.length)}},addLootFilterRule:function(){var e=Dialog.setting.customElement.find(`#auto_get_filter`);return e.find(`.loot-filter-rules`).append(Dialog.setting.createLootFilterRule({action:`pick`})),e.find(`.loot-filter-empty`).hide(),!1},deleteLootFilterRule:function(){var e=Dialog.setting.customElement.find(`#auto_get_filter`);return $(this).closest(`.loot-filter-rule`).remove(),e.find(`.loot-filter-empty`).toggle(!e.find(`.loot-filter-rule`).length),!1},collectLootFilterRules:function(){var e=[];return this.customElement.find(`#auto_get_filter .loot-filter-rule`).each(function(){var t=$(this),n={};t.find(`[data-key]`).each(function(){var e=this.getAttribute(`data-key`);this.type===`checkbox`?n[e]=+!!this.checked:n[e]=$(this).val()}),n=Ke(n),n.grade&&!n.gradeOp&&(n.gradeOp=`=`),n.value&&!n.valueOp&&(n.valueOp=`>=`),e.push(n)}),e},switchClick:function(e){var t=$(this),n=t.parent().attr(`for`),r=0;switch(t.is(`.on`)?(t.removeClass(`on`),t.find(`.switch-text`).html(`关`)):(t.addClass(`on`),t.find(`.switch-text`).html(`开`),r=1),n){case`auto_pfm`:case`auto_pfm2`:r?($(`#`+n).show(),Dialog.setting.get_pfms(n),F[n]=0):($(`#`+n).hide(),F.save(n,0));break;case`auto_work`:r?$(`#`+n).show():($(`#`+n).hide(),F.save(n,0));break;case`auto_get_filter`:r?($(`#auto_get_filter`).show(),$(`#auto_get_filter .loot-filter-rule`).length||Dialog.setting.addLootFilterRule()):($(`#auto_get_filter`).hide(),F.save(n,0));break;default:F.save(n,r);break}return e.cancelable=!0,!1},colorClick:function(){var e=$(this);if(!e.is(`.select`)){var t=e.parent();t.children().removeClass(`select`),e.addClass(`select`);var n=t.closest(`.setting-item`).attr(`for`);if(n){var r=``;switch(n){case`combat_size`:case`dialog_size`:case`menu_size`:r=e.attr(`value`);break;case`fontsize`:r=e[0].style.fontSize;break;case`font`:r=e[0].style.fontFamily,r||=`none`;break}F.save(n,r)}}},buildThemeControls:function(){var e=[];for(var t in we){var n=we[t];e.push(`<span class="theme-option" theme="`,t,`" title="`,n.desc||n.name,`" style="`,Ye(n.colors),`">`),e.push(`<span class="theme-swatch"><i></i><i></i><i></i></span>`),e.push(`<span class="theme-name">`,n.name,`</span>`),e.push(`</span>`)}this.settingElement.find(`.theme-list`).html(e.join(``));var r=Ne(F.theme,F.theme_custom);this.settingElement.find(`.theme-custom-entry`).html(`<span class="theme-option theme-custom-option" theme="custom" title="自定义配色" style="`+Ye(r)+`"><span class="theme-swatch custom-swatch"><i></i><i></i><i></i></span><span class="theme-name">自定义</span></span>`);for(var i=[],a=0;a<Te.length;a++){var o=Te[a];i.push(`<label class="theme-color-field"><span>`,o[1],`</span>`,`<input class="theme-color-input" type="color" theme-field="`,o[0],`">`,`</label>`)}this.settingElement.find(`.theme-custom-grid`).html(i.join(``))},select_theme:function(e){e||=`moyun`,this.settingElement.find(`.theme-option`).removeClass(`select`),this.settingElement.find(`.theme-option[theme="`+e+`"]`).addClass(`select`),this.settingElement.find(`.theme-custom-panel`).toggleClass(`hide`,e!==`custom`)},fillThemeInputs:function(){var e=Ne(F.theme,F.theme_custom);this.settingElement.find(`.theme-color-input`).each(function(){var t=this.getAttribute(`theme-field`);this.value=e[t]||`#000000`}),this.updateCustomSwatch(e)},updateCustomSwatch:function(e){var t=this.settingElement.find(`.theme-custom-option`);t.length&&t.attr(`style`,Ye(e))},readThemeInputs:function(){var e={};return this.settingElement.find(`.theme-color-input`).each(function(){e[this.getAttribute(`theme-field`)]=this.value}),{...je(F.theme_custom),...e}},themeClick:function(){var e=$(this).attr(`theme`);e&&(Dialog.setting.select_theme(e),F.save(`theme`,e),Dialog.setting.fillThemeInputs())},themeInputChanged:function(){var e=Dialog.setting.readThemeInputs();Dialog.setting.updateCustomSwatch(e),F.theme=`custom`,F.theme_custom=Me(e),F.set_prop(`theme`,`custom`),Dialog.setting.select_theme(`custom`)},saveThemeCustom:function(){var e=Me(Dialog.setting.readThemeInputs());if(e.length>1e3)return D(`<hir>自定义配色数据过长。</hir>`);F.save(`theme_custom`,e),F.save(`theme`,`custom`),Dialog.setting.select_theme(`custom`),D(`<hic>自定义主题已保存。</hic>`)}},Ze=`
 <div class="setting dialog-setting">

            <h3>房间信息</h3>
            <div class="setting-item" for="hide_roomdesc">
                <span class="title">
                    不显示房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="exits_dir">
                <span class="title">
                    出口描述使用方向描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_command">
                <span class="title">
                    在房间列出NPC或道具的可用命令
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_roomitem">
                <span class="title">
                    在命令栏列出房间内的可用物品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="item_firstme">
                <span class="title">
                    自己始终显示在房间物品第一列
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="keep_msg">
                <span class="title">
                    切换房间时不清空上房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_move">
                <span class="title">
                    不显示玩家进出房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_plist">
                <span class="title">
                    隐藏玩家列表(只显示自己和NPC)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_spmsg">
                <span class="title">
                    聊天信息不分开显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_sortitem">
                <span class="title">
                    按品质自动排列背包和技能
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_message">
                <span class="title">
                    不显示其他玩家或NPC的房间消息(基本忽略所有战斗，动作描述，慎用)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_sa">
                <span class="title">
                    动作栏显示快捷操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <h3>战斗信息</h3>

            <div class="setting-item" for="auto_showcombat">
                <span class="title">
                    战斗时自动打开战斗面板
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_hideroom">
                <span class="title">
                    战斗时自动隐藏房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_combatmsg">
                <span class="title">
                    不显示其他玩家的战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_mcmsg">
                <span class="title">
                    不显示自己的普通战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="action_wrap">
                <span class="title">
                    动作栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="combat_wrap">
                <span class="title">
                    技能栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_hpnum">
                <span class="title">
                    显示血量为数字
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_hp">
                <span class="title">
                    关闭血条显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_damage">
                <span class="title">
                    显示伤害统计
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>基本设置</h3>
            <div class="setting-item" for="fullscreen">
                <span class="title">
                    全屏显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="font">
                <span class="title">
                    字体(仅浏览器)
                </span>
                <span class="color-list">
                    <span class="color-item">默</span>
                    <span class="color-item" style="font-family:宋体;">宋</span>
                    <span class="color-item" style="font-family:楷体;">楷</span>
                    <span class="color-item" style="font-family:隶书;">隶</span>
                </span>
            </div>
            <div class="setting-item" for="fontsize">
                <span class="title">
                    字体大小
                </span>
                <span class="color-list">
                    <span class="color-item" style="font-size:0.75rem;">字</span>
                    <span class="color-item" style="font-size:0.875rem;">字</span>
                    <span class="color-item" style="font-size:1rem;">字</span>
                    <span class="color-item" style="font-size:1.25rem;">字</span>
                </span>
            </div>

            <h3>界面配色</h3>
            <div class="setting-item theme-setting" for="theme">
                <span class="theme-list"></span>
                <span class="theme-custom-entry"></span>
            </div>
            <div class="theme-custom-panel hide">
                <div class="theme-custom-grid"></div>
                <button type="button" class="theme-custom-save">保存自定义主题</button>
            </div>
            <div class="setting-item" for="combat_size">
                <span class="title">
                    底部操作栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="dialog_size">
                <span class="title">
                    顶部窗口大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="menu_size">
                <span class="title">
                    菜单栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <h3>游戏设置</h3>
            <div class="setting-item" for="no_master">
                <span class="title">
                    不接受玩家拜师
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_team">
                <span class="title">
                    不接受玩家组队邀请
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="hide_equip">
                <span class="title">
                    隐藏自己的装备
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_cus">
                <span class="title">
                    允许其他玩家查看自己的自创武功
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fight">
                <span class="title">
                    不接受比试
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="ban_pk">
                <span class="title">
                    PK保护
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>频道设置 </h3>
            <div class="setting-item" for="off_chat">
                <span class="title">
                    屏蔽公共频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fam">
                <span class="title">
                    屏蔽门派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_es">
                <span class="title">
                    屏蔽全区频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_pty">
                <span class="title">
                    屏蔽帮派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
        </div>
`,Qe=`  <div class="setting dialog-custom">

            <div class="setting-item" for="auto_work">
                <span class="title">
                    当你学习，练习，打坐中断后，自动去挖矿或以下操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_work"></textarea>

            <div class="setting-item" for="auto_get">
                <span class="title">
                    当你击杀NPC后自动拾取战利品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_get_filter">
                <span class="title">
                    战利品过滤规则（自动拾取开启后生效，扫荡也会套用）
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="loot-filter-editor hide" id="auto_get_filter">
                <div class="loot-filter-tools">
                    <span class="loot-filter-empty">暂未添加规则</span>
                    <button type="button" class="loot-filter-add">添加规则</button>
                </div>
                <div class="loot-filter-rules"></div>
            </div>
            <div class="setting-help">规则从上到下匹配，命中第一条生效；未命中的战利品默认拾取，需要丢弃时请添加“不拾取”规则。</div>

            <!-- <div class="setting-item" for="extend">
                <span class="title">
                    自定义操作按钮
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="extend"></textarea> -->

            <button class="setting-ok">保存设置</button>
        </div>`,$e=` <div class="setting dialog-skeys"></div>`,et=` <div class="setting dialog-extend"></div>`,tt=`
.setting {
    padding-bottom: 0.625em;
    height: 100%;
    min-height: 0;
    overflow-y: auto;
}

.setting-item {
    line-height: 2em;
    min-height: 2.4em;
    padding: 0.25em 0.6em 0.25em 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-border);
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.setting-item>.title {
    margin-right: 0.625em;
    flex: 1;
    text-align: left;
    white-space: initial;
    line-height: 1.35em;
}

.setting-item>.color-list {

    margin-right: 1em;
}
.color-list>.color-item {
    width: 3em;
    height: 1.25em;
    display: inline-block;
    border: 2px solid var(--theme-border);
    line-height: 1.25em;
    text-align: center;
    border-radius: 1em;
    box-sizing: content-box;
}

.color-list>.select {
    border-color: var(--theme-danger);
}
.setting-item>.button {
    flex: 0;
    background-color: var(--theme-surface-2);
    padding-left: 1em;
    padding-right: 1em;
    border-left: 1px solid gray;
}

.setting-item>.button:active {
    background-color: var(--theme-panel);
}


.setting>h3 {
    color: var(--theme-muted);
    border-bottom: 1px solid var(--theme-border);
    padding-bottom: 0.5em;
}

.setting>.settingbox {
    margin-left: 0.625em;
    border: 1px solid var(--theme-border);
    background-color: transparent;
    color: unset;
    resize: none;
    width: 98%;
    height: 3rem;
}
.setting>.loot-filter-editor {
    margin: 0 0.625em 0.65em;
    border: 1px solid var(--theme-border);
    background-color: var(--theme-surface-2);
    padding: 0.5em;
    border-radius: 4px;
}
.loot-filter-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    margin-bottom: 0.45em;
}
.loot-filter-empty {
    color: var(--theme-muted);
    font-size: 0.9em;
}
.loot-filter-add, .loot-filter-delete {
    border: 1px solid var(--theme-border);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    border-radius: 4px;
    padding: 0.2em 0.55em;
}
.loot-filter-rules {
    display: flex;
    flex-direction: column;
    gap: 0.45em;
}
.loot-filter-rule {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.4em 0.45em;
    align-items: center;
    padding: 0.45em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-panel);
}
.loot-filter-rule select, .loot-filter-rule input {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--theme-border);
    background-color: var(--theme-surface-2);
    color: var(--theme-text);
    border-radius: 3px;
    height: 1.75em;
}
.loot-filter-rule select {
    appearance: none;
    -webkit-appearance: none;
    padding: 0 1.7em 0 0.45em;
    background-image:
        linear-gradient(45deg, transparent 50%, var(--theme-muted) 50%),
        linear-gradient(135deg, var(--theme-muted) 50%, transparent 50%),
        linear-gradient(to bottom, var(--theme-border), var(--theme-border));
    background-position:
        calc(100% - 0.78em) 50%,
        calc(100% - 0.48em) 50%,
        calc(100% - 1.45em) 50%;
    background-size: 0.34em 0.34em, 0.34em 0.34em, 1px 65%;
    background-repeat: no-repeat;
}
.loot-filter-rule select:hover, .loot-filter-rule input:hover {
    background-color: var(--theme-surface);
}
.loot-filter-rule select:focus, .loot-filter-rule input:focus {
    outline: none;
    border-color: var(--theme-accent);
    box-shadow: 0 0 0 1px var(--theme-accent);
}
.loot-filter-rule select option {
    background-color: var(--theme-panel);
    color: var(--theme-text);
}
.loot-filter-rule .loot-filter-grade.grade0,
.loot-filter-rule .loot-filter-grade option.grade0 {
    color: var(--theme-grade-0);
}
.loot-filter-rule .loot-filter-grade.grade1,
.loot-filter-rule .loot-filter-grade option.grade1 {
    color: var(--theme-grade-1);
}
.loot-filter-rule .loot-filter-grade.grade2,
.loot-filter-rule .loot-filter-grade option.grade2 {
    color: var(--theme-grade-2);
}
.loot-filter-rule .loot-filter-grade.grade3,
.loot-filter-rule .loot-filter-grade option.grade3 {
    color: var(--theme-grade-3);
}
.loot-filter-rule .loot-filter-grade.grade4,
.loot-filter-rule .loot-filter-grade option.grade4 {
    color: var(--theme-grade-4);
}
.loot-filter-rule .loot-filter-grade.grade5,
.loot-filter-rule .loot-filter-grade option.grade5 {
    color: var(--theme-grade-5);
}
.loot-filter-rule .loot-filter-grade.grade6,
.loot-filter-rule .loot-filter-grade option.grade6 {
    color: var(--theme-grade-6);
}
.loot-filter-force {
    color: var(--theme-muted);
    font-size: 0.9em;
    white-space: nowrap;
    grid-column: 1 / 4;
    display: flex;
    align-items: center;
}
.loot-filter-delete {
    grid-column: 4;
    justify-self: end;
    min-width: 4em;
}
.loot-filter-force>input {
    width: auto;
    height: auto;
    margin-right: 0.25em;
}
@media (max-width: 760px) {
    .loot-filter-rule {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loot-filter-force, .loot-filter-delete {
        grid-column: auto;
    }
    .loot-filter-delete {
        justify-self: stretch;
    }
}
.setting>.setting-help {
    margin: -0.2em 0.625em 0.7em;
    color: var(--theme-muted);
    font-size: 0.85em;
    line-height: 1.45em;
}

.setting>.setting-ok {
    border: 1px solid var(--theme-border);
    background-color: transparent;
    color: unset;
    width: 5rem;
    height: 1.7rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
}

.theme-setting {
    display: block;
    padding: 0.85em 0.75em;
    overflow-x: visible;
    cursor: default;
}

.theme-list {
    display: grid;
    grid-template-columns: repeat(6, minmax(4.2em, 1fr));
    gap: 0.5em;
    margin: 0;
}

.theme-option {
    --opt-bg: var(--theme-bg);
    --opt-panel: var(--theme-panel);
    --opt-surface: var(--theme-surface);
    --opt-surface2: var(--theme-surface-2);
    --opt-text: var(--theme-text);
    --opt-muted: var(--theme-muted);
    --opt-border: var(--theme-border);
    --opt-accent: var(--theme-accent);
    --opt-active: var(--theme-active);
    --opt-button: var(--theme-button-text);
    position: relative;
    border: 1px solid var(--opt-border);
    border-radius: 0.5em;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3em;
    min-height: 3.5em;
    padding: 0.4em 0.2em 0.35em;
    background-color: var(--opt-panel);
    background-image: linear-gradient(155deg, color-mix(in srgb, var(--opt-bg) 14%, transparent), transparent 68%);
    color: var(--opt-muted);
    line-height: 1.2em;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    user-select: none;
}

.theme-option:hover {
    border-color: var(--opt-accent);
}

.theme-option.select {
    border-color: var(--opt-active);
    color: var(--opt-text);
    background-color: var(--opt-surface);
    box-shadow:
        inset 0 0 0 1px var(--opt-active),
        0 0.3em 0.9em color-mix(in srgb, var(--opt-active) 22%, transparent);
}

.theme-option.select::after {
    content: "✓";
    position: absolute;
    right: 0.22em;
    top: 0.18em;
    width: 1.05em;
    height: 1.05em;
    line-height: 1.05em;
    border-radius: 50%;
    background-color: var(--opt-active);
    color: var(--opt-button);
    font-size: 0.72em;
    font-weight: bold;
    text-align: center;
}

.theme-swatch {
    width: 2.8em;
    height: 1.1em;
    border-radius: 0.28em;
    border: 1px solid var(--opt-border);
    background-color: var(--opt-bg);
    display: flex;
    overflow: hidden;
    flex: none;
}

.theme-swatch>i {
    flex: 1;
    display: block;
    min-width: 0;
}

.theme-swatch>i:nth-child(1) {
    background-color: var(--opt-panel);
    border-right: 1px solid var(--opt-border);
}

.theme-swatch>i:nth-child(2) {
    background-color: var(--opt-accent);
}

.theme-swatch>i:nth-child(3) {
    background-color: var(--opt-text);
    opacity: 0.78;
}

.theme-name {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.78em;
    color: var(--opt-text);
}

.theme-custom-entry {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5em;
}

.theme-custom-entry>.theme-option {
    flex-direction: row;
    min-height: 2em;
    padding: 0.2em 0.6em;
    width: auto;
}

.theme-custom-entry .theme-swatch {
    width: 2.6em;
    height: 1em;
}

@media (max-width: 480px) {
    .theme-list {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .theme-option {
        min-height: 3.25em;
        padding: 0.35em 0.1em 0.3em;
    }

    .theme-swatch {
        width: 2.5em;
        height: 1em;
    }
}

.theme-custom-panel {
    margin: 0 0 0.5em 0;
    padding: 0.75em;
    border-left: 2px solid var(--theme-active);
    border-radius: 4px;
    background-color: var(--theme-panel);
}

.theme-custom-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(8em, 1fr));
    gap: 0.55em;
}

.theme-color-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5em;
    color: var(--theme-muted);
}

.theme-color-field>input {
    width: 3.5em;
    height: 2em;
    border: none;
    background-color: transparent;
    cursor: pointer;
}

.theme-custom-save {
    border: 1px solid var(--theme-border);
    background-color: var(--theme-surface-2);
    color: var(--theme-text);
    height: 2em;
    margin-top: 0.75em;
    border-radius: 0.25em;
    cursor: pointer;
}

.theme-custom-save:active {
    background-color: var(--theme-active);
    color: var(--theme-button-text);
}

.dialog-skeys {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
}


.dialog-skeys>.selected {
    border-left-color: var(--theme-active);
    color: var(--theme-active);
}



.extend-list {
    margin-top: 0.5em;
    height: calc(100% - 0.5em);
    min-height: 0;
    text-align: center;
}

.auto-recovery-settings {
    margin-bottom: 0.75em;
    text-align: left;
}

.auto-recovery-settings>.setting-item {
    margin-bottom: 0.4em;
}

.auto-recovery-thresholds {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5em;
}

.auto-recovery-thresholds>label {
    display: grid;
    grid-template-columns: 3em minmax(3.5em, 1fr) 1.5em;
    align-items: center;
    gap: 0.35em;
    min-height: 2.4em;
    padding: 0.25em 0.6em;
    border-left: 2px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-panel);
    color: var(--theme-text);
}

.auto-recovery-input {
    width: 100%;
    min-width: 0;
    height: 1.8em;
    box-sizing: border-box;
    border: 1px solid var(--theme-border);
    border-radius: 3px;
    background-color: var(--theme-surface-2);
    color: var(--theme-text);
    text-align: center;
}

.auto-recovery-input:focus {
    outline: none;
    border-color: var(--theme-accent);
    box-shadow: 0 0 0 1px var(--theme-accent);
}

.extend-section-title {
    margin: 0.5em 0;
    color: var(--theme-muted);
    text-align: left;
}

@media (max-width: 480px) {
    .auto-recovery-thresholds {
        grid-template-columns: 1fr;
    }
}

.extend-list>.buttons {
    text-align: center;
}

.extend-list>.buttons>button {
    margin: 0.5em;
    color: var(--theme-muted);
    background-color: var(--theme-panel);
    line-height: 2em;
}


.extend-add {
    display: flex;
    flex-direction: column;
    margin-top: 0.5em;
    height: calc(100% - 0.5em);
    min-height: 0;
}


.extend-row {
    line-height: 2em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-border);
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border-top: 1px solid var(--theme-surface-2);
    border-bottom: 1px solid var(--theme-surface-2);
    border-right: 1px solid transparent;
}

.extend-row>.extend-input {
    flex: 1;
    border: none;
    outline: none;
    background-color: var(--theme-bg);
    color: var(--theme-text);
    padding-left: 1em;
}

.extend-row>input {
    height: 2em;
}

.extend-row>textarea {
    height: 100%;
    resize: none
}

.extend-row>.extend-menus {
    display: flex;
    flex-direction: column;
}

.extend-row>.extend-row-header {
    width: 8em;
    text-align: center;
}

.extend-help {
    padding-inline-start: 0.5em;
    width: 100%;
    text-align: center;
    color: var(--theme-muted);
    flex: 1;
    overflow: auto;
    list-style-position: inside;
    text-align: left;
    white-space: normal;
    line-height: 1.5em;
}

.extend-menus>.switch {
    margin-top: 1em;
    width: 7em;
    margin-left: 0.5em;
}

.extend-menus>button {
    margin: 1em 0px;
    color: var(--theme-muted);
    background-color: var(--theme-panel);
}

.skey-item {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-border);
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.skey-item>.skey-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--theme-muted);
    overflow: hidden;
}

.skey-item>.skey-key {
    background-color: var(--theme-surface-2);
    width: 7em;
    text-align: center;
}

.switch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 0 0 auto;
    height: 1.45em;
    width: 4em;
    line-height: 1;
    border-radius: 0.8em;
    background: var(--theme-surface-2);
    cursor: pointer;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    vertical-align: middle;
    text-align: center;
}

.switch>.switch-button {
    position: absolute;
    left: 0px;
    height: 1.45em;
    width: 1.45em;
    border-radius: 0.8em;
    background: var(--theme-muted);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
    transition: 0.3s;
    -webkit-transition: 0.3s;
    left: 0px;
}

.switch>.switch-text {
    color: var(--theme-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85em;
    height: 100%;
    line-height: 1;
    margin-left: 0.55em;
}

.on {
    background-color: var(--theme-active);
}

.on>.switch-button {
    right: 0px;
    left: auto;
    background-color: var(--theme-text);
}

.on>.switch-text {
    margin-right: 0.55em;
    margin-left: 0px;
    color: var(--theme-button-text);
}
`,nt={types:[{name:`自定义快捷操作`,value:`button`,for:[{name:`动作栏`,value:`action`},{name:`地图`,value:`map`},{name:`背包道具`,value:`pack`},{name:`技能`,value:`skill`},{name:`师父/随从技能`,value:`mskill`},{name:`房间物体`,value:`item`}]}],init:function(e){if(e.off(`.dialogExtend`),e.on(`click.dialogExtend`,`[ecmd]`,this.onButtonClick),e.on(`click.dialogExtend`,`.setting-item`,this.onClickRow),e.on(`click.dialogExtend`,`.switch`,this.switchClick),e.on(`change.dialogExtend`,`select`,this.selectChanged),e.on(`change.dialogExtend`,`.auto-recovery-input`,this.autoRecoveryChanged),this.element)return;this.element=e;let t=[];t.push(`<div class="extend-list">`),this.append_settings(t),t.push(`</div>`),this.append_edit(t),e.html(t.join(``)),this.edit_elem=this.element.find(`.extend-add`),this.list_elem=this.element.find(`.extend-list`)},refresh_list:function(){let e=[];this.append_settings(e),this.list_elem.html(e.join(``))},syncAutoRecoveryControls:function(){if(!this.element)return;let e=this.element.find(`.auto-recovery-toggle>.switch`);e.toggleClass(`on`,!!F.auto_recovery),e.find(`.switch-text`).text(F.auto_recovery?`开`:`关`),this.element.find(`[data-setting="auto_recovery_hp"]`).val(this.normalizeRecoveryValue(F.auto_recovery_hp,80)),this.element.find(`[data-setting="auto_recovery_mp"]`).val(this.normalizeRecoveryValue(F.auto_recovery_mp,60))},append_settings:function(e){e.push(`<section class="auto-recovery-settings">`),e.push(`<div class="setting-item auto-recovery-toggle" data-setting="auto_recovery">`),e.push(`<span class="title">任务间自动恢复</span>`),e.push(`<span class="switch `,F.auto_recovery?`on`:``,`">`),e.push(`<span class="switch-button"></span><span class="switch-text">`,F.auto_recovery?`开`:`关`,`</span></span></div>`),e.push(`<div class="auto-recovery-thresholds">`),e.push(`<label><span>气血</span><input class="auto-recovery-input" data-setting="auto_recovery_hp"`,` type="number" inputmode="numeric" min="1" max="100" step="1" value="`,this.normalizeRecoveryValue(F.auto_recovery_hp,80),`"><span>%</span></label>`),e.push(`<label><span>内力</span><input class="auto-recovery-input" data-setting="auto_recovery_mp"`,` type="number" inputmode="numeric" min="1" max="100" step="1" value="`,this.normalizeRecoveryValue(F.auto_recovery_mp,60),`"><span>%</span></label>`),e.push(`</div></section>`),e.push(`<div class="extend-section-title">自定义扩展</div>`);let t=this.setting,n=0;for(let r of t)e.push(this.create_item(r,n++))},action_types:{button:`快捷操作`,trigger:`触发器`,filter:`过滤器`},regex:{message:!0,fmessage:!0},for_types:{map:`地图`,action:`动作栏`,pack:`背包道具`,skill:`技能`,item:`房间物体`,mskill:`师父/随从技能`,message:`文本`,data:`事件`,fmessage:`文本`,fdata:`事件`},create_item:function(e,t){let n=[];n.push(`<div class="setting-item" sid="`,t++,`">`),n.push(`<div class="title">`),n.push(this.for_types[e.for],this.action_types[e.type],`【`,e.name,`】`),n.push(`</div>`);let r=!1;return e.on&&e.on[Process.player]&&(r=!0),n.push(`<span class="switch `,r?`on`:``,`"><span class="switch-button"></span><span class="switch-text">开</span></span>`),n.push(`</div>`),n.join(``)},selectChanged:function(){let e=$(this);if(e.attr(`prop`)!==`type`){let t=e.val();e.parent().next().find(`.extend-row-header`).html(Dialog.extend.regex[t]?`正则表达式`:`可选参数`);return}let t=e.val(),n=null;for(let e of Dialog.extend.types)if(t===e.value){n=e.for;break}if(!n)return;e=e.parent().next().find(`select`);let r=[];for(let e of n)r.push(`<option value="`,e.value,`">`,e.name,`</option>`);e.html(r.join(``))},switchClick:function(){let e=$(this),t=e.find(`.switch-text`),n=t.text()!==`开始记录`,r=!1;if(e.is(`.on`)?(e.removeClass(`on`),n&&t.html(`关`)):(e.addClass(`on`),n&&t.html(`开`),r=!0),!n)r?(Dialog.close(),Dialog.extend.start_record()):Dialog.extend.stop_record();else{if(e.parent().attr(`data-setting`)===`auto_recovery`)return F.save(`auto_recovery`,+!!r),!1;let t=Dialog.extend.setting[e.parent().attr(`sid`)];t&&(t.on||={},r?t.on[Process.player]=1:delete t.on[Process.player],Dialog.extend.save_extend(t))}return!1},normalizeRecoveryValue:function(e,t){return e=parseInt(e),Number.isInteger(e)||(e=t),Math.max(1,Math.min(100,e))},autoRecoveryChanged:function(){let e=$(this),t=e.attr(`data-setting`);if(t!==`auto_recovery_hp`&&t!==`auto_recovery_mp`)return;let n=t===`auto_recovery_hp`?80:60,r=Dialog.extend.normalizeRecoveryValue(e.val(),n);e.val(r),F.save(t,r)},start_record:function(){this.is_record||(this.is_record=!0,this.prev_time=0,this.record_cmds=[],D(`<hic>开始记录你的操作命令。</hic>`),Process.state({state:`正在记录你的操作命令`}))},excluded:{score:!0,score2:!0,pack:!0,cha:!0,tasks:!0,message:!0,relation:!0,shop:!0,team:!0,jh:!0},excluded_check:[e=>e.startsWith(`jh`)&&e.indexOf(`start`)<0,e=>e.startsWith(`stats`),e=>e.startsWith(`map`),e=>e.startsWith(`look`)],record:function(e){if(!this.is_record||this.excluded[e])return;for(let t of this.excluded_check)if(t(e))return;let t=Date.now();this.prev_time>0&&this.record_cmds.push(`#wait `+(t-this.prev_time)),this.record_cmds.push(e),this.prev_time=t},stop_record:function(){this.is_record&&(this.is_record=!1,D(`<cyn>已停止记录你的操作命令。</cyn>`),this.edit_elem.find(`.switch`).removeClass(`on`),this.record_cmds.length>0&&(Dialog.show(`setting`),Dialog.setting.footerChanged(3),this.edit_elem.show(),this.list_elem.hide(),this.edit_elem.find(`textarea`).val(this.record_cmds.join(`;`)),Process.state()))},helper:`<li ecmd='show_actions'>可用命令参考</li><li ecmd='show_vars'>可用变量参考</li><li ecmd='show_paras'>参数用法参考</li>`,append_edit:function(e){e.push(`<div class="extend-add hide">`),e.push(`<div class="extend-row">`),e.push(`<input  prop="name" class="extend-input"/>`),e.push(`<div class='extend-row-header'>提示/描述/说明</div>`),e.push(`</div>`),e.push(`<div class="extend-row">`),e.push(`<select prop="type" class="extend-input">`);for(let t of this.types)e.push(`<option value="`,t.value,`">`,t.name,`</option>`);e.push(`</select><div class='extend-row-header'>扩展类型</div>`),e.push(`</div>`);let t=this.types[0];e.push(`<div class="extend-row">`),e.push(`<select prop="for" class="extend-input">`);for(let n of t.for)e.push(`<option value="`,n.value,`">`,n.name,`</option>`);e.push(`</select><div class='extend-row-header'>可用选项</div>`),e.push(`</div>`),e.push(`<div class="extend-row">`),e.push(`<input  prop="paras" class="extend-input"/>`),e.push(`<div class='extend-row-header'>可选参数</div>`),e.push(`</div>`),e.push(`<div class="extend-row flex-1">`),e.push(`<textarea   prop="content"  class="extend-input"></textarea>`),e.push(`<div class='extend-row-header extend-menus'>`),e.push(`<span class="switch"> <span class="switch-button"> </span><span class="switch-text">开始记录</span></span>`),e.push(`<ul class='extend-help'>`),e.push(this.helper),e.push(`</ul><button ecmd='save'>保存</button>`),e.push(`</div></div>`),e.push(`</div>`)},onClickRow:function(){var e=$(this),t=Dialog.extend.setting[e.attr(`sid`)];t&&(Dialog.extend.selected_item=t,Dialog.extend.edit_button||(Dialog.extend.edit_button=$(`<div class="buttons"><button ecmd="edit">编辑</button><button ecmd="up">上移</button><button ecmd="down">下移</button><button ecmd="remove">移除</button></div>`)),Dialog.extend.edit_button.insertAfter(e))},show:function(e){this.init(e),this.syncAutoRecoveryControls(),this.footer_buttons||=$(`<div class="obj-money"><span for="import" class="footer-item">导入</span><span for="export" class="footer-item">导出</span><span for="add" class="footer-item">添加扩展</span></div>`),Dialog.footerElement.append(this.footer_buttons)},command:function(e){let t=this[`cmd_`+e];t&&t.call(this)},cmd_import:function(){if(!this.fileinput){let e=$(`<input type="file" style="display:none"  accept=".json" />`)[0];document.body.appendChild(e),this.fileinput=e,e.addEventListener(`change`,function(e){let t=e.target.files[0];if(!t)return D(`<red>未选择扩展文件。</red>`);if(t.name.split(`.`).pop().toLowerCase()!==`json`&&![`application/json`,`text/json`,`text/plain`].includes(t.type))return e.target.value=``,D(`<red>请选择有效的JSON文件！</red>`);let n=new FileReader;n.onload=function(e){try{let t=JSON.parse(e.target.result);Dialog.extend.setting=t.items,Dialog.extend.refresh_list(),Dialog.extend.save_extend(),D(`<cyn>扩展文件加载成功。</cyn>`)}catch(e){console.error(`JSON解析错误：`,e),D(`<red>扩展文件加载失败。</red>`)}},n.onerror=function(){console.error(`文件读取错误：`,n.error),D(`<red>扩展文件读取失败。</red>`)},n.readAsText(t,`utf-8`)})}this.fileinput.click()},cmd_export:function(){try{let e={id:Process.player,version:`0.1`,items:Dialog.extend.setting},t=JSON.stringify(e,null,2);if(window.android&&typeof window.android.saveJsonFile==`function`)window.android.saveJsonFile(`武神扩展.json`,t),D(`<cyn>扩展导出为本地文件【武神扩展.json】。</cyn>`);else{let e=new Blob([t],{type:`application/json;charset=utf-8`}),n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.style.display=`none `,r.download=`武神扩展.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(n),D(`<cyn>扩展导出为本地文件【武神扩展.json】。</cyn>`)}}catch(e){console.error(`保存JSON文件失败：`,e),alert(`文件保存失败，请重试！`)}},hide:function(){if(this.is_record&&this.stop_record(),this.list_elem.is(`.hide`))return this.list_elem.removeClass(`hide`),this.edit_elem.addClass(`hide`),!1;this.footer_buttons.remove()},close:function(){},default_extend:[{name:`<red>全部击杀</red>`,type:`button`,for:`action`,content:`kill @npc`},{name:`<gre>全部拾取</gre>`,type:`button`,for:`action`,content:`get all from @item(尸体)`},{name:`<gre>返回武庙</gre>`,type:`button`,for:`map`,paras:`name(扬州)`,content:`jh fam 0 start;go north;go north;go west`},{name:`练习到指定等级`,type:`button`,for:`skill`,content:`lianxi @id @input`},{name:`学习到指定等级`,type:`button`,for:`mskill`,content:`xue @input @id from @master`}],init_extend:function(){this.setting||=x.storage.getItem(`extends`)??this.default_extend,this.init_extend_group()},init_extend_group:function(){this.groups={};for(let e of this.setting)this.init_extend_item(e)},save_extend:function(){x.storage.setItem(`extends`,this.setting),this.init_extend_group(),Combat.refActions()},init_extend_item:function(e){let t=this.groups[e.for];t||=this.groups[e.for]=[];let n=e.content;e.on===!0&&(e.on={},e.on[Process.player]=1),!(!n||!e.on||!e.on[Process.player])&&(n[0]!==`#`&&(n=`#`+n),t.push({name:e.name,extend:!0,check:this.regex[e.for]?this.match(e.paras):this.condtion(e.paras),cmd:n}))},match:function(e){try{return e?this.express.match.bind(this,new RegExp(e)):null}catch(e){return console.error(e),null}},exp_reg:/(\w+)\((>=|<=|!=|>|<)?(.+?)\)/g,condtion:function(e){if(!e)return null;let t=null,n=[];for(;t=this.exp_reg.exec(e);){let e=t[1],r=t[2],i=t[3];if(!e||!i)return null;if(r){let t=this.express[r];if(!t)return null;n.push(t.bind(this,e,i))}else i[0]===`/`&&i[i.length-1]===`/`?n.push(this.express.match_prop.bind(this,e,new RegExp(i.substring(1,i.length-1)))):n.push(this.express.def.bind(this,e,i))}return n.length>0?n:null},express:{">=":function(e,t,n){return n[e]>=parseInt(t)},">":function(e,t,n){return n[e]>parseInt(t)},"<":function(e,t,n){return n[e]<parseInt(t)},"<=":function(e,t,n){return n[e]<=parseInt(t)},"=":function(e,t,n){return n[e]=parseInt(t)},"!=":function(e,t,n){return n[e]!=parseInt(t)},match:function(e,t){let n=e.exec(t);return n?(SCRIPT.lAST_MATCHES=n,!0):!1},match_prop:function(e,t,n){let r=n[e];return!r||!t?!1:t.test(r)},def:function(e,t,n){let r=n[e];return typeof r==`number`?r===parseInt(t):typeof r==`boolean`?r&&r.toString()===t:r&&r.indexOf(t)>-1}},query:function(e,t){let n=[];return this.append(n,e,t),n},append:function(e,t,n){let r=this.groups[t];if(r)for(let t of r)this.check_para(t,n)&&e.push(t)},message_filter:function(e){},data_filter:function(){},trigger:function(e){if(!this.groups)return;let t=this.groups.message;if(t)for(let n of t)n.check&&n.check(e)&&SCRIPT.run(n.cmd)},process:function(e){if(!this.groups)return;let t=this.groups.data;if(t)for(let n of t)this.check_para(n,e)&&(SCRIPT.LAST_DATA=e,SCRIPT.run(n.cmd))},check_para:function(e,t){if(!e.check)return!0;for(let n of e.check)if(!n(t))return!1;return!0},onButtonClick:function(){let e=$(this).attr(`ecmd`).split(`_`),t=e[0];e[0]=$(this);let n=Dialog.extend[`cmd_`+t];n&&n.apply(Dialog.extend,e)},cmd_add:function(){this.edit_elem.removeClass(`hide`),this.list_elem.addClass(`hide`),this.edit_elem.attr(`sid`,`-1`);let e=this.edit_elem.find(`input, textarea`);for(let t of e)$(t).val(``)},cmd_up:function(){this.cmd_move(-1)},cmd_down:function(){this.cmd_move(1)},cmd_move:function(e){let t=this.selected_item;if(!t)return;let n=this.setting.indexOf(t),r=this.setting.indexOf(t)+e;r<0||r>=this.setting.length||(this.setting.splice(n,1),this.setting.splice(r,0,t),this.refresh_list(),this.save_extend())},cmd_edit:function(){let e=this.selected_item;if(!e)return;this.edit_elem.show(),this.list_elem.hide(),this.edit_elem.attr(`sid`,this.setting.indexOf(e));let t=this.edit_elem.find(`input, textarea, select`);for(let n of t){let t=$(n).val(),r=e[n.getAttribute(`prop`)];r!==t&&$(n).val(r).change()}},cmd_save:function(){let e=parseInt(this.edit_elem.attr(`sid`)),t=this.edit_elem.find(`input, textarea, select`),n={};for(let e of t)n[e.getAttribute(`prop`)]=e.value;if(!n.name)return this.show_error(`name`);if(!n.type)return this.show_error(`type`);if(!n.content)return this.show_error(`content`);if(n.paras&&(Dialog.extend.regex[n.for]?n.check=this.match(n.paras):n.check=this.condtion(n.paras),!n.check))return this.show_error(`paras`);this.hide(),$(this.create_item(n,this.setting.length)).appendTo(this.list_elem),e<0?this.setting.push(n):(n.on=this.setting[e].on,this.setting[e]=n,this.refresh_list()),this.save_extend()},cmd_remove:function(){let e=this.selected_item;e&&(this.setting.Remove(e),this.refresh_list(),this.save_extend())},show_error:function(e){let t=this.element.find(`[prop="`+e+`"]`).parent();t.addClass(`error-shake`),setTimeout(()=>{t.removeClass(`error-shake`)},1500)},cmd_show:function(e,t){let n=SCRIPT.helper[t];if(!n)return;let r=[];for(let e=0;e<n.length;e++)r.push(`<li>`,n[e],`</li>`);let i=e.parent();i.html(r.join(``)),i.next().html(`返回`).attr(`ecmd`,`return`)},cmd_return:function(e){e.html(`保存`).attr(`ecmd`,`save`).prev().html(this.helper)}},rt={footer:[[`全部`,``],[`世界`,`chat`],[`队伍`,`tm`],[`门派`,`fam`],[`全区`,`es`],[`帮派`,`pty`],[`系统`,`sys`]],isScroll:!0,last_click:0,show:function(){if(Date.now()-this.last_click>500){this.last_click=Date.now();return}if(!Dialog.channel.isShow){Dialog.select(`channel`),Dialog.icon(`comment`),Dialog.title(``),Dialog.footer(``);for(var e=0;e<Dialog.channel.footer.length;e++){var t=$(`<span class='footer-item channel-item' for='`+Dialog.channel.footer[e][1]+`'>`+Dialog.channel.footer[e][0]+`</span>`).appendTo(Dialog.footerElement);e==0&&t.addClass(`select`)}Dialog.contentElement.html(``).append(Process.ChannelElement.addClass(`channel-dialog`)),Dialog.channel.isShow=!0,Dialog.channel.scrollBottom()}},hide:function(){Dialog.channel.footerChanged(``),Process.ChannelElement.removeClass(`channel-dialog`).insertBefore(`.content-message`),this.scrollBottom(),this.isShow=!1},close:function(){this.hide()},scrollBottom:function(){Process.channel.scroll2end()},footerChanged:function(e){if(Dialog.channel.select_item!=e){Dialog.channel.select_item=e,Process.channel.clear();for(var t=0;t<this.datas.length;t++){var n=this.datas[t];(!e||n[0]==e)&&Process.channel.push(n[1])}Process.channel.scroll2end()}},datas:[],createElement:function(e,t){var n=`hic`,r=``;switch(e.ch){case`tm`:n=`hig`,r=`队伍`;break;case`fam`:n=`hiy`,r=e.fam||`门派`;break;case`rumor`:n=`him`,r=`谣言`,e.name=`某人`;break;case`sys`:n=`hir`,r=`系统`,e.name=``;break;case`es`:n=`hio`,r=e.server,e.uid=null;break;case`pty`:n=`hiz`,r=`帮派`;break;default:r=[`闲聊`,`闲聊`,`闲聊`,`<hiy>宗师</hiy>`,`<HIZ>武圣</HIZ>`,`<hio>武帝</hio>`,`<ord>武神</ord>`][e.lv],e.lv6&&(r=[`<ord>武神</ord>`,`<ord>剑神</ord>`,`<ord>刀皇</ord>`,`<ord>兵主</ord>`,`<ord>战神</ord>`][e.lv6]);break}var i=[`<`,n,`>【`];i.push(r),i.push(`】`),e.name&&(i.push(`<span`),e.uid&&i.push(` cmd='look3 `+e.uid+`'`),i.push(`>`),i.push(e.name),i.push(`</span>：`)),i.push(e.content);var a=i.join(``);return this.datas.length>800&&(this.datas.length=0,this.datas.splice(0,200)),e.ch==`rumor`&&(e.ch=`sys`),this.datas.push([e.ch,a]),this.select_item&&this.select_item!=e.ch?``:a}},R={IsShow:!1,Skills:null,actions:null,room_actions:null,object_actions:null,AutoOpened:!1,AutoClosedRoomPath:null,Scroll:function(e){let t=$(this)[0];t.scrollLeft+=e.originalEvent.deltaY},Show:function(e){if(R.IsShow)return e?void 0:R.Hide(!1);this.object_actions||SendCommand(`actions`),R.IsShow=!0,R.AutoOpened=!!e,e||(R.AutoClosedRoomPath=null),F.off_hp||$(`.room-item>.item-status`).show(),$(`.combat-panel`).removeClass(`hide`),this.refActions(),Process.message.scroll2end()},Hide:function(e){e&&!R.AutoOpened||(R.IsShow=!1,!e&&R.room&&(R.AutoClosedRoomPath=R.room.path),R.AutoOpened=!1,F.off_hp||$(`.room-item>.item-status`).hide(),$(`.combat-panel`).addClass(`hide`))},ShowRoomCommands:function(e){this.room=e,this.room_actions=e.commands;let t=Array.isArray(this.room_actions)&&this.room_actions.some(function(e){return e&&e.cmd!==`cr`});t&&!R.IsShow&&R.AutoClosedRoomPath!==e.path?R.Show(!0):!t&&R.IsShow&&R.AutoOpened&&R.Hide(!0),R.IsShow&&this.refActions()},def_actions:[{cmd:`dazuo`,name:`打坐`},{cmd:`liaoshang`,name:`疗伤`}],refActions:function(){let e=[...this.def_actions];this.actions=e,this.room&&Dialog.extend.append(e,`action`,this.room),this.create_actions()},ShowActions:function(e){this.object_actions=e.actions??[],this.refActions(),e.skills&&this.ShowPFM(e)},ShowPFM:function(e){this.Skills=e.skills||[],this.create_skillItems(e.skills)},append_items:function(e,t){if(e)for(let n of e)n.elem=$(`<span class='act-item' cmd='${n.cmd}'>${n.name}</span>`).appendTo(t),n.disper>0&&n.elem.css(`backgroundSize`,n.disper+`% 100%`)},create_actions:function(e){var t=$(`.room-commands`).empty();this.append_items(this.actions,t),this.append_items(this.object_actions,t),this.append_items(this.room_actions,t)},DisObj:function(e){if(this.object_actions)for(var t=e.act?e.id:`use `+e.id,n=0;n<this.object_actions.length;n++){var r=this.object_actions[n];if(r.cmd===t){if(e.remove)return this.object_actions.splice(n,1),r.elem.remove();this.ANI_OBJ(r,e.time,e.time)}}},AddObj:function(e,t){if(this.object_actions){for(var n=`use `+e,r=0;r<this.object_actions.length;r++)if(this.object_actions[r].cmd==n)return;this.object_actions.push({cmd:`use `+e,name:t.replace(/\<.+?\>/g,``)}),this.create_actions()}},ANI_OBJ:function(e,t,n){let r=e.elem;if(r){var i=n*100/t;i>0?r.css(`backgroundSize`,i+`% 100%`):(i<0&&(i=0),r.css(`backgroundSize`,`0% 100%`)),e.disper=i,setTimeout(R.ANI_OBJ,1e3,e,t,n-1e3)}},create_skillItems:function(e){var t=$(`.combat-commands`).empty();if(e.length){for(var n=0;n<e.length;n++){var r=[];r.push(`<span class='pfm-item' pid='`+e[n].id+`'>`),r.push(`<span class='pfm-cd-fill'></span>`),r.push(`<span class='pfm-label'>`),r.push(e[n].name),r.push(`</span>`),r.push(`<span class='pfm-cd-text'></span>`),r.push(`</span>`),e[n].elem=$(r.join(``)).appendTo(t)}this.dis_pfms&&this.dis_pfms.length&&!this.time_handler&&this.ANI_PFM()}},ChangeDistime:function(e){if(R.dis_pfms){for(var t=e.id.replace(`/`,`.`),n=0;n<R.dis_pfms.length;n++)if(R.dis_pfms[n].id==t){R.dis_pfms[n].ani_time+=e.time;break}}},ClearDistime:function(e){if(R.dis_pfms)for(var t=e.id?e.id.replace(`/`,`.`):e.id,n=0;n<R.dis_pfms.length;n++)(!t||R.dis_pfms[n].id==t)&&(R.dis_pfms[n].ani_time=0)},redisable:function(){R.dis_pfms=[];for(var e=0;e<R.Skills.length;e++){var t=R.Skills[e];R.dis_pfms.push({id:t.id,distime:t.distime,ani_time:t.distime})}R.time_handler||R.ANI_PFM()},On_Perform:function(e){if(this.Skills){if(e.id===`all`&&!e.rtime)return this.redisable();e.id&&=e.id.replace(`/`,`.`),e.rtime=e.rtime||0,e.distime=e.distime||0,this.dis_pfms||=[];for(var t=0;t<this.dis_pfms.length;t++){if(this.dis_pfms[t].id==e.id){e.id=null,this.dis_pfms[t].distime=e.distime,this.dis_pfms[t].ani_time=e.distime;continue}this.dis_pfms[t].ani_time<e.rtime&&(this.dis_pfms[t].ani_time=e.rtime,this.dis_pfms[t].distime=e.rtime)}e.id&&this.dis_pfms.push({id:e.id,distime:e.distime,ani_time:e.distime}),R.ani_time=R.ani_time??0,e.rtime>R.ani_time&&(R.distime=e.rtime,R.ani_time=e.rtime),this.time_handler||R.ANI_PFM()}},updatePFMCooldown:function(e,t,n){!e||!e.elem||(t>100&&(t=100),t<0&&(t=0),n=Math.max(0,n||0),n>0&&t>0?(e.elem.addClass(`cooldown`).css(`--cooldown-percent`,t+`%`).css(`backgroundSize`,t+`% 100%`),e.elem.find(`.pfm-cd-text`).text(Math.ceil(n/1e3))):(e.elem.removeClass(`cooldown`).css(`--cooldown-percent`,`0%`).css(`backgroundSize`,`0% 100%`),e.elem.find(`.pfm-cd-text`).text(``)))},PFM_INTERVAL:300,ANI_PFM:function(){var e=0;R.distime>0&&(e=R.ani_time*100/R.distime);for(var t=0;t<R.Skills.length;t++){for(var n=R.Skills[t],r=e,i=R.ani_time,a=0;a<R.dis_pfms.length;a++)if(R.dis_pfms[a].id==n.id&&R.dis_pfms[a].distime){r=R.dis_pfms[a].ani_time*100/R.dis_pfms[a].distime,i=R.dis_pfms[a].ani_time,r<0?R.dis_pfms.splice(a,1):R.dis_pfms[a].ani_time-=R.PFM_INTERVAL;break}R.updatePFMCooldown(n,r,i)}R.ani_time>0||R.dis_pfms.length?R.time_handler=setTimeout(R.ANI_PFM,R.PFM_INTERVAL):R.time_handler=null,R.ani_time-=R.PFM_INTERVAL},StatusChanged:function(e){for(var t=$(`.room-item`),n=0;n<t.length;n++){var r=$(t[n]);if(r.attr(`itemid`)==e.id){this.UpdaeBar(e,`mp`,r),this.UpdaeBar(e,`hp`,r);break}}},UpdaeBar:function(e,t,n){var r=e[t],i=0;if(r!=null){var a=n.find(`.`+t+`>.progress-bar`);if(e[`max_`+t]?(i=e[`max_`+t],a.attr(`max`,i)):i=parseInt(a.attr(`max`)),F.show_hpnum&&t==`hp`&&n.find(`.progress-num`).html(`[`+Process.get_hpnum(r,i)+`<nor>/</nor><hiy>`+i+`</hiy>]`),a.css(`width`,R.CountWidth(r,i)+`%`),F.show_damage&&e.damage&&e.id!=Process.player){var o=0;o=e.damage==-1?parseInt((i-r)*1e3/i)/10:parseInt(e.damage*1e3/i)/10,a=n.find(`.item-damage`),a.length||(a=$(`<span class="item-damage">[<hiy>0%</hiy>]<span>`).appendTo(n.find(`.item-name`))),a.html(`[<hiy>`+o+`%</hiy>]`)}}},CountWidth:function(e,t){if(t==0)return 0;var n=e*100/t;return n>=100?100:n<0?0:n},Perform:function(){var e=$(this);if(!e.is(`disable`)&&!e.hasClass(`cooldown`)){var t=e.attr(`pid`);t&&(Dialog.isShow&&Dialog.hide(),SendCommand(`perform `+t))}},STATUS:{},AppendStatusItem:function(e,t,n){var r={elem:t,items:{}};if(n)for(var i=0;i<n.length;i++)this.StatusItem_add(r,n[i]);this.STATUS[e]=r},StatusItemChanged:function(e){var t=R[`StatusItem_`+e.action];t&&t.call(R,this.STATUS[e.id],e)},StatusItem_add:function(e,t){if(e){var n=[];n.push(`<span class="status-item`),t.downside&&n.push(` downside`),n.push(`" sid="`),n.push(t.sid),n.push(`">`),n.push(t.name),t.count!=null&&(n.push(`x`),n.push(t.count)),n.push(`<span class="shadow"></span></span>`),e.items[t.sid]={elem:$(n.join(``)).appendTo(e.elem)[0],name:t.name,count:t.count,duration:t.duration,anitime:t.duration-(t.overtime||0)},t.duration>0&&R.StatusItemANI(e.items[t.sid])}},StatusItem_remove:function(e,t){if(e){var n=t.sid;typeof n==`string`&&(n=[n]);for(var r=0;r<n.length;r++){var i=e.items[n[r]];i&&($(i.elem).remove(),i.handler&&clearTimeout(i.handler),delete e.items[n[r]])}}},StatusItem_refresh:function(e,t){if(e){var n=e.items[t.sid];if(n){n.elem.firstChild;var r=n.elem.lastChild;n.count=t.count,n.elem.innerHTML=n.name+`x`+n.count+r.outerHTML,n.handler&&clearTimeout(n.handler),n.anitime=n.duration,R.StatusItemANI(n)}}},StatusItem_override:function(e,t){var n=e.items[t.sid];n&&(n.handler&&clearTimeout(n.handler),n.anitime=n.duration,R.StatusItemANI(n))},StatusItem_clear:function(e,t){if(e){for(var n in e.items){var r=e.items[n];r&&($(r.elem).remove(),clearTimeout(r.handler))}e.items={}}},StatusItemANI:function(e){var t=e.elem.lastChild,n=e.anitime*100/e.duration;n<0&&(n=0),t.style.right=n+`%`,e.anitime-=1e3,n>0?e.handler=setTimeout(R.StatusItemANI,1e3,e):e.handler=0}},it=[`武器`,`衣服`,`鞋`,`头部`,`披风`,`戒指`,`项链`,`饰品`,`护腕`,`腰带`,`暗器`],at={close:function(){this.hide(),this.element.remove(),this.isShow=!1,this.skill_element_id=null,this.element.removeClass(`hide-item`)},hide:function(){this.objelement&&=(this.objelement.remove(),null),Dialog.element&&Dialog.element.removeClass(`dialog-pack-dialog`),Dialog.footerElement&&Dialog.footerElement.removeClass(`pack-footer pack-cleanup-footer`)},init:function(){this.created||(Dialog.injectStyle(ot),Dialog.injectStyle(st)),this.created=!0},command_before:``,updateitem:function(e){if(e.money!=null&&(this.money=e.money,this.show_moeny()),e.eq_group!==void 0)this.eq_group=e.eq_group,this.show_moeny();else if(e.eq!=null&&this.items){for(var t=0;t<this.items.length;t++)if(this.items[t].id==e.id){this.eqs[e.eq]=this.items[t],this.items.splice(t,1);break}this.show_items()}else if(e.uneq!=null&&this.items){var n=this.eqs[e.uneq];n.can_eq=1,n.count=1,this.items.push(n),this.eqs[e.uneq]=null,this.show_items()}else if(e.locked>=0){let t=this.get_item(e.id);if(t){t.is_lock=e.locked;let n=this.packElement.find(`[oindex="`+e.id+`"]`);t.is_lock?n.addClass(`lock`):n.removeClass(`lock`)}}else if(e.jldesc){var r=[];r.push(e.jldesc),r.push(`<span class='item-commands'>`),r.push(`<span cmd="`+this.command_before+`jinglian `+e.id+` ok">精炼</span>`),r.push(`<span cmd="`+this.command_before+`jinglian `+e.id+` full">精炼到满级</span>`),r.push(`</span>`),this.show_sub(r.join(``),this.get_sub_title(e,`精炼`))}else if(e.xqdesc){var r=[];r.push(e.xqdesc);var i=e.stones||[];if(i.length){r.push(`<div class='xq-stone-list'>`);for(var t=0;t<i.length;t++){var a=i[t];r.push(`<div class='xq-stone-item grade`,a.grade||0,`' cmd="`,this.command_before,`xiangqian `,e.id,` `,a.id,`">`),r.push(`<span class='xq-stone-name'>`,a.name,`</span>`),a.count>1&&r.push(`<span class='xq-stone-count'>×`,a.count,`</span>`),r.push(`<div class='xq-stone-prop'>`,a.prop||`无特殊功效`,`</div>`),r.push(`</div>`)}r.push(`</div>`),r.push(`<div class='xq-stone-tip'>点击宝石即可镶嵌</div>`)}else r.push(`<div class='xq-stone-empty'>身上没有可以镶嵌的宝石</div>`);this.show_sub(r.join(``),this.get_sub_title(e,`镶嵌`))}else if(e.desc){var r=[];r.push(e.desc),r.push(`<span class='item-commands'>`);var o=e.from,s=this.get_sub_title(e);if(o==`eq`)r.push(`<span cmd="`+this.command_before+`uneq `+e.id+`">取消装备</span>`);else if(o==`item`){var c=this.get_item(e.id);M.LAST_OBJ=c,c&&this.create_item_command(c,r,e.commands)}else o==`store`||o==`sj`?r.push(`<span cmd="_confirm qu `+e.id+`">取出</span>`):r.push(`<span cmd="_confirm buy 1 `+e.id+` from `+Dialog.list.seller+`">购买</span>`);r.push(`</span>`),this.show_sub(r.join(``),s)}else if(e.remove&&this.items){for(var l=this.items,t=0;t<l.length;t++)if(l[t].id==e.id){e.remove>=l[t].count?(l.splice(t,1),R.DisObj(e)):l[t].count-=e.remove;break}if(this.isShow)this.show_items();else return!1}else if(e.name&&this.items){var n=this.get_item(e.id);if(n?(n.count=e.count,n.name=e.name):this.items.push(e),this.isShow)this.show_items();else return!1}else if(e.max_item_count)this.max_count=e.max_item_count,ReceiveMessage((Dialog.pack2.isShow?Dialog.pack2.target_name:`你`)+`的背包容量扩充为`+this.max_count+`。`),this.show_items();else return!1;return!0},get_item:function(e,t){if(t||=this.items,t){for(var n=0;n<t.length;n++)if(t[n]&&t[n].id==e)return t[n]}},get_eq_item:function(e){if(this.eqs){for(var t=0;t<this.eqs.length;t++)if(this.eqs[t]&&this.eqs[t].id==e)return this.eqs[t]}},get_sub_title:function(e,t){var n=e&&(e.color_name||e.name);if(!n&&e&&e.from==`eq`){var r=this.get_eq_item(e.id);n=r&&r.name}if(!n&&e){var i=this.get_item(e.id);n=i&&i.name}return n||=`物品详情`,t?n+` - `+t:n},show_sub:function(e,t){this.objelement&&this.objelement.remove();var n=Dialog.contentElement,r=$(`<div></div>`).html(e||``),i=$(`<span class='item-commands'></span>`);r.find(`.item-commands`).each(function(){var e=$(this).contents().clone();e.filter(`br`).remove(),e.find(`br`).remove(),i.append(e)}),r.find(`.item-commands`).remove();var a=i.children().length?`<div class='obj-desc-footer'>`+i.prop(`outerHTML`)+`</div>`:``,o=t||`物品详情`,s=function(e){e&&(e.preventDefault(),e.stopPropagation()),this.objelement&&this.objelement.remove(),this.objelement=null}.bind(this);this.objelement=$(`<div class='obj-desc'><div class='obj-desc-panel'><div class='obj-desc-header'><div class='obj-desc-title'>`+o+`</div><span class='obj-desc-close'>关闭</span></div><div class='obj-desc-body'>`+r.html()+`</div>`+a+`</div></div>`).appendTo(n),this.objelement.on(`click`,`.obj-desc-close`,s),this.objelement.on(`click`,`[cmd]`,function(){setTimeout(s,0)}),this.objelement.on(`click`,function(e){$(e.target).is(`.obj-desc`)&&s(e)})},onData:function(e){if(e.items)this.eqs=this.formatEqs(e.eqs||[]),this.money=e.money,this.eq_group=e.eq_group,this.items=this.formatItems(e.items),this.max_count=e.max_item_count,this.isShow&&(this.show_items(),this.show_moeny());else{if(e.owner_id)return Dialog.pack2.onData(e);if(this.updateitem(e))return}if(!this.isShow){if(Dialog.list.isShow)return Dialog.list.update_pack(e);if(Dialog.trade.isShow)return Dialog.trade.update_pack(e)}},formatPackItem:function(e){return{name:e[0],id:e[1],count:e[2],grade:e[3],unit:e[4],value:e[5],can_eq:e[6],can_use:e[7],can_study:e[8],can_open:e[9],can_combine:e[10],is_lock:e[11],otype:e[12]}},formatItems:function(e){let t=[];for(let n of e)t.push(this.formatPackItem(n));return t},formatEqs:function(e){let t=[];for(let n of e)n?t.push({name:n[0],id:n[1],grade:n[2],can_use:n[3],is_lock:n[4]}):t.push(n);return t},show_moeny:function(){if(!this.isShow)return;let e=x.moneyToStr(this.money),t=this.packElement.is(`.cleanup`);Dialog.footerElement&&Dialog.footerElement.addClass(`pack-footer`).toggleClass(`pack-cleanup-footer`,t);let n=[];for(let e=0;e<3;e++)n.push(`<span class="footer-item eq-group`,e===this.eq_group?` select`:``,`" for="`,e+1,`">`,e+1,`</span>`);n.push(`<div class='obj-money'>`),t?(n.push(`<span for='cancle' class='footer-item'>取消</span>`),n.push(`<span for='store' class='footer-item'>自动存仓</span>`),n.push(`<span for='sell' class='footer-item'>清理杂物</span>`),n.push(`<span for='cleanup' class='footer-item'>确定</span></div>`)):(n.push(`<span class='obj-money-text'>你`,e?`身上有`+e:`身上没有任何银两`,`</span>`),n.push(`<span for='cleanup' class='footer-item'>整理包裹</span></div>`)),Dialog.footer(n.join(``))},cleanup_cmds:{cleanup:!0,cancle:!0,store:!0,sell:!0},footerChanged:function(e,t){if(this.cleanup_cmds[e])return this.cleanup(e,t);let n=parseInt(e)-1;n>=0&&n<3&&SendCommand(`eqgroup `+n)},cleanup:function(e,t){let n=this;if(t.removeClass(`select`),!n.packElement.is(`.cleanup`)&&e==`cleanup`){let e=this.target_name&&this.id?{type:`follower`,id:this.id,name:this.target_name}:{type:`player`};return Dialog.packmanage.requestOpen(e)}n.packElement.is(`.cleanup`)?(e==`cleanup`?n.packElement.find(`.obj-item>.selected`).each(this.cleanup_item):e==`store`?SendCommand((this.command_before??``)+`store all`):e==`sell`&&SendCommand((this.command_before??``)+`sell all`),n.packElement.removeClass(`cleanup`),this.show_moeny()):(n.packElement.find(`.item-commands`).remove(),n.packElement.addClass(`cleanup`),n.show_items(),this.show_moeny())},cleanup_item:function(e,t){let n=$(t),r=n.parent().attr(`oindex`),i=n.attr(`cmd`);SendCommand(i+` `+r)},show_items:function(){if(this.packElement){this.createItems(),this.create_eqs(),Dialog.icon(`briefcase`);var e=this.target_name||`你`,t=this.items&&this.max_count&&this.items.length>this.max_count;Dialog.title(this.items&&this.items.length?e+`身上共有`+this.items.length+`/`+this.max_count+`件物品`+(t?`（已超出上限）`:``):e+`身上没有任何东西`)}},init_element:function(){if(!this.element){let e=it.map(function(e){return`<div class="eq-item"><span class="eq-type">`+e+`</span><span class="eq-name"></span></div>`}).join(``);this.element=$(`<div class="dialog-pack"><div class="eq-list">`+e+`</div><div class="obj-list"></div></div>`),this.packElement=this.element.find(`.obj-list`),this.eqElement=this.element.find(`.eq-list`)}},show:function(){if(Dialog.isShow||Dialog.show(),Dialog.element.addClass(`dialog-pack-dialog`),this.objelement&&(this.objelement.remove(),this.objelement=null,this.packElement&&this.packElement.show()),this.isShow)return SendCommand(this.items?`pack none`:`pack`);this.isShow=!0,this.init_element(),this.packElement.on(`click`,`.obj-item`,Dialog.pack.item_click),this.eqElement.on(`click`,`.eq-item`,Dialog.pack.eqitem_click),this.packElement.removeClass(`cleanup`),this.element.appendTo(Dialog.contentElement),this.items?(SendCommand(`pack none`),this.show_items()):SendCommand(`pack`)},create_eqs:function(){for(var e=this.eqElement.children(),t=0;t<e.length;t++){var n=this.eqs[t];n?$(e[t]).attr(`class`,`eq-item grade`+n.grade).attr(`oindex`,t).find(`.eq-name`).html(n.name):$(e[t]).attr(`class`,`eq-item empty`).attr(`oindex`,``).find(`.eq-name`).html(``)}},levels:{wht:0,hig:1,hic:2,hiy:3,hiz:4,hio:5,ord:6},sort_items:function(e){if(!e||!F.auto_sortitem)return e;for(var t=[],n=0;n<e.length;n++){for(var r=e[n],i=!1,a=0;a<t.length;a++)if(r.grade<t[a].grade){t.splice(a,0,r),i=!0;break}i||t.push(r)}return t},createItems:function(){if(!this.items)return;var e=Dialog.pack.sort_items(this.items),t=[];let n=this.packElement?.is(`.cleanup`);for(var r=Math.max(this.max_count||0,e.length),i=0;i<r;i++){var a=e[i];a?(t.push(`<div class="obj-item `,a.is_lock?`lock `:``,`grade`,a.grade,`" oindex="`),t.push(a.id),t.push(`">`),t.push(`<span class='obj-name'>`),t.push(a.name),t.push(`</span>`),this.show_type==1?(t.push(`<span class='obj-value'>`),t.push(`每`),t.push(a.unit),t.push(x.moneyToStr(a.value)),t.push(`：`),t.push(a.count),t.push(a.unit),t.push(`</span>`)):a.count>1&&(t.push(`<span class='obj-value'>`),t.push(a.count),t.push(a.unit),t.push(`</span>`)),n&&(a.grade>0&&t.push(`<span cmd='store' class='obj-oper`,a.can_study?` selected`:` `,`'>存仓库</span>`),a.can_combine&&a.count>=a.can_combine&&t.push(`<span cmd='combine' class='obj-oper'>合成</span>`),this.target_name&&t.push(`<span cmd='give `,Process.player,` `,a.count,`' class='obj-oper'>拿来</span>`),a.can_eq&&a.grade>0?(t.push(`<span cmd='sell' class='obj-oper'>卖掉</span>`),t.push(`<span cmd='fenjie' class='obj-oper'>分解</span>`)):a.value>0?t.push(`<span cmd='sell' class='obj-oper'>卖掉</span>`):a.grade||t.push(`<span cmd='drop' class='obj-oper'>丢掉</span>`))):t.push(`<div class="obj-item" oindex="">`),t.push(`</div>`)}this.packElement.html(t.join(``))},create_item_command:function(e,t,n){t.push(`<span cmd="_confirm `+this.command_before+`drop `+e.count+` `+e.id+`">丢掉</span>`),t.push(`<span cmd="`+this.command_before+`lockobj `+e.id+`">`,e.is_lock?`解锁`:`锁定`,`</span>`),e.can_eq&&(t.push(`<span cmd="`+this.command_before+`eq `+e.id+`">装备</span>`),this.command_before||(t.push(`<span cmd="jinglian `+e.id+`">精炼</span>`),t.push(`<span cmd="xiangqian `+e.id+`">镶嵌</span>`),t.push(`<span cmd="shortcut `+e.id+`">设置快速装备</span>`)),t.push(`<span cmd="`+this.command_before+`fenjie `+e.id+`">分解</span>`)),e.can_use&&(t.push(`<span cmd="`+this.command_before+`use `+e.id+`">使用</span>`),!e.can_eq&&!this.command_before&&t.push(`<span cmd="shortcut `+e.id+`">设置快速使用</span>`)),e.can_open&&t.push(`<span cmd="`+this.command_before+`open `+e.id+`">打开</span>`),e.can_study&&t.push(`<span cmd="`+this.command_before+`study `+e.id+`">学习</span>`),e.can_combine&&e.count>=e.can_combine&&t.push(`<span cmd="_confirm `+this.command_before+`combine `+e.id+` `+e.can_combine+`">合成</span>`),this.command_before&&t.push(`<span cmd="_confirm `+this.command_before+`give `+Process.player+` `+e.count+` `+e.id+`">拿来</span>`),n||=[],Dialog.extend.append(n,`pack`,e);for(var r=0;r<n.length;r++)n[r].extend?t.push(`<span cmd="`,n[r].cmd,`">`,n[r].name,`</span>`):t.push(`<span cmd="`,this.command_before,`packitem `,n[r].cmd,` `,e.id,`">`,n[r].name,`</span>`)},item_click:function(e){let t=$(e.target);if(Dialog.pack.packElement.is(`.cleanup`)&&t.is(`.obj-oper`))return Dialog.pack.item_cleanup(t);t=$(this);var n=t.attr(`oindex`);if(n){var r=Dialog.pack.get_item(n);if(Dialog.pack.packElement.find(`.item-commands`).remove(),r)return M.LAST_OBJ=r,SendCommand(`checkobj `+r.id+` from item`),!1}},eqitem_click:function(){var e=Dialog.pack.eqs[$(this).attr(`oindex`)];e&&SendCommand(`checkobj `+e.id+` from eq`)},item_cleanup:function(e){return e.is(`.selected`)?e.removeClass(`selected`):(e.parent().find(`.selected`).removeClass(`selected`),e.addClass(`selected`)),!1}},ot=`

.dialog.dialog-pack-dialog {
    top: 50%;
    max-height: calc(100% - 4rem);
}

@media (min-width: 481px) {
    .dialog.dialog-pack-dialog {
        max-height: 62vh;
    }
}

.dialog.dialog-pack-dialog>.dialog-content {
    overflow: hidden;
    position: relative;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.35em;
    padding: 0 0.35em;
    box-sizing: border-box;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.eq-group {
    flex: 0 0 auto;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money {
    float: none;
    margin-left: auto;
    padding-right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.35em;
    min-width: 0;
    flex: 1 1 auto;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.obj-money-text {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.footer-item {
    width: auto;
    min-width: 3em;
    flex: 0 0 auto;
    margin: 0;
    padding: 0 0.55em;
    border-left: 1px solid var(--theme-border);
    line-height: 2em;
    box-sizing: border-box;
}

.dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.footer-item:first-child {
    border-left: 0;
}

.dialog-pack {
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(10rem, 0.9fr) minmax(13rem, 1.1fr);
    gap: 0.75em;
    overflow: hidden;
    padding-top: 0.25em;
    box-sizing: border-box;
}


.dialog-pack>.obj-list {
    min-width: 0;
    width: auto;
    display: block;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    height: 100%;
    min-height: 0;
}


.obj-list>.obj-item {
    margin-left: 0;
}
    
.dialog.dialog-pack-dialog .obj-desc {
    position: absolute;
    inset: 0;
    z-index: 5;
    padding: 0.75em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}

.dialog.dialog-pack-dialog .obj-desc-panel {
    width: min(28rem, 100%);
    max-height: 100%;
    min-width: 0;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    box-shadow: 0 1.1em 2.4em rgba(0, 0, 0, 0.28);
    display: flex;
    flex-direction: column;
}

.obj-desc-panel>.obj-desc-header {
    flex: 0 0 2.5em;
    min-height: 2.5em;
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0 0.7em 0 0.8em;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    box-sizing: border-box;
}

.obj-desc-panel .obj-desc-title {
    flex: 1 1 auto;
    min-width: 0;
    color: var(--theme-accent);
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.obj-desc-panel .obj-desc-close {
    flex: 0 0 auto;
    cursor: pointer;
    user-select: none;
    color: var(--theme-muted);
    line-height: 2em;
}

.obj-desc-panel .obj-desc-close:hover {
    color: var(--theme-accent);
}

.obj-desc-panel>.obj-desc-body {
    flex: 1 1 auto;
    min-height: 0;
    margin: 0;
    padding: 0.9em;
    box-sizing: border-box;
    white-space: pre-wrap;
    line-height: 1.55em;
    color: var(--theme-text);
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
}

.obj-desc-panel>.obj-desc-footer {
    flex: 0 0 2.5em;
    min-height: 2.5em;
    padding: 0 0.7em;
    border-top: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
}

.xq-stone-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11em, 1fr));
    gap: 0.4em;
    margin: 0.5em 0 0;
}

.xq-stone-item {
    border: 1px solid var(--border-color, gray);
    border-radius: 0.4em;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    padding: 0.4em 0.5em;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
}

.xq-stone-item:hover {
    background-color: var(--theme-surface);
}

.xq-stone-item:active {
    background-color: var(--theme-surface-2);
}

.xq-stone-item>* {
    pointer-events: none;
}

.xq-stone-item>.xq-stone-name {
    font-weight: bold;
    word-break: break-all;
}

.xq-stone-item>.xq-stone-count {
    float: right;
    color: var(--theme-muted);
    font-size: 0.86em;
    margin-left: 0.35em;
}

.xq-stone-item>.xq-stone-prop {
    color: var(--theme-muted);
    font-size: 0.86em;
    line-height: 1.45em;
    margin-top: 0.15em;
    word-break: break-all;
}

.xq-stone-tip {
    color: var(--theme-muted);
    font-size: 0.82em;
    text-align: center;
    margin-top: 0.5em;
}

.xq-stone-empty {
    color: var(--theme-muted);
    text-align: center;
    padding: 1em 0;
}

.obj-desc-panel>.obj-desc-footer>.item-commands {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 auto;
    gap: 0.35em;
    margin: 0;
    padding: 0;
    white-space: nowrap;
}

.obj-desc-panel>.obj-desc-footer>.item-commands>span {
    height: 2em;
    line-height: 2em;
    margin: 0;
    padding: 0 0.4em;
}


.eq-list {
    min-width: 0;
    width: auto;
    display: block;
    float: none;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    height: 100%;
    min-height: 0;
}

.eq-list>.eq-item {
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    cursor: pointer;
    display: flex;
    align-items: center;
    min-height: 2em;
}

.eq-list>.empty {
    border-color: var(--theme-border);
    color: var(--theme-muted);
}

.eq-list>.eq-item>.eq-name {
    white-space: nowrap;
    padding-left: 0.3125em;
    min-width: 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.eq-list>.eq-item>.eq-type {
    background-color: var(--theme-surface);
    color: var(--theme-muted);
    line-height: 1.875em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 3.25em;
    height: 1.875em;
    text-align: center;
}

.obj-list>.obj-item {
    background-color: var(--theme-panel);
    color: var(--theme-text);
    line-height: 1.875em;
    min-height: 1.875em;
    padding: 0 0.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.obj-item.lock>.obj-name:before {
    content: "e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}

.obj-item>.obj-oper {
    float: right;
    margin: 0.2em 0.35em 0 0;
    padding: 0 0.5em;
    line-height: 1.5em;
    background-color: var(--theme-surface);
    border: 1px solid var(--theme-border);
    border-radius: 0.5em;
    color: var(--theme-muted);
    display: none;
    cursor: pointer;
    user-select: none;
}

.cleanup>.obj-item>.obj-oper {
    display: inline-block;
}

.cleanup>.obj-item>.selected {
    color: var(--theme-accent);
    border-color: var(--theme-accent);
}



.obj-item>.obj-count,
.obj-item>.obj-value {
    float: right;
    margin-right: 0.625em;
    color: var(--theme-muted);
}

.cleanup>.obj-item>.obj-value,
.cleanup>.obj-item>.obj-count {
    display: none;
}


.obj-list>.disabled {
    opacity: 0.5;
}

@media (max-width: 480px) {
    .dialog.dialog-pack-dialog {
        max-height: calc(100% - 3.5rem);
    }

    .dialog-pack {
        grid-template-columns: 1fr;
        grid-template-rows: auto minmax(0, 1fr);
        gap: 0.55em;
        height: calc(100vh - 9.5em);
        max-height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
    }

    .dialog.dialog-pack-dialog>.dialog-content {
        overflow: hidden;
        padding: 0.55em;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer {
        justify-content: flex-end;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-cleanup-footer>.eq-group {
        display: none;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money {
        margin-left: auto;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.obj-money-text {
        display: none;
    }

    .dialog.dialog-pack-dialog>.dialog-footer.pack-footer>.obj-money>.footer-item {
        min-width: 2.6em;
        padding: 0 0.4em;
    }

    .dialog-pack>.eq-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        align-content: start;
        gap: 0.35em;
        height: auto;
        max-height: min(42vh, 16rem);
        overflow-y: auto;
    }

    .eq-list>.eq-item {
        margin-bottom: 0;
        min-height: 1.9em;
    }

    .dialog-pack>.obj-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        align-content: start;
        gap: 0.45em;
        min-height: 0;
        height: auto;
        max-height: none;
        overflow-y: auto;
    }

    .obj-list>.obj-item,
    .trade-list>.obj-item {
        min-height: 3.6em;
        margin-bottom: 0;
        padding: 0.45em 0.5em;
        line-height: 1.25em;
    }

    .cleanup>.obj-item {
        min-height: 2.25em;
    }

    .obj-item>.obj-name {
        display: block;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .obj-item>.obj-count,
    .obj-item>.obj-value {
        float: none;
        display: block;
        margin: 0.15em 0 0;
        font-size: 0.86em;
        line-height: 1.45em;
    }

    .dialog.dialog-pack-dialog .obj-desc {
        padding: 0.5em;
        align-items: stretch;
    }

    .dialog.dialog-pack-dialog .obj-desc-panel {
        width: 100%;
    }

    .obj-desc-panel>.obj-desc-body {
        max-height: calc(100vh - 11em);
    }
}



`,st=`

.dialog-list {
    width: 100%;
    height: 100%;
    min-height: 0;
    white-space: nowrap;
    overflow-x: auto;
    padding-top: 0.5em;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
}

.dialog-list>.otype-list {
    width: 6em;
}

.dialog-list>.otype-list>.otype-item {
    white-space: nowrap;
    line-height: 2em;
    width: 5em;
    text-align: center;
    background-color: #111;
    border-radius: 4px;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    margin-left: 0.5em;
    text-align: center;
    cursor: pointer;
}

.dialog-list>.otype-list>.select {
    background-color: #222;
    color: var(--theme-grade-1);
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-grade-1);
}

.dialog-list>.trade-list,
.dialog-list>.obj-list {

    height: 100%;
    min-height: 0;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}


.dialog-list>.obj-desc {
    padding: 0.25em;
    margin: 0px;
    white-space: pre-wrap;
    flex: 1;
    overflow-y: auto;
}

.dialog-list>.trade-list {

    height: 100%;
    min-height: 0;
    display: inline-block;
    overflow-y: auto;
    flex: 1;
}
.trade-list>.obj-item {
    background-color: #111;
    line-height: 1.875em;
    min-height: 1.875em;
    padding-left: 0.3125em;

    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 0.5em;
    border-radius: 4px;
}

.trade-list>.obj-item.lock>.obj-name:before {
    content: "e033";
    font-family: 'Glyphicons Halflings';
    font-size: 0.8em;
    margin-right: 0.2em;
    color: var(--border-color);

}`,ct={isShow:!1,selectItem:`.dialog-skills`,init:function(){this.created||Dialog.injectStyle(dt),this.created=!0},hide:function(){if(this.progression_element&&=(this.progression_element.remove(),null),this.skill_element)return this.skill_element.remove(),this.skill_element=null,this.element.removeClass(`hide-item`),this.create_footer(),this.skill_element_id=null,!1},close:function(){this.hide(),this.element.remove(),Dialog.element.removeClass(`dialog-skills-open`),this.isShow=!1,this.skill_element_id=null,this.element.removeClass(`hide-item`)},limit:0,selected_item:-1,showdesc:function(e){if(!this.isShow)return;this.element.find(`.item-commands`).remove(),this.progression_element&&=(this.progression_element.remove(),null),this.skill_element&&this.skill_element.remove(),this.skill_element=$(`<pre></pre>`).html(e.desc).appendTo(this.element),this.skill_element_id=e.id,this.element.addClass(`hide-item`);let t=[`<div class="item-commands">`];this.master?(t.push(`<span cmd="xue `,e.id,` from `,this.master,`">学习</span>`),this.is_follower&&(e.can_progression&&t.push(`<span cmd="dc `,this.master,` lingwu `,e.id,`">进阶</span>`),e.can_fusion&&t.push(`<span cmd="dc `,this.master,` lingwu2 `,e.id,`">融合</span>`),t.push(`<span cmd="dc `,this.master,` fangqi `,e.id,`">遗忘</span>`))):(e.is_custom&&t.push(`<span cmd="zc `,e.id,`">推演</span>`),e.can_progression&&t.push(`<span cmd="lingwu `,e.id,`">进阶</span>`),e.can_fusion&&t.push(`<span cmd="lingwu2 `,e.id,`">融合</span>`),e.dao_base&&e.can_dao&&t.push(`<span class="skill-action" cmd="dao `,e.id,`">参悟</span>`),t.push(`<span cmd="fangqi `,e.id,`">遗忘</span>`)),t.push(`</div>`),Dialog.footer(t.join(``))},showProgression:function(e){if(!this.isShow||this.skill_element_id!==e.id)return;this.progression_element&&this.progression_element.remove();let t=[`<div class="skill-progression-panel">`,`<div class="skill-progression-message">`,e.message,`</div>`,`<div class="skill-progression-actions">`],n=e.actions||[];for(let e=0;e<n.length;e++)t.push(`<button type="button" class="skill-action" cmd="`,n[e].cmd,`">`,n[e].name,`</button>`);t.push(`</div></div>`),this.progression_element=$(t.join(``)).appendTo(this.element),this.element.scrollTop(this.element[0].scrollHeight)},footerChanged:function(e,t){if(e=parseInt(e),!(e===this.selected_item&&!t)){if(this.selected_item=e,Dialog.skills.element.find(`.item-commands`).remove(),e===2)return this.element.removeClass(`dialog-auto-pfm`),this.books?this.showBooks():SendCommand(`sbook`),this.element.addClass(`dialog-books`);if(this.element.is(`.dialog-books`)&&(this.element.removeClass(`dialog-books`),this.createSkillItems(this.items||[])),e===3){this.element.addClass(`dialog-auto-pfm`),this.renderAutoPfm(),this.create_footer(),SendCommand(`autopfm`);return}this.element.is(`.dialog-auto-pfm`)&&(this.element.removeClass(`dialog-auto-pfm`),this.createSkillItems(this.items||[])),e===0?(this.element.find(`.base`).removeClass(`hide`),this.element.find(`.skill`).addClass(`hide`)):e===1&&(this.element.find(`.base`).addClass(`hide`),this.element.find(`.skill`).removeClass(`hide`)),this.create_footer()}},footers:[`基础`,`特殊`,`书籍`,`配置`],eq_group:0,create_footer:function(){for(var e=this.footers,t=[`<div class="skills-footer-tabs">`],n=0;n<e.length;n++)t.push(`<span class='footer-item`+(n===this.selected_item?` select`:``)+`' for='`+n+`'>`+e[n]+`</span>`);t.push(`</div><div class="skills-footer-groups">`);for(let e=0;e<3;e++)t.push(`<span class="sk-group`,e===this.sk_group?` select`:``,`" group="`,e,`">`,e+1,`</span>`);t.push(`</div>`),Dialog.footer(t.join(``))},eq_group_click:function(){let e=parseInt($(this).attr(`group`));e>=0&&e!==Dialog.skills.sk_group&&SendCommand(`skgroup `+e)},updateSkill:function(e){if(!this.skills)return;var t=this.skills[e.id];if(!t)return this.addSkill(e);let n=!1;if(e.name&&(t.name=e.name,n=!0),e.grade>=0&&e.grade!==t.grade&&(t.grade=e.grade,t.can_enables))for(let n of t.can_enables){let t=this.skills[n];t&&t.enable_skill===e.id&&this.updateSkillItem(t)}if(e.effective_grade>=0&&(t.effective_grade=e.effective_grade),e.dao_base&&(t.dao_base=e.dao_base,t.dao=e.dao,t.dao_name=e.dao_name,t.dao_next=e.dao_next,t.dao_cost=e.dao_cost,t.dao_required_level=e.dao_required_level,t.dao_level_limit=e.dao_level_limit,t.can_dao=e.can_dao,n=!0),e.enable){if(t.enable_skill){var r=t.enable_skill;t.enable_skill=null,this.skills[r][e.id]=!1,this.updateSkillItem(this.skills[r])}this.skills[e.enable][e.id]=!0,t.enable_skill=e.enable,this.updateSkillItem(this.skills[e.enable]),this.updateSkillItem(this.skills[e.id])}else if(e.exp!=null||e.level!=null)e.level>=0&&(t.level=e.level),e.exp>=0&&(t.exp=e.exp),e.can_enables&&(t.can_enables=e.can_enables),this.updateSkillItem(t);else if(e.enable==0&&t.enable_skill){var r=t.enable_skill;this.skills[r][e.id]=!1,t.enable_skill=null,this.updateSkillItem(this.skills[r]),this.updateSkillItem(this.skills[e.id])}n&&this.updateSkillItem(t)},updateSkillItem:function(e){var t=this.element.find(`.skill-item[skid='`+e.id+`']`);if(t){let n=t.css(`display`)===`none`;t.replaceWith(this.createSkillItem(e)),n&&t.hide()}},addSkill:function(e){if(!(!this.items||!e)){if(this.skills[e.id])return this.updateSkill(e);this.items.push(e),this.skills[e.id]=e,this.items=this.sort_items(this.items),this.createSkillItems(this.items)}},format_books:function(e){let t=[];for(let n=0;n<e.length;n++)t.push({name:e[n][0],grade:e[n][1],id:n});return t},onData:function(e){if(e.progression)return e.progression.from?this.showProgression.call(Dialog.master,e.progression):this.showProgression(e.progression);if(e.autoPfm){this.autoPfm=e.autoPfm,this.sk_group=e.autoPfm.group,this.isShow&&this.selected_item===3&&this.renderAutoPfm(),this.create_footer();return}if(e.book)return this.books?(this.books.push({name:e.book[0],grade:e.book[1],id:e.book[2]}),this.isShow&&this.selected_item==2?this.showBooks():void 0):void 0;if(e.books)return this.books=this.format_books(e.books),this.isShow||!Dialog.master.isShow?this.showBooks():Dialog.master.showBooks();if(e.id&&!e.desc)return e.from?this.updateSkill.call(Dialog.master,e):this.updateSkill(e);if(e.item)return Dialog.master.isShow&&Dialog.master.is_follower?this.addSkill.call(Dialog.master,e.item):this.addSkill(e.item);if(!this.isShow&&Dialog.master.isShow)return Dialog.master.onData(e);if(e.desc)return e.id&&this.updateSkill(e),this.showdesc(e);if(e.remove&&this.items){if(e.from&&e.from!==Process.player)return;this.items.Remove(this.skills[e.remove]);for(var t=0;t<this.items.length;t++)this.items[t].enable_skill==e.remove&&(this.items[t].enable_skill=null);return delete this.skills[e.remove],this.skill_element&&this.skill_element_id===e.remove&&this.hide(),this.createSkillItems(this.items)}if(e.items){this.title=e.title,Dialog.title(this.title+`，等级上限`+e.limit+`级`),Dialog.icon(`book`),this.items=this.sort_items(e.items),this.skills={};for(var t=0;t<this.items.length;t++){var n=this.items[t];this.skills[n.id]=n}this.selected_item<0&&(this.selected_item=0),this.createSkillItems(this.items),this.create_footer()}e.sk_group>=0&&(this.sk_group=e.sk_group,this.autoPfm=null,e.limit>=0&&(this.limit=e.limit),this.create_footer(),this.isShow&&this.selected_item===3&&SendCommand(`autopfm`)),e.limit>=0&&(this.limit=e.limit,this.title&&Dialog.title(this.title+`，等级上限`+this.limit+`级`))},show:function(){this.isShow||(this.isShow=!0,Dialog.element.addClass(`dialog-skills-open`),this.selected_item<0&&(this.selected_item=0),this.element||(this.element=$(`<div class="dialog-skills"></div>`),Dialog.footerElement.off(`click.skillsGroup`).on(`click.skillsGroup`,`.sk-group`,Dialog.skills.eq_group_click)),this.element.off(`.skills`).on(`click.skills`,`.skill-item`,Dialog.skills.item_click).on(`click.skills`,`.skill-action`,Dialog.skills.skillActionClick).on(`click.skills`,`.auto-pfm-master`,Dialog.skills.autoPfmMasterClick).on(`change.skills`,`.auto-pfm-toggle`,Dialog.skills.autoPfmToggleClick).on(`click.skills`,`.auto-pfm-move`,Dialog.skills.autoPfmMoveClick),Dialog.footerElement.off(`click.skillsAction`).on(`click.skillsAction`,`.skill-action`,Dialog.skills.skillActionClick),this.element.appendTo(Dialog.contentElement),this.element.removeClass(`hide-item`),this.create_footer(),this.items?(SendCommand(`cha none`),Dialog.icon(`book`),this.create_footer()):SendCommand(`cha`))},updatePerformSkills:function(e){this.performSkills=e||[],this.isShow&&this.selected_item===3&&SendCommand(`autopfm`)},renderAutoPfm:function(){if(!this.element)return;var e=this.autoPfm;if(!e||e.group!==this.sk_group){this.element.html(`<div class="auto-pfm-empty">正在加载技能配置...</div>`);return}let t=e.items||[],n=t.filter(function(e){return e.enabled}),r=t.filter(function(e){return!e.enabled}),i=[`<div class="auto-pfm-config">`];if(i.push(`<div class="auto-pfm-header"><span class="auto-pfm-title">自动出招</span>`),i.push(`<button type="button" class="auto-pfm-master`,e.enabled?` on`:``,`" role="switch" aria-checked="`,e.enabled?`true`:`false`,`" aria-label="自动出招" title="开启或关闭自动出招">`,`<span class="auto-pfm-switch-thumb" aria-hidden="true"></span></button></div>`),!t.length)i.push(`<div class="auto-pfm-empty">当前技能组没有可配置的绝招</div>`);else{i.push(`<section class="auto-pfm-section configured"><div class="auto-pfm-section-title">自动释放</div>`),n.length||i.push(`<div class="auto-pfm-section-empty">尚未选择自动释放技能</div>`);for(let e=0;e<n.length;e++){let t=n[e];i.push(`<div class="auto-pfm-item enabled`,t.autoAllowed?``:` manual-only`,`" data-id="`,t.id,`">`),i.push(`<span class="auto-pfm-priority">`,e+1,`</span>`),i.push(`<input type="checkbox" class="auto-pfm-toggle" data-id="`,t.id,`" aria-label="启用或停用自动释放" title="`,t.autoAllowed?`启用或停用自动释放`:`该绝招仅支持手动释放`,`" checked`,t.autoAllowed?``:` disabled`,`>`),i.push(`<div class="auto-pfm-info"><div class="auto-pfm-name">`,t.name,`</div><div class="auto-pfm-meta">内力 `,t.mp,` · 出招 `,ft(t.releaseTime),` · 冷却 `,ft(t.cooldown),`</div></div>`),i.push(`<div class="auto-pfm-order">`),i.push(`<button type="button" class="auto-pfm-move" data-id="`,t.id,`" data-direction="up" title="上移" aria-label="上移"`,e===0?` disabled`:``,`><span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span></button>`),i.push(`<button type="button" class="auto-pfm-move" data-id="`,t.id,`" data-direction="down" title="下移" aria-label="下移"`,e===n.length-1?` disabled`:``,`><span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span></button></div></div>`)}i.push(`</section><section class="auto-pfm-section unconfigured"><div class="auto-pfm-section-title">未配置</div>`),r.length||i.push(`<div class="auto-pfm-section-empty">全部技能均已配置</div>`);for(let e=0;e<r.length;e++){let t=r[e];i.push(`<div class="auto-pfm-item`,t.autoAllowed?``:` manual-only`,`" data-id="`,t.id,`">`),i.push(`<span class="auto-pfm-priority" aria-hidden="true"></span>`),i.push(`<input type="checkbox" class="auto-pfm-toggle" data-id="`,t.id,`" aria-label="启用或停用自动释放" title="`,t.autoAllowed?`启用或停用自动释放`:`该绝招仅支持手动释放`,`"`,t.autoAllowed?``:` disabled`,`>`),i.push(`<div class="auto-pfm-info"><div class="auto-pfm-name">`,t.name,`</div><div class="auto-pfm-meta">内力 `,t.mp,` · 出招 `,ft(t.releaseTime),` · 冷却 `,ft(t.cooldown),t.autoAllowed?``:` · 仅手动`,`</div></div></div>`)}i.push(`</section>`)}i.push(`</div>`),this.element.html(i.join(``))},autoPfmMasterClick:function(e){e.preventDefault(),e.stopPropagation(),SendCommand(`autopfm master `+ +!$(this).is(`.on`))},autoPfmToggleClick:function(e){e.stopPropagation(),!this.disabled&&SendCommand(`autopfm enable `+$(this).attr(`data-id`)+` `+ +!!$(this).prop(`checked`))},autoPfmMoveClick:function(e){e.preventDefault(),e.stopPropagation(),!this.disabled&&SendCommand(`autopfm move `+$(this).attr(`data-id`)+` `+$(this).attr(`data-direction`))},skillActionClick:function(e){e.preventDefault(),e.stopPropagation();let t=$(this).attr(`cmd`);t&&(SendCommand(t),$(this).closest(`.item-commands`).remove())},isEnable:function(e,t){if(!e.can_enables)return!1;for(var n=0;n<e.can_enables.length;n++){var r=t[e.can_enables[n]];if(r&&r.enable_skill==e.id)return!0}return!1},showBooks:function(){var e=[],t=this.sort_items(this.books);for(let n of t)e.push(`<div class="book-item `),e.push(`grade`,n.grade,`" >`),e.push(`<div class="book-name">`,n.name,`</div>`),e.push(`<div class="book-action border-right" cmd="sbook `,n.id,`">查看</div>`),e.push(`<div class="book-action" cmd="study `,n.id,`">学习</div>`),e.push(`</div>`);this.element.html(e.join(``)),this.create_footer(!0)},createSkillItem:function(e,t){t||=this.skills;var n=[];n.push(`<div class="skill-item `),n.push(`grade`+e.grade),this.master||(e.can_enables?(n.push(` skill`),this.selected_item==0&&n.push(` hide`)):(n.push(` base`),this.selected_item==1&&n.push(` hide`))),this.isEnable(e,t)&&n.push(` enable`),n.push(`" skid="`+e.id+`">`),n.push(`<span class="glyphicon glyphicon-ok enable-flag"></span>`),n.push(`<span class="skill-name">`,e.name,`</span>`);var r=parseInt(e.effective_grade);if(r>e.grade){var i=Math.min(6,r);n.push(`<span class="skill-grade-enhance grade`,i,`">强化+`,r-e.grade,`</span>`)}if(e.enable_skill&&t){var a=t[e.enable_skill];a&&(n.push(`<span class="enable_skill">已装备：`),n.push(ut(a)),n.push(`</span>`))}return n.push(`<span class="skill-level">`),n.push(e.level),n.push(`级 / `),n.push(e.exp),n.push(`%`),n.push(`&nbsp;`),n.push(Dialog.skills.get_lvdesc(e.level)),n.push(`</span></div>`),n.join(``)},sort_items:function(e){if(!e||!F.auto_sortitem)return e;for(var t=[],n=0;n<e.length;n++){for(var r=e[n],i=!1,a=0;a<t.length;a++)if(r.grade>t[a].grade){t.splice(a,0,r),i=!0;break}i||t.push(r)}return t},createSkillItems:function(e,t){let n=[];for(var r=0;r<e.length;r++)n.push(this.createSkillItem(e[r],t));this.element.html(n.join(``))},level_color:[`wht`,`hig`,`hic`,`hiy`,`hiz`,`hio`,`ord`],get_lvdesc:function(e){if(e<1e3)return Dialog.skills.skill_levels[parseInt(e/50)];var t=parseInt((e-1e3)/500);return t>6&&(t=6),Dialog.skills.skill_levels[t+20]},skill_levels:`<BLU>初学乍练</BLU>.<BLU>不知所以</BLU>.<HIB>粗通皮毛</HIB>.<HIB>渐有所悟</HIB>.<YEL>半生不熟</YEL>.<YEL>马马虎虎</YEL>.<HIY>平淡无奇</HIY>.<HIY>触类旁通</HIY>.<HIG>心领神会</HIG>.<HIG>挥洒自如</HIG>.<HIC>驾轻就熟</HIC>.<HIC>出类拔萃</HIC>.<CYN>初入佳境</CYN>.<CYN>神乎其技</CYN>.<MAG>威不可当</MAG>.<HIW>豁然贯通</HIW>.<HIW>超群绝伦</HIW>.<RED>登峰造极</RED>.<WHT>登堂入室</WHT>.<HIM>一代宗师</HIM>.<WHT>超凡入圣</WHT>.<HIO>出神入化</HIO>.<HIO>独步天下</HIO>.<HIR>空前绝后</HIR>.<HIR>旷古绝伦</HIR>.<HIW>深不可测</HIW>.<HIW>返璞归真</HIW>`.split(`.`),item_click:function(){var e=$(this),t=[`<div class='item-commands'>`],n=Dialog.skills.skills[e.attr(`skid`)];if(!n)return;if(t.push(`<span cmd="checkskill `+n.id+`">查看详细</span>`),n.can_enables)for(var r=0;r<n.can_enables.length;r++){var i=Dialog.skills.skills[n.can_enables[r]];i&&(i.enable_skill==n.id?t.push(`<span cmd="enable `+i.id+` none">取消装备`+i.name+`</span>`):t.push(`<span cmd="enable `+i.id+` `+n.id+`">装备`+i.name+`</span>`))}if(n.enable_skill){var a=Dialog.skills.skills[n.enable_skill];a?t.push(`<span cmd="enable `+n.id+` none">取消装备`+a.name+`</span>`):n.enable_skill=null}n.dao_base&&n.can_dao&&t.push(`<span class="skill-action" cmd="dao `+n.id+`">参悟</span>`),t.push(`<span cmd="_confirm fangqi `+n.id+`">遗忘</span>`),t.push(`<span cmd="lianxi `+n.id+`">练习</span>`),M.LAST_OBJ=n;let o=Dialog.extend.query(`skill`,n);for(let e of o)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`),Dialog.skills.element.find(`.item-commands`).remove(),$(t.join(``)).insertAfter(e),x.checkScroll(e.next())}},lt=[`wht`,`hig`,`hic`,`hiy`,`hiz`,`hio`,`ord`];function ut(e){let t=lt[e.grade];return`<${t}>${e.name}</${t}>`}var dt=`
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

`;function ft(e){var t=Math.max(0,e||0)/1e3;return(t%1?t.toFixed(1):t.toFixed(0))+`秒`}var pt=`

.dialog-tasks {
    height: 100%;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
    box-sizing: border-box;
}

.dialog-tasks>.task-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-top: 0.5em;
    padding-left: 0.5em;
}

.dialog-tasks>.none {
    border-left-color: #808080
}



.dialog-tasks>.finish {
    border-left-color: var(--theme-grade-1)
}

.dialog-tasks>.over {
    border-left-color: var(--theme-grade-2)
}

.dialog-tasks>.none>.task-btn {
    border-left-color: #808080;
    color: #808080;
}

.dialog-tasks>.finish>.task-btn {
    border-left-color: var(--theme-grade-1);
    color: var(--theme-grade-1);
    background-color: color-mix(in srgb, var(--theme-grade-1) 22%, transparent);
}

.dialog-tasks>.over>.task-btn {
    border-left-color: var(--theme-grade-2);
    color: var(--theme-grade-2);
}

.task-item h3 {
    margin: 0px;
    padding-top: 0.5em;
}

.task-item .task-desc {

    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    white-space: pre-wrap;
}

.task-item>.task-btn {
    width: 4.5em;
    display: inline-block;
    border-left: 1px solid #343434;
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.task-item>.task-btn:hover {
    background-color: #222;
}

.dialog-tasks>.task-item>.start {
    color: gray;
}

.dialog-tasks>.task-item>.finish {
    color: var(--theme-grade-1);
}

.dialog-tasks>.task-item>.over {
    color: #ebebeb;
}
`,mt={init:function(){Dialog.injectStyle(pt)},close:function(){this.element.remove(),this.isShow=!1},update_item:function(e){for(var t=0;t<this.items.length;t++)if(this.items[t].id==e.id){e.state?(this.items[t].title=e.title,this.items[t].state=e.state,this.items[t].desc=e.desc):this.items.splice(t,1);break}this.create_items()},onData:function(e){if(e.id)return this.update_item(e);Dialog.title(`任务列表`),Dialog.icon(`exclamation-sign`),this.items=e.items,this.create_items()},show:function(){this.element||=$(`<div class='dialog-tasks'></div>`),SendCommand(`tasks`),!this.isShow&&(this.element.appendTo(Dialog.contentElement),this.isShow=!0)},status_css:[``,`none`,`finish`,`over`],create_items:function(){for(var e=[],t=0;t<this.items.length;t++){var n=this.items[t];e.push(`<div class='task-item flex-row `),e.push(this.status_css[n.state]),e.push(`'><div class='flex-1'><h3>`),e.push(n.title),e.push(`</h3>`),e.push(`<pre class='task-desc'>`),e.push(n.desc),e.push(`</pre></div>`),e.push(`<span class='task-btn flex-0'`),n.state==1?e.push(`>进行中`):n.state==2?(e.push(` cmd="task `),e.push(n.id),e.push(` fin"`),e.push(`>可领取`)):n.state==3&&e.push(`>已完成`),e.push(`</span>`),e.push(`</div>`)}this.element.html(e.join(``)),Dialog.footer(``)}},ht={init:function(){Dialog.injectStyle(gt)},selected_item:0,close:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.money){let t=e.money??[0,0];this.money=t[0],this.cash_money=t[1],t.length>2?(this.footers=[`黄金`,`元宝`,e.mname||`活动`],this.act_money=t[2],this.act_name=e.mtype??`<hic>积分</hic>`):(this.footers=[`黄金`,`元宝`],this.act_money=0,this.act_name=`<hic>积分</hic>`,this.selected_item>1&&(this.selected_item=0)),e.selected!==void 0&&(this.selected_item=parseInt(e.selected)),this.create_footer(),!e.selllist&&Dialog.jh&&Dialog.jh.items&&SendCommand(`jh mj 0`)}if(e.remove){let t=this.get_item(e.remove);return t&&(t.removed=!0),this.show_items()}if(e.item){let[t,n]=e.item,r=this.get_item(t);r&&(r.count=n,this.show_items());return}e.idx&&(this.command=e.command||`shop`,this.dialogTitle=e.title||`商品列表`,this.idx=e.idx,this.list0=this.format_items(e.selllist[0]||[],0),this.list1=this.format_items(e.selllist[1]||[],1),this.list2=this.format_items(e.selllist[2]||[],2),(!Dialog.isShow||Dialog.curItem!==`shop`||!this.isShow)&&Dialog.show(`shop`),this.create_footer(),this.show_items())},footerChanged:function(e){this.selected_item=parseInt(e),this.show_items(),this.create_footer()},footers:[`黄金`,`元宝`],create_footer:function(){if(this.isShow){for(var e=[],t=0;t<this.footers.length;t++)e.push(`<span class='footer-item`+(t==this.selected_item?` select`:``)+`' for='`+t+`''>`+this.footers[t]+`</span>`);this.selected_item===0?e.push(`<div class="obj-money">`,this.money>0?`你身上有`+x.moneyToStr(this.money):`你身上没有银两`,`</div>`):this.selected_item===1?e.push(`<div class="obj-money">`,this.cash_money>0?`你身上有`+this.cash_money+`<hij>元宝</hij>`:`你身上没有元宝`,`<span cmd="transmoney">账号转入</span></div>`):this.selected_item===2&&e.push(`<div class="obj-money">`,`你身上有`,this.act_money>0?this.act_money:0,this.act_name),Dialog.footer(e.join(``))}},format_items:function(e,t){let n=[];for(let r of e){if(!r)continue;let e={id:r[0],name:r[1],desc:r[2],value:r[3],grade:r[4],discount:r[5]};r[6]&&(e.limit=r[6],e.count=r[7]),e.discount<1&&(t===0?e.price0=`<del>`+e.value+`两黄金</del>`:t===1?e.price0=`<del>`+e.value+`元宝</del>`:t===2&&(e.price0=`<del>`+e.value+this.act_name+`</del>`),e.value*=e.discount),t===0?e.value>=1?e.price=`<hiy>`+e.value+`两黄金</hiy>`:e.price=`<wht>`+e.value*100+`两白银</wht>`:t===1?e.price=`<hij>`+e.value+`元宝</hij>`:t===2&&(e.price=e.value+this.act_name),n.push(e)}return n},show_items:function(){if(!this.isShow)return;let e=[this.list0,this.list1,this.list2][this.selected_item]||[];if(!e.length){let e=this.selected_item===2?`当前没有可兑换的功绩商品。`:`当前没有可购买的商品。`;this.element.find(`.dialog-shop`).html(`<div class='empty'>`+e+`</div>`);return}this.create_items(e)},get_item:function(e){if(this.list0){for(let t of this.list0)if(t.id===e)return t}if(this.list1){for(let t of this.list1)if(t.id===e)return t}if(this.list2){for(let t of this.list2)if(t.id===e)return t}},show:function(e){this.element||=$(`<div class='dialog-shop-content'><div class='dialog-shop'></div></div>`),Dialog.title(this.dialogTitle||`商品列表`),Dialog.icon(`shopping-cart`),this.isShow=!0,this.element.appendTo(Dialog.contentElement);let t=this.command||`shop`;this.idx?SendCommand(t+` `+this.idx):SendCommand(t)},create_items:function(e){let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(r.removed){e.splice(n,1),n--;continue}t.push(`<div class='shop-item`),t.push(` grade`,r.grade),t.push(`'><div class='flex-1'><div class='shop-item-title'>`),t.push(`<div class="shop-item-name">`,r.name,`</div>`),r.limit>0&&t.push(`(`,r.count,`/`,r.limit,`)`),t.push(`</div>`),t.push(`<pre class='shop-desc'>`),t.push(r.desc),t.push(`</pre></div>`),t.push(`<div class='shop-btn' `),t.push(`cmd="_confirm `,this.command||`shop`,` `,r.id),r.limit>0&&t.push(` `,r.limit-r.count),t.push(`">`),r.price0&&t.push(`&nbsp;`,r.price0,`&nbsp;`),t.push(r.price),t.push(`</div>`),t.push(`</div>`)}this.element.find(`.dialog-shop`).html(t.join(``))}},gt=`

.dialog-shop-content {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.dialog-shop {
    flex: 1;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    padding-bottom: 0.5em;
    margin-top: 0.5em;
}

.dialog-shop>.shop-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-bottom: 0.5em;
    padding-left: 0.5em;
    display: flex;
    flex-direction: row;
}

.shop-item-title {
    display: flex;
    flex-direction: row;
    line-height: 2em;
    place-items: 1em;
}

.shop-item-title>.shop-item-name {
    margin: 0px;
    color: var(--border-color);
    font-weight: bold;
}

.shop-item-title>.discount-tag {

    background: linear-gradient(135deg, #ff3e3e 0%, #ff9100 100%);
    color: white;
    width: 4em;
    font-weight: bold;
    text-align: center;
    border-radius: 0.5em;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}



.dialog-shop>.shop-item .shop-desc {
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    white-space: pre-wrap;
}

.dialog-shop>.shop-item .shop-label {
    background: linear-gradient(110deg, transparent 0%, rgba(255, 159, 28, 0.8) 50%, transparent 100%);

    animation: shine 3s infinite linear;
    color: #fff;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}


.dialog-shop>.shop-item>.shop-btn {
    width: 8em;
    display: inline-block;
    border-left: 1px solid var(--border-color);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #222;
    flex-wrap: wrap;
}

.dialog-shop-footer {
    text-align: right;
    padding-right: 0.5em;
}

.dialog-shop-footer>span {
    line-height: 1.8em;
    margin-left: 1em;
    color: #808000;
    display: inline-block;
    padding-right: 1em;
    text-align: center;
    text-decoration: underline;
    border-right: 1px solid #808000;
}

`,z=null,_t=null,vt=null,B=0,V=0,yt=0;function bt(){z||(z=$(`.right-bar>.tool-item`),_t=$(`.br-tool`),vt=$(`.bottom-bar>.tool-item`))}function xt(){if(bt(),B!=1){if(B==0){for(var e=0;e<z.length;e++)z[e].style.display=``,z[e].style.opacity=0;yt=200,V=0,$(_t).removeClass(`hide-tool`)}else V=100,yt=100,$(_t).addClass(`hide-tool`);window.setTimeout(St.bind(null,B),100),B=1}}function St(e){if(e==0){V+=yt;for(var t=V,n=z.length-1;n>=0&&(t<0?z[n].style.opacity=0:t>100?z[n].style.opacity=1:z[n].style.opacity=t/100,t-=20,!(t<0));n--);V-=30,t<100?window.setTimeout(St.bind(null,e),100):B=2}else{V-=yt;for(var t=V,n=0;n<z.length&&(t<0?z[n].style.opacity=0:t>100?z[n].style.opacity=1:z[n].style.opacity=t/100*1,t+=20,!(t>=100));n++);if(V-=20,t>=0)window.setTimeout(St.bind(null,e),100);else{B=0;for(var n=0;n<z.length;n++)z[n].style.display=`none`}}}function Ct(e,t){bt(),t<0?t=0:t>99&&(t=99);let n=z.filter(`[command='`+e+`']`);n.length||(n=vt.filter(`[command='`+e+`']`)),t?n.find(`.tag`).removeClass(`hide`):n.find(`.tag`).addClass(`hide`)}var wt={selected_item:0,footers:[`公告`,`邮箱`,`队伍`,`关系`,`帮派`],footerElements:[`notice`,`mail`,`team`,`relation`,`party`],messages:[],notices:[],unRead:0,selectedMail:null,selectedMailKey:null,expandedNotices:new Set,init:function(){Dialog.injectStyle(Tt)},show:function(){this.element||=this.createElement(),this.isShow=!0,this.expandedNotices.clear(),Dialog.element.addClass(`dialog-social`),Dialog.title(`社交`),Dialog.icon(`envelope`),this.create_footer(),this.showChild(),SendCommand(`message`)},close:function(){this.selectedChild&&=(this.selectedChild.inner_close(),null),this.element&&this.element.detach(),this.selectedMail=null,this.selectedMailKey=null,Dialog.element.removeClass(`dialog-social social-mailbox`),this.isShow=!1},hide:function(){if(this.isMobileMailboxDetail())return this.selectedMail=null,this.selectedMailKey=null,this.renderMailbox(),!1;this.close()},onData:function(e){e.unRead!==void 0&&(this.unRead=e.unRead),e.notices&&(this.notices=e.notices),e.messages&&(this.messages=e.messages,e.resetDetail&&(this.selectedMail=null,this.selectedMailKey=null)),e.notice&&(this.addNotice(e.notice),this.showNoticeMessage(e.notice)),e.mail&&(this.addMail(e.mail),e.mail.detail&&(this.selectedMail=e.mail,this.selectedMailKey=this.mailKey(e.mail.from,e.mail.index))),e.receive&&this.updateMessageState(e.receive,e.index),this.showUnread(),this.renderCurrent()},showUnread:function(){Ct(`message`,this.unRead||0)},addNotice:function(e){for(let t=0;t<this.notices.length;t++)if(this.notices[t].index===e.index){this.notices[t]=e;return}this.notices.unshift(e)},addMail:function(e){let t=this.mailKey(e.from,e.index);for(let n=0;n<this.messages.length;n++)if(this.mailKey(this.messages[n].from,this.messages[n].index)===t){this.messages[n]=Object.assign({},this.messages[n],e);return}this.messages.unshift(e),this.messages.sort((e,t)=>t.time-e.time)},mailKey:function(e,t){return e+`:`+t},create_footer:function(){let e=[];for(let t=0;t<this.footers.length;t++)e.push(`<span class='footer-item`+(t===this.selected_item?` select`:``)+`' for='`+t+`'>`+this.footers[t]+`</span>`);e.push(`<div class="item-commands social-commands"></div>`),Dialog.footer(e.join(``))},footerChanged:function(e){this.selected_item=parseInt(e),this.showChild()},showChild:function(){let e=this.footerElements[this.selected_item];if(Dialog.element.toggleClass(`social-mailbox`,e===`mail`),e===`notice`||e===`mail`){this.selectedChild&&=(this.selectedChild.inner_close(),null),this.element.parent()[0]!==Dialog.contentElement[0]&&Dialog.contentElement.empty().append(this.element),Dialog.title(e===`notice`?`公告`:`邮箱`),Dialog.icon(e===`notice`?`flag`:`envelope`),e===`notice`?this.renderNotices():this.renderMailbox(),this.renderFooterActions();return}this.element.detach(),this.selectedChild&&this.selectedChild.inner_close();let t=Dialog[e];t.element||=t.createElement(),Dialog.contentElement.empty().append(t.element),t.inner_show(),this.selectedChild=t,this.renderFooterActions()},renderCurrent:function(){if(!this.isShow||this.selectedChild)return;let e=this.footerElements[this.selected_item];e===`notice`&&this.renderNotices(),e===`mail`&&this.renderMailbox()},renderFooterActions:function(){let e=Dialog.footerElement.find(`.social-commands`);if(this.footerElements[this.selected_item]!==`mail`){e.empty();return}e.html([`<span cmd="message readall" title="一键已读"><span class="glyphicon glyphicon-ok"></span> 已读</span>`,`<span cmd="receive" title="一键领取全部附件"><span class="glyphicon glyphicon-saved"></span> 领取</span>`,`<span cmd="message deleteall" title="删除已读且没有待领取附件的邮件"><span class="glyphicon glyphicon-trash"></span> 清理</span>`].join(``))},renderNotices:function(){this.element.attr(`class`,`dialog-message notice-view`);let e=[`<div class="notice-list">`];for(let t of this.notices){let n=this.expandedNotices.has(String(t.index));e.push(`<section class="notice-item`,n?` expanded`:``,`" data-index="`,t.index,`">`),e.push(`<button type="button" class="notice-toggle" aria-expanded="`,n?`true`:`false`,`">`),e.push(`<span class="notice-toggle-icon glyphicon `,n?`glyphicon-chevron-down`:`glyphicon-chevron-right`,`"></span>`),e.push(`<span class="notice-title">`,t.title||`系统公告`,`</span>`),e.push(`<span class="notice-time">`,this.formatDate(t.time),`</span></button>`),e.push(`<div class="notice-summary">`,t.summary||`暂无摘要`,`</div>`),e.push(`<div class="notice-content">`,t.content||``,`</div></section>`)}this.notices.length||e.push(`<div class="empty">暂无公告</div>`),e.push(`</div>`),this.element.html(e.join(``))},renderMailbox:function(){this.element.attr(`class`,`dialog-message mail-view`);let e=[`<div class="mail-layout`,this.selectedMail?` has-selection`:``,`">`];e.push(`<div class="mail-list">`);for(let t of this.messages){let n=this.mailKey(t.from,t.index);e.push(`<button type="button" class="mail-item`,t.read?``:` unread`,n===this.selectedMailKey?` selected`:``,`" data-from="`,t.from,`" data-index="`,t.index,`">`),e.push(`<span class="mail-status" aria-hidden="true"></span>`),e.push(`<span class="mail-item-main"><span class="mail-item-heading"><span class="mail-item-title">`,t.title||t.name||`系统邮件`,`</span>`),t.hasAttach&&e.push(`<span class="mail-attach-icon glyphicon glyphicon-file`,t.claimable?` claimable`:``,`" title="`,t.claimable?`附件待领取`:`附件已领取`,`"></span>`),e.push(`</span><span class="mail-item-summary">`,t.summary||`暂无摘要`,`</span></span>`),e.push(`<span class="mail-item-time">`,this.getTimedesc(t.time),`</span></button>`)}this.messages.length||e.push(`<div class="empty">邮箱中没有邮件</div>`),e.push(`</div><div class="mail-detail">`,this.createMailDetail(),`</div></div>`),this.element.html(e.join(``))},createMailDetail:function(){let e=this.selectedMail;if(!e)return`<div class="mail-detail-empty"><span class="glyphicon glyphicon-envelope"></span><span>选择一封邮件查看详情</span></div>`;let t=[];if(t.push(`<div class="mail-detail-toolbar"><button type="button" class="mail-back" title="返回邮件列表">`,`<span class="glyphicon glyphicon-chevron-left"></span><span>返回</span></button>`,`<button type="button" class="mail-delete" cmd="message delete `,e.from,` `,e.index,`" title="删除当前邮件"><span class="glyphicon glyphicon-trash"></span><span>删除</span></button></div>`),t.push(`<div class="mail-detail-header"><h3>`,e.title||e.name||`系统邮件`,`</h3>`),t.push(`<div class="mail-detail-meta"><span>来自：`,e.name||`系统`,`</span><span>`,this.formatDateTime(e.time),`</span></div></div>`),t.push(`<div class="mail-detail-content">`,e.content||``,`</div>`),e.attach&&e.attach.length){t.push(`<section class="mail-attachments"><div class="mail-attachments-title"><span class="glyphicon glyphicon-file"></span> 邮件附件</div>`);for(let n of e.attach)t.push(`<div class="mail-attachment"><span>`,n.name||`附件`,`</span></div>`);e.rec?t.push(`<div class="mail-attachment-state"><span class="glyphicon glyphicon-ok"></span> 已领取</div>`):t.push(`<button type="button" class="mail-claim" cmd="receive `,e.from,` `,e.index,`"><span class="glyphicon glyphicon-saved"></span><span>领取附件</span></button>`),t.push(`</section>`)}else t.push(`<div class="mail-no-attachment">此邮件没有附件</div>`);return t.join(``)},showNoticeMessage:function(e){ReceiveMessage(`
<hiy>`+(e.title||`系统公告`)+`</hiy>
<hic>`+e.content+`
</hic>`)},updateMessageState:function(e,t){let n=this.mailKey(e,t);for(let e of this.messages)if(this.mailKey(e.from,e.index)===n){e.claimable=!1;break}this.selectedMailKey===n&&this.selectedMail&&(this.selectedMail.rec=!0,this.selectedMail.claimable=!1)},createElement:function(){let e=$(`<div class="dialog-message"></div>`);return e.on(`click`,`.notice-toggle`,this.toggleNotice),e.on(`click`,`.mail-item`,this.showMailDetail),e.on(`click`,`.mail-back`,this.backToMailList),e},toggleNotice:function(){let e=$(this).closest(`.notice-item`),t=String(e.attr(`data-index`)),n=!Dialog.message.expandedNotices.has(t);n?Dialog.message.expandedNotices.add(t):Dialog.message.expandedNotices.delete(t),e.toggleClass(`expanded`,n),$(this).attr(`aria-expanded`,String(n)).find(`.notice-toggle-icon`).toggleClass(`glyphicon-chevron-down`,n).toggleClass(`glyphicon-chevron-right`,!n)},showMailDetail:function(){let e=$(this).attr(`data-from`),t=$(this).attr(`data-index`);!e||t===void 0||SendCommand(`message read `+e+` `+t)},backToMailList:function(){Dialog.message.selectedMail=null,Dialog.message.selectedMailKey=null,Dialog.message.renderMailbox()},isMobileMailboxDetail:function(){return this.footerElements[this.selected_item]===`mail`&&!!this.selectedMail&&window.matchMedia(`(max-width: 560px)`).matches},getTimedesc:function(e){let t=new Date,n=new Date(e),r=(t-n)/1e3;if(r<60)return`刚刚`;if(r<3600)return parseInt(r/60)+`分钟前`;let i=new Date(t.getFullYear(),t.getMonth(),t.getDate()),a=new Date(n.getFullYear(),n.getMonth(),n.getDate()),o=Math.round((i-a)/864e5),s=this.add_zero(n.getHours())+`:`+this.add_zero(n.getMinutes());return o===0?`今天 `+s:o===1?`昨天 `+s:o===2?`前天 `+s:n.getMonth()+1+`月`+n.getDate()+`日`},formatDate:function(e){let t=new Date(e);return t.getFullYear()+`-`+this.add_zero(t.getMonth()+1)+`-`+this.add_zero(t.getDate())},formatDateTime:function(e){let t=new Date(e);return this.formatDate(e)+` `+this.add_zero(t.getHours())+`:`+this.add_zero(t.getMinutes())},add_zero:function(e){return e<10?`0`+e:String(e)}},Tt=`
.dialog-message {
    height: 100%;
    min-height: 0;
    overflow: hidden;
    color: var(--theme-text);
}

.dialog-message .empty {
    color: var(--theme-muted);
    padding: 2em 1em;
    text-align: center;
}

.notice-list {
    height: 100%;
    overflow-y: auto;
}

.notice-item {
    margin-bottom: 0.55em;
    border: 1px solid var(--theme-border);
    border-left: 3px solid var(--theme-accent);
    border-radius: 4px;
    background-color: var(--theme-panel);
    overflow: hidden;
}

.notice-toggle {
    width: 100%;
    min-height: 2.6em;
    display: grid;
    grid-template-columns: 1.2em minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.4em;
    padding: 0.5em 0.7em;
    border: 0;
    color: var(--theme-text);
    background: transparent;
    text-align: left;
    cursor: pointer;
}

.notice-toggle-icon {
    color: var(--theme-accent);
}

.notice-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
}

.notice-time {
    color: var(--theme-muted);
    font-size: 0.82em;
}

.notice-summary,
.notice-content {
    padding: 0 0.8em 0.7em 2.3em;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.notice-summary {
    color: var(--theme-muted);
}

.notice-content {
    display: none;
    padding-top: 0.8em;
    border-top: 1px solid var(--theme-border);
    color: var(--theme-text);
    line-height: 1.65;
}

.notice-item.expanded .notice-summary {
    display: none;
}

.notice-item.expanded .notice-content {
    display: block;
}

.mail-layout {
    display: grid;
    grid-template-columns: minmax(12em, 36%) minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--theme-panel);
}

.mail-list,
.mail-detail {
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
}

.mail-list {
    border-right: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.mail-item {
    width: 100%;
    min-height: 4.7em;
    display: grid;
    grid-template-columns: 0.5em minmax(0, 1fr) auto;
    gap: 0.45em;
    align-items: start;
    padding: 0.65em 0.55em;
    border: 0;
    border-bottom: 1px solid var(--theme-border);
    color: var(--theme-muted);
    background: transparent;
    text-align: left;
    cursor: pointer;
}

.mail-item:hover,
.mail-item.selected {
    background-color: var(--theme-surface-2);
}

.mail-item.unread {
    color: var(--theme-text);
    background-color: var(--theme-panel);
}

.mail-status {
    width: 0.48em;
    height: 0.48em;
    margin-top: 0.35em;
    border-radius: 50%;
    background-color: transparent;
}

.mail-item.unread .mail-status {
    background-color: var(--theme-active);
}

.mail-item-main {
    min-width: 0;
    display: block;
}

.mail-item-heading {
    display: flex;
    align-items: center;
    gap: 0.35em;
}

.mail-item-title,
.mail-item-summary {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.mail-item-title {
    flex: 1;
    font-weight: bold;
}

.mail-item-summary {
    margin-top: 0.45em;
    color: var(--theme-muted);
    font-size: 0.86em;
}

.mail-attach-icon {
    color: var(--theme-muted);
}

.mail-attach-icon.claimable {
    color: var(--theme-warning);
}

.mail-item-time {
    color: var(--theme-muted);
    font-size: 0.76em;
    white-space: nowrap;
}

.mail-detail {
    padding: 0.9em 1em 1.2em;
    background-color: var(--theme-bg);
}

.mail-detail-empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.7em;
    color: var(--theme-muted);
}

.mail-detail-empty .glyphicon {
    font-size: 2em;
}

.mail-detail-toolbar {
    display: flex;
    justify-content: space-between;
    min-height: 2em;
}

.mail-back,
.mail-delete,
.mail-claim {
    min-height: 2.2em;
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    padding: 0 0.7em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    color: var(--theme-text);
    background-color: var(--theme-surface);
    cursor: pointer;
}

.mail-back {
    visibility: hidden;
}

.mail-delete {
    color: var(--theme-danger);
}

.mail-detail-header h3 {
    margin: 0.8em 0 0.4em;
    font-size: 1.15em;
    letter-spacing: 0;
    color: var(--theme-accent);
    overflow-wrap: anywhere;
}

.mail-detail-meta {
    display: flex;
    justify-content: space-between;
    gap: 0.8em;
    padding-bottom: 0.8em;
    border-bottom: 1px solid var(--theme-border);
    color: var(--theme-muted);
    font-size: 0.84em;
}

.mail-detail-content {
    min-height: 5em;
    padding: 1em 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.65;
}

.mail-attachments {
    padding: 0.75em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-panel);
}

.mail-attachments-title {
    margin-bottom: 0.6em;
    color: var(--theme-accent);
    font-weight: bold;
}

.mail-attachment {
    display: inline-block;
    margin: 0 0.45em 0.45em 0;
    padding: 0.35em 0.55em;
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    background-color: var(--theme-surface);
}

.mail-claim {
    display: flex;
    width: max-content;
    margin-top: 0.45em;
    color: var(--theme-button-text);
    background-color: var(--theme-accent);
    border-color: var(--theme-accent);
}

.mail-attachment-state,
.mail-no-attachment {
    margin-top: 0.65em;
    color: var(--theme-muted);
}

.social-commands .glyphicon {
    margin-right: 0.15em;
}

.dialog-team,
.dialog-party,
.dialog-relation {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    box-sizing: border-box;
}

.dialog-team>.empty {
    color: var(--theme-muted);
    padding-top: 1em;
    text-align: center;
}

.dialog-team>.team-item {
    min-height: 2.4em;
    padding-left: 0.5em;
    border: 1px solid var(--theme-border);
    border-left: 2px solid var(--theme-accent);
    border-radius: 4px;
    margin: 0.5em 0;
    background-color: var(--theme-panel);
    line-height: 2em;
    cursor: pointer;
}

.dialog-team>.team-item>.item-commands {
    padding-left: 2em;
}

.dialog-team>.team-item>.team-flag {
    width: 2em;
    display: inline-block;
    text-align: center;
    color: var(--theme-accent);
}

.dialog-relation>.relation-item {
    min-height: 2.4em;
    display: flex;
    margin: 0.5em 0;
    padding-left: 0.5em;
    border: 1px solid var(--theme-border);
    border-left: 2px solid var(--theme-accent);
    border-radius: 4px;
    background-color: var(--theme-panel);
    line-height: 2em;
}

.dialog-relation>.relation-item>.relation-desc {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dialog-relation>.relation-item>.relation-cmd {
    flex: none;
    padding: 0 0.8em;
    border-left: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
    cursor: pointer;
}

@media (max-width: 560px) {
    .mail-layout {
        display: block;
    }

    .mail-layout .mail-detail {
        display: none;
        height: 100%;
    }

    .mail-layout.has-selection .mail-list {
        display: none;
    }

    .mail-layout.has-selection .mail-detail {
        display: block;
    }

    .mail-back {
        visibility: visible;
    }

    .notice-toggle {
        grid-template-columns: 1.2em minmax(0, 1fr);
    }

    .notice-time {
        grid-column: 2;
    }

    .notice-summary,
    .notice-content {
        padding-left: 2.3em;
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer {
        flex: 0 0 5em;
        height: 5em;
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        grid-template-rows: 2.5em 2.5em;
        overflow: hidden;
        white-space: normal;
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer>.footer-item {
        width: auto;
        min-width: 0;
        grid-row: 1;
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer>.social-commands {
        grid-column: 1 / -1;
        grid-row: 2;
        float: none;
        display: flex;
        margin: 0;
        border-top: 1px solid var(--theme-border);
    }

    .dialog.dialog-social.social-mailbox>.dialog-footer>.social-commands>span {
        flex: 1;
        margin: 0;
        text-align: center;
    }

    .social-commands span {
        font-size: 0.9em;
    }
}
`,Et=[[`总榜`,``],[`武当派`,`wudang`],[`少林派`,`shaolin`],[`华山派`,`huashan`],[`峨眉派`,`emei`],[`逍遥派`,`xiaoyao`],[`全真教`,`quanzhen`],[`丐帮`,`gaibang`],[`杀手楼`,`shashou`],[`血刀门`,`xuedao`],[`明教`,`mingjiao`],[`日月神教`,`riyue`],[`移花宫`,`yihua`],[`散人`,`none`]],Dt={footers:[{cmd:`score`,name:`综合榜`,selected_silder:``,silder:Et},{cmd:`top`,name:`高手榜`,selected_silder:``,silder:Et},{cmd:`weapon`,name:`兵器谱`,selected_silder:``,silder:[[`武器`,``],[`衣服`,`cloth`],[`鞋`,`shoes`],[`头部`,`head`],[`披风`,`cape`],[`戒指`,`ring`],[`项链`,`necklace`],[`饰品`,`jewels`],[`护腕`,`wrist`],[`腰带`,`waist`],[`暗器`,`throwing`]]},{cmd:`exp`,name:`经验榜`,selected_silder:``,silder:Et},{cmd:`mp`,name:`内力榜`,selected_silder:``,silder:Et},{cmd:`money`,name:`富豪榜`,selected_silder:``,silder:Et}],selectedItem:0,init:function(){Dialog.injectStyle(Ot)},close:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.close)return Dialog.hide();if(e.tops)return e.top?this.show_desc(`你目前在第`+e.top+`名，积分`+e.sc):this.show_desc(`你目前没有上榜，积分：`+e.sc),this.create_tops(e.tops,e);if(e.weapons)return this.show_desc(``),this.create_weapons(e.weapons);if(e.scores)return this.show_desc(`你目前的评分：`+e.score),this.create_scores(e.scores);if(e.items){this.create_other(e.items,e.st);let t=new Date(e.time);e.fam=e.fam??``,this[`last_`+e.st+e.fam]={items:e.items,time:e.time+6e4,score:e.score},e.score?this.show_desc(`你目前的评分：`+e.score):this.show_desc(`上次更新：`+t.getHours()+`:`+t.getMinutes())}},create_other:function(e,t){for(var n=[],r=0;r<20;r++){n.push(`<div class='top-item`),r<3&&n.push(` top`,r+1),n.push(`' top='`),n.push(r+1),n.push(`'><span class='top-title'>`),n.push(this.top_names[r]),n.push(`、</span>`),n.push(`<span class='top-name'>`);let t=e[r]??[`无`,0];n.push(t[0]),n.push(`</span>`),n.push(`<span class='top-sc'>`),n.push(t[1]),n.push(`</span>`),n.push(`</div>`)}this.container.html(n.join(``))},silderClick:function(){let e=$(this),t=e.attr(`stype`),n=Dialog.stats.selectedItem;n.selected_silder!==t&&(n.selected_silder=t,e.parent().find(`.select`).removeClass(`select`),e.addClass(`select`),Dialog.stats.load_stats())},create_silder:function(e){let t=[];e||=[];let n=this.selectedItem;for(let r of e)t.push(`<div class="stats-silder `,n.selected_silder===r[1]?`select`:``,`" stype="`,r[1],`">`,r[0],`</div>`);this.left_silder.html(t.join(``))},top_names:[`一　`,`二　`,`三　`,`四　`,`五　`,`六　`,`七　`,`八　`,`九　`,`十　`,`十一`,`十二`,`十三`,`十四`,`十五`,`十六`,`十七`,`十八`,`十九`,`二十`],create_scores:function(e,t){for(var n=[],r=0;r<20;r++){n.push(`<div class='top-item scores`),r<3&&n.push(` top`,r+1),n.push(`' top='`),n.push(r+1),n.push(`'><span class='top-title'>`),n.push(this.top_names[r]),n.push(`、</span>`),n.push(`<span class='top-name'>`);let t=e[r]??[`无`,``];n.push(t[0]),n.push(`</span>`),n.push(`<span class='top-sc'>`),n.push(t[1]),n.push(`</span>`),n.push(`</div>`)}this.container.html(n.join(``))},fam_names:{emei:`峨眉第`,wudang:`武当第`,huashan:`华山第`,xiaoyao:`逍遥第`,quanzhen:`全真第`,gaibang:`丐帮第`,shaolin:`少林第`,shashou:`杀手第`,xuedao:`血刀第`,mingjiao:`明教第`,riyue:`日月第`,yihua:`移花第`,none:`散人第`},create_tops:function(e,t){for(var n=[],r=0;r<e.length;r++)n.push(`<div class='top-item top `),r<3&&n.push(` top`,r+1),n.push(`' top='`),n.push(r+1),n.push(`'><span class='top-title'>`),n.push(t.fam?this.fam_names[t.fam]:`天下第`),n.push(this.top_names[r]),n.push(`</span>`),n.push(`<span class='top-name'>`),n.push(e[r][0]),n.push(`</span>`),n.push(`<span class='top-sc'>`),n.push(e[r][1]),n.push(`</span>`),n.push(`</div>`);this.container.html(n.join(``)),this.top=t.top},create_weapons:function(e){for(var t=[],n=0;n<10;n++){t.push(`<div class='top-item weapon top`),t.push(n+1),t.push(`' top='`),t.push(n+1),t.push(`'><span class='top-title'>`);let r=e[n]??[`无`,``];t.push(this.top_names[n]),t.push(`、</span>`),t.push(`<span class='top-name'>`),t.push(r[0]),t.push(`</span>`),t.push(`<span class='top-sc'>`),t.push(r[1]),t.push(`</span>`),t.push(`</div>`)}this.container.html(t.join(``))},show:function(){this.selectedItem||=this.footers[0],this.load_stats(),this.element||(this.element=$(`<div class='stats-container'><div class='stats-container-left'></div></div>`),this.container=$(`<div class='dialog-stats'></div>`).appendTo(this.element),this.left_silder=this.element.find(`.stats-container-left`),this.create_silder(this.selectedItem.silder)),!this.isShow&&(this.create_footer(),Dialog.icon(`stats`),Dialog.title(this.selectedItem.name),Dialog.contentElement.html(this.element),this.element.on(`click`,`.top-item`,this.itemClick),this.left_silder.on(`click`,`.stats-silder `,this.silderClick),this.isShow=!0)},load_stats:function(){let e=this.selectedItem.cmd,t=this.selectedItem.selected_silder,n=this[`last_`+e+t];if(n&&n.time>Date.now()){let t=new Date(n.time),r=``;return r=n.score?`你目前的评分：`+n.score:`上次更新：`+t.getHours()+`:`+t.getMinutes(),this.show_desc(r),this.create_other(n.items,e)}let r=`stats `+e;t&&(r=r+` `+t),SendCommand(r)},create_footer:function(){for(var e=[],t=0;t<this.footers.length;t++){var n=this.footers[t];e.push(`<span class='footer-item`+(n==this.selectedItem?` select`:``)+`' for='`+t+`''>`+n.name+`</span>`)}e.push(`<span class='stats-span'></span>`),Dialog.footer(e.join(``))},show_desc:function(e){Dialog.footerElement.find(`.stats-span`).html(e)},footerChanged:function(e){var t=this.footers[e];t!=this.selectedItem&&(this.selectedItem=t,Dialog.title(this.selectedItem.name),this.create_silder(this.selectedItem.silder),this.load_stats())},itemClick:function(){var e=$(this),t=parseInt(e.attr(`top`)),n=Dialog.stats.selectedItem.cmd,r=[`<div class='item-commands'>`],i=Dialog.stats.selectedItem.selected_silder;n===`top`?(r.push(`<span cmd="stats `+n+` `+i+` `+t+`">查看</span>`),(!Dialog.stats.top||t<Dialog.stats.top)&&r.push(`<span cmd="biwu `+i+` `+t+`">挑战</span>`),r.push(`<span cmd="reward top `+t+`">查看规则和奖励</span>`)):(r.push(`<span cmd="stats `+n+` `+i+` `+t+`">查看</span>`),r.push(`<span cmd="reward `+n+` `+t+`">查看奖励</span>`)),r.push(`</div>`),Dialog.stats.element.find(`.item-commands`).remove(),$(r.join(``)).insertAfter(e)}},Ot=`

.stats-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    min-height: 0;
    margin-top: 0.5em;
    box-sizing: border-box;
}

.stats-container>.stats-container-left {
    overflow-y: auto;
    min-height: 0;
}

.stats-container-left>.stats-silder {
    white-space: nowrap;
    line-height: 2em;
    width: 5em;
    text-align: center;
    background-color: var(--theme-panel);
    color: var(--theme-text);
    border: 1px solid var(--theme-border);
    border-radius: 4px;
    margin-bottom: 0.5em;
    margin-right: 0.5em;
    margin-left: 0.5em;
    text-align: center;
    cursor: pointer;
}

.stats-container-left>.select {
    background-color: var(--theme-accent);
    color: var(--theme-button-text);
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: var(--theme-active);
}

.dialog-stats {
    flex: 1;
    overflow: auto;
}

.dialog-stats>.top-item {
    white-space: nowrap;
    line-height: 2em;
    padding-left: .5em;
    border-radius: 4px;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: var(--theme-panel);
    border: 1px solid var(--theme-border);
    cursor: pointer;
    color: var(--theme-text);
}

.dialog-stats>.top-item>.top-title {
    display: inline-block;
    font-weight: bold;
    height: 1.875em;
    line-height: 1.875em;
    padding-left: 1em;
    margin-right: 1em;
}

.dialog-stats>.top-item>.top-sc {
    float: right;
    margin-right: 1em;
    line-height: 1.875em;
    font-weight: bold;
    font-style: italic;
    color: var(--theme-active);
}



.dialog-stats>.top1>.top-sc {
    color: var(--theme-danger);
}

.dialog-stats>.top2>.top-sc {
    color: var(--theme-active);
}

.dialog-stats>.top3>.top-sc {
    color: var(--theme-warning);
}

.dialog-stats>.top-item>.top-name {
    height: 1.875em;
    line-height: 1.875em;
}

.dialog-stats>.top-item>.item-commands {
    padding-left: 3.125em;
}

.stats-span {
    float: right;
    padding-right: 10px;
    color: var(--theme-text);
    line-height: 2.5em;
}

@media (max-width: 480px) {
    .stats-container {
        min-width: 0;
    }

    .stats-container>.stats-container-left {
        flex: 0 0 4.8em;
    }

    .stats-container-left>.stats-silder {
        writing-mode: horizontal-tb;
        text-orientation: mixed;
        width: auto;
        padding: 0.35em 0.25em;
        line-height: 1.4em;
        white-space: nowrap;
    }
}
`;function kt(e,t){if(typeof t==`string`)return t;if(!t||!t.length)return``;var n=[`<div class="jh-skill-section"><div class="jh-skill-title">`,e,`</div><div class="jh-skill-pills">`];for(let e of t)n.push(`<span class="jh-skill-pill grade`,e.grade||0,`"`),e.cmd&&n.push(` cmd="`,e.cmd,`"`),n.push(`>`),n.push(e.color_name||e.name),n.push(`</span>`);return n.push(`</div></div>`),n.join(``)}var H={name:`门派`,items:null,selected_index:0,type:`fam`,onDetail:function(e){var t=this.items[e.index];if(t)return t.type=`门派`,t.desc=e.desc,t.sp=e.sp,t.actions=e.actions,t.skills=e.skills,this.showDetail(t)},showDetail:function(e){var t=[`<pre><hig>`];t.push(e.name),t.push(`</hig>
`),t.push(e.desc),e.sp&&(t.push(`
<hig>特点：`),t.push(e.sp),t.push(`</hig>
`)),this.append_actions(t,e),t.push(`<div class="item-commands"><span cmd="jh fam `+e.index+` start">进入地图</span>`);let n=[];Dialog.extend.append(n,`map`,e);for(let e of n)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`),e.skills&&t.push(this.renderSkills(e.skills)),t.push(`</pre>`),this.descElement.html(t.join(``)),this.select(e.index)},renderSkills:function(e){return e&&typeof e!=`string`&&(e=e.map(function(e){return e.cmd?e:Object.assign({cmd:`checkskill `+e.id+` jhhelp`},e)})),kt(`门派武功`,e)},renderDrops:function(e){return kt(`掉落或解谜奖励`,e)},append_actions:function(e,t){let n=t.actions??[];e.push(`<div class="fb-actions">`);for(let t of n)e.push(`<div class="fb-action">`),e.push(`<span class="action-desc">`,t[2]??``,`</span>`),t[1]&&e.push(`<span class="action-name"  cmd="`,t[0],`">`,t[1],`</span>`),e.push(`</div>`);e.push(`</div>`)},show:function(e,t){for(var n=[],r=0;r<this.items.length;r++){var i=this.items[r];n.push(`<div class="fam-item`),n.push(`" index="`,r,`">`,i.name,`</div>`),i.index=r}e.html(n.join(``)),this.listElement=e,this.descElement=t,this.onClickItem(this.selected_index)},select:function(e){var t=this.listElement.find(`div[index='`+e+`']`);if(t.length&&!t.is(`.selected`)){var n=t[0].offsetTop,r=this.listElement.height();n>r/2&&(n=(r-t.height())/2,this.listElement[0].scrollTop=n),this.selectedItem&&this.selectedItem.removeClass(`selected`),this.selectedItem=t,this.selectedItem.addClass(`selected`),this.selected_index=e}},onClickItem:function(e){let t=this.items[e];t.desc?this.showDetail(t):SendCommand(`jh `+this.type+` `+e),this.select(e)},append_footer:function(){let e=this.items[this.selected_index];Dialog.footerElement.find(`.item-commands`).html(`<span cmd="jh fam ${e.index} start">进入地图</span>`)}},U={name:`副本`,type:`fb`,items:null,selected_index:-1,select:H.select,onClickItem:H.onClickItem,onDetail:function(e){var t=this.items[e.index];if(t)return t.type=`副本`,t.desc=e.desc,t.reward=e.reward,t.drops=e.drops,t.diffs=e.diffs,t.status=e.status,this.showDetail(t)},update_unlock:function(e){this.unlock=e;for(let t=0;t<this.items.length;t++)this.items[t].unlock=e>=t;this.selected_index<0&&(this.selected_index=e)},show:function(e,t){this.listElement=e,this.descElement=t;for(var n=[`<div class='fb-content'>`],r=0;r<this.items.length;r++){var i=this.items[r];n.push(`<div class="fb-item`),i.unlock||n.push(` lock`),i.index=r,n.push(`" index="`,r,`">`,i.name,`</div>`)}n.join(`</div>`),this.listElement.html(n.join(``)),this.onClickItem(this.selected_index)},show_first:function(e){let t=e.prev().html();t&&ReceiveMessage(t)},fb_models:[`普通`,`<red>困难</red>`,`<cyn>组队</cyn>`],showDetail:function(e){var t=[`<pre>`];if(t.push(e.name),e.unlock?t.push(`
<hig>已解锁</hig>
`):t.push(`
<red>未解锁</red>
`),t.push(e.desc),this.append_status(t,e),e.unlock&&e.diffs){t.push(`<div class="item-commands">`);for(let n=0;n<e.diffs.length;n++)e.diffs[n]&&t.push(`<span cmd="jh fb `,e.index,` start`,n+1,`">`,this.fb_buttons[n],`</span>`);let n=[];Dialog.extend.append(n,`map`,e);for(let e of n)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`)}e.reward&&t.push(`
`,e.reward),t.push(H.renderDrops(e.drops)),t.push(`</pre>`),this.descElement.html(t.join(``)),this.select(e.index)},append_status:function(e,t){let n=t.status??[];if(n.length){e.push(`<div class="fb-actions">`);for(let r=0;r<n.length;r++){let i=n[r];i&&(i[0]===1?(e.push(`<div class="fb-action finshed">`),e.push(`<span class="action-desc">由`,i[1],`首次通过`,`</span>`),e.push(`<span class="action-name" cmd="cr2 `,t.index,` `,r,`">`,this.fb_models[r],`</span>`),e.push(`</div>`)):(e.push(`<div class="fb-action">`),e.push(`<span class="action-desc">该模式尚未完成首杀`,i[1]?`，称号奖励：`+i[1]:``,`</span>`),e.push(`<span class="action-name"  cmd="cr2 `,t.index,` `,r,`">`,this.fb_models[r],`</span>`),e.push(`</div>`)))}e.push(`</div>`)}},fb_buttons:[`进入副本`,`困难模式`,`组队进入`],append_footer:function(){let e=this.items[this.selected_index],t=[];if(e.unlock)for(let n=0;n<e.diffs.length;n++)e.diffs[n]&&t.push(`<span cmd="jh fb `,e.index,` start`,n+1,`">`,this.fb_buttons[n],`</span>`);Dialog.footerElement.find(`.item-commands`).html(t.join(``))}},W={name:`禁地`,items:null,type:`ar`,selected_index:0,select:H.select,onClickItem:H.onClickItem,append_status:U.append_status,append_actions:H.append_actions,fb_models:[`普通`,`普通`,`组队`],onDetail:function(e){var t=this.items[e.index];if(t)return t.type=`禁地`,t.desc=e.desc,t.actions=e.actions,t.status=e.status,t.reward=e.reward,t.drops=e.drops,this.showDetail(t)},update_unlock:function(e){for(let t=0;t<this.items.length;t++)this.items[t].unlock=(e&2**t)!=0},show:function(e,t){var n=[`<div class='fb-content'>`];let r=Math.max(this.items.length,10);for(var i=0;i<r;i++){var a=this.items[i];n.push(`<div class="fb-item`),a?(a.unlock||n.push(` lock`),n.push(`" index="`,i,`">`,a.name,`</div>`),a.index=i):n.push(`">&nbsp;</div>`)}n.join(`</div>`),this.listElement=e,this.descElement=t,this.listElement.html(n.join(``)),this.onClickItem(this.selected_index)},showDetail:function(e){var t=[`<pre>`];if(t.push(e.name),e.unlock?t.push(`
<hig>已解锁</hig>
`):t.push(`
<red>未解锁</red>
`),t.push(e.desc,`
`),this.append_status(t,e),this.append_actions(t,e),e.unlock){t.push(`<div class="item-commands">`),t.push(`<span cmd="jh ar ${e.index} start">进入地图</span>`);let n=[];Dialog.extend.append(n,`map`,e);for(let e of n)t.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);t.push(`</div>`)}e.reward&&t.push(`
`,e.reward),t.push(H.renderDrops(e.drops)),t.push(`</pre>`),this.descElement.html(t.join(``)),this.select(e.index)},append_footer:function(){let e=this.items[this.selected_index];e.unlock?Dialog.footerElement.find(`.item-commands`).html(`<span cmd="jh ar ${e.index} start">进入地图</span>`):Dialog.footerElement.find(`.item-commands`).empty()}};function At(e){if(!e||!e.active||!(e.expiresAt>0))return`未开始`;let t=Math.max(0,Math.ceil((e.expiresAt-Date.now())/1e3));return t?Math.floor(t/60)+`分`+String(t%60).padStart(2,`0`)+`秒`:`即将结算`}var jt=[{name:`潜能`,color_name:`潜能`,grade:2},{name:`经验`,color_name:`经验`,grade:2}],Mt={name:`秘境`,type:`mj`,items:null,selected_index:0,select:H.select,onClickItem:function(e){let t=this.items&&this.items[e];t&&(t.desc?this.showDetail(t):SendCommand(`jh mj `+e),this.select(e))},onDetail:function(e){let t=this.items&&this.items[e.index];t&&(t.type=`秘境`,t.desc=e.desc,t.drops=e.drops||jt,t.status=e.status||t.status,t.actions=e.actions,this.showDetail(t))},show:function(e,t){this.listElement=e,this.descElement=t;let n=[`<div class='fb-content'>`],r=this.items||[];for(let e=0;e<r.length;e++){let t=r[e];t.index=e,n.push(`<div class="fb-item mj-item" index="`,e,`">`,t.name,`</div>`)}n.push(`</div>`),this.listElement.html(n.join(``));let i=this.items&&this.items[this.selected_index];i&&(i.desc=null),this.onClickItem(this.selected_index),this.startTimer()},showDetail:function(e){let t=e.status||{},n=[`<pre>`,`<hig>`,e.name,`</hig>
`];n.push(e.desc||``),n.push(`

<hiy>挑战状态</hiy>
`),t.active?n.push(`进行中：击杀 `,t.kills||0,`/`,t.maxKills||100,`，剩余 `,At(t),`。
`):n.push(`今日挑战：`,t.dailyCount||0,`/`,t.dailyLimit||1,`，归墟种：`,t.ticket||0,`枚。
`),n.push(kt(`掉落物`,e.drops)),n.push(`</pre>`),this.descElement.html(n.join(``)),this.select(e.index),this.append_footer()},append_footer:function(){let e=this.items&&this.items[this.selected_index];if(!e)return Dialog.footerElement.find(`.item-commands`).empty();let t=e.status||{},n=[];t.active?n.push(`<span cmd="mijing over">结束挑战</span>`):(t.dailyCount||0)>=(t.dailyLimit||1)?n.push(`<span class="disabled">今日挑战次数已用尽</span>`):(t.ticket||0)>0?n.push(`<span cmd="jh mj `,e.index,` start">进入秘境</span>`):n.push(`<span cmd="shop">购买归墟种</span>`),Dialog.footerElement.find(`.item-commands`).html(n.join(``))},updateStatus:function(e,t){let n=this.items&&this.items[t];n&&(n.status=e,this.selected_index===t&&this.descElement&&this.showDetail(n))},startTimer:function(){clearInterval(this.timer),this.timer=setInterval(()=>{let e=this.items&&this.items[this.selected_index];e&&e.status&&e.status.active&&this.descElement&&this.isVisible()&&this.showDetail(e)},1e3)},isVisible:function(){return this.listElement&&this.listElement.closest(`.dialog-fb`).length>0},close:function(){clearInterval(this.timer),this.timer=null}},Nt={fb:U,fam:H,ar:W,mj:Mt},Pt={init:function(){Dialog.injectStyle(Ft)},close:function(){Mt.close(),this.hideSkillDetail(),this.element.remove(),this.isShow=!1},onData:function(e){if(e.close)return Dialog.isShow&&Dialog.hide();if(e.skill)return this.showSkillDetail(e.skill);if(e.drop)return this.showDropDetail(e.drop);if(e.desc){let t=Nt[e.t]||this.selected_item;return t&&t.onDetail(e)}if(e.t===`mj`){e.status&&Mt.updateStatus(e.status,e.index||0);return}if(e.unlock!==void 0||e.unlock2!==void 0)return this.update_lock(e);if(e.refresh!==void 0&&this.isLoad){let t=Nt[e.t],n=t.items[e.refresh];if(n&&n.desc){n.desc=null;let e=t.items.indexOf(n);t.selected_index==e&&t.onClickItem(e)}return}!e.fbs&&!e.mijings||(H.items=(e.families||[]).map(function(e){return{name:e,unlock:!1}}),U.items=(e.fbs||[]).map(function(e){return{name:e}}),W.items=(e.areas||[]).map(function(e){return{name:e,unlock:!1}}),Mt.items=(e.mijings||[]).map(function(e){return{name:e}}),this.selected_item.show(this.listElement,this.descElement))},show:function(){this.isShow||(this.element||=$(`<div class='dialog-fb'><div class='fb-left'></div><div class='fb-right'></div></div>`),this.listElement=this.element.find(`.fb-left`).off(`click.jhList`).on(`click.jhList`,`.fb-item,.fam-item,.mj-item`,this.item_click),this.descElement=this.element.find(`.fb-right`),this.element.off(`click.jhSkill`).on(`click.jhSkill`,`.jh-skill-detail-close,.jh-skill-detail-mask`,this.skill_detail_close).on(`click.jhSkill`,`.jh-skill-detail`,function(e){e.stopPropagation()}),Dialog.title(`江湖`),Dialog.icon(`home`),this.element.appendTo(Dialog.contentElement),this.isShow=!0,this.isLoad?SendCommand(`jh fb lock`):(SendCommand(`jh`),this.isLoad=!0,this.selected_item=this.footers[0]),this.create_footer())},selected_item:null,footers:[H,U,W,Mt],create_footer:function(){for(var e=[],t=0;t<this.footers.length;t++){let n=this.footers[t];e.push(`<span class='footer-item`+(n==this.selected_item?` select`:``)+`' for='`+t+`'>`+this.footers[t].name+`</span>`)}e.push(`<div class="item-commands"></div>`),Dialog.footerElement.html(e.join(``))},item_click:function(){var e=$(this);if(e.is(`.selected`))return;let t=e.attr(`index`);t!==void 0&&Dialog.jh.selected_item.onClickItem(t)},skill_detail_close:function(){Dialog.jh.hideSkillDetail()},hideSkillDetail:function(){this.skillDetailElement&&=(this.skillDetailElement.remove(),null)},showSkillDetail:function(e){this.showDetailPopup(e)},showDropDetail:function(e){this.showDetailPopup(e)},showDetailPopup:function(e){this.hideSkillDetail();var t=[`<div class="jh-skill-detail-mask"><div class="jh-skill-detail grade`,e.grade||0,`">`];t.push(`<div class="jh-skill-detail-header"><span class="jh-skill-detail-title">`),t.push(e.color_name||e.name),t.push(`</span><span class="jh-skill-detail-close">关闭</span></div>`),t.push(`<pre class="jh-skill-detail-body">`),t.push(e.desc),t.push(`</pre></div></div>`),this.skillDetailElement=$(t.join(``)).appendTo(this.element)},update_lock:function(e){e.unlock>=0&&U.items&&(U.update_unlock(e.unlock),this.selected_item===U&&U.show(this.listElement,this.descElement)),e.unlock2>=0&&W.items&&(W.update_unlock(e.unlock2),this.selected_item===W&&W.show(this.listElement,this.descElement))},footerChanged:function(e){let t=this.footers[e];t!=this.selected_item&&(this.selected_item=t,Dialog.footerElement.find(`.item-commands`).empty(),t.show(this.listElement,this.descElement))}},Ft=`


.dialog-fb {
    position: relative;
    height: 100%;
    min-height: 0;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
}

.dialog-fb>.fb-left {
    width: 12.5em;
    height: 100%;
    text-align: center;
    margin-top: 0.5em;
    overflow-y: auto;
}

.dialog-fb>.fb-right {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    padding-left: 0.5em;
}

.fb-actions {
    margin-top: 0.5em;
}

.fb-actions>.fb-action {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.fb-actions>.fb-action>.action-desc {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: gray;
    overflow: hidden;
}

.fb-actions>.fb-action>.action-name {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

.fb-actions>.fb-action>.action-name:hover {
    background-color: #333;
}

.fb-actions>.finshed {
    border-left-color: var(--theme-grade-1);
}

.fb-actions>.finshed>.action-desc {
    color: var(--theme-grade-1);
}

.dialog-fb>.fb-right>pre {
    white-space: pre-wrap;
    margin: 0.5em 0.5em 2em 0.5em;
}

.jh-skill-section {
    margin-top: 1em;
}

.jh-skill-title {
    margin-bottom: 0.5em;
    color: var(--theme-muted);
}

.jh-skill-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
}

.jh-skill-pill {
    display: inline-flex;
    align-items: center;
    min-height: 1.8em;
    padding: 0 0.9em;
    border: 1px solid var(--border-color, var(--theme-border));
    border-radius: 999px;
    background-color: var(--theme-panel);
    color: var(--border-color, var(--theme-text));
    line-height: 1.8em;
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
}

.jh-skill-pill:hover {
    background-color: var(--theme-surface);
    color: var(--theme-accent);
}

.jh-skill-detail-mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75em;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 2;
}

.jh-skill-detail {
    width: min(28rem, 100%);
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--border-color, var(--theme-border));
    border-radius: var(--popup-radius, 4px);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    box-shadow: 0 1em 2em rgba(0, 0, 0, 0.28);
}

.jh-skill-detail-header {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.55em 0.7em;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.jh-skill-detail-title {
    flex: 1;
    color: var(--border-color, var(--theme-accent));
    font-weight: bold;
}

.jh-skill-detail-close {
    flex: none;
    color: var(--theme-muted);
    cursor: pointer;
    user-select: none;
}

.jh-skill-detail-close:hover {
    color: var(--theme-accent);
}

.jh-skill-detail-body {
    flex: 1;
    margin: 0;
    padding: 0.9em;
    overflow: auto;
    white-space: pre-wrap;
}

@media (max-width: 480px) {
    .jh-skill-detail-mask {
        padding: 0.55em;
    }

    .jh-skill-detail {
        width: 100%;
    }
}

.dialog-fb>.fb-left>.fb-content {
    height: 100%;
    overflow: auto;
}

.dialog-fb>.fb-left>.fb-content>.fb-item {
    line-height: 2em;
    padding-left: 1.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}


.dialog-fb>.fb-left>.fam-item {
    line-height: 2em;
    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
}

.dialog-fb>.fb-left>.fb-content>.line {
    height: 1.25em;
    width: 0px;
    border-left: 1px solid #343434;
    margin-left: auto;
    margin-right: auto;
    margin-top: -1em;
    margin-bottom: -1em;
}

.dialog-fb>.fb-left>.fb-content>.lock {
    border-color: #bebebe;
    color: #bebebe !important;
    opacity: 0.6;
}

.dialog-fb>.fb-left>.fb-content .selected,
.dialog-fb>.fb-left>.selected {
    border-color: var(--theme-grade-1);
    color: var(--theme-grade-1);
}

.dialog-fb .item-commands .disabled {
    color: var(--theme-muted);
    cursor: default;
}

.dialog-fb>.fb-left>.fb-content>.lock:before {
    font-family: 'Glyphicons Halflings';
    content: "\\e033";
    float: left;
    margin-left: 0.25em;
    opacity: 0.6;
}
`,It={init:function(){},createElement:function(){return $(`<div class="dialog-relation"></div>`)},inner_show:function(){SendCommand(`relation`),this.isShow=!0,Dialog.title(`关系`),Dialog.icon(`heart`)},onData:function(e){var t=[];if(t.push(`<div class='relation-item'>`),t.push(`<div class='relation-desc'>`),e.husband?(t.push(`你的丈夫：`),t.push(e.husband)):e.wife?(t.push(`你的妻子：`),t.push(e.wife)):t.push(`你目前没有结婚。`),t.push(`</div>`),(e.wife||e.husband)&&(t.push(`<div class='relation-cmd' cmd='_confirm greet wife'><him>❀送花❀</him></div>`),t.push(`<div class='relation-cmd' cmd='rel marry'>解除关系</div>`)),t.push(`</div>`),t.push(`<div class='relation-item'>`),t.push(`<div class='relation-desc'>`),e.shifu?(t.push(`你的师父：`),t.push(e.shifu)):e.tudi?(t.push(`你的徒弟：`),t.push(e.tudi)):t.push(`你目前没有拜师，也没有收徒。`),t.push(`</div>`),e.shifu?(t.push(`<div class='relation-cmd' cmd='greet master'><hig>请安</hig></div>`),t.push(`<div class='relation-cmd' cmd='rel st'>出师</div>`),t.push(`</div>`)):e.tid&&t.push(`<div class='relation-cmd' cmd='rel st'>解除关系</div>`),t.push(`</div>`),e.st!=null&&(t.push(`<div class='relation-item'><div class='relation-desc'>`),t.push(`当师徒组队完成副本后将获得额外奖励，本周已完成`+e.st+`/10。`,`</div>`),t.push(`<div class='relation-cmd' cmd='team add `,e.tid??e.shifu,`'>邀请组队</div>`),t.push(`</div>`)),e.reward&&(t.push(`<div class='relation-item'>`),t.push(e.reward),t.push(`</div>`)),t.push(`</div>`),e.fls)for(let n of e.fls)n&&(t.push(`<div class='relation-item'>`),t.push(`<div class='relation-desc'>你的家人：`,n[0]),n[2]?(t.push(`，已`,n[2],format_time_span(n[3])),t.push(`</div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` stop'>停止</div>`)):(t.push(`空闲中</div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` caiyao'><hic>采药</hic></div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` diaoyu'><hic>钓鱼</hic></div>`),t.push(`<div class='relation-cmd' cmd='rel `,n[1],` wk'><hic>挖矿</hic></div>`)),t.push(`</div>`));this.element.html(t.join(``))},inner_close:function(){this.element.remove(),this.isShow=!1}},Lt={init:function(){},createElement:function(){return $(`<div class="dialog-team"></div>`)},inner_show:function(){SendCommand(`team`),this.isShow=!0,Dialog.title(`队伍`),this.element.on(`click`,`.team-item`,this.clickItem),Dialog.icon(`list`)},items:[],onData:function(e){if(e.items&&(this.items=e.items,e.items.length?this.isCap=e.items[0].id==Process.player:this.isCap=0),e.dismiss&&(this.items.length=0,this.isCap=!1),e.remove){if(!this.items.length)return;for(var t=0;t<this.items.length;t++)if(this.items[t].id==e.remove){this.items.splice(t,1);break}}this.createItems()},inner_close:function(){this.element.remove(),this.isShow=!1},createItems:function(){if(this.element){for(var e=[],t=0;t<this.items.length;t++){var n=this.items[t];e.push(`<div class='team-item' index='`+t+`'>`),e.push(`<span class='team-flag'>`),e.push(t>0?``:`<span class='glyphicon glyphicon-flag'></span>`),e.push(`</span>`),e.push(`<span class='team-title'>`),e.push(n.name),e.push(`</span>`),e.push(`</div>`)}e.length||e.push(`<div class="empty">你还没有加入任何队伍。</div>`),this.element.html(e.join(``))}},clickItem:function(){var e=$(this),t=Dialog.team.items[e.attr(`index`)];if(t){var n=[`<div class='item-commands'>`];n.push(`<span cmd="look3 `+t.id+`">查看</span>`);var r=Dialog.team.items[0].id==Process.player;r&&t.id!=Process.player?n.push(`<span cmd="team remove `+t.id+`">移出队伍</span>`):t.id==Process.player&&n.push(`<span cmd="team out `+t.id+`">退出队伍</span>`),r&&t.id==Process.player&&n.push(`<span cmd="team set">更改分配方式</span>`),n.push(`</div>`),Dialog.team.element.find(`.item-commands`).remove(),$(n.join(``)).appendTo(e)}}},Rt=`
.dialog-party>wht {
    display: inline-block;
    height: 15rem;
    line-height: 15rem;
    text-align: center;
    width: 100%;
}

.dialog-party>.dialog-party-add {
    margin-top: 2em;
    text-align: center;
}

.dialog-party>.dialog-party-add>input {
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    resize: none;
    margin-top: 1em;
    margin-bottom: 1em;
    line-height: 2em;
    border-radius: 0.5em;
    text-align: center;
}

.dialog-party>.party-title {
    font-size: 2rem;
    width: 100%;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
    opacity: 0.7;
    font-weight: bold;

}

.dialog-party>.party-notice {
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    color: var(--theme-grade-2);
    line-height: 2em;
}

.dialog-party>.party-notice>*>span {

    width: 3em;
    display: inline-block;
    padding-right: 0.5em;
}

.dialog-party>.party-title>.party-count {

    font-size: 1rem;
}

.dialog-party>.party-title>*>.glyphicon {

    padding-right: 0.5em;
    float: left;
}

.dialog-party>.party-roles {

    overflow-x: hidden;
    overflow-y: auto;
}

.dialog-party>.party-roles>.party-role,
.dialog-party>.party-item {

    padding-left: 0.5em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    background-color: #111;
    line-height: 2em;
    cursor: pointer;
}

.dialog-party>.party-item {
    display: flex;
}

.dialog-party>.party-item>.party-item-name {
    padding-left: 0.5em;
    flex: 1;
}

.dialog-party>.party-item>.party-item-sc {

    flex: 0;
    margin-left: 1em;
    margin-right: 1em;
}

.dialog-party>.party-item>.party-item-cmd {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
}

.dialog-party>.party-roles>.party-role>.role-level {

    width: 3em;
    display: inline-block;
}

.dialog-party>.party-roles>.party-role>.role-name {
    padding-left: 0.5em;
}

.dialog-party>.party-roles>.party-role>.role-sc {
    float: right;
    padding-right: 0.5rem;

}
`,zt={init:function(){Dialog.injectStyle(Rt)},createElement:function(){return $(`<div class="dialog-party"></div>`)},inner_show:function(){SendCommand(`party load`),this.isShow=!0,Dialog.title(``),this.element.on(`click`,`.party-role`,this.show_commands),Dialog.icon(`flag`)},levels:[``,`<hio>帮主<hio>`,`<hiz>副帮主</hiz>`,`<hiy>长老</hiy>`,`<hic>堂主</hic>`,`帮众`],level_roles:[1,20,30,40,50,60],level:5,get_role:function(e){if(this.roles){for(var t=0;t<this.roles.length;t++)if(this.roles[t].id==e)return this.roles[t]}},command:function(e){if(e===`create`){let e=[`<div class="dialog-party-add">`];e.push(`<div>创建帮派需要500两<hiy>黄金</hiy>，请输入帮派名称(2-5字中文)：</div>`),e.push(`<input type="text" ></input>`),e.push(`<div class='item-commands'><span cmd='_party cancle'>取消</span><span cmd='_party create2'>确定</span></div>`),e.push(`</div>`),this.element.html(e.join(``))}else if(e===`cancle`)this.empty(`你还没有加入帮派`);else if(e===`create2`){let e=$(`.dialog-party-add>input`).val();if(!e||e.length>5||e.length<2)return ReceiveMessage(`帮派名字需要是2-5中文字符。`);SendCommand(`party create2 `+e)}},empty:function(e){this.element.html(`<wht>`+e+`</wht><div class='item-commands'><span cmd='_party create'>创建帮派</span><span cmd='party list'>加入帮派</span></div>`)},show_list:function(e){if(!e.list.length)return this.empty(`现在没有已经创建的帮派`);var t=[];for(let n of e.list)t.push(`<div class='party-item'>`),t.push(`<span class='party-item-name'>`),t.push(n[0]),t.push(`</span>`),t.push(`<span class='party-item-sc'>人数：`),t.push(n[1]),t.push(`</span>`),t.push(`<span class='party-item-cmd' cmd='party join `,n[0],`'>加入</span>`),t.push(`</div>`);this.element.html(t.join(``))},onData:function(e){if(e.list)return this.show_list(e);if(!e.name)return this.empty(`你还没有加入帮派`);var t=e;Dialog.title(`帮派【`+t.name+`】 <nor>`+e.roles.length+`/`+this.level_roles[e.level]+`</nor>`);var n=[];t.notice&&(n.push(`<div class='party-notice'>`),n.push(t.notice),n.push(`</div>`)),n.push(`<div class='party-roles'>`);for(var r=0;r<t.roles.length;r++){var i=t.roles[r];i.id==Process.player&&(this.level=i.level),n.push(`<div class='party-role' roleid='`+i.id+`'>`),n.push(`<span class='role-level'>`),n.push(this.levels[i.level]),n.push(`</span>`),n.push(`<span class='role-name'>`),n.push(i.name),n.push(`</span>`),n.push(`<span class='role-sc'>`),n.push(i.sc),n.push(`</span>`),n.push(`</div>`)}n.push(`</div>`),this.roles=e.roles,this.element.html(n.join(``))},show_commands:function(){var e=Dialog.party.get_role($(this).attr(`roleid`));if(e){var t=[`<div class='item-commands'>`];e.id==Process.player?(t.push(`<span cmd="party out">退出帮派</span>`),Dialog.party.level==1&&t.push(`<span cmd="party dissmiss">解散</span>`)):(e.level>Dialog.party.level-1&&e.level>2&&t.push(`<span cmd="party uplevel `+e.id+`">提升为`+Dialog.party.levels[e.level-1]+`</span>`),e.level>Dialog.party.level&&e.level<5&&t.push(`<span cmd="party downlevel `+e.id+`">降级为`+Dialog.party.levels[e.level+1]+`</span>`),Dialog.party.level==1&&e.level==2&&t.push(`<span cmd="party trans `+e.id+`">让位</span>`),e.level>Dialog.party.level&&t.push(`<span cmd="party remove `+e.id+`">开除</span>`),e.online&&t.push(`<span cmd="team add `+e.id+`">邀请组队</span>`)),t.length!=1&&(t.push(`</div>`),Dialog.party.element.find(`.item-commands`).remove(),$(t.join(``)).insertAfter(this))}},inner_close:function(){this.element.remove(),this.isShow=!1}},Bt={init:function(){Dialog.pack.init()},hide:function(){this.element.remove(),this.isShow=!1},close:function(){this.hide()},onData:function(e){this.isShow||Dialog.show(`trade`),Dialog.title(`和`+e.name+`交易中`),Dialog.pack.items,this.trade_target=e.target,this.trade_list.length=0,Dialog.pack.items?this.update_pack():SendCommand(`pack`),Dialog.pack.isShow=!1,this.create_items(this.leftElement.empty(),this.trade_list,this.max_count)},update_pack:function(e){this.create_items(this.rightElement.empty(),Dialog.pack.items,Dialog.pack.max_count)},max_count:10,trade_list:[],show:function(e){this.isShow||=(Dialog.init(),Dialog.curItem=`trade`,this.element||(this.element=$(`<div class="dialog-list"><div class="obj-list"></div><div class="obj-list"></div></div >`),this.leftElement=$(this.element.children()[0]),this.rightElement=$(this.element.children()[1])),this.leftElement.on(`click`,`.obj-item`,this.left_click),this.rightElement.on(`click`,`.obj-item`,this.right_click),this.element.appendTo(Dialog.contentElement.empty()),this.create_footer(),!0)},create_footer:function(){var e=[`<div class='item-commands'>`];e.push(`<span cmd='_trade ok'>确定</span>`),e.push(`<span  cmd='_trade cancle'>取消</span>`),e.push(`</div>`),Dialog.footer(e.join(``))},confirm:function(e){if(e===`ok`&&this.trade_list.length)for(var t=0;t<this.trade_list.length;t++)SendCommand(`give `+this.trade_target+` `+this.trade_list[t].count+` `+this.trade_list[t].id);Dialog.hide()},create_items:function(e,t,n){var r=[];t=Dialog.pack.sort_items(t);for(var i=0;i<n;i++){var a=t[i];r.push(`<div class="obj-item`),a?(r.push(a.is_lock?` lock`:``,` grade`,a.grade),r.push(`"`),r.push(` oindex='`+a.id+`'>`),r.push(`<span class='obj-name'>`),r.push(a.name),r.push(`</span>`),a.count>1&&(r.push(`<span class='obj-value'>`),r.push(a.count),r.push(a.unit),r.push(`</span>`))):r.push(`">`),r.push(`</div>`)}e.html(r.join(``))},left_click:function(){var e=$(this).attr(`oindex`);if(e){for(var t=null,n=0;n<Dialog.trade.trade_list.length;n++)if(Dialog.trade.trade_list[n].id==e){t=Dialog.trade.trade_list[n];break}if(t)return Dialog.trade.cancle_trade(t),!1}},enable_item:function(e,t){var n=this.rightElement.find(`.obj-item[oindex='`+e.id+`']`);n.length&&(t?n.removeClass(`disabled`):n.addClass(`disabled`))},right_click:function(){var e=$(this);if(!e.is(`.disabled`)){var t=e.attr(`oindex`);if(t){var n=Dialog.pack.get_item(t);if(n)return n.count>1?Confirm.Show_trade_add(n):Dialog.trade.add_trade(n),!1}}},add_trade:function(e){for(var t=0;t<this.trade_list.length;t++)if(e.id==this.trade_list[t].id)return this.trade_list[t].count+=e.count,this.create_items();this.trade_list.push(e),this.create_items(this.leftElement.empty(),this.trade_list,this.max_count),this.enable_item(e,!1)},cancle_trade:function(e){for(var t=0;t<this.trade_list.length;t++)e.id==this.trade_list[t].id&&(this.trade_list.splice(t,1),t--);this.create_items(this.leftElement.empty(),this.trade_list,this.max_count),this.enable_item(e,!0)}},Vt=`

.dialog-events {
    height: 100%;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    margin-bottom: 0.5em;
    margin-top: 0.5em;
    box-sizing: border-box;
}

.dialog-events>.empty {
    text-align: center;
    color: gray;
    margin-bottom: 3em;
    margin-top: 3em;
}

.dialog-events>.event-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    position: relative;
    margin-top: 0.5em;
    padding-left: 0.5em;
}

.event-item h3 {
    margin: 0px;
    padding-top: 0.5em;
    color: var(--border-color)
}

.event-item .event-desc {
    white-space: pre-wrap;
    margin: 0;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
}

.event-item>.event-btn {
    width: 7em;
    border-left: 1px solid var(--border-color);
    text-align: center;
    font-weight: bold;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--border-color);
}

`,Ht={unRead:0,init:function(){Dialog.injectStyle(Vt)},hide:function(){this.element.remove(),this.isShow=!1},onData:function(e){if(e.close)return Dialog.hide();if(!e.items)return e.finish?this.unRead--:this.unRead++,this.showUnread();this.items=e.items,this.create_items()},showUnread:function(){Ct(`events`,this.unRead)},show:function(){this.element||=$(`<div class='dialog-events'></div>`),SendCommand(`events`),!this.isShow&&(Dialog.title(`活动`),Dialog.icon(`dashboard`),this.unRead=0,this.showUnread(),Dialog.footer(``),this.element.appendTo(Dialog.contentElement),this.isShow=!0)},create_items:function(){let e=[];for(let t=0;t<this.items.length;t++){let[n,r,i,a,o,s]=this.items[t];e.push(`<div class='event-item flex-row `),e.push(`grade`,a),e.push(`'><div class='flex-1'><h3>`),e.push(r),e.push(`</h3>`),e.push(`<pre class='event-desc'>`),e.push(i),o>0&&e.push(`
<mem>`,this.format_time(o),`</mem>`),e.push(`</pre></div>`),e.push(`<span class='event-btn flex-0'`),s?e.push(` cmd='events `,n,`' >`,s):e.push(`>进行中`),e.push(`</span>`),e.push(`</div>`)}e.length||e.push(`<div class="empty">暂无活动</div>`),this.element.html(e.join(``)),Dialog.footer(`<span class="obj-money">共有`+this.items.length+`项活动正在进行</span>`)},format_time:function(e){let t=new Date(e),n=new Date,r=t.getDate(),i=t.getHours(),a=t.getMinutes(),o=[`持续到`];return n.getFullYear()!==t.getFullYear()&&o.push(t.getFullYear(),`年`),n.getMonth()===t.getMonth()?r!==n.getDate()&&o.push(this.format_num(r),`日`):o.push(this.format_num(t.getMonth()+1),`月`,this.format_num(r),`日`),o.push(this.format_num(i),`:`,this.format_num(a)),o.join(``)},format_num:function(e){return e>9?e.toString():`0`+e.toString()}},Ut=`
.dialog-pms {
    height: 100%;
    min-height: 0;
    max-height: none;
    overflow-y: auto;
    margin-bottom: 0.5em;
    box-sizing: border-box;
}

.dialog-pms>.empty {
    text-align: center;
    margin-top: 3em;
    margin-bottom: 3em;
    color: gray;
}

.dialog-pms>.pm-item {
    border-radius: 6px;
    background-color: #111111;
    border-left-width: 4px;
    border-left-style: solid;
    border-left-color: gray;
    position: relative;
    padding-left: 0.5em;
    line-height: 2em;
    margin-top: 0.5em;
    cursor: pointer;
}

.dialog-pms>.selected {
    border-left-color: var(--theme-grade-1);
    background-color: #222;
}

.dialog-pms>.pm-item>.pm-title {
    width: 10em;

}

.dialog-pms>.pm-item>.pm-desc {
    min-width: 10em;
    flex: 1;
}

.dialog-pms>.pm-item>.pm-mem {

    padding-right: 1em;
    color: gray;
    font-size: 0.8em;
}

.dialog-pms>.pm-item>.pm-add {
    width: 4em;
    border-left: 1px solid #343434;
    text-align: center;
    color: var(--theme-grade-2)
}

.dialog-pms>.pm-item>.pm-add:hover {
    background-color: #333;
}
`;function Wt(e){let t=Math.floor(e/1e3);if(t<0&&(t=0),t>3600){let e=Math.floor(t/3600)+`小时`;return t%=3600,e+=Math.floor(t/60)+`分`,e}let n=Math.floor(t/60)+`分`;return t%=60,n+t+`秒`}var Gt={init:function(){Dialog.injectStyle(Ut)},close:function(){this.element.remove(),this.isShow=!1},onData:function(e){e.list?(this.show(),this.create_items(e.list)):e.item&&this.update_item(e.item)},show:function(){(!Dialog.isShow||Dialog.curItem!=`pm`)&&Dialog.show(`pm`),this.element||=$(`<div class='dialog-pms'></div>`),!this.isShow&&(Dialog.title(`拍卖行`),Dialog.icon(`shopping-cart`),Dialog.footer(``),this.element.appendTo(Dialog.contentElement),this.element.on(`click`,`.pm-item`,this.select_item),this.isShow=!0)},select_item:function(){let e=$(this),t=Dialog.pm;t.selected_item&&t.selected_item.removeClass(`selected`),t.selected_item=e,t.selected_item.addClass(`selected`)},update_item:function(e){let t=this.element.find(`.pm-item[oid="`+e[0]+`"]`);t&&t.replaceWith(this.create_item(e))},create_items:function(e){let t=[];for(let n=0;n<e.length;n++)t.push(this.create_item(e[n]));t.length||t.push(`<div class="empty">暂无拍卖</div>`),this.element.html(t.join(``)),Dialog.footer(`<span class="obj-money">共有`+e.length+`项道具正在拍卖</span>`)},create_item:function(e){let t=[],[n,r,i,a,o]=e;return t.push(`<div class='pm-item grade0 flex-row' oid='`,n,`'>`),t.push(`<div class='pm-title' cmd='pm show `,n,`'>`),t.push(r),t.push(`</div>`),t.push(`<div class='pm-desc flex-1'>`),o?t.push(o,`最后出价`,moneyToStr(i)):t.push(`当前价格`,moneyToStr(i)),t.push(`</div>`),t.push(`<div class='pm-mem'>`),t.push(`剩余：`,Wt(a),``),t.push(`</div>`),t.push(`<div class='pm-add' cmd='pm add `,n,`'>`),t.push(`出价`),t.push(`</div>`),t.push(`</div>`),t.join(``)},format_num:function(e){return e>9?e.toString():`0`+e.toString()}},Kt={init:function(){Dialog.pack.init(),this.cleanup_cmds=Dialog.pack.cleanup_cmds,this.formatEqs=Dialog.pack.formatEqs,this.formatItems=Dialog.pack.formatItems,this.formatPackItem=Dialog.pack.formatPackItem,this.createItems=Dialog.pack.createItems,this.create_eqs=Dialog.pack.create_eqs,this.init_element=Dialog.pack.init_element,this.show_items=Dialog.pack.show_items,this.updateitem=Dialog.pack.updateitem,this.footerChanged=Dialog.pack.footerChanged,this.cleanup=Dialog.pack.cleanup,this.item_cleanup=Dialog.pack.item_cleanup,this.show_sub=Dialog.pack.show_sub,this.get_sub_title=Dialog.pack.get_sub_title,this.close=Dialog.pack.close,this.get_item=Dialog.pack.get_item,this.create_item_command=Dialog.pack.create_item_command},onData:function(e){if(e.items)this.show(),this.eqs=this.formatEqs(e.eqs||[]),this.money=e.money,this.id=e.id,this.command_before=`dc `+this.id+` `,this.items=this.formatItems(e.items),this.target_name=e.name,this.max_count=e.max_item_count,this.show_items(),this.show_moeny();else{if(!this.isShow||e.owner_id&&e.owner_id!==this.id)return!1;this.updateitem(e)}},show_moeny:function(){if(!this.isShow)return;let e=x.moneyToStr(this.money),t=this.packElement.is(`.cleanup`);Dialog.footerElement&&Dialog.footerElement.addClass(`pack-footer`).toggleClass(`pack-cleanup-footer`,t);let n=[];n.push(`<div class='obj-money'>`),t?(n.push(`<span for='cancle' class='footer-item'>取消</span>`),n.push(`<span for='store' class='footer-item'>自动存仓</span>`),n.push(`<span for='sell' class='footer-item'>清理杂物</span>`),n.push(`<span for='cleanup' class='footer-item'>确定</span></div>`)):(n.push(`<span class='obj-money-text'>`,this.target_name,e?`身上有`+e:`身上没有任何银两`,`</span>`),n.push(`<span for='cleanup' class='footer-item'>整理</span></div>`)),Dialog.footer(n.join(``))},cleanup_item:function(e,t){let n=$(t),r=n.parent().attr(`oindex`),i=n.attr(`cmd`);SendCommand(Dialog.pack2.command_before+i+` `+r)},hide:function(){this.objelement&&=(this.objelement.remove(),null),Dialog.element&&Dialog.element.removeClass(`dialog-pack-dialog`),Dialog.footerElement&&Dialog.footerElement.removeClass(`pack-footer pack-cleanup-footer`),this.element&&this.element.remove(),this.isShow=!1},show:function(){(!Dialog.isShow||Dialog.curItem!==`pack2`)&&Dialog.select(`pack2`),Dialog.element.addClass(`dialog-pack-dialog`),this.objelement&&=(this.objelement.remove(),null),!this.isShow&&(this.isShow=!0,this.init_element(),this.packElement.on(`click`,`.obj-item`,this.item_click),this.eqElement.on(`click`,`.eq-item`,this.eqitem_click),this.element.appendTo(Dialog.contentElement))},item_click:function(e){let t=$(e.target);if(Dialog.pack2.packElement.is(`.cleanup`)&&t.is(`.obj-oper`))return Dialog.pack2.item_cleanup(t);t=$(this);var n=t.attr(`oindex`);if(n){var r=Dialog.pack2.get_item(n);if(Dialog.pack2.element.find(`.item-commands`).remove(),r)return M.LAST_OBJ=r,SendCommand(Dialog.pack2.command_before+`checkobj `+r.id+` from item`),!1}},eqitem_click:function(){var e=Dialog.pack2.eqs[$(this).attr(`oindex`)];e&&SendCommand(Dialog.pack2.command_before+`checkobj `+e.id+` from eq`)}},qt={isShow:!1,init:function(){Dialog.skills.init(),this.createSkillItems=Dialog.skills.createSkillItems,this.createSkillItem=Dialog.skills.createSkillItem,this.updateSkill=Dialog.skills.updateSkill,this.updateSkillItem=Dialog.skills.updateSkillItem,this.showdesc=Dialog.skills.showdesc,this.showProgression=Dialog.skills.showProgression,this.isEnable=Dialog.skills.isEnable,this.close=Dialog.skills.close},hide:function(){if(this.progression_element&&=(this.progression_element.remove(),null),this.skill_element)return this.skill_element.remove(),this.skill_element=null,this.element.removeClass(`hide-item`),Dialog.footer(``),!1;this.isShow=!1},onData:function(e){if(e.desc)return this.showdesc(e);if(e.id)return this.updateSkill(e);if(e.books)return this.showBooks();if(e.remove&&e.from===this.master){this.items.Remove(this.skills[e.remove]),this.skills[e.remove];for(var t=0;t<this.items.length;t++)this.items[t].enable_skill==e.remove&&(this.items[t].enable_skill=null);return delete this.skills[e.remove],this.createSkillItems(this.items)}if(!(!e.master&&!e.follower)){Dialog.show(`master`),this.master=e.master||e.follower,this.is_follower=!!e.follower;for(var n={},t=0;t<e.items.length;t++){var r=e.items[t];n[r.id]=r}if(this.skills=n,this.items=e.items,Dialog.title(e.title),Dialog.icon(`book`),this.createSkillItems(e.items,n),e.limit)if(this.is_follower){let t=[`<div class="footer-item select" for="0">`,`技能</div>`];t.push(`<div class="footer-item" for="1">书架</div>`),t.push(`<span class='obj-money'>`,e.target,`目前的技能上限为<HIC>`,e.limit,`</HIC>级</span>`),Dialog.footer(t.join(``))}else Dialog.footer(`<span class='obj-money'>你目前的技能上限为<HIC>`+e.limit+`</HIC>级</span>`)}},create_footer:function(){},selectedItem:0,footerChanged:function(e){if(e=parseInt(e),e!==this.selectedItem)if(this.selectedItem=e,e===0)this.element.removeClass(`dialog-books`),this.createSkillItems(this.items,this.skills);else return Dialog.skills.books?this.showBooks():SendCommand(`sbook`),this.element.addClass(`dialog-books`)},showBooks:function(){if(!(!this.isShow||!this.is_follower)){var e=[],t=Dialog.skills.sort_items(Dialog.skills.books);for(let n of t)e.push(`<div class="book-item `),e.push(`grade`,n.grade,`" >`),e.push(`<div class="book-name">`,n.name,`</div>`),e.push(`<div class="book-action border-right" cmd="sbook `,n.id,`">查看</div>`),e.push(`<div class="book-action" cmd="dc `,Dialog.master.master,` study `,n.id,`">学习</div>`),e.push(`</div>`);this.element.html(e.join(``))}},show:function(){this.isShow||=(this.element||=$(`<div class="dialog-skills"></div >`),this.element.on(`click`,`.skill-item`,this.item_click),this.element.appendTo(Dialog.contentElement),this.element.removeClass(`hide-item`),!0)},item_click:function(){var e=$(this),t=Dialog.master.skills[e.attr(`skid`)];if(!t)return;var n=[`<div class='item-commands'>`];if(n.push(`<span cmd="checkskill `+t.id+` `+Dialog.master.master+`">查看详细</span>`),n.push(`<span cmd="xue `+e.attr(`skid`)+` from `+Dialog.master.master+`">学习</span>`),t.master=1,Dialog.master.is_follower){var r=`dc `+Dialog.master.master;if(n.push(`<span cmd="_confirm `+r+` fangqi `+e.attr(`skid`)+`">遗忘</span>`),n.push(`<span cmd="`+r+` lianxi `+e.attr(`skid`)+`">练习</span>`),t.can_enables)for(var i=0;i<t.can_enables.length;i++){var a=Dialog.master.skills[t.can_enables[i]];a&&(a.enable_skill==t.id?n.push(`<span cmd="`+r+` enable `+a.id+` none">取消装备`+a.name+`</span>`):n.push(`<span cmd="`+r+` enable `+a.id+` `+t.id+`">装备`+a.name+`</span>`))}if(t.enable_skill){var o=Dialog.master.skills[t.enable_skill];o?n.push(`<span cmd="`+r+` enable `+t.id+` none">取消装备`+o.name+`</span>`):t.enable_skill=null}t.master=0}M.LAST_OBJ=t;let s=Dialog.extend.query(`mskill`,t);for(let e of s)n.push(`<span cmd="`,e.cmd,`">`,e.name,`</span>`);n.push(`</div>`),Dialog.master.element.find(`.item-commands`).remove(),$(n.join(``)).insertAfter(e),x.checkScroll(e)}},Jt={init:function(){Dialog.pack.init()},hide:function(){this.element.remove(),this.isShow=!1},close:function(){this.hide()},updateitem:function(e){if(e.store){if(!this.stores||!this.isShow)return Dialog.pack.onData({remove:e.store,id:e.id});var t=this.find_item(1,e.id),n=this.find_item(3,e.storeid);t?t.count-=e.store:(t=Object.assign({},n),t.id=e.id,t.count=-e.store,Dialog.pack.items.push(t)),n?n.count+=e.store:(n=Object.assign({},t),n.id=e.storeid,n.count=e.store,this.stores.push(n)),this.store_count=e.sum??this.stores.length,n.count==0&&this.stores.Remove(n),t.count==0&&Dialog.pack.items.Remove(t)}else if(e.sell){var t=this.find_item(2,e.id);if(t)return t.count-=e.sell,this.create_items(this.selllist,this.leftElement,2,this.selllist.length)}this.isstore&&this.isShow&&(this.create_items(this.stores,this.leftElement,3,Math.max(this.max_store_count,100)),Dialog.title(`你的仓库中有`+this.store_count+`/`+this.max_store_count+`件物品`)),this.update_pack(),e.money!=null&&this.show_footer(e.money)},find_item:function(e,t){var n=Dialog.pack.items;e==2?n=this.selllist:e==3&&(n=this.stores);for(var r=0;r<n.length;r++)if(n[r].id==t)return n[r]},formatItems:function(e){let t=[];for(let n of e)t.push({name:n[0],id:n[1],count:n[2],grade:n[3],unit:n[4],value:n[5]});return t},onData:function(e){if(e.id)return this.updateitem(e);var t=e.gongji??e.jungong??e.yaoyuan??e.mvalue;e.selllist?(this.show(),this.isstore=!1,this.gongji=t,this.money_name=null,this.typeElement.hide(),this.selllist=this.formatItems(e.selllist),e.gongji>=0?this.money_name=`门派功绩`:e.jungong>=0?this.money_name=`军功`:e.yaoyuan>=0?this.money_name=`<ord>妖元</ord>`:this.money_name=e.mtype,this.create_items(this.selllist,this.leftElement,2,this.selllist.length),Dialog.titleElement.html(e.title),Dialog.icon(`shopping-cart`),e.seller&&(this.seller=e.seller),this.update_pack()):e.stores&&(this.show(),this.typeElement.show(),this.isstore=!0,this.stores=Dialog.pack.formatItems(e.stores),e.sum>0?(this.typeElement.show(),this.store_count=e.sum):(this.typeElement.hide(),this.store_count=e.stores.length),this.create_items(this.stores,this.leftElement,3,Math.max(e.max_store_count,100)),this.leftElement[0].scrollTop=0,Dialog.titleElement.html(`你的仓库中有`+this.store_count+`/`+e.max_store_count+`件物品`),this.max_store_count=e.max_store_count,Dialog.icon(`lock`),this.update_pack()),t>=0&&(this.gongji=t,this.show_footer(t))},show:function(e){if((!Dialog.isShow||Dialog.curItem!=`list`)&&Dialog.show(`list`),this.rightElement&&(this.rightElement.show(),Dialog.pack.objelement&&Dialog.pack.objelement.remove()),!this.isShow){if(!this.element){this.element=$(`<div class="dialog-list"><div class="otype-list"><div class="otype-item select" otype="0">道具</div><div class="otype-item"  otype="1">秘籍</div><div class="otype-item" otype="2">宝石</div><div class="otype-item" otype="3">资源</div><div class="otype-item" otype="4">装备</div></div><div class="trade-list"></div><div class="obj-list"></div></div >`);var t=this.element.children();this.typeElement=$(t[0]),this.typeElement.hide(),this.leftElement=$(t[1]),this.rightElement=$(t[2])}this.element.on(`click`,`.obj-item`,Dialog.list.item_click),this.element.on(`click`,`.otype-item`,Dialog.list.otype_click),this.element.appendTo(Dialog.contentElement.empty()),this.isShow=!0}},selected_type:0,otype_click:function(){let e=$(this).attr(`otype`),t=parseInt(e),n=Dialog.list;if(!n.stores||t===n.selected_type)return;let r=n.typeElement.children();$(r[n.selected_type]).removeClass(`select`),n.selected_type=parseInt(e),$(r[t]).addClass(`select`),SendCommand(`store `+t)},show_footer:function(e){e=this.money_name?this.gongji:e;let t=this.isstore?`store`:`sell`;if(this.isstore){var n=this.money_name?`你目前有`+e+`<hiy>`+this.money_name+`</hiy>`:`你身上有`+x.moneyToStr(e);Dialog.footerElement.html(`<div class='obj-money'>`+n+`<span cmd='`+t+` all'>存仓库</span></div>`)}else{var n=this.money_name?`你目前有`+e+`<hiy>`+this.money_name+`</hiy>`:`你身上有`+x.moneyToStr(e);Dialog.footerElement.html(`<div class='obj-money'>`+n+`<span cmd='`+t+` all'>清理杂物</span></div>`)}},update_pack:function(){var e=Dialog.pack.items;e?(this.create_items(e,this.rightElement,1,Dialog.pack.max_count),this.show_footer(Dialog.pack.money)):SendCommand(`pack`)},create_items:function(e,t,n,r){var i=[],a=e;(n===1||n===3)&&(a=Dialog.pack.sort_items(e));for(var o=0;o<r;o++){var s=a[o];i.push(`<div class="obj-item`),s?(i.push(s.is_lock?` lock`:``,` grade`,s.grade),i.push(`" obj="`),i.push(s.id),i.push(`" otype="`),i.push(n),i.push(`">`),i.push(`<span class='obj-name'>`),n===1?(i.push(`<span class="grade`,s.grade,`">`),i.push(s.name),i.push(`</span>`)):i.push(s.name),i.push(`</span>`),i.push(`<span class='obj-value'>`),n==2?(i.push(`每`),i.push(s.unit),i.push(this.money_name?s.value+`<hiy>`+this.money_name+`</hiy>`:x.moneyToStr(s.value)),s.count==-1?i.push(`：大量现货`):(i.push(`：剩余`),i.push(s.count),i.push(s.unit))):n===1&&!this.isstore?s.value?(i.push(`每`),i.push(s.unit),i.push(x.moneyToStr(s.value)),i.push(`：`),i.push(s.count),i.push(s.unit)):i.push(`不可出售`):s.count>1&&(i.push(s.count),i.push(s.unit)),i.push(`</span>`)):i.push(`">`),i.push(`</div>`)}t.html(i.join(``))},item_click:function(){var e=$(this),t=e.attr(`obj`),n=e.attr(`otype`),r=Dialog.list.find_item(n,t);if(r){var i=[`<div class='item-commands'>`];Dialog.list.isstore?n==3?(i.push(`<span cmd="checkobj `+t+` from store">查看</span>`),i.push(`<span cmd="_confirm qu `+t+`">取出</span>`)):n==1&&(i.push(`<span cmd="checkobj `+t+` from item">查看</span>`),i.push(`<span cmd="_confirm store `+r.count+` `+t+`">存到仓库</span>`)):n==2?(i.push(`<span cmd="checkobj `+t+` from `+Dialog.list.seller+`">查看</span>`),r.count&&i.push(`<span cmd="_confirm buy `+r.count+` `+t+` from `+Dialog.list.seller+`">购买</span>`)):n==1&&(i.push(`<span cmd="checkobj `+t+` from item">查看</span>`),i.push(`<span cmd="_confirm sell `+r.count+` `+t+` to `+Dialog.list.seller+`">卖掉</span>`)),i.push(`</div>`),Dialog.list.element.find(`.item-commands`).remove(),e=$(i.join(``)).insertAfter(e),x.checkScroll(e)}}},Yt=`
.dialog-item {
    min-height: 8em;
}

.dialog.dialog-item-dialog>.dialog-content {
    position: relative;
}

.dialog.dialog-item-dialog {
    width: min(30rem, calc(100% - 4rem));
}

@media (max-width: 480px) {
    .dialog.dialog-item-dialog {
        width: calc(100% - 2.5rem);
    }
}

.dialog-item>.item-desc {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
}

.dialog-item-subdialog-mask {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75em;
    background-color: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}

.dialog-item-subdialog {
    width: min(26rem, 100%);
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background-color: var(--theme-panel);
    color: var(--theme-text);
    box-shadow: 0 1em 2em rgba(0, 0, 0, 0.28);
}

.dialog-item-subdialog-header {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.55em 0.7em;
    border-bottom: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.dialog-item-subdialog-title {
    flex: 1;
    color: var(--theme-accent);
    font-weight: bold;
}

.dialog-item-subdialog-close {
    flex: none;
    cursor: pointer;
    color: var(--theme-muted);
    user-select: none;
}

.dialog-item-subdialog-body {
    flex: 1 1 auto;
    min-height: 4em;
    max-height: 18em;
    margin: 0;
    padding: 0.8em;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
}

.dialog-item-subdialog-actions {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    gap: 0.25em;
    min-height: 2.5em;
    margin: 0;
    padding: 0.2em 0.4em;
    max-width: 100%;
    overflow: hidden;
    white-space: normal;
    border-top: 1px solid var(--theme-border);
    background-color: var(--theme-surface);
}

.dialog-item-subdialog-actions>span {
    flex: 0 0 auto;
    margin: 0;
    padding: 0 0.4em;
    height: 2em;
    line-height: 2em;
}

.dialog-item-actions {
    float: none;
    display: inline-flex;
    flex-wrap: wrap;
    flex: 0 0 auto;
    max-width: 100%;
    align-items: center;
    gap: 0.25em;
    justify-content: flex-end;
    margin-left: auto;
    text-align: right;
    white-space: normal;
    padding: 0;
}

.dialog-item-actions>span {
    flex: 0 0 auto;
    margin: 0;
    padding: 0 0.35em;
}

.dialog.dialog-item-dialog>.dialog-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0 0.25em;
}

@media (max-width: 480px) {
    .dialog-item-actions {
        gap: 0.2em;
    }

    .dialog-item-actions>span {
        min-width: auto;
        padding: 0 0.3em;
        font-size: 0.92em;
    }

    .dialog-item-subdialog-mask {
        padding: 0.55em;
    }

    .dialog-item-subdialog {
        width: 100%;
    }

    .dialog-item-subdialog-body {
        max-height: 15em;
    }

    .dialog-item-subdialog-actions {
        gap: 0.2em;
    }

    .dialog-item-subdialog-actions>span {
        min-width: auto;
        padding: 0 0.3em;
        font-size: 0.92em;
    }
}
`,Xt={isShow:!1,item:null,commandKeys:null,interactionCommandKeys:null,subdialogElement:null,capturePrompt:!1,capturePromptUntil:0,interactionPromptUntil:0,init:function(){Dialog.injectStyle(Yt),this.commandKeys={}},open:function(e){this.created||=(this.init(),!0),Dialog.isShow&&Dialog.curItem===`item`||Dialog.select(`item`),Dialog.element.addClass(`dialog-item-dialog`),this.item=e,this.commandKeys={},this.interactionCommandKeys={},this.closeInteractionDialog(),this.render(e),this.isShow=!0},hide:function(){this.isShow=!1,this.item=null,this.commandKeys={},this.interactionCommandKeys={},this.capturePrompt=!1,this.capturePromptUntil=0,this.interactionPromptUntil=0,this.closeInteractionDialog(),Dialog.element&&Dialog.element.removeClass(`dialog-item-dialog`)},close:function(){this.hide()},render:function(e){Dialog.title(e.name||`查看`),Dialog.icon(e.p||e.me?`user`:`info-sign`),Dialog.contentElement.html(`<div class='dialog-item'><pre class='item-desc'></pre></div>`),Dialog.contentElement.find(`.item-desc`).html(e.desc||e.name||``),this.setCommands(e.commands||[])},captureNextPrompt:function(){this.capturePrompt=!0,this.capturePromptUntil=Date.now()+3e3,this.interactionPromptUntil=0},appendPrompt:function(e){if(!e||!(Dialog.isShow&&Dialog.curItem===`item`)||!this.isShow)return!1;var t=Date.now();return!this.capturePrompt&&(!this.subdialogElement||t>this.interactionPromptUntil)?!1:this.capturePrompt&&t>this.capturePromptUntil?(this.capturePrompt=!1,this.capturePromptUntil=0,!1):this.capturePrompt&&this.isInteractionEcho(e)?!0:(this.capturePrompt=!1,this.capturePromptUntil=0,this.interactionPromptUntil=t+1500,this.subdialogElement&&this.subdialogElement.length?this.appendInteractionPrompt(e):this.openInteractionDialog(e),!0)},isInteractionEcho:function(e){if(!e)return!1;var t=e.replace(/<[^>]+>/g,``).trim();if(!t)return!0;var n=this.item&&this.item.name?this.item.name.replace(/<[^>]+>/g,``):``;return t.indexOf(`你向`)===0&&(!n||t.indexOf(n)>=0)&&(t.indexOf(`问道`)>=0||t.indexOf(`打听`)>=0||t.indexOf(`说道`)>=0)},isCapturingInteraction:function(){return!(Dialog.isShow&&Dialog.curItem===`item`)||!this.isShow?!1:this.subdialogElement&&this.subdialogElement.length?!0:this.capturePrompt?Date.now()<=this.capturePromptUntil?!0:(this.capturePrompt=!1,this.capturePromptUntil=0,!1):!1},openInteractionDialog:function(e){if(!this.subdialogElement||!this.subdialogElement.length){var t=[`<div class='dialog-item-subdialog-mask'>`,`<div class='dialog-item-subdialog'>`,`<div class='dialog-item-subdialog-header'>`,`<span class='dialog-item-subdialog-title'>提示</span>`,`<span class='dialog-item-subdialog-close'>关闭</span>`,`</div>`,`<pre class='dialog-item-subdialog-body'></pre>`,`<div class='item-commands dialog-item-subdialog-actions'></div>`,`</div>`,`</div>`];this.subdialogElement=$(t.join(``)).appendTo(Dialog.contentElement),this.subdialogElement.on(`click`,`.dialog-item-subdialog-close`,this.closeInteractionDialog.bind(this))}this.interactionCommandKeys={},this.subdialogElement.find(`.dialog-item-subdialog-body`).html(e||``),this.subdialogElement.find(`.dialog-item-subdialog-actions`).empty(),this.subdialogElement.find(`.dialog-item-subdialog-body`)[0].scrollTop=0},appendInteractionPrompt:function(e){var t=this.subdialogElement&&this.subdialogElement.find(`.dialog-item-subdialog-body`);if(!(!t||!t.length)){var n=t.html();t.html(n?n+`
`+e:e),t[0].scrollTop=t[0].scrollHeight}},closeInteractionDialog:function(){this.subdialogElement&&=(this.subdialogElement.remove(),null),this.capturePrompt=!1,this.capturePromptUntil=0,this.interactionPromptUntil=0,this.interactionCommandKeys={}},appendInteractionCommands:function(e){e&&((!this.subdialogElement||!this.subdialogElement.length)&&this.openInteractionDialog(``),this.appendCommandButtons(this.subdialogElement.find(`.dialog-item-subdialog-actions`),e,this.interactionCommandKeys))},setCommands:function(e){Dialog.footer(`<div class='item-commands dialog-item-actions'></div>`),this.appendCommands(e)},appendCommands:function(e){this.appendCommandButtons(Dialog.footerElement.find(`.dialog-item-actions`),e,this.commandKeys)},appendCommandButtons:function(e,t,n){if(t){Array.isArray(t)||(t=[t]),n||={};for(var r=[],i=0;i<t.length;i++){var a=t[i];if(!(!a||!a.cmd)&&!(this.item&&a.cmd===`look `+this.item.id)){var o=a.cmd+`\0`+(a.name||``);n[o]||(n[o]=!0,r.push(`<span cmd='`),r.push(a.cmd),r.push(`'>`),r.push(a.name||a.cmd),r.push(`</span>`))}}r.length&&e.append(r.join(``))}}},G={sell:`一键出售`,store:`一键存仓`,disassemble:`一键分解`};function Zt(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function Qt(e){return e===null?`none`:String(e)}function $t(e){return e===null?`无品质`:[`白色`,`绿色`,`蓝色`,`黄色`,`紫色`,`橙色`,`红色`][e]||`无品质`}function en(e){return e&&e.type===`follower`?`follower `+e.id:`self`}var tn={action:`sell`,items:[],categories:[],qualities:[],selectedIds:new Set,excludedIds:new Set,categoryFilters:new Set,qualityFilters:new Set,searchText:``,previewData:null,token:null,executing:!1,awaitingConfirm:!1,actionStates:null,loading:!1,pendingOpen:!1,openError:null,openTimer:null,transportTransfers:new Map,init:function(){Dialog.injectStyle(nn),this.element=$(`<div class='dialog-packmanage'></div>`),this.element.on(`click`,`.packmanage-tab`,this.onTabClick.bind(this)),this.element.on(`click`,`.packmanage-dropdown-btn`,this.onDropdownToggle.bind(this)),this.element.on(`click`,`.packmanage-dropdown-all,.packmanage-dropdown-none`,this.onDropdownFilterSet.bind(this)),this.element.on(`click`,this.onDropdownDismiss.bind(this)),this.element.on(`change`,`.packmanage-category input`,this.onCategoryChange.bind(this)),this.element.on(`change`,`.packmanage-quality input`,this.onQualityChange.bind(this)),this.element.on(`input`,`.packmanage-search`,this.onSearch.bind(this)),this.element.on(`change`,`.packmanage-item-check`,this.onItemChange.bind(this)),this.element.on(`change`,`.packmanage-item-exclude`,this.onExcludeChange.bind(this)),this.element.on(`click`,`.packmanage-select-all`,this.selectVisible.bind(this)),this.element.on(`click`,`.packmanage-clear`,this.clearSelection.bind(this)),this.element.on(`click`,`.packmanage-run-btn`,this.onRunClick.bind(this)),this.element.on(`click`,`.packmanage-refresh-btn`,this.refresh.bind(this))},requestOpen:function(e){e=e&&e.type===`follower`?{type:`follower`,id:e.id,name:e.name||`侍从`}:{type:`player`},this.created||=(this.init(),!0),this.owner=e,this.loading=!0,this.pendingOpen=!0,this.openError=null,this.previewData=null,this.token=null,this.executing=!1,this.clearTransportTransfers(),this.startOpenTimer(),this.ensureOpen(),SendCommand(`packmanage open `+en(e))},startOpenTimer:function(){this.openTimer&&clearTimeout(this.openTimer),this.openTimer=setTimeout(function(){this.pendingOpen&&(this.openTimer=null,this.clearTransportTransfers(),this.pendingOpen=!1,this.loading=!1,this.openError=`背包读取超时，请检查连接后重试。`,this.render())}.bind(this),1e4)},clearOpenTimer:function(){this.openTimer&&=(clearTimeout(this.openTimer),null)},clearTransportTransfers:function(){for(let e of this.transportTransfers.values())e.timer&&clearTimeout(e.timer);this.transportTransfers.clear()},startTransportTimer:function(e){let t=this.transportTransfers.get(e);t&&(t.timer&&clearTimeout(t.timer),t.timer=setTimeout(function(){this.onTransportError(e)}.bind(this),1e4))},removeTransport:function(e){let t=this.transportTransfers.get(e);return t&&t.timer&&clearTimeout(t.timer),this.transportTransfers.delete(e),t},onTransport:function(e){let t=String(e.transferId||``),n=parseInt(e.index),r=parseInt(e.total),i=String(e.targetPhase||``),a=e.action===null||e.action===void 0?null:String(e.action);if(!/^[a-f0-9]{16}$/.test(t)||!(r>0&&r<=256)||!(n>=0&&n<r)||typeof e.payload!=`string`||![`open`,`preview`,`result`,`error`].includes(i))return this.onTransportError(null,i,a);let o=Date.now();for(let[e,t]of this.transportTransfers)o-t.createdAt>3e4&&this.onTransportError(e);let s=this.transportTransfers.get(t);if(s||(s={createdAt:o,total:r,targetPhase:i,action:a,parts:Array(r),received:0,timer:null},this.transportTransfers.set(t,s)),s.total!==r||s.targetPhase!==i||s.action!==a)return this.onTransportError(t);if(s.parts[n]===void 0&&(s.parts[n]=e.payload,s.received++),this.startTransportTimer(t),this.pendingOpen&&this.startOpenTimer(),s.received===s.total){this.removeTransport(t);try{let e=atob(s.parts.join(``)),t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);let n=JSON.parse(new TextDecoder().decode(t));if(!n||n.dialog!==`packmanage`||n.phase===`transport`)return this.onTransportError();this.onData(n)}catch{this.onTransportError()}}},onTransportError:function(e,t,n){let r=e?this.removeTransport(e):null;if(t=r?r.targetPhase:t,n=r?r.action:n,this.pendingOpen||t===`open`){this.clearOpenTimer(),this.pendingOpen=!1,this.loading=!1,this.openError=`背包数据传输失败，请重试。`,this.render();return}let i={error:`整理数据传输失败，请重新操作。`};this.updateActionResponse(n,i,null),this.isShow&&this.render(),ReceiveMessage(`<red>`+i.error+`</red>`)},ensureOpen:function(){(!Dialog.isShow||Dialog.curItem!==`packmanage`)&&Dialog.select(`packmanage`),this.show()},show:function(){Dialog.isShow||Dialog.init(),Dialog.element.addClass(`dialog-packmanage-dialog`),this.element.detach(),Dialog.contentElement.empty().append(this.element),Dialog.footer(``),Dialog.icon(`tasks`),this.isShow=!0,this.render()},hide:function(){Dialog.element&&Dialog.element.removeClass(`dialog-packmanage-dialog`),this.element&&this.element.detach(),this.isShow=!1},close:function(){this.hide()},onData:function(e){if(e.phase===`transport`)return this.onTransport(e);if(e.phase===`error`){let t={error:e.message||`整理失败。`};if(this.pendingOpen){this.clearOpenTimer(),this.loading=!1,this.pendingOpen=!1,this.openError=t.error,this.previewData=null,this.token=null,this.executing=!1,this.ensureOpen();return}if(e.action&&e.action!==this.action){this.updateActionResponse(e.action,t,null),ReceiveMessage(`<red>`+t.error+`</red>`);return}this.previewData=t,this.token=null,this.executing=!1,this.saveActionState(),this.isShow?this.render():ReceiveMessage(`<red>`+t.error+`</red>`);return}if(e.phase===`open`){this.clearOpenTimer(),this.loading=!1,this.pendingOpen=!1,this.openError=null,this.owner=e.owner,this.items=e.items||[],this.categories=e.categories||[],this.qualities=e.qualities||[],this.storage=e.storage,this.action=`sell`,this.resetActionStates(),this.restoreActionState(this.action),this.applySnapshot(e.snapshot),this.ensureOpen();return}if(e.phase===`preview`){this.updateActionResponse(e.action,e,e.token),this.ensureOpen(),this.updateSelectionSummary(),this.awaitingConfirm&&e.token&&(!e.action||e.action===this.action)&&(this.awaitingConfirm=!1,this.showConfirmDialog());return}if(e.phase===`result`){this.applySnapshot(e.snapshot);let t=new Set((e.succeeded||[]).map(function(e){return e.id}));if(this.items=this.items.filter(function(e){return!t.has(e.id)}),this.removeIdsFromActionStates(t),this.updateActionResponse(e.action,e,null),this.storage=e.storage,this.ensureOpen(),e.action&&e.action!==this.action)return;this.showResultDialog(e)}},createActionState:function(){return{selectedIds:new Set,excludedIds:new Set,categoryFilters:new Set,qualityFilters:new Set,searchText:``,previewData:null,token:null,executing:!1}},resetActionStates:function(){this.actionStates={};for(let e of Object.keys(G))this.actionStates[e]=this.createActionState()},saveActionState:function(){this.actionStates||this.resetActionStates(),this.actionStates[this.action]={selectedIds:new Set(this.selectedIds),excludedIds:new Set(this.excludedIds),categoryFilters:new Set(this.categoryFilters),qualityFilters:new Set(this.qualityFilters),searchText:this.searchText,previewData:this.previewData,token:this.token,executing:this.executing}},restoreActionState:function(e){this.actionStates||this.resetActionStates();let t=this.actionStates[e]||this.createActionState();this.actionStates[e]=t,this.selectedIds=new Set(t.selectedIds),this.excludedIds=new Set(t.excludedIds),this.categoryFilters=new Set(t.categoryFilters),this.qualityFilters=new Set(t.qualityFilters),this.searchText=t.searchText||``,this.previewData=t.previewData,this.token=t.token,this.executing=!!t.executing},updateActionResponse:function(e,t,n){if(e=G[e]?e:this.action,e===this.action){this.previewData=t,this.token=n,this.executing=!1,this.saveActionState();return}this.actionStates||this.resetActionStates();let r=this.actionStates[e]||this.createActionState();r.previewData=t,r.token=n,r.executing=!1,this.actionStates[e]=r},removeIdsFromActionStates:function(e){if(!(!e||!e.size)){for(let t of e)this.selectedIds.delete(t),this.excludedIds.delete(t);if(this.actionStates)for(let t of Object.keys(this.actionStates)){let n=this.actionStates[t];for(let t of e)n.selectedIds.delete(t),n.excludedIds.delete(t)}}},applySnapshot:function(e){if(!e||!e.owner)return;let t=e.owner.type===`follower`?Dialog.pack2:Dialog.pack;t.items=e.items||[],t.eqs=e.equipment||[],t.money=e.money||0,t.max_count=e.capacity?e.capacity.max:t.max_count,e.owner.type===`follower`&&(t.id=e.owner.id,t.target_name=e.owner.name,t.command_before=`dc `+e.owner.id+` `)},onTabClick:function(e){let t=$(e.currentTarget).attr(`data-action`);!G[t]||t===this.action||(this.saveActionState(),this.action=t,this.restoreActionState(t),this.render())},onCategoryChange:function(e){let t=$(e.currentTarget),n=t.val();t.prop(`checked`)?this.categoryFilters.add(n):this.categoryFilters.delete(n),this.refreshFilterViews()},onQualityChange:function(e){let t=$(e.currentTarget),n=t.val();t.prop(`checked`)?this.qualityFilters.add(n):this.qualityFilters.delete(n),this.refreshFilterViews()},onSearch:function(e){this.searchText=String($(e.currentTarget).val()||``).trim().toLowerCase(),this.invalidatePreview()},onItemChange:function(e){let t=$(e.currentTarget),n=t.val();t.prop(`checked`)?(this.selectedIds.add(n),this.excludedIds.delete(n),t.closest(`.packmanage-item`).find(`.packmanage-item-exclude`).prop(`checked`,!1)):this.selectedIds.delete(n),this.previewData=null,this.token=null,this.updateSelectionSummary()},onExcludeChange:function(e){let t=$(e.currentTarget),n=t.val();t.prop(`checked`)?(this.excludedIds.add(n),this.selectedIds.delete(n),t.closest(`.packmanage-item`).find(`.packmanage-item-check`).prop(`checked`,!1)):this.excludedIds.delete(n),this.previewData=null,this.token=null,this.updateSelectionSummary()},invalidatePreview:function(){this.previewData=null,this.token=null,this.render()},filterSummary:function(e,t,n){if(!t.size||t.size>=e.length)return`全部`;let r=[];for(let i of e){let e=n?Qt(i.id):String(i.id);if(t.has(e)&&r.push(i.name),r.length>=2)break}let i=r.join(`、`);return t.size>2?i+` 等`+t.size+`项`:i},refreshFilterViews:function(){this.previewData=null,this.token=null,this.element.find(`.packmanage-item-list`).html(this.renderItems()),this.updateSelectionSummary();let e=this.element.find(`.packmanage-dropdown[data-filter='category'] .packmanage-dropdown-summary`);e.length&&e.text(this.filterSummary(this.categories,this.categoryFilters));let t=this.element.find(`.packmanage-dropdown[data-filter='quality'] .packmanage-dropdown-summary`);t.length&&t.text(this.filterSummary(this.qualities,this.qualityFilters,!0))},onDropdownToggle:function(e){let t=$(e.currentTarget).closest(`.packmanage-dropdown`),n=t.hasClass(`open`);return this.element.find(`.packmanage-dropdown`).removeClass(`open`),n||t.addClass(`open`),!1},onDropdownFilterSet:function(e){let t=$(e.currentTarget),n=t.closest(`.packmanage-dropdown`),r=t.hasClass(`packmanage-dropdown-all`);if(n.data(`filter`)===`category`){if(this.categoryFilters.clear(),r)for(let e of this.categories)this.categoryFilters.add(String(e.id))}else if(this.qualityFilters.clear(),r)for(let e of this.qualities)this.qualityFilters.add(Qt(e.id));return this.refreshFilterViews(),!1},onDropdownDismiss:function(e){$(e.target).closest(`.packmanage-dropdown`).length||this.element.find(`.packmanage-dropdown`).removeClass(`open`)},filteredItems:function(){let e=this.categoryFilters,t=this.qualityFilters,n=this.searchText;return this.items.filter(function(r){return!(e.size&&!e.has(r.category)||t.size&&!t.has(Qt(r.quality))||n&&String(r.plainName||r.name||``).toLowerCase().indexOf(n)===-1)})},selectVisible:function(){for(let e of this.filteredItems()){let t=e.actions&&e.actions[this.action];t&&t.allowed&&!this.excludedIds.has(e.id)&&this.selectedIds.add(e.id)}this.previewData=null,this.token=null,this.render()},clearSelection:function(){this.selectedIds=new Set,this.excludedIds=new Set,this.previewData=null,this.token=null,this.render()},requestPreview:function(){if(!this.selectedIds.size){ReceiveMessage(`<yel>请先选择需要整理的物品。</yel>`);return}let e={version:1,action:this.action,owner:this.owner&&this.owner.type===`follower`?{type:`follower`,id:this.owner.id}:{type:`player`},categories:[],qualities:[],includeIds:Array.from(this.selectedIds),excludeIds:Array.from(this.excludedIds)};this.previewData={loading:!0},this.token=null,this.updateSelectionSummary();let t=this.element.find(`.packmanage-run-btn`);t.length&&t.prop(`disabled`,!0).html(`<span class='glyphicon glyphicon-refresh'></span> 正在校验...`),SendCommand(`packmanage preview `+JSON.stringify(e))},onRunClick:function(e){if(e&&(e.preventDefault(),e.stopPropagation()),!this.executing){if(!this.selectedIds.size){ReceiveMessage(`<yel>请先选择需要整理的物品。</yel>`);return}if(this.token&&this.previewData&&this.previewData.phase===`preview`){this.showConfirmDialog();return}this.awaitingConfirm=!0,this.requestPreview()}},renderSummaryHtml:function(e,t){e||={};let n=[];if(t?n.push(`<div class='packmanage-result-ok'><span class='glyphicon glyphicon-ok-circle'></span> 成功处理 `,e.succeeded||0,` 项</div>`):n.push(`<div class='packmanage-summary-row'><span>物品种类</span><strong>`,e.itemKinds||0,`</strong></div>`,`<div class='packmanage-summary-row'><span>物品数量</span><strong>`,e.itemCount||0,`</strong></div>`),this.action===`sell`?n.push(`<div class='packmanage-summary-row'><span>`,t?`实际获得`:`预计获得`,`</span><strong>`,x.moneyToStr(e.money||0),`</strong></div>`):this.action===`store`?n.push(`<div class='packmanage-summary-row'><span>`,`新增仓库格`,`</span><strong>`,e.requiredSlots||0,`</strong></div>`,`<div class='packmanage-summary-row'><span>合并物品数</span><strong>`,e.mergedCount||0,`</strong></div>`,`<div class='packmanage-summary-row'><span>执行后剩余</span><strong>`,e.storageRemaining||0,` 格</strong></div>`):t||n.push(this.renderOutputs(e.outputs||[])),e.highRiskCount>0&&n.push(`<div class='packmanage-danger'>包含 `,e.highRiskCount,` 件紫色及以上高品质物品</div>`),!t&&this.previewData&&this.previewData.skipped&&this.previewData.skipped.length){n.push(`<details class='packmanage-skipped'><summary>跳过 `,this.previewData.skipped.length,` 项</summary>`);for(let e of this.previewData.skipped)n.push(`<div>`,e.name||e.id,`：`,Zt(e.message),`</div>`);n.push(`</details>`)}return n.join(``)},showConfirmDialog:function(){if(!this.token||!this.previewData||this.previewData.phase!==`preview`)return;let e=this.previewData.summary||{},t=e.highRiskCount||0,n=$(`<div class='packmanage-confirm'></div>`);n.append(`<div>确认执行`+G[this.action]+`？</div>`),n.append($(this.renderSummaryHtml(e,!1))),t>0&&n.append(`<div class='packmanage-danger'>其中包含 `+t+` 件紫色及以上高品质物品，请确认无误。</div>`);let r=this.token,i=function(){this.executing=!0,this.token=null,this.awaitingConfirm=!1,this.render(),this.saveActionState(),SendCommand(`packmanage execute `+r)}.bind(this),a=function(){let t=(e.highRiskItems||[]).filter(function(e){return e.grade>=5}),n=$(`<div class='packmanage-confirm'></div>`);if(n.append(`<div class='packmanage-danger'>橙色或红色装备分解后无法撤回，请再次确认。</div>`),t.length){let e=$(`<div class='packmanage-critical-list'></div>`);for(let n of t)e.append($(`<div></div>`).html(n.name));n.append(e)}Confirm.Show({content:n,btn_text:`再次确认分解`,onOK:i})};Confirm.Show({content:n,btn_text:`确认执行`,onOK:function(){if(this.action===`disassemble`&&e.criticalRiskCount>0){setTimeout(a,0);return}i()}.bind(this)})},showResultDialog:function(e){let t=e.summary||{},n=$(`<div class='packmanage-confirm'></div>`);n.append($(this.renderSummaryHtml(t,!0))),t.failed&&t.failed.length&&n.append(`<div class='packmanage-danger'>有 `+t.failed.length+` 项处理失败</div>`),Confirm.Show({content:n,btn_text:`知道了`})},refresh:function(){this.owner&&this.requestOpen(this.owner)},updateSelectionSummary:function(){if(!this.element)return;this.element.find(`.packmanage-selected-count`).text(`已选择 `+this.selectedIds.size+` 项，排除 `+this.excludedIds.size+` 项`);let e=this.element.find(`.packmanage-run-btn`);if(e.length){let t=this.previewData&&this.previewData.loading;e.prop(`disabled`,!this.selectedIds.size||this.executing||t),this.executing||e.html(t?`<span class='glyphicon glyphicon-refresh'></span> 正在校验...`:`<span class='glyphicon glyphicon-ok'></span> `+G[this.action])}},render:function(){if(!this.element)return;let e=this.owner&&this.owner.type===`follower`?this.owner.name:`你`;if(Dialog.title(`整理`+e+`的背包`),this.loading){this.element.html(`<div class='packmanage-loading'><span class='glyphicon glyphicon-refresh'></span> 正在读取背包...</div>`);return}if(this.openError){this.element.html(`<div class='packmanage-open-error'><div>`+Zt(this.openError)+`</div><button type='button' class='packmanage-refresh-btn'><span class='glyphicon glyphicon-repeat'></span> 重试</button></div>`);return}let t=[];t.push(`<div class='packmanage-tabs'>`);for(let e of Object.keys(G))t.push(`<button type='button' class='packmanage-tab`,e===this.action?` active`:``,`' data-action='`,e,`'>`,G[e],`</button>`);t.push(`</div><div class='packmanage-body'>`),t.push(`<section class='packmanage-items-panel'><div class='packmanage-toolbar'>`,`<div class='packmanage-search-wrap'><span class='glyphicon glyphicon-search'></span>`,`<input class='packmanage-search' type='search' placeholder='搜索背包物品' value='`,Zt(this.searchText),`'></div>`,`<div class='packmanage-dropdown' data-filter='category'><button type='button' class='packmanage-dropdown-btn'>`,`<span class='glyphicon glyphicon-filter'></span> 分类：<span class='packmanage-dropdown-summary'>`,this.filterSummary(this.categories,this.categoryFilters),`</span><span class='caret'></span></button>`,`<div class='packmanage-dropdown-panel'>`);for(let e of this.categories)t.push(`<label class='packmanage-category'><input type='checkbox' value='`,e.id,`'`,this.categoryFilters.has(e.id)?` checked`:``,`><span>`,e.name,`</span></label>`);t.push(`<div class='packmanage-dropdown-foot'>`,`<button type='button' class='packmanage-dropdown-all'>全选</button>`,`<button type='button' class='packmanage-dropdown-none'>不限</button></div></div></div>`),t.push(`<div class='packmanage-dropdown' data-filter='quality'><button type='button' class='packmanage-dropdown-btn'>`,`<span class='glyphicon glyphicon-filter'></span> 品质：<span class='packmanage-dropdown-summary'>`,this.filterSummary(this.qualities,this.qualityFilters,!0),`</span><span class='caret'></span></button>`,`<div class='packmanage-dropdown-panel'>`);for(let e of this.qualities){let n=Qt(e.id);t.push(`<label class='packmanage-quality grade`,e.id===null?`-none`:e.id,`'><input type='checkbox' value='`,n,`'`,this.qualityFilters.has(n)?` checked`:``,`><span>`,e.name,`</span></label>`)}t.push(`<div class='packmanage-dropdown-foot'>`,`<button type='button' class='packmanage-dropdown-all'>全选</button>`,`<button type='button' class='packmanage-dropdown-none'>不限</button></div></div></div>`),t.push(`<button type='button' class='packmanage-select-all'><span class='glyphicon glyphicon-check'></span> 全选当前</button>`,`<button type='button' class='packmanage-clear'><span class='glyphicon glyphicon-unchecked'></span> 清空</button></div>`),t.push(`<div class='packmanage-item-list'>`,this.renderItems(),`</div></section></div>`),t.push(`<div class='packmanage-actions'><span class='packmanage-selected-count'>已选择 `,this.selectedIds.size,` 项，排除 `,this.excludedIds.size,` 项</span><button type='button' class='packmanage-refresh-btn'><span class='glyphicon glyphicon-refresh'></span> 刷新</button>`,`<button type='button' class='packmanage-run-btn'`,this.selectedIds.size&&!this.executing?``:` disabled`,`><span class='glyphicon glyphicon-ok'></span> `,this.executing?`正在执行...`:G[this.action],`</button></div>`),this.element.html(t.join(``))},renderItems:function(){let e=this.filteredItems();if(!e.length)return`<div class='packmanage-empty'>没有符合当前筛选条件的物品</div>`;let t=[];for(let n of e){let e=n.actions&&n.actions[this.action],r=e&&e.allowed;t.push(`<div class='packmanage-item`,r?``:` disabled`,` grade`,n.grade,`'>`,`<label class='packmanage-item-select'><input class='packmanage-item-check' type='checkbox' value='`,n.id,`'`,this.selectedIds.has(n.id)?` checked`:``,r?``:` disabled`,`>`,`<span class='packmanage-item-main'><span class='packmanage-item-name'>`,n.name,`</span><span class='packmanage-item-meta'>`,n.categoryName,` · `,$t(n.quality),n.count>1?` · `+n.count+Zt(n.unit):``,`</span></span></label>`),r?t.push(`<label class='packmanage-item-exclude-label'><input class='packmanage-item-exclude' type='checkbox' value='`,n.id,`'`,this.excludedIds.has(n.id)?` checked`:``,`><span>排除</span></label>`):t.push(`<span class='packmanage-item-reason'>`,Zt(e?e.message:`当前不可操作`),`</span>`),t.push(`</div>`)}return t.join(``)},renderOutputs:function(e){let t=[`<div class='packmanage-output-title'>预计产物</div>`];if(!e.length)return t.concat(`<div class='packmanage-preview-empty'>无可预览产物</div>`).join(``);for(let n of e)t.push(`<div class='packmanage-output grade`,n.grade||0,`'><span>`,n.name,`</span><strong>`,n.count,n.unit||`个`,`</strong></div>`);return t.join(``)}},nn=`

.dialog.dialog-packmanage-dialog {
    width: min(46rem, calc(100% - 1rem));
    height: min(38rem, calc(100% - 1rem));
    max-height: calc(100% - 1rem);
}

.dialog.dialog-packmanage-dialog>.dialog-content {
    overflow: hidden;
}

.dialog-packmanage {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    color: var(--theme-text);
}

.packmanage-loading,
.packmanage-open-error {
    min-height: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    color: var(--theme-muted);
    text-align: center;
}

.packmanage-loading .glyphicon {
    animation: packmanage-spin 1s linear infinite;
}

.packmanage-open-error button {
    border: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
    color: var(--theme-text);
    padding: 7px 14px;
}

@keyframes packmanage-spin {
    to { transform: rotate(360deg); }
}

.packmanage-tabs {
    flex: 0 0 2.6rem;
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
}

.packmanage-tab {
    min-width: 6rem;
    padding: 0 0.8rem;
    border: 0;
    border-right: 1px solid var(--theme-border);
    border-radius: 0;
    background: transparent;
    color: var(--theme-muted);
    cursor: pointer;
}

.packmanage-tab.active {
    background: var(--theme-active);
    color: var(--theme-button-text);
}

.packmanage-body {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(16rem, 1fr);
    overflow: hidden;
}

.packmanage-output-title {
    margin-bottom: 0.45rem;
    color: var(--theme-accent);
    font-weight: bold;
}

.packmanage-category,
.packmanage-quality {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 1.8rem;
    cursor: pointer;
}

.packmanage-category input,
.packmanage-quality input,
.packmanage-item-check,
.packmanage-item-exclude {
    flex: 0 0 auto;
    margin: 0;
}

.packmanage-items-panel {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.packmanage-toolbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem;
    border-bottom: 1px solid var(--theme-border);
    flex-wrap: wrap;
    position: relative;
    z-index: 4;
}

.packmanage-dropdown {
    position: relative;
    flex: 0 0 auto;
}

.packmanage-dropdown-btn {
    min-height: 2rem;
    padding: 0 0.55rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-surface-2);
    color: var(--theme-text);
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    max-width: 11rem;
}

.packmanage-dropdown-btn>.packmanage-dropdown-summary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.packmanage-dropdown-btn>.caret {
    width: 0;
    height: 0;
    border-left: 0.25rem solid transparent;
    border-right: 0.25rem solid transparent;
    border-top: 0.3rem solid currentColor;
    flex: 0 0 auto;
}

.packmanage-dropdown-panel {
    display: none;
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    min-width: 9rem;
    max-height: 16rem;
    overflow-y: auto;
    padding: 0.45rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-panel);
    box-shadow: 0 0.5em 1.4em rgba(36, 31, 24, 0.22);
    box-sizing: border-box;
    z-index: 30;
}

.packmanage-dropdown.open>.packmanage-dropdown-panel {
    display: block;
}

.packmanage-dropdown-foot {
    display: flex;
    gap: 0.35rem;
    margin-top: 0.35rem;
    padding-top: 0.35rem;
    border-top: 1px solid var(--theme-border);
}

.packmanage-dropdown-foot button {
    flex: 1 1 auto;
    min-height: 1.8rem;
    padding: 0 0.45rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-surface-2);
    color: var(--theme-text);
    cursor: pointer;
    white-space: nowrap;
}

.packmanage-search-wrap {
    flex: 1 1 auto;
    min-width: 7rem;
    height: 2rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0 0.55rem;
    border: 1px solid var(--theme-border);
    background: var(--theme-panel);
    box-sizing: border-box;
}

.packmanage-search {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--theme-text);
}

.packmanage-toolbar button,
.packmanage-actions button,
.packmanage-execute-btn,
.packmanage-refresh-btn.result {
    min-height: 2rem;
    padding: 0 0.65rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-surface-2);
    color: var(--theme-text);
    cursor: pointer;
    white-space: nowrap;
}

.packmanage-item-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 0.45rem;
}

.packmanage-item {
    min-height: 3rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 0.55rem;
    margin-bottom: 0.35rem;
    border: 1px solid var(--theme-border);
    border-radius: var(--popup-radius, 4px);
    background: var(--theme-panel);
    box-sizing: border-box;
    cursor: pointer;
}

.packmanage-item-select {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    cursor: pointer;
}

.packmanage-item.disabled {
    cursor: not-allowed;
    opacity: 0.62;
}

.packmanage-item.disabled .packmanage-item-select {
    cursor: not-allowed;
}

.packmanage-item-exclude-label {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--theme-muted);
    cursor: pointer;
    white-space: nowrap;
}

.packmanage-item-main {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.18rem;
}

.packmanage-item-name,
.packmanage-item-meta,
.packmanage-item-reason {
    overflow-wrap: anywhere;
}

.packmanage-item-meta,
.packmanage-item-reason,
.packmanage-preview-empty {
    color: var(--theme-muted);
    font-size: 0.9em;
}

.packmanage-item-reason {
    flex: 0 0 8rem;
    text-align: right;
}

.packmanage-summary-row,
.packmanage-output {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--theme-border);
}

.packmanage-danger,
.packmanage-error {
    margin-top: 0.65rem;
    padding: 0.55rem;
    border: 1px solid var(--theme-grade-5);
    color: var(--theme-grade-5);
    background: var(--theme-panel);
}

.packmanage-skipped {
    margin-top: 0.65rem;
    color: var(--theme-muted);
}

.packmanage-failed {
    margin-top: 0.65rem;
    color: var(--theme-grade-5);
}

.packmanage-skipped div,
.packmanage-failed div,
.packmanage-critical-list div {
    padding: 0.25rem 0;
    overflow-wrap: anywhere;
}

.packmanage-execute-btn,
.packmanage-refresh-btn.result {
    width: 100%;
    margin-top: 0.8rem;
    color: var(--theme-button-text);
    background: var(--theme-active);
}

.packmanage-result-ok {
    margin-bottom: 0.65rem;
    color: var(--theme-grade-1);
}

.packmanage-actions {
    flex: 0 0 2.8rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.45rem;
    padding: 0 0.55rem;
    border-top: 1px solid var(--theme-border);
    background: var(--theme-surface-2);
}

.packmanage-selected-count {
    margin-right: auto;
    color: var(--theme-muted);
}

.packmanage-actions button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.packmanage-empty {
    padding: 2rem 0.8rem;
    text-align: center;
    color: var(--theme-muted);
}

@media (max-width: 640px) {
    .dialog.dialog-packmanage-dialog {
        width: calc(100% - 0.5rem);
        height: calc(100% - 0.5rem);
        max-height: calc(100% - 0.5rem);
    }

    .packmanage-items-panel {
        overflow: visible;
    }

    .packmanage-toolbar {
        flex-wrap: wrap;
    }

    .packmanage-search-wrap {
        flex-basis: 100%;
    }

    .packmanage-item-reason {
        flex-basis: 6.5rem;
    }

    .packmanage-actions {
        flex-wrap: wrap;
        min-height: 3.2rem;
        height: auto;
        padding: 0.35rem;
    }
}
`,rn=`
.dialog,
.dialog>.dialog-content {
    background-color: var(--theme-bg) !important;
    color: var(--theme-text) !important;
}

	.dialog>.dialog-header,
	.dialog>.dialog-footer {
	    background-color: var(--theme-surface-2) !important;
	    color: var(--theme-text) !important;
	    border-color: var(--theme-border) !important;
	}

	.dialog,
	.dialog-confirm,
	.warn-dialog,
	.dialog-content .obj-desc-panel,
	.dialog-content .jh-skill-detail {
	    border-radius: var(--popup-radius, 4px) !important;
	}

.dialog>.dialog-header>.dialog-title,
.dialog>.dialog-header>.dialog-icon,
.dialog-content .event-item h3,
.dialog-content .shop-item-title>.shop-item-name,
.dialog-content .dialog-message>.message-list>.message-item>.message-title,
.dialog-content .dialog-team>.team-item>.team-flag,
.dialog-content .detail-item>.detail-name,
.dialog-content .dialog-party>.party-notice,
.dialog-content .dialog-shop-footer>span {
    color: var(--theme-accent) !important;
}

.dialog>.dialog-header>.dialog-close,
.dialog>.dialog-footer>.footer-item,
.dialog>.dialog-footer>.trade_btn,
.dialog-content .empty,
.dialog-content .eq-list>.empty,
.dialog-content .dialog-message>.message-list>.empty,
.dialog-content .dialog-team>.empty,
.dialog-content .dialog-pms>.empty,
.dialog-content .detail-item>.detail-time,
.dialog-content .dialog-pms>.pm-item>.pm-mem,
.dialog-content .fb-actions>.fb-action>.action-desc,
.dialog-content .dialog-tasks>.task-item>.start,
.dialog-content .dialog-tasks>.none>.task-btn,
.dialog-content .obj-item>.obj-oper,
.dialog-content mem {
    color: var(--theme-muted) !important;
    border-color: var(--theme-border) !important;
}

.dialog-content .eq-list>.eq-item,
.dialog-content .obj-list>.obj-item,
.dialog-content .trade-list>.obj-item,
.dialog-content .dialog-list>.otype-list>.otype-item,
.dialog-content .dialog-skills>.skill-item,
.dialog-content .dialog-skills>.book-item,
.dialog-content .dialog-tasks>.task-item,
.dialog-content .dialog-events>.event-item,
.dialog-content .dialog-pms>.pm-item,
.dialog-content .stats-container-left>.stats-silder,
.dialog-content .dialog-stats>.top-item,
.dialog-content .fb-actions>.fb-action,
.dialog-content .dialog-fb>.fb-left>.fb-content>.fb-item,
.dialog-content .dialog-fb>.fb-left>.fam-item,
.dialog-content .dialog-shop>.shop-item,
.dialog-content .dialog-message>.message-list>.message-item,
.dialog-content .dialog-team>.team-item,
.dialog-content .dialog-relation>.relation-item,
.dialog-content .detail-item,
.dialog-content .dialog-party>.party-roles>.party-role,
.dialog-content .dialog-party>.party-item,
.dialog-content .dialog-score>.score-section,
.dialog-content .dialog-titles>.title-item {
    background-color: var(--theme-panel) !important;
    color: var(--theme-text) !important;
    border-color: var(--theme-border) !important;
}

.dialog>.dialog-footer>.eq-group,
.dialog>.dialog-footer>.sk-group,
.dialog-content .eq-list>.eq-item>.eq-type,
.dialog-content .obj-item>.obj-oper,
.dialog-content .dialog-skills>.book-item>.book-action,
.dialog-content .fb-actions>.fb-action>.action-name,
.dialog-content .dialog-relation>.relation-item>.relation-cmd,
.dialog-content .detail-item>.detail-rec,
.dialog-content .dialog-party>.party-item>.party-item-cmd,
.dialog-content .dialog-shop>.shop-item>.shop-btn {
    background-color: var(--theme-surface) !important;
    color: var(--theme-muted) !important;
    border-color: var(--theme-border) !important;
}

.dialog-content .dialog-party>.dialog-party-add>input {
    background-color: var(--theme-panel) !important;
    color: var(--theme-text) !important;
    border-color: var(--theme-border) !important;
}

.dialog-content .dialog-fb>.fb-left>.fb-content>.line {
    border-left-color: var(--theme-border) !important;
}

.dialog-content .dialog-fb>.fb-left>.fb-content>.lock {
    color: var(--theme-muted) !important;
    border-color: var(--theme-border) !important;
}

.dialog>.dialog-footer>.select,
.dialog-content .dialog-list>.otype-list>.select,
.dialog-content .stats-container-left>.select,
.dialog-content .dialog-pms>.selected {
    background-color: var(--theme-accent) !important;
    color: var(--theme-button-text) !important;
    border-color: var(--theme-accent) !important;
}

.dialog-content .cleanup>.obj-item>.selected,
.dialog-content .dialog-tasks>.finish,
.dialog-content .dialog-tasks>.finish>.task-btn,
.dialog-content .dialog-tasks>.task-item>.finish,
.dialog-content .fb-actions>.finshed,
.dialog-content .fb-actions>.finshed>.action-desc,
.dialog-content .dialog-fb>.fb-left>.fb-content .selected,
.dialog-content .dialog-fb>.fb-left>.selected,
.dialog-content .dialog-titles>.selected {
    background-color: var(--theme-surface) !important;
    color: var(--theme-accent) !important;
    border-color: var(--theme-accent) !important;
}

.dialog-content .dialog-tasks>.over,
.dialog-content .dialog-tasks>.over>.task-btn,
.dialog-content .dialog-tasks>.task-item>.over,
.dialog-content .dialog-pms>.pm-item>.pm-add {
    color: var(--theme-active) !important;
    border-color: var(--theme-active) !important;
}

.dialog-content .task-item>.task-btn:hover,
.dialog-content .dialog-pms>.pm-item>.pm-add:hover,
.dialog-content .fb-actions>.fb-action>.action-name:hover {
    background-color: var(--theme-surface-2) !important;
    color: var(--theme-text) !important;
}

.dialog-content .shop-item-title>.discount-tag,
.dialog-content .dialog-shop>.shop-item .shop-label {
    background: var(--theme-active) !important;
    color: var(--theme-button-text) !important;
    box-shadow: none !important;
    text-shadow: none !important;
}

.dialog-content .dialog-score2 .value,
.dialog-content .dialog-titles>.title-item>.btn-noused {
    background-color: var(--theme-surface) !important;
    color: var(--theme-accent) !important;
    border-color: var(--theme-border) !important;
}
`,K={isShow:!1,curItem:null,score:be,map:xe,keys:Ce,setting:Xe,extend:nt,channel:rt,pack:at,skills:ct,tasks:mt,shop:ht,message:wt,stats:Dt,jh:Pt,relation:It,team:Lt,party:zt,trade:Bt,events:Ht,pm:Gt,pack2:Kt,master:qt,list:Jt,item:Xt,packmanage:tn,themeStyleElement:null,show:function(e,t){if(!e)return;let n=this[e];if(!n)throw Error(`没有`+e);if(n.created||=(n.init(),!0),t)n.onData(t);else{if(this.isShow&&e==this.curItem)return this.hide();this.curItem&&e!=this.curItem&&(K[K.curItem].close&&K[K.curItem].close(),K[K.curItem].isShow=!1,K.contentElement.empty()),this.init(),this.curItem=e,n.show(t),Process.message.scroll2end()}},select:function(e){if(this.isShow&&e==this.curItem)return this.hide();this.curItem&&e!=this.curItem&&(K[K.curItem].close&&K[K.curItem].close(),K[K.curItem].isShow=!1,K.contentElement.empty()),this.init(),this.curItem=e},init:function(){this.isShow||=(this.isInit||=(this.contentElement=$(`.dialog>.dialog-content`),this.titleElement=$(`.dialog>.dialog-header>.dialog-title`),this.iconElement=$(`.dialog>.dialog-header>.dialog-icon`),this.footerElement=$(`.dialog>.dialog-footer`).on(`click`,`.footer-item`,K.footerClick),this.hiddenElement=$(`.hidden-item`),this.element=$(`.dialog`),$(`.dialog>.dialog-header>.dialog-close`).on(`click`,K.hide),!0),$(`.container`).addClass(`dialog-open`),$(`.content-room`).removeClass(`hide`),this.element.removeClass(`hide`),!0)},hide:function(){K[K.curItem].hide&&K[K.curItem].hide()==0||K.close()},footerClick:function(){var e=$(this);if(!e.is(`.select`)){var t=e.attr(`for`);e.parent().find(`.footer-item.select`).removeClass(`select`),e.addClass(`select`),K[K.curItem].footerChanged(t,e)}},title:function(e){K.titleElement.html(e)},icon:function(e){this.iconElement.attr(`class`,`dialog-icon glyphicon glyphicon-`+e)},footer:function(e){e?this.footerElement.html(e):this.footerElement.empty()},close:function(){K.isShow&&(K.isShow=!1,$(`.container`).removeClass(`dialog-open`),$(`.content-room`).removeClass(`hide`),K.element.addClass(`hide`),globalThis.CmdPrompt&&globalThis.CmdPrompt.Close())},injectStyle:function(e){let t=document.createElement(`style`);t.textContent=e,document.head.append(t),this.refreshThemeStyle()},refreshThemeStyle:function(){this.themeStyleElement?this.themeStyleElement.remove():(this.themeStyleElement=document.createElement(`style`),this.themeStyleElement.id=`dialog-theme-overrides`,this.themeStyleElement.textContent=rn),document.head.append(this.themeStyleElement)}},an={size:3,max:666,container:null,pages:null,count:0,allow_scroll:!0,create:function(e,t=3,n=666){let r=Object.create(this);return r.container=e,r.pages=[],r.size=t,r.max=n,x.isMobile?e.on(`touchend`,this.stopDrag.bind(r)):e.on(`wheel`,this.stopDrag.bind(r)),r.scroll_button=$(`<div class="scroll-flag" style="display:none;"><span class="glyphicon glyphicon-chevron-down"></span></div>`),r.scroll_button.appendTo(e),r.scroll_button.on(`pointerup`,r.start_move.bind(r)),r},stopDrag:function(e){let t=this.is_end();t!==this.allow_scroll&&(this.allow_scroll=t,t&&this.scroll_button.hide())},start_move:function(){this.allow_scroll=!0,this.scroll_button.hide(),this.scroll2end()},push:function(e){let t=this.pages;t.length||t.push($(`<pre></pre>`).appendTo(this.container)),this.count>this.max&&(t.length>=this.size&&t.splice(0,1)[0].remove(),this.count=0,t.push($(`<pre></pre>`).appendTo(this.container))),t[t.length-1].append(e+`
`),this.count++},clear:function(){for(let e of this.pages)e.remove();this.pages.length=0,this.count=0},is_end:function(){let e=this.container[0],t=e.scrollHeight,n=e.clientHeight;return e.scrollTop+n>=t-50},scroll2end:function(){let e=this.container[0];if(!(e.scrollHeight<e.clientHeight)){if(!this.allow_scroll){let e=this.container[0].getBoundingClientRect();return this.scroll_button.show().css(`top`,e.bottom-this.scroll_button.height()-screenTop)}e.scrollTop=e.scrollHeight}}},q=class{constructor(e){this._filePath=e,this.$children=null,this.$parent=null,this.$el=null,this.id=null,this.template=``,this.css=``}filePath(){return this._filePath}mount(e,t){let n=document.createElement(`template`);n.innerHTML=this.render(t),e.append(n.content),this.$el=e.lastElementChild,this.on_mount&&this.on_mount(this.$el),this.$children&&this.$children.forEach(e=>{e.on_mount&&e.on_mount(e.id?document.getElementById(e.id):this.$el)})}render(e){return this.template}_injectStyle(){if(!this.css||this._style_dom)return;let e=document.createElement(`style`);e.textContent=this.css,document.head.append(e),this._style_dom=e}unmount(){this.$el&&this.$el.remove(),this.$el=null,this.on_unmount&&this.on_unmount(),this.$children&&this.$children.forEach(e=>{e.on_unmount&&e.on_unmount()}),this.$parent&&this.$parent.$children&&(this.$parent.$children=this.$parent.$children.filter(e=>e!==this)),this.$parent=null,this.$children=null}destroy(){this.on_destroy&&this.on_destroy(),this._style_dom&&this._style_dom.remove()}insert(e){if(!e)throw Error(`选项不能为空`);typeof e==`string`&&(e={url:e});let t=e.Class;if(!t)throw Error(`组件类不存在`);let n=new t;return this.$children||=[],this.$children.push(n),n.$parent=this,e.id&&(this[`$`+e.id]=n,n.id=e.id),n.render(e)}onCompile(){this._injectStyle()}},J={Login:function(e,t,n){return x.Post(`api/user/login`,{code:e,pwd:t},n)},IsRegistValidation:function(e){return x.Get(`UserAPI/IsRegistValidation`,e)},ValidationImage:function(e){return x.Get(`api/user/validimage`,e)},Regist:function(e,t){return x.Post(`api/user/regist`,e,t)},Enter:function(e,t){return x.Get(`e`,[e],t)},ChangePassword:function(e,t,n,r){return x.Post(`api/user/changepassword`,{oldpwd:e,pwd:t,no:n},r)},LoginOut:function(e){return x.Get(`UserAPI/LoginOut`,e)},GetRoles:function(e,t){return x.Get(`UserAPI/GetRoles`,[e],t)},AddRole:function(e,t){return x.Post(`UserAPI/AddRole`,{player:e},t)},GetUser:function(e){return x.Get(`UserAPI/GetUser`,e)},Search:function(e,t,n,r){return x.Get(`UserAPI/Search`,[e,t,n],r)},ResetPassword:function(e,t){return x.Get(`UserAPI/ResetPassword`,[e],t)},RecoverUser:function(e,t){return x.Get(`UserAPI/RecoverUser`,[e],t)},LoadPlayer:function(e,t,n){return x.Get(`UserAPI/LoadPlayer`,[e,t],n)},GetPhone:function(e){return x.Get(`api/user/getphone`,e)},BindPhone:function(e,t,n,r){return x.Post(`api/user/bindphone`,{code:e,no:t,pwd:n},r)},SendValidateCode:function(e,t){return x.Get(`UserAPI/SendValidateCode`,[e],t)},ResetPasswordByPhone:function(e,t,n,r,i){return x.Post(`api/user/resetpwd`,{name:e,phone:t,vcode:n,pwd:r},i)},NewServer:function(e){return x.Get(`UserAPI/NewServer`,e)},GetServer:function(e){return x.Get(`api/game/servers`,e)}},Y=null,on=class extends q{constructor(){super(),this.template=`
    <div id="slist_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">选择你要登录的游戏</li>
                <li class="content">
                    <ul class="server-list"></ul>
                </li>
                <li class="panel_item" command="SelectServer"><span class="glyphicon glyphicon-ok"></span><span
                        style="margin-left:0.5rem">选择服务器</span></li>
                <li class="panel_item" command="ToUpdate"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">修改密码</span></li>
                <li class="panel_item" command="BindPhone"><span class="glyphicon glyphicon-lock"></span><span
                        style="margin-left:0.5rem">绑定手机</span></li>
                <li class="panel_item" command="ReLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回登录</span></li>
            </ul>
        </div>
`}showServers(){if(!Y){A(`正在获取服务器列表`),J.GetServer(e=>{if(!e||typeof e==`string`){O(`#login_pwd`,`获取服务器列表出错`);return}Y=e,this.displayServer(e),this.showServers()});return}var e=Y;if(!e||!e.length)k(`#login_panel`),O(`#login_pwd`,`获取服务器列表出错`);else{var t=x.GetUserCookie(`s`),n=t?Y[t]:e.length==1?Y[0]:null;if(n)return A(`正在连接服务器`),pe(n);k(`#slist_panel`)}}selectServer(){if(Y){var e=parseInt($(`.server-list>.select`).attr(`index`));if(!(e>=0&&e<Y.length))return S.Show({content:`你没有选择要连接的服务器。`});var t=Y[e];t||S.Show({content:`你没有选择要连接的服务器。`}),A(`正在连接服务器`),pe(t),x.SetCookie(`s`,e)}}displayServer(){if(Y){var e=location.hostname.startsWith(`127.0.0.1`)||location.hostname.startsWith(`localhost`),t=location.search.startsWith(`?test`);e&&Y.push({id:100,name:`本地测试1`,ip:`127.0.0.1`,port:31300});for(var n=[],r=`武神传说2`,i=0;i<Y.length;i++)!t&&!e&&Y[i].istest||(n.push(`<li class='role-item`),i==0&&n.push(` select`),n.push(`' index='`+i+`'>`),n.push(r),n.push(`&nbsp;&nbsp;`),n.push(Y[i].name),Y[i].isdef&&n.push(`<span class='server-badge'>&nbsp;（推荐）</span>`),n.push(`</li>`));$(`.server-list`).html(n.join(``)).on(`click`,`li`,function(){var e=$(this);e.is(`.select`)||(e.parent().find(`.select`).removeClass(`select`),e.addClass(`select`))})}}},sn=class extends q{constructor(){super(),this.initReg=!1,this.template=`
     <div id="regist_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">注册用户</li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="regist_name" placeholder="请输入用户名" class="textbox" />
                    <h3>你的密码</h3>
                    <input type="password" id="regist_pwd1" placeholder="请输入密码" class="textbox" />
                    <h3>重复你的密码</h3>
                    <input type="password" id="regist_pwd2" placeholder="请输入密码" class="textbox" />
                    <div id="regist_valpanel">
                        <h3>请输入图片验证码</h3>
                        <div class="validnum-box">
                            <input type="text" id="regist_val" value="" placeholder="请输入图片验证码" class="textbox" />
                            <img src="" class="validnum-img" />
                        </div>
                    </div>
                </li>
                <li class="panel_item" command="Regist"><span class="glyphicon glyphicon-saved"></span><span
                        style="margin-left:0.5rem">确定</span></li>
                <li class="panel_item" command="ToLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">取消</span></li>
            </ul>
        </div>
`}on_mount(){}open(){this.initReg||=(this.GetValidationImage(),$(`.validnum-box>.validnum-img`).on(`click`,()=>this.GetValidationImage()),!0)}regist(){var e=$(`#regist_name`).val().toLowerCase(),t=$(`#regist_pwd1`).val();if(!e)return O(`#regist_name`,`请输入用户名`);if(!/^[a-z0-9]{5,15}$/.test(e))return O(`#regist_name`,`用户名需要是5-10个英文字符`);if(!t)return O(`#regist_pwd1`,`请输入密码`);if(t.length<6||t.length>20)return O(`#regist_pwd1`,`密码长度在6到20之间`);if(t!=$(`#regist_pwd2`).val())return O(`#regist_pwd2`,`重复密码输入不一致，请重新输入`);var n=$(`#regist_val`).val();if(!n)return O(`#regist_valpanel`,`请输入图片中的验证码`);if(n.length!=4)return O(`#regist_valpanel`,`请输入图片中的四位验证码`);let r=0,i=/u(\d+)/.exec(location.pathname);i&&(r=parseInt(i[1]),r>0||(r=0)),A(`正在注册账号`),J.Regist({name:e,pwd:t,valno:n,guider:r},e=>{e.code==1?(A(`注册成功，正在获取服务器列表`),setTimeout(()=>window.location.reload(),500)):(O(`#regist_name`,e.result||`注册失败`),k($(`#regist_panel`)))})}GetValidationImage(){J.ValidationImage(function(e){$(`.validnum-box>.validnum-img`).attr(`src`,`data:image/svg+xml;base64,`+e)})}},cn=`万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐锺离宇文长孙慕容鲜于闾丘司徒司空丌官司寇子车颛孙端木巫马公西乐正公良拓拔夹谷谷梁梁丘左丘东门西门`,ln=`赵钱孙李周吴郑王冯陈楮卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎`,un=`世舜丞主产仁仇仓仕仞任伋众伸佐佺侃侪促俟信俣修倝倡倧偿储僖僧僳儒俊伟列则刚创前剑助劭势勘参叔吏嗣士壮孺守宽宾宋宗宙宣实宰尊峙峻崇崈川州巡帅庚战才承拯操斋昌晁暠曹曾珺玮珹琒琛琩琮琸瑎玚璟璥瑜生畴矗矢石磊砂碫示社祖祚祥禅稹穆竣竦综缜绪舱舷船蚩襦轼辑轩子杰榜碧葆莱蒲天乐东钢铎铖铠铸铿锋镇键镰馗旭骏骢骥驹驾骄诚诤赐慕端征坚建弓强彦御悍擎攀旷昂晷健冀凯劻啸柴木林森朴骞寒函高魁魏鲛鲲鹰丕乒候冕勰备宪宾密封山峰弼彪彭旁日明昪昴胜汉涵汗浩涛淏清澜浦澉澎澔瀚瀛灏沧虚豪豹辅辈迈邶合部阔雄霆震韩俯颁颇频颔风飒飙飚马亮仑仝代儋利力劼勒卓哲喆展帝弛弢弩彰征律德志忠思振挺掣旲旻昊昮晋晟晸朕朗段殿泰滕炅炜煜煊炎选玄勇君稼黎利贤谊金鑫辉墨欧有友闻问`,dn=`筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜姬舒影荔枝思丽秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊勤珍贞莉兰凤洁梅琳素云莲真环雪荣妹霞香月莺媛艳瑞凡佳嘉琼桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥`;function fn(e,t){t||=parseInt(Math.random()*2)+1;var n=[];if(t==2){var r=parseInt(Math.random()*cn.length);r%2==1&&--r,n.push(cn[r++]),n.push(cn[r])}else n.push(ln[parseInt(Math.random()*ln.length)]);return e==0?n.push(un[parseInt(Math.random()*un.length)]):n.push(dn[parseInt(Math.random()*dn.length)]),parseInt(Math.random()*4)>1&&(e==0?n.push(un[parseInt(Math.random()*un.length)]):n.push(dn[parseInt(Math.random()*dn.length)])),n.join(``)}function pn(){for(var e=`abcdefghijklmnopqrstuvwxyz`,t=`123456789`,n=[],r=parseInt(Math.random()*3)+3,i=0;i<r;i++)i<3?n.push(e[parseInt(Math.random()*e.length)]):n.push(t[parseInt(Math.random()*t.length)]);return n.join(``)}function mn(){for(var e=20,t=[],n=0;n<4;n++){var r=parseInt(Math.random()*15+1);e>=r?(n==3?r=e:e-=r,t[n]=r):(t[n]=e,e=0)}var i={};return i.str=t[0]+15,i.con=t[1]+15,i.dex=t[2]+15,i.int=t[3]+15,i}function hn(e){switch(e){case`name`:$(`#reg_name`).val(fn(+!$(`#gender_0`).is(`:checked`)));break;case`id`:$(`#reg_id`).val(pn());break;case`prop`:var t=mn();$(`#reg_str`).val(t.str),$(`#reg_con`).val(t.con),$(`#reg_dex`).val(t.dex),$(`#reg_int`).val(t.int);break}}var gn=class extends q{constructor(){super(),this.template=`
     <div id="role_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">选择你的角色</li>
                <li class="content">
                    <ul class="role-list"></ul>
                </li>
                <li class="panel_item" command="SelectRole"><span class="glyphicon glyphicon-ok"></span><span
                        style="margin-left:0.5rem">登陆</span></li>
                <li class="panel_item" command="AddRole"><span class="glyphicon glyphicon-plus"></span><span
                        style="margin-left:0.5rem">创建角色</span></li>
                <li class="panel_item" command="DeleteRole"><span class="glyphicon glyphicon-remove"></span><span
                        style="margin-left:0.5rem">删除角色</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回列表</span>
                </li>
                <li class="bottom">
                    <ul class="new-list">
                        <li nid="251026">10月27日重启更新预告</li>
                        <li nid="250928">国庆活动和更新说明</li>
                    </ul>
                </li>
            </ul>
        </div>
`}select(){var e=$(`.role-list>.select`);if(e.length){var t=e.attr(`roleid`);SendCommand(`login `+t),A(`正在进入游戏`,`#role_panel`)}}addRole(){if($(`.role-list>.role-item`).length>4)return S.Show({content:`你只能最多创建五个角色`});k($(`#addrole_panel`)),hn(`name`),hn(`prop`),hn(`id`)}delete(){var e=$(`.role-list>.select`);if(e.length){var t=e.attr(`roleid`);t&&S.Show({content:`是否确认删除角色：`+e.html(),onOK:function(){SendCommand(`deleterole `+t)}})}}},_n=class extends q{constructor(){super(),this.template=`
     <div id="reset_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>重置你的密码</span></li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="reset_name" value="" placeholder="请输入用户名，如果账号未绑定手机无法重置" class="textbox" />
                    <h3>你绑定的手机</h3>
                    <input type="text" id="reset_phone" placeholder="请输入你的手机号码" class="textbox" />
                    <h3 class="hide">接收到的验证码</h3>
                    <div class="validnum-box hide">
                        <input type="text" id="reset_no" placeholder="请输入六位验证码" class="textbox" />
                        <button class="validnum-btn ">发送验证码</button>
                    </div>
                    <h3>你新的密码</h3>
                    <input type="password" id="reset_pwd1" value="" placeholder="你新的密码" class="textbox" />
                    <h3>重复你的新密码</h3>
                    <input type="password" id="reset_pwd2" value="" placeholder="重复你的新密码" class="textbox" />
                </li>
                <li class="panel_item" command="ResetPwd"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">重置密码</span></li>
                <li class="panel_item" command="ToLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}on_mount(){}reset(){var e=$(`#reset_name`).val();if(!e)return O(`#reset_name`,`请输入用户名`);if(!/^[a-z0-9]{5,15}$/.test(e))return O(`#reset_name`,`用户名格式错误,需要5-15位字母开头的字母，数字或下划线，不区分大小写`);var t=$(`#reset_phone`).val();if(!t)return O(`#reset_phone`,`请输入你的帐号绑定的手机号码`);if(!/^1\d{10}$/.test(t))return O(`#reset_phone`,`手机号码格式错误`);var n=``,r=$(`#reset_pwd1`).val();if(!r)return O(`#reset_pwd1`,`请输入你的新密码`);var i=$(`#reset_pwd2`).val();if(!i)return O(`#reset_pwd2`,`请重复输入你的新密码`);if(i.length<6||i.length>20)return O(`#update_pwd2`,`密码长度在6到20之间`);if(i!=r)return O(`#reset_pwd2`,`两次密码输入不一致`);A(`正在修改密码`,`#reset_panel`),J.ResetPasswordByPhone(e,t,n,r,function(e){e.code?k(`#login_panel`):(O(`#reset_pwd2`,e.result??`重置失败`),k(`#reset_panel`))})}},vn=class extends q{constructor(){super(),this.template=`
      <div id="pwd_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>修改密码</span></li>
                <li class="content">
                    <h3>输入你现在的密码</h3>
                    <input type="password" id="update_pwd1" value="" placeholder="输入你现在的密码" class="textbox" />
                    <div id="pwd_bind" style="display:none">
                        <h3>你绑定的手机</h3>
                        <input type="text" id="pwd_phone" placeholder="请输入你的手机号码" class="textbox" />
                        <h3>绑定的手机尾号</h3>
                        <div class="validnum-box">
                            <input type="text" id="pwd_no" placeholder="请输入四位尾号" class="textbox" />
                            <button class="validnum-btn hide">发送验证码</button>
                        </div>
                    </div>
                    <h3>你新的密码</h3>
                    <input type="password" id="update_pwd2" value="" placeholder="你新的密码" class="textbox" />
                    <h3>重复你的新密码</h3>
                    <input type="password" id="update_pwd3" value="" placeholder="重复你的新密码" class="textbox" />
                </li>
                <li class="panel_item" command="UpdatePwd"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">修改</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}open(){k(`#pwd_panel`),J.GetPhone(function(e){if(e.code!==1)return O(`#update_pwd1`,`获取绑定的手机号失败`);e.result?($(`#pwd_phone`).prop(`disabled`,!0).val(e.result),$(`#pwd_bind`).show()):($(`#pwd_phone`).prop(`disabled`,!1).val(``),$(`#pwd_bind`).hide())})}update(){$(`#pwd_panel`).find(`.input-error`).remove();var e=$(`#update_pwd1`).val(),t=$(`#update_pwd2`).val(),n=$(`#update_pwd3`).val();if(e.length<6||e.length>20)return O(`#update_pwd1`,`密码长度在6到20之间`);if(t.length<6||t.length>20)return O(`#update_pwd2`,`密码长度在6到20之间`);if(n!=t)return O(`#update_pwd3`,`两次密码输入不一致`);var r;if($(`#pwd_bind`).is(`:visible`)&&(r=$(`#pwd_no`).val(),!r||!/^\d{4}$/.test(r)))return O($(`#pwd_no`).parent(),`请输入你绑定的手机尾号`);A(`正在修改密码`,`#pwd_panel`),J.ChangePassword(e,t,r,function(e){e.code?k($(`#slist_panel`)):(O(`#update_pwd1`,e.result||`修改失败`),k(`#pwd_panel`))})}},yn=class extends q{constructor(){super(),this.template=`
         <div id="bind_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>绑定手机</span></li>
                <li class="content">
                    <h3>你绑定的手机</h3>
                    <input type="text" id="phone_no" placeholder="请输入你的手机号码" class="textbox" />
                    <h3>绑定的手机尾号</h3>
                    <div class="validnum-box">
                        <input type="text" id="phone_valid" placeholder="请输入四位尾号" class="textbox" />
                        <button class="validnum-btn hide">发送验证码</button>
                    </div>
                    <h3>你的密码</h3>
                    <input type="password" id="phone_pwd" placeholder="请输入密码" class="textbox" />
                </li>
                <li class="panel_item" command="CheckValid"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">绑定</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}bind(){k(`#bind_panel`),J.GetPhone(function(e){if($(`#phone_valid`).val(``),$(`#phone_pwd`).val(``),e.code!==1)return $(`.input-error`).html(e.result);$(`.input-error`).remove();let t=e.result;t?($(`#phone_no`).prop(`disabled`,!0).val(t),$(`#phone_valid`).parent().show().prev().show(),$(`#phone_no`).prev().html(`你已绑定手机，再次验证会取消绑定`),$(`#phone_no`).parent().next().find(`span:last()`).html(`解除绑定`)):($(`#phone_no`).prop(`disabled`,!1).val(``),$(`#phone_no`).prev().html(`你要绑定的手机(不验证，目前仅作为二级密码验证使用)`),$(`#phone_valid`).parent().hide().prev().hide(),$(`#phone_no`).parent().next().find(`span:last()`).html(`绑定`))})}check(){var e=$(`#phone_no`),t=``,n=``;if(e.is(`:disabled`)){if(n=$(`#phone_valid`).val(),!n)return O($(`#phone_valid`).parent(),`请输入你接收到的六位验证码`);if(!/^\d{4}$/.test(n))return O($(`#phone_valid`).parent(),`请输入六位数字的验证码`)}else{if(t=e.val(),!t)return O(`#phone_no`,`请输入你的帐号绑定的手机号码`);if(!/^1\d{10}$/.test(t))return O(`#phone_no`,`手机号码格式错误`)}var r=$(`#phone_pwd`).val();if(!r)return O(`#phone_pwd`,`请重复输入你的新密码`);if(r.length<6||r.length>20)return O(`#phone_pwd`,`密码长度在6到20之间`);J.BindPhone(n,t,r,function(e){e.code<1?(O($(`#phone_valid`).parent(),e.result??`绑定失败`),k(`#bind_panel`)):k(`#role_panel`)})}};window.RefreshInput=hn;var bn=class extends q{constructor(){super(),this.template=`


        <div class="mypanel" id="addrole_panel">
            <ul>
                <li class="panel_item active">创建你的角色卡</li>
                <li class="content">
                    <div class="input-error"></div>
                    <div>
                        <h3 class="regist-title-text">你的称呼，2-5个中文字符</h3><span onclick="RefreshInput('name');"
                            class="glyphicon glyphicon-refresh regist-title-ref"></span>
                    </div>
                    <div>
                        <input type="text" placeholder="请输入姓名" id="reg_name" class="textbox" style="width:250px;" />
                    </div>
                    <h3>你的性别</h3>
                    <div>
                        <label><input type="radio" name="role_gander" id="gender_0" checked="checked" />男</label>
                        <label><input type="radio" name="role_gander" />女</label>
                    </div>
                    <div>
                        <h3 class="regist-title-text">你的先天属性</h3><span
                            class="glyphicon glyphicon-refresh regist-title-ref" onclick="RefreshInput('prop');"></span>
                    </div>
                    <table>
                        <tr>
                            <td style="width:5rem">臂力：<span class="glyphicon glyphicon-exclamation-sign"
                                    data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的攻击力，招架等"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_str" class="hide_txt" value="20" /></td>
                            <td style="width:5rem">根骨：<span class="glyphicon glyphicon-exclamation-sign"
                                    data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的内力上限，气血，防御等"></span></td>
                            <td><input type="text" id="reg_con" class="hide_txt" value="20" /></td>
                        </tr>
                        <tr>
                            <td style="width:2.5rem">身法：<span class="glyphicon glyphicon-exclamation-sign"
                                    data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的躲闪，暴击等属性"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_dex" class="hide_txt" value="20" /></td>
                            <td style="width:2.5rem">悟性：<span class="glyphicon glyphicon-exclamation-sign"
                                    data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物对技能的领悟速度等"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_int" class="hide_txt" value="20" /></td>
                        </tr>
                    </table>
                    <div class="regist-help-text">需要在15-30之间，并且总和等于80</div>
                </li>
                <li class="panel_item" command="CreateRole"><span class="glyphicon glyphicon-saved"></span><span
                        style="margin-left:0.5rem">创建</span></li>
                <li class="panel_item" command="ToRolePanel"><span class="glyphicon glyphicon-off"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}create(){var e={};if(e.name=$(`#reg_name`).val(),e.gender=$(`#gender_0`).is(`:checked`)?1:2,e.str=parseInt($(`#reg_str`).val()),e.con=parseInt($(`#reg_con`).val()),e.dex=parseInt($(`#reg_dex`).val()),e.int=parseInt($(`#reg_int`).val()),!/^[\u4E00-\u9FA5]{2,5}$/.test(e.name))return O(`#reg_name`,`名称格式错误，只能使用2-5位中文字符`);if(e.str<15||e.str>30)return O(`#reg_name`,`臂力需要在15-30之间`);if(e.con<15||e.con>30)return O(`#reg_name`,`根骨需要在15-30之间`);if(e.dex<15||e.dex>30)return O(`#reg_name`,`身法需要在15-30之间`);if(e.int<15||e.int>30)return O(`#reg_name`,`悟性需要在15-30之间`);if(e.str+e.con+e.dex+e.int!=80)return O(`#reg_name`,`先天属性需要在15-30之间，并且总和等于80`);A(`正在创建角色`,`#addrole_panel`),SendCommand(`createrole `+e.name+` `+e.gender+` `+e.str+` `+e.con+` `+e.dex+` `+e.int)}},xn=class extends q{constructor(){super(),this.template=`
        <div id="new_panel" class="mypanel" style="display:none">
            <ul>
                <li class="content" style="height:20rem;">
                    <iframe frameborder="0" id="news_frame" width="100%" height="100%"></iframe>
                </li>
                <li class="panel_item" command="ToRolePanel"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`}},Sn=`data:image/gif;base64,R0lGODlhHgAeAOUAAQAAAAAAmQBmmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgA/ACwAAAAAHgAeAEUGRMCfcEgsGo/IpHJJBDifUIGASa1ar0lodIrter/gsPi3BWu1Uu/ZmR673/C4fE7PrtvY9RNv1bO5eXeAanuDdYeIiWIAACH5BAkKAD8ALAoACgAOAAoARQYlwJ8QQAQIjgLhsMhEJplQI/IXJTqpVes0e81qj17pERu9KptTIQAh+QQJCgA/ACwKAAoAEQAKAEUGK8CfEEAECH+CpOD4KzoBymjz6Ywqp1RrEkuFarnVb7eoFYyJZTD5e3QepUIAIfkECQoAPwAsCgAKABQACgBFBjLAnxBABAiPP4FSgCw6jcml9Pd8Sq/MKlGIVVK1xO7yW+V2yVqxEhxWo51mbLOIjDOFAAAh+QQJCgA/ACwKAAoADgAKAEUGJcCfEEAECI4C4bCIbCaLRmfzB5UeqUzrtWrFErVHrtYblSrJUyEAIfkECQoAPwAsCgAKAAwACgBFBiDAnxAAEBgFwmHxyPwRmVDkMypdUqtXp5U6zXahSW1TCAAh+QQJCgA/ACwKAAoACgAKAEUGGsCfUEAUCIfF5C/JNDaJyydUGpVanc9j1SgEACH5BAkKAD8ALAgACgAMAAoARQYhwJ9QQBQAAMJhcXn8LZ9GJJTYnBarU6z1aKVKs8gkM/wDACH5BAkKAD8ALAYACgAOAAoARQYlwJ9QQBQAjgDhsMhEJplQI/IXJTqpVes0e81qj17pERu9KptTIQAh+QQJCgA/ACwAAAoAFAAKAEUGMsCfUEAUCI8/gBKALDqNyaX093xKr8wqUYhVUrXE7vJb5XbJWrESHFajnWZss4iMM4UAACH5BAkKAD8ALAMACgARAAoARQYrwJ9QQBQIf4Ak4PgrOpXQpbMYjTangmryOtUquU8tmOoFYLPlMdHLdB6hRwAh+QQJCgA/ACwGAAoADgAKAEUGJcCfUEAUAI4A4bCIbCaLRmfzB5UeqUzrtWrFErVHrtYblSrJUyEAIfkECQoAPwAsCAAKAAwACgBFBiDAn1AgABgBwmHxyPwRmVDkMypdUqtXp5U6zXahSW1TCAA7Cg==`,Cn=new on,wn=class extends q{constructor(){super(),this.template=`
 <div class="login-content">
        <div id="loader" class="loader hide"><img src="${Sn}" alt="" /><span id="loader_msg">正在登陆</span></div>
        <div class="error hide"></div>
        <div id="login_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active">
                    <span>欢迎登陆</span>
                </li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="login_name" value="" placeholder="请输入用户名" class="textbox" />
                    <h3>你的密码</h3>
                    <input type="password" id="login_pwd" value="" placeholder="请输入密码" class="textbox" />
                </li>
                <li class="panel_item" command="LoginIn"><span class="glyphicon glyphicon-log-in"></span><span
                        style="margin-left:0.5rem">登陆</span></li>
                <li class="panel_item" command="ToRegist"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">注册</span></li>
                <li class="panel_item" command="Forget"><span class="glyphicon glyphicon-question-sign"></span><span
                        style="margin-left:0.5rem">忘记密码</span></li>
            </ul>
        </div>
`}relogin(){k($(`#login_panel`));var e=new Date;e.setTime(-1e3);for(var t=document.cookie.split(`; `),n=0;n<t.length;n++){var r=t[n].split(`=`);document.cookie=r[0]+`=''; expires=`+e.toGMTString()}}loginIn(){var e=$(`#login_name`).val().toLowerCase(),t=$(`#login_pwd`).val();if(!e)return O(`#login_name`,`请输入用户名`);if(!/^[a-z0-9]{5,15}$/.test(e))return O(`#login_name`,`用户名格式错误,需要5-15位字母开头的字母，数字或下划线，不区分大小写`);if(!t)return O(`#login_pwd`,`请输入密码`);if(t.length<6||t.length>20)return O(`#login_pwd`,`密码长度在6到20之间`);A(`正在登录`,`#login_panel`),J.Login(e,t,e=>{e.code?Cn.showServers():(O(`#login_name`,e.result||`登陆失败`),k(`#login_panel`))})}},Tn=new on,En=new wn,Dn=new sn,X=new gn,On=new _n,kn=new vn,An=new yn,jn=new bn,Mn=new xn;function Nn(){let e=$(this).attr(`nid`);k($(`#new_panel `)),$(`#news_frame`).attr(`src`,`/news/`+e+`.html`)}var Pn=class extends q{constructor(){super(),this.template=`

        ${En.template}

        ${Tn.template}
        ${An.template}

        ${kn.template}
        ${On.template}
        
       ${Dn.template}
       ${X.template}
       ${Mn.template}
       ${jn.template}
        <div class="signinfo">©2017 武神传说 </div>
    </div>
`}on_mount(){if($(`.login-content`).on(`click`,`.panel_item`,e=>this.LoginCommand(e)),$(`.role-list`).on(`click`,`.role-item`,function(){$(this).parent().find(`.select`).removeClass(`select`),$(this).addClass(`select`)}),$(`.new-list>li`).on(`click`,Nn),!x.GetUserCookie(`p`))return $(`#login_panel`).show();Tn.showServers()}LoginCommand(e){switch($(e.currentTarget).attr(`command`)){case`ToRolePanel`:k($(`#role_panel`));break;case`ToServerPanel`:_e(),k($(`#slist_panel`));break;case`ToLogin`:k($(`#login_panel`));break;case`Forget`:k($(`#reset_panel`));break;case`CancleRegist`:k($(`#login_panel`));break;case`Down`:k($(`#download`));break;case`ToRegist`:k($(`#regist_panel`)),Dn.open();break;case`Regist`:Dn.regist();break;case`SelectServer`:Tn.selectServer();break;case`LoginIn`:En.loginIn();break;case`ResetPwd`:On.reset();break;case`AddRole`:X.addRole();break;case`SelectRole`:X.select();break;case`CreateRole`:jn.create();break;case`BindPhone`:An.bind();break;case`CheckValid`:An.check();break;case`UpdatePwd`:kn.update();break;case`ToUpdate`:kn.open();break;case`ReLogin`:En.relogin();break;case`DeleteRole`:X.delete();break}}},Fn=()=>$(`.content-message`),In={append:e=>$(`.content-message`).append(e)},Z={itemsElement:null,contentScroll:!0,message:null,channel:null,relogin(){k(`#login_panel`)},clear:function(){Dialog.pack.items=null,Dialog.skills.items=null,Dialog.skills.skills=null,Dialog.skills.autoPfm=null,Dialog.skills.performSkills=null,Dialog.skills.sk_group=null,R.Skills=null,R.dis_pfms=[],this.state(null)},init:function(){Z.itemsElement=$(`.room_items`),this.message=an.create($(`.content-message`)),this.ChannelElement=$(`.channel`),this.ChannelElement.on(`click`,Dialog.channel.show.bind(Dialog.channel)),this.channel=an.create(this.ChannelElement,4,200)},startMoveMessage:function(e){window.addEventListener(`mousemove`,Z.moveMessage),window.addEventListener(`mouseup`,Z.endMoveMessage),Z.mouseY=e.clientY},moveMessage:function(e){let t=Z.mouseY-e.clientY,n=Fn(),r=n[0],i=n.height(),a=r.style.marginBottom;if(a=a?parseInt(a.replace(`px`,``)):0,a+=t,a<0)a=0;else if(a>i*.7)return;r.style.marginBottom=a+`px`,Z.mouseY=e.clientY,e.preventDefault()},endMoveMessage:function(){window.removeEventListener(`mousemove`,Z.moveMessage),window.removeEventListener(`mouseup`,Z.endMoveMessage)},regist:function(e){e.result&&(k(`#addrole_panel`),$(`#addrole_panel .input-error`).html(e.result))},emote:function(e){Z.emotes=e.items||0;for(var t=[],n=0;n<Z.emotes.length;n++)t.push(`<span>`),t.push(Z.emotes[n]),t.push(`</span>`);$(`.channel-emotes`).html(t.join(``))},deleterole:function(e){if(e.result){var t=$(`#role_panel>ul>.content>.role-list>.role-item[roleid='`+e.id+`']`);t.remove();var n=$(`#role_panel>ul>.content>.role-list>.role-item`);t.is(`.select`)&&n.length?$(n[0]).addClass(`select`):n.length||X.addRole()}else Confirm.Show({content:`<span class='input-error'>`+(e.message||`删除失败`)+`</span>`})},cross:function(e){for(var t=null,n=0;n<Y.length;n++)Y[n].ID==e.sid&&(t=Y[n]);t&&(T.ChangeServer=!0,T.Close(),Dialog.pack.items=null,e.cross_type==`duizhan`&&(Dialog.skills.items=null,Dialog.skills.isShow=!1),console.log(`重新连接到`,t.Name),e.pid||Z.die({relive:!0}),pe(t,e.pid))},roles:function(e){var t=e.roles;if(!t.length)X.addRole();else{k(`#role_panel`);for(var n=[],r=0;r<t.length;r++)n.push(`<li class='role-item`),r==0&&n.push(` select`),n.push(`' roleid='`+t[r].id+`'>`),n.push(t[r].title),n.push(`&nbsp;&nbsp;`),n.push(t[r].name),n.push(`</li>`);$(`.role-list`).html(n.join(``))}},loginerror:function(e){$(`.container`).hide(),$(`.login-content`).show(),A(`<strong>登陆失败：</strong>`+e.msg)},login:function(e){Z.player||k(`.container`),Z.player=e.id,Z.level=e.level,F.load(e.setting),he()},levelup:function(e){Z.level=e.level},selectItem:function(e){if($(e.target).is(`.status-item`)){var t=e.target.getAttribute(`sid`);let n=$(e.target).closest(`.room-item`).attr(`itemid`);return t?n===Z.player?E(`status `+t):E(`status `+t+` `+n):void 0}var n=$(this).attr(`itemid`);if(console.log(n),n){if(n==Z.player){E(`select `+n);return}E(`select `+n)}},countwidth:function(e,t){var n=e*100/t;return n<0&&(n=0),n>100&&(n=100),n},itemremove:function(e){var t=R.STATUS[e.id];if(t){for(var n in t.items)clearInterval(t.items[n].handler);var r=t.elem.parent();r.next().is(`.item-commands`)&&r.next().remove(),r.remove(),delete R.STATUS[e.id]}Z.cur_room.items.RemoveAt(t=>t.id===e.id)},itemadd:function(e){if(!(F.off_plist&&e.p&&e.id!=Z.player)){var t=e,n=F.item_firstme&&t.id==Z.player?$(Z.create_roomitem(t)).prependTo(Z.itemsElement):$(Z.create_roomitem(t)).appendTo(Z.itemsElement);R.STATUS[e.id]&&Z.itemremove(e),R.AppendStatusItem(t.id,n.find(`.item-status-bar`),t.status),Z.cur_room.items.push(t)}},items:function(e){Z.itemsElement.empty(),R.STATUS={};for(var t=0;t<e.items.length;t++){var n=e.items[t];if(n&&(n.player=n.p,n.m&&(n.type=`师父`,n.master=1),n.f&&(n.type=`随从`,n.follower=1),n.l&&(n.type=`商人`,n.trader=1),!(F.off_plist&&n.p&&n.id!=Z.player))){var r=F.item_firstme&&n.id==Z.player?$(Z.create_roomitem(n)).prependTo(Z.itemsElement):$(Z.create_roomitem(n)).appendTo(Z.itemsElement);R.AppendStatusItem(n.id,r.find(`.item-status-bar`),n.status)}}Z.cur_room||={},Z.cur_room.items=e.items},get_hpnum:function(e,t){var n=e/t;return n>.8?`<hiy>`+e+`</hiy>`:n>.5?`<yel>`+e+`</yel>`:n>.2?`<red>`+e+`</red>`:`<hir>`+e+`</hir>`},create_roomitem:function(e){var t=[];return t.push(`<div class='room-item' itemid='`+e.id+`'>`),e.max_hp&&(t.push(`<div class="item-status"`),(!R.IsShow||F.off_hp)&&t.push(` style="display:none;"`),t.push(`>`),t.push(`<div class="progress hp"><div class="progress-bar" max="`+e.max_hp+`"  style="width:`+Z.countwidth(e.hp,e.max_hp)+`%"></div></div>`),t.push(`<div class="progress mp"><div class="progress-bar" max="`+e.max_mp+`"   style="width:`+Z.countwidth(e.mp,e.max_mp)+`%"></div></div>`),t.push(`</div>`)),t.push(`<span class='item-status-bar'>`),t.push(`</span>`),t.push(`<span class='item-name'>`),t.push(e.name),F.show_hpnum&&e.max_hp&&t.push(`<span class="progress-num">[`+this.get_hpnum(e.hp,e.max_hp)+`<nor>/</nor><hiy>`+e.max_hp+`</hiy>]</span>`),t.push(`</span>`),t.push(`</div>`),t.join(``)},room:function(e){$(`.room_items`).html(``),$(`.room-name`).html(e.name),$(`.room_desc`).html(e.desc),Z.room_name=e.name,F.keep_msg?F.keep_msg&&Q(`你来到了`+e.name+`。`):Z.message.clear(),Z.room_path!=e.path&&(F.show_roomitem&&Z.searchItems(e),R.ShowRoomCommands(e),Z.room_path=e.path,Z.cur_room=e,j.SetRoom(e))},roomHiddenItemsReg:/<\w{3}\scmd=['"](.+?)['"]>(.+?)<\/\w{3}>/g,searchItems:function(e){for(var t=null,n=e.desc;(t=this.roomHiddenItemsReg.exec(n))!==null;)e.commands.push({cmd:t[1],name:t[2]})},exits:function(e){var t=e?e.items:Z.room_exits;if(t)if(Z.room_exits=t,j.SetExits(t),F.exits_dir==1){for(var n=[`这里明显的出口有：`],r=[],i=0;i<j.DIRS.length;i++)t[j.DIRS[i]]&&r.push(j.DIRS[i]);for(var i=0;i<r.length;i++)i>0&&n.push(i==r.length-1?` 和 `:`、`),n.push(`<span class='exits-item' dir='`+r[i]+`'>`+r[i]+`</span>`);r.length?$(`.room_exits`).html(n.join(``)):$(`.room_exits`).html(`<HIK>这里没有明显的出口。<HIK>`)}else $(`.room_exits`).html(j.CreateExitsMap(t,$(`.container`).width(),Z.room_name))},before_click_exits:function(e){var t=$(e.target);t.attr(`dir`)&&(t.is(`rect`)?t.attr(`fill`,`var(--theme-surface-2)`):t.is(`text`)&&t.prev().attr(`fill`,`var(--theme-surface-2)`))},click_exits:function(e){var t=$(e.target),n=t.attr(`dir`);n&&(t.is(`rect`)?t.attr(`fill`,`var(--theme-surface)`):t.is(`text`)&&t.prev().attr(`fill`,`var(--theme-surface)`),E(`go `+n))},query_rmitem:function(e){if(!(!this.cur_room||!this.cur_room.items)){for(let t of this.cur_room.items)if(t.id===e)return t}},isLivingRoomItem:function(e){return!!(e&&(e.me||e.p||e.m||e.f||e.l||e.hp>0||e.max_hp>0))},item:function(e){e.commands=e.commands??[];let t=Z.query_rmitem(e.id);t&&(e=Object.assign(e,t)),M.LAST_OBJ=e,Dialog.extend.append(e.commands,`item`,e);for(var n=[`<div class='item-commands'>`],r=0;r<e.commands.length;r++)n.push(`<span cmd='`+e.commands[r].cmd+`'>`),n.push(e.commands[r].name),n.push(`</span>`);if(n.push(`</div>`),Z.isLivingRoomItem(e)){Z.itemsElement.find(`.item-commands`).remove(),Dialog.item.open(e);return}if(Q(e.desc),F.show_command&&R.STATUS[e.id]){Z.itemsElement.find(`.item-commands`).remove();var i=R.STATUS[e.id].elem.parent();return $(n.join(``)).insertAfter(i),Z.message.scroll2end()}Q(n.join(``))},actions:function(e){R.ShowActions(e)},cmds:function(e){if(e.items){if(Dialog.curItem===`item`&&Dialog.item&&Dialog.item.isShow){if(Dialog.item.isCapturingInteraction&&Dialog.item.isCapturingInteraction()){Dialog.item.appendInteractionCommands(e.items);return}Dialog.item.appendCommands(e.items);return}if(Dialog.isShow){C.Show(e.items);return}var t=[`<div class='item-commands'>`];e.items.length||(e.items=[e.items]);for(var n=0;n<e.items.length;n++)t.push(`<span cmd='`+e.items[n].cmd+`'>`),t.push(e.items[n].name),t.push(`</span>`);t.push(`</div>`),Q(t.join(``))}},map:function(e){j.SetMapBuffer(e.map,e.path),j.ShowMap(e.map,e.path),j.OpenDialogAfterLoad&&(j.OpenDialogAfterLoad=!1,$(`.map-panel`).hide(),Dialog.show(`map`))},updatemap:function(e){j.UpdateMap(e.map,e)},path:function(e){e.message&&Q(e.message),e.action==`stop`&&j.StopAutoMove()},dialog:function(e){Dialog.show(e.dialog,e)},sc:function(e){R.StatusChanged(e)},perform:function(e){R.ShowPFM(e),Dialog.skills.updatePerformSkills(e.skills)},disobj:function(e){R.DisObj(e)},changepfm:function(e){R.ChangeDistime(e)},clearDistime:function(e){R.ClearDistime(e)},pay:function(e){if(e.pay===3){Q(`<yel>请打开微信扫描二维码支付：</yel>
`);let t=$(`<div style="width:100%;text-align:center;"><img style="border:solid 2px #808088" src="`+e.url+`"/></div>`);t.children(0).on(`load`,function(){Q(``)}),In.append(t)}else window.location.href=e.url},dispfm:function(e){R.On_Perform(e)},status:function(e){R.StatusItemChanged(e)},combat:function(e){e.start&&(F.auto_showcombat==1&&!R.IsShow&&R.Show(),F.auto_hideroom==1&&(F.hide_roomdesc||$(`.room_desc`).hide())),e.end&&F.auto_hideroom==1&&(F.hide_roomdesc||$(`.room_desc`).show())},state:function(e){if(e&&e.state){var t=[`<span class='title'>`+e.state+`</span>`];if(e.commands)for(var n=0;n<e.commands.length;n++)t.push(`<span class='item-command' cmd='`+e.commands[n].cmd+`'>`),t.push(e.commands[n].name),t.push(`</span>`);$(`.state-bar`).html(t.join(``)).css(`visibility`,`visible`),e.no_stop?$(`.state-tool`).hide():$(`.state-tool`).show(),Z.states=e.desc,Z.timer&&clearInterval(Z.timer),Z.states&&Z.states.length&&(typeof Z.states==`string`&&(Z.states=[Z.states]),Z.timer=setInterval(Z.updatestate,e.interval||5e3))}else $(`.state-bar`).empty().css(`visibility`,`hidden`),$(`.state-tool`).hide(),clearInterval(Z.timer)},updatestate:function(){if(Z.states&&me()){var e=Z.states.length;Q(Z.states[parseInt(Math.random()*e)])}},die:function(e){if(e.relive)return Z.state({});Z.state({state:`<hiw>你已经死亡：</hiw>`,no_stop:!0,desc:[`<blk>一股阴冷的气息包围着你。</blk>`,`<blu>朦胧中你好像听到有人在喊：过来吧，过来吧！</blu>`],commands:e.commands,interval:12e3})},warn:function(e){Warn.Show(e)},msg:function(e){var t=Dialog.channel.createElement(e,!F.no_spmsg);t&&(F.no_spmsg?Q(t):(Z.channel.push(t),Z.channel.scroll2end()))},addAction:function(e){R.AddObj(e.id,e.name,e.distime)},removeAction:function(e){R.DisObj({id:e.id,remove:!0})}};function Q(e){Z.message.push(e),Z.message.scroll2end()}var Ln=!1,Rn=[`fight`,`kill`,`perform`,`biwu`];function zn(e){if(!e)return!1;var t=e.trim().split(/\s+/,1)[0];return Rn.indexOf(t)>=0}function Bn(){K.isShow&&K.hide(),S.Close(),C.Close()}var Vn=class extends q{constructor(){super(),this.template=`
    <div class="container" style="display:none;">
        <div class="dialog hide">
            <div class="dialog-header">
                <span class="dialog-icon glyphicon glyphicon-map-marker"></span>
                <span class="dialog-title"></span>
                <span class="dialog-close glyphicon glyphicon-remove-circle"></span>
            </div>
            <div class="dialog-content"></div>
            <div class="dialog-footer "></div>
        </div>
        <div class="content-room">
            <div class="map-panel"></div>
            <div class="room-title">
                <span class="room-name"></span><span class='glyphicon glyphicon-map-marker map-icon'></span>
            </div>
            <div style="text-indent: 2em;" class="room_desc"></div>
            <div style="text-indent: 2em;" class="room_exits"></div>
            <div class="room_items" style="max-height: 8rem; overflow-y: auto;"></div>
        </div>
        <div class='channel'></div>
        <div class="content-message"></div>
        <div class="tool-bar bottom-bar">
            <span class="state-bar" command="stateinfo" style="visibility:hidden"><span class="title"></span></span>
            <span command="stopstate" class="tool-item state-tool" style="display:none;"><span
                    class="glyphicon glyphicon-off tool-icon"></span><span class="tool-text">停止</span></span>
            <span command="showchat" class="tool-item"><span
                    class="glyphicon glyphicon-volume-down tool-icon"></span><span class="tool-text">聊天</span></span>
            <span command="events" class="tool-item"><span class="glyphicon glyphicon-dashboard tool-icon"></span><span
                    class="tool-text">活动</span><span class="tag hide"></span></span>
            <span command="showcombat" class="tool-item"><span class="glyphicon glyphicon-flash tool-icon"></span><span
                    class="tool-text">动作</span></span>
            <span command="showtool" class="tool-item br-tool hide-tool"></span>
            <div class="tool-bar right-bar">
                <span command="setting" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-cog tool-icon"></span><span class="tool-text">设置</span></span>
                <span class="tool-item" command="jh" style="display:none"><span
                        class="glyphicon glyphicon-home tool-icon"></span><span class="tool-text">江湖</span></span>
                <span command="stats" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-stats tool-icon"></span><span class="tool-text">排行</span></span>
                <span command="message" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-envelope tool-icon"></span><span class="tool-text">社交</span><span
                        class="tag hide"></span></span>
                <span command="shop" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-shopping-cart tool-icon"></span><span
                        class="tool-text">商城</span></span>
                <span command="tasks" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-exclamation-sign tool-icon"></span><span
                        class="tool-text">任务</span><span class="tag hide"></span></span>
                <span command="skills" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-book tool-icon"></span><span class="tool-text">技能</span></span>
                <span command="pack" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-briefcase tool-icon"></span><span class="tool-text">背包</span></span>
                <span class="tool-item" command="score" style="display:none"><span
                        class="glyphicon glyphicon-user tool-icon"></span><span class="tool-text">属性</span></span>
            </div>
        </div>
        <div class="custom-panel"></div>
        <div class="content-bottom">
            <div class="combat-panel hide">
                <div class="room-commands"></div>
                <div class="combat-commands"></div>
            </div>
        </div>
        <div class="chat-panel hide">
            <div class="channel-box" channel="chat">
                <span class="selected" channel="chat">世界</span>
                <span channel="tm">组队</span>
                <span channel="fam">门派</span>
                <span channel="say">房间</span>
                <span channel="es">全区</span>
                <span channel="pty">帮派</span>
                <span channel="emote">表情</span>
            </div>
            <div class="chat-input">
                <input class="sender-box" />
                <span class="glyphicon glyphicon-send sender-btn"></span>
            </div>
            <div class="channel-emotes hide"></div>
        </div>
    </div>
`}on_mount(){$(`.container`).on(`click`,Zn),$(`.channel-box`).on(`click`,`span`,Yn),$(`.combat-commands`).on(`click`,`.pfm-item`,R.Perform).on(`wheel`,R.Scroll),$(`.room-commands`).on(`wheel`,R.Scroll),$(`.sender-box`).on(`keyup`,qn),$(`.room_items`).on(`click`,`.room-item`,Z.selectItem),$(`.bottom-bar`).on(`click`,`.tool-item,.state-bar,.item-command`,Wn),$(`.map-panel`).on(`click`,Un),$(`.sender-btn`).on(`click`,Jn),$(`.room_exits`).on(`pointerdown`,Z.before_click_exits).on(`pointerup`,Z.click_exits),$(`.room-title>.map-icon`).on(`click`,j.OpenDialog.bind(j))}},Hn=0;function Un(e){if(!$(e.currentTarget).closest(`.dialog-map`).length&&!j.SuppressRoomClick){if(Hn||=0,Date.now()-Hn>500){Hn=Date.now();return}j.OpenDialog()}}function Wn(e){var t=$(this).attr(`command`);return t?Gn(t):(t=$(this).attr(`cmd`),t&&SendCommand(t),!1)}function Gn(e){switch(e){case`showtool`:xt();break;case`showchat`:return Kn();case`showcombat`:return R.Show();case`stopstate`:if(K.extend.is_record)return K.extend.stop_record();SendCommand(`state stop`);break;case`stateinfo`:SendCommand(`state info`);break;default:K.show(e);break}return!1}function Kn(){var e=$(`.chat-panel`).toggleClass(`hide`);return e.is(`.hide`)?Ln=!1:(Ln=!0,e.find(`input`).val(``).focus()),!1}function qn(e){e.keyCode==13&&Jn()}function Jn(){var e=$(`.sender-box`).val();if(e){if(e.length>100)return ReceiveMessage(`<hir>你输入的内容太多了。</hir>`);var t=$(`.channel-box`).attr(`channel`);$(`.sender-box`).val(``).focus(),SendCommand(t+` `+e)}}function Yn(){var e=$(this),t=e.attr(`channel`);if(t==`emote`)return Xn();if(!e.is(`.selected`)){var n=e.parent();return n.children().removeClass(`selected`),e.addClass(`selected`),n.attr(`channel`,t),$(`.sender-box`).focus(),!1}}function Xn(){var e=$(`.channel-emotes`);e.is(`.hide`)?(e.removeClass(`hide`),Z.emtoes||(SendCommand(`emote`),Z.emtoes=[],$(`.sender-box`).blur(),e.on(`click`,`span`,function(){var e=$(this).html();$(`.sender-box`).val(`*`+e).focus(),$(`.channel-emotes`).addClass(`hide`)}))):$(`.channel-emotes`).addClass(`hide`)}function Zn(e){var t=$(e.target);if(K.isShow&&t.is(`.container.dialog-open`))return K.hide(),S.Close(),C.Close(),!1;var n=t.attr(`cmd`);if(n||=t.parent().attr(`cmd`),n){let e=n[0];if(e==`_`){var r=n.split(` `);switch(r[0]){case`_confirm`:S.Process(r);break;case`_setting`:F.save(r[1],r[2]);break;case`_trade`:K.trade.confirm(r[1]);break;case`_close`:se.Close(t);break;case`_hide`:break;case`_closed`:K.hide();case`_party`:K.party.command(r[1]);break}}else e===`#`?M.run(n):(zn(n)?Bn():K.curItem===`item`&&K.item&&K.item.isShow&&t.closest(`.dialog-item-dialog`).length>0?K.item.captureNextPrompt():K.isShow&&C.captureNext(),SendCommand(n),!t.closest(`.dialog-fb`).length&&!t.closest(`.dialog-item-subdialog`).length&&t.closest(`.dialog-content`).length>0&&t.closest(`.item-commands`).remove());return!1}else Ln&&(t.closest(`.chat-panel`).length||($(`.chat-panel`).addClass(`hide`),Ln=!1));S.Close(),C.Close()}window.HandlerMenuCommand=Gn;var Qn=new Pn,$n=new Vn,er=class extends q{constructor(){super(),this.template=`${Qn.render()}\n${$n.render()}`}on_mount(){Qn.on_mount(),$n.on_mount()}};globalThis.$=e,globalThis.SendCommand=E,globalThis.ReceiveMessage=D,globalThis.Confirm=S,globalThis.Warn=se,globalThis.CmdPrompt=C,globalThis.Process=Z,globalThis.Dialog=K;function tr(){let e=new er;e.onCompile(),e.mount(document.body),Z.init()}e(tr);