if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function(Da,$){"object"===typeof exports&&"undefined"!==typeof module?module.exports=$():"function"===typeof define&&define.amd?define($):Da.CodeMirror=$()})(this,function(){function Da(a){return new RegExp("(^|\\s)"+a+"(?:$|\\s)\\s*")}function $(a){for(var b=a.childNodes.length;0<b;--b)a.removeChild(a.firstChild);return a}function W(a,b){return $(a).appendChild(b)}function r(a,b,c,d){a=document.createElement(a);c&&(a.className=c);d&&(a.style.cssText=d);if("string"==typeof b)a.appendChild(document.createTextNode(b));
else if(b)for(c=0;c<b.length;++c)a.appendChild(b[c]);return a}function Wb(a,b){3==b.nodeType&&(b=b.parentNode);if(a.contains)return a.contains(b);do if(11==b.nodeType&&(b=b.host),b==a)return!0;while(b=b.parentNode)}function oa(){var a;try{a=document.activeElement}catch(b){a=document.body||null}for(;a&&a.root&&a.root.activeElement;)a=a.root.activeElement;return a}function Ta(a,b){var c=a.className;Da(b).test(c)||(a.className+=(c?" ":"")+b)}function Ec(a,b){for(var c=a.split(" "),d=0;d<c.length;d++)c[d]&&
!Da(c[d]).test(b)&&(b+=" "+c[d]);return b}function Fc(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b)}}function Ea(a,b,c){b||(b={});for(var d in a)!a.hasOwnProperty(d)||!1===c&&b.hasOwnProperty(d)||(b[d]=a[d]);return b}function aa(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),-1==b&&(b=a.length));d=d||0;for(e=e||0;;){var f=a.indexOf("\t",d);if(0>f||f>=b)return e+(b-d);e+=f-d;e+=c-e%c;d=f+1}}function J(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}
function Gc(a,b,c){for(var d=0,e=0;;){var f=a.indexOf("\t",d);-1==f&&(f=a.length);var g=f-d;if(f==a.length||e+g>=b)return d+Math.min(g,b-e);e+=f-d;e+=c-e%c;d=f+1;if(e>=b)return d}}function Hc(a){for(;Xb.length<=a;)Xb.push(z(Xb)+" ");return Xb[a]}function z(a){return a[a.length-1]}function Yb(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d);return c}function Mf(a,b,c){for(var d=0,e=c(b);d<a.length&&c(a[d])<=e;)d++;a.splice(d,0,b)}function Kd(){}function Ld(a,b){var c;Object.create?c=Object.create(a):
(Kd.prototype=a,c=new Kd);b&&Ea(b,c);return c}function Ic(a){return/\w/.test(a)||""<a&&(a.toUpperCase()!=a.toLowerCase()||Nf.test(a))}function Zb(a,b){return b?-1<b.source.indexOf("\\w")&&Ic(a)?!0:b.test(a):Ic(a)}function Md(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function Jc(a){return 768<=a.charCodeAt(0)&&Of.test(a)}function Nd(a,b,c){for(;(0>c?0<b:b<a.length)&&Jc(a.charAt(b));)b+=c;return b}function $b(a,b,c){for(;;){if(1>=Math.abs(b-c))return a(b)?b:c;var d=Math.floor((b+
c)/2);a(d)?c=d:b=d}}function Pf(a,b,c){this.input=c;this.scrollbarFiller=r("div",null,"CodeMirror-scrollbar-filler");this.scrollbarFiller.setAttribute("cm-not-content","true");this.gutterFiller=r("div",null,"CodeMirror-gutter-filler");this.gutterFiller.setAttribute("cm-not-content","true");this.lineDiv=r("div",null,"CodeMirror-code");this.selectionDiv=r("div",null,null,"position: relative; z-index: 1");this.cursorDiv=r("div",null,"CodeMirror-cursors");this.measure=r("div",null,"CodeMirror-measure");
this.lineMeasure=r("div",null,"CodeMirror-measure");this.lineSpace=r("div",[this.measure,this.lineMeasure,this.selectionDiv,this.cursorDiv,this.lineDiv],null,"position: relative; outline: none");this.mover=r("div",[r("div",[this.lineSpace],"CodeMirror-lines")],null,"position: relative");this.sizer=r("div",[this.mover],"CodeMirror-sizer");this.sizerWidth=null;this.heightForcer=r("div",null,null,"position: absolute; height: 30px; width: 1px;");this.gutters=r("div",null,"CodeMirror-gutters");this.lineGutter=
null;this.scroller=r("div",[this.sizer,this.heightForcer,this.gutters],"CodeMirror-scroll");this.scroller.setAttribute("tabIndex","-1");this.wrapper=r("div",[this.scrollbarFiller,this.gutterFiller,this.scroller],"CodeMirror");A&&8>C&&(this.gutters.style.zIndex=-1,this.scroller.style.paddingRight=0);K||va&&qb||(this.scroller.draggable=!0);a&&(a.appendChild?a.appendChild(this.wrapper):a(this.wrapper));this.reportedViewFrom=this.reportedViewTo=this.viewFrom=this.viewTo=b.first;this.view=[];this.externalMeasured=
this.renderedView=null;this.lastWrapHeight=this.lastWrapWidth=this.viewOffset=0;this.updateLineNumbers=null;this.nativeBarWidth=this.barHeight=this.barWidth=0;this.scrollbarsClipped=!1;this.lineNumWidth=this.lineNumInnerWidth=this.lineNumChars=null;this.alignWidgets=!1;this.maxLine=this.cachedCharWidth=this.cachedTextHeight=this.cachedPaddingH=null;this.maxLineLength=0;this.maxLineChanged=!1;this.wheelDX=this.wheelDY=this.wheelStartX=this.wheelStartY=null;this.shift=!1;this.activeTouch=this.selForContextMenu=
null;c.init(this)}function u(a,b){b-=a.first;if(0>b||b>=a.size)throw Error("There is no line "+(b+a.first)+" in the document.");for(var c=a;!c.lines;)for(var d=0;;++d){var e=c.children[d],f=e.chunkSize();if(b<f){c=e;break}b-=f}return c.lines[b]}function Fa(a,b,c){var d=[],e=b.line;a.iter(b.line,c.line+1,function(a){a=a.text;e==c.line&&(a=a.slice(0,c.ch));e==b.line&&(a=a.slice(b.ch));d.push(a);++e});return d}function Kc(a,b,c){var d=[];a.iter(b,c,function(a){d.push(a.text)});return d}function ia(a,
b){var c=b-a.height;if(c)for(var d=a;d;d=d.parent)d.height+=c}function B(a){if(null==a.parent)return null;var b=a.parent;a=J(b.lines,a);for(var c=b.parent;c;b=c,c=c.parent)for(var d=0;c.children[d]!=b;++d)a+=c.children[d].chunkSize();return a+b.first}function Ga(a,b){var c=a.first;a:do{for(var d=0;d<a.children.length;++d){var e=a.children[d],f=e.height;if(b<f){a=e;continue a}b-=f;c+=e.chunkSize()}return c}while(!a.lines);for(d=0;d<a.lines.length;++d){e=a.lines[d].height;if(b<e)break;b-=e}return c+
d}function rb(a,b){return b>=a.first&&b<a.first+a.size}function Lc(a,b){return String(a.lineNumberFormatter(b+a.firstLineNumber))}function q(a,b,c){void 0===c&&(c=null);if(!(this instanceof q))return new q(a,b,c);this.line=a;this.ch=b;this.sticky=c}function v(a,b){return a.line-b.line||a.ch-b.ch}function Mc(a,b){return a.sticky==b.sticky&&0==v(a,b)}function Nc(a){return q(a.line,a.ch)}function ac(a,b){return 0>v(a,b)?b:a}function bc(a,b){return 0>v(a,b)?a:b}function w(a,b){if(b.line<a.first)return q(a.first,
0);var c=a.first+a.size-1;if(b.line>c)return q(c,u(a,c).text.length);var c=u(a,b.line).text.length,d=b.ch,c=null==d||d>c?q(b.line,c):0>d?q(b.line,0):b;return c}function Od(a,b){for(var c=[],d=0;d<b.length;d++)c[d]=w(a,b[d]);return c}function cc(a,b,c){this.marker=a;this.from=b;this.to=c}function sb(a,b){if(a)for(var c=0;c<a.length;++c){var d=a[c];if(d.marker==b)return d}}function Oc(a,b){if(b.full)return null;var c=rb(a,b.from.line)&&u(a,b.from.line).markedSpans,d=rb(a,b.to.line)&&u(a,b.to.line).markedSpans;
if(!c&&!d)return null;var e=b.from.ch,f=b.to.ch,g=0==v(b.from,b.to),h;if(c)for(var k=0;k<c.length;++k){var l=c[k],m=l.marker;if(null==l.from||(m.inclusiveLeft?l.from<=e:l.from<e)||!(l.from!=e||"bookmark"!=m.type||g&&l.marker.insertLeft)){var n=null==l.to||(m.inclusiveRight?l.to>=e:l.to>e);(h||(h=[])).push(new cc(m,l.from,n?null:l.to))}}var c=h,p;if(d)for(h=0;h<d.length;++h)if(k=d[h],l=k.marker,null==k.to||(l.inclusiveRight?k.to>=f:k.to>f)||k.from==f&&"bookmark"==l.type&&(!g||k.marker.insertLeft))m=
null==k.from||(l.inclusiveLeft?k.from<=f:k.from<f),(p||(p=[])).push(new cc(l,m?null:k.from-f,null==k.to?null:k.to-f));d=p;f=1==b.text.length;g=z(b.text).length+(f?e:0);if(c)for(p=0;p<c.length;++p)if(h=c[p],null==h.to)(k=sb(d,h.marker),k)?f&&(h.to=null==k.to?null:k.to+g):h.to=e;if(d)for(e=0;e<d.length;++e)p=d[e],null!=p.to&&(p.to+=g),null==p.from?sb(c,p.marker)||(p.from=g,f&&(c||(c=[])).push(p)):(p.from+=g,f&&(c||(c=[])).push(p));c&&(c=Pd(c));d&&d!=c&&(d=Pd(d));e=[c];if(!f){var f=b.text.length-2,t;
if(0<f&&c)for(g=0;g<c.length;++g)null==c[g].to&&(t||(t=[])).push(new cc(c[g].marker,null,null));for(c=0;c<f;++c)e.push(t);e.push(d)}return e}function Pd(a){for(var b=0;b<a.length;++b){var c=a[b];null!=c.from&&c.from==c.to&&!1!==c.marker.clearWhenEmpty&&a.splice(b--,1)}return a.length?a:null}function Qf(a,b,c){var d=null;a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var b=0;b<a.markedSpans.length;++b){var c=a.markedSpans[b].marker;!c.readOnly||d&&-1!=J(d,c)||(d||(d=[])).push(c)}});if(!d)return null;
a=[{from:b,to:c}];for(b=0;b<d.length;++b){c=d[b];for(var e=c.find(0),f=0;f<a.length;++f){var g=a[f];if(!(0>v(g.to,e.from)||0<v(g.from,e.to))){var h=[f,1],k=v(g.from,e.from),l=v(g.to,e.to);(0>k||!c.inclusiveLeft&&!k)&&h.push({from:g.from,to:e.from});(0<l||!c.inclusiveRight&&!l)&&h.push({from:e.to,to:g.to});a.splice.apply(a,h);f+=h.length-3}}}return a}function Qd(a){var b=a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function Rd(a,b){if(b){for(var c=0;c<
b.length;++c)b[c].marker.attachLine(a);a.markedSpans=b}}function Sd(a,b){var c=a.lines.length-b.lines.length;if(0!=c)return c;var c=a.find(),d=b.find(),e=v(c.from,d.from)||(a.inclusiveLeft?-1:0)-(b.inclusiveLeft?-1:0);return e?-e:(c=v(c.to,d.to)||(a.inclusiveRight?1:0)-(b.inclusiveRight?1:0))?c:b.id-a.id}function Ha(a,b){var c=wa&&a.markedSpans,d;if(c)for(var e=void 0,f=0;f<c.length;++f)e=c[f],e.marker.collapsed&&null==(b?e.from:e.to)&&(!d||0>Sd(d,e.marker))&&(d=e.marker);return d}function Td(a,b,
c,d,e){a=u(a,b);if(a=wa&&a.markedSpans)for(b=0;b<a.length;++b){var f=a[b];if(f.marker.collapsed){var g=f.marker.find(0),h=v(g.from,c)||(f.marker.inclusiveLeft?-1:0)-(e.inclusiveLeft?-1:0),k=v(g.to,d)||(f.marker.inclusiveRight?1:0)-(e.inclusiveRight?1:0);if(!(0<=h&&0>=k||0>=h&&0<=k)&&(0>=h&&(f.marker.inclusiveRight&&e.inclusiveLeft?0<=v(g.to,c):0<v(g.to,c))||0<=h&&(f.marker.inclusiveRight&&e.inclusiveLeft?0>=v(g.from,d):0>v(g.from,d))))return!0}}}function ja(a){for(var b;b=Ha(a,!0);)a=b.find(-1,!0).line;
return a}function Pc(a,b){var c=u(a,b),d=ja(c);return c==d?b:B(d)}function Ud(a,b){if(b>a.lastLine())return b;var c=u(a,b),d;if(!Ia(a,c))return b;for(;d=Ha(c,!1);)c=d.find(1,!0).line;return B(c)+1}function Ia(a,b){var c=wa&&b.markedSpans;if(c)for(var d=void 0,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed&&(null==d.from||!d.marker.widgetNode&&0==d.from&&d.marker.inclusiveLeft&&Qc(a,b,d)))return!0}function Qc(a,b,c){if(null==c.to)return b=c.marker.find(1,!0),Qc(a,b.line,sb(b.line.markedSpans,c.marker));
if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var d=void 0,e=0;e<b.markedSpans.length;++e)if(d=b.markedSpans[e],d.marker.collapsed&&!d.marker.widgetNode&&d.from==c.to&&(null==d.to||d.to!=c.from)&&(d.marker.inclusiveLeft||c.marker.inclusiveRight)&&Qc(a,b,d))return!0}function ka(a){a=ja(a);for(var b=0,c=a.parent,d=0;d<c.lines.length;++d){var e=c.lines[d];if(e==a)break;else b+=e.height}for(a=c.parent;a;c=a,a=c.parent)for(d=0;d<a.children.length&&(e=a.children[d],e!=c);++d)b+=e.height;
return b}function dc(a){if(0==a.height)return 0;for(var b=a.text.length,c,d=a;c=Ha(d,!0);)c=c.find(0,!0),d=c.from.line,b+=c.from.ch-c.to.ch;for(d=a;c=Ha(d,!1);)a=c.find(0,!0),b-=d.text.length-a.from.ch,d=a.to.line,b+=d.text.length-a.to.ch;return b}function Rc(a){var b=a.display;a=a.doc;b.maxLine=u(a,a.first);b.maxLineLength=dc(b.maxLine);b.maxLineChanged=!0;a.iter(function(a){var d=dc(a);d>b.maxLineLength&&(b.maxLineLength=d,b.maxLine=a)})}function Rf(a,b,c,d){if(!a)return d(b,c,"ltr");for(var e=
!1,f=0;f<a.length;++f){var g=a[f];if(g.from<c&&g.to>b||b==c&&g.to==b)d(Math.max(g.from,b),Math.min(g.to,c),1==g.level?"rtl":"ltr"),e=!0}e||d(b,c,"ltr")}function Sc(a,b,c){var d;tb=null;for(var e=0;e<a.length;++e){var f=a[e];if(f.from<b&&f.to>b)return e;f.to==b&&(f.from!=f.to&&"before"==c?d=e:tb=e);f.from==b&&(f.from!=f.to&&"before"!=c?d=e:tb=e)}return null!=d?d:tb}function xa(a){var b=a.order;null==b&&(b=a.order=Sf(a.text));return b}function Tc(a,b,c){b=Nd(a.text,b+c,c);return 0>b||b>a.text.length?
null:b}function Uc(a,b,c){a=Tc(a,b.ch,c);return null==a?null:new q(b.line,a,0>c?"after":"before")}function Vc(a,b,c,d,e){if(a&&(a=xa(c))){a=0>e?z(a):a[0];var f=0>e==(1==a.level)?"after":"before",g;if(0<a.level){var h=Ua(b,c);g=0>e?c.text.length-1:0;var k=pa(b,h,g).top;g=$b(function(a){return pa(b,h,a).top==k},0>e==(1==a.level)?a.from:a.to-1,g);"before"==f&&(g=Tc(c,g,1,!0))}else g=0>e?a.to:a.from;return new q(d,g,f)}return new q(d,0>e?c.text.length:0,0>e?"before":"after")}function Vd(a,b,c,d){var e=
xa(b);if(!e)return Uc(b,c,d);c.ch>=b.text.length?(c.ch=b.text.length,c.sticky="before"):0>=c.ch&&(c.ch=0,c.sticky="after");var f=Sc(e,c.ch,c.sticky),g=e[f];if(0==g.level%2&&(0<d?g.to>c.ch:g.from<c.ch))return Uc(b,c,d);var h=function(a,d){return Tc(b,a instanceof q?a.ch:a,d)},k,l=function(d){if(!a.options.lineWrapping)return{begin:0,end:b.text.length};var c=k=k||Ua(a,b);d=Ja(a,b,pa(a,c,d),"line").top;return Wd(a,b,c,d)},m=l("before"==c.sticky?h(c,-1):c.ch);if(1==g.level%2){var n=h(c,-d);if(null!=n&&
(0<d?n>=g.from&&n>=m.begin:n<=g.to&&n<=m.end))return new q(c.line,n,0>d?"before":"after")}g=function(a,b,d){for(var f=function(a,b){return b?new q(c.line,h(a,1),"before"):new q(c.line,a,"after")};0<=a&&a<e.length;a+=b){var g=e[a],k=0<b==(1!=g.level),l=k?d.begin:h(d.end,-1);if(g.from<=l&&l<g.to)return f(l,k);l=k?g.from:h(g.to,-1);if(d.begin<=l&&l<d.end)return f(l,k)}};if(f=g(f+d,d,m))return f;m=0<d?m.end:h(m.begin,-1);return null==m||0<d&&m==b.text.length||!(f=g(0<d?0:e.length-1,d,l(m)))?null:f}function da(a,
b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else{var d=(a=a._handlers)&&a[b];d&&(c=J(d,c),-1<c&&(a[b]=d.slice(0,c).concat(d.slice(c+1))))}}function E(a,b){var c=a._handlers&&a._handlers[b]||fc;if(c.length)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)}function G(a,b,c){"string"==typeof b&&(b={type:b,preventDefault:function(){this.defaultPrevented=!0}});E(a,c||b.type,a,b);return Wc(b)||b.codemirrorIgnore}
function Xd(a){var b=a._handlers&&a._handlers.cursorActivity;if(b){a=a.curOp.cursorActivityHandlers||(a.curOp.cursorActivityHandlers=[]);for(var c=0;c<b.length;++c)-1==J(a,b[c])&&a.push(b[c])}}function ba(a,b){return 0<(a._handlers&&a._handlers[b]||fc).length}function Va(a){a.prototype.on=function(a,c){s(this,a,c)};a.prototype.off=function(a,c){da(this,a,c)}}function N(a){a.preventDefault?a.preventDefault():a.returnValue=!1}function Yd(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0}function Wc(a){return null!=
a.defaultPrevented?a.defaultPrevented:0==a.returnValue}function ub(a){N(a);Yd(a)}function Zd(a){var b=a.which;null==b&&(a.button&1?b=1:a.button&2?b=3:a.button&4&&(b=2));ea&&a.ctrlKey&&1==b&&(b=3);return b}function Tf(a){if(null==Xc){var b=r("span","​");W(a,r("span",[b,document.createTextNode("x")]));0!=a.firstChild.offsetHeight&&(Xc=1>=b.offsetWidth&&2<b.offsetHeight&&!(A&&8>C))}a=Xc?r("span","​"):r("span"," ",null,"display: inline-block; width: 1px; margin-right: -1px");a.setAttribute("cm-text",
"");return a}function Uf(a,b){2<arguments.length&&(b.dependencies=Array.prototype.slice.call(arguments,2));Yc[a]=b}function gc(a){if("string"==typeof a&&Wa.hasOwnProperty(a))a=Wa[a];else if(a&&"string"==typeof a.name&&Wa.hasOwnProperty(a.name)){var b=Wa[a.name];"string"==typeof b&&(b={name:b});a=Ld(b,a);a.name=b.name}else{if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+xml$/.test(a))return gc("application/xml");if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+json$/.test(a))return gc("application/json")}return"string"==
typeof a?{name:a}:a||{name:"null"}}function Zc(a,b){b=gc(b);var c=Yc[b.name];if(!c)return Zc(a,"text/plain");c=c(a,b);if(Xa.hasOwnProperty(b.name)){var d=Xa[b.name],e;for(e in d)d.hasOwnProperty(e)&&(c.hasOwnProperty(e)&&(c["_"+e]=c[e]),c[e]=d[e])}c.name=b.name;b.helperType&&(c.helperType=b.helperType);if(b.modeProps)for(var f in b.modeProps)c[f]=b.modeProps[f];return c}function Vf(a,b){var c=Xa.hasOwnProperty(a)?Xa[a]:Xa[a]={};Ea(b,c)}function qa(a,b){if(!0===b)return b;if(a.copyState)return a.copyState(b);
var c={},d;for(d in b){var e=b[d];e instanceof Array&&(e=e.concat([]));c[d]=e}return c}function $c(a,b){for(var c;a.innerMode;){c=a.innerMode(b);if(!c||c.mode==a)break;b=c.state;a=c.mode}return c||{mode:a,state:b}}function $d(a,b,c){return a.startState?a.startState(b,c):!0}function ae(a,b,c,d){var e=[a.state.modeGen],f={};be(a,b.text,a.doc.mode,c,function(a,b){return e.push(a,b)},f,d);c=function(d){var c=a.state.overlays[d],k=1,l=0;be(a,b.text,c.mode,!0,function(a,b){for(var d=k;l<a;){var f=e[k];
f>a&&e.splice(k,1,a,e[k+1],f);k+=2;l=Math.min(a,f)}if(b)if(c.opaque)e.splice(d,k-d,a,"overlay "+b),k=d+2;else for(;d<k;d+=2)f=e[d+1],e[d+1]=(f?f+" ":"")+"overlay "+b},f)};for(d=0;d<a.state.overlays.length;++d)c(d);return{styles:e,classes:f.bgClass||f.textClass?f:null}}function ce(a,b,c){if(!b.styles||b.styles[0]!=a.state.modeGen){var d=vb(a,B(b)),e=ae(a,b,b.text.length>a.options.maxHighlightLength?qa(a.doc.mode,d):d);b.stateAfter=d;b.styles=e.styles;e.classes?b.styleClasses=e.classes:b.styleClasses&&
(b.styleClasses=null);c===a.doc.frontier&&a.doc.frontier++}return b.styles}function vb(a,b,c){var d=a.doc,e=a.display;if(!d.mode.startState)return!0;var f=Wf(a,b,c),g=f>d.first&&u(d,f-1).stateAfter,g=g?qa(d.mode,g):$d(d.mode);d.iter(f,b,function(c){ad(a,c.text,g);c.stateAfter=f==b-1||0==f%5||f>=e.viewFrom&&f<e.viewTo?qa(d.mode,g):null;++f});c&&(d.frontier=f);return g}function ad(a,b,c,d){var e=a.doc.mode;a=new H(b,a.options.tabSize);a.start=a.pos=d||0;for(""==b&&de(e,c);!a.eol();)bd(e,a,c),a.start=
a.pos}function de(a,b){if(a.blankLine)return a.blankLine(b);if(a.innerMode){var c=$c(a,b);if(c.mode.blankLine)return c.mode.blankLine(c.state)}}function bd(a,b,c,d){for(var e=0;10>e;e++){d&&(d[0]=$c(a,c).mode);var f=a.token(b,c);if(b.pos>b.start)return f}throw Error("Mode "+a.name+" failed to advance stream.");}function ee(a,b,c,d){var e=function(a){return{start:m.start,end:m.pos,string:m.current(),type:h||null,state:a?qa(f.mode,l):l}},f=a.doc,g=f.mode,h;b=w(f,b);var k=u(f,b.line),l=vb(a,b.line,c),
m=new H(k.text,a.options.tabSize),n;for(d&&(n=[]);(d||m.pos<b.ch)&&!m.eol();)m.start=m.pos,h=bd(g,m,l),d&&n.push(e(!0));return d?n:e()}function fe(a,b){if(a)for(;;){var c=a.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":"textClass";null==b[d]?b[d]=c[2]:(new RegExp("(?:^|s)"+c[2]+"(?:$|s)")).test(b[d])||(b[d]+=" "+c[2])}return a}function be(a,b,c,d,e,f,g){var h=c.flattenSpans;null==h&&(h=a.options.flattenSpans);var k=0,
l=null,m=new H(b,a.options.tabSize),n,p=a.options.addModeClass&&[null];for(""==b&&fe(de(c,d),f);!m.eol();){m.pos>a.options.maxHighlightLength?(h=!1,g&&ad(a,b,d,m.pos),m.pos=b.length,n=null):n=fe(bd(c,m,d,p),f);if(p){var t=p[0].name;t&&(n="m-"+(n?t+" "+n:t))}if(!h||l!=n){for(;k<m.start;)k=Math.min(m.start,k+5E3),e(k,l);l=n}m.start=m.pos}for(;k<m.pos;)a=Math.min(m.pos,k+5E3),e(a,l),k=a}function Wf(a,b,c){for(var d,e,f=a.doc,g=c?-1:b-(a.doc.mode.innerMode?1E3:100);b>g;--b){if(b<=f.first)return f.first;
var h=u(f,b-1);if(h.stateAfter&&(!c||b<=f.frontier))return b;h=aa(h.text,null,a.options.tabSize);if(null==e||d>h)e=b-1,d=h}return e}function ge(a,b){if(!a||/^\s*$/.test(a))return null;var c=b.addModeClass?Xf:Yf;return c[a]||(c[a]=a.replace(/\S+/g,"cm-$\x26"))}function he(a,b){var c=r("span",null,null,K?"padding-right: .1px":null),d={pre:r("pre",[c],"CodeMirror-line"),content:c,col:0,pos:0,cm:a,trailingSpace:!1,splitSpaces:(A||K)&&a.getOption("lineWrapping")};c.setAttribute("role","presentation");
d.pre.setAttribute("role","presentation");b.measure={};for(c=0;c<=(b.rest?b.rest.length:0);c++){var e=c?b.rest[c-1]:b.line,f=void 0;d.pos=0;d.addToken=Zf;var g;g=a.display.measure;if(null!=cd)g=cd;else{var h=W(g,document.createTextNode("AخA")),k=Ya(h,0,1).getBoundingClientRect(),h=Ya(h,1,2).getBoundingClientRect();$(g);g=k&&k.left!=k.right?cd=3>h.right-k.right:!1}g&&(f=xa(e))&&(d.addToken=$f(d.addToken,f));d.map=[];g=b!=a.display.externalMeasured&&B(e);a:{f=d;g=ce(a,e,g);var l=e.markedSpans,k=e.text,
h=0;if(l)for(var m=k.length,n=0,p=1,t="",q=void 0,u=void 0,s=0,v=void 0,w=void 0,z=void 0,ec=void 0,O=void 0;;){if(s==n){for(var v=w=z=ec=u="",O=null,s=Infinity,ra=[],U=void 0,ca=0;ca<l.length;++ca){var x=l[ca],y=x.marker;"bookmark"==y.type&&x.from==n&&y.widgetNode?ra.push(y):x.from<=n&&(null==x.to||x.to>n||y.collapsed&&x.to==n&&x.from==n)?(null!=x.to&&x.to!=n&&s>x.to&&(s=x.to,w=""),y.className&&(v+=" "+y.className),y.css&&(u=(u?u+";":"")+y.css),y.startStyle&&x.from==n&&(z+=" "+y.startStyle),y.endStyle&&
x.to==s&&(U||(U=[])).push(y.endStyle,x.to),y.title&&!ec&&(ec=y.title),y.collapsed&&(!O||0>Sd(O.marker,y))&&(O=x)):x.from>n&&s>x.from&&(s=x.from)}if(U)for(ca=0;ca<U.length;ca+=2)U[ca+1]==s&&(w+=" "+U[ca]);if(!O||O.from==n)for(U=0;U<ra.length;++U)ie(f,0,ra[U]);if(O&&(O.from||0)==n){ie(f,(null==O.to?m+1:O.to)-n,O.marker,null==O.from);if(null==O.to)break a;O.to==n&&(O=!1)}}if(n>=m)break;for(ra=Math.min(m,s);;){if(t){U=n+t.length;O||(ca=U>ra?t.slice(0,ra-n):t,f.addToken(f,ca,q?q+v:v,z,n+ca.length==s?w:
"",ec,u));if(U>=ra){t=t.slice(ra-n);n=ra;break}n=U;z=""}t=k.slice(h,h=g[p++]);q=ge(g[p++],f.cm.options)}}else for(l=1;l<g.length;l+=2)f.addToken(f,k.slice(h,h=g[l]),ge(g[l+1],f.cm.options))}e.styleClasses&&(e.styleClasses.bgClass&&(d.bgClass=Ec(e.styleClasses.bgClass,d.bgClass||"")),e.styleClasses.textClass&&(d.textClass=Ec(e.styleClasses.textClass,d.textClass||"")));0==d.map.length&&d.map.push(0,0,d.content.appendChild(Tf(a.display.measure)));0==c?(b.measure.map=d.map,b.measure.cache={}):((b.measure.maps||
(b.measure.maps=[])).push(d.map),(b.measure.caches||(b.measure.caches=[])).push({}))}K&&(c=d.content.lastChild,/\bcm-tab\b/.test(c.className)||c.querySelector&&c.querySelector(".cm-tab"))&&(d.content.className="cm-tab-wrap-hack");E(a,"renderLine",a,b.line,d.pre);d.pre.className&&(d.textClass=Ec(d.pre.className,d.textClass||""));return d}function ag(a){var b=r("span","•","cm-invalidchar");b.title="\\u"+a.charCodeAt(0).toString(16);b.setAttribute("aria-label",b.title);return b}function Zf(a,b,c,d,e,
f,g){if(b){var h;if(a.splitSpaces)if(h=a.trailingSpace,1<b.length&&!/  /.test(b))h=b;else{for(var k="",l=0;l<b.length;l++){var m=b.charAt(l);" "!=m||!h||l!=b.length-1&&32!=b.charCodeAt(l+1)||(m=" ");k+=m;h=" "==m}h=k}else h=b;k=h;l=a.cm.state.specialChars;m=!1;if(l.test(b)){h=document.createDocumentFragment();for(var n=0;;){l.lastIndex=n;var p=l.exec(b),t=p?p.index-n:b.length-n;if(t){var q=document.createTextNode(k.slice(n,n+t));A&&9>C?h.appendChild(r("span",[q])):h.appendChild(q);a.map.push(a.pos,
a.pos+t,q);a.col+=t;a.pos+=t}if(!p)break;n+=t+1;t=void 0;"\t"==p[0]?(p=a.cm.options.tabSize,p-=a.col%p,t=h.appendChild(r("span",Hc(p),"cm-tab")),t.setAttribute("role","presentation"),t.setAttribute("cm-text","\t"),a.col+=p):("\r"==p[0]||"\n"==p[0]?(t=h.appendChild(r("span","\r"==p[0]?"␍":"␤","cm-invalidchar")),t.setAttribute("cm-text",p[0])):(t=a.cm.options.specialCharPlaceholder(p[0]),t.setAttribute("cm-text",p[0]),A&&9>C?h.appendChild(r("span",[t])):h.appendChild(t)),a.col+=1);a.map.push(a.pos,
a.pos+1,t);a.pos++}}else a.col+=b.length,h=document.createTextNode(k),a.map.push(a.pos,a.pos+b.length,h),A&&9>C&&(m=!0),a.pos+=b.length;a.trailingSpace=32==k.charCodeAt(b.length-1);if(c||d||e||m||g)return b=c||"",d&&(b+=d),e&&(b+=e),d=r("span",[h],b,g),f&&(d.title=f),a.content.appendChild(d);a.content.appendChild(h)}}function $f(a,b){return function(c,d,e,f,g,h,k){e=e?e+" cm-force-border":"cm-force-border";for(var l=c.pos,m=l+d.length;;){for(var n=void 0,p=0;p<b.length&&!(n=b[p],n.to>l&&n.from<=l);p++);
if(n.to>=m)return a(c,d,e,f,g,h,k);a(c,d.slice(0,n.to-l),e,f,null,h,k);f=null;d=d.slice(n.to-l);l=n.to}}}function ie(a,b,c,d){var e=!d&&c.widgetNode;e&&a.map.push(a.pos,a.pos+b,e);!d&&a.cm.display.input.needsContentAttribute&&(e||(e=a.content.appendChild(document.createElement("span"))),e.setAttribute("cm-marker",c.id));e&&(a.cm.display.input.setUneditable(e),a.content.appendChild(e));a.pos+=b;a.trailingSpace=!1}function je(a,b,c){for(var d=this.line=b,e;d=Ha(d,!1);)d=d.find(1,!0).line,(e||(e=[])).push(d);
this.size=(this.rest=e)?B(z(this.rest))-c+1:1;this.node=this.text=null;this.hidden=Ia(a,b)}function hc(a,b,c){var d=[],e;for(e=b;e<c;)b=new je(a.doc,u(a.doc,e),e),e+=b.size,d.push(b);return d}function bg(a,b){var c=a.ownsGroup;if(c)try{var d=c.delayedCallbacks,e=0;do{for(;e<d.length;e++)d[e].call(null);for(var f=0;f<c.ops.length;f++){var g=c.ops[f];if(g.cursorActivityHandlers)for(;g.cursorActivityCalled<g.cursorActivityHandlers.length;)g.cursorActivityHandlers[g.cursorActivityCalled++].call(null,
g.cm)}}while(e<d.length)}finally{Za=null,b(c)}}function P(a,b){var c=a._handlers&&a._handlers[b]||fc;if(c.length){var d=Array.prototype.slice.call(arguments,2),e;Za?e=Za.delayedCallbacks:wb?e=wb:(e=wb=[],setTimeout(cg,0));for(var f=function(a){e.push(function(){return c[a].apply(null,d)})},g=0;g<c.length;++g)f(g)}}function cg(){var a=wb;wb=null;for(var b=0;b<a.length;++b)a[b]()}function ke(a,b,c,d){for(var e=0;e<b.changes.length;e++){var f=b.changes[e];if("text"==f){var f=b,g=f.text.className,h=le(a,
f);f.text==f.node&&(f.node=h.pre);f.text.parentNode.replaceChild(h.pre,f.text);f.text=h.pre;h.bgClass!=f.bgClass||h.textClass!=f.textClass?(f.bgClass=h.bgClass,f.textClass=h.textClass,dd(f)):g&&(f.text.className=g)}else if("gutter"==f)me(a,b,c,d);else if("class"==f)dd(b);else if("widget"==f){f=a;g=b;h=d;g.alignable&&(g.alignable=null);for(var k=g.node.firstChild,l=void 0;k;k=l)l=k.nextSibling,"CodeMirror-linewidget"==k.className&&g.node.removeChild(k);ne(f,g,h)}}b.changes=null}function xb(a){a.node==
a.text&&(a.node=r("div",null,null,"position: relative"),a.text.parentNode&&a.text.parentNode.replaceChild(a.node,a.text),a.node.appendChild(a.text),A&&8>C&&(a.node.style.zIndex=2));return a.node}function le(a,b){var c=a.display.externalMeasured;return c&&c.line==b.line?(a.display.externalMeasured=null,b.measure=c.measure,c.built):he(a,b)}function dd(a){var b=a.bgClass?a.bgClass+" "+(a.line.bgClass||""):a.line.bgClass;b&&(b+=" CodeMirror-linebackground");if(a.background)b?a.background.className=b:
(a.background.parentNode.removeChild(a.background),a.background=null);else if(b){var c=xb(a);a.background=c.insertBefore(r("div",null,b),c.firstChild)}a.line.wrapClass?xb(a).className=a.line.wrapClass:a.node!=a.text&&(a.node.className="");a.text.className=(a.textClass?a.textClass+" "+(a.line.textClass||""):a.line.textClass)||""}function me(a,b,c,d){b.gutter&&(b.node.removeChild(b.gutter),b.gutter=null);b.gutterBackground&&(b.node.removeChild(b.gutterBackground),b.gutterBackground=null);if(b.line.gutterClass){var e=
xb(b);b.gutterBackground=r("div",null,"CodeMirror-gutter-background "+b.line.gutterClass,"left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px; width: "+d.gutterTotalWidth+"px");e.insertBefore(b.gutterBackground,b.text)}e=b.line.gutterMarkers;if(a.options.lineNumbers||e){var f=xb(b),g=b.gutter=r("div",null,"CodeMirror-gutter-wrapper","left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px");a.display.input.setUneditable(g);f.insertBefore(g,b.text);b.line.gutterClass&&(g.className+=
" "+b.line.gutterClass);!a.options.lineNumbers||e&&e["CodeMirror-linenumbers"]||(b.lineNumber=g.appendChild(r("div",Lc(a.options,c),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+d.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+a.display.lineNumInnerWidth+"px")));if(e)for(b=0;b<a.options.gutters.length;++b)c=a.options.gutters[b],(f=e.hasOwnProperty(c)&&e[c])&&g.appendChild(r("div",[f],"CodeMirror-gutter-elt","left: "+d.gutterLeft[c]+"px; width: "+d.gutterWidth[c]+"px"))}}function dg(a,
b,c,d){var e=le(a,b);b.text=b.node=e.pre;e.bgClass&&(b.bgClass=e.bgClass);e.textClass&&(b.textClass=e.textClass);dd(b);me(a,b,c,d);ne(a,b,d);return b.node}function ne(a,b,c){oe(a,b.line,b,c,!0);if(b.rest)for(var d=0;d<b.rest.length;d++)oe(a,b.rest[d],b,c,!1)}function oe(a,b,c,d,e){if(b.widgets){var f=xb(c),g=0;for(b=b.widgets;g<b.length;++g){var h=b[g],k=r("div",[h.node],"CodeMirror-linewidget");h.handleMouseEvents||k.setAttribute("cm-ignore-events","true");var l=h,m=k,n=d;if(l.noHScroll){(c.alignable||
(c.alignable=[])).push(m);var p=n.wrapperWidth;m.style.left=n.fixedPos+"px";l.coverGutter||(p-=n.gutterTotalWidth,m.style.paddingLeft=n.gutterTotalWidth+"px");m.style.width=p+"px"}l.coverGutter&&(m.style.zIndex=5,m.style.position="relative",l.noHScroll||(m.style.marginLeft=-n.gutterTotalWidth+"px"));a.display.input.setUneditable(k);e&&h.above?f.insertBefore(k,c.gutter||c.text):f.appendChild(k);P(h,"redraw")}}}function yb(a){if(null!=a.height)return a.height;var b=a.doc.cm;if(!b)return 0;if(!Wb(document.body,
a.node)){var c="position: relative;";a.coverGutter&&(c+="margin-left: -"+b.display.gutters.offsetWidth+"px;");a.noHScroll&&(c+="width: "+b.display.wrapper.clientWidth+"px;");W(b.display.measure,r("div",[a.node],null,c))}return a.height=a.node.parentNode.offsetHeight}function sa(a,b){for(var c=b.target||b.srcElement;c!=a.wrapper;c=c.parentNode)if(!c||1==c.nodeType&&"true"==c.getAttribute("cm-ignore-events")||c.parentNode==a.sizer&&c!=a.mover)return!0}function ed(a){return a.mover.offsetHeight-a.lineSpace.offsetHeight}
function pe(a){if(a.cachedPaddingH)return a.cachedPaddingH;var b=W(a.measure,r("pre","x")),b=window.getComputedStyle?window.getComputedStyle(b):b.currentStyle,b={left:parseInt(b.paddingLeft),right:parseInt(b.paddingRight)};isNaN(b.left)||isNaN(b.right)||(a.cachedPaddingH=b);return b}function la(a){return 30-a.display.nativeBarWidth}function Ka(a){return a.display.scroller.clientWidth-la(a)-a.display.barWidth}function fd(a){return a.display.scroller.clientHeight-la(a)-a.display.barHeight}function qe(a,
b,c){if(a.line==b)return{map:a.measure.map,cache:a.measure.cache};for(var d=0;d<a.rest.length;d++)if(a.rest[d]==b)return{map:a.measure.maps[d],cache:a.measure.caches[d]};for(b=0;b<a.rest.length;b++)if(B(a.rest[b])>c)return{map:a.measure.maps[b],cache:a.measure.caches[b],before:!0}}function gd(a,b){if(b>=a.display.viewFrom&&b<a.display.viewTo)return a.display.view[La(a,b)];var c=a.display.externalMeasured;if(c&&b>=c.lineN&&b<c.lineN+c.size)return c}function Ua(a,b){var c=B(b),d=gd(a,c);d&&!d.text?
d=null:d&&d.changes&&(ke(a,d,c,hd(a)),a.curOp.forceUpdate=!0);if(!d){var e;e=ja(b);d=B(e);e=a.display.externalMeasured=new je(a.doc,e,d);e.lineN=d;d=e.built=he(a,e);e.text=d.pre;W(a.display.lineMeasure,d.pre);d=e}c=qe(d,b,c);return{line:b,view:d,rect:null,map:c.map,cache:c.cache,before:c.before,hasHeights:!1}}function pa(a,b,c,d,e){b.before&&(c=-1);var f=c+(d||"");if(b.cache.hasOwnProperty(f))a=b.cache[f];else{b.rect||(b.rect=b.view.text.getBoundingClientRect());if(!b.hasHeights){var g=b.view,h=b.rect,
k=a.options.lineWrapping,l=k&&Ka(a);if(!g.measure.heights||k&&g.measure.width!=l){var m=g.measure.heights=[];if(k)for(g.measure.width=l,g=g.text.firstChild.getClientRects(),k=0;k<g.length-1;k++){var l=g[k],n=g[k+1];2<Math.abs(l.bottom-n.bottom)&&m.push((l.bottom+n.top)/2-h.top)}m.push(h.bottom-h.top)}b.hasHeights=!0}m=d;g=re(b.map,c,m);d=g.node;h=g.start;k=g.end;c=g.collapse;var p;if(3==d.nodeType){for(var t=0;4>t;t++){for(;h&&Jc(b.line.text.charAt(g.coverStart+h));)--h;for(;g.coverStart+k<g.coverEnd&&
Jc(b.line.text.charAt(g.coverStart+k));)++k;if(A&&9>C&&0==h&&k==g.coverEnd-g.coverStart)p=d.parentNode.getBoundingClientRect();else{p=Ya(d,h,k).getClientRects();k=se;if("left"==m)for(l=0;l<p.length&&(k=p[l]).left==k.right;l++);else for(l=p.length-1;0<=l&&(k=p[l]).left==k.right;l--);p=k}if(p.left||p.right||0==h)break;k=h;--h;c="right"}A&&11>C&&((t=!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI)||(null!=id?t=id:(m=W(a.display.measure,r("span","x")),t=m.getBoundingClientRect(),
m=Ya(m,0,1).getBoundingClientRect(),t=id=1<Math.abs(t.left-m.left)),t=!t),t||(t=screen.logicalXDPI/screen.deviceXDPI,m=screen.logicalYDPI/screen.deviceYDPI,p={left:p.left*t,right:p.right*t,top:p.top*m,bottom:p.bottom*m}))}else 0<h&&(c=m="right"),p=a.options.lineWrapping&&1<(t=d.getClientRects()).length?t["right"==m?t.length-1:0]:d.getBoundingClientRect();!(A&&9>C)||h||p&&(p.left||p.right)||(p=(p=d.parentNode.getClientRects()[0])?{left:p.left,right:p.left+zb(a.display),top:p.top,bottom:p.bottom}:se);
d=p.top-b.rect.top;h=p.bottom-b.rect.top;t=(d+h)/2;m=b.view.measure.heights;for(g=0;g<m.length-1&&!(t<m[g]);g++);c={left:("right"==c?p.right:p.left)-b.rect.left,right:("left"==c?p.left:p.right)-b.rect.left,top:g?m[g-1]:0,bottom:m[g]};p.left||p.right||(c.bogus=!0);a.options.singleCursorHeightPerLine||(c.rtop=d,c.rbottom=h);a=c;a.bogus||(b.cache[f]=a)}return{left:a.left,right:a.right,top:e?a.rtop:a.top,bottom:e?a.rbottom:a.bottom}}function re(a,b,c){for(var d,e,f,g,h,k,l=0;l<a.length;l+=3){h=a[l];k=
a[l+1];if(b<h)e=0,f=1,g="left";else if(b<k)e=b-h,f=e+1;else if(l==a.length-3||b==k&&a[l+3]>b)f=k-h,e=f-1,b>=k&&(g="right");if(null!=e){d=a[l+2];h==k&&c==(d.insertLeft?"left":"right")&&(g=c);if("left"==c&&0==e)for(;l&&a[l-2]==a[l-3]&&a[l-1].insertLeft;)d=a[(l-=3)+2],g="left";if("right"==c&&e==k-h)for(;l<a.length-3&&a[l+3]==a[l+4]&&!a[l+5].insertLeft;)d=a[(l+=3)+2],g="right";break}}return{node:d,start:e,end:f,collapse:g,coverStart:h,coverEnd:k}}function te(a){if(a.measure&&(a.measure.cache={},a.measure.heights=
null,a.rest))for(var b=0;b<a.rest.length;b++)a.measure.caches[b]={}}function ue(a){a.display.externalMeasure=null;$(a.display.lineMeasure);for(var b=0;b<a.display.view.length;b++)te(a.display.view[b])}function Ab(a){ue(a);a.display.cachedCharWidth=a.display.cachedTextHeight=a.display.cachedPaddingH=null;a.options.lineWrapping||(a.display.maxLineChanged=!0);a.display.lineNumChars=null}function Ja(a,b,c,d,e){if(!e&&b.widgets)for(e=0;e<b.widgets.length;++e)if(b.widgets[e].above){var f=yb(b.widgets[e]);
c.top+=f;c.bottom+=f}if("line"==d)return c;d||(d="local");b=ka(b);b="local"==d?b+a.display.lineSpace.offsetTop:b-a.display.viewOffset;if("page"==d||"window"==d)a=a.display.lineSpace.getBoundingClientRect(),b+=a.top+("window"==d?0:window.pageYOffset||(document.documentElement||document.body).scrollTop),d=a.left+("window"==d?0:window.pageXOffset||(document.documentElement||document.body).scrollLeft),c.left+=d,c.right+=d;c.top+=b;c.bottom+=b;return c}function ve(a,b,c){if("div"==c)return b;var d=b.left;
b=b.top;"page"==c?(d-=window.pageXOffset||(document.documentElement||document.body).scrollLeft,b-=window.pageYOffset||(document.documentElement||document.body).scrollTop):"local"!=c&&c||(c=a.display.sizer.getBoundingClientRect(),d+=c.left,b+=c.top);a=a.display.lineSpace.getBoundingClientRect();return{left:d-a.left,top:b-a.top}}function ic(a,b,c,d,e){d||(d=u(a.doc,b.line));var f=d;b=b.ch;d=pa(a,Ua(a,d),b,e);return Ja(a,f,d,c)}function fa(a,b,c,d,e,f){function g(b,g){var h=pa(a,e,b,g?"right":"left",
f);g?h.left=h.right:h.right=h.left;return Ja(a,d,h,c)}function h(a,b,d){return g(d?a-1:a,0!=k[b].level%2!=d)}d=d||u(a.doc,b.line);e||(e=Ua(a,d));var k=xa(d),l=b.ch;b=b.sticky;l>=d.text.length?(l=d.text.length,b="before"):0>=l&&(l=0,b="after");if(!k)return g("before"==b?l-1:l,"before"==b);var m=Sc(k,l,b),n=tb,m=h(l,m,"before"==b);null!=n&&(m.other=h(l,n,"before"!=b));return m}function we(a,b){var c=0;b=w(a.doc,b);a.options.lineWrapping||(c=zb(a.display)*b.ch);var d=u(a.doc,b.line),e=ka(d)+a.display.lineSpace.offsetTop;
return{left:c,right:c,top:e,bottom:e+d.height}}function jd(a,b,c){var d=a.doc;c+=a.display.viewOffset;if(0>c)return a=q(d.first,0,null),a.xRel=-1,a.outside=!0,a;var e=Ga(d,c),f=d.first+d.size-1;if(e>f)return a=u(d,f).text.length,a=q(d.first+d.size-1,a,null),a.xRel=1,a.outside=!0,a;0>b&&(b=0);for(f=u(d,e);;)if(d=eg(a,f,e,b,c),f=(e=Ha(f,!1))&&e.find(0,!0),e&&(d.ch>f.from.ch||d.ch==f.from.ch&&0<d.xRel))e=B(f=f.to.line);else return d}function Wd(a,b,c,d){var e=b.text.length,f=$b(function(e){return Ja(a,
b,pa(a,c,e-1),"line").bottom<=d},e,0),e=$b(function(e){return Ja(a,b,pa(a,c,e),"line").top>d},f,e);return{begin:f,end:e}}function eg(a,b,c,d,e){e-=ka(b);var f=0,g=b.text.length,h=Ua(a,b);if(xa(b)){if(a.options.lineWrapping){var k;k=Wd(a,b,h,e);f=k.begin;g=k.end;k}c=new q(c,f);var l=fa(a,c,"line",b,h).left;k=l<d?1:-1;var m=l-d,n;do{l=m;n=c;c=Vd(a,b,c,k);if(null==c||c.ch<f||g<=("before"==c.sticky?c.ch-1:c.ch)){c=n;break}m=fa(a,c,"line",b,h).left-d}while(0>k!=0>m&&Math.abs(m)<=Math.abs(l));if(Math.abs(m)>
Math.abs(l)){if(0>m==0>l)throw Error("Broke out of infinite loop in coordsCharInner");c=n}}else f=$b(function(c){var f=Ja(a,b,pa(a,h,c),"line");return f.top>e?(g=Math.min(c,g),!0):f.bottom<=e?!1:f.left>d?!0:f.right<d?!1:d-f.left<f.right-d},f,g),f=Nd(b.text,f,1),c=new q(c,f,f==g?"before":"after");f=fa(a,c,"line",b,h);if(e<f.top||f.bottom<e)c.outside=!0;c.xRel=d<f.left?-1:d>f.right?1:0;return c}function Ma(a){if(null!=a.cachedTextHeight)return a.cachedTextHeight;if(null==Na){Na=r("pre");for(var b=0;49>
b;++b)Na.appendChild(document.createTextNode("x")),Na.appendChild(r("br"));Na.appendChild(document.createTextNode("x"))}W(a.measure,Na);b=Na.offsetHeight/50;3<b&&(a.cachedTextHeight=b);$(a.measure);return b||1}function zb(a){if(null!=a.cachedCharWidth)return a.cachedCharWidth;var b=r("span","xxxxxxxxxx"),c=r("pre",[b]);W(a.measure,c);b=b.getBoundingClientRect();b=(b.right-b.left)/10;2<b&&(a.cachedCharWidth=b);return b||10}function hd(a){for(var b=a.display,c={},d={},e=b.gutters.clientLeft,f=b.gutters.firstChild,
g=0;f;f=f.nextSibling,++g)c[a.options.gutters[g]]=f.offsetLeft+f.clientLeft+e,d[a.options.gutters[g]]=f.clientWidth;return{fixedPos:kd(b),gutterTotalWidth:b.gutters.offsetWidth,gutterLeft:c,gutterWidth:d,wrapperWidth:b.wrapper.clientWidth}}function kd(a){return a.scroller.getBoundingClientRect().left-a.sizer.getBoundingClientRect().left}function xe(a){var b=Ma(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/zb(a.display)-3);return function(e){if(Ia(a.doc,e))return 0;
var f=0;if(e.widgets)for(var g=0;g<e.widgets.length;g++)e.widgets[g].height&&(f+=e.widgets[g].height);return c?f+(Math.ceil(e.text.length/d)||1)*b:f+b}}function ld(a){var b=a.doc,c=xe(a);b.iter(function(a){var b=c(a);b!=a.height&&ia(a,b)})}function Oa(a,b,c,d){var e=a.display;if(!c&&"true"==(b.target||b.srcElement).getAttribute("cm-not-content"))return null;var f,g;c=e.lineSpace.getBoundingClientRect();try{f=b.clientX-c.left,g=b.clientY-c.top}catch(h){return null}b=jd(a,f,g);var k;d&&1==b.xRel&&(k=
u(a.doc,b.line).text).length==b.ch&&(d=aa(k,k.length,a.options.tabSize)-k.length,b=q(b.line,Math.max(0,Math.round((f-pe(a.display).left)/zb(a.display))-d)));return b}function La(a,b){if(b>=a.display.viewTo)return null;b-=a.display.viewFrom;if(0>b)return null;for(var c=a.display.view,d=0;d<c.length;d++)if(b-=c[d].size,0>b)return d}function Bb(a){a.display.input.showSelection(a.display.input.prepareSelection())}function ye(a,b){for(var c=a.doc,d={},e=d.cursors=document.createDocumentFragment(),f=d.selection=
document.createDocumentFragment(),g=0;g<c.sel.ranges.length;g++)if(!1!==b||g!=c.sel.primIndex){var h=c.sel.ranges[g];if(!(h.from().line>=a.display.viewTo||h.to().line<a.display.viewFrom)){var k=h.empty();(k||a.options.showCursorWhenSelecting)&&ze(a,h.head,e);k||fg(a,h,f)}}return d}function ze(a,b,c){b=fa(a,b,"div",null,null,!a.options.singleCursorHeightPerLine);var d=c.appendChild(r("div"," ","CodeMirror-cursor"));d.style.left=b.left+"px";d.style.top=b.top+"px";d.style.height=Math.max(0,b.bottom-
b.top)*a.options.cursorHeight+"px";b.other&&(a=c.appendChild(r("div"," ","CodeMirror-cursor CodeMirror-secondarycursor")),a.style.display="",a.style.left=b.other.left+"px",a.style.top=b.other.top+"px",a.style.height=.85*(b.other.bottom-b.other.top)+"px")}function fg(a,b,c){function d(a,b,d,c){0>b&&(b=0);b=Math.round(b);c=Math.round(c);h.appendChild(r("div",null,"CodeMirror-selected","position: absolute; left: "+a+"px;\n                             top: "+b+"px; width: "+(null==d?m-a:d)+"px;\n                             height: "+
(c-b)+"px"))}function e(b,c,e){var f=u(g,b),h=f.text.length,k,n;Rf(xa(f),c||0,null==e?h:e,function(g,u,s){var r=ic(a,q(b,g),"div",f,"left"),v,w;g==u?(v=r,s=w=r.left):(v=ic(a,q(b,u-1),"div",f,"right"),"rtl"==s&&(s=r,r=v,v=s),s=r.left,w=v.right);null==c&&0==g&&(s=l);3<v.top-r.top&&(d(s,r.top,null,r.bottom),s=l,r.bottom<v.top&&d(s,r.bottom,null,v.top));null==e&&u==h&&(w=m);if(!k||r.top<k.top||r.top==k.top&&r.left<k.left)k=r;if(!n||v.bottom>n.bottom||v.bottom==n.bottom&&v.right>n.right)n=v;s<l+1&&(s=
l);d(s,v.top,w-s,v.bottom)});return{start:k,end:n}}var f=a.display,g=a.doc,h=document.createDocumentFragment(),k=pe(a.display),l=k.left,m=Math.max(f.sizerWidth,Ka(a)-f.sizer.offsetLeft)-k.right,f=b.from();b=b.to();if(f.line==b.line)e(f.line,f.ch,b.ch);else{var n=u(g,f.line),k=u(g,b.line),k=ja(n)==ja(k),f=e(f.line,f.ch,k?n.text.length+1:null).end;b=e(b.line,k?0:null,b.ch).start;k&&(f.top<b.top-2?(d(f.right,f.top,null,f.bottom),d(l,b.top,b.left,b.bottom)):d(f.right,f.top,b.left-f.right,f.bottom));f.bottom<
b.top&&d(l,f.bottom,null,b.top)}c.appendChild(h)}function md(a){if(a.state.focused){var b=a.display;clearInterval(b.blinker);var c=!0;b.cursorDiv.style.visibility="";0<a.options.cursorBlinkRate?b.blinker=setInterval(function(){return b.cursorDiv.style.visibility=(c=!c)?"":"hidden"},a.options.cursorBlinkRate):0>a.options.cursorBlinkRate&&(b.cursorDiv.style.visibility="hidden")}}function Ae(a){a.state.focused||(a.display.input.focus(),nd(a))}function gg(a){a.state.delayingBlurEvent=!0;setTimeout(function(){a.state.delayingBlurEvent&&
(a.state.delayingBlurEvent=!1,Cb(a))},100)}function nd(a,b){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1);"nocursor"!=a.options.readOnly&&(a.state.focused||(E(a,"focus",a,b),a.state.focused=!0,Ta(a.display.wrapper,"CodeMirror-focused"),a.curOp||a.display.selForContextMenu==a.doc.sel||(a.display.input.reset(),K&&setTimeout(function(){return a.display.input.reset(!0)},20)),a.display.input.receivedFocus()),md(a))}function Cb(a,b){a.state.delayingBlurEvent||(a.state.focused&&(E(a,"blur",a,
b),a.state.focused=!1,$a(a.display.wrapper,"CodeMirror-focused")),clearInterval(a.display.blinker),setTimeout(function(){a.state.focused||(a.display.shift=!1)},150))}function od(a){var b=a.display,c=b.view;if(b.alignWidgets||b.gutters.firstChild&&a.options.fixedGutter){for(var d=kd(b)-b.scroller.scrollLeft+a.doc.scrollLeft,e=b.gutters.offsetWidth,f=d+"px",g=0;g<c.length;g++)if(!c[g].hidden){a.options.fixedGutter&&(c[g].gutter&&(c[g].gutter.style.left=f),c[g].gutterBackground&&(c[g].gutterBackground.style.left=
f));var h=c[g].alignable;if(h)for(var k=0;k<h.length;k++)h[k].style.left=f}a.options.fixedGutter&&(b.gutters.style.left=d+e+"px")}}function Be(a){if(!a.options.lineNumbers)return!1;var b=a.doc,b=Lc(a.options,b.first+b.size-1),c=a.display;if(b.length!=c.lineNumChars){var d=c.measure.appendChild(r("div",[r("div",b)],"CodeMirror-linenumber CodeMirror-gutter-elt")),e=d.firstChild.offsetWidth,d=d.offsetWidth-e;c.lineGutter.style.width="";c.lineNumInnerWidth=Math.max(e,c.lineGutter.offsetWidth-d)+1;c.lineNumWidth=
c.lineNumInnerWidth+d;c.lineNumChars=c.lineNumInnerWidth?b.length:-1;c.lineGutter.style.width=c.lineNumWidth+"px";pd(a);return!0}return!1}function jc(a){a=a.display;for(var b=a.lineDiv.offsetTop,c=0;c<a.view.length;c++){var d=a.view[c],e=void 0;if(!d.hidden){if(A&&8>C)var f=d.node.offsetTop+d.node.offsetHeight,e=f-b,b=f;else e=d.node.getBoundingClientRect(),e=e.bottom-e.top;f=d.line.height-e;2>e&&(e=Ma(a));if(.001<f||-.001>f)if(ia(d.line,e),Ce(d.line),d.rest)for(e=0;e<d.rest.length;e++)Ce(d.rest[e])}}}
function Ce(a){if(a.widgets)for(var b=0;b<a.widgets.length;++b)a.widgets[b].height=a.widgets[b].node.parentNode.offsetHeight}function qd(a,b,c){var d=c&&null!=c.top?Math.max(0,c.top):a.scroller.scrollTop,d=Math.floor(d-a.lineSpace.offsetTop),e=c&&null!=c.bottom?c.bottom:d+a.wrapper.clientHeight,d=Ga(b,d),e=Ga(b,e);if(c&&c.ensure){var f=c.ensure.from.line;c=c.ensure.to.line;f<d?(d=f,e=Ga(b,ka(u(b,f))+a.wrapper.clientHeight)):Math.min(c,b.lastLine())>=e&&(d=Ga(b,ka(u(b,c))-a.wrapper.clientHeight),e=
c)}return{from:d,to:Math.max(e,d+1)}}function Db(a,b){2>Math.abs(a.doc.scrollTop-b)||(a.doc.scrollTop=b,va||rd(a,{top:b}),a.display.scroller.scrollTop!=b&&(a.display.scroller.scrollTop=b),a.display.scrollbars.setScrollTop(b),va&&rd(a),Eb(a,100))}function ab(a,b,c){(c?b==a.doc.scrollLeft:2>Math.abs(a.doc.scrollLeft-b))||(b=Math.min(b,a.display.scroller.scrollWidth-a.display.scroller.clientWidth),a.doc.scrollLeft=b,od(a),a.display.scroller.scrollLeft!=b&&(a.display.scroller.scrollLeft=b),a.display.scrollbars.setScrollLeft(b))}
function De(a){var b=a.wheelDeltaX,c=a.wheelDeltaY;null==b&&a.detail&&a.axis==a.HORIZONTAL_AXIS&&(b=a.detail);null==c&&a.detail&&a.axis==a.VERTICAL_AXIS?c=a.detail:null==c&&(c=a.wheelDelta);return{x:b,y:c}}function hg(a){a=De(a);a.x*=X;a.y*=X;return a}function Ee(a,b){var c=De(b),d=c.x,c=c.y,e=a.display,f=e.scroller,g=f.scrollWidth>f.clientWidth,h=f.scrollHeight>f.clientHeight;if(d&&g||c&&h){if(c&&ea&&K){var g=b.target,k=e.view;a:for(;g!=f;g=g.parentNode)for(var l=0;l<k.length;l++)if(k[l].node==g){a.display.currentWheelTarget=
g;break a}}!d||va||ga||null==X?(c&&null!=X&&(h=c*X,g=a.doc.scrollTop,k=g+e.wrapper.clientHeight,0>h?g=Math.max(0,g+h-50):k=Math.min(a.doc.height,k+h+50),rd(a,{top:g,bottom:k})),20>kc&&(null==e.wheelStartX?(e.wheelStartX=f.scrollLeft,e.wheelStartY=f.scrollTop,e.wheelDX=d,e.wheelDY=c,setTimeout(function(){if(null!=e.wheelStartX){var a=f.scrollLeft-e.wheelStartX,b=f.scrollTop-e.wheelStartY,a=b&&e.wheelDY&&b/e.wheelDY||a&&e.wheelDX&&a/e.wheelDX;e.wheelStartX=e.wheelStartY=null;a&&(X=(X*kc+a)/(kc+1),++kc)}},
200)):(e.wheelDX+=d,e.wheelDY+=c))):(c&&h&&Db(a,Math.max(0,Math.min(f.scrollTop+c*X,f.scrollHeight-f.clientHeight))),ab(a,Math.max(0,Math.min(f.scrollLeft+d*X,f.scrollWidth-f.clientWidth))),(!c||c&&h)&&N(b),e.wheelStartX=null)}}function Fb(a){var b=a.display,c=b.gutters.offsetWidth,d=Math.round(a.doc.height+ed(a.display));return{clientHeight:b.scroller.clientHeight,viewHeight:b.wrapper.clientHeight,scrollWidth:b.scroller.scrollWidth,clientWidth:b.scroller.clientWidth,viewWidth:b.wrapper.clientWidth,
barLeft:a.options.fixedGutter?c:0,docHeight:d,scrollHeight:d+la(a)+b.barHeight,nativeBarWidth:b.nativeBarWidth,gutterWidth:c}}function bb(a,b){b||(b=Fb(a));var c=a.display.barWidth,d=a.display.barHeight;Fe(a,b);for(var e=0;4>e&&c!=a.display.barWidth||d!=a.display.barHeight;e++)c!=a.display.barWidth&&a.options.lineWrapping&&jc(a),Fe(a,Fb(a)),c=a.display.barWidth,d=a.display.barHeight}function Fe(a,b){var c=a.display,d=c.scrollbars.update(b);c.sizer.style.paddingRight=(c.barWidth=d.right)+"px";c.sizer.style.paddingBottom=
(c.barHeight=d.bottom)+"px";c.heightForcer.style.borderBottom=d.bottom+"px solid transparent";d.right&&d.bottom?(c.scrollbarFiller.style.display="block",c.scrollbarFiller.style.height=d.bottom+"px",c.scrollbarFiller.style.width=d.right+"px"):c.scrollbarFiller.style.display="";d.bottom&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(c.gutterFiller.style.display="block",c.gutterFiller.style.height=d.bottom+"px",c.gutterFiller.style.width=b.gutterWidth+"px"):c.gutterFiller.style.display=
""}function Ge(a){a.display.scrollbars&&(a.display.scrollbars.clear(),a.display.scrollbars.addClass&&$a(a.display.wrapper,a.display.scrollbars.addClass));a.display.scrollbars=new He[a.options.scrollbarStyle](function(b){a.display.wrapper.insertBefore(b,a.display.scrollbarFiller);s(b,"mousedown",function(){a.state.focused&&setTimeout(function(){return a.display.input.focus()},0)});b.setAttribute("cm-not-content","true")},function(b,c){"horizontal"==c?ab(a,b):Db(a,b)},a);a.display.scrollbars.addClass&&
Ta(a.display.wrapper,a.display.scrollbars.addClass)}function lc(a,b,c,d,e){var f=a.display,g=Ma(a.display);0>c&&(c=0);var h=a.curOp&&null!=a.curOp.scrollTop?a.curOp.scrollTop:f.scroller.scrollTop,k=fd(a),l={};e-c>k&&(e=c+k);var m=a.doc.height+ed(f),n=c<g,g=e>m-g;c<h?l.scrollTop=n?0:c:e>h+k&&(c=Math.min(c,(g?m:e)-k),c!=h&&(l.scrollTop=c));h=a.curOp&&null!=a.curOp.scrollLeft?a.curOp.scrollLeft:f.scroller.scrollLeft;a=Ka(a)-(a.options.fixedGutter?f.gutters.offsetWidth:0);(f=d-b>a)&&(d=b+a);10>b?l.scrollLeft=
0:b<h?l.scrollLeft=Math.max(0,b-(f?0:10)):d>a+h-3&&(l.scrollLeft=d+(f?0:10)-a);return l}function mc(a,b,c){null==b&&null==c||nc(a);null!=b&&(a.curOp.scrollLeft=(null==a.curOp.scrollLeft?a.doc.scrollLeft:a.curOp.scrollLeft)+b);null!=c&&(a.curOp.scrollTop=(null==a.curOp.scrollTop?a.doc.scrollTop:a.curOp.scrollTop)+c)}function cb(a){nc(a);var b=a.getCursor(),c=b,d=b;a.options.lineWrapping||(c=b.ch?q(b.line,b.ch-1):b,d=q(b.line,b.ch+1));a.curOp.scrollToPos={from:c,to:d,margin:a.options.cursorScrollMargin,
isCursor:!0}}function nc(a){var b=a.curOp.scrollToPos;if(b){a.curOp.scrollToPos=null;var c=we(a,b.from),d=we(a,b.to),b=lc(a,Math.min(c.left,d.left),Math.min(c.top,d.top)-b.margin,Math.max(c.right,d.right),Math.max(c.bottom,d.bottom)+b.margin);a.scrollTo(b.scrollLeft,b.scrollTop)}}function db(a){a.curOp={cm:a,viewChanged:!1,startHeight:a.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,
scrollTop:null,scrollToPos:null,focus:!1,id:++ig};a=a.curOp;Za?Za.ops.push(a):a.ownsGroup=Za={ops:[a],delayedCallbacks:[]}}function eb(a){bg(a.curOp,function(a){for(var c=0;c<a.ops.length;c++)a.ops[c].cm.curOp=null;a=a.ops;for(c=0;c<a.length;c++){var d=a[c],e=d.cm,f=e.display,g=e.display;!g.scrollbarsClipped&&g.scroller.offsetWidth&&(g.nativeBarWidth=g.scroller.offsetWidth-g.scroller.clientWidth,g.heightForcer.style.height=la(e)+"px",g.sizer.style.marginBottom=-g.nativeBarWidth+"px",g.sizer.style.borderRightWidth=
la(e)+"px",g.scrollbarsClipped=!0);d.updateMaxLine&&Rc(e);d.mustUpdate=d.viewChanged||d.forceUpdate||null!=d.scrollTop||d.scrollToPos&&(d.scrollToPos.from.line<f.viewFrom||d.scrollToPos.to.line>=f.viewTo)||f.maxLineChanged&&e.options.lineWrapping;d.update=d.mustUpdate&&new oc(e,d.mustUpdate&&{top:d.scrollTop,ensure:d.scrollToPos},d.forceUpdate)}for(c=0;c<a.length;c++)d=a[c],d.updatedDisplay=d.mustUpdate&&sd(d.cm,d.update);for(c=0;c<a.length;c++)if(d=a[c],e=d.cm,f=e.display,d.updatedDisplay&&jc(e),
d.barMeasure=Fb(e),f.maxLineChanged&&!e.options.lineWrapping&&(g=void 0,g=f.maxLine.text.length,g=pa(e,Ua(e,f.maxLine),g,void 0),d.adjustWidthTo=g.left+3,e.display.sizerWidth=d.adjustWidthTo,d.barMeasure.scrollWidth=Math.max(f.scroller.clientWidth,f.sizer.offsetLeft+d.adjustWidthTo+la(e)+e.display.barWidth),d.maxScrollLeft=Math.max(0,f.sizer.offsetLeft+d.adjustWidthTo-Ka(e))),d.updatedDisplay||d.selectionChanged)d.preparedSelection=f.input.prepareSelection(d.focus);for(c=0;c<a.length;c++)d=a[c],e=
d.cm,null!=d.adjustWidthTo&&(e.display.sizer.style.minWidth=d.adjustWidthTo+"px",d.maxScrollLeft<e.doc.scrollLeft&&ab(e,Math.min(e.display.scroller.scrollLeft,d.maxScrollLeft),!0),e.display.maxLineChanged=!1),f=d.focus&&d.focus==oa()&&(!document.hasFocus||document.hasFocus()),d.preparedSelection&&e.display.input.showSelection(d.preparedSelection,f),(d.updatedDisplay||d.startHeight!=e.doc.height)&&bb(e,d.barMeasure),d.updatedDisplay&&td(e,d.barMeasure),d.selectionChanged&&md(e),e.state.focused&&d.updateInput&&
e.display.input.reset(d.typing),f&&Ae(d.cm);for(c=0;c<a.length;c++){d=a[c];e=d.cm;f=e.display;g=e.doc;d.updatedDisplay&&Ie(e,d.update);null==f.wheelStartX||null==d.scrollTop&&null==d.scrollLeft&&!d.scrollToPos||(f.wheelStartX=f.wheelStartY=null);null==d.scrollTop||f.scroller.scrollTop==d.scrollTop&&!d.forceScroll||(g.scrollTop=Math.max(0,Math.min(f.scroller.scrollHeight-f.scroller.clientHeight,d.scrollTop)),f.scrollbars.setScrollTop(g.scrollTop),f.scroller.scrollTop=g.scrollTop);null==d.scrollLeft||
f.scroller.scrollLeft==d.scrollLeft&&!d.forceScroll||(g.scrollLeft=Math.max(0,Math.min(f.scroller.scrollWidth-f.scroller.clientWidth,d.scrollLeft)),f.scrollbars.setScrollLeft(g.scrollLeft),f.scroller.scrollLeft=g.scrollLeft,od(e));if(d.scrollToPos){var h=void 0,k=w(g,d.scrollToPos.from),h=w(g,d.scrollToPos.to),l=d.scrollToPos.margin;null==l&&(l=0);for(var m=void 0,n=0;5>n;n++){var p=!1,m=fa(e,k),t=h&&h!=k?fa(e,h):m,t=lc(e,Math.min(m.left,t.left),Math.min(m.top,t.top)-l,Math.max(m.left,t.left),Math.max(m.bottom,
t.bottom)+l),q=e.doc.scrollTop,s=e.doc.scrollLeft;null!=t.scrollTop&&(Db(e,t.scrollTop),1<Math.abs(e.doc.scrollTop-q)&&(p=!0));null!=t.scrollLeft&&(ab(e,t.scrollLeft),1<Math.abs(e.doc.scrollLeft-s)&&(p=!0));if(!p)break}h=m;d.scrollToPos.isCursor&&e.state.focused&&(G(e,"scrollCursorIntoView")||(l=e.display,m=l.sizer.getBoundingClientRect(),k=null,0>h.top+m.top?k=!0:h.bottom+m.top>(window.innerHeight||document.documentElement.clientHeight)&&(k=!1),null==k||jg||(h=r("div","​",null,"position: absolute;\n                         top: "+
(h.top-l.viewOffset-e.display.lineSpace.offsetTop)+"px;\n                         height: "+(h.bottom-h.top+la(e)+l.barHeight)+"px;\n                         left: "+h.left+"px; width: 2px;"),e.display.lineSpace.appendChild(h),h.scrollIntoView(k),e.display.lineSpace.removeChild(h))))}h=d.maybeHiddenMarkers;k=d.maybeUnhiddenMarkers;if(h)for(l=0;l<h.length;++l)h[l].lines.length||E(h[l],"hide");if(k)for(h=0;h<k.length;++h)k[h].lines.length&&E(k[h],"unhide");f.wrapper.offsetHeight&&(g.scrollTop=e.display.scroller.scrollTop);
d.changeObjs&&E(e,"changes",e,d.changeObjs);d.update&&d.update.finish()}})}function Y(a,b){if(a.curOp)return b();db(a);try{return b()}finally{eb(a)}}function I(a,b){return function(){if(a.curOp)return b.apply(a,arguments);db(a);try{return b.apply(a,arguments)}finally{eb(a)}}}function R(a){return function(){if(this.curOp)return a.apply(this,arguments);db(this);try{return a.apply(this,arguments)}finally{eb(this)}}}function L(a){return function(){var b=this.cm;if(!b||b.curOp)return a.apply(this,arguments);
db(b);try{return a.apply(this,arguments)}finally{eb(b)}}}function Q(a,b,c,d){null==b&&(b=a.doc.first);null==c&&(c=a.doc.first+a.doc.size);d||(d=0);var e=a.display;d&&c<e.viewTo&&(null==e.updateLineNumbers||e.updateLineNumbers>b)&&(e.updateLineNumbers=b);a.curOp.viewChanged=!0;if(b>=e.viewTo)wa&&Pc(a.doc,b)<e.viewTo&&ya(a);else if(c<=e.viewFrom)wa&&Ud(a.doc,c+d)>e.viewFrom?ya(a):(e.viewFrom+=d,e.viewTo+=d);else if(b<=e.viewFrom&&c>=e.viewTo)ya(a);else if(b<=e.viewFrom){var f=pc(a,c,c+d,1);f?(e.view=
e.view.slice(f.index),e.viewFrom=f.lineN,e.viewTo+=d):ya(a)}else if(c>=e.viewTo)(f=pc(a,b,b,-1))?(e.view=e.view.slice(0,f.index),e.viewTo=f.lineN):ya(a);else{var f=pc(a,b,b,-1),g=pc(a,c,c+d,1);f&&g?(e.view=e.view.slice(0,f.index).concat(hc(a,f.lineN,g.lineN)).concat(e.view.slice(g.index)),e.viewTo+=d):ya(a)}if(a=e.externalMeasured)c<a.lineN?a.lineN+=d:b<a.lineN+a.size&&(e.externalMeasured=null)}function za(a,b,c){a.curOp.viewChanged=!0;var d=a.display,e=a.display.externalMeasured;e&&b>=e.lineN&&b<
e.lineN+e.size&&(d.externalMeasured=null);b<d.viewFrom||b>=d.viewTo||(a=d.view[La(a,b)],null!=a.node&&(a=a.changes||(a.changes=[]),-1==J(a,c)&&a.push(c)))}function ya(a){a.display.viewFrom=a.display.viewTo=a.doc.first;a.display.view=[];a.display.viewOffset=0}function pc(a,b,c,d){var e=La(a,b),f=a.display.view;if(!wa||c==a.doc.first+a.doc.size)return{index:e,lineN:c};for(var g=a.display.viewFrom,h=0;h<e;h++)g+=f[h].size;if(g!=b){if(0<d){if(e==f.length-1)return null;b=g+f[e].size-b;e++}else b=g-b;c+=
b}for(;Pc(a.doc,c)!=c;){if(e==(0>d?0:f.length-1))return null;c+=d*f[e-(0>d?1:0)].size;e+=d}return{index:e,lineN:c}}function Je(a){a=a.display.view;for(var b=0,c=0;c<a.length;c++){var d=a[c];d.hidden||d.node&&!d.changes||++b}return b}function Eb(a,b){a.doc.mode.startState&&a.doc.frontier<a.display.viewTo&&a.state.highlight.set(b,Fc(kg,a))}function kg(a){var b=a.doc;b.frontier<b.first&&(b.frontier=b.first);if(!(b.frontier>=a.display.viewTo)){var c=+new Date+a.options.workTime,d=qa(b.mode,vb(a,b.frontier)),
e=[];b.iter(b.frontier,Math.min(b.first+b.size,a.display.viewTo+500),function(f){if(b.frontier>=a.display.viewFrom){var g=f.styles,h=f.text.length>a.options.maxHighlightLength,k=ae(a,f,h?qa(b.mode,d):d,!0);f.styles=k.styles;var l=f.styleClasses;(k=k.classes)?f.styleClasses=k:l&&(f.styleClasses=null);l=!g||g.length!=f.styles.length||l!=k&&(!l||!k||l.bgClass!=k.bgClass||l.textClass!=k.textClass);for(k=0;!l&&k<g.length;++k)l=g[k]!=f.styles[k];l&&e.push(b.frontier);f.stateAfter=h?d:qa(b.mode,d)}else f.text.length<=
a.options.maxHighlightLength&&ad(a,f.text,d),f.stateAfter=0==b.frontier%5?qa(b.mode,d):null;++b.frontier;if(+new Date>c)return Eb(a,a.options.workDelay),!0});e.length&&Y(a,function(){for(var b=0;b<e.length;b++)za(a,e[b],"text")})}}function sd(a,b){var c=a.display,d=a.doc;if(b.editorIsHidden)return ya(a),!1;if(!b.force&&b.visible.from>=c.viewFrom&&b.visible.to<=c.viewTo&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo)&&c.renderedView==c.view&&0==Je(a))return!1;Be(a)&&(ya(a),b.dims=hd(a));
var e=d.first+d.size,f=Math.max(b.visible.from-a.options.viewportMargin,d.first),g=Math.min(e,b.visible.to+a.options.viewportMargin);c.viewFrom<f&&20>f-c.viewFrom&&(f=Math.max(d.first,c.viewFrom));c.viewTo>g&&20>c.viewTo-g&&(g=Math.min(e,c.viewTo));wa&&(f=Pc(a.doc,f),g=Ud(a.doc,g));d=f!=c.viewFrom||g!=c.viewTo||c.lastWrapHeight!=b.wrapperHeight||c.lastWrapWidth!=b.wrapperWidth;e=a.display;0==e.view.length||f>=e.viewTo||g<=e.viewFrom?(e.view=hc(a,f,g),e.viewFrom=f):(e.viewFrom>f?e.view=hc(a,f,e.viewFrom).concat(e.view):
e.viewFrom<f&&(e.view=e.view.slice(La(a,f))),e.viewFrom=f,e.viewTo<g?e.view=e.view.concat(hc(a,e.viewTo,g)):e.viewTo>g&&(e.view=e.view.slice(0,La(a,g))));e.viewTo=g;c.viewOffset=ka(u(a.doc,c.viewFrom));a.display.mover.style.top=c.viewOffset+"px";g=Je(a);if(!d&&0==g&&!b.force&&c.renderedView==c.view&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo))return!1;f=oa();4<g&&(c.lineDiv.style.display="none");lg(a,c.updateLineNumbers,b.dims);4<g&&(c.lineDiv.style.display="");c.renderedView=c.view;
f&&oa()!=f&&f.offsetHeight&&f.focus();$(c.cursorDiv);$(c.selectionDiv);c.gutters.style.height=c.sizer.style.minHeight=0;d&&(c.lastWrapHeight=b.wrapperHeight,c.lastWrapWidth=b.wrapperWidth,Eb(a,400));c.updateLineNumbers=null;return!0}function Ie(a,b){for(var c=b.viewport,d=!0;;d=!1){if(!d||!a.options.lineWrapping||b.oldDisplayWidth==Ka(a))if(c&&null!=c.top&&(c={top:Math.min(a.doc.height+ed(a.display)-fd(a),c.top)}),b.visible=qd(a.display,a.doc,c),b.visible.from>=a.display.viewFrom&&b.visible.to<=a.display.viewTo)break;
if(!sd(a,b))break;jc(a);d=Fb(a);Bb(a);bb(a,d);td(a,d)}b.signal(a,"update",a);if(a.display.viewFrom!=a.display.reportedViewFrom||a.display.viewTo!=a.display.reportedViewTo)b.signal(a,"viewportChange",a,a.display.viewFrom,a.display.viewTo),a.display.reportedViewFrom=a.display.viewFrom,a.display.reportedViewTo=a.display.viewTo}function rd(a,b){var c=new oc(a,b);if(sd(a,c)){jc(a);Ie(a,c);var d=Fb(a);Bb(a);bb(a,d);td(a,d);c.finish()}}function lg(a,b,c){function d(b){var d=b.nextSibling;K&&ea&&a.display.currentWheelTarget==
b?b.style.display="none":b.parentNode.removeChild(b);return d}for(var e=a.display,f=a.options.lineNumbers,g=e.lineDiv,h=g.firstChild,k=e.view,e=e.viewFrom,l=0;l<k.length;l++){var m=k[l];if(!m.hidden)if(m.node&&m.node.parentNode==g){for(;h!=m.node;)h=d(h);h=f&&null!=b&&b<=e&&m.lineNumber;m.changes&&(-1<J(m.changes,"gutter")&&(h=!1),ke(a,m,e,c));h&&($(m.lineNumber),m.lineNumber.appendChild(document.createTextNode(Lc(a.options,e))));h=m.node.nextSibling}else{var n=dg(a,m,e,c);g.insertBefore(n,h)}e+=
m.size}for(;h;)h=d(h)}function pd(a){a.display.sizer.style.marginLeft=a.display.gutters.offsetWidth+"px"}function td(a,b){a.display.sizer.style.minHeight=b.docHeight+"px";a.display.heightForcer.style.top=b.docHeight+"px";a.display.gutters.style.height=b.docHeight+a.display.barHeight+la(a)+"px"}function Ke(a){var b=a.display.gutters,c=a.options.gutters;$(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(r("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=
f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none";pd(a)}function ud(a){var b=J(a.gutters,"CodeMirror-linenumbers");-1==b&&a.lineNumbers?a.gutters=a.gutters.concat(["CodeMirror-linenumbers"]):-1<b&&!a.lineNumbers&&(a.gutters=a.gutters.slice(0),a.gutters.splice(b,1))}function ha(a,b){var c=a[b];a.sort(function(a,b){return v(a.from(),b.from())});b=J(a,c);for(c=1;c<a.length;c++){var d=a[c],e=a[c-1];if(0<=v(e.to(),d.from())){var f=bc(e.from(),d.from()),g=ac(e.to(),d.to()),d=
e.empty()?d.from()==d.head:e.from()==e.head;c<=b&&--b;a.splice(--c,2,new x(d?g:f,d?f:g))}}return new Z(a,b)}function ta(a,b){return new Z([new x(a,b||a)],0)}function Aa(a){return a.text?q(a.from.line+a.text.length-1,z(a.text).length+(1==a.text.length?a.from.ch:0)):a.to}function Le(a,b){if(0>v(a,b.from))return a;if(0>=v(a,b.to))return Aa(b);var c=a.line+b.text.length-(b.to.line-b.from.line)-1,d=a.ch;a.line==b.to.line&&(d+=Aa(b).ch-b.to.ch);return q(c,d)}function vd(a,b){for(var c=[],d=0;d<a.sel.ranges.length;d++){var e=
a.sel.ranges[d];c.push(new x(Le(e.anchor,b),Le(e.head,b)))}return ha(c,a.sel.primIndex)}function Me(a,b,c){return a.line==b.line?q(c.line,a.ch-b.ch+c.ch):q(c.line+(a.line-b.line),a.ch)}function wd(a){a.doc.mode=Zc(a.options,a.doc.modeOption);Gb(a)}function Gb(a){a.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null)});a.doc.frontier=a.doc.first;Eb(a,100);a.state.modeGen++;a.curOp&&Q(a)}function Ne(a,b){return 0==b.from.ch&&0==b.to.ch&&""==z(b.text)&&(!a.cm||a.cm.options.wholeLineUpdateBefore)}
function xd(a,b,c,d){function e(a,c,e){a.text=c;a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null);null!=a.order&&(a.order=null);Qd(a);Rd(a,e);c=d?d(a):1;c!=a.height&&ia(a,c);P(a,"change",a,b)}function f(a,b){for(var e=[],f=a;f<b;++f)e.push(new fb(k[f],c?c[f]:null,d));return e}var g=b.from,h=b.to,k=b.text,l=u(a,g.line),m=u(a,h.line),n=z(k),p=c?c[k.length-1]:null,t=h.line-g.line;b.full?(a.insert(0,f(0,k.length)),a.remove(k.length,a.size-k.length)):Ne(a,b)?(h=f(0,k.length-1),e(m,m.text,p),
t&&a.remove(g.line,t),h.length&&a.insert(g.line,h)):l==m?1==k.length?e(l,l.text.slice(0,g.ch)+n+l.text.slice(h.ch),p):(t=f(1,k.length-1),t.push(new fb(n+l.text.slice(h.ch),p,d)),e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),a.insert(g.line+1,t)):1==k.length?(e(l,l.text.slice(0,g.ch)+k[0]+m.text.slice(h.ch),c?c[0]:null),a.remove(g.line+1,t)):(e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),e(m,n+m.text.slice(h.ch),p),p=f(1,k.length-1),1<t&&a.remove(g.line+1,t-1),a.insert(g.line+1,p));P(a,"change",a,b)}function Pa(a,
b,c){function d(a,f,g){if(a.linked)for(var h=0;h<a.linked.length;++h){var k=a.linked[h];if(k.doc!=f){var l=g&&k.sharedHist;if(!c||l)b(k.doc,l),d(k.doc,a,l)}}}d(a,null,!0)}function Oe(a,b){if(b.cm)throw Error("This document is already in use.");a.doc=b;b.cm=a;ld(a);wd(a);a.options.lineWrapping||Rc(a);a.options.mode=b.modeOption;Q(a)}function qc(a){this.done=[];this.undone=[];this.undoDepth=Infinity;this.lastModTime=this.lastSelTime=0;this.lastOrigin=this.lastSelOrigin=this.lastOp=this.lastSelOp=null;
this.generation=this.maxGeneration=a||1}function yd(a,b){var c={from:Nc(b.from),to:Aa(b),text:Fa(a,b.from,b.to)};Pe(a,c,b.from.line,b.to.line+1);Pa(a,function(a){return Pe(a,c,b.from.line,b.to.line+1)},!0);return c}function Qe(a){for(;a.length;)if(z(a).ranges)a.pop();else break}function Re(a,b,c,d){var e=a.history;e.undone.length=0;var f=+new Date,g,h,k;if(k=e.lastOp==d||e.lastOrigin==b.origin&&b.origin&&("+"==b.origin.charAt(0)&&a.cm&&e.lastModTime>f-a.cm.options.historyEventDelay||"*"==b.origin.charAt(0)))e.lastOp==
d?(Qe(e.done),g=z(e.done)):e.done.length&&!z(e.done).ranges?g=z(e.done):1<e.done.length&&!e.done[e.done.length-2].ranges?(e.done.pop(),g=z(e.done)):g=void 0,k=g;if(k)h=z(g.changes),0==v(b.from,b.to)&&0==v(b.from,h.to)?h.to=Aa(b):g.changes.push(yd(a,b));else for((g=z(e.done))&&g.ranges||rc(a.sel,e.done),g={changes:[yd(a,b)],generation:e.generation},e.done.push(g);e.done.length>e.undoDepth;)e.done.shift(),e.done[0].ranges||e.done.shift();e.done.push(c);e.generation=++e.maxGeneration;e.lastModTime=e.lastSelTime=
f;e.lastOp=e.lastSelOp=d;e.lastOrigin=e.lastSelOrigin=b.origin;h||E(a,"historyAdded")}function rc(a,b){var c=z(b);c&&c.ranges&&c.equals(a)||b.push(a)}function Pe(a,b,c,d){var e=b["spans_"+a.id],f=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(d){d.markedSpans&&((e||(e=b["spans_"+a.id]={}))[f]=d.markedSpans);++f})}function mg(a){if(!a)return null;for(var b,c=0;c<a.length;++c)a[c].marker.explicitlyCleared?b||(b=a.slice(0,c)):b&&b.push(a[c]);return b?b.length?b:null:a}function Se(a,
b){var c;if(c=b["spans_"+a.id]){for(var d=[],e=0;e<b.text.length;++e)d.push(mg(c[e]));c=d}else c=null;d=Oc(a,b);if(!c)return d;if(!d)return c;for(e=0;e<c.length;++e){var f=c[e],g=d[e];if(f&&g){var h=0;a:for(;h<g.length;++h){for(var k=g[h],l=0;l<f.length;++l)if(f[l].marker==k.marker)continue a;f.push(k)}}else g&&(c[e]=g)}return c}function gb(a,b,c){for(var d=[],e=0;e<a.length;++e){var f=a[e];if(f.ranges)d.push(c?Z.prototype.deepCopy.call(f):f);else{var f=f.changes,g=[];d.push({changes:g});for(var h=
0;h<f.length;++h){var k=f[h],l=void 0;g.push({from:k.from,to:k.to,text:k.text});if(b)for(var m in k)(l=m.match(/^spans_(\d+)$/))&&-1<J(b,Number(l[1]))&&(z(g)[m]=k[m],delete k[m])}}}return d}function Hb(a,b,c,d){return a.cm&&a.cm.display.shift||a.extend?(a=b.anchor,d&&(b=0>v(c,a),b!=0>v(d,a)?(a=c,c=d):b!=0>v(c,d)&&(c=d)),new x(a,c)):new x(d||c,c)}function sc(a,b,c,d){M(a,new Z([Hb(a,a.sel.primary(),b,c)],0),d)}function Te(a,b,c){for(var d=[],e=0;e<a.sel.ranges.length;e++)d[e]=Hb(a,a.sel.ranges[e],
b[e],null);b=ha(d,a.sel.primIndex);M(a,b,c)}function zd(a,b,c,d){var e=a.sel.ranges.slice(0);e[b]=c;M(a,ha(e,a.sel.primIndex),d)}function ng(a,b,c){c={ranges:b.ranges,update:function(b){this.ranges=[];for(var c=0;c<b.length;c++)this.ranges[c]=new x(w(a,b[c].anchor),w(a,b[c].head))},origin:c&&c.origin};E(a,"beforeSelectionChange",a,c);a.cm&&E(a.cm,"beforeSelectionChange",a.cm,c);return c.ranges!=b.ranges?ha(c.ranges,c.ranges.length-1):b}function Ue(a,b,c){var d=a.history.done,e=z(d);e&&e.ranges?(d[d.length-
1]=b,tc(a,b,c)):M(a,b,c)}function M(a,b,c){tc(a,b,c);b=a.sel;var d=a.cm?a.cm.curOp.id:NaN,e=a.history,f=c&&c.origin,g;if(!(g=d==e.lastSelOp)&&(g=f&&e.lastSelOrigin==f)&&!(g=e.lastModTime==e.lastSelTime&&e.lastOrigin==f)){g=z(e.done);var h=f.charAt(0);g="*"==h||"+"==h&&g.ranges.length==b.ranges.length&&g.somethingSelected()==b.somethingSelected()&&new Date-a.history.lastSelTime<=(a.cm?a.cm.options.historyEventDelay:500)}g?e.done[e.done.length-1]=b:rc(b,e.done);e.lastSelTime=+new Date;e.lastSelOrigin=
f;e.lastSelOp=d;c&&!1!==c.clearRedo&&Qe(e.undone)}function tc(a,b,c){if(ba(a,"beforeSelectionChange")||a.cm&&ba(a.cm,"beforeSelectionChange"))b=ng(a,b,c);var d=c&&c.bias||(0>v(b.primary().head,a.sel.primary().head)?-1:1);Ve(a,We(a,b,d,!0));c&&!1===c.scroll||!a.cm||cb(a.cm)}function Ve(a,b){b.equals(a.sel)||(a.sel=b,a.cm&&(a.cm.curOp.updateInput=a.cm.curOp.selectionChanged=!0,Xd(a.cm)),P(a,"cursorActivity",a))}function Xe(a){Ve(a,We(a,a.sel,null,!1),ma)}function We(a,b,c,d){for(var e,f=0;f<b.ranges.length;f++){var g=
b.ranges[f],h=b.ranges.length==a.sel.ranges.length&&a.sel.ranges[f],k=Ad(a,g.anchor,h&&h.anchor,c,d),h=Ad(a,g.head,h&&h.head,c,d);if(e||k!=g.anchor||h!=g.head)e||(e=b.ranges.slice(0,f)),e[f]=new x(k,h)}return e?ha(e,b.primIndex):b}function hb(a,b,c,d,e){var f=u(a,b.line);if(f.markedSpans)for(var g=0;g<f.markedSpans.length;++g){var h=f.markedSpans[g],k=h.marker;if((null==h.from||(k.inclusiveLeft?h.from<=b.ch:h.from<b.ch))&&(null==h.to||(k.inclusiveRight?h.to>=b.ch:h.to>b.ch))){if(e&&(E(k,"beforeCursorEnter"),
k.explicitlyCleared))if(f.markedSpans){--g;continue}else break;if(k.atomic){if(c){g=k.find(0>d?1:-1);h=void 0;if(0>d?k.inclusiveRight:k.inclusiveLeft)g=Ye(a,g,-d,g&&g.line==b.line?f:null);if(g&&g.line==b.line&&(h=v(g,c))&&(0>d?0>h:0<h))return hb(a,g,b,d,e)}c=k.find(0>d?-1:1);if(0>d?k.inclusiveLeft:k.inclusiveRight)c=Ye(a,c,d,c.line==b.line?f:null);return c?hb(a,c,b,d,e):null}}}return b}function Ad(a,b,c,d,e){d=d||1;b=hb(a,b,c,d,e)||!e&&hb(a,b,c,d,!0)||hb(a,b,c,-d,e)||!e&&hb(a,b,c,-d,!0);return b?
b:(a.cantEdit=!0,q(a.first,0))}function Ye(a,b,c,d){return 0>c&&0==b.ch?b.line>a.first?w(a,q(b.line-1)):null:0<c&&b.ch==(d||u(a,b.line)).text.length?b.line<a.first+a.size-1?q(b.line+1,0):null:new q(b.line,b.ch+c)}function Ze(a){a.setSelection(q(a.firstLine(),0),q(a.lastLine()),ma)}function $e(a,b,c){var d={canceled:!1,from:b.from,to:b.to,text:b.text,origin:b.origin,cancel:function(){return d.canceled=!0}};c&&(d.update=function(b,c,g,h){b&&(d.from=w(a,b));c&&(d.to=w(a,c));g&&(d.text=g);void 0!==h&&
(d.origin=h)});E(a,"beforeChange",a,d);a.cm&&E(a.cm,"beforeChange",a.cm,d);return d.canceled?null:{from:d.from,to:d.to,text:d.text,origin:d.origin}}function ib(a,b,c){if(a.cm){if(!a.cm.curOp)return I(a.cm,ib)(a,b,c);if(a.cm.state.suppressEdits)return}if(ba(a,"beforeChange")||a.cm&&ba(a.cm,"beforeChange"))if(b=$e(a,b,!0),!b)return;if(c=af&&!c&&Qf(a,b.from,b.to))for(var d=c.length-1;0<=d;--d)bf(a,{from:c[d].from,to:c[d].to,text:d?[""]:b.text});else bf(a,b)}function bf(a,b){if(1!=b.text.length||""!=
b.text[0]||0!=v(b.from,b.to)){var c=vd(a,b);Re(a,b,c,a.cm?a.cm.curOp.id:NaN);Ib(a,b,c,Oc(a,b));var d=[];Pa(a,function(a,c){c||-1!=J(d,a.history)||(cf(a.history,b),d.push(a.history));Ib(a,b,null,Oc(a,b))})}}function uc(a,b,c){if(!a.cm||!a.cm.state.suppressEdits||c){for(var d=a.history,e,f=a.sel,g="undo"==b?d.done:d.undone,h="undo"==b?d.undone:d.done,k=0;k<g.length&&(e=g[k],c?!e.ranges||e.equals(a.sel):e.ranges);k++);if(k!=g.length){for(d.lastOrigin=d.lastSelOrigin=null;;)if(e=g.pop(),e.ranges){rc(e,
h);if(c&&!e.equals(a.sel)){M(a,e,{clearRedo:!1});return}f=e}else break;var l=[];rc(f,h);h.push({changes:l,generation:d.generation});d.generation=e.generation||++d.maxGeneration;var m=ba(a,"beforeChange")||a.cm&&ba(a.cm,"beforeChange");c=function(d){var c=e.changes[d];c.origin=b;if(m&&!$e(a,c,!1))return g.length=0,{};l.push(yd(a,c));var f=d?vd(a,c):z(g);Ib(a,c,f,Se(a,c));!d&&a.cm&&a.cm.scrollIntoView({from:c.from,to:Aa(c)});var h=[];Pa(a,function(a,b){b||-1!=J(h,a.history)||(cf(a.history,c),h.push(a.history));
Ib(a,c,null,Se(a,c))})};for(d=e.changes.length-1;0<=d;--d)if(f=c(d))return f.v}}}function df(a,b){if(0!=b&&(a.first+=b,a.sel=new Z(Yb(a.sel.ranges,function(a){return new x(q(a.anchor.line+b,a.anchor.ch),q(a.head.line+b,a.head.ch))}),a.sel.primIndex),a.cm)){Q(a.cm,a.first,a.first-b,b);for(var c=a.cm.display,d=c.viewFrom;d<c.viewTo;d++)za(a.cm,d,"gutter")}}function Ib(a,b,c,d){if(a.cm&&!a.cm.curOp)return I(a.cm,Ib)(a,b,c,d);if(b.to.line<a.first)df(a,b.text.length-1-(b.to.line-b.from.line));else if(!(b.from.line>
a.lastLine())){if(b.from.line<a.first){var e=b.text.length-1-(a.first-b.from.line);df(a,e);b={from:q(a.first,0),to:q(b.to.line+e,b.to.ch),text:[z(b.text)],origin:b.origin}}e=a.lastLine();b.to.line>e&&(b={from:b.from,to:q(e,u(a,e).text.length),text:[b.text[0]],origin:b.origin});b.removed=Fa(a,b.from,b.to);c||(c=vd(a,b));a.cm?og(a.cm,b,d):xd(a,b,d);tc(a,c,ma)}}function og(a,b,c){var d=a.doc,e=a.display,f=b.from,g=b.to,h=!1,k=f.line;a.options.lineWrapping||(k=B(ja(u(d,f.line))),d.iter(k,g.line+1,function(a){if(a==
e.maxLine)return h=!0}));-1<d.sel.contains(b.from,b.to)&&Xd(a);xd(d,b,c,xe(a));a.options.lineWrapping||(d.iter(k,f.line+b.text.length,function(a){var b=dc(a);b>e.maxLineLength&&(e.maxLine=a,e.maxLineLength=b,e.maxLineChanged=!0,h=!1)}),h&&(a.curOp.updateMaxLine=!0));d.frontier=Math.min(d.frontier,f.line);Eb(a,400);c=b.text.length-(g.line-f.line)-1;b.full?Q(a):f.line!=g.line||1!=b.text.length||Ne(a.doc,b)?Q(a,f.line,g.line+1,c):za(a,f.line,"text");c=ba(a,"changes");if((d=ba(a,"change"))||c)b={from:f,
to:g,text:b.text,removed:b.removed,origin:b.origin},d&&P(a,"change",a,b),c&&(a.curOp.changeObjs||(a.curOp.changeObjs=[])).push(b);a.display.selForContextMenu=null}function jb(a,b,c,d,e){d||(d=c);if(0>v(d,c)){var f=d;d=c;c=f}"string"==typeof b&&(b=a.splitLines(b));ib(a,{from:c,to:d,text:b,origin:e})}function ef(a,b,c,d){c<a.line?a.line+=d:b<a.line&&(a.line=b,a.ch=0)}function ff(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e],g=!0;if(f.ranges)for(f.copied||(f=a[e]=f.deepCopy(),f.copied=!0),g=0;g<f.ranges.length;g++)ef(f.ranges[g].anchor,
b,c,d),ef(f.ranges[g].head,b,c,d);else{for(var h=0;h<f.changes.length;++h){var k=f.changes[h];if(c<k.from.line)k.from=q(k.from.line+d,k.from.ch),k.to=q(k.to.line+d,k.to.ch);else if(b<=k.to.line){g=!1;break}}g||(a.splice(0,e+1),e=0)}}}function cf(a,b){var c=b.from.line,d=b.to.line,e=b.text.length-(d-c)-1;ff(a.done,c,d,e);ff(a.undone,c,d,e)}function Jb(a,b,c,d){var e=b,f=b;"number"==typeof b?f=u(a,Math.max(a.first,Math.min(b,a.first+a.size-1))):e=B(b);if(null==e)return null;d(f,e)&&a.cm&&za(a.cm,e,
c);return f}function pg(a,b,c,d){var e=new Kb(a,c,d),f=a.cm;f&&e.noHScroll&&(f.display.alignWidgets=!0);Jb(a,b,"widget",function(b){var d=b.widgets||(b.widgets=[]);null==e.insertAt?d.push(e):d.splice(Math.min(d.length-1,Math.max(0,e.insertAt)),0,e);e.line=b;f&&!Ia(a,b)&&(d=ka(b)<a.scrollTop,ia(b,b.height+yb(e)),d&&mc(f,null,e.height),f.curOp.forceUpdate=!0);return!0});P(f,"lineWidgetAdded",f,e);return e}function kb(a,b,c,d,e){if(d&&d.shared)return qg(a,b,c,d,e);if(a.cm&&!a.cm.curOp)return I(a.cm,
kb)(a,b,c,d,e);var f=new Ba(a,e);e=v(b,c);d&&Ea(d,f,!1);if(0<e||0==e&&!1!==f.clearWhenEmpty)return f;f.replacedWith&&(f.collapsed=!0,f.widgetNode=r("span",[f.replacedWith],"CodeMirror-widget"),f.widgetNode.setAttribute("role","presentation"),d.handleMouseEvents||f.widgetNode.setAttribute("cm-ignore-events","true"),d.insertLeft&&(f.widgetNode.insertLeft=!0));if(f.collapsed){if(Td(a,b.line,b,c,f)||b.line!=c.line&&Td(a,c.line,b,c,f))throw Error("Inserting collapsed marker partially overlapping an existing one");
wa=!0}f.addToHistory&&Re(a,{from:b,to:c,origin:"markText"},a.sel,NaN);var g=b.line,h=a.cm,k;a.iter(g,c.line+1,function(a){h&&f.collapsed&&!h.options.lineWrapping&&ja(a)==h.display.maxLine&&(k=!0);f.collapsed&&g!=b.line&&ia(a,0);var d=new cc(f,g==b.line?b.ch:null,g==c.line?c.ch:null);a.markedSpans=a.markedSpans?a.markedSpans.concat([d]):[d];d.marker.attachLine(a);++g});f.collapsed&&a.iter(b.line,c.line+1,function(b){Ia(a,b)&&ia(b,0)});f.clearOnEnter&&s(f,"beforeCursorEnter",function(){return f.clear()});
f.readOnly&&(af=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory());f.collapsed&&(f.id=++gf,f.atomic=!0);if(h){k&&(h.curOp.updateMaxLine=!0);if(f.collapsed)Q(h,b.line,c.line+1);else if(f.className||f.title||f.startStyle||f.endStyle||f.css)for(d=b.line;d<=c.line;d++)za(h,d,"text");f.atomic&&Xe(h.doc);P(h,"markerAdded",h,f)}return f}function qg(a,b,c,d,e){d=Ea(d);d.shared=!1;var f=[kb(a,b,c,d,e)],g=f[0],h=d.widgetNode;Pa(a,function(a){h&&(d.widgetNode=h.cloneNode(!0));f.push(kb(a,
w(a,b),w(a,c),d,e));for(var l=0;l<a.linked.length;++l)if(a.linked[l].isParent)return;g=z(f)});return new Lb(f,g)}function hf(a){return a.findMarks(q(a.first,0),a.clipPos(q(a.lastLine())),function(a){return a.parent})}function rg(a){for(var b=function(b){b=a[b];var c=[b.primary.doc];Pa(b.primary.doc,function(a){return c.push(a)});for(var f=0;f<b.markers.length;f++){var g=b.markers[f];-1==J(c,g.doc)&&(g.parent=null,b.markers.splice(f--,1))}},c=0;c<a.length;c++)b(c)}function sg(a){var b=this;jf(b);if(!G(b,
a)&&!sa(b.display,a)){N(a);A&&(kf=+new Date);var c=Oa(b,a,!0),d=a.dataTransfer.files;if(c&&!b.isReadOnly())if(d&&d.length&&window.FileReader&&window.File)for(var e=d.length,f=Array(e),g=0,h=function(a,d){if(!b.options.allowDropFileTypes||-1!=J(b.options.allowDropFileTypes,a.type)){var h=new FileReader;h.onload=I(b,function(){var a=h.result;/[\x00-\x08\x0e-\x1f]{2}/.test(a)&&(a="");f[d]=a;++g==e&&(c=w(b.doc,c),a={from:c,to:c,text:b.doc.splitLines(f.join(b.doc.lineSeparator())),origin:"paste"},ib(b.doc,
a),Ue(b.doc,ta(c,Aa(a))))});h.readAsText(a)}},k=0;k<e;++k)h(d[k],k);else if(b.state.draggingText&&-1<b.doc.sel.contains(c))b.state.draggingText(a),setTimeout(function(){return b.display.input.focus()},20);else try{if(h=a.dataTransfer.getData("Text")){b.state.draggingText&&!b.state.draggingText.copy&&(k=b.listSelections());tc(b.doc,ta(c,c));if(k)for(d=0;d<k.length;++d)jb(b.doc,"",k[d].anchor,k[d].head,"drag");b.replaceSelection(h,"around","paste");b.display.input.focus()}}catch(l){}}}function jf(a){a.display.dragCursor&&
(a.display.lineSpace.removeChild(a.display.dragCursor),a.display.dragCursor=null)}function lf(a){if(document.body.getElementsByClassName)for(var b=document.body.getElementsByClassName("CodeMirror"),c=0;c<b.length;c++){var d=b[c].CodeMirror;d&&a(d)}}function tg(){var a;s(window,"resize",function(){null==a&&(a=setTimeout(function(){a=null;lf(ug)},100))});s(window,"blur",function(){return lf(Cb)})}function ug(a){var b=a.display;if(b.lastWrapHeight!=b.wrapper.clientHeight||b.lastWrapWidth!=b.wrapper.clientWidth)b.cachedCharWidth=
b.cachedTextHeight=b.cachedPaddingH=null,b.scrollbarsClipped=!1,a.setSize()}function vg(a){var b=a.split(/-(?!$)/);a=b[b.length-1];for(var c,d,e,f,g=0;g<b.length-1;g++){var h=b[g];if(/^(cmd|meta|m)$/i.test(h))f=!0;else if(/^a(lt)?$/i.test(h))c=!0;else if(/^(c|ctrl|control)$/i.test(h))d=!0;else if(/^s(hift)?$/i.test(h))e=!0;else throw Error("Unrecognized modifier name: "+h);}c&&(a="Alt-"+a);d&&(a="Ctrl-"+a);f&&(a="Cmd-"+a);e&&(a="Shift-"+a);return a}function wg(a){var b={},c;for(c in a)if(a.hasOwnProperty(c)){var d=
a[c];if(!/^(name|fallthrough|(de|at)tach)$/.test(c)){if("..."!=d)for(var e=Yb(c.split(" "),vg),f=0;f<e.length;f++){var g=void 0,h=void 0;f==e.length-1?(h=e.join(" "),g=d):(h=e.slice(0,f+1).join(" "),g="...");var k=b[h];if(!k)b[h]=g;else if(k!=g)throw Error("Inconsistent bindings for "+h);}delete a[c]}}for(var l in b)a[l]=b[l];return a}function lb(a,b,c,d){b=vc(b);var e=b.call?b.call(a,d):b[a];if(!1===e)return"nothing";if("..."===e)return"multi";if(null!=e&&c(e))return"handled";if(b.fallthrough){if("[object Array]"!=
Object.prototype.toString.call(b.fallthrough))return lb(a,b.fallthrough,c,d);for(e=0;e<b.fallthrough.length;e++){var f=lb(a,b.fallthrough[e],c,d);if(f)return f}}}function mf(a){a="string"==typeof a?a:Ca[a.keyCode];return"Ctrl"==a||"Alt"==a||"Shift"==a||"Mod"==a}function nf(a,b){if(ga&&34==a.keyCode&&a["char"])return!1;var c=Ca[a.keyCode],d=c;if(null==d||a.altGraphKey)return!1;a.altKey&&"Alt"!=c&&(d="Alt-"+d);(of?a.metaKey:a.ctrlKey)&&"Ctrl"!=c&&(d="Ctrl-"+d);(of?a.ctrlKey:a.metaKey)&&"Cmd"!=c&&(d=
"Cmd-"+d);!b&&a.shiftKey&&"Shift"!=c&&(d="Shift-"+d);return d}function vc(a){return"string"==typeof a?Mb[a]:a}function mb(a,b){for(var c=a.doc.sel.ranges,d=[],e=0;e<c.length;e++){for(var f=b(c[e]);d.length&&0>=v(f.from,z(d).to);){var g=d.pop();if(0>v(g.from,f.from)){f.from=g.from;break}}d.push(f)}Y(a,function(){for(var b=d.length-1;0<=b;b--)jb(a.doc,"",d[b].from,d[b].to,"+delete");cb(a)})}function pf(a,b){var c=u(a.doc,b),d=ja(c);d!=c&&(b=B(d));return Vc(!0,a,d,b,1)}function qf(a,b){var c=pf(a,b.line),
d=u(a.doc,c.line),e=xa(d);return e&&0!=e[0].level?c:(d=Math.max(0,d.text.search(/\S/)),q(c.line,b.line==c.line&&b.ch<=d&&b.ch?0:d,c.sticky))}function wc(a,b,c){if("string"==typeof b&&(b=xc[b],!b))return!1;a.display.input.ensurePolled();var d=a.display.shift,e=!1;try{a.isReadOnly()&&(a.state.suppressEdits=!0),c&&(a.display.shift=!1),e=b(a)!=Bd}finally{a.display.shift=d,a.state.suppressEdits=!1}return e}function xg(a,b,c){for(var d=0;d<a.state.keyMaps.length;d++){var e=lb(b,a.state.keyMaps[d],c,a);
if(e)return e}return a.options.extraKeys&&lb(b,a.options.extraKeys,c,a)||lb(b,a.options.keyMap,c,a)}function yc(a,b,c,d){var e=a.state.keySeq;if(e){if(mf(b))return"handled";yg.set(50,function(){a.state.keySeq==e&&(a.state.keySeq=null,a.display.input.reset())});b=e+" "+b}d=xg(a,b,d);"multi"==d&&(a.state.keySeq=b);"handled"==d&&P(a,"keyHandled",a,b,c);if("handled"==d||"multi"==d)N(c),md(a);return e&&!d&&/\'$/.test(b)?(N(c),!0):!!d}function rf(a,b){var c=nf(b,!0);return c?b.shiftKey&&!a.state.keySeq?
yc(a,"Shift-"+c,b,function(b){return wc(a,b,!0)})||yc(a,c,b,function(b){if("string"==typeof b?/^go[A-Z]/.test(b):b.motion)return wc(a,b)}):yc(a,c,b,function(b){return wc(a,b)}):!1}function zg(a,b,c){return yc(a,"'"+c+"'",b,function(b){return wc(a,b,!0)})}function sf(a){this.curOp.focus=oa();if(!G(this,a)){A&&11>C&&27==a.keyCode&&(a.returnValue=!1);var b=a.keyCode;this.display.shift=16==b||a.shiftKey;var c=rf(this,a);ga&&(Cd=c?b:null,!c&&88==b&&!tf&&(ea?a.metaKey:a.ctrlKey)&&this.replaceSelection("",
null,"cut"));18!=b||/\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className)||Ag(this)}}function Ag(a){function b(a){18!=a.keyCode&&a.altKey||($a(c,"CodeMirror-crosshair"),da(document,"keyup",b),da(document,"mouseover",b))}var c=a.display.lineDiv;Ta(c,"CodeMirror-crosshair");s(document,"keyup",b);s(document,"mouseover",b)}function uf(a){16==a.keyCode&&(this.doc.sel.shift=!1);G(this,a)}function vf(a){if(!(sa(this.display,a)||G(this,a)||a.ctrlKey&&!a.altKey||ea&&a.metaKey)){var b=a.keyCode,c=
a.charCode;if(ga&&b==Cd)Cd=null,N(a);else if(!ga||a.which&&!(10>a.which)||!rf(this,a))if(b=String.fromCharCode(null==c?b:c),"\b"!=b&&!zg(this,a,b))this.display.input.onKeyPress(a)}}function Bg(a){var b=this.display;if(!(G(this,a)||b.activeTouch&&b.input.supportsTouch()))if(b.input.ensurePolled(),b.shift=a.shiftKey,sa(b,a))K||(b.scroller.draggable=!1,setTimeout(function(){return b.scroller.draggable=!0},100));else if(!Dd(this,a,"gutterClick",!0)){var c=Oa(this,a);window.focus();switch(Zd(a)){case 1:this.state.selectingText?
this.state.selectingText(a):c?Cg(this,a,c):(a.target||a.srcElement)==b.scroller&&N(a);break;case 2:K&&(this.state.lastMiddleDown=+new Date);c&&sc(this.doc,c);setTimeout(function(){return b.input.focus()},20);N(a);break;case 3:Ed?wf(this,a):gg(this)}}}function Cg(a,b,c){A?setTimeout(Fc(Ae,a),0):a.curOp.focus=oa();var d=+new Date,e;zc&&zc.time>d-400&&0==v(zc.pos,c)?e="triple":Ac&&Ac.time>d-400&&0==v(Ac.pos,c)?(e="double",zc={time:d,pos:c}):(e="single",Ac={time:d,pos:c});var d=a.doc.sel,f=ea?b.metaKey:
b.ctrlKey,g;a.options.dragDrop&&Dg&&!a.isReadOnly()&&"single"==e&&-1<(g=d.contains(c))&&(0>v((g=d.ranges[g]).from(),c)||0<c.xRel)&&(0<v(g.to(),c)||0>c.xRel)?Eg(a,b,c,f):Fg(a,b,c,e,f)}function Eg(a,b,c,d){var e=a.display,f=+new Date,g=I(a,function(h){K&&(e.scroller.draggable=!1);a.state.draggingText=!1;da(document,"mouseup",g);da(e.scroller,"drop",g);10>Math.abs(b.clientX-h.clientX)+Math.abs(b.clientY-h.clientY)&&(N(h),!d&&+new Date-200<f&&sc(a.doc,c),K||A&&9==C?setTimeout(function(){document.body.focus();
e.input.focus()},20):e.input.focus())});K&&(e.scroller.draggable=!0);a.state.draggingText=g;g.copy=ea?b.altKey:b.ctrlKey;e.scroller.dragDrop&&e.scroller.dragDrop();s(document,"mouseup",g);s(e.scroller,"drop",g)}function Fg(a,b,c,d,e){function f(b){if(0!=v(y,b))if(y=b,"rect"==d){for(var e=[],f=a.options.tabSize,g=aa(u(l,c.line).text,c.ch,f),h=aa(u(l,b.line).text,b.ch,f),k=Math.min(g,h),g=Math.max(g,h),h=Math.min(c.line,b.line),t=Math.min(a.lastLine(),Math.max(c.line,b.line));h<=t;h++){var r=u(l,h).text,
s=Gc(r,k,f);k==g?e.push(new x(q(h,s),q(h,s))):r.length>s&&e.push(new x(q(h,s),q(h,Gc(r,g,f))))}e.length||e.push(new x(c,c));M(l,ha(p.ranges.slice(0,n).concat(e),n),{origin:"*mouse",scroll:!1});a.scrollIntoView(b)}else k=m,e=k.anchor,f=b,"single"!=d&&(b="double"==d?a.findWordAt(b):new x(q(b.line,0),w(l,q(b.line+1,0))),0<v(b.anchor,e)?(f=b.head,e=bc(k.from(),b.anchor)):(f=b.anchor,e=ac(k.to(),b.head))),b=p.ranges.slice(0),b[n]=new x(w(l,e),f),M(l,ha(b,n),Fd)}function g(b){var c=++A,e=Oa(a,b,!0,"rect"==
d);if(e)if(0!=v(e,y)){a.curOp.focus=oa();f(e);var h=qd(k,l);(e.line>=h.to||e.line<h.from)&&setTimeout(I(a,function(){A==c&&g(b)}),150)}else{var m=b.clientY<z.top?-20:b.clientY>z.bottom?20:0;m&&setTimeout(I(a,function(){A==c&&(k.scroller.scrollTop+=m,g(b))}),50)}}function h(b){a.state.selectingText=!1;A=Infinity;N(b);k.input.focus();da(document,"mousemove",B);da(document,"mouseup",C);l.history.lastSelOrigin=null}var k=a.display,l=a.doc;N(b);var m,n,p=l.sel,t=p.ranges;e&&!b.shiftKey?(n=l.sel.contains(c),
m=-1<n?t[n]:new x(c,c)):(m=l.sel.primary(),n=l.sel.primIndex);if(Gg?b.shiftKey&&b.metaKey:b.altKey)d="rect",e||(m=new x(c,c)),c=Oa(a,b,!0,!0),n=-1;else if("double"==d){var r=a.findWordAt(c);m=a.display.shift||l.extend?Hb(l,m,r.anchor,r.head):r}else"triple"==d?(r=new x(q(c.line,0),w(l,q(c.line+1,0))),m=a.display.shift||l.extend?Hb(l,m,r.anchor,r.head):r):m=Hb(l,m,c);e?-1==n?(n=t.length,M(l,ha(t.concat([m]),n),{scroll:!1,origin:"*mouse"})):1<t.length&&t[n].empty()&&"single"==d&&!b.shiftKey?(M(l,ha(t.slice(0,
n).concat(t.slice(n+1)),0),{scroll:!1,origin:"*mouse"}),p=l.sel):zd(l,n,m,Fd):(n=0,M(l,new Z([m],0),Fd),p=l.sel);var y=c,z=k.wrapper.getBoundingClientRect(),A=0,B=I(a,function(a){Zd(a)?g(a):h(a)}),C=I(a,h);a.state.selectingText=C;s(document,"mousemove",B);s(document,"mouseup",C)}function Dd(a,b,c,d){var e,f;try{e=b.clientX,f=b.clientY}catch(g){return!1}if(e>=Math.floor(a.display.gutters.getBoundingClientRect().right))return!1;d&&N(b);d=a.display;var h=d.lineDiv.getBoundingClientRect();if(f>h.bottom||
!ba(a,c))return Wc(b);f-=h.top-d.viewOffset;for(h=0;h<a.options.gutters.length;++h){var k=d.gutters.childNodes[h];if(k&&k.getBoundingClientRect().right>=e)return e=Ga(a.doc,f),E(a,c,a,e,a.options.gutters[h],b),Wc(b)}}function wf(a,b){var c;(c=sa(a.display,b))||(c=ba(a,"gutterContextMenu")?Dd(a,b,"gutterContextMenu",!1):!1);if(!c&&!G(a,b,"contextmenu"))a.display.input.onContextMenu(b)}function xf(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+a.options.theme.replace(/(^|\s)\s*/g,
" cm-s-");Ab(a)}function Nb(a){Ke(a);Q(a);od(a)}function Hg(a,b,c){!b!=!(c&&c!=nb)&&(c=a.display.dragFunctions,b=b?s:da,b(a.display.scroller,"dragstart",c.start),b(a.display.scroller,"dragenter",c.enter),b(a.display.scroller,"dragover",c.over),b(a.display.scroller,"dragleave",c.leave),b(a.display.scroller,"drop",c.drop))}function Ig(a){a.options.lineWrapping?(Ta(a.display.wrapper,"CodeMirror-wrap"),a.display.sizer.style.minWidth="",a.display.sizerWidth=null):($a(a.display.wrapper,"CodeMirror-wrap"),
Rc(a));ld(a);Q(a);Ab(a);setTimeout(function(){return bb(a)},100)}function D(a,b){var c=this;if(!(this instanceof D))return new D(a,b);this.options=b=b?Ea(b):{};Ea(yf,b,!1);ud(b);var d=b.value;"string"==typeof d&&(d=new S(d,b.mode,null,b.lineSeparator));this.doc=d;var e=new D.inputStyles[b.inputStyle](this),e=this.display=new Pf(a,d,e);e.wrapper.CodeMirror=this;Ke(this);xf(this);b.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap");Ge(this);this.state={keyMaps:[],overlays:[],modeGen:0,
overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,draggingText:!1,highlight:new Qa,keySeq:null,specialChars:null};b.autofocus&&!qb&&e.input.focus();A&&11>C&&setTimeout(function(){return c.display.input.reset(!0)},20);Jg(this);zf||(tg(),zf=!0);db(this);this.curOp.forceUpdate=!0;Oe(this,d);b.autofocus&&!qb||this.hasFocus()?setTimeout(Fc(nd,this),20):Cb(this);for(var f in Bc)if(Bc.hasOwnProperty(f))Bc[f](c,b[f],nb);Be(this);b.finishInit&&b.finishInit(this);
for(d=0;d<Gd.length;++d)Gd[d](c);eb(this);K&&b.lineWrapping&&"optimizelegibility"==getComputedStyle(e.lineDiv).textRendering&&(e.lineDiv.style.textRendering="auto")}function Jg(a){function b(){d.activeTouch&&(e=setTimeout(function(){return d.activeTouch=null},1E3),f=d.activeTouch,f.end=+new Date)}function c(a,b){if(null==b.left)return!0;var d=b.left-a.left,c=b.top-a.top;return 400<d*d+c*c}var d=a.display;s(d.scroller,"mousedown",I(a,Bg));A&&11>C?s(d.scroller,"dblclick",I(a,function(b){if(!G(a,b)){var d=
Oa(a,b);!d||Dd(a,b,"gutterClick",!0)||sa(a.display,b)||(N(b),b=a.findWordAt(d),sc(a.doc,b.anchor,b.head))}})):s(d.scroller,"dblclick",function(b){return G(a,b)||N(b)});Ed||s(d.scroller,"contextmenu",function(b){return wf(a,b)});var e,f={end:0};s(d.scroller,"touchstart",function(b){var c;if(c=!G(a,b))1!=b.touches.length?c=!1:(c=b.touches[0],c=1>=c.radiusX&&1>=c.radiusY),c=!c;c&&(d.input.ensurePolled(),clearTimeout(e),c=+new Date,d.activeTouch={start:c,moved:!1,prev:300>=c-f.end?f:null},1==b.touches.length&&
(d.activeTouch.left=b.touches[0].pageX,d.activeTouch.top=b.touches[0].pageY))});s(d.scroller,"touchmove",function(){d.activeTouch&&(d.activeTouch.moved=!0)});s(d.scroller,"touchend",function(e){var f=d.activeTouch;if(f&&!sa(d,e)&&null!=f.left&&!f.moved&&300>new Date-f.start){var g=a.coordsChar(d.activeTouch,"page"),f=!f.prev||c(f,f.prev)?new x(g,g):!f.prev.prev||c(f,f.prev.prev)?a.findWordAt(g):new x(q(g.line,0),w(a.doc,q(g.line+1,0)));a.setSelection(f.anchor,f.head);a.focus();N(e)}b()});s(d.scroller,
"touchcancel",b);s(d.scroller,"scroll",function(){d.scroller.clientHeight&&(Db(a,d.scroller.scrollTop),ab(a,d.scroller.scrollLeft,!0),E(a,"scroll",a))});s(d.scroller,"mousewheel",function(b){return Ee(a,b)});s(d.scroller,"DOMMouseScroll",function(b){return Ee(a,b)});s(d.wrapper,"scroll",function(){return d.wrapper.scrollTop=d.wrapper.scrollLeft=0});d.dragFunctions={enter:function(b){G(a,b)||ub(b)},over:function(b){if(!G(a,b)){var d=Oa(a,b);if(d){var c=document.createDocumentFragment();ze(a,d,c);a.display.dragCursor||
(a.display.dragCursor=r("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),a.display.lineSpace.insertBefore(a.display.dragCursor,a.display.cursorDiv));W(a.display.dragCursor,c)}ub(b)}},start:function(b){if(A&&(!a.state.draggingText||100>+new Date-kf))ub(b);else if(!G(a,b)&&!sa(a.display,b)&&(b.dataTransfer.setData("Text",a.getSelection()),b.dataTransfer.effectAllowed="copyMove",b.dataTransfer.setDragImage&&!Af)){var d=r("img",null,null,"position: fixed; left: 0; top: 0;");d.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d";
ga&&(d.width=d.height=1,a.display.wrapper.appendChild(d),d._top=d.offsetTop);b.dataTransfer.setDragImage(d,0,0);ga&&d.parentNode.removeChild(d)}},drop:I(a,sg),leave:function(b){G(a,b)||jf(a)}};var g=d.input.getField();s(g,"keyup",function(b){return uf.call(a,b)});s(g,"keydown",I(a,sf));s(g,"keypress",I(a,vf));s(g,"focus",function(b){return nd(a,b)});s(g,"blur",function(b){return Cb(a,b)})}function Ob(a,b,c,d){var e=a.doc,f;null==c&&(c="add");"smart"==c&&(e.mode.indent?f=vb(a,b):c="prev");var g=a.options.tabSize,
h=u(e,b),k=aa(h.text,null,g);h.stateAfter&&(h.stateAfter=null);var l=h.text.match(/^\s*/)[0],m;if(!d&&!/\S/.test(h.text))m=0,c="not";else if("smart"==c&&(m=e.mode.indent(f,h.text.slice(l.length),h.text),m==Bd||150<m)){if(!d)return;c="prev"}"prev"==c?m=b>e.first?aa(u(e,b-1).text,null,g):0:"add"==c?m=k+a.options.indentUnit:"subtract"==c?m=k-a.options.indentUnit:"number"==typeof c&&(m=k+c);m=Math.max(0,m);c="";d=0;if(a.options.indentWithTabs)for(a=Math.floor(m/g);a;--a)d+=g,c+="\t";d<m&&(c+=Hc(m-d));
if(c!=l)return jb(e,c,q(b,0),q(b,l.length),"+input"),h.stateAfter=null,!0;for(g=0;g<e.sel.ranges.length;g++)if(h=e.sel.ranges[g],h.head.line==b&&h.head.ch<l.length){b=q(b,l.length);zd(e,g,new x(b,b));break}}function Bf(a){V=a}function Hd(a,b,c,d,e){var f=a.doc;a.display.shift=!1;d||(d=f.sel);var g=a.state.pasteIncoming||"paste"==e,h=Id(b),k=null;if(g&&1<d.ranges.length)if(V&&V.text.join("\n")==b){if(0==d.ranges.length%V.text.length)for(var k=[],l=0;l<V.text.length;l++)k.push(f.splitLines(V.text[l]))}else h.length==
d.ranges.length&&(k=Yb(h,function(a){return[a]}));for(var m,l=d.ranges.length-1;0<=l;l--){m=d.ranges[l];var n=m.from(),p=m.to();m.empty()&&(c&&0<c?n=q(n.line,n.ch-c):a.state.overwrite&&!g?p=q(p.line,Math.min(u(f,p.line).text.length,p.ch+z(h).length)):V&&V.lineWise&&V.text.join("\n")==b&&(n=p=q(n.line,0)));m=a.curOp.updateInput;n={from:n,to:p,text:k?k[l%k.length]:h,origin:e||(g?"paste":a.state.cutIncoming?"cut":"+input")};ib(a.doc,n);P(a,"inputRead",a,n)}b&&!g&&Cf(a,b);cb(a);a.curOp.updateInput=m;
a.curOp.typing=!0;a.state.pasteIncoming=a.state.cutIncoming=!1}function Df(a,b){var c=a.clipboardData&&a.clipboardData.getData("Text");if(c)return a.preventDefault(),b.isReadOnly()||b.options.disableInput||Y(b,function(){return Hd(b,c,0,null,"paste")}),!0}function Cf(a,b){if(a.options.electricChars&&a.options.smartIndent)for(var c=a.doc.sel,d=c.ranges.length-1;0<=d;d--){var e=c.ranges[d];if(!(100<e.head.ch||d&&c.ranges[d-1].head.line==e.head.line)){var f=a.getModeAt(e.head),g=!1;if(f.electricChars)for(var h=
0;h<f.electricChars.length;h++){if(-1<b.indexOf(f.electricChars.charAt(h))){g=Ob(a,e.head.line,"smart");break}}else f.electricInput&&f.electricInput.test(u(a.doc,e.head.line).text.slice(0,e.head.ch))&&(g=Ob(a,e.head.line,"smart"));g&&P(a,"electricInput",a,e.head.line)}}}function Ef(a){for(var b=[],c=[],d=0;d<a.doc.sel.ranges.length;d++){var e=a.doc.sel.ranges[d].head.line,e={anchor:q(e,0),head:q(e+1,0)};c.push(e);b.push(a.getRange(e.anchor,e.head))}return{text:b,ranges:c}}function Ff(a,b){a.setAttribute("autocorrect",
"off");a.setAttribute("autocapitalize","off");a.setAttribute("spellcheck",!!b)}function Gf(){var a=r("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),b=r("div",[a],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");K?a.style.width="1000px":a.setAttribute("wrap","off");Pb&&(a.style.border="1px solid black");Ff(a);return b}function Jd(a,b,c,d,e){function f(d){var f;f=e?Vd(a.cm,k,b,c):Uc(k,b,c);if(null==f){if(d=!d)d=b.line+
c,d<a.first||d>=a.first+a.size?d=!1:(b=new q(d,b.ch,b.sticky),d=k=u(a,d));if(d)b=Vc(e,a.cm,k,b.line,c);else return!1}else b=f;return!0}var g=b,h=c,k=u(a,b.line);if("char"==d)f();else if("column"==d)f(!0);else if("word"==d||"group"==d){var l=null;d="group"==d;for(var m=a.cm&&a.cm.getHelper(b,"wordChars"),n=!0;!(0>c)||f(!n);n=!1){var p=k.text.charAt(b.ch)||"\n",p=Zb(p,m)?"w":d&&"\n"==p?"n":!d||/\s/.test(p)?null:"p";!d||n||p||(p="s");if(l&&l!=p){0>c&&(c=1,f(),b.sticky="after");break}p&&(l=p);if(0<c&&
!f(!n))break}}h=Ad(a,b,g,h,!0);Mc(g,h)&&(h.hitSide=!0);return h}function Hf(a,b,c,d){var e=a.doc,f=b.left,g;"page"==d?(g=Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight),g=Math.max(g-.5*Ma(a.display),3),g=(0<c?b.bottom:b.top)+c*g):"line"==d&&(g=0<c?b.bottom+3:b.top-3);for(;;){b=jd(a,f,g);if(!b.outside)break;if(0>c?0>=g:g>=e.height){b.hitSide=!0;break}g+=5*c}return b}function If(a,b){var c=gd(a,b.line);if(!c||c.hidden)return null;var d=u(a.doc,b.line),
c=qe(c,d,b.line),d=xa(d),e="left";d&&(e=Sc(d,b.ch)%2?"right":"left");c=re(c.map,b.ch,e);c.offset="right"==c.collapse?c.end:c.start;return c}function ob(a,b){b&&(a.bad=!0);return a}function Kg(a,b,c,d,e){function f(a){return function(b){return b.id==a}}function g(b){if(1==b.nodeType){var c=b.getAttribute("cm-text");if(null!=c)h=""==c?h+b.textContent.replace(/\u200b/g,""):h+c;else{var c=b.getAttribute("cm-marker"),p;if(c)b=a.findMarks(q(d,0),q(e+1,0),f(+c)),b.length&&(p=b[0].find())&&(h+=Fa(a.doc,p.from,
p.to).join(l));else if("false"!=b.getAttribute("contenteditable")){for(p=0;p<b.childNodes.length;p++)g(b.childNodes[p]);/^(pre|div|p)$/i.test(b.nodeName)&&(k=!0)}}}else 3==b.nodeType&&(b=b.nodeValue)&&(k&&(h+=l,k=!1),h+=b)}for(var h="",k=!1,l=a.doc.lineSeparator();;){g(b);if(b==c)break;b=b.nextSibling}return h}function Cc(a,b,c){var d;if(b==a.display.lineDiv){d=a.display.lineDiv.childNodes[c];if(!d)return ob(a.clipPos(q(a.display.viewTo-1)),!0);b=null;c=0}else for(d=b;;d=d.parentNode){if(!d||d==a.display.lineDiv)return null;
if(d.parentNode&&d.parentNode==a.display.lineDiv)break}for(var e=0;e<a.display.view.length;e++){var f=a.display.view[e];if(f.node==d)return Lg(f,b,c)}}function Lg(a,b,c){function d(b,d,c){for(var e=-1;e<(l?l.length:0);e++)for(var f=0>e?k.map:l[e],g=0;g<f.length;g+=3){var h=f[g+2];if(h==b||h==d){d=B(0>e?a.line:a.rest[e]);e=f[g]+c;if(0>c||h!=b)e=f[g+(c?1:0)];return q(d,e)}}}var e=a.text.firstChild,f=!1;if(!b||!Wb(e,b))return ob(q(B(a.line),0),!0);if(b==e&&(f=!0,b=e.childNodes[c],c=0,!b))return c=a.rest?
z(a.rest):a.line,ob(q(B(c),c.text.length),f);var g=3==b.nodeType?b:null,h=b;g||1!=b.childNodes.length||3!=b.firstChild.nodeType||(g=b.firstChild,c&&(c=g.nodeValue.length));for(;h.parentNode!=e;)h=h.parentNode;var k=a.measure,l=k.maps;if(b=d(g,h,c))return ob(b,f);e=h.nextSibling;for(g=g?g.nodeValue.length-c:0;e;e=e.nextSibling){if(b=d(e,e.firstChild,0))return ob(q(b.line,b.ch-g),f);g+=e.textContent.length}for(h=h.previousSibling;h;h=h.previousSibling){if(b=d(h,h.firstChild,-1))return ob(q(b.line,b.ch+
c),f);c+=h.textContent.length}}var T=navigator.userAgent,Jf=navigator.platform,va=/gecko\/\d/i.test(T),Kf=/MSIE \d/.test(T),Lf=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(T),Qb=/Edge\/(\d+)/.exec(T),A=Kf||Lf||Qb,C=A&&(Kf?document.documentMode||6:+(Qb||Lf)[1]),K=!Qb&&/WebKit\//.test(T),Mg=K&&/Qt\/\d+\.\d+/.test(T),Ng=!Qb&&/Chrome\//.test(T),ga=/Opera\//.test(T),Af=/Apple Computer/.test(navigator.vendor),Og=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(T),jg=/PhantomJS/.test(T),Pb=!Qb&&/AppleWebKit/.test(T)&&
/Mobile\/\w+/.test(T),qb=Pb||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(T),ea=Pb||/Mac/.test(Jf),Gg=/\bCrOS\b/.test(T),Pg=/win/i.test(Jf),Ra=ga&&T.match(/Version\/(\d*\.\d*)/);Ra&&(Ra=Number(Ra[1]));Ra&&15<=Ra&&(ga=!1,K=!0);var of=ea&&(Mg||ga&&(null==Ra||12.11>Ra)),Ed=va||A&&9<=C,$a=function(a,b){var c=a.className,d=Da(b).exec(c);if(d){var e=c.slice(d.index+d[0].length);a.className=c.slice(0,d.index)+(e?d[1]+e:"")}},Ya;Ya=document.createRange?function(a,b,c,d){var e=document.createRange();
e.setEnd(d||a,c);e.setStart(a,b);return e}:function(a,b,c){var d=document.body.createTextRange();try{d.moveToElementText(a.parentNode)}catch(e){return d}d.collapse(!0);d.moveEnd("character",c);d.moveStart("character",b);return d};var pb=function(a){a.select()};Pb?pb=function(a){a.selectionStart=0;a.selectionEnd=a.value.length}:A&&(pb=function(a){try{a.select()}catch(b){}});var Qa=function(){this.id=null};Qa.prototype.set=function(a,b){clearTimeout(this.id);this.id=setTimeout(b,a)};var Bd={toString:function(){return"CodeMirror.Pass"}},
ma={scroll:!1},Fd={origin:"*mouse"},Rb={origin:"+move"},Xb=[""],Nf=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,Of=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
af=!1,wa=!1,tb=null,Sf=function(){function a(a){return 247>=a?"bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(a):1424<=a&&1524>=a?"R":1536<=a&&1785>=a?"nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111".charAt(a-
1536):1774<=a&&2220>=a?"r":8192<=a&&8203>=a?"w":8204==a?"b":"L"}function b(a,b,d){this.level=a;this.from=b;this.to=d}var c=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,d=/[stwN]/,e=/[LRr]/,f=/[Lb1n]/,g=/[1n]/;return function(h){if(!c.test(h))return!1;for(var k=h.length,l=[],m=0;m<k;++m)l.push(a(h.charCodeAt(m)));for(var m=0,n="L";m<k;++m){var p=l[m];"m"==p?l[m]=n:n=p}m=0;for(n="L";m<k;++m)p=l[m],"1"==p&&"r"==n?l[m]="n":e.test(p)&&(n=p,"r"==p&&(l[m]="R"));m=1;for(n=l[0];m<k-1;++m)p=l[m],"+"==p&&"1"==
n&&"1"==l[m+1]?l[m]="1":","!=p||n!=l[m+1]||"1"!=n&&"n"!=n||(l[m]=n),n=p;for(m=0;m<k;++m)if(n=l[m],","==n)l[m]="N";else if("%"==n){n=void 0;for(n=m+1;n<k&&"%"==l[n];++n);for(p=m&&"!"==l[m-1]||n<k&&"1"==l[n]?"1":"N";m<n;++m)l[m]=p;m=n-1}m=0;for(n="L";m<k;++m)p=l[m],"L"==n&&"1"==p?l[m]="L":e.test(p)&&(n=p);for(n=0;n<k;++n)if(d.test(l[n])){m=void 0;for(m=n+1;m<k&&d.test(l[m]);++m);p="L"==(m<k?l[m]:"L");for(p="L"==(n?l[n-1]:"L")||p?"L":"R";n<m;++n)l[n]=p;n=m-1}for(var m=[],q,n=0;n<k;)if(f.test(l[n])){p=
n;for(++n;n<k&&f.test(l[n]);++n);m.push(new b(0,p,n))}else{var r=n,p=m.length;for(++n;n<k&&"L"!=l[n];++n);for(var s=r;s<n;)if(g.test(l[s])){r<s&&m.splice(p,0,new b(1,r,s));r=s;for(++s;s<n&&g.test(l[s]);++s);m.splice(p,0,new b(2,r,s));r=s}else++s;r<n&&m.splice(p,0,new b(1,r,n))}1==m[0].level&&(q=h.match(/^\s+/))&&(m[0].from=q[0].length,m.unshift(new b(0,0,q[0].length)));1==z(m).level&&(q=h.match(/\s+$/))&&(z(m).to-=q[0].length,m.push(new b(0,k-q[0].length,k)));return m}}(),fc=[],s=function(a,b,c){a.addEventListener?
a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):(a=a._handlers||(a._handlers={}),a[b]=(a[b]||fc).concat(c))},Dg=function(){if(A&&9>C)return!1;var a=r("div");return"draggable"in a||"dragDrop"in a}(),Xc,cd,Id=3!="\n\nb".split(/\n/).length?function(a){for(var b=0,c=[],d=a.length;b<=d;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var f=a.slice(b,"\r"==a.charAt(e-1)?e-1:e),g=f.indexOf("\r");-1!=g?(c.push(f.slice(0,g)),b+=g+1):(c.push(f),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)},
Qg=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){var b;try{b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},tf=function(){var a=r("div");if("oncopy"in a)return!0;a.setAttribute("oncopy","return;");return"function"==typeof a.oncopy}(),id=null,Yc={},Wa={},Xa={},H=function(a,b){this.pos=this.start=0;this.string=a;this.tabSize=b||8;this.lineStart=this.lastColumnPos=
this.lastColumnValue=0};H.prototype.eol=function(){return this.pos>=this.string.length};H.prototype.sol=function(){return this.pos==this.lineStart};H.prototype.peek=function(){return this.string.charAt(this.pos)||void 0};H.prototype.next=function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)};H.prototype.eat=function(a){var b=this.string.charAt(this.pos);if("string"==typeof a?b==a:b&&(a.test?a.test(b):a(b)))return++this.pos,b};H.prototype.eatWhile=function(a){for(var b=this.pos;this.eat(a););
return this.pos>b};H.prototype.eatSpace=function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a};H.prototype.skipToEnd=function(){this.pos=this.string.length};H.prototype.skipTo=function(a){a=this.string.indexOf(a,this.pos);if(-1<a)return this.pos=a,!0};H.prototype.backUp=function(a){this.pos-=a};H.prototype.column=function(){this.lastColumnPos<this.start&&(this.lastColumnValue=aa(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),
this.lastColumnPos=this.start);return this.lastColumnValue-(this.lineStart?aa(this.string,this.lineStart,this.tabSize):0)};H.prototype.indentation=function(){return aa(this.string,null,this.tabSize)-(this.lineStart?aa(this.string,this.lineStart,this.tabSize):0)};H.prototype.match=function(a,b,c){if("string"==typeof a){var d=function(a){return c?a.toLowerCase():a},e=this.string.substr(this.pos,a.length);if(d(e)==d(a))return!1!==b&&(this.pos+=a.length),!0}else{if((a=this.string.slice(this.pos).match(a))&&
0<a.index)return null;a&&!1!==b&&(this.pos+=a[0].length);return a}};H.prototype.current=function(){return this.string.slice(this.start,this.pos)};H.prototype.hideFirstChars=function(a,b){this.lineStart+=a;try{return b()}finally{this.lineStart-=a}};var fb=function(a,b,c){this.text=a;Rd(this,b);this.height=c?c(this):1};fb.prototype.lineNo=function(){return B(this)};Va(fb);var Yf={},Xf={},Za=null,wb=null,se={left:0,right:0,top:0,bottom:0},Na,kc=0,X=null;A?X=-.53:va?X=15:Ng?X=-.7:Af&&(X=-1/3);var Sa=
function(a,b,c){this.cm=c;var d=this.vert=r("div",[r("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),e=this.horiz=r("div",[r("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");a(d);a(e);s(d,"scroll",function(){d.clientHeight&&b(d.scrollTop,"vertical")});s(e,"scroll",function(){e.clientWidth&&b(e.scrollLeft,"horizontal")});this.checkedZeroWidth=!1;A&&8>C&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")};Sa.prototype.update=function(a){var b=a.scrollWidth>
a.clientWidth+1,c=a.scrollHeight>a.clientHeight+1,d=a.nativeBarWidth;c?(this.vert.style.display="block",this.vert.style.bottom=b?d+"px":"0",this.vert.firstChild.style.height=Math.max(0,a.scrollHeight-a.clientHeight+(a.viewHeight-(b?d:0)))+"px"):(this.vert.style.display="",this.vert.firstChild.style.height="0");b?(this.horiz.style.display="block",this.horiz.style.right=c?d+"px":"0",this.horiz.style.left=a.barLeft+"px",this.horiz.firstChild.style.width=Math.max(0,a.scrollWidth-a.clientWidth+(a.viewWidth-
a.barLeft-(c?d:0)))+"px"):(this.horiz.style.display="",this.horiz.firstChild.style.width="0");!this.checkedZeroWidth&&0<a.clientHeight&&(0==d&&this.zeroWidthHack(),this.checkedZeroWidth=!0);return{right:c?d:0,bottom:b?d:0}};Sa.prototype.setScrollLeft=function(a){this.horiz.scrollLeft!=a&&(this.horiz.scrollLeft=a);this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz)};Sa.prototype.setScrollTop=function(a){this.vert.scrollTop!=a&&(this.vert.scrollTop=a);this.disableVert&&this.enableZeroWidthBar(this.vert,
this.disableVert)};Sa.prototype.zeroWidthHack=function(){this.horiz.style.height=this.vert.style.width=ea&&!Og?"12px":"18px";this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none";this.disableHoriz=new Qa;this.disableVert=new Qa};Sa.prototype.enableZeroWidthBar=function(a,b){function c(){var d=a.getBoundingClientRect();document.elementFromPoint(d.left+1,d.bottom-1)!=a?a.style.pointerEvents="none":b.set(1E3,c)}a.style.pointerEvents="auto";b.set(1E3,c)};Sa.prototype.clear=function(){var a=
this.horiz.parentNode;a.removeChild(this.horiz);a.removeChild(this.vert)};var Sb=function(){};Sb.prototype.update=function(){return{bottom:0,right:0}};Sb.prototype.setScrollLeft=function(){};Sb.prototype.setScrollTop=function(){};Sb.prototype.clear=function(){};var He={"native":Sa,"null":Sb},ig=0,oc=function(a,b,c){var d=a.display;this.viewport=b;this.visible=qd(d,a.doc,b);this.editorIsHidden=!d.wrapper.offsetWidth;this.wrapperHeight=d.wrapper.clientHeight;this.wrapperWidth=d.wrapper.clientWidth;
this.oldDisplayWidth=Ka(a);this.force=c;this.dims=hd(a);this.events=[]};oc.prototype.signal=function(a,b){ba(a,b)&&this.events.push(arguments)};oc.prototype.finish=function(){for(var a=0;a<this.events.length;a++)E.apply(null,this.events[a])};var Z=function(a,b){this.ranges=a;this.primIndex=b};Z.prototype.primary=function(){return this.ranges[this.primIndex]};Z.prototype.equals=function(a){if(a==this)return!0;if(a.primIndex!=this.primIndex||a.ranges.length!=this.ranges.length)return!1;for(var b=0;b<
this.ranges.length;b++){var c=this.ranges[b],d=a.ranges[b];if(!Mc(c.anchor,d.anchor)||!Mc(c.head,d.head))return!1}return!0};Z.prototype.deepCopy=function(){for(var a=[],b=0;b<this.ranges.length;b++)a[b]=new x(Nc(this.ranges[b].anchor),Nc(this.ranges[b].head));return new Z(a,this.primIndex)};Z.prototype.somethingSelected=function(){for(var a=0;a<this.ranges.length;a++)if(!this.ranges[a].empty())return!0;return!1};Z.prototype.contains=function(a,b){b||(b=a);for(var c=0;c<this.ranges.length;c++){var d=
this.ranges[c];if(0<=v(b,d.from())&&0>=v(a,d.to()))return c}return-1};var x=function(a,b){this.anchor=a;this.head=b};x.prototype.from=function(){return bc(this.anchor,this.head)};x.prototype.to=function(){return ac(this.anchor,this.head)};x.prototype.empty=function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch};var ua=function(a){this.lines=a;this.parent=null;for(var b=0,c=0;c<a.length;++c)a[c].parent=this,b+=a[c].height;this.height=b};ua.prototype.chunkSize=function(){return this.lines.length};
ua.prototype.removeInner=function(a,b){for(var c=a,d=a+b;c<d;++c){var e=this.lines[c];this.height-=e.height;var f=e;f.parent=null;Qd(f);P(e,"delete")}this.lines.splice(a,b)};ua.prototype.collapse=function(a){a.push.apply(a,this.lines)};ua.prototype.insertInner=function(a,b,c){this.height+=c;this.lines=this.lines.slice(0,a).concat(b).concat(this.lines.slice(a));for(a=0;a<b.length;++a)b[a].parent=this};ua.prototype.iterN=function(a,b,c){for(b=a+b;a<b;++a)if(c(this.lines[a]))return!0};var na=function(a){this.children=
a;for(var b=0,c=0,d=0;d<a.length;++d){var e=a[d],b=b+e.chunkSize(),c=c+e.height;e.parent=this}this.size=b;this.height=c;this.parent=null};na.prototype.chunkSize=function(){return this.size};na.prototype.removeInner=function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(a<e){var f=Math.min(b,e-a),g=d.height;d.removeInner(a,f);this.height-=g-d.height;e==f&&(this.children.splice(c--,1),d.parent=null);if(0==(b-=f))break;a=0}else a-=e}25>this.size-
b&&(1<this.children.length||!(this.children[0]instanceof ua))&&(c=[],this.collapse(c),this.children=[new ua(c)],this.children[0].parent=this)};na.prototype.collapse=function(a){for(var b=0;b<this.children.length;++b)this.children[b].collapse(a)};na.prototype.insertInner=function(a,b,c){this.size+=b.length;this.height+=c;for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<=f){e.insertInner(a,b,c);if(e.lines&&50<e.lines.length){for(b=a=e.lines.length%25+25;b<e.lines.length;)c=
new ua(e.lines.slice(b,b+=25)),e.height-=c.height,this.children.splice(++d,0,c),c.parent=this;e.lines=e.lines.slice(0,a);this.maybeSpill()}break}a-=f}};na.prototype.maybeSpill=function(){if(!(10>=this.children.length)){var a=this;do{var b=a.children.splice(a.children.length-5,5),b=new na(b);if(a.parent){a.size-=b.size;a.height-=b.height;var c=J(a.parent.children,a);a.parent.children.splice(c+1,0,b)}else c=new na(a.children),c.parent=a,a.children=[c,b],a=c;b.parent=a.parent}while(10<a.children.length);
a.parent.maybeSpill()}};na.prototype.iterN=function(a,b,c){for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<f){f=Math.min(b,f-a);if(e.iterN(a,f,c))return!0;if(0==(b-=f))break;a=0}else a-=f}};var Kb=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.doc=a;this.node=b};Kb.prototype.clear=function(){var a=this.doc.cm,b=this.line.widgets,c=this.line,d=B(c);if(null!=d&&b){for(var e=0;e<b.length;++e)b[e]==this&&b.splice(e--,1);b.length||(c.widgets=
null);var f=yb(this);ia(c,Math.max(0,c.height-f));a&&(Y(a,function(){var b=-f;ka(c)<(a.curOp&&a.curOp.scrollTop||a.doc.scrollTop)&&mc(a,null,b);za(a,d,"widget")}),P(a,"lineWidgetCleared",a,this))}};Kb.prototype.changed=function(){var a=this.height,b=this.doc.cm,c=this.line;this.height=null;var d=yb(this)-a;d&&(ia(c,c.height+d),b&&Y(b,function(){b.curOp.forceUpdate=!0;ka(c)<(b.curOp&&b.curOp.scrollTop||b.doc.scrollTop)&&mc(b,null,d)}))};Va(Kb);var gf=0,Ba=function(a,b){this.lines=[];this.type=b;this.doc=
a;this.id=++gf};Ba.prototype.clear=function(){if(!this.explicitlyCleared){var a=this.doc.cm,b=a&&!a.curOp;b&&db(a);if(ba(this,"clear")){var c=this.find();c&&P(this,"clear",c.from,c.to)}for(var d=c=null,e=0;e<this.lines.length;++e){var f=this.lines[e],g=sb(f.markedSpans,this);a&&!this.collapsed?za(a,B(f),"text"):a&&(null!=g.to&&(d=B(f)),null!=g.from&&(c=B(f)));for(var h=f,k=f.markedSpans,l=g,m=void 0,n=0;n<k.length;++n)k[n]!=l&&(m||(m=[])).push(k[n]);h.markedSpans=m;null==g.from&&this.collapsed&&!Ia(this.doc,
f)&&a&&ia(f,Ma(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(e=0;e<this.lines.length;++e)f=ja(this.lines[e]),g=dc(f),g>a.display.maxLineLength&&(a.display.maxLine=f,a.display.maxLineLength=g,a.display.maxLineChanged=!0);null!=c&&a&&this.collapsed&&Q(a,c,d+1);this.lines.length=0;this.explicitlyCleared=!0;this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&Xe(a.doc));a&&P(a,"markerCleared",a,this);b&&eb(a);this.parent&&this.parent.clear()}};Ba.prototype.find=function(a,b){null==
a&&"bookmark"==this.type&&(a=1);for(var c,d,e=0;e<this.lines.length;++e){var f=this.lines[e],g=sb(f.markedSpans,this);if(null!=g.from&&(c=q(b?f:B(f),g.from),-1==a))return c;if(null!=g.to&&(d=q(b?f:B(f),g.to),1==a))return d}return c&&{from:c,to:d}};Ba.prototype.changed=function(){var a=this.find(-1,!0),b=this,c=this.doc.cm;a&&c&&Y(c,function(){var d=a.line,e=B(a.line);if(e=gd(c,e))te(e),c.curOp.selectionChanged=c.curOp.forceUpdate=!0;c.curOp.updateMaxLine=!0;Ia(b.doc,d)||null==b.height||(e=b.height,
b.height=null,(e=yb(b)-e)&&ia(d,d.height+e))})};Ba.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=J(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)};Ba.prototype.detachLine=function(a){this.lines.splice(J(this.lines,a),1);!this.lines.length&&this.doc.cm&&(a=this.doc.cm.curOp,(a.maybeHiddenMarkers||(a.maybeHiddenMarkers=[])).push(this))};Va(Ba);var Lb=function(a,b){this.markers=
a;this.primary=b;for(var c=0;c<a.length;++c)a[c].parent=this};Lb.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();P(this,"clear")}};Lb.prototype.find=function(a,b){return this.primary.find(a,b)};Va(Lb);var Rg=0,S=function(a,b,c,d){if(!(this instanceof S))return new S(a,b,c,d);null==c&&(c=0);na.call(this,[new ua([new fb("",null)])]);this.first=c;this.scrollTop=this.scrollLeft=0;this.cantEdit=!1;this.cleanGeneration=
1;this.frontier=c;c=q(c,0);this.sel=ta(c);this.history=new qc(null);this.id=++Rg;this.modeOption=b;this.lineSep=d;this.extend=!1;"string"==typeof a&&(a=this.splitLines(a));xd(this,{from:c,to:c,text:a});M(this,ta(c),ma)};S.prototype=Ld(na.prototype,{constructor:S,iter:function(a,b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,a)},insert:function(a,b){for(var c=0,d=0;d<b.length;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-
this.first,b)},getValue:function(a){var b=Kc(this,this.first,this.first+this.size);return!1===a?b:b.join(a||this.lineSeparator())},setValue:L(function(a){var b=q(this.first,0),c=this.first+this.size-1;ib(this,{from:b,to:q(c,u(this,c).text.length),text:this.splitLines(a),origin:"setValue",full:!0},!0);M(this,ta(b))}),replaceRange:function(a,b,c,d){b=w(this,b);c=c?w(this,c):b;jb(this,a,b,c,d)},getRange:function(a,b,c){a=Fa(this,w(this,a),w(this,b));return!1===c?a:a.join(c||this.lineSeparator())},getLine:function(a){return(a=
this.getLineHandle(a))&&a.text},getLineHandle:function(a){if(rb(this,a))return u(this,a)},getLineNumber:function(a){return B(a)},getLineHandleVisualStart:function(a){"number"==typeof a&&(a=u(this,a));return ja(a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+this.size-1},clipPos:function(a){return w(this,a)},getCursor:function(a){var b=this.sel.primary();return null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||"to"==a||
!1===a?b.to():b.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:L(function(a,b,c){a=w(this,"number"==typeof a?q(a,b||0):a);M(this,ta(a,null),c)}),setSelection:L(function(a,b,c){var d=w(this,a);a=w(this,b||a);M(this,ta(d,a),c)}),extendSelection:L(function(a,b,c){sc(this,w(this,a),b&&w(this,b),c)}),extendSelections:L(function(a,b){Te(this,Od(this,a),b)}),extendSelectionsBy:L(function(a,b){var c=Yb(this.sel.ranges,
a);Te(this,Od(this,c),b)}),setSelections:L(function(a,b,c){if(a.length){for(var d=[],e=0;e<a.length;e++)d[e]=new x(w(this,a[e].anchor),w(this,a[e].head));null==b&&(b=Math.min(a.length-1,this.sel.primIndex));M(this,ha(d,b),c)}}),addSelection:L(function(a,b,c){var d=this.sel.ranges.slice(0);d.push(new x(w(this,a),w(this,b||a)));M(this,ha(d,d.length-1),c)}),getSelection:function(a){for(var b=this.sel.ranges,c,d=0;d<b.length;d++){var e=Fa(this,b[d].from(),b[d].to());c=c?c.concat(e):e}return!1===a?c:c.join(a||
this.lineSeparator())},getSelections:function(a){for(var b=[],c=this.sel.ranges,d=0;d<c.length;d++){var e=Fa(this,c[d].from(),c[d].to());!1!==a&&(e=e.join(a||this.lineSeparator()));b[d]=e}return b},replaceSelection:function(a,b,c){for(var d=[],e=0;e<this.sel.ranges.length;e++)d[e]=a;this.replaceSelections(d,b,c||"+input")},replaceSelections:L(function(a,b,c){for(var d=[],e=this.sel,f=0;f<e.ranges.length;f++){var g=e.ranges[f];d[f]={from:g.from(),to:g.to(),text:this.splitLines(a[f]),origin:c}}if(a=
b&&"end"!=b){a=[];e=c=q(this.first,0);for(f=0;f<d.length;f++){var h=d[f],g=Me(h.from,c,e),k=Me(Aa(h),c,e);c=h.to;e=k;"around"==b?(h=this.sel.ranges[f],h=0>v(h.head,h.anchor),a[f]=new x(h?k:g,h?g:k)):a[f]=new x(g,g)}a=new Z(a,this.sel.primIndex)}b=a;for(a=d.length-1;0<=a;a--)ib(this,d[a]);b?Ue(this,b):this.cm&&cb(this.cm)}),undo:L(function(){uc(this,"undo")}),redo:L(function(){uc(this,"redo")}),undoSelection:L(function(){uc(this,"undo",!0)}),redoSelection:L(function(){uc(this,"redo",!0)}),setExtending:function(a){this.extend=
a},getExtending:function(){return this.extend},historySize:function(){for(var a=this.history,b=0,c=0,d=0;d<a.done.length;d++)a.done[d].ranges||++b;for(d=0;d<a.undone.length;d++)a.undone[d].ranges||++c;return{undo:b,redo:c}},clearHistory:function(){this.history=new qc(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},changeGeneration:function(a){a&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null);return this.history.generation},
isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:gb(this.history.done),undone:gb(this.history.undone)}},setHistory:function(a){var b=this.history=new qc(this.history.maxGeneration);b.done=gb(a.done.slice(0),null,!0);b.undone=gb(a.undone.slice(0),null,!0)},setGutterMarker:L(function(a,b,c){return Jb(this,a,"gutter",function(a){var e=a.gutterMarkers||(a.gutterMarkers={});e[b]=c;!c&&Md(e)&&(a.gutterMarkers=null);return!0})}),clearGutter:L(function(a){var b=
this;this.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&Jb(b,c,"gutter",function(){c.gutterMarkers[a]=null;Md(c.gutterMarkers)&&(c.gutterMarkers=null);return!0})})}),lineInfo:function(a){var b;if("number"==typeof a){if(!rb(this,a))return null;b=a;a=u(this,a);if(!a)return null}else if(b=B(a),null==b)return null;return{line:b,handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},addLineClass:L(function(a,b,c){return Jb(this,
a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass";if(a[e]){if(Da(c).test(a[e]))return!1;a[e]+=" "+c}else a[e]=c;return!0})}),removeLineClass:L(function(a,b,c){return Jb(this,a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass",f=a[e];if(f)if(null==c)a[e]=null;else{var g=f.match(Da(c));if(!g)return!1;var h=g.index+g[0].length;a[e]=f.slice(0,
g.index)+(g.index&&h!=f.length?" ":"")+f.slice(h)||null}else return!1;return!0})}),addLineWidget:L(function(a,b,c){return pg(this,a,b,c)}),removeLineWidget:function(a){a.clear()},markText:function(a,b,c){return kb(this,w(this,a),w(this,b),c,c&&c.type||"range")},setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?b.widget:b),insertLeft:b&&b.insertLeft,clearWhenEmpty:!1,shared:b&&b.shared,handleMouseEvents:b&&b.handleMouseEvents};a=w(this,a);return kb(this,a,a,c,"bookmark")},findMarksAt:function(a){a=
w(this,a);var b=[],c=u(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},findMarks:function(a,b,c){a=w(this,a);b=w(this,b);var d=[],e=a.line;this.iter(a.line,b.line+1,function(f){if(f=f.markedSpans)for(var g=0;g<f.length;g++){var h=f[g];null!=h.to&&e==a.line&&a.ch>=h.to||null==h.from&&e!=a.line||null!=h.from&&e==b.line&&h.from>=b.ch||c&&!c(h.marker)||d.push(h.marker.parent||h.marker)}++e});
return d},getAllMarks:function(){var a=[];this.iter(function(b){if(b=b.markedSpans)for(var c=0;c<b.length;++c)null!=b[c].from&&a.push(b[c].marker)});return a},posFromIndex:function(a){var b,c=this.first,d=this.lineSeparator().length;this.iter(function(e){e=e.text.length+d;if(e>a)return b=a,!0;a-=e;++c});return w(this,q(c,b))},indexFromPos:function(a){a=w(this,a);var b=a.ch;if(a.line<this.first||0>a.ch)return 0;var c=this.lineSeparator().length;this.iter(this.first,a.line,function(a){b+=a.text.length+
c});return b},copy:function(a){var b=new S(Kc(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep);b.scrollTop=this.scrollTop;b.scrollLeft=this.scrollLeft;b.sel=this.sel;b.extend=!1;a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory()));return b},linkedDoc:function(a){a||(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from);null!=a.to&&a.to<c&&(c=a.to);b=new S(Kc(this,b,c),a.mode||this.modeOption,b,this.lineSep);a.sharedHist&&
(b.history=this.history);(this.linked||(this.linked=[])).push({doc:b,sharedHist:a.sharedHist});b.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}];a=hf(this);for(c=0;c<a.length;c++){var d=a[c],e=d.find(),f=b.clipPos(e.from),e=b.clipPos(e.to);v(f,e)&&(f=kb(b,f,e,d.primary,d.primary.type),d.markers.push(f),f.parent=d)}return b},unlinkDoc:function(a){a instanceof D&&(a=a.doc);if(this.linked)for(var b=0;b<this.linked.length;++b)if(this.linked[b].doc==a){this.linked.splice(b,1);a.unlinkDoc(this);
rg(hf(this));break}if(a.history==this.history){var c=[a.id];Pa(a,function(a){return c.push(a.id)},!0);a.history=new qc(null);a.history.done=gb(this.history.done,c);a.history.undone=gb(this.history.undone,c)}},iterLinkedDocs:function(a){Pa(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(a){return this.lineSep?a.split(this.lineSep):Id(a)},lineSeparator:function(){return this.lineSep||"\n"}});S.prototype.eachLine=S.prototype.iter;for(var kf=0,zf=
!1,Ca={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"\x3d",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"\x3d",109:"-",110:".",111:"/",127:"Delete",173:"-",186:";",187:"\x3d",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",
63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"},Tb=0;10>Tb;Tb++)Ca[Tb+48]=Ca[Tb+96]=String(Tb);for(var Dc=65;90>=Dc;Dc++)Ca[Dc]=String.fromCharCode(Dc);for(var Ub=1;12>=Ub;Ub++)Ca[Ub+111]=Ca[Ub+63235]="F"+Ub;var Mb={basic:{Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",
Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"},pcDefault:{"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev",
"Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"},emacsy:{"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore",
"Ctrl-K":"killLine","Ctrl-T":"transposeChars","Ctrl-O":"openLine"},macDefault:{"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext",
"Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",fallthrough:["basic","emacsy"]}};Mb["default"]=ea?Mb.macDefault:Mb.pcDefault;var xc={selectAll:Ze,singleSelection:function(a){return a.setSelection(a.getCursor("anchor"),a.getCursor("head"),ma)},killLine:function(a){return mb(a,
function(b){if(b.empty()){var c=u(a.doc,b.head.line).text.length;return b.head.ch==c&&b.head.line<a.lastLine()?{from:b.head,to:q(b.head.line+1,0)}:{from:b.head,to:q(b.head.line,c)}}return{from:b.from(),to:b.to()}})},deleteLine:function(a){return mb(a,function(b){return{from:q(b.from().line,0),to:w(a.doc,q(b.to().line+1,0))}})},delLineLeft:function(a){return mb(a,function(a){return{from:q(a.from().line,0),to:a.from()}})},delWrappedLineLeft:function(a){return mb(a,function(b){var c=a.charCoords(b.head,
"div").top+5;return{from:a.coordsChar({left:0,top:c},"div"),to:b.from()}})},delWrappedLineRight:function(a){return mb(a,function(b){var c=a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:c},"div");return{from:b.from(),to:c}})},undo:function(a){return a.undo()},redo:function(a){return a.redo()},undoSelection:function(a){return a.undoSelection()},redoSelection:function(a){return a.redoSelection()},goDocStart:function(a){return a.extendSelection(q(a.firstLine(),
0))},goDocEnd:function(a){return a.extendSelection(q(a.lastLine()))},goLineStart:function(a){return a.extendSelectionsBy(function(b){return pf(a,b.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(a){return a.extendSelectionsBy(function(b){return qf(a,b.head)},{origin:"+move",bias:1})},goLineEnd:function(a){return a.extendSelectionsBy(function(b){b=b.head.line;var c=u(a.doc,b),d;d=c;for(var e;e=Ha(d,!1);)d=e.find(1,!0).line;d!=c&&(b=B(d));return Vc(!0,a,c,b,-1)},{origin:"+move",bias:-1})},
goLineRight:function(a){return a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:b},"div")},Rb)},goLineLeft:function(a){return a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:0,top:b},"div")},Rb)},goLineLeftSmart:function(a){return a.extendSelectionsBy(function(b){var c=a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:0,top:c},"div");return c.ch<a.getLine(c.line).search(/\S/)?
qf(a,b.head):c},Rb)},goLineUp:function(a){return a.moveV(-1,"line")},goLineDown:function(a){return a.moveV(1,"line")},goPageUp:function(a){return a.moveV(-1,"page")},goPageDown:function(a){return a.moveV(1,"page")},goCharLeft:function(a){return a.moveH(-1,"char")},goCharRight:function(a){return a.moveH(1,"char")},goColumnLeft:function(a){return a.moveH(-1,"column")},goColumnRight:function(a){return a.moveH(1,"column")},goWordLeft:function(a){return a.moveH(-1,"word")},goGroupRight:function(a){return a.moveH(1,
"group")},goGroupLeft:function(a){return a.moveH(-1,"group")},goWordRight:function(a){return a.moveH(1,"word")},delCharBefore:function(a){return a.deleteH(-1,"char")},delCharAfter:function(a){return a.deleteH(1,"char")},delWordBefore:function(a){return a.deleteH(-1,"word")},delWordAfter:function(a){return a.deleteH(1,"word")},delGroupBefore:function(a){return a.deleteH(-1,"group")},delGroupAfter:function(a){return a.deleteH(1,"group")},indentAuto:function(a){return a.indentSelection("smart")},indentMore:function(a){return a.indentSelection("add")},
indentLess:function(a){return a.indentSelection("subtract")},insertTab:function(a){return a.replaceSelection("\t")},insertSoftTab:function(a){for(var b=[],c=a.listSelections(),d=a.options.tabSize,e=0;e<c.length;e++){var f=c[e].from(),f=aa(a.getLine(f.line),f.ch,d);b.push(Hc(d-f%d))}a.replaceSelections(b)},defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):a.execCommand("insertTab")},transposeChars:function(a){return Y(a,function(){for(var b=a.listSelections(),c=[],d=0;d<b.length;d++)if(b[d].empty()){var e=
b[d].head,f=u(a.doc,e.line).text;if(f)if(e.ch==f.length&&(e=new q(e.line,e.ch-1)),0<e.ch)e=new q(e.line,e.ch+1),a.replaceRange(f.charAt(e.ch-1)+f.charAt(e.ch-2),q(e.line,e.ch-2),e,"+transpose");else if(e.line>a.doc.first){var g=u(a.doc,e.line-1).text;g&&(e=new q(e.line,1),a.replaceRange(f.charAt(0)+a.doc.lineSeparator()+g.charAt(g.length-1),q(e.line-1,g.length-1),e,"+transpose"))}c.push(new x(e,e))}a.setSelections(c)})},newlineAndIndent:function(a){return Y(a,function(){for(var b=a.listSelections(),
c=b.length-1;0<=c;c--)a.replaceRange(a.doc.lineSeparator(),b[c].anchor,b[c].head,"+input");b=a.listSelections();for(c=0;c<b.length;c++)a.indentLine(b[c].from().line,null,!0);cb(a)})},openLine:function(a){return a.replaceSelection("\n","start")},toggleOverwrite:function(a){return a.toggleOverwrite()}},yg=new Qa,Cd=null,Ac,zc,nb={toString:function(){return"CodeMirror.Init"}},yf={},Bc={};D.defaults=yf;D.optionHandlers=Bc;var Gd=[];D.defineInitHook=function(a){return Gd.push(a)};var V=null,y=function(a){this.cm=
a;this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null;this.polling=new Qa;this.composing=null;this.gracePeriod=!1;this.readDOMTimeout=null};y.prototype.init=function(a){function b(a){if(!G(e,a)){if(e.somethingSelected())Bf({lineWise:!1,text:e.getSelections()}),"cut"==a.type&&e.replaceSelection("",null,"cut");else if(e.options.lineWiseCopyCut){var b=Ef(e);Bf({lineWise:!0,text:b.text});"cut"==a.type&&e.operation(function(){e.setSelections(b.ranges,0,ma);e.replaceSelection("",
null,"cut")})}else return;if(a.clipboardData){a.clipboardData.clearData();var c=V.text.join("\n");a.clipboardData.setData("Text",c);if(a.clipboardData.getData("Text")==c){a.preventDefault();return}}var l=Gf();a=l.firstChild;e.display.lineSpace.insertBefore(l,e.display.lineSpace.firstChild);a.value=V.text.join("\n");var m=document.activeElement;pb(a);setTimeout(function(){e.display.lineSpace.removeChild(l);m.focus();m==f&&d.showPrimarySelection()},50)}}var c=this,d=this,e=d.cm,f=d.div=a.lineDiv;Ff(f,
e.options.spellcheck);s(f,"paste",function(a){G(e,a)||Df(a,e)||11>=C&&setTimeout(I(e,function(){d.pollContent()||Q(e)}),20)});s(f,"compositionstart",function(a){c.composing={data:a.data,done:!1}});s(f,"compositionupdate",function(a){c.composing||(c.composing={data:a.data,done:!1})});s(f,"compositionend",function(a){c.composing&&(a.data!=c.composing.data&&c.readFromDOMSoon(),c.composing.done=!0)});s(f,"touchstart",function(){return d.forceCompositionEnd()});s(f,"input",function(){c.composing||c.readFromDOMSoon()});
s(f,"copy",b);s(f,"cut",b)};y.prototype.prepareSelection=function(){var a=ye(this.cm,!1);a.focus=this.cm.state.focused;return a};y.prototype.showSelection=function(a,b){a&&this.cm.display.view.length&&((a.focus||b)&&this.showPrimarySelection(),this.showMultipleSelections(a))};y.prototype.showPrimarySelection=function(){var a=window.getSelection(),b=this.cm.doc.sel.primary(),c=Cc(this.cm,a.anchorNode,a.anchorOffset),d=Cc(this.cm,a.focusNode,a.focusOffset);if(!c||c.bad||!d||d.bad||0!=v(bc(c,d),b.from())||
0!=v(ac(c,d),b.to()))if(c=If(this.cm,b.from()),d=If(this.cm,b.to()),c||d){var e=this.cm.display.view,b=a.rangeCount&&a.getRangeAt(0);c?d||(d=e[e.length-1].measure,d=d.maps?d.maps[d.maps.length-1]:d.map,d={node:d[d.length-1],offset:d[d.length-2]-d[d.length-3]}):c={node:e[0].measure.map[2],offset:0};var f;try{f=Ya(c.node,c.offset,d.offset,d.node)}catch(g){}f&&(!va&&this.cm.state.focused?(a.collapse(c.node,c.offset),f.collapsed||(a.removeAllRanges(),a.addRange(f))):(a.removeAllRanges(),a.addRange(f)),
b&&null==a.anchorNode?a.addRange(b):va&&this.startGracePeriod());this.rememberSelection()}};y.prototype.startGracePeriod=function(){var a=this;clearTimeout(this.gracePeriod);this.gracePeriod=setTimeout(function(){a.gracePeriod=!1;a.selectionChanged()&&a.cm.operation(function(){return a.cm.curOp.selectionChanged=!0})},20)};y.prototype.showMultipleSelections=function(a){W(this.cm.display.cursorDiv,a.cursors);W(this.cm.display.selectionDiv,a.selection)};y.prototype.rememberSelection=function(){var a=
window.getSelection();this.lastAnchorNode=a.anchorNode;this.lastAnchorOffset=a.anchorOffset;this.lastFocusNode=a.focusNode;this.lastFocusOffset=a.focusOffset};y.prototype.selectionInEditor=function(){var a=window.getSelection();if(!a.rangeCount)return!1;a=a.getRangeAt(0).commonAncestorContainer;return Wb(this.div,a)};y.prototype.focus=function(){"nocursor"!=this.cm.options.readOnly&&(this.selectionInEditor()||this.showSelection(this.prepareSelection(),!0),this.div.focus())};y.prototype.blur=function(){this.div.blur()};
y.prototype.getField=function(){return this.div};y.prototype.supportsTouch=function(){return!0};y.prototype.receivedFocus=function(){function a(){b.cm.state.focused&&(b.pollSelection(),b.polling.set(b.cm.options.pollInterval,a))}var b=this;this.selectionInEditor()?this.pollSelection():Y(this.cm,function(){return b.cm.curOp.selectionChanged=!0});this.polling.set(this.cm.options.pollInterval,a)};y.prototype.selectionChanged=function(){var a=window.getSelection();return a.anchorNode!=this.lastAnchorNode||
a.anchorOffset!=this.lastAnchorOffset||a.focusNode!=this.lastFocusNode||a.focusOffset!=this.lastFocusOffset};y.prototype.pollSelection=function(){if(!this.composing&&null==this.readDOMTimeout&&!this.gracePeriod&&this.selectionChanged()){var a=window.getSelection(),b=this.cm;this.rememberSelection();var c=Cc(b,a.anchorNode,a.anchorOffset),d=Cc(b,a.focusNode,a.focusOffset);c&&d&&Y(b,function(){M(b.doc,ta(c,d),ma);if(c.bad||d.bad)b.curOp.selectionChanged=!0})}};y.prototype.pollContent=function(){null!=
this.readDOMTimeout&&(clearTimeout(this.readDOMTimeout),this.readDOMTimeout=null);var a=this.cm,b=a.display,c=a.doc.sel.primary(),d=c.from(),c=c.to();0==d.ch&&d.line>a.firstLine()&&(d=q(d.line-1,u(a.doc,d.line-1).length));c.ch==u(a.doc,c.line).text.length&&c.line<a.lastLine()&&(c=q(c.line+1,0));if(d.line<b.viewFrom||c.line>b.viewTo-1)return!1;var e;d.line==b.viewFrom||0==(e=La(a,d.line))?(d=B(b.view[0].line),e=b.view[0].node):(d=B(b.view[e].line),e=b.view[e-1].node.nextSibling);var f=La(a,c.line);
f==b.view.length-1?(c=b.viewTo-1,b=b.lineDiv.lastChild):(c=B(b.view[f+1].line)-1,b=b.view[f+1].node.previousSibling);if(!e)return!1;b=a.doc.splitLines(Kg(a,e,b,d,c));for(e=Fa(a.doc,q(d,0),q(c,u(a.doc,c).text.length));1<b.length&&1<e.length;)if(z(b)==z(e))b.pop(),e.pop(),c--;else if(b[0]==e[0])b.shift(),e.shift(),d++;else break;for(var g=0,f=0,h=b[0],k=e[0],l=Math.min(h.length,k.length);g<l&&h.charCodeAt(g)==k.charCodeAt(g);)++g;h=z(b);k=z(e);for(l=Math.min(h.length-(1==b.length?g:0),k.length-(1==
e.length?g:0));f<l&&h.charCodeAt(h.length-f-1)==k.charCodeAt(k.length-f-1);)++f;b[b.length-1]=h.slice(0,h.length-f).replace(/^\u200b+/,"");b[0]=b[0].slice(g).replace(/\u200b+$/,"");d=q(d,g);c=q(c,e.length?z(e).length-f:0);if(1<b.length||b[0]||v(d,c))return jb(a.doc,b,d,c,"+input"),!0};y.prototype.ensurePolled=function(){this.forceCompositionEnd()};y.prototype.reset=function(){this.forceCompositionEnd()};y.prototype.forceCompositionEnd=function(){this.composing&&(clearTimeout(this.readDOMTimeout),
this.composing=null,this.pollContent()||Q(this.cm),this.div.blur(),this.div.focus())};y.prototype.readFromDOMSoon=function(){var a=this;null==this.readDOMTimeout&&(this.readDOMTimeout=setTimeout(function(){a.readDOMTimeout=null;if(a.composing)if(a.composing.done)a.composing=null;else return;!a.cm.isReadOnly()&&a.pollContent()||Y(a.cm,function(){return Q(a.cm)})},80))};y.prototype.setUneditable=function(a){a.contentEditable="false"};y.prototype.onKeyPress=function(a){0!=a.charCode&&(a.preventDefault(),
this.cm.isReadOnly()||I(this.cm,Hd)(this.cm,String.fromCharCode(null==a.charCode?a.keyCode:a.charCode),0))};y.prototype.readOnlyChanged=function(a){this.div.contentEditable=String("nocursor"!=a)};y.prototype.onContextMenu=function(){};y.prototype.resetPosition=function(){};y.prototype.needsContentAttribute=!0;var F=function(a){this.cm=a;this.prevInput="";this.pollingFast=!1;this.polling=new Qa;this.hasSelection=this.inaccurateSelection=!1;this.composing=null};F.prototype.init=function(a){function b(a){if(!G(e,
a)){if(e.somethingSelected())V={lineWise:!1,text:e.getSelections()},d.inaccurateSelection&&(d.prevInput="",d.inaccurateSelection=!1,g.value=V.text.join("\n"),pb(g));else if(e.options.lineWiseCopyCut){var b=Ef(e);V={lineWise:!0,text:b.text};"cut"==a.type?e.setSelections(b.ranges,null,ma):(d.prevInput="",g.value=b.text.join("\n"),pb(g))}else return;"cut"==a.type&&(e.state.cutIncoming=!0)}}var c=this,d=this,e=this.cm,f=this.wrapper=Gf(),g=this.textarea=f.firstChild;a.wrapper.insertBefore(f,a.wrapper.firstChild);
Pb&&(g.style.width="0px");s(g,"input",function(){A&&9<=C&&c.hasSelection&&(c.hasSelection=null);d.poll()});s(g,"paste",function(a){G(e,a)||Df(a,e)||(e.state.pasteIncoming=!0,d.fastPoll())});s(g,"cut",b);s(g,"copy",b);s(a.scroller,"paste",function(b){sa(a,b)||G(e,b)||(e.state.pasteIncoming=!0,d.focus())});s(a.lineSpace,"selectstart",function(b){sa(a,b)||N(b)});s(g,"compositionstart",function(){var a=e.getCursor("from");d.composing&&d.composing.range.clear();d.composing={start:a,range:e.markText(a,
e.getCursor("to"),{className:"CodeMirror-composing"})}});s(g,"compositionend",function(){d.composing&&(d.poll(),d.composing.range.clear(),d.composing=null)})};F.prototype.prepareSelection=function(){var a=this.cm,b=a.display,c=a.doc,d=ye(a);if(a.options.moveInputWithCursor){var a=fa(a,c.sel.primary().head,"div"),c=b.wrapper.getBoundingClientRect(),e=b.lineDiv.getBoundingClientRect();d.teTop=Math.max(0,Math.min(b.wrapper.clientHeight-10,a.top+e.top-c.top));d.teLeft=Math.max(0,Math.min(b.wrapper.clientWidth-
10,a.left+e.left-c.left))}return d};F.prototype.showSelection=function(a){var b=this.cm.display;W(b.cursorDiv,a.cursors);W(b.selectionDiv,a.selection);null!=a.teTop&&(this.wrapper.style.top=a.teTop+"px",this.wrapper.style.left=a.teLeft+"px")};F.prototype.reset=function(a){if(!this.contextMenuPending){var b,c,d=this.cm,e=d.doc;d.somethingSelected()?(this.prevInput="",b=e.sel.primary(),c=(b=tf&&(100<b.to().line-b.from().line||1E3<(c=d.getSelection()).length))?"-":c||d.getSelection(),this.textarea.value=
c,d.state.focused&&pb(this.textarea),A&&9<=C&&(this.hasSelection=c)):a||(this.prevInput=this.textarea.value="",A&&9<=C&&(this.hasSelection=null));this.inaccurateSelection=b}};F.prototype.getField=function(){return this.textarea};F.prototype.supportsTouch=function(){return!1};F.prototype.focus=function(){if("nocursor"!=this.cm.options.readOnly&&(!qb||oa()!=this.textarea))try{this.textarea.focus()}catch(a){}};F.prototype.blur=function(){this.textarea.blur()};F.prototype.resetPosition=function(){this.wrapper.style.top=
this.wrapper.style.left=0};F.prototype.receivedFocus=function(){this.slowPoll()};F.prototype.slowPoll=function(){var a=this;this.pollingFast||this.polling.set(this.cm.options.pollInterval,function(){a.poll();a.cm.state.focused&&a.slowPoll()})};F.prototype.fastPoll=function(){function a(){c.poll()||b?(c.pollingFast=!1,c.slowPoll()):(b=!0,c.polling.set(60,a))}var b=!1,c=this;c.pollingFast=!0;c.polling.set(20,a)};F.prototype.poll=function(){var a=this,b=this.cm,c=this.textarea,d=this.prevInput;if(this.contextMenuPending||
!b.state.focused||Qg(c)&&!d&&!this.composing||b.isReadOnly()||b.options.disableInput||b.state.keySeq)return!1;var e=c.value;if(e==d&&!b.somethingSelected())return!1;if(A&&9<=C&&this.hasSelection===e||ea&&/[\uf700-\uf7ff]/.test(e))return b.display.input.reset(),!1;if(b.doc.sel==b.display.selForContextMenu){var f=e.charCodeAt(0);8203!=f||d||(d="​");if(8666==f)return this.reset(),this.cm.execCommand("undo")}for(var g=0,f=Math.min(d.length,e.length);g<f&&d.charCodeAt(g)==e.charCodeAt(g);)++g;Y(b,function(){Hd(b,
e.slice(g),d.length-g,null,a.composing?"*compose":null);1E3<e.length||-1<e.indexOf("\n")?c.value=a.prevInput="":a.prevInput=e;a.composing&&(a.composing.range.clear(),a.composing.range=b.markText(a.composing.start,b.getCursor("to"),{className:"CodeMirror-composing"}))});return!0};F.prototype.ensurePolled=function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)};F.prototype.onKeyPress=function(){A&&9<=C&&(this.hasSelection=null);this.fastPoll()};F.prototype.onContextMenu=function(a){function b(){if(null!=
g.selectionStart){var a=e.somethingSelected(),b="​"+(a?g.value:"");g.value="⇚";g.value=b;d.prevInput=a?"":"​";g.selectionStart=1;g.selectionEnd=b.length;f.selForContextMenu=e.doc.sel}}function c(){d.contextMenuPending=!1;d.wrapper.style.cssText=m;g.style.cssText=l;A&&9>C&&f.scrollbars.setScrollTop(f.scroller.scrollTop=k);if(null!=g.selectionStart){(!A||A&&9>C)&&b();var a=0,c=function(){f.selForContextMenu==e.doc.sel&&0==g.selectionStart&&0<g.selectionEnd&&"​"==d.prevInput?I(e,Ze)(e):10>a++?f.detectingSelectAll=
setTimeout(c,500):(f.selForContextMenu=null,f.input.reset())};f.detectingSelectAll=setTimeout(c,200)}}var d=this,e=d.cm,f=e.display,g=d.textarea,h=Oa(e,a),k=f.scroller.scrollTop;if(h&&!ga){e.options.resetSelectionOnContextMenu&&-1==e.doc.sel.contains(h)&&I(e,M)(e.doc,ta(h),ma);var l=g.style.cssText,m=d.wrapper.style.cssText;d.wrapper.style.cssText="position: absolute";h=d.wrapper.getBoundingClientRect();g.style.cssText="position: absolute; width: 30px; height: 30px;\n      top: "+(a.clientY-h.top-
5)+"px; left: "+(a.clientX-h.left-5)+"px;\n      z-index: 1000; background: "+(A?"rgba(255, 255, 255, .05)":"transparent")+";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity\x3d5);";var n;K&&(n=window.scrollY);f.input.focus();K&&window.scrollTo(null,n);f.input.reset();e.somethingSelected()||(g.value=d.prevInput=" ");d.contextMenuPending=!0;f.selForContextMenu=e.doc.sel;clearTimeout(f.detectingSelectAll);A&&9<=C&&b();if(Ed){ub(a);var p=function(){da(window,
"mouseup",p);setTimeout(c,20)};s(window,"mouseup",p)}else setTimeout(c,50)}};F.prototype.readOnlyChanged=function(a){a||this.reset()};F.prototype.setUneditable=function(){};F.prototype.needsContentAttribute=!1;(function(a){function b(b,e,f,g){a.defaults[b]=e;f&&(c[b]=g?function(a,b,d){d!=nb&&f(a,b,d)}:f)}var c=a.optionHandlers;a.defineOption=b;a.Init=nb;b("value","",function(a,b){return a.setValue(b)},!0);b("mode",null,function(a,b){a.doc.modeOption=b;wd(a)},!0);b("indentUnit",2,wd,!0);b("indentWithTabs",
!1);b("smartIndent",!0);b("tabSize",4,function(a){Gb(a);Ab(a);Q(a)},!0);b("lineSeparator",null,function(a,b){if(a.doc.lineSep=b){var c=[],g=a.doc.first;a.doc.iter(function(a){for(var d=0;;){var h=a.text.indexOf(b,d);if(-1==h)break;d=h+b.length;c.push(q(g,h))}g++});for(var h=c.length-1;0<=h;h--)jb(a.doc,b,c[h],q(c[h].line,c[h].ch+b.length))}});b("specialChars",/[\u0000-\u001f\u007f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g,function(a,b,c){a.state.specialChars=new RegExp(b.source+(b.test("\t")?
"":"|\t"),"g");c!=nb&&a.refresh()});b("specialCharPlaceholder",ag,function(a){return a.refresh()},!0);b("electricChars",!0);b("inputStyle",qb?"contenteditable":"textarea",function(){throw Error("inputStyle can not (yet) be changed in a running editor");},!0);b("spellcheck",!1,function(a,b){return a.getInputField().spellcheck=b},!0);b("rtlMoveVisually",!Pg);b("wholeLineUpdateBefore",!0);b("theme","default",function(a){xf(a);Nb(a)},!0);b("keyMap","default",function(a,b,c){b=vc(b);(c=c!=nb&&vc(c))&&
c.detach&&c.detach(a,b);b.attach&&b.attach(a,c||null)});b("extraKeys",null);b("lineWrapping",!1,Ig,!0);b("gutters",[],function(a){ud(a.options);Nb(a)},!0);b("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?kd(a.display)+"px":"0";a.refresh()},!0);b("coverGutterNextToScrollbar",!1,function(a){return bb(a)},!0);b("scrollbarStyle","native",function(a){Ge(a);bb(a);a.display.scrollbars.setScrollTop(a.doc.scrollTop);a.display.scrollbars.setScrollLeft(a.doc.scrollLeft)},!0);b("lineNumbers",!1,
function(a){ud(a.options);Nb(a)},!0);b("firstLineNumber",1,Nb,!0);b("lineNumberFormatter",function(a){return a},Nb,!0);b("showCursorWhenSelecting",!1,Bb,!0);b("resetSelectionOnContextMenu",!0);b("lineWiseCopyCut",!0);b("readOnly",!1,function(a,b){"nocursor"==b?(Cb(a),a.display.input.blur(),a.display.disabled=!0):a.display.disabled=!1;a.display.input.readOnlyChanged(b)});b("disableInput",!1,function(a,b){b||a.display.input.reset()},!0);b("dragDrop",!0,Hg);b("allowDropFileTypes",null);b("cursorBlinkRate",
530);b("cursorScrollMargin",0);b("cursorHeight",1,Bb,!0);b("singleCursorHeightPerLine",!0,Bb,!0);b("workTime",100);b("workDelay",100);b("flattenSpans",!0,Gb,!0);b("addModeClass",!1,Gb,!0);b("pollInterval",100);b("undoDepth",200,function(a,b){return a.doc.history.undoDepth=b});b("historyEventDelay",1250);b("viewportMargin",10,function(a){return a.refresh()},!0);b("maxHighlightLength",1E4,Gb,!0);b("moveInputWithCursor",!0,function(a,b){b||a.display.input.resetPosition()});b("tabindex",null,function(a,
b){return a.display.input.getField().tabIndex=b||""});b("autofocus",null)})(D);(function(a){var b=a.optionHandlers,c=a.helpers={};a.prototype={constructor:a,focus:function(){window.focus();this.display.input.focus()},setOption:function(a,c){var f=this.options,g=f[a];if(f[a]!=c||"mode"==a)f[a]=c,b.hasOwnProperty(a)&&I(this,b[a])(this,c,g),E(this,"optionChange",this,a)},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,b){this.state.keyMaps[b?"push":
"unshift"](vc(a))},removeKeyMap:function(a){for(var b=this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||b[c].name==a)return b.splice(c,1),!0},addOverlay:R(function(b,c){var f=b.token?b:a.getMode(this.options,b);if(f.startState)throw Error("Overlays may not be stateful.");Mf(this.state.overlays,{mode:f,modeSpec:b,opaque:c&&c.opaque,priority:c&&c.priority||0},function(a){return a.priority});this.state.modeGen++;Q(this)}),removeOverlay:R(function(a){for(var b=this.state.overlays,c=0;c<b.length;++c){var g=
b[c].modeSpec;if(g==a||"string"==typeof a&&g.name==a){b.splice(c,1);this.state.modeGen++;Q(this);break}}}),indentLine:R(function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract");rb(this.doc,a)&&Ob(this,a,b,c)}),indentSelection:R(function(a){for(var b=this.doc.sel.ranges,c=-1,g=0;g<b.length;g++){var h=b[g];if(h.empty())h.head.line>c&&(Ob(this,h.head.line,a,!0),c=h.head.line,g==this.doc.sel.primIndex&&cb(this));else{for(var k=h.from(),
h=h.to(),l=Math.max(c,k.line),c=Math.min(this.lastLine(),h.line-(h.ch?0:1))+1,h=l;h<c;++h)Ob(this,h,a);h=this.doc.sel.ranges;0==k.ch&&b.length==h.length&&0<h[g].from().ch&&zd(this.doc,g,new x(k,h[g].to()),ma)}}}),getTokenAt:function(a,b){return ee(this,a,b)},getLineTokens:function(a,b){return ee(this,q(a),b,!0)},getTokenTypeAt:function(a){a=w(this.doc,a);var b=ce(this,u(this.doc,a.line)),c=0,g=(b.length-1)/2;a=a.ch;if(0==a)b=b[2];else for(;;){var h=c+g>>1;if((h?b[2*h-1]:0)>=a)g=h;else if(b[2*h+1]<
a)c=h+1;else{b=b[2*h+2];break}}c=b?b.indexOf("overlay "):-1;return 0>c?b:0==c?null:b.slice(0,c-1)},getModeAt:function(b){var c=this.doc.mode;return c.innerMode?a.innerMode(c,this.getTokenAt(b).state).mode:c},getHelper:function(a,b){return this.getHelpers(a,b)[0]},getHelpers:function(a,b){var f=[];if(!c.hasOwnProperty(b))return f;var g=c[b],h=this.getModeAt(a);if("string"==typeof h[b])g[h[b]]&&f.push(g[h[b]]);else if(h[b])for(var k=0;k<h[b].length;k++){var l=g[h[b][k]];l&&f.push(l)}else h.helperType&&
g[h.helperType]?f.push(g[h.helperType]):g[h.name]&&f.push(g[h.name]);for(k=0;k<g._global.length;k++)l=g._global[k],l.pred(h,this)&&-1==J(f,l.val)&&f.push(l.val);return f},getStateAfter:function(a,b){var c=this.doc;a=Math.max(c.first,Math.min(null==a?c.first+c.size-1:a,c.first+c.size-1));return vb(this,a+1,b)},cursorCoords:function(a,b){var c;c=this.doc.sel.primary();c=null==a?c.head:"object"==typeof a?w(this.doc,a):a?c.from():c.to();return fa(this,c,b||"page")},charCoords:function(a,b){return ic(this,
w(this.doc,a),b||"page")},coordsChar:function(a,b){a=ve(this,a,b||"page");return jd(this,a.left,a.top)},lineAtHeight:function(a,b){a=ve(this,{top:a,left:0},b||"page").top;return Ga(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b,c){var g=!1;if("number"==typeof a){var h=this.doc.first+this.doc.size-1;a<this.doc.first?a=this.doc.first:a>h&&(a=h,g=!0);a=u(this.doc,a)}return Ja(this,a,{top:0,left:0},b||"page",c||g).top+(g?this.doc.height-ka(a):0)},defaultTextHeight:function(){return Ma(this.display)},
defaultCharWidth:function(){return zb(this.display)},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(a,b,c,g,h){var k=this.display;a=fa(this,w(this.doc,a));var l=a.bottom,m=a.left;b.style.position="absolute";b.setAttribute("cm-ignore-events","true");this.display.input.setUneditable(b);k.sizer.appendChild(b);if("over"==g)l=a.top;else if("above"==g||"near"==g){var n=Math.max(k.wrapper.clientHeight,this.doc.height),p=Math.max(k.sizer.clientWidth,k.lineSpace.clientWidth);
("above"==g||a.bottom+b.offsetHeight>n)&&a.top>b.offsetHeight?l=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=n&&(l=a.bottom);m+b.offsetWidth>p&&(m=p-b.offsetWidth)}b.style.top=l+"px";b.style.left=b.style.right="";"right"==h?(m=k.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==h?m=0:"middle"==h&&(m=(k.sizer.clientWidth-b.offsetWidth)/2),b.style.left=m+"px");c&&(a=lc(this,m,l,m+b.offsetWidth,l+b.offsetHeight),null!=a.scrollTop&&Db(this,a.scrollTop),null!=a.scrollLeft&&ab(this,a.scrollLeft))},
triggerOnKeyDown:R(sf),triggerOnKeyPress:R(vf),triggerOnKeyUp:uf,execCommand:function(a){if(xc.hasOwnProperty(a))return xc[a].call(null,this)},triggerElectric:R(function(a){Cf(this,a)}),findPosH:function(a,b,c,g){var h=1;0>b&&(h=-1,b=-b);a=w(this.doc,a);for(var k=0;k<b&&(a=Jd(this.doc,a,h,c,g),!a.hitSide);++k);return a},moveH:R(function(a,b){var c=this;this.extendSelectionsBy(function(g){return c.display.shift||c.doc.extend||g.empty()?Jd(c.doc,g.head,a,b,c.options.rtlMoveVisually):0>a?g.from():g.to()},
Rb)}),deleteH:R(function(a,b){var c=this.doc;this.doc.sel.somethingSelected()?c.replaceSelection("",null,"+delete"):mb(this,function(g){var h=Jd(c,g.head,a,b,!1);return 0>a?{from:h,to:g.head}:{from:g.head,to:h}})}),findPosV:function(a,b,c,g){var h=1;0>b&&(h=-1,b=-b);var k=w(this.doc,a);for(a=0;a<b&&(k=fa(this,k,"div"),null==g?g=k.left:k.left=g,k=Hf(this,k,h,c),!k.hitSide);++a);return k},moveV:R(function(a,b){var c=this,g=this.doc,h=[],k=!this.display.shift&&!g.extend&&g.sel.somethingSelected();g.extendSelectionsBy(function(l){if(k)return 0>
a?l.from():l.to();var n=fa(c,l.head,"div");null!=l.goalColumn&&(n.left=l.goalColumn);h.push(n.left);var p=Hf(c,n,a,b);"page"==b&&l==g.sel.primary()&&mc(c,null,ic(c,p,"div").top-n.top);return p},Rb);if(h.length)for(var l=0;l<g.sel.ranges.length;l++)g.sel.ranges[l].goalColumn=h[l]}),findWordAt:function(a){var b=u(this.doc,a.line).text,c=a.ch,g=a.ch;if(b){var h=this.getHelper(a,"wordChars");"before"!=a.sticky&&g!=b.length||!c?++g:--c;for(var k=b.charAt(c),k=Zb(k,h)?function(a){return Zb(a,h)}:/\s/.test(k)?
function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&!Zb(a)};0<c&&k(b.charAt(c-1));)--c;for(;g<b.length&&k(b.charAt(g));)++g}return new x(q(a.line,c),q(a.line,g))},toggleOverwrite:function(a){if(null==a||a!=this.state.overwrite)(this.state.overwrite=!this.state.overwrite)?Ta(this.display.cursorDiv,"CodeMirror-overwrite"):$a(this.display.cursorDiv,"CodeMirror-overwrite"),E(this,"overwriteToggle",this,this.state.overwrite)},hasFocus:function(){return this.display.input.getField()==oa()},
isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:R(function(a,b){null==a&&null==b||nc(this);null!=a&&(this.curOp.scrollLeft=a);null!=b&&(this.curOp.scrollTop=b)}),getScrollInfo:function(){var a=this.display.scroller;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-la(this)-this.display.barHeight,width:a.scrollWidth-la(this)-this.display.barWidth,clientHeight:fd(this),clientWidth:Ka(this)}},scrollIntoView:R(function(a,b){null==a?(a={from:this.doc.sel.primary().head,
to:null},null==b&&(b=this.options.cursorScrollMargin)):"number"==typeof a?a={from:q(a,0),to:null}:null==a.from&&(a={from:a,to:null});a.to||(a.to=a.from);a.margin=b||0;if(null!=a.from.line)nc(this),this.curOp.scrollToPos=a;else{var c=lc(this,Math.min(a.from.left,a.to.left),Math.min(a.from.top,a.to.top)-a.margin,Math.max(a.from.right,a.to.right),Math.max(a.from.bottom,a.to.bottom)+a.margin);this.scrollTo(c.scrollLeft,c.scrollTop)}}),setSize:R(function(a,b){var c=this,g=function(a){return"number"==typeof a||
/^\d+$/.test(String(a))?a+"px":a};null!=a&&(this.display.wrapper.style.width=g(a));null!=b&&(this.display.wrapper.style.height=g(b));this.options.lineWrapping&&ue(this);var h=this.display.viewFrom;this.doc.iter(h,this.display.viewTo,function(a){if(a.widgets)for(var b=0;b<a.widgets.length;b++)if(a.widgets[b].noHScroll){za(c,h,"widget");break}++h});this.curOp.forceUpdate=!0;E(this,"refresh",this)}),operation:function(a){return Y(this,a)},refresh:R(function(){var a=this.display.cachedTextHeight;Q(this);
this.curOp.forceUpdate=!0;Ab(this);this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop);pd(this);(null==a||.5<Math.abs(a-Ma(this.display)))&&ld(this);E(this,"refresh",this)}),swapDoc:R(function(a){var b=this.doc;b.cm=null;Oe(this,a);Ab(this);this.display.input.reset();this.scrollTo(a.scrollLeft,a.scrollTop);this.curOp.forceScroll=!0;P(this,"swapDoc",this,b);return b}),getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},
getGutterElement:function(){return this.display.gutters}};Va(a);a.registerHelper=function(b,e,f){c.hasOwnProperty(b)||(c[b]=a[b]={_global:[]});c[b][e]=f};a.registerGlobalHelper=function(b,e,f,g){a.registerHelper(b,e,g);c[b]._global.push({pred:f,val:g})}})(D);var Sg="iter insert remove copy getEditor constructor".split(" "),Vb;for(Vb in S.prototype)S.prototype.hasOwnProperty(Vb)&&0>J(Sg,Vb)&&(D.prototype[Vb]=function(a){return function(){return a.apply(this.doc,arguments)}}(S.prototype[Vb]));Va(S);
D.inputStyles={textarea:F,contenteditable:y};D.defineMode=function(a){D.defaults.mode||"null"==a||(D.defaults.mode=a);Uf.apply(this,arguments)};D.defineMIME=function(a,b){Wa[a]=b};D.defineMode("null",function(){return{token:function(a){return a.skipToEnd()}}});D.defineMIME("text/plain","null");D.defineExtension=function(a,b){D.prototype[a]=b};D.defineDocExtension=function(a,b){S.prototype[a]=b};D.fromTextArea=function(a,b){function c(){a.value=k.getValue()}b=b?Ea(b):{};b.value=a.value;!b.tabindex&&
a.tabIndex&&(b.tabindex=a.tabIndex);!b.placeholder&&a.placeholder&&(b.placeholder=a.placeholder);if(null==b.autofocus){var d=oa();b.autofocus=d==a||null!=a.getAttribute("autofocus")&&d==document.body}var e;if(a.form&&(s(a.form,"submit",c),!b.leaveSubmitMethodAlone)){var f=a.form;e=f.submit;try{var g=f.submit=function(){c();f.submit=e;f.submit();f.submit=g}}catch(h){}}b.finishInit=function(b){b.save=c;b.getTextArea=function(){return a};b.toTextArea=function(){b.toTextArea=isNaN;c();a.parentNode.removeChild(b.getWrapperElement());
a.style.display="";a.form&&(da(a.form,"submit",c),"function"==typeof a.form.submit&&(a.form.submit=e))}};a.style.display="none";var k=D(function(b){return a.parentNode.insertBefore(b,a.nextSibling)},b);return k};(function(a){a.off=da;a.on=s;a.wheelEventPixels=hg;a.Doc=S;a.splitLines=Id;a.countColumn=aa;a.findColumn=Gc;a.isWordChar=Ic;a.Pass=Bd;a.signal=E;a.Line=fb;a.changeEnd=Aa;a.scrollbarModel=He;a.Pos=q;a.cmpPos=v;a.modes=Yc;a.mimeModes=Wa;a.resolveMode=gc;a.getMode=Zc;a.modeExtensions=Xa;a.extendMode=
Vf;a.copyState=qa;a.startState=$d;a.innerMode=$c;a.commands=xc;a.keyMap=Mb;a.keyName=nf;a.isModifierKey=mf;a.lookupKey=lb;a.normalizeKeyMap=wg;a.StringStream=H;a.SharedTextMarker=Lb;a.TextMarker=Ba;a.LineWidget=Kb;a.e_preventDefault=N;a.e_stopPropagation=Yd;a.e_stop=ub;a.addClass=Ta;a.contains=Wb;a.rmClass=$a;a.keyNames=Ca})(D);D.version="5.24.0";return D});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("css", function(config, parserConfig) {
  var inline = parserConfig.inline
  if (!parserConfig.propertyKeywords) parserConfig = CodeMirror.resolveMode("text/css");

  var indentUnit = config.indentUnit,
      tokenHooks = parserConfig.tokenHooks,
      documentTypes = parserConfig.documentTypes || {},
      mediaTypes = parserConfig.mediaTypes || {},
      mediaFeatures = parserConfig.mediaFeatures || {},
      mediaValueKeywords = parserConfig.mediaValueKeywords || {},
      propertyKeywords = parserConfig.propertyKeywords || {},
      nonStandardPropertyKeywords = parserConfig.nonStandardPropertyKeywords || {},
      fontProperties = parserConfig.fontProperties || {},
      counterDescriptors = parserConfig.counterDescriptors || {},
      colorKeywords = parserConfig.colorKeywords || {},
      valueKeywords = parserConfig.valueKeywords || {},
      allowNested = parserConfig.allowNested,
      lineComment = parserConfig.lineComment,
      supportsAtComponent = parserConfig.supportsAtComponent === true;

  var type, override;
  function ret(style, tp) { type = tp; return style; }

  // Tokenizers

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (tokenHooks[ch]) {
      var result = tokenHooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == "@") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("def", stream.current());
    } else if (ch == "=" || (ch == "~" || ch == "|") && stream.eat("=")) {
      return ret(null, "compare");
    } else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "#") {
      stream.eatWhile(/[\w\\\-]/);
      return ret("atom", "hash");
    } else if (ch == "!") {
      stream.match(/^\s*\w*/);
      return ret("keyword", "important");
    } else if (/\d/.test(ch) || ch == "." && stream.eat(/\d/)) {
      stream.eatWhile(/[\w.%]/);
      return ret("number", "unit");
    } else if (ch === "-") {
      if (/[\d.]/.test(stream.peek())) {
        stream.eatWhile(/[\w.%]/);
        return ret("number", "unit");
      } else if (stream.match(/^-[\w\\\-]+/)) {
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ret("variable-2", "variable-definition");
        return ret("variable-2", "variable");
      } else if (stream.match(/^\w+-/)) {
        return ret("meta", "meta");
      }
    } else if (/[,+>*\/]/.test(ch)) {
      return ret(null, "select-op");
    } else if (ch == "." && stream.match(/^-?[_a-z][_a-z0-9-]*/i)) {
      return ret("qualifier", "qualifier");
    } else if (/[:;{}\[\]\(\)]/.test(ch)) {
      return ret(null, ch);
    } else if ((ch == "u" && stream.match(/rl(-prefix)?\(/)) ||
               (ch == "d" && stream.match("omain(")) ||
               (ch == "r" && stream.match("egexp("))) {
      stream.backUp(1);
      state.tokenize = tokenParenthesized;
      return ret("property", "word");
    } else if (/[\w\\\-]/.test(ch)) {
      stream.eatWhile(/[\w\\\-]/);
      return ret("property", "word");
    } else {
      return ret(null, null);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          if (quote == ")") stream.backUp(1);
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      if (ch == quote || !escaped && quote != ")") state.tokenize = null;
      return ret("string", "string");
    };
  }

  function tokenParenthesized(stream, state) {
    stream.next(); // Must be '('
    if (!stream.match(/\s*[\"\')]/, false))
      state.tokenize = tokenString(")");
    else
      state.tokenize = null;
    return ret(null, "(");
  }

  // Context management

  function Context(type, indent, prev) {
    this.type = type;
    this.indent = indent;
    this.prev = prev;
  }

  function pushContext(state, stream, type, indent) {
    state.context = new Context(type, stream.indentation() + (indent === false ? 0 : indentUnit), state.context);
    return type;
  }

  function popContext(state) {
    if (state.context.prev)
      state.context = state.context.prev;
    return state.context.type;
  }

  function pass(type, stream, state) {
    return states[state.context.type](type, stream, state);
  }
  function popAndPass(type, stream, state, n) {
    for (var i = n || 1; i > 0; i--)
      state.context = state.context.prev;
    return pass(type, stream, state);
  }

  // Parser

  function wordAsValue(stream) {
    var word = stream.current().toLowerCase();
    if (valueKeywords.hasOwnProperty(word))
      override = "atom";
    else if (colorKeywords.hasOwnProperty(word))
      override = "keyword";
    else
      override = "variable";
  }

  var states = {};

  states.top = function(type, stream, state) {
    if (type == "{") {
      return pushContext(state, stream, "block");
    } else if (type == "}" && state.context.prev) {
      return popContext(state);
    } else if (supportsAtComponent && /@component/.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/.test(type)) {
      return "keyframes";
    } else if (type && type.charAt(0) == "@") {
      return pushContext(state, stream, "at");
    } else if (type == "hash") {
      override = "builtin";
    } else if (type == "word") {
      override = "tag";
    } else if (type == "variable-definition") {
      return "maybeprop";
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    } else if (type == ":") {
      return "pseudo";
    } else if (allowNested && type == "(") {
      return pushContext(state, stream, "parens");
    }
    return state.context.type;
  };

  states.block = function(type, stream, state) {
    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (propertyKeywords.hasOwnProperty(word)) {
        override = "property";
        return "maybeprop";
      } else if (nonStandardPropertyKeywords.hasOwnProperty(word)) {
        override = "string-2";
        return "maybeprop";
      } else if (allowNested) {
        override = stream.match(/^\s*:(?:\s|$)/, false) ? "property" : "tag";
        return "block";
      } else {
        override += " error";
        return "maybeprop";
      }
    } else if (type == "meta") {
      return "block";
    } else if (!allowNested && (type == "hash" || type == "qualifier")) {
      override = "error";
      return "block";
    } else {
      return states.top(type, stream, state);
    }
  };

  states.maybeprop = function(type, stream, state) {
    if (type == ":") return pushContext(state, stream, "prop");
    return pass(type, stream, state);
  };

  states.prop = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" && allowNested) return pushContext(state, stream, "propBlock");
    if (type == "}" || type == "{") return popAndPass(type, stream, state);
    if (type == "(") return pushContext(state, stream, "parens");

    if (type == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(stream.current())) {
      override += " error";
    } else if (type == "word") {
      wordAsValue(stream);
    } else if (type == "interpolation") {
      return pushContext(state, stream, "interpolation");
    }
    return "prop";
  };

  states.propBlock = function(type, _stream, state) {
    if (type == "}") return popContext(state);
    if (type == "word") { override = "property"; return "maybeprop"; }
    return state.context.type;
  };

  states.parens = function(type, stream, state) {
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == ")") return popContext(state);
    if (type == "(") return pushContext(state, stream, "parens");
    if (type == "interpolation") return pushContext(state, stream, "interpolation");
    if (type == "word") wordAsValue(stream);
    return "parens";
  };

  states.pseudo = function(type, stream, state) {
    if (type == "meta") return "pseudo";

    if (type == "word") {
      override = "variable-3";
      return state.context.type;
    }
    return pass(type, stream, state);
  };

  states.documentTypes = function(type, stream, state) {
    if (type == "word" && documentTypes.hasOwnProperty(stream.current())) {
      override = "tag";
      return state.context.type;
    } else {
      return states.atBlock(type, stream, state);
    }
  };

  states.atBlock = function(type, stream, state) {
    if (type == "(") return pushContext(state, stream, "atBlock_parens");
    if (type == "}" || type == ";") return popAndPass(type, stream, state);
    if (type == "{") return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top");

    if (type == "interpolation") return pushContext(state, stream, "interpolation");

    if (type == "word") {
      var word = stream.current().toLowerCase();
      if (word == "only" || word == "not" || word == "and" || word == "or")
        override = "keyword";
      else if (mediaTypes.hasOwnProperty(word))
        override = "attribute";
      else if (mediaFeatures.hasOwnProperty(word))
        override = "property";
      else if (mediaValueKeywords.hasOwnProperty(word))
        override = "keyword";
      else if (propertyKeywords.hasOwnProperty(word))
        override = "property";
      else if (nonStandardPropertyKeywords.hasOwnProperty(word))
        override = "string-2";
      else if (valueKeywords.hasOwnProperty(word))
        override = "atom";
      else if (colorKeywords.hasOwnProperty(word))
        override = "keyword";
      else
        override = "error";
    }
    return state.context.type;
  };

  states.atComponentBlock = function(type, stream, state) {
    if (type == "}")
      return popAndPass(type, stream, state);
    if (type == "{")
      return popContext(state) && pushContext(state, stream, allowNested ? "block" : "top", false);
    if (type == "word")
      override = "error";
    return state.context.type;
  };

  states.atBlock_parens = function(type, stream, state) {
    if (type == ")") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state, 2);
    return states.atBlock(type, stream, state);
  };

  states.restricted_atBlock_before = function(type, stream, state) {
    if (type == "{")
      return pushContext(state, stream, "restricted_atBlock");
    if (type == "word" && state.stateArg == "@counter-style") {
      override = "variable";
      return "restricted_atBlock_before";
    }
    return pass(type, stream, state);
  };

  states.restricted_atBlock = function(type, stream, state) {
    if (type == "}") {
      state.stateArg = null;
      return popContext(state);
    }
    if (type == "word") {
      if ((state.stateArg == "@font-face" && !fontProperties.hasOwnProperty(stream.current().toLowerCase())) ||
          (state.stateArg == "@counter-style" && !counterDescriptors.hasOwnProperty(stream.current().toLowerCase())))
        override = "error";
      else
        override = "property";
      return "maybeprop";
    }
    return "restricted_atBlock";
  };

  states.keyframes = function(type, stream, state) {
    if (type == "word") { override = "variable"; return "keyframes"; }
    if (type == "{") return pushContext(state, stream, "top");
    return pass(type, stream, state);
  };

  states.at = function(type, stream, state) {
    if (type == ";") return popContext(state);
    if (type == "{" || type == "}") return popAndPass(type, stream, state);
    if (type == "word") override = "tag";
    else if (type == "hash") override = "builtin";
    return "at";
  };

  states.interpolation = function(type, stream, state) {
    if (type == "}") return popContext(state);
    if (type == "{" || type == ";") return popAndPass(type, stream, state);
    if (type == "word") override = "variable";
    else if (type != "variable" && type != "(" && type != ")") override = "error";
    return "interpolation";
  };

  return {
    startState: function(base) {
      return {tokenize: null,
              state: inline ? "block" : "top",
              stateArg: null,
              context: new Context(inline ? "block" : "top", base || 0, null)};
    },

    token: function(stream, state) {
      if (!state.tokenize && stream.eatSpace()) return null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style && typeof style == "object") {
        type = style[1];
        style = style[0];
      }
      override = style;
      state.state = states[state.state](type, stream, state);
      return override;
    },

    indent: function(state, textAfter) {
      var cx = state.context, ch = textAfter && textAfter.charAt(0);
      var indent = cx.indent;
      if (cx.type == "prop" && (ch == "}" || ch == ")")) cx = cx.prev;
      if (cx.prev) {
        if (ch == "}" && (cx.type == "block" || cx.type == "top" ||
                          cx.type == "interpolation" || cx.type == "restricted_atBlock")) {
          // Resume indentation from parent context.
          cx = cx.prev;
          indent = cx.indent;
        } else if (ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
            ch == "{" && (cx.type == "at" || cx.type == "atBlock")) {
          // Dedent relative to current context.
          indent = Math.max(0, cx.indent - indentUnit);
          cx = cx.prev;
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: lineComment,
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i].toLowerCase()] = true;
    }
    return keys;
  }

  var documentTypes_ = [
    "domain", "regexp", "url", "url-prefix"
  ], documentTypes = keySet(documentTypes_);

  var mediaTypes_ = [
    "all", "aural", "braille", "handheld", "print", "projection", "screen",
    "tty", "tv", "embossed"
  ], mediaTypes = keySet(mediaTypes_);

  var mediaFeatures_ = [
    "width", "min-width", "max-width", "height", "min-height", "max-height",
    "device-width", "min-device-width", "max-device-width", "device-height",
    "min-device-height", "max-device-height", "aspect-ratio",
    "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio",
    "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color",
    "max-color", "color-index", "min-color-index", "max-color-index",
    "monochrome", "min-monochrome", "max-monochrome", "resolution",
    "min-resolution", "max-resolution", "scan", "grid", "orientation",
    "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio",
    "pointer", "any-pointer", "hover", "any-hover"
  ], mediaFeatures = keySet(mediaFeatures_);

  var mediaValueKeywords_ = [
    "landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover",
    "interlace", "progressive"
  ], mediaValueKeywords = keySet(mediaValueKeywords_);

  var propertyKeywords_ = [
    "align-content", "align-items", "align-self", "alignment-adjust",
    "alignment-baseline", "anchor-point", "animation", "animation-delay",
    "animation-direction", "animation-duration", "animation-fill-mode",
    "animation-iteration-count", "animation-name", "animation-play-state",
    "animation-timing-function", "appearance", "azimuth", "backface-visibility",
    "background", "background-attachment", "background-blend-mode", "background-clip",
    "background-color", "background-image", "background-origin", "background-position",
    "background-repeat", "background-size", "baseline-shift", "binding",
    "bleed", "bookmark-label", "bookmark-level", "bookmark-state",
    "bookmark-target", "border", "border-bottom", "border-bottom-color",
    "border-bottom-left-radius", "border-bottom-right-radius",
    "border-bottom-style", "border-bottom-width", "border-collapse",
    "border-color", "border-image", "border-image-outset",
    "border-image-repeat", "border-image-slice", "border-image-source",
    "border-image-width", "border-left", "border-left-color",
    "border-left-style", "border-left-width", "border-radius", "border-right",
    "border-right-color", "border-right-style", "border-right-width",
    "border-spacing", "border-style", "border-top", "border-top-color",
    "border-top-left-radius", "border-top-right-radius", "border-top-style",
    "border-top-width", "border-width", "bottom", "box-decoration-break",
    "box-shadow", "box-sizing", "break-after", "break-before", "break-inside",
    "caption-side", "clear", "clip", "color", "color-profile", "column-count",
    "column-fill", "column-gap", "column-rule", "column-rule-color",
    "column-rule-style", "column-rule-width", "column-span", "column-width",
    "columns", "content", "counter-increment", "counter-reset", "crop", "cue",
    "cue-after", "cue-before", "cursor", "direction", "display",
    "dominant-baseline", "drop-initial-after-adjust",
    "drop-initial-after-align", "drop-initial-before-adjust",
    "drop-initial-before-align", "drop-initial-size", "drop-initial-value",
    "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis",
    "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap",
    "float", "float-offset", "flow-from", "flow-into", "font", "font-feature-settings",
    "font-family", "font-kerning", "font-language-override", "font-size", "font-size-adjust",
    "font-stretch", "font-style", "font-synthesis", "font-variant",
    "font-variant-alternates", "font-variant-caps", "font-variant-east-asian",
    "font-variant-ligatures", "font-variant-numeric", "font-variant-position",
    "font-weight", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow",
    "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap",
    "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap",
    "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns",
    "grid-template-rows", "hanging-punctuation", "height", "hyphens",
    "icon", "image-orientation", "image-rendering", "image-resolution",
    "inline-box-align", "justify-content", "left", "letter-spacing",
    "line-break", "line-height", "line-stacking", "line-stacking-ruby",
    "line-stacking-shift", "line-stacking-strategy", "list-style",
    "list-style-image", "list-style-position", "list-style-type", "margin",
    "margin-bottom", "margin-left", "margin-right", "margin-top",
    "marks", "marquee-direction", "marquee-loop",
    "marquee-play-count", "marquee-speed", "marquee-style", "max-height",
    "max-width", "min-height", "min-width", "move-to", "nav-down", "nav-index",
    "nav-left", "nav-right", "nav-up", "object-fit", "object-position",
    "opacity", "order", "orphans", "outline",
    "outline-color", "outline-offset", "outline-style", "outline-width",
    "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "page", "page-break-after", "page-break-before", "page-break-inside",
    "page-policy", "pause", "pause-after", "pause-before", "perspective",
    "perspective-origin", "pitch", "pitch-range", "play-during", "position",
    "presentation-level", "punctuation-trim", "quotes", "region-break-after",
    "region-break-before", "region-break-inside", "region-fragment",
    "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness",
    "right", "rotation", "rotation-point", "ruby-align", "ruby-overhang",
    "ruby-position", "ruby-span", "shape-image-threshold", "shape-inside", "shape-margin",
    "shape-outside", "size", "speak", "speak-as", "speak-header",
    "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set",
    "tab-size", "table-layout", "target", "target-name", "target-new",
    "target-position", "text-align", "text-align-last", "text-decoration",
    "text-decoration-color", "text-decoration-line", "text-decoration-skip",
    "text-decoration-style", "text-emphasis", "text-emphasis-color",
    "text-emphasis-position", "text-emphasis-style", "text-height",
    "text-indent", "text-justify", "text-outline", "text-overflow", "text-shadow",
    "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position",
    "text-wrap", "top", "transform", "transform-origin", "transform-style",
    "transition", "transition-delay", "transition-duration",
    "transition-property", "transition-timing-function", "unicode-bidi",
    "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break",
    "word-spacing", "word-wrap", "z-index",
    // SVG-specific
    "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color",
    "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events",
    "color-interpolation", "color-interpolation-filters",
    "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering",
    "marker", "marker-end", "marker-mid", "marker-start", "shape-rendering", "stroke",
    "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin",
    "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering",
    "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal",
    "glyph-orientation-vertical", "text-anchor", "writing-mode"
  ], propertyKeywords = keySet(propertyKeywords_);

  var nonStandardPropertyKeywords_ = [
    "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color",
    "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color",
    "scrollbar-3d-light-color", "scrollbar-track-color", "shape-inside",
    "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
    "searchfield-results-decoration", "zoom"
  ], nonStandardPropertyKeywords = keySet(nonStandardPropertyKeywords_);

  var fontProperties_ = [
    "font-family", "src", "unicode-range", "font-variant", "font-feature-settings",
    "font-stretch", "font-weight", "font-style"
  ], fontProperties = keySet(fontProperties_);

  var counterDescriptors_ = [
    "additive-symbols", "fallback", "negative", "pad", "prefix", "range",
    "speak-as", "suffix", "symbols", "system"
  ], counterDescriptors = keySet(counterDescriptors_);

  var colorKeywords_ = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
    "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
    "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
    "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet",
    "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick",
    "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
    "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew",
    "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink",
    "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta",
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple",
    "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered",
    "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred",
    "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue",
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue",
    "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ], colorKeywords = keySet(colorKeywords_);

  var valueKeywords_ = [
    "above", "absolute", "activeborder", "additive", "activecaption", "afar",
    "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate",
    "always", "amharic", "amharic-abegede", "antialiased", "appworkspace",
    "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse",
    "compact", "condensed", "contain", "content", "contents",
    "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop",
    "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal",
    "decimal-leading-zero", "default", "default-button", "dense", "destination-atop",
    "destination-in", "destination-out", "destination-over", "devanagari", "difference",
    "disc", "discard", "disclosure-closed", "disclosure-open", "document",
    "dot-dash", "dot-dot-dash",
    "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out",
    "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede",
    "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er",
    "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er",
    "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et",
    "ethiopic-halehame-gez", "ethiopic-halehame-om-et",
    "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et",
    "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig",
    "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed",
    "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes",
    "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove",
    "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew",
    "help", "hidden", "hide", "higher", "highlight", "highlighttext",
    "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore",
    "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite",
    "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis",
    "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert",
    "italic", "japanese-formal", "japanese-informal", "justify", "kannada",
    "katakana", "katakana-iroha", "keep-all", "khmer",
    "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal",
    "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten",
    "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem",
    "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian",
    "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian",
    "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "match", "matrix", "matrix3d",
    "media-controls-background", "media-current-time-display",
    "media-fullscreen-button", "media-mute-button", "media-play-button",
    "media-return-to-realtime-button", "media-rewind-button",
    "media-seek-back-button", "media-seek-forward-button", "media-slider",
    "media-sliderthumb", "media-time-remaining-display", "media-volume-slider",
    "media-volume-slider-container", "media-volume-sliderthumb", "medium",
    "menu", "menulist", "menulist-button", "menulist-text",
    "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic",
    "mix", "mongolian", "monospace", "move", "multiple", "multiply", "myanmar", "n-resize",
    "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop",
    "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap",
    "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote",
    "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset",
    "outside", "outside-shape", "overlay", "overline", "padding", "padding-box",
    "painted", "page", "paused", "persian", "perspective", "plus-darker", "plus-lighter",
    "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d",
    "progress", "push-button", "radial-gradient", "radio", "read-only",
    "read-write", "read-write-plaintext-only", "rectangle", "region",
    "relative", "repeat", "repeating-linear-gradient",
    "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse",
    "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY",
    "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running",
    "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen",
    "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield",
    "searchfield-cancel-button", "searchfield-decoration",
    "searchfield-results-button", "searchfield-results-decoration",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "simp-chinese-formal", "simp-chinese-informal", "single",
    "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "spell-out", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
    "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "table",
    "table-caption", "table-cell", "table-column", "table-column-group",
    "table-footer-group", "table-header-group", "table-row", "table-row-group",
    "tamil",
    "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai",
    "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight",
    "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er",
    "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top",
    "trad-chinese-formal", "trad-chinese-informal", "transform",
    "translate", "translate3d", "translateX", "translateY", "translateZ",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "unset", "up",
    "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal",
    "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url",
    "var", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted",
    "visibleStroke", "visual", "w-resize", "wait", "wave", "wider",
    "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor",
    "xx-large", "xx-small"
  ], valueKeywords = keySet(valueKeywords_);

  var allWords = documentTypes_.concat(mediaTypes_).concat(mediaFeatures_).concat(mediaValueKeywords_)
    .concat(propertyKeywords_).concat(nonStandardPropertyKeywords_).concat(colorKeywords_)
    .concat(valueKeywords_);
  CodeMirror.registerHelper("hintWords", "css", allWords);

  function tokenCComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (maybeEnd && ch == "/") {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ["comment", "comment"];
  }

  CodeMirror.defineMIME("text/css", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css"
  });

  CodeMirror.defineMIME("text/x-scss", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      ":": function(stream) {
        if (stream.match(/\s*\{/))
          return [null, "{"];
        return false;
      },
      "$": function(stream) {
        stream.match(/^[\w-]+/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "#": function(stream) {
        if (!stream.eat("{")) return false;
        return [null, "interpolation"];
      }
    },
    name: "css",
    helperType: "scss"
  });

  CodeMirror.defineMIME("text/x-less", {
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    mediaValueKeywords: mediaValueKeywords,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    fontProperties: fontProperties,
    allowNested: true,
    lineComment: "//",
    tokenHooks: {
      "/": function(stream, state) {
        if (stream.eat("/")) {
          stream.skipToEnd();
          return ["comment", "comment"];
        } else if (stream.eat("*")) {
          state.tokenize = tokenCComment;
          return tokenCComment(stream, state);
        } else {
          return ["operator", "operator"];
        }
      },
      "@": function(stream) {
        if (stream.eat("{")) return [null, "interpolation"];
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/, false)) return false;
        stream.eatWhile(/[\w\\\-]/);
        if (stream.match(/^\s*:/, false))
          return ["variable-2", "variable-definition"];
        return ["variable-2", "variable"];
      },
      "&": function() {
        return ["atom", "atom"];
      }
    },
    name: "css",
    helperType: "less"
  });

  CodeMirror.defineMIME("text/x-gss", {
    documentTypes: documentTypes,
    mediaTypes: mediaTypes,
    mediaFeatures: mediaFeatures,
    propertyKeywords: propertyKeywords,
    nonStandardPropertyKeywords: nonStandardPropertyKeywords,
    fontProperties: fontProperties,
    counterDescriptors: counterDescriptors,
    colorKeywords: colorKeywords,
    valueKeywords: valueKeywords,
    supportsAtComponent: true,
    tokenHooks: {
      "/": function(stream, state) {
        if (!stream.eat("*")) return false;
        state.tokenize = tokenCComment;
        return tokenCComment(stream, state);
      }
    },
    name: "css",
    helperType: "gss"
  });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("sql", function(config, parserConfig) {
  "use strict";

  var client         = parserConfig.client || {},
      atoms          = parserConfig.atoms || {"false": true, "true": true, "null": true},
      builtin        = parserConfig.builtin || {},
      keywords       = parserConfig.keywords || {},
      operatorChars  = parserConfig.operatorChars || /^[*+\-%<>!=&|~^]/,
      support        = parserConfig.support || {},
      hooks          = parserConfig.hooks || {},
      dateSQL        = parserConfig.dateSQL || {"date" : true, "time" : true, "timestamp" : true};

  function tokenBase(stream, state) {
    var ch = stream.next();

    // call hooks from the mime type
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }

    if (support.hexNumber &&
      ((ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/))
      || (ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]+'/))) {
      // hex
      // ref: http://dev.mysql.com/doc/refman/5.5/en/hexadecimal-literals.html
      return "number";
    } else if (support.binaryNumber &&
      (((ch == "b" || ch == "B") && stream.match(/^'[01]+'/))
      || (ch == "0" && stream.match(/^b[01]+/)))) {
      // bitstring
      // ref: http://dev.mysql.com/doc/refman/5.5/en/bit-field-literals.html
      return "number";
    } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
      // numbers
      // ref: http://dev.mysql.com/doc/refman/5.5/en/number-literals.html
          stream.match(/^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.eat('.');
      return "number";
    } else if (ch == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
      // placeholders
      return "variable-3";
    } else if (ch == "'" || (ch == '"' && support.doubleQuote)) {
      // strings
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    } else if ((((support.nCharCast && (ch == "n" || ch == "N"))
        || (support.charsetCast && ch == "_" && stream.match(/[a-z][a-z0-9]*/i)))
        && (stream.peek() == "'" || stream.peek() == '"'))) {
      // charset casting: _utf8'str', N'str', n'str'
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      return "keyword";
    } else if (/^[\(\),\;\[\]]/.test(ch)) {
      // no highlighting
      return null;
    } else if (support.commentSlashSlash && ch == "/" && stream.eat("/")) {
      // 1-line comment
      stream.skipToEnd();
      return "comment";
    } else if ((support.commentHash && ch == "#")
        || (ch == "-" && stream.eat("-") && (!support.commentSpaceRequired || stream.eat(" ")))) {
      // 1-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      stream.skipToEnd();
      return "comment";
    } else if (ch == "/" && stream.eat("*")) {
      // multi-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      state.tokenize = tokenComment;
      return state.tokenize(stream, state);
    } else if (ch == ".") {
      // .1 for 0.1
      if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i)) {
        return "number";
      }
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable && stream.match(/^[a-zA-Z_]+/)) {
        return "variable-2";
      }
    } else if (operatorChars.test(ch)) {
      // operators
      stream.eatWhile(operatorChars);
      return null;
    } else if (ch == '{' &&
        (stream.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) || stream.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))) {
      // dates (weird ODBC syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      return "number";
    } else {
      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();
      // dates (standard SQL syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      if (dateSQL.hasOwnProperty(word) && (stream.match(/^( )+'[^']*'/) || stream.match(/^( )+"[^"]*"/)))
        return "number";
      if (atoms.hasOwnProperty(word)) return "atom";
      if (builtin.hasOwnProperty(word)) return "builtin";
      if (keywords.hasOwnProperty(word)) return "keyword";
      if (client.hasOwnProperty(word)) return "string-2";
      return null;
    }
  }

  // 'string', with char specified in quote escaped by '\'
  function tokenLiteral(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      return "string";
    };
  }
  function tokenComment(stream, state) {
    while (true) {
      if (stream.skipTo("*")) {
        stream.next();
        if (stream.eat("/")) {
          state.tokenize = tokenBase;
          break;
        }
      } else {
        stream.skipToEnd();
        break;
      }
    }
    return "comment";
  }

  function pushContext(stream, state, type) {
    state.context = {
      prev: state.context,
      indent: stream.indentation(),
      col: stream.column(),
      type: type
    };
  }

  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function() {
      return {tokenize: tokenBase, context: null};
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null)
          state.context.align = false;
      }
      if (stream.eatSpace()) return null;

      var style = state.tokenize(stream, state);
      if (style == "comment") return style;

      if (state.context && state.context.align == null)
        state.context.align = true;

      var tok = stream.current();
      if (tok == "(")
        pushContext(stream, state, ")");
      else if (tok == "[")
        pushContext(stream, state, "]");
      else if (state.context && state.context.type == tok)
        popContext(state);
      return style;
    },

    indent: function(state, textAfter) {
      var cx = state.context;
      if (!cx) return CodeMirror.Pass;
      var closing = textAfter.charAt(0) == cx.type;
      if (cx.align) return cx.col + (closing ? 0 : 1);
      else return cx.indent + (closing ? 0 : config.indentUnit);
    },

    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : null
  };
});

(function() {
  "use strict";

  // `identifier`
  function hookIdentifier(stream) {
    // MySQL/MariaDB identifiers
    // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
    var ch;
    while ((ch = stream.next()) != null) {
      if (ch == "`" && !stream.eat("`")) return "variable-2";
    }
    stream.backUp(stream.current().length - 1);
    return stream.eatWhile(/\w/) ? "variable-2" : null;
  }

  // variable token
  function hookVar(stream) {
    // variables
    // @@prefix.varName @varName
    // varName can be quoted with ` or ' or "
    // ref: http://dev.mysql.com/doc/refman/5.5/en/user-variables.html
    if (stream.eat("@")) {
      stream.match(/^session\./);
      stream.match(/^local\./);
      stream.match(/^global\./);
    }

    if (stream.eat("'")) {
      stream.match(/^.*'/);
      return "variable-2";
    } else if (stream.eat('"')) {
      stream.match(/^.*"/);
      return "variable-2";
    } else if (stream.eat("`")) {
      stream.match(/^.*`/);
      return "variable-2";
    } else if (stream.match(/^[0-9a-zA-Z$\.\_]+/)) {
      return "variable-2";
    }
    return null;
  };

  // short client keyword token
  function hookClient(stream) {
    // \N means NULL
    // ref: http://dev.mysql.com/doc/refman/5.5/en/null-values.html
    if (stream.eat("N")) {
        return "atom";
    }
    // \g, etc
    // ref: http://dev.mysql.com/doc/refman/5.5/en/mysql-commands.html
    return stream.match(/^[a-zA-Z.#!?]/) ? "variable-2" : null;
  }

  // these keywords are used by all SQL dialects (however, a mode can still overwrite it)
  var sqlKeywords = "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit ";

  // turn a space-separated list into an array
  function set(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }

  // A generic SQL Mode. It's not a standard, it just try to support what is generally supported
  CodeMirror.defineMIME("text/x-sql", {
    name: "sql",
    keywords: set(sqlKeywords + "begin"),
    builtin: set("bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable doubleQuote binaryNumber hexNumber")
  });

  CodeMirror.defineMIME("text/x-mssql", {
    name: "sql",
    client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
    keywords: set(sqlKeywords + "begin trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare exec"),
    builtin: set("bigint numeric bit smallint decimal smallmoney int tinyint money float real char varchar text nchar nvarchar ntext binary varbinary image cursor timestamp hierarchyid uniqueidentifier sql_variant xml table "),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=]/,
    dateSQL: set("date datetimeoffset datetime2 smalldatetime datetime time"),
    hooks: {
      "@":   hookVar
    }
  });

  CodeMirror.defineMIME("text/x-mysql", {
    name: "sql",
    client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
    keywords: set(sqlKeywords + "accessible action add after algorithm all analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general get global grant grants group group_concat handler hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show signal slave slow smallint snapshot soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"),
    builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=&|^]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"),
    hooks: {
      "@":   hookVar,
      "`":   hookIdentifier,
      "\\":  hookClient
    }
  });

  CodeMirror.defineMIME("text/x-mariadb", {
    name: "sql",
    client: set("charset clear connect edit ego exit go help nopager notee nowarning pager print prompt quit rehash source status system tee"),
    keywords: set(sqlKeywords + "accessible action add after algorithm all always analyze asensitive at authors auto_increment autocommit avg avg_row_length before binary binlog both btree cache call cascade cascaded case catalog_name chain change changed character check checkpoint checksum class_origin client_statistics close coalesce code collate collation collations column columns comment commit committed completion concurrent condition connection consistent constraint contains continue contributors convert cross current current_date current_time current_timestamp current_user cursor data database databases day_hour day_microsecond day_minute day_second deallocate dec declare default delay_key_write delayed delimiter des_key_file describe deterministic dev_pop dev_samp deviance diagnostics directory disable discard distinctrow div dual dumpfile each elseif enable enclosed end ends engine engines enum errors escape escaped even event events every execute exists exit explain extended fast fetch field fields first flush for force foreign found_rows full fulltext function general generated get global grant grants group groupby_concat handler hard hash help high_priority hosts hour_microsecond hour_minute hour_second if ignore ignore_server_ids import index index_statistics infile inner innodb inout insensitive insert_method install interval invoker isolation iterate key keys kill language last leading leave left level limit linear lines list load local localtime localtimestamp lock logs low_priority master master_heartbeat_period master_ssl_verify_server_cert masters match max max_rows maxvalue message_text middleint migrate min min_rows minute_microsecond minute_second mod mode modifies modify mutex mysql_errno natural next no no_write_to_binlog offline offset one online open optimize option optionally out outer outfile pack_keys parser partition partitions password persistent phase plugin plugins prepare preserve prev primary privileges procedure processlist profile profiles purge query quick range read read_write reads real rebuild recover references regexp relaylog release remove rename reorganize repair repeatable replace require resignal restrict resume return returns revoke right rlike rollback rollup row row_format rtree savepoint schedule schema schema_name schemas second_microsecond security sensitive separator serializable server session share show shutdown signal slave slow smallint snapshot soft soname spatial specific sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sqlexception sqlstate sqlwarning ssl start starting starts status std stddev stddev_pop stddev_samp storage straight_join subclass_origin sum suspend table_name table_statistics tables tablespace temporary terminated to trailing transaction trigger triggers truncate uncommitted undo uninstall unique unlock upgrade usage use use_frm user user_resources user_statistics using utc_date utc_time utc_timestamp value variables varying view views virtual warnings when while with work write xa xor year_month zerofill begin do then else loop repeat"),
    builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision date datetime year unsigned signed numeric"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=&|^]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber doubleQuote nCharCast charsetCast commentHash commentSpaceRequired"),
    hooks: {
      "@":   hookVar,
      "`":   hookIdentifier,
      "\\":  hookClient
    }
  });

  // the query language used by Apache Cassandra is called CQL, but this mime type
  // is called Cassandra to avoid confusion with Contextual Query Language
  CodeMirror.defineMIME("text/x-cassandra", {
    name: "sql",
    client: { },
    keywords: set("add all allow alter and any apply as asc authorize batch begin by clustering columnfamily compact consistency count create custom delete desc distinct drop each_quorum exists filtering from grant if in index insert into key keyspace keyspaces level limit local_one local_quorum modify nan norecursive nosuperuser not of on one order password permission permissions primary quorum rename revoke schema select set storage superuser table three to token truncate ttl two type unlogged update use user users using values where with writetime"),
    builtin: set("ascii bigint blob boolean counter decimal double float frozen inet int list map static text timestamp timeuuid tuple uuid varchar varint"),
    atoms: set("false true infinity NaN"),
    operatorChars: /^[<>=]/,
    dateSQL: { },
    support: set("commentSlashSlash decimallessFloat"),
    hooks: { }
  });

  // this is based on Peter Raganitsch's 'plsql' mode
  CodeMirror.defineMIME("text/x-plsql", {
    name:       "sql",
    client:     set("appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define describe echo editfile embedded escape exec execute feedback flagger flush heading headsep instance linesize lno loboffset logsource long longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar release repfooter repheader serveroutput shiftinout show showmode size spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout time timing trimout trimspool ttitle underline verify version wrap"),
    keywords:   set("abort accept access add all alter and any array arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body boolean by case cast char char_base check close cluster clusters colauth column comment commit compress connect connected constant constraint crash create current currval cursor data_base database date dba deallocate debugoff debugon decimal declare default definition delay delete desc digits dispose distinct do drop else elseif elsif enable end entry escape exception exception_init exchange exclusive exists exit external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging long loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base object of off offline on online only open option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw read rebuild record ref references refresh release rename replace resource restrict return returning returns reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate session set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work"),
    builtin:    set("abs acos add_months ascii asin atan atan2 average bfile bfilename bigserial bit blob ceil character chartorowid chr clob concat convert cos cosh count dec decode deref dual dump dup_val_on_index empty error exp false float floor found glb greatest hextoraw initcap instr instrb int integer isopen last_day least length lengthb ln lower lpad ltrim lub make_ref max min mlslabel mod months_between natural naturaln nchar nclob new_time next_day nextval nls_charset_decl_len nls_charset_id nls_charset_name nls_initcap nls_lower nls_sort nls_upper nlssort no_data_found notfound null number numeric nvarchar2 nvl others power rawtohex real reftohex round rowcount rowidtochar rowtype rpad rtrim serial sign signtype sin sinh smallint soundex sqlcode sqlerrm sqrt stddev string substr substrb sum sysdate tan tanh to_char text to_date to_label to_multi_byte to_number to_single_byte translate true trunc uid unlogged upper user userenv varchar varchar2 variance varying vsize xml"),
    operatorChars: /^[*+\-%<>!=~]/,
    dateSQL:    set("date time timestamp"),
    support:    set("doubleQuote nCharCast zerolessFloat binaryNumber hexNumber")
  });

  // Created to support specific hive keywords
  CodeMirror.defineMIME("text/x-hive", {
    name: "sql",
    keywords: set("select alter $elem$ $key$ $value$ add after all analyze and archive as asc before between binary both bucket buckets by cascade case cast change cluster clustered clusterstatus collection column columns comment compute concatenate continue create cross cursor data database databases dbproperties deferred delete delimited desc describe directory disable distinct distribute drop else enable end escaped exclusive exists explain export extended external false fetch fields fileformat first format formatted from full function functions grant group having hold_ddltime idxproperties if import in index indexes inpath inputdriver inputformat insert intersect into is items join keys lateral left like limit lines load local location lock locks mapjoin materialized minus msck no_drop nocompress not of offline on option or order out outer outputdriver outputformat overwrite partition partitioned partitions percent plus preserve procedure purge range rcfile read readonly reads rebuild recordreader recordwriter recover reduce regexp rename repair replace restrict revoke right rlike row schema schemas semi sequencefile serde serdeproperties set shared show show_database sort sorted ssl statistics stored streamtable table tables tablesample tblproperties temporary terminated textfile then tmp to touch transform trigger true unarchive undo union uniquejoin unlock update use using utc utc_tmestamp view when where while with"),
    builtin: set("bool boolean long timestamp tinyint smallint bigint int float double date datetime unsigned string array struct map uniontype"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=]/,
    dateSQL: set("date timestamp"),
    support: set("ODBCdotTable doubleQuote binaryNumber hexNumber")
  });

  CodeMirror.defineMIME("text/x-pgsql", {
    name: "sql",
    client: set("source"),
    // http://www.postgresql.org/docs/9.5/static/sql-keywords-appendix.html
    keywords: set(sqlKeywords + "a abort abs absent absolute access according action ada add admin after aggregate all allocate also always analyse analyze any are array array_agg array_max_cardinality asensitive assertion assignment asymmetric at atomic attribute attributes authorization avg backward base64 before begin begin_frame begin_partition bernoulli binary bit_length blob blocked bom both breadth c cache call called cardinality cascade cascaded case cast catalog catalog_name ceil ceiling chain characteristics characters character_length character_set_catalog character_set_name character_set_schema char_length check checkpoint class class_origin clob close cluster coalesce cobol collate collation collation_catalog collation_name collation_schema collect column columns column_name command_function command_function_code comment comments commit committed concurrently condition condition_number configuration conflict connect connection connection_name constraint constraints constraint_catalog constraint_name constraint_schema constructor contains content continue control conversion convert copy corr corresponding cost covar_pop covar_samp cross csv cube cume_dist current current_catalog current_date current_default_transform_group current_path current_role current_row current_schema current_time current_timestamp current_transform_group_for_type current_user cursor cursor_name cycle data database datalink datetime_interval_code datetime_interval_precision day db deallocate dec declare default defaults deferrable deferred defined definer degree delimiter delimiters dense_rank depth deref derived describe descriptor deterministic diagnostics dictionary disable discard disconnect dispatch dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue do document domain dynamic dynamic_function dynamic_function_code each element else empty enable encoding encrypted end end-exec end_frame end_partition enforced enum equals escape event every except exception exclude excluding exclusive exec execute exists exp explain expression extension external extract false family fetch file filter final first first_value flag float floor following for force foreign fortran forward found frame_row free freeze fs full function functions fusion g general generated get global go goto grant granted greatest grouping groups handler header hex hierarchy hold hour id identity if ignore ilike immediate immediately immutable implementation implicit import including increment indent index indexes indicator inherit inherits initially inline inner inout input insensitive instance instantiable instead integrity intersect intersection invoker isnull isolation k key key_member key_type label lag language large last last_value lateral lead leading leakproof least left length level library like_regex link listen ln load local localtime localtimestamp location locator lock locked logged lower m map mapping match matched materialized max maxvalue max_cardinality member merge message_length message_octet_length message_text method min minute minvalue mod mode modifies module month more move multiset mumps name names namespace national natural nchar nclob nesting new next nfc nfd nfkc nfkd nil no none normalize normalized nothing notify notnull nowait nth_value ntile null nullable nullif nulls number object occurrences_regex octets octet_length of off offset oids old only open operator option options ordering ordinality others out outer output over overlaps overlay overriding owned owner p pad parameter parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partial partition pascal passing passthrough password percent percentile_cont percentile_disc percent_rank period permission placing plans pli policy portion position position_regex power precedes preceding prepare prepared preserve primary prior privileges procedural procedure program public quote range rank read reads reassign recheck recovery recursive ref references referencing refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex relative release rename repeatable replace replica requiring reset respect restart restore restrict result return returned_cardinality returned_length returned_octet_length returned_sqlstate returning returns revoke right role rollback rollup routine routine_catalog routine_name routine_schema row rows row_count row_number rule savepoint scale schema schema_name scope scope_catalog scope_name scope_schema scroll search second section security selective self sensitive sequence sequences serializable server server_name session session_user setof sets share show similar simple size skip snapshot some source space specific specifictype specific_name sql sqlcode sqlerror sqlexception sqlstate sqlwarning sqrt stable standalone start state statement static statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset substring substring_regex succeeds sum symmetric sysid system system_time system_user t tables tablesample tablespace table_name temp template temporary then ties timezone_hour timezone_minute to token top_level_count trailing transaction transactions_committed transactions_rolled_back transaction_active transform transforms translate translate_regex translation treat trigger trigger_catalog trigger_name trigger_schema trim trim_array true truncate trusted type types uescape unbounded uncommitted under unencrypted unique unknown unlink unlisten unlogged unnamed unnest until untyped upper uri usage user user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema using vacuum valid validate validator value value_of varbinary variadic var_pop var_samp verbose version versioning view views volatile when whenever whitespace width_bucket window within work wrapper write xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate year yes loop repeat"),
    // http://www.postgresql.org/docs/9.5/static/datatype.html
    builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast")
  });

  // Google's SQL-like query language, GQL
  CodeMirror.defineMIME("text/x-gql", {
    name: "sql",
    keywords: set("ancestor and asc by contains desc descendant distinct from group has in is limit offset on order select superset where"),
    atoms: set("false true"),
    builtin: set("blob datetime first key __key__ string integer double boolean null"),
    operatorChars: /^[*+\-%<>!=]/
  });
}());

});

/*
  How Properties of Mime Types are used by SQL Mode
  =================================================

  keywords:
    A list of keywords you want to be highlighted.
  builtin:
    A list of builtin types you want to be highlighted (if you want types to be of class "builtin" instead of "keyword").
  operatorChars:
    All characters that must be handled as operators.
  client:
    Commands parsed and executed by the client (not the server).
  support:
    A list of supported syntaxes which are not common, but are supported by more than 1 DBMS.
    * ODBCdotTable: .tableName
    * zerolessFloat: .1
    * doubleQuote
    * nCharCast: N'string'
    * charsetCast: _utf8'string'
    * commentHash: use # char for comments
    * commentSlashSlash: use // for comments
    * commentSpaceRequired: require a space after -- for comments
  atoms:
    Keywords that must be highlighted as atoms,. Some DBMS's support more atoms than others:
    UNKNOWN, INFINITY, UNDERFLOW, NaN...
  dateSQL:
    Used for date/time SQL standard syntax, because not all DBMS's support same temporal types.
*/

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

var htmlConfig = {
  autoSelfClosers: {'area': true, 'base': true, 'br': true, 'col': true, 'command': true,
                    'embed': true, 'frame': true, 'hr': true, 'img': true, 'input': true,
                    'keygen': true, 'link': true, 'meta': true, 'param': true, 'source': true,
                    'track': true, 'wbr': true, 'menuitem': true},
  implicitlyClosed: {'dd': true, 'li': true, 'optgroup': true, 'option': true, 'p': true,
                     'rp': true, 'rt': true, 'tbody': true, 'td': true, 'tfoot': true,
                     'th': true, 'tr': true},
  contextGrabbers: {
    'dd': {'dd': true, 'dt': true},
    'dt': {'dd': true, 'dt': true},
    'li': {'li': true},
    'option': {'option': true, 'optgroup': true},
    'optgroup': {'optgroup': true},
    'p': {'address': true, 'article': true, 'aside': true, 'blockquote': true, 'dir': true,
          'div': true, 'dl': true, 'fieldset': true, 'footer': true, 'form': true,
          'h1': true, 'h2': true, 'h3': true, 'h4': true, 'h5': true, 'h6': true,
          'header': true, 'hgroup': true, 'hr': true, 'menu': true, 'nav': true, 'ol': true,
          'p': true, 'pre': true, 'section': true, 'table': true, 'ul': true},
    'rp': {'rp': true, 'rt': true},
    'rt': {'rp': true, 'rt': true},
    'tbody': {'tbody': true, 'tfoot': true},
    'td': {'td': true, 'th': true},
    'tfoot': {'tbody': true},
    'th': {'td': true, 'th': true},
    'thead': {'tbody': true, 'tfoot': true},
    'tr': {'tr': true}
  },
  doNotIndent: {"pre": true},
  allowUnquoted: true,
  allowMissing: true,
  caseFold: true
}

var xmlConfig = {
  autoSelfClosers: {},
  implicitlyClosed: {},
  contextGrabbers: {},
  doNotIndent: {},
  allowUnquoted: false,
  allowMissing: false,
  caseFold: false
}

CodeMirror.defineMode("xml", function(editorConf, config_) {
  var indentUnit = editorConf.indentUnit
  var config = {}
  var defaults = config_.htmlMode ? htmlConfig : xmlConfig
  for (var prop in defaults) config[prop] = defaults[prop]
  for (var prop in config_) config[prop] = config_[prop]

  // Return variables for tokenizers
  var type, setStyle;

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var ch = stream.next();
    if (ch == "<") {
      if (stream.eat("!")) {
        if (stream.eat("[")) {
          if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
          else return null;
        } else if (stream.match("--")) {
          return chain(inBlock("comment", "-->"));
        } else if (stream.match("DOCTYPE", true, true)) {
          stream.eatWhile(/[\w\._\-]/);
          return chain(doctype(1));
        } else {
          return null;
        }
      } else if (stream.eat("?")) {
        stream.eatWhile(/[\w\._\-]/);
        state.tokenize = inBlock("meta", "?>");
        return "meta";
      } else {
        type = stream.eat("/") ? "closeTag" : "openTag";
        state.tokenize = inTag;
        return "tag bracket";
      }
    } else if (ch == "&") {
      var ok;
      if (stream.eat("#")) {
        if (stream.eat("x")) {
          ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
        } else {
          ok = stream.eatWhile(/[\d]/) && stream.eat(";");
        }
      } else {
        ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
      }
      return ok ? "atom" : "error";
    } else {
      stream.eatWhile(/[^&<]/);
      return null;
    }
  }
  inText.isInText = true;

  function inTag(stream, state) {
    var ch = stream.next();
    if (ch == ">" || (ch == "/" && stream.eat(">"))) {
      state.tokenize = inText;
      type = ch == ">" ? "endTag" : "selfcloseTag";
      return "tag bracket";
    } else if (ch == "=") {
      type = "equals";
      return null;
    } else if (ch == "<") {
      state.tokenize = inText;
      state.state = baseState;
      state.tagName = state.tagStart = null;
      var next = state.tokenize(stream, state);
      return next ? next + " tag error" : "tag error";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      state.stringStartCol = stream.column();
      return state.tokenize(stream, state);
    } else {
      stream.match(/^[^\s\u00a0=<>\"\'\-]*[^\s\u00a0=<>\"\'\/\-]/);
      return "word";
    }
  }

  function inAttribute(quote) {
    var closure = function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inTag;
          break;
        }
      }
      return "string";
    };
    closure.isInAttribute = true;
    return closure;
  }

  function inBlock(style, terminator) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }
      return style;
    };
  }
  function doctype(depth) {
    return function(stream, state) {
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == "<") {
          state.tokenize = doctype(depth + 1);
          return state.tokenize(stream, state);
        } else if (ch == ">") {
          if (depth == 1) {
            state.tokenize = inText;
            break;
          } else {
            state.tokenize = doctype(depth - 1);
            return state.tokenize(stream, state);
          }
        }
      }
      return "meta";
    };
  }

  function Context(state, tagName, startOfLine) {
    this.prev = state.context;
    this.tagName = tagName;
    this.indent = state.indented;
    this.startOfLine = startOfLine;
    if (config.doNotIndent.hasOwnProperty(tagName) || (state.context && state.context.noIndent))
      this.noIndent = true;
  }
  function popContext(state) {
    if (state.context) state.context = state.context.prev;
  }
  function maybePopContext(state, nextTagName) {
    var parentTagName;
    while (true) {
      if (!state.context) {
        return;
      }
      parentTagName = state.context.tagName;
      if (!config.contextGrabbers.hasOwnProperty(parentTagName) ||
          !config.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
        return;
      }
      popContext(state);
    }
  }

  function baseState(type, stream, state) {
    if (type == "openTag") {
      state.tagStart = stream.column();
      return tagNameState;
    } else if (type == "closeTag") {
      return closeTagNameState;
    } else {
      return baseState;
    }
  }
  function tagNameState(type, stream, state) {
    if (type == "word") {
      state.tagName = stream.current();
      setStyle = "tag";
      return attrState;
    } else {
      setStyle = "error";
      return tagNameState;
    }
  }
  function closeTagNameState(type, stream, state) {
    if (type == "word") {
      var tagName = stream.current();
      if (state.context && state.context.tagName != tagName &&
          config.implicitlyClosed.hasOwnProperty(state.context.tagName))
        popContext(state);
      if ((state.context && state.context.tagName == tagName) || config.matchClosing === false) {
        setStyle = "tag";
        return closeState;
      } else {
        setStyle = "tag error";
        return closeStateErr;
      }
    } else {
      setStyle = "error";
      return closeStateErr;
    }
  }

  function closeState(type, _stream, state) {
    if (type != "endTag") {
      setStyle = "error";
      return closeState;
    }
    popContext(state);
    return baseState;
  }
  function closeStateErr(type, stream, state) {
    setStyle = "error";
    return closeState(type, stream, state);
  }

  function attrState(type, _stream, state) {
    if (type == "word") {
      setStyle = "attribute";
      return attrEqState;
    } else if (type == "endTag" || type == "selfcloseTag") {
      var tagName = state.tagName, tagStart = state.tagStart;
      state.tagName = state.tagStart = null;
      if (type == "selfcloseTag" ||
          config.autoSelfClosers.hasOwnProperty(tagName)) {
        maybePopContext(state, tagName);
      } else {
        maybePopContext(state, tagName);
        state.context = new Context(state, tagName, tagStart == state.indented);
      }
      return baseState;
    }
    setStyle = "error";
    return attrState;
  }
  function attrEqState(type, stream, state) {
    if (type == "equals") return attrValueState;
    if (!config.allowMissing) setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrValueState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    if (type == "word" && config.allowUnquoted) {setStyle = "string"; return attrState;}
    setStyle = "error";
    return attrState(type, stream, state);
  }
  function attrContinuedState(type, stream, state) {
    if (type == "string") return attrContinuedState;
    return attrState(type, stream, state);
  }

  return {
    startState: function(baseIndent) {
      var state = {tokenize: inText,
                   state: baseState,
                   indented: baseIndent || 0,
                   tagName: null, tagStart: null,
                   context: null}
      if (baseIndent != null) state.baseIndent = baseIndent
      return state
    },

    token: function(stream, state) {
      if (!state.tagName && stream.sol())
        state.indented = stream.indentation();

      if (stream.eatSpace()) return null;
      type = null;
      var style = state.tokenize(stream, state);
      if ((style || type) && style != "comment") {
        setStyle = null;
        state.state = state.state(type || style, stream, state);
        if (setStyle)
          style = setStyle == "error" ? style + " error" : setStyle;
      }
      return style;
    },

    indent: function(state, textAfter, fullLine) {
      var context = state.context;
      // Indent multi-line strings (e.g. css).
      if (state.tokenize.isInAttribute) {
        if (state.tagStart == state.indented)
          return state.stringStartCol + 1;
        else
          return state.indented + indentUnit;
      }
      if (context && context.noIndent) return CodeMirror.Pass;
      if (state.tokenize != inTag && state.tokenize != inText)
        return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
      // Indent the starts of attribute names.
      if (state.tagName) {
        if (config.multilineTagIndentPastTag !== false)
          return state.tagStart + state.tagName.length + 2;
        else
          return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
      }
      if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
      var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
      if (tagAfter && tagAfter[1]) { // Closing tag spotted
        while (context) {
          if (context.tagName == tagAfter[2]) {
            context = context.prev;
            break;
          } else if (config.implicitlyClosed.hasOwnProperty(context.tagName)) {
            context = context.prev;
          } else {
            break;
          }
        }
      } else if (tagAfter) { // Opening tag spotted
        while (context) {
          var grabbers = config.contextGrabbers[context.tagName];
          if (grabbers && grabbers.hasOwnProperty(tagAfter[2]))
            context = context.prev;
          else
            break;
        }
      }
      while (context && context.prev && !context.startOfLine)
        context = context.prev;
      if (context) return context.indent + indentUnit;
      else return state.baseIndent || 0;
    },

    electricInput: /<\/[\s\w:]+>$/,
    blockCommentStart: "<!--",
    blockCommentEnd: "-->",

    configuration: config.htmlMode ? "html" : "xml",
    helperType: config.htmlMode ? "html" : "xml",

    skipAttribute: function(state) {
      if (state.state == attrValueState)
        state.state = attrState
    }
  };
});

CodeMirror.defineMIME("text/xml", "xml");
CodeMirror.defineMIME("application/xml", "xml");
if (!CodeMirror.mimeModes.hasOwnProperty("text/html"))
  CodeMirror.defineMIME("text/html", {name: "xml", htmlMode: true});

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function expressionAllowed(stream, state, backUp) {
  return /^(?:operator|sof|keyword c|case|new|export|default|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
    (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
}

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": kw("new"), "delete": C, "throw": C, "debugger": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C, "async": kw("async")
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("class"),
        "implements": C,
        "namespace": C,
        "module": kw("module"),
        "enum": kw("module"),
        "type": kw("type"),

        // scope modifiers
        "public": kw("modifier"),
        "private": kw("modifier"),
        "protected": kw("modifier"),
        "abstract": kw("modifier"),

        // operators
        "as": operator,

        // types
        "string": type, "number": type, "boolean": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    } else if (ch == "0" && stream.eat(/o/i)) {
      stream.eatWhile(/[0-7]/i);
      return ret("number", "number");
    } else if (ch == "0" && stream.eat(/b/i)) {
      stream.eatWhile(/[01]/i);
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      if (ch != ">" || !state.lexical || state.lexical.type != ">")
        stream.eatWhile(isOperatorChar);
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    if (isTS) { // Try to skip TypeScript return type declarations after the arguments
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow))
      if (m) arrow = m.index
    }

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) { if (ch == "(") sawSomething = true; break; }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), parenExpr, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "class") return cont(pushlex("form"), className, poplex);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "module") return cont(pushlex("form"), pattern, pushlex("}"), expect("{"), block, poplex, poplex)
    if (type == "type") return cont(typeexpr, expect("operator"), typeexpr, expect(";"));
    if (type == "async") return cont(statement)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function parenExpr(type) {
    if (type != "(") return pass()
    return cont(pushlex(")"), expression, expect(")"), poplex)
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "class") return cont(pushlex("form"), classExpression, poplex);
    if (type == "keyword c" || type == "async") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "async") {
      cx.marked = "property";
      return cont(objprop);
    } else if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (type == "modifier") {
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expression);
    } else if (type == ":") {
      return pass(afterprop)
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(function(type, value) {
          if (type == end || value == end) return pass()
          return pass(what)
        }, proceed);
      }
      if (type == end || value == end) return cont();
      return cont(expect(end));
    }
    return function(type, value) {
      if (type == end || value == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      if (type == ":") return cont(typeexpr);
      if (value == "?") return cont(maybetype);
    }
  }
  function typeexpr(type) {
    if (type == "variable") {cx.marked = "variable-3"; return cont(afterType);}
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    if (type == "{") return cont(pushlex("}"), commasep(typeprop, "}", ",;"), poplex)
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType)
  }
  function maybeReturnType(type) {
    if (type == "=>") return cont(typeexpr)
  }
  function typeprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property"
      return cont(typeprop)
    } else if (value == "?") {
      return cont(typeprop)
    } else if (type == ":") {
      return cont(typeexpr)
    }
  }
  function typearg(type) {
    if (type == "variable") return cont(typearg)
    else if (type == ":") return cont(typeexpr)
  }
  function afterType(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    if (value == "|" || type == ".") return cont(typeexpr)
    if (type == "[") return cont(expect("]"), afterType)
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "modifier") return cont(pattern)
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(pattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    if (type == "}") return pass();
    return cont(expect(":"), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type) {
    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybeinof);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, maybetype, statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    if (type == "variable") return className(type, value);
    return classNameAfter(type, value);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "extends" || value == "implements" || (isTS && type == ","))
      return cont(isTS ? typeexpr : expression, classNameAfter);
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      if ((value == "async" || value == "static" || value == "get" || value == "set" ||
           (isTS && (value == "public" || value == "private" || value == "protected" || value == "readonly" || value == "abstract"))) &&
          cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false)) {
        cx.marked = "keyword";
        return cont(classBody);
      }
      cx.marked = "property";
      return cont(isTS ? classfield : functiondef, classBody);
    }
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == ";") return cont(classBody);
    if (type == "}") return cont();
  }
  function classfield(type, value) {
    if (value == "?") return cont(classfield)
    if (type == ":") return cont(typeexpr, maybeAssign)
    return pass(functiondef)
  }
  function afterExport(type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    if (type == "{") return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
    return pass(statement);
  }
  function exportField(type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(expect("variable")); }
    if (type == "variable") return pass(expressionNoComma, exportField);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    if (type == ",") return cont(importSpec, maybeMoreImports)
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(commasep(expressionNoComma, "]"));
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") &&
             (firstChar == "}" || ((top = state.cc[state.cc.length - 1]) &&
                                   (top == maybeoperatorComma || top == maybeoperatorNoComma) &&
                                   !/^[,\.=+\-*:?[\(]/.test(textAfter))))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,
    skipExpression: function(state) {
      var top = state.cc[state.cc.length - 1]
      if (top == expression || top == expressionNoComma) state.cc.pop()
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../xml/xml"), require("../meta"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../xml/xml", "../meta"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("markdown", function(cmCfg, modeCfg) {

  var htmlMode = CodeMirror.getMode(cmCfg, "text/html");
  var htmlModeMissing = htmlMode.name == "null"

  function getMode(name) {
    if (CodeMirror.findModeByName) {
      var found = CodeMirror.findModeByName(name);
      if (found) name = found.mime || found.mimes[0];
    }
    var mode = CodeMirror.getMode(cmCfg, name);
    return mode.name == "null" ? null : mode;
  }

  // Should characters that affect highlighting be highlighted separate?
  // Does not include characters that will be output (such as `1.` and `-` for lists)
  if (modeCfg.highlightFormatting === undefined)
    modeCfg.highlightFormatting = false;

  // Maximum number of nested blockquotes. Set to 0 for infinite nesting.
  // Excess `>` will emit `error` token.
  if (modeCfg.maxBlockquoteDepth === undefined)
    modeCfg.maxBlockquoteDepth = 0;

  // Should underscores in words open/close em/strong?
  if (modeCfg.underscoresBreakWords === undefined)
    modeCfg.underscoresBreakWords = true;

  // Use `fencedCodeBlocks` to configure fenced code blocks. false to
  // disable, string to specify a precise regexp that the fence should
  // match, and true to allow three or more backticks or tildes (as
  // per CommonMark).

  // Turn on task lists? ("- [ ] " and "- [x] ")
  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

  // Turn on strikethrough syntax
  if (modeCfg.strikethrough === undefined)
    modeCfg.strikethrough = false;

  // Allow token types to be overridden by user-provided token types.
  if (modeCfg.tokenTypeOverrides === undefined)
    modeCfg.tokenTypeOverrides = {};

  var tokenTypes = {
    header: "header",
    code: "comment",
    quote: "quote",
    list1: "variable-2",
    list2: "variable-3",
    list3: "keyword",
    hr: "hr",
    image: "image",
    imageAltText: "image-alt-text",
    imageMarker: "image-marker",
    formatting: "formatting",
    linkInline: "link",
    linkEmail: "link",
    linkText: "link",
    linkHref: "string",
    em: "em",
    strong: "strong",
    strikethrough: "strikethrough"
  };

  for (var tokenType in tokenTypes) {
    if (tokenTypes.hasOwnProperty(tokenType) && modeCfg.tokenTypeOverrides[tokenType]) {
      tokenTypes[tokenType] = modeCfg.tokenTypeOverrides[tokenType];
    }
  }

  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/
  ,   listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/
  ,   taskListRE = /^\[(x| )\](?=\s)/ // Must follow listRE
  ,   atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/
  ,   setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/
  ,   textRE = /^[^#!\[\]*_\\<>` "'(~]+/
  ,   fencedCodeRE = new RegExp("^(" + (modeCfg.fencedCodeBlocks === true ? "~~~+|```+" : modeCfg.fencedCodeBlocks) +
                                ")[ \\t]*([\\w+#\-]*)");

  function switchInline(stream, state, f) {
    state.f = state.inline = f;
    return f(stream, state);
  }

  function switchBlock(stream, state, f) {
    state.f = state.block = f;
    return f(stream, state);
  }

  function lineIsEmpty(line) {
    return !line || !/\S/.test(line.string)
  }

  // Blocks

  function blankLine(state) {
    // Reset linkTitle state
    state.linkTitle = false;
    // Reset EM state
    state.em = false;
    // Reset STRONG state
    state.strong = false;
    // Reset strikethrough state
    state.strikethrough = false;
    // Reset state.quote
    state.quote = 0;
    // Reset state.indentedCode
    state.indentedCode = false;
    if (htmlModeMissing && state.f == htmlBlock) {
      state.f = inlineNormal;
      state.block = blockNormal;
    }
    // Reset state.trailingSpace
    state.trailingSpace = 0;
    state.trailingSpaceNewLine = false;
    // Mark this line as blank
    state.prevLine = state.thisLine
    state.thisLine = null
    return null;
  }

  function blockNormal(stream, state) {

    var sol = stream.sol();

    var prevLineIsList = state.list !== false,
        prevLineIsIndentedCode = state.indentedCode;

    state.indentedCode = false;

    if (prevLineIsList) {
      if (state.indentationDiff >= 0) { // Continued list
        if (state.indentationDiff < 4) { // Only adjust indentation if *not* a code block
          state.indentation -= state.indentationDiff;
        }
        state.list = null;
      } else if (state.indentation > 0) {
        state.list = null;
      } else { // No longer a list
        state.list = false;
      }
    }

    var match = null;
    if (state.indentationDiff >= 4) {
      stream.skipToEnd();
      if (prevLineIsIndentedCode || lineIsEmpty(state.prevLine)) {
        state.indentation -= 4;
        state.indentedCode = true;
        return tokenTypes.code;
      } else {
        return null;
      }
    } else if (stream.eatSpace()) {
      return null;
    } else if ((match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
      state.header = match[1].length;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (!lineIsEmpty(state.prevLine) && !state.quote && !prevLineIsList &&
               !prevLineIsIndentedCode && (match = stream.match(setextHeaderRE))) {
      state.header = match[0].charAt(0) == '=' ? 1 : 2;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (stream.eat('>')) {
      state.quote = sol ? 1 : state.quote + 1;
      if (modeCfg.highlightFormatting) state.formatting = "quote";
      stream.eatSpace();
      return getType(state);
    } else if (stream.peek() === '[') {
      return switchInline(stream, state, footnoteLink);
    } else if (stream.match(hrRE, true)) {
      state.hr = true;
      return tokenTypes.hr;
    } else if (match = stream.match(listRE)) {
      var listType = match[1] ? "ol" : "ul";
      state.indentation = stream.column() + stream.current().length;
      state.list = true;

      // While this list item's marker's indentation
      // is less than the deepest list item's content's indentation,
      // pop the deepest list item indentation off the stack.
      while (state.listStack && stream.column() < state.listStack[state.listStack.length - 1]) {
        state.listStack.pop();
      }

      // Add this list item's content's indentation to the stack
      state.listStack.push(state.indentation);

      if (modeCfg.taskLists && stream.match(taskListRE, false)) {
        state.taskList = true;
      }
      state.f = state.inline;
      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
      return getType(state);
    } else if (modeCfg.fencedCodeBlocks && (match = stream.match(fencedCodeRE, true))) {
      state.fencedChars = match[1]
      // try switching mode
      state.localMode = getMode(match[2]);
      if (state.localMode) state.localState = CodeMirror.startState(state.localMode);
      state.f = state.block = local;
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.code = -1
      return getType(state);
    }

    return switchInline(stream, state, state.inline);
  }

  function htmlBlock(stream, state) {
    var style = htmlMode.token(stream, state.htmlState);
    if (!htmlModeMissing) {
      var inner = CodeMirror.innerMode(htmlMode, state.htmlState)
      if ((inner.mode.name == "xml" && inner.state.tagStart === null &&
           (!inner.state.context && inner.state.tokenize.isInText)) ||
          (state.md_inside && stream.current().indexOf(">") > -1)) {
        state.f = inlineNormal;
        state.block = blockNormal;
        state.htmlState = null;
      }
    }
    return style;
  }

  function local(stream, state) {
    if (state.fencedChars && stream.match(state.fencedChars)) {
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.localMode = state.localState = null;
      state.f = state.block = leavingLocal;
      return getType(state)
    } else if (state.fencedChars && stream.skipTo(state.fencedChars)) {
      return "comment"
    } else if (state.localMode) {
      return state.localMode.token(stream, state.localState);
    } else {
      stream.skipToEnd();
      return tokenTypes.code;
    }
  }

  function leavingLocal(stream, state) {
    stream.match(state.fencedChars);
    state.block = blockNormal;
    state.f = inlineNormal;
    state.fencedChars = null;
    if (modeCfg.highlightFormatting) state.formatting = "code-block";
    state.code = 1
    var returnType = getType(state);
    state.code = 0
    return returnType;
  }

  // Inline
  function getType(state) {
    var styles = [];

    if (state.formatting) {
      styles.push(tokenTypes.formatting);

      if (typeof state.formatting === "string") state.formatting = [state.formatting];

      for (var i = 0; i < state.formatting.length; i++) {
        styles.push(tokenTypes.formatting + "-" + state.formatting[i]);

        if (state.formatting[i] === "header") {
          styles.push(tokenTypes.formatting + "-" + state.formatting[i] + "-" + state.header);
        }

        // Add `formatting-quote` and `formatting-quote-#` for blockquotes
        // Add `error` instead if the maximum blockquote nesting depth is passed
        if (state.formatting[i] === "quote") {
          if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
            styles.push(tokenTypes.formatting + "-" + state.formatting[i] + "-" + state.quote);
          } else {
            styles.push("error");
          }
        }
      }
    }

    if (state.taskOpen) {
      styles.push("meta");
      return styles.length ? styles.join(' ') : null;
    }
    if (state.taskClosed) {
      styles.push("property");
      return styles.length ? styles.join(' ') : null;
    }

    if (state.linkHref) {
      styles.push(tokenTypes.linkHref, "url");
    } else { // Only apply inline styles to non-url text
      if (state.strong) { styles.push(tokenTypes.strong); }
      if (state.em) { styles.push(tokenTypes.em); }
      if (state.strikethrough) { styles.push(tokenTypes.strikethrough); }
      if (state.linkText) { styles.push(tokenTypes.linkText); }
      if (state.code) { styles.push(tokenTypes.code); }
      if (state.image) { styles.push(tokenTypes.image); }
      if (state.imageAltText) { styles.push(tokenTypes.imageAltText, "link"); }
      if (state.imageMarker) { styles.push(tokenTypes.imageMarker); }
    }

    if (state.header) { styles.push(tokenTypes.header, tokenTypes.header + "-" + state.header); }

    if (state.quote) {
      styles.push(tokenTypes.quote);

      // Add `quote-#` where the maximum for `#` is modeCfg.maxBlockquoteDepth
      if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
        styles.push(tokenTypes.quote + "-" + state.quote);
      } else {
        styles.push(tokenTypes.quote + "-" + modeCfg.maxBlockquoteDepth);
      }
    }

    if (state.list !== false) {
      var listMod = (state.listStack.length - 1) % 3;
      if (!listMod) {
        styles.push(tokenTypes.list1);
      } else if (listMod === 1) {
        styles.push(tokenTypes.list2);
      } else {
        styles.push(tokenTypes.list3);
      }
    }

    if (state.trailingSpaceNewLine) {
      styles.push("trailing-space-new-line");
    } else if (state.trailingSpace) {
      styles.push("trailing-space-" + (state.trailingSpace % 2 ? "a" : "b"));
    }

    return styles.length ? styles.join(' ') : null;
  }

  function handleText(stream, state) {
    if (stream.match(textRE, true)) {
      return getType(state);
    }
    return undefined;
  }

  function inlineNormal(stream, state) {
    var style = state.text(stream, state);
    if (typeof style !== 'undefined')
      return style;

    if (state.list) { // List marker (*, +, -, 1., etc)
      state.list = null;
      return getType(state);
    }

    if (state.taskList) {
      var taskOpen = stream.match(taskListRE, true)[1] !== "x";
      if (taskOpen) state.taskOpen = true;
      else state.taskClosed = true;
      if (modeCfg.highlightFormatting) state.formatting = "task";
      state.taskList = false;
      return getType(state);
    }

    state.taskOpen = false;
    state.taskClosed = false;

    if (state.header && stream.match(/^#+$/, true)) {
      if (modeCfg.highlightFormatting) state.formatting = "header";
      return getType(state);
    }

    // Get sol() value now, before character is consumed
    var sol = stream.sol();

    var ch = stream.next();

    // Matches link titles present on next line
    if (state.linkTitle) {
      state.linkTitle = false;
      var matchCh = ch;
      if (ch === '(') {
        matchCh = ')';
      }
      matchCh = (matchCh+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var regex = '^\\s*(?:[^' + matchCh + '\\\\]+|\\\\\\\\|\\\\.)' + matchCh;
      if (stream.match(new RegExp(regex), true)) {
        return tokenTypes.linkHref;
      }
    }

    // If this block is changed, it may need to be updated in GFM mode
    if (ch === '`') {
      var previousFormatting = state.formatting;
      if (modeCfg.highlightFormatting) state.formatting = "code";
      stream.eatWhile('`');
      var count = stream.current().length
      if (state.code == 0) {
        state.code = count
        return getType(state)
      } else if (count == state.code) { // Must be exact
        var t = getType(state)
        state.code = 0
        return t
      } else {
        state.formatting = previousFormatting
        return getType(state)
      }
    } else if (state.code) {
      return getType(state);
    }

    if (ch === '\\') {
      stream.next();
      if (modeCfg.highlightFormatting) {
        var type = getType(state);
        var formattingEscape = tokenTypes.formatting + "-escape";
        return type ? type + " " + formattingEscape : formattingEscape;
      }
    }

    if (ch === '!' && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
      state.imageMarker = true;
      state.image = true;
      if (modeCfg.highlightFormatting) state.formatting = "image";
      return getType(state);
    }

    if (ch === '[' && state.imageMarker && stream.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/, false)) {
      state.imageMarker = false;
      state.imageAltText = true
      if (modeCfg.highlightFormatting) state.formatting = "image";
      return getType(state);
    }

    if (ch === ']' && state.imageAltText) {
      if (modeCfg.highlightFormatting) state.formatting = "image";
      var type = getType(state);
      state.imageAltText = false;
      state.image = false;
      state.inline = state.f = linkHref;
      return type;
    }

    if (ch === '[' && stream.match(/[^\]]*\](\(.*\)| ?\[.*?\])/, false) && !state.image) {
      state.linkText = true;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      return getType(state);
    }

    if (ch === ']' && state.linkText && stream.match(/\(.*?\)| ?\[.*?\]/, false)) {
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      state.linkText = false;
      state.inline = state.f = linkHref;
      return type;
    }

    if (ch === '<' && stream.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + tokenTypes.linkInline;
    }

    if (ch === '<' && stream.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + tokenTypes.linkEmail;
    }

    if (ch === '<' && stream.match(/^(!--|[a-z]+(?:\s+[a-z_:.\-]+(?:\s*=\s*[^ >]+)?)*\s*>)/i, false)) {
      var end = stream.string.indexOf(">", stream.pos);
      if (end != -1) {
        var atts = stream.string.substring(stream.start, end);
        if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
      }
      stream.backUp(1);
      state.htmlState = CodeMirror.startState(htmlMode);
      return switchBlock(stream, state, htmlBlock);
    }

    if (ch === '<' && stream.match(/^\/\w*?>/)) {
      state.md_inside = false;
      return "tag";
    }

    var ignoreUnderscore = false;
    if (!modeCfg.underscoresBreakWords) {
      if (ch === '_' && stream.peek() !== '_' && stream.match(/(\w)/, false)) {
        var prevPos = stream.pos - 2;
        if (prevPos >= 0) {
          var prevCh = stream.string.charAt(prevPos);
          if (prevCh !== '_' && prevCh.match(/(\w)/, false)) {
            ignoreUnderscore = true;
          }
        }
      }
    }
    if (ch === '*' || (ch === '_' && !ignoreUnderscore)) {
      if (sol && stream.peek() === ' ') {
        // Do nothing, surrounded by newline and space
      } else if (state.strong === ch && stream.eat(ch)) { // Remove STRONG
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        var t = getType(state);
        state.strong = false;
        return t;
      } else if (!state.strong && stream.eat(ch)) { // Add STRONG
        state.strong = ch;
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        return getType(state);
      } else if (state.em === ch) { // Remove EM
        if (modeCfg.highlightFormatting) state.formatting = "em";
        var t = getType(state);
        state.em = false;
        return t;
      } else if (!state.em) { // Add EM
        state.em = ch;
        if (modeCfg.highlightFormatting) state.formatting = "em";
        return getType(state);
      }
    } else if (ch === ' ') {
      if (stream.eat('*') || stream.eat('_')) { // Probably surrounded by spaces
        if (stream.peek() === ' ') { // Surrounded by spaces, ignore
          return getType(state);
        } else { // Not surrounded by spaces, back up pointer
          stream.backUp(1);
        }
      }
    }

    if (modeCfg.strikethrough) {
      if (ch === '~' && stream.eatWhile(ch)) {
        if (state.strikethrough) {// Remove strikethrough
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          var t = getType(state);
          state.strikethrough = false;
          return t;
        } else if (stream.match(/^[^\s]/, false)) {// Add strikethrough
          state.strikethrough = true;
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          return getType(state);
        }
      } else if (ch === ' ') {
        if (stream.match(/^~~/, true)) { // Probably surrounded by space
          if (stream.peek() === ' ') { // Surrounded by spaces, ignore
            return getType(state);
          } else { // Not surrounded by spaces, back up pointer
            stream.backUp(2);
          }
        }
      }
    }

    if (ch === ' ') {
      if (stream.match(/ +$/, false)) {
        state.trailingSpace++;
      } else if (state.trailingSpace) {
        state.trailingSpaceNewLine = true;
      }
    }

    return getType(state);
  }

  function linkInline(stream, state) {
    var ch = stream.next();

    if (ch === ">") {
      state.f = state.inline = inlineNormal;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + tokenTypes.linkInline;
    }

    stream.match(/^[^>]+/, true);

    return tokenTypes.linkInline;
  }

  function linkHref(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if(stream.eatSpace()){
      return null;
    }
    var ch = stream.next();
    if (ch === '(' || ch === '[') {
      state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]", 0);
      if (modeCfg.highlightFormatting) state.formatting = "link-string";
      state.linkHref = true;
      return getType(state);
    }
    return 'error';
  }

  var linkRE = {
    ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
    "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\\]]|\\.)*\])*?(?=\])/
  }

  function getLinkHrefInside(endChar) {
    return function(stream, state) {
      var ch = stream.next();

      if (ch === endChar) {
        state.f = state.inline = inlineNormal;
        if (modeCfg.highlightFormatting) state.formatting = "link-string";
        var returnState = getType(state);
        state.linkHref = false;
        return returnState;
      }

      stream.match(linkRE[endChar])
      state.linkHref = true;
      return getType(state);
    };
  }

  function footnoteLink(stream, state) {
    if (stream.match(/^([^\]\\]|\\.)*\]:/, false)) {
      state.f = footnoteLinkInside;
      stream.next(); // Consume [
      if (modeCfg.highlightFormatting) state.formatting = "link";
      state.linkText = true;
      return getType(state);
    }
    return switchInline(stream, state, inlineNormal);
  }

  function footnoteLinkInside(stream, state) {
    if (stream.match(/^\]:/, true)) {
      state.f = state.inline = footnoteUrl;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var returnType = getType(state);
      state.linkText = false;
      return returnType;
    }

    stream.match(/^([^\]\\]|\\.)+/, true);

    return tokenTypes.linkText;
  }

  function footnoteUrl(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if(stream.eatSpace()){
      return null;
    }
    // Match URL
    stream.match(/^[^\s]+/, true);
    // Check for link title
    if (stream.peek() === undefined) { // End of line, set flag to check next line
      state.linkTitle = true;
    } else { // More content on line, check if link title
      stream.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, true);
    }
    state.f = state.inline = inlineNormal;
    return tokenTypes.linkHref + " url";
  }

  var mode = {
    startState: function() {
      return {
        f: blockNormal,

        prevLine: null,
        thisLine: null,

        block: blockNormal,
        htmlState: null,
        indentation: 0,

        inline: inlineNormal,
        text: handleText,

        formatting: false,
        linkText: false,
        linkHref: false,
        linkTitle: false,
        code: 0,
        em: false,
        strong: false,
        header: 0,
        hr: false,
        taskList: false,
        list: false,
        listStack: [],
        quote: 0,
        trailingSpace: 0,
        trailingSpaceNewLine: false,
        strikethrough: false,
        fencedChars: null
      };
    },

    copyState: function(s) {
      return {
        f: s.f,

        prevLine: s.prevLine,
        thisLine: s.thisLine,

        block: s.block,
        htmlState: s.htmlState && CodeMirror.copyState(htmlMode, s.htmlState),
        indentation: s.indentation,

        localMode: s.localMode,
        localState: s.localMode ? CodeMirror.copyState(s.localMode, s.localState) : null,

        inline: s.inline,
        text: s.text,
        formatting: false,
        linkTitle: s.linkTitle,
        code: s.code,
        em: s.em,
        strong: s.strong,
        strikethrough: s.strikethrough,
        header: s.header,
        hr: s.hr,
        taskList: s.taskList,
        list: s.list,
        listStack: s.listStack.slice(0),
        quote: s.quote,
        indentedCode: s.indentedCode,
        trailingSpace: s.trailingSpace,
        trailingSpaceNewLine: s.trailingSpaceNewLine,
        md_inside: s.md_inside,
        fencedChars: s.fencedChars
      };
    },

    token: function(stream, state) {

      // Reset state.formatting
      state.formatting = false;

      if (stream != state.thisLine) {
        var forceBlankLine = state.header || state.hr;

        // Reset state.header and state.hr
        state.header = 0;
        state.hr = false;

        if (stream.match(/^\s*$/, true) || forceBlankLine) {
          blankLine(state);
          if (!forceBlankLine) return null
          state.prevLine = null
        }

        state.prevLine = state.thisLine
        state.thisLine = stream

        // Reset state.taskList
        state.taskList = false;

        // Reset state.trailingSpace
        state.trailingSpace = 0;
        state.trailingSpaceNewLine = false;

        state.f = state.block;
        var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, '    ').length;
        state.indentationDiff = Math.min(indentation - state.indentation, 4);
        state.indentation = state.indentation + state.indentationDiff;
        if (indentation > 0) return null;
      }
      return state.f(stream, state);
    },

    innerMode: function(state) {
      if (state.block == htmlBlock) return {state: state.htmlState, mode: htmlMode};
      if (state.localState) return {state: state.localState, mode: state.localMode};
      return {state: state, mode: mode};
    },

    blankLine: blankLine,

    getType: getType,

    closeBrackets: "()[]{}''\"\"``",
    fold: "markdown"
  };
  return mode;
}, "xml");

CodeMirror.defineMIME("text/x-markdown", "markdown");

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode('shell', function() {

  var words = {};
  function define(style, string) {
    var split = string.split(' ');
    for(var i = 0; i < split.length; i++) {
      words[split[i]] = style;
    }
  };

  // Atoms
  define('atom', 'true false');

  // Keywords
  define('keyword', 'if then do else elif while until for in esac fi fin ' +
    'fil done exit set unset export function');

  // Commands
  define('builtin', 'ab awk bash beep cat cc cd chown chmod chroot clear cp ' +
    'curl cut diff echo find gawk gcc get git grep kill killall ln ls make ' +
    'mkdir openssl mv nc node npm ping ps restart rm rmdir sed service sh ' +
    'shopt shred source sort sleep ssh start stop su sudo tee telnet top ' +
    'touch vi vim wall wc wget who write yes zsh');

  function tokenBase(stream, state) {
    if (stream.eatSpace()) return null;

    var sol = stream.sol();
    var ch = stream.next();

    if (ch === '\\') {
      stream.next();
      return null;
    }
    if (ch === '\'' || ch === '"' || ch === '`') {
      state.tokens.unshift(tokenString(ch, ch === "`" ? "quote" : "string"));
      return tokenize(stream, state);
    }
    if (ch === '#') {
      if (sol && stream.eat('!')) {
        stream.skipToEnd();
        return 'meta'; // 'comment'?
      }
      stream.skipToEnd();
      return 'comment';
    }
    if (ch === '$') {
      state.tokens.unshift(tokenDollar);
      return tokenize(stream, state);
    }
    if (ch === '+' || ch === '=') {
      return 'operator';
    }
    if (ch === '-') {
      stream.eat('-');
      stream.eatWhile(/\w/);
      return 'attribute';
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/\d/);
      if(stream.eol() || !/\w/.test(stream.peek())) {
        return 'number';
      }
    }
    stream.eatWhile(/[\w-]/);
    var cur = stream.current();
    if (stream.peek() === '=' && /\w+/.test(cur)) return 'def';
    return words.hasOwnProperty(cur) ? words[cur] : null;
  }

  function tokenString(quote, style) {
    var close = quote == "(" ? ")" : quote
    return function(stream, state) {
      var next, end = false, escaped = false;
      while ((next = stream.next()) != null) {
        if (next === close && !escaped) {
          end = true;
          break;
        }
        if (next === '$' && !escaped && quote !== "'") {
          escaped = true;
          stream.backUp(1);
          state.tokens.unshift(tokenDollar);
          break;
        }
        if (next === "(" && quote === "(") {
          state.tokens.unshift(tokenString(quote, style))
          return tokenize(stream, state)
        }
        escaped = !escaped && next === '\\';
      }
      if (end || !escaped) state.tokens.shift();
      return style;
    };
  };

  var tokenDollar = function(stream, state) {
    if (state.tokens.length > 1) stream.eat('$');
    var ch = stream.next(), hungry = /\w/;
    if (ch === '{') hungry = /[^}]/;
    if (/['"(]/.test(ch)) {
      state.tokens[0] = tokenString(ch, ch == "(" ? "quote" : "string");
      return tokenize(stream, state);
    }
    if (!/\d/.test(ch)) {
      stream.eatWhile(hungry);
      stream.eat('}');
    }
    state.tokens.shift();
    return 'def';
  };

  function tokenize(stream, state) {
    return (state.tokens[0] || tokenBase) (stream, state);
  };

  return {
    startState: function() {return {tokens:[]};},
    token: function(stream, state) {
      return tokenize(stream, state);
    },
    closeBrackets: "()[]{}''\"\"``",
    lineComment: '#',
    fold: "brace"
  };
});

CodeMirror.defineMIME('text/x-sh', 'shell');

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../css/css"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../css/css"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("sass", function(config) {
  var cssMode = CodeMirror.mimeModes["text/css"];
  var propertyKeywords = cssMode.propertyKeywords || {},
      colorKeywords = cssMode.colorKeywords || {},
      valueKeywords = cssMode.valueKeywords || {},
      fontProperties = cssMode.fontProperties || {};

  function tokenRegexp(words) {
    return new RegExp("^" + words.join("|"));
  }

  var keywords = ["true", "false", "null", "auto"];
  var keywordsRegexp = new RegExp("^" + keywords.join("|"));

  var operators = ["\\(", "\\)", "=", ">", "<", "==", ">=", "<=", "\\+", "-",
                   "\\!=", "/", "\\*", "%", "and", "or", "not", ";","\\{","\\}",":"];
  var opRegexp = tokenRegexp(operators);

  var pseudoElementsRegexp = /^::?[a-zA-Z_][\w\-]*/;

  var word;

  function isEndLine(stream) {
    return !stream.peek() || stream.match(/\s+$/, false);
  }

  function urlTokens(stream, state) {
    var ch = stream.peek();

    if (ch === ")") {
      stream.next();
      state.tokenizer = tokenBase;
      return "operator";
    } else if (ch === "(") {
      stream.next();
      stream.eatSpace();

      return "operator";
    } else if (ch === "'" || ch === '"') {
      state.tokenizer = buildStringTokenizer(stream.next());
      return "string";
    } else {
      state.tokenizer = buildStringTokenizer(")", false);
      return "string";
    }
  }
  function comment(indentation, multiLine) {
    return function(stream, state) {
      if (stream.sol() && stream.indentation() <= indentation) {
        state.tokenizer = tokenBase;
        return tokenBase(stream, state);
      }

      if (multiLine && stream.skipTo("*/")) {
        stream.next();
        stream.next();
        state.tokenizer = tokenBase;
      } else {
        stream.skipToEnd();
      }

      return "comment";
    };
  }

  function buildStringTokenizer(quote, greedy) {
    if (greedy == null) { greedy = true; }

    function stringTokenizer(stream, state) {
      var nextChar = stream.next();
      var peekChar = stream.peek();
      var previousChar = stream.string.charAt(stream.pos-2);

      var endingString = ((nextChar !== "\\" && peekChar === quote) || (nextChar === quote && previousChar !== "\\"));

      if (endingString) {
        if (nextChar !== quote && greedy) { stream.next(); }
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        state.tokenizer = tokenBase;
        return "string";
      } else if (nextChar === "#" && peekChar === "{") {
        state.tokenizer = buildInterpolationTokenizer(stringTokenizer);
        stream.next();
        return "operator";
      } else {
        return "string";
      }
    }

    return stringTokenizer;
  }

  function buildInterpolationTokenizer(currentTokenizer) {
    return function(stream, state) {
      if (stream.peek() === "}") {
        stream.next();
        state.tokenizer = currentTokenizer;
        return "operator";
      } else {
        return tokenBase(stream, state);
      }
    };
  }

  function indent(state) {
    if (state.indentCount == 0) {
      state.indentCount++;
      var lastScopeOffset = state.scopes[0].offset;
      var currentOffset = lastScopeOffset + config.indentUnit;
      state.scopes.unshift({ offset:currentOffset });
    }
  }

  function dedent(state) {
    if (state.scopes.length == 1) return;

    state.scopes.shift();
  }

  function tokenBase(stream, state) {
    var ch = stream.peek();

    // Comment
    if (stream.match("/*")) {
      state.tokenizer = comment(stream.indentation(), true);
      return state.tokenizer(stream, state);
    }
    if (stream.match("//")) {
      state.tokenizer = comment(stream.indentation(), false);
      return state.tokenizer(stream, state);
    }

    // Interpolation
    if (stream.match("#{")) {
      state.tokenizer = buildInterpolationTokenizer(tokenBase);
      return "operator";
    }

    // Strings
    if (ch === '"' || ch === "'") {
      stream.next();
      state.tokenizer = buildStringTokenizer(ch);
      return "string";
    }

    if(!state.cursorHalf){// state.cursorHalf === 0
    // first half i.e. before : for key-value pairs
    // including selectors

      if (ch === "-") {
        if (stream.match(/^-\w+-/)) {
          return "meta";
        }
      }

      if (ch === ".") {
        stream.next();
        if (stream.match(/^[\w-]+/)) {
          indent(state);
          return "qualifier";
        } else if (stream.peek() === "#") {
          indent(state);
          return "tag";
        }
      }

      if (ch === "#") {
        stream.next();
        // ID selectors
        if (stream.match(/^[\w-]+/)) {
          indent(state);
          return "builtin";
        }
        if (stream.peek() === "#") {
          indent(state);
          return "tag";
        }
      }

      // Variables
      if (ch === "$") {
        stream.next();
        stream.eatWhile(/[\w-]/);
        return "variable-2";
      }

      // Numbers
      if (stream.match(/^-?[0-9\.]+/))
        return "number";

      // Units
      if (stream.match(/^(px|em|in)\b/))
        return "unit";

      if (stream.match(keywordsRegexp))
        return "keyword";

      if (stream.match(/^url/) && stream.peek() === "(") {
        state.tokenizer = urlTokens;
        return "atom";
      }

      if (ch === "=") {
        // Match shortcut mixin definition
        if (stream.match(/^=[\w-]+/)) {
          indent(state);
          return "meta";
        }
      }

      if (ch === "+") {
        // Match shortcut mixin definition
        if (stream.match(/^\+[\w-]+/)){
          return "variable-3";
        }
      }

      if(ch === "@"){
        if(stream.match(/@extend/)){
          if(!stream.match(/\s*[\w]/))
            dedent(state);
        }
      }


      // Indent Directives
      if (stream.match(/^@(else if|if|media|else|for|each|while|mixin|function)/)) {
        indent(state);
        return "def";
      }

      // Other Directives
      if (ch === "@") {
        stream.next();
        stream.eatWhile(/[\w-]/);
        return "def";
      }

      if (stream.eatWhile(/[\w-]/)){
        if(stream.match(/ *: *[\w-\+\$#!\("']/,false)){
          word = stream.current().toLowerCase();
          var prop = state.prevProp + "-" + word;
          if (propertyKeywords.hasOwnProperty(prop)) {
            return "property";
          } else if (propertyKeywords.hasOwnProperty(word)) {
            state.prevProp = word;
            return "property";
          } else if (fontProperties.hasOwnProperty(word)) {
            return "property";
          }
          return "tag";
        }
        else if(stream.match(/ *:/,false)){
          indent(state);
          state.cursorHalf = 1;
          state.prevProp = stream.current().toLowerCase();
          return "property";
        }
        else if(stream.match(/ *,/,false)){
          return "tag";
        }
        else{
          indent(state);
          return "tag";
        }
      }

      if(ch === ":"){
        if (stream.match(pseudoElementsRegexp)){ // could be a pseudo-element
          return "variable-3";
        }
        stream.next();
        state.cursorHalf=1;
        return "operator";
      }

    } // cursorHalf===0 ends here
    else{

      if (ch === "#") {
        stream.next();
        // Hex numbers
        if (stream.match(/[0-9a-fA-F]{6}|[0-9a-fA-F]{3}/)){
          if (isEndLine(stream)) {
            state.cursorHalf = 0;
          }
          return "number";
        }
      }

      // Numbers
      if (stream.match(/^-?[0-9\.]+/)){
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        return "number";
      }

      // Units
      if (stream.match(/^(px|em|in)\b/)){
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        return "unit";
      }

      if (stream.match(keywordsRegexp)){
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        return "keyword";
      }

      if (stream.match(/^url/) && stream.peek() === "(") {
        state.tokenizer = urlTokens;
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        return "atom";
      }

      // Variables
      if (ch === "$") {
        stream.next();
        stream.eatWhile(/[\w-]/);
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        return "variable-2";
      }

      // bang character for !important, !default, etc.
      if (ch === "!") {
        stream.next();
        state.cursorHalf = 0;
        return stream.match(/^[\w]+/) ? "keyword": "operator";
      }

      if (stream.match(opRegexp)){
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        return "operator";
      }

      // attributes
      if (stream.eatWhile(/[\w-]/)) {
        if (isEndLine(stream)) {
          state.cursorHalf = 0;
        }
        word = stream.current().toLowerCase();
        if (valueKeywords.hasOwnProperty(word)) {
          return "atom";
        } else if (colorKeywords.hasOwnProperty(word)) {
          return "keyword";
        } else if (propertyKeywords.hasOwnProperty(word)) {
          state.prevProp = stream.current().toLowerCase();
          return "property";
        } else {
          return "tag";
        }
      }

      //stream.eatSpace();
      if (isEndLine(stream)) {
        state.cursorHalf = 0;
        return null;
      }

    } // else ends here

    if (stream.match(opRegexp))
      return "operator";

    // If we haven't returned by now, we move 1 character
    // and return an error
    stream.next();
    return null;
  }

  function tokenLexer(stream, state) {
    if (stream.sol()) state.indentCount = 0;
    var style = state.tokenizer(stream, state);
    var current = stream.current();

    if (current === "@return" || current === "}"){
      dedent(state);
    }

    if (style !== null) {
      var startOfToken = stream.pos - current.length;

      var withCurrentIndent = startOfToken + (config.indentUnit * state.indentCount);

      var newScopes = [];

      for (var i = 0; i < state.scopes.length; i++) {
        var scope = state.scopes[i];

        if (scope.offset <= withCurrentIndent)
          newScopes.push(scope);
      }

      state.scopes = newScopes;
    }


    return style;
  }

  return {
    startState: function() {
      return {
        tokenizer: tokenBase,
        scopes: [{offset: 0, type: "sass"}],
        indentCount: 0,
        cursorHalf: 0,  // cursor half tells us if cursor lies after (1)
                        // or before (0) colon (well... more or less)
        definedVars: [],
        definedMixins: []
      };
    },
    token: function(stream, state) {
      var style = tokenLexer(stream, state);

      state.lastToken = { style: style, content: stream.current() };

      return style;
    },

    indent: function(state) {
      return state.scopes[0].offset;
    }
  };
});

CodeMirror.defineMIME("text/x-sass", "sass");

});

;(function(){
var f,aa=this;
function m(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;var da=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function ea(a,b){return a<b?-1:a>b?1:0};function fa(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b};function ha(a,b){this.H=[];this.za=b;for(var c=!0,d=a.length-1;0<=d;d--){var e=a[d]|0;c&&e==b||(this.H[d]=e,c=!1)}}var ia={};function ja(a){if(-128<=a&&128>a){var b=ia[a];if(b)return b}b=new ha([a|0],0>a?-1:0);-128<=a&&128>a&&(ia[a]=b);return b}function ka(a){if(isNaN(a)||!isFinite(a))return ma;if(0>a)return ka(-a).V();for(var b=[],c=1,d=0;a>=c;d++)b[d]=a/c|0,c*=na;return new ha(b,0)}var na=4294967296,ma=ja(0),oa=ja(1),pa=ja(16777216);f=ha.prototype;
f.Ub=function(){return 0<this.H.length?this.H[0]:this.za};f.La=function(){if(this.fa())return-this.V().La();for(var a=0,b=1,c=0;c<this.H.length;c++){var d=qa(this,c);a+=(0<=d?d:na+d)*b;b*=na}return a};
f.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(this.pa())return"0";if(this.fa())return"-"+this.V().toString(a);for(var b=ka(Math.pow(a,6)),c=this,d="";;){var e=ra(c,b),g=(c.ob(e.multiply(b)).Ub()>>>0).toString(a);c=e;if(c.pa())return g+d;for(;6>g.length;)g="0"+g;d=""+g+d}};function qa(a,b){return 0>b?0:b<a.H.length?a.H[b]:a.za}f.pa=function(){if(0!=this.za)return!1;for(var a=0;a<this.H.length;a++)if(0!=this.H[a])return!1;return!0};f.fa=function(){return-1==this.za};
f.Pb=function(a){return 0<this.compare(a)};f.Qb=function(a){return 0<=this.compare(a)};f.vb=function(){return 0>this.compare(pa)};f.wb=function(a){return 0>=this.compare(a)};f.compare=function(a){a=this.ob(a);return a.fa()?-1:a.pa()?0:1};f.V=function(){return this.Sb().add(oa)};
f.add=function(a){for(var b=Math.max(this.H.length,a.H.length),c=[],d=0,e=0;e<=b;e++){var g=d+(qa(this,e)&65535)+(qa(a,e)&65535),h=(g>>>16)+(qa(this,e)>>>16)+(qa(a,e)>>>16);d=h>>>16;g&=65535;h&=65535;c[e]=h<<16|g}return new ha(c,c[c.length-1]&-2147483648?-1:0)};f.ob=function(a){return this.add(a.V())};
f.multiply=function(a){if(this.pa()||a.pa())return ma;if(this.fa())return a.fa()?this.V().multiply(a.V()):this.V().multiply(a).V();if(a.fa())return this.multiply(a.V()).V();if(this.vb()&&a.vb())return ka(this.La()*a.La());for(var b=this.H.length+a.H.length,c=[],d=0;d<2*b;d++)c[d]=0;for(d=0;d<this.H.length;d++)for(var e=0;e<a.H.length;e++){var g=qa(this,d)>>>16,h=qa(this,d)&65535,k=qa(a,e)>>>16,l=qa(a,e)&65535;c[2*d+2*e]+=h*l;sa(c,2*d+2*e);c[2*d+2*e+1]+=g*l;sa(c,2*d+2*e+1);c[2*d+2*e+1]+=h*k;sa(c,2*
d+2*e+1);c[2*d+2*e+2]+=g*k;sa(c,2*d+2*e+2)}for(d=0;d<b;d++)c[d]=c[2*d+1]<<16|c[2*d];for(d=b;d<2*b;d++)c[d]=0;return new ha(c,0)};function sa(a,b){for(;(a[b]&65535)!=a[b];)a[b+1]+=a[b]>>>16,a[b]&=65535,b++}
function ra(a,b){if(b.pa())throw Error("division by zero");if(a.pa())return ma;if(a.fa())return b.fa()?ra(a.V(),b.V()):ra(a.V(),b).V();if(b.fa())return ra(a,b.V()).V();if(30<a.H.length){if(a.fa()||b.fa())throw Error("slowDivide_ only works with positive integers.");for(var c=oa,d=b;d.wb(a);)c=c.shiftLeft(1),d=d.shiftLeft(1);var e=c.Ea(1),g=d.Ea(1);d=d.Ea(2);for(c=c.Ea(2);!d.pa();){var h=g.add(d);h.wb(a)&&(e=e.add(c),g=h);d=d.Ea(1);c=c.Ea(1)}return e}c=ma;for(d=a;d.Qb(b);){e=Math.max(1,Math.floor(d.La()/
b.La()));g=Math.ceil(Math.log(e)/Math.LN2);g=48>=g?1:Math.pow(2,g-48);h=ka(e);for(var k=h.multiply(b);k.fa()||k.Pb(d);)e-=g,h=ka(e),k=h.multiply(b);h.pa()&&(h=oa);c=c.add(h);d=d.ob(k)}return c}f.Sb=function(){for(var a=this.H.length,b=[],c=0;c<a;c++)b[c]=~this.H[c];return new ha(b,~this.za)};f.shiftLeft=function(a){var b=a>>5;a%=32;for(var c=this.H.length+b+(0<a?1:0),d=[],e=0;e<c;e++)d[e]=0<a?qa(this,e-b)<<a|qa(this,e-b-1)>>>32-a:qa(this,e-b);return new ha(d,this.za)};
f.Ea=function(a){var b=a>>5;a%=32;for(var c=this.H.length-b,d=[],e=0;e<c;e++)d[e]=0<a?qa(this,e+b)>>>a|qa(this,e+b+1)<<32-a:qa(this,e+b);return new ha(d,this.za)};function ta(a,b){null!=a&&this.append.apply(this,arguments)}f=ta.prototype;f.va="";f.set=function(a){this.va=""+a};f.append=function(a,b,c){this.va+=String(a);if(null!=b)for(var d=1;d<arguments.length;d++)this.va+=arguments[d];return this};f.clear=function(){this.va=""};f.toString=function(){return this.va};function va(a,b){var c=wa;Object.prototype.hasOwnProperty.call(c,a)||(c[a]=b(a))};var xa;if("undefined"===typeof q)var q={};if("undefined"===typeof ya)var ya=null;if("undefined"===typeof za)var za=null;var Aa=null;if("undefined"===typeof Ba)var Ba=null;function Ca(){return new Da(null,5,[Ea,!0,Fa,!0,Ga,!1,Ha,!1,Ia,null],null)}function r(a){return null!=a&&!1!==a}function Ja(a){return a instanceof Array}function t(a,b){return a[m(null==b?null:b)]?!0:a._?!0:!1}
function v(a,b){var c=null==b?null:b.constructor;c=r(r(c)?c.ub:c)?c.Ra:m(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ka(a){var b=a.Ra;return r(b)?b:""+w.a(a)}var La="undefined"!==typeof Symbol&&"function"===m(Symbol)?Symbol.iterator:"@@iterator";function Ma(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function Na(){}
var Oa=function Oa(a){if(null!=a&&null!=a.X)return a.X(a);var c=Oa[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Oa._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("ICounted.-count",a);};function Pa(){}var Qa=function Qa(a,b){if(null!=a&&null!=a.M)return a.M(a,b);var d=Qa[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);d=Qa._;if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);throw v("ICollection.-conj",a);};function Ra(){}
var y=function y(a){switch(arguments.length){case 2:return y.b(arguments[0],arguments[1]);case 3:return y.f(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",w.a(arguments.length)].join(""));}};y.b=function(a,b){if(null!=a&&null!=a.I)return a.I(a,b);var c=y[m(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=y._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw v("IIndexed.-nth",a);};
y.f=function(a,b,c){if(null!=a&&null!=a.ha)return a.ha(a,b,c);var d=y[m(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=y._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw v("IIndexed.-nth",a);};y.O=3;
var z=function z(a){if(null!=a&&null!=a.U)return a.U(a);var c=z[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=z._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("ISeq.-first",a);},B=function B(a){if(null!=a&&null!=a.ba)return a.ba(a);var c=B[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=B._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("ISeq.-rest",a);};function Sa(){}function Ta(){}
var Ua=function Ua(a){switch(arguments.length){case 2:return Ua.b(arguments[0],arguments[1]);case 3:return Ua.f(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",w.a(arguments.length)].join(""));}};Ua.b=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=Ua[m(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Ua._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw v("ILookup.-lookup",a);};
Ua.f=function(a,b,c){if(null!=a&&null!=a.B)return a.B(a,b,c);var d=Ua[m(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=Ua._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw v("ILookup.-lookup",a);};Ua.O=3;var Va=function Va(a,b,c){if(null!=a&&null!=a.ra)return a.ra(a,b,c);var e=Va[m(null==a?null:a)];if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);e=Va._;if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);throw v("IAssociative.-assoc",a);};function Wa(){}
function Xa(){}var Ya=function Ya(a){if(null!=a&&null!=a.lb)return a.lb();var c=Ya[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Ya._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IMapEntry.-key",a);},Za=function Za(a){if(null!=a&&null!=a.mb)return a.mb();var c=Za[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Za._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IMapEntry.-val",a);};function $a(){}
var C=function C(a){if(null!=a&&null!=a.Va)return a.Va(a);var c=C[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=C._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IDeref.-deref",a);};function ab(){}
var bb=function bb(a){if(null!=a&&null!=a.J)return a.J(a);var c=bb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=bb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IMeta.-meta",a);},cb=function cb(a,b){if(null!=a&&null!=a.L)return a.L(a,b);var d=cb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);d=cb._;if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);throw v("IWithMeta.-with-meta",a);};function db(){}
var eb=function eb(a){switch(arguments.length){case 2:return eb.b(arguments[0],arguments[1]);case 3:return eb.f(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",w.a(arguments.length)].join(""));}};eb.b=function(a,b){if(null!=a&&null!=a.Y)return a.Y(a,b);var c=eb[m(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=eb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw v("IReduce.-reduce",a);};
eb.f=function(a,b,c){if(null!=a&&null!=a.T)return a.T(a,b,c);var d=eb[m(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=eb._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw v("IReduce.-reduce",a);};eb.O=3;function fb(){}
var gb=function gb(a,b,c){if(null!=a&&null!=a.Na)return a.Na(a,b,c);var e=gb[m(null==a?null:a)];if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);e=gb._;if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);throw v("IKVReduce.-kv-reduce",a);},hb=function hb(a,b){if(null!=a&&null!=a.j)return a.j(a,b);var d=hb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);d=hb._;if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);throw v("IEquiv.-equiv",a);},ib=function ib(a){if(null!=a&&null!=a.F)return a.F(a);
var c=ib[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=ib._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IHash.-hash",a);};function jb(){}var kb=function kb(a){if(null!=a&&null!=a.G)return a.G(a);var c=kb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=kb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("ISeqable.-seq",a);};function lb(){}function mb(){}function nb(){}
var E=function E(a,b){if(null!=a&&null!=a.tb)return a.tb(0,b);var d=E[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);d=E._;if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);throw v("IWriter.-write",a);},ob=function ob(a,b,c){if(null!=a&&null!=a.sb)return a.sb(0,b,c);var e=ob[m(null==a?null:a)];if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);e=ob._;if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);throw v("IWatchable.-notify-watches",a);},pb=function pb(a){if(null!=a&&null!=
a.Fa)return a.Fa(a);var c=pb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=pb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IEditableCollection.-as-transient",a);},qb=function qb(a,b){if(null!=a&&null!=a.Ga)return a.Ga(a,b);var d=qb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);d=qb._;if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);throw v("ITransientCollection.-conj!",a);},rb=function rb(a){if(null!=a&&null!=a.Qa)return a.Qa(a);var c=rb[m(null==a?
null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=rb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("ITransientCollection.-persistent!",a);},sb=function sb(a,b,c){if(null!=a&&null!=a.wa)return a.wa(a,b,c);var e=sb[m(null==a?null:a)];if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);e=sb._;if(null!=e)return e.f?e.f(a,b,c):e.call(null,a,b,c);throw v("ITransientAssociative.-assoc!",a);},tb=function tb(a){if(null!=a&&null!=a.pb)return a.pb();var c=tb[m(null==a?null:a)];if(null!=c)return c.a?
c.a(a):c.call(null,a);c=tb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IChunk.-drop-first",a);},ub=function ub(a){if(null!=a&&null!=a.Ua)return a.Ua(a);var c=ub[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=ub._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IChunkedSeq.-chunked-first",a);},vb=function vb(a){if(null!=a&&null!=a.Ma)return a.Ma(a);var c=vb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=vb._;if(null!=c)return c.a?c.a(a):c.call(null,
a);throw v("IChunkedSeq.-chunked-rest",a);},wb=function wb(a,b){if(null!=a&&null!=a.Gb)return a.Gb(a,b);var d=wb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);d=wb._;if(null!=d)return d.b?d.b(a,b):d.call(null,a,b);throw v("IReset.-reset!",a);},G=function G(a){switch(arguments.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.f(arguments[0],arguments[1],arguments[2]);case 4:return G.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return G.ea(arguments[0],
arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error(["Invalid arity: ",w.a(arguments.length)].join(""));}};G.b=function(a,b){if(null!=a&&null!=a.Ib)return a.Ib(a,b);var c=G[m(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw v("ISwap.-swap!",a);};
G.f=function(a,b,c){if(null!=a&&null!=a.Jb)return a.Jb(a,b,c);var d=G[m(null==a?null:a)];if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.f?d.f(a,b,c):d.call(null,a,b,c);throw v("ISwap.-swap!",a);};G.w=function(a,b,c,d){if(null!=a&&null!=a.Kb)return a.Kb(a,b,c,d);var e=G[m(null==a?null:a)];if(null!=e)return e.w?e.w(a,b,c,d):e.call(null,a,b,c,d);e=G._;if(null!=e)return e.w?e.w(a,b,c,d):e.call(null,a,b,c,d);throw v("ISwap.-swap!",a);};
G.ea=function(a,b,c,d,e){if(null!=a&&null!=a.Lb)return a.Lb(a,b,c,d,e);var g=G[m(null==a?null:a)];if(null!=g)return g.ea?g.ea(a,b,c,d,e):g.call(null,a,b,c,d,e);g=G._;if(null!=g)return g.ea?g.ea(a,b,c,d,e):g.call(null,a,b,c,d,e);throw v("ISwap.-swap!",a);};G.O=5;function xb(){}var yb=function yb(a){if(null!=a&&null!=a.oa)return a.oa(a);var c=yb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=yb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IIterable.-iterator",a);};
function zb(a){this.Tb=a;this.h=1073741824;this.u=0}zb.prototype.tb=function(a,b){return this.Tb.append(b)};function Ab(a){var b=new ta;a.K(null,new zb(b),Ca());return""+w.a(b)}var Bb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Cb(a){a=Bb(a|0,-862048943);return Bb(a<<15|a>>>-15,461845907)}
function Db(a,b){var c=(a|0)^(b|0);return Bb(c<<13|c>>>-13,5)+-430675100|0}function Eb(a,b){var c=(a|0)^b;c=Bb(c^c>>>16,-2048144789);c=Bb(c^c>>>13,-1028477387);return c^c>>>16}function Fb(a){a:{var b=1;for(var c=0;;)if(b<a.length){var d=b+2;c=Db(c,Cb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Cb(a.charCodeAt(a.length-1)):b;return Eb(b,Bb(2,a.length))}var Gb={},Hb=0;
function Ib(a){255<Hb&&(Gb={},Hb=0);if(null==a)return 0;var b=Gb[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b){var e=c+1;d=Bb(31,d)+a.charCodeAt(c);c=e}else{b=d;break a}else b=0;else b=0;Gb[a]=b;Hb+=1}return a=b}
function Jb(a){if(null!=a&&(a.h&4194304||q===a.$b))return a.F(null)^0;if("number"===typeof a){if(r(isFinite(a)))return Math.floor(a)%2147483647;switch(a){case Infinity:return 2146435072;case -Infinity:return-1048576;default:return 2146959360}}else return!0===a?a=1231:!1===a?a=1237:"string"===typeof a?(a=Ib(a),0!==a&&(a=Cb(a),a=Db(0,a),a=Eb(a,4))):a=a instanceof Date?a.valueOf()^0:null==a?0:ib(a)^0,a}function Kb(a,b){return a^b+2654435769+(a<<6)+(a>>2)}
function Lb(a,b,c,d,e){this.Ka=a;this.name=b;this.ua=c;this.Aa=d;this.ca=e;this.h=2154168321;this.u=4096}f=Lb.prototype;f.toString=function(){return this.ua};f.equiv=function(a){return this.j(null,a)};f.j=function(a,b){return b instanceof Lb?this.ua===b.ua:!1};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return H.b(c,this);case 3:return H.f(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return H.b(c,this)};a.f=function(a,c,d){return H.f(c,this,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};f.a=function(a){return H.b(a,this)};f.b=function(a,b){return H.f(a,this,b)};f.J=function(){return this.ca};
f.L=function(a,b){return new Lb(this.Ka,this.name,this.ua,this.Aa,b)};f.F=function(){var a=this.Aa;return null!=a?a:this.Aa=a=Kb(Fb(this.name),Ib(this.Ka))};f.K=function(a,b){return E(b,this.ua)};function J(a){if(null==a)return null;if(null!=a&&(a.h&8388608||q===a.Hb))return a.G(null);if(Ja(a)||"string"===typeof a)return 0===a.length?null:new K(a,0,null);if(t(jb,a))return kb(a);throw Error([w.a(a)," is not ISeqable"].join(""));}
function M(a){if(null==a)return null;if(null!=a&&(a.h&64||q===a.Pa))return a.U(null);a=J(a);return null==a?null:z(a)}function Mb(a){return null!=a?null!=a&&(a.h&64||q===a.Pa)?a.ba(null):(a=J(a))?B(a):Nb:Nb}function N(a){return null==a?null:null!=a&&(a.h&128||q===a.Oa)?a.R(null):J(Mb(a))}
var O=function O(a){switch(arguments.length){case 1:return O.a(arguments[0]);case 2:return O.b(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return O.A(arguments[0],arguments[1],new K(c.slice(2),0,null))}};O.a=function(){return!0};O.b=function(a,b){return null==a?null==b:a===b||hb(a,b)};O.A=function(a,b,c){for(;;)if(O.b(a,b))if(N(c))a=b,b=M(c),c=N(c);else return O.b(b,M(c));else return!1};
O.Z=function(a){var b=M(a),c=N(a);a=M(c);c=N(c);return O.A(b,a,c)};O.O=2;function Ob(a){this.s=a}Ob.prototype.next=function(){if(null!=this.s){var a=M(this.s);this.s=N(this.s);return{value:a,done:!1}}return{value:null,done:!0}};function P(a){return new Ob(J(a))}function Pb(a,b){var c=Cb(a);c=Db(0,c);return Eb(c,b)}function Qb(a){var b=0,c=1;for(a=J(a);;)if(null!=a)b+=1,c=Bb(31,c)+Jb(M(a))|0,a=N(a);else return Pb(c,b)}var Rb=Pb(1,0);
function Sb(a){var b=0,c=0;for(a=J(a);;)if(null!=a)b+=1,c=c+Jb(M(a))|0,a=N(a);else return Pb(c,b)}var Tb=Pb(0,0);Na["null"]=!0;Oa["null"]=function(){return 0};Date.prototype.j=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};hb.number=function(a,b){return a===b};ab["function"]=!0;bb["function"]=function(){return null};ib._=function(a){return a[ba]||(a[ba]=++ca)};function Ub(a){this.ga=a;this.h=32768;this.u=0}Ub.prototype.Va=function(){return this.ga};
function Vb(a){return a instanceof Ub}function Wb(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var g=a[c];e=b.b?b.b(e,g):b.call(null,e,g);if(Vb(e))return C(e);c+=1}else return e}function Xb(a,b,c,d){for(var e=a.length;;)if(d<e){var g=a[d];c=b.b?b.b(c,g):b.call(null,c,g);if(Vb(c))return C(c);d+=1}else return c}function Yb(a){return null!=a?a.h&2||q===a.zb?!0:a.h?!1:t(Na,a):t(Na,a)}function Zb(a){return null!=a?a.h&16||q===a.rb?!0:a.h?!1:t(Ra,a):t(Ra,a)}
function Q(a,b,c){var d=S(a);if(c>=d)return-1;!(0<c)&&0>c&&(c+=d,c=0>c?0:c);for(;;)if(c<d){if(O.b($b(a,c),b))return c;c+=1}else return-1}function T(a,b,c){var d=S(a);if(0===d)return-1;0<c?(--d,c=d<c?d:c):c=0>c?d+c:c;for(;;)if(0<=c){if(O.b($b(a,c),b))return c;--c}else return-1}function ac(a,b){this.c=a;this.i=b}ac.prototype.$=function(){return this.i<this.c.length};ac.prototype.next=function(){var a=this.c[this.i];this.i+=1;return a};
function K(a,b,c){this.c=a;this.i=b;this.m=c;this.h=166592766;this.u=139264}f=K.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.I=function(a,b){var c=b+this.i;if(0<=c&&c<this.c.length)return this.c[c];throw Error("Index out of bounds");};f.ha=function(a,b,c){a=b+this.i;return 0<=a&&a<this.c.length?this.c[a]:c};
f.oa=function(){return new ac(this.c,this.i)};f.J=function(){return this.m};f.R=function(){return this.i+1<this.c.length?new K(this.c,this.i+1,null):null};f.X=function(){var a=this.c.length-this.i;return 0>a?0:a};f.F=function(){return Qb(this)};f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return Xb(this.c,b,this.c[this.i],this.i+1)};f.T=function(a,b,c){return Xb(this.c,b,c,this.i)};f.U=function(){return this.c[this.i]};
f.ba=function(){return this.i+1<this.c.length?new K(this.c,this.i+1,null):Nb};f.G=function(){return this.i<this.c.length?this:null};f.L=function(a,b){return new K(this.c,this.i,b)};f.M=function(a,b){return cc(b,this)};K.prototype[La]=function(){return P(this)};function dc(a){return 0<a.length?new K(a,0,null):null}hb._=function(a,b){return a===b};
var ec=function ec(a){switch(arguments.length){case 0:return ec.C();case 1:return ec.a(arguments[0]);case 2:return ec.b(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ec.A(arguments[0],arguments[1],new K(c.slice(2),0,null))}};ec.C=function(){return fc};ec.a=function(a){return a};ec.b=function(a,b){return null!=a?Qa(a,b):Qa(Nb,b)};ec.A=function(a,b,c){for(;;)if(r(c))a=ec.b(a,b),b=M(c),c=N(c);else return ec.b(a,b)};
ec.Z=function(a){var b=M(a),c=N(a);a=M(c);c=N(c);return ec.A(b,a,c)};ec.O=2;function S(a){if(null!=a)if(null!=a&&(a.h&2||q===a.zb))a=a.X(null);else if(Ja(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.h&8388608||q===a.Hb))a:{a=J(a);for(var b=0;;){if(Yb(a)){a=b+Oa(a);break a}a=N(a);b+=1}}else a=Oa(a);else a=0;return a}
function gc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return J(a)?M(a):c;if(Zb(a))return y.f(a,b,c);if(J(a)){var d=N(a),e=b-1;a=d;b=e}else return c}}
function $b(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.h&16||q===a.rb))return a.I(null,b);if(Ja(a)){if(0<=b&&b<a.length)return a[b];throw Error("Index out of bounds");}if("string"===typeof a){if(0<=b&&b<a.length)return a.charAt(b);throw Error("Index out of bounds");}if(null!=a&&(a.h&64||q===a.Pa)){a:{var c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(J(c)){c=M(c);break a}throw Error("Index out of bounds");
}if(Zb(c)){c=y.b(c,d);break a}if(J(c))c=N(c),--d;else throw Error("Index out of bounds");}}return c}if(t(Ra,a))return y.b(a,b);throw Error(["nth not supported on this type ",w.a(Ka(null==a?null:a.constructor))].join(""));}
function U(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.h&16||q===a.rb))return a.ha(null,b,null);if(Ja(a))return 0<=b&&b<a.length?a[b]:null;if("string"===typeof a)return 0<=b&&b<a.length?a.charAt(b):null;if(null!=a&&(a.h&64||q===a.Pa))return gc(a,b);if(t(Ra,a))return y.f(a,b,null);throw Error(["nth not supported on this type ",w.a(Ka(null==a?null:a.constructor))].join(""));}
var H=function H(a){switch(arguments.length){case 2:return H.b(arguments[0],arguments[1]);case 3:return H.f(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",w.a(arguments.length)].join(""));}};H.b=function(a,b){return null==a?null:null!=a&&(a.h&256||q===a.Cb)?a.N(null,b):Ja(a)?null!=b&&b<a.length?a[b|0]:null:"string"===typeof a?null!=b&&b<a.length?a.charAt(b|0):null:t(Ta,a)?Ua.b(a,b):null};
H.f=function(a,b,c){return null!=a?null!=a&&(a.h&256||q===a.Cb)?a.B(null,b,c):Ja(a)?null!=b&&0<=b&&b<a.length?a[b|0]:c:"string"===typeof a?null!=b&&0<=b&&b<a.length?a.charAt(b|0):c:t(Ta,a)?Ua.f(a,b,c):c:c};H.O=3;var hc=function hc(a){switch(arguments.length){case 3:return hc.f(arguments[0],arguments[1],arguments[2]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return hc.A(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0,null))}};
hc.f=function(a,b,c){if(null!=a)a=Va(a,b,c);else{a=[b,c];b=[];for(c=0;;)if(c<a.length){var d=a[c],e=a[c+1],g=ic(b,d);-1===g?(g=b,g.push(d),g.push(e)):b[g+1]=e;c+=2}else break;a=new Da(null,b.length/2,b,null)}return a};hc.A=function(a,b,c,d){for(;;)if(a=hc.f(a,b,c),r(d))b=M(d),c=M(N(d)),d=N(N(d));else return a};hc.Z=function(a){var b=M(a),c=N(a);a=M(c);var d=N(c);c=M(d);d=N(d);return hc.A(b,a,c,d)};hc.O=3;
function jc(a){var b=null!=a;return(b?null!=a?a.h&131072||q===a.Eb||(a.h?0:t(ab,a)):t(ab,a):b)?bb(a):null}function kc(a){return null!=a?a.h&16777216||q===a.gc?!0:a.h?!1:t(lb,a):t(lb,a)}function lc(a){return null==a?!1:null!=a?a.h&1024||q===a.dc?!0:a.h?!1:t(Wa,a):t(Wa,a)}function mc(a){return null!=a?a.h&67108864||q===a.ec?!0:a.h?!1:t(nb,a):t(nb,a)}function nc(a){return null!=a?a.h&16384||q===a.hc?!0:a.h?!1:t($a,a):t($a,a)}function oc(a){return null!=a?a.u&512||q===a.Xb?!0:!1:!1}
function pc(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var qc={};function rc(a){return null==a?!1:!1===a?!1:!0}function sc(a,b){var c=J(b);return c?tc(a,M(c),N(c)):a.C?a.C():a.call(null)}function uc(a,b,c){for(c=J(c);;)if(c){var d=M(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Vb(b))return C(b);c=N(c)}else return b}function vc(a,b,c){for(a=yb(a);;)if(a.$()){var d=a.next();c=b.b?b.b(c,d):b.call(null,c,d);if(Vb(c))return C(c)}else return c}
function tc(a,b,c){return null!=c&&(c.h&524288||q===c.fc)?c.T(null,a,b):Ja(c)?Wb(c,a,b):"string"===typeof c?Wb(c,a,b):t(db,c)?eb.f(c,a,b):(null!=c?c.u&131072||q===c.ac||(c.u?0:t(xb,c)):t(xb,c))?vc(c,a,b):uc(a,b,c)}function wc(a,b){return null!=b?gb(b,a,!0):!0}function xc(a){return a}function yc(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function zc(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}
var w=function w(a){switch(arguments.length){case 0:return w.C();case 1:return w.a(arguments[0]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return w.A(arguments[0],new K(c.slice(1),0,null))}};w.C=function(){return""};w.a=function(a){return null==a?"":""+a};w.A=function(a,b){for(var c=new ta(""+w.a(a)),d=b;;)if(r(d))c=c.append(""+w.a(M(d))),d=N(d);else return c.toString()};w.Z=function(a){var b=M(a);a=N(a);return w.A(b,a)};w.O=1;
function bc(a,b){if(kc(b))if(Yb(a)&&Yb(b)&&S(a)!==S(b))var c=!1;else a:{c=J(a);for(var d=J(b);;){if(null==c){c=null==d;break a}if(null!=d&&O.b(M(c),M(d)))c=N(c),d=N(d);else{c=!1;break a}}}else c=null;return rc(c)}function Ac(a,b,c,d,e){this.m=a;this.first=b;this.qa=c;this.count=d;this.l=e;this.h=65937646;this.u=8192}f=Ac.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,this.count)}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){return 1===this.count?null:this.qa};f.X=function(){return this.count};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){return bc(this,b)};
f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return this.first};f.ba=function(){return 1===this.count?Nb:this.qa};f.G=function(){return this};f.L=function(a,b){return new Ac(b,this.first,this.qa,this.count,this.l)};f.M=function(a,b){return new Ac(this.m,b,this,this.count+1,null)};Ac.prototype[La]=function(){return P(this)};function Bc(a){this.m=a;this.h=65937614;this.u=8192}f=Bc.prototype;f.toString=function(){return Ab(this)};
f.equiv=function(a){return this.j(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){return null};f.X=function(){return 0};f.F=function(){return Rb};f.j=function(a,b){return(null!=b?b.h&33554432||q===b.cc||(b.h?0:t(mb,b)):t(mb,b))||kc(b)?null==J(b):!1};
f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return null};f.ba=function(){return Nb};f.G=function(){return null};f.L=function(a,b){return new Bc(b)};f.M=function(a,b){return new Ac(this.m,b,null,1,null)};var Nb=new Bc(null);Bc.prototype[La]=function(){return P(this)};function Cc(a,b,c,d){this.m=a;this.first=b;this.qa=c;this.l=d;this.h=65929452;this.u=8192}f=Cc.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){return null==this.qa?null:J(this.qa)};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return sc(b,this)};
f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return this.first};f.ba=function(){return null==this.qa?Nb:this.qa};f.G=function(){return this};f.L=function(a,b){return new Cc(b,this.first,this.qa,this.l)};f.M=function(a,b){return new Cc(null,b,this,null)};Cc.prototype[La]=function(){return P(this)};function cc(a,b){return null==b||null!=b&&(b.h&64||q===b.Pa)?new Cc(null,a,b,null):new Cc(null,a,J(b),null)}
function V(a,b,c,d){this.Ka=a;this.name=b;this.ta=c;this.Aa=d;this.h=2153775105;this.u=4096}f=V.prototype;f.toString=function(){return[":",w.a(this.ta)].join("")};f.equiv=function(a){return this.j(null,a)};f.j=function(a,b){return b instanceof V?this.ta===b.ta:!1};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return H.b(c,this);case 3:return H.f(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return H.b(c,this)};a.f=function(a,c,d){return H.f(c,this,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};f.a=function(a){return H.b(a,this)};f.b=function(a,b){return H.f(a,this,b)};
f.F=function(){var a=this.Aa;return null!=a?a:this.Aa=a=Kb(Fb(this.name),Ib(this.Ka))+2654435769|0};f.K=function(a,b){return E(b,[":",w.a(this.ta)].join(""))};var Dc=function Dc(a){switch(arguments.length){case 1:return Dc.a(arguments[0]);case 2:return Dc.b(arguments[0],arguments[1]);default:throw Error(["Invalid arity: ",w.a(arguments.length)].join(""));}};
Dc.a=function(a){if(a instanceof V)return a;if(a instanceof Lb){if(null!=a&&(a.u&4096||q===a.Fb))var b=a.Ka;else throw Error(["Doesn't support namespace: ",w.a(a)].join(""));return new V(b,Ec(a),a.ua,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new V(b[0],b[1],a,null):new V(null,b[0],a,null)):null};
Dc.b=function(a,b){var c=a instanceof V?Ec(a):a instanceof Lb?Ec(a):a,d=b instanceof V?Ec(b):b instanceof Lb?Ec(b):b;return new V(c,d,[w.a(r(c)?[w.a(c),"/"].join(""):null),w.a(d)].join(""),null)};Dc.O=2;function Fc(a,b,c,d){this.m=a;this.Ca=b;this.s=c;this.l=d;this.h=32374988;this.u=1}f=Fc.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};function Gc(a){null!=a.Ca&&(a.s=a.Ca.C?a.Ca.C():a.Ca.call(null),a.Ca=null);return a.s}
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){this.G(null);return null==this.s?null:N(this.s)};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){return bc(this,b)};
f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){this.G(null);return null==this.s?null:M(this.s)};f.ba=function(){this.G(null);return null!=this.s?Mb(this.s):Nb};f.G=function(){Gc(this);if(null==this.s)return null;for(var a=this.s;;)if(a instanceof Fc)a=Gc(a);else return this.s=a,J(this.s)};f.L=function(a,b){return new Fc(b,this.Ca,this.s,this.l)};f.M=function(a,b){return cc(b,this)};Fc.prototype[La]=function(){return P(this)};
function Hc(a,b){this.Ta=a;this.end=b;this.h=2;this.u=0}Hc.prototype.add=function(a){this.Ta[this.end]=a;return this.end+=1};Hc.prototype.na=function(){var a=new Ic(this.Ta,0,this.end);this.Ta=null;return a};Hc.prototype.X=function(){return this.end};function Ic(a,b,c){this.c=a;this.off=b;this.end=c;this.h=524306;this.u=0}f=Ic.prototype;f.X=function(){return this.end-this.off};f.I=function(a,b){return this.c[this.off+b]};f.ha=function(a,b,c){return 0<=b&&b<this.end-this.off?this.c[this.off+b]:c};
f.pb=function(){if(this.off===this.end)throw Error("-drop-first of empty chunk");return new Ic(this.c,this.off+1,this.end)};f.Y=function(a,b){return Xb(this.c,b,this.c[this.off],this.off+1)};f.T=function(a,b,c){return Xb(this.c,b,c,this.off)};function Jc(a,b,c,d){this.na=a;this.ma=b;this.m=c;this.l=d;this.h=31850732;this.u=1536}f=Jc.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){if(1<Oa(this.na))return new Jc(tb(this.na),this.ma,this.m,null);var a=kb(this.ma);return null==a?null:a};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};
f.j=function(a,b){return bc(this,b)};f.U=function(){return y.b(this.na,0)};f.ba=function(){return 1<Oa(this.na)?new Jc(tb(this.na),this.ma,this.m,null):null==this.ma?Nb:this.ma};f.G=function(){return this};f.Ua=function(){return this.na};f.Ma=function(){return null==this.ma?Nb:this.ma};f.L=function(a,b){return new Jc(this.na,this.ma,b,this.l)};f.M=function(a,b){return cc(b,this)};f.qb=function(){return null==this.ma?null:this.ma};Jc.prototype[La]=function(){return P(this)};
function Kc(a,b){return 0===Oa(a)?b:new Jc(a,b,null,null)}function Lc(a,b){a.add(b)}function Mc(a,b){if(Yb(b))return S(b);for(var c=0,d=J(b);;)if(null!=d&&c<a)c+=1,d=N(d);else return c}var Nc=function Nc(a){switch(arguments.length){case 0:return Nc.C();case 1:return Nc.a(arguments[0]);case 2:return Nc.b(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Nc.A(arguments[0],arguments[1],new K(c.slice(2),0,null))}};Nc.C=function(){return pb(fc)};
Nc.a=function(a){return a};Nc.b=function(a,b){return qb(a,b)};Nc.A=function(a,b,c){for(;;)if(a=qb(a,b),r(c))b=M(c),c=N(c);else return a};Nc.Z=function(a){var b=M(a),c=N(a);a=M(c);c=N(c);return Nc.A(b,a,c)};Nc.O=2;
function Oc(a,b,c){var d=J(c);if(0===b)return a.C?a.C():a.call(null);c=z(d);var e=B(d);if(1===b)return a.a?a.a(c):a.call(null,c);d=z(e);var g=B(e);if(2===b)return a.b?a.b(c,d):a.call(null,c,d);e=z(g);var h=B(g);if(3===b)return a.f?a.f(c,d,e):a.call(null,c,d,e);g=z(h);var k=B(h);if(4===b)return a.w?a.w(c,d,e,g):a.call(null,c,d,e,g);h=z(k);var l=B(k);if(5===b)return a.ea?a.ea(c,d,e,g,h):a.call(null,c,d,e,g,h);k=z(l);var n=B(l);if(6===b)return a.hb?a.hb(c,d,e,g,h,k):a.call(null,c,d,e,g,h,k);l=z(n);var p=
B(n);if(7===b)return a.ib?a.ib(c,d,e,g,h,k,l):a.call(null,c,d,e,g,h,k,l);n=z(p);var u=B(p);if(8===b)return a.jb?a.jb(c,d,e,g,h,k,l,n):a.call(null,c,d,e,g,h,k,l,n);p=z(u);var x=B(u);if(9===b)return a.kb?a.kb(c,d,e,g,h,k,l,n,p):a.call(null,c,d,e,g,h,k,l,n,p);u=z(x);var A=B(x);if(10===b)return a.Wa?a.Wa(c,d,e,g,h,k,l,n,p,u):a.call(null,c,d,e,g,h,k,l,n,p,u);x=z(A);var D=B(A);if(11===b)return a.Xa?a.Xa(c,d,e,g,h,k,l,n,p,u,x):a.call(null,c,d,e,g,h,k,l,n,p,u,x);A=z(D);var F=B(D);if(12===b)return a.Ya?a.Ya(c,
d,e,g,h,k,l,n,p,u,x,A):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A);D=z(F);var I=B(F);if(13===b)return a.Za?a.Za(c,d,e,g,h,k,l,n,p,u,x,A,D):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D);F=z(I);var L=B(I);if(14===b)return a.$a?a.$a(c,d,e,g,h,k,l,n,p,u,x,A,D,F):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D,F);I=z(L);var R=B(L);if(15===b)return a.ab?a.ab(c,d,e,g,h,k,l,n,p,u,x,A,D,F,I):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D,F,I);L=z(R);var Z=B(R);if(16===b)return a.bb?a.bb(c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L):a.call(null,c,d,e,
g,h,k,l,n,p,u,x,A,D,F,I,L);R=z(Z);var la=B(Z);if(17===b)return a.cb?a.cb(c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R);Z=z(la);var ua=B(la);if(18===b)return a.eb?a.eb(c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R,Z):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R,Z);la=z(ua);ua=B(ua);if(19===b)return a.fb?a.fb(c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R,Z,la):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R,Z,la);var Hd=z(ua);B(ua);if(20===b)return a.gb?a.gb(c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,
L,R,Z,la,Hd):a.call(null,c,d,e,g,h,k,l,n,p,u,x,A,D,F,I,L,R,Z,la,Hd);throw Error("Only up to 20 arguments supported on functions");}function Pc(a,b,c){if(null==c)a=a.a?a.a(b):a.call(a,b);else{var d=z(c);c=N(c);a=null==c?a.b?a.b(b,d):a.call(a,b,d):Qc(a,b,d,z(c),N(c))}return a}function Qc(a,b,c,d,e){return null==e?a.f?a.f(b,c,d):a.call(a,b,c,d):Rc(a,b,c,d,z(e),N(e))}
function Rc(a,b,c,d,e,g){if(null==g)return a.w?a.w(b,c,d,e):a.call(a,b,c,d,e);var h=z(g),k=N(g);if(null==k)return a.ea?a.ea(b,c,d,e,h):a.call(a,b,c,d,e,h);g=z(k);var l=N(k);if(null==l)return a.hb?a.hb(b,c,d,e,h,g):a.call(a,b,c,d,e,h,g);k=z(l);var n=N(l);if(null==n)return a.ib?a.ib(b,c,d,e,h,g,k):a.call(a,b,c,d,e,h,g,k);l=z(n);var p=N(n);if(null==p)return a.jb?a.jb(b,c,d,e,h,g,k,l):a.call(a,b,c,d,e,h,g,k,l);n=z(p);var u=N(p);if(null==u)return a.kb?a.kb(b,c,d,e,h,g,k,l,n):a.call(a,b,c,d,e,h,g,k,l,n);
p=z(u);var x=N(u);if(null==x)return a.Wa?a.Wa(b,c,d,e,h,g,k,l,n,p):a.call(a,b,c,d,e,h,g,k,l,n,p);u=z(x);var A=N(x);if(null==A)return a.Xa?a.Xa(b,c,d,e,h,g,k,l,n,p,u):a.call(a,b,c,d,e,h,g,k,l,n,p,u);x=z(A);var D=N(A);if(null==D)return a.Ya?a.Ya(b,c,d,e,h,g,k,l,n,p,u,x):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x);A=z(D);var F=N(D);if(null==F)return a.Za?a.Za(b,c,d,e,h,g,k,l,n,p,u,x,A):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x,A);D=z(F);var I=N(F);if(null==I)return a.$a?a.$a(b,c,d,e,h,g,k,l,n,p,u,x,A,D):a.call(a,b,c,d,
e,h,g,k,l,n,p,u,x,A,D);F=z(I);var L=N(I);if(null==L)return a.ab?a.ab(b,c,d,e,h,g,k,l,n,p,u,x,A,D,F):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x,A,D,F);I=z(L);var R=N(L);if(null==R)return a.bb?a.bb(b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I);L=z(R);var Z=N(R);if(null==Z)return a.cb?a.cb(b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L);R=z(Z);var la=N(Z);if(null==la)return a.eb?a.eb(b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L,R):a.call(a,b,c,d,e,h,g,k,l,n,p,u,
x,A,D,F,I,L,R);Z=z(la);var ua=N(la);if(null==ua)return a.fb?a.fb(b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L,R,Z):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L,R,Z);la=z(ua);ua=N(ua);if(null==ua)return a.gb?a.gb(b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L,R,Z,la):a.call(a,b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L,R,Z,la);b=[b,c,d,e,h,g,k,l,n,p,u,x,A,D,F,I,L,R,Z,la];for(c=ua;;)if(c)b.push(z(c)),c=N(c);else break;return a.apply(a,b)}
function Sc(){"undefined"===typeof xa&&(xa=function(a){this.Rb=a;this.h=393216;this.u=0},xa.prototype.L=function(a,b){return new xa(b)},xa.prototype.J=function(){return this.Rb},xa.prototype.$=function(){return!1},xa.prototype.next=function(){return Error("No such element")},xa.prototype.remove=function(){return Error("Unsupported operation")},xa.ic=function(){return new W(null,1,5,Tc,[Uc],null)},xa.ub=!0,xa.Ra="cljs.core/t_cljs$core12531",xa.Nb=function(a){return E(a,"cljs.core/t_cljs$core12531")});
return new xa(Vc)}function Wc(a,b){for(;;){if(null==J(b))return!0;var c=M(b);c=a.a?a.a(c):a.call(null,c);if(r(c)){c=a;var d=N(b);a=c;b=d}else return!1}}function Xc(a,b,c,d){this.state=a;this.m=b;this.Wb=c;this.yb=d;this.u=16386;this.h=6455296}f=Xc.prototype;f.equiv=function(a){return this.j(null,a)};f.j=function(a,b){return this===b};f.Va=function(){return this.state};f.J=function(){return this.m};
f.sb=function(a,b,c){a=J(this.yb);for(var d=null,e=0,g=0;;)if(g<e){var h=d.I(null,g),k=U(h,0);h=U(h,1);h.w?h.w(k,this,b,c):h.call(null,k,this,b,c);g+=1}else if(a=J(a))oc(a)?(d=ub(a),a=vb(a),k=d,e=S(d),d=k):(d=M(a),k=U(d,0),h=U(d,1),h.w?h.w(k,this,b,c):h.call(null,k,this,b,c),a=N(a),d=null,e=0),g=0;else return null};f.F=function(){return this[ba]||(this[ba]=++ca)};
function Yc(a,b){if(a instanceof Xc){var c=a.Wb;if(null!=c&&!r(c.a?c.a(b):c.call(null,b)))throw Error("Validator rejected reference state");c=a.state;a.state=b;null!=a.yb&&ob(a,c,b);return b}return wb(a,b)}
var Zc=function Zc(a){switch(arguments.length){case 2:return Zc.b(arguments[0],arguments[1]);case 3:return Zc.f(arguments[0],arguments[1],arguments[2]);case 4:return Zc.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Zc.A(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0,null))}};
Zc.b=function(a,b){if(a instanceof Xc){var c=a.state;c=b.a?b.a(c):b.call(null,c);c=Yc(a,c)}else c=G.b(a,b);return c};Zc.f=function(a,b,c){if(a instanceof Xc){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=Yc(a,b)}else a=G.f(a,b,c);return a};Zc.w=function(a,b,c,d){if(a instanceof Xc){var e=a.state;b=b.f?b.f(e,c,d):b.call(null,e,c,d);a=Yc(a,b)}else a=G.w(a,b,c,d);return a};
Zc.A=function(a,b,c,d,e){if(a instanceof Xc){var g=a.state;b.Z?(c=cc(g,cc(c,cc(d,e))),d=b.O,e=3+Mc(d-2,e),b=e<=d?Oc(b,e,c):b.Z(c)):b=Qc(b,g,c,d,J(e));a=Yc(a,b)}else a=G.ea(a,b,c,d,e);return a};Zc.Z=function(a){var b=M(a),c=N(a);a=M(c);var d=N(c);c=M(d);var e=N(d);d=M(e);e=N(e);return Zc.A(b,a,c,d,e)};Zc.O=4;
var X=function X(a){switch(arguments.length){case 1:return X.a(arguments[0]);case 2:return X.b(arguments[0],arguments[1]);case 3:return X.f(arguments[0],arguments[1],arguments[2]);case 4:return X.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return X.A(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0,null))}};
X.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.C?b.C():b.call(null)}var g=null,h=function(){function c(a,b,c){var e=null;if(2<arguments.length){e=0;for(var g=Array(arguments.length-2);e<g.length;)g[e]=arguments[e+2],++e;e=new K(g,0,null)}return d.call(this,a,b,e)}function d(c,d,e){if(a.Z){d=cc(d,e);var g=a.O;e=Mc(g,e)+1;e=e<=g?Oc(a,e,d):a.Z(d)}else e=
Pc(a,d,J(e));return b.b?b.b(c,e):b.call(null,c,e)}c.O=2;c.Z=function(a){var b=M(a);a=N(a);var c=M(a);a=Mb(a);return d(b,c,a)};c.A=d;return c}();g=function(a,b,g){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var k=null;if(2<arguments.length){k=0;for(var l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new K(l,0,null)}return h.A(a,b,k)}throw Error("Invalid arity: "+(arguments.length-1));};g.O=2;g.Z=h.Z;g.C=e;
g.a=d;g.b=c;g.A=h.A;return g}()}};X.b=function(a,b){return new Fc(null,function(){var c=J(b);if(c){if(oc(c)){for(var d=ub(c),e=S(d),g=new Hc(Array(e),0),h=0;;)if(h<e)Lc(g,function(){var b=y.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Kc(g.na(),X.b(a,vb(c)))}return cc(function(){var b=M(c);return a.a?a.a(b):a.call(null,b)}(),X.b(a,Mb(c)))}return null},null,null)};
X.f=function(a,b,c){return new Fc(null,function(){var d=J(b),e=J(c);if(d&&e){var g=cc;var h=M(d);var k=M(e);h=a.b?a.b(h,k):a.call(null,h,k);d=g(h,X.f(a,Mb(d),Mb(e)))}else d=null;return d},null,null)};X.w=function(a,b,c,d){return new Fc(null,function(){var e=J(b),g=J(c),h=J(d);if(e&&g&&h){var k=cc;var l=M(e);var n=M(g),p=M(h);l=a.f?a.f(l,n,p):a.call(null,l,n,p);e=k(l,X.w(a,Mb(e),Mb(g),Mb(h)))}else e=null;return e},null,null)};
X.A=function(a,b,c,d,e){var g=function l(a){return new Fc(null,function(){var b=X.b(J,a);return Wc(xc,b)?cc(X.b(M,b),l(X.b(Mb,b))):null},null,null)};return X.b(function(){return function(b){if(a.Z){var c=a.O,d=Mc(c+1,b);b=d<=c?Oc(a,d,b):a.Z(b)}else b=J(b),b=null==b?a.C?a.C():a.call(a):Pc(a,z(b),N(b));return b}}(g),g(ec.A(e,d,dc([c,b]))))};X.Z=function(a){var b=M(a),c=N(a);a=M(c);var d=N(c);c=M(d);var e=N(d);d=M(e);e=N(e);return X.A(b,a,c,d,e)};X.O=4;function $c(a,b){this.v=a;this.c=b}
function ad(a){return new $c(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function bd(a){a=a.g;return 32>a?0:a-1>>>5<<5}function cd(a,b,c){for(;;){if(0===b)return c;var d=ad(a);d.c[0]=c;c=d;b-=5}}var dd=function dd(a,b,c,d){var g=new $c(c.v,Ma(c.c)),h=a.g-1>>>b&31;5===b?g.c[h]=d:(c=c.c[h],null!=c?(b-=5,a=dd.w?dd.w(a,b,c,d):dd.call(null,a,b,c,d)):a=cd(null,b-5,d),g.c[h]=a);return g};
function ed(a,b){throw Error(["No item ",w.a(a)," in vector of length ",w.a(b)].join(""));}function fd(a,b){if(b>=bd(a))return a.W;for(var c=a.root,d=a.shift;;)if(0<d){var e=d-5;c=c.c[b>>>d&31];d=e}else return c.c}var gd=function gd(a,b,c,d,e){var h=new $c(c.v,Ma(c.c));if(0===b)h.c[d&31]=e;else{var k=d>>>b&31;b-=5;c=c.c[k];a=gd.ea?gd.ea(a,b,c,d,e):gd.call(null,a,b,c,d,e);h.c[k]=a}return h};function hd(a,b,c,d,e,g){this.i=a;this.Sa=b;this.c=c;this.Vb=d;this.start=e;this.end=g}
hd.prototype.$=function(){return this.i<this.end};hd.prototype.next=function(){32===this.i-this.Sa&&(this.c=fd(this.Vb,this.i),this.Sa+=32);var a=this.c[this.i&31];this.i+=1;return a};function id(a,b,c,d){return c<d?jd(a,b,$b(a,c),c+1,d):b.C?b.C():b.call(null)}function jd(a,b,c,d,e){var g=c;c=d;for(d=fd(a,d);;)if(c<e){var h=c&31;d=0===h?fd(a,c):d;h=d[h];g=b.b?b.b(g,h):b.call(null,g,h);if(Vb(g))return C(g);c+=1}else return g}
function W(a,b,c,d,e,g){this.m=a;this.g=b;this.shift=c;this.root=d;this.W=e;this.l=g;this.h=167668511;this.u=139268}f=W.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.N=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return"number"===typeof b?this.ha(null,b,c):c};
f.Na=function(a,b,c){a=0;for(var d=c;;)if(a<this.g){var e=fd(this,a);c=e.length;a:for(var g=0;;)if(g<c){var h=g+a,k=e[g];d=b.f?b.f(d,h,k):b.call(null,d,h,k);if(Vb(d)){e=d;break a}g+=1}else{e=d;break a}if(Vb(e))return C(e);a+=c;d=e}else return d};f.I=function(a,b){return(0<=b&&b<this.g?fd(this,b):ed(b,this.g))[b&31]};f.ha=function(a,b,c){return 0<=b&&b<this.g?fd(this,b)[b&31]:c};
f.Mb=function(a,b){if(0<=a&&a<this.g){if(bd(this)<=a){var c=Ma(this.W);c[a&31]=b;return new W(this.m,this.g,this.shift,this.root,c,null)}return new W(this.m,this.g,this.shift,gd(this,this.shift,this.root,a,b),this.W,null)}if(a===this.g)return this.M(null,b);throw Error(["Index ",w.a(a)," out of bounds  [0,",w.a(this.g),"]"].join(""));};f.oa=function(){var a=this.g;return new hd(0,0,0<S(this)?fd(this,0):null,this,0,a)};f.J=function(){return this.m};f.X=function(){return this.g};
f.lb=function(){return this.I(null,0)};f.mb=function(){return this.I(null,1)};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){if(b instanceof W)if(this.g===S(b))for(var c=this.oa(null),d=yb(b);;)if(c.$()){var e=c.next(),g=d.next();if(!O.b(e,g))return!1}else return!0;else return!1;else return bc(this,b)};
f.Fa=function(){var a=this.g,b=this.shift,c=new $c({},Ma(this.root.c)),d=this.W,e=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];pc(d,0,e,0,d.length);return new kd(a,b,c,e)};f.Y=function(a,b){return id(this,b,0,this.g)};
f.T=function(a,b,c){a=0;for(var d=c;;)if(a<this.g){var e=fd(this,a);c=e.length;a:for(var g=0;;)if(g<c){var h=e[g];d=b.b?b.b(d,h):b.call(null,d,h);if(Vb(d)){e=d;break a}g+=1}else{e=d;break a}if(Vb(e))return C(e);a+=c;d=e}else return d};f.ra=function(a,b,c){if("number"===typeof b)return this.Mb(b,c);throw Error("Vector's key for assoc must be a number.");};
f.G=function(){if(0===this.g)var a=null;else if(32>=this.g)a=new K(this.W,0,null);else{a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.c[0];else{a=a.c;break a}}a=new ld(this,a,0,0,null,null)}return a};f.L=function(a,b){return new W(b,this.g,this.shift,this.root,this.W,this.l)};
f.M=function(a,b){if(32>this.g-bd(this)){for(var c=this.W.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.W[e],e+=1;else break;d[c]=b;return new W(this.m,this.g+1,this.shift,this.root,d,null)}c=(d=this.g>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=ad(null),d.c[0]=this.root,e=cd(null,this.shift,new $c(null,this.W)),d.c[1]=e):d=dd(this,this.shift,this.root,new $c(null,this.W));return new W(this.m,this.g+1,c,d,[b],null)};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.I(null,c);case 3:return this.ha(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.I(null,c)};a.f=function(a,c,d){return this.ha(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};f.a=function(a){return this.I(null,a)};f.b=function(a,b){return this.ha(null,a,b)};
var Tc=new $c(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),fc=new W(null,0,5,Tc,[],Rb);W.prototype[La]=function(){return P(this)};function ld(a,b,c,d,e,g){this.da=a;this.node=b;this.i=c;this.off=d;this.m=e;this.l=g;this.h=32375020;this.u=1536}f=ld.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){if(this.off+1<this.node.length){var a=new ld(this.da,this.node,this.i,this.off+1,null,null);return null==a?null:a}return this.qb(null)};
f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return id(this.da,b,this.i+this.off,S(this.da))};f.T=function(a,b,c){return jd(this.da,b,c,this.i+this.off,S(this.da))};f.U=function(){return this.node[this.off]};f.ba=function(){if(this.off+1<this.node.length){var a=new ld(this.da,this.node,this.i,this.off+1,null,null);return null==a?Nb:a}return this.Ma(null)};f.G=function(){return this};
f.Ua=function(){var a=this.node;return new Ic(a,this.off,a.length)};f.Ma=function(){var a=this.i+this.node.length;return a<Oa(this.da)?new ld(this.da,fd(this.da,a),a,0,null,null):Nb};f.L=function(a,b){return new ld(this.da,this.node,this.i,this.off,b,null)};f.M=function(a,b){return cc(b,this)};f.qb=function(){var a=this.i+this.node.length;return a<Oa(this.da)?new ld(this.da,fd(this.da,a),a,0,null,null):null};ld.prototype[La]=function(){return P(this)};
function md(a,b){return a===b.v?b:new $c(a,Ma(b.c))}var nd=function nd(a,b,c,d){c=md(a.root.v,c);var g=a.g-1>>>b&31;if(5===b)a=d;else{var h=c.c[g];null!=h?(b-=5,a=nd.w?nd.w(a,b,h,d):nd.call(null,a,b,h,d)):a=cd(a.root.v,b-5,d)}c.c[g]=a;return c};function kd(a,b,c,d){this.g=a;this.shift=b;this.root=c;this.W=d;this.u=88;this.h=275}f=kd.prototype;
f.Ga=function(a,b){if(this.root.v){if(32>this.g-bd(this))this.W[this.g&31]=b;else{var c=new $c(this.root.v,this.W),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.W=d;if(this.g>>>5>1<<this.shift){d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];var e=this.shift+
5;d[0]=this.root;d[1]=cd(this.root.v,this.shift,c);this.root=new $c(this.root.v,d);this.shift=e}else this.root=nd(this,this.shift,this.root,c)}this.g+=1;return this}throw Error("conj! after persistent!");};f.Qa=function(){if(this.root.v){this.root.v=null;var a=this.g-bd(this),b=Array(a);pc(this.W,0,b,0,a);return new W(null,this.g,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
f.wa=function(a,b,c){if("number"===typeof b)return od(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
function od(a,b,c){if(a.root.v){if(0<=b&&b<a.g){if(bd(a)<=b)a.W[b&31]=c;else{var d=function(){return function(){return function k(d,h){var g=md(a.root.v,h);if(0===d)g.c[b&31]=c;else{var n=b>>>d&31,p=k(d-5,g.c[n]);g.c[n]=p}return g}}(a)(a.shift,a.root)}();a.root=d}return a}if(b===a.g)return a.Ga(null,c);throw Error(["Index ",w.a(b)," out of bounds for TransientVector of length",w.a(a.g)].join(""));}throw Error("assoc! after persistent!");}
f.X=function(){if(this.root.v)return this.g;throw Error("count after persistent!");};f.I=function(a,b){if(this.root.v)return(0<=b&&b<this.g?fd(this,b):ed(b,this.g))[b&31];throw Error("nth after persistent!");};f.ha=function(a,b,c){return 0<=b&&b<this.g?this.I(null,b):c};f.N=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return"number"===typeof b?this.ha(null,b,c):c};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.B(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.N(null,c)};a.f=function(a,c,d){return this.B(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};f.a=function(a){return this.N(null,a)};f.b=function(a,b){return this.B(null,a,b)};function pd(){this.h=2097152;this.u=0}
pd.prototype.equiv=function(a){return this.j(null,a)};pd.prototype.j=function(){return!1};var qd=new pd;function rd(a,b){return rc(lc(b)&&!mc(b)?S(a)===S(b)?(null!=a?a.h&1048576||q===a.bc||(a.h?0:t(fb,a)):t(fb,a))?wc(function(a,d,e){return O.b(H.f(b,d,qd),e)?!0:new Ub(!1)},a):Wc(function(a){return O.b(H.f(b,M(a),qd),M(N(a)))},a):null:null)}function sd(a){this.s=a}
sd.prototype.next=function(){if(null!=this.s){var a=M(this.s),b=U(a,0);a=U(a,1);this.s=N(this.s);return{value:[b,a],done:!1}}return{value:null,done:!0}};
function ic(a,b){if(b instanceof V)a:{var c=a.length;for(var d=b.ta,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof V&&d===a[e].ta){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof Lb)a:for(c=a.length,d=b.ua,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof Lb&&d===a[e].ua){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(O.b(b,a[d])){c=d;break a}d+=2}return c}function td(a,b,c){this.c=a;this.i=b;this.ca=c;this.h=32374990;this.u=0}f=td.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.ca};f.R=function(){return this.i<this.c.length-2?new td(this.c,this.i+2,this.ca):null};f.X=function(){return(this.c.length-this.i)/2};f.F=function(){return Qb(this)};
f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return new W(null,2,5,Tc,[this.c[this.i],this.c[this.i+1]],null)};f.ba=function(){return this.i<this.c.length-2?new td(this.c,this.i+2,this.ca):Nb};f.G=function(){return this};f.L=function(a,b){return new td(this.c,this.i,b)};f.M=function(a,b){return cc(b,this)};td.prototype[La]=function(){return P(this)};function ud(a,b,c){this.c=a;this.i=b;this.g=c}
ud.prototype.$=function(){return this.i<this.g};ud.prototype.next=function(){var a=new W(null,2,5,Tc,[this.c[this.i],this.c[this.i+1]],null);this.i+=2;return a};function Da(a,b,c,d){this.m=a;this.g=b;this.c=c;this.l=d;this.h=16647951;this.u=139268}f=Da.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};f.keys=function(){return P(vd(this))};f.entries=function(){return new sd(J(J(this)))};f.values=function(){return P(wd(this))};
f.has=function(a){return H.f(this,a,qc)===qc?!1:!0};f.get=function(a,b){return this.B(null,a,b)};f.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var g=c.I(null,e),h=U(g,0);g=U(g,1);a.b?a.b(g,h):a.call(null,g,h);e+=1}else if(b=J(b))oc(b)?(c=ub(b),b=vb(b),h=c,d=S(c),c=h):(c=M(b),h=U(c,0),g=U(c,1),a.b?a.b(g,h):a.call(null,g,h),b=N(b),c=null,d=0),e=0;else return null};f.N=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){a=ic(this.c,b);return-1===a?c:this.c[a+1]};
f.Na=function(a,b,c){a=this.c.length;for(var d=0;;)if(d<a){var e=this.c[d],g=this.c[d+1];c=b.f?b.f(c,e,g):b.call(null,c,e,g);if(Vb(c))return C(c);d+=2}else return c};f.oa=function(){return new ud(this.c,0,2*this.g)};f.J=function(){return this.m};f.X=function(){return this.g};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Sb(this)};
f.j=function(a,b){if(lc(b)&&!mc(b)){var c=this.c.length;if(this.g===b.X(null))for(var d=0;;)if(d<c){var e=b.B(null,this.c[d],qc);if(e!==qc)if(O.b(this.c[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return!1};f.Fa=function(){return new xd({},this.c.length,Ma(this.c))};f.Y=function(a,b){a:{var c=yb(this);if(r(c.$()))for(var d=c.next();;)if(c.$()){var e=c.next();d=b.b?b.b(d,e):b.call(null,d,e);if(Vb(d)){c=C(d);break a}}else{c=d;break a}else c=b.C?b.C():b.call(null)}return c};
f.T=function(a,b,c){return vc(this,b,c)};f.ra=function(a,b,c){a=ic(this.c,b);if(-1===a){if(this.g<yd){a=this.c;for(var d=a.length,e=Array(d+2),g=0;;)if(g<d)e[g]=a[g],g+=1;else break;e[d]=b;e[d+1]=c;return new Da(this.m,this.g+1,e,null)}a=zd;a=null!=a?null!=a&&(a.u&4||q===a.Zb)?cb(rb(tc(qb,pb(a),this)),jc(a)):tc(Qa,a,this):tc(ec,Nb,this);return cb(Va(a,b,c),this.m)}if(c===this.c[a+1])return this;b=Ma(this.c);b[a+1]=c;return new Da(this.m,this.g,b,null)};
f.G=function(){var a=this.c;return 0<=a.length-2?new td(a,0,null):null};f.L=function(a,b){return new Da(b,this.g,this.c,this.l)};f.M=function(a,b){if(nc(b))return this.ra(null,y.b(b,0),y.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=M(d);if(nc(e))c=c.ra(null,y.b(e,0),y.b(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.B(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.N(null,c)};a.f=function(a,c,d){return this.B(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};f.a=function(a){return this.N(null,a)};f.b=function(a,b){return this.B(null,a,b)};var Vc=new Da(null,0,[],Tb),yd=8;Da.prototype[La]=function(){return P(this)};
function xd(a,b,c){this.Ba=a;this.Da=b;this.c=c;this.h=258;this.u=56}f=xd.prototype;f.X=function(){if(r(this.Ba))return yc(this.Da);throw Error("count after persistent!");};f.N=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){if(r(this.Ba))return a=ic(this.c,b),-1===a?c:this.c[a+1];throw Error("lookup after persistent!");};
f.Ga=function(a,b){if(r(this.Ba)){if(null!=b?b.h&2048||q===b.Db||(b.h?0:t(Xa,b)):t(Xa,b))return this.wa(null,Ya(b),Za(b));for(var c=J(b),d=this;;){var e=M(c);if(r(e))c=N(c),d=d.wa(null,Ya(e),Za(e));else return d}}else throw Error("conj! after persistent!");};f.Qa=function(){if(r(this.Ba))return this.Ba=!1,new Da(null,yc(this.Da),this.c,null);throw Error("persistent! called twice");};
f.wa=function(a,b,c){if(r(this.Ba)){a=ic(this.c,b);if(-1===a){if(this.Da+2<=2*yd)return this.Da+=2,this.c.push(b),this.c.push(c),this;a:{a=this.Da;var d=this.c;var e=pb(zd);for(var g=0;;)if(g<a)e=sb(e,d[g],d[g+1]),g+=2;else break a}return sb(e,b,c)}c!==this.c[a+1]&&(this.c[a+1]=c);return this}throw Error("assoc! after persistent!");};function Ad(){this.ga=!1}function Bd(a,b){return a===b?!0:a===b||a instanceof V&&b instanceof V&&a.ta===b.ta?!0:O.b(a,b)}function Cd(a,b,c){a=Ma(a);a[b]=c;return a}
function Dd(a,b,c,d){a=a.xa(b);a.c[c]=d;return a}function Ed(a,b,c){for(var d=a.length,e=0,g=c;;)if(e<d){c=a[e];if(null!=c){var h=a[e+1];c=b.f?b.f(g,c,h):b.call(null,g,c,h)}else c=a[e+1],c=null!=c?c.Ia(b,g):g;if(Vb(c))return c;e+=2;g=c}else return g}function Fd(a,b,c,d){this.c=a;this.i=b;this.Ja=c;this.ka=d}
Fd.prototype.advance=function(){for(var a=this.c.length;;)if(this.i<a){var b=this.c[this.i],c=this.c[this.i+1];null!=b?b=this.Ja=new W(null,2,5,Tc,[b,c],null):null!=c?(b=yb(c),b=b.$()?this.ka=b:!1):b=!1;this.i+=2;if(b)return!0}else return!1};Fd.prototype.$=function(){var a=null!=this.Ja;return a?a:(a=null!=this.ka)?a:this.advance()};
Fd.prototype.next=function(){if(null!=this.Ja){var a=this.Ja;this.Ja=null;return a}if(null!=this.ka)return a=this.ka.next(),this.ka.$()||(this.ka=null),a;if(this.advance())return this.next();throw Error("No such element");};Fd.prototype.remove=function(){return Error("Unsupported operation")};function Gd(a,b,c){this.v=a;this.D=b;this.c=c;this.u=131072;this.h=0}f=Gd.prototype;
f.xa=function(a){if(a===this.v)return this;var b=zc(this.D),c=Array(0>b?4:2*(b+1));pc(this.c,0,c,0,2*b);return new Gd(a,this.D,c)};f.Ha=function(){return Id(this.c,0,null)};f.Ia=function(a,b){return Ed(this.c,a,b)};f.ya=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.D&e))return d;var g=zc(this.D&e-1);e=this.c[2*g];g=this.c[2*g+1];return null==e?g.ya(a+5,b,c,d):Bd(c,e)?g:d};
f.ja=function(a,b,c,d,e,g){var h=1<<(c>>>b&31),k=zc(this.D&h-1);if(0===(this.D&h)){var l=zc(this.D);if(2*l<this.c.length){a=this.xa(a);b=a.c;g.ga=!0;a:for(c=2*(l-k),g=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[g];--l;--c;--g}b[2*k]=d;b[2*k+1]=e;a.D|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Jd.ja(a,b+5,c,d,e,g);for(e=d=0;;)if(32>d)0!==
(this.D>>>d&1)&&(k[d]=null!=this.c[e]?Jd.ja(a,b+5,Jb(this.c[e]),this.c[e],this.c[e+1],g):this.c[e+1],e+=2),d+=1;else break;return new Kd(a,l+1,k)}b=Array(2*(l+4));pc(this.c,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;pc(this.c,2*k,b,2*(k+1),2*(l-k));g.ga=!0;a=this.xa(a);a.c=b;a.D|=h;return a}l=this.c[2*k];h=this.c[2*k+1];if(null==l)return l=h.ja(a,b+5,c,d,e,g),l===h?this:Dd(this,a,2*k+1,l);if(Bd(d,l))return e===h?this:Dd(this,a,2*k+1,e);g.ga=!0;g=b+5;b=Jb(l);if(b===c)e=new Ld(null,b,2,[l,h,d,e]);else{var n=new Ad;
e=Jd.ja(a,g,b,l,h,n).ja(a,g,c,d,e,n)}d=2*k;k=2*k+1;a=this.xa(a);a.c[d]=null;a.c[k]=e;return a};
f.ia=function(a,b,c,d,e){var g=1<<(b>>>a&31),h=zc(this.D&g-1);if(0===(this.D&g)){var k=zc(this.D);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Jd.ia(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.D>>>c&1)&&(h[c]=null!=this.c[d]?Jd.ia(a+5,Jb(this.c[d]),this.c[d],this.c[d+1],e):this.c[d+1],d+=2),c+=1;else break;return new Kd(null,k+1,h)}a=Array(2*(k+1));pc(this.c,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;pc(this.c,2*h,a,2*(h+1),2*(k-h));e.ga=!0;return new Gd(null,this.D|g,a)}var l=this.c[2*h];g=this.c[2*h+1];if(null==l)return k=g.ia(a+5,b,c,d,e),k===g?this:new Gd(null,this.D,Cd(this.c,2*h+1,k));if(Bd(c,l))return d===g?this:new Gd(null,this.D,Cd(this.c,2*h+1,d));e.ga=!0;e=this.D;k=this.c;a+=5;var n=Jb(l);if(n===b)c=new Ld(null,n,2,[l,g,c,d]);else{var p=new Ad;c=Jd.ia(a,n,l,g,p).ia(a,b,c,d,p)}a=2*h;h=2*h+1;d=Ma(k);d[a]=null;d[h]=c;return new Gd(null,e,d)};
f.oa=function(){return new Fd(this.c,0,null,null)};var Jd=new Gd(null,0,[]);function Md(a,b,c){this.c=a;this.i=b;this.ka=c}Md.prototype.$=function(){for(var a=this.c.length;;){if(null!=this.ka&&this.ka.$())return!0;if(this.i<a){var b=this.c[this.i];this.i+=1;null!=b&&(this.ka=yb(b))}else return!1}};Md.prototype.next=function(){if(this.$())return this.ka.next();throw Error("No such element");};Md.prototype.remove=function(){return Error("Unsupported operation")};
function Kd(a,b,c){this.v=a;this.g=b;this.c=c;this.u=131072;this.h=0}f=Kd.prototype;f.xa=function(a){return a===this.v?this:new Kd(a,this.g,Ma(this.c))};f.Ha=function(){return Nd(this.c,0,null)};f.Ia=function(a,b){for(var c=this.c.length,d=0,e=b;;)if(d<c){var g=this.c[d];if(null!=g&&(e=g.Ia(a,e),Vb(e)))return e;d+=1}else return e};f.ya=function(a,b,c,d){var e=this.c[b>>>a&31];return null!=e?e.ya(a+5,b,c,d):d};
f.ja=function(a,b,c,d,e,g){var h=c>>>b&31,k=this.c[h];if(null==k)return a=Dd(this,a,h,Jd.ja(a,b+5,c,d,e,g)),a.g+=1,a;b=k.ja(a,b+5,c,d,e,g);return b===k?this:Dd(this,a,h,b)};f.ia=function(a,b,c,d,e){var g=b>>>a&31,h=this.c[g];if(null==h)return new Kd(null,this.g+1,Cd(this.c,g,Jd.ia(a+5,b,c,d,e)));a=h.ia(a+5,b,c,d,e);return a===h?this:new Kd(null,this.g,Cd(this.c,g,a))};f.oa=function(){return new Md(this.c,0,null)};
function Od(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Bd(c,a[d]))return d;d+=2}else return-1}function Ld(a,b,c,d){this.v=a;this.sa=b;this.g=c;this.c=d;this.u=131072;this.h=0}f=Ld.prototype;f.xa=function(a){if(a===this.v)return this;var b=Array(2*(this.g+1));pc(this.c,0,b,0,2*this.g);return new Ld(a,this.sa,this.g,b)};f.Ha=function(){return Id(this.c,0,null)};f.Ia=function(a,b){return Ed(this.c,a,b)};f.ya=function(a,b,c,d){a=Od(this.c,this.g,c);return 0>a?d:Bd(c,this.c[a])?this.c[a+1]:d};
f.ja=function(a,b,c,d,e,g){if(c===this.sa){b=Od(this.c,this.g,d);if(-1===b){if(this.c.length>2*this.g)return b=2*this.g,c=2*this.g+1,a=this.xa(a),a.c[b]=d,a.c[c]=e,g.ga=!0,a.g+=1,a;c=this.c.length;b=Array(c+2);pc(this.c,0,b,0,c);b[c]=d;b[c+1]=e;g.ga=!0;d=this.g+1;a===this.v?(this.c=b,this.g=d,a=this):a=new Ld(this.v,this.sa,d,b);return a}return this.c[b+1]===e?this:Dd(this,a,b+1,e)}return(new Gd(a,1<<(this.sa>>>b&31),[null,this,null,null])).ja(a,b,c,d,e,g)};
f.ia=function(a,b,c,d,e){return b===this.sa?(a=Od(this.c,this.g,c),-1===a?(a=2*this.g,b=Array(a+2),pc(this.c,0,b,0,a),b[a]=c,b[a+1]=d,e.ga=!0,new Ld(null,this.sa,this.g+1,b)):O.b(this.c[a+1],d)?this:new Ld(null,this.sa,this.g,Cd(this.c,a+1,d))):(new Gd(null,1<<(this.sa>>>a&31),[null,this])).ia(a,b,c,d,e)};f.oa=function(){return new Fd(this.c,0,null,null)};function Pd(a,b,c,d,e){this.m=a;this.la=b;this.i=c;this.s=d;this.l=e;this.h=32374988;this.u=0}f=Pd.prototype;f.toString=function(){return Ab(this)};
f.equiv=function(a){return this.j(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){return null==this.s?Id(this.la,this.i+2,null):Id(this.la,this.i,N(this.s))};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){return bc(this,b)};
f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return null==this.s?new W(null,2,5,Tc,[this.la[this.i],this.la[this.i+1]],null):M(this.s)};f.ba=function(){var a=null==this.s?Id(this.la,this.i+2,null):Id(this.la,this.i,N(this.s));return null!=a?a:Nb};f.G=function(){return this};f.L=function(a,b){return new Pd(b,this.la,this.i,this.s,this.l)};f.M=function(a,b){return cc(b,this)};Pd.prototype[La]=function(){return P(this)};
function Id(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Pd(null,a,b,null,null);var d=a[b+1];if(r(d)&&(d=d.Ha(),r(d)))return new Pd(null,a,b+2,d,null);b+=2}else return null;else return new Pd(null,a,b,c,null)}function Qd(a,b,c,d,e){this.m=a;this.la=b;this.i=c;this.s=d;this.l=e;this.h=32374988;this.u=0}f=Qd.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.m};f.R=function(){return Nd(this.la,this.i,N(this.s))};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Qb(this)};f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return sc(b,this)};
f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return M(this.s)};f.ba=function(){var a=Nd(this.la,this.i,N(this.s));return null!=a?a:Nb};f.G=function(){return this};f.L=function(a,b){return new Qd(b,this.la,this.i,this.s,this.l)};f.M=function(a,b){return cc(b,this)};Qd.prototype[La]=function(){return P(this)};
function Nd(a,b,c){if(null==c)for(c=a.length;;)if(b<c){var d=a[b];if(r(d)&&(d=d.Ha(),r(d)))return new Qd(null,a,b+1,d,null);b+=1}else return null;else return new Qd(null,a,b,c,null)}function Rd(a,b,c){this.P=a;this.xb=b;this.nb=c}Rd.prototype.$=function(){return!this.nb||this.xb.$()};Rd.prototype.next=function(){if(this.nb)return this.xb.next();this.nb=!0;return new W(null,2,5,Tc,[null,this.P],null)};Rd.prototype.remove=function(){return Error("Unsupported operation")};
function Sd(a,b,c,d,e,g){this.m=a;this.g=b;this.root=c;this.aa=d;this.P=e;this.l=g;this.h=16123663;this.u=139268}f=Sd.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};f.keys=function(){return P(vd(this))};f.entries=function(){return new sd(J(J(this)))};f.values=function(){return P(wd(this))};f.has=function(a){return H.f(this,a,qc)===qc?!1:!0};f.get=function(a,b){return this.B(null,a,b)};
f.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var g=c.I(null,e),h=U(g,0);g=U(g,1);a.b?a.b(g,h):a.call(null,g,h);e+=1}else if(b=J(b))oc(b)?(c=ub(b),b=vb(b),h=c,d=S(c),c=h):(c=M(b),h=U(c,0),g=U(c,1),a.b?a.b(g,h):a.call(null,g,h),b=N(b),c=null,d=0),e=0;else return null};f.N=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return null==b?this.aa?this.P:c:null==this.root?c:this.root.ya(0,Jb(b),b,c)};
f.Na=function(a,b,c){a=this.aa?b.f?b.f(c,null,this.P):b.call(null,c,null,this.P):c;Vb(a)?b=C(a):null!=this.root?(b=this.root.Ia(b,a),b=Vb(b)?C(b):b):b=a;return b};f.oa=function(){var a=this.root?yb(this.root):Sc();return this.aa?new Rd(this.P,a,!1):a};f.J=function(){return this.m};f.X=function(){return this.g};f.F=function(){var a=this.l;return null!=a?a:this.l=a=Sb(this)};f.j=function(a,b){return rd(this,b)};f.Fa=function(){return new Td({},this.root,this.g,this.aa,this.P)};
f.ra=function(a,b,c){if(null==b)return this.aa&&c===this.P?this:new Sd(this.m,this.aa?this.g:this.g+1,this.root,!0,c,null);a=new Ad;b=(null==this.root?Jd:this.root).ia(0,Jb(b),b,c,a);return b===this.root?this:new Sd(this.m,a.ga?this.g+1:this.g,b,this.aa,this.P,null)};f.G=function(){if(0<this.g){var a=null!=this.root?this.root.Ha():null;return this.aa?cc(new W(null,2,5,Tc,[null,this.P],null),a):a}return null};f.L=function(a,b){return new Sd(b,this.g,this.root,this.aa,this.P,this.l)};
f.M=function(a,b){if(nc(b))return this.ra(null,y.b(b,0),y.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=M(d);if(nc(e))c=c.ra(null,y.b(e,0),y.b(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.B(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.N(null,c)};a.f=function(a,c,d){return this.B(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};f.a=function(a){return this.N(null,a)};f.b=function(a,b){return this.B(null,a,b)};var zd=new Sd(null,0,null,!1,null,Tb);
function Ud(){for(var a="js md xml css sass markdown sh html sql".split(" "),b="javascript markdown xml css sass markdown shell xml sql".split(" "),c=a.length,d=0,e=pb(zd);;)if(d<c){var g=d+1;e=e.wa(null,a[d],b[d]);d=g}else return rb(e)}Sd.prototype[La]=function(){return P(this)};function Td(a,b,c,d,e){this.v=a;this.root=b;this.count=c;this.aa=d;this.P=e;this.h=258;this.u=56}
function Vd(a,b,c){if(a.v){if(null==b)a.P!==c&&(a.P=c),a.aa||(a.count+=1,a.aa=!0);else{var d=new Ad;b=(null==a.root?Jd:a.root).ja(a.v,0,Jb(b),b,c,d);b!==a.root&&(a.root=b);d.ga&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}f=Td.prototype;f.X=function(){if(this.v)return this.count;throw Error("count after persistent!");};f.N=function(a,b){return null==b?this.aa?this.P:null:null==this.root?null:this.root.ya(0,Jb(b),b)};
f.B=function(a,b,c){return null==b?this.aa?this.P:c:null==this.root?c:this.root.ya(0,Jb(b),b,c)};f.Ga=function(a,b){a:if(this.v)if(null!=b?b.h&2048||q===b.Db||(b.h?0:t(Xa,b)):t(Xa,b))var c=Vd(this,Ya(b),Za(b));else{c=J(b);for(var d=this;;){var e=M(c);if(r(e))c=N(c),d=Vd(d,Ya(e),Za(e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};
f.Qa=function(){if(this.v){this.v=null;var a=new Sd(null,this.count,this.root,this.aa,this.P,null)}else throw Error("persistent! called twice");return a};f.wa=function(a,b,c){return Vd(this,b,c)};function Wd(a,b){this.o=a;this.ca=b;this.h=32374988;this.u=0}f=Wd.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.ca};f.R=function(){var a=(null!=this.o?this.o.h&128||q===this.o.Oa||(this.o.h?0:t(Sa,this.o)):t(Sa,this.o))?this.o.R(null):N(this.o);return null==a?null:new Wd(a,this.ca)};f.F=function(){return Qb(this)};
f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return this.o.U(null).lb()};f.ba=function(){var a=(null!=this.o?this.o.h&128||q===this.o.Oa||(this.o.h?0:t(Sa,this.o)):t(Sa,this.o))?this.o.R(null):N(this.o);return null!=a?new Wd(a,this.ca):Nb};f.G=function(){return this};f.L=function(a,b){return new Wd(this.o,b)};f.M=function(a,b){return cc(b,this)};Wd.prototype[La]=function(){return P(this)};
function vd(a){return(a=J(a))?new Wd(a,null):null}function Xd(a,b){this.o=a;this.ca=b;this.h=32374988;this.u=0}f=Xd.prototype;f.toString=function(){return Ab(this)};f.equiv=function(a){return this.j(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return Q(this,a,0);case 2:return Q(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return Q(this,a,0)};a.b=function(a,c){return Q(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return T(this,a,S(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return T(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return T(this,a,b)};return b}();f.J=function(){return this.ca};f.R=function(){var a=(null!=this.o?this.o.h&128||q===this.o.Oa||(this.o.h?0:t(Sa,this.o)):t(Sa,this.o))?this.o.R(null):N(this.o);return null==a?null:new Xd(a,this.ca)};f.F=function(){return Qb(this)};
f.j=function(a,b){return bc(this,b)};f.Y=function(a,b){return sc(b,this)};f.T=function(a,b,c){return uc(b,c,this)};f.U=function(){return this.o.U(null).mb()};f.ba=function(){var a=(null!=this.o?this.o.h&128||q===this.o.Oa||(this.o.h?0:t(Sa,this.o)):t(Sa,this.o))?this.o.R(null):N(this.o);return null!=a?new Xd(a,this.ca):Nb};f.G=function(){return this};f.L=function(a,b){return new Xd(this.o,b)};f.M=function(a,b){return cc(b,this)};Xd.prototype[La]=function(){return P(this)};
function wd(a){return(a=J(a))?new Xd(a,null):null}function Ec(a){if(null!=a&&(a.u&4096||q===a.Fb))return a.name;if("string"===typeof a)return a;throw Error(["Doesn't support name: ",w.a(a)].join(""));}
function Yd(a,b,c,d,e,g,h){var k=Aa;Aa=null==Aa?null:Aa-1;try{if(null!=Aa&&0>Aa)return E(a,"#");E(a,c);if(0===Ia.a(g))J(h)&&E(a,function(){var a=Zd.a(g);return r(a)?a:"..."}());else{if(J(h)){var l=M(h);b.f?b.f(l,a,g):b.call(null,l,a,g)}for(var n=N(h),p=Ia.a(g)-1;;)if(!n||null!=p&&0===p){J(n)&&0===p&&(E(a,d),E(a,function(){var a=Zd.a(g);return r(a)?a:"..."}()));break}else{E(a,d);var u=M(n);c=a;h=g;b.f?b.f(u,c,h):b.call(null,u,c,h);var x=N(n);c=p-1;n=x;p=c}}return E(a,e)}finally{Aa=k}}
function $d(a,b){for(var c=J(b),d=null,e=0,g=0;;)if(g<e){var h=d.I(null,g);E(a,h);g+=1}else if(c=J(c))d=c,oc(d)?(c=ub(d),e=vb(d),d=c,h=S(c),c=e,e=h):(h=M(d),E(a,h),c=N(d),d=null,e=0),g=0;else return null}var ae={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function be(a){return[w.a('"'),w.a(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return ae[a]})),w.a('"')].join("")}
function ce(a,b){var c=rc(H.b(a,Ga));return c?(c=null!=b?b.h&131072||q===b.Eb?!0:!1:!1)?null!=jc(b):c:c}
function de(a,b,c){if(null==a)return E(b,"nil");ce(c,a)&&(E(b,"^"),ee(jc(a),b,c),E(b," "));if(a.ub)return a.Nb(b);if(null!=a&&(a.h&2147483648||q===a.S))return a.K(null,b,c);if(!0===a||!1===a)return E(b,""+w.a(a));if("number"===typeof a)return E(b,isNaN(a)?"##NaN":a===Number.POSITIVE_INFINITY?"##Inf":a===Number.NEGATIVE_INFINITY?"##-Inf":""+w.a(a));if(null!=a&&a.constructor===Object)return E(b,"#js "),fe(X.b(function(b){var c=Tc;var d=/[A-Za-z_\*\+\?!\-'][\w\*\+\?!\-']*/;if("string"===typeof b)if(d=
d.exec(b),O.b(M(d),b))if(1===S(d))d=M(d);else if(Ja(d))b:{var e=d.length;if(32>e)d=new W(null,e,5,Tc,d,null);else for(var l=32,n=(new W(null,32,5,Tc,d.slice(0,32),null)).Fa(null);;)if(l<e){var p=l+1;n=Nc.b(n,d[l]);l=p}else{d=rb(n);break b}}else d=rb(tc(qb,pb(fc),d));else d=null;else throw new TypeError("re-matches must match against a string.");return new W(null,2,5,c,[null!=d?Dc.a(b):b,a[b]],null)},fa(a)),b,c);if(Ja(a))return Yd(b,ee,"#js ["," ","]",c,a);if("string"==typeof a)return r(Fa.a(c))?E(b,
be(a)):E(b,a);if("function"==m(a)){var d=a.name;c=r(function(){var a=null==d;return a?a:/^[\s\xa0]*$/.test(d)}())?"Function":d;return $d(b,dc(["#object[",c,"","]"]))}if(a instanceof Date)return c=function(a,b){for(var c=""+w.a(a);;)if(S(c)<b)c=["0",w.a(c)].join("");else return c},$d(b,dc(['#inst "',""+w.a(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"']));
if(a instanceof RegExp)return $d(b,dc(['#"',a.source,'"']));if(r(function(){var b=null==a?null:a.constructor;return null==b?null:b.Ra}()))return $d(b,dc(["#object[",a.constructor.Ra.replace(RegExp("/","g"),"."),"]"]));d=function(){var b=null==a?null:a.constructor;return null==b?null:b.name}();c=r(function(){var a=null==d;return a?a:/^[\s\xa0]*$/.test(d)}())?"Object":d;return null==a.constructor?$d(b,dc(["#object[",c,"]"])):$d(b,dc(["#object[",c," ",""+w.a(a),"]"]))}
function ee(a,b,c){var d=ge.a(c);return r(d)?(c=hc.f(c,he,de),d.f?d.f(a,b,c):d.call(null,a,b,c)):de(a,b,c)}function ie(a,b){var c=new ta;a:{var d=new zb(c);ee(M(a),d,b);for(var e=J(N(a)),g=null,h=0,k=0;;)if(k<h){var l=g.I(null,k);E(d," ");ee(l,d,b);k+=1}else if(e=J(e))g=e,oc(g)?(e=ub(g),h=vb(g),g=e,l=S(e),e=h,h=l):(l=M(g),E(d," "),ee(l,d,b),e=N(g),g=null,h=0),k=0;else break a}return c}
function je(a,b,c,d,e){return Yd(d,function(a,b,d){var e=Ya(a);c.f?c.f(e,b,d):c.call(null,e,b,d);E(b," ");a=Za(a);return c.f?c.f(a,b,d):c.call(null,a,b,d)},[w.a(a),"{"].join(""),", ","}",e,J(b))}function fe(a,b,c){var d=ee,e=(lc(a),null),g=U(e,0);e=U(e,1);return r(g)?je(["#:",w.a(g)].join(""),e,d,b,c):je(null,a,d,b,c)}K.prototype.S=q;K.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};Fc.prototype.S=q;Fc.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};
Pd.prototype.S=q;Pd.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};td.prototype.S=q;td.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};ld.prototype.S=q;ld.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};Cc.prototype.S=q;Cc.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};Sd.prototype.S=q;Sd.prototype.K=function(a,b,c){return fe(this,b,c)};Qd.prototype.S=q;Qd.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};
Jc.prototype.S=q;Jc.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};Xc.prototype.S=q;Xc.prototype.K=function(a,b,c){E(b,"#object [cljs.core.Atom ");ee(new Da(null,1,[ke,this.state],null),b,c);return E(b,"]")};Xd.prototype.S=q;Xd.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};W.prototype.S=q;W.prototype.K=function(a,b,c){return Yd(b,ee,"["," ","]",c,this)};Bc.prototype.S=q;Bc.prototype.K=function(a,b){return E(b,"()")};Da.prototype.S=q;
Da.prototype.K=function(a,b,c){return fe(this,b,c)};Wd.prototype.S=q;Wd.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};Ac.prototype.S=q;Ac.prototype.K=function(a,b,c){return Yd(b,ee,"("," ",")",c,this)};function le(){}var me=function me(a){if(null!=a&&null!=a.Bb)return a.Bb(a);var c=me[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=me._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw v("IEncodeJS.-clj-\x3ejs",a);};
function ne(a){if(null!=a?q===a.Ab||(a.Ob?0:t(le,a)):t(le,a))a=me(a);else if("string"===typeof a||"number"===typeof a||a instanceof V||a instanceof Lb)a=oe(a);else{a=dc([a]);var b=Ca(),c;(c=null==a)||(c=J(a),c=null==c?!0:!1===c?!0:!1);a=c?"":""+w.a(ie(a,b))}return a}
var oe=function oe(a){if(null==a)return null;if(null!=a?q===a.Ab||(a.Ob?0:t(le,a)):t(le,a))return me(a);if(a instanceof V)return Ec(a);if(a instanceof Lb)return""+w.a(a);if(lc(a)){var c={};a=J(a);for(var d=null,e=0,g=0;;)if(g<e){var h=d.I(null,g),k=U(h,0),l=U(h,1);h=c;k=ne(k);l=oe.a?oe.a(l):oe.call(null,l);h[k]=l;g+=1}else if(a=J(a))oc(a)?(e=ub(a),a=vb(a),d=e,e=S(e)):(d=M(a),e=U(d,0),g=U(d,1),d=c,e=ne(e),g=oe.a?oe.a(g):oe.call(null,g),d[e]=g,a=N(a),d=null,e=0),g=0;else break;return c}if(null==a?0:
null!=a?a.h&8||q===a.Yb||(a.h?0:t(Pa,a)):t(Pa,a)){c=[];a=J(X.b(oe,a));d=null;for(g=e=0;;)if(g<e)h=d.I(null,g),c.push(h),g+=1;else if(a=J(a))d=a,oc(d)?(a=ub(d),g=vb(d),d=a,e=S(a),a=g):(a=M(d),c.push(a),a=N(d),d=null,e=0),g=0;else break;return c}return a};var pe=new V(null,"text-content","text-content",-2126072735),Ga=new V(null,"meta","meta",1499536964),Ha=new V(null,"dup","dup",556298533),qe=new V(null,"value","value",305978217),re=new V(null,"mode","mode",654403691),ke=new V(null,"val","val",128701612),he=new V(null,"fallback-impl","fallback-impl",-1501286995),Ea=new V(null,"flush-on-newline","flush-on-newline",-151457939),Fa=new V(null,"readably","readably",1129599760),Zd=new V(null,"more-marker","more-marker",-14717935),Uc=new Lb(null,"meta12532",
"meta12532",-653994925,null),Ia=new V(null,"print-length","print-length",1931866356),se=new V(null,"editor","editor",-989377770),ge=new V(null,"alt-impl","alt-impl",670969595),te=new V(null,"lineNumbers","lineNumbers",1374890941);var ue;a:{var ve=aa.navigator;if(ve){var we=ve.userAgent;if(we){ue=we;break a}}ue=""}function Y(a){return-1!=ue.indexOf(a)};function xe(){return Y("iPhone")&&!Y("iPod")&&!Y("iPad")};var ye=Y("Opera"),ze=Y("Trident")||Y("MSIE"),Ae=Y("Edge"),Be=Y("Gecko")&&!(-1!=ue.toLowerCase().indexOf("webkit")&&!Y("Edge"))&&!(Y("Trident")||Y("MSIE"))&&!Y("Edge"),Ce=-1!=ue.toLowerCase().indexOf("webkit")&&!Y("Edge");Ce&&Y("Mobile");Y("Macintosh");Y("Windows");Y("Linux")||Y("CrOS");var De=aa.navigator||null;De&&(De.appVersion||"").indexOf("X11");Y("Android");xe();Y("iPad");Y("iPod");xe()||Y("iPad")||Y("iPod");function Ee(){var a=aa.document;return a?a.documentMode:void 0}var Fe;
a:{var Ge="",He=function(){var a=ue;if(Be)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Ae)return/Edge\/([\d\.]+)/.exec(a);if(ze)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Ce)return/WebKit\/(\S+)/.exec(a);if(ye)return/(?:Version)[ \/]?(\S+)/.exec(a)}();He&&(Ge=He?He[1]:"");if(ze){var Ie=Ee();if(null!=Ie&&Ie>parseFloat(Ge)){Fe=String(Ie);break a}}Fe=Ge}var wa={};
function Je(a){va(a,function(){for(var b=0,c=da(String(Fe)).split("."),d=da(String(a)).split("."),e=Math.max(c.length,d.length),g=0;0==b&&g<e;g++){var h=c[g]||"",k=d[g]||"";do{h=/(\d*)(\D*)(.*)/.exec(h)||["","","",""];k=/(\d*)(\D*)(.*)/.exec(k)||["","","",""];if(0==h[0].length&&0==k[0].length)break;b=ea(0==h[1].length?0:parseInt(h[1],10),0==k[1].length?0:parseInt(k[1],10))||ea(0==h[2].length,0==k[2].length)||ea(h[2],k[2]);h=h[3];k=k[3]}while(0==b)}return 0<=b})}var Ke;var Le=aa.document;
Ke=Le&&ze?Ee()||("CSS1Compat"==Le.compatMode?parseInt(Fe,10):5):void 0;var Me;if(!(Me=!Be&&!ze)){var Ne;if(Ne=ze)Ne=9<=Number(Ke);Me=Ne}Me||Be&&Je("1.9.1");ze&&Je("9");Ud();var Oe;Oe=new Xc(new Da(null,2,[pe,"",se,null],null),null,null,null);var Pe=function(a){var b=0;return function(c){aa.clearTimeout(b);var d=arguments;b=aa.setTimeout(function(){a.apply(void 0,d)},1E3)}}(function(){return window.java.onautosave()});function Qe(){var a=C(Oe);a=null==a?null:se.a(a);return null==a?null:a.getValue()}function Re(){Zc.w(Oe,hc,pe,Qe());return window.java.onchange()}var Se=window;Se.undo=function(){var a=C(Oe);a=null==a?null:se.a(a);null!=a&&a.undo();return window.java.onautosave()};
Se.redo=function(){var a=C(Oe);a=null==a?null:se.a(a);null!=a&&a.redo();return window.java.onautosave()};Se.canUndo=function(){var a=C(Oe);a=null==a?null:se.a(a);a=null==a?null:a.historySize();a=null==a?null:a.undo;return null==a?null:0<a};Se.canRedo=function(){var a=C(Oe);a=null==a?null:se.a(a);a=null==a?null:a.historySize();a=null==a?null:a.redo;return null==a?null:0<a};
Se.setTextContent=function(a){var b=document.querySelector("#content");if("textContent"in b)b.textContent=a;else if(3==b.nodeType)b.data=String(a);else if(b.firstChild&&3==b.firstChild.nodeType){for(;b.lastChild!=b.firstChild;)b.removeChild(b.lastChild);b.firstChild.data=String(a)}else{for(var c;c=b.firstChild;)b.removeChild(c);b.appendChild((9==b.nodeType?b:b.ownerDocument||b.document).createTextNode(String(a)))}};Se.getTextContent=Qe;Se.getSelectedText=function(){return null};Se.markClean=Re;
Se.isClean=function(){var a=C(Oe);a=null==a?null:pe.a(a);return null==a?null:O.b(a,Qe())};Se.changeTheme=function(a){var b=C(Oe);b=null==b?null:se.a(b);return null==b?null:b.setOption("theme",r(a)?"lesser-dark":"default")};Se.setTextSize=function(a){return document.querySelector(".CodeMirror").style.fontSize=[w.a(a),"px"].join("")};
Se.init=function(a){var b=document.querySelector("#content");Zc.w(Oe,hc,se,function(){var c=window.CodeMirror(document.body,oe(new Da(null,3,[qe,b.textContent,te,!0,re,Ud().a?Ud().a(a):Ud().call(null,a)],null)));c.on("change",function(){return function(){Pe.C?Pe.C():Pe.call(null);return window.java.onchange()}}(c,b));c.setOption("extraKeys",oe(new Da(null,4,["Ctrl-Z",!1,"Cmd-Z",!1,"Shift-Ctrl-Z",!1,"Shift-Cmd-Z",!1],null)));return c}());document.body.removeChild(b);return Re()};
window.onload=function(){window.status="MY-MAGIC-VALUE";window.status="";window.java.onload();return window.java.onchange()};
})();
