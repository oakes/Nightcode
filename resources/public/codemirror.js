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

(function(Fa,ea){"object"===typeof exports&&"undefined"!==typeof module?module.exports=ea():"function"===typeof define&&define.amd?define(ea):Fa.CodeMirror=ea()})(this,function(){function Fa(a){return new RegExp("(^|\\s)"+a+"(?:$|\\s)\\s*")}function ea(a){for(var b=a.childNodes.length;0<b;--b)a.removeChild(a.firstChild);return a}function Z(a,b){return ea(a).appendChild(b)}function u(a,b,c,d){a=document.createElement(a);c&&(a.className=c);d&&(a.style.cssText=d);if("string"==typeof b)a.appendChild(document.createTextNode(b));
else if(b)for(c=0;c<b.length;++c)a.appendChild(b[c]);return a}function Za(a,b,c,d){a=u(a,b,c,d);a.setAttribute("role","presentation");return a}function xa(a,b){3==b.nodeType&&(b=b.parentNode);if(a.contains)return a.contains(b);do if(11==b.nodeType&&(b=b.host),b==a)return!0;while(b=b.parentNode)}function sa(){var a;try{a=document.activeElement}catch(b){a=document.body||null}for(;a&&a.shadowRoot&&a.shadowRoot.activeElement;)a=a.shadowRoot.activeElement;return a}function Ga(a,b){var c=a.className;Fa(b).test(c)||
(a.className+=(c?" ":"")+b)}function Nc(a,b){for(var c=a.split(" "),d=0;d<c.length;d++)c[d]&&!Fa(c[d]).test(b)&&(b+=" "+c[d]);return b}function Oc(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b)}}function Ha(a,b,c){b||(b={});for(var d in a)!a.hasOwnProperty(d)||!1===c&&b.hasOwnProperty(d)||(b[d]=a[d]);return b}function fa(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),-1==b&&(b=a.length));d=d||0;for(e=e||0;;){var f=a.indexOf("\t",d);if(0>f||f>=b)return e+
(b-d);e+=f-d;e+=c-e%c;d=f+1}}function L(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}function Pc(a,b,c){for(var d=0,e=0;;){var f=a.indexOf("\t",d);-1==f&&(f=a.length);var g=f-d;if(f==a.length||e+g>=b)return d+Math.min(g,b-e);e+=f-d;e+=c-e%c;d=f+1;if(e>=b)return d}}function Qc(a){for(;fc.length<=a;)fc.push(w(fc)+" ");return fc[a]}function w(a){return a[a.length-1]}function gc(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d);return c}function ig(a,b,c){for(var d=0,e=c(b);d<a.length&&
c(a[d])<=e;)d++;a.splice(d,0,b)}function Wd(){}function Xd(a,b){var c;Object.create?c=Object.create(a):(Wd.prototype=a,c=new Wd);b&&Ha(b,c);return c}function Rc(a){return/\w/.test(a)||""<a&&(a.toUpperCase()!=a.toLowerCase()||jg.test(a))}function hc(a,b){return b?-1<b.source.indexOf("\\w")&&Rc(a)?!0:b.test(a):Rc(a)}function Yd(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function Sc(a){return 768<=a.charCodeAt(0)&&kg.test(a)}function Zd(a,b,c){for(;(0>c?0<b:b<a.length)&&Sc(a.charAt(b));)b+=
c;return b}function rb(a,b,c){for(var d=b>c?-1:1;;){if(b==c)return b;var e=(b+c)/2,e=0>d?Math.ceil(e):Math.floor(e);if(e==b)return a(e)?b:c;a(e)?c=e:b=e+d}}function lg(a,b,c){this.input=c;this.scrollbarFiller=u("div",null,"CodeMirror-scrollbar-filler");this.scrollbarFiller.setAttribute("cm-not-content","true");this.gutterFiller=u("div",null,"CodeMirror-gutter-filler");this.gutterFiller.setAttribute("cm-not-content","true");this.lineDiv=Za("div",null,"CodeMirror-code");this.selectionDiv=u("div",null,
null,"position: relative; z-index: 1");this.cursorDiv=u("div",null,"CodeMirror-cursors");this.measure=u("div",null,"CodeMirror-measure");this.lineMeasure=u("div",null,"CodeMirror-measure");this.lineSpace=Za("div",[this.measure,this.lineMeasure,this.selectionDiv,this.cursorDiv,this.lineDiv],null,"position: relative; outline: none");var d=Za("div",[this.lineSpace],"CodeMirror-lines");this.mover=u("div",[d],null,"position: relative");this.sizer=u("div",[this.mover],"CodeMirror-sizer");this.sizerWidth=
null;this.heightForcer=u("div",null,null,"position: absolute; height: 30px; width: 1px;");this.gutters=u("div",null,"CodeMirror-gutters");this.lineGutter=null;this.scroller=u("div",[this.sizer,this.heightForcer,this.gutters],"CodeMirror-scroll");this.scroller.setAttribute("tabIndex","-1");this.wrapper=u("div",[this.scrollbarFiller,this.gutterFiller,this.scroller],"CodeMirror");A&&8>D&&(this.gutters.style.zIndex=-1,this.scroller.style.paddingRight=0);P||ya&&sb||(this.scroller.draggable=!0);a&&(a.appendChild?
a.appendChild(this.wrapper):a(this.wrapper));this.reportedViewFrom=this.reportedViewTo=this.viewFrom=this.viewTo=b.first;this.view=[];this.externalMeasured=this.renderedView=null;this.lastWrapHeight=this.lastWrapWidth=this.viewOffset=0;this.updateLineNumbers=null;this.nativeBarWidth=this.barHeight=this.barWidth=0;this.scrollbarsClipped=!1;this.lineNumWidth=this.lineNumInnerWidth=this.lineNumChars=null;this.alignWidgets=!1;this.maxLine=this.cachedCharWidth=this.cachedTextHeight=this.cachedPaddingH=
null;this.maxLineLength=0;this.maxLineChanged=!1;this.wheelDX=this.wheelDY=this.wheelStartX=this.wheelStartY=null;this.shift=!1;this.activeTouch=this.selForContextMenu=null;c.init(this)}function t(a,b){b-=a.first;if(0>b||b>=a.size)throw Error("There is no line "+(b+a.first)+" in the document.");for(var c=a;!c.lines;)for(var d=0;;++d){var e=c.children[d],f=e.chunkSize();if(b<f){c=e;break}b-=f}return c.lines[b]}function Ia(a,b,c){var d=[],e=b.line;a.iter(b.line,c.line+1,function(a){a=a.text;e==c.line&&
(a=a.slice(0,c.ch));e==b.line&&(a=a.slice(b.ch));d.push(a);++e});return d}function Tc(a,b,c){var d=[];a.iter(b,c,function(a){d.push(a.text)});return d}function ma(a,b){var c=b-a.height;if(c)for(var d=a;d;d=d.parent)d.height+=c}function B(a){if(null==a.parent)return null;var b=a.parent;a=L(b.lines,a);for(var c=b.parent;c;b=c,c=c.parent)for(var d=0;c.children[d]!=b;++d)a+=c.children[d].chunkSize();return a+b.first}function Ja(a,b){var c=a.first;a:do{for(var d=0;d<a.children.length;++d){var e=a.children[d],
f=e.height;if(b<f){a=e;continue a}b-=f;c+=e.chunkSize()}return c}while(!a.lines);for(d=0;d<a.lines.length;++d){e=a.lines[d].height;if(b<e)break;b-=e}return c+d}function tb(a,b){return b>=a.first&&b<a.first+a.size}function Uc(a,b){return String(a.lineNumberFormatter(b+a.firstLineNumber))}function q(a,b,c){void 0===c&&(c=null);if(!(this instanceof q))return new q(a,b,c);this.line=a;this.ch=b;this.sticky=c}function y(a,b){return a.line-b.line||a.ch-b.ch}function Vc(a,b){return a.sticky==b.sticky&&0==
y(a,b)}function Wc(a){return q(a.line,a.ch)}function ic(a,b){return 0>y(a,b)?b:a}function jc(a,b){return 0>y(a,b)?a:b}function x(a,b){if(b.line<a.first)return q(a.first,0);var c=a.first+a.size-1;if(b.line>c)return q(c,t(a,c).text.length);var c=t(a,b.line).text.length,d=b.ch,c=null==d||d>c?q(b.line,c):0>d?q(b.line,0):b;return c}function $d(a,b){for(var c=[],d=0;d<b.length;d++)c[d]=x(a,b[d]);return c}function kc(a,b,c){this.marker=a;this.from=b;this.to=c}function ub(a,b){if(a)for(var c=0;c<a.length;++c){var d=
a[c];if(d.marker==b)return d}}function Xc(a,b){if(b.full)return null;var c=tb(a,b.from.line)&&t(a,b.from.line).markedSpans,d=tb(a,b.to.line)&&t(a,b.to.line).markedSpans;if(!c&&!d)return null;var e=b.from.ch,f=b.to.ch,g=0==y(b.from,b.to),h;if(c)for(var k=0;k<c.length;++k){var l=c[k],m=l.marker;if(null==l.from||(m.inclusiveLeft?l.from<=e:l.from<e)||!(l.from!=e||"bookmark"!=m.type||g&&l.marker.insertLeft)){var p=null==l.to||(m.inclusiveRight?l.to>=e:l.to>e);(h||(h=[])).push(new kc(m,l.from,p?null:l.to))}}var c=
h,n;if(d)for(h=0;h<d.length;++h)if(k=d[h],l=k.marker,null==k.to||(l.inclusiveRight?k.to>=f:k.to>f)||k.from==f&&"bookmark"==l.type&&(!g||k.marker.insertLeft))m=null==k.from||(l.inclusiveLeft?k.from<=f:k.from<f),(n||(n=[])).push(new kc(l,m?null:k.from-f,null==k.to?null:k.to-f));d=n;f=1==b.text.length;g=w(b.text).length+(f?e:0);if(c)for(n=0;n<c.length;++n)if(h=c[n],null==h.to)(k=ub(d,h.marker),k)?f&&(h.to=null==k.to?null:k.to+g):h.to=e;if(d)for(e=0;e<d.length;++e)n=d[e],null!=n.to&&(n.to+=g),null==n.from?
ub(c,n.marker)||(n.from=g,f&&(c||(c=[])).push(n)):(n.from+=g,f&&(c||(c=[])).push(n));c&&(c=ae(c));d&&d!=c&&(d=ae(d));e=[c];if(!f){var f=b.text.length-2,r;if(0<f&&c)for(g=0;g<c.length;++g)null==c[g].to&&(r||(r=[])).push(new kc(c[g].marker,null,null));for(c=0;c<f;++c)e.push(r);e.push(d)}return e}function ae(a){for(var b=0;b<a.length;++b){var c=a[b];null!=c.from&&c.from==c.to&&!1!==c.marker.clearWhenEmpty&&a.splice(b--,1)}return a.length?a:null}function mg(a,b,c){var d=null;a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var b=
0;b<a.markedSpans.length;++b){var c=a.markedSpans[b].marker;!c.readOnly||d&&-1!=L(d,c)||(d||(d=[])).push(c)}});if(!d)return null;a=[{from:b,to:c}];for(b=0;b<d.length;++b){c=d[b];for(var e=c.find(0),f=0;f<a.length;++f){var g=a[f];if(!(0>y(g.to,e.from)||0<y(g.from,e.to))){var h=[f,1],k=y(g.from,e.from),l=y(g.to,e.to);(0>k||!c.inclusiveLeft&&!k)&&h.push({from:g.from,to:e.from});(0<l||!c.inclusiveRight&&!l)&&h.push({from:e.to,to:g.to});a.splice.apply(a,h);f+=h.length-3}}}return a}function be(a){var b=
a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function ce(a,b){if(b){for(var c=0;c<b.length;++c)b[c].marker.attachLine(a);a.markedSpans=b}}function Yc(a,b){var c=a.lines.length-b.lines.length;if(0!=c)return c;var c=a.find(),d=b.find(),e=y(c.from,d.from)||(a.inclusiveLeft?-1:0)-(b.inclusiveLeft?-1:0);return e?-e:(c=y(c.to,d.to)||(a.inclusiveRight?1:0)-(b.inclusiveRight?1:0))?c:b.id-a.id}function $a(a,b){var c=ta&&a.markedSpans,d;if(c)for(var e=void 0,
f=0;f<c.length;++f)e=c[f],e.marker.collapsed&&null==(b?e.from:e.to)&&(!d||0>Yc(d,e.marker))&&(d=e.marker);return d}function de(a,b,c,d,e){a=t(a,b);if(a=ta&&a.markedSpans)for(b=0;b<a.length;++b){var f=a[b];if(f.marker.collapsed){var g=f.marker.find(0),h=y(g.from,c)||(f.marker.inclusiveLeft?-1:0)-(e.inclusiveLeft?-1:0),k=y(g.to,d)||(f.marker.inclusiveRight?1:0)-(e.inclusiveRight?1:0);if(!(0<=h&&0>=k||0>=h&&0<=k)&&(0>=h&&(f.marker.inclusiveRight&&e.inclusiveLeft?0<=y(g.to,c):0<y(g.to,c))||0<=h&&(f.marker.inclusiveRight&&
e.inclusiveLeft?0>=y(g.from,d):0>y(g.from,d))))return!0}}}function na(a){for(var b;b=$a(a,!0);)a=b.find(-1,!0).line;return a}function Zc(a,b){var c=t(a,b),d=na(c);return c==d?b:B(d)}function ee(a,b){if(b>a.lastLine())return b;var c=t(a,b),d;if(!za(a,c))return b;for(;d=$a(c,!1);)c=d.find(1,!0).line;return B(c)+1}function za(a,b){var c=ta&&b.markedSpans;if(c)for(var d=void 0,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed&&(null==d.from||!d.marker.widgetNode&&0==d.from&&d.marker.inclusiveLeft&&$c(a,
b,d)))return!0}function $c(a,b,c){if(null==c.to)return b=c.marker.find(1,!0),$c(a,b.line,ub(b.line.markedSpans,c.marker));if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var d=void 0,e=0;e<b.markedSpans.length;++e)if(d=b.markedSpans[e],d.marker.collapsed&&!d.marker.widgetNode&&d.from==c.to&&(null==d.to||d.to!=c.from)&&(d.marker.inclusiveLeft||c.marker.inclusiveRight)&&$c(a,b,d))return!0}function oa(a){a=na(a);for(var b=0,c=a.parent,d=0;d<c.lines.length;++d){var e=c.lines[d];if(e==a)break;
else b+=e.height}for(a=c.parent;a;c=a,a=c.parent)for(d=0;d<a.children.length&&(e=a.children[d],e!=c);++d)b+=e.height;return b}function lc(a){if(0==a.height)return 0;for(var b=a.text.length,c,d=a;c=$a(d,!0);)c=c.find(0,!0),d=c.from.line,b+=c.from.ch-c.to.ch;for(d=a;c=$a(d,!1);)a=c.find(0,!0),b-=d.text.length-a.from.ch,d=a.to.line,b+=d.text.length-a.to.ch;return b}function ad(a){var b=a.display;a=a.doc;b.maxLine=t(a,a.first);b.maxLineLength=lc(b.maxLine);b.maxLineChanged=!0;a.iter(function(a){var d=
lc(a);d>b.maxLineLength&&(b.maxLineLength=d,b.maxLine=a)})}function ng(a,b,c,d){if(!a)return d(b,c,"ltr",0);for(var e=!1,f=0;f<a.length;++f){var g=a[f];if(g.from<c&&g.to>b||b==c&&g.to==b)d(Math.max(g.from,b),Math.min(g.to,c),1==g.level?"rtl":"ltr",f),e=!0}e||d(b,c,"ltr")}function vb(a,b,c){var d;wb=null;for(var e=0;e<a.length;++e){var f=a[e];if(f.from<b&&f.to>b)return e;f.to==b&&(f.from!=f.to&&"before"==c?d=e:wb=e);f.from==b&&(f.from!=f.to&&"before"!=c?d=e:wb=e)}return null!=d?d:wb}function ua(a,
b){var c=a.order;null==c&&(c=a.order=og(a.text,b));return c}function aa(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else{var d=(a=a._handlers)&&a[b];d&&(c=L(d,c),-1<c&&(a[b]=d.slice(0,c).concat(d.slice(c+1))))}}function F(a,b){var c=a._handlers&&a._handlers[b]||mc;if(c.length)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)}function I(a,b,c){"string"==typeof b&&(b={type:b,preventDefault:function(){this.defaultPrevented=
!0}});F(a,c||b.type,a,b);return bd(b)||b.codemirrorIgnore}function fe(a){var b=a._handlers&&a._handlers.cursorActivity;if(b){a=a.curOp.cursorActivityHandlers||(a.curOp.cursorActivityHandlers=[]);for(var c=0;c<b.length;++c)-1==L(a,b[c])&&a.push(b[c])}}function ga(a,b){return 0<(a._handlers&&a._handlers[b]||mc).length}function ab(a){a.prototype.on=function(a,c){v(this,a,c)};a.prototype.off=function(a,c){aa(this,a,c)}}function T(a){a.preventDefault?a.preventDefault():a.returnValue=!1}function ge(a){a.stopPropagation?
a.stopPropagation():a.cancelBubble=!0}function bd(a){return null!=a.defaultPrevented?a.defaultPrevented:0==a.returnValue}function xb(a){T(a);ge(a)}function he(a){var b=a.which;null==b&&(a.button&1?b=1:a.button&2?b=3:a.button&4&&(b=2));ha&&a.ctrlKey&&1==b&&(b=3);return b}function pg(a){if(null==cd){var b=u("span","​");Z(a,u("span",[b,document.createTextNode("x")]));0!=a.firstChild.offsetHeight&&(cd=1>=b.offsetWidth&&2<b.offsetHeight&&!(A&&8>D))}a=cd?u("span","​"):u("span"," ",null,"display: inline-block; width: 1px; margin-right: -1px");
a.setAttribute("cm-text","");return a}function qg(a,b){2<arguments.length&&(b.dependencies=Array.prototype.slice.call(arguments,2));dd[a]=b}function nc(a){if("string"==typeof a&&bb.hasOwnProperty(a))a=bb[a];else if(a&&"string"==typeof a.name&&bb.hasOwnProperty(a.name)){var b=bb[a.name];"string"==typeof b&&(b={name:b});a=Xd(b,a);a.name=b.name}else{if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+xml$/.test(a))return nc("application/xml");if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+json$/.test(a))return nc("application/json")}return"string"==
typeof a?{name:a}:a||{name:"null"}}function ed(a,b){b=nc(b);var c=dd[b.name];if(!c)return ed(a,"text/plain");c=c(a,b);if(cb.hasOwnProperty(b.name)){var d=cb[b.name],e;for(e in d)d.hasOwnProperty(e)&&(c.hasOwnProperty(e)&&(c["_"+e]=c[e]),c[e]=d[e])}c.name=b.name;b.helperType&&(c.helperType=b.helperType);if(b.modeProps)for(var f in b.modeProps)c[f]=b.modeProps[f];return c}function rg(a,b){var c=cb.hasOwnProperty(a)?cb[a]:cb[a]={};Ha(b,c)}function Ka(a,b){if(!0===b)return b;if(a.copyState)return a.copyState(b);
var c={},d;for(d in b){var e=b[d];e instanceof Array&&(e=e.concat([]));c[d]=e}return c}function fd(a,b){for(var c;a.innerMode;){c=a.innerMode(b);if(!c||c.mode==a)break;b=c.state;a=c.mode}return c||{mode:a,state:b}}function ie(a,b,c){return a.startState?a.startState(b,c):!0}function je(a,b,c,d){var e=[a.state.modeGen],f={};ke(a,b.text,a.doc.mode,c,function(a,b){return e.push(a,b)},f,d);var g=c.state;d=function(d){c.baseTokens=e;var h=a.state.overlays[d],m=1,p=0;c.state=!0;ke(a,b.text,h.mode,c,function(a,
b){for(var d=m;p<a;){var c=e[m];c>a&&e.splice(m,1,a,e[m+1],c);m+=2;p=Math.min(a,c)}if(b)if(h.opaque)e.splice(d,m-d,a,"overlay "+b),m=d+2;else for(;d<m;d+=2)c=e[d+1],e[d+1]=(c?c+" ":"")+"overlay "+b},f);c.state=g;c.baseTokens=null;c.baseTokenPos=1};for(var h=0;h<a.state.overlays.length;++h)d(h);return{styles:e,classes:f.bgClass||f.textClass?f:null}}function le(a,b,c){if(!b.styles||b.styles[0]!=a.state.modeGen){var d=yb(a,B(b)),e=b.text.length>a.options.maxHighlightLength&&Ka(a.doc.mode,d.state),f=
je(a,b,d);e&&(d.state=e);b.stateAfter=d.save(!e);b.styles=f.styles;f.classes?b.styleClasses=f.classes:b.styleClasses&&(b.styleClasses=null);c===a.doc.highlightFrontier&&(a.doc.modeFrontier=Math.max(a.doc.modeFrontier,++a.doc.highlightFrontier))}return b.styles}function yb(a,b,c){var d=a.doc,e=a.display;if(!d.mode.startState)return new pa(d,!0,b);var f=sg(a,b,c),g=f>d.first&&t(d,f-1).stateAfter,h=g?pa.fromSaved(d,g,f):new pa(d,ie(d.mode),f);d.iter(f,b,function(d){gd(a,d.text,h);var c=h.line;d.stateAfter=
c==b-1||0==c%5||c>=e.viewFrom&&c<e.viewTo?h.save():null;h.nextLine()});c&&(d.modeFrontier=h.line);return h}function gd(a,b,c,d){var e=a.doc.mode;a=new G(b,a.options.tabSize,c);a.start=a.pos=d||0;for(""==b&&me(e,c.state);!a.eol();)hd(e,a,c.state),a.start=a.pos}function me(a,b){if(a.blankLine)return a.blankLine(b);if(a.innerMode){var c=fd(a,b);if(c.mode.blankLine)return c.mode.blankLine(c.state)}}function hd(a,b,c,d){for(var e=0;10>e;e++){d&&(d[0]=fd(a,c).mode);var f=a.token(b,c);if(b.pos>b.start)return f}throw Error("Mode "+
a.name+" failed to advance stream.");}function ne(a,b,c,d){var e=a.doc,f=e.mode,g;b=x(e,b);var h=t(e,b.line);c=yb(a,b.line,c);a=new G(h.text,a.options.tabSize,c);var k;for(d&&(k=[]);(d||a.pos<b.ch)&&!a.eol();)a.start=a.pos,g=hd(f,a,c.state),d&&k.push(new oe(a,g,Ka(e.mode,c.state)));return d?k:new oe(a,g,c.state)}function pe(a,b){if(a)for(;;){var c=a.match(/(?:^|\s+)line-(background-)?(\S+)/);if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":"textClass";null==b[d]?
b[d]=c[2]:(new RegExp("(?:^|s)"+c[2]+"(?:$|s)")).test(b[d])||(b[d]+=" "+c[2])}return a}function ke(a,b,c,d,e,f,g){var h=c.flattenSpans;null==h&&(h=a.options.flattenSpans);var k=0,l=null,m=new G(b,a.options.tabSize,d),p,n=a.options.addModeClass&&[null];for(""==b&&pe(me(c,d.state),f);!m.eol();){m.pos>a.options.maxHighlightLength?(h=!1,g&&gd(a,b,d,m.pos),m.pos=b.length,p=null):p=pe(hd(c,m,d.state,n),f);if(n){var r=n[0].name;r&&(p="m-"+(p?r+" "+p:r))}if(!h||l!=p){for(;k<m.start;)k=Math.min(m.start,k+
5E3),e(k,l);l=p}m.start=m.pos}for(;k<m.pos;)a=Math.min(m.pos,k+5E3),e(a,l),k=a}function sg(a,b,c){for(var d,e,f=a.doc,g=c?-1:b-(a.doc.mode.innerMode?1E3:100);b>g;--b){if(b<=f.first)return f.first;var h=t(f,b-1),k=h.stateAfter;if(k&&(!c||b+(k instanceof oc?k.lookAhead:0)<=f.modeFrontier))return b;h=fa(h.text,null,a.options.tabSize);if(null==e||d>h)e=b-1,d=h}return e}function tg(a,b){a.modeFrontier=Math.min(a.modeFrontier,b);if(!(a.highlightFrontier<b-10)){for(var c=a.first,d=b-1;d>c;d--){var e=t(a,
d).stateAfter;if(e&&(!(e instanceof oc)||d+e.lookAhead<b)){c=d+1;break}}a.highlightFrontier=Math.min(a.highlightFrontier,c)}}function qe(a,b){if(!a||/^\s*$/.test(a))return null;var c=b.addModeClass?ug:vg;return c[a]||(c[a]=a.replace(/\S+/g,"cm-$\x26"))}function re(a,b){var c=Za("span",null,null,P?"padding-right: .1px":null),c={pre:Za("pre",[c],"CodeMirror-line"),content:c,col:0,pos:0,cm:a,trailingSpace:!1,splitSpaces:a.getOption("lineWrapping")};b.measure={};for(var d=0;d<=(b.rest?b.rest.length:0);d++){var e=
d?b.rest[d-1]:b.line,f=void 0;c.pos=0;c.addToken=wg;var g;g=a.display.measure;if(null!=id)g=id;else{var h=Z(g,document.createTextNode("AخA")),k=db(h,0,1).getBoundingClientRect(),h=db(h,1,2).getBoundingClientRect();ea(g);g=k&&k.left!=k.right?id=3>h.right-k.right:!1}g&&(f=ua(e,a.doc.direction))&&(c.addToken=xg(c.addToken,f));c.map=[];g=b!=a.display.externalMeasured&&B(e);a:{f=c;g=le(a,e,g);var l=e.markedSpans,k=e.text,h=0;if(l)for(var m=k.length,p=0,n=1,r="",W=void 0,q=void 0,t=0,u=void 0,v=void 0,
y=void 0,x=void 0,Q=void 0;;){if(t==p){for(var u=v=y=x=q="",Q=null,t=Infinity,A=[],X=void 0,z=0;z<l.length;++z){var M=l[z],w=M.marker;"bookmark"==w.type&&M.from==p&&w.widgetNode?A.push(w):M.from<=p&&(null==M.to||M.to>p||w.collapsed&&M.to==p&&M.from==p)?(null!=M.to&&M.to!=p&&t>M.to&&(t=M.to,v=""),w.className&&(u+=" "+w.className),w.css&&(q=(q?q+";":"")+w.css),w.startStyle&&M.from==p&&(y+=" "+w.startStyle),w.endStyle&&M.to==t&&(X||(X=[])).push(w.endStyle,M.to),w.title&&!x&&(x=w.title),w.collapsed&&
(!Q||0>Yc(Q.marker,w))&&(Q=M)):M.from>p&&t>M.from&&(t=M.from)}if(X)for(z=0;z<X.length;z+=2)X[z+1]==t&&(v+=" "+X[z]);if(!Q||Q.from==p)for(X=0;X<A.length;++X)se(f,0,A[X]);if(Q&&(Q.from||0)==p){se(f,(null==Q.to?m+1:Q.to)-p,Q.marker,null==Q.from);if(null==Q.to)break a;Q.to==p&&(Q=!1)}}if(p>=m)break;for(A=Math.min(m,t);;){if(r){X=p+r.length;Q||(z=X>A?r.slice(0,A-p):r,f.addToken(f,z,W?W+u:u,y,p+z.length==t?v:"",x,q));if(X>=A){r=r.slice(A-p);p=A;break}p=X;y=""}r=k.slice(h,h=g[n++]);W=qe(g[n++],f.cm.options)}}else for(l=
1;l<g.length;l+=2)f.addToken(f,k.slice(h,h=g[l]),qe(g[l+1],f.cm.options))}e.styleClasses&&(e.styleClasses.bgClass&&(c.bgClass=Nc(e.styleClasses.bgClass,c.bgClass||"")),e.styleClasses.textClass&&(c.textClass=Nc(e.styleClasses.textClass,c.textClass||"")));0==c.map.length&&c.map.push(0,0,c.content.appendChild(pg(a.display.measure)));0==d?(b.measure.map=c.map,b.measure.cache={}):((b.measure.maps||(b.measure.maps=[])).push(c.map),(b.measure.caches||(b.measure.caches=[])).push({}))}P&&(d=c.content.lastChild,
/\bcm-tab\b/.test(d.className)||d.querySelector&&d.querySelector(".cm-tab"))&&(c.content.className="cm-tab-wrap-hack");F(a,"renderLine",a,b.line,c.pre);c.pre.className&&(c.textClass=Nc(c.pre.className,c.textClass||""));return c}function yg(a){var b=u("span","•","cm-invalidchar");b.title="\\u"+a.charCodeAt(0).toString(16);b.setAttribute("aria-label",b.title);return b}function wg(a,b,c,d,e,f,g){if(b){var h;if(a.splitSpaces)if(h=a.trailingSpace,1<b.length&&!/  /.test(b))h=b;else{for(var k="",l=0;l<b.length;l++){var m=
b.charAt(l);" "!=m||!h||l!=b.length-1&&32!=b.charCodeAt(l+1)||(m=" ");k+=m;h=" "==m}h=k}else h=b;k=h;l=a.cm.state.specialChars;m=!1;if(l.test(b)){h=document.createDocumentFragment();for(var p=0;;){l.lastIndex=p;var n=l.exec(b),r=n?n.index-p:b.length-p;if(r){var W=document.createTextNode(k.slice(p,p+r));A&&9>D?h.appendChild(u("span",[W])):h.appendChild(W);a.map.push(a.pos,a.pos+r,W);a.col+=r;a.pos+=r}if(!n)break;p+=r+1;r=void 0;"\t"==n[0]?(n=a.cm.options.tabSize,n-=a.col%n,r=h.appendChild(u("span",
Qc(n),"cm-tab")),r.setAttribute("role","presentation"),r.setAttribute("cm-text","\t"),a.col+=n):("\r"==n[0]||"\n"==n[0]?(r=h.appendChild(u("span","\r"==n[0]?"␍":"␤","cm-invalidchar")),r.setAttribute("cm-text",n[0])):(r=a.cm.options.specialCharPlaceholder(n[0]),r.setAttribute("cm-text",n[0]),A&&9>D?h.appendChild(u("span",[r])):h.appendChild(r)),a.col+=1);a.map.push(a.pos,a.pos+1,r);a.pos++}}else a.col+=b.length,h=document.createTextNode(k),a.map.push(a.pos,a.pos+b.length,h),A&&9>D&&(m=!0),a.pos+=b.length;
a.trailingSpace=32==k.charCodeAt(b.length-1);if(c||d||e||m||g)return b=c||"",d&&(b+=d),e&&(b+=e),d=u("span",[h],b,g),f&&(d.title=f),a.content.appendChild(d);a.content.appendChild(h)}}function xg(a,b){return function(c,d,e,f,g,h,k){e=e?e+" cm-force-border":"cm-force-border";for(var l=c.pos,m=l+d.length;;){for(var p=void 0,n=0;n<b.length&&!(p=b[n],p.to>l&&p.from<=l);n++);if(p.to>=m)return a(c,d,e,f,g,h,k);a(c,d.slice(0,p.to-l),e,f,null,h,k);f=null;d=d.slice(p.to-l);l=p.to}}}function se(a,b,c,d){var e=
!d&&c.widgetNode;e&&a.map.push(a.pos,a.pos+b,e);!d&&a.cm.display.input.needsContentAttribute&&(e||(e=a.content.appendChild(document.createElement("span"))),e.setAttribute("cm-marker",c.id));e&&(a.cm.display.input.setUneditable(e),a.content.appendChild(e));a.pos+=b;a.trailingSpace=!1}function te(a,b,c){for(var d=this.line=b,e;d=$a(d,!1);)d=d.find(1,!0).line,(e||(e=[])).push(d);this.size=(this.rest=e)?B(w(this.rest))-c+1:1;this.node=this.text=null;this.hidden=za(a,b)}function pc(a,b,c){var d=[],e;for(e=
b;e<c;)b=new te(a.doc,t(a.doc,e),e),e+=b.size,d.push(b);return d}function zg(a,b){var c=a.ownsGroup;if(c)try{var d=c.delayedCallbacks,e=0;do{for(;e<d.length;e++)d[e].call(null);for(var f=0;f<c.ops.length;f++){var g=c.ops[f];if(g.cursorActivityHandlers)for(;g.cursorActivityCalled<g.cursorActivityHandlers.length;)g.cursorActivityHandlers[g.cursorActivityCalled++].call(null,g.cm)}}while(e<d.length)}finally{eb=null,b(c)}}function N(a,b){var c=a._handlers&&a._handlers[b]||mc;if(c.length){var d=Array.prototype.slice.call(arguments,
2),e;eb?e=eb.delayedCallbacks:zb?e=zb:(e=zb=[],setTimeout(Ag,0));for(var f=function(a){e.push(function(){return c[a].apply(null,d)})},g=0;g<c.length;++g)f(g)}}function Ag(){var a=zb;zb=null;for(var b=0;b<a.length;++b)a[b]()}function ue(a,b,c,d){for(var e=0;e<b.changes.length;e++){var f=b.changes[e];if("text"==f){var f=a,g=b,h=g.text.className,k=ve(f,g);g.text==g.node&&(g.node=k.pre);g.text.parentNode.replaceChild(k.pre,g.text);g.text=k.pre;k.bgClass!=g.bgClass||k.textClass!=g.textClass?(g.bgClass=
k.bgClass,g.textClass=k.textClass,jd(f,g)):h&&(g.text.className=h)}else if("gutter"==f)we(a,b,c,d);else if("class"==f)jd(a,b);else if("widget"==f){f=a;g=b;h=d;g.alignable&&(g.alignable=null);for(var k=g.node.firstChild,l=void 0;k;k=l)l=k.nextSibling,"CodeMirror-linewidget"==k.className&&g.node.removeChild(k);xe(f,g,h)}}b.changes=null}function Ab(a){a.node==a.text&&(a.node=u("div",null,null,"position: relative"),a.text.parentNode&&a.text.parentNode.replaceChild(a.node,a.text),a.node.appendChild(a.text),
A&&8>D&&(a.node.style.zIndex=2));return a.node}function ve(a,b){var c=a.display.externalMeasured;return c&&c.line==b.line?(a.display.externalMeasured=null,b.measure=c.measure,c.built):re(a,b)}function jd(a,b){var c=b.bgClass?b.bgClass+" "+(b.line.bgClass||""):b.line.bgClass;c&&(c+=" CodeMirror-linebackground");if(b.background)c?b.background.className=c:(b.background.parentNode.removeChild(b.background),b.background=null);else if(c){var d=Ab(b);b.background=d.insertBefore(u("div",null,c),d.firstChild);
a.display.input.setUneditable(b.background)}b.line.wrapClass?Ab(b).className=b.line.wrapClass:b.node!=b.text&&(b.node.className="");b.text.className=(b.textClass?b.textClass+" "+(b.line.textClass||""):b.line.textClass)||""}function we(a,b,c,d){b.gutter&&(b.node.removeChild(b.gutter),b.gutter=null);b.gutterBackground&&(b.node.removeChild(b.gutterBackground),b.gutterBackground=null);if(b.line.gutterClass){var e=Ab(b);b.gutterBackground=u("div",null,"CodeMirror-gutter-background "+b.line.gutterClass,
"left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px; width: "+d.gutterTotalWidth+"px");a.display.input.setUneditable(b.gutterBackground);e.insertBefore(b.gutterBackground,b.text)}e=b.line.gutterMarkers;if(a.options.lineNumbers||e){var f=Ab(b),g=b.gutter=u("div",null,"CodeMirror-gutter-wrapper","left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px");a.display.input.setUneditable(g);f.insertBefore(g,b.text);b.line.gutterClass&&(g.className+=" "+b.line.gutterClass);!a.options.lineNumbers||
e&&e["CodeMirror-linenumbers"]||(b.lineNumber=g.appendChild(u("div",Uc(a.options,c),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+d.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+a.display.lineNumInnerWidth+"px")));if(e)for(b=0;b<a.options.gutters.length;++b)c=a.options.gutters[b],(f=e.hasOwnProperty(c)&&e[c])&&g.appendChild(u("div",[f],"CodeMirror-gutter-elt","left: "+d.gutterLeft[c]+"px; width: "+d.gutterWidth[c]+"px"))}}function Bg(a,b,c,d){var e=ve(a,b);b.text=b.node=e.pre;e.bgClass&&
(b.bgClass=e.bgClass);e.textClass&&(b.textClass=e.textClass);jd(a,b);we(a,b,c,d);xe(a,b,d);return b.node}function xe(a,b,c){ye(a,b.line,b,c,!0);if(b.rest)for(var d=0;d<b.rest.length;d++)ye(a,b.rest[d],b,c,!1)}function ye(a,b,c,d,e){if(b.widgets){var f=Ab(c),g=0;for(b=b.widgets;g<b.length;++g){var h=b[g],k=u("div",[h.node],"CodeMirror-linewidget");h.handleMouseEvents||k.setAttribute("cm-ignore-events","true");var l=h,m=k,p=d;if(l.noHScroll){(c.alignable||(c.alignable=[])).push(m);var n=p.wrapperWidth;
m.style.left=p.fixedPos+"px";l.coverGutter||(n-=p.gutterTotalWidth,m.style.paddingLeft=p.gutterTotalWidth+"px");m.style.width=n+"px"}l.coverGutter&&(m.style.zIndex=5,m.style.position="relative",l.noHScroll||(m.style.marginLeft=-p.gutterTotalWidth+"px"));a.display.input.setUneditable(k);e&&h.above?f.insertBefore(k,c.gutter||c.text):f.appendChild(k);N(h,"redraw")}}}function Bb(a){if(null!=a.height)return a.height;var b=a.doc.cm;if(!b)return 0;if(!xa(document.body,a.node)){var c="position: relative;";
a.coverGutter&&(c+="margin-left: -"+b.display.gutters.offsetWidth+"px;");a.noHScroll&&(c+="width: "+b.display.wrapper.clientWidth+"px;");Z(b.display.measure,u("div",[a.node],null,c))}return a.height=a.node.parentNode.offsetHeight}function va(a,b){for(var c=b.target||b.srcElement;c!=a.wrapper;c=c.parentNode)if(!c||1==c.nodeType&&"true"==c.getAttribute("cm-ignore-events")||c.parentNode==a.sizer&&c!=a.mover)return!0}function kd(a){return a.mover.offsetHeight-a.lineSpace.offsetHeight}function ze(a){if(a.cachedPaddingH)return a.cachedPaddingH;
var b=Z(a.measure,u("pre","x")),b=window.getComputedStyle?window.getComputedStyle(b):b.currentStyle,b={left:parseInt(b.paddingLeft),right:parseInt(b.paddingRight)};isNaN(b.left)||isNaN(b.right)||(a.cachedPaddingH=b);return b}function qa(a){return 30-a.display.nativeBarWidth}function La(a){return a.display.scroller.clientWidth-qa(a)-a.display.barWidth}function ld(a){return a.display.scroller.clientHeight-qa(a)-a.display.barHeight}function Ae(a,b,c){if(a.line==b)return{map:a.measure.map,cache:a.measure.cache};
for(var d=0;d<a.rest.length;d++)if(a.rest[d]==b)return{map:a.measure.maps[d],cache:a.measure.caches[d]};for(b=0;b<a.rest.length;b++)if(B(a.rest[b])>c)return{map:a.measure.maps[b],cache:a.measure.caches[b],before:!0}}function md(a,b){if(b>=a.display.viewFrom&&b<a.display.viewTo)return a.display.view[Ma(a,b)];var c=a.display.externalMeasured;if(c&&b>=c.lineN&&b<c.lineN+c.size)return c}function Na(a,b){var c=B(b),d=md(a,c);d&&!d.text?d=null:d&&d.changes&&(ue(a,d,c,nd(a)),a.curOp.forceUpdate=!0);if(!d){var e;
e=na(b);d=B(e);e=a.display.externalMeasured=new te(a.doc,e,d);e.lineN=d;d=e.built=re(a,e);e.text=d.pre;Z(a.display.lineMeasure,d.pre);d=e}c=Ae(d,b,c);return{line:b,view:d,rect:null,map:c.map,cache:c.cache,before:c.before,hasHeights:!1}}function ia(a,b,c,d,e){b.before&&(c=-1);var f=c+(d||"");if(b.cache.hasOwnProperty(f))a=b.cache[f];else{b.rect||(b.rect=b.view.text.getBoundingClientRect());if(!b.hasHeights){var g=b.view,h=b.rect,k=a.options.lineWrapping,l=k&&La(a);if(!g.measure.heights||k&&g.measure.width!=
l){var m=g.measure.heights=[];if(k)for(g.measure.width=l,g=g.text.firstChild.getClientRects(),k=0;k<g.length-1;k++){var l=g[k],p=g[k+1];2<Math.abs(l.bottom-p.bottom)&&m.push((l.bottom+p.top)/2-h.top)}m.push(h.bottom-h.top)}b.hasHeights=!0}m=d;g=Be(b.map,c,m);d=g.node;h=g.start;k=g.end;c=g.collapse;var n;if(3==d.nodeType){for(var r=0;4>r;r++){for(;h&&Sc(b.line.text.charAt(g.coverStart+h));)--h;for(;g.coverStart+k<g.coverEnd&&Sc(b.line.text.charAt(g.coverStart+k));)++k;if(A&&9>D&&0==h&&k==g.coverEnd-
g.coverStart)n=d.parentNode.getBoundingClientRect();else{n=db(d,h,k).getClientRects();k=Ce;if("left"==m)for(l=0;l<n.length&&(k=n[l]).left==k.right;l++);else for(l=n.length-1;0<=l&&(k=n[l]).left==k.right;l--);n=k}if(n.left||n.right||0==h)break;k=h;--h;c="right"}A&&11>D&&((r=!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==screen.deviceXDPI)||(null!=od?r=od:(m=Z(a.display.measure,u("span","x")),r=m.getBoundingClientRect(),m=db(m,0,1).getBoundingClientRect(),r=od=1<Math.abs(r.left-m.left)),
r=!r),r||(r=screen.logicalXDPI/screen.deviceXDPI,m=screen.logicalYDPI/screen.deviceYDPI,n={left:n.left*r,right:n.right*r,top:n.top*m,bottom:n.bottom*m}))}else 0<h&&(c=m="right"),n=a.options.lineWrapping&&1<(r=d.getClientRects()).length?r["right"==m?r.length-1:0]:d.getBoundingClientRect();!(A&&9>D)||h||n&&(n.left||n.right)||(n=(n=d.parentNode.getClientRects()[0])?{left:n.left,right:n.left+Cb(a.display),top:n.top,bottom:n.bottom}:Ce);d=n.top-b.rect.top;h=n.bottom-b.rect.top;r=(d+h)/2;m=b.view.measure.heights;
for(g=0;g<m.length-1&&!(r<m[g]);g++);c={left:("right"==c?n.right:n.left)-b.rect.left,right:("left"==c?n.left:n.right)-b.rect.left,top:g?m[g-1]:0,bottom:m[g]};n.left||n.right||(c.bogus=!0);a.options.singleCursorHeightPerLine||(c.rtop=d,c.rbottom=h);a=c;a.bogus||(b.cache[f]=a)}return{left:a.left,right:a.right,top:e?a.rtop:a.top,bottom:e?a.rbottom:a.bottom}}function Be(a,b,c){for(var d,e,f,g,h,k,l=0;l<a.length;l+=3){h=a[l];k=a[l+1];if(b<h)e=0,f=1,g="left";else if(b<k)e=b-h,f=e+1;else if(l==a.length-
3||b==k&&a[l+3]>b)f=k-h,e=f-1,b>=k&&(g="right");if(null!=e){d=a[l+2];h==k&&c==(d.insertLeft?"left":"right")&&(g=c);if("left"==c&&0==e)for(;l&&a[l-2]==a[l-3]&&a[l-1].insertLeft;)d=a[(l-=3)+2],g="left";if("right"==c&&e==k-h)for(;l<a.length-3&&a[l+3]==a[l+4]&&!a[l+5].insertLeft;)d=a[(l+=3)+2],g="right";break}}return{node:d,start:e,end:f,collapse:g,coverStart:h,coverEnd:k}}function De(a){if(a.measure&&(a.measure.cache={},a.measure.heights=null,a.rest))for(var b=0;b<a.rest.length;b++)a.measure.caches[b]=
{}}function Ee(a){a.display.externalMeasure=null;ea(a.display.lineMeasure);for(var b=0;b<a.display.view.length;b++)De(a.display.view[b])}function Db(a){Ee(a);a.display.cachedCharWidth=a.display.cachedTextHeight=a.display.cachedPaddingH=null;a.options.lineWrapping||(a.display.maxLineChanged=!0);a.display.lineNumChars=null}function Fe(){return qc&&rc?-(document.body.getBoundingClientRect().left-parseInt(getComputedStyle(document.body).marginLeft)):window.pageXOffset||(document.documentElement||document.body).scrollLeft}
function Ge(){return qc&&rc?-(document.body.getBoundingClientRect().top-parseInt(getComputedStyle(document.body).marginTop)):window.pageYOffset||(document.documentElement||document.body).scrollTop}function pd(a){var b=0;if(a.widgets)for(var c=0;c<a.widgets.length;++c)a.widgets[c].above&&(b+=Bb(a.widgets[c]));return b}function sc(a,b,c,d,e){e||(e=pd(b),c.top+=e,c.bottom+=e);if("line"==d)return c;d||(d="local");b=oa(b);b="local"==d?b+a.display.lineSpace.offsetTop:b-a.display.viewOffset;if("page"==d||
"window"==d)a=a.display.lineSpace.getBoundingClientRect(),b+=a.top+("window"==d?0:Ge()),d=a.left+("window"==d?0:Fe()),c.left+=d,c.right+=d;c.top+=b;c.bottom+=b;return c}function He(a,b,c){if("div"==c)return b;var d=b.left;b=b.top;"page"==c?(d-=Fe(),b-=Ge()):"local"!=c&&c||(c=a.display.sizer.getBoundingClientRect(),d+=c.left,b+=c.top);a=a.display.lineSpace.getBoundingClientRect();return{left:d-a.left,top:b-a.top}}function qd(a,b,c,d,e){d||(d=t(a.doc,b.line));var f=d;b=b.ch;d=ia(a,Na(a,d),b,e);return sc(a,
f,d,c)}function ja(a,b,c,d,e,f){function g(b,g){var h=ia(a,e,b,g?"right":"left",f);g?h.left=h.right:h.right=h.left;return sc(a,d,h,c)}function h(a,b,d){return g(d?a-1:a,1==k[b].level!=d)}d=d||t(a.doc,b.line);e||(e=Na(a,d));var k=ua(d,a.doc.direction),l=b.ch;b=b.sticky;l>=d.text.length?(l=d.text.length,b="before"):0>=l&&(l=0,b="after");if(!k)return g("before"==b?l-1:l,"before"==b);var m=vb(k,l,b),p=wb,m=h(l,m,"before"==b);null!=p&&(m.other=h(l,p,"before"!=b));return m}function Ie(a,b){var c=0;b=x(a.doc,
b);a.options.lineWrapping||(c=Cb(a.display)*b.ch);var d=t(a.doc,b.line),e=oa(d)+a.display.lineSpace.offsetTop;return{left:c,right:c,top:e,bottom:e+d.height}}function rd(a,b,c,d,e){a=q(a,b,c);a.xRel=e;d&&(a.outside=!0);return a}function sd(a,b,c){var d=a.doc;c+=a.display.viewOffset;if(0>c)return rd(d.first,0,null,!0,-1);var e=Ja(d,c),f=d.first+d.size-1;if(e>f)return rd(d.first+d.size-1,t(d,f).text.length,null,!0,1);0>b&&(b=0);for(var g=t(d,e);;){var f=Cg(a,g,e,b,c),h;h=f.ch+(0<f.xRel?1:0);var g=ta&&
g.markedSpans,k=void 0;if(g)for(var l=0;l<g.length;++l){var m=g[l];m.marker.collapsed&&(null==m.from||m.from<h)&&(null==m.to||m.to>h)&&(!k||0>Yc(k,m.marker))&&(k=m.marker)}h=k;if(!h)return f;f=h.find(1);if(f.line==e)return f;g=t(d,e=f.line)}}function Je(a,b,c,d){d-=pd(b);b=b.text.length;var e=rb(function(b){return ia(a,c,b-1).bottom<=d},b,0);b=rb(function(b){return ia(a,c,b).top>d},e,b);return{begin:e,end:b}}function Ke(a,b,c,d){c||(c=Na(a,b));d=sc(a,b,ia(a,c,d),"line").top;return Je(a,b,c,d)}function td(a,
b,c,d){return a.bottom<=c?!1:a.top>c?!0:(d?a.left:a.right)>b}function Cg(a,b,c,d,e){e-=oa(b);var f=Na(a,b),g=pd(b),h=0,k=b.text.length,l=!0,m=ua(b,a.doc.direction);m&&(m=(a.options.lineWrapping?Dg:Eg)(a,b,c,f,m,d,e),h=(l=1!=m.level)?m.from:m.to-1,k=l?m.to:m.from-1);var p=null,n=null,m=rb(function(b){var c=ia(a,f,b);c.top+=g;c.bottom+=g;if(!td(c,d,e,!1))return!1;c.top<=e&&c.left<=d&&(p=b,n=c);return!0},h,k),r=!1;n?(h=d-n.left<n.right-d,l=h==l,m=p+(l?0:1),l=l?"after":"before",h=h?n.left:n.right):(l||
m!=k&&m!=h||m++,l=0==m?"after":m==b.text.length?"before":ia(a,f,m-(l?1:0)).bottom+g<=e==l?"after":"before",r=ja(a,q(c,m,l),"line",b,f),h=r.left,r=e<r.top||e>=r.bottom);m=Zd(b.text,m,1);return rd(c,m,l,r,d-h)}function Eg(a,b,c,d,e,f,g){var h=rb(function(h){h=e[h];var k=1!=h.level;return td(ja(a,q(c,k?h.to:h.from,k?"before":"after"),"line",b,d),f,g,!0)},0,e.length-1),k=e[h];if(0<h){var l=1!=k.level,l=ja(a,q(c,l?k.from:k.to,l?"after":"before"),"line",b,d);td(l,f,g,!0)&&l.top>g&&(k=e[h-1])}return k}function Dg(a,
b,c,d,e,f,g){g=Je(a,b,d,g);c=g.begin;g=g.end;/\s/.test(b.text.charAt(g-1))&&g--;for(var h=b=null,k=0;k<e.length;k++){var l=e[k];if(!(l.from>=g||l.to<=c)){var m=ia(a,d,1!=l.level?Math.min(g,l.to)-1:Math.max(c,l.from)).right,m=m<f?f-m+1E9:m-f;if(!b||h>m)b=l,h=m}}b||(b=e[e.length-1]);b.from<c&&(b={from:c,to:b.to,level:b.level});b.to>g&&(b={from:b.from,to:g,level:b.level});return b}function Oa(a){if(null!=a.cachedTextHeight)return a.cachedTextHeight;if(null==Pa){Pa=u("pre");for(var b=0;49>b;++b)Pa.appendChild(document.createTextNode("x")),
Pa.appendChild(u("br"));Pa.appendChild(document.createTextNode("x"))}Z(a.measure,Pa);b=Pa.offsetHeight/50;3<b&&(a.cachedTextHeight=b);ea(a.measure);return b||1}function Cb(a){if(null!=a.cachedCharWidth)return a.cachedCharWidth;var b=u("span","xxxxxxxxxx"),c=u("pre",[b]);Z(a.measure,c);b=b.getBoundingClientRect();b=(b.right-b.left)/10;2<b&&(a.cachedCharWidth=b);return b||10}function nd(a){for(var b=a.display,c={},d={},e=b.gutters.clientLeft,f=b.gutters.firstChild,g=0;f;f=f.nextSibling,++g)c[a.options.gutters[g]]=
f.offsetLeft+f.clientLeft+e,d[a.options.gutters[g]]=f.clientWidth;return{fixedPos:ud(b),gutterTotalWidth:b.gutters.offsetWidth,gutterLeft:c,gutterWidth:d,wrapperWidth:b.wrapper.clientWidth}}function ud(a){return a.scroller.getBoundingClientRect().left-a.sizer.getBoundingClientRect().left}function Le(a){var b=Oa(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/Cb(a.display)-3);return function(e){if(za(a.doc,e))return 0;var f=0;if(e.widgets)for(var g=0;g<e.widgets.length;g++)e.widgets[g].height&&
(f+=e.widgets[g].height);return c?f+(Math.ceil(e.text.length/d)||1)*b:f+b}}function vd(a){var b=a.doc,c=Le(a);b.iter(function(a){var b=c(a);b!=a.height&&ma(a,b)})}function Qa(a,b,c,d){var e=a.display;if(!c&&"true"==(b.target||b.srcElement).getAttribute("cm-not-content"))return null;var f,g;c=e.lineSpace.getBoundingClientRect();try{f=b.clientX-c.left,g=b.clientY-c.top}catch(k){return null}b=sd(a,f,g);var h;d&&1==b.xRel&&(h=t(a.doc,b.line).text).length==b.ch&&(d=fa(h,h.length,a.options.tabSize)-h.length,
b=q(b.line,Math.max(0,Math.round((f-ze(a.display).left)/Cb(a.display))-d)));return b}function Ma(a,b){if(b>=a.display.viewTo)return null;b-=a.display.viewFrom;if(0>b)return null;for(var c=a.display.view,d=0;d<c.length;d++)if(b-=c[d].size,0>b)return d}function Eb(a){a.display.input.showSelection(a.display.input.prepareSelection())}function Me(a,b){void 0===b&&(b=!0);for(var c=a.doc,d={},e=d.cursors=document.createDocumentFragment(),f=d.selection=document.createDocumentFragment(),g=0;g<c.sel.ranges.length;g++)if(b||
g!=c.sel.primIndex){var h=c.sel.ranges[g];if(!(h.from().line>=a.display.viewTo||h.to().line<a.display.viewFrom)){var k=h.empty();(k||a.options.showCursorWhenSelecting)&&Ne(a,h.head,e);k||Fg(a,h,f)}}return d}function Ne(a,b,c){b=ja(a,b,"div",null,null,!a.options.singleCursorHeightPerLine);var d=c.appendChild(u("div"," ","CodeMirror-cursor"));d.style.left=b.left+"px";d.style.top=b.top+"px";d.style.height=Math.max(0,b.bottom-b.top)*a.options.cursorHeight+"px";b.other&&(a=c.appendChild(u("div"," ","CodeMirror-cursor CodeMirror-secondarycursor")),
a.style.display="",a.style.left=b.other.left+"px",a.style.top=b.other.top+"px",a.style.height=.85*(b.other.bottom-b.other.top)+"px")}function tc(a,b){return a.top-b.top||a.left-b.left}function Fg(a,b,c){function d(a,b,d,c){0>b&&(b=0);b=Math.round(b);c=Math.round(c);h.appendChild(u("div",null,"CodeMirror-selected","position: absolute; left: "+a+"px;\n                             top: "+b+"px; width: "+(null==d?m-a:d)+"px;\n                             height: "+(c-b)+"px"))}function e(b,c,e){function f(c,
d){return qd(a,q(b,c),"div",k,d)}function h(b,c,d){b=Ke(a,k,null,b);c="ltr"==c==("after"==d)?"left":"right";d="after"==d?b.begin:b.end-(/\s/.test(k.text.charAt(b.end-1))?2:1);return f(d,c)[c]}var k=t(g,b),n=k.text.length,u,v,y=ua(k,g.direction);ng(y,c||0,null==e?n:e,function(a,b,g,k){var r="ltr"==g,q=f(a,r?"left":"right"),t=f(b-1,r?"right":"left"),x=null==c&&0==a,w=null==e&&b==n,z=0==k;k=!y||k==y.length-1;3>=t.top-q.top?(b=(p?x:w)&&z?l:(r?q:t).left,d(b,q.top,((p?w:x)&&k?m:(r?t:q).right)-b,q.bottom)):
(r?(r=p&&x&&z?l:q.left,x=p?m:h(a,g,"before"),a=p?l:h(b,g,"after"),w=p&&w&&k?m:t.right):(r=p?h(a,g,"before"):l,x=!p&&x&&z?m:q.right,a=!p&&w&&k?l:t.left,w=p?h(b,g,"after"):m),d(r,q.top,x-r,q.bottom),q.bottom<t.top&&d(l,q.bottom,null,t.top),d(a,t.top,w-a,t.bottom));if(!u||0>tc(q,u))u=q;0>tc(t,u)&&(u=t);if(!v||0>tc(q,v))v=q;0>tc(t,v)&&(v=t)});return{start:u,end:v}}var f=a.display,g=a.doc,h=document.createDocumentFragment(),k=ze(a.display),l=k.left,m=Math.max(f.sizerWidth,La(a)-f.sizer.offsetLeft)-k.right,
p="ltr"==g.direction,f=b.from();b=b.to();if(f.line==b.line)e(f.line,f.ch,b.ch);else{var n=t(g,f.line),k=t(g,b.line),k=na(n)==na(k),f=e(f.line,f.ch,k?n.text.length+1:null).end;b=e(b.line,k?0:null,b.ch).start;k&&(f.top<b.top-2?(d(f.right,f.top,null,f.bottom),d(l,b.top,b.left,b.bottom)):d(f.right,f.top,b.left-f.right,f.bottom));f.bottom<b.top&&d(l,f.bottom,null,b.top)}c.appendChild(h)}function wd(a){if(a.state.focused){var b=a.display;clearInterval(b.blinker);var c=!0;b.cursorDiv.style.visibility="";
0<a.options.cursorBlinkRate?b.blinker=setInterval(function(){return b.cursorDiv.style.visibility=(c=!c)?"":"hidden"},a.options.cursorBlinkRate):0>a.options.cursorBlinkRate&&(b.cursorDiv.style.visibility="hidden")}}function Oe(a){a.state.focused||(a.display.input.focus(),xd(a))}function Pe(a){a.state.delayingBlurEvent=!0;setTimeout(function(){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1,Fb(a))},100)}function xd(a,b){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1);"nocursor"!=
a.options.readOnly&&(a.state.focused||(F(a,"focus",a,b),a.state.focused=!0,Ga(a.display.wrapper,"CodeMirror-focused"),a.curOp||a.display.selForContextMenu==a.doc.sel||(a.display.input.reset(),P&&setTimeout(function(){return a.display.input.reset(!0)},20)),a.display.input.receivedFocus()),wd(a))}function Fb(a,b){a.state.delayingBlurEvent||(a.state.focused&&(F(a,"blur",a,b),a.state.focused=!1,Ra(a.display.wrapper,"CodeMirror-focused")),clearInterval(a.display.blinker),setTimeout(function(){a.state.focused||
(a.display.shift=!1)},150))}function uc(a){a=a.display;for(var b=a.lineDiv.offsetTop,c=0;c<a.view.length;c++){var d=a.view[c],e=void 0;if(!d.hidden){if(A&&8>D)var f=d.node.offsetTop+d.node.offsetHeight,e=f-b,b=f;else e=d.node.getBoundingClientRect(),e=e.bottom-e.top;f=d.line.height-e;2>e&&(e=Oa(a));if(.005<f||-.005>f)if(ma(d.line,e),Qe(d.line),d.rest)for(e=0;e<d.rest.length;e++)Qe(d.rest[e])}}}function Qe(a){if(a.widgets)for(var b=0;b<a.widgets.length;++b){var c=a.widgets[b],d=c.node.parentNode;d&&
(c.height=d.offsetHeight)}}function yd(a,b,c){var d=c&&null!=c.top?Math.max(0,c.top):a.scroller.scrollTop,d=Math.floor(d-a.lineSpace.offsetTop),e=c&&null!=c.bottom?c.bottom:d+a.wrapper.clientHeight,d=Ja(b,d),e=Ja(b,e);if(c&&c.ensure){var f=c.ensure.from.line;c=c.ensure.to.line;f<d?(d=f,e=Ja(b,oa(t(b,f))+a.wrapper.clientHeight)):Math.min(c,b.lastLine())>=e&&(d=Ja(b,oa(t(b,c))-a.wrapper.clientHeight),e=c)}return{from:d,to:Math.max(e,d+1)}}function Re(a){var b=a.display,c=b.view;if(b.alignWidgets||b.gutters.firstChild&&
a.options.fixedGutter){for(var d=ud(b)-b.scroller.scrollLeft+a.doc.scrollLeft,e=b.gutters.offsetWidth,f=d+"px",g=0;g<c.length;g++)if(!c[g].hidden){a.options.fixedGutter&&(c[g].gutter&&(c[g].gutter.style.left=f),c[g].gutterBackground&&(c[g].gutterBackground.style.left=f));var h=c[g].alignable;if(h)for(var k=0;k<h.length;k++)h[k].style.left=f}a.options.fixedGutter&&(b.gutters.style.left=d+e+"px")}}function Se(a){if(!a.options.lineNumbers)return!1;var b=a.doc,b=Uc(a.options,b.first+b.size-1),c=a.display;
if(b.length!=c.lineNumChars){var d=c.measure.appendChild(u("div",[u("div",b)],"CodeMirror-linenumber CodeMirror-gutter-elt")),e=d.firstChild.offsetWidth,d=d.offsetWidth-e;c.lineGutter.style.width="";c.lineNumInnerWidth=Math.max(e,c.lineGutter.offsetWidth-d)+1;c.lineNumWidth=c.lineNumInnerWidth+d;c.lineNumChars=c.lineNumInnerWidth?b.length:-1;c.lineGutter.style.width=c.lineNumWidth+"px";zd(a);return!0}return!1}function Ad(a,b){var c=a.display,d=Oa(a.display);0>b.top&&(b.top=0);var e=a.curOp&&null!=
a.curOp.scrollTop?a.curOp.scrollTop:c.scroller.scrollTop,f=ld(a),g={};b.bottom-b.top>f&&(b.bottom=b.top+f);var h=a.doc.height+kd(c),k=b.top<d,d=b.bottom>h-d;b.top<e?g.scrollTop=k?0:b.top:b.bottom>e+f&&(f=Math.min(b.top,(d?h:b.bottom)-f),f!=e&&(g.scrollTop=f));e=a.curOp&&null!=a.curOp.scrollLeft?a.curOp.scrollLeft:c.scroller.scrollLeft;c=La(a)-(a.options.fixedGutter?c.gutters.offsetWidth:0);if(f=b.right-b.left>c)b.right=b.left+c;10>b.left?g.scrollLeft=0:b.left<e?g.scrollLeft=Math.max(0,b.left-(f?0:
10)):b.right>c+e-3&&(g.scrollLeft=b.right+(f?0:10)-c);return g}function vc(a,b){null!=b&&(wc(a),a.curOp.scrollTop=(null==a.curOp.scrollTop?a.doc.scrollTop:a.curOp.scrollTop)+b)}function fb(a){wc(a);var b=a.getCursor();a.curOp.scrollToPos={from:b,to:b,margin:a.options.cursorScrollMargin}}function Gb(a,b,c){null==b&&null==c||wc(a);null!=b&&(a.curOp.scrollLeft=b);null!=c&&(a.curOp.scrollTop=c)}function wc(a){var b=a.curOp.scrollToPos;if(b){a.curOp.scrollToPos=null;var c=Ie(a,b.from),d=Ie(a,b.to);Te(a,
c,d,b.margin)}}function Te(a,b,c,d){b=Ad(a,{left:Math.min(b.left,c.left),top:Math.min(b.top,c.top)-d,right:Math.max(b.right,c.right),bottom:Math.max(b.bottom,c.bottom)+d});Gb(a,b.scrollLeft,b.scrollTop)}function Hb(a,b){2>Math.abs(a.doc.scrollTop-b)||(ya||Bd(a,{top:b}),Ue(a,b,!0),ya&&Bd(a),Ib(a,100))}function Ue(a,b,c){b=Math.min(a.display.scroller.scrollHeight-a.display.scroller.clientHeight,b);if(a.display.scroller.scrollTop!=b||c)a.doc.scrollTop=b,a.display.scrollbars.setScrollTop(b),a.display.scroller.scrollTop!=
b&&(a.display.scroller.scrollTop=b)}function Sa(a,b,c,d){b=Math.min(b,a.display.scroller.scrollWidth-a.display.scroller.clientWidth);(c?b==a.doc.scrollLeft:2>Math.abs(a.doc.scrollLeft-b))&&!d||(a.doc.scrollLeft=b,Re(a),a.display.scroller.scrollLeft!=b&&(a.display.scroller.scrollLeft=b),a.display.scrollbars.setScrollLeft(b))}function Jb(a){var b=a.display,c=b.gutters.offsetWidth,d=Math.round(a.doc.height+kd(a.display));return{clientHeight:b.scroller.clientHeight,viewHeight:b.wrapper.clientHeight,scrollWidth:b.scroller.scrollWidth,
clientWidth:b.scroller.clientWidth,viewWidth:b.wrapper.clientWidth,barLeft:a.options.fixedGutter?c:0,docHeight:d,scrollHeight:d+qa(a)+b.barHeight,nativeBarWidth:b.nativeBarWidth,gutterWidth:c}}function gb(a,b){b||(b=Jb(a));var c=a.display.barWidth,d=a.display.barHeight;Ve(a,b);for(var e=0;4>e&&c!=a.display.barWidth||d!=a.display.barHeight;e++)c!=a.display.barWidth&&a.options.lineWrapping&&uc(a),Ve(a,Jb(a)),c=a.display.barWidth,d=a.display.barHeight}function Ve(a,b){var c=a.display,d=c.scrollbars.update(b);
c.sizer.style.paddingRight=(c.barWidth=d.right)+"px";c.sizer.style.paddingBottom=(c.barHeight=d.bottom)+"px";c.heightForcer.style.borderBottom=d.bottom+"px solid transparent";d.right&&d.bottom?(c.scrollbarFiller.style.display="block",c.scrollbarFiller.style.height=d.bottom+"px",c.scrollbarFiller.style.width=d.right+"px"):c.scrollbarFiller.style.display="";d.bottom&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(c.gutterFiller.style.display="block",c.gutterFiller.style.height=d.bottom+
"px",c.gutterFiller.style.width=b.gutterWidth+"px"):c.gutterFiller.style.display=""}function We(a){a.display.scrollbars&&(a.display.scrollbars.clear(),a.display.scrollbars.addClass&&Ra(a.display.wrapper,a.display.scrollbars.addClass));a.display.scrollbars=new Xe[a.options.scrollbarStyle](function(b){a.display.wrapper.insertBefore(b,a.display.scrollbarFiller);v(b,"mousedown",function(){a.state.focused&&setTimeout(function(){return a.display.input.focus()},0)});b.setAttribute("cm-not-content","true")},
function(b,c){"horizontal"==c?Sa(a,b):Hb(a,b)},a);a.display.scrollbars.addClass&&Ga(a.display.wrapper,a.display.scrollbars.addClass)}function Ta(a){a.curOp={cm:a,viewChanged:!1,startHeight:a.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++Gg};a=a.curOp;eb?eb.ops.push(a):a.ownsGroup=eb={ops:[a],delayedCallbacks:[]}}function Ua(a){zg(a.curOp,
function(a){for(var c=0;c<a.ops.length;c++)a.ops[c].cm.curOp=null;a=a.ops;for(c=0;c<a.length;c++){var d=a[c],e=d.cm,f=e.display,g=e.display;!g.scrollbarsClipped&&g.scroller.offsetWidth&&(g.nativeBarWidth=g.scroller.offsetWidth-g.scroller.clientWidth,g.heightForcer.style.height=qa(e)+"px",g.sizer.style.marginBottom=-g.nativeBarWidth+"px",g.sizer.style.borderRightWidth=qa(e)+"px",g.scrollbarsClipped=!0);d.updateMaxLine&&ad(e);d.mustUpdate=d.viewChanged||d.forceUpdate||null!=d.scrollTop||d.scrollToPos&&
(d.scrollToPos.from.line<f.viewFrom||d.scrollToPos.to.line>=f.viewTo)||f.maxLineChanged&&e.options.lineWrapping;d.update=d.mustUpdate&&new xc(e,d.mustUpdate&&{top:d.scrollTop,ensure:d.scrollToPos},d.forceUpdate)}for(c=0;c<a.length;c++)d=a[c],d.updatedDisplay=d.mustUpdate&&Cd(d.cm,d.update);for(c=0;c<a.length;c++)if(d=a[c],e=d.cm,f=e.display,d.updatedDisplay&&uc(e),d.barMeasure=Jb(e),f.maxLineChanged&&!e.options.lineWrapping&&(g=void 0,g=f.maxLine.text.length,g=ia(e,Na(e,f.maxLine),g,void 0),d.adjustWidthTo=
g.left+3,e.display.sizerWidth=d.adjustWidthTo,d.barMeasure.scrollWidth=Math.max(f.scroller.clientWidth,f.sizer.offsetLeft+d.adjustWidthTo+qa(e)+e.display.barWidth),d.maxScrollLeft=Math.max(0,f.sizer.offsetLeft+d.adjustWidthTo-La(e))),d.updatedDisplay||d.selectionChanged)d.preparedSelection=f.input.prepareSelection();for(c=0;c<a.length;c++)d=a[c],e=d.cm,null!=d.adjustWidthTo&&(e.display.sizer.style.minWidth=d.adjustWidthTo+"px",d.maxScrollLeft<e.doc.scrollLeft&&Sa(e,Math.min(e.display.scroller.scrollLeft,
d.maxScrollLeft),!0),e.display.maxLineChanged=!1),f=d.focus&&d.focus==sa(),d.preparedSelection&&e.display.input.showSelection(d.preparedSelection,f),(d.updatedDisplay||d.startHeight!=e.doc.height)&&gb(e,d.barMeasure),d.updatedDisplay&&Dd(e,d.barMeasure),d.selectionChanged&&wd(e),e.state.focused&&d.updateInput&&e.display.input.reset(d.typing),f&&Oe(d.cm);for(c=0;c<a.length;c++){d=a[c];e=d.cm;f=e.display;g=e.doc;d.updatedDisplay&&Ye(e,d.update);null==f.wheelStartX||null==d.scrollTop&&null==d.scrollLeft&&
!d.scrollToPos||(f.wheelStartX=f.wheelStartY=null);null!=d.scrollTop&&Ue(e,d.scrollTop,d.forceScroll);null!=d.scrollLeft&&Sa(e,d.scrollLeft,!0,!0);if(d.scrollToPos){var h=x(g,d.scrollToPos.from),k=x(g,d.scrollToPos.to),l=d.scrollToPos.margin;null==l&&(l=0);var m=void 0;e.options.lineWrapping||h!=k||(h=h.ch?q(h.line,"before"==h.sticky?h.ch-1:h.ch,"after"):h,k="before"==h.sticky?q(h.line,h.ch+1,"before"):h);for(var p=0;5>p;p++){var n=!1,m=ja(e,h),r=k&&k!=h?ja(e,k):m,m={left:Math.min(m.left,r.left),
top:Math.min(m.top,r.top)-l,right:Math.max(m.left,r.left),bottom:Math.max(m.bottom,r.bottom)+l},r=Ad(e,m),W=e.doc.scrollTop,t=e.doc.scrollLeft;null!=r.scrollTop&&(Hb(e,r.scrollTop),1<Math.abs(e.doc.scrollTop-W)&&(n=!0));null!=r.scrollLeft&&(Sa(e,r.scrollLeft),1<Math.abs(e.doc.scrollLeft-t)&&(n=!0));if(!n)break}k=m;I(e,"scrollCursorIntoView")||(l=e.display,p=l.sizer.getBoundingClientRect(),h=null,0>k.top+p.top?h=!0:k.bottom+p.top>(window.innerHeight||document.documentElement.clientHeight)&&(h=!1),
null==h||Hg||(k=u("div","​",null,"position: absolute;\n                         top: "+(k.top-l.viewOffset-e.display.lineSpace.offsetTop)+"px;\n                         height: "+(k.bottom-k.top+qa(e)+l.barHeight)+"px;\n                         left: "+k.left+"px; width: "+Math.max(2,k.right-k.left)+"px;"),e.display.lineSpace.appendChild(k),k.scrollIntoView(h),e.display.lineSpace.removeChild(k)))}k=d.maybeHiddenMarkers;h=d.maybeUnhiddenMarkers;if(k)for(l=0;l<k.length;++l)k[l].lines.length||F(k[l],
"hide");if(h)for(k=0;k<h.length;++k)h[k].lines.length&&F(h[k],"unhide");f.wrapper.offsetHeight&&(g.scrollTop=e.display.scroller.scrollTop);d.changeObjs&&F(e,"changes",e,d.changeObjs);d.update&&d.update.finish()}})}function Y(a,b){if(a.curOp)return b();Ta(a);try{return b()}finally{Ua(a)}}function J(a,b){return function(){if(a.curOp)return b.apply(a,arguments);Ta(a);try{return b.apply(a,arguments)}finally{Ua(a)}}}function R(a){return function(){if(this.curOp)return a.apply(this,arguments);Ta(this);
try{return a.apply(this,arguments)}finally{Ua(this)}}}function K(a){return function(){var b=this.cm;if(!b||b.curOp)return a.apply(this,arguments);Ta(b);try{return a.apply(this,arguments)}finally{Ua(b)}}}function U(a,b,c,d){null==b&&(b=a.doc.first);null==c&&(c=a.doc.first+a.doc.size);d||(d=0);var e=a.display;d&&c<e.viewTo&&(null==e.updateLineNumbers||e.updateLineNumbers>b)&&(e.updateLineNumbers=b);a.curOp.viewChanged=!0;if(b>=e.viewTo)ta&&Zc(a.doc,b)<e.viewTo&&Aa(a);else if(c<=e.viewFrom)ta&&ee(a.doc,
c+d)>e.viewFrom?Aa(a):(e.viewFrom+=d,e.viewTo+=d);else if(b<=e.viewFrom&&c>=e.viewTo)Aa(a);else if(b<=e.viewFrom){var f=yc(a,c,c+d,1);f?(e.view=e.view.slice(f.index),e.viewFrom=f.lineN,e.viewTo+=d):Aa(a)}else if(c>=e.viewTo)(f=yc(a,b,b,-1))?(e.view=e.view.slice(0,f.index),e.viewTo=f.lineN):Aa(a);else{var f=yc(a,b,b,-1),g=yc(a,c,c+d,1);f&&g?(e.view=e.view.slice(0,f.index).concat(pc(a,f.lineN,g.lineN)).concat(e.view.slice(g.index)),e.viewTo+=d):Aa(a)}if(a=e.externalMeasured)c<a.lineN?a.lineN+=d:b<a.lineN+
a.size&&(e.externalMeasured=null)}function Ba(a,b,c){a.curOp.viewChanged=!0;var d=a.display,e=a.display.externalMeasured;e&&b>=e.lineN&&b<e.lineN+e.size&&(d.externalMeasured=null);b<d.viewFrom||b>=d.viewTo||(a=d.view[Ma(a,b)],null!=a.node&&(a=a.changes||(a.changes=[]),-1==L(a,c)&&a.push(c)))}function Aa(a){a.display.viewFrom=a.display.viewTo=a.doc.first;a.display.view=[];a.display.viewOffset=0}function yc(a,b,c,d){var e=Ma(a,b),f=a.display.view;if(!ta||c==a.doc.first+a.doc.size)return{index:e,lineN:c};
for(var g=a.display.viewFrom,h=0;h<e;h++)g+=f[h].size;if(g!=b){if(0<d){if(e==f.length-1)return null;b=g+f[e].size-b;e++}else b=g-b;c+=b}for(;Zc(a.doc,c)!=c;){if(e==(0>d?0:f.length-1))return null;c+=d*f[e-(0>d?1:0)].size;e+=d}return{index:e,lineN:c}}function Ze(a){a=a.display.view;for(var b=0,c=0;c<a.length;c++){var d=a[c];d.hidden||d.node&&!d.changes||++b}return b}function Ib(a,b){a.doc.highlightFrontier<a.display.viewTo&&a.state.highlight.set(b,Oc(Ig,a))}function Ig(a){var b=a.doc;if(!(b.highlightFrontier>=
a.display.viewTo)){var c=+new Date+a.options.workTime,d=yb(a,b.highlightFrontier),e=[];b.iter(d.line,Math.min(b.first+b.size,a.display.viewTo+500),function(f){if(d.line>=a.display.viewFrom){var g=f.styles,h=f.text.length>a.options.maxHighlightLength?Ka(b.mode,d.state):null,k=je(a,f,d,!0);h&&(d.state=h);f.styles=k.styles;h=f.styleClasses;(k=k.classes)?f.styleClasses=k:h&&(f.styleClasses=null);k=!g||g.length!=f.styles.length||h!=k&&(!h||!k||h.bgClass!=k.bgClass||h.textClass!=k.textClass);for(h=0;!k&&
h<g.length;++h)k=g[h]!=f.styles[h];k&&e.push(d.line);f.stateAfter=d.save()}else f.text.length<=a.options.maxHighlightLength&&gd(a,f.text,d),f.stateAfter=0==d.line%5?d.save():null;d.nextLine();if(+new Date>c)return Ib(a,a.options.workDelay),!0});b.highlightFrontier=d.line;b.modeFrontier=Math.max(b.modeFrontier,d.line);e.length&&Y(a,function(){for(var b=0;b<e.length;b++)Ba(a,e[b],"text")})}}function Cd(a,b){var c=a.display,d=a.doc;if(b.editorIsHidden)return Aa(a),!1;if(!b.force&&b.visible.from>=c.viewFrom&&
b.visible.to<=c.viewTo&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo)&&c.renderedView==c.view&&0==Ze(a))return!1;Se(a)&&(Aa(a),b.dims=nd(a));var e=d.first+d.size,f=Math.max(b.visible.from-a.options.viewportMargin,d.first),g=Math.min(e,b.visible.to+a.options.viewportMargin);c.viewFrom<f&&20>f-c.viewFrom&&(f=Math.max(d.first,c.viewFrom));c.viewTo>g&&20>c.viewTo-g&&(g=Math.min(e,c.viewTo));ta&&(f=Zc(a.doc,f),g=ee(a.doc,g));d=f!=c.viewFrom||g!=c.viewTo||c.lastWrapHeight!=b.wrapperHeight||
c.lastWrapWidth!=b.wrapperWidth;e=a.display;0==e.view.length||f>=e.viewTo||g<=e.viewFrom?(e.view=pc(a,f,g),e.viewFrom=f):(e.viewFrom>f?e.view=pc(a,f,e.viewFrom).concat(e.view):e.viewFrom<f&&(e.view=e.view.slice(Ma(a,f))),e.viewFrom=f,e.viewTo<g?e.view=e.view.concat(pc(a,e.viewTo,g)):e.viewTo>g&&(e.view=e.view.slice(0,Ma(a,g))));e.viewTo=g;c.viewOffset=oa(t(a.doc,c.viewFrom));a.display.mover.style.top=c.viewOffset+"px";g=Ze(a);if(!d&&0==g&&!b.force&&c.renderedView==c.view&&(null==c.updateLineNumbers||
c.updateLineNumbers>=c.viewTo))return!1;a.hasFocus()?f=null:(f=sa())&&xa(a.display.lineDiv,f)?(f={activeElt:f},window.getSelection&&(e=window.getSelection(),e.anchorNode&&e.extend&&xa(a.display.lineDiv,e.anchorNode)&&(f.anchorNode=e.anchorNode,f.anchorOffset=e.anchorOffset,f.focusNode=e.focusNode,f.focusOffset=e.focusOffset))):f=null;4<g&&(c.lineDiv.style.display="none");Jg(a,c.updateLineNumbers,b.dims);4<g&&(c.lineDiv.style.display="");c.renderedView=c.view;(g=f)&&g.activeElt&&g.activeElt!=sa()&&
(g.activeElt.focus(),g.anchorNode&&xa(document.body,g.anchorNode)&&xa(document.body,g.focusNode)&&(f=window.getSelection(),e=document.createRange(),e.setEnd(g.anchorNode,g.anchorOffset),e.collapse(!1),f.removeAllRanges(),f.addRange(e),f.extend(g.focusNode,g.focusOffset)));ea(c.cursorDiv);ea(c.selectionDiv);c.gutters.style.height=c.sizer.style.minHeight=0;d&&(c.lastWrapHeight=b.wrapperHeight,c.lastWrapWidth=b.wrapperWidth,Ib(a,400));c.updateLineNumbers=null;return!0}function Ye(a,b){for(var c=b.viewport,
d=!0;;d=!1){if(!d||!a.options.lineWrapping||b.oldDisplayWidth==La(a))if(c&&null!=c.top&&(c={top:Math.min(a.doc.height+kd(a.display)-ld(a),c.top)}),b.visible=yd(a.display,a.doc,c),b.visible.from>=a.display.viewFrom&&b.visible.to<=a.display.viewTo)break;if(!Cd(a,b))break;uc(a);d=Jb(a);Eb(a);gb(a,d);Dd(a,d);b.force=!1}b.signal(a,"update",a);if(a.display.viewFrom!=a.display.reportedViewFrom||a.display.viewTo!=a.display.reportedViewTo)b.signal(a,"viewportChange",a,a.display.viewFrom,a.display.viewTo),
a.display.reportedViewFrom=a.display.viewFrom,a.display.reportedViewTo=a.display.viewTo}function Bd(a,b){var c=new xc(a,b);if(Cd(a,c)){uc(a);Ye(a,c);var d=Jb(a);Eb(a);gb(a,d);Dd(a,d);c.finish()}}function Jg(a,b,c){function d(b){var c=b.nextSibling;P&&ha&&a.display.currentWheelTarget==b?b.style.display="none":b.parentNode.removeChild(b);return c}for(var e=a.display,f=a.options.lineNumbers,g=e.lineDiv,h=g.firstChild,k=e.view,e=e.viewFrom,l=0;l<k.length;l++){var m=k[l];if(!m.hidden)if(m.node&&m.node.parentNode==
g){for(;h!=m.node;)h=d(h);h=f&&null!=b&&b<=e&&m.lineNumber;m.changes&&(-1<L(m.changes,"gutter")&&(h=!1),ue(a,m,e,c));h&&(ea(m.lineNumber),m.lineNumber.appendChild(document.createTextNode(Uc(a.options,e))));h=m.node.nextSibling}else{var p=Bg(a,m,e,c);g.insertBefore(p,h)}e+=m.size}for(;h;)h=d(h)}function zd(a){a.display.sizer.style.marginLeft=a.display.gutters.offsetWidth+"px"}function Dd(a,b){a.display.sizer.style.minHeight=b.docHeight+"px";a.display.heightForcer.style.top=b.docHeight+"px";a.display.gutters.style.height=
b.docHeight+a.display.barHeight+qa(a)+"px"}function $e(a){var b=a.display.gutters,c=a.options.gutters;ea(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(u("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none";zd(a)}function Ed(a){var b=L(a.gutters,"CodeMirror-linenumbers");-1==b&&a.lineNumbers?a.gutters=a.gutters.concat(["CodeMirror-linenumbers"]):-1<b&&!a.lineNumbers&&(a.gutters=
a.gutters.slice(0),a.gutters.splice(b,1))}function af(a){var b=a.wheelDeltaX,c=a.wheelDeltaY;null==b&&a.detail&&a.axis==a.HORIZONTAL_AXIS&&(b=a.detail);null==c&&a.detail&&a.axis==a.VERTICAL_AXIS?c=a.detail:null==c&&(c=a.wheelDelta);return{x:b,y:c}}function Kg(a){a=af(a);a.x*=ba;a.y*=ba;return a}function bf(a,b){var c=af(b),d=c.x,c=c.y,e=a.display,f=e.scroller,g=f.scrollWidth>f.clientWidth,h=f.scrollHeight>f.clientHeight;if(d&&g||c&&h){if(c&&ha&&P){var g=b.target,k=e.view;a:for(;g!=f;g=g.parentNode)for(var l=
0;l<k.length;l++)if(k[l].node==g){a.display.currentWheelTarget=g;break a}}!d||ya||ka||null==ba?(c&&null!=ba&&(h=c*ba,g=a.doc.scrollTop,k=g+e.wrapper.clientHeight,0>h?g=Math.max(0,g+h-50):k=Math.min(a.doc.height,k+h+50),Bd(a,{top:g,bottom:k})),20>zc&&(null==e.wheelStartX?(e.wheelStartX=f.scrollLeft,e.wheelStartY=f.scrollTop,e.wheelDX=d,e.wheelDY=c,setTimeout(function(){if(null!=e.wheelStartX){var a=f.scrollLeft-e.wheelStartX,b=f.scrollTop-e.wheelStartY,a=b&&e.wheelDY&&b/e.wheelDY||a&&e.wheelDX&&a/
e.wheelDX;e.wheelStartX=e.wheelStartY=null;a&&(ba=(ba*zc+a)/(zc+1),++zc)}},200)):(e.wheelDX+=d,e.wheelDY+=c))):(c&&h&&Hb(a,Math.max(0,f.scrollTop+c*ba)),Sa(a,Math.max(0,f.scrollLeft+d*ba)),(!c||c&&h)&&T(b),e.wheelStartX=null)}}function la(a,b){var c=a[b];a.sort(function(a,b){return y(a.from(),b.from())});b=L(a,c);for(c=1;c<a.length;c++){var d=a[c],e=a[c-1];if(0<=y(e.to(),d.from())){var f=jc(e.from(),d.from()),g=ic(e.to(),d.to()),d=e.empty()?d.from()==d.head:e.from()==e.head;c<=b&&--b;a.splice(--c,
2,new z(d?g:f,d?f:g))}}return new ca(a,b)}function wa(a,b){return new ca([new z(a,b||a)],0)}function Ca(a){return a.text?q(a.from.line+a.text.length-1,w(a.text).length+(1==a.text.length?a.from.ch:0)):a.to}function cf(a,b){if(0>y(a,b.from))return a;if(0>=y(a,b.to))return Ca(b);var c=a.line+b.text.length-(b.to.line-b.from.line)-1,d=a.ch;a.line==b.to.line&&(d+=Ca(b).ch-b.to.ch);return q(c,d)}function Fd(a,b){for(var c=[],d=0;d<a.sel.ranges.length;d++){var e=a.sel.ranges[d];c.push(new z(cf(e.anchor,b),
cf(e.head,b)))}return la(c,a.sel.primIndex)}function df(a,b,c){return a.line==b.line?q(c.line,a.ch-b.ch+c.ch):q(c.line+(a.line-b.line),a.ch)}function Gd(a){a.doc.mode=ed(a.options,a.doc.modeOption);Kb(a)}function Kb(a){a.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null)});a.doc.modeFrontier=a.doc.highlightFrontier=a.doc.first;Ib(a,100);a.state.modeGen++;a.curOp&&U(a)}function ef(a,b){return 0==b.from.ch&&0==b.to.ch&&""==w(b.text)&&(!a.cm||a.cm.options.wholeLineUpdateBefore)}
function Hd(a,b,c,d){function e(a,c,e){a.text=c;a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null);null!=a.order&&(a.order=null);be(a);ce(a,e);c=d?d(a):1;c!=a.height&&ma(a,c);N(a,"change",a,b)}function f(a,b){for(var e=[],f=a;f<b;++f)e.push(new hb(k[f],c?c[f]:null,d));return e}var g=b.from,h=b.to,k=b.text,l=t(a,g.line),m=t(a,h.line),p=w(k),n=c?c[k.length-1]:null,r=h.line-g.line;b.full?(a.insert(0,f(0,k.length)),a.remove(k.length,a.size-k.length)):ef(a,b)?(h=f(0,k.length-1),e(m,m.text,n),
r&&a.remove(g.line,r),h.length&&a.insert(g.line,h)):l==m?1==k.length?e(l,l.text.slice(0,g.ch)+p+l.text.slice(h.ch),n):(r=f(1,k.length-1),r.push(new hb(p+l.text.slice(h.ch),n,d)),e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),a.insert(g.line+1,r)):1==k.length?(e(l,l.text.slice(0,g.ch)+k[0]+m.text.slice(h.ch),c?c[0]:null),a.remove(g.line+1,r)):(e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),e(m,p+m.text.slice(h.ch),n),n=f(1,k.length-1),1<r&&a.remove(g.line+1,r-1),a.insert(g.line+1,n));N(a,"change",a,b)}function Va(a,
b,c){function d(a,f,g){if(a.linked)for(var h=0;h<a.linked.length;++h){var k=a.linked[h];if(k.doc!=f){var l=g&&k.sharedHist;if(!c||l)b(k.doc,l),d(k.doc,a,l)}}}d(a,null,!0)}function ff(a,b){if(b.cm)throw Error("This document is already in use.");a.doc=b;b.cm=a;vd(a);Gd(a);gf(a);a.options.lineWrapping||ad(a);a.options.mode=b.modeOption;U(a)}function gf(a){("rtl"==a.doc.direction?Ga:Ra)(a.display.lineDiv,"CodeMirror-rtl")}function Lg(a){Y(a,function(){gf(a);U(a)})}function Ac(a){this.done=[];this.undone=
[];this.undoDepth=Infinity;this.lastModTime=this.lastSelTime=0;this.lastOrigin=this.lastSelOrigin=this.lastOp=this.lastSelOp=null;this.generation=this.maxGeneration=a||1}function Id(a,b){var c={from:Wc(b.from),to:Ca(b),text:Ia(a,b.from,b.to)};hf(a,c,b.from.line,b.to.line+1);Va(a,function(a){return hf(a,c,b.from.line,b.to.line+1)},!0);return c}function jf(a){for(;a.length;)if(w(a).ranges)a.pop();else break}function kf(a,b,c,d){var e=a.history;e.undone.length=0;var f=+new Date,g,h,k;if(k=e.lastOp==
d||e.lastOrigin==b.origin&&b.origin&&("+"==b.origin.charAt(0)&&e.lastModTime>f-(a.cm?a.cm.options.historyEventDelay:500)||"*"==b.origin.charAt(0)))e.lastOp==d?(jf(e.done),g=w(e.done)):e.done.length&&!w(e.done).ranges?g=w(e.done):1<e.done.length&&!e.done[e.done.length-2].ranges?(e.done.pop(),g=w(e.done)):g=void 0,k=g;if(k)h=w(g.changes),0==y(b.from,b.to)&&0==y(b.from,h.to)?h.to=Ca(b):g.changes.push(Id(a,b));else for((g=w(e.done))&&g.ranges||Bc(a.sel,e.done),g={changes:[Id(a,b)],generation:e.generation},
e.done.push(g);e.done.length>e.undoDepth;)e.done.shift(),e.done[0].ranges||e.done.shift();e.done.push(c);e.generation=++e.maxGeneration;e.lastModTime=e.lastSelTime=f;e.lastOp=e.lastSelOp=d;e.lastOrigin=e.lastSelOrigin=b.origin;h||F(a,"historyAdded")}function Bc(a,b){var c=w(b);c&&c.ranges&&c.equals(a)||b.push(a)}function hf(a,b,c,d){var e=b["spans_"+a.id],f=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(c){c.markedSpans&&((e||(e=b["spans_"+a.id]={}))[f]=c.markedSpans);++f})}function Mg(a){if(!a)return null;
for(var b,c=0;c<a.length;++c)a[c].marker.explicitlyCleared?b||(b=a.slice(0,c)):b&&b.push(a[c]);return b?b.length?b:null:a}function lf(a,b){var c;if(c=b["spans_"+a.id]){for(var d=[],e=0;e<b.text.length;++e)d.push(Mg(c[e]));c=d}else c=null;d=Xc(a,b);if(!c)return d;if(!d)return c;for(e=0;e<c.length;++e){var f=c[e],g=d[e];if(f&&g){var h=0;a:for(;h<g.length;++h){for(var k=g[h],l=0;l<f.length;++l)if(f[l].marker==k.marker)continue a;f.push(k)}}else g&&(c[e]=g)}return c}function ib(a,b,c){for(var d=[],e=
0;e<a.length;++e){var f=a[e];if(f.ranges)d.push(c?ca.prototype.deepCopy.call(f):f);else{var f=f.changes,g=[];d.push({changes:g});for(var h=0;h<f.length;++h){var k=f[h],l=void 0;g.push({from:k.from,to:k.to,text:k.text});if(b)for(var m in k)(l=m.match(/^spans_(\d+)$/))&&-1<L(b,Number(l[1]))&&(w(g)[m]=k[m],delete k[m])}}}return d}function Jd(a,b,c,d){return d?(a=a.anchor,c&&(d=0>y(b,a),d!=0>y(c,a)?(a=b,b=c):d!=0>y(b,c)&&(b=c)),new z(a,b)):new z(c||b,b)}function Cc(a,b,c,d,e){null==e&&(e=a.cm&&(a.cm.display.shift||
a.extend));O(a,new ca([Jd(a.sel.primary(),b,c,e)],0),d)}function mf(a,b,c){for(var d=[],e=a.cm&&(a.cm.display.shift||a.extend),f=0;f<a.sel.ranges.length;f++)d[f]=Jd(a.sel.ranges[f],b[f],null,e);b=la(d,a.sel.primIndex);O(a,b,c)}function Kd(a,b,c,d){var e=a.sel.ranges.slice(0);e[b]=c;O(a,la(e,a.sel.primIndex),d)}function Ng(a,b,c){c={ranges:b.ranges,update:function(b){this.ranges=[];for(var c=0;c<b.length;c++)this.ranges[c]=new z(x(a,b[c].anchor),x(a,b[c].head))},origin:c&&c.origin};F(a,"beforeSelectionChange",
a,c);a.cm&&F(a.cm,"beforeSelectionChange",a.cm,c);return c.ranges!=b.ranges?la(c.ranges,c.ranges.length-1):b}function nf(a,b,c){var d=a.history.done,e=w(d);e&&e.ranges?(d[d.length-1]=b,Dc(a,b,c)):O(a,b,c)}function O(a,b,c){Dc(a,b,c);b=a.sel;var d=a.cm?a.cm.curOp.id:NaN,e=a.history,f=c&&c.origin,g;if(!(g=d==e.lastSelOp)&&(g=f&&e.lastSelOrigin==f)&&!(g=e.lastModTime==e.lastSelTime&&e.lastOrigin==f)){g=w(e.done);var h=f.charAt(0);g="*"==h||"+"==h&&g.ranges.length==b.ranges.length&&g.somethingSelected()==
b.somethingSelected()&&new Date-a.history.lastSelTime<=(a.cm?a.cm.options.historyEventDelay:500)}g?e.done[e.done.length-1]=b:Bc(b,e.done);e.lastSelTime=+new Date;e.lastSelOrigin=f;e.lastSelOp=d;c&&!1!==c.clearRedo&&jf(e.undone)}function Dc(a,b,c){if(ga(a,"beforeSelectionChange")||a.cm&&ga(a.cm,"beforeSelectionChange"))b=Ng(a,b,c);var d=c&&c.bias||(0>y(b.primary().head,a.sel.primary().head)?-1:1);of(a,pf(a,b,d,!0));c&&!1===c.scroll||!a.cm||fb(a.cm)}function of(a,b){b.equals(a.sel)||(a.sel=b,a.cm&&
(a.cm.curOp.updateInput=a.cm.curOp.selectionChanged=!0,fe(a.cm)),N(a,"cursorActivity",a))}function qf(a){of(a,pf(a,a.sel,null,!1))}function pf(a,b,c,d){for(var e,f=0;f<b.ranges.length;f++){var g=b.ranges[f],h=b.ranges.length==a.sel.ranges.length&&a.sel.ranges[f],k=Ld(a,g.anchor,h&&h.anchor,c,d),h=Ld(a,g.head,h&&h.head,c,d);if(e||k!=g.anchor||h!=g.head)e||(e=b.ranges.slice(0,f)),e[f]=new z(k,h)}return e?la(e,b.primIndex):b}function jb(a,b,c,d,e){var f=t(a,b.line);if(f.markedSpans)for(var g=0;g<f.markedSpans.length;++g){var h=
f.markedSpans[g],k=h.marker;if((null==h.from||(k.inclusiveLeft?h.from<=b.ch:h.from<b.ch))&&(null==h.to||(k.inclusiveRight?h.to>=b.ch:h.to>b.ch))){if(e&&(F(k,"beforeCursorEnter"),k.explicitlyCleared))if(f.markedSpans){--g;continue}else break;if(k.atomic){if(c){g=k.find(0>d?1:-1);h=void 0;if(0>d?k.inclusiveRight:k.inclusiveLeft)g=rf(a,g,-d,g&&g.line==b.line?f:null);if(g&&g.line==b.line&&(h=y(g,c))&&(0>d?0>h:0<h))return jb(a,g,b,d,e)}c=k.find(0>d?-1:1);if(0>d?k.inclusiveLeft:k.inclusiveRight)c=rf(a,
c,d,c.line==b.line?f:null);return c?jb(a,c,b,d,e):null}}}return b}function Ld(a,b,c,d,e){d=d||1;b=jb(a,b,c,d,e)||!e&&jb(a,b,c,d,!0)||jb(a,b,c,-d,e)||!e&&jb(a,b,c,-d,!0);return b?b:(a.cantEdit=!0,q(a.first,0))}function rf(a,b,c,d){return 0>c&&0==b.ch?b.line>a.first?x(a,q(b.line-1)):null:0<c&&b.ch==(d||t(a,b.line)).text.length?b.line<a.first+a.size-1?q(b.line+1,0):null:new q(b.line,b.ch+c)}function sf(a){a.setSelection(q(a.firstLine(),0),q(a.lastLine()),ra)}function tf(a,b,c){var d={canceled:!1,from:b.from,
to:b.to,text:b.text,origin:b.origin,cancel:function(){return d.canceled=!0}};c&&(d.update=function(b,c,g,h){b&&(d.from=x(a,b));c&&(d.to=x(a,c));g&&(d.text=g);void 0!==h&&(d.origin=h)});F(a,"beforeChange",a,d);a.cm&&F(a.cm,"beforeChange",a.cm,d);return d.canceled?null:{from:d.from,to:d.to,text:d.text,origin:d.origin}}function kb(a,b,c){if(a.cm){if(!a.cm.curOp)return J(a.cm,kb)(a,b,c);if(a.cm.state.suppressEdits)return}if(ga(a,"beforeChange")||a.cm&&ga(a.cm,"beforeChange"))if(b=tf(a,b,!0),!b)return;
if(c=uf&&!c&&mg(a,b.from,b.to))for(var d=c.length-1;0<=d;--d)vf(a,{from:c[d].from,to:c[d].to,text:d?[""]:b.text,origin:b.origin});else vf(a,b)}function vf(a,b){if(1!=b.text.length||""!=b.text[0]||0!=y(b.from,b.to)){var c=Fd(a,b);kf(a,b,c,a.cm?a.cm.curOp.id:NaN);Lb(a,b,c,Xc(a,b));var d=[];Va(a,function(a,c){c||-1!=L(d,a.history)||(wf(a.history,b),d.push(a.history));Lb(a,b,null,Xc(a,b))})}}function Ec(a,b,c){var d=a.cm&&a.cm.state.suppressEdits;if(!d||c){for(var e=a.history,f,g=a.sel,h="undo"==b?e.done:
e.undone,k="undo"==b?e.undone:e.done,l=0;l<h.length&&(f=h[l],c?!f.ranges||f.equals(a.sel):f.ranges);l++);if(l!=h.length){for(e.lastOrigin=e.lastSelOrigin=null;;)if(f=h.pop(),f.ranges){Bc(f,k);if(c&&!f.equals(a.sel)){O(a,f,{clearRedo:!1});return}g=f}else{if(d){h.push(f);return}break}var m=[];Bc(g,k);k.push({changes:m,generation:e.generation});e.generation=f.generation||++e.maxGeneration;var p=ga(a,"beforeChange")||a.cm&&ga(a.cm,"beforeChange");c=function(c){var d=f.changes[c];d.origin=b;if(p&&!tf(a,
d,!1))return h.length=0,{};m.push(Id(a,d));var e=c?Fd(a,d):w(h);Lb(a,d,e,lf(a,d));!c&&a.cm&&a.cm.scrollIntoView({from:d.from,to:Ca(d)});var g=[];Va(a,function(a,b){b||-1!=L(g,a.history)||(wf(a.history,d),g.push(a.history));Lb(a,d,null,lf(a,d))})};for(d=f.changes.length-1;0<=d;--d)if(e=c(d))return e.v}}}function xf(a,b){if(0!=b&&(a.first+=b,a.sel=new ca(gc(a.sel.ranges,function(a){return new z(q(a.anchor.line+b,a.anchor.ch),q(a.head.line+b,a.head.ch))}),a.sel.primIndex),a.cm)){U(a.cm,a.first,a.first-
b,b);for(var c=a.cm.display,d=c.viewFrom;d<c.viewTo;d++)Ba(a.cm,d,"gutter")}}function Lb(a,b,c,d){if(a.cm&&!a.cm.curOp)return J(a.cm,Lb)(a,b,c,d);if(b.to.line<a.first)xf(a,b.text.length-1-(b.to.line-b.from.line));else if(!(b.from.line>a.lastLine())){if(b.from.line<a.first){var e=b.text.length-1-(a.first-b.from.line);xf(a,e);b={from:q(a.first,0),to:q(b.to.line+e,b.to.ch),text:[w(b.text)],origin:b.origin}}e=a.lastLine();b.to.line>e&&(b={from:b.from,to:q(e,t(a,e).text.length),text:[b.text[0]],origin:b.origin});
b.removed=Ia(a,b.from,b.to);c||(c=Fd(a,b));a.cm?Og(a.cm,b,d):Hd(a,b,d);Dc(a,c,ra)}}function Og(a,b,c){var d=a.doc,e=a.display,f=b.from,g=b.to,h=!1,k=f.line;a.options.lineWrapping||(k=B(na(t(d,f.line))),d.iter(k,g.line+1,function(a){if(a==e.maxLine)return h=!0}));-1<d.sel.contains(b.from,b.to)&&fe(a);Hd(d,b,c,Le(a));a.options.lineWrapping||(d.iter(k,f.line+b.text.length,function(a){var b=lc(a);b>e.maxLineLength&&(e.maxLine=a,e.maxLineLength=b,e.maxLineChanged=!0,h=!1)}),h&&(a.curOp.updateMaxLine=!0));
tg(d,f.line);Ib(a,400);c=b.text.length-(g.line-f.line)-1;b.full?U(a):f.line!=g.line||1!=b.text.length||ef(a.doc,b)?U(a,f.line,g.line+1,c):Ba(a,f.line,"text");c=ga(a,"changes");if((d=ga(a,"change"))||c)b={from:f,to:g,text:b.text,removed:b.removed,origin:b.origin},d&&N(a,"change",a,b),c&&(a.curOp.changeObjs||(a.curOp.changeObjs=[])).push(b);a.display.selForContextMenu=null}function lb(a,b,c,d,e){d||(d=c);if(0>y(d,c)){var f;f=[d,c];c=f[0];d=f[1];f}"string"==typeof b&&(b=a.splitLines(b));kb(a,{from:c,
to:d,text:b,origin:e})}function yf(a,b,c,d){c<a.line?a.line+=d:b<a.line&&(a.line=b,a.ch=0)}function zf(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e],g=!0;if(f.ranges)for(f.copied||(f=a[e]=f.deepCopy(),f.copied=!0),g=0;g<f.ranges.length;g++)yf(f.ranges[g].anchor,b,c,d),yf(f.ranges[g].head,b,c,d);else{for(var h=0;h<f.changes.length;++h){var k=f.changes[h];if(c<k.from.line)k.from=q(k.from.line+d,k.from.ch),k.to=q(k.to.line+d,k.to.ch);else if(b<=k.to.line){g=!1;break}}g||(a.splice(0,e+1),e=0)}}}function wf(a,
b){var c=b.from.line,d=b.to.line,e=b.text.length-(d-c)-1;zf(a.done,c,d,e);zf(a.undone,c,d,e)}function Mb(a,b,c,d){var e=b,f=b;"number"==typeof b?f=t(a,Math.max(a.first,Math.min(b,a.first+a.size-1))):e=B(b);if(null==e)return null;d(f,e)&&a.cm&&Ba(a.cm,e,c);return f}function Nb(a){this.lines=a;this.parent=null;for(var b=0,c=0;c<a.length;++c)a[c].parent=this,b+=a[c].height;this.height=b}function Ob(a){this.children=a;for(var b=0,c=0,d=0;d<a.length;++d){var e=a[d],b=b+e.chunkSize(),c=c+e.height;e.parent=
this}this.size=b;this.height=c;this.parent=null}function Pg(a,b,c,d){var e=new Pb(a,c,d),f=a.cm;f&&e.noHScroll&&(f.display.alignWidgets=!0);Mb(a,b,"widget",function(b){var c=b.widgets||(b.widgets=[]);null==e.insertAt?c.push(e):c.splice(Math.min(c.length-1,Math.max(0,e.insertAt)),0,e);e.line=b;f&&!za(a,b)&&(c=oa(b)<a.scrollTop,ma(b,b.height+Bb(e)),c&&vc(f,e.height),f.curOp.forceUpdate=!0);return!0});f&&N(f,"lineWidgetAdded",f,e,"number"==typeof b?b:B(b));return e}function mb(a,b,c,d,e){if(d&&d.shared)return Qg(a,
b,c,d,e);if(a.cm&&!a.cm.curOp)return J(a.cm,mb)(a,b,c,d,e);var f=new Da(a,e);e=y(b,c);d&&Ha(d,f,!1);if(0<e||0==e&&!1!==f.clearWhenEmpty)return f;f.replacedWith&&(f.collapsed=!0,f.widgetNode=Za("span",[f.replacedWith],"CodeMirror-widget"),d.handleMouseEvents||f.widgetNode.setAttribute("cm-ignore-events","true"),d.insertLeft&&(f.widgetNode.insertLeft=!0));if(f.collapsed){if(de(a,b.line,b,c,f)||b.line!=c.line&&de(a,c.line,b,c,f))throw Error("Inserting collapsed marker partially overlapping an existing one");
ta=!0}f.addToHistory&&kf(a,{from:b,to:c,origin:"markText"},a.sel,NaN);var g=b.line,h=a.cm,k;a.iter(g,c.line+1,function(a){h&&f.collapsed&&!h.options.lineWrapping&&na(a)==h.display.maxLine&&(k=!0);f.collapsed&&g!=b.line&&ma(a,0);var d=new kc(f,g==b.line?b.ch:null,g==c.line?c.ch:null);a.markedSpans=a.markedSpans?a.markedSpans.concat([d]):[d];d.marker.attachLine(a);++g});f.collapsed&&a.iter(b.line,c.line+1,function(b){za(a,b)&&ma(b,0)});f.clearOnEnter&&v(f,"beforeCursorEnter",function(){return f.clear()});
f.readOnly&&(uf=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory());f.collapsed&&(f.id=++Af,f.atomic=!0);if(h){k&&(h.curOp.updateMaxLine=!0);if(f.collapsed)U(h,b.line,c.line+1);else if(f.className||f.title||f.startStyle||f.endStyle||f.css)for(d=b.line;d<=c.line;d++)Ba(h,d,"text");f.atomic&&qf(h.doc);N(h,"markerAdded",h,f)}return f}function Qg(a,b,c,d,e){d=Ha(d);d.shared=!1;var f=[mb(a,b,c,d,e)],g=f[0],h=d.widgetNode;Va(a,function(a){h&&(d.widgetNode=h.cloneNode(!0));f.push(mb(a,
x(a,b),x(a,c),d,e));for(var l=0;l<a.linked.length;++l)if(a.linked[l].isParent)return;g=w(f)});return new Qb(f,g)}function Bf(a){return a.findMarks(q(a.first,0),a.clipPos(q(a.lastLine())),function(a){return a.parent})}function Rg(a){for(var b=function(b){b=a[b];var c=[b.primary.doc];Va(b.primary.doc,function(a){return c.push(a)});for(var f=0;f<b.markers.length;f++){var g=b.markers[f];-1==L(c,g.doc)&&(g.parent=null,b.markers.splice(f--,1))}},c=0;c<a.length;c++)b(c)}function Sg(a){var b=this;Cf(b);if(!I(b,
a)&&!va(b.display,a)){T(a);A&&(Df=+new Date);var c=Qa(b,a,!0),d=a.dataTransfer.files;if(c&&!b.isReadOnly())if(d&&d.length&&window.FileReader&&window.File)for(var e=d.length,f=Array(e),g=0,h=function(a,d){if(!b.options.allowDropFileTypes||-1!=L(b.options.allowDropFileTypes,a.type)){var h=new FileReader;h.onload=J(b,function(){var a=h.result;/[\x00-\x08\x0e-\x1f]{2}/.test(a)&&(a="");f[d]=a;++g==e&&(c=x(b.doc,c),a={from:c,to:c,text:b.doc.splitLines(f.join(b.doc.lineSeparator())),origin:"paste"},kb(b.doc,
a),nf(b.doc,wa(c,Ca(a))))});h.readAsText(a)}},k=0;k<e;++k)h(d[k],k);else if(b.state.draggingText&&-1<b.doc.sel.contains(c))b.state.draggingText(a),setTimeout(function(){return b.display.input.focus()},20);else try{if(h=a.dataTransfer.getData("Text")){b.state.draggingText&&!b.state.draggingText.copy&&(k=b.listSelections());Dc(b.doc,wa(c,c));if(k)for(d=0;d<k.length;++d)lb(b.doc,"",k[d].anchor,k[d].head,"drag");b.replaceSelection(h,"around","paste");b.display.input.focus()}}catch(l){}}}function Cf(a){a.display.dragCursor&&
(a.display.lineSpace.removeChild(a.display.dragCursor),a.display.dragCursor=null)}function Ef(a){if(document.getElementsByClassName)for(var b=document.getElementsByClassName("CodeMirror"),c=0;c<b.length;c++){var d=b[c].CodeMirror;d&&a(d)}}function Tg(){var a;v(window,"resize",function(){null==a&&(a=setTimeout(function(){a=null;Ef(Ug)},100))});v(window,"blur",function(){return Ef(Fb)})}function Ug(a){var b=a.display;b.cachedCharWidth=b.cachedTextHeight=b.cachedPaddingH=null;b.scrollbarsClipped=!1;
a.setSize()}function Vg(a){var b=a.split(/-(?!$)/);a=b[b.length-1];for(var c,d,e,f,g=0;g<b.length-1;g++){var h=b[g];if(/^(cmd|meta|m)$/i.test(h))f=!0;else if(/^a(lt)?$/i.test(h))c=!0;else if(/^(c|ctrl|control)$/i.test(h))d=!0;else if(/^s(hift)?$/i.test(h))e=!0;else throw Error("Unrecognized modifier name: "+h);}c&&(a="Alt-"+a);d&&(a="Ctrl-"+a);f&&(a="Cmd-"+a);e&&(a="Shift-"+a);return a}function Wg(a){var b={},c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];if(!/^(name|fallthrough|(de|at)tach)$/.test(c)){if("..."!=
d)for(var e=gc(c.split(" "),Vg),f=0;f<e.length;f++){var g=void 0,h=void 0;f==e.length-1?(h=e.join(" "),g=d):(h=e.slice(0,f+1).join(" "),g="...");var k=b[h];if(!k)b[h]=g;else if(k!=g)throw Error("Inconsistent bindings for "+h);}delete a[c]}}for(var l in b)a[l]=b[l];return a}function nb(a,b,c,d){b=Fc(b);var e=b.call?b.call(a,d):b[a];if(!1===e)return"nothing";if("..."===e)return"multi";if(null!=e&&c(e))return"handled";if(b.fallthrough){if("[object Array]"!=Object.prototype.toString.call(b.fallthrough))return nb(a,
b.fallthrough,c,d);for(e=0;e<b.fallthrough.length;e++){var f=nb(a,b.fallthrough[e],c,d);if(f)return f}}}function Ff(a){a="string"==typeof a?a:Ea[a.keyCode];return"Ctrl"==a||"Alt"==a||"Shift"==a||"Mod"==a}function Gf(a,b,c){var d=a;b.altKey&&"Alt"!=d&&(a="Alt-"+a);(Hf?b.metaKey:b.ctrlKey)&&"Ctrl"!=d&&(a="Ctrl-"+a);(Hf?b.ctrlKey:b.metaKey)&&"Cmd"!=d&&(a="Cmd-"+a);!c&&b.shiftKey&&"Shift"!=d&&(a="Shift-"+a);return a}function If(a,b){if(ka&&34==a.keyCode&&a["char"])return!1;var c=Ea[a.keyCode];if(null==
c||a.altGraphKey)return!1;3==a.keyCode&&a.code&&(c=a.code);return Gf(c,a,b)}function Fc(a){return"string"==typeof a?Rb[a]:a}function ob(a,b){for(var c=a.doc.sel.ranges,d=[],e=0;e<c.length;e++){for(var f=b(c[e]);d.length&&0>=y(f.from,w(d).to);){var g=d.pop();if(0>y(g.from,f.from)){f.from=g.from;break}}d.push(f)}Y(a,function(){for(var b=d.length-1;0<=b;b--)lb(a.doc,"",d[b].from,d[b].to,"+delete");fb(a)})}function Md(a,b,c){b=Zd(a.text,b+c,c);return 0>b||b>a.text.length?null:b}function Nd(a,b,c){a=Md(a,
b.ch,c);return null==a?null:new q(b.line,a,0>c?"after":"before")}function Od(a,b,c,d,e){if(a&&(a=ua(c,b.doc.direction))){a=0>e?w(a):a[0];var f=0>e==(1==a.level)?"after":"before",g;if(0<a.level||"rtl"==b.doc.direction){var h=Na(b,c);g=0>e?c.text.length-1:0;var k=ia(b,h,g).top;g=rb(function(a){return ia(b,h,a).top==k},0>e==(1==a.level)?a.from:a.to-1,g);"before"==f&&(g=Md(c,g,1))}else g=0>e?a.to:a.from;return new q(d,g,f)}return new q(d,0>e?c.text.length:0,0>e?"before":"after")}function Xg(a,b,c,d){var e=
ua(b,a.doc.direction);if(!e)return Nd(b,c,d);c.ch>=b.text.length?(c.ch=b.text.length,c.sticky="before"):0>=c.ch&&(c.ch=0,c.sticky="after");var f=vb(e,c.ch,c.sticky),g=e[f];if("ltr"==a.doc.direction&&0==g.level%2&&(0<d?g.to>c.ch:g.from<c.ch))return Nd(b,c,d);var h=function(a,c){return Md(b,a instanceof q?a.ch:a,c)},k,l=function(c){if(!a.options.lineWrapping)return{begin:0,end:b.text.length};k=k||Na(a,b);return Ke(a,b,k,c)},m=l("before"==c.sticky?h(c,-1):c.ch);if("rtl"==a.doc.direction||1==g.level){var p=
1==g.level==0>d,n=h(c,p?1:-1);if(null!=n&&(p?n<=g.to&&n<=m.end:n>=g.from&&n>=m.begin))return new q(c.line,n,p?"before":"after")}g=function(a,b,d){for(var f=function(a,b){return b?new q(c.line,h(a,1),"before"):new q(c.line,a,"after")};0<=a&&a<e.length;a+=b){var g=e[a],k=0<b==(1!=g.level),l=k?d.begin:h(d.end,-1);if(g.from<=l&&l<g.to)return f(l,k);l=k?g.from:h(g.to,-1);if(d.begin<=l&&l<d.end)return f(l,k)}};if(f=g(f+d,d,m))return f;m=0<d?m.end:h(m.begin,-1);return null==m||0<d&&m==b.text.length||!(f=
g(0<d?0:e.length-1,d,l(m)))?null:f}function Jf(a,b){var c=t(a.doc,b),d=na(c);d!=c&&(b=B(d));return Od(!0,a,d,b,1)}function Kf(a,b){var c=Jf(a,b.line),d=t(a.doc,c.line),e=ua(d,a.doc.direction);return e&&0!=e[0].level?c:(d=Math.max(0,d.text.search(/\S/)),q(c.line,b.line==c.line&&b.ch<=d&&b.ch?0:d,c.sticky))}function Gc(a,b,c){if("string"==typeof b&&(b=Sb[b],!b))return!1;a.display.input.ensurePolled();var d=a.display.shift,e=!1;try{a.isReadOnly()&&(a.state.suppressEdits=!0),c&&(a.display.shift=!1),e=
b(a)!=Hc}finally{a.display.shift=d,a.state.suppressEdits=!1}return e}function Tb(a,b,c,d){var e=a.state.keySeq;if(e){if(Ff(b))return"handled";/\'$/.test(b)?a.state.keySeq=null:Yg.set(50,function(){a.state.keySeq==e&&(a.state.keySeq=null,a.display.input.reset())});if(Lf(a,e+" "+b,c,d))return!0}return Lf(a,b,c,d)}function Lf(a,b,c,d){a:{for(var e=0;e<a.state.keyMaps.length;e++){var f=nb(b,a.state.keyMaps[e],d,a);if(f){d=f;break a}}d=a.options.extraKeys&&nb(b,a.options.extraKeys,d,a)||nb(b,a.options.keyMap,
d,a)}"multi"==d&&(a.state.keySeq=b);"handled"==d&&N(a,"keyHandled",a,b,c);if("handled"==d||"multi"==d)T(c),wd(a);return!!d}function Mf(a,b){var c=If(b,!0);return c?b.shiftKey&&!a.state.keySeq?Tb(a,"Shift-"+c,b,function(b){return Gc(a,b,!0)})||Tb(a,c,b,function(b){if("string"==typeof b?/^go[A-Z]/.test(b):b.motion)return Gc(a,b)}):Tb(a,c,b,function(b){return Gc(a,b)}):!1}function Zg(a,b,c){return Tb(a,"'"+c+"'",b,function(b){return Gc(a,b,!0)})}function Nf(a){this.curOp.focus=sa();if(!I(this,a)){A&&
11>D&&27==a.keyCode&&(a.returnValue=!1);var b=a.keyCode;this.display.shift=16==b||a.shiftKey;var c=Mf(this,a);ka&&(Pd=c?b:null,!c&&88==b&&!$g&&(ha?a.metaKey:a.ctrlKey)&&this.replaceSelection("",null,"cut"));18!=b||/\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className)||ah(this)}}function ah(a){function b(a){18!=a.keyCode&&a.altKey||(Ra(c,"CodeMirror-crosshair"),aa(document,"keyup",b),aa(document,"mouseover",b))}var c=a.display.lineDiv;Ga(c,"CodeMirror-crosshair");v(document,"keyup",b);v(document,
"mouseover",b)}function Of(a){16==a.keyCode&&(this.doc.sel.shift=!1);I(this,a)}function Pf(a){if(!(va(this.display,a)||I(this,a)||a.ctrlKey&&!a.altKey||ha&&a.metaKey)){var b=a.keyCode,c=a.charCode;if(ka&&b==Pd)Pd=null,T(a);else if(!ka||a.which&&!(10>a.which)||!Mf(this,a))if(b=String.fromCharCode(null==c?b:c),"\b"!=b&&!Zg(this,a,b))this.display.input.onKeyPress(a)}}function bh(a,b){var c=+new Date;if(Ub&&Ub.compare(c,a,b))return Vb=Ub=null,"triple";if(Vb&&Vb.compare(c,a,b))return Ub=new Qd(c,a,b),
Vb=null,"double";Vb=new Qd(c,a,b);Ub=null;return"single"}function Qf(a){var b=this.display;if(!(I(this,a)||b.activeTouch&&b.input.supportsTouch()))if(b.input.ensurePolled(),b.shift=a.shiftKey,va(b,a))P||(b.scroller.draggable=!1,setTimeout(function(){return b.scroller.draggable=!0},100));else{var c=he(a);if(3==c&&Ic?!Rf(this,a):!Jc(this,a,"gutterClick",!0)){var d=Qa(this,a),e=d?bh(d,c):"single";window.focus();1==c&&this.state.selectingText&&this.state.selectingText(a);d&&ch(this,c,d,e,a)||(1==c?d?
dh(this,d,e,a):(a.target||a.srcElement)==b.scroller&&T(a):2==c?(d&&Cc(this.doc,d),setTimeout(function(){return b.input.focus()},20)):3==c&&(Ic?Sf(this,a):Pe(this)))}}}function ch(a,b,c,d,e){var f="Click";"double"==d?f="Double"+f:"triple"==d&&(f="Triple"+f);return Tb(a,Gf((1==b?"Left":2==b?"Middle":"Right")+f,e),e,function(b){"string"==typeof b&&(b=Sb[b]);if(!b)return!1;var d=!1;try{a.isReadOnly()&&(a.state.suppressEdits=!0),d=b(a,c)!=Hc}finally{a.state.suppressEdits=!1}return d})}function dh(a,b,
c,d){A?setTimeout(Oc(Oe,a),0):a.curOp.focus=sa();var e=a.getOption("configureMouse"),e=e?e(a,c,d):{};null==e.unit&&(e.unit=(eh?d.shiftKey&&d.metaKey:d.altKey)?"rectangle":"single"==c?"char":"double"==c?"word":"line");if(null==e.extend||a.doc.extend)e.extend=a.doc.extend||d.shiftKey;null==e.addNew&&(e.addNew=ha?d.metaKey:d.ctrlKey);null==e.moveOnDrag&&(e.moveOnDrag=!(ha?d.altKey:d.ctrlKey));var f=a.doc.sel,g;a.options.dragDrop&&fh&&!a.isReadOnly()&&"single"==c&&-1<(g=f.contains(b))&&(0>y((g=f.ranges[g]).from(),
b)||0<b.xRel)&&(0<y(g.to(),b)||0>b.xRel)?gh(a,d,b,e):hh(a,d,b,e)}function gh(a,b,c,d){var e=a.display,f=!1,g=J(a,function(b){P&&(e.scroller.draggable=!1);a.state.draggingText=!1;aa(e.wrapper.ownerDocument,"mouseup",g);aa(e.wrapper.ownerDocument,"mousemove",h);aa(e.scroller,"dragstart",k);aa(e.scroller,"drop",g);f||(T(b),d.addNew||Cc(a.doc,c,null,null,d.extend),P||A&&9==D?setTimeout(function(){e.wrapper.ownerDocument.body.focus();e.input.focus()},20):e.input.focus())}),h=function(a){f=f||10<=Math.abs(b.clientX-
a.clientX)+Math.abs(b.clientY-a.clientY)},k=function(){return f=!0};P&&(e.scroller.draggable=!0);a.state.draggingText=g;g.copy=!d.moveOnDrag;e.scroller.dragDrop&&e.scroller.dragDrop();v(e.wrapper.ownerDocument,"mouseup",g);v(e.wrapper.ownerDocument,"mousemove",h);v(e.scroller,"dragstart",k);v(e.scroller,"drop",g);Pe(a);setTimeout(function(){return e.input.focus()},20)}function Tf(a,b,c){if("char"==c)return new z(b,b);if("word"==c)return a.findWordAt(b);if("line"==c)return new z(q(b.line,0),x(a.doc,
q(b.line+1,0)));a=c(a,b);return new z(a.from,a.to)}function hh(a,b,c,d){function e(b){if(0!=y(r,b))if(r=b,"rectangle"==d.unit){for(var e=[],f=a.options.tabSize,g=fa(t(k,c.line).text,c.ch,f),h=fa(t(k,b.line).text,b.ch,f),n=Math.min(g,h),g=Math.max(g,h),h=Math.min(c.line,b.line),W=Math.min(a.lastLine(),Math.max(c.line,b.line));h<=W;h++){var u=t(k,h).text,v=Pc(u,n,f);n==g?e.push(new z(q(h,v),q(h,v))):u.length>v&&e.push(new z(q(h,v),q(h,Pc(u,g,f))))}e.length||e.push(new z(c,c));O(k,la(p.ranges.slice(0,
m).concat(e),m),{origin:"*mouse",scroll:!1});a.scrollIntoView(b)}else e=l,n=Tf(a,b,d.unit),b=e.anchor,0<y(n.anchor,b)?(f=n.head,b=jc(e.from(),n.anchor)):(f=n.anchor,b=ic(e.to(),n.head)),e=p.ranges.slice(0),e[m]=ih(a,new z(x(k,b),f)),O(k,la(e,m),Rd)}function f(b){var c=++u,g=Qa(a,b,!0,"rectangle"==d.unit);if(g)if(0!=y(g,r)){a.curOp.focus=sa();e(g);var l=yd(h,k);(g.line>=l.to||g.line<l.from)&&setTimeout(J(a,function(){u==c&&f(b)}),150)}else{var m=b.clientY<W.top?-20:b.clientY>W.bottom?20:0;m&&setTimeout(J(a,
function(){u==c&&(h.scroller.scrollTop+=m,f(b))}),50)}}function g(b){a.state.selectingText=!1;u=Infinity;T(b);h.input.focus();aa(h.wrapper.ownerDocument,"mousemove",w);aa(h.wrapper.ownerDocument,"mouseup",A);k.history.lastSelOrigin=null}var h=a.display,k=a.doc;T(b);var l,m,p=k.sel,n=p.ranges;d.addNew&&!d.extend?(m=k.sel.contains(c),l=-1<m?n[m]:new z(c,c)):(l=k.sel.primary(),m=k.sel.primIndex);"rectangle"==d.unit?(d.addNew||(l=new z(c,c)),c=Qa(a,b,!0,!0),m=-1):(b=Tf(a,c,d.unit),l=d.extend?Jd(l,b.anchor,
b.head,d.extend):b);d.addNew?-1==m?(m=n.length,O(k,la(n.concat([l]),m),{scroll:!1,origin:"*mouse"})):1<n.length&&n[m].empty()&&"char"==d.unit&&!d.extend?(O(k,la(n.slice(0,m).concat(n.slice(m+1)),0),{scroll:!1,origin:"*mouse"}),p=k.sel):Kd(k,m,l,Rd):(m=0,O(k,new ca([l],0),Rd),p=k.sel);var r=c,W=h.wrapper.getBoundingClientRect(),u=0,w=J(a,function(a){0!==a.buttons&&he(a)?f(a):g(a)}),A=J(a,g);a.state.selectingText=A;v(h.wrapper.ownerDocument,"mousemove",w);v(h.wrapper.ownerDocument,"mouseup",A)}function ih(a,
b){var c=b.anchor,d=b.head,e=t(a.doc,c.line);if(0==y(c,d)&&c.sticky==d.sticky)return b;e=ua(e);if(!e)return b;var f=vb(e,c.ch,c.sticky),g=e[f];if(g.from!=c.ch&&g.to!=c.ch)return b;var h=f+(g.from==c.ch==(1!=g.level)?0:1);if(0==h||h==e.length)return b;var k;d.line!=c.line?k=0<(d.line-c.line)*("ltr"==a.doc.direction?1:-1):(k=vb(e,d.ch,d.sticky),f=k-f||(d.ch-c.ch)*(1==g.level?-1:1),k=k==h-1||k==h?0>f:0<f);e=e[h+(k?-1:0)];e=(h=k==(1==e.level))?e.from:e.to;h=h?"after":"before";return c.ch==e&&c.sticky==
h?b:new z(new q(c.line,e,h),d)}function Jc(a,b,c,d){var e,f;if(b.touches)e=b.touches[0].clientX,f=b.touches[0].clientY;else try{e=b.clientX,f=b.clientY}catch(k){return!1}if(e>=Math.floor(a.display.gutters.getBoundingClientRect().right))return!1;d&&T(b);d=a.display;var g=d.lineDiv.getBoundingClientRect();if(f>g.bottom||!ga(a,c))return bd(b);f-=g.top-d.viewOffset;for(g=0;g<a.options.gutters.length;++g){var h=d.gutters.childNodes[g];if(h&&h.getBoundingClientRect().right>=e)return e=Ja(a.doc,f),F(a,c,
a,e,a.options.gutters[g],b),bd(b)}}function Sf(a,b){if(!va(a.display,b)&&!Rf(a,b)&&!I(a,b,"contextmenu"))a.display.input.onContextMenu(b)}function Rf(a,b){return ga(a,"gutterContextMenu")?Jc(a,b,"gutterContextMenu",!1):!1}function Uf(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+a.options.theme.replace(/(^|\s)\s*/g," cm-s-");Db(a)}function Wb(a){$e(a);U(a);Re(a)}function jh(a,b,c){!b!=!(c&&c!=pb)&&(c=a.display.dragFunctions,b=b?v:aa,b(a.display.scroller,"dragstart",
c.start),b(a.display.scroller,"dragenter",c.enter),b(a.display.scroller,"dragover",c.over),b(a.display.scroller,"dragleave",c.leave),b(a.display.scroller,"drop",c.drop))}function kh(a){a.options.lineWrapping?(Ga(a.display.wrapper,"CodeMirror-wrap"),a.display.sizer.style.minWidth="",a.display.sizerWidth=null):(Ra(a.display.wrapper,"CodeMirror-wrap"),ad(a));vd(a);U(a);Db(a);setTimeout(function(){return gb(a)},100)}function E(a,b){var c=this;if(!(this instanceof E))return new E(a,b);this.options=b=b?
Ha(b):{};Ha(Vf,b,!1);Ed(b);var d=b.value;"string"==typeof d?d=new V(d,b.mode,null,b.lineSeparator,b.direction):b.mode&&(d.modeOption=b.mode);this.doc=d;var e=new E.inputStyles[b.inputStyle](this),e=this.display=new lg(a,d,e);e.wrapper.CodeMirror=this;$e(this);Uf(this);b.lineWrapping&&(this.display.wrapper.className+=" CodeMirror-wrap");We(this);this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,
draggingText:!1,highlight:new Wa,keySeq:null,specialChars:null};b.autofocus&&!sb&&e.input.focus();A&&11>D&&setTimeout(function(){return c.display.input.reset(!0)},20);lh(this);Wf||(Tg(),Wf=!0);Ta(this);this.curOp.forceUpdate=!0;ff(this,d);b.autofocus&&!sb||this.hasFocus()?setTimeout(Oc(xd,this),20):Fb(this);for(var f in Kc)if(Kc.hasOwnProperty(f))Kc[f](c,b[f],pb);Se(this);b.finishInit&&b.finishInit(this);for(d=0;d<Sd.length;++d)Sd[d](c);Ua(this);P&&b.lineWrapping&&"optimizelegibility"==getComputedStyle(e.lineDiv).textRendering&&
(e.lineDiv.style.textRendering="auto")}function lh(a){function b(){d.activeTouch&&(e=setTimeout(function(){return d.activeTouch=null},1E3),f=d.activeTouch,f.end=+new Date)}function c(a,b){if(null==b.left)return!0;var c=b.left-a.left,d=b.top-a.top;return 400<c*c+d*d}var d=a.display;v(d.scroller,"mousedown",J(a,Qf));A&&11>D?v(d.scroller,"dblclick",J(a,function(b){if(!I(a,b)){var c=Qa(a,b);!c||Jc(a,b,"gutterClick",!0)||va(a.display,b)||(T(b),b=a.findWordAt(c),Cc(a.doc,b.anchor,b.head))}})):v(d.scroller,
"dblclick",function(b){return I(a,b)||T(b)});Ic||v(d.scroller,"contextmenu",function(b){return Sf(a,b)});var e,f={end:0};v(d.scroller,"touchstart",function(b){var c;if(c=!I(a,b))1!=b.touches.length?c=!1:(c=b.touches[0],c=1>=c.radiusX&&1>=c.radiusY),c=!c;c&&!Jc(a,b,"gutterClick",!0)&&(d.input.ensurePolled(),clearTimeout(e),c=+new Date,d.activeTouch={start:c,moved:!1,prev:300>=c-f.end?f:null},1==b.touches.length&&(d.activeTouch.left=b.touches[0].pageX,d.activeTouch.top=b.touches[0].pageY))});v(d.scroller,
"touchmove",function(){d.activeTouch&&(d.activeTouch.moved=!0)});v(d.scroller,"touchend",function(e){var f=d.activeTouch;if(f&&!va(d,e)&&null!=f.left&&!f.moved&&300>new Date-f.start){var g=a.coordsChar(d.activeTouch,"page"),f=!f.prev||c(f,f.prev)?new z(g,g):!f.prev.prev||c(f,f.prev.prev)?a.findWordAt(g):new z(q(g.line,0),x(a.doc,q(g.line+1,0)));a.setSelection(f.anchor,f.head);a.focus();T(e)}b()});v(d.scroller,"touchcancel",b);v(d.scroller,"scroll",function(){d.scroller.clientHeight&&(Hb(a,d.scroller.scrollTop),
Sa(a,d.scroller.scrollLeft,!0),F(a,"scroll",a))});v(d.scroller,"mousewheel",function(b){return bf(a,b)});v(d.scroller,"DOMMouseScroll",function(b){return bf(a,b)});v(d.wrapper,"scroll",function(){return d.wrapper.scrollTop=d.wrapper.scrollLeft=0});d.dragFunctions={enter:function(b){I(a,b)||xb(b)},over:function(b){if(!I(a,b)){var c=Qa(a,b);if(c){var d=document.createDocumentFragment();Ne(a,c,d);a.display.dragCursor||(a.display.dragCursor=u("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),a.display.lineSpace.insertBefore(a.display.dragCursor,
a.display.cursorDiv));Z(a.display.dragCursor,d)}xb(b)}},start:function(b){if(A&&(!a.state.draggingText||100>+new Date-Df))xb(b);else if(!I(a,b)&&!va(a.display,b)&&(b.dataTransfer.setData("Text",a.getSelection()),b.dataTransfer.effectAllowed="copyMove",b.dataTransfer.setDragImage&&!Xf)){var c=u("img",null,null,"position: fixed; left: 0; top: 0;");c.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d";ka&&(c.width=c.height=1,a.display.wrapper.appendChild(c),c._top=
c.offsetTop);b.dataTransfer.setDragImage(c,0,0);ka&&c.parentNode.removeChild(c)}},drop:J(a,Sg),leave:function(b){I(a,b)||Cf(a)}};var g=d.input.getField();v(g,"keyup",function(b){return Of.call(a,b)});v(g,"keydown",J(a,Nf));v(g,"keypress",J(a,Pf));v(g,"focus",function(b){return xd(a,b)});v(g,"blur",function(b){return Fb(a,b)})}function Xb(a,b,c,d){var e=a.doc,f;null==c&&(c="add");"smart"==c&&(e.mode.indent?f=yb(a,b).state:c="prev");var g=a.options.tabSize,h=t(e,b),k=fa(h.text,null,g);h.stateAfter&&
(h.stateAfter=null);var l=h.text.match(/^\s*/)[0],m;if(!d&&!/\S/.test(h.text))m=0,c="not";else if("smart"==c&&(m=e.mode.indent(f,h.text.slice(l.length),h.text),m==Hc||150<m)){if(!d)return;c="prev"}"prev"==c?m=b>e.first?fa(t(e,b-1).text,null,g):0:"add"==c?m=k+a.options.indentUnit:"subtract"==c?m=k-a.options.indentUnit:"number"==typeof c&&(m=k+c);m=Math.max(0,m);c="";d=0;if(a.options.indentWithTabs)for(a=Math.floor(m/g);a;--a)d+=g,c+="\t";d<m&&(c+=Qc(m-d));if(c!=l)return lb(e,c,q(b,0),q(b,l.length),
"+input"),h.stateAfter=null,!0;for(g=0;g<e.sel.ranges.length;g++)if(h=e.sel.ranges[g],h.head.line==b&&h.head.ch<l.length){b=q(b,l.length);Kd(e,g,new z(b,b));break}}function Yf(a){da=a}function Td(a,b,c,d,e){var f=a.doc;a.display.shift=!1;d||(d=f.sel);var g=a.state.pasteIncoming||"paste"==e,h=Ud(b),k=null;if(g&&1<d.ranges.length)if(da&&da.text.join("\n")==b){if(0==d.ranges.length%da.text.length)for(var k=[],l=0;l<da.text.length;l++)k.push(f.splitLines(da.text[l]))}else h.length==d.ranges.length&&a.options.pasteLinesPerSelection&&
(k=gc(h,function(a){return[a]}));for(var m,l=d.ranges.length-1;0<=l;l--){m=d.ranges[l];var p=m.from(),n=m.to();m.empty()&&(c&&0<c?p=q(p.line,p.ch-c):a.state.overwrite&&!g?n=q(n.line,Math.min(t(f,n.line).text.length,n.ch+w(h).length)):da&&da.lineWise&&da.text.join("\n")==b&&(p=n=q(p.line,0)));m=a.curOp.updateInput;p={from:p,to:n,text:k?k[l%k.length]:h,origin:e||(g?"paste":a.state.cutIncoming?"cut":"+input")};kb(a.doc,p);N(a,"inputRead",a,p)}b&&!g&&Zf(a,b);fb(a);a.curOp.updateInput=m;a.curOp.typing=
!0;a.state.pasteIncoming=a.state.cutIncoming=!1}function $f(a,b){var c=a.clipboardData&&a.clipboardData.getData("Text");if(c)return a.preventDefault(),b.isReadOnly()||b.options.disableInput||Y(b,function(){return Td(b,c,0,null,"paste")}),!0}function Zf(a,b){if(a.options.electricChars&&a.options.smartIndent)for(var c=a.doc.sel,d=c.ranges.length-1;0<=d;d--){var e=c.ranges[d];if(!(100<e.head.ch||d&&c.ranges[d-1].head.line==e.head.line)){var f=a.getModeAt(e.head),g=!1;if(f.electricChars)for(var h=0;h<
f.electricChars.length;h++){if(-1<b.indexOf(f.electricChars.charAt(h))){g=Xb(a,e.head.line,"smart");break}}else f.electricInput&&f.electricInput.test(t(a.doc,e.head.line).text.slice(0,e.head.ch))&&(g=Xb(a,e.head.line,"smart"));g&&N(a,"electricInput",a,e.head.line)}}}function ag(a){for(var b=[],c=[],d=0;d<a.doc.sel.ranges.length;d++){var e=a.doc.sel.ranges[d].head.line,e={anchor:q(e,0),head:q(e+1,0)};c.push(e);b.push(a.getRange(e.anchor,e.head))}return{text:b,ranges:c}}function bg(a,b){a.setAttribute("autocorrect",
"off");a.setAttribute("autocapitalize","off");a.setAttribute("spellcheck",!!b)}function cg(){var a=u("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),b=u("div",[a],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");P?a.style.width="1000px":a.setAttribute("wrap","off");Yb&&(a.style.border="1px solid black");bg(a);return b}function Vd(a,b,c,d,e){function f(d){var f;f=e?Xg(a.cm,k,b,c):Nd(k,b,c);if(null==f){if(d=!d)d=b.line+
c,d<a.first||d>=a.first+a.size?d=!1:(b=new q(d,b.ch,b.sticky),d=k=t(a,d));if(d)b=Od(e,a.cm,k,b.line,c);else return!1}else b=f;return!0}var g=b,h=c,k=t(a,b.line);if("char"==d)f();else if("column"==d)f(!0);else if("word"==d||"group"==d){var l=null;d="group"==d;for(var m=a.cm&&a.cm.getHelper(b,"wordChars"),p=!0;!(0>c)||f(!p);p=!1){var n=k.text.charAt(b.ch)||"\n",n=hc(n,m)?"w":d&&"\n"==n?"n":!d||/\s/.test(n)?null:"p";!d||p||n||(n="s");if(l&&l!=n){0>c&&(c=1,f(),b.sticky="after");break}n&&(l=n);if(0<c&&
!f(!p))break}}h=Ld(a,b,g,h,!0);Vc(g,h)&&(h.hitSide=!0);return h}function dg(a,b,c,d){var e=a.doc,f=b.left,g;"page"==d?(g=Math.max(Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight)-.5*Oa(a.display),3),g=(0<c?b.bottom:b.top)+c*g):"line"==d&&(g=0<c?b.bottom+3:b.top-3);for(;;){b=sd(a,f,g);if(!b.outside)break;if(0>c?0>=g:g>=e.height){b.hitSide=!0;break}g+=5*c}return b}function eg(a,b){var c=md(a,b.line);if(!c||c.hidden)return null;var d=t(a.doc,b.line),
c=Ae(c,d,b.line),d=ua(d,a.doc.direction),e="left";d&&(e=vb(d,b.ch)%2?"right":"left");c=Be(c.map,b.ch,e);c.offset="right"==c.collapse?c.end:c.start;return c}function mh(a){for(;a;a=a.parentNode)if(/CodeMirror-gutter-wrapper/.test(a.className))return!0;return!1}function qb(a,b){b&&(a.bad=!0);return a}function nh(a,b,c,d,e){function f(a){return function(b){return b.id==a}}function g(){m&&(l+=p,n&&(l+=p),m=n=!1)}function h(a){a&&(g(),l+=a)}function k(b){if(1==b.nodeType){var c=b.getAttribute("cm-text");
if(c)h(c);else{var c=b.getAttribute("cm-marker"),l;if(c)b=a.findMarks(q(d,0),q(e+1,0),f(+c)),b.length&&(l=b[0].find(0))&&h(Ia(a.doc,l.from,l.to).join(p));else if("false"!=b.getAttribute("contenteditable")&&(l=/^(pre|div|p|li|table|br)$/i.test(b.nodeName),/^br$/i.test(b.nodeName)||0!=b.textContent.length)){l&&g();for(c=0;c<b.childNodes.length;c++)k(b.childNodes[c]);/^(pre|p)$/i.test(b.nodeName)&&(n=!0);l&&(m=!0)}}}else 3==b.nodeType&&h(b.nodeValue.replace(/\u200b/g,"").replace(/\u00a0/g," "))}for(var l=
"",m=!1,p=a.doc.lineSeparator(),n=!1;;){k(b);if(b==c)break;b=b.nextSibling;n=!1}return l}function Lc(a,b,c){var d;if(b==a.display.lineDiv){d=a.display.lineDiv.childNodes[c];if(!d)return qb(a.clipPos(q(a.display.viewTo-1)),!0);b=null;c=0}else for(d=b;;d=d.parentNode){if(!d||d==a.display.lineDiv)return null;if(d.parentNode&&d.parentNode==a.display.lineDiv)break}for(var e=0;e<a.display.view.length;e++){var f=a.display.view[e];if(f.node==d)return oh(f,b,c)}}function oh(a,b,c){function d(b,c,d){for(var e=
-1;e<(l?l.length:0);e++)for(var f=0>e?k.map:l[e],g=0;g<f.length;g+=3){var h=f[g+2];if(h==b||h==c){c=B(0>e?a.line:a.rest[e]);e=f[g]+d;if(0>d||h!=b)e=f[g+(d?1:0)];return q(c,e)}}}var e=a.text.firstChild,f=!1;if(!b||!xa(e,b))return qb(q(B(a.line),0),!0);if(b==e&&(f=!0,b=e.childNodes[c],c=0,!b))return c=a.rest?w(a.rest):a.line,qb(q(B(c),c.text.length),f);var g=3==b.nodeType?b:null,h=b;g||1!=b.childNodes.length||3!=b.firstChild.nodeType||(g=b.firstChild,c&&(c=g.nodeValue.length));for(;h.parentNode!=e;)h=
h.parentNode;var k=a.measure,l=k.maps;if(b=d(g,h,c))return qb(b,f);e=h.nextSibling;for(g=g?g.nodeValue.length-c:0;e;e=e.nextSibling){if(b=d(e,e.firstChild,0))return qb(q(b.line,b.ch-g),f);g+=e.textContent.length}for(h=h.previousSibling;h;h=h.previousSibling){if(b=d(h,h.firstChild,-1))return qb(q(b.line,b.ch+c),f);c+=h.textContent.length}}var S=navigator.userAgent,fg=navigator.platform,ya=/gecko\/\d/i.test(S),gg=/MSIE \d/.test(S),hg=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(S),Zb=/Edge\/(\d+)/.exec(S),
A=gg||hg||Zb,D=A&&(gg?document.documentMode||6:+(Zb||hg)[1]),P=!Zb&&/WebKit\//.test(S),ph=P&&/Qt\/\d+\.\d+/.test(S),qc=!Zb&&/Chrome\//.test(S),ka=/Opera\//.test(S),Xf=/Apple Computer/.test(navigator.vendor),qh=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(S),Hg=/PhantomJS/.test(S),Yb=!Zb&&/AppleWebKit/.test(S)&&/Mobile\/\w+/.test(S),rc=/Android/.test(S),sb=Yb||rc||/webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(S),ha=Yb||/Mac/.test(fg),eh=/\bCrOS\b/.test(S),rh=/win/i.test(fg),Xa=ka&&S.match(/Version\/(\d*\.\d*)/);
Xa&&(Xa=Number(Xa[1]));Xa&&15<=Xa&&(ka=!1,P=!0);var Hf=ha&&(ph||ka&&(null==Xa||12.11>Xa)),Ic=ya||A&&9<=D,Ra=function(a,b){var c=a.className,d=Fa(b).exec(c);if(d){var e=c.slice(d.index+d[0].length);a.className=c.slice(0,d.index)+(e?d[1]+e:"")}},db;db=document.createRange?function(a,b,c,d){var e=document.createRange();e.setEnd(d||a,c);e.setStart(a,b);return e}:function(a,b,c){var d=document.body.createTextRange();try{d.moveToElementText(a.parentNode)}catch(e){return d}d.collapse(!0);d.moveEnd("character",
c);d.moveStart("character",b);return d};var $b=function(a){a.select()};Yb?$b=function(a){a.selectionStart=0;a.selectionEnd=a.value.length}:A&&($b=function(a){try{a.select()}catch(b){}});var Wa=function(){this.id=null};Wa.prototype.set=function(a,b){clearTimeout(this.id);this.id=setTimeout(b,a)};var Hc={toString:function(){return"CodeMirror.Pass"}},ra={scroll:!1},Rd={origin:"*mouse"},ac={origin:"+move"},fc=[""],jg=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
kg=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
uf=!1,ta=!1,wb=null,og=function(){function a(a){return 247>=a?"bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(a):1424<=a&&1524>=a?"R":1536<=a&&1785>=a?"nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111".charAt(a-
1536):1774<=a&&2220>=a?"r":8192<=a&&8203>=a?"w":8204==a?"b":"L"}function b(a,b,c){this.level=a;this.from=b;this.to=c}var c=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,d=/[stwN]/,e=/[LRr]/,f=/[Lb1n]/,g=/[1n]/;return function(h,k){var l="ltr"==k?"L":"R";if(0==h.length||"ltr"==k&&!c.test(h))return!1;for(var m=h.length,p=[],n=0;n<m;++n)p.push(a(h.charCodeAt(n)));for(var n=0,r=l;n<m;++n){var q=p[n];"m"==q?p[n]=r:r=q}n=0;for(r=l;n<m;++n)q=p[n],"1"==q&&"r"==r?p[n]="n":e.test(q)&&(r=q,"r"==q&&(p[n]="R"));
n=1;for(r=p[0];n<m-1;++n)q=p[n],"+"==q&&"1"==r&&"1"==p[n+1]?p[n]="1":","!=q||r!=p[n+1]||"1"!=r&&"n"!=r||(p[n]=r),r=q;for(n=0;n<m;++n)if(r=p[n],","==r)p[n]="N";else if("%"==r){r=void 0;for(r=n+1;r<m&&"%"==p[r];++r);for(q=n&&"!"==p[n-1]||r<m&&"1"==p[r]?"1":"N";n<r;++n)p[n]=q;n=r-1}n=0;for(r=l;n<m;++n)q=p[n],"L"==r&&"1"==q?p[n]="L":e.test(q)&&(r=q);for(r=0;r<m;++r)if(d.test(p[r])){n=void 0;for(n=r+1;n<m&&d.test(p[n]);++n);q="L"==(r?p[r-1]:l);for(q=q==("L"==(n<m?p[n]:l))?q?"L":"R":l;r<n;++r)p[r]=q;r=
n-1}for(var l=[],t,n=0;n<m;)if(f.test(p[n])){r=n;for(++n;n<m&&f.test(p[n]);++n);l.push(new b(0,r,n))}else{var u=n,r=l.length;for(++n;n<m&&"L"!=p[n];++n);for(q=u;q<n;)if(g.test(p[q])){u<q&&l.splice(r,0,new b(1,u,q));u=q;for(++q;q<n&&g.test(p[q]);++q);l.splice(r,0,new b(2,u,q));u=q}else++q;u<n&&l.splice(r,0,new b(1,u,n))}"ltr"==k&&(1==l[0].level&&(t=h.match(/^\s+/))&&(l[0].from=t[0].length,l.unshift(new b(0,0,t[0].length))),1==w(l).level&&(t=h.match(/\s+$/))&&(w(l).to-=t[0].length,l.push(new b(0,m-
t[0].length,m))));return"rtl"==k?l.reverse():l}}(),mc=[],v=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):(a=a._handlers||(a._handlers={}),a[b]=(a[b]||mc).concat(c))},fh=function(){if(A&&9>D)return!1;var a=u("div");return"draggable"in a||"dragDrop"in a}(),cd,id,Ud=3!="\n\nb".split(/\n/).length?function(a){for(var b=0,c=[],d=a.length;b<=d;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var f=a.slice(b,"\r"==a.charAt(e-1)?e-1:e),g=f.indexOf("\r");-1!=
g?(c.push(f.slice(0,g)),b+=g+1):(c.push(f),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)},sh=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){var b;try{b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},$g=function(){var a=u("div");if("oncopy"in a)return!0;a.setAttribute("oncopy","return;");return"function"==typeof a.oncopy}(),od=null,dd={},bb={},cb={},G=function(a,
b,c){this.pos=this.start=0;this.string=a;this.tabSize=b||8;this.lineStart=this.lastColumnPos=this.lastColumnValue=0;this.lineOracle=c};G.prototype.eol=function(){return this.pos>=this.string.length};G.prototype.sol=function(){return this.pos==this.lineStart};G.prototype.peek=function(){return this.string.charAt(this.pos)||void 0};G.prototype.next=function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)};G.prototype.eat=function(a){var b=this.string.charAt(this.pos);if("string"==
typeof a?b==a:b&&(a.test?a.test(b):a(b)))return++this.pos,b};G.prototype.eatWhile=function(a){for(var b=this.pos;this.eat(a););return this.pos>b};G.prototype.eatSpace=function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a};G.prototype.skipToEnd=function(){this.pos=this.string.length};G.prototype.skipTo=function(a){a=this.string.indexOf(a,this.pos);if(-1<a)return this.pos=a,!0};G.prototype.backUp=function(a){this.pos-=a};G.prototype.column=function(){this.lastColumnPos<
this.start&&(this.lastColumnValue=fa(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start);return this.lastColumnValue-(this.lineStart?fa(this.string,this.lineStart,this.tabSize):0)};G.prototype.indentation=function(){return fa(this.string,null,this.tabSize)-(this.lineStart?fa(this.string,this.lineStart,this.tabSize):0)};G.prototype.match=function(a,b,c){if("string"==typeof a){var d=function(a){return c?a.toLowerCase():a},e=this.string.substr(this.pos,
a.length);if(d(e)==d(a))return!1!==b&&(this.pos+=a.length),!0}else{if((a=this.string.slice(this.pos).match(a))&&0<a.index)return null;a&&!1!==b&&(this.pos+=a[0].length);return a}};G.prototype.current=function(){return this.string.slice(this.start,this.pos)};G.prototype.hideFirstChars=function(a,b){this.lineStart+=a;try{return b()}finally{this.lineStart-=a}};G.prototype.lookAhead=function(a){var b=this.lineOracle;return b&&b.lookAhead(a)};G.prototype.baseToken=function(){var a=this.lineOracle;return a&&
a.baseToken(this.pos)};var oc=function(a,b){this.state=a;this.lookAhead=b},pa=function(a,b,c,d){this.state=b;this.doc=a;this.line=c;this.maxLookAhead=d||0;this.baseTokens=null;this.baseTokenPos=1};pa.prototype.lookAhead=function(a){var b=this.doc.getLine(this.line+a);null!=b&&a>this.maxLookAhead&&(this.maxLookAhead=a);return b};pa.prototype.baseToken=function(a){if(!this.baseTokens)return null;for(;this.baseTokens[this.baseTokenPos]<=a;)this.baseTokenPos+=2;var b=this.baseTokens[this.baseTokenPos+
1];return{type:b&&b.replace(/( |^)overlay .*/,""),size:this.baseTokens[this.baseTokenPos]-a}};pa.prototype.nextLine=function(){this.line++;0<this.maxLookAhead&&this.maxLookAhead--};pa.fromSaved=function(a,b,c){return b instanceof oc?new pa(a,Ka(a.mode,b.state),c,b.lookAhead):new pa(a,Ka(a.mode,b),c)};pa.prototype.save=function(a){a=!1!==a?Ka(this.doc.mode,this.state):this.state;return 0<this.maxLookAhead?new oc(a,this.maxLookAhead):a};var oe=function(a,b,c){this.start=a.start;this.end=a.pos;this.string=
a.current();this.type=b||null;this.state=c},hb=function(a,b,c){this.text=a;ce(this,b);this.height=c?c(this):1};hb.prototype.lineNo=function(){return B(this)};ab(hb);var vg={},ug={},eb=null,zb=null,Ce={left:0,right:0,top:0,bottom:0},Pa,Ya=function(a,b,c){this.cm=c;var d=this.vert=u("div",[u("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),e=this.horiz=u("div",[u("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");d.tabIndex=e.tabIndex=-1;a(d);a(e);v(d,"scroll",function(){d.clientHeight&&
b(d.scrollTop,"vertical")});v(e,"scroll",function(){e.clientWidth&&b(e.scrollLeft,"horizontal")});this.checkedZeroWidth=!1;A&&8>D&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")};Ya.prototype.update=function(a){var b=a.scrollWidth>a.clientWidth+1,c=a.scrollHeight>a.clientHeight+1,d=a.nativeBarWidth;c?(this.vert.style.display="block",this.vert.style.bottom=b?d+"px":"0",this.vert.firstChild.style.height=Math.max(0,a.scrollHeight-a.clientHeight+(a.viewHeight-(b?d:0)))+"px"):(this.vert.style.display=
"",this.vert.firstChild.style.height="0");b?(this.horiz.style.display="block",this.horiz.style.right=c?d+"px":"0",this.horiz.style.left=a.barLeft+"px",this.horiz.firstChild.style.width=Math.max(0,a.scrollWidth-a.clientWidth+(a.viewWidth-a.barLeft-(c?d:0)))+"px"):(this.horiz.style.display="",this.horiz.firstChild.style.width="0");!this.checkedZeroWidth&&0<a.clientHeight&&(0==d&&this.zeroWidthHack(),this.checkedZeroWidth=!0);return{right:c?d:0,bottom:b?d:0}};Ya.prototype.setScrollLeft=function(a){this.horiz.scrollLeft!=
a&&(this.horiz.scrollLeft=a);this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz,"horiz")};Ya.prototype.setScrollTop=function(a){this.vert.scrollTop!=a&&(this.vert.scrollTop=a);this.disableVert&&this.enableZeroWidthBar(this.vert,this.disableVert,"vert")};Ya.prototype.zeroWidthHack=function(){this.horiz.style.height=this.vert.style.width=ha&&!qh?"12px":"18px";this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none";this.disableHoriz=new Wa;this.disableVert=new Wa};Ya.prototype.enableZeroWidthBar=
function(a,b,c){function d(){var e=a.getBoundingClientRect();("vert"==c?document.elementFromPoint(e.right-1,(e.top+e.bottom)/2):document.elementFromPoint((e.right+e.left)/2,e.bottom-1))!=a?a.style.pointerEvents="none":b.set(1E3,d)}a.style.pointerEvents="auto";b.set(1E3,d)};Ya.prototype.clear=function(){var a=this.horiz.parentNode;a.removeChild(this.horiz);a.removeChild(this.vert)};var bc=function(){};bc.prototype.update=function(){return{bottom:0,right:0}};bc.prototype.setScrollLeft=function(){};
bc.prototype.setScrollTop=function(){};bc.prototype.clear=function(){};var Xe={"native":Ya,"null":bc},Gg=0,xc=function(a,b,c){var d=a.display;this.viewport=b;this.visible=yd(d,a.doc,b);this.editorIsHidden=!d.wrapper.offsetWidth;this.wrapperHeight=d.wrapper.clientHeight;this.wrapperWidth=d.wrapper.clientWidth;this.oldDisplayWidth=La(a);this.force=c;this.dims=nd(a);this.events=[]};xc.prototype.signal=function(a,b){ga(a,b)&&this.events.push(arguments)};xc.prototype.finish=function(){for(var a=0;a<this.events.length;a++)F.apply(null,
this.events[a])};var zc=0,ba=null;A?ba=-.53:ya?ba=15:qc?ba=-.7:Xf&&(ba=-1/3);var ca=function(a,b){this.ranges=a;this.primIndex=b};ca.prototype.primary=function(){return this.ranges[this.primIndex]};ca.prototype.equals=function(a){if(a==this)return!0;if(a.primIndex!=this.primIndex||a.ranges.length!=this.ranges.length)return!1;for(var b=0;b<this.ranges.length;b++){var c=this.ranges[b],d=a.ranges[b];if(!Vc(c.anchor,d.anchor)||!Vc(c.head,d.head))return!1}return!0};ca.prototype.deepCopy=function(){for(var a=
[],b=0;b<this.ranges.length;b++)a[b]=new z(Wc(this.ranges[b].anchor),Wc(this.ranges[b].head));return new ca(a,this.primIndex)};ca.prototype.somethingSelected=function(){for(var a=0;a<this.ranges.length;a++)if(!this.ranges[a].empty())return!0;return!1};ca.prototype.contains=function(a,b){b||(b=a);for(var c=0;c<this.ranges.length;c++){var d=this.ranges[c];if(0<=y(b,d.from())&&0>=y(a,d.to()))return c}return-1};var z=function(a,b){this.anchor=a;this.head=b};z.prototype.from=function(){return jc(this.anchor,
this.head)};z.prototype.to=function(){return ic(this.anchor,this.head)};z.prototype.empty=function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch};Nb.prototype={chunkSize:function(){return this.lines.length},removeInner:function(a,b){for(var c=a,d=a+b;c<d;++c){var e=this.lines[c];this.height-=e.height;var f=e;f.parent=null;be(f);N(e,"delete")}this.lines.splice(a,b)},collapse:function(a){a.push.apply(a,this.lines)},insertInner:function(a,b,c){this.height+=c;this.lines=this.lines.slice(0,
a).concat(b).concat(this.lines.slice(a));for(a=0;a<b.length;++a)b[a].parent=this},iterN:function(a,b,c){for(b=a+b;a<b;++a)if(c(this.lines[a]))return!0}};Ob.prototype={chunkSize:function(){return this.size},removeInner:function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(a<e){var f=Math.min(b,e-a),g=d.height;d.removeInner(a,f);this.height-=g-d.height;e==f&&(this.children.splice(c--,1),d.parent=null);if(0==(b-=f))break;a=0}else a-=e}25>this.size-
b&&(1<this.children.length||!(this.children[0]instanceof Nb))&&(c=[],this.collapse(c),this.children=[new Nb(c)],this.children[0].parent=this)},collapse:function(a){for(var b=0;b<this.children.length;++b)this.children[b].collapse(a)},insertInner:function(a,b,c){this.size+=b.length;this.height+=c;for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<=f){e.insertInner(a,b,c);if(e.lines&&50<e.lines.length){for(b=a=e.lines.length%25+25;b<e.lines.length;)c=new Nb(e.lines.slice(b,
b+=25)),e.height-=c.height,this.children.splice(++d,0,c),c.parent=this;e.lines=e.lines.slice(0,a);this.maybeSpill()}break}a-=f}},maybeSpill:function(){if(!(10>=this.children.length)){var a=this;do{var b=a.children.splice(a.children.length-5,5),b=new Ob(b);if(a.parent){a.size-=b.size;a.height-=b.height;var c=L(a.parent.children,a);a.parent.children.splice(c+1,0,b)}else c=new Ob(a.children),c.parent=a,a.children=[c,b],a=c;b.parent=a.parent}while(10<a.children.length);a.parent.maybeSpill()}},iterN:function(a,
b,c){for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<f){f=Math.min(b,f-a);if(e.iterN(a,f,c))return!0;if(0==(b-=f))break;a=0}else a-=f}}};var Pb=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.doc=a;this.node=b};Pb.prototype.clear=function(){var a=this.doc.cm,b=this.line.widgets,c=this.line,d=B(c);if(null!=d&&b){for(var e=0;e<b.length;++e)b[e]==this&&b.splice(e--,1);b.length||(c.widgets=null);var f=Bb(this);ma(c,Math.max(0,c.height-f));
a&&(Y(a,function(){var b=-f;oa(c)<(a.curOp&&a.curOp.scrollTop||a.doc.scrollTop)&&vc(a,b);Ba(a,d,"widget")}),N(a,"lineWidgetCleared",a,this,d))}};Pb.prototype.changed=function(){var a=this,b=this.height,c=this.doc.cm,d=this.line;this.height=null;var e=Bb(this)-b;e&&(za(this.doc,d)||ma(d,d.height+e),c&&Y(c,function(){c.curOp.forceUpdate=!0;oa(d)<(c.curOp&&c.curOp.scrollTop||c.doc.scrollTop)&&vc(c,e);N(c,"lineWidgetChanged",c,a,B(d))}))};ab(Pb);var Af=0,Da=function(a,b){this.lines=[];this.type=b;this.doc=
a;this.id=++Af};Da.prototype.clear=function(){if(!this.explicitlyCleared){var a=this.doc.cm,b=a&&!a.curOp;b&&Ta(a);if(ga(this,"clear")){var c=this.find();c&&N(this,"clear",c.from,c.to)}for(var d=c=null,e=0;e<this.lines.length;++e){var f=this.lines[e],g=ub(f.markedSpans,this);a&&!this.collapsed?Ba(a,B(f),"text"):a&&(null!=g.to&&(d=B(f)),null!=g.from&&(c=B(f)));for(var h=f,k=f.markedSpans,l=g,m=void 0,p=0;p<k.length;++p)k[p]!=l&&(m||(m=[])).push(k[p]);h.markedSpans=m;null==g.from&&this.collapsed&&!za(this.doc,
f)&&a&&ma(f,Oa(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(e=0;e<this.lines.length;++e)f=na(this.lines[e]),g=lc(f),g>a.display.maxLineLength&&(a.display.maxLine=f,a.display.maxLineLength=g,a.display.maxLineChanged=!0);null!=c&&a&&this.collapsed&&U(a,c,d+1);this.lines.length=0;this.explicitlyCleared=!0;this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&qf(a.doc));a&&N(a,"markerCleared",a,this,c,d);b&&Ua(a);this.parent&&this.parent.clear()}};Da.prototype.find=function(a,b){null==
a&&"bookmark"==this.type&&(a=1);for(var c,d,e=0;e<this.lines.length;++e){var f=this.lines[e],g=ub(f.markedSpans,this);if(null!=g.from&&(c=q(b?f:B(f),g.from),-1==a))return c;if(null!=g.to&&(d=q(b?f:B(f),g.to),1==a))return d}return c&&{from:c,to:d}};Da.prototype.changed=function(){var a=this,b=this.find(-1,!0),c=this,d=this.doc.cm;b&&d&&Y(d,function(){var e=b.line,f=B(b.line);if(f=md(d,f))De(f),d.curOp.selectionChanged=d.curOp.forceUpdate=!0;d.curOp.updateMaxLine=!0;za(c.doc,e)||null==c.height||(f=
c.height,c.height=null,(f=Bb(c)-f)&&ma(e,e.height+f));N(d,"markerChanged",d,a)})};Da.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=L(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)};Da.prototype.detachLine=function(a){this.lines.splice(L(this.lines,a),1);!this.lines.length&&this.doc.cm&&(a=this.doc.cm.curOp,(a.maybeHiddenMarkers||(a.maybeHiddenMarkers=[])).push(this))};
ab(Da);var Qb=function(a,b){this.markers=a;this.primary=b;for(var c=0;c<a.length;++c)a[c].parent=this};Qb.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();N(this,"clear")}};Qb.prototype.find=function(a,b){return this.primary.find(a,b)};ab(Qb);var th=0,V=function(a,b,c,d,e){if(!(this instanceof V))return new V(a,b,c,d,e);null==c&&(c=0);Ob.call(this,[new Nb([new hb("",null)])]);this.first=c;this.scrollTop=
this.scrollLeft=0;this.cantEdit=!1;this.cleanGeneration=1;this.modeFrontier=this.highlightFrontier=c;c=q(c,0);this.sel=wa(c);this.history=new Ac(null);this.id=++th;this.modeOption=b;this.lineSep=d;this.direction="rtl"==e?"rtl":"ltr";this.extend=!1;"string"==typeof a&&(a=this.splitLines(a));Hd(this,{from:c,to:c,text:a});O(this,wa(c),ra)};V.prototype=Xd(Ob.prototype,{constructor:V,iter:function(a,b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,a)},insert:function(a,
b){for(var c=0,d=0;d<b.length;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-this.first,b)},getValue:function(a){var b=Tc(this,this.first,this.first+this.size);return!1===a?b:b.join(a||this.lineSeparator())},setValue:K(function(a){var b=q(this.first,0),c=this.first+this.size-1;kb(this,{from:b,to:q(c,t(this,c).text.length),text:this.splitLines(a),origin:"setValue",full:!0},!0);this.cm&&Gb(this.cm,0,0);O(this,wa(b),ra)}),replaceRange:function(a,b,c,d){b=
x(this,b);c=c?x(this,c):b;lb(this,a,b,c,d)},getRange:function(a,b,c){a=Ia(this,x(this,a),x(this,b));return!1===c?a:a.join(c||this.lineSeparator())},getLine:function(a){return(a=this.getLineHandle(a))&&a.text},getLineHandle:function(a){if(tb(this,a))return t(this,a)},getLineNumber:function(a){return B(a)},getLineHandleVisualStart:function(a){"number"==typeof a&&(a=t(this,a));return na(a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+
this.size-1},clipPos:function(a){return x(this,a)},getCursor:function(a){var b=this.sel.primary();return null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||"to"==a||!1===a?b.to():b.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:K(function(a,b,c){a=x(this,"number"==typeof a?q(a,b||0):a);O(this,wa(a,null),c)}),setSelection:K(function(a,b,c){var d=x(this,a);a=x(this,b||a);O(this,wa(d,a),c)}),extendSelection:K(function(a,
b,c){Cc(this,x(this,a),b&&x(this,b),c)}),extendSelections:K(function(a,b){mf(this,$d(this,a),b)}),extendSelectionsBy:K(function(a,b){var c=gc(this.sel.ranges,a);mf(this,$d(this,c),b)}),setSelections:K(function(a,b,c){if(a.length){for(var d=[],e=0;e<a.length;e++)d[e]=new z(x(this,a[e].anchor),x(this,a[e].head));null==b&&(b=Math.min(a.length-1,this.sel.primIndex));O(this,la(d,b),c)}}),addSelection:K(function(a,b,c){var d=this.sel.ranges.slice(0);d.push(new z(x(this,a),x(this,b||a)));O(this,la(d,d.length-
1),c)}),getSelection:function(a){for(var b=this.sel.ranges,c,d=0;d<b.length;d++){var e=Ia(this,b[d].from(),b[d].to());c=c?c.concat(e):e}return!1===a?c:c.join(a||this.lineSeparator())},getSelections:function(a){for(var b=[],c=this.sel.ranges,d=0;d<c.length;d++){var e=Ia(this,c[d].from(),c[d].to());!1!==a&&(e=e.join(a||this.lineSeparator()));b[d]=e}return b},replaceSelection:function(a,b,c){for(var d=[],e=0;e<this.sel.ranges.length;e++)d[e]=a;this.replaceSelections(d,b,c||"+input")},replaceSelections:K(function(a,
b,c){for(var d=[],e=this.sel,f=0;f<e.ranges.length;f++){var g=e.ranges[f];d[f]={from:g.from(),to:g.to(),text:this.splitLines(a[f]),origin:c}}if(a=b&&"end"!=b){a=[];e=c=q(this.first,0);for(f=0;f<d.length;f++){var h=d[f],g=df(h.from,c,e),k=df(Ca(h),c,e);c=h.to;e=k;"around"==b?(h=this.sel.ranges[f],h=0>y(h.head,h.anchor),a[f]=new z(h?k:g,h?g:k)):a[f]=new z(g,g)}a=new ca(a,this.sel.primIndex)}b=a;for(a=d.length-1;0<=a;a--)kb(this,d[a]);b?nf(this,b):this.cm&&fb(this.cm)}),undo:K(function(){Ec(this,"undo")}),
redo:K(function(){Ec(this,"redo")}),undoSelection:K(function(){Ec(this,"undo",!0)}),redoSelection:K(function(){Ec(this,"redo",!0)}),setExtending:function(a){this.extend=a},getExtending:function(){return this.extend},historySize:function(){for(var a=this.history,b=0,c=0,d=0;d<a.done.length;d++)a.done[d].ranges||++b;for(d=0;d<a.undone.length;d++)a.undone[d].ranges||++c;return{undo:b,redo:c}},clearHistory:function(){this.history=new Ac(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=
this.changeGeneration(!0)},changeGeneration:function(a){a&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null);return this.history.generation},isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:ib(this.history.done),undone:ib(this.history.undone)}},setHistory:function(a){var b=this.history=new Ac(this.history.maxGeneration);b.done=ib(a.done.slice(0),null,!0);b.undone=ib(a.undone.slice(0),null,!0)},setGutterMarker:K(function(a,
b,c){return Mb(this,a,"gutter",function(a){var e=a.gutterMarkers||(a.gutterMarkers={});e[b]=c;!c&&Yd(e)&&(a.gutterMarkers=null);return!0})}),clearGutter:K(function(a){var b=this;this.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&Mb(b,c,"gutter",function(){c.gutterMarkers[a]=null;Yd(c.gutterMarkers)&&(c.gutterMarkers=null);return!0})})}),lineInfo:function(a){var b;if("number"==typeof a){if(!tb(this,a))return null;b=a;a=t(this,a);if(!a)return null}else if(b=B(a),null==b)return null;return{line:b,
handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},addLineClass:K(function(a,b,c){return Mb(this,a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass";if(a[e]){if(Fa(c).test(a[e]))return!1;a[e]+=" "+c}else a[e]=c;return!0})}),removeLineClass:K(function(a,b,c){return Mb(this,a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":
"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass",f=a[e];if(f)if(null==c)a[e]=null;else{var g=f.match(Fa(c));if(!g)return!1;var h=g.index+g[0].length;a[e]=f.slice(0,g.index)+(g.index&&h!=f.length?" ":"")+f.slice(h)||null}else return!1;return!0})}),addLineWidget:K(function(a,b,c){return Pg(this,a,b,c)}),removeLineWidget:function(a){a.clear()},markText:function(a,b,c){return mb(this,x(this,a),x(this,b),c,c&&c.type||"range")},setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?
b.widget:b),insertLeft:b&&b.insertLeft,clearWhenEmpty:!1,shared:b&&b.shared,handleMouseEvents:b&&b.handleMouseEvents};a=x(this,a);return mb(this,a,a,c,"bookmark")},findMarksAt:function(a){a=x(this,a);var b=[],c=t(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},findMarks:function(a,b,c){a=x(this,a);b=x(this,b);var d=[],e=a.line;this.iter(a.line,b.line+1,function(f){if(f=f.markedSpans)for(var g=
0;g<f.length;g++){var h=f[g];null!=h.to&&e==a.line&&a.ch>=h.to||null==h.from&&e!=a.line||null!=h.from&&e==b.line&&h.from>=b.ch||c&&!c(h.marker)||d.push(h.marker.parent||h.marker)}++e});return d},getAllMarks:function(){var a=[];this.iter(function(b){if(b=b.markedSpans)for(var c=0;c<b.length;++c)null!=b[c].from&&a.push(b[c].marker)});return a},posFromIndex:function(a){var b,c=this.first,d=this.lineSeparator().length;this.iter(function(e){e=e.text.length+d;if(e>a)return b=a,!0;a-=e;++c});return x(this,
q(c,b))},indexFromPos:function(a){a=x(this,a);var b=a.ch;if(a.line<this.first||0>a.ch)return 0;var c=this.lineSeparator().length;this.iter(this.first,a.line,function(a){b+=a.text.length+c});return b},copy:function(a){var b=new V(Tc(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep,this.direction);b.scrollTop=this.scrollTop;b.scrollLeft=this.scrollLeft;b.sel=this.sel;b.extend=!1;a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory()));return b},linkedDoc:function(a){a||
(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from);null!=a.to&&a.to<c&&(c=a.to);b=new V(Tc(this,b,c),a.mode||this.modeOption,b,this.lineSep,this.direction);a.sharedHist&&(b.history=this.history);(this.linked||(this.linked=[])).push({doc:b,sharedHist:a.sharedHist});b.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}];a=Bf(this);for(c=0;c<a.length;c++){var d=a[c],e=d.find(),f=b.clipPos(e.from),e=b.clipPos(e.to);y(f,e)&&(f=mb(b,f,e,d.primary,d.primary.type),d.markers.push(f),
f.parent=d)}return b},unlinkDoc:function(a){a instanceof E&&(a=a.doc);if(this.linked)for(var b=0;b<this.linked.length;++b)if(this.linked[b].doc==a){this.linked.splice(b,1);a.unlinkDoc(this);Rg(Bf(this));break}if(a.history==this.history){var c=[a.id];Va(a,function(a){return c.push(a.id)},!0);a.history=new Ac(null);a.history.done=ib(this.history.done,c);a.history.undone=ib(this.history.undone,c)}},iterLinkedDocs:function(a){Va(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm},
splitLines:function(a){return this.lineSep?a.split(this.lineSep):Ud(a)},lineSeparator:function(){return this.lineSep||"\n"},setDirection:K(function(a){"rtl"!=a&&(a="ltr");a!=this.direction&&(this.direction=a,this.iter(function(a){return a.order=null}),this.cm&&Lg(this.cm))})});V.prototype.eachLine=V.prototype.iter;for(var Df=0,Wf=!1,Ea={3:"Pause",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",
37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"\x3d",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"\x3d",109:"-",110:".",111:"/",127:"Delete",145:"ScrollLock",173:"-",186:";",187:"\x3d",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"},cc=0;10>cc;cc++)Ea[cc+48]=Ea[cc+96]=String(cc);for(var Mc=65;90>=Mc;Mc++)Ea[Mc]=
String.fromCharCode(Mc);for(var dc=1;12>=dc;dc++)Ea[dc+111]=Ea[dc+63235]="F"+dc;var Rb={basic:{Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"},pcDefault:{"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo",
"Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection",
"Alt-U":"redoSelection",fallthrough:"basic"},emacsy:{"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars","Ctrl-O":"openLine"},macDefault:{"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo",
"Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft",
"Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",fallthrough:["basic","emacsy"]}};Rb["default"]=ha?Rb.macDefault:Rb.pcDefault;var Sb={selectAll:sf,singleSelection:function(a){return a.setSelection(a.getCursor("anchor"),a.getCursor("head"),ra)},killLine:function(a){return ob(a,function(b){if(b.empty()){var c=t(a.doc,b.head.line).text.length;return b.head.ch==c&&b.head.line<a.lastLine()?{from:b.head,to:q(b.head.line+
1,0)}:{from:b.head,to:q(b.head.line,c)}}return{from:b.from(),to:b.to()}})},deleteLine:function(a){return ob(a,function(b){return{from:q(b.from().line,0),to:x(a.doc,q(b.to().line+1,0))}})},delLineLeft:function(a){return ob(a,function(a){return{from:q(a.from().line,0),to:a.from()}})},delWrappedLineLeft:function(a){return ob(a,function(b){var c=a.charCoords(b.head,"div").top+5;return{from:a.coordsChar({left:0,top:c},"div"),to:b.from()}})},delWrappedLineRight:function(a){return ob(a,function(b){var c=
a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:c},"div");return{from:b.from(),to:c}})},undo:function(a){return a.undo()},redo:function(a){return a.redo()},undoSelection:function(a){return a.undoSelection()},redoSelection:function(a){return a.redoSelection()},goDocStart:function(a){return a.extendSelection(q(a.firstLine(),0))},goDocEnd:function(a){return a.extendSelection(q(a.lastLine()))},goLineStart:function(a){return a.extendSelectionsBy(function(b){return Jf(a,
b.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(a){return a.extendSelectionsBy(function(b){return Kf(a,b.head)},{origin:"+move",bias:1})},goLineEnd:function(a){return a.extendSelectionsBy(function(b){b=b.head.line;var c=t(a.doc,b),d;d=c;for(var e;e=$a(d,!1);)d=e.find(1,!0).line;d!=c&&(b=B(d));return Od(!0,a,c,b,-1)},{origin:"+move",bias:-1})},goLineRight:function(a){return a.extendSelectionsBy(function(b){b=a.cursorCoords(b.head,"div").top+5;return a.coordsChar({left:a.display.lineDiv.offsetWidth+
100,top:b},"div")},ac)},goLineLeft:function(a){return a.extendSelectionsBy(function(b){b=a.cursorCoords(b.head,"div").top+5;return a.coordsChar({left:0,top:b},"div")},ac)},goLineLeftSmart:function(a){return a.extendSelectionsBy(function(b){var c=a.cursorCoords(b.head,"div").top+5,c=a.coordsChar({left:0,top:c},"div");return c.ch<a.getLine(c.line).search(/\S/)?Kf(a,b.head):c},ac)},goLineUp:function(a){return a.moveV(-1,"line")},goLineDown:function(a){return a.moveV(1,"line")},goPageUp:function(a){return a.moveV(-1,
"page")},goPageDown:function(a){return a.moveV(1,"page")},goCharLeft:function(a){return a.moveH(-1,"char")},goCharRight:function(a){return a.moveH(1,"char")},goColumnLeft:function(a){return a.moveH(-1,"column")},goColumnRight:function(a){return a.moveH(1,"column")},goWordLeft:function(a){return a.moveH(-1,"word")},goGroupRight:function(a){return a.moveH(1,"group")},goGroupLeft:function(a){return a.moveH(-1,"group")},goWordRight:function(a){return a.moveH(1,"word")},delCharBefore:function(a){return a.deleteH(-1,
"char")},delCharAfter:function(a){return a.deleteH(1,"char")},delWordBefore:function(a){return a.deleteH(-1,"word")},delWordAfter:function(a){return a.deleteH(1,"word")},delGroupBefore:function(a){return a.deleteH(-1,"group")},delGroupAfter:function(a){return a.deleteH(1,"group")},indentAuto:function(a){return a.indentSelection("smart")},indentMore:function(a){return a.indentSelection("add")},indentLess:function(a){return a.indentSelection("subtract")},insertTab:function(a){return a.replaceSelection("\t")},
insertSoftTab:function(a){for(var b=[],c=a.listSelections(),d=a.options.tabSize,e=0;e<c.length;e++){var f=c[e].from(),f=fa(a.getLine(f.line),f.ch,d);b.push(Qc(d-f%d))}a.replaceSelections(b)},defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):a.execCommand("insertTab")},transposeChars:function(a){return Y(a,function(){for(var b=a.listSelections(),c=[],d=0;d<b.length;d++)if(b[d].empty()){var e=b[d].head,f=t(a.doc,e.line).text;if(f)if(e.ch==f.length&&(e=new q(e.line,e.ch-1)),0<e.ch)e=
new q(e.line,e.ch+1),a.replaceRange(f.charAt(e.ch-1)+f.charAt(e.ch-2),q(e.line,e.ch-2),e,"+transpose");else if(e.line>a.doc.first){var g=t(a.doc,e.line-1).text;g&&(e=new q(e.line,1),a.replaceRange(f.charAt(0)+a.doc.lineSeparator()+g.charAt(g.length-1),q(e.line-1,g.length-1),e,"+transpose"))}c.push(new z(e,e))}a.setSelections(c)})},newlineAndIndent:function(a){return Y(a,function(){for(var b=a.listSelections(),c=b.length-1;0<=c;c--)a.replaceRange(a.doc.lineSeparator(),b[c].anchor,b[c].head,"+input");
b=a.listSelections();for(c=0;c<b.length;c++)a.indentLine(b[c].from().line,null,!0);fb(a)})},openLine:function(a){return a.replaceSelection("\n","start")},toggleOverwrite:function(a){return a.toggleOverwrite()}},Yg=new Wa,Pd=null,Qd=function(a,b,c){this.time=a;this.pos=b;this.button=c};Qd.prototype.compare=function(a,b,c){return this.time+400>a&&0==y(b,this.pos)&&c==this.button};var Vb,Ub,pb={toString:function(){return"CodeMirror.Init"}},Vf={},Kc={};E.defaults=Vf;E.optionHandlers=Kc;var Sd=[];E.defineInitHook=
function(a){return Sd.push(a)};var da=null,C=function(a){this.cm=a;this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null;this.polling=new Wa;this.composing=null;this.gracePeriod=!1;this.readDOMTimeout=null};C.prototype.init=function(a){function b(a){if(!I(e,a)){if(e.somethingSelected())Yf({lineWise:!1,text:e.getSelections()}),"cut"==a.type&&e.replaceSelection("",null,"cut");else if(e.options.lineWiseCopyCut){var b=ag(e);Yf({lineWise:!0,text:b.text});"cut"==a.type&&
e.operation(function(){e.setSelections(b.ranges,0,ra);e.replaceSelection("",null,"cut")})}else return;if(a.clipboardData){a.clipboardData.clearData();var c=da.text.join("\n");a.clipboardData.setData("Text",c);if(a.clipboardData.getData("Text")==c){a.preventDefault();return}}var l=cg();a=l.firstChild;e.display.lineSpace.insertBefore(l,e.display.lineSpace.firstChild);a.value=da.text.join("\n");var m=document.activeElement;$b(a);setTimeout(function(){e.display.lineSpace.removeChild(l);m.focus();m==f&&
d.showPrimarySelection()},50)}}var c=this,d=this,e=d.cm,f=d.div=a.lineDiv;bg(f,e.options.spellcheck);v(f,"paste",function(a){I(e,a)||$f(a,e)||11>=D&&setTimeout(J(e,function(){return c.updateFromDOM()}),20)});v(f,"compositionstart",function(a){c.composing={data:a.data,done:!1}});v(f,"compositionupdate",function(a){c.composing||(c.composing={data:a.data,done:!1})});v(f,"compositionend",function(a){c.composing&&(a.data!=c.composing.data&&c.readFromDOMSoon(),c.composing.done=!0)});v(f,"touchstart",function(){return d.forceCompositionEnd()});
v(f,"input",function(){c.composing||c.readFromDOMSoon()});v(f,"copy",b);v(f,"cut",b)};C.prototype.prepareSelection=function(){var a=Me(this.cm,!1);a.focus=this.cm.state.focused;return a};C.prototype.showSelection=function(a,b){a&&this.cm.display.view.length&&((a.focus||b)&&this.showPrimarySelection(),this.showMultipleSelections(a))};C.prototype.getSelection=function(){return this.cm.display.wrapper.ownerDocument.getSelection()};C.prototype.showPrimarySelection=function(){var a=this.getSelection(),
b=this.cm,c=b.doc.sel.primary(),d=c.from(),c=c.to();if(b.display.viewTo==b.display.viewFrom||d.line>=b.display.viewTo||c.line<b.display.viewFrom)a.removeAllRanges();else{var e=Lc(b,a.anchorNode,a.anchorOffset),f=Lc(b,a.focusNode,a.focusOffset);if(!e||e.bad||!f||f.bad||0!=y(jc(e,f),d)||0!=y(ic(e,f),c))if(e=b.display.view,d=d.line>=b.display.viewFrom&&eg(b,d)||{node:e[0].measure.map[2],offset:0},c=c.line<b.display.viewTo&&eg(b,c),c||(c=e[e.length-1].measure,c=c.maps?c.maps[c.maps.length-1]:c.map,c=
{node:c[c.length-1],offset:c[c.length-2]-c[c.length-3]}),d&&c){var e=a.rangeCount&&a.getRangeAt(0),g;try{g=db(d.node,d.offset,c.offset,c.node)}catch(h){}g&&(!ya&&b.state.focused?(a.collapse(d.node,d.offset),g.collapsed||(a.removeAllRanges(),a.addRange(g))):(a.removeAllRanges(),a.addRange(g)),e&&null==a.anchorNode?a.addRange(e):ya&&this.startGracePeriod());this.rememberSelection()}else a.removeAllRanges()}};C.prototype.startGracePeriod=function(){var a=this;clearTimeout(this.gracePeriod);this.gracePeriod=
setTimeout(function(){a.gracePeriod=!1;a.selectionChanged()&&a.cm.operation(function(){return a.cm.curOp.selectionChanged=!0})},20)};C.prototype.showMultipleSelections=function(a){Z(this.cm.display.cursorDiv,a.cursors);Z(this.cm.display.selectionDiv,a.selection)};C.prototype.rememberSelection=function(){var a=this.getSelection();this.lastAnchorNode=a.anchorNode;this.lastAnchorOffset=a.anchorOffset;this.lastFocusNode=a.focusNode;this.lastFocusOffset=a.focusOffset};C.prototype.selectionInEditor=function(){var a=
this.getSelection();if(!a.rangeCount)return!1;a=a.getRangeAt(0).commonAncestorContainer;return xa(this.div,a)};C.prototype.focus=function(){"nocursor"!=this.cm.options.readOnly&&(this.selectionInEditor()||this.showSelection(this.prepareSelection(),!0),this.div.focus())};C.prototype.blur=function(){this.div.blur()};C.prototype.getField=function(){return this.div};C.prototype.supportsTouch=function(){return!0};C.prototype.receivedFocus=function(){function a(){b.cm.state.focused&&(b.pollSelection(),
b.polling.set(b.cm.options.pollInterval,a))}var b=this;this.selectionInEditor()?this.pollSelection():Y(this.cm,function(){return b.cm.curOp.selectionChanged=!0});this.polling.set(this.cm.options.pollInterval,a)};C.prototype.selectionChanged=function(){var a=this.getSelection();return a.anchorNode!=this.lastAnchorNode||a.anchorOffset!=this.lastAnchorOffset||a.focusNode!=this.lastFocusNode||a.focusOffset!=this.lastFocusOffset};C.prototype.pollSelection=function(){if(null==this.readDOMTimeout&&!this.gracePeriod&&
this.selectionChanged()){var a=this.getSelection(),b=this.cm;if(rc&&qc&&this.cm.options.gutters.length&&mh(a.anchorNode))this.cm.triggerOnKeyDown({type:"keydown",keyCode:8,preventDefault:Math.abs}),this.blur(),this.focus();else if(!this.composing){this.rememberSelection();var c=Lc(b,a.anchorNode,a.anchorOffset),d=Lc(b,a.focusNode,a.focusOffset);c&&d&&Y(b,function(){O(b.doc,wa(c,d),ra);if(c.bad||d.bad)b.curOp.selectionChanged=!0})}}};C.prototype.pollContent=function(){null!=this.readDOMTimeout&&(clearTimeout(this.readDOMTimeout),
this.readDOMTimeout=null);var a=this.cm,b=a.display,c=a.doc.sel.primary(),d=c.from(),e=c.to();0==d.ch&&d.line>a.firstLine()&&(d=q(d.line-1,t(a.doc,d.line-1).length));e.ch==t(a.doc,e.line).text.length&&e.line<a.lastLine()&&(e=q(e.line+1,0));if(d.line<b.viewFrom||e.line>b.viewTo-1)return!1;var f;d.line==b.viewFrom||0==(f=Ma(a,d.line))?(c=B(b.view[0].line),f=b.view[0].node):(c=B(b.view[f].line),f=b.view[f-1].node.nextSibling);var g=Ma(a,e.line);g==b.view.length-1?(e=b.viewTo-1,b=b.lineDiv.lastChild):
(e=B(b.view[g+1].line)-1,b=b.view[g+1].node.previousSibling);if(!f)return!1;b=a.doc.splitLines(nh(a,f,b,c,e));for(f=Ia(a.doc,q(c,0),q(e,t(a.doc,e).text.length));1<b.length&&1<f.length;)if(w(b)==w(f))b.pop(),f.pop(),e--;else if(b[0]==f[0])b.shift(),f.shift(),c++;else break;for(var h=0,g=0,k=b[0],l=f[0],m=Math.min(k.length,l.length);h<m&&k.charCodeAt(h)==l.charCodeAt(h);)++h;k=w(b);l=w(f);for(m=Math.min(k.length-(1==b.length?h:0),l.length-(1==f.length?h:0));g<m&&k.charCodeAt(k.length-g-1)==l.charCodeAt(l.length-
g-1);)++g;if(1==b.length&&1==f.length&&c==d.line)for(;h&&h>d.ch&&k.charCodeAt(k.length-g-1)==l.charCodeAt(l.length-g-1);)h--,g++;b[b.length-1]=k.slice(0,k.length-g).replace(/^\u200b+/,"");b[0]=b[0].slice(h).replace(/\u200b+$/,"");d=q(c,h);c=q(e,f.length?w(f).length-g:0);if(1<b.length||b[0]||y(d,c))return lb(a.doc,b,d,c,"+input"),!0};C.prototype.ensurePolled=function(){this.forceCompositionEnd()};C.prototype.reset=function(){this.forceCompositionEnd()};C.prototype.forceCompositionEnd=function(){this.composing&&
(clearTimeout(this.readDOMTimeout),this.composing=null,this.updateFromDOM(),this.div.blur(),this.div.focus())};C.prototype.readFromDOMSoon=function(){var a=this;null==this.readDOMTimeout&&(this.readDOMTimeout=setTimeout(function(){a.readDOMTimeout=null;if(a.composing)if(a.composing.done)a.composing=null;else return;a.updateFromDOM()},80))};C.prototype.updateFromDOM=function(){var a=this;!this.cm.isReadOnly()&&this.pollContent()||Y(this.cm,function(){return U(a.cm)})};C.prototype.setUneditable=function(a){a.contentEditable=
"false"};C.prototype.onKeyPress=function(a){0==a.charCode||this.composing||(a.preventDefault(),this.cm.isReadOnly()||J(this.cm,Td)(this.cm,String.fromCharCode(null==a.charCode?a.keyCode:a.charCode),0))};C.prototype.readOnlyChanged=function(a){this.div.contentEditable=String("nocursor"!=a)};C.prototype.onContextMenu=function(){};C.prototype.resetPosition=function(){};C.prototype.needsContentAttribute=!0;var H=function(a){this.cm=a;this.prevInput="";this.pollingFast=!1;this.polling=new Wa;this.hasSelection=
!1;this.composing=null};H.prototype.init=function(a){function b(a){if(!I(e,a)){if(e.somethingSelected())da={lineWise:!1,text:e.getSelections()};else if(e.options.lineWiseCopyCut){var b=ag(e);da={lineWise:!0,text:b.text};"cut"==a.type?e.setSelections(b.ranges,null,ra):(d.prevInput="",f.value=b.text.join("\n"),$b(f))}else return;"cut"==a.type&&(e.state.cutIncoming=!0)}}var c=this,d=this,e=this.cm;this.createField(a);var f=this.textarea;a.wrapper.insertBefore(this.wrapper,a.wrapper.firstChild);Yb&&(f.style.width=
"0px");v(f,"input",function(){A&&9<=D&&c.hasSelection&&(c.hasSelection=null);d.poll()});v(f,"paste",function(a){I(e,a)||$f(a,e)||(e.state.pasteIncoming=!0,d.fastPoll())});v(f,"cut",b);v(f,"copy",b);v(a.scroller,"paste",function(b){va(a,b)||I(e,b)||(e.state.pasteIncoming=!0,d.focus())});v(a.lineSpace,"selectstart",function(b){va(a,b)||T(b)});v(f,"compositionstart",function(){var a=e.getCursor("from");d.composing&&d.composing.range.clear();d.composing={start:a,range:e.markText(a,e.getCursor("to"),{className:"CodeMirror-composing"})}});
v(f,"compositionend",function(){d.composing&&(d.poll(),d.composing.range.clear(),d.composing=null)})};H.prototype.createField=function(a){this.wrapper=cg();this.textarea=this.wrapper.firstChild};H.prototype.prepareSelection=function(){var a=this.cm,b=a.display,c=a.doc,d=Me(a);if(a.options.moveInputWithCursor){var a=ja(a,c.sel.primary().head,"div"),c=b.wrapper.getBoundingClientRect(),e=b.lineDiv.getBoundingClientRect();d.teTop=Math.max(0,Math.min(b.wrapper.clientHeight-10,a.top+e.top-c.top));d.teLeft=
Math.max(0,Math.min(b.wrapper.clientWidth-10,a.left+e.left-c.left))}return d};H.prototype.showSelection=function(a){var b=this.cm.display;Z(b.cursorDiv,a.cursors);Z(b.selectionDiv,a.selection);null!=a.teTop&&(this.wrapper.style.top=a.teTop+"px",this.wrapper.style.left=a.teLeft+"px")};H.prototype.reset=function(a){if(!this.contextMenuPending&&!this.composing){var b=this.cm;b.somethingSelected()?(this.prevInput="",a=b.getSelection(),this.textarea.value=a,b.state.focused&&$b(this.textarea),A&&9<=D&&
(this.hasSelection=a)):a||(this.prevInput=this.textarea.value="",A&&9<=D&&(this.hasSelection=null))}};H.prototype.getField=function(){return this.textarea};H.prototype.supportsTouch=function(){return!1};H.prototype.focus=function(){if("nocursor"!=this.cm.options.readOnly&&(!sb||sa()!=this.textarea))try{this.textarea.focus()}catch(a){}};H.prototype.blur=function(){this.textarea.blur()};H.prototype.resetPosition=function(){this.wrapper.style.top=this.wrapper.style.left=0};H.prototype.receivedFocus=
function(){this.slowPoll()};H.prototype.slowPoll=function(){var a=this;this.pollingFast||this.polling.set(this.cm.options.pollInterval,function(){a.poll();a.cm.state.focused&&a.slowPoll()})};H.prototype.fastPoll=function(){function a(){c.poll()||b?(c.pollingFast=!1,c.slowPoll()):(b=!0,c.polling.set(60,a))}var b=!1,c=this;c.pollingFast=!0;c.polling.set(20,a)};H.prototype.poll=function(){var a=this,b=this.cm,c=this.textarea,d=this.prevInput;if(this.contextMenuPending||!b.state.focused||sh(c)&&!d&&!this.composing||
b.isReadOnly()||b.options.disableInput||b.state.keySeq)return!1;var e=c.value;if(e==d&&!b.somethingSelected())return!1;if(A&&9<=D&&this.hasSelection===e||ha&&/[\uf700-\uf7ff]/.test(e))return b.display.input.reset(),!1;if(b.doc.sel==b.display.selForContextMenu){var f=e.charCodeAt(0);8203!=f||d||(d="​");if(8666==f)return this.reset(),this.cm.execCommand("undo")}for(var g=0,f=Math.min(d.length,e.length);g<f&&d.charCodeAt(g)==e.charCodeAt(g);)++g;Y(b,function(){Td(b,e.slice(g),d.length-g,null,a.composing?
"*compose":null);1E3<e.length||-1<e.indexOf("\n")?c.value=a.prevInput="":a.prevInput=e;a.composing&&(a.composing.range.clear(),a.composing.range=b.markText(a.composing.start,b.getCursor("to"),{className:"CodeMirror-composing"}))});return!0};H.prototype.ensurePolled=function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)};H.prototype.onKeyPress=function(){A&&9<=D&&(this.hasSelection=null);this.fastPoll()};H.prototype.onContextMenu=function(a){function b(){if(null!=g.selectionStart){var a=e.somethingSelected(),
b="​"+(a?g.value:"");g.value="⇚";g.value=b;d.prevInput=a?"":"​";g.selectionStart=1;g.selectionEnd=b.length;f.selForContextMenu=e.doc.sel}}function c(){d.contextMenuPending=!1;d.wrapper.style.cssText=m;g.style.cssText=l;A&&9>D&&f.scrollbars.setScrollTop(f.scroller.scrollTop=k);if(null!=g.selectionStart){(!A||A&&9>D)&&b();var a=0,c=function(){f.selForContextMenu==e.doc.sel&&0==g.selectionStart&&0<g.selectionEnd&&"​"==d.prevInput?J(e,sf)(e):10>a++?f.detectingSelectAll=setTimeout(c,500):(f.selForContextMenu=
null,f.input.reset())};f.detectingSelectAll=setTimeout(c,200)}}var d=this,e=d.cm,f=e.display,g=d.textarea,h=Qa(e,a),k=f.scroller.scrollTop;if(h&&!ka){e.options.resetSelectionOnContextMenu&&-1==e.doc.sel.contains(h)&&J(e,O)(e.doc,wa(h),ra);var l=g.style.cssText,m=d.wrapper.style.cssText;d.wrapper.style.cssText="position: absolute";h=d.wrapper.getBoundingClientRect();g.style.cssText="position: absolute; width: 30px; height: 30px;\n      top: "+(a.clientY-h.top-5)+"px; left: "+(a.clientX-h.left-5)+"px;\n      z-index: 1000; background: "+
(A?"rgba(255, 255, 255, .05)":"transparent")+";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity\x3d5);";var p;P&&(p=window.scrollY);f.input.focus();P&&window.scrollTo(null,p);f.input.reset();e.somethingSelected()||(g.value=d.prevInput=" ");d.contextMenuPending=!0;f.selForContextMenu=e.doc.sel;clearTimeout(f.detectingSelectAll);A&&9<=D&&b();if(Ic){xb(a);var n=function(){aa(window,"mouseup",n);setTimeout(c,20)};v(window,"mouseup",n)}else setTimeout(c,
50)}};H.prototype.readOnlyChanged=function(a){a||this.reset();this.textarea.disabled="nocursor"==a};H.prototype.setUneditable=function(){};H.prototype.needsContentAttribute=!1;(function(a){function b(b,e,f,g){a.defaults[b]=e;f&&(c[b]=g?function(a,b,c){c!=pb&&f(a,b,c)}:f)}var c=a.optionHandlers;a.defineOption=b;a.Init=pb;b("value","",function(a,b){return a.setValue(b)},!0);b("mode",null,function(a,b){a.doc.modeOption=b;Gd(a)},!0);b("indentUnit",2,Gd,!0);b("indentWithTabs",!1);b("smartIndent",!0);b("tabSize",
4,function(a){Kb(a);Db(a);U(a)},!0);b("lineSeparator",null,function(a,b){if(a.doc.lineSep=b){var c=[],g=a.doc.first;a.doc.iter(function(a){for(var d=0;;){var h=a.text.indexOf(b,d);if(-1==h)break;d=h+b.length;c.push(q(g,h))}g++});for(var h=c.length-1;0<=h;h--)lb(a.doc,b,c[h],q(c[h].line,c[h].ch+b.length))}});b("specialChars",/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g,function(a,b,c){a.state.specialChars=new RegExp(b.source+(b.test("\t")?"":"|\t"),"g");c!=pb&&a.refresh()});
b("specialCharPlaceholder",yg,function(a){return a.refresh()},!0);b("electricChars",!0);b("inputStyle",sb?"contenteditable":"textarea",function(){throw Error("inputStyle can not (yet) be changed in a running editor");},!0);b("spellcheck",!1,function(a,b){return a.getInputField().spellcheck=b},!0);b("rtlMoveVisually",!rh);b("wholeLineUpdateBefore",!0);b("theme","default",function(a){Uf(a);Wb(a)},!0);b("keyMap","default",function(a,b,c){b=Fc(b);(c=c!=pb&&Fc(c))&&c.detach&&c.detach(a,b);b.attach&&b.attach(a,
c||null)});b("extraKeys",null);b("configureMouse",null);b("lineWrapping",!1,kh,!0);b("gutters",[],function(a){Ed(a.options);Wb(a)},!0);b("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?ud(a.display)+"px":"0";a.refresh()},!0);b("coverGutterNextToScrollbar",!1,function(a){return gb(a)},!0);b("scrollbarStyle","native",function(a){We(a);gb(a);a.display.scrollbars.setScrollTop(a.doc.scrollTop);a.display.scrollbars.setScrollLeft(a.doc.scrollLeft)},!0);b("lineNumbers",!1,function(a){Ed(a.options);
Wb(a)},!0);b("firstLineNumber",1,Wb,!0);b("lineNumberFormatter",function(a){return a},Wb,!0);b("showCursorWhenSelecting",!1,Eb,!0);b("resetSelectionOnContextMenu",!0);b("lineWiseCopyCut",!0);b("pasteLinesPerSelection",!0);b("readOnly",!1,function(a,b){"nocursor"==b&&(Fb(a),a.display.input.blur());a.display.input.readOnlyChanged(b)});b("disableInput",!1,function(a,b){b||a.display.input.reset()},!0);b("dragDrop",!0,jh);b("allowDropFileTypes",null);b("cursorBlinkRate",530);b("cursorScrollMargin",0);
b("cursorHeight",1,Eb,!0);b("singleCursorHeightPerLine",!0,Eb,!0);b("workTime",100);b("workDelay",100);b("flattenSpans",!0,Kb,!0);b("addModeClass",!1,Kb,!0);b("pollInterval",100);b("undoDepth",200,function(a,b){return a.doc.history.undoDepth=b});b("historyEventDelay",1250);b("viewportMargin",10,function(a){return a.refresh()},!0);b("maxHighlightLength",1E4,Kb,!0);b("moveInputWithCursor",!0,function(a,b){b||a.display.input.resetPosition()});b("tabindex",null,function(a,b){return a.display.input.getField().tabIndex=
b||""});b("autofocus",null);b("direction","ltr",function(a,b){return a.doc.setDirection(b)},!0);b("phrases",null)})(E);(function(a){var b=a.optionHandlers,c=a.helpers={};a.prototype={constructor:a,focus:function(){window.focus();this.display.input.focus()},setOption:function(a,c){var f=this.options,g=f[a];if(f[a]!=c||"mode"==a)f[a]=c,b.hasOwnProperty(a)&&J(this,b[a])(this,c,g),F(this,"optionChange",this,a)},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,
b){this.state.keyMaps[b?"push":"unshift"](Fc(a))},removeKeyMap:function(a){for(var b=this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||b[c].name==a)return b.splice(c,1),!0},addOverlay:R(function(b,c){var f=b.token?b:a.getMode(this.options,b);if(f.startState)throw Error("Overlays may not be stateful.");ig(this.state.overlays,{mode:f,modeSpec:b,opaque:c&&c.opaque,priority:c&&c.priority||0},function(a){return a.priority});this.state.modeGen++;U(this)}),removeOverlay:R(function(a){for(var b=this.state.overlays,
c=0;c<b.length;++c){var g=b[c].modeSpec;if(g==a||"string"==typeof a&&g.name==a){b.splice(c,1);this.state.modeGen++;U(this);break}}}),indentLine:R(function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract");tb(this.doc,a)&&Xb(this,a,b,c)}),indentSelection:R(function(a){for(var b=this.doc.sel.ranges,c=-1,g=0;g<b.length;g++){var h=b[g];if(h.empty())h.head.line>c&&(Xb(this,h.head.line,a,!0),c=h.head.line,g==this.doc.sel.primIndex&&fb(this));
else{for(var k=h.from(),h=h.to(),l=Math.max(c,k.line),c=Math.min(this.lastLine(),h.line-(h.ch?0:1))+1,h=l;h<c;++h)Xb(this,h,a);h=this.doc.sel.ranges;0==k.ch&&b.length==h.length&&0<h[g].from().ch&&Kd(this.doc,g,new z(k,h[g].to()),ra)}}}),getTokenAt:function(a,b){return ne(this,a,b)},getLineTokens:function(a,b){return ne(this,q(a),b,!0)},getTokenTypeAt:function(a){a=x(this.doc,a);var b=le(this,t(this.doc,a.line)),c=0,g=(b.length-1)/2;a=a.ch;if(0==a)b=b[2];else for(;;){var h=c+g>>1;if((h?b[2*h-1]:0)>=
a)g=h;else if(b[2*h+1]<a)c=h+1;else{b=b[2*h+2];break}}c=b?b.indexOf("overlay "):-1;return 0>c?b:0==c?null:b.slice(0,c-1)},getModeAt:function(b){var c=this.doc.mode;return c.innerMode?a.innerMode(c,this.getTokenAt(b).state).mode:c},getHelper:function(a,b){return this.getHelpers(a,b)[0]},getHelpers:function(a,b){var f=[];if(!c.hasOwnProperty(b))return f;var g=c[b],h=this.getModeAt(a);if("string"==typeof h[b])g[h[b]]&&f.push(g[h[b]]);else if(h[b])for(var k=0;k<h[b].length;k++){var l=g[h[b][k]];l&&f.push(l)}else h.helperType&&
g[h.helperType]?f.push(g[h.helperType]):g[h.name]&&f.push(g[h.name]);for(k=0;k<g._global.length;k++)l=g._global[k],l.pred(h,this)&&-1==L(f,l.val)&&f.push(l.val);return f},getStateAfter:function(a,b){var c=this.doc;a=Math.max(c.first,Math.min(null==a?c.first+c.size-1:a,c.first+c.size-1));return yb(this,a+1,b).state},cursorCoords:function(a,b){var c;c=this.doc.sel.primary();c=null==a?c.head:"object"==typeof a?x(this.doc,a):a?c.from():c.to();return ja(this,c,b||"page")},charCoords:function(a,b){return qd(this,
x(this.doc,a),b||"page")},coordsChar:function(a,b){a=He(this,a,b||"page");return sd(this,a.left,a.top)},lineAtHeight:function(a,b){a=He(this,{top:a,left:0},b||"page").top;return Ja(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b,c){var g=!1;if("number"==typeof a){var h=this.doc.first+this.doc.size-1;a<this.doc.first?a=this.doc.first:a>h&&(a=h,g=!0);a=t(this.doc,a)}return sc(this,a,{top:0,left:0},b||"page",c||g).top+(g?this.doc.height-oa(a):0)},defaultTextHeight:function(){return Oa(this.display)},
defaultCharWidth:function(){return Cb(this.display)},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(a,b,c,g,h){var k=this.display;a=ja(this,x(this.doc,a));var l=a.bottom,m=a.left;b.style.position="absolute";b.setAttribute("cm-ignore-events","true");this.display.input.setUneditable(b);k.sizer.appendChild(b);if("over"==g)l=a.top;else if("above"==g||"near"==g){var p=Math.max(k.wrapper.clientHeight,this.doc.height),n=Math.max(k.sizer.clientWidth,k.lineSpace.clientWidth);
("above"==g||a.bottom+b.offsetHeight>p)&&a.top>b.offsetHeight?l=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=p&&(l=a.bottom);m+b.offsetWidth>n&&(m=n-b.offsetWidth)}b.style.top=l+"px";b.style.left=b.style.right="";"right"==h?(m=k.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==h?m=0:"middle"==h&&(m=(k.sizer.clientWidth-b.offsetWidth)/2),b.style.left=m+"px");c&&(a=Ad(this,{left:m,top:l,right:m+b.offsetWidth,bottom:l+b.offsetHeight}),null!=a.scrollTop&&Hb(this,a.scrollTop),null!=a.scrollLeft&&
Sa(this,a.scrollLeft))},triggerOnKeyDown:R(Nf),triggerOnKeyPress:R(Pf),triggerOnKeyUp:Of,triggerOnMouseDown:R(Qf),execCommand:function(a){if(Sb.hasOwnProperty(a))return Sb[a].call(null,this)},triggerElectric:R(function(a){Zf(this,a)}),findPosH:function(a,b,c,g){var h=1;0>b&&(h=-1,b=-b);a=x(this.doc,a);for(var k=0;k<b&&(a=Vd(this.doc,a,h,c,g),!a.hitSide);++k);return a},moveH:R(function(a,b){var c=this;this.extendSelectionsBy(function(g){return c.display.shift||c.doc.extend||g.empty()?Vd(c.doc,g.head,
a,b,c.options.rtlMoveVisually):0>a?g.from():g.to()},ac)}),deleteH:R(function(a,b){var c=this.doc;this.doc.sel.somethingSelected()?c.replaceSelection("",null,"+delete"):ob(this,function(g){var h=Vd(c,g.head,a,b,!1);return 0>a?{from:h,to:g.head}:{from:g.head,to:h}})}),findPosV:function(a,b,c,g){var h=1;0>b&&(h=-1,b=-b);var k=x(this.doc,a);for(a=0;a<b&&(k=ja(this,k,"div"),null==g?g=k.left:k.left=g,k=dg(this,k,h,c),!k.hitSide);++a);return k},moveV:R(function(a,b){var c=this,g=this.doc,h=[],k=!this.display.shift&&
!g.extend&&g.sel.somethingSelected();g.extendSelectionsBy(function(l){if(k)return 0>a?l.from():l.to();var p=ja(c,l.head,"div");null!=l.goalColumn&&(p.left=l.goalColumn);h.push(p.left);var n=dg(c,p,a,b);"page"==b&&l==g.sel.primary()&&vc(c,qd(c,n,"div").top-p.top);return n},ac);if(h.length)for(var l=0;l<g.sel.ranges.length;l++)g.sel.ranges[l].goalColumn=h[l]}),findWordAt:function(a){var b=t(this.doc,a.line).text,c=a.ch,g=a.ch;if(b){var h=this.getHelper(a,"wordChars");"before"!=a.sticky&&g!=b.length||
!c?++g:--c;for(var k=b.charAt(c),k=hc(k,h)?function(a){return hc(a,h)}:/\s/.test(k)?function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&!hc(a)};0<c&&k(b.charAt(c-1));)--c;for(;g<b.length&&k(b.charAt(g));)++g}return new z(q(a.line,c),q(a.line,g))},toggleOverwrite:function(a){if(null==a||a!=this.state.overwrite)(this.state.overwrite=!this.state.overwrite)?Ga(this.display.cursorDiv,"CodeMirror-overwrite"):Ra(this.display.cursorDiv,"CodeMirror-overwrite"),F(this,"overwriteToggle",this,this.state.overwrite)},
hasFocus:function(){return this.display.input.getField()==sa()},isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:R(function(a,b){Gb(this,a,b)}),getScrollInfo:function(){var a=this.display.scroller;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-qa(this)-this.display.barHeight,width:a.scrollWidth-qa(this)-this.display.barWidth,clientHeight:ld(this),clientWidth:La(this)}},scrollIntoView:R(function(a,b){null==a?(a={from:this.doc.sel.primary().head,to:null},
null==b&&(b=this.options.cursorScrollMargin)):"number"==typeof a?a={from:q(a,0),to:null}:null==a.from&&(a={from:a,to:null});a.to||(a.to=a.from);a.margin=b||0;if(null!=a.from.line){var c=a;wc(this);this.curOp.scrollToPos=c}else Te(this,a.from,a.to,a.margin)}),setSize:R(function(a,b){var c=this,g=function(a){return"number"==typeof a||/^\d+$/.test(String(a))?a+"px":a};null!=a&&(this.display.wrapper.style.width=g(a));null!=b&&(this.display.wrapper.style.height=g(b));this.options.lineWrapping&&Ee(this);
var h=this.display.viewFrom;this.doc.iter(h,this.display.viewTo,function(a){if(a.widgets)for(var b=0;b<a.widgets.length;b++)if(a.widgets[b].noHScroll){Ba(c,h,"widget");break}++h});this.curOp.forceUpdate=!0;F(this,"refresh",this)}),operation:function(a){return Y(this,a)},startOperation:function(){return Ta(this)},endOperation:function(){return Ua(this)},refresh:R(function(){var a=this.display.cachedTextHeight;U(this);this.curOp.forceUpdate=!0;Db(this);Gb(this,this.doc.scrollLeft,this.doc.scrollTop);
zd(this);(null==a||.5<Math.abs(a-Oa(this.display)))&&vd(this);F(this,"refresh",this)}),swapDoc:R(function(a){var b=this.doc;b.cm=null;ff(this,a);Db(this);this.display.input.reset();Gb(this,a.scrollLeft,a.scrollTop);this.curOp.forceScroll=!0;N(this,"swapDoc",this,b);return b}),phrase:function(a){var b=this.options.phrases;return b&&Object.prototype.hasOwnProperty.call(b,a)?b[a]:a},getInputField:function(){return this.display.input.getField()},getWrapperElement:function(){return this.display.wrapper},
getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}};ab(a);a.registerHelper=function(b,e,f){c.hasOwnProperty(b)||(c[b]=a[b]={_global:[]});c[b][e]=f};a.registerGlobalHelper=function(b,e,f,g){a.registerHelper(b,e,g);c[b]._global.push({pred:f,val:g})}})(E);var uh="iter insert remove copy getEditor constructor".split(" "),ec;for(ec in V.prototype)V.prototype.hasOwnProperty(ec)&&0>L(uh,ec)&&(E.prototype[ec]=function(a){return function(){return a.apply(this.doc,
arguments)}}(V.prototype[ec]));ab(V);E.inputStyles={textarea:H,contenteditable:C};E.defineMode=function(a){E.defaults.mode||"null"==a||(E.defaults.mode=a);qg.apply(this,arguments)};E.defineMIME=function(a,b){bb[a]=b};E.defineMode("null",function(){return{token:function(a){return a.skipToEnd()}}});E.defineMIME("text/plain","null");E.defineExtension=function(a,b){E.prototype[a]=b};E.defineDocExtension=function(a,b){V.prototype[a]=b};E.fromTextArea=function(a,b){function c(){a.value=h.getValue()}b=b?
Ha(b):{};b.value=a.value;!b.tabindex&&a.tabIndex&&(b.tabindex=a.tabIndex);!b.placeholder&&a.placeholder&&(b.placeholder=a.placeholder);if(null==b.autofocus){var d=sa();b.autofocus=d==a||null!=a.getAttribute("autofocus")&&d==document.body}var e;if(a.form&&(v(a.form,"submit",c),!b.leaveSubmitMethodAlone)){var f=a.form;e=f.submit;try{var g=f.submit=function(){c();f.submit=e;f.submit();f.submit=g}}catch(k){}}b.finishInit=function(b){b.save=c;b.getTextArea=function(){return a};b.toTextArea=function(){b.toTextArea=
isNaN;c();a.parentNode.removeChild(b.getWrapperElement());a.style.display="";a.form&&(aa(a.form,"submit",c),"function"==typeof a.form.submit&&(a.form.submit=e))}};a.style.display="none";var h=E(function(b){return a.parentNode.insertBefore(b,a.nextSibling)},b);return h};(function(a){a.off=aa;a.on=v;a.wheelEventPixels=Kg;a.Doc=V;a.splitLines=Ud;a.countColumn=fa;a.findColumn=Pc;a.isWordChar=Rc;a.Pass=Hc;a.signal=F;a.Line=hb;a.changeEnd=Ca;a.scrollbarModel=Xe;a.Pos=q;a.cmpPos=y;a.modes=dd;a.mimeModes=
bb;a.resolveMode=nc;a.getMode=ed;a.modeExtensions=cb;a.extendMode=rg;a.copyState=Ka;a.startState=ie;a.innerMode=fd;a.commands=Sb;a.keyMap=Rb;a.keyName=If;a.isModifierKey=Ff;a.lookupKey=nb;a.normalizeKeyMap=Wg;a.StringStream=G;a.SharedTextMarker=Qb;a.TextMarker=Da;a.LineWidget=Pb;a.e_preventDefault=T;a.e_stopPropagation=ge;a.e_stop=xb;a.addClass=Ga;a.contains=xa;a.rmClass=Ra;a.keyNames=Ea})(E);E.version="5.40.2";return E});
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

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
    } else if (((ch == "u" || ch == "U") && stream.match(/rl(-prefix)?\(/i)) ||
               ((ch == "d" || ch == "D") && stream.match("omain(", true, true)) ||
               ((ch == "r" || ch == "R") && stream.match("egexp(", true, true))) {
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
    } else if (supportsAtComponent && /@component/i.test(type)) {
      return pushContext(state, stream, "atComponentBlock");
    } else if (/^@(-moz-)?document$/i.test(type)) {
      return pushContext(state, stream, "documentTypes");
    } else if (/^@(media|supports|(-moz-)?document|import)$/i.test(type)) {
      return pushContext(state, stream, "atBlock");
    } else if (/^@(font-face|counter-style)/i.test(type)) {
      state.stateArg = type;
      return "restricted_atBlock_before";
    } else if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(type)) {
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
      if (type != "comment")
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
        }
      }
      return indent;
    },

    electricChars: "}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    blockCommentContinue: " * ",
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
    "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count",
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
    "inline-box-align", "justify-content", "justify-items", "justify-self", "left", "letter-spacing",
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
    "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position",
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
    "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end",
    "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama",
    "simp-chinese-formal", "simp-chinese-informal", "single",
    "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal",
    "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
    "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali",
    "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square",
    "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub",
    "subpixel-antialiased", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table",
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
        if (stream.match(/\s*\{/, false))
          return [null, null]
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
        if (stream.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, false)) return false;
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
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

CodeMirror.defineMode("sql", function(config, parserConfig) {
  "use strict";

  var client         = parserConfig.client || {},
      atoms          = parserConfig.atoms || {"false": true, "true": true, "null": true},
      builtin        = parserConfig.builtin || {},
      keywords       = parserConfig.keywords || {},
      operatorChars  = parserConfig.operatorChars || /^[*+\-%<>!=&|~^]/,
      support        = parserConfig.support || {},
      hooks          = parserConfig.hooks || {},
      dateSQL        = parserConfig.dateSQL || {"date" : true, "time" : true, "timestamp" : true},
      backslashStringEscapes = parserConfig.backslashStringEscapes !== false,
      brackets       = parserConfig.brackets || /^[\{}\(\)\[\]]/,
      punctuation    = parserConfig.punctuation || /^[;.,:]/

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
      stream.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.match(/^\.(?!\.)/);
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
      state.tokenize = tokenComment(1);
      return state.tokenize(stream, state);
    } else if (ch == ".") {
      // .1 for 0.1
      if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i))
        return "number";
      if (stream.match(/^\.+/))
        return null
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable && stream.match(/^[\w\d_]+/))
        return "variable-2";
    } else if (operatorChars.test(ch)) {
      // operators
      stream.eatWhile(operatorChars);
      return "operator";
    } else if (brackets.test(ch)) {
      // brackets
      stream.eatWhile(brackets);
      return "bracket";
    } else if (punctuation.test(ch)) {
      // punctuation
      stream.eatWhile(punctuation);
      return "punctuation";
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
        escaped = backslashStringEscapes && !escaped && ch == "\\";
      }
      return "string";
    };
  }
  function tokenComment(depth) {
    return function(stream, state) {
      var m = stream.match(/^.*?(\/\*|\*\/)/)
      if (!m) stream.skipToEnd()
      else if (m[1] == "/*") state.tokenize = tokenComment(depth + 1)
      else if (depth > 1) state.tokenize = tokenComment(depth - 1)
      else state.tokenize = tokenBase
      return "comment"
    }
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
      if (state.tokenize == tokenBase && stream.eatSpace()) return null;

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
    lineComment: support.commentSlashSlash ? "//" : support.commentHash ? "#" : "--",
    closeBrackets: "()[]{}''\"\"``"
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

  // "identifier"
  function hookIdentifierDoublequote(stream) {
    // Standard SQL /SQLite identifiers
    // ref: http://web.archive.org/web/20160813185132/http://savage.net.au/SQL/sql-99.bnf.html#delimited%20identifier
    // ref: http://sqlite.org/lang_keywords.html
    var ch;
    while ((ch = stream.next()) != null) {
      if (ch == "\"" && !stream.eat("\"")) return "variable-2";
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
    client: set("$partition binary_checksum checksum connectionproperty context_info current_request_id error_line error_message error_number error_procedure error_severity error_state formatmessage get_filestream_transaction_context getansinull host_id host_name isnull isnumeric min_active_rowversion newid newsequentialid rowcount_big xact_state object_id"),
    keywords: set(sqlKeywords + "begin trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare exec go if use index holdlock nolock nowait paglock readcommitted readcommittedlock readpast readuncommitted repeatableread rowlock serializable snapshot tablock tablockx updlock with"),
    builtin: set("bigint numeric bit smallint decimal smallmoney int tinyint money float real char varchar text nchar nvarchar ntext binary varbinary image cursor timestamp hierarchyid uniqueidentifier sql_variant xml table "),
    atoms: set("is not null like and or in left right between inner outer join all any some cross unpivot pivot exists"),
    operatorChars: /^[*+\-%<>!=^\&|\/]/,
    brackets: /^[\{}\(\)]/,
    punctuation: /^[;.,:/]/,
    backslashStringEscapes: false,
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

  // provided by the phpLiteAdmin project - phpliteadmin.org
  CodeMirror.defineMIME("text/x-sqlite", {
    name: "sql",
    // commands of the official SQLite client, ref: https://www.sqlite.org/cli.html#dotcmd
    client: set("auth backup bail binary changes check clone databases dbinfo dump echo eqp exit explain fullschema headers help import imposter indexes iotrace limit lint load log mode nullvalue once open output print prompt quit read restore save scanstats schema separator session shell show stats system tables testcase timeout timer trace vfsinfo vfslist vfsname width"),
    // ref: http://sqlite.org/lang_keywords.html
    keywords: set(sqlKeywords + "abort action add after all analyze attach autoincrement before begin cascade case cast check collate column commit conflict constraint cross current_date current_time current_timestamp database default deferrable deferred detach each else end escape except exclusive exists explain fail for foreign full glob if ignore immediate index indexed initially inner instead intersect isnull key left limit match natural no notnull null of offset outer plan pragma primary query raise recursive references regexp reindex release rename replace restrict right rollback row savepoint temp temporary then to transaction trigger unique using vacuum view virtual when with without"),
    // SQLite is weakly typed, ref: http://sqlite.org/datatype3.html. This is just a list of some common types.
    builtin: set("bool boolean bit blob decimal double float long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text clob bigint int int2 int8 integer float double char varchar date datetime year unsigned signed numeric real"),
    // ref: http://sqlite.org/syntax/literal-value.html
    atoms: set("null current_date current_time current_timestamp"),
    // ref: http://sqlite.org/lang_expr.html#binaryops
    operatorChars: /^[*+\-%<>!=&|/~]/,
    // SQLite is weakly typed, ref: http://sqlite.org/datatype3.html. This is just a list of some common types.
    dateSQL: set("date time timestamp datetime"),
    support: set("decimallessFloat zerolessFloat"),
    identifierQuote: "\"",  //ref: http://sqlite.org/lang_keywords.html
    hooks: {
      // bind-parameters ref:http://sqlite.org/lang_expr.html#varparam
      "@":   hookVar,
      ":":   hookVar,
      "?":   hookVar,
      "$":   hookVar,
      // The preferred way to escape Identifiers is using double quotes, ref: http://sqlite.org/lang_keywords.html
      "\"":   hookIdentifierDoublequote,
      // there is also support for backtics, ref: http://sqlite.org/lang_keywords.html
      "`":   hookIdentifier
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
    // https://www.postgresql.org/docs/10/static/sql-keywords-appendix.html
    keywords: set(sqlKeywords + "a abort abs absent absolute access according action ada add admin after aggregate all allocate also always analyse analyze any are array array_agg array_max_cardinality asensitive assertion assignment asymmetric at atomic attribute attributes authorization avg backward base64 before begin begin_frame begin_partition bernoulli binary bit_length blob blocked bom both breadth c cache call called cardinality cascade cascaded case cast catalog catalog_name ceil ceiling chain characteristics characters character_length character_set_catalog character_set_name character_set_schema char_length check checkpoint class class_origin clob close cluster coalesce cobol collate collation collation_catalog collation_name collation_schema collect column columns column_name command_function command_function_code comment comments commit committed concurrently condition condition_number configuration conflict connect connection connection_name constraint constraints constraint_catalog constraint_name constraint_schema constructor contains content continue control conversion convert copy corr corresponding cost covar_pop covar_samp cross csv cube cume_dist current current_catalog current_date current_default_transform_group current_path current_role current_row current_schema current_time current_timestamp current_transform_group_for_type current_user cursor cursor_name cycle data database datalink datetime_interval_code datetime_interval_precision day db deallocate dec declare default defaults deferrable deferred defined definer degree delimiter delimiters dense_rank depth deref derived describe descriptor deterministic diagnostics dictionary disable discard disconnect dispatch dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue do document domain dynamic dynamic_function dynamic_function_code each element else empty enable encoding encrypted end end-exec end_frame end_partition enforced enum equals escape event every except exception exclude excluding exclusive exec execute exists exp explain expression extension external extract false family fetch file filter final first first_value flag float floor following for force foreign fortran forward found frame_row free freeze fs full function functions fusion g general generated get global go goto grant granted greatest grouping groups handler header hex hierarchy hold hour id identity if ignore ilike immediate immediately immutable implementation implicit import including increment indent index indexes indicator inherit inherits initially inline inner inout input insensitive instance instantiable instead integrity intersect intersection invoker isnull isolation k key key_member key_type label lag language large last last_value lateral lc_collate lc_ctype lead leading leakproof least left length level library like_regex link listen ln load local localtime localtimestamp location locator lock locked logged lower m map mapping match matched materialized max maxvalue max_cardinality member merge message_length message_octet_length message_text method min minute minvalue mod mode modifies module month more move multiset mumps name names namespace national natural nchar nclob nesting new next nfc nfd nfkc nfkd nil no none normalize normalized nothing notify notnull nowait nth_value ntile null nullable nullif nulls number object occurrences_regex octets octet_length of off offset oids old only open operator option options ordering ordinality others out outer output over overlaps overlay overriding owned owner p pad parallel parameter parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partial partition pascal passing passthrough password percent percentile_cont percentile_disc percent_rank period permission placing plans pli policy portion position position_regex power precedes preceding prepare prepared preserve primary prior privileges procedural procedure program public quote range rank read reads reassign recheck recovery recursive ref references referencing refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex relative release rename repeatable replace replica requiring reset respect restart restore restrict restricted result return returned_cardinality returned_length returned_octet_length returned_sqlstate returning returns revoke right role rollback rollup routine routine_catalog routine_name routine_schema row rows row_count row_number rule savepoint scale schema schema_name scope scope_catalog scope_name scope_schema scroll search second section security selective self sensitive sequence sequences serializable server server_name session session_user setof sets share show similar simple size skip snapshot some source space specific specifictype specific_name sql sqlcode sqlerror sqlexception sqlstate sqlwarning sqrt stable standalone start state statement static statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset substring substring_regex succeeds sum symmetric sysid system system_time system_user t tables tablesample tablespace table_name temp template temporary then ties timezone_hour timezone_minute to token top_level_count trailing transaction transactions_committed transactions_rolled_back transaction_active transform transforms translate translate_regex translation treat trigger trigger_catalog trigger_name trigger_schema trim trim_array true truncate trusted type types uescape unbounded uncommitted under unencrypted unique unknown unlink unlisten unlogged unnamed unnest until untyped upper uri usage user user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema using vacuum valid validate validator value value_of varbinary variadic var_pop var_samp verbose version versioning view views volatile when whenever whitespace width_bucket window within work wrapper write xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate year yes loop repeat attach path depends detach zone"),
    // https://www.postgresql.org/docs/10/static/datatype.html
    builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
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

  // Greenplum
  CodeMirror.defineMIME("text/x-gpsql", {
    name: "sql",
    client: set("source"),
    //https://github.com/greenplum-db/gpdb/blob/master/src/include/parser/kwlist.h
    keywords: set("abort absolute access action active add admin after aggregate all also alter always analyse analyze and any array as asc assertion assignment asymmetric at authorization backward before begin between bigint binary bit boolean both by cache called cascade cascaded case cast chain char character characteristics check checkpoint class close cluster coalesce codegen collate column comment commit committed concurrency concurrently configuration connection constraint constraints contains content continue conversion copy cost cpu_rate_limit create createdb createexttable createrole createuser cross csv cube current current_catalog current_date current_role current_schema current_time current_timestamp current_user cursor cycle data database day deallocate dec decimal declare decode default defaults deferrable deferred definer delete delimiter delimiters deny desc dictionary disable discard distinct distributed do document domain double drop dxl each else enable encoding encrypted end enum errors escape every except exchange exclude excluding exclusive execute exists explain extension external extract false family fetch fields filespace fill filter first float following for force foreign format forward freeze from full function global grant granted greatest group group_id grouping handler hash having header hold host hour identity if ignore ilike immediate immutable implicit in including inclusive increment index indexes inherit inherits initially inline inner inout input insensitive insert instead int integer intersect interval into invoker is isnull isolation join key language large last leading least left level like limit list listen load local localtime localtimestamp location lock log login mapping master match maxvalue median merge minute minvalue missing mode modifies modify month move name names national natural nchar new newline next no nocreatedb nocreateexttable nocreaterole nocreateuser noinherit nologin none noovercommit nosuperuser not nothing notify notnull nowait null nullif nulls numeric object of off offset oids old on only operator option options or order ordered others out outer over overcommit overlaps overlay owned owner parser partial partition partitions passing password percent percentile_cont percentile_disc placing plans position preceding precision prepare prepared preserve primary prior privileges procedural procedure protocol queue quote randomly range read readable reads real reassign recheck recursive ref references reindex reject relative release rename repeatable replace replica reset resource restart restrict returning returns revoke right role rollback rollup rootpartition row rows rule savepoint scatter schema scroll search second security segment select sequence serializable session session_user set setof sets share show similar simple smallint some split sql stable standalone start statement statistics stdin stdout storage strict strip subpartition subpartitions substring superuser symmetric sysid system table tablespace temp template temporary text then threshold ties time timestamp to trailing transaction treat trigger trim true truncate trusted type unbounded uncommitted unencrypted union unique unknown unlisten until update user using vacuum valid validation validator value values varchar variadic varying verbose version view volatile web when where whitespace window with within without work writable write xml xmlattributes xmlconcat xmlelement xmlexists xmlforest xmlparse xmlpi xmlroot xmlserialize year yes zone"),
    builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast")
  });

  // Spark SQL
  CodeMirror.defineMIME("text/x-sparksql", {
    name: "sql",
    keywords: set("add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases datata dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with"),
    builtin: set("tinyint smallint int bigint boolean float double string binary timestamp decimal array map struct uniontype delimited serde sequencefile textfile rcfile inputformat outputformat"),
    atoms: set("false true null"),
    operatorChars: /^[*+\-%<>!=~&|^]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable doubleQuote zerolessFloat")
  });

  // Esper
  CodeMirror.defineMIME("text/x-esper", {
    name: "sql",
    client: set("source"),
    // http://www.espertech.com/esper/release-5.5.0/esper-reference/html/appendix_keywords.html
    keywords: set("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit after all and as at asc avedev avg between by case cast coalesce count create current_timestamp day days delete define desc distinct else end escape events every exists false first from full group having hour hours in inner insert instanceof into irstream is istream join last lastweekday left limit like max match_recognize matches median measures metadatasql min minute minutes msec millisecond milliseconds not null offset on or order outer output partition pattern prev prior regexp retain-union retain-intersection right rstream sec second seconds select set some snapshot sql stddev sum then true unidirectional until update variable weekday when where window"),
    builtin: {},
    atoms: set("false true null"),
    operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
    dateSQL: set("time"),
    support: set("decimallessFloat zerolessFloat binaryNumber hexNumber")
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
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

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
  allowMissingTagName: false,
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
      stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
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
    }
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
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return attrState(type, stream, state);
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
    } else if (config.allowMissingTagName && type == "endTag") {
      setStyle = "tag bracket";
      return closeState(type, stream, state);
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
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

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
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c"), D = kw("keyword d");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    return {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": D, "break": D, "continue": D, "new": kw("new"), "delete": C, "void": C, "throw": C,
      "debugger": kw("debugger"), "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
      "await": C
    };
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
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
    } else if (ch == "0" && stream.match(/^(?:x[\da-f]+|o[0-7]+|b[01]+)n?/i)) {
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:n|(?:\.\d*)?(?:[eE][+\-]?\d+)?)?/);
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
        stream.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eat("=");
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      if (ch != ">" || !state.lexical || state.lexical.type != ">") {
        if (stream.eat("=")) {
          if (ch == "!" || ch == "=") stream.eat("=")
        } else if (/[<>*+\-]/.test(ch)) {
          stream.eat(ch)
          if (ch == ">") stream.eat(ch)
        }
      }
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current()
      if (state.lastType != ".") {
        if (keywords.propertyIsEnumerable(word)) {
          var kw = keywords[word]
          return ret(kw.type, kw.style, word)
        }
        if (word == "async" && stream.match(/^(\s|\/\*.*?\*\/)*[\[\(\w]/, false))
          return ret("async", "keyword", word)
      }
      return ret("variable", "variable", word)
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
  function inList(name, list) {
    for (var v = list; v; v = v.next) if (v.name == name) return true
    return false;
  }
  function register(varname) {
    var state = cx.state;
    cx.marked = "def";
    if (state.context) {
      if (state.lexical.info == "var" && state.context && state.context.block) {
        // FIXME function decls are also not block scoped
        var newContext = registerVarScoped(varname, state.context)
        if (newContext != null) {
          state.context = newContext
          return
        }
      } else if (!inList(varname, state.localVars)) {
        state.localVars = new Var(varname, state.localVars)
        return
      }
    }
    // Fall through means this is global
    if (parserConfig.globalVars && !inList(varname, state.globalVars))
      state.globalVars = new Var(varname, state.globalVars)
  }
  function registerVarScoped(varname, context) {
    if (!context) {
      return null
    } else if (context.block) {
      var inner = registerVarScoped(varname, context.prev)
      if (!inner) return null
      if (inner == context.prev) return context
      return new Context(inner, context.vars, true)
    } else if (inList(varname, context.vars)) {
      return context
    } else {
      return new Context(context.prev, new Var(varname, context.vars), false)
    }
  }

  function isModifier(name) {
    return name == "public" || name == "private" || name == "protected" || name == "abstract" || name == "readonly"
  }

  // Combinators

  function Context(prev, vars, block) { this.prev = prev; this.vars = vars; this.block = block }
  function Var(name, next) { this.name = name; this.next = next }

  var defaultVars = new Var("this", new Var("arguments", null))
  function pushcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, false)
    cx.state.localVars = defaultVars
  }
  function pushblockcontext() {
    cx.state.context = new Context(cx.state.context, cx.state.localVars, true)
    cx.state.localVars = null
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars
    cx.state.context = cx.state.context.prev
  }
  popcontext.lex = true
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
      else if (wanted == ";" || type == "}" || type == ")" || type == "]") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), parenExpr, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "keyword d") return cx.stream.match(/^\s*$/, false) ? cont() : cont(pushlex("stat"), maybeexpression, expect(";"), poplex);
    if (type == "debugger") return cont(expect(";"));
    if (type == "{") return cont(pushlex("}"), pushblockcontext, block, poplex, popcontext);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), parenExpr, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), className, poplex); }
    if (type == "variable") {
      if (isTS && value == "declare") {
        cx.marked = "keyword"
        return cont(statement)
      } else if (isTS && (value == "module" || value == "enum" || value == "type") && cx.stream.match(/^\s*\w/, false)) {
        cx.marked = "keyword"
        if (value == "enum") return cont(enumdef);
        else if (value == "type") return cont(typeexpr, expect("operator"), typeexpr, expect(";"));
        else return cont(pushlex("form"), pattern, expect("{"), pushlex("}"), block, poplex, poplex)
      } else if (isTS && value == "namespace") {
        cx.marked = "keyword"
        return cont(pushlex("form"), expression, block, poplex)
      } else if (isTS && value == "abstract") {
        cx.marked = "keyword"
        return cont(statement)
      } else {
        return cont(pushlex("stat"), maybelabel);
      }
    }
    if (type == "switch") return cont(pushlex("form"), parenExpr, expect("{"), pushlex("}", "switch"), pushblockcontext,
                                      block, poplex, poplex, popcontext);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, maybeCatchBinding, statement, poplex, popcontext);
    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
    if (type == "async") return cont(statement)
    if (value == "@") return cont(expression, statement)
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function maybeCatchBinding(type) {
    if (type == "(") return cont(funarg, expect(")"))
  }
  function expression(type, value) {
    return expressionInner(type, value, false);
  }
  function expressionNoComma(type, value) {
    return expressionInner(type, value, true);
  }
  function parenExpr(type) {
    if (type != "(") return pass()
    return cont(pushlex(")"), expression, expect(")"), poplex)
  }
  function expressionInner(type, value, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), classExpression, poplex); }
    if (type == "keyword c" || type == "async") return cont(noComma ? expressionNoComma : expression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    if (type == "import") return cont(expression);
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
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
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont(me);
      if (isTS && value == "<" && cx.stream.match(/^([^>]|<.*?>)*>\s*\(/, false))
        return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    if (isTS && value == "as") { cx.marked = "keyword"; return cont(typeexpr, me) }
    if (type == "regexp") {
      cx.state.lastType = cx.marked = "operator"
      cx.stream.backUp(cx.stream.pos - cx.stream.start - 1)
      return cont(expr)
    }
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
      else if (type == "variable" && isTS) return cont(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma)
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
      var m // Work around fat-arrow-detection complication for detecting typescript typed arrow params
      if (isTS && cx.state.fatArrowAt == cx.stream.start && (m = cx.stream.match(/^\s*:\s*/, false)))
        cx.state.fatArrowAt = cx.stream.pos + m[0].length
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (isTS && isModifier(value)) {
      cx.marked = "keyword"
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, maybetype, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx.marked = "keyword";
      return cont(objprop);
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
  function mayberettype(type) {
    if (isTS && type == ":") {
      if (cx.stream.match(/^\s*\w+\s+is\b/, false)) return cont(expression, isKW, typeexpr)
      else return cont(typeexpr)
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx.marked = "keyword"
      return cont()
    }
  }
  function typeexpr(type, value) {
    if (value == "keyof" || value == "typeof") {
      cx.marked = "keyword"
      return cont(value == "keyof" ? typeexpr : expressionNoComma)
    }
    if (type == "variable" || value == "void") {
      cx.marked = "type"
      return cont(afterType)
    }
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    if (type == "[") return cont(pushlex("]"), commasep(typeexpr, "]", ","), poplex, afterType)
    if (type == "{") return cont(pushlex("}"), commasep(typeprop, "}", ",;"), poplex, afterType)
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType)
    if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr)
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
    } else if (type == "[") {
      return cont(expression, maybetype, expect("]"), typeprop)
    }
  }
  function typearg(type, value) {
    if (type == "variable" && cx.stream.match(/^\s*[?:]/, false) || value == "?") return cont(typearg)
    if (type == ":") return cont(typeexpr)
    return pass(typeexpr)
  }
  function afterType(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    if (value == "|" || type == "." || value == "&") return cont(typeexpr)
    if (type == "[") return cont(expect("]"), afterType)
    if (value == "extends" || value == "implements") { cx.marked = "keyword"; return cont(typeexpr) }
  }
  function maybeTypeArgs(_, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
  }
  function typeparam() {
    return pass(typeexpr, maybeTypeDefault)
  }
  function maybeTypeDefault(_, value) {
    if (value == "=") return cont(typeexpr)
  }
  function vardef(_, value) {
    if (value == "enum") {cx.marked = "keyword"; return cont(enumdef)}
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(pattern) }
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(eltpattern, "]");
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
  function eltpattern() {
    return pass(pattern, maybeAssign)
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
  function forspec(type, value) {
    if (value == "await") return cont(forspec);
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
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, statement, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondef)
  }
  function funarg(type, value) {
    if (value == "@") cont(expression, funarg)
    if (type == "spread") return cont(funarg);
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(funarg); }
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
    if (value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, classNameAfter)
    if (value == "extends" || value == "implements" || (isTS && type == ",")) {
      if (value == "implements") cx.marked = "keyword";
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "async" ||
        (type == "variable" &&
         (value == "static" || value == "get" || value == "set" || (isTS && isModifier(value))) &&
         cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))) {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      return cont(isTS ? classfield : functiondef, classBody);
    }
    if (type == "[")
      return cont(expression, maybetype, expect("]"), isTS ? classfield : functiondef, classBody)
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == ";") return cont(classBody);
    if (type == "}") return cont();
    if (value == "@") return cont(expression, classBody)
  }
  function classfield(type, value) {
    if (value == "?") return cont(classfield)
    if (type == ":") return cont(typeexpr, maybeAssign)
    if (value == "=") return cont(expressionNoComma)
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
    if (type == "(") return pass(expression);
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
  function enumdef() {
    return pass(pushlex("form"), pattern, expect("{"), pushlex("}"), commasep(enummember, "}"), poplex, poplex)
  }
  function enummember() {
    return pass(pattern, maybeAssign);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  function expressionAllowed(stream, state, backUp) {
    return state.tokenize == tokenBase &&
      /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
      (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
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
        context: parserConfig.localVars && new Context(null, null, false),
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

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
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
    blockCommentContinue: jsonMode ? null : " * ",
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
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../xml/xml"), require("../meta"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../xml/xml", "../meta"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

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

  // Turn on task lists? ("- [ ] " and "- [x] ")
  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

  // Turn on strikethrough syntax
  if (modeCfg.strikethrough === undefined)
    modeCfg.strikethrough = false;

  if (modeCfg.emoji === undefined)
    modeCfg.emoji = false;

  if (modeCfg.fencedCodeBlockHighlighting === undefined)
    modeCfg.fencedCodeBlockHighlighting = true;

  if (modeCfg.xml === undefined)
    modeCfg.xml = true;

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
    strikethrough: "strikethrough",
    emoji: "builtin"
  };

  for (var tokenType in tokenTypes) {
    if (tokenTypes.hasOwnProperty(tokenType) && modeCfg.tokenTypeOverrides[tokenType]) {
      tokenTypes[tokenType] = modeCfg.tokenTypeOverrides[tokenType];
    }
  }

  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/
  ,   listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/
  ,   taskListRE = /^\[(x| )\](?=\s)/i // Must follow listRE
  ,   atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/
  ,   setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/
  ,   textRE = /^[^#!\[\]*_\\<>` "'(~:]+/
  ,   fencedCodeRE = /^(~~~+|```+)[ \t]*([\w+#-]*)[^\n`]*$/
  ,   linkDefRE = /^\s*\[[^\]]+?\]:.*$/ // naive link-definition
  ,   punctuation = /[!\"#$%&\'()*+,\-\.\/:;<=>?@\[\\\]^_`{|}~—]/
  ,   expandedTab = "    " // CommonMark specifies tab as 4 spaces

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
    state.linkHref = false;
    state.linkText = false;
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
    if (state.f == htmlBlock) {
      var exit = htmlModeMissing
      if (!exit) {
        var inner = CodeMirror.innerMode(htmlMode, state.htmlState)
        exit = inner.mode.name == "xml" && inner.state.tagStart === null &&
          (!inner.state.context && inner.state.tokenize.isInText)
      }
      if (exit) {
        state.f = inlineNormal;
        state.block = blockNormal;
        state.htmlState = null;
      }
    }
    // Reset state.trailingSpace
    state.trailingSpace = 0;
    state.trailingSpaceNewLine = false;
    // Mark this line as blank
    state.prevLine = state.thisLine
    state.thisLine = {stream: null}
    return null;
  }

  function blockNormal(stream, state) {
    var firstTokenOnLine = stream.column() === state.indentation;
    var prevLineLineIsEmpty = lineIsEmpty(state.prevLine.stream);
    var prevLineIsIndentedCode = state.indentedCode;
    var prevLineIsHr = state.prevLine.hr;
    var prevLineIsList = state.list !== false;
    var maxNonCodeIndentation = (state.listStack[state.listStack.length - 1] || 0) + 3;

    state.indentedCode = false;

    var lineIndentation = state.indentation;
    // compute once per line (on first token)
    if (state.indentationDiff === null) {
      state.indentationDiff = state.indentation;
      if (prevLineIsList) {
        // Reset inline styles which shouldn't propagate aross list items
        state.em = false;
        state.strong = false;
        state.code = false;
        state.strikethrough = false;

        state.list = null;
        // While this list item's marker's indentation is less than the deepest
        //  list item's content's indentation,pop the deepest list item
        //  indentation off the stack, and update block indentation state
        while (lineIndentation < state.listStack[state.listStack.length - 1]) {
          state.listStack.pop();
          if (state.listStack.length) {
            state.indentation = state.listStack[state.listStack.length - 1];
          // less than the first list's indent -> the line is no longer a list
          } else {
            state.list = false;
          }
        }
        if (state.list !== false) {
          state.indentationDiff = lineIndentation - state.listStack[state.listStack.length - 1]
        }
      }
    }

    // not comprehensive (currently only for setext detection purposes)
    var allowsInlineContinuation = (
        !prevLineLineIsEmpty && !prevLineIsHr && !state.prevLine.header &&
        (!prevLineIsList || !prevLineIsIndentedCode) &&
        !state.prevLine.fencedCodeEnd
    );

    var isHr = (state.list === false || prevLineIsHr || prevLineLineIsEmpty) &&
      state.indentation <= maxNonCodeIndentation && stream.match(hrRE);

    var match = null;
    if (state.indentationDiff >= 4 && (prevLineIsIndentedCode || state.prevLine.fencedCodeEnd ||
         state.prevLine.header || prevLineLineIsEmpty)) {
      stream.skipToEnd();
      state.indentedCode = true;
      return tokenTypes.code;
    } else if (stream.eatSpace()) {
      return null;
    } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
      state.quote = 0;
      state.header = match[1].length;
      state.thisLine.header = true;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (state.indentation <= maxNonCodeIndentation && stream.eat('>')) {
      state.quote = firstTokenOnLine ? 1 : state.quote + 1;
      if (modeCfg.highlightFormatting) state.formatting = "quote";
      stream.eatSpace();
      return getType(state);
    } else if (!isHr && !state.setext && firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(listRE))) {
      var listType = match[1] ? "ol" : "ul";

      state.indentation = lineIndentation + stream.current().length;
      state.list = true;
      state.quote = 0;

      // Add this list item's content's indentation to the stack
      state.listStack.push(state.indentation);

      if (modeCfg.taskLists && stream.match(taskListRE, false)) {
        state.taskList = true;
      }
      state.f = state.inline;
      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
      return getType(state);
    } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(fencedCodeRE, true))) {
      state.quote = 0;
      state.fencedEndRE = new RegExp(match[1] + "+ *$");
      // try switching mode
      state.localMode = modeCfg.fencedCodeBlockHighlighting && getMode(match[2]);
      if (state.localMode) state.localState = CodeMirror.startState(state.localMode);
      state.f = state.block = local;
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.code = -1
      return getType(state);
    // SETEXT has lowest block-scope precedence after HR, so check it after
    //  the others (code, blockquote, list...)
    } else if (
      // if setext set, indicates line after ---/===
      state.setext || (
        // line before ---/===
        (!allowsInlineContinuation || !prevLineIsList) && !state.quote && state.list === false &&
        !state.code && !isHr && !linkDefRE.test(stream.string) &&
        (match = stream.lookAhead(1)) && (match = match.match(setextHeaderRE))
      )
    ) {
      if ( !state.setext ) {
        state.header = match[0].charAt(0) == '=' ? 1 : 2;
        state.setext = state.header;
      } else {
        state.header = state.setext;
        // has no effect on type so we can reset it now
        state.setext = 0;
        stream.skipToEnd();
        if (modeCfg.highlightFormatting) state.formatting = "header";
      }
      state.thisLine.header = true;
      state.f = state.inline;
      return getType(state);
    } else if (isHr) {
      stream.skipToEnd();
      state.hr = true;
      state.thisLine.hr = true;
      return tokenTypes.hr;
    } else if (stream.peek() === '[') {
      return switchInline(stream, state, footnoteLink);
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
    var currListInd = state.listStack[state.listStack.length - 1] || 0;
    var hasExitedList = state.indentation < currListInd;
    var maxFencedEndInd = currListInd + 3;
    if (state.fencedEndRE && state.indentation <= maxFencedEndInd && (hasExitedList || stream.match(state.fencedEndRE))) {
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      var returnType;
      if (!hasExitedList) returnType = getType(state)
      state.localMode = state.localState = null;
      state.block = blockNormal;
      state.f = inlineNormal;
      state.fencedEndRE = null;
      state.code = 0
      state.thisLine.fencedCodeEnd = true;
      if (hasExitedList) return switchBlock(stream, state, state.block);
      return returnType;
    } else if (state.localMode) {
      return state.localMode.token(stream, state.localState);
    } else {
      stream.skipToEnd();
      return tokenTypes.code;
    }
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
      if (state.emoji) { styles.push(tokenTypes.emoji); }
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
      var taskOpen = stream.match(taskListRE, true)[1] === " ";
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

    var ch = stream.next();

    // Matches link titles present on next line
    if (state.linkTitle) {
      state.linkTitle = false;
      var matchCh = ch;
      if (ch === '(') {
        matchCh = ')';
      }
      matchCh = (matchCh+'').replace(/([.?*+^\[\]\\(){}|-])/g, "\\$1");
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
      if (state.code == 0 && (!state.quote || count == 1)) {
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

    if (ch === '[' && !state.image) {
      if (state.linkText && stream.match(/^.*?\]/)) return getType(state)
      state.linkText = true;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      return getType(state);
    }

    if (ch === ']' && state.linkText) {
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      state.linkText = false;
      state.inline = state.f = stream.match(/\(.*?\)| ?\[.*?\]/, false) ? linkHref : inlineNormal
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

    if (modeCfg.xml && ch === '<' && stream.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i, false)) {
      var end = stream.string.indexOf(">", stream.pos);
      if (end != -1) {
        var atts = stream.string.substring(stream.start, end);
        if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
      }
      stream.backUp(1);
      state.htmlState = CodeMirror.startState(htmlMode);
      return switchBlock(stream, state, htmlBlock);
    }

    if (modeCfg.xml && ch === '<' && stream.match(/^\/\w*?>/)) {
      state.md_inside = false;
      return "tag";
    } else if (ch === "*" || ch === "_") {
      var len = 1, before = stream.pos == 1 ? " " : stream.string.charAt(stream.pos - 2)
      while (len < 3 && stream.eat(ch)) len++
      var after = stream.peek() || " "
      // See http://spec.commonmark.org/0.27/#emphasis-and-strong-emphasis
      var leftFlanking = !/\s/.test(after) && (!punctuation.test(after) || /\s/.test(before) || punctuation.test(before))
      var rightFlanking = !/\s/.test(before) && (!punctuation.test(before) || /\s/.test(after) || punctuation.test(after))
      var setEm = null, setStrong = null
      if (len % 2) { // Em
        if (!state.em && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before)))
          setEm = true
        else if (state.em == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after)))
          setEm = false
      }
      if (len > 1) { // Strong
        if (!state.strong && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before)))
          setStrong = true
        else if (state.strong == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after)))
          setStrong = false
      }
      if (setStrong != null || setEm != null) {
        if (modeCfg.highlightFormatting) state.formatting = setEm == null ? "strong" : setStrong == null ? "em" : "strong em"
        if (setEm === true) state.em = ch
        if (setStrong === true) state.strong = ch
        var t = getType(state)
        if (setEm === false) state.em = false
        if (setStrong === false) state.strong = false
        return t
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

    if (modeCfg.emoji && ch === ":" && stream.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/)) {
      state.emoji = true;
      if (modeCfg.highlightFormatting) state.formatting = "emoji";
      var retType = getType(state);
      state.emoji = false;
      return retType;
    }

    if (ch === ' ') {
      if (stream.match(/^ +$/, false)) {
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
      state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]");
      if (modeCfg.highlightFormatting) state.formatting = "link-string";
      state.linkHref = true;
      return getType(state);
    }
    return 'error';
  }

  var linkRE = {
    ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
    "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/
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

        prevLine: {stream: null},
        thisLine: {stream: null},

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
        setext: 0,
        hr: false,
        taskList: false,
        list: false,
        listStack: [],
        quote: 0,
        trailingSpace: 0,
        trailingSpaceNewLine: false,
        strikethrough: false,
        emoji: false,
        fencedEndRE: null
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
        linkText: s.linkText,
        linkTitle: s.linkTitle,
        linkHref: s.linkHref,
        code: s.code,
        em: s.em,
        strong: s.strong,
        strikethrough: s.strikethrough,
        emoji: s.emoji,
        header: s.header,
        setext: s.setext,
        hr: s.hr,
        taskList: s.taskList,
        list: s.list,
        listStack: s.listStack.slice(0),
        quote: s.quote,
        indentedCode: s.indentedCode,
        trailingSpace: s.trailingSpace,
        trailingSpaceNewLine: s.trailingSpaceNewLine,
        md_inside: s.md_inside,
        fencedEndRE: s.fencedEndRE
      };
    },

    token: function(stream, state) {

      // Reset state.formatting
      state.formatting = false;

      if (stream != state.thisLine.stream) {
        state.header = 0;
        state.hr = false;

        if (stream.match(/^\s*$/, true)) {
          blankLine(state);
          return null;
        }

        state.prevLine = state.thisLine
        state.thisLine = {stream: stream}

        // Reset state.taskList
        state.taskList = false;

        // Reset state.trailingSpace
        state.trailingSpace = 0;
        state.trailingSpaceNewLine = false;

        if (!state.localState) {
          state.f = state.block;
          if (state.f != htmlBlock) {
            var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, expandedTab).length;
            state.indentation = indentation;
            state.indentationDiff = null;
            if (indentation > 0) return null;
          }
        }
      }
      return state.f(stream, state);
    },

    innerMode: function(state) {
      if (state.block == htmlBlock) return {state: state.htmlState, mode: htmlMode};
      if (state.localState) return {state: state.localState, mode: state.localMode};
      return {state: state, mode: mode};
    },

    indent: function(state, textAfter, line) {
      if (state.block == htmlBlock && htmlMode.indent) return htmlMode.indent(state.htmlState, textAfter, line)
      if (state.localState && state.localMode.indent) return state.localMode.indent(state.localState, textAfter, line)
      return CodeMirror.Pass
    },

    blankLine: blankLine,

    getType: getType,

    blockCommentStart: "<!--",
    blockCommentEnd: "-->",
    closeBrackets: "()[]{}''\"\"``",
    fold: "markdown"
  };
  return mode;
}, "xml");

CodeMirror.defineMIME("text/markdown", "markdown");

CodeMirror.defineMIME("text/x-markdown", "markdown");

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

CodeMirror.defineMode('shell', function() {

  var words = {};
  function define(style, dict) {
    for(var i = 0; i < dict.length; i++) {
      words[dict[i]] = style;
    }
  };

  var commonAtoms = ["true", "false"];
  var commonKeywords = ["if", "then", "do", "else", "elif", "while", "until", "for", "in", "esac", "fi",
    "fin", "fil", "done", "exit", "set", "unset", "export", "function"];
  var commonCommands = ["ab", "awk", "bash", "beep", "cat", "cc", "cd", "chown", "chmod", "chroot", "clear",
    "cp", "curl", "cut", "diff", "echo", "find", "gawk", "gcc", "get", "git", "grep", "hg", "kill", "killall",
    "ln", "ls", "make", "mkdir", "openssl", "mv", "nc", "nl", "node", "npm", "ping", "ps", "restart", "rm",
    "rmdir", "sed", "service", "sh", "shopt", "shred", "source", "sort", "sleep", "ssh", "start", "stop",
    "su", "sudo", "svn", "tee", "telnet", "top", "touch", "vi", "vim", "wall", "wc", "wget", "who", "write",
    "yes", "zsh"];

  CodeMirror.registerHelper("hintWords", "shell", commonAtoms.concat(commonKeywords, commonCommands));

  define('atom', commonAtoms);
  define('keyword', commonKeywords);
  define('builtin', commonCommands);

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
    var close = quote == "(" ? ")" : quote == "{" ? "}" : quote
    return function(stream, state) {
      var next, escaped = false;
      while ((next = stream.next()) != null) {
        if (next === close && !escaped) {
          state.tokens.shift();
          break;
        } else if (next === '$' && !escaped && quote !== "'" && stream.peek() != close) {
          escaped = true;
          stream.backUp(1);
          state.tokens.unshift(tokenDollar);
          break;
        } else if (!escaped && quote !== close && next === quote) {
          state.tokens.unshift(tokenString(quote, style))
          return tokenize(stream, state)
        } else if (!escaped && /['"]/.test(next) && !/['"]/.test(quote)) {
          state.tokens.unshift(tokenStringStart(next, "string"));
          stream.backUp(1);
          break;
        }
        escaped = !escaped && next === '\\';
      }
      return style;
    };
  };

  function tokenStringStart(quote, style) {
    return function(stream, state) {
      state.tokens[0] = tokenString(quote, style)
      stream.next()
      return tokenize(stream, state)
    }
  }

  var tokenDollar = function(stream, state) {
    if (state.tokens.length > 1) stream.eat('$');
    var ch = stream.next()
    if (/['"({]/.test(ch)) {
      state.tokens[0] = tokenString(ch, ch == "(" ? "quote" : ch == "{" ? "def" : "string");
      return tokenize(stream, state);
    }
    if (!/\d/.test(ch)) stream.eatWhile(/\w/);
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
// Apache uses a slightly different Media Type for Shell scripts
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
CodeMirror.defineMIME('application/x-sh', 'shell');

});

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../css/css"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../css/css"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
            ;

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
}, "css");

CodeMirror.defineMIME("text/x-sass", "sass");

});

var f,aa=this;
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;var fa=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function ia(a,b){return a<b?-1:a>b?1:0};function ja(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};var la;a:{var na=aa.navigator;if(na){var oa=na.userAgent;if(oa){la=oa;break a}}la=""}function v(a){return-1!=la.indexOf(a)};function pa(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b};function ra(){return v("iPhone")&&!v("iPod")&&!v("iPad")};function sa(a,b){var c=ta;Object.prototype.hasOwnProperty.call(c,a)||(c[a]=b(a))};var ua=v("Opera"),wa=v("Trident")||v("MSIE"),xa=v("Edge"),ya=v("Gecko")&&!(-1!=la.toLowerCase().indexOf("webkit")&&!v("Edge"))&&!(v("Trident")||v("MSIE"))&&!v("Edge"),Ca=-1!=la.toLowerCase().indexOf("webkit")&&!v("Edge");Ca&&v("Mobile");v("Macintosh");v("Windows");v("Linux")||v("CrOS");var Da=aa.navigator||null;Da&&(Da.appVersion||"").indexOf("X11");v("Android");ra();v("iPad");v("iPod");ra()||v("iPad")||v("iPod");function Ea(){var a=aa.document;return a?a.documentMode:void 0}var Fa;
a:{var Ga="",Ha=function(){var a=la;if(ya)return/rv:([^\);]+)(\)|;)/.exec(a);if(xa)return/Edge\/([\d\.]+)/.exec(a);if(wa)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Ca)return/WebKit\/(\S+)/.exec(a);if(ua)return/(?:Version)[ \/]?(\S+)/.exec(a)}();Ha&&(Ga=Ha?Ha[1]:"");if(wa){var Ja=Ea();if(null!=Ja&&Ja>parseFloat(Ga)){Fa=String(Ja);break a}}Fa=Ga}var ta={};
function Ka(a){sa(a,function(){for(var b=0,c=fa(String(Fa)).split("."),d=fa(String(a)).split("."),e=Math.max(c.length,d.length),g=0;0==b&&g<e;g++){var h=c[g]||"",k=d[g]||"";do{h=/(\d*)(\D*)(.*)/.exec(h)||["","","",""];k=/(\d*)(\D*)(.*)/.exec(k)||["","","",""];if(0==h[0].length&&0==k[0].length)break;b=ia(0==h[1].length?0:parseInt(h[1],10),0==k[1].length?0:parseInt(k[1],10))||ia(0==h[2].length,0==k[2].length)||ia(h[2],k[2]);h=h[3];k=k[3]}while(0==b)}return 0<=b})}var La;var Ma=aa.document;
La=Ma&&wa?Ea()||("CSS1Compat"==Ma.compatMode?parseInt(Fa,10):5):void 0;var Na;if(!(Na=!ya&&!wa)){var Pa;if(Pa=wa)Pa=9<=Number(La);Na=Pa}Na||ya&&Ka("1.9.1");wa&&Ka("9");function Qa(a,b){if("textContent"in a)a.textContent=b;else if(3==a.nodeType)a.data=String(b);else if(a.firstChild&&3==a.firstChild.nodeType){for(;a.lastChild!=a.firstChild;)a.removeChild(a.lastChild);a.firstChild.data=String(b)}else{for(var c;c=a.firstChild;)a.removeChild(c);a.appendChild((9==a.nodeType?a:a.ownerDocument||a.document).createTextNode(String(b)))}};function Ra(a,b){this.F=[];this.G=b;for(var c=!0,d=a.length-1;0<=d;d--){var e=a[d]|0;c&&e==b||(this.F[d]=e,c=!1)}}var Sa={};function Ta(a){if(-128<=a&&128>a){var b=Sa[a];if(b)return b}b=new Ra([a|0],0>a?-1:0);-128<=a&&128>a&&(Sa[a]=b);return b}function Ua(a){if(isNaN(a)||!isFinite(a))return Wa;if(0>a)return Xa(Ua(-a));for(var b=[],c=1,d=0;a>=c;d++)b[d]=a/c|0,c*=Za;return new Ra(b,0)}var Za=4294967296,Wa=Ta(0),$a=Ta(1),ab=Ta(16777216);
function bb(a){if(-1==a.G)return-bb(Xa(a));for(var b=0,c=1,d=0;d<a.F.length;d++){var e=x(a,d);b+=(0<=e?e:Za+e)*c;c*=Za}return b}f=Ra.prototype;f.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(cb(this))return"0";if(-1==this.G)return"-"+Xa(this).toString(a);for(var b=Ua(Math.pow(a,6)),c=this,d="";;){var e=db(c,b),g=e.multiply(b);c=c.add(Xa(g));g=((0<c.F.length?c.F[0]:c.G)>>>0).toString(a);c=e;if(cb(c))return g+d;for(;6>g.length;)g="0"+g;d=""+g+d}};
function x(a,b){return 0>b?0:b<a.F.length?a.F[b]:a.G}function cb(a){if(0!=a.G)return!1;for(var b=0;b<a.F.length;b++)if(0!=a.F[b])return!1;return!0}f.equals=function(a){if(this.G!=a.G)return!1;for(var b=Math.max(this.F.length,a.F.length),c=0;c<b;c++)if(x(this,c)!=x(a,c))return!1;return!0};f.compare=function(a){a=this.add(Xa(a));return-1==a.G?-1:cb(a)?0:1};function Xa(a){for(var b=a.F.length,c=[],d=0;d<b;d++)c[d]=~a.F[d];return(new Ra(c,~a.G)).add($a)}
f.add=function(a){for(var b=Math.max(this.F.length,a.F.length),c=[],d=0,e=0;e<=b;e++){var g=d+(x(this,e)&65535)+(x(a,e)&65535),h=(g>>>16)+(x(this,e)>>>16)+(x(a,e)>>>16);d=h>>>16;g&=65535;h&=65535;c[e]=h<<16|g}return new Ra(c,c[c.length-1]&-2147483648?-1:0)};
f.multiply=function(a){if(cb(this)||cb(a))return Wa;if(-1==this.G)return-1==a.G?Xa(this).multiply(Xa(a)):Xa(Xa(this).multiply(a));if(-1==a.G)return Xa(this.multiply(Xa(a)));if(0>this.compare(ab)&&0>a.compare(ab))return Ua(bb(this)*bb(a));for(var b=this.F.length+a.F.length,c=[],d=0;d<2*b;d++)c[d]=0;for(d=0;d<this.F.length;d++)for(var e=0;e<a.F.length;e++){var g=x(this,d)>>>16,h=x(this,d)&65535,k=x(a,e)>>>16,l=x(a,e)&65535;c[2*d+2*e]+=h*l;eb(c,2*d+2*e);c[2*d+2*e+1]+=g*l;eb(c,2*d+2*e+1);c[2*d+2*e+1]+=
h*k;eb(c,2*d+2*e+1);c[2*d+2*e+2]+=g*k;eb(c,2*d+2*e+2)}for(d=0;d<b;d++)c[d]=c[2*d+1]<<16|c[2*d];for(d=b;d<2*b;d++)c[d]=0;return new Ra(c,0)};function eb(a,b){for(;(a[b]&65535)!=a[b];)a[b+1]+=a[b]>>>16,a[b]&=65535,b++}
function db(a,b){if(cb(b))throw Error("division by zero");if(cb(a))return Wa;if(-1==a.G)return-1==b.G?db(Xa(a),Xa(b)):Xa(db(Xa(a),b));if(-1==b.G)return Xa(db(a,Xa(b)));if(30<a.F.length){if(-1==a.G||-1==b.G)throw Error("slowDivide_ only works with positive integers.");for(var c=$a;0>=b.compare(a);)c=c.shiftLeft(1),b=b.shiftLeft(1);var d=fb(c,1),e=fb(b,1);b=fb(b,2);for(c=fb(c,2);!cb(b);){var g=e.add(b);0>=g.compare(a)&&(d=d.add(c),e=g);b=fb(b,1);c=fb(c,1)}return d}for(c=Wa;0<=a.compare(b);){d=Math.max(1,
Math.floor(bb(a)/bb(b)));e=Math.ceil(Math.log(d)/Math.LN2);e=48>=e?1:Math.pow(2,e-48);g=Ua(d);for(var h=g.multiply(b);-1==h.G||0<h.compare(a);)d-=e,g=Ua(d),h=g.multiply(b);cb(g)&&(g=$a);c=c.add(g);a=a.add(Xa(h))}return c}f.and=function(a){for(var b=Math.max(this.F.length,a.F.length),c=[],d=0;d<b;d++)c[d]=x(this,d)&x(a,d);return new Ra(c,this.G&a.G)};f.or=function(a){for(var b=Math.max(this.F.length,a.F.length),c=[],d=0;d<b;d++)c[d]=x(this,d)|x(a,d);return new Ra(c,this.G|a.G)};
f.xor=function(a){for(var b=Math.max(this.F.length,a.F.length),c=[],d=0;d<b;d++)c[d]=x(this,d)^x(a,d);return new Ra(c,this.G^a.G)};f.shiftLeft=function(a){var b=a>>5;a%=32;for(var c=this.F.length+b+(0<a?1:0),d=[],e=0;e<c;e++)d[e]=0<a?x(this,e-b)<<a|x(this,e-b-1)>>>32-a:x(this,e-b);return new Ra(d,this.G)};function fb(a,b){var c=b>>5;b%=32;for(var d=a.F.length-c,e=[],g=0;g<d;g++)e[g]=0<b?x(a,g+c)>>>b|x(a,g+c+1)<<32-b:x(a,g+c);return new Ra(e,a.G)};function gb(a,b){null!=a&&this.append.apply(this,arguments)}f=gb.prototype;f.Ka="";f.set=function(a){this.Ka=""+a};f.append=function(a,b,c){this.Ka+=String(a);if(null!=b)for(var d=1;d<arguments.length;d++)this.Ka+=arguments[d];return this};f.clear=function(){this.Ka=""};f.toString=function(){return this.Ka};var hb={},ib={},jb;if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof z)var z={};if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof kb)var kb=null;if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof lb)var lb=null;var nb=null;if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof ob)var ob=null;function pb(){return new qb(null,5,[rb,!0,sb,!0,tb,!1,ub,!1,wb,null],null)}function A(a){return null!=a&&!1!==a}
function xb(a){return a instanceof Array}function D(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function E(a,b){var c=null==b?null:b.constructor;c=A(A(c)?c.ub:c)?c.gb:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function yb(a){var b=a.gb;return A(b)?b:F.b(a)}var zb="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Ab(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function Bb(){}
var Cb=function Cb(a){if(null!=a&&null!=a.Z)return a.Z(a);var c=Cb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Cb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("ICounted.-count",a);};function Db(){}var Eb=function Eb(a,b){if(null!=a&&null!=a.U)return a.U(a,b);var d=Eb[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=Eb._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("ICollection.-conj",a);};function Fb(){}
var H=function H(a){switch(arguments.length){case 2:return H.a(arguments[0],arguments[1]);case 3:return H.g(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",F.b(arguments.length)].join(""));}};H.a=function(a,b){if(null!=a&&null!=a.O)return a.O(a,b);var c=H[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=H._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw E("IIndexed.-nth",a);};
H.g=function(a,b,c){if(null!=a&&null!=a.$)return a.$(a,b,c);var d=H[t(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=H._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw E("IIndexed.-nth",a);};H.R=3;
var I=function I(a){if(null!=a&&null!=a.ea)return a.ea(a);var c=I[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=I._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("ISeq.-first",a);},J=function J(a){if(null!=a&&null!=a.fa)return a.fa(a);var c=J[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=J._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("ISeq.-rest",a);};function Gb(){}
var Hb=function Hb(a){if(null!=a&&null!=a.V)return a.V(a);var c=Hb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Hb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("INext.-next",a);};function Ib(){}var Kb=function Kb(a){switch(arguments.length){case 2:return Kb.a(arguments[0],arguments[1]);case 3:return Kb.g(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",F.b(arguments.length)].join(""));}};
Kb.a=function(a,b){if(null!=a&&null!=a.H)return a.H(a,b);var c=Kb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Kb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw E("ILookup.-lookup",a);};Kb.g=function(a,b,c){if(null!=a&&null!=a.s)return a.s(a,b,c);var d=Kb[t(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=Kb._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw E("ILookup.-lookup",a);};Kb.R=3;
var Lb=function Lb(a,b,c){if(null!=a&&null!=a.La)return a.La(a,b,c);var e=Lb[t(null==a?null:a)];if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);e=Lb._;if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);throw E("IAssociative.-assoc",a);},Mb=function Mb(a,b){if(null!=a&&null!=a.Va)return a.Va(a,b);var d=Mb[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=Mb._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("IFind.-find",a);};function Nb(){}
var Ob=function Ob(a){if(null!=a&&null!=a.Cb)return a.key;var c=Ob[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Ob._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IMapEntry.-key",a);},Pb=function Pb(a){if(null!=a&&null!=a.Db)return a.I;var c=Pb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Pb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IMapEntry.-val",a);};function Qb(){}function Rb(){}
var K=function K(a){if(null!=a&&null!=a.kb)return a.kb(a);var c=K[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=K._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IDeref.-deref",a);};function Sb(){}
var Tb=function Tb(a){if(null!=a&&null!=a.K)return a.K(a);var c=Tb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Tb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IMeta.-meta",a);},Ub=function Ub(a,b){if(null!=a&&null!=a.P)return a.P(a,b);var d=Ub[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=Ub._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("IWithMeta.-with-meta",a);};function Vb(){}
var Wb=function Wb(a){switch(arguments.length){case 2:return Wb.a(arguments[0],arguments[1]);case 3:return Wb.g(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",F.b(arguments.length)].join(""));}};Wb.a=function(a,b){if(null!=a&&null!=a.aa)return a.aa(a,b);var c=Wb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Wb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw E("IReduce.-reduce",a);};
Wb.g=function(a,b,c){if(null!=a&&null!=a.ba)return a.ba(a,b,c);var d=Wb[t(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=Wb._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw E("IReduce.-reduce",a);};Wb.R=3;function Xb(){}
var Yb=function Yb(a,b,c){if(null!=a&&null!=a.fb)return a.fb(a,b,c);var e=Yb[t(null==a?null:a)];if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);e=Yb._;if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);throw E("IKVReduce.-kv-reduce",a);},Zb=function Zb(a,b){if(null!=a&&null!=a.o)return a.o(a,b);var d=Zb[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=Zb._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("IEquiv.-equiv",a);},ac=function ac(a){if(null!=a&&null!=a.N)return a.N(a);
var c=ac[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=ac._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IHash.-hash",a);};function bc(){}var cc=function cc(a){if(null!=a&&null!=a.M)return a.M(a);var c=cc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=cc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("ISeqable.-seq",a);};function dc(){}function ec(){}function fc(){}
var M=function M(a,b){if(null!=a&&null!=a.tb)return a.tb(a,b);var d=M[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=M._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("IWriter.-write",a);};function gc(){}
var hc=function hc(a,b,c){if(null!=a&&null!=a.L)return a.L(a,b,c);var e=hc[t(null==a?null:a)];if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);e=hc._;if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);throw E("IPrintWithWriter.-pr-writer",a);},ic=function ic(a){if(null!=a&&null!=a.Qa)return a.Qa(a);var c=ic[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=ic._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IEditableCollection.-as-transient",a);},jc=function jc(a,b){if(null!=
a&&null!=a.Sa)return a.Sa(a,b);var d=jc[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=jc._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("ITransientCollection.-conj!",a);},kc=function kc(a){if(null!=a&&null!=a.Ya)return a.Ya(a);var c=kc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=kc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("ITransientCollection.-persistent!",a);},lc=function lc(a,b,c){if(null!=a&&null!=a.Ra)return a.Ra(a,b,c);var e=
lc[t(null==a?null:a)];if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);e=lc._;if(null!=e)return e.g?e.g(a,b,c):e.call(null,a,b,c);throw E("ITransientAssociative.-assoc!",a);},mc=function mc(a){if(null!=a&&null!=a.nb)return a.nb(a);var c=mc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=mc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IChunk.-drop-first",a);},nc=function nc(a){if(null!=a&&null!=a.jb)return a.jb(a);var c=nc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):
c.call(null,a);c=nc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IChunkedSeq.-chunked-first",a);},pc=function pc(a){if(null!=a&&null!=a.eb)return a.eb(a);var c=pc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=pc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IChunkedSeq.-chunked-rest",a);},qc=function qc(a){if(null!=a&&null!=a.qb)return a.name;var c=qc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=qc._;if(null!=c)return c.b?c.b(a):c.call(null,
a);throw E("INamed.-name",a);},rc=function rc(a){if(null!=a&&null!=a.rb)return a.Oa;var c=rc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=rc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("INamed.-namespace",a);},sc=function sc(a,b){if(null!=a&&null!=a.Gb)return a.Gb(a,b);var d=sc[t(null==a?null:a)];if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);d=sc._;if(null!=d)return d.a?d.a(a,b):d.call(null,a,b);throw E("IReset.-reset!",a);},tc=function tc(a){switch(arguments.length){case 2:return tc.a(arguments[0],
arguments[1]);case 3:return tc.g(arguments[0],arguments[1],arguments[2]);case 4:return tc.A(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return tc.S(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error(["Invalid arity: ",F.b(arguments.length)].join(""));}};
tc.a=function(a,b){if(null!=a&&null!=a.Ib)return a.Ib(a,b);var c=tc[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=tc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw E("ISwap.-swap!",a);};tc.g=function(a,b,c){if(null!=a&&null!=a.Jb)return a.Jb(a,b,c);var d=tc[t(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=tc._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw E("ISwap.-swap!",a);};
tc.A=function(a,b,c,d){if(null!=a&&null!=a.Kb)return a.Kb(a,b,c,d);var e=tc[t(null==a?null:a)];if(null!=e)return e.A?e.A(a,b,c,d):e.call(null,a,b,c,d);e=tc._;if(null!=e)return e.A?e.A(a,b,c,d):e.call(null,a,b,c,d);throw E("ISwap.-swap!",a);};tc.S=function(a,b,c,d,e){if(null!=a&&null!=a.Lb)return a.Lb(a,b,c,d,e);var g=tc[t(null==a?null:a)];if(null!=g)return g.S?g.S(a,b,c,d,e):g.call(null,a,b,c,d,e);g=tc._;if(null!=g)return g.S?g.S(a,b,c,d,e):g.call(null,a,b,c,d,e);throw E("ISwap.-swap!",a);};
tc.R=5;function uc(){}var vc=function vc(a){if(null!=a&&null!=a.ia)return a.ia(a);var c=vc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=vc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IIterable.-iterator",a);};function wc(a){this.Pb=a;this.h=1073741824;this.v=0}wc.prototype.tb=function(a,b){return this.Pb.append(b)};function xc(a){var b=new gb;a.L(null,new wc(b),pb());return F.b(b)}
var yc="undefined"!==typeof Math&&"undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function zc(a){a=yc(a|0,-862048943);return yc(a<<15|a>>>-15,461845907)}function Ac(a,b){a=(a|0)^(b|0);return yc(a<<13|a>>>-13,5)+-430675100|0}function Bc(a,b){a=(a|0)^b;a=yc(a^a>>>16,-2048144789);a=yc(a^a>>>13,-1028477387);return a^a>>>16}
function Cc(a){a:{var b=1;for(var c=0;;)if(b<a.length){var d=b+2;c=Ac(c,zc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^zc(a.charCodeAt(a.length-1)):b;return Bc(b,yc(2,a.length))}var Dc={},Ec=0;function Fc(a){255<Ec&&(Dc={},Ec=0);if(null==a)return 0;var b=Dc[a];if("number"===typeof b)a=b;else{a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b){var e=c+1;d=yc(31,d)+a.charCodeAt(c);c=e}else{b=d;break a}else b=0;else b=0;Dc[a]=b;Ec+=1;a=b}return a}
function Gc(a){if(null!=a&&(a.h&4194304||z===a.Wb))return ac(a)^0;if("number"===typeof a){if(A(isFinite(a)))return Math.floor(a)%2147483647;switch(a){case Infinity:return 2146435072;case -Infinity:return-1048576;default:return 2146959360}}else return!0===a?a=1231:!1===a?a=1237:"string"===typeof a?(a=Fc(a),0!==a&&(a=zc(a),a=Ac(0,a),a=Bc(a,4))):a=a instanceof Date?a.valueOf()^0:null==a?0:ac(a)^0,a}function Hc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}
function Ic(a,b,c,d,e){this.Oa=a;this.name=b;this.Ja=c;this.Pa=d;this.oa=e;this.h=2154168321;this.v=4096}f=Ic.prototype;f.toString=function(){return this.Ja};f.equiv=function(a){return this.o(null,a)};f.o=function(a,b){return b instanceof Ic?this.Ja===b.Ja:!1};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return N.a(c,this);case 3:return N.g(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return N.a(c,this)};a.g=function(a,c,d){return N.g(c,this,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return N.a(a,this)};f.a=function(a,b){return N.g(a,this,b)};f.K=function(){return this.oa};
f.P=function(a,b){return new Ic(this.Oa,this.name,this.Ja,this.Pa,b)};f.N=function(){var a=this.Pa;return null!=a?a:this.Pa=a=Hc(Cc(this.name),Fc(this.Oa))};f.qb=function(){return this.name};f.rb=function(){return this.Oa};f.L=function(a,b){return M(b,this.Ja)};function O(a){if(null==a)return null;if(null!=a&&(a.h&8388608||z===a.Hb))return cc(a);if(xb(a)||"string"===typeof a)return 0===a.length?null:new P(a,0,null);if(D(bc,a))return cc(a);throw Error([F.b(a)," is not ISeqable"].join(""));}
function Q(a){if(null==a)return null;if(null!=a&&(a.h&64||z===a.Xa))return I(a);a=O(a);return null==a?null:I(a)}function Jc(a){return null!=a?null!=a&&(a.h&64||z===a.Xa)?J(a):(a=O(a))?a.fa(null):Kc:Kc}function R(a){return null==a?null:null!=a&&(a.h&128||z===a.Wa)?Hb(a):O(Jc(a))}
var S=function S(a){switch(arguments.length){case 1:return S.b(arguments[0]);case 2:return S.a(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return S.B(arguments[0],arguments[1],new P(c.slice(2),0,null))}};S.b=function(){return!0};S.a=function(a,b){return null==a?null==b:a===b||Zb(a,b)};S.B=function(a,b,c){for(;;)if(S.a(a,b))if(R(c))a=b,b=Q(c),c=R(c);else return S.a(b,Q(c));else return!1};
S.T=function(a){var b=Q(a),c=R(a);a=Q(c);c=R(c);return this.B(b,a,c)};S.R=2;function Lc(a){this.u=a}Lc.prototype.next=function(){if(null!=this.u){var a=Q(this.u);this.u=R(this.u);return{value:a,done:!1}}return{value:null,done:!0}};function Mc(a){return new Lc(O(a))}function Nc(a,b){a=zc(a);a=Ac(0,a);return Bc(a,b)}function Oc(a){var b=0,c=1;for(a=O(a);;)if(null!=a)b+=1,c=yc(31,c)+Gc(Q(a))|0,a=R(a);else return Nc(c,b)}var Pc=Nc(1,0);
function Rc(a){var b=0,c=0;for(a=O(a);;)if(null!=a)b+=1,c=c+Gc(Q(a))|0,a=R(a);else return Nc(c,b)}var Sc=Nc(0,0);Bb["null"]=!0;Cb["null"]=function(){return 0};Date.prototype.o=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Zb.number=function(a,b){return a===b};Sb["function"]=!0;Tb["function"]=function(){return null};ac._=function(a){return a[ba]||(a[ba]=++ca)};function Tc(){this.I=!1;this.h=32768;this.v=0}Tc.prototype.kb=function(){return this.I};
function Uc(a){return a instanceof Tc}function Vc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var g=a[c];e=b.a?b.a(e,g):b.call(null,e,g);if(Uc(e))return K(e);c+=1}else return e}function Wc(a,b,c,d){for(var e=a.length;;)if(d<e){var g=a[d];c=b.a?b.a(c,g):b.call(null,c,g);if(Uc(c))return K(c);d+=1}else return c}function Xc(a){return null!=a?a.h&2||z===a.xb?!0:a.h?!1:D(Bb,a):D(Bb,a)}function Yc(a){return null!=a?a.h&16||z===a.pb?!0:a.h?!1:D(Fb,a):D(Fb,a)}
function T(a,b,c){var d=U(a);if(c>=d)return-1;!(0<c)&&0>c&&(c+=d,c=0>c?0:c);for(;;)if(c<d){if(S.a(Zc(a,c),b))return c;c+=1}else return-1}function V(a,b,c){var d=U(a);if(0===d)return-1;0<c?(--d,c=d<c?d:c):c=0>c?d+c:c;for(;;)if(0<=c){if(S.a(Zc(a,c),b))return c;--c}else return-1}function $c(a,b){this.c=a;this.j=b}$c.prototype.X=function(){return this.j<this.c.length};$c.prototype.next=function(){var a=this.c[this.j];this.j+=1;return a};
function P(a,b,c){this.c=a;this.j=b;this.l=c;this.h=166592766;this.v=139264}f=P.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.O=function(a,b){a=b+this.j;if(0<=a&&a<this.c.length)return this.c[a];throw Error("Index out of bounds");};f.$=function(a,b,c){a=b+this.j;return 0<=a&&a<this.c.length?this.c[a]:c};f.ia=function(){return new $c(this.c,this.j)};
f.K=function(){return this.l};f.V=function(){return this.j+1<this.c.length?new P(this.c,this.j+1,null):null};f.Z=function(){var a=this.c.length-this.j;return 0>a?0:a};f.N=function(){return Oc(this)};f.o=function(a,b){return ad(this,b)};f.aa=function(a,b){return Wc(this.c,b,this.c[this.j],this.j+1)};f.ba=function(a,b,c){return Wc(this.c,b,c,this.j)};f.ea=function(){return this.c[this.j]};f.fa=function(){return this.j+1<this.c.length?new P(this.c,this.j+1,null):Kc};
f.M=function(){return this.j<this.c.length?this:null};f.P=function(a,b){return b===this.l?this:new P(this.c,this.j,b)};f.U=function(a,b){return W(b,this)};P.prototype[zb]=function(){return Mc(this)};function bd(a){return 0<a.length?new P(a,0,null):null}Zb._=function(a,b){return a===b};
var cd=function cd(a){switch(arguments.length){case 0:return cd.D();case 1:return cd.b(arguments[0]);case 2:return cd.a(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return cd.B(arguments[0],arguments[1],new P(c.slice(2),0,null))}};cd.D=function(){return dd};cd.b=function(a){return a};cd.a=function(a,b){return null!=a?Eb(a,b):new ed(null,b,null,1,null)};
cd.B=function(a,b,c){for(;;)if(A(c))a=cd.a(a,b),b=Q(c),c=R(c);else return cd.a(a,b)};cd.T=function(a){var b=Q(a),c=R(a);a=Q(c);c=R(c);return this.B(b,a,c)};cd.R=2;function U(a){if(null!=a)if(null!=a&&(a.h&2||z===a.xb))a=Cb(a);else if(xb(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.h&8388608||z===a.Hb))a:{a=O(a);for(var b=0;;){if(Xc(a)){a=b+Cb(a);break a}a=R(a);b+=1}}else a=Cb(a);else a=0;return a}
function fd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return O(a)?Q(a):c;if(Yc(a))return H.g(a,b,c);if(O(a))a=R(a),--b;else return c}}
function Zc(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.h&16||z===a.pb))return H.a(a,b);if(xb(a)){if(-1<b&&b<a.length)return a[b|0];throw Error("Index out of bounds");}if("string"===typeof a){if(-1<b&&b<a.length)return a.charAt(b|0);throw Error("Index out of bounds");}if(null!=a&&(a.h&64||z===a.Xa)||null!=a&&(a.h&16777216||z===a.sb)){if(0>b)throw Error("Index out of bounds");a:for(;;){if(null==a)throw Error("Index out of bounds");
if(0===b){if(O(a)){a=Q(a);break a}throw Error("Index out of bounds");}if(Yc(a)){a=H.a(a,b);break a}if(O(a))a=R(a),--b;else throw Error("Index out of bounds");}return a}if(D(Fb,a))return H.a(a,b);throw Error(["nth not supported on this type ",F.b(yb(null==a?null:a.constructor))].join(""));}
function X(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.h&16||z===a.pb))return H.g(a,b,null);if(xb(a))return-1<b&&b<a.length?a[b|0]:null;if("string"===typeof a)return-1<b&&b<a.length?a.charAt(b|0):null;if(null!=a&&(a.h&64||z===a.Xa)||null!=a&&(a.h&16777216||z===a.sb))return 0>b?null:fd(a,b);if(D(Fb,a))return H.g(a,b,null);throw Error(["nth not supported on this type ",F.b(yb(null==a?null:a.constructor))].join(""));}
var N=function N(a){switch(arguments.length){case 2:return N.a(arguments[0],arguments[1]);case 3:return N.g(arguments[0],arguments[1],arguments[2]);default:throw Error(["Invalid arity: ",F.b(arguments.length)].join(""));}};N.a=function(a,b){return null==a?null:null!=a&&(a.h&256||z===a.Bb)?Kb.a(a,b):xb(a)?null!=b&&b<a.length?a[b|0]:null:"string"===typeof a?null!=b&&b<a.length?a.charAt(b|0):null:D(Ib,a)?Kb.a(a,b):null};
N.g=function(a,b,c){return null!=a?null!=a&&(a.h&256||z===a.Bb)?Kb.g(a,b,c):xb(a)?null!=b&&-1<b&&b<a.length?a[b|0]:c:"string"===typeof a?null!=b&&-1<b&&b<a.length?a.charAt(b|0):c:D(Ib,a)?Kb.g(a,b,c):c:c};N.R=3;var gd=function gd(a){switch(arguments.length){case 3:return gd.g(arguments[0],arguments[1],arguments[2]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return gd.B(arguments[0],arguments[1],arguments[2],new P(c.slice(3),0,null))}};
gd.g=function(a,b,c){if(null!=a)a=Lb(a,b,c);else{a=[b,c];b=[];for(c=0;;)if(c<a.length){var d=a[c],e=a[c+1],g=hd(b,d);-1===g?(g=b,g.push(d),g.push(e)):b[g+1]=e;c+=2}else break;a=new qb(null,b.length/2,b,null)}return a};gd.B=function(a,b,c,d){for(;;)if(a=gd.g(a,b,c),A(d))b=Q(d),c=Q(R(d)),d=R(R(d));else return a};gd.T=function(a){var b=Q(a),c=R(a);a=Q(c);var d=R(c);c=Q(d);d=R(d);return this.B(b,a,c,d)};gd.R=3;function id(a,b){this.f=a;this.l=b;this.h=393217;this.v=0}f=id.prototype;f.K=function(){return this.l};
f.P=function(a,b){return new id(this.f,b)};
f.call=function(){function a(a,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L,C,da){return jd(this.f,b,c,d,e,bd([g,h,k,l,p,m,n,q,r,u,w,y,B,G,L,C,da]))}function b(a,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L,C){a=this;return a.f.Aa?a.f.Aa(b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L,C):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L,C)}function c(a,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L){a=this;return a.f.za?a.f.za(b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G,L)}function d(a,
b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G){a=this;return a.f.ya?a.f.ya(b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B,G)}function e(a,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B){a=this;return a.f.xa?a.f.xa(b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y,B)}function g(a,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y){a=this;return a.f.wa?a.f.wa(b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w,y)}function h(a,b,c,d,e,g,h,k,l,p,m,n,
q,r,u,w){a=this;return a.f.va?a.f.va(b,c,d,e,g,h,k,l,p,m,n,q,r,u,w):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u,w)}function k(a,b,c,d,e,g,h,k,l,p,m,n,q,r,u){a=this;return a.f.ua?a.f.ua(b,c,d,e,g,h,k,l,p,m,n,q,r,u):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r,u)}function l(a,b,c,d,e,g,h,k,l,p,m,n,q,r){a=this;return a.f.ta?a.f.ta(b,c,d,e,g,h,k,l,p,m,n,q,r):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n,q,r)}function m(a,b,c,d,e,g,h,k,l,p,m,n,q){a=this;return a.f.sa?a.f.sa(b,c,d,e,g,h,k,l,p,m,n,q):a.f.call(null,b,c,d,
e,g,h,k,l,p,m,n,q)}function n(a,b,c,d,e,g,h,k,l,p,m,n){a=this;return a.f.ra?a.f.ra(b,c,d,e,g,h,k,l,p,m,n):a.f.call(null,b,c,d,e,g,h,k,l,p,m,n)}function p(a,b,c,d,e,g,h,k,l,p,m){a=this;return a.f.qa?a.f.qa(b,c,d,e,g,h,k,l,p,m):a.f.call(null,b,c,d,e,g,h,k,l,p,m)}function q(a,b,c,d,e,g,h,k,l,p){a=this;return a.f.Da?a.f.Da(b,c,d,e,g,h,k,l,p):a.f.call(null,b,c,d,e,g,h,k,l,p)}function r(a,b,c,d,e,g,h,k,l){a=this;return a.f.Ca?a.f.Ca(b,c,d,e,g,h,k,l):a.f.call(null,b,c,d,e,g,h,k,l)}function u(a,b,c,d,e,g,
h,k){a=this;return a.f.Ba?a.f.Ba(b,c,d,e,g,h,k):a.f.call(null,b,c,d,e,g,h,k)}function w(a,b,c,d,e,g,h){a=this;return a.f.ha?a.f.ha(b,c,d,e,g,h):a.f.call(null,b,c,d,e,g,h)}function y(a,b,c,d,e,g){a=this;return a.f.S?a.f.S(b,c,d,e,g):a.f.call(null,b,c,d,e,g)}function B(a,b,c,d,e){a=this;return a.f.A?a.f.A(b,c,d,e):a.f.call(null,b,c,d,e)}function G(a,b,c,d){a=this;return a.f.g?a.f.g(b,c,d):a.f.call(null,b,c,d)}function L(a,b,c){a=this;return a.f.a?a.f.a(b,c):a.f.call(null,b,c)}function da(a,b){a=this;
return a.f.b?a.f.b(b):a.f.call(null,b)}function Aa(a){a=this;return a.f.D?a.f.D():a.f.call(null)}var C=null;C=function(C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b,oc,Qc,Gd,Ge,xf){switch(arguments.length){case 1:return Aa.call(this,C);case 2:return da.call(this,C,ea);case 3:return L.call(this,C,ea,ha);case 4:return G.call(this,C,ea,ha,ka);case 5:return B.call(this,C,ea,ha,ka,ma);case 6:return y.call(this,C,ea,ha,ka,ma,qa);case 7:return w.call(this,C,ea,ha,ka,ma,qa,va);case 8:return u.call(this,
C,ea,ha,ka,ma,qa,va,za);case 9:return r.call(this,C,ea,ha,ka,ma,qa,va,za,Ba);case 10:return q.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia);case 11:return p.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa);case 12:return n.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va);case 13:return m.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya);case 14:return l.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb);case 15:return k.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb);case 16:return h.call(this,C,ea,ha,ka,
ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb);case 17:return g.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b);case 18:return e.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b,oc);case 19:return d.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b,oc,Qc);case 20:return c.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b,oc,Qc,Gd);case 21:return b.call(this,C,ea,ha,ka,ma,qa,va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b,oc,Qc,Gd,Ge);case 22:return a.call(this,C,ea,ha,ka,ma,qa,
va,za,Ba,Ia,Oa,Va,Ya,mb,vb,Jb,$b,oc,Qc,Gd,Ge,xf)}throw Error("Invalid arity: "+(arguments.length-1));};C.b=Aa;C.a=da;C.g=L;C.A=G;C.S=B;C.ha=y;C.Ba=w;C.Ca=u;C.Da=r;C.qa=q;C.ra=p;C.sa=n;C.ta=m;C.ua=l;C.va=k;C.wa=h;C.xa=g;C.ya=e;C.za=d;C.Aa=c;C.Ab=b;C.Vb=a;return C}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.D=function(){return this.f.D?this.f.D():this.f.call(null)};f.b=function(a){return this.f.b?this.f.b(a):this.f.call(null,a)};
f.a=function(a,b){return this.f.a?this.f.a(a,b):this.f.call(null,a,b)};f.g=function(a,b,c){return this.f.g?this.f.g(a,b,c):this.f.call(null,a,b,c)};f.A=function(a,b,c,d){return this.f.A?this.f.A(a,b,c,d):this.f.call(null,a,b,c,d)};f.S=function(a,b,c,d,e){return this.f.S?this.f.S(a,b,c,d,e):this.f.call(null,a,b,c,d,e)};f.ha=function(a,b,c,d,e,g){return this.f.ha?this.f.ha(a,b,c,d,e,g):this.f.call(null,a,b,c,d,e,g)};
f.Ba=function(a,b,c,d,e,g,h){return this.f.Ba?this.f.Ba(a,b,c,d,e,g,h):this.f.call(null,a,b,c,d,e,g,h)};f.Ca=function(a,b,c,d,e,g,h,k){return this.f.Ca?this.f.Ca(a,b,c,d,e,g,h,k):this.f.call(null,a,b,c,d,e,g,h,k)};f.Da=function(a,b,c,d,e,g,h,k,l){return this.f.Da?this.f.Da(a,b,c,d,e,g,h,k,l):this.f.call(null,a,b,c,d,e,g,h,k,l)};f.qa=function(a,b,c,d,e,g,h,k,l,m){return this.f.qa?this.f.qa(a,b,c,d,e,g,h,k,l,m):this.f.call(null,a,b,c,d,e,g,h,k,l,m)};
f.ra=function(a,b,c,d,e,g,h,k,l,m,n){return this.f.ra?this.f.ra(a,b,c,d,e,g,h,k,l,m,n):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n)};f.sa=function(a,b,c,d,e,g,h,k,l,m,n,p){return this.f.sa?this.f.sa(a,b,c,d,e,g,h,k,l,m,n,p):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p)};f.ta=function(a,b,c,d,e,g,h,k,l,m,n,p,q){return this.f.ta?this.f.ta(a,b,c,d,e,g,h,k,l,m,n,p,q):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q)};
f.ua=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r){return this.f.ua?this.f.ua(a,b,c,d,e,g,h,k,l,m,n,p,q,r):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r)};f.va=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u){return this.f.va?this.f.va(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r,u)};f.wa=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w){return this.f.wa?this.f.wa(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w)};
f.xa=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y){return this.f.xa?this.f.xa(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y)};f.ya=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B){return this.f.ya?this.f.ya(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B)};
f.za=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G){return this.f.za?this.f.za(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G)};f.Aa=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L){return this.f.Aa?this.f.Aa(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L)};f.Ab=function(a,b,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L,da){return jd(this.f,a,b,c,d,bd([e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L,da]))};
function kd(a,b){return"function"==t(a)?new id(a,b):null==a?null:Ub(a,b)}function ld(a){var b=null!=a;return(b?null!=a?a.h&131072||z===a.Eb||(a.h?0:D(Sb,a)):D(Sb,a):b)?Tb(a):null}function md(a){return null==a?!1:null!=a?a.h&4096||z===a.dc?!0:a.h?!1:D(Qb,a):D(Qb,a)}function nd(a){return null!=a?a.h&16777216||z===a.sb?!0:a.h?!1:D(dc,a):D(dc,a)}function od(a){return null==a?!1:null!=a?a.h&1024||z===a.$b?!0:a.h?!1:D(Nb,a):D(Nb,a)}
function pd(a){return null!=a?a.h&67108864||z===a.bc?!0:a.h?!1:D(fc,a):D(fc,a)}function qd(a){return null!=a?a.h&16384||z===a.ec?!0:a.h?!1:D(Rb,a):D(Rb,a)}function rd(a){return null!=a?a.v&512||z===a.Sb?!0:!1:!1}function sd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var td={};function ud(a){return null==a?!1:!1===a?!1:!0}function vd(a,b){return N.g(a,b,td)===td?!1:!0}function wd(a,b){return(b=O(b))?xd(a,Q(b),R(b)):a.D?a.D():a.call(null)}
function yd(a,b,c){for(c=O(c);;)if(c){var d=Q(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Uc(b))return K(b);c=R(c)}else return b}function zd(a,b,c){for(a=vc(a);;)if(a.X()){var d=a.next();c=b.a?b.a(c,d):b.call(null,c,d);if(Uc(c))return K(c)}else return c}function xd(a,b,c){return a=null!=c&&(c.h&524288||z===c.cc)?Wb.g(c,a,b):xb(c)?Vc(c,a,b):"string"===typeof c?Vc(c,a,b):D(Vb,c)?Wb.g(c,a,b):(null!=c?c.v&131072||z===c.Xb||(c.v?0:D(uc,c)):D(uc,c))?zd(c,a,b):yd(a,b,c)}
function Ad(a,b){return null!=b?Yb(b,a,!0):!0}function Bd(a){return a}function Cd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Dd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}var F=function F(a){switch(arguments.length){case 0:return F.D();case 1:return F.b(arguments[0]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return F.B(arguments[0],new P(c.slice(1),0,null))}};F.D=function(){return""};
F.b=function(a){return null==a?"":[a].join("")};F.B=function(a,b){for(a=new gb(F.b(a));;)if(A(b))a=a.append(F.b(Q(b))),b=R(b);else return a.toString()};F.T=function(a){var b=Q(a);a=R(a);return this.B(b,a)};F.R=1;function ad(a,b){if(nd(b))if(Xc(a)&&Xc(b)&&U(a)!==U(b))a=!1;else a:for(a=O(a),b=O(b);;){if(null==a){a=null==b;break a}if(null!=b&&S.a(Q(a),Q(b)))a=R(a),b=R(b);else{a=!1;break a}}else a=null;return ud(a)}
function ed(a,b,c,d,e){this.l=a;this.first=b;this.Ea=c;this.count=d;this.m=e;this.h=65937646;this.v=8192}f=ed.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,this.count)}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){return 1===this.count?null:this.Ea};f.Z=function(){return this.count};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};
f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return this.first};f.fa=function(){return 1===this.count?Kc:this.Ea};f.M=function(){return this};f.P=function(a,b){return b===this.l?this:new ed(b,this.first,this.Ea,this.count,this.m)};f.U=function(a,b){return new ed(this.l,b,this,this.count+1,null)};ed.prototype[zb]=function(){return Mc(this)};function Ed(a){this.l=a;this.h=65937614;this.v=8192}f=Ed.prototype;f.toString=function(){return xc(this)};
f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){return null};f.Z=function(){return 0};f.N=function(){return Pc};f.o=function(a,b){return(null!=b?b.h&33554432||z===b.Zb||(b.h?0:D(ec,b)):D(ec,b))||nd(b)?null==O(b):!1};
f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return null};f.fa=function(){return Kc};f.M=function(){return null};f.P=function(a,b){return b===this.l?this:new Ed(b)};f.U=function(a,b){return new ed(this.l,b,null,1,null)};var Kc=new Ed(null);Ed.prototype[zb]=function(){return Mc(this)};function Fd(a,b,c,d){this.l=a;this.first=b;this.Ea=c;this.m=d;this.h=65929452;this.v=8192}f=Fd.prototype;f.toString=function(){return xc(this)};
f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){return null==this.Ea?null:O(this.Ea)};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};f.aa=function(a,b){return wd(b,this)};
f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return this.first};f.fa=function(){return null==this.Ea?Kc:this.Ea};f.M=function(){return this};f.P=function(a,b){return b===this.l?this:new Fd(b,this.first,this.Ea,this.m)};f.U=function(a,b){return new Fd(null,b,this,null)};Fd.prototype[zb]=function(){return Mc(this)};function W(a,b){return null==b?new ed(null,a,null,1,null):null!=b&&(b.h&64||z===b.Xa)?new Fd(null,a,b,null):new Fd(null,a,O(b),null)}
function Y(a,b,c,d){this.Oa=a;this.name=b;this.Ha=c;this.Pa=d;this.h=2153775105;this.v=4096}f=Y.prototype;f.toString=function(){return[":",F.b(this.Ha)].join("")};f.equiv=function(a){return this.o(null,a)};f.o=function(a,b){return b instanceof Y?this.Ha===b.Ha:!1};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return N.a(c,this);case 3:return N.g(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return N.a(c,this)};a.g=function(a,c,d){return N.g(c,this,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return N.a(a,this)};f.a=function(a,b){return N.g(a,this,b)};
f.N=function(){var a=this.Pa;return null!=a?a:this.Pa=a=Hc(Cc(this.name),Fc(this.Oa))+2654435769|0};f.qb=function(){return this.name};f.rb=function(){return this.Oa};f.L=function(a,b){return M(b,[":",F.b(this.Ha)].join(""))};var Hd=function Hd(a){switch(arguments.length){case 1:return Hd.b(arguments[0]);case 2:return Hd.a(arguments[0],arguments[1]);default:throw Error(["Invalid arity: ",F.b(arguments.length)].join(""));}};
Hd.b=function(a){if(a instanceof Y)return a;if(a instanceof Ic){if(null!=a&&(a.v&4096||z===a.Fb))var b=rc(a);else throw Error(["Doesn't support namespace: ",F.b(a)].join(""));return new Y(b,Id(a),a.Ja,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new Y(b[0],b[1],a,null):new Y(null,b[0],a,null)):null};Hd.a=function(a,b){a=a instanceof Y?Id(a):a instanceof Ic?Id(a):a;b=b instanceof Y?Id(b):b instanceof Ic?Id(b):b;return new Y(a,b,[A(a)?[F.b(a),"/"].join(""):null,F.b(b)].join(""),null)};
Hd.R=2;function Jd(a,b,c){this.l=a;this.Za=b;this.u=null;this.m=c;this.h=32374988;this.v=1}f=Jd.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};function Kd(a){null!=a.Za&&(a.u=a.Za.D?a.Za.D():a.Za.call(null),a.Za=null);return a.u}
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){this.M(null);return null==this.u?null:R(this.u)};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};
f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){this.M(null);return null==this.u?null:Q(this.u)};f.fa=function(){this.M(null);return null!=this.u?Jc(this.u):Kc};f.M=function(){Kd(this);if(null==this.u)return null;for(var a=this.u;;)if(a instanceof Jd)a=Kd(a);else return this.u=a,O(this.u)};f.P=function(a,b){return b===this.l?this:new Jd(b,function(a){return function(){return a.M(null)}}(this),this.m)};f.U=function(a,b){return W(b,this)};
Jd.prototype[zb]=function(){return Mc(this)};function Ld(a){this.ib=a;this.end=0;this.h=2;this.v=0}Ld.prototype.add=function(a){this.ib[this.end]=a;return this.end+=1};Ld.prototype.pa=function(){var a=new Md(this.ib,0,this.end);this.ib=null;return a};Ld.prototype.Z=function(){return this.end};function Md(a,b,c){this.c=a;this.off=b;this.end=c;this.h=524306;this.v=0}f=Md.prototype;f.Z=function(){return this.end-this.off};f.O=function(a,b){return this.c[this.off+b]};
f.$=function(a,b,c){return 0<=b&&b<this.end-this.off?this.c[this.off+b]:c};f.nb=function(){if(this.off===this.end)throw Error("-drop-first of empty chunk");return new Md(this.c,this.off+1,this.end)};f.aa=function(a,b){return Wc(this.c,b,this.c[this.off],this.off+1)};f.ba=function(a,b,c){return Wc(this.c,b,c,this.off)};function Nd(a,b,c,d){this.pa=a;this.la=b;this.l=c;this.m=d;this.h=31850732;this.v=1536}f=Nd.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){return 1<Cb(this.pa)?new Nd(mc(this.pa),this.la,null,null):null==this.la?null:cc(this.la)};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};
f.o=function(a,b){return ad(this,b)};f.ea=function(){return H.a(this.pa,0)};f.fa=function(){return 1<Cb(this.pa)?new Nd(mc(this.pa),this.la,null,null):null==this.la?Kc:this.la};f.M=function(){return this};f.jb=function(){return this.pa};f.eb=function(){return null==this.la?Kc:this.la};f.P=function(a,b){return b===this.l?this:new Nd(this.pa,this.la,b,this.m)};f.U=function(a,b){return W(b,this)};f.ob=function(){return null==this.la?null:this.la};Nd.prototype[zb]=function(){return Mc(this)};
function Od(a,b){return 0===Cb(a)?b:new Nd(a,b,null,null)}function Pd(a,b){a.add(b)}function Qd(a,b){if(Xc(b))return U(b);var c=0;for(b=O(b);;)if(null!=b&&c<a)c+=1,b=R(b);else return c}
var Rd=function Rd(a){if(null==a)return null;var c=R(a);return null==c?O(Q(a)):W(Q(a),Rd.b?Rd.b(c):Rd.call(null,c))},Sd=function Sd(a){switch(arguments.length){case 0:return Sd.D();case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Sd.B(arguments[0],arguments[1],new P(c.slice(2),0,null))}};Sd.D=function(){return ic(dd)};Sd.b=function(a){return a};
Sd.a=function(a,b){return jc(a,b)};Sd.B=function(a,b,c){for(;;)if(a=jc(a,b),A(c))b=Q(c),c=R(c);else return a};Sd.T=function(a){var b=Q(a),c=R(a);a=Q(c);c=R(c);return this.B(b,a,c)};Sd.R=2;
function Td(a,b,c){var d=O(c);if(0===b)return a.D?a.D():a.call(null);c=I(d);var e=J(d);if(1===b)return a.b?a.b(c):a.call(null,c);d=I(e);var g=J(e);if(2===b)return a.a?a.a(c,d):a.call(null,c,d);e=I(g);var h=J(g);if(3===b)return a.g?a.g(c,d,e):a.call(null,c,d,e);g=I(h);var k=J(h);if(4===b)return a.A?a.A(c,d,e,g):a.call(null,c,d,e,g);h=I(k);var l=J(k);if(5===b)return a.S?a.S(c,d,e,g,h):a.call(null,c,d,e,g,h);k=I(l);var m=J(l);if(6===b)return a.ha?a.ha(c,d,e,g,h,k):a.call(null,c,d,e,g,h,k);l=I(m);var n=
J(m);if(7===b)return a.Ba?a.Ba(c,d,e,g,h,k,l):a.call(null,c,d,e,g,h,k,l);m=I(n);var p=J(n);if(8===b)return a.Ca?a.Ca(c,d,e,g,h,k,l,m):a.call(null,c,d,e,g,h,k,l,m);n=I(p);var q=J(p);if(9===b)return a.Da?a.Da(c,d,e,g,h,k,l,m,n):a.call(null,c,d,e,g,h,k,l,m,n);p=I(q);var r=J(q);if(10===b)return a.qa?a.qa(c,d,e,g,h,k,l,m,n,p):a.call(null,c,d,e,g,h,k,l,m,n,p);q=I(r);var u=J(r);if(11===b)return a.ra?a.ra(c,d,e,g,h,k,l,m,n,p,q):a.call(null,c,d,e,g,h,k,l,m,n,p,q);r=I(u);var w=J(u);if(12===b)return a.sa?a.sa(c,
d,e,g,h,k,l,m,n,p,q,r):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r);u=I(w);var y=J(w);if(13===b)return a.ta?a.ta(c,d,e,g,h,k,l,m,n,p,q,r,u):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u);w=I(y);var B=J(y);if(14===b)return a.ua?a.ua(c,d,e,g,h,k,l,m,n,p,q,r,u,w):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u,w);y=I(B);var G=J(B);if(15===b)return a.va?a.va(c,d,e,g,h,k,l,m,n,p,q,r,u,w,y):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y);B=I(G);var L=J(G);if(16===b)return a.wa?a.wa(c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B):a.call(null,c,d,e,
g,h,k,l,m,n,p,q,r,u,w,y,B);G=I(L);var da=J(L);if(17===b)return a.xa?a.xa(c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G);L=I(da);var Aa=J(da);if(18===b)return a.ya?a.ya(c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L);da=I(Aa);Aa=J(Aa);if(19===b)return a.za?a.za(c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L,da):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L,da);var C=I(Aa);J(Aa);if(20===b)return a.Aa?a.Aa(c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,
B,G,L,da,C):a.call(null,c,d,e,g,h,k,l,m,n,p,q,r,u,w,y,B,G,L,da,C);throw Error("Only up to 20 arguments supported on functions");}function Ud(a){return null!=a&&(a.h&128||z===a.Wa)?a.V(null):O(Jc(a))}function Vd(a,b,c){if(null==c)a=a.b?a.b(b):a.call(a,b);else{var d=I(c);c=Ud(c);a=null==c?a.a?a.a(b,d):a.call(a,b,d):Wd(a,b,d,I(c),Ud(c))}return a}function Wd(a,b,c,d,e){return null==e?a.g?a.g(b,c,d):a.call(a,b,c,d):Xd(a,b,c,d,I(e),Ud(e))}
function Xd(a,b,c,d,e,g){if(null==g)return a.A?a.A(b,c,d,e):a.call(a,b,c,d,e);var h=I(g),k=R(g);if(null==k)return a.S?a.S(b,c,d,e,h):a.call(a,b,c,d,e,h);g=I(k);var l=R(k);if(null==l)return a.ha?a.ha(b,c,d,e,h,g):a.call(a,b,c,d,e,h,g);k=I(l);var m=R(l);if(null==m)return a.Ba?a.Ba(b,c,d,e,h,g,k):a.call(a,b,c,d,e,h,g,k);l=I(m);var n=R(m);if(null==n)return a.Ca?a.Ca(b,c,d,e,h,g,k,l):a.call(a,b,c,d,e,h,g,k,l);m=I(n);var p=R(n);if(null==p)return a.Da?a.Da(b,c,d,e,h,g,k,l,m):a.call(a,b,c,d,e,h,g,k,l,m);
n=I(p);var q=R(p);if(null==q)return a.qa?a.qa(b,c,d,e,h,g,k,l,m,n):a.call(a,b,c,d,e,h,g,k,l,m,n);p=I(q);var r=R(q);if(null==r)return a.ra?a.ra(b,c,d,e,h,g,k,l,m,n,p):a.call(a,b,c,d,e,h,g,k,l,m,n,p);q=I(r);var u=R(r);if(null==u)return a.sa?a.sa(b,c,d,e,h,g,k,l,m,n,p,q):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q);r=I(u);var w=R(u);if(null==w)return a.ta?a.ta(b,c,d,e,h,g,k,l,m,n,p,q,r):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q,r);u=I(w);var y=R(w);if(null==y)return a.ua?a.ua(b,c,d,e,h,g,k,l,m,n,p,q,r,u):a.call(a,b,c,d,
e,h,g,k,l,m,n,p,q,r,u);w=I(y);var B=R(y);if(null==B)return a.va?a.va(b,c,d,e,h,g,k,l,m,n,p,q,r,u,w):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q,r,u,w);y=I(B);var G=R(B);if(null==G)return a.wa?a.wa(b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y);B=I(G);var L=R(G);if(null==L)return a.xa?a.xa(b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B);G=I(L);var da=R(L);if(null==da)return a.ya?a.ya(b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B,G):a.call(a,b,c,d,e,h,g,k,l,m,n,p,
q,r,u,w,y,B,G);L=I(da);var Aa=R(da);if(null==Aa)return a.za?a.za(b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B,G,L):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B,G,L);da=I(Aa);Aa=R(Aa);if(null==Aa)return a.Aa?a.Aa(b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B,G,L,da):a.call(a,b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B,G,L,da);b=[b,c,d,e,h,g,k,l,m,n,p,q,r,u,w,y,B,G,L,da];for(c=Aa;;)if(c)b.push(I(c)),c=R(c);else break;return a.apply(a,b)}
function Yd(a,b){if(a.T){var c=a.R,d=Qd(c+1,b);return d<=c?Td(a,d,b):a.T(b)}b=O(b);return null==b?a.D?a.D():a.call(a):Vd(a,I(b),Ud(b))}function jd(a,b,c,d,e,g){return a.T?(g=Rd(g),b=W(b,W(c,W(d,W(e,g)))),c=a.R,g=4+Qd(c-3,g),g<=c?Td(a,g,b):a.T(b)):Xd(a,b,c,d,e,Rd(g))}
function Zd(){if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof jb)jb=function(a){this.Ob=a;this.h=393216;this.v=0},jb.prototype.P=function(a,b){return new jb(b)},jb.prototype.K=function(){return this.Ob},jb.prototype.X=function(){return!1},jb.prototype.next=function(){return Error("No such element")},jb.prototype.remove=function(){return Error("Unsupported operation")},jb.fc=function(){return new $d(null,1,5,ae,[be],null)},jb.ub=!0,jb.gb="cljs.core/t_cljs$core20281",jb.Mb=
function(a){return M(a,"cljs.core/t_cljs$core20281")};return new jb(ce)}function de(a,b){for(;;){if(null==O(b))return!0;var c=Q(b);c=a.b?a.b(c):a.call(null,c);if(A(c))b=R(b);else return!1}}function ee(){this.state=new qb(null,2,[fe,"",ge,null],null);this.wb=this.Rb=this.l=null;this.v=16386;this.h=6455296}f=ee.prototype;f.equiv=function(a){return this.o(null,a)};f.o=function(a,b){return this===b};f.kb=function(){return this.state};f.K=function(){return this.l};
f.N=function(){return this[ba]||(this[ba]=++ca)};
function he(a,b){if(a instanceof ee){var c=a.Rb;if(null!=c&&!A(c.b?c.b(b):c.call(null,b)))throw Error("Validator rejected reference state");c=a.state;a.state=b;if(null!=a.wb)a:for(var d=O(a.wb),e=null,g=0,h=0;;)if(h<g){var k=e.O(null,h),l=X(k,0);k=X(k,1);k.A?k.A(l,a,c,b):k.call(null,l,a,c,b);h+=1}else if(d=O(d))rd(d)?(e=nc(d),d=pc(d),l=e,g=U(e),e=l):(e=Q(d),l=X(e,0),k=X(e,1),k.A?k.A(l,a,c,b):k.call(null,l,a,c,b),d=R(d),e=null,g=0),h=0;else break a;return b}return sc(a,b)}
var ie=function ie(a){switch(arguments.length){case 2:return ie.a(arguments[0],arguments[1]);case 3:return ie.g(arguments[0],arguments[1],arguments[2]);case 4:return ie.A(arguments[0],arguments[1],arguments[2],arguments[3]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ie.B(arguments[0],arguments[1],arguments[2],arguments[3],new P(c.slice(4),0,null))}};
ie.a=function(a,b){if(a instanceof ee){var c=a.state;b=b.b?b.b(c):b.call(null,c);a=he(a,b)}else a=tc.a(a,b);return a};ie.g=function(a,b,c){if(a instanceof ee){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=he(a,b)}else a=tc.g(a,b,c);return a};ie.A=function(a,b,c,d){if(a instanceof ee){var e=a.state;b=b.g?b.g(e,c,d):b.call(null,e,c,d);a=he(a,b)}else a=tc.A(a,b,c,d);return a};
ie.B=function(a,b,c,d,e){if(a instanceof ee){var g=a.state;b.T?(c=W(g,W(c,W(d,e))),d=b.R,e=3+Qd(d-2,e),b=e<=d?Td(b,e,c):b.T(c)):b=Wd(b,g,c,d,O(e));a=he(a,b)}else a=tc.S(a,b,c,d,e);return a};ie.T=function(a){var b=Q(a),c=R(a);a=Q(c);var d=R(c);c=Q(d);var e=R(d);d=Q(e);e=R(e);return this.B(b,a,c,d,e)};ie.R=4;
var Z=function Z(a){switch(arguments.length){case 1:return Z.b(arguments[0]);case 2:return Z.a(arguments[0],arguments[1]);case 3:return Z.g(arguments[0],arguments[1],arguments[2]);case 4:return Z.A(arguments[0],arguments[1],arguments[2],arguments[3]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Z.B(arguments[0],arguments[1],arguments[2],arguments[3],new P(c.slice(4),0,null))}};
Z.b=function(a){return function(b){return function(){function c(c,d){d=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,d):b.call(null,c,d)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.D?b.D():b.call(null)}var g=null,h=function(){function c(a,b,c){var e=null;if(2<arguments.length){e=0;for(var g=Array(arguments.length-2);e<g.length;)g[e]=arguments[e+2],++e;e=new P(g,0,null)}return d.call(this,a,b,e)}function d(c,d,e){if(a.T){d=W(d,e);var g=a.R;e=Qd(g,e)+1;e=e<=g?Td(a,e,d):a.T(d)}else e=
Vd(a,d,O(e));return b.a?b.a(c,e):b.call(null,c,e)}c.R=2;c.T=function(a){var b=Q(a);a=R(a);var c=Q(a);a=Jc(a);return d(b,c,a)};c.B=d;return c}();g=function(a,b,g){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var k=null;if(2<arguments.length){k=0;for(var l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new P(l,0,null)}return h.B(a,b,k)}throw Error("Invalid arity: "+arguments.length);};g.R=2;g.T=h.T;g.D=e;g.b=
d;g.a=c;g.B=h.B;return g}()}};Z.a=function(a,b){return new Jd(null,function(){var c=O(b);if(c){if(rd(c)){for(var d=nc(c),e=U(d),g=new Ld(Array(e)),h=0;;)if(h<e)Pd(g,function(){var b=H.a(d,h);return a.b?a.b(b):a.call(null,b)}()),h+=1;else break;return Od(g.pa(),Z.a(a,pc(c)))}return W(function(){var b=Q(c);return a.b?a.b(b):a.call(null,b)}(),Z.a(a,Jc(c)))}return null},null)};
Z.g=function(a,b,c){return new Jd(null,function(){var d=O(b),e=O(c);if(d&&e){var g=Q(d);var h=Q(e);g=a.a?a.a(g,h):a.call(null,g,h);d=W(g,Z.g(a,Jc(d),Jc(e)))}else d=null;return d},null)};Z.A=function(a,b,c,d){return new Jd(null,function(){var e=O(b),g=O(c),h=O(d);if(e&&g&&h){var k=Q(e);var l=Q(g),m=Q(h);k=a.g?a.g(k,l,m):a.call(null,k,l,m);e=W(k,Z.A(a,Jc(e),Jc(g),Jc(h)))}else e=null;return e},null)};
Z.B=function(a,b,c,d,e){var g=function l(a){return new Jd(null,function(){var b=Z.a(O,a);return de(Bd,b)?W(Z.a(Q,b),l(Z.a(Jc,b))):null},null)};return Z.a(function(){return function(b){return Yd(a,b)}}(g),g(cd.B(e,d,bd([c,b]))))};Z.T=function(a){var b=Q(a),c=R(a);a=Q(c);var d=R(c);c=Q(d);var e=R(d);d=Q(e);e=R(e);return this.B(b,a,c,d,e)};Z.R=4;
var je=function je(a){switch(arguments.length){case 3:return je.g(arguments[0],arguments[1],arguments[2]);case 4:return je.A(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return je.S(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return je.ha(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return je.B(arguments[0],arguments[1],arguments[2],
arguments[3],arguments[4],arguments[5],new P(c.slice(6),0,null))}};je.g=function(a,b,c){return gd.g(a,b,function(){var d=N.a(a,b);return c.b?c.b(d):c.call(null,d)}())};je.A=function(a,b,c,d){return gd.g(a,b,function(){var e=N.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())};je.S=function(a,b,c,d,e){return gd.g(a,b,function(){var g=N.a(a,b);return c.g?c.g(g,d,e):c.call(null,g,d,e)}())};je.ha=function(a,b,c,d,e,g){return gd.g(a,b,function(){var h=N.a(a,b);return c.A?c.A(h,d,e,g):c.call(null,h,d,e,g)}())};
je.B=function(a,b,c,d,e,g,h){return gd.g(a,b,jd(c,N.a(a,b),d,e,g,bd([h])))};je.T=function(a){var b=Q(a),c=R(a);a=Q(c);var d=R(c);c=Q(d);var e=R(d);d=Q(e);var g=R(e);e=Q(g);var h=R(g);g=Q(h);h=R(h);return this.B(b,a,c,d,e,g,h)};je.R=6;function ke(a,b){this.C=a;this.c=b}function le(a){return new ke(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}
function me(a){a=a.i;return 32>a?0:a-1>>>5<<5}function ne(a,b,c){for(;;){if(0===b)return c;var d=le(a);d.c[0]=c;c=d;b-=5}}var oe=function oe(a,b,c,d){var g=new ke(c.C,Ab(c.c)),h=a.i-1>>>b&31;5===b?g.c[h]=d:(c=c.c[h],null!=c?(b-=5,a=oe.A?oe.A(a,b,c,d):oe.call(null,a,b,c,d)):a=ne(null,b-5,d),g.c[h]=a);return g};function pe(a,b){throw Error(["No item ",F.b(a)," in vector of length ",F.b(b)].join(""));}
function qe(a,b){if(b>=me(a))return a.da;var c=a.root;for(a=a.shift;;)if(0<a){var d=a-5;c=c.c[b>>>a&31];a=d}else return c.c}var re=function re(a,b,c,d,e){var h=new ke(c.C,Ab(c.c));if(0===b)h.c[d&31]=e;else{var k=d>>>b&31;b-=5;c=c.c[k];a=re.S?re.S(a,b,c,d,e):re.call(null,a,b,c,d,e);h.c[k]=a}return h};function se(a,b,c){this.hb=this.j=0;this.c=a;this.Qb=b;this.start=0;this.end=c}se.prototype.X=function(){return this.j<this.end};
se.prototype.next=function(){32===this.j-this.hb&&(this.c=qe(this.Qb,this.j),this.hb+=32);var a=this.c[this.j&31];this.j+=1;return a};function te(a,b,c,d){return c<d?ue(a,b,Zc(a,c),c+1,d):b.D?b.D():b.call(null)}function ue(a,b,c,d,e){var g=c;c=d;for(d=qe(a,d);;)if(c<e){var h=c&31;d=0===h?qe(a,c):d;h=d[h];g=b.a?b.a(g,h):b.call(null,g,h);if(Uc(g))return K(g);c+=1}else return g}function $d(a,b,c,d,e,g){this.l=a;this.i=b;this.shift=c;this.root=d;this.da=e;this.m=g;this.h=167666463;this.v=139268}f=$d.prototype;
f.Va=function(a,b){return 0<=b&&b<this.i?new ve(b,qe(this,b)[b&31]):null};f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.H=function(a,b){return this.s(null,b,null)};f.s=function(a,b,c){return"number"===typeof b?this.$(null,b,c):c};
f.fb=function(a,b,c){a=0;for(var d=c;;)if(a<this.i){var e=qe(this,a);c=e.length;a:for(var g=0;;)if(g<c){var h=g+a,k=e[g];d=b.g?b.g(d,h,k):b.call(null,d,h,k);if(Uc(d)){e=d;break a}g+=1}else{e=d;break a}if(Uc(e))return K(e);a+=c;d=e}else return d};f.O=function(a,b){return(0<=b&&b<this.i?qe(this,b):pe(b,this.i))[b&31]};f.$=function(a,b,c){return 0<=b&&b<this.i?qe(this,b)[b&31]:c};
f.lb=function(a,b){if(0<=a&&a<this.i){if(me(this)<=a){var c=Ab(this.da);c[a&31]=b;return new $d(this.l,this.i,this.shift,this.root,c,null)}return new $d(this.l,this.i,this.shift,re(this,this.shift,this.root,a,b),this.da,null)}if(a===this.i)return this.U(null,b);throw Error(["Index ",F.b(a)," out of bounds  [0,",F.b(this.i),"]"].join(""));};f.ia=function(){var a=this.i;return new se(0<U(this)?qe(this,0):null,this,a)};f.K=function(){return this.l};f.Z=function(){return this.i};
f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){if(b instanceof $d)if(this.i===U(b))for(a=this.ia(null),b=b.ia(null);;)if(a.X()){var c=a.next(),d=b.next();if(!S.a(c,d))return!1}else return!0;else return!1;else return ad(this,b)};
f.Qa=function(){var a=this.i,b=this.shift,c=new ke({},Ab(this.root.c)),d=this.da,e=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];sd(d,0,e,0,d.length);return new we(a,b,c,e)};f.aa=function(a,b){return te(this,b,0,this.i)};
f.ba=function(a,b,c){a=0;for(var d=c;;)if(a<this.i){var e=qe(this,a);c=e.length;a:for(var g=0;;)if(g<c){var h=e[g];d=b.a?b.a(d,h):b.call(null,d,h);if(Uc(d)){e=d;break a}g+=1}else{e=d;break a}if(Uc(e))return K(e);a+=c;d=e}else return d};f.La=function(a,b,c){if("number"===typeof b)return this.lb(b,c);throw Error("Vector's key for assoc must be a number.");};
f.M=function(){if(0===this.i)var a=null;else if(32>=this.i)a=new P(this.da,0,null);else{a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.c[0];else{a=a.c;break a}}a=new xe(this,a,0,0,null)}return a};f.P=function(a,b){return b===this.l?this:new $d(b,this.i,this.shift,this.root,this.da,this.m)};
f.U=function(a,b){if(32>this.i-me(this)){a=this.da.length;for(var c=Array(a+1),d=0;;)if(d<a)c[d]=this.da[d],d+=1;else break;c[a]=b;return new $d(this.l,this.i+1,this.shift,this.root,c,null)}a=(c=this.i>>>5>1<<this.shift)?this.shift+5:this.shift;c?(c=le(null),c.c[0]=this.root,d=ne(null,this.shift,new ke(null,this.da)),c.c[1]=d):c=oe(this,this.shift,this.root,new ke(null,this.da));return new $d(this.l,this.i+1,a,c,[b],null)};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.$(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.O(null,c)};a.g=function(a,c,d){return this.$(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.O(null,a)};f.a=function(a,b){return this.$(null,a,b)};
var ae=new ke(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),dd=new $d(null,0,5,ae,[],Pc);$d.prototype[zb]=function(){return Mc(this)};function xe(a,b,c,d,e){this.ga=a;this.node=b;this.j=c;this.off=d;this.l=e;this.m=null;this.h=32375020;this.v=1536}f=xe.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){if(this.off+1<this.node.length){var a=new xe(this.ga,this.node,this.j,this.off+1,null);return null==a?null:a}return this.ob()};
f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};f.aa=function(a,b){return te(this.ga,b,this.j+this.off,U(this.ga))};f.ba=function(a,b,c){return ue(this.ga,b,c,this.j+this.off,U(this.ga))};f.ea=function(){return this.node[this.off]};f.fa=function(){if(this.off+1<this.node.length){var a=new xe(this.ga,this.node,this.j,this.off+1,null);return null==a?Kc:a}return this.eb(null)};f.M=function(){return this};
f.jb=function(){var a=this.node;return new Md(a,this.off,a.length)};f.eb=function(){var a=this.j+this.node.length;return a<Cb(this.ga)?new xe(this.ga,qe(this.ga,a),a,0,null):Kc};f.P=function(a,b){return b===this.l?this:new xe(this.ga,this.node,this.j,this.off,b)};f.U=function(a,b){return W(b,this)};f.ob=function(){var a=this.j+this.node.length;return a<Cb(this.ga)?new xe(this.ga,qe(this.ga,a),a,0,null):null};xe.prototype[zb]=function(){return Mc(this)};
function ye(a,b){return a===b.C?b:new ke(a,Ab(b.c))}var ze=function ze(a,b,c,d){c=ye(a.root.C,c);var g=a.i-1>>>b&31;if(5===b)a=d;else{var h=c.c[g];null!=h?(b-=5,a=ze.A?ze.A(a,b,h,d):ze.call(null,a,b,h,d)):a=ne(a.root.C,b-5,d)}c.c[g]=a;return c};function we(a,b,c,d){this.i=a;this.shift=b;this.root=c;this.da=d;this.v=88;this.h=275}f=we.prototype;
f.Sa=function(a,b){if(this.root.C){if(32>this.i-me(this))this.da[this.i&31]=b;else{a=new ke(this.root.C,this.da);var c=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];c[0]=b;this.da=c;this.i>>>5>1<<this.shift?(b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],c=this.shift+
5,b[0]=this.root,b[1]=ne(this.root.C,this.shift,a),this.root=new ke(this.root.C,b),this.shift=c):this.root=ze(this,this.shift,this.root,a)}this.i+=1;return this}throw Error("conj! after persistent!");};f.Ya=function(){if(this.root.C){this.root.C=null;var a=this.i-me(this),b=Array(a);sd(this.da,0,b,0,a);return new $d(null,this.i,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
f.Ra=function(a,b,c){if("number"===typeof b)return Ae(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
function Ae(a,b,c){if(a.root.C){if(0<=b&&b<a.i){if(me(a)<=b)a.da[b&31]=c;else{var d=function(){return function(){return function k(d,h){h=ye(a.root.C,h);if(0===d)h.c[b&31]=c;else{var g=b>>>d&31;d=k(d-5,h.c[g]);h.c[g]=d}return h}}(a)(a.shift,a.root)}();a.root=d}return a}if(b===a.i)return a.Sa(null,c);throw Error(["Index ",F.b(b)," out of bounds for TransientVector of length",F.b(a.i)].join(""));}throw Error("assoc! after persistent!");}
f.Z=function(){if(this.root.C)return this.i;throw Error("count after persistent!");};f.O=function(a,b){if(this.root.C)return(0<=b&&b<this.i?qe(this,b):pe(b,this.i))[b&31];throw Error("nth after persistent!");};f.$=function(a,b,c){return 0<=b&&b<this.i?this.O(null,b):c};f.H=function(a,b){return this.s(null,b,null)};f.s=function(a,b,c){return"number"===typeof b?this.$(null,b,c):c};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.H(null,c);case 3:return this.s(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.H(null,c)};a.g=function(a,c,d){return this.s(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.H(null,a)};f.a=function(a,b){return this.s(null,a,b)};function Be(){this.h=2097152;this.v=0}
Be.prototype.equiv=function(a){return this.o(null,a)};Be.prototype.o=function(){return!1};var Ce=new Be;function De(a,b){return ud(od(b)&&!pd(b)?U(a)===U(b)?(null!=a?a.h&1048576||z===a.Yb||(a.h?0:D(Xb,a)):D(Xb,a))?Ad(function(a,d,e){return S.a(N.g(b,d,Ce),e)?!0:new Tc},a):de(function(a){return S.a(N.g(b,Q(a),Ce),Q(R(a)))},a):null:null)}function Ee(a){this.u=a}
Ee.prototype.next=function(){if(null!=this.u){var a=Q(this.u),b=X(a,0);a=X(a,1);this.u=R(this.u);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Fe(a){this.u=a}Fe.prototype.next=function(){if(null!=this.u){var a=Q(this.u);this.u=R(this.u);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function hd(a,b){if(b instanceof Y)a:{var c=a.length;b=b.Ha;for(var d=0;;){if(c<=d){a=-1;break a}if(a[d]instanceof Y&&b===a[d].Ha){a=d;break a}d+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){a=-1;break a}if(b===a[d]){a=d;break a}d+=2}else if(b instanceof Ic)a:for(c=a.length,b=b.Ja,d=0;;){if(c<=d){a=-1;break a}if(a[d]instanceof Ic&&b===a[d].Ja){a=d;break a}d+=2}else if(null==b)a:for(b=a.length,c=0;;){if(b<=c){a=-1;break a}if(null==a[c]){a=c;break a}c+=2}else a:for(c=
a.length,d=0;;){if(c<=d){a=-1;break a}if(S.a(b,a[d])){a=d;break a}d+=2}return a}function ve(a,b){this.key=a;this.I=b;this.m=null;this.h=166619935;this.v=0}f=ve.prototype;f.Va=function(a,b){switch(b){case 0:return new ve(0,this.key);case 1:return new ve(1,this.I);default:return null}};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.H=function(a,b){return this.$(null,b,null)};f.s=function(a,b,c){return this.$(null,b,c)};f.O=function(a,b){if(0===b)return this.key;if(1===b)return this.I;throw Error("Index out of bounds");};
f.$=function(a,b,c){return 0===b?this.key:1===b?this.I:c};f.lb=function(a,b){return(new $d(null,2,5,ae,[this.key,this.I],null)).lb(a,b)};f.K=function(){return null};f.Z=function(){return 2};f.Cb=function(){return this.key};f.Db=function(){return this.I};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};
f.aa=function(a,b){a:if(a=Cb(this),0===a)b=b.D?b.D():b.call(null);else for(var c=H.a(this,0),d=1;;)if(d<a){var e=H.a(this,d);c=b.a?b.a(c,e):b.call(null,c,e);if(Uc(c)){b=K(c);break a}d+=1}else{b=c;break a}return b};f.ba=function(a,b,c){a:{a=Cb(this);var d=c;for(c=0;;)if(c<a){var e=H.a(this,c);d=b.a?b.a(d,e):b.call(null,d,e);if(Uc(d)){b=K(d);break a}c+=1}else{b=d;break a}}return b};f.La=function(a,b,c){return gd.g(new $d(null,2,5,ae,[this.key,this.I],null),b,c)};
f.M=function(){return new P([this.key,this.I],0,null)};f.P=function(a,b){return kd(new $d(null,2,5,ae,[this.key,this.I],null),b)};f.U=function(a,b){return new $d(null,3,5,ae,[this.key,this.I,b],null)};f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.O(null,c);case 3:return this.$(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.O(null,c)};a.g=function(a,c,d){return this.$(null,c,d)};return a}();
f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.O(null,a)};f.a=function(a,b){return this.$(null,a,b)};function He(a){return null!=a?a.h&2048||z===a.ac?!0:!1:!1}function Ie(a,b,c){this.c=a;this.j=b;this.oa=c;this.h=32374990;this.v=0}f=Ie.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.oa};f.V=function(){return this.j<this.c.length-2?new Ie(this.c,this.j+2,null):null};f.Z=function(){return(this.c.length-this.j)/2};f.N=function(){return Oc(this)};f.o=function(a,b){return ad(this,b)};
f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return new ve(this.c[this.j],this.c[this.j+1])};f.fa=function(){return this.j<this.c.length-2?new Ie(this.c,this.j+2,null):Kc};f.M=function(){return this};f.P=function(a,b){return b===this.oa?this:new Ie(this.c,this.j,b)};f.U=function(a,b){return W(b,this)};Ie.prototype[zb]=function(){return Mc(this)};function Je(a,b){this.c=a;this.j=0;this.i=b}Je.prototype.X=function(){return this.j<this.i};
Je.prototype.next=function(){var a=new ve(this.c[this.j],this.c[this.j+1]);this.j+=2;return a};function qb(a,b,c,d){this.l=a;this.i=b;this.c=c;this.m=d;this.h=16647951;this.v=139268}f=qb.prototype;f.Va=function(a,b){a=hd(this.c,b);return-1===a?null:new ve(this.c[a],this.c[a+1])};f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.keys=function(){return Mc(Ke(this))};f.entries=function(){return new Ee(O(O(this)))};f.values=function(){return Mc(Le(this))};
f.has=function(a){return vd(this,a)};f.get=function(a,b){return this.s(null,a,b)};f.forEach=function(a){for(var b=O(this),c=null,d=0,e=0;;)if(e<d){var g=c.O(null,e),h=X(g,0);g=X(g,1);a.a?a.a(g,h):a.call(null,g,h);e+=1}else if(b=O(b))rd(b)?(c=nc(b),b=pc(b),h=c,d=U(c),c=h):(c=Q(b),h=X(c,0),g=X(c,1),a.a?a.a(g,h):a.call(null,g,h),b=R(b),c=null,d=0),e=0;else return null};f.H=function(a,b){return this.s(null,b,null)};f.s=function(a,b,c){a=hd(this.c,b);return-1===a?c:this.c[a+1]};
f.fb=function(a,b,c){a=this.c.length;for(var d=0;;)if(d<a){var e=this.c[d],g=this.c[d+1];c=b.g?b.g(c,e,g):b.call(null,c,e,g);if(Uc(c))return K(c);d+=2}else return c};f.ia=function(){return new Je(this.c,2*this.i)};f.K=function(){return this.l};f.Z=function(){return this.i};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Rc(this)};
f.o=function(a,b){if(od(b)&&!pd(b))if(a=this.c.length,this.i===b.Z(null))for(var c=0;;)if(c<a){var d=b.s(null,this.c[c],td);if(d!==td)if(S.a(this.c[c+1],d))c+=2;else return!1;else return!1}else return!0;else return!1;else return!1};f.Qa=function(){return new Me(this.c.length,Ab(this.c))};f.aa=function(a,b){a:if(a=vc(this),A(a.X()))for(var c=a.next();;)if(a.X()){var d=a.next();c=b.a?b.a(c,d):b.call(null,c,d);if(Uc(c)){b=K(c);break a}}else{b=c;break a}else b=b.D?b.D():b.call(null);return b};
f.ba=function(a,b,c){return zd(this,b,c)};f.La=function(a,b,c){a=hd(this.c,b);if(-1===a){if(this.i<Ne){a=this.c;for(var d=a.length,e=Array(d+2),g=0;;)if(g<d)e[g]=a[g],g+=1;else break;e[d]=b;e[d+1]=c;return new qb(this.l,this.i+1,e,null)}a=Oe;a=null!=a?null!=a&&(a.v&4||z===a.Ub)?Ub(kc(xd(jc,ic(a),this)),ld(a)):xd(Eb,a,this):xd(cd,Kc,this);return Ub(Lb(a,b,c),this.l)}if(c===this.c[a+1])return this;b=Ab(this.c);b[a+1]=c;return new qb(this.l,this.i,b,null)};
f.M=function(){var a=this.c;return 0<=a.length-2?new Ie(a,0,null):null};f.P=function(a,b){return b===this.l?this:new qb(b,this.i,this.c,this.m)};f.U=function(a,b){if(qd(b))return this.La(null,H.a(b,0),H.a(b,1));a=this;for(b=O(b);;){if(null==b)return a;var c=Q(b);if(qd(c))a=Lb(a,H.a(c,0),H.a(c,1)),b=R(b);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.H(null,c);case 3:return this.s(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.H(null,c)};a.g=function(a,c,d){return this.s(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.H(null,a)};f.a=function(a,b){return this.s(null,a,b)};var ce=new qb(null,0,[],Sc),Ne=8;qb.prototype[zb]=function(){return Mc(this)};
function Me(a,b){this.Ta={};this.Ua=a;this.c=b;this.h=259;this.v=56}f=Me.prototype;f.Z=function(){if(A(this.Ta))return Cd(this.Ua);throw Error("count after persistent!");};f.H=function(a,b){return this.s(null,b,null)};f.s=function(a,b,c){if(A(this.Ta))return a=hd(this.c,b),-1===a?c:this.c[a+1];throw Error("lookup after persistent!");};
f.Sa=function(a,b){if(A(this.Ta)){if(He(b))return this.Ra(null,Ob(b),Pb(b));if(qd(b))return this.Ra(null,b.b?b.b(0):b.call(null,0),b.b?b.b(1):b.call(null,1));a=O(b);for(b=this;;){var c=Q(a);if(A(c))a=R(a),b=lc(b,Ob(c),Pb(c));else return b}}else throw Error("conj! after persistent!");};f.Ya=function(){if(A(this.Ta))return this.Ta=!1,new qb(null,Cd(this.Ua),this.c,null);throw Error("persistent! called twice");};
f.Ra=function(a,b,c){if(A(this.Ta)){a=hd(this.c,b);if(-1===a){if(this.Ua+2<=2*Ne)return this.Ua+=2,this.c.push(b),this.c.push(c),this;a:{a=this.Ua;var d=this.c;var e=ic(Oe);for(var g=0;;)if(g<a)e=lc(e,d[g],d[g+1]),g+=2;else break a}return lc(e,b,c)}c!==this.c[a+1]&&(this.c[a+1]=c);return this}throw Error("assoc! after persistent!");};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.s(null,c,null);case 3:return this.s(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.s(null,c,null)};a.g=function(a,c,d){return this.s(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.s(null,a,null)};f.a=function(a,b){return this.s(null,a,b)};function Pe(){this.I=!1}
function Qe(a,b){return a===b?!0:a===b||a instanceof Y&&b instanceof Y&&a.Ha===b.Ha?!0:S.a(a,b)}function Re(a,b,c){a=Ab(a);a[b]=c;return a}function Se(a,b,c,d){a=a.Ma(b);a.c[c]=d;return a}function Te(a,b,c){for(var d=a.length,e=0,g=c;;)if(e<d){c=a[e];if(null!=c){var h=a[e+1];c=b.g?b.g(g,c,h):b.call(null,g,c,h)}else c=a[e+1],c=null!=c?c.bb(b,g):g;if(Uc(c))return c;e+=2;g=c}else return g}function Ue(a){this.c=a;this.j=0;this.ma=this.cb=null}
Ue.prototype.advance=function(){for(var a=this.c.length;;)if(this.j<a){var b=this.c[this.j],c=this.c[this.j+1];null!=b?b=this.cb=new ve(b,c):null!=c?(b=vc(c),b=b.X()?this.ma=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};Ue.prototype.X=function(){var a=null!=this.cb;return a?a:(a=null!=this.ma)?a:this.advance()};
Ue.prototype.next=function(){if(null!=this.cb){var a=this.cb;this.cb=null;return a}if(null!=this.ma)return a=this.ma.next(),this.ma.X()||(this.ma=null),a;if(this.advance())return this.next();throw Error("No such element");};Ue.prototype.remove=function(){return Error("Unsupported operation")};function Ve(a,b,c){this.C=a;this.J=b;this.c=c;this.v=131072;this.h=0}f=Ve.prototype;
f.Ma=function(a){if(a===this.C)return this;var b=Dd(this.J),c=Array(0>b?4:2*(b+1));sd(this.c,0,c,0,2*b);return new Ve(a,this.J,c)};f.ab=function(){return We(this.c,0,null)};f.bb=function(a,b){return Te(this.c,a,b)};f.Na=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.J&e))return d;var g=Dd(this.J&e-1);e=this.c[2*g];g=this.c[2*g+1];return null==e?g.Na(a+5,b,c,d):Qe(c,e)?g:d};
f.ka=function(a,b,c,d,e,g){var h=1<<(c>>>b&31),k=Dd(this.J&h-1);if(0===(this.J&h)){var l=Dd(this.J);if(2*l<this.c.length){a=this.Ma(a);b=a.c;g.I=!0;a:for(c=2*(l-k),g=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[g];--l;--c;--g}b[2*k]=d;b[2*k+1]=e;a.J|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Xe.ka(a,b+5,c,d,e,g);for(e=d=0;;)if(32>d)0===
(this.J>>>d&1)?d+=1:(k[d]=null!=this.c[e]?Xe.ka(a,b+5,Gc(this.c[e]),this.c[e],this.c[e+1],g):this.c[e+1],e+=2,d+=1);else break;return new Ye(a,l+1,k)}b=Array(2*(l+4));sd(this.c,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;sd(this.c,2*k,b,2*(k+1),2*(l-k));g.I=!0;a=this.Ma(a);a.c=b;a.J|=h;return a}l=this.c[2*k];h=this.c[2*k+1];if(null==l)return l=h.ka(a,b+5,c,d,e,g),l===h?this:Se(this,a,2*k+1,l);if(Qe(d,l))return e===h?this:Se(this,a,2*k+1,e);g.I=!0;g=b+5;b=Gc(l);if(b===c)e=new Ze(null,b,2,[l,h,d,e]);else{var m=
new Pe;e=Xe.ka(a,g,b,l,h,m).ka(a,g,c,d,e,m)}d=2*k;k=2*k+1;a=this.Ma(a);a.c[d]=null;a.c[k]=e;return a};
f.ja=function(a,b,c,d,e){var g=1<<(b>>>a&31),h=Dd(this.J&g-1);if(0===(this.J&g)){var k=Dd(this.J);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Xe.ja(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0===(this.J>>>c&1)?c+=1:(h[c]=null!=this.c[d]?Xe.ja(a+5,Gc(this.c[d]),this.c[d],this.c[d+1],e):this.c[d+1],d+=2,c+=1);else break;return new Ye(null,k+1,h)}a=Array(2*(k+1));sd(this.c,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;sd(this.c,2*h,a,2*(h+1),2*(k-h));e.I=!0;return new Ve(null,this.J|g,a)}var l=this.c[2*h];g=this.c[2*h+1];if(null==l)return k=g.ja(a+5,b,c,d,e),k===g?this:new Ve(null,this.J,Re(this.c,2*h+1,k));if(Qe(c,l))return d===g?this:new Ve(null,this.J,Re(this.c,2*h+1,d));e.I=!0;e=this.J;k=this.c;a+=5;var m=Gc(l);if(m===b)c=new Ze(null,m,2,[l,g,c,d]);else{var n=new Pe;c=Xe.ja(a,m,l,g,n).ja(a,b,c,d,n)}a=2*h;h=2*h+1;d=Ab(k);d[a]=null;d[h]=c;return new Ve(null,e,d)};
f.$a=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.J&e))return d;var g=Dd(this.J&e-1);e=this.c[2*g];g=this.c[2*g+1];return null==e?g.$a(a+5,b,c,d):Qe(c,e)?new ve(e,g):d};f.ia=function(){return new Ue(this.c)};var Xe=new Ve(null,0,[]);function $e(a){this.c=a;this.j=0;this.ma=null}$e.prototype.X=function(){for(var a=this.c.length;;){if(null!=this.ma&&this.ma.X())return!0;if(this.j<a){var b=this.c[this.j];this.j+=1;null!=b&&(this.ma=vc(b))}else return!1}};
$e.prototype.next=function(){if(this.X())return this.ma.next();throw Error("No such element");};$e.prototype.remove=function(){return Error("Unsupported operation")};function Ye(a,b,c){this.C=a;this.i=b;this.c=c;this.v=131072;this.h=0}f=Ye.prototype;f.Ma=function(a){return a===this.C?this:new Ye(a,this.i,Ab(this.c))};f.ab=function(){return af(this.c,0,null)};f.bb=function(a,b){for(var c=this.c.length,d=0;;)if(d<c){var e=this.c[d];if(null!=e){b=e.bb(a,b);if(Uc(b))return b;d+=1}else d+=1}else return b};
f.Na=function(a,b,c,d){var e=this.c[b>>>a&31];return null!=e?e.Na(a+5,b,c,d):d};f.ka=function(a,b,c,d,e,g){var h=c>>>b&31,k=this.c[h];if(null==k)return a=Se(this,a,h,Xe.ka(a,b+5,c,d,e,g)),a.i+=1,a;b=k.ka(a,b+5,c,d,e,g);return b===k?this:Se(this,a,h,b)};f.ja=function(a,b,c,d,e){var g=b>>>a&31,h=this.c[g];if(null==h)return new Ye(null,this.i+1,Re(this.c,g,Xe.ja(a+5,b,c,d,e)));a=h.ja(a+5,b,c,d,e);return a===h?this:new Ye(null,this.i,Re(this.c,g,a))};
f.$a=function(a,b,c,d){var e=this.c[b>>>a&31];return null!=e?e.$a(a+5,b,c,d):d};f.ia=function(){return new $e(this.c)};function bf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Qe(c,a[d]))return d;d+=2}else return-1}function Ze(a,b,c,d){this.C=a;this.Ga=b;this.i=c;this.c=d;this.v=131072;this.h=0}f=Ze.prototype;f.Ma=function(a){if(a===this.C)return this;var b=Array(2*(this.i+1));sd(this.c,0,b,0,2*this.i);return new Ze(a,this.Ga,this.i,b)};f.ab=function(){return We(this.c,0,null)};
f.bb=function(a,b){return Te(this.c,a,b)};f.Na=function(a,b,c,d){a=bf(this.c,this.i,c);return 0>a?d:Qe(c,this.c[a])?this.c[a+1]:d};
f.ka=function(a,b,c,d,e,g){if(c===this.Ga){b=bf(this.c,this.i,d);if(-1===b){if(this.c.length>2*this.i)return b=2*this.i,c=2*this.i+1,a=this.Ma(a),a.c[b]=d,a.c[c]=e,g.I=!0,a.i+=1,a;c=this.c.length;b=Array(c+2);sd(this.c,0,b,0,c);b[c]=d;b[c+1]=e;g.I=!0;d=this.i+1;a===this.C?(this.c=b,this.i=d,a=this):a=new Ze(this.C,this.Ga,d,b);return a}return this.c[b+1]===e?this:Se(this,a,b+1,e)}return(new Ve(a,1<<(this.Ga>>>b&31),[null,this,null,null])).ka(a,b,c,d,e,g)};
f.ja=function(a,b,c,d,e){return b===this.Ga?(a=bf(this.c,this.i,c),-1===a?(a=2*this.i,b=Array(a+2),sd(this.c,0,b,0,a),b[a]=c,b[a+1]=d,e.I=!0,new Ze(null,this.Ga,this.i+1,b)):S.a(this.c[a+1],d)?this:new Ze(null,this.Ga,this.i,Re(this.c,a+1,d))):(new Ve(null,1<<(this.Ga>>>a&31),[null,this])).ja(a,b,c,d,e)};f.$a=function(a,b,c,d){a=bf(this.c,this.i,c);return 0>a?d:Qe(c,this.c[a])?new ve(this.c[a],this.c[a+1]):d};f.ia=function(){return new Ue(this.c)};
function cf(a,b,c,d,e){this.l=a;this.na=b;this.j=c;this.u=d;this.m=e;this.h=32374988;this.v=0}f=cf.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){return null==this.u?We(this.na,this.j+2,null):We(this.na,this.j,R(this.u))};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};
f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return null==this.u?new ve(this.na[this.j],this.na[this.j+1]):Q(this.u)};f.fa=function(){var a=null==this.u?We(this.na,this.j+2,null):We(this.na,this.j,R(this.u));return null!=a?a:Kc};f.M=function(){return this};f.P=function(a,b){return b===this.l?this:new cf(b,this.na,this.j,this.u,this.m)};f.U=function(a,b){return W(b,this)};cf.prototype[zb]=function(){return Mc(this)};
function We(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new cf(null,a,b,null,null);var d=a[b+1];if(A(d)&&(d=d.ab(),A(d)))return new cf(null,a,b+2,d,null);b+=2}else return null;else return new cf(null,a,b,c,null)}function df(a,b,c,d,e){this.l=a;this.na=b;this.j=c;this.u=d;this.m=e;this.h=32374988;this.v=0}f=df.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.l};f.V=function(){return af(this.na,this.j,R(this.u))};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Oc(this)};f.o=function(a,b){return ad(this,b)};f.aa=function(a,b){return wd(b,this)};
f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return Q(this.u)};f.fa=function(){var a=af(this.na,this.j,R(this.u));return null!=a?a:Kc};f.M=function(){return this};f.P=function(a,b){return b===this.l?this:new df(b,this.na,this.j,this.u,this.m)};f.U=function(a,b){return W(b,this)};df.prototype[zb]=function(){return Mc(this)};
function af(a,b,c){if(null==c)for(c=a.length;;)if(b<c){var d=a[b];if(A(d)&&(d=d.ab(),A(d)))return new df(null,a,b+1,d,null);b+=1}else return null;else return new df(null,a,b,c,null)}function ef(a,b){this.Y=a;this.vb=b;this.mb=!1}ef.prototype.X=function(){return!this.mb||this.vb.X()};ef.prototype.next=function(){if(this.mb)return this.vb.next();this.mb=!0;return new ve(null,this.Y)};ef.prototype.remove=function(){return Error("Unsupported operation")};
function ff(a,b,c,d,e,g){this.l=a;this.i=b;this.root=c;this.ca=d;this.Y=e;this.m=g;this.h=16123663;this.v=139268}f=ff.prototype;f.Va=function(a,b){return null==b?this.ca?new ve(null,this.Y):null:null==this.root?null:this.root.$a(0,Gc(b),b,null)};f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.keys=function(){return Mc(Ke(this))};f.entries=function(){return new Ee(O(O(this)))};f.values=function(){return Mc(Le(this))};f.has=function(a){return vd(this,a)};
f.get=function(a,b){return this.s(null,a,b)};f.forEach=function(a){for(var b=O(this),c=null,d=0,e=0;;)if(e<d){var g=c.O(null,e),h=X(g,0);g=X(g,1);a.a?a.a(g,h):a.call(null,g,h);e+=1}else if(b=O(b))rd(b)?(c=nc(b),b=pc(b),h=c,d=U(c),c=h):(c=Q(b),h=X(c,0),g=X(c,1),a.a?a.a(g,h):a.call(null,g,h),b=R(b),c=null,d=0),e=0;else return null};f.H=function(a,b){return this.s(null,b,null)};f.s=function(a,b,c){return null==b?this.ca?this.Y:c:null==this.root?c:this.root.Na(0,Gc(b),b,c)};
f.fb=function(a,b,c){a=this.ca?b.g?b.g(c,null,this.Y):b.call(null,c,null,this.Y):c;Uc(a)?b=K(a):null!=this.root?(b=this.root.bb(b,a),b=Uc(b)?K(b):b):b=a;return b};f.ia=function(){var a=this.root?vc(this.root):Zd();return this.ca?new ef(this.Y,a):a};f.K=function(){return this.l};f.Z=function(){return this.i};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Rc(this)};f.o=function(a,b){return De(this,b)};f.Qa=function(){return new gf(this.root,this.i,this.ca,this.Y)};
f.La=function(a,b,c){if(null==b)return this.ca&&c===this.Y?this:new ff(this.l,this.ca?this.i:this.i+1,this.root,!0,c,null);a=new Pe;b=(null==this.root?Xe:this.root).ja(0,Gc(b),b,c,a);return b===this.root?this:new ff(this.l,a.I?this.i+1:this.i,b,this.ca,this.Y,null)};f.M=function(){if(0<this.i){var a=null!=this.root?this.root.ab():null;return this.ca?W(new ve(null,this.Y),a):a}return null};f.P=function(a,b){return b===this.l?this:new ff(b,this.i,this.root,this.ca,this.Y,this.m)};
f.U=function(a,b){if(qd(b))return this.La(null,H.a(b,0),H.a(b,1));a=this;for(b=O(b);;){if(null==b)return a;var c=Q(b);if(qd(c))a=Lb(a,H.a(c,0),H.a(c,1)),b=R(b);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.H(null,c);case 3:return this.s(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.H(null,c)};a.g=function(a,c,d){return this.s(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.H(null,a)};f.a=function(a,b){return this.s(null,a,b)};var Oe=new ff(null,0,null,!1,null,Sc);
function hf(){for(var a="js md xml css sass markdown sh html sql".split(" "),b="javascript markdown xml css sass markdown shell xml sql".split(" "),c=a.length,d=0,e=ic(Oe);;)if(d<c){var g=d+1;e=lc(e,a[d],b[d]);d=g}else return kc(e)}ff.prototype[zb]=function(){return Mc(this)};function gf(a,b,c,d){this.C={};this.root=a;this.count=b;this.ca=c;this.Y=d;this.h=259;this.v=56}
function jf(a,b,c){if(a.C){if(null==b)a.Y!==c&&(a.Y=c),a.ca||(a.count+=1,a.ca=!0);else{var d=new Pe;b=(null==a.root?Xe:a.root).ka(a.C,0,Gc(b),b,c,d);b!==a.root&&(a.root=b);d.I&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}f=gf.prototype;f.Z=function(){if(this.C)return this.count;throw Error("count after persistent!");};f.H=function(a,b){return null==b?this.ca?this.Y:null:null==this.root?null:this.root.Na(0,Gc(b),b)};
f.s=function(a,b,c){return null==b?this.ca?this.Y:c:null==this.root?c:this.root.Na(0,Gc(b),b,c)};f.Sa=function(a,b){a:if(this.C)if(He(b))a=jf(this,Ob(b),Pb(b));else if(qd(b))a=jf(this,b.b?b.b(0):b.call(null,0),b.b?b.b(1):b.call(null,1));else for(a=O(b),b=this;;){var c=Q(a);if(A(c))a=R(a),b=jf(b,Ob(c),Pb(c));else{a=b;break a}}else throw Error("conj! after persistent");return a};
f.Ya=function(){if(this.C){this.C=null;var a=new ff(null,this.count,this.root,this.ca,this.Y,null)}else throw Error("persistent! called twice");return a};f.Ra=function(a,b,c){return jf(this,b,c)};f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.H(null,c);case 3:return this.s(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.H(null,c)};a.g=function(a,c,d){return this.s(null,c,d)};return a}();
f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.H(null,a)};f.a=function(a,b){return this.s(null,a,b)};var kf=function kf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return kf.B(0<c.length?new P(c.slice(0),0,null):null)};kf.B=function(a){for(var b=O(a),c=ic(Oe);;)if(b){a=R(R(b));var d=Q(b);b=Q(R(b));c=lc(c,d,b);b=a}else return kc(c)};kf.R=0;kf.T=function(a){return this.B(O(a))};
function lf(a,b){this.w=a;this.oa=b;this.h=32374988;this.v=0}f=lf.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.oa};f.V=function(){var a=(null!=this.w?this.w.h&128||z===this.w.Wa||(this.w.h?0:D(Gb,this.w)):D(Gb,this.w))?this.w.V(null):R(this.w);return null==a?null:new lf(a,null)};f.N=function(){return Oc(this)};
f.o=function(a,b){return ad(this,b)};f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return this.w.ea(null).key};f.fa=function(){var a=(null!=this.w?this.w.h&128||z===this.w.Wa||(this.w.h?0:D(Gb,this.w)):D(Gb,this.w))?this.w.V(null):R(this.w);return null!=a?new lf(a,null):Kc};f.M=function(){return this};f.P=function(a,b){return b===this.oa?this:new lf(this.w,b)};f.U=function(a,b){return W(b,this)};lf.prototype[zb]=function(){return Mc(this)};
function Ke(a){return(a=O(a))?new lf(a,null):null}function mf(a,b){this.w=a;this.oa=b;this.h=32374988;this.v=0}f=mf.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null;a=function(a,c){switch(arguments.length){case 1:return T(this,a,0);case 2:return T(this,a,c)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a){return T(this,a,0)};a.a=function(a,c){return T(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return V(this,a,U(this))}var b=null;b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return V(this,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=a;b.a=function(a,b){return V(this,a,b)};return b}();f.K=function(){return this.oa};f.V=function(){var a=(null!=this.w?this.w.h&128||z===this.w.Wa||(this.w.h?0:D(Gb,this.w)):D(Gb,this.w))?this.w.V(null):R(this.w);return null==a?null:new mf(a,null)};f.N=function(){return Oc(this)};
f.o=function(a,b){return ad(this,b)};f.aa=function(a,b){return wd(b,this)};f.ba=function(a,b,c){return yd(b,c,this)};f.ea=function(){return this.w.ea(null).I};f.fa=function(){var a=(null!=this.w?this.w.h&128||z===this.w.Wa||(this.w.h?0:D(Gb,this.w)):D(Gb,this.w))?this.w.V(null):R(this.w);return null!=a?new mf(a,null):Kc};f.M=function(){return this};f.P=function(a,b){return b===this.oa?this:new mf(this.w,b)};f.U=function(a,b){return W(b,this)};mf.prototype[zb]=function(){return Mc(this)};
function Le(a){return(a=O(a))?new mf(a,null):null}function nf(a){this.iter=a}nf.prototype.X=function(){return this.iter.X()};nf.prototype.next=function(){if(this.iter.X())return this.iter.next().key;throw Error("No such element");};nf.prototype.remove=function(){return Error("Unsupported operation")};function of(a,b,c){this.l=a;this.Ia=b;this.m=c;this.h=15077647;this.v=139268}f=of.prototype;f.toString=function(){return xc(this)};f.equiv=function(a){return this.o(null,a)};f.keys=function(){return Mc(O(this))};
f.entries=function(){return new Fe(O(O(this)))};f.values=function(){return Mc(O(this))};f.has=function(a){return vd(this,a)};f.forEach=function(a){for(var b=O(this),c=null,d=0,e=0;;)if(e<d){var g=c.O(null,e),h=X(g,0);g=X(g,1);a.a?a.a(g,h):a.call(null,g,h);e+=1}else if(b=O(b))rd(b)?(c=nc(b),b=pc(b),h=c,d=U(c),c=h):(c=Q(b),h=X(c,0),g=X(c,1),a.a?a.a(g,h):a.call(null,g,h),b=R(b),c=null,d=0),e=0;else return null};f.H=function(a,b){return this.s(null,b,null)};
f.s=function(a,b,c){a=Mb(this.Ia,b);return A(a)?Ob(a):c};f.ia=function(){return new nf(vc(this.Ia))};f.K=function(){return this.l};f.Z=function(){return Cb(this.Ia)};f.N=function(){var a=this.m;return null!=a?a:this.m=a=Rc(this)};f.o=function(a,b){if(a=md(b)){var c=U(this)===U(b);if(c)try{return Ad(function(){return function(a,c){return(a=vd(b,c))?a:new Tc}}(c,a,this),this.Ia)}catch(d){if(d instanceof Error)return!1;throw d;}else return c}else return a};f.Qa=function(){return new pf(ic(this.Ia))};
f.M=function(){return Ke(this.Ia)};f.P=function(a,b){return b===this.l?this:new of(b,this.Ia,this.m)};f.U=function(a,b){return new of(this.l,gd.g(this.Ia,b,null),null)};f.call=function(){var a=null;a=function(a,c,d){switch(arguments.length){case 2:return this.H(null,c);case 3:return this.s(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a,c){return this.H(null,c)};a.g=function(a,c,d){return this.s(null,c,d)};return a}();
f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};f.b=function(a){return this.H(null,a)};f.a=function(a,b){return this.s(null,a,b)};of.prototype[zb]=function(){return Mc(this)};function pf(a){this.Fa=a;this.v=136;this.h=259}f=pf.prototype;f.Sa=function(a,b){this.Fa=lc(this.Fa,b,null);return this};f.Ya=function(){return new of(null,kc(this.Fa),null)};f.Z=function(){return U(this.Fa)};f.H=function(a,b){return this.s(null,b,null)};
f.s=function(a,b,c){return Kb.g(this.Fa,b,td)===td?c:b};f.call=function(){function a(a,b,c){return Kb.g(this.Fa,b,td)===td?c:b}function b(a,b){return Kb.g(this.Fa,b,td)===td?null:b}var c=null;c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,g)}throw Error("Invalid arity: "+(arguments.length-1));};c.a=b;c.g=a;return c}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ab(b)))};
f.b=function(a){return Kb.g(this.Fa,a,td)===td?null:a};f.a=function(a,b){return Kb.g(this.Fa,a,td)===td?b:a};function Id(a){if(null!=a&&(a.v&4096||z===a.Fb))return qc(a);if("string"===typeof a)return a;throw Error(["Doesn't support name: ",F.b(a)].join(""));}
function qf(a,b,c,d,e,g,h){var k=nb;nb=null==nb?null:nb-1;try{if(null!=nb&&0>nb)return M(a,"#");M(a,c);if(0===wb.b(g))O(h)&&M(a,function(){var a=rf.b(g);return A(a)?a:"..."}());else{if(O(h)){var l=Q(h);b.g?b.g(l,a,g):b.call(null,l,a,g)}for(var m=R(h),n=wb.b(g)-1;;)if(!m||null!=n&&0===n){O(m)&&0===n&&(M(a,d),M(a,function(){var a=rf.b(g);return A(a)?a:"..."}()));break}else{M(a,d);var p=Q(m);c=a;h=g;b.g?b.g(p,c,h):b.call(null,p,c,h);var q=R(m);c=n-1;m=q;n=c}}return M(a,e)}finally{nb=k}}
function sf(a,b){b=O(b);for(var c=null,d=0,e=0;;)if(e<d){var g=c.O(null,e);M(a,g);e+=1}else if(b=O(b))c=b,rd(c)?(b=nc(c),d=pc(c),c=b,g=U(b),b=d,d=g):(g=Q(c),M(a,g),b=R(c),c=null,d=0),e=0;else return null}var tf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function uf(a){return['"',F.b(a.replace(/[\\"\b\f\n\r\t]/g,function(a){return tf[a]})),'"'].join("")}function vf(a,b){return(a=ud(N.a(a,tb)))?(a=null!=b?b.h&131072||z===b.Eb?!0:!1:!1)?null!=ld(b):a:a}
function wf(a,b,c){if(null==a)return M(b,"nil");vf(c,a)&&(M(b,"^"),yf(ld(a),b,c),M(b," "));if(a.ub)return a.Mb(b);if(null!=a?a.h&2147483648||z===a.W||(a.h?0:D(gc,a)):D(gc,a))return hc(a,b,c);if(!0===a||!1===a)return M(b,F.b(a));if("number"===typeof a)return M(b,isNaN(a)?"##NaN":a===Number.POSITIVE_INFINITY?"##Inf":a===Number.NEGATIVE_INFINITY?"##-Inf":F.b(a));if(null!=a&&a.constructor===Object)return M(b,"#js "),zf(Z.a(function(b){var c=/[A-Za-z_\*\+\?!\-'][\w\*\+\?!\-']*/;if("string"===typeof b)if(c=
c.exec(b),S.a(Q(c),b))if(1===U(c))c=Q(c);else if(He(c))c=new $d(null,2,5,ae,[Ob(c),Pb(c)],null);else if(qd(c))c=kd(c,null);else if(xb(c))b:{var d=c.length;if(32>d)c=new $d(null,d,5,ae,c,null);else for(var e=32,l=(new $d(null,32,5,ae,c.slice(0,32),null)).Qa(null);;)if(e<d){var m=e+1;l=Sd.a(l,c[e]);e=m}else{c=kc(l);break b}}else c=kc(xd(jc,ic(dd),c));else c=null;else throw new TypeError("re-matches must match against a string.");return new ve(null!=c?Hd.b(b):b,a[b])},pa(a)),b,c);if(xb(a))return qf(b,
yf,"#js ["," ","]",c,a);if("string"==typeof a)return A(sb.b(c))?M(b,uf(a)):M(b,a);if("function"==t(a)){var d=a.name;c=A(function(){var a=null==d;return a?a:/^[\s\xa0]*$/.test(d)}())?"Function":d;return sf(b,bd(["#object[",c,"","]"]))}if(a instanceof Date)return c=function(a,b){for(a=F.b(a);;)if(U(a)<b)a=["0",a].join("");else return a},sf(b,bd(['#inst "',F.b(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),
2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"']));if(a instanceof RegExp)return sf(b,bd(['#"',a.source,'"']));if(A(function(){var b=null==a?null:a.constructor;return null==b?null:b.gb}()))return sf(b,bd(["#object[",a.constructor.gb.replace(/\//g,"."),"]"]));d=function(){var b=null==a?null:a.constructor;return null==b?null:b.name}();c=A(function(){var a=null==d;return a?a:/^[\s\xa0]*$/.test(d)}())?"Object":d;return null==a.constructor?sf(b,bd(["#object[",c,"]"])):sf(b,bd(["#object[",c," ",F.b(a),
"]"]))}function yf(a,b,c){var d=Af.b(c);return A(d)?(c=gd.g(c,Bf,wf),d.g?d.g(a,b,c):d.call(null,a,b,c)):wf(a,b,c)}function Cf(a,b){var c=new gb;a:{var d=new wc(c);yf(Q(a),d,b);a=O(R(a));for(var e=null,g=0,h=0;;)if(h<g){var k=e.O(null,h);M(d," ");yf(k,d,b);h+=1}else if(a=O(a))e=a,rd(e)?(a=nc(e),g=pc(e),e=a,k=U(a),a=g,g=k):(k=Q(e),M(d," "),yf(k,d,b),a=R(e),e=null,g=0),h=0;else break a}return c}
function Df(a,b,c,d,e){return qf(d,function(a,b,d){var e=Ob(a);c.g?c.g(e,b,d):c.call(null,e,b,d);M(b," ");a=Pb(a);return c.g?c.g(a,b,d):c.call(null,a,b,d)},[F.b(a),"{"].join(""),", ","}",e,O(b))}function zf(a,b,c){var d=yf,e=(od(a),null),g=X(e,0);e=X(e,1);return A(g)?Df(["#:",F.b(g)].join(""),e,d,b,c):Df(null,a,d,b,c)}P.prototype.W=z;P.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};Jd.prototype.W=z;Jd.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};
ve.prototype.W=z;ve.prototype.L=function(a,b,c){return qf(b,yf,"["," ","]",c,this)};cf.prototype.W=z;cf.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};Ie.prototype.W=z;Ie.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};xe.prototype.W=z;xe.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};Fd.prototype.W=z;Fd.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};ff.prototype.W=z;ff.prototype.L=function(a,b,c){return zf(this,b,c)};
df.prototype.W=z;df.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};of.prototype.W=z;of.prototype.L=function(a,b,c){return qf(b,yf,"#{"," ","}",c,this)};Nd.prototype.W=z;Nd.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};ee.prototype.W=z;ee.prototype.L=function(a,b,c){M(b,"#object[cljs.core.Atom ");yf(new qb(null,1,[Ef,this.state],null),b,c);return M(b,"]")};mf.prototype.W=z;mf.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};$d.prototype.W=z;
$d.prototype.L=function(a,b,c){return qf(b,yf,"["," ","]",c,this)};Ed.prototype.W=z;Ed.prototype.L=function(a,b){return M(b,"()")};qb.prototype.W=z;qb.prototype.L=function(a,b,c){return zf(this,b,c)};lf.prototype.W=z;lf.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};ed.prototype.W=z;ed.prototype.L=function(a,b,c){return qf(b,yf,"("," ",")",c,this)};function Ff(){}
var Gf=function Gf(a){if(null!=a&&null!=a.zb)return a.zb(a);var c=Gf[t(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Gf._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw E("IEncodeJS.-clj-\x3ejs",a);},Hf=function Hf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Hf.B(arguments[0],1<c.length?new P(c.slice(1),0,null):null)};
Hf.B=function(a,b){var c=null!=b&&(b.h&64||z===b.Xa)?Yd(kf,b):b,d=N.g(c,If,Id),e=function(){return function(a){var b=g;if(null!=a?z===a.yb||(a.Nb?0:D(Ff,a)):D(Ff,a))a=Gf(a);else if("string"===typeof a||"number"===typeof a||a instanceof Y||a instanceof Ic)a=b.b?b.b(a):b.call(null,a);else{a=bd([a]);b=pb();var c;(c=null==a)||(c=O(a),c=null==c?!0:!1===c?!0:!1);a=c?"":F.b(Cf(a,b))}return a}}(b,c,c,d),g=function(a,b,c,d){return function q(a){if(null==a)return null;if(null!=a?z===a.yb||(a.Nb?0:D(Ff,a)):
D(Ff,a))return Gf(a);if(a instanceof Y)return d.b?d.b(a):d.call(null,a);if(a instanceof Ic)return F.b(a);if(od(a)){var b={};a=O(a);for(var c=null,g=0,h=0;;)if(h<g){var k=c.O(null,h),l=X(k,0),m=X(k,1);k=b;l=e(l);m=q(m);k[l]=m;h+=1}else if(a=O(a))rd(a)?(g=nc(a),a=pc(a),c=g,g=U(g)):(c=Q(a),g=X(c,0),h=X(c,1),c=b,g=e(g),h=q(h),c[g]=h,a=R(a),c=null,g=0),h=0;else break;return b}if(null==a?0:null!=a?a.h&8||z===a.Tb||(a.h?0:D(Db,a)):D(Db,a)){b=[];a=O(Z.a(q,a));c=null;for(h=g=0;;)if(h<g)k=c.O(null,h),b.push(k),
h+=1;else if(a=O(a))c=a,rd(c)?(a=nc(c),h=pc(c),c=a,g=U(a),a=h):(a=Q(c),b.push(a),a=R(c),c=null,g=0),h=0;else break;return b}return a}}(b,c,c,d);return g(a)};Hf.R=1;Hf.T=function(a){var b=Q(a);a=R(a);return this.B(b,a)};if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof Jf)var Jf=null;"undefined"!==typeof console&&(kb=function(){return console.log.apply(console,ja(arguments))},lb=function(){return console.error.apply(console,ja(arguments))});
if("undefined"===typeof hb||"undefined"===typeof ib||"undefined"===typeof Kf)var Kf=function(){throw Error("cljs.core/*eval* not bound");};var fe=new Y(null,"text-content","text-content",-2126072735),Lf=new Y(null,"lineWrapping","lineWrapping",1248501985),tb=new Y(null,"meta","meta",1499536964),ub=new Y(null,"dup","dup",556298533),Mf=new Y(null,"value","value",305978217),Nf=new Y(null,"mode","mode",654403691),Ef=new Y(null,"val","val",128701612),Bf=new Y(null,"fallback-impl","fallback-impl",-1501286995),If=new Y(null,"keyword-fn","keyword-fn",-64566675),rb=new Y(null,"flush-on-newline","flush-on-newline",-151457939),sb=new Y(null,"readably",
"readably",1129599760),rf=new Y(null,"more-marker","more-marker",-14717935),be=new Ic(null,"meta20282","meta20282",-642776781,null),wb=new Y(null,"print-length","print-length",1931866356),ge=new Y(null,"editor","editor",-989377770),Af=new Y(null,"alt-impl","alt-impl",670969595),Of=new Y(null,"lineNumbers","lineNumbers",1374890941);hf();var Pf=new ee,Qf=document.querySelector("#modal"),Rf=function(a){var b=0;return function(c){aa.clearTimeout(b);var d=arguments;b=aa.setTimeout(function(){a.apply(void 0,d)},1E3)}}(function(){return window.java.onautosave()});function Sf(){var a=K(Pf);a=null==a?null:ge.b(a);return null==a?null:a.getValue()}function Tf(){ie.A(Pf,gd,fe,Sf());return window.java.onchange()}var Uf=window;Uf.undo=function(){var a=K(Pf);a=null==a?null:ge.b(a);null!=a&&a.undo();return window.java.onautosave()};
Uf.redo=function(){var a=K(Pf);a=null==a?null:ge.b(a);null!=a&&a.redo();return window.java.onautosave()};Uf.canUndo=function(){var a=K(Pf);a=null==a?null:ge.b(a);a=null==a?null:a.historySize();a=null==a?null:a.undo;return null==a?null:0<a};Uf.canRedo=function(){var a=K(Pf);a=null==a?null:ge.b(a);a=null==a?null:a.historySize();a=null==a?null:a.redo;return null==a?null:0<a};Uf.setTextContent=function(a){return Qa(document.querySelector("#content"),a)};Uf.getTextContent=Sf;Uf.getSavedText=function(){return fe.b(K(Pf))};
Uf.getSelectedText=function(){return null};Uf.markClean=Tf;Uf.isClean=function(){var a=K(Pf);a=null==a?null:fe.b(a);return null==a?null:S.a(a,Sf())};Uf.changeTheme=function(a){var b=K(Pf);b=null==b?null:ge.b(b);return null==b?null:b.setOption("theme",A(a)?"lesser-dark":"default")};Uf.setTextSize=function(a){return document.querySelector(".CodeMirror").style.fontSize=[F.b(a),"px"].join("")};Uf.openModal=function(){return Qf.style.display="block"};
Uf.init=function(a){var b=document.querySelector("#content");ie.A(Pf,je,ge,function(b){return function(c){A(c)&&document.body.removeChild(c.getWrapperElement());c=window.CodeMirror(document.body,Hf(new qb(null,4,[Mf,b.textContent,Of,!0,Nf,hf().b?hf().b(a):hf().call(null,a),Lf,vd(new of(null,new qb(null,2,["md",null,"txt",null],null),null),a)],null)));c.on("change",function(){return function(){Rf.D?Rf.D():Rf.call(null);return window.java.onchange()}}(c,b));c.on("beforeChange",function(){return function(a,
b){return S.a(Qf.style.display,"block")?b.cancel():null}}(c,b));c.setOption("extraKeys",Hf(new qb(null,4,["Ctrl-Z",!1,"Cmd-Z",!1,"Shift-Ctrl-Z",!1,"Shift-Cmd-Z",!1],null)));return c}}(b));Qa(b,"");return Tf()};window.onload=function(){window.status="MY-MAGIC-VALUE";window.status="";window.java.onload();return window.java.onchange()};