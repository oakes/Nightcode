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

(function(q){if("object"==typeof exports&&"object"==typeof module)module.exports=q();else{if("function"==typeof define&&define.amd)return define([],q);(this||window).CodeMirror=q()}})(function(){function q(a,b){if(!(this instanceof q))return new q(a,b);this.options=b=b?X(b):{};X(wf,b,!1);wc(b);var c=b.value;"string"==typeof c&&(c=new Q(c,b.mode,null,b.lineSeparator));this.doc=c;var d=new q.inputStyles[b.inputStyle](this),d=this.display=new xf(a,c,d);d.wrapper.CodeMirror=this;zd(this);Ad(this);b.lineWrapping&&
(this.display.wrapper.className+=" CodeMirror-wrap");b.autofocus&&!ab&&d.input.focus();Bd(this);this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,delayingBlurEvent:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,selectingText:!1,draggingText:!1,highlight:new ua,keySeq:null,specialChars:null};var e=this;A&&11>B&&setTimeout(function(){e.display.input.reset(!0)},20);yf(this);Cd||(zf(),Cd=!0);Ja(this);this.curOp.forceUpdate=!0;Dd(this,c);b.autofocus&&!ab||e.hasFocus()?setTimeout(xc(yc,
this),20):bb(this);for(var f in Ka)if(Ka.hasOwnProperty(f))Ka[f](this,b[f],Ed);Fd(this);b.finishInit&&b.finishInit(this);for(c=0;c<zc.length;++c)zc[c](this);La(this);K&&b.lineWrapping&&"optimizelegibility"==getComputedStyle(d.lineDiv).textRendering&&(d.lineDiv.style.textRendering="auto")}function xf(a,b,c){this.input=c;this.scrollbarFiller=s("div",null,"CodeMirror-scrollbar-filler");this.scrollbarFiller.setAttribute("cm-not-content","true");this.gutterFiller=s("div",null,"CodeMirror-gutter-filler");
this.gutterFiller.setAttribute("cm-not-content","true");this.lineDiv=s("div",null,"CodeMirror-code");this.selectionDiv=s("div",null,null,"position: relative; z-index: 1");this.cursorDiv=s("div",null,"CodeMirror-cursors");this.measure=s("div",null,"CodeMirror-measure");this.lineMeasure=s("div",null,"CodeMirror-measure");this.lineSpace=s("div",[this.measure,this.lineMeasure,this.selectionDiv,this.cursorDiv,this.lineDiv],null,"position: relative; outline: none");this.mover=s("div",[s("div",[this.lineSpace],
"CodeMirror-lines")],null,"position: relative");this.sizer=s("div",[this.mover],"CodeMirror-sizer");this.sizerWidth=null;this.heightForcer=s("div",null,null,"position: absolute; height: "+Gd+"px; width: 1px;");this.gutters=s("div",null,"CodeMirror-gutters");this.lineGutter=null;this.scroller=s("div",[this.sizer,this.heightForcer,this.gutters],"CodeMirror-scroll");this.scroller.setAttribute("tabIndex","-1");this.wrapper=s("div",[this.scrollbarFiller,this.gutterFiller,this.scroller],"CodeMirror");A&&
8>B&&(this.gutters.style.zIndex=-1,this.scroller.style.paddingRight=0);K||oa&&ab||(this.scroller.draggable=!0);a&&(a.appendChild?a.appendChild(this.wrapper):a(this.wrapper));this.reportedViewFrom=this.reportedViewTo=this.viewFrom=this.viewTo=b.first;this.view=[];this.externalMeasured=this.renderedView=null;this.lastWrapHeight=this.lastWrapWidth=this.viewOffset=0;this.updateLineNumbers=null;this.nativeBarWidth=this.barHeight=this.barWidth=0;this.scrollbarsClipped=!1;this.lineNumWidth=this.lineNumInnerWidth=
this.lineNumChars=null;this.alignWidgets=!1;this.maxLine=this.cachedCharWidth=this.cachedTextHeight=this.cachedPaddingH=null;this.maxLineLength=0;this.maxLineChanged=!1;this.wheelDX=this.wheelDY=this.wheelStartX=this.wheelStartY=null;this.shift=!1;this.activeTouch=this.selForContextMenu=null;c.init(this)}function Ac(a){a.doc.mode=q.getMode(a.options,a.doc.modeOption);cb(a)}function cb(a){a.doc.iter(function(a){a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null)});a.doc.frontier=a.doc.first;
db(a,100);a.state.modeGen++;a.curOp&&M(a)}function Hd(a){var b=va(a.display),c=a.options.lineWrapping,d=c&&Math.max(5,a.display.scroller.clientWidth/eb(a.display)-3);return function(e){if(wa(a.doc,e))return 0;var f=0;if(e.widgets)for(var g=0;g<e.widgets.length;g++)e.widgets[g].height&&(f+=e.widgets[g].height);return c?f+(Math.ceil(e.text.length/d)||1)*b:f+b}}function Bc(a){var b=a.doc,c=Hd(a);b.iter(function(a){var b=c(a);b!=a.height&&ca(a,b)})}function Ad(a){a.display.wrapper.className=a.display.wrapper.className.replace(/\s*cm-s-\S+/g,
"")+a.options.theme.replace(/(^|\s)\s*/g," cm-s-");fb(a)}function gb(a){zd(a);M(a);setTimeout(function(){Cc(a)},20)}function zd(a){var b=a.display.gutters,c=a.options.gutters;pa(b);for(var d=0;d<c.length;++d){var e=c[d],f=b.appendChild(s("div",null,"CodeMirror-gutter "+e));"CodeMirror-linenumbers"==e&&(a.display.lineGutter=f,f.style.width=(a.display.lineNumWidth||1)+"px")}b.style.display=d?"":"none";Dc(a)}function Dc(a){a.display.sizer.style.marginLeft=a.display.gutters.offsetWidth+"px"}function Ib(a){if(0==
a.height)return 0;for(var b=a.text.length,c,d=a;c=xa(d,!0);)c=c.find(0,!0),d=c.from.line,b+=c.from.ch-c.to.ch;for(d=a;c=xa(d,!1);)c=c.find(0,!0),b-=d.text.length-c.from.ch,d=c.to.line,b+=d.text.length-c.to.ch;return b}function Ec(a){var b=a.display;a=a.doc;b.maxLine=t(a,a.first);b.maxLineLength=Ib(b.maxLine);b.maxLineChanged=!0;a.iter(function(a){var d=Ib(a);d>b.maxLineLength&&(b.maxLineLength=d,b.maxLine=a)})}function wc(a){var b=D(a.gutters,"CodeMirror-linenumbers");-1==b&&a.lineNumbers?a.gutters=
a.gutters.concat(["CodeMirror-linenumbers"]):-1<b&&!a.lineNumbers&&(a.gutters=a.gutters.slice(0),a.gutters.splice(b,1))}function hb(a){var b=a.display,c=b.gutters.offsetWidth,d=Math.round(a.doc.height+Fc(a.display));return{clientHeight:b.scroller.clientHeight,viewHeight:b.wrapper.clientHeight,scrollWidth:b.scroller.scrollWidth,clientWidth:b.scroller.clientWidth,viewWidth:b.wrapper.clientWidth,barLeft:a.options.fixedGutter?c:0,docHeight:d,scrollHeight:d+da(a)+b.barHeight,nativeBarWidth:b.nativeBarWidth,
gutterWidth:c}}function Gc(a,b,c){this.cm=c;var d=this.vert=s("div",[s("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar"),e=this.horiz=s("div",[s("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");a(d);a(e);v(d,"scroll",function(){d.clientHeight&&b(d.scrollTop,"vertical")});v(e,"scroll",function(){e.clientWidth&&b(e.scrollLeft,"horizontal")});this.checkedZeroWidth=!1;A&&8>B&&(this.horiz.style.minHeight=this.vert.style.minWidth="18px")}function Hc(){}function Bd(a){a.display.scrollbars&&
(a.display.scrollbars.clear(),a.display.scrollbars.addClass&&ib(a.display.wrapper,a.display.scrollbars.addClass));a.display.scrollbars=new q.scrollbarModel[a.options.scrollbarStyle](function(b){a.display.wrapper.insertBefore(b,a.display.scrollbarFiller);v(b,"mousedown",function(){a.state.focused&&setTimeout(function(){a.display.input.focus()},0)});b.setAttribute("cm-not-content","true")},function(b,c){"horizontal"==c?Ma(a,b):jb(a,b)},a);a.display.scrollbars.addClass&&kb(a.display.wrapper,a.display.scrollbars.addClass)}
function Na(a,b){b||(b=hb(a));var c=a.display.barWidth,d=a.display.barHeight;Id(a,b);for(var e=0;4>e&&c!=a.display.barWidth||d!=a.display.barHeight;e++)c!=a.display.barWidth&&a.options.lineWrapping&&Jb(a),Id(a,hb(a)),c=a.display.barWidth,d=a.display.barHeight}function Id(a,b){var c=a.display,d=c.scrollbars.update(b);c.sizer.style.paddingRight=(c.barWidth=d.right)+"px";c.sizer.style.paddingBottom=(c.barHeight=d.bottom)+"px";c.heightForcer.style.borderBottom=d.bottom+"px solid transparent";d.right&&
d.bottom?(c.scrollbarFiller.style.display="block",c.scrollbarFiller.style.height=d.bottom+"px",c.scrollbarFiller.style.width=d.right+"px"):c.scrollbarFiller.style.display="";d.bottom&&a.options.coverGutterNextToScrollbar&&a.options.fixedGutter?(c.gutterFiller.style.display="block",c.gutterFiller.style.height=d.bottom+"px",c.gutterFiller.style.width=b.gutterWidth+"px"):c.gutterFiller.style.display=""}function Ic(a,b,c){var d=c&&null!=c.top?Math.max(0,c.top):a.scroller.scrollTop,d=Math.floor(d-a.lineSpace.offsetTop),
e=c&&null!=c.bottom?c.bottom:d+a.wrapper.clientHeight,d=ya(b,d),e=ya(b,e);if(c&&c.ensure){var f=c.ensure.from.line;c=c.ensure.to.line;f<d?(d=f,e=ya(b,ea(t(b,f))+a.wrapper.clientHeight)):Math.min(c,b.lastLine())>=e&&(d=ya(b,ea(t(b,c))-a.wrapper.clientHeight),e=c)}return{from:d,to:Math.max(e,d+1)}}function Cc(a){var b=a.display,c=b.view;if(b.alignWidgets||b.gutters.firstChild&&a.options.fixedGutter){for(var d=Jc(b)-b.scroller.scrollLeft+a.doc.scrollLeft,e=b.gutters.offsetWidth,f=d+"px",g=0;g<c.length;g++)if(!c[g].hidden){a.options.fixedGutter&&
(c[g].gutter&&(c[g].gutter.style.left=f),c[g].gutterBackground&&(c[g].gutterBackground.style.left=f));var h=c[g].alignable;if(h)for(var k=0;k<h.length;k++)h[k].style.left=f}a.options.fixedGutter&&(b.gutters.style.left=d+e+"px")}}function Fd(a){if(!a.options.lineNumbers)return!1;var b=a.doc,b=Kc(a.options,b.first+b.size-1),c=a.display;if(b.length!=c.lineNumChars){var d=c.measure.appendChild(s("div",[s("div",b)],"CodeMirror-linenumber CodeMirror-gutter-elt")),e=d.firstChild.offsetWidth,d=d.offsetWidth-
e;c.lineGutter.style.width="";c.lineNumInnerWidth=Math.max(e,c.lineGutter.offsetWidth-d)+1;c.lineNumWidth=c.lineNumInnerWidth+d;c.lineNumChars=c.lineNumInnerWidth?b.length:-1;c.lineGutter.style.width=c.lineNumWidth+"px";Dc(a);return!0}return!1}function Kc(a,b){return String(a.lineNumberFormatter(b+a.firstLineNumber))}function Jc(a){return a.scroller.getBoundingClientRect().left-a.sizer.getBoundingClientRect().left}function Kb(a,b,c){var d=a.display;this.viewport=b;this.visible=Ic(d,a.doc,b);this.editorIsHidden=
!d.wrapper.offsetWidth;this.wrapperHeight=d.wrapper.clientHeight;this.wrapperWidth=d.wrapper.clientWidth;this.oldDisplayWidth=za(a);this.force=c;this.dims=Lc(a);this.events=[]}function Mc(a,b){var c=a.display,d=a.doc;if(b.editorIsHidden)return qa(a),!1;if(!b.force&&b.visible.from>=c.viewFrom&&b.visible.to<=c.viewTo&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo)&&c.renderedView==c.view&&0==Jd(a))return!1;Fd(a)&&(qa(a),b.dims=Lc(a));var e=d.first+d.size,f=Math.max(b.visible.from-a.options.viewportMargin,
d.first),g=Math.min(e,b.visible.to+a.options.viewportMargin);c.viewFrom<f&&20>f-c.viewFrom&&(f=Math.max(d.first,c.viewFrom));c.viewTo>g&&20>c.viewTo-g&&(g=Math.min(e,c.viewTo));ra&&(f=Nc(a.doc,f),g=Kd(a.doc,g));d=f!=c.viewFrom||g!=c.viewTo||c.lastWrapHeight!=b.wrapperHeight||c.lastWrapWidth!=b.wrapperWidth;e=a.display;0==e.view.length||f>=e.viewTo||g<=e.viewFrom?(e.view=Lb(a,f,g),e.viewFrom=f):(e.viewFrom>f?e.view=Lb(a,f,e.viewFrom).concat(e.view):e.viewFrom<f&&(e.view=e.view.slice(Aa(a,f))),e.viewFrom=
f,e.viewTo<g?e.view=e.view.concat(Lb(a,e.viewTo,g)):e.viewTo>g&&(e.view=e.view.slice(0,Aa(a,g))));e.viewTo=g;c.viewOffset=ea(t(a.doc,c.viewFrom));a.display.mover.style.top=c.viewOffset+"px";g=Jd(a);if(!d&&0==g&&!b.force&&c.renderedView==c.view&&(null==c.updateLineNumbers||c.updateLineNumbers>=c.viewTo))return!1;f=fa();4<g&&(c.lineDiv.style.display="none");Af(a,c.updateLineNumbers,b.dims);4<g&&(c.lineDiv.style.display="");c.renderedView=c.view;f&&fa()!=f&&f.offsetHeight&&f.focus();pa(c.cursorDiv);
pa(c.selectionDiv);c.gutters.style.height=c.sizer.style.minHeight=0;d&&(c.lastWrapHeight=b.wrapperHeight,c.lastWrapWidth=b.wrapperWidth,db(a,400));c.updateLineNumbers=null;return!0}function Ld(a,b){for(var c=b.viewport,d=!0;;d=!1){if(!d||!a.options.lineWrapping||b.oldDisplayWidth==za(a))if(c&&null!=c.top&&(c={top:Math.min(a.doc.height+Fc(a.display)-Oc(a),c.top)}),b.visible=Ic(a.display,a.doc,c),b.visible.from>=a.display.viewFrom&&b.visible.to<=a.display.viewTo)break;if(!Mc(a,b))break;Jb(a);d=hb(a);
lb(a);Na(a,d);Pc(a,d)}b.signal(a,"update",a);if(a.display.viewFrom!=a.display.reportedViewFrom||a.display.viewTo!=a.display.reportedViewTo)b.signal(a,"viewportChange",a,a.display.viewFrom,a.display.viewTo),a.display.reportedViewFrom=a.display.viewFrom,a.display.reportedViewTo=a.display.viewTo}function Qc(a,b){var c=new Kb(a,b);if(Mc(a,c)){Jb(a);Ld(a,c);var d=hb(a);lb(a);Na(a,d);Pc(a,d);c.finish()}}function Pc(a,b){a.display.sizer.style.minHeight=b.docHeight+"px";a.display.heightForcer.style.top=b.docHeight+
"px";a.display.gutters.style.height=b.docHeight+a.display.barHeight+da(a)+"px"}function Jb(a){a=a.display;for(var b=a.lineDiv.offsetTop,c=0;c<a.view.length;c++){var d=a.view[c],e;if(!d.hidden){if(A&&8>B){var f=d.node.offsetTop+d.node.offsetHeight;e=f-b;b=f}else e=d.node.getBoundingClientRect(),e=e.bottom-e.top;f=d.line.height-e;2>e&&(e=va(a));if(.001<f||-.001>f)if(ca(d.line,e),Md(d.line),d.rest)for(e=0;e<d.rest.length;e++)Md(d.rest[e])}}}function Md(a){if(a.widgets)for(var b=0;b<a.widgets.length;++b)a.widgets[b].height=
a.widgets[b].node.parentNode.offsetHeight}function Lc(a){for(var b=a.display,c={},d={},e=b.gutters.clientLeft,f=b.gutters.firstChild,g=0;f;f=f.nextSibling,++g)c[a.options.gutters[g]]=f.offsetLeft+f.clientLeft+e,d[a.options.gutters[g]]=f.clientWidth;return{fixedPos:Jc(b),gutterTotalWidth:b.gutters.offsetWidth,gutterLeft:c,gutterWidth:d,wrapperWidth:b.wrapper.clientWidth}}function Af(a,b,c){function d(b){var c=b.nextSibling;K&&Y&&a.display.currentWheelTarget==b?b.style.display="none":b.parentNode.removeChild(b);
return c}for(var e=a.display,f=a.options.lineNumbers,g=e.lineDiv,h=g.firstChild,k=e.view,e=e.viewFrom,l=0;l<k.length;l++){var m=k[l];if(!m.hidden)if(m.node&&m.node.parentNode==g){for(;h!=m.node;)h=d(h);h=f&&null!=b&&b<=e&&m.lineNumber;m.changes&&(-1<D(m.changes,"gutter")&&(h=!1),Nd(a,m,e,c));h&&(pa(m.lineNumber),m.lineNumber.appendChild(document.createTextNode(Kc(a.options,e))));h=m.node.nextSibling}else{var p=Bf(a,m,e,c);g.insertBefore(p,h)}e+=m.size}for(;h;)h=d(h)}function Nd(a,b,c,d){for(var e=
0;e<b.changes.length;e++){var f=b.changes[e];if("text"==f){var f=b,g=f.text.className,h=Od(a,f);f.text==f.node&&(f.node=h.pre);f.text.parentNode.replaceChild(h.pre,f.text);f.text=h.pre;h.bgClass!=f.bgClass||h.textClass!=f.textClass?(f.bgClass=h.bgClass,f.textClass=h.textClass,Rc(f)):g&&(f.text.className=g)}else if("gutter"==f)Pd(a,b,c,d);else if("class"==f)Rc(b);else if("widget"==f){f=a;g=b;h=d;g.alignable&&(g.alignable=null);for(var k=g.node.firstChild,l=void 0;k;k=l)l=k.nextSibling,"CodeMirror-linewidget"==
k.className&&g.node.removeChild(k);Qd(f,g,h)}}b.changes=null}function mb(a){a.node==a.text&&(a.node=s("div",null,null,"position: relative"),a.text.parentNode&&a.text.parentNode.replaceChild(a.node,a.text),a.node.appendChild(a.text),A&&8>B&&(a.node.style.zIndex=2));return a.node}function Od(a,b){var c=a.display.externalMeasured;return c&&c.line==b.line?(a.display.externalMeasured=null,b.measure=c.measure,c.built):Rd(a,b)}function Rc(a){var b=a.bgClass?a.bgClass+" "+(a.line.bgClass||""):a.line.bgClass;
b&&(b+=" CodeMirror-linebackground");if(a.background)b?a.background.className=b:(a.background.parentNode.removeChild(a.background),a.background=null);else if(b){var c=mb(a);a.background=c.insertBefore(s("div",null,b),c.firstChild)}a.line.wrapClass?mb(a).className=a.line.wrapClass:a.node!=a.text&&(a.node.className="");a.text.className=(a.textClass?a.textClass+" "+(a.line.textClass||""):a.line.textClass)||""}function Pd(a,b,c,d){b.gutter&&(b.node.removeChild(b.gutter),b.gutter=null);b.gutterBackground&&
(b.node.removeChild(b.gutterBackground),b.gutterBackground=null);if(b.line.gutterClass){var e=mb(b);b.gutterBackground=s("div",null,"CodeMirror-gutter-background "+b.line.gutterClass,"left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+"px; width: "+d.gutterTotalWidth+"px");e.insertBefore(b.gutterBackground,b.text)}var f=b.line.gutterMarkers;if(a.options.lineNumbers||f){var e=mb(b),g=b.gutter=s("div",null,"CodeMirror-gutter-wrapper","left: "+(a.options.fixedGutter?d.fixedPos:-d.gutterTotalWidth)+
"px");a.display.input.setUneditable(g);e.insertBefore(g,b.text);b.line.gutterClass&&(g.className+=" "+b.line.gutterClass);!a.options.lineNumbers||f&&f["CodeMirror-linenumbers"]||(b.lineNumber=g.appendChild(s("div",Kc(a.options,c),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+d.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+a.display.lineNumInnerWidth+"px")));if(f)for(b=0;b<a.options.gutters.length;++b)c=a.options.gutters[b],(e=f.hasOwnProperty(c)&&f[c])&&g.appendChild(s("div",[e],"CodeMirror-gutter-elt",
"left: "+d.gutterLeft[c]+"px; width: "+d.gutterWidth[c]+"px"))}}function Bf(a,b,c,d){var e=Od(a,b);b.text=b.node=e.pre;e.bgClass&&(b.bgClass=e.bgClass);e.textClass&&(b.textClass=e.textClass);Rc(b);Pd(a,b,c,d);Qd(a,b,d);return b.node}function Qd(a,b,c){Sd(a,b.line,b,c,!0);if(b.rest)for(var d=0;d<b.rest.length;d++)Sd(a,b.rest[d],b,c,!1)}function Sd(a,b,c,d,e){if(b.widgets){var f=mb(c),g=0;for(b=b.widgets;g<b.length;++g){var h=b[g],k=s("div",[h.node],"CodeMirror-linewidget");h.handleMouseEvents||k.setAttribute("cm-ignore-events",
"true");var l=h,m=k,p=d;if(l.noHScroll){(c.alignable||(c.alignable=[])).push(m);var n=p.wrapperWidth;m.style.left=p.fixedPos+"px";l.coverGutter||(n-=p.gutterTotalWidth,m.style.paddingLeft=p.gutterTotalWidth+"px");m.style.width=n+"px"}l.coverGutter&&(m.style.zIndex=5,m.style.position="relative",l.noHScroll||(m.style.marginLeft=-p.gutterTotalWidth+"px"));a.display.input.setUneditable(k);e&&h.above?f.insertBefore(k,c.gutter||c.text):f.appendChild(k);R(h,"redraw")}}}function Sc(a){return r(a.line,a.ch)}
function Mb(a,b){return 0>w(a,b)?b:a}function Nb(a,b){return 0>w(a,b)?a:b}function Td(a){a.state.focused||(a.display.input.focus(),yc(a))}function Ob(a,b,c,d,e){var f=a.doc;a.display.shift=!1;d||(d=f.sel);var g=a.state.pasteIncoming||"paste"==e,h=f.splitLines(b),k=null;if(g&&1<d.ranges.length)if(P&&P.text.join("\n")==b){if(0==d.ranges.length%P.text.length)for(var k=[],l=0;l<P.text.length;l++)k.push(f.splitLines(P.text[l]))}else h.length==d.ranges.length&&(k=Pb(h,function(a){return[a]}));for(l=d.ranges.length-
1;0<=l;l--){var m=d.ranges[l],p=m.from(),n=m.to();m.empty()&&(c&&0<c?p=r(p.line,p.ch-c):a.state.overwrite&&!g?n=r(n.line,Math.min(t(f,n.line).text.length,n.ch+z(h).length)):P&&P.lineWise&&P.text.join("\n")==b&&(p=n=r(p.line,0)));m=a.curOp.updateInput;p={from:p,to:n,text:k?k[l%k.length]:h,origin:e||(g?"paste":a.state.cutIncoming?"cut":"+input")};Oa(a.doc,p);R(a,"inputRead",a,p)}b&&!g&&Ud(a,b);Pa(a);a.curOp.updateInput=m;a.curOp.typing=!0;a.state.pasteIncoming=a.state.cutIncoming=!1}function Vd(a,b){var c=
a.clipboardData&&a.clipboardData.getData("Text");if(c)return a.preventDefault(),b.isReadOnly()||b.options.disableInput||T(b,function(){Ob(b,c,0,null,"paste")}),!0}function Ud(a,b){if(a.options.electricChars&&a.options.smartIndent)for(var c=a.doc.sel,d=c.ranges.length-1;0<=d;d--){var e=c.ranges[d];if(!(100<e.head.ch||d&&c.ranges[d-1].head.line==e.head.line)){var f=a.getModeAt(e.head),g=!1;if(f.electricChars)for(var h=0;h<f.electricChars.length;h++){if(-1<b.indexOf(f.electricChars.charAt(h))){g=nb(a,
e.head.line,"smart");break}}else f.electricInput&&f.electricInput.test(t(a.doc,e.head.line).text.slice(0,e.head.ch))&&(g=nb(a,e.head.line,"smart"));g&&R(a,"electricInput",a,e.head.line)}}}function Wd(a){for(var b=[],c=[],d=0;d<a.doc.sel.ranges.length;d++){var e=a.doc.sel.ranges[d].head.line,e={anchor:r(e,0),head:r(e+1,0)};c.push(e);b.push(a.getRange(e.anchor,e.head))}return{text:b,ranges:c}}function Xd(a,b){a.setAttribute("autocorrect","off");a.setAttribute("autocapitalize","off");a.setAttribute("spellcheck",
!!b)}function Tc(a){this.cm=a;this.prevInput="";this.pollingFast=!1;this.polling=new ua;this.hasSelection=this.inaccurateSelection=!1;this.composing=null}function Yd(){var a=s("textarea",null,null,"position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none"),b=s("div",[a],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");K?a.style.width="1000px":a.setAttribute("wrap","off");ob&&(a.style.border="1px solid black");Xd(a);return b}function Uc(a){this.cm=
a;this.lastAnchorNode=this.lastAnchorOffset=this.lastFocusNode=this.lastFocusOffset=null;this.polling=new ua;this.gracePeriod=!1}function Zd(a,b){var c=Vc(a,b.line);if(!c||c.hidden)return null;var d=t(a.doc,b.line),c=$d(c,d,b.line),d=Z(d),e="left";d&&(e=Qb(d,b.ch)%2?"right":"left");c=ae(c.map,b.ch,e);c.offset="right"==c.collapse?c.end:c.start;return c}function Qa(a,b){b&&(a.bad=!0);return a}function Rb(a,b,c){var d;if(b==a.display.lineDiv){d=a.display.lineDiv.childNodes[c];if(!d)return Qa(a.clipPos(r(a.display.viewTo-
1)),!0);b=null;c=0}else for(d=b;;d=d.parentNode){if(!d||d==a.display.lineDiv)return null;if(d.parentNode&&d.parentNode==a.display.lineDiv)break}for(var e=0;e<a.display.view.length;e++){var f=a.display.view[e];if(f.node==d)return Cf(f,b,c)}}function Cf(a,b,c){function d(b,c,d){for(var e=-1;e<(l?l.length:0);e++)for(var f=0>e?k.map:l[e],g=0;g<f.length;g+=3){var h=f[g+2];if(h==b||h==c){c=F(0>e?a.line:a.rest[e]);e=f[g]+d;if(0>d||h!=b)e=f[g+(d?1:0)];return r(c,e)}}}var e=a.text.firstChild,f=!1;if(!b||!Wc(e,
b))return Qa(r(F(a.line),0),!0);if(b==e&&(f=!0,b=e.childNodes[c],c=0,!b))return c=a.rest?z(a.rest):a.line,Qa(r(F(c),c.text.length),f);var g=3==b.nodeType?b:null,h=b;g||1!=b.childNodes.length||3!=b.firstChild.nodeType||(g=b.firstChild,c&&(c=g.nodeValue.length));for(;h.parentNode!=e;)h=h.parentNode;var k=a.measure,l=k.maps;if(b=d(g,h,c))return Qa(b,f);e=h.nextSibling;for(g=g?g.nodeValue.length-c:0;e;e=e.nextSibling){if(b=d(e,e.firstChild,0))return Qa(r(b.line,b.ch-g),f);g+=e.textContent.length}h=h.previousSibling;
for(g=c;h;h=h.previousSibling){if(b=d(h,h.firstChild,-1))return Qa(r(b.line,b.ch+g),f);g+=h.textContent.length}}function Df(a,b,c,d,e){function f(a){return function(b){return b.id==a}}function g(b){if(1==b.nodeType){var c=b.getAttribute("cm-text");if(null!=c)""==c&&(c=b.textContent.replace(/\u200b/g,"")),h+=c;else{var c=b.getAttribute("cm-marker"),n;if(c)b=a.findMarks(r(d,0),r(e+1,0),f(+c)),b.length&&(n=b[0].find())&&(h+=Ba(a.doc,n.from,n.to).join(l));else if("false"!=b.getAttribute("contenteditable")){for(n=
0;n<b.childNodes.length;n++)g(b.childNodes[n]);/^(pre|div|p)$/i.test(b.nodeName)&&(k=!0)}}}else 3==b.nodeType&&(b=b.nodeValue)&&(k&&(h+=l,k=!1),h+=b)}for(var h="",k=!1,l=a.doc.lineSeparator();;){g(b);if(b==c)break;b=b.nextSibling}return h}function ka(a,b){this.ranges=a;this.primIndex=b}function y(a,b){this.anchor=a;this.head=b}function $(a,b){var c=a[b];a.sort(function(a,b){return w(a.from(),b.from())});b=D(a,c);for(c=1;c<a.length;c++){var d=a[c],e=a[c-1];if(0<=w(e.to(),d.from())){var f=Nb(e.from(),
d.from()),g=Mb(e.to(),d.to()),d=e.empty()?d.from()==d.head:e.from()==e.head;c<=b&&--b;a.splice(--c,2,new y(d?g:f,d?f:g))}}return new ka(a,b)}function ga(a,b){return new ka([new y(a,b||a)],0)}function x(a,b){if(b.line<a.first)return r(a.first,0);var c=a.first+a.size-1;if(b.line>c)return r(c,t(a,c).text.length);var c=t(a,b.line).text.length,d=b.ch,c=null==d||d>c?r(b.line,c):0>d?r(b.line,0):b;return c}function pb(a,b){return b>=a.first&&b<a.first+a.size}function be(a,b){for(var c=[],d=0;d<b.length;d++)c[d]=
x(a,b[d]);return c}function qb(a,b,c,d){return a.cm&&a.cm.display.shift||a.extend?(a=b.anchor,d&&(b=0>w(c,a),b!=0>w(d,a)?(a=c,c=d):b!=0>w(c,d)&&(c=d)),new y(a,c)):new y(d||c,c)}function Sb(a,b,c,d){C(a,new ka([qb(a,a.sel.primary(),b,c)],0),d)}function ce(a,b,c){for(var d=[],e=0;e<a.sel.ranges.length;e++)d[e]=qb(a,a.sel.ranges[e],b[e],null);b=$(d,a.sel.primIndex);C(a,b,c)}function Xc(a,b,c,d){var e=a.sel.ranges.slice(0);e[b]=c;C(a,$(e,a.sel.primIndex),d)}function Ef(a,b,c){c={ranges:b.ranges,update:function(b){this.ranges=
[];for(var c=0;c<b.length;c++)this.ranges[c]=new y(x(a,b[c].anchor),x(a,b[c].head))},origin:c&&c.origin};J(a,"beforeSelectionChange",a,c);a.cm&&J(a.cm,"beforeSelectionChange",a.cm,c);return c.ranges!=b.ranges?$(c.ranges,c.ranges.length-1):b}function de(a,b,c){var d=a.history.done,e=z(d);e&&e.ranges?(d[d.length-1]=b,Tb(a,b,c)):C(a,b,c)}function C(a,b,c){Tb(a,b,c);b=a.sel;var d=a.cm?a.cm.curOp.id:NaN,e=a.history,f=c&&c.origin,g;if(!(g=d==e.lastSelOp)&&(g=f&&e.lastSelOrigin==f)&&!(g=e.lastModTime==e.lastSelTime&&
e.lastOrigin==f)){g=z(e.done);var h=f.charAt(0);g="*"==h||"+"==h&&g.ranges.length==b.ranges.length&&g.somethingSelected()==b.somethingSelected()&&new Date-a.history.lastSelTime<=(a.cm?a.cm.options.historyEventDelay:500)}g?e.done[e.done.length-1]=b:Ub(b,e.done);e.lastSelTime=+new Date;e.lastSelOrigin=f;e.lastSelOp=d;c&&!1!==c.clearRedo&&ee(e.undone)}function Tb(a,b,c){if(W(a,"beforeSelectionChange")||a.cm&&W(a.cm,"beforeSelectionChange"))b=Ef(a,b,c);var d=c&&c.bias||(0>w(b.primary().head,a.sel.primary().head)?
-1:1);fe(a,ge(a,b,d,!0));c&&!1===c.scroll||!a.cm||Pa(a.cm)}function fe(a,b){b.equals(a.sel)||(a.sel=b,a.cm&&(a.cm.curOp.updateInput=a.cm.curOp.selectionChanged=!0,he(a.cm)),R(a,"cursorActivity",a))}function ie(a){fe(a,ge(a,a.sel,null,!1),ha)}function ge(a,b,c,d){for(var e,f=0;f<b.ranges.length;f++){var g=b.ranges[f],h=b.ranges.length==a.sel.ranges.length&&a.sel.ranges[f],k=Yc(a,g.anchor,h&&h.anchor,c,d),h=Yc(a,g.head,h&&h.head,c,d);if(e||k!=g.anchor||h!=g.head)e||(e=b.ranges.slice(0,f)),e[f]=new y(k,
h)}return e?$(e,b.primIndex):b}function Ra(a,b,c,d,e){var f=t(a,b.line);if(f.markedSpans)for(var g=0;g<f.markedSpans.length;++g){var h=f.markedSpans[g],k=h.marker;if((null==h.from||(k.inclusiveLeft?h.from<=b.ch:h.from<b.ch))&&(null==h.to||(k.inclusiveRight?h.to>=b.ch:h.to>b.ch))){if(e&&(J(k,"beforeCursorEnter"),k.explicitlyCleared))if(f.markedSpans){--g;continue}else break;if(k.atomic){if(c){var g=k.find(0>d?1:-1),l;if(0>d?k.inclusiveRight:k.inclusiveLeft)g=je(a,g,-d,g&&g.line==b.line?f:null);if(g&&
g.line==b.line&&(l=w(g,c))&&(0>d?0>l:0<l))return Ra(a,g,b,d,e)}c=k.find(0>d?-1:1);if(0>d?k.inclusiveLeft:k.inclusiveRight)c=je(a,c,d,c.line==b.line?f:null);return c?Ra(a,c,b,d,e):null}}}return b}function Yc(a,b,c,d,e){d=d||1;b=Ra(a,b,c,d,e)||!e&&Ra(a,b,c,d,!0)||Ra(a,b,c,-d,e)||!e&&Ra(a,b,c,-d,!0);return b?b:(a.cantEdit=!0,r(a.first,0))}function je(a,b,c,d){return 0>c&&0==b.ch?b.line>a.first?x(a,r(b.line-1)):null:0<c&&b.ch==(d||t(a,b.line)).text.length?b.line<a.first+a.size-1?r(b.line+1,0):null:new r(b.line,
b.ch+c)}function lb(a){a.display.input.showSelection(a.display.input.prepareSelection())}function ke(a,b){for(var c=a.doc,d={},e=d.cursors=document.createDocumentFragment(),f=d.selection=document.createDocumentFragment(),g=0;g<c.sel.ranges.length;g++)if(!1!==b||g!=c.sel.primIndex){var h=c.sel.ranges[g];if(!(h.from().line>=a.display.viewTo||h.to().line<a.display.viewFrom)){var k=h.empty();(k||a.options.showCursorWhenSelecting)&&le(a,h.head,e);k||Ff(a,h,f)}}return d}function le(a,b,c){b=la(a,b,"div",
null,null,!a.options.singleCursorHeightPerLine);var d=c.appendChild(s("div"," ","CodeMirror-cursor"));d.style.left=b.left+"px";d.style.top=b.top+"px";d.style.height=Math.max(0,b.bottom-b.top)*a.options.cursorHeight+"px";b.other&&(a=c.appendChild(s("div"," ","CodeMirror-cursor CodeMirror-secondarycursor")),a.style.display="",a.style.left=b.other.left+"px",a.style.top=b.other.top+"px",a.style.height=.85*(b.other.bottom-b.other.top)+"px")}function Ff(a,b,c){function d(a,b,c,d){0>b&&(b=0);b=Math.round(b);
d=Math.round(d);h.appendChild(s("div",null,"CodeMirror-selected","position: absolute; left: "+a+"px; top: "+b+"px; width: "+(null==c?m-a:c)+"px; height: "+(d-b)+"px"))}function e(b,c,e){var f=t(g,b),h=f.text.length,k,p;Gf(Z(f),c||0,null==e?h:e,function(g,q,s){var t=Vb(a,r(b,g),"div",f,"left"),v,u;g==q?(v=t,s=u=t.left):(v=Vb(a,r(b,q-1),"div",f,"right"),"rtl"==s&&(s=t,t=v,v=s),s=t.left,u=v.right);null==c&&0==g&&(s=l);3<v.top-t.top&&(d(s,t.top,null,t.bottom),s=l,t.bottom<v.top&&d(s,t.bottom,null,v.top));
null==e&&q==h&&(u=m);if(!k||t.top<k.top||t.top==k.top&&t.left<k.left)k=t;if(!p||v.bottom>p.bottom||v.bottom==p.bottom&&v.right>p.right)p=v;s<l+1&&(s=l);d(s,v.top,u-s,v.bottom)});return{start:k,end:p}}var f=a.display,g=a.doc,h=document.createDocumentFragment(),k=me(a.display),l=k.left,m=Math.max(f.sizerWidth,za(a)-f.sizer.offsetLeft)-k.right,f=b.from();b=b.to();if(f.line==b.line)e(f.line,f.ch,b.ch);else{var p=t(g,f.line),k=t(g,b.line),k=ia(p)==ia(k),f=e(f.line,f.ch,k?p.text.length+1:null).end;b=e(b.line,
k?0:null,b.ch).start;k&&(f.top<b.top-2?(d(f.right,f.top,null,f.bottom),d(l,b.top,b.left,b.bottom)):d(f.right,f.top,b.left-f.right,f.bottom));f.bottom<b.top&&d(l,f.bottom,null,b.top)}c.appendChild(h)}function Zc(a){if(a.state.focused){var b=a.display;clearInterval(b.blinker);var c=!0;b.cursorDiv.style.visibility="";0<a.options.cursorBlinkRate?b.blinker=setInterval(function(){b.cursorDiv.style.visibility=(c=!c)?"":"hidden"},a.options.cursorBlinkRate):0>a.options.cursorBlinkRate&&(b.cursorDiv.style.visibility=
"hidden")}}function db(a,b){a.doc.mode.startState&&a.doc.frontier<a.display.viewTo&&a.state.highlight.set(b,xc(Hf,a))}function Hf(a){var b=a.doc;b.frontier<b.first&&(b.frontier=b.first);if(!(b.frontier>=a.display.viewTo)){var c=+new Date+a.options.workTime,d=sa(b.mode,rb(a,b.frontier)),e=[];b.iter(b.frontier,Math.min(b.first+b.size,a.display.viewTo+500),function(f){if(b.frontier>=a.display.viewFrom){var g=f.styles,h=f.text.length>a.options.maxHighlightLength,k=ne(a,f,h?sa(b.mode,d):d,!0);f.styles=
k.styles;var l=f.styleClasses;(k=k.classes)?f.styleClasses=k:l&&(f.styleClasses=null);l=!g||g.length!=f.styles.length||l!=k&&(!l||!k||l.bgClass!=k.bgClass||l.textClass!=k.textClass);for(k=0;!l&&k<g.length;++k)l=g[k]!=f.styles[k];l&&e.push(b.frontier);f.stateAfter=h?d:sa(b.mode,d)}else f.text.length<=a.options.maxHighlightLength&&$c(a,f.text,d),f.stateAfter=0==b.frontier%5?sa(b.mode,d):null;++b.frontier;if(+new Date>c)return db(a,a.options.workDelay),!0});e.length&&T(a,function(){for(var b=0;b<e.length;b++)ma(a,
e[b],"text")})}}function If(a,b,c){for(var d,e,f=a.doc,g=c?-1:b-(a.doc.mode.innerMode?1E3:100);b>g;--b){if(b<=f.first)return f.first;var h=t(f,b-1);if(h.stateAfter&&(!c||b<=f.frontier))return b;h=aa(h.text,null,a.options.tabSize);if(null==e||d>h)e=b-1,d=h}return e}function rb(a,b,c){var d=a.doc,e=a.display;if(!d.mode.startState)return!0;var f=If(a,b,c),g=f>d.first&&t(d,f-1).stateAfter,g=g?sa(d.mode,g):Jf(d.mode);d.iter(f,b,function(c){$c(a,c.text,g);c.stateAfter=f==b-1||0==f%5||f>=e.viewFrom&&f<e.viewTo?
sa(d.mode,g):null;++f});c&&(d.frontier=f);return g}function Fc(a){return a.mover.offsetHeight-a.lineSpace.offsetHeight}function me(a){if(a.cachedPaddingH)return a.cachedPaddingH;var b=U(a.measure,s("pre","x")),b=window.getComputedStyle?window.getComputedStyle(b):b.currentStyle,b={left:parseInt(b.paddingLeft),right:parseInt(b.paddingRight)};isNaN(b.left)||isNaN(b.right)||(a.cachedPaddingH=b);return b}function da(a){return Gd-a.display.nativeBarWidth}function za(a){return a.display.scroller.clientWidth-
da(a)-a.display.barWidth}function Oc(a){return a.display.scroller.clientHeight-da(a)-a.display.barHeight}function $d(a,b,c){if(a.line==b)return{map:a.measure.map,cache:a.measure.cache};for(var d=0;d<a.rest.length;d++)if(a.rest[d]==b)return{map:a.measure.maps[d],cache:a.measure.caches[d]};for(d=0;d<a.rest.length;d++)if(F(a.rest[d])>c)return{map:a.measure.maps[d],cache:a.measure.caches[d],before:!0}}function Vc(a,b){if(b>=a.display.viewFrom&&b<a.display.viewTo)return a.display.view[Aa(a,b)];var c=a.display.externalMeasured;
if(c&&b>=c.lineN&&b<c.lineN+c.size)return c}function Wb(a,b){var c=F(b),d=Vc(a,c);d&&!d.text?d=null:d&&d.changes&&(Nd(a,d,c,Lc(a)),a.curOp.forceUpdate=!0);if(!d){var e;e=ia(b);d=F(e);e=a.display.externalMeasured=new oe(a.doc,e,d);e.lineN=d;d=e.built=Rd(a,e);e.text=d.pre;U(a.display.lineMeasure,d.pre);d=e}c=$d(d,b,c);return{line:b,view:d,rect:null,map:c.map,cache:c.cache,before:c.before,hasHeights:!1}}function Xb(a,b,c,d,e){b.before&&(c=-1);var f=c+(d||"");if(b.cache.hasOwnProperty(f))a=b.cache[f];
else{b.rect||(b.rect=b.view.text.getBoundingClientRect());if(!b.hasHeights){var g=b.view,h=b.rect,k=a.options.lineWrapping,l=k&&za(a);if(!g.measure.heights||k&&g.measure.width!=l){var m=g.measure.heights=[];if(k)for(g.measure.width=l,g=g.text.firstChild.getClientRects(),k=0;k<g.length-1;k++){var l=g[k],p=g[k+1];2<Math.abs(l.bottom-p.bottom)&&m.push((l.bottom+p.top)/2-h.top)}m.push(h.bottom-h.top)}b.hasHeights=!0}m=d;g=ae(b.map,c,m);d=g.node;h=g.start;k=g.end;c=g.collapse;var n;if(3==d.nodeType){for(var E=
0;4>E;E++){for(;h&&sb(b.line.text.charAt(g.coverStart+h));)--h;for(;g.coverStart+k<g.coverEnd&&sb(b.line.text.charAt(g.coverStart+k));)++k;if(A&&9>B&&0==h&&k==g.coverEnd-g.coverStart)n=d.parentNode.getBoundingClientRect();else{n=Sa(d,h,k).getClientRects();k=pe;if("left"==m)for(l=0;l<n.length&&(k=n[l]).left==k.right;l++);else for(l=n.length-1;0<=l&&(k=n[l]).left==k.right;l--);n=k}if(n.left||n.right||0==h)break;k=h;--h;c="right"}A&&11>B&&((E=!window.screen||null==screen.logicalXDPI||screen.logicalXDPI==
screen.deviceXDPI)||(null!=ad?E=ad:(m=U(a.display.measure,s("span","x")),E=m.getBoundingClientRect(),m=Sa(m,0,1).getBoundingClientRect(),E=ad=1<Math.abs(E.left-m.left)),E=!E),E||(E=screen.logicalXDPI/screen.deviceXDPI,m=screen.logicalYDPI/screen.deviceYDPI,n={left:n.left*E,right:n.right*E,top:n.top*m,bottom:n.bottom*m}))}else 0<h&&(c=m="right"),n=a.options.lineWrapping&&1<(E=d.getClientRects()).length?E["right"==m?E.length-1:0]:d.getBoundingClientRect();!(A&&9>B)||h||n&&(n.left||n.right)||(n=(n=d.parentNode.getClientRects()[0])?
{left:n.left,right:n.left+eb(a.display),top:n.top,bottom:n.bottom}:pe);d=n.top-b.rect.top;h=n.bottom-b.rect.top;m=(d+h)/2;g=b.view.measure.heights;for(E=0;E<g.length-1&&!(m<g[E]);E++);c={left:("right"==c?n.right:n.left)-b.rect.left,right:("left"==c?n.left:n.right)-b.rect.left,top:E?g[E-1]:0,bottom:g[E]};n.left||n.right||(c.bogus=!0);a.options.singleCursorHeightPerLine||(c.rtop=d,c.rbottom=h);a=c;a.bogus||(b.cache[f]=a)}return{left:a.left,right:a.right,top:e?a.rtop:a.top,bottom:e?a.rbottom:a.bottom}}
function ae(a,b,c){for(var d,e,f,g,h=0;h<a.length;h+=3){var k=a[h],l=a[h+1];if(b<k)e=0,f=1,g="left";else if(b<l)e=b-k,f=e+1;else if(h==a.length-3||b==l&&a[h+3]>b)f=l-k,e=f-1,b>=l&&(g="right");if(null!=e){d=a[h+2];k==l&&c==(d.insertLeft?"left":"right")&&(g=c);if("left"==c&&0==e)for(;h&&a[h-2]==a[h-3]&&a[h-1].insertLeft;)d=a[(h-=3)+2],g="left";if("right"==c&&e==l-k)for(;h<a.length-3&&a[h+3]==a[h+4]&&!a[h+5].insertLeft;)d=a[(h+=3)+2],g="right";break}}return{node:d,start:e,end:f,collapse:g,coverStart:k,
coverEnd:l}}function qe(a){if(a.measure&&(a.measure.cache={},a.measure.heights=null,a.rest))for(var b=0;b<a.rest.length;b++)a.measure.caches[b]={}}function re(a){a.display.externalMeasure=null;pa(a.display.lineMeasure);for(var b=0;b<a.display.view.length;b++)qe(a.display.view[b])}function fb(a){re(a);a.display.cachedCharWidth=a.display.cachedTextHeight=a.display.cachedPaddingH=null;a.options.lineWrapping||(a.display.maxLineChanged=!0);a.display.lineNumChars=null}function bd(a,b,c,d){if(b.widgets)for(var e=
0;e<b.widgets.length;++e)if(b.widgets[e].above){var f=tb(b.widgets[e]);c.top+=f;c.bottom+=f}if("line"==d)return c;d||(d="local");b=ea(b);b="local"==d?b+a.display.lineSpace.offsetTop:b-a.display.viewOffset;if("page"==d||"window"==d)a=a.display.lineSpace.getBoundingClientRect(),b+=a.top+("window"==d?0:window.pageYOffset||(document.documentElement||document.body).scrollTop),d=a.left+("window"==d?0:window.pageXOffset||(document.documentElement||document.body).scrollLeft),c.left+=d,c.right+=d;c.top+=b;
c.bottom+=b;return c}function se(a,b,c){if("div"==c)return b;var d=b.left;b=b.top;"page"==c?(d-=window.pageXOffset||(document.documentElement||document.body).scrollLeft,b-=window.pageYOffset||(document.documentElement||document.body).scrollTop):"local"!=c&&c||(c=a.display.sizer.getBoundingClientRect(),d+=c.left,b+=c.top);a=a.display.lineSpace.getBoundingClientRect();return{left:d-a.left,top:b-a.top}}function Vb(a,b,c,d,e){d||(d=t(a.doc,b.line));var f=d;b=b.ch;d=Xb(a,Wb(a,d),b,e);return bd(a,f,d,c)}
function la(a,b,c,d,e,f){function g(b,g){var h=Xb(a,e,b,g?"right":"left",f);g?h.left=h.right:h.right=h.left;return bd(a,d,h,c)}function h(a,b){var c=k[b],d=c.level%2;a==cd(c)&&b&&c.level<k[b-1].level?(c=k[--b],a=dd(c)-(c.level%2?0:1),d=!0):a==dd(c)&&b<k.length-1&&c.level<k[b+1].level&&(c=k[++b],a=cd(c)-c.level%2,d=!1);return d&&a==c.to&&a>c.from?g(a-1):g(a,d)}d=d||t(a.doc,b.line);e||(e=Wb(a,d));var k=Z(d);b=b.ch;if(!k)return g(b);var l=Qb(k,b),l=h(b,l);null!=ub&&(l.other=h(b,ub));return l}function te(a,
b){var c=0;b=x(a.doc,b);a.options.lineWrapping||(c=eb(a.display)*b.ch);var d=t(a.doc,b.line),e=ea(d)+a.display.lineSpace.offsetTop;return{left:c,right:c,top:e,bottom:e+d.height}}function Yb(a,b,c,d){a=r(a,b);a.xRel=d;c&&(a.outside=!0);return a}function ed(a,b,c){var d=a.doc;c+=a.display.viewOffset;if(0>c)return Yb(d.first,0,!0,-1);var e=ya(d,c),f=d.first+d.size-1;if(e>f)return Yb(d.first+d.size-1,t(d,f).text.length,!0,1);0>b&&(b=0);for(d=t(d,e);;)if(e=Kf(a,d,e,b,c),f=(d=xa(d,!1))&&d.find(0,!0),d&&
(e.ch>f.from.ch||e.ch==f.from.ch&&0<e.xRel))e=F(d=f.to.line);else return e}function Kf(a,b,c,d,e){function f(d){d=la(a,r(c,d),"line",b,l);h=!0;if(g>d.bottom)return d.left-k;if(g<d.top)return d.left+k;h=!1;return d.left}var g=e-ea(b),h=!1,k=2*a.display.wrapper.clientWidth,l=Wb(a,b);e=Z(b);var m=b.text.length,p=Zb(b),n=$b(b),E=f(p),q=h,s=f(n),t=h;if(d>s)return Yb(c,n,t,1);for(;;){if(e?n==p||n==fd(b,p,1):1>=n-p){m=d<E||d-E<=s-d?p:n;q=m==p?q:t;p=d-(m==p?E:s);t&&!e&&!/\s/.test(b.text.charAt(m))&&0<p&&
m<b.text.length&&1<l.view.measure.heights.length&&(e=Xb(a,l,m,"right"),g<=e.bottom&&g>=e.top&&Math.abs(d-e.right)<p&&(q=!1,m++,p=d-e.right));for(;sb(b.text.charAt(m));)++m;return Yb(c,m,q,-1>p?-1:1<p?1:0)}var v=Math.ceil(m/2),u=p+v;if(e)for(var u=p,w=0;w<v;++w)u=fd(b,u,1);w=f(u);if(w>d){n=u;s=w;if(t=h)s+=1E3;m=v}else p=u,E=w,q=h,m-=v}}function va(a){if(null!=a.cachedTextHeight)return a.cachedTextHeight;if(null==Ca){Ca=s("pre");for(var b=0;49>b;++b)Ca.appendChild(document.createTextNode("x")),Ca.appendChild(s("br"));
Ca.appendChild(document.createTextNode("x"))}U(a.measure,Ca);b=Ca.offsetHeight/50;3<b&&(a.cachedTextHeight=b);pa(a.measure);return b||1}function eb(a){if(null!=a.cachedCharWidth)return a.cachedCharWidth;var b=s("span","xxxxxxxxxx"),c=s("pre",[b]);U(a.measure,c);b=b.getBoundingClientRect();b=(b.right-b.left)/10;2<b&&(a.cachedCharWidth=b);return b||10}function Ja(a){a.curOp={cm:a,viewChanged:!1,startHeight:a.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivityHandlers:null,
cursorActivityCalled:0,selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,focus:!1,id:++Lf};Ta?Ta.ops.push(a.curOp):a.curOp.ownsGroup=Ta={ops:[a.curOp],delayedCallbacks:[]}}function La(a){if(a=a.curOp.ownsGroup)try{var b=a.delayedCallbacks,c=0;do{for(;c<b.length;c++)b[c].call(null);for(var d=0;d<a.ops.length;d++){var e=a.ops[d];if(e.cursorActivityHandlers)for(;e.cursorActivityCalled<e.cursorActivityHandlers.length;)e.cursorActivityHandlers[e.cursorActivityCalled++].call(null,
e.cm)}}while(c<b.length)}finally{Ta=null;for(b=0;b<a.ops.length;b++)a.ops[b].cm.curOp=null;a=a.ops;for(b=0;b<a.length;b++){var e=a[b],c=e.cm,f=d=c.display;!f.scrollbarsClipped&&f.scroller.offsetWidth&&(f.nativeBarWidth=f.scroller.offsetWidth-f.scroller.clientWidth,f.heightForcer.style.height=da(c)+"px",f.sizer.style.marginBottom=-f.nativeBarWidth+"px",f.sizer.style.borderRightWidth=da(c)+"px",f.scrollbarsClipped=!0);e.updateMaxLine&&Ec(c);e.mustUpdate=e.viewChanged||e.forceUpdate||null!=e.scrollTop||
e.scrollToPos&&(e.scrollToPos.from.line<d.viewFrom||e.scrollToPos.to.line>=d.viewTo)||d.maxLineChanged&&c.options.lineWrapping;e.update=e.mustUpdate&&new Kb(c,e.mustUpdate&&{top:e.scrollTop,ensure:e.scrollToPos},e.forceUpdate)}for(b=0;b<a.length;b++)e=a[b],e.updatedDisplay=e.mustUpdate&&Mc(e.cm,e.update);for(b=0;b<a.length;b++)if(e=a[b],c=e.cm,d=c.display,e.updatedDisplay&&Jb(c),e.barMeasure=hb(c),d.maxLineChanged&&!c.options.lineWrapping&&(f=void 0,f=d.maxLine.text.length,f=Xb(c,Wb(c,d.maxLine),
f,void 0),e.adjustWidthTo=f.left+3,c.display.sizerWidth=e.adjustWidthTo,e.barMeasure.scrollWidth=Math.max(d.scroller.clientWidth,d.sizer.offsetLeft+e.adjustWidthTo+da(c)+c.display.barWidth),e.maxScrollLeft=Math.max(0,d.sizer.offsetLeft+e.adjustWidthTo-za(c))),e.updatedDisplay||e.selectionChanged)e.preparedSelection=d.input.prepareSelection(e.focus);for(b=0;b<a.length;b++)e=a[b],c=e.cm,null!=e.adjustWidthTo&&(c.display.sizer.style.minWidth=e.adjustWidthTo+"px",e.maxScrollLeft<c.doc.scrollLeft&&Ma(c,
Math.min(c.display.scroller.scrollLeft,e.maxScrollLeft),!0),c.display.maxLineChanged=!1),d=e.focus&&e.focus==fa()&&(!document.hasFocus||document.hasFocus()),e.preparedSelection&&c.display.input.showSelection(e.preparedSelection,d),(e.updatedDisplay||e.startHeight!=c.doc.height)&&Na(c,e.barMeasure),e.updatedDisplay&&Pc(c,e.barMeasure),e.selectionChanged&&Zc(c),c.state.focused&&e.updateInput&&c.display.input.reset(e.typing),d&&Td(e.cm);for(b=0;b<a.length;b++){e=a[b];c=e.cm;d=c.display;f=c.doc;e.updatedDisplay&&
Ld(c,e.update);null==d.wheelStartX||null==e.scrollTop&&null==e.scrollLeft&&!e.scrollToPos||(d.wheelStartX=d.wheelStartY=null);null==e.scrollTop||d.scroller.scrollTop==e.scrollTop&&!e.forceScroll||(f.scrollTop=Math.max(0,Math.min(d.scroller.scrollHeight-d.scroller.clientHeight,e.scrollTop)),d.scrollbars.setScrollTop(f.scrollTop),d.scroller.scrollTop=f.scrollTop);null==e.scrollLeft||d.scroller.scrollLeft==e.scrollLeft&&!e.forceScroll||(f.scrollLeft=Math.max(0,Math.min(d.scroller.scrollWidth-d.scroller.clientWidth,
e.scrollLeft)),d.scrollbars.setScrollLeft(f.scrollLeft),d.scroller.scrollLeft=f.scrollLeft,Cc(c));if(e.scrollToPos){var g=void 0,h=x(f,e.scrollToPos.from),g=x(f,e.scrollToPos.to),k=e.scrollToPos.margin;null==k&&(k=0);for(var l=0;5>l;l++){var m=!1,p=la(c,h),n=g&&g!=h?la(c,g):p,n=ac(c,Math.min(p.left,n.left),Math.min(p.top,n.top)-k,Math.max(p.left,n.left),Math.max(p.bottom,n.bottom)+k),q=c.doc.scrollTop,r=c.doc.scrollLeft;null!=n.scrollTop&&(jb(c,n.scrollTop),1<Math.abs(c.doc.scrollTop-q)&&(m=!0));
null!=n.scrollLeft&&(Ma(c,n.scrollLeft),1<Math.abs(c.doc.scrollLeft-r)&&(m=!0));if(!m)break}g=p;e.scrollToPos.isCursor&&c.state.focused&&(H(c,"scrollCursorIntoView")||(k=c.display,l=k.sizer.getBoundingClientRect(),h=null,0>g.top+l.top?h=!0:g.bottom+l.top>(window.innerHeight||document.documentElement.clientHeight)&&(h=!1),null==h||Mf||(g=s("div","​",null,"position: absolute; top: "+(g.top-k.viewOffset-c.display.lineSpace.offsetTop)+"px; height: "+(g.bottom-g.top+da(c)+k.barHeight)+"px; left: "+g.left+
"px; width: 2px;"),c.display.lineSpace.appendChild(g),g.scrollIntoView(h),c.display.lineSpace.removeChild(g))))}h=e.maybeHiddenMarkers;g=e.maybeUnhiddenMarkers;if(h)for(k=0;k<h.length;++k)h[k].lines.length||J(h[k],"hide");if(g)for(k=0;k<g.length;++k)g[k].lines.length&&J(g[k],"unhide");d.wrapper.offsetHeight&&(f.scrollTop=c.display.scroller.scrollTop);e.changeObjs&&J(c,"changes",c,e.changeObjs);e.update&&e.update.finish()}}}function T(a,b){if(a.curOp)return b();Ja(a);try{return b()}finally{La(a)}}
function G(a,b){return function(){if(a.curOp)return b.apply(a,arguments);Ja(a);try{return b.apply(a,arguments)}finally{La(a)}}}function L(a){return function(){if(this.curOp)return a.apply(this,arguments);Ja(this);try{return a.apply(this,arguments)}finally{La(this)}}}function N(a){return function(){var b=this.cm;if(!b||b.curOp)return a.apply(this,arguments);Ja(b);try{return a.apply(this,arguments)}finally{La(b)}}}function oe(a,b,c){for(var d=this.line=b,e;d=xa(d,!1);)d=d.find(1,!0).line,(e||(e=[])).push(d);
this.size=(this.rest=e)?F(z(this.rest))-c+1:1;this.node=this.text=null;this.hidden=wa(a,b)}function Lb(a,b,c){var d=[],e;for(e=b;e<c;)b=new oe(a.doc,t(a.doc,e),e),e+=b.size,d.push(b);return d}function M(a,b,c,d){null==b&&(b=a.doc.first);null==c&&(c=a.doc.first+a.doc.size);d||(d=0);var e=a.display;d&&c<e.viewTo&&(null==e.updateLineNumbers||e.updateLineNumbers>b)&&(e.updateLineNumbers=b);a.curOp.viewChanged=!0;if(b>=e.viewTo)ra&&Nc(a.doc,b)<e.viewTo&&qa(a);else if(c<=e.viewFrom)ra&&Kd(a.doc,c+d)>e.viewFrom?
qa(a):(e.viewFrom+=d,e.viewTo+=d);else if(b<=e.viewFrom&&c>=e.viewTo)qa(a);else if(b<=e.viewFrom){var f=bc(a,c,c+d,1);f?(e.view=e.view.slice(f.index),e.viewFrom=f.lineN,e.viewTo+=d):qa(a)}else if(c>=e.viewTo)(f=bc(a,b,b,-1))?(e.view=e.view.slice(0,f.index),e.viewTo=f.lineN):qa(a);else{var f=bc(a,b,b,-1),g=bc(a,c,c+d,1);f&&g?(e.view=e.view.slice(0,f.index).concat(Lb(a,f.lineN,g.lineN)).concat(e.view.slice(g.index)),e.viewTo+=d):qa(a)}if(a=e.externalMeasured)c<a.lineN?a.lineN+=d:b<a.lineN+a.size&&(e.externalMeasured=
null)}function ma(a,b,c){a.curOp.viewChanged=!0;var d=a.display,e=a.display.externalMeasured;e&&b>=e.lineN&&b<e.lineN+e.size&&(d.externalMeasured=null);b<d.viewFrom||b>=d.viewTo||(a=d.view[Aa(a,b)],null!=a.node&&(a=a.changes||(a.changes=[]),-1==D(a,c)&&a.push(c)))}function qa(a){a.display.viewFrom=a.display.viewTo=a.doc.first;a.display.view=[];a.display.viewOffset=0}function Aa(a,b){if(b>=a.display.viewTo)return null;b-=a.display.viewFrom;if(0>b)return null;for(var c=a.display.view,d=0;d<c.length;d++)if(b-=
c[d].size,0>b)return d}function bc(a,b,c,d){var e=Aa(a,b),f=a.display.view;if(!ra||c==a.doc.first+a.doc.size)return{index:e,lineN:c};for(var g=0,h=a.display.viewFrom;g<e;g++)h+=f[g].size;if(h!=b){if(0<d){if(e==f.length-1)return null;b=h+f[e].size-b;e++}else b=h-b;c+=b}for(;Nc(a.doc,c)!=c;){if(e==(0>d?0:f.length-1))return null;c+=d*f[e-(0>d?1:0)].size;e+=d}return{index:e,lineN:c}}function Jd(a){a=a.display.view;for(var b=0,c=0;c<a.length;c++){var d=a[c];d.hidden||d.node&&!d.changes||++b}return b}function yf(a){function b(){d.activeTouch&&
(e=setTimeout(function(){d.activeTouch=null},1E3),f=d.activeTouch,f.end=+new Date)}function c(a,b){if(null==b.left)return!0;var c=b.left-a.left,d=b.top-a.top;return 400<c*c+d*d}var d=a.display;v(d.scroller,"mousedown",G(a,Nf));A&&11>B?v(d.scroller,"dblclick",G(a,function(b){if(!H(a,b)){var c=Da(a,b);!c||gd(a,b,"gutterClick",!0)||na(a.display,b)||(O(b),b=a.findWordAt(c),Sb(a.doc,b.anchor,b.head))}})):v(d.scroller,"dblclick",function(b){H(a,b)||O(b)});hd||v(d.scroller,"contextmenu",function(b){ue(a,
b)});var e,f={end:0};v(d.scroller,"touchstart",function(b){var c;if(c=!H(a,b))1!=b.touches.length?c=!1:(c=b.touches[0],c=1>=c.radiusX&&1>=c.radiusY),c=!c;c&&(clearTimeout(e),c=+new Date,d.activeTouch={start:c,moved:!1,prev:300>=c-f.end?f:null},1==b.touches.length&&(d.activeTouch.left=b.touches[0].pageX,d.activeTouch.top=b.touches[0].pageY))});v(d.scroller,"touchmove",function(){d.activeTouch&&(d.activeTouch.moved=!0)});v(d.scroller,"touchend",function(e){var f=d.activeTouch;if(f&&!na(d,e)&&null!=
f.left&&!f.moved&&300>new Date-f.start){var g=a.coordsChar(d.activeTouch,"page"),f=!f.prev||c(f,f.prev)?new y(g,g):!f.prev.prev||c(f,f.prev.prev)?a.findWordAt(g):new y(r(g.line,0),x(a.doc,r(g.line+1,0)));a.setSelection(f.anchor,f.head);a.focus();O(e)}b()});v(d.scroller,"touchcancel",b);v(d.scroller,"scroll",function(){d.scroller.clientHeight&&(jb(a,d.scroller.scrollTop),Ma(a,d.scroller.scrollLeft,!0),J(a,"scroll",a))});v(d.scroller,"mousewheel",function(b){ve(a,b)});v(d.scroller,"DOMMouseScroll",
function(b){ve(a,b)});v(d.wrapper,"scroll",function(){d.wrapper.scrollTop=d.wrapper.scrollLeft=0});d.dragFunctions={enter:function(b){H(a,b)||cc(b)},over:function(b){if(!H(a,b)){var c=Da(a,b);if(c){var d=document.createDocumentFragment();le(a,c,d);a.display.dragCursor||(a.display.dragCursor=s("div",null,"CodeMirror-cursors CodeMirror-dragcursors"),a.display.lineSpace.insertBefore(a.display.dragCursor,a.display.cursorDiv));U(a.display.dragCursor,d)}cc(b)}},start:function(b){if(A&&(!a.state.draggingText||
100>+new Date-we))cc(b);else if(!H(a,b)&&!na(a.display,b)&&(b.dataTransfer.setData("Text",a.getSelection()),b.dataTransfer.effectAllowed="copyMove",b.dataTransfer.setDragImage&&!xe)){var c=s("img",null,null,"position: fixed; left: 0; top: 0;");c.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw\x3d\x3d";ba&&(c.width=c.height=1,a.display.wrapper.appendChild(c),c._top=c.offsetTop);b.dataTransfer.setDragImage(c,0,0);ba&&c.parentNode.removeChild(c)}},drop:G(a,Of),leave:function(b){H(a,
b)||ye(a)}};var g=d.input.getField();v(g,"keyup",function(b){ze.call(a,b)});v(g,"keydown",G(a,Ae));v(g,"keypress",G(a,Be));v(g,"focus",function(b){yc(a,b)});v(g,"blur",function(b){bb(a,b)})}function Pf(a){var b=a.display;if(b.lastWrapHeight!=b.wrapper.clientHeight||b.lastWrapWidth!=b.wrapper.clientWidth)b.cachedCharWidth=b.cachedTextHeight=b.cachedPaddingH=null,b.scrollbarsClipped=!1,a.setSize()}function na(a,b){for(var c=b.target||b.srcElement;c!=a.wrapper;c=c.parentNode)if(!c||1==c.nodeType&&"true"==
c.getAttribute("cm-ignore-events")||c.parentNode==a.sizer&&c!=a.mover)return!0}function Da(a,b,c,d){var e=a.display;if(!c&&"true"==(b.target||b.srcElement).getAttribute("cm-not-content"))return null;var f,g;c=e.lineSpace.getBoundingClientRect();try{f=b.clientX-c.left,g=b.clientY-c.top}catch(h){return null}b=ed(a,f,g);var k;d&&1==b.xRel&&(k=t(a.doc,b.line).text).length==b.ch&&(d=aa(k,k.length,a.options.tabSize)-k.length,b=r(b.line,Math.max(0,Math.round((f-me(a.display).left)/eb(a.display))-d)));return b}
function Nf(a){var b=this.display;if(!(H(this,a)||b.activeTouch&&b.input.supportsTouch()))if(b.shift=a.shiftKey,na(b,a))K||(b.scroller.draggable=!1,setTimeout(function(){b.scroller.draggable=!0},100));else if(!gd(this,a,"gutterClick",!0)){var c=Da(this,a);window.focus();switch(Ce(a)){case 1:this.state.selectingText?this.state.selectingText(a):c?Qf(this,a,c):(a.target||a.srcElement)==b.scroller&&O(a);break;case 2:K&&(this.state.lastMiddleDown=+new Date);c&&Sb(this.doc,c);setTimeout(function(){b.input.focus()},
20);O(a);break;case 3:hd?ue(this,a):Rf(this)}}}function Qf(a,b,c){A?setTimeout(xc(Td,a),0):a.curOp.focus=fa();var d=+new Date,e;dc&&dc.time>d-400&&0==w(dc.pos,c)?e="triple":ec&&ec.time>d-400&&0==w(ec.pos,c)?(e="double",dc={time:d,pos:c}):(e="single",ec={time:d,pos:c});var d=a.doc.sel,f=Y?b.metaKey:b.ctrlKey,g;a.options.dragDrop&&Sf&&!a.isReadOnly()&&"single"==e&&-1<(g=d.contains(c))&&(0>w((g=d.ranges[g]).from(),c)||0<c.xRel)&&(0<w(g.to(),c)||0>c.xRel)?Tf(a,b,c,f):Uf(a,b,c,e,f)}function Tf(a,b,c,d){var e=
a.display,f=+new Date,g=G(a,function(h){K&&(e.scroller.draggable=!1);a.state.draggingText=!1;ja(document,"mouseup",g);ja(e.scroller,"drop",g);10>Math.abs(b.clientX-h.clientX)+Math.abs(b.clientY-h.clientY)&&(O(h),!d&&+new Date-200<f&&Sb(a.doc,c),K||A&&9==B?setTimeout(function(){document.body.focus();e.input.focus()},20):e.input.focus())});K&&(e.scroller.draggable=!0);a.state.draggingText=g;g.copy=Y?b.altKey:b.ctrlKey;e.scroller.dragDrop&&e.scroller.dragDrop();v(document,"mouseup",g);v(e.scroller,"drop",
g)}function Uf(a,b,c,d,e){function f(b){if(0!=w(u,b))if(u=b,"rect"==d){for(var e=[],f=a.options.tabSize,g=aa(t(l,c.line).text,c.ch,f),h=aa(t(l,b.line).text,b.ch,f),k=Math.min(g,h),g=Math.max(g,h),h=Math.min(c.line,b.line),q=Math.min(a.lastLine(),Math.max(c.line,b.line));h<=q;h++){var s=t(l,h).text,E=De(s,k,f);k==g?e.push(new y(r(h,E),r(h,E))):s.length>E&&e.push(new y(r(h,E),r(h,De(s,g,f))))}e.length||e.push(new y(c,c));C(l,$(n.ranges.slice(0,p).concat(e),p),{origin:"*mouse",scroll:!1});a.scrollIntoView(b)}else e=
m,f=e.anchor,k=b,"single"!=d&&(b="double"==d?a.findWordAt(b):new y(r(b.line,0),x(l,r(b.line+1,0))),0<w(b.anchor,f)?(k=b.head,f=Nb(e.from(),b.anchor)):(k=b.anchor,f=Mb(e.to(),b.head))),e=n.ranges.slice(0),e[p]=new y(x(l,f),k),C(l,$(e,p),id)}function g(b){var c=++z,e=Da(a,b,!0,"rect"==d);if(e)if(0!=w(e,u)){a.curOp.focus=fa();f(e);var h=Ic(k,l);(e.line>=h.to||e.line<h.from)&&setTimeout(G(a,function(){z==c&&g(b)}),150)}else{var m=b.clientY<A.top?-20:b.clientY>A.bottom?20:0;m&&setTimeout(G(a,function(){z==
c&&(k.scroller.scrollTop+=m,g(b))}),50)}}function h(b){a.state.selectingText=!1;z=Infinity;O(b);k.input.focus();ja(document,"mousemove",F);ja(document,"mouseup",B);l.history.lastSelOrigin=null}var k=a.display,l=a.doc;O(b);var m,p,n=l.sel,q=n.ranges;e&&!b.shiftKey?(p=l.sel.contains(c),m=-1<p?q[p]:new y(c,c)):(m=l.sel.primary(),p=l.sel.primIndex);if(Vf?b.shiftKey&&b.metaKey:b.altKey)d="rect",e||(m=new y(c,c)),c=Da(a,b,!0,!0),p=-1;else if("double"==d){var s=a.findWordAt(c);m=a.display.shift||l.extend?
qb(l,m,s.anchor,s.head):s}else"triple"==d?(s=new y(r(c.line,0),x(l,r(c.line+1,0))),m=a.display.shift||l.extend?qb(l,m,s.anchor,s.head):s):m=qb(l,m,c);e?-1==p?(p=q.length,C(l,$(q.concat([m]),p),{scroll:!1,origin:"*mouse"})):1<q.length&&q[p].empty()&&"single"==d&&!b.shiftKey?(C(l,$(q.slice(0,p).concat(q.slice(p+1)),0),{scroll:!1,origin:"*mouse"}),n=l.sel):Xc(l,p,m,id):(p=0,C(l,new ka([m],0),id),n=l.sel);var u=c,A=k.wrapper.getBoundingClientRect(),z=0,F=G(a,function(a){Ce(a)?g(a):h(a)}),B=G(a,h);a.state.selectingText=
B;v(document,"mousemove",F);v(document,"mouseup",B)}function gd(a,b,c,d){try{var e=b.clientX,f=b.clientY}catch(g){return!1}if(e>=Math.floor(a.display.gutters.getBoundingClientRect().right))return!1;d&&O(b);d=a.display;var h=d.lineDiv.getBoundingClientRect();if(f>h.bottom||!W(a,c))return jd(b);f-=h.top-d.viewOffset;for(h=0;h<a.options.gutters.length;++h){var k=d.gutters.childNodes[h];if(k&&k.getBoundingClientRect().right>=e)return e=ya(a.doc,f),J(a,c,a,e,a.options.gutters[h],b),jd(b)}}function Of(a){var b=
this;ye(b);if(!H(b,a)&&!na(b.display,a)){O(a);A&&(we=+new Date);var c=Da(b,a,!0),d=a.dataTransfer.files;if(c&&!b.isReadOnly())if(d&&d.length&&window.FileReader&&window.File){var e=d.length,f=Array(e),g=0;a=function(a,d){if(!b.options.allowDropFileTypes||-1!=D(b.options.allowDropFileTypes,a.type)){var h=new FileReader;h.onload=G(b,function(){var a=h.result;/[\x00-\x08\x0e-\x1f]{2}/.test(a)&&(a="");f[d]=a;++g==e&&(c=x(b.doc,c),a={from:c,to:c,text:b.doc.splitLines(f.join(b.doc.lineSeparator())),origin:"paste"},
Oa(b.doc,a),de(b.doc,ga(c,Ea(a))))});h.readAsText(a)}};for(var h=0;h<e;++h)a(d[h],h)}else if(b.state.draggingText&&-1<b.doc.sel.contains(c))b.state.draggingText(a),setTimeout(function(){b.display.input.focus()},20);else try{if(f=a.dataTransfer.getData("Text")){if(b.state.draggingText&&!b.state.draggingText.copy)var k=b.listSelections();Tb(b.doc,ga(c,c));if(k)for(h=0;h<k.length;++h)Ua(b.doc,"",k[h].anchor,k[h].head,"drag");b.replaceSelection(f,"around","paste");b.display.input.focus()}}catch(l){}}}
function ye(a){a.display.dragCursor&&(a.display.lineSpace.removeChild(a.display.dragCursor),a.display.dragCursor=null)}function jb(a,b){2>Math.abs(a.doc.scrollTop-b)||(a.doc.scrollTop=b,oa||Qc(a,{top:b}),a.display.scroller.scrollTop!=b&&(a.display.scroller.scrollTop=b),a.display.scrollbars.setScrollTop(b),oa&&Qc(a),db(a,100))}function Ma(a,b,c){(c?b==a.doc.scrollLeft:2>Math.abs(a.doc.scrollLeft-b))||(b=Math.min(b,a.display.scroller.scrollWidth-a.display.scroller.clientWidth),a.doc.scrollLeft=b,Cc(a),
a.display.scroller.scrollLeft!=b&&(a.display.scroller.scrollLeft=b),a.display.scrollbars.setScrollLeft(b))}function ve(a,b){var c=Ee(b),d=c.x,c=c.y,e=a.display,f=e.scroller,g=f.scrollWidth>f.clientWidth,h=f.scrollHeight>f.clientHeight;if(d&&g||c&&h){if(c&&Y&&K){var g=b.target,k=e.view;a:for(;g!=f;g=g.parentNode)for(var l=0;l<k.length;l++)if(k[l].node==g){a.display.currentWheelTarget=g;break a}}!d||oa||ba||null==V?(c&&null!=V&&(h=c*V,g=a.doc.scrollTop,k=g+e.wrapper.clientHeight,0>h?g=Math.max(0,g+
h-50):k=Math.min(a.doc.height,k+h+50),Qc(a,{top:g,bottom:k})),20>fc&&(null==e.wheelStartX?(e.wheelStartX=f.scrollLeft,e.wheelStartY=f.scrollTop,e.wheelDX=d,e.wheelDY=c,setTimeout(function(){if(null!=e.wheelStartX){var a=f.scrollLeft-e.wheelStartX,b=f.scrollTop-e.wheelStartY,a=b&&e.wheelDY&&b/e.wheelDY||a&&e.wheelDX&&a/e.wheelDX;e.wheelStartX=e.wheelStartY=null;a&&(V=(V*fc+a)/(fc+1),++fc)}},200)):(e.wheelDX+=d,e.wheelDY+=c))):(c&&h&&jb(a,Math.max(0,Math.min(f.scrollTop+c*V,f.scrollHeight-f.clientHeight))),
Ma(a,Math.max(0,Math.min(f.scrollLeft+d*V,f.scrollWidth-f.clientWidth))),(!c||c&&h)&&O(b),e.wheelStartX=null)}}function gc(a,b,c){if("string"==typeof b&&(b=hc[b],!b))return!1;a.display.input.ensurePolled();var d=a.display.shift,e=!1;try{a.isReadOnly()&&(a.state.suppressEdits=!0),c&&(a.display.shift=!1),e=b(a)!=Fe}finally{a.display.shift=d,a.state.suppressEdits=!1}return e}function Wf(a,b,c){for(var d=0;d<a.state.keyMaps.length;d++){var e=vb(b,a.state.keyMaps[d],c,a);if(e)return e}return a.options.extraKeys&&
vb(b,a.options.extraKeys,c,a)||vb(b,a.options.keyMap,c,a)}function ic(a,b,c,d){var e=a.state.keySeq;if(e){if(Xf(b))return"handled";Yf.set(50,function(){a.state.keySeq==e&&(a.state.keySeq=null,a.display.input.reset())});b=e+" "+b}d=Wf(a,b,d);"multi"==d&&(a.state.keySeq=b);"handled"==d&&R(a,"keyHandled",a,b,c);if("handled"==d||"multi"==d)O(c),Zc(a);return e&&!d&&/\'$/.test(b)?(O(c),!0):!!d}function Ge(a,b){var c=Zf(b,!0);return c?b.shiftKey&&!a.state.keySeq?ic(a,"Shift-"+c,b,function(b){return gc(a,
b,!0)})||ic(a,c,b,function(b){if("string"==typeof b?/^go[A-Z]/.test(b):b.motion)return gc(a,b)}):ic(a,c,b,function(b){return gc(a,b)}):!1}function $f(a,b,c){return ic(a,"'"+c+"'",b,function(b){return gc(a,b,!0)})}function Ae(a){this.curOp.focus=fa();if(!H(this,a)){A&&11>B&&27==a.keyCode&&(a.returnValue=!1);var b=a.keyCode;this.display.shift=16==b||a.shiftKey;var c=Ge(this,a);ba&&(kd=c?b:null,!c&&88==b&&!He&&(Y?a.metaKey:a.ctrlKey)&&this.replaceSelection("",null,"cut"));18!=b||/\bCodeMirror-crosshair\b/.test(this.display.lineDiv.className)||
ag(this)}}function ag(a){function b(a){18!=a.keyCode&&a.altKey||(ib(c,"CodeMirror-crosshair"),ja(document,"keyup",b),ja(document,"mouseover",b))}var c=a.display.lineDiv;kb(c,"CodeMirror-crosshair");v(document,"keyup",b);v(document,"mouseover",b)}function ze(a){16==a.keyCode&&(this.doc.sel.shift=!1);H(this,a)}function Be(a){if(!(na(this.display,a)||H(this,a)||a.ctrlKey&&!a.altKey||Y&&a.metaKey)){var b=a.keyCode,c=a.charCode;if(ba&&b==kd)kd=null,O(a);else if(!ba||a.which&&!(10>a.which)||!Ge(this,a))if(b=
String.fromCharCode(null==c?b:c),!$f(this,a,b))this.display.input.onKeyPress(a)}}function Rf(a){a.state.delayingBlurEvent=!0;setTimeout(function(){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1,bb(a))},100)}function yc(a,b){a.state.delayingBlurEvent&&(a.state.delayingBlurEvent=!1);"nocursor"!=a.options.readOnly&&(a.state.focused||(J(a,"focus",a,b),a.state.focused=!0,kb(a.display.wrapper,"CodeMirror-focused"),a.curOp||a.display.selForContextMenu==a.doc.sel||(a.display.input.reset(),K&&setTimeout(function(){a.display.input.reset(!0)},
20)),a.display.input.receivedFocus()),Zc(a))}function bb(a,b){a.state.delayingBlurEvent||(a.state.focused&&(J(a,"blur",a,b),a.state.focused=!1,ib(a.display.wrapper,"CodeMirror-focused")),clearInterval(a.display.blinker),setTimeout(function(){a.state.focused||(a.display.shift=!1)},150))}function ue(a,b){var c;(c=na(a.display,b))||(c=W(a,"gutterContextMenu")?gd(a,b,"gutterContextMenu",!1):!1);if(!c&&!H(a,b,"contextmenu"))a.display.input.onContextMenu(b)}function Ie(a,b){if(0>w(a,b.from))return a;if(0>=
w(a,b.to))return Ea(b);var c=a.line+b.text.length-(b.to.line-b.from.line)-1,d=a.ch;a.line==b.to.line&&(d+=Ea(b).ch-b.to.ch);return r(c,d)}function ld(a,b){for(var c=[],d=0;d<a.sel.ranges.length;d++){var e=a.sel.ranges[d];c.push(new y(Ie(e.anchor,b),Ie(e.head,b)))}return $(c,a.sel.primIndex)}function Je(a,b,c){return a.line==b.line?r(c.line,a.ch-b.ch+c.ch):r(c.line+(a.line-b.line),a.ch)}function Ke(a,b,c){b={canceled:!1,from:b.from,to:b.to,text:b.text,origin:b.origin,cancel:function(){this.canceled=
!0}};c&&(b.update=function(b,c,f,g){b&&(this.from=x(a,b));c&&(this.to=x(a,c));f&&(this.text=f);void 0!==g&&(this.origin=g)});J(a,"beforeChange",a,b);a.cm&&J(a.cm,"beforeChange",a.cm,b);return b.canceled?null:{from:b.from,to:b.to,text:b.text,origin:b.origin}}function Oa(a,b,c){if(a.cm){if(!a.cm.curOp)return G(a.cm,Oa)(a,b,c);if(a.cm.state.suppressEdits)return}if(W(a,"beforeChange")||a.cm&&W(a.cm,"beforeChange"))if(b=Ke(a,b,!0),!b)return;if(c=Le&&!c&&bg(a,b.from,b.to))for(var d=c.length-1;0<=d;--d)Me(a,
{from:c[d].from,to:c[d].to,text:d?[""]:b.text});else Me(a,b)}function Me(a,b){if(1!=b.text.length||""!=b.text[0]||0!=w(b.from,b.to)){var c=ld(a,b);Ne(a,b,c,a.cm?a.cm.curOp.id:NaN);wb(a,b,c,md(a,b));var d=[];Fa(a,function(a,c){c||-1!=D(d,a.history)||(Oe(a.history,b),d.push(a.history));wb(a,b,null,md(a,b))})}}function jc(a,b,c){if(!a.cm||!a.cm.state.suppressEdits||c){for(var d=a.history,e,f=a.sel,g="undo"==b?d.done:d.undone,h="undo"==b?d.undone:d.done,k=0;k<g.length&&(e=g[k],c?!e.ranges||e.equals(a.sel):
e.ranges);k++);if(k!=g.length){for(d.lastOrigin=d.lastSelOrigin=null;;)if(e=g.pop(),e.ranges){Ub(e,h);if(c&&!e.equals(a.sel)){C(a,e,{clearRedo:!1});return}f=e}else break;c=[];Ub(f,h);h.push({changes:c,generation:d.generation});d.generation=e.generation||++d.maxGeneration;d=W(a,"beforeChange")||a.cm&&W(a.cm,"beforeChange");for(k=e.changes.length-1;0<=k;--k){var l=e.changes[k];l.origin=b;if(d&&!Ke(a,l,!1)){g.length=0;break}c.push(nd(a,l));f=k?ld(a,l):z(g);wb(a,l,f,Pe(a,l));!k&&a.cm&&a.cm.scrollIntoView({from:l.from,
to:Ea(l)});var m=[];Fa(a,function(a,b){b||-1!=D(m,a.history)||(Oe(a.history,l),m.push(a.history));wb(a,l,null,Pe(a,l))})}}}}function Qe(a,b){if(0!=b&&(a.first+=b,a.sel=new ka(Pb(a.sel.ranges,function(a){return new y(r(a.anchor.line+b,a.anchor.ch),r(a.head.line+b,a.head.ch))}),a.sel.primIndex),a.cm)){M(a.cm,a.first,a.first-b,b);for(var c=a.cm.display,d=c.viewFrom;d<c.viewTo;d++)ma(a.cm,d,"gutter")}}function wb(a,b,c,d){if(a.cm&&!a.cm.curOp)return G(a.cm,wb)(a,b,c,d);if(b.to.line<a.first)Qe(a,b.text.length-
1-(b.to.line-b.from.line));else if(!(b.from.line>a.lastLine())){if(b.from.line<a.first){var e=b.text.length-1-(a.first-b.from.line);Qe(a,e);b={from:r(a.first,0),to:r(b.to.line+e,b.to.ch),text:[z(b.text)],origin:b.origin}}e=a.lastLine();b.to.line>e&&(b={from:b.from,to:r(e,t(a,e).text.length),text:[b.text[0]],origin:b.origin});b.removed=Ba(a,b.from,b.to);c||(c=ld(a,b));a.cm?cg(a.cm,b,d):od(a,b,d);Tb(a,c,ha)}}function cg(a,b,c){var d=a.doc,e=a.display,f=b.from,g=b.to,h=!1,k=f.line;a.options.lineWrapping||
(k=F(ia(t(d,f.line))),d.iter(k,g.line+1,function(a){if(a==e.maxLine)return h=!0}));-1<d.sel.contains(b.from,b.to)&&he(a);od(d,b,c,Hd(a));a.options.lineWrapping||(d.iter(k,f.line+b.text.length,function(a){var b=Ib(a);b>e.maxLineLength&&(e.maxLine=a,e.maxLineLength=b,e.maxLineChanged=!0,h=!1)}),h&&(a.curOp.updateMaxLine=!0));d.frontier=Math.min(d.frontier,f.line);db(a,400);c=b.text.length-(g.line-f.line)-1;b.full?M(a):f.line!=g.line||1!=b.text.length||Re(a.doc,b)?M(a,f.line,g.line+1,c):ma(a,f.line,
"text");c=W(a,"changes");if((d=W(a,"change"))||c)b={from:f,to:g,text:b.text,removed:b.removed,origin:b.origin},d&&R(a,"change",a,b),c&&(a.curOp.changeObjs||(a.curOp.changeObjs=[])).push(b);a.display.selForContextMenu=null}function Ua(a,b,c,d,e){d||(d=c);if(0>w(d,c)){var f=d;d=c;c=f}"string"==typeof b&&(b=a.splitLines(b));Oa(a,{from:c,to:d,text:b,origin:e})}function ac(a,b,c,d,e){var f=a.display,g=va(a.display);0>c&&(c=0);var h=a.curOp&&null!=a.curOp.scrollTop?a.curOp.scrollTop:f.scroller.scrollTop,
k=Oc(a),l={};e-c>k&&(e=c+k);var m=a.doc.height+Fc(f),p=c<g,g=e>m-g;c<h?l.scrollTop=p?0:c:e>h+k&&(c=Math.min(c,(g?m:e)-k),c!=h&&(l.scrollTop=c));h=a.curOp&&null!=a.curOp.scrollLeft?a.curOp.scrollLeft:f.scroller.scrollLeft;a=za(a)-(a.options.fixedGutter?f.gutters.offsetWidth:0);(f=d-b>a)&&(d=b+a);10>b?l.scrollLeft=0:b<h?l.scrollLeft=Math.max(0,b-(f?0:10)):d>a+h-3&&(l.scrollLeft=d+(f?0:10)-a);return l}function kc(a,b,c){null==b&&null==c||lc(a);null!=b&&(a.curOp.scrollLeft=(null==a.curOp.scrollLeft?a.doc.scrollLeft:
a.curOp.scrollLeft)+b);null!=c&&(a.curOp.scrollTop=(null==a.curOp.scrollTop?a.doc.scrollTop:a.curOp.scrollTop)+c)}function Pa(a){lc(a);var b=a.getCursor(),c=b,d=b;a.options.lineWrapping||(c=b.ch?r(b.line,b.ch-1):b,d=r(b.line,b.ch+1));a.curOp.scrollToPos={from:c,to:d,margin:a.options.cursorScrollMargin,isCursor:!0}}function lc(a){var b=a.curOp.scrollToPos;if(b){a.curOp.scrollToPos=null;var c=te(a,b.from),d=te(a,b.to),b=ac(a,Math.min(c.left,d.left),Math.min(c.top,d.top)-b.margin,Math.max(c.right,d.right),
Math.max(c.bottom,d.bottom)+b.margin);a.scrollTo(b.scrollLeft,b.scrollTop)}}function nb(a,b,c,d){var e=a.doc,f;null==c&&(c="add");"smart"==c&&(e.mode.indent?f=rb(a,b):c="prev");var g=a.options.tabSize,h=t(e,b),k=aa(h.text,null,g);h.stateAfter&&(h.stateAfter=null);var l=h.text.match(/^\s*/)[0],m;if(!d&&!/\S/.test(h.text))m=0,c="not";else if("smart"==c&&(m=e.mode.indent(f,h.text.slice(l.length),h.text),m==Fe||150<m)){if(!d)return;c="prev"}"prev"==c?m=b>e.first?aa(t(e,b-1).text,null,g):0:"add"==c?m=
k+a.options.indentUnit:"subtract"==c?m=k-a.options.indentUnit:"number"==typeof c&&(m=k+c);m=Math.max(0,m);c="";d=0;if(a.options.indentWithTabs)for(a=Math.floor(m/g);a;--a)d+=g,c+="\t";d<m&&(c+=pd(m-d));if(c!=l)return Ua(e,c,r(b,0),r(b,l.length),"+input"),h.stateAfter=null,!0;for(a=0;a<e.sel.ranges.length;a++)if(g=e.sel.ranges[a],g.head.line==b&&g.head.ch<l.length){d=r(b,l.length);Xc(e,a,new y(d,d));break}}function mc(a,b,c,d){var e=b,f=b;"number"==typeof b?f=t(a,Math.max(a.first,Math.min(b,a.first+
a.size-1))):e=F(b);if(null==e)return null;d(f,e)&&a.cm&&ma(a.cm,e,c);return f}function Va(a,b){for(var c=a.doc.sel.ranges,d=[],e=0;e<c.length;e++){for(var f=b(c[e]);d.length&&0>=w(f.from,z(d).to);){var g=d.pop();if(0>w(g.from,f.from)){f.from=g.from;break}}d.push(f)}T(a,function(){for(var b=d.length-1;0<=b;b--)Ua(a.doc,"",d[b].from,d[b].to,"+delete");Pa(a)})}function qd(a,b,c,d,e){function f(b){var d=(e?fd:Se)(l,h,c,!0);if(null==d){if(b=!b)b=g+c,b<a.first||b>=a.first+a.size?b=!1:(g=b,b=l=t(a,b));if(b)h=
e?(0>c?$b:Zb)(l):0>c?l.text.length:0;else return!1}else h=d;return!0}var g=b.line,h=b.ch,k=c,l=t(a,g);if("char"==d)f();else if("column"==d)f(!0);else if("word"==d||"group"==d){var m=null;d="group"==d;for(var p=a.cm&&a.cm.getHelper(b,"wordChars"),n=!0;!(0>c)||f(!n);n=!1){var q=l.text.charAt(h)||"\n",q=nc(q,p)?"w":d&&"\n"==q?"n":!d||/\s/.test(q)?null:"p";!d||n||q||(q="s");if(m&&m!=q){0>c&&(c=1,f());break}q&&(m=q);if(0<c&&!f(!n))break}}k=Yc(a,r(g,h),b,k,!0);w(b,k)||(k.hitSide=!0);return k}function Te(a,
b,c,d){var e=a.doc,f=b.left,g;"page"==d?(g=Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight),g=Math.max(g-.5*va(a.display),3),g=(0<c?b.bottom:b.top)+c*g):"line"==d&&(g=0<c?b.bottom+3:b.top-3);for(;;){b=ed(a,f,g);if(!b.outside)break;if(0>c?0>=g:g>=e.height){b.hitSide=!0;break}g+=5*c}return b}function u(a,b,c,d){q.defaults[a]=b;c&&(Ka[a]=d?function(a,b,d){d!=Ed&&c(a,b,d)}:c)}function dg(a){var b=a.split(/-(?!$)/);a=b[b.length-1];for(var c,d,e,f,g=0;g<
b.length-1;g++){var h=b[g];if(/^(cmd|meta|m)$/i.test(h))f=!0;else if(/^a(lt)?$/i.test(h))c=!0;else if(/^(c|ctrl|control)$/i.test(h))d=!0;else if(/^s(hift)$/i.test(h))e=!0;else throw Error("Unrecognized modifier name: "+h);}c&&(a="Alt-"+a);d&&(a="Ctrl-"+a);f&&(a="Cmd-"+a);e&&(a="Shift-"+a);return a}function oc(a){return"string"==typeof a?ta[a]:a}function Wa(a,b,c,d,e){if(d&&d.shared)return eg(a,b,c,d,e);if(a.cm&&!a.cm.curOp)return G(a.cm,Wa)(a,b,c,d,e);var f=new Ga(a,e);e=w(b,c);d&&X(d,f,!1);if(0<
e||0==e&&!1!==f.clearWhenEmpty)return f;f.replacedWith&&(f.collapsed=!0,f.widgetNode=s("span",[f.replacedWith],"CodeMirror-widget"),d.handleMouseEvents||f.widgetNode.setAttribute("cm-ignore-events","true"),d.insertLeft&&(f.widgetNode.insertLeft=!0));if(f.collapsed){if(Ue(a,b.line,b,c,f)||b.line!=c.line&&Ue(a,c.line,b,c,f))throw Error("Inserting collapsed marker partially overlapping an existing one");ra=!0}f.addToHistory&&Ne(a,{from:b,to:c,origin:"markText"},a.sel,NaN);var g=b.line,h=a.cm,k;a.iter(g,
c.line+1,function(a){h&&f.collapsed&&!h.options.lineWrapping&&ia(a)==h.display.maxLine&&(k=!0);f.collapsed&&g!=b.line&&ca(a,0);var d=new pc(f,g==b.line?b.ch:null,g==c.line?c.ch:null);a.markedSpans=a.markedSpans?a.markedSpans.concat([d]):[d];d.marker.attachLine(a);++g});f.collapsed&&a.iter(b.line,c.line+1,function(b){wa(a,b)&&ca(b,0)});f.clearOnEnter&&v(f,"beforeCursorEnter",function(){f.clear()});f.readOnly&&(Le=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory());f.collapsed&&(f.id=
++rd,f.atomic=!0);if(h){k&&(h.curOp.updateMaxLine=!0);if(f.collapsed)M(h,b.line,c.line+1);else if(f.className||f.title||f.startStyle||f.endStyle||f.css)for(d=b.line;d<=c.line;d++)ma(h,d,"text");f.atomic&&ie(h.doc);R(h,"markerAdded",h,f)}return f}function eg(a,b,c,d,e){d=X(d);d.shared=!1;var f=[Wa(a,b,c,d,e)],g=f[0],h=d.widgetNode;Fa(a,function(a){h&&(d.widgetNode=h.cloneNode(!0));f.push(Wa(a,x(a,b),x(a,c),d,e));for(var l=0;l<a.linked.length;++l)if(a.linked[l].isParent)return;g=z(f)});return new qc(f,
g)}function Ve(a){return a.findMarks(r(a.first,0),a.clipPos(r(a.lastLine())),function(a){return a.parent})}function fg(a){for(var b=0;b<a.length;b++){var c=a[b],d=[c.primary.doc];Fa(c.primary.doc,function(a){d.push(a)});for(var e=0;e<c.markers.length;e++){var f=c.markers[e];-1==D(d,f.doc)&&(f.parent=null,c.markers.splice(e--,1))}}}function pc(a,b,c){this.marker=a;this.from=b;this.to=c}function xb(a,b){if(a)for(var c=0;c<a.length;++c){var d=a[c];if(d.marker==b)return d}}function md(a,b){if(b.full)return null;
var c=pb(a,b.from.line)&&t(a,b.from.line).markedSpans,d=pb(a,b.to.line)&&t(a,b.to.line).markedSpans;if(!c&&!d)return null;var e=b.from.ch,f=b.to.ch,g=0==w(b.from,b.to);if(c)for(var h=0,k;h<c.length;++h){var l=c[h],m=l.marker;if(null==l.from||(m.inclusiveLeft?l.from<=e:l.from<e)||!(l.from!=e||"bookmark"!=m.type||g&&l.marker.insertLeft)){var p=null==l.to||(m.inclusiveRight?l.to>=e:l.to>e);(k||(k=[])).push(new pc(m,l.from,p?null:l.to))}}c=k;if(d)for(var h=0,n;h<d.length;++h)if(k=d[h],l=k.marker,null==
k.to||(l.inclusiveRight?k.to>=f:k.to>f)||k.from==f&&"bookmark"==l.type&&(!g||k.marker.insertLeft))m=null==k.from||(l.inclusiveLeft?k.from<=f:k.from<f),(n||(n=[])).push(new pc(l,m?null:k.from-f,null==k.to?null:k.to-f));d=n;g=1==b.text.length;n=z(b.text).length+(g?e:0);if(c)for(f=0;f<c.length;++f)if(h=c[f],null==h.to)(k=xb(d,h.marker),k)?g&&(h.to=null==k.to?null:k.to+n):h.to=e;if(d)for(f=0;f<d.length;++f)h=d[f],null!=h.to&&(h.to+=n),null==h.from?(k=xb(c,h.marker),k||(h.from=n,g&&(c||(c=[])).push(h))):
(h.from+=n,g&&(c||(c=[])).push(h));c&&(c=We(c));d&&d!=c&&(d=We(d));e=[c];if(!g){var g=b.text.length-2,q;if(0<g&&c)for(f=0;f<c.length;++f)null==c[f].to&&(q||(q=[])).push(new pc(c[f].marker,null,null));for(f=0;f<g;++f)e.push(q);e.push(d)}return e}function We(a){for(var b=0;b<a.length;++b){var c=a[b];null!=c.from&&c.from==c.to&&!1!==c.marker.clearWhenEmpty&&a.splice(b--,1)}return a.length?a:null}function Pe(a,b){var c;if(c=b["spans_"+a.id]){for(var d=0,e=[];d<b.text.length;++d)e.push(gg(c[d]));c=e}else c=
null;d=md(a,b);if(!c)return d;if(!d)return c;for(e=0;e<c.length;++e){var f=c[e],g=d[e];if(f&&g){var h=0;a:for(;h<g.length;++h){for(var k=g[h],l=0;l<f.length;++l)if(f[l].marker==k.marker)continue a;f.push(k)}}else g&&(c[e]=g)}return c}function bg(a,b,c){var d=null;a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var b=0;b<a.markedSpans.length;++b){var c=a.markedSpans[b].marker;!c.readOnly||d&&-1!=D(d,c)||(d||(d=[])).push(c)}});if(!d)return null;a=[{from:b,to:c}];for(b=0;b<d.length;++b){c=d[b];
for(var e=c.find(0),f=0;f<a.length;++f){var g=a[f];if(!(0>w(g.to,e.from)||0<w(g.from,e.to))){var h=[f,1],k=w(g.from,e.from),l=w(g.to,e.to);(0>k||!c.inclusiveLeft&&!k)&&h.push({from:g.from,to:e.from});(0<l||!c.inclusiveRight&&!l)&&h.push({from:e.to,to:g.to});a.splice.apply(a,h);f+=h.length-1}}}return a}function Xe(a){var b=a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function Ye(a,b){if(b){for(var c=0;c<b.length;++c)b[c].marker.attachLine(a);a.markedSpans=
b}}function Ze(a,b){var c=a.lines.length-b.lines.length;if(0!=c)return c;var c=a.find(),d=b.find(),e=w(c.from,d.from)||(a.inclusiveLeft?-1:0)-(b.inclusiveLeft?-1:0);return e?-e:(c=w(c.to,d.to)||(a.inclusiveRight?1:0)-(b.inclusiveRight?1:0))?c:b.id-a.id}function xa(a,b){var c=ra&&a.markedSpans,d;if(c)for(var e,f=0;f<c.length;++f)e=c[f],e.marker.collapsed&&null==(b?e.from:e.to)&&(!d||0>Ze(d,e.marker))&&(d=e.marker);return d}function Ue(a,b,c,d,e){a=t(a,b);if(a=ra&&a.markedSpans)for(b=0;b<a.length;++b){var f=
a[b];if(f.marker.collapsed){var g=f.marker.find(0),h=w(g.from,c)||(f.marker.inclusiveLeft?-1:0)-(e.inclusiveLeft?-1:0),k=w(g.to,d)||(f.marker.inclusiveRight?1:0)-(e.inclusiveRight?1:0);if(!(0<=h&&0>=k||0>=h&&0<=k)&&(0>=h&&(f.marker.inclusiveRight&&e.inclusiveLeft?0<=w(g.to,c):0<w(g.to,c))||0<=h&&(f.marker.inclusiveRight&&e.inclusiveLeft?0>=w(g.from,d):0>w(g.from,d))))return!0}}}function ia(a){for(var b;b=xa(a,!0);)a=b.find(-1,!0).line;return a}function Nc(a,b){var c=t(a,b),d=ia(c);return c==d?b:F(d)}
function Kd(a,b){if(b>a.lastLine())return b;var c=t(a,b),d;if(!wa(a,c))return b;for(;d=xa(c,!1);)c=d.find(1,!0).line;return F(c)+1}function wa(a,b){var c=ra&&b.markedSpans;if(c)for(var d,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed&&(null==d.from||!d.marker.widgetNode&&0==d.from&&d.marker.inclusiveLeft&&sd(a,b,d)))return!0}function sd(a,b,c){if(null==c.to)return b=c.marker.find(1,!0),sd(a,b.line,xb(b.line.markedSpans,c.marker));if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var d,
e=0;e<b.markedSpans.length;++e)if(d=b.markedSpans[e],d.marker.collapsed&&!d.marker.widgetNode&&d.from==c.to&&(null==d.to||d.to!=c.from)&&(d.marker.inclusiveLeft||c.marker.inclusiveRight)&&sd(a,b,d))return!0}function tb(a){if(null!=a.height)return a.height;var b=a.doc.cm;if(!b)return 0;if(!Wc(document.body,a.node)){var c="position: relative;";a.coverGutter&&(c+="margin-left: -"+b.display.gutters.offsetWidth+"px;");a.noHScroll&&(c+="width: "+b.display.wrapper.clientWidth+"px;");U(b.display.measure,
s("div",[a.node],null,c))}return a.height=a.node.parentNode.offsetHeight}function hg(a,b,c,d){var e=new rc(a,c,d),f=a.cm;f&&e.noHScroll&&(f.display.alignWidgets=!0);mc(a,b,"widget",function(b){var c=b.widgets||(b.widgets=[]);null==e.insertAt?c.push(e):c.splice(Math.min(c.length-1,Math.max(0,e.insertAt)),0,e);e.line=b;f&&!wa(a,b)&&(c=ea(b)<a.scrollTop,ca(b,b.height+tb(e)),c&&kc(f,null,e.height),f.curOp.forceUpdate=!0);return!0});return e}function $e(a,b){if(a)for(;;){var c=a.match(/(?:^|\s+)line-(background-)?(\S+)/);
if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":"textClass";null==b[d]?b[d]=c[2]:(new RegExp("(?:^|s)"+c[2]+"(?:$|s)")).test(b[d])||(b[d]+=" "+c[2])}return a}function af(a,b){if(a.blankLine)return a.blankLine(b);if(a.innerMode){var c=q.innerMode(a,b);if(c.mode.blankLine)return c.mode.blankLine(c.state)}}function td(a,b,c,d){for(var e=0;10>e;e++){d&&(d[0]=q.innerMode(a,c).mode);var f=a.token(b,c);if(b.pos>b.start)return f}throw Error("Mode "+a.name+" failed to advance stream.");
}function bf(a,b,c,d){function e(a){return{start:m.start,end:m.pos,string:m.current(),type:h||null,state:a?sa(f.mode,l):l}}var f=a.doc,g=f.mode,h;b=x(f,b);var k=t(f,b.line),l=rb(a,b.line,c),m=new sc(k.text,a.options.tabSize),p;for(d&&(p=[]);(d||m.pos<b.ch)&&!m.eol();)m.start=m.pos,h=td(g,m,l),d&&p.push(e(!0));return d?p:e()}function cf(a,b,c,d,e,f,g){var h=c.flattenSpans;null==h&&(h=a.options.flattenSpans);var k=0,l=null,m=new sc(b,a.options.tabSize),p,n=a.options.addModeClass&&[null];for(""==b&&
$e(af(c,d),f);!m.eol();){m.pos>a.options.maxHighlightLength?(h=!1,g&&$c(a,b,d,m.pos),m.pos=b.length,p=null):p=$e(td(c,m,d,n),f);if(n){var q=n[0].name;q&&(p="m-"+(p?q+" "+p:q))}if(!h||l!=p){for(;k<m.start;)k=Math.min(m.start,k+5E3),e(k,l);l=p}m.start=m.pos}for(;k<m.pos;)a=Math.min(m.pos,k+5E3),e(a,l),k=a}function ne(a,b,c,d){var e=[a.state.modeGen],f={};cf(a,b.text,a.doc.mode,c,function(a,b){e.push(a,b)},f,d);for(c=0;c<a.state.overlays.length;++c){var g=a.state.overlays[c],h=1,k=0;cf(a,b.text,g.mode,
!0,function(a,b){for(var c=h;k<a;){var d=e[h];d>a&&e.splice(h,1,a,e[h+1],d);h+=2;k=Math.min(a,d)}if(b)if(g.opaque)e.splice(c,h-c,a,"cm-overlay "+b),h=c+2;else for(;c<h;c+=2)d=e[c+1],e[c+1]=(d?d+" ":"")+"cm-overlay "+b},f)}return{styles:e,classes:f.bgClass||f.textClass?f:null}}function df(a,b,c){if(!b.styles||b.styles[0]!=a.state.modeGen){var d=rb(a,F(b)),e=ne(a,b,b.text.length>a.options.maxHighlightLength?sa(a.doc.mode,d):d);b.stateAfter=d;b.styles=e.styles;e.classes?b.styleClasses=e.classes:b.styleClasses&&
(b.styleClasses=null);c===a.doc.frontier&&a.doc.frontier++}return b.styles}function $c(a,b,c,d){var e=a.doc.mode;a=new sc(b,a.options.tabSize);a.start=a.pos=d||0;for(""==b&&af(e,c);!a.eol();)td(e,a,c),a.start=a.pos}function ef(a,b){if(!a||/^\s*$/.test(a))return null;var c=b.addModeClass?ig:jg;return c[a]||(c[a]=a.replace(/\S+/g,"cm-$\x26"))}function Rd(a,b){var c=s("span",null,null,K?"padding-right: .1px":null),c={pre:s("pre",[c],"CodeMirror-line"),content:c,col:0,pos:0,cm:a,trailingSpace:!1,splitSpaces:(A||
K)&&a.getOption("lineWrapping")};b.measure={};for(var d=0;d<=(b.rest?b.rest.length:0);d++){var e=d?b.rest[d-1]:b.line,f;c.pos=0;c.addToken=kg;var g;g=a.display.measure;if(null!=ud)g=ud;else{var h=U(g,document.createTextNode("AخA")),k=Sa(h,0,1).getBoundingClientRect(),h=Sa(h,1,2).getBoundingClientRect();pa(g);g=k&&k.left!=k.right?ud=3>h.right-k.right:!1}g&&(f=Z(e))&&(c.addToken=lg(c.addToken,f));c.map=[];k=b!=a.display.externalMeasured&&F(e);a:{g=c;var k=df(a,e,k),h=e.markedSpans,l=e.text,m=0;if(h)for(var p=
l.length,n=0,q=1,r="",t=void 0,v=void 0,u=0,w=void 0,x=void 0,z=void 0,B=void 0,y=void 0;;){if(u==n){for(var w=x=z=B=v="",y=null,u=Infinity,G=[],H,C=0;C<h.length;++C){var I=h[C],D=I.marker;"bookmark"==D.type&&I.from==n&&D.widgetNode?G.push(D):I.from<=n&&(null==I.to||I.to>n||D.collapsed&&I.to==n&&I.from==n)?(null!=I.to&&I.to!=n&&u>I.to&&(u=I.to,x=""),D.className&&(w+=" "+D.className),D.css&&(v=(v?v+";":"")+D.css),D.startStyle&&I.from==n&&(z+=" "+D.startStyle),D.endStyle&&I.to==u&&(H||(H=[])).push(D.endStyle,
I.to),D.title&&!B&&(B=D.title),D.collapsed&&(!y||0>Ze(y.marker,D))&&(y=I)):I.from>n&&u>I.from&&(u=I.from)}if(H)for(C=0;C<H.length;C+=2)H[C+1]==u&&(x+=" "+H[C]);if(!y||y.from==n)for(C=0;C<G.length;++C)ff(g,0,G[C]);if(y&&(y.from||0)==n){ff(g,(null==y.to?p+1:y.to)-n,y.marker,null==y.from);if(null==y.to)break a;y.to==n&&(y=!1)}}if(n>=p)break;for(G=Math.min(p,u);;){if(r){C=n+r.length;y||(I=C>G?r.slice(0,G-n):r,g.addToken(g,I,t?t+w:w,z,n+I.length==u?x:"",B,v));if(C>=G){r=r.slice(G-n);n=G;break}n=C;z=""}r=
l.slice(m,m=k[q++]);t=ef(k[q++],g.cm.options)}}else for(var q=1;q<k.length;q+=2)g.addToken(g,l.slice(m,m=k[q]),ef(k[q+1],g.cm.options))}e.styleClasses&&(e.styleClasses.bgClass&&(c.bgClass=vd(e.styleClasses.bgClass,c.bgClass||"")),e.styleClasses.textClass&&(c.textClass=vd(e.styleClasses.textClass,c.textClass||"")));0==c.map.length&&c.map.push(0,0,c.content.appendChild(mg(a.display.measure)));0==d?(b.measure.map=c.map,b.measure.cache={}):((b.measure.maps||(b.measure.maps=[])).push(c.map),(b.measure.caches||
(b.measure.caches=[])).push({}))}K&&(f=c.content.lastChild,/\bcm-tab\b/.test(f.className)||f.querySelector&&f.querySelector(".cm-tab"))&&(c.content.className="cm-tab-wrap-hack");J(a,"renderLine",a,b.line,c.pre);c.pre.className&&(c.textClass=vd(c.pre.className,c.textClass||""));return c}function kg(a,b,c,d,e,f,g){if(b){var h;if(a.splitSpaces)if(h=a.trailingSpace,1<b.length&&!/  /.test(b))h=b;else{for(var k="",l=0;l<b.length;l++){var m=b.charAt(l);" "!=m||!h||l!=b.length-1&&32!=b.charCodeAt(l+1)||(m=
" ");k+=m;h=" "==m}h=k}else h=b;k=h;l=a.cm.state.specialChars;m=!1;if(l.test(b)){h=document.createDocumentFragment();for(var p=0;;){l.lastIndex=p;var n=l.exec(b),q=n?n.index-p:b.length-p;if(q){var r=document.createTextNode(k.slice(p,p+q));A&&9>B?h.appendChild(s("span",[r])):h.appendChild(r);a.map.push(a.pos,a.pos+q,r);a.col+=q;a.pos+=q}if(!n)break;p+=q+1;"\t"==n[0]?(r=a.cm.options.tabSize,n=r-a.col%r,r=h.appendChild(s("span",pd(n),"cm-tab")),r.setAttribute("role","presentation"),r.setAttribute("cm-text",
"\t"),a.col+=n):("\r"==n[0]||"\n"==n[0]?(r=h.appendChild(s("span","\r"==n[0]?"␍":"␤","cm-invalidchar")),r.setAttribute("cm-text",n[0])):(r=a.cm.options.specialCharPlaceholder(n[0]),r.setAttribute("cm-text",n[0]),A&&9>B?h.appendChild(s("span",[r])):h.appendChild(r)),a.col+=1);a.map.push(a.pos,a.pos+1,r);a.pos++}}else a.col+=b.length,h=document.createTextNode(k),a.map.push(a.pos,a.pos+b.length,h),A&&9>B&&(m=!0),a.pos+=b.length;a.trailingSpace=32==k.charCodeAt(b.length-1);if(c||d||e||m||g)return b=c||
"",d&&(b+=d),e&&(b+=e),d=s("span",[h],b,g),f&&(d.title=f),a.content.appendChild(d);a.content.appendChild(h)}}function lg(a,b){return function(c,d,e,f,g,h,k){e=e?e+" cm-force-border":"cm-force-border";for(var l=c.pos,m=l+d.length;;){for(var p=0;p<b.length;p++){var n=b[p];if(n.to>l&&n.from<=l)break}if(n.to>=m)return a(c,d,e,f,g,h,k);a(c,d.slice(0,n.to-l),e,f,null,h,k);f=null;d=d.slice(n.to-l);l=n.to}}}function ff(a,b,c,d){var e=!d&&c.widgetNode;e&&a.map.push(a.pos,a.pos+b,e);!d&&a.cm.display.input.needsContentAttribute&&
(e||(e=a.content.appendChild(document.createElement("span"))),e.setAttribute("cm-marker",c.id));e&&(a.cm.display.input.setUneditable(e),a.content.appendChild(e));a.pos+=b;a.trailingSpace=!1}function Re(a,b){return 0==b.from.ch&&0==b.to.ch&&""==z(b.text)&&(!a.cm||a.cm.options.wholeLineUpdateBefore)}function od(a,b,c,d){function e(a,c,e){a.text=c;a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null);null!=a.order&&(a.order=null);Xe(a);Ye(a,e);c=d?d(a):1;c!=a.height&&ca(a,c);R(a,"change",a,b)}
function f(a,b){for(var e=a,f=[];e<b;++e)f.push(new yb(k[e],c?c[e]:null,d));return f}var g=b.from,h=b.to,k=b.text,l=t(a,g.line),m=t(a,h.line),p=z(k),n=c?c[k.length-1]:null,q=h.line-g.line;if(b.full)a.insert(0,f(0,k.length)),a.remove(k.length,a.size-k.length);else if(Re(a,b)){var r=f(0,k.length-1);e(m,m.text,n);q&&a.remove(g.line,q);r.length&&a.insert(g.line,r)}else l==m?1==k.length?e(l,l.text.slice(0,g.ch)+p+l.text.slice(h.ch),n):(r=f(1,k.length-1),r.push(new yb(p+l.text.slice(h.ch),n,d)),e(l,l.text.slice(0,
g.ch)+k[0],c?c[0]:null),a.insert(g.line+1,r)):1==k.length?(e(l,l.text.slice(0,g.ch)+k[0]+m.text.slice(h.ch),c?c[0]:null),a.remove(g.line+1,q)):(e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null),e(m,p+m.text.slice(h.ch),n),r=f(1,k.length-1),1<q&&a.remove(g.line+1,q-1),a.insert(g.line+1,r));R(a,"change",a,b)}function zb(a){this.lines=a;this.parent=null;for(var b=0,c=0;b<a.length;++b)a[b].parent=this,c+=a[b].height;this.height=c}function Ab(a){this.children=a;for(var b=0,c=0,d=0;d<a.length;++d){var e=a[d],
b=b+e.chunkSize(),c=c+e.height;e.parent=this}this.size=b;this.height=c;this.parent=null}function Fa(a,b,c){function d(a,f,g){if(a.linked)for(var h=0;h<a.linked.length;++h){var k=a.linked[h];if(k.doc!=f){var l=g&&k.sharedHist;if(!c||l)b(k.doc,l),d(k.doc,a,l)}}}d(a,null,!0)}function Dd(a,b){if(b.cm)throw Error("This document is already in use.");a.doc=b;b.cm=a;Bc(a);Ac(a);a.options.lineWrapping||Ec(a);a.options.mode=b.modeOption;M(a)}function t(a,b){b-=a.first;if(0>b||b>=a.size)throw Error("There is no line "+
(b+a.first)+" in the document.");for(var c=a;!c.lines;)for(var d=0;;++d){var e=c.children[d],f=e.chunkSize();if(b<f){c=e;break}b-=f}return c.lines[b]}function Ba(a,b,c){var d=[],e=b.line;a.iter(b.line,c.line+1,function(a){a=a.text;e==c.line&&(a=a.slice(0,c.ch));e==b.line&&(a=a.slice(b.ch));d.push(a);++e});return d}function wd(a,b,c){var d=[];a.iter(b,c,function(a){d.push(a.text)});return d}function ca(a,b){var c=b-a.height;if(c)for(var d=a;d;d=d.parent)d.height+=c}function F(a){if(null==a.parent)return null;
var b=a.parent;a=D(b.lines,a);for(var c=b.parent;c;b=c,c=c.parent)for(var d=0;c.children[d]!=b;++d)a+=c.children[d].chunkSize();return a+b.first}function ya(a,b){var c=a.first;a:do{for(var d=0;d<a.children.length;++d){var e=a.children[d],f=e.height;if(b<f){a=e;continue a}b-=f;c+=e.chunkSize()}return c}while(!a.lines);for(d=0;d<a.lines.length;++d){e=a.lines[d].height;if(b<e)break;b-=e}return c+d}function ea(a){a=ia(a);for(var b=0,c=a.parent,d=0;d<c.lines.length;++d){var e=c.lines[d];if(e==a)break;
else b+=e.height}for(a=c.parent;a;c=a,a=c.parent)for(d=0;d<a.children.length&&(e=a.children[d],e!=c);++d)b+=e.height;return b}function Z(a){var b=a.order;null==b&&(b=a.order=ng(a.text));return b}function tc(a){this.done=[];this.undone=[];this.undoDepth=Infinity;this.lastModTime=this.lastSelTime=0;this.lastOrigin=this.lastSelOrigin=this.lastOp=this.lastSelOp=null;this.generation=this.maxGeneration=a||1}function nd(a,b){var c={from:Sc(b.from),to:Ea(b),text:Ba(a,b.from,b.to)};gf(a,c,b.from.line,b.to.line+
1);Fa(a,function(a){gf(a,c,b.from.line,b.to.line+1)},!0);return c}function ee(a){for(;a.length;)if(z(a).ranges)a.pop();else break}function Ne(a,b,c,d){var e=a.history;e.undone.length=0;var f=+new Date,g,h;if(h=e.lastOp==d||e.lastOrigin==b.origin&&b.origin&&("+"==b.origin.charAt(0)&&a.cm&&e.lastModTime>f-a.cm.options.historyEventDelay||"*"==b.origin.charAt(0)))e.lastOp==d?(ee(e.done),g=z(e.done)):e.done.length&&!z(e.done).ranges?g=z(e.done):1<e.done.length&&!e.done[e.done.length-2].ranges?(e.done.pop(),
g=z(e.done)):g=void 0,h=g;if(h){var k=z(g.changes);0==w(b.from,b.to)&&0==w(b.from,k.to)?k.to=Ea(b):g.changes.push(nd(a,b))}else for((g=z(e.done))&&g.ranges||Ub(a.sel,e.done),g={changes:[nd(a,b)],generation:e.generation},e.done.push(g);e.done.length>e.undoDepth;)e.done.shift(),e.done[0].ranges||e.done.shift();e.done.push(c);e.generation=++e.maxGeneration;e.lastModTime=e.lastSelTime=f;e.lastOp=e.lastSelOp=d;e.lastOrigin=e.lastSelOrigin=b.origin;k||J(a,"historyAdded")}function Ub(a,b){var c=z(b);c&&
c.ranges&&c.equals(a)||b.push(a)}function gf(a,b,c,d){var e=b["spans_"+a.id],f=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(c){c.markedSpans&&((e||(e=b["spans_"+a.id]={}))[f]=c.markedSpans);++f})}function gg(a){if(!a)return null;for(var b=0,c;b<a.length;++b)a[b].marker.explicitlyCleared?c||(c=a.slice(0,b)):c&&c.push(a[b]);return c?c.length?c:null:a}function Xa(a,b,c){for(var d=0,e=[];d<a.length;++d){var f=a[d];if(f.ranges)e.push(c?ka.prototype.deepCopy.call(f):f);else{var f=f.changes,
g=[];e.push({changes:g});for(var h=0;h<f.length;++h){var k=f[h],l;g.push({from:k.from,to:k.to,text:k.text});if(b)for(var m in k)(l=m.match(/^spans_(\d+)$/))&&-1<D(b,Number(l[1]))&&(z(g)[m]=k[m],delete k[m])}}}return e}function hf(a,b,c,d){c<a.line?a.line+=d:b<a.line&&(a.line=b,a.ch=0)}function jf(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e],g=!0;if(f.ranges){f.copied||(f=a[e]=f.deepCopy(),f.copied=!0);for(var h=0;h<f.ranges.length;h++)hf(f.ranges[h].anchor,b,c,d),hf(f.ranges[h].head,b,c,d)}else{for(h=
0;h<f.changes.length;++h){var k=f.changes[h];if(c<k.from.line)k.from=r(k.from.line+d,k.from.ch),k.to=r(k.to.line+d,k.to.ch);else if(b<=k.to.line){g=!1;break}}g||(a.splice(0,e+1),e=0)}}}function Oe(a,b){var c=b.from.line,d=b.to.line,e=b.text.length-(d-c)-1;jf(a.done,c,d,e);jf(a.undone,c,d,e)}function jd(a){return null!=a.defaultPrevented?a.defaultPrevented:0==a.returnValue}function Ce(a){var b=a.which;null==b&&(a.button&1?b=1:a.button&2?b=3:a.button&4&&(b=2));Y&&a.ctrlKey&&1==b&&(b=3);return b}function uc(a,
b,c){a=a._handlers&&a._handlers[b];return c?a&&0<a.length?a.slice():kf:a||kf}function R(a,b){function c(a){return function(){a.apply(null,e)}}var d=uc(a,b,!1);if(d.length){var e=Array.prototype.slice.call(arguments,2),f;Ta?f=Ta.delayedCallbacks:Bb?f=Bb:(f=Bb=[],setTimeout(og,0));for(var g=0;g<d.length;++g)f.push(c(d[g]))}}function og(){var a=Bb;Bb=null;for(var b=0;b<a.length;++b)a[b]()}function H(a,b,c){"string"==typeof b&&(b={type:b,preventDefault:function(){this.defaultPrevented=!0}});J(a,c||b.type,
a,b);return jd(b)||b.codemirrorIgnore}function he(a){var b=a._handlers&&a._handlers.cursorActivity;if(b){a=a.curOp.cursorActivityHandlers||(a.curOp.cursorActivityHandlers=[]);for(var c=0;c<b.length;++c)-1==D(a,b[c])&&a.push(b[c])}}function W(a,b){return 0<uc(a,b).length}function Ya(a){a.prototype.on=function(a,c){v(this,a,c)};a.prototype.off=function(a,c){ja(this,a,c)}}function ua(){this.id=null}function pd(a){for(;vc.length<=a;)vc.push(z(vc)+" ");return vc[a]}function z(a){return a[a.length-1]}function D(a,
b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}function Pb(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d);return c}function pg(a,b,c){for(var d=0,e=c(b);d<a.length&&c(a[d])<=e;)d++;a.splice(d,0,b)}function Cb(){}function lf(a,b){var c;Object.create?c=Object.create(a):(Cb.prototype=a,c=new Cb);b&&X(b,c);return c}function X(a,b,c){b||(b={});for(var d in a)!a.hasOwnProperty(d)||!1===c&&b.hasOwnProperty(d)||(b[d]=a[d]);return b}function xc(a){var b=Array.prototype.slice.call(arguments,
1);return function(){return a.apply(null,b)}}function nc(a,b){return b?-1<b.source.indexOf("\\w")&&mf(a)?!0:b.test(a):mf(a)}function nf(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function sb(a){return 768<=a.charCodeAt(0)&&qg.test(a)}function s(a,b,c,d){a=document.createElement(a);c&&(a.className=c);d&&(a.style.cssText=d);if("string"==typeof b)a.appendChild(document.createTextNode(b));else if(b)for(c=0;c<b.length;++c)a.appendChild(b[c]);return a}function pa(a){for(var b=a.childNodes.length;0<
b;--b)a.removeChild(a.firstChild);return a}function U(a,b){return pa(a).appendChild(b)}function fa(){for(var a=document.activeElement;a&&a.root&&a.root.activeElement;)a=a.root.activeElement;return a}function Db(a){return new RegExp("(^|\\s)"+a+"(?:$|\\s)\\s*")}function vd(a,b){for(var c=a.split(" "),d=0;d<c.length;d++)c[d]&&!Db(c[d]).test(b)&&(b+=" "+c[d]);return b}function of(a){if(document.body.getElementsByClassName)for(var b=document.body.getElementsByClassName("CodeMirror"),c=0;c<b.length;c++){var d=
b[c].CodeMirror;d&&a(d)}}function zf(){var a;v(window,"resize",function(){null==a&&(a=setTimeout(function(){a=null;of(Pf)},100))});v(window,"blur",function(){of(bb)})}function mg(a){if(null==xd){var b=s("span","​");U(a,s("span",[b,document.createTextNode("x")]));0!=a.firstChild.offsetHeight&&(xd=1>=b.offsetWidth&&2<b.offsetHeight&&!(A&&8>B))}a=xd?s("span","​"):s("span"," ",null,"display: inline-block; width: 1px; margin-right: -1px");a.setAttribute("cm-text","");return a}function Gf(a,b,c,d){if(!a)return d(b,
c,"ltr");for(var e=!1,f=0;f<a.length;++f){var g=a[f];if(g.from<c&&g.to>b||b==c&&g.to==b)d(Math.max(g.from,b),Math.min(g.to,c),1==g.level?"rtl":"ltr"),e=!0}e||d(b,c,"ltr")}function cd(a){return a.level%2?a.to:a.from}function dd(a){return a.level%2?a.from:a.to}function Zb(a){return(a=Z(a))?cd(a[0]):0}function $b(a){var b=Z(a);return b?dd(z(b)):a.text.length}function pf(a,b){var c=t(a.doc,b),d=ia(c);d!=c&&(b=F(d));d=(c=Z(d))?c[0].level%2?$b(d):Zb(d):0;return r(b,d)}function qf(a,b){var c=pf(a,b.line),
d=t(a.doc,c.line),e=Z(d);return e&&0!=e[0].level?c:(d=Math.max(0,d.text.search(/\S/)),r(c.line,b.line==c.line&&b.ch<=d&&b.ch?0:d))}function Qb(a,b){ub=null;for(var c=0,d;c<a.length;++c){var e=a[c];if(e.from<b&&e.to>b)return c;if(e.from==b||e.to==b)if(null==d)d=c;else{var f;f=e.level;var g=a[d].level,h=a[0].level;f=f==h?!0:g==h?!1:f<g;if(f)return e.from!=e.to&&(ub=d),c;e.from!=e.to&&(ub=c);break}}return d}function yd(a,b,c,d){if(!d)return b+c;do b+=c;while(0<b&&sb(a.text.charAt(b)));return b}function fd(a,
b,c,d){var e=Z(a);if(!e)return Se(a,b,c,d);var f=Qb(e,b),g=e[f];for(b=yd(a,b,g.level%2?-c:c,d);;){if(b>g.from&&b<g.to)return b;if(b==g.from||b==g.to){if(Qb(e,b)==f)return b;g=e[f+c];return 0<c==g.level%2?g.to:g.from}g=e[f+=c];if(!g)return null;b=0<c==g.level%2?yd(a,g.to,-1,d):yd(a,g.from,1,d)}}function Se(a,b,c,d){b+=c;if(d)for(;0<b&&sb(a.text.charAt(b));)b+=c;return 0>b||b>a.text.length?null:b}var S=navigator.userAgent,rf=navigator.platform,oa=/gecko\/\d/i.test(S),sf=/MSIE \d/.test(S),tf=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(S),
A=sf||tf,B=A&&(sf?document.documentMode||6:tf[1]),K=/WebKit\//.test(S),rg=K&&/Qt\/\d+\.\d+/.test(S),sg=/Chrome\//.test(S),ba=/Opera\//.test(S),xe=/Apple Computer/.test(navigator.vendor),tg=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(S),Mf=/PhantomJS/.test(S),ob=/AppleWebKit/.test(S)&&/Mobile\/\w+/.test(S),ab=ob||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(S),Y=ob||/Mac/.test(rf),Vf=/\bCrOS\b/.test(S),ug=/win/i.test(rf),Ha=ba&&S.match(/Version\/(\d*\.\d*)/);Ha&&(Ha=Number(Ha[1]));Ha&&15<=
Ha&&(ba=!1,K=!0);var uf=Y&&(rg||ba&&(null==Ha||12.11>Ha)),hd=oa||A&&9<=B,Le=!1,ra=!1;Gc.prototype=X({update:function(a){var b=a.scrollWidth>a.clientWidth+1,c=a.scrollHeight>a.clientHeight+1,d=a.nativeBarWidth;c?(this.vert.style.display="block",this.vert.style.bottom=b?d+"px":"0",this.vert.firstChild.style.height=Math.max(0,a.scrollHeight-a.clientHeight+(a.viewHeight-(b?d:0)))+"px"):(this.vert.style.display="",this.vert.firstChild.style.height="0");b?(this.horiz.style.display="block",this.horiz.style.right=
c?d+"px":"0",this.horiz.style.left=a.barLeft+"px",this.horiz.firstChild.style.width=a.scrollWidth-a.clientWidth+(a.viewWidth-a.barLeft-(c?d:0))+"px"):(this.horiz.style.display="",this.horiz.firstChild.style.width="0");!this.checkedZeroWidth&&0<a.clientHeight&&(0==d&&this.zeroWidthHack(),this.checkedZeroWidth=!0);return{right:c?d:0,bottom:b?d:0}},setScrollLeft:function(a){this.horiz.scrollLeft!=a&&(this.horiz.scrollLeft=a);this.disableHoriz&&this.enableZeroWidthBar(this.horiz,this.disableHoriz)},setScrollTop:function(a){this.vert.scrollTop!=
a&&(this.vert.scrollTop=a);this.disableVert&&this.enableZeroWidthBar(this.vert,this.disableVert)},zeroWidthHack:function(){this.horiz.style.height=this.vert.style.width=Y&&!tg?"12px":"18px";this.horiz.style.pointerEvents=this.vert.style.pointerEvents="none";this.disableHoriz=new ua;this.disableVert=new ua},enableZeroWidthBar:function(a,b){function c(){var d=a.getBoundingClientRect();document.elementFromPoint(d.left+1,d.bottom-1)!=a?a.style.pointerEvents="none":b.set(1E3,c)}a.style.pointerEvents="auto";
b.set(1E3,c)},clear:function(){var a=this.horiz.parentNode;a.removeChild(this.horiz);a.removeChild(this.vert)}},Gc.prototype);Hc.prototype=X({update:function(){return{bottom:0,right:0}},setScrollLeft:function(){},setScrollTop:function(){},clear:function(){}},Hc.prototype);q.scrollbarModel={"native":Gc,"null":Hc};Kb.prototype.signal=function(a,b){W(a,b)&&this.events.push(arguments)};Kb.prototype.finish=function(){for(var a=0;a<this.events.length;a++)J.apply(null,this.events[a])};var r=q.Pos=function(a,
b){if(!(this instanceof r))return new r(a,b);this.line=a;this.ch=b},w=q.cmpPos=function(a,b){return a.line-b.line||a.ch-b.ch},P=null;Tc.prototype=X({init:function(a){function b(a){if(!H(d,a)){if(d.somethingSelected())P={lineWise:!1,text:d.getSelections()},c.inaccurateSelection&&(c.prevInput="",c.inaccurateSelection=!1,f.value=P.text.join("\n"),Za(f));else if(d.options.lineWiseCopyCut){var b=Wd(d);P={lineWise:!0,text:b.text};"cut"==a.type?d.setSelections(b.ranges,null,ha):(c.prevInput="",f.value=b.text.join("\n"),
Za(f))}else return;"cut"==a.type&&(d.state.cutIncoming=!0)}}var c=this,d=this.cm,e=this.wrapper=Yd(),f=this.textarea=e.firstChild;a.wrapper.insertBefore(e,a.wrapper.firstChild);ob&&(f.style.width="0px");v(f,"input",function(){A&&9<=B&&c.hasSelection&&(c.hasSelection=null);c.poll()});v(f,"paste",function(a){H(d,a)||Vd(a,d)||(d.state.pasteIncoming=!0,c.fastPoll())});v(f,"cut",b);v(f,"copy",b);v(a.scroller,"paste",function(b){na(a,b)||H(d,b)||(d.state.pasteIncoming=!0,c.focus())});v(a.lineSpace,"selectstart",
function(b){na(a,b)||O(b)});v(f,"compositionstart",function(){var a=d.getCursor("from");c.composing&&c.composing.range.clear();c.composing={start:a,range:d.markText(a,d.getCursor("to"),{className:"CodeMirror-composing"})}});v(f,"compositionend",function(){c.composing&&(c.poll(),c.composing.range.clear(),c.composing=null)})},prepareSelection:function(){var a=this.cm,b=a.display,c=a.doc,d=ke(a);if(a.options.moveInputWithCursor){var a=la(a,c.sel.primary().head,"div"),c=b.wrapper.getBoundingClientRect(),
e=b.lineDiv.getBoundingClientRect();d.teTop=Math.max(0,Math.min(b.wrapper.clientHeight-10,a.top+e.top-c.top));d.teLeft=Math.max(0,Math.min(b.wrapper.clientWidth-10,a.left+e.left-c.left))}return d},showSelection:function(a){var b=this.cm.display;U(b.cursorDiv,a.cursors);U(b.selectionDiv,a.selection);null!=a.teTop&&(this.wrapper.style.top=a.teTop+"px",this.wrapper.style.left=a.teLeft+"px")},reset:function(a){if(!this.contextMenuPending){var b,c,d=this.cm,e=d.doc;d.somethingSelected()?(this.prevInput=
"",b=e.sel.primary(),c=(b=He&&(100<b.to().line-b.from().line||1E3<(c=d.getSelection()).length))?"-":c||d.getSelection(),this.textarea.value=c,d.state.focused&&Za(this.textarea),A&&9<=B&&(this.hasSelection=c)):a||(this.prevInput=this.textarea.value="",A&&9<=B&&(this.hasSelection=null));this.inaccurateSelection=b}},getField:function(){return this.textarea},supportsTouch:function(){return!1},focus:function(){if("nocursor"!=this.cm.options.readOnly&&(!ab||fa()!=this.textarea))try{this.textarea.focus()}catch(a){}},
blur:function(){this.textarea.blur()},resetPosition:function(){this.wrapper.style.top=this.wrapper.style.left=0},receivedFocus:function(){this.slowPoll()},slowPoll:function(){var a=this;a.pollingFast||a.polling.set(this.cm.options.pollInterval,function(){a.poll();a.cm.state.focused&&a.slowPoll()})},fastPoll:function(){function a(){c.poll()||b?(c.pollingFast=!1,c.slowPoll()):(b=!0,c.polling.set(60,a))}var b=!1,c=this;c.pollingFast=!0;c.polling.set(20,a)},poll:function(){var a=this.cm,b=this.textarea,
c=this.prevInput;if(this.contextMenuPending||!a.state.focused||vg(b)&&!c&&!this.composing||a.isReadOnly()||a.options.disableInput||a.state.keySeq)return!1;var d=b.value;if(d==c&&!a.somethingSelected())return!1;if(A&&9<=B&&this.hasSelection===d||Y&&/[\uf700-\uf7ff]/.test(d))return a.display.input.reset(),!1;if(a.doc.sel==a.display.selForContextMenu){var e=d.charCodeAt(0);8203!=e||c||(c="​");if(8666==e)return this.reset(),this.cm.execCommand("undo")}for(var f=0,e=Math.min(c.length,d.length);f<e&&c.charCodeAt(f)==
d.charCodeAt(f);)++f;var g=this;T(a,function(){Ob(a,d.slice(f),c.length-f,null,g.composing?"*compose":null);1E3<d.length||-1<d.indexOf("\n")?b.value=g.prevInput="":g.prevInput=d;g.composing&&(g.composing.range.clear(),g.composing.range=a.markText(g.composing.start,a.getCursor("to"),{className:"CodeMirror-composing"}))});return!0},ensurePolled:function(){this.pollingFast&&this.poll()&&(this.pollingFast=!1)},onKeyPress:function(){A&&9<=B&&(this.hasSelection=null);this.fastPoll()},onContextMenu:function(a){function b(){if(null!=
g.selectionStart){var a=e.somethingSelected(),b="​"+(a?g.value:"");g.value="⇚";g.value=b;d.prevInput=a?"":"​";g.selectionStart=1;g.selectionEnd=b.length;f.selForContextMenu=e.doc.sel}}function c(){d.contextMenuPending=!1;d.wrapper.style.cssText=m;g.style.cssText=l;A&&9>B&&f.scrollbars.setScrollTop(f.scroller.scrollTop=k);if(null!=g.selectionStart){(!A||A&&9>B)&&b();var a=0,c=function(){f.selForContextMenu==e.doc.sel&&0==g.selectionStart&&0<g.selectionEnd&&"​"==d.prevInput?G(e,hc.selectAll)(e):10>
a++?f.detectingSelectAll=setTimeout(c,500):f.input.reset()};f.detectingSelectAll=setTimeout(c,200)}}var d=this,e=d.cm,f=e.display,g=d.textarea,h=Da(e,a),k=f.scroller.scrollTop;if(h&&!ba){e.options.resetSelectionOnContextMenu&&-1==e.doc.sel.contains(h)&&G(e,C)(e.doc,ga(h),ha);var l=g.style.cssText,m=d.wrapper.style.cssText;d.wrapper.style.cssText="position: absolute";h=d.wrapper.getBoundingClientRect();g.style.cssText="position: absolute; width: 30px; height: 30px; top: "+(a.clientY-h.top-5)+"px; left: "+
(a.clientX-h.left-5)+"px; z-index: 1000; background: "+(A?"rgba(255, 255, 255, .05)":"transparent")+"; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity\x3d5);";if(K)var p=window.scrollY;f.input.focus();K&&window.scrollTo(null,p);f.input.reset();e.somethingSelected()||(g.value=d.prevInput=" ");d.contextMenuPending=!0;f.selForContextMenu=e.doc.sel;clearTimeout(f.detectingSelectAll);A&&9<=B&&b();if(hd){cc(a);var n=function(){ja(window,"mouseup",n);
setTimeout(c,20)};v(window,"mouseup",n)}else setTimeout(c,50)}},readOnlyChanged:function(a){a||this.reset()},setUneditable:Cb,needsContentAttribute:!1},Tc.prototype);Uc.prototype=X({init:function(a){function b(a){if(!H(d,a)){if(d.somethingSelected())P={lineWise:!1,text:d.getSelections()},"cut"==a.type&&d.replaceSelection("",null,"cut");else if(d.options.lineWiseCopyCut){var b=Wd(d);P={lineWise:!0,text:b.text};"cut"==a.type&&d.operation(function(){d.setSelections(b.ranges,0,ha);d.replaceSelection("",
null,"cut")})}else return;if(a.clipboardData){a.clipboardData.clearData();var h=P.text.join("\n");a.clipboardData.setData("Text",h);if(a.clipboardData.getData("Text")==h){a.preventDefault();return}}var k=Yd();a=k.firstChild;d.display.lineSpace.insertBefore(k,d.display.lineSpace.firstChild);a.value=P.text.join("\n");var l=document.activeElement;Za(a);setTimeout(function(){d.display.lineSpace.removeChild(k);l.focus();l==e&&c.showPrimarySelection()},50)}}var c=this,d=c.cm,e=c.div=a.lineDiv;Xd(e,d.options.spellcheck);
v(e,"paste",function(a){H(d,a)||Vd(a,d)||11>=B&&setTimeout(G(d,function(){c.pollContent()||M(d)}),20)});v(e,"compositionstart",function(a){a=a.data;c.composing={sel:d.doc.sel,data:a,startData:a};if(a){var b=d.doc.sel.primary(),e=d.getLine(b.head.line).indexOf(a,Math.max(0,b.head.ch-a.length));-1<e&&e<=b.head.ch&&(c.composing.sel=ga(r(b.head.line,e),r(b.head.line,e+a.length)))}});v(e,"compositionupdate",function(a){c.composing.data=a.data});v(e,"compositionend",function(a){var b=c.composing;b&&(a.data==
b.startData||/\u200b/.test(a.data)||(b.data=a.data),setTimeout(function(){b.handled||c.applyComposition(b);c.composing==b&&(c.composing=null)},50))});v(e,"touchstart",function(){c.forceCompositionEnd()});v(e,"input",function(){c.composing||!d.isReadOnly()&&c.pollContent()||T(c.cm,function(){M(d)})});v(e,"copy",b);v(e,"cut",b)},prepareSelection:function(){var a=ke(this.cm,!1);a.focus=this.cm.state.focused;return a},showSelection:function(a,b){a&&this.cm.display.view.length&&((a.focus||b)&&this.showPrimarySelection(),
this.showMultipleSelections(a))},showPrimarySelection:function(){var a=window.getSelection(),b=this.cm.doc.sel.primary(),c=Rb(this.cm,a.anchorNode,a.anchorOffset),d=Rb(this.cm,a.focusNode,a.focusOffset);if(!c||c.bad||!d||d.bad||0!=w(Nb(c,d),b.from())||0!=w(Mb(c,d),b.to()))if(c=Zd(this.cm,b.from()),d=Zd(this.cm,b.to()),c||d){var e=this.cm.display.view,b=a.rangeCount&&a.getRangeAt(0);c?d||(d=e[e.length-1].measure,d=d.maps?d.maps[d.maps.length-1]:d.map,d={node:d[d.length-1],offset:d[d.length-2]-d[d.length-
3]}):c={node:e[0].measure.map[2],offset:0};try{var f=Sa(c.node,c.offset,d.offset,d.node)}catch(g){}f&&(!oa&&this.cm.state.focused?(a.collapse(c.node,c.offset),f.collapsed||a.addRange(f)):(a.removeAllRanges(),a.addRange(f)),b&&null==a.anchorNode?a.addRange(b):oa&&this.startGracePeriod());this.rememberSelection()}},startGracePeriod:function(){var a=this;clearTimeout(this.gracePeriod);this.gracePeriod=setTimeout(function(){a.gracePeriod=!1;a.selectionChanged()&&a.cm.operation(function(){a.cm.curOp.selectionChanged=
!0})},20)},showMultipleSelections:function(a){U(this.cm.display.cursorDiv,a.cursors);U(this.cm.display.selectionDiv,a.selection)},rememberSelection:function(){var a=window.getSelection();this.lastAnchorNode=a.anchorNode;this.lastAnchorOffset=a.anchorOffset;this.lastFocusNode=a.focusNode;this.lastFocusOffset=a.focusOffset},selectionInEditor:function(){var a=window.getSelection();if(!a.rangeCount)return!1;a=a.getRangeAt(0).commonAncestorContainer;return Wc(this.div,a)},focus:function(){"nocursor"!=
this.cm.options.readOnly&&this.div.focus()},blur:function(){this.div.blur()},getField:function(){return this.div},supportsTouch:function(){return!0},receivedFocus:function(){function a(){b.cm.state.focused&&(b.pollSelection(),b.polling.set(b.cm.options.pollInterval,a))}var b=this;this.selectionInEditor()?this.pollSelection():T(this.cm,function(){b.cm.curOp.selectionChanged=!0});this.polling.set(this.cm.options.pollInterval,a)},selectionChanged:function(){var a=window.getSelection();return a.anchorNode!=
this.lastAnchorNode||a.anchorOffset!=this.lastAnchorOffset||a.focusNode!=this.lastFocusNode||a.focusOffset!=this.lastFocusOffset},pollSelection:function(){if(!this.composing&&!this.gracePeriod&&this.selectionChanged()){var a=window.getSelection(),b=this.cm;this.rememberSelection();var c=Rb(b,a.anchorNode,a.anchorOffset),d=Rb(b,a.focusNode,a.focusOffset);c&&d&&T(b,function(){C(b.doc,ga(c,d),ha);if(c.bad||d.bad)b.curOp.selectionChanged=!0})}},pollContent:function(){var a=this.cm,b=a.display,c=a.doc.sel.primary(),
d=c.from(),c=c.to();if(d.line<b.viewFrom||c.line>b.viewTo-1)return!1;var e;d.line==b.viewFrom||0==(e=Aa(a,d.line))?(d=F(b.view[0].line),e=b.view[0].node):(d=F(b.view[e].line),e=b.view[e-1].node.nextSibling);var f=Aa(a,c.line);f==b.view.length-1?(c=b.viewTo-1,b=b.lineDiv.lastChild):(c=F(b.view[f+1].line)-1,b=b.view[f+1].node.previousSibling);b=a.doc.splitLines(Df(a,e,b,d,c));for(e=Ba(a.doc,r(d,0),r(c,t(a.doc,c).text.length));1<b.length&&1<e.length;)if(z(b)==z(e))b.pop(),e.pop(),c--;else if(b[0]==e[0])b.shift(),
e.shift(),d++;else break;for(var g=0,f=0,h=b[0],k=e[0],l=Math.min(h.length,k.length);g<l&&h.charCodeAt(g)==k.charCodeAt(g);)++g;h=z(b);k=z(e);for(l=Math.min(h.length-(1==b.length?g:0),k.length-(1==e.length?g:0));f<l&&h.charCodeAt(h.length-f-1)==k.charCodeAt(k.length-f-1);)++f;b[b.length-1]=h.slice(0,h.length-f);b[0]=b[0].slice(g);d=r(d,g);c=r(c,e.length?z(e).length-f:0);if(1<b.length||b[0]||w(d,c))return Ua(a.doc,b,d,c,"+input"),!0},ensurePolled:function(){this.forceCompositionEnd()},reset:function(){this.forceCompositionEnd()},
forceCompositionEnd:function(){this.composing&&!this.composing.handled&&(this.applyComposition(this.composing),this.composing.handled=!0,this.div.blur(),this.div.focus())},applyComposition:function(a){this.cm.isReadOnly()?G(this.cm,M)(this.cm):a.data&&a.data!=a.startData&&G(this.cm,Ob)(this.cm,a.data,0,a.sel)},setUneditable:function(a){a.contentEditable="false"},onKeyPress:function(a){a.preventDefault();this.cm.isReadOnly()||G(this.cm,Ob)(this.cm,String.fromCharCode(null==a.charCode?a.keyCode:a.charCode),
0)},readOnlyChanged:function(a){this.div.contentEditable=String("nocursor"!=a)},onContextMenu:Cb,resetPosition:Cb,needsContentAttribute:!0},Uc.prototype);q.inputStyles={textarea:Tc,contenteditable:Uc};ka.prototype={primary:function(){return this.ranges[this.primIndex]},equals:function(a){if(a==this)return!0;if(a.primIndex!=this.primIndex||a.ranges.length!=this.ranges.length)return!1;for(var b=0;b<this.ranges.length;b++){var c=this.ranges[b],d=a.ranges[b];if(0!=w(c.anchor,d.anchor)||0!=w(c.head,d.head))return!1}return!0},
deepCopy:function(){for(var a=[],b=0;b<this.ranges.length;b++)a[b]=new y(Sc(this.ranges[b].anchor),Sc(this.ranges[b].head));return new ka(a,this.primIndex)},somethingSelected:function(){for(var a=0;a<this.ranges.length;a++)if(!this.ranges[a].empty())return!0;return!1},contains:function(a,b){b||(b=a);for(var c=0;c<this.ranges.length;c++){var d=this.ranges[c];if(0<=w(b,d.from())&&0>=w(a,d.to()))return c}return-1}};y.prototype={from:function(){return Nb(this.anchor,this.head)},to:function(){return Mb(this.anchor,
this.head)},empty:function(){return this.head.line==this.anchor.line&&this.head.ch==this.anchor.ch}};var pe={left:0,right:0,top:0,bottom:0},Ca,Ta=null,Lf=0,ec,dc,we=0,fc=0,V=null;A?V=-.53:oa?V=15:sg?V=-.7:xe&&(V=-1/3);var Ee=function(a){var b=a.wheelDeltaX,c=a.wheelDeltaY;null==b&&a.detail&&a.axis==a.HORIZONTAL_AXIS&&(b=a.detail);null==c&&a.detail&&a.axis==a.VERTICAL_AXIS?c=a.detail:null==c&&(c=a.wheelDelta);return{x:b,y:c}};q.wheelEventPixels=function(a){a=Ee(a);a.x*=V;a.y*=V;return a};var Yf=new ua,
kd=null,Ea=q.changeEnd=function(a){return a.text?r(a.from.line+a.text.length-1,z(a.text).length+(1==a.text.length?a.from.ch:0)):a.to};q.prototype={constructor:q,focus:function(){window.focus();this.display.input.focus()},setOption:function(a,b){var c=this.options,d=c[a];if(c[a]!=b||"mode"==a)c[a]=b,Ka.hasOwnProperty(a)&&G(this,Ka[a])(this,b,d)},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,b){this.state.keyMaps[b?"push":"unshift"](oc(a))},removeKeyMap:function(a){for(var b=
this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||b[c].name==a)return b.splice(c,1),!0},addOverlay:L(function(a,b){var c=a.token?a:q.getMode(this.options,a);if(c.startState)throw Error("Overlays may not be stateful.");pg(this.state.overlays,{mode:c,modeSpec:a,opaque:b&&b.opaque,priority:b&&b.priority||0},function(a){return a.priority});this.state.modeGen++;M(this)}),removeOverlay:L(function(a){for(var b=this.state.overlays,c=0;c<b.length;++c){var d=b[c].modeSpec;if(d==a||"string"==typeof a&&d.name==
a){b.splice(c,1);this.state.modeGen++;M(this);break}}}),indentLine:L(function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract");pb(this.doc,a)&&nb(this,a,b,c)}),indentSelection:L(function(a){for(var b=this.doc.sel.ranges,c=-1,d=0;d<b.length;d++){var e=b[d];if(e.empty())e.head.line>c&&(nb(this,e.head.line,a,!0),c=e.head.line,d==this.doc.sel.primIndex&&Pa(this));else{for(var f=e.from(),e=e.to(),g=Math.max(c,f.line),c=Math.min(this.lastLine(),
e.line-(e.ch?0:1))+1,e=g;e<c;++e)nb(this,e,a);e=this.doc.sel.ranges;0==f.ch&&b.length==e.length&&0<e[d].from().ch&&Xc(this.doc,d,new y(f,e[d].to()),ha)}}}),getTokenAt:function(a,b){return bf(this,a,b)},getLineTokens:function(a,b){return bf(this,r(a),b,!0)},getTokenTypeAt:function(a){a=x(this.doc,a);var b=df(this,t(this.doc,a.line)),c=0,d=(b.length-1)/2;a=a.ch;if(0==a)b=b[2];else for(;;){var e=c+d>>1;if((e?b[2*e-1]:0)>=a)d=e;else if(b[2*e+1]<a)c=e+1;else{b=b[2*e+2];break}}c=b?b.indexOf("cm-overlay "):
-1;return 0>c?b:0==c?null:b.slice(0,c-1)},getModeAt:function(a){var b=this.doc.mode;return b.innerMode?q.innerMode(b,this.getTokenAt(a).state).mode:b},getHelper:function(a,b){return this.getHelpers(a,b)[0]},getHelpers:function(a,b){var c=[];if(!$a.hasOwnProperty(b))return c;var d=$a[b],e=this.getModeAt(a);if("string"==typeof e[b])d[e[b]]&&c.push(d[e[b]]);else if(e[b])for(var f=0;f<e[b].length;f++){var g=d[e[b][f]];g&&c.push(g)}else e.helperType&&d[e.helperType]?c.push(d[e.helperType]):d[e.name]&&
c.push(d[e.name]);for(f=0;f<d._global.length;f++)g=d._global[f],g.pred(e,this)&&-1==D(c,g.val)&&c.push(g.val);return c},getStateAfter:function(a,b){var c=this.doc;a=Math.max(c.first,Math.min(null==a?c.first+c.size-1:a,c.first+c.size-1));return rb(this,a+1,b)},cursorCoords:function(a,b){var c;c=this.doc.sel.primary();c=null==a?c.head:"object"==typeof a?x(this.doc,a):a?c.from():c.to();return la(this,c,b||"page")},charCoords:function(a,b){return Vb(this,x(this.doc,a),b||"page")},coordsChar:function(a,
b){a=se(this,a,b||"page");return ed(this,a.left,a.top)},lineAtHeight:function(a,b){a=se(this,{top:a,left:0},b||"page").top;return ya(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b){var c=!1,d;"number"==typeof a?(d=this.doc.first+this.doc.size-1,a<this.doc.first?a=this.doc.first:a>d&&(a=d,c=!0),d=t(this.doc,a)):d=a;return bd(this,d,{top:0,left:0},b||"page").top+(c?this.doc.height-ea(d):0)},defaultTextHeight:function(){return va(this.display)},defaultCharWidth:function(){return eb(this.display)},
setGutterMarker:L(function(a,b,c){return mc(this.doc,a,"gutter",function(a){var e=a.gutterMarkers||(a.gutterMarkers={});e[b]=c;!c&&nf(e)&&(a.gutterMarkers=null);return!0})}),clearGutter:L(function(a){var b=this,c=b.doc,d=c.first;c.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&(c.gutterMarkers[a]=null,ma(b,d,"gutter"),nf(c.gutterMarkers)&&(c.gutterMarkers=null));++d})}),lineInfo:function(a){if("number"==typeof a){if(!pb(this.doc,a))return null;var b=a;a=t(this.doc,a);if(!a)return null}else if(b=
F(a),null==b)return null;return{line:b,handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(a,b,c,d,e){var f=this.display;a=la(this,x(this.doc,a));var g=a.bottom,h=a.left;b.style.position="absolute";b.setAttribute("cm-ignore-events","true");this.display.input.setUneditable(b);f.sizer.appendChild(b);if("over"==d)g=a.top;
else if("above"==d||"near"==d){var k=Math.max(f.wrapper.clientHeight,this.doc.height),l=Math.max(f.sizer.clientWidth,f.lineSpace.clientWidth);("above"==d||a.bottom+b.offsetHeight>k)&&a.top>b.offsetHeight?g=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=k&&(g=a.bottom);h+b.offsetWidth>l&&(h=l-b.offsetWidth)}b.style.top=g+"px";b.style.left=b.style.right="";"right"==e?(h=f.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==e?h=0:"middle"==e&&(h=(f.sizer.clientWidth-b.offsetWidth)/2),b.style.left=
h+"px");c&&(a=ac(this,h,g,h+b.offsetWidth,g+b.offsetHeight),null!=a.scrollTop&&jb(this,a.scrollTop),null!=a.scrollLeft&&Ma(this,a.scrollLeft))},triggerOnKeyDown:L(Ae),triggerOnKeyPress:L(Be),triggerOnKeyUp:ze,execCommand:function(a){if(hc.hasOwnProperty(a))return hc[a].call(null,this)},triggerElectric:L(function(a){Ud(this,a)}),findPosH:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);var f=0;for(a=x(this.doc,a);f<b&&(a=qd(this.doc,a,e,c,d),!a.hitSide);++f);return a},moveH:L(function(a,b){var c=this;c.extendSelectionsBy(function(d){return c.display.shift||
c.doc.extend||d.empty()?qd(c.doc,d.head,a,b,c.options.rtlMoveVisually):0>a?d.from():d.to()},Eb)}),deleteH:L(function(a,b){var c=this.doc;this.doc.sel.somethingSelected()?c.replaceSelection("",null,"+delete"):Va(this,function(d){var e=qd(c,d.head,a,b,!1);return 0>a?{from:e,to:d.head}:{from:d.head,to:e}})}),findPosV:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);var f=0;for(a=x(this.doc,a);f<b&&(a=la(this,a,"div"),null==d?d=a.left:a.left=d,a=Te(this,a,e,c),!a.hitSide);++f);return a},moveV:L(function(a,
b){var c=this,d=this.doc,e=[],f=!c.display.shift&&!d.extend&&d.sel.somethingSelected();d.extendSelectionsBy(function(g){if(f)return 0>a?g.from():g.to();var k=la(c,g.head,"div");null!=g.goalColumn&&(k.left=g.goalColumn);e.push(k.left);var l=Te(c,k,a,b);"page"==b&&g==d.sel.primary()&&kc(c,null,Vb(c,l,"div").top-k.top);return l},Eb);if(e.length)for(var g=0;g<d.sel.ranges.length;g++)d.sel.ranges[g].goalColumn=e[g]}),findWordAt:function(a){var b=t(this.doc,a.line).text,c=a.ch,d=a.ch;if(b){var e=this.getHelper(a,
"wordChars");(0>a.xRel||d==b.length)&&c?--c:++d;for(var f=b.charAt(c),f=nc(f,e)?function(a){return nc(a,e)}:/\s/.test(f)?function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&!nc(a)};0<c&&f(b.charAt(c-1));)--c;for(;d<b.length&&f(b.charAt(d));)++d}return new y(r(a.line,c),r(a.line,d))},toggleOverwrite:function(a){if(null==a||a!=this.state.overwrite)(this.state.overwrite=!this.state.overwrite)?kb(this.display.cursorDiv,"CodeMirror-overwrite"):ib(this.display.cursorDiv,"CodeMirror-overwrite"),
J(this,"overwriteToggle",this,this.state.overwrite)},hasFocus:function(){return this.display.input.getField()==fa()},isReadOnly:function(){return!(!this.options.readOnly&&!this.doc.cantEdit)},scrollTo:L(function(a,b){null==a&&null==b||lc(this);null!=a&&(this.curOp.scrollLeft=a);null!=b&&(this.curOp.scrollTop=b)}),getScrollInfo:function(){var a=this.display.scroller;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-da(this)-this.display.barHeight,width:a.scrollWidth-da(this)-this.display.barWidth,
clientHeight:Oc(this),clientWidth:za(this)}},scrollIntoView:L(function(a,b){null==a?(a={from:this.doc.sel.primary().head,to:null},null==b&&(b=this.options.cursorScrollMargin)):"number"==typeof a?a={from:r(a,0),to:null}:null==a.from&&(a={from:a,to:null});a.to||(a.to=a.from);a.margin=b||0;if(null!=a.from.line)lc(this),this.curOp.scrollToPos=a;else{var c=ac(this,Math.min(a.from.left,a.to.left),Math.min(a.from.top,a.to.top)-a.margin,Math.max(a.from.right,a.to.right),Math.max(a.from.bottom,a.to.bottom)+
a.margin);this.scrollTo(c.scrollLeft,c.scrollTop)}}),setSize:L(function(a,b){function c(a){return"number"==typeof a||/^\d+$/.test(String(a))?a+"px":a}var d=this;null!=a&&(d.display.wrapper.style.width=c(a));null!=b&&(d.display.wrapper.style.height=c(b));d.options.lineWrapping&&re(this);var e=d.display.viewFrom;d.doc.iter(e,d.display.viewTo,function(a){if(a.widgets)for(var b=0;b<a.widgets.length;b++)if(a.widgets[b].noHScroll){ma(d,e,"widget");break}++e});d.curOp.forceUpdate=!0;J(d,"refresh",this)}),
operation:function(a){return T(this,a)},refresh:L(function(){var a=this.display.cachedTextHeight;M(this);this.curOp.forceUpdate=!0;fb(this);this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop);Dc(this);(null==a||.5<Math.abs(a-va(this.display)))&&Bc(this);J(this,"refresh",this)}),swapDoc:L(function(a){var b=this.doc;b.cm=null;Dd(this,a);fb(this);this.display.input.reset();this.scrollTo(a.scrollLeft,a.scrollTop);this.curOp.forceScroll=!0;R(this,"swapDoc",this,b);return b}),getInputField:function(){return this.display.input.getField()},
getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}};Ya(q);var wf=q.defaults={},Ka=q.optionHandlers={},Ed=q.Init={toString:function(){return"CodeMirror.Init"}};u("value","",function(a,b){a.setValue(b)},!0);u("mode",null,function(a,b){a.doc.modeOption=b;Ac(a)},!0);u("indentUnit",2,Ac,!0);u("indentWithTabs",!1);u("smartIndent",!0);u("tabSize",4,function(a){cb(a);fb(a);M(a)},!0);
u("lineSeparator",null,function(a,b){if(a.doc.lineSep=b){var c=[],d=a.doc.first;a.doc.iter(function(a){for(var e=0;;){var h=a.text.indexOf(b,e);if(-1==h)break;e=h+b.length;c.push(r(d,h))}d++});for(var e=c.length-1;0<=e;e--)Ua(a.doc,b,c[e],r(c[e].line,c[e].ch+b.length))}});u("specialChars",/[\u0000-\u001f\u007f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g,function(a,b,c){a.state.specialChars=new RegExp(b.source+(b.test("\t")?"":"|\t"),"g");c!=q.Init&&a.refresh()});u("specialCharPlaceholder",function(a){var b=
s("span","•","cm-invalidchar");b.title="\\u"+a.charCodeAt(0).toString(16);b.setAttribute("aria-label",b.title);return b},function(a){a.refresh()},!0);u("electricChars",!0);u("inputStyle",ab?"contenteditable":"textarea",function(){throw Error("inputStyle can not (yet) be changed in a running editor");},!0);u("spellcheck",!1,function(a,b){a.getInputField().spellcheck=b},!0);u("rtlMoveVisually",!ug);u("wholeLineUpdateBefore",!0);u("theme","default",function(a){Ad(a);gb(a)},!0);u("keyMap","default",function(a,
b,c){b=oc(b);(c=c!=q.Init&&oc(c))&&c.detach&&c.detach(a,b);b.attach&&b.attach(a,c||null)});u("extraKeys",null);u("lineWrapping",!1,function(a){a.options.lineWrapping?(kb(a.display.wrapper,"CodeMirror-wrap"),a.display.sizer.style.minWidth="",a.display.sizerWidth=null):(ib(a.display.wrapper,"CodeMirror-wrap"),Ec(a));Bc(a);M(a);fb(a);setTimeout(function(){Na(a)},100)},!0);u("gutters",[],function(a){wc(a.options);gb(a)},!0);u("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?Jc(a.display)+
"px":"0";a.refresh()},!0);u("coverGutterNextToScrollbar",!1,function(a){Na(a)},!0);u("scrollbarStyle","native",function(a){Bd(a);Na(a);a.display.scrollbars.setScrollTop(a.doc.scrollTop);a.display.scrollbars.setScrollLeft(a.doc.scrollLeft)},!0);u("lineNumbers",!1,function(a){wc(a.options);gb(a)},!0);u("firstLineNumber",1,gb,!0);u("lineNumberFormatter",function(a){return a},gb,!0);u("showCursorWhenSelecting",!1,lb,!0);u("resetSelectionOnContextMenu",!0);u("lineWiseCopyCut",!0);u("readOnly",!1,function(a,
b){"nocursor"==b?(bb(a),a.display.input.blur(),a.display.disabled=!0):a.display.disabled=!1;a.display.input.readOnlyChanged(b)});u("disableInput",!1,function(a,b){b||a.display.input.reset()},!0);u("dragDrop",!0,function(a,b,c){!b!=!(c&&c!=q.Init)&&(c=a.display.dragFunctions,b=b?v:ja,b(a.display.scroller,"dragstart",c.start),b(a.display.scroller,"dragenter",c.enter),b(a.display.scroller,"dragover",c.over),b(a.display.scroller,"dragleave",c.leave),b(a.display.scroller,"drop",c.drop))});u("allowDropFileTypes",
null);u("cursorBlinkRate",530);u("cursorScrollMargin",0);u("cursorHeight",1,lb,!0);u("singleCursorHeightPerLine",!0,lb,!0);u("workTime",100);u("workDelay",100);u("flattenSpans",!0,cb,!0);u("addModeClass",!1,cb,!0);u("pollInterval",100);u("undoDepth",200,function(a,b){a.doc.history.undoDepth=b});u("historyEventDelay",1250);u("viewportMargin",10,function(a){a.refresh()},!0);u("maxHighlightLength",1E4,cb,!0);u("moveInputWithCursor",!0,function(a,b){b||a.display.input.resetPosition()});u("tabindex",null,
function(a,b){a.display.input.getField().tabIndex=b||""});u("autofocus",null);var vf=q.modes={},Fb=q.mimeModes={};q.defineMode=function(a,b){q.defaults.mode||"null"==a||(q.defaults.mode=a);2<arguments.length&&(b.dependencies=Array.prototype.slice.call(arguments,2));vf[a]=b};q.defineMIME=function(a,b){Fb[a]=b};q.resolveMode=function(a){if("string"==typeof a&&Fb.hasOwnProperty(a))a=Fb[a];else if(a&&"string"==typeof a.name&&Fb.hasOwnProperty(a.name)){var b=Fb[a.name];"string"==typeof b&&(b={name:b});
a=lf(b,a);a.name=b.name}else{if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+xml$/.test(a))return q.resolveMode("application/xml");if("string"==typeof a&&/^[\w\-]+\/[\w\-]+\+json$/.test(a))return q.resolveMode("application/json")}return"string"==typeof a?{name:a}:a||{name:"null"}};q.getMode=function(a,b){b=q.resolveMode(b);var c=vf[b.name];if(!c)return q.getMode(a,"text/plain");c=c(a,b);if(Gb.hasOwnProperty(b.name)){var d=Gb[b.name],e;for(e in d)d.hasOwnProperty(e)&&(c.hasOwnProperty(e)&&(c["_"+e]=c[e]),
c[e]=d[e])}c.name=b.name;b.helperType&&(c.helperType=b.helperType);if(b.modeProps)for(e in b.modeProps)c[e]=b.modeProps[e];return c};q.defineMode("null",function(){return{token:function(a){a.skipToEnd()}}});q.defineMIME("text/plain","null");var Gb=q.modeExtensions={};q.extendMode=function(a,b){var c=Gb.hasOwnProperty(a)?Gb[a]:Gb[a]={};X(b,c)};q.defineExtension=function(a,b){q.prototype[a]=b};q.defineDocExtension=function(a,b){Q.prototype[a]=b};q.defineOption=u;var zc=[];q.defineInitHook=function(a){zc.push(a)};
var $a=q.helpers={};q.registerHelper=function(a,b,c){$a.hasOwnProperty(a)||($a[a]=q[a]={_global:[]});$a[a][b]=c};q.registerGlobalHelper=function(a,b,c,d){q.registerHelper(a,b,d);$a[a]._global.push({pred:c,val:d})};var sa=q.copyState=function(a,b){if(!0===b)return b;if(a.copyState)return a.copyState(b);var c={},d;for(d in b){var e=b[d];e instanceof Array&&(e=e.concat([]));c[d]=e}return c},Jf=q.startState=function(a,b,c){return a.startState?a.startState(b,c):!0};q.innerMode=function(a,b){for(;a.innerMode;){var c=
a.innerMode(b);if(!c||c.mode==a)break;b=c.state;a=c.mode}return c||{mode:a,state:b}};var hc=q.commands={selectAll:function(a){a.setSelection(r(a.firstLine(),0),r(a.lastLine()),ha)},singleSelection:function(a){a.setSelection(a.getCursor("anchor"),a.getCursor("head"),ha)},killLine:function(a){Va(a,function(b){if(b.empty()){var c=t(a.doc,b.head.line).text.length;return b.head.ch==c&&b.head.line<a.lastLine()?{from:b.head,to:r(b.head.line+1,0)}:{from:b.head,to:r(b.head.line,c)}}return{from:b.from(),to:b.to()}})},
deleteLine:function(a){Va(a,function(b){return{from:r(b.from().line,0),to:x(a.doc,r(b.to().line+1,0))}})},delLineLeft:function(a){Va(a,function(a){return{from:r(a.from().line,0),to:a.from()}})},delWrappedLineLeft:function(a){Va(a,function(b){var c=a.charCoords(b.head,"div").top+5;return{from:a.coordsChar({left:0,top:c},"div"),to:b.from()}})},delWrappedLineRight:function(a){Va(a,function(b){var c=a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:c},"div");
return{from:b.from(),to:c}})},undo:function(a){a.undo()},redo:function(a){a.redo()},undoSelection:function(a){a.undoSelection()},redoSelection:function(a){a.redoSelection()},goDocStart:function(a){a.extendSelection(r(a.firstLine(),0))},goDocEnd:function(a){a.extendSelection(r(a.lastLine()))},goLineStart:function(a){a.extendSelectionsBy(function(b){return pf(a,b.head.line)},{origin:"+move",bias:1})},goLineStartSmart:function(a){a.extendSelectionsBy(function(b){return qf(a,b.head)},{origin:"+move",
bias:1})},goLineEnd:function(a){a.extendSelectionsBy(function(b){b=b.head.line;for(var c,d=t(a.doc,b);c=xa(d,!1);)d=c.find(1,!0).line,b=null;c=(c=Z(d))?c[0].level%2?Zb(d):$b(d):d.text.length;return r(null==b?F(d):b,c)},{origin:"+move",bias:-1})},goLineRight:function(a){a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:b},"div")},Eb)},goLineLeft:function(a){a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+
5;return a.coordsChar({left:0,top:b},"div")},Eb)},goLineLeftSmart:function(a){a.extendSelectionsBy(function(b){var c=a.charCoords(b.head,"div").top+5,c=a.coordsChar({left:0,top:c},"div");return c.ch<a.getLine(c.line).search(/\S/)?qf(a,b.head):c},Eb)},goLineUp:function(a){a.moveV(-1,"line")},goLineDown:function(a){a.moveV(1,"line")},goPageUp:function(a){a.moveV(-1,"page")},goPageDown:function(a){a.moveV(1,"page")},goCharLeft:function(a){a.moveH(-1,"char")},goCharRight:function(a){a.moveH(1,"char")},
goColumnLeft:function(a){a.moveH(-1,"column")},goColumnRight:function(a){a.moveH(1,"column")},goWordLeft:function(a){a.moveH(-1,"word")},goGroupRight:function(a){a.moveH(1,"group")},goGroupLeft:function(a){a.moveH(-1,"group")},goWordRight:function(a){a.moveH(1,"word")},delCharBefore:function(a){a.deleteH(-1,"char")},delCharAfter:function(a){a.deleteH(1,"char")},delWordBefore:function(a){a.deleteH(-1,"word")},delWordAfter:function(a){a.deleteH(1,"word")},delGroupBefore:function(a){a.deleteH(-1,"group")},
delGroupAfter:function(a){a.deleteH(1,"group")},indentAuto:function(a){a.indentSelection("smart")},indentMore:function(a){a.indentSelection("add")},indentLess:function(a){a.indentSelection("subtract")},insertTab:function(a){a.replaceSelection("\t")},insertSoftTab:function(a){for(var b=[],c=a.listSelections(),d=a.options.tabSize,e=0;e<c.length;e++){var f=c[e].from(),f=aa(a.getLine(f.line),f.ch,d);b.push(pd(d-f%d))}a.replaceSelections(b)},defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):
a.execCommand("insertTab")},transposeChars:function(a){T(a,function(){for(var b=a.listSelections(),c=[],d=0;d<b.length;d++){var e=b[d].head,f=t(a.doc,e.line).text;if(f)if(e.ch==f.length&&(e=new r(e.line,e.ch-1)),0<e.ch)e=new r(e.line,e.ch+1),a.replaceRange(f.charAt(e.ch-1)+f.charAt(e.ch-2),r(e.line,e.ch-2),e,"+transpose");else if(e.line>a.doc.first){var g=t(a.doc,e.line-1).text;g&&a.replaceRange(f.charAt(0)+a.doc.lineSeparator()+g.charAt(g.length-1),r(e.line-1,g.length-1),r(e.line,1),"+transpose")}c.push(new y(e,
e))}a.setSelections(c)})},newlineAndIndent:function(a){T(a,function(){for(var b=a.listSelections().length,c=0;c<b;c++){var d=a.listSelections()[c];a.replaceRange(a.doc.lineSeparator(),d.anchor,d.head,"+input");a.indentLine(d.from().line+1,null,!0)}Pa(a)})},openLine:function(a){a.replaceSelection("\n","start")},toggleOverwrite:function(a){a.toggleOverwrite()}},ta=q.keyMap={};ta.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",
PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"};ta.pcDefault={"Ctrl-A":"selectAll","Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Up":"goLineUp","Ctrl-Down":"goLineDown","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart",
"Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore","Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"};ta.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft",
"Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter","Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars","Ctrl-O":"openLine"};ta.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Home":"goDocStart","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight",
"Cmd-Left":"goLineLeft","Cmd-Right":"goLineRight","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find","Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delWrappedLineLeft","Cmd-Delete":"delWrappedLineRight","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection","Ctrl-Up":"goDocStart","Ctrl-Down":"goDocEnd",fallthrough:["basic",
"emacsy"]};ta["default"]=Y?ta.macDefault:ta.pcDefault;q.normalizeKeyMap=function(a){var b={},c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];if(!/^(name|fallthrough|(de|at)tach)$/.test(c)){if("..."!=d)for(var e=Pb(c.split(" "),dg),f=0;f<e.length;f++){var g,h;f==e.length-1?(h=e.join(" "),g=d):(h=e.slice(0,f+1).join(" "),g="...");var k=b[h];if(!k)b[h]=g;else if(k!=g)throw Error("Inconsistent bindings for "+h);}delete a[c]}}for(var l in b)a[l]=b[l];return a};var vb=q.lookupKey=function(a,b,c,d){b=oc(b);
var e=b.call?b.call(a,d):b[a];if(!1===e)return"nothing";if("..."===e)return"multi";if(null!=e&&c(e))return"handled";if(b.fallthrough){if("[object Array]"!=Object.prototype.toString.call(b.fallthrough))return vb(a,b.fallthrough,c,d);for(e=0;e<b.fallthrough.length;e++){var f=vb(a,b.fallthrough[e],c,d);if(f)return f}}},Xf=q.isModifierKey=function(a){a="string"==typeof a?a:Ia[a.keyCode];return"Ctrl"==a||"Alt"==a||"Shift"==a||"Mod"==a},Zf=q.keyName=function(a,b){if(ba&&34==a.keyCode&&a["char"])return!1;
var c=Ia[a.keyCode],d=c;if(null==d||a.altGraphKey)return!1;a.altKey&&"Alt"!=c&&(d="Alt-"+d);(uf?a.metaKey:a.ctrlKey)&&"Ctrl"!=c&&(d="Ctrl-"+d);(uf?a.ctrlKey:a.metaKey)&&"Cmd"!=c&&(d="Cmd-"+d);!b&&a.shiftKey&&"Shift"!=c&&(d="Shift-"+d);return d};q.fromTextArea=function(a,b){function c(){a.value=k.getValue()}b=b?X(b):{};b.value=a.value;!b.tabindex&&a.tabIndex&&(b.tabindex=a.tabIndex);!b.placeholder&&a.placeholder&&(b.placeholder=a.placeholder);if(null==b.autofocus){var d=fa();b.autofocus=d==a||null!=
a.getAttribute("autofocus")&&d==document.body}if(a.form&&(v(a.form,"submit",c),!b.leaveSubmitMethodAlone)){var e=a.form,f=e.submit;try{var g=e.submit=function(){c();e.submit=f;e.submit();e.submit=g}}catch(h){}}b.finishInit=function(b){b.save=c;b.getTextArea=function(){return a};b.toTextArea=function(){b.toTextArea=isNaN;c();a.parentNode.removeChild(b.getWrapperElement());a.style.display="";a.form&&(ja(a.form,"submit",c),"function"==typeof a.form.submit&&(a.form.submit=f))}};a.style.display="none";
var k=q(function(b){a.parentNode.insertBefore(b,a.nextSibling)},b);return k};var sc=q.StringStream=function(a,b){this.pos=this.start=0;this.string=a;this.tabSize=b||8;this.lineStart=this.lastColumnPos=this.lastColumnValue=0};sc.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){if(this.pos<this.string.length)return this.string.charAt(this.pos++)},eat:function(a){var b=
this.string.charAt(this.pos);if("string"==typeof a?b==a:b&&(a.test?a.test(b):a(b)))return++this.pos,b},eatWhile:function(a){for(var b=this.pos;this.eat(a););return this.pos>b},eatSpace:function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a},skipToEnd:function(){this.pos=this.string.length},skipTo:function(a){a=this.string.indexOf(a,this.pos);if(-1<a)return this.pos=a,!0},backUp:function(a){this.pos-=a},column:function(){this.lastColumnPos<this.start&&
(this.lastColumnValue=aa(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start);return this.lastColumnValue-(this.lineStart?aa(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return aa(this.string,null,this.tabSize)-(this.lineStart?aa(this.string,this.lineStart,this.tabSize):0)},match:function(a,b,c){if("string"==typeof a){var d=function(a){return c?a.toLowerCase():a},e=this.string.substr(this.pos,a.length);if(d(e)==d(a))return!1!==
b&&(this.pos+=a.length),!0}else{if((a=this.string.slice(this.pos).match(a))&&0<a.index)return null;a&&!1!==b&&(this.pos+=a[0].length);return a}},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(a,b){this.lineStart+=a;try{return b()}finally{this.lineStart-=a}}};var rd=0,Ga=q.TextMarker=function(a,b){this.lines=[];this.type=b;this.doc=a;this.id=++rd};Ya(Ga);Ga.prototype.clear=function(){if(!this.explicitlyCleared){var a=this.doc.cm,b=a&&!a.curOp;b&&Ja(a);if(W(this,
"clear")){var c=this.find();c&&R(this,"clear",c.from,c.to)}for(var d=c=null,e=0;e<this.lines.length;++e){var f=this.lines[e],g=xb(f.markedSpans,this);a&&!this.collapsed?ma(a,F(f),"text"):a&&(null!=g.to&&(d=F(f)),null!=g.from&&(c=F(f)));for(var h=f,k=f.markedSpans,l=g,m=void 0,p=0;p<k.length;++p)k[p]!=l&&(m||(m=[])).push(k[p]);h.markedSpans=m;null==g.from&&this.collapsed&&!wa(this.doc,f)&&a&&ca(f,va(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(e=0;e<this.lines.length;++e)f=ia(this.lines[e]),
g=Ib(f),g>a.display.maxLineLength&&(a.display.maxLine=f,a.display.maxLineLength=g,a.display.maxLineChanged=!0);null!=c&&a&&this.collapsed&&M(a,c,d+1);this.lines.length=0;this.explicitlyCleared=!0;this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&ie(a.doc));a&&R(a,"markerCleared",a,this);b&&La(a);this.parent&&this.parent.clear()}};Ga.prototype.find=function(a,b){null==a&&"bookmark"==this.type&&(a=1);for(var c,d,e=0;e<this.lines.length;++e){var f=this.lines[e],g=xb(f.markedSpans,this);if(null!=
g.from&&(c=r(b?f:F(f),g.from),-1==a))return c;if(null!=g.to&&(d=r(b?f:F(f),g.to),1==a))return d}return c&&{from:c,to:d}};Ga.prototype.changed=function(){var a=this.find(-1,!0),b=this,c=this.doc.cm;a&&c&&T(c,function(){var d=a.line,e=F(a.line);if(e=Vc(c,e))qe(e),c.curOp.selectionChanged=c.curOp.forceUpdate=!0;c.curOp.updateMaxLine=!0;wa(b.doc,d)||null==b.height||(e=b.height,b.height=null,(e=tb(b)-e)&&ca(d,d.height+e))})};Ga.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=
this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=D(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)};Ga.prototype.detachLine=function(a){this.lines.splice(D(this.lines,a),1);!this.lines.length&&this.doc.cm&&(a=this.doc.cm.curOp,(a.maybeHiddenMarkers||(a.maybeHiddenMarkers=[])).push(this))};var rd=0,qc=q.SharedTextMarker=function(a,b){this.markers=a;this.primary=b;for(var c=0;c<a.length;++c)a[c].parent=this};Ya(qc);qc.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=
!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();R(this,"clear")}};qc.prototype.find=function(a,b){return this.primary.find(a,b)};var rc=q.LineWidget=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.doc=a;this.node=b};Ya(rc);rc.prototype.clear=function(){var a=this.doc.cm,b=this.line.widgets,c=this.line,d=F(c);if(null!=d&&b){for(var e=0;e<b.length;++e)b[e]==this&&b.splice(e--,1);b.length||(c.widgets=null);var f=tb(this);ca(c,Math.max(0,c.height-f));a&&T(a,
function(){var b=-f;ea(c)<(a.curOp&&a.curOp.scrollTop||a.doc.scrollTop)&&kc(a,null,b);ma(a,d,"widget")})}};rc.prototype.changed=function(){var a=this.height,b=this.doc.cm,c=this.line;this.height=null;var d=tb(this)-a;d&&(ca(c,c.height+d),b&&T(b,function(){b.curOp.forceUpdate=!0;ea(c)<(b.curOp&&b.curOp.scrollTop||b.doc.scrollTop)&&kc(b,null,d)}))};var yb=q.Line=function(a,b,c){this.text=a;Ye(this,b);this.height=c?c(this):1};Ya(yb);yb.prototype.lineNo=function(){return F(this)};var jg={},ig={};zb.prototype=
{chunkSize:function(){return this.lines.length},removeInner:function(a,b){for(var c=a,d=a+b;c<d;++c){var e=this.lines[c];this.height-=e.height;var f=e;f.parent=null;Xe(f);R(e,"delete")}this.lines.splice(a,b)},collapse:function(a){a.push.apply(a,this.lines)},insertInner:function(a,b,c){this.height+=c;this.lines=this.lines.slice(0,a).concat(b).concat(this.lines.slice(a));for(a=0;a<b.length;++a)b[a].parent=this},iterN:function(a,b,c){for(b=a+b;a<b;++a)if(c(this.lines[a]))return!0}};Ab.prototype={chunkSize:function(){return this.size},
removeInner:function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(a<e){var f=Math.min(b,e-a),g=d.height;d.removeInner(a,f);this.height-=g-d.height;e==f&&(this.children.splice(c--,1),d.parent=null);if(0==(b-=f))break;a=0}else a-=e}25>this.size-b&&(1<this.children.length||!(this.children[0]instanceof zb))&&(c=[],this.collapse(c),this.children=[new zb(c)],this.children[0].parent=this)},collapse:function(a){for(var b=0;b<this.children.length;++b)this.children[b].collapse(a)},
insertInner:function(a,b,c){this.size+=b.length;this.height+=c;for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<=f){e.insertInner(a,b,c);if(e.lines&&50<e.lines.length){for(b=a=e.lines.length%25+25;b<e.lines.length;)c=new zb(e.lines.slice(b,b+=25)),e.height-=c.height,this.children.splice(++d,0,c),c.parent=this;e.lines=e.lines.slice(0,a);this.maybeSpill()}break}a-=f}},maybeSpill:function(){if(!(10>=this.children.length)){var a=this;do{var b=a.children.splice(a.children.length-
5,5),b=new Ab(b);if(a.parent){a.size-=b.size;a.height-=b.height;var c=D(a.parent.children,a);a.parent.children.splice(c+1,0,b)}else c=new Ab(a.children),c.parent=a,a.children=[c,b],a=c;b.parent=a.parent}while(10<a.children.length);a.parent.maybeSpill()}},iterN:function(a,b,c){for(var d=0;d<this.children.length;++d){var e=this.children[d],f=e.chunkSize();if(a<f){f=Math.min(b,f-a);if(e.iterN(a,f,c))return!0;if(0==(b-=f))break;a=0}else a-=f}}};var wg=0,Q=q.Doc=function(a,b,c,d){if(!(this instanceof Q))return new Q(a,
b,c,d);null==c&&(c=0);Ab.call(this,[new zb([new yb("",null)])]);this.first=c;this.scrollTop=this.scrollLeft=0;this.cantEdit=!1;this.cleanGeneration=1;this.frontier=c;c=r(c,0);this.sel=ga(c);this.history=new tc(null);this.id=++wg;this.modeOption=b;this.lineSep=d;this.extend=!1;"string"==typeof a&&(a=this.splitLines(a));od(this,{from:c,to:c,text:a});C(this,ga(c),ha)};Q.prototype=lf(Ab.prototype,{constructor:Q,iter:function(a,b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,
a)},insert:function(a,b){for(var c=0,d=0;d<b.length;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-this.first,b)},getValue:function(a){var b=wd(this,this.first,this.first+this.size);return!1===a?b:b.join(a||this.lineSeparator())},setValue:N(function(a){var b=r(this.first,0),c=this.first+this.size-1;Oa(this,{from:b,to:r(c,t(this,c).text.length),text:this.splitLines(a),origin:"setValue",full:!0},!0);C(this,ga(b))}),replaceRange:function(a,b,c,d){b=x(this,
b);c=c?x(this,c):b;Ua(this,a,b,c,d)},getRange:function(a,b,c){a=Ba(this,x(this,a),x(this,b));return!1===c?a:a.join(c||this.lineSeparator())},getLine:function(a){return(a=this.getLineHandle(a))&&a.text},getLineHandle:function(a){if(pb(this,a))return t(this,a)},getLineNumber:function(a){return F(a)},getLineHandleVisualStart:function(a){"number"==typeof a&&(a=t(this,a));return ia(a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+
this.size-1},clipPos:function(a){return x(this,a)},getCursor:function(a){var b=this.sel.primary();return null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||"to"==a||!1===a?b.to():b.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:N(function(a,b,c){a=x(this,"number"==typeof a?r(a,b||0):a);C(this,ga(a,null),c)}),setSelection:N(function(a,b,c){var d=x(this,a);a=x(this,b||a);C(this,ga(d,a),c)}),extendSelection:N(function(a,
b,c){Sb(this,x(this,a),b&&x(this,b),c)}),extendSelections:N(function(a,b){ce(this,be(this,a),b)}),extendSelectionsBy:N(function(a,b){var c=Pb(this.sel.ranges,a);ce(this,be(this,c),b)}),setSelections:N(function(a,b,c){if(a.length){for(var d=0,e=[];d<a.length;d++)e[d]=new y(x(this,a[d].anchor),x(this,a[d].head));null==b&&(b=Math.min(a.length-1,this.sel.primIndex));C(this,$(e,b),c)}}),addSelection:N(function(a,b,c){var d=this.sel.ranges.slice(0);d.push(new y(x(this,a),x(this,b||a)));C(this,$(d,d.length-
1),c)}),getSelection:function(a){for(var b=this.sel.ranges,c,d=0;d<b.length;d++){var e=Ba(this,b[d].from(),b[d].to());c=c?c.concat(e):e}return!1===a?c:c.join(a||this.lineSeparator())},getSelections:function(a){for(var b=[],c=this.sel.ranges,d=0;d<c.length;d++){var e=Ba(this,c[d].from(),c[d].to());!1!==a&&(e=e.join(a||this.lineSeparator()));b[d]=e}return b},replaceSelection:function(a,b,c){for(var d=[],e=0;e<this.sel.ranges.length;e++)d[e]=a;this.replaceSelections(d,b,c||"+input")},replaceSelections:N(function(a,
b,c){for(var d=[],e=this.sel,f=0;f<e.ranges.length;f++){var g=e.ranges[f];d[f]={from:g.from(),to:g.to(),text:this.splitLines(a[f]),origin:c}}if(f=b&&"end"!=b){f=[];c=a=r(this.first,0);for(e=0;e<d.length;e++){var h=d[e],g=Je(h.from,a,c),k=Je(Ea(h),a,c);a=h.to;c=k;"around"==b?(h=this.sel.ranges[e],h=0>w(h.head,h.anchor),f[e]=new y(h?k:g,h?g:k)):f[e]=new y(g,g)}f=new ka(f,this.sel.primIndex)}b=f;for(f=d.length-1;0<=f;f--)Oa(this,d[f]);b?de(this,b):this.cm&&Pa(this.cm)}),undo:N(function(){jc(this,"undo")}),
redo:N(function(){jc(this,"redo")}),undoSelection:N(function(){jc(this,"undo",!0)}),redoSelection:N(function(){jc(this,"redo",!0)}),setExtending:function(a){this.extend=a},getExtending:function(){return this.extend},historySize:function(){for(var a=this.history,b=0,c=0,d=0;d<a.done.length;d++)a.done[d].ranges||++b;for(d=0;d<a.undone.length;d++)a.undone[d].ranges||++c;return{undo:b,redo:c}},clearHistory:function(){this.history=new tc(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=
this.changeGeneration(!0)},changeGeneration:function(a){a&&(this.history.lastOp=this.history.lastSelOp=this.history.lastOrigin=null);return this.history.generation},isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:Xa(this.history.done),undone:Xa(this.history.undone)}},setHistory:function(a){var b=this.history=new tc(this.history.maxGeneration);b.done=Xa(a.done.slice(0),null,!0);b.undone=Xa(a.undone.slice(0),null,!0)},addLineClass:N(function(a,
b,c){return mc(this,a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass";if(a[e]){if(Db(c).test(a[e]))return!1;a[e]+=" "+c}else a[e]=c;return!0})}),removeLineClass:N(function(a,b,c){return mc(this,a,"gutter"==b?"gutter":"class",function(a){var e="text"==b?"textClass":"background"==b?"bgClass":"gutter"==b?"gutterClass":"wrapClass",f=a[e];if(f)if(null==c)a[e]=null;else{var g=f.match(Db(c));if(!g)return!1;var h=g.index+
g[0].length;a[e]=f.slice(0,g.index)+(g.index&&h!=f.length?" ":"")+f.slice(h)||null}else return!1;return!0})}),addLineWidget:N(function(a,b,c){return hg(this,a,b,c)}),removeLineWidget:function(a){a.clear()},markText:function(a,b,c){return Wa(this,x(this,a),x(this,b),c,c&&c.type||"range")},setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?b.widget:b),insertLeft:b&&b.insertLeft,clearWhenEmpty:!1,shared:b&&b.shared,handleMouseEvents:b&&b.handleMouseEvents};a=x(this,a);return Wa(this,
a,a,c,"bookmark")},findMarksAt:function(a){a=x(this,a);var b=[],c=t(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},findMarks:function(a,b,c){a=x(this,a);b=x(this,b);var d=[],e=a.line;this.iter(a.line,b.line+1,function(f){if(f=f.markedSpans)for(var g=0;g<f.length;g++){var h=f[g];null!=h.to&&e==a.line&&a.ch>=h.to||null==h.from&&e!=a.line||null!=h.from&&e==b.line&&h.from>=b.ch||c&&
!c(h.marker)||d.push(h.marker.parent||h.marker)}++e});return d},getAllMarks:function(){var a=[];this.iter(function(b){if(b=b.markedSpans)for(var c=0;c<b.length;++c)null!=b[c].from&&a.push(b[c].marker)});return a},posFromIndex:function(a){var b,c=this.first,d=this.lineSeparator().length;this.iter(function(e){e=e.text.length+d;if(e>a)return b=a,!0;a-=e;++c});return x(this,r(c,b))},indexFromPos:function(a){a=x(this,a);var b=a.ch;if(a.line<this.first||0>a.ch)return 0;var c=this.lineSeparator().length;
this.iter(this.first,a.line,function(a){b+=a.text.length+c});return b},copy:function(a){var b=new Q(wd(this,this.first,this.first+this.size),this.modeOption,this.first,this.lineSep);b.scrollTop=this.scrollTop;b.scrollLeft=this.scrollLeft;b.sel=this.sel;b.extend=!1;a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory()));return b},linkedDoc:function(a){a||(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from);null!=a.to&&a.to<c&&(c=a.to);b=new Q(wd(this,
b,c),a.mode||this.modeOption,b,this.lineSep);a.sharedHist&&(b.history=this.history);(this.linked||(this.linked=[])).push({doc:b,sharedHist:a.sharedHist});b.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}];a=Ve(this);for(c=0;c<a.length;c++){var d=a[c],e=d.find(),f=b.clipPos(e.from),e=b.clipPos(e.to);w(f,e)&&(f=Wa(b,f,e,d.primary,d.primary.type),d.markers.push(f),f.parent=d)}return b},unlinkDoc:function(a){a instanceof q&&(a=a.doc);if(this.linked)for(var b=0;b<this.linked.length;++b)if(this.linked[b].doc==
a){this.linked.splice(b,1);a.unlinkDoc(this);fg(Ve(this));break}if(a.history==this.history){var c=[a.id];Fa(a,function(a){c.push(a.id)},!0);a.history=new tc(null);a.history.done=Xa(this.history.done,c);a.history.undone=Xa(this.history.undone,c)}},iterLinkedDocs:function(a){Fa(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm},splitLines:function(a){return this.lineSep?a.split(this.lineSep):xg(a)},lineSeparator:function(){return this.lineSep||"\n"}});Q.prototype.eachLine=
Q.prototype.iter;var yg="iter insert remove copy getEditor constructor".split(" "),Hb;for(Hb in Q.prototype)Q.prototype.hasOwnProperty(Hb)&&0>D(yg,Hb)&&(q.prototype[Hb]=function(a){return function(){return a.apply(this.doc,arguments)}}(Q.prototype[Hb]));Ya(Q);var O=q.e_preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},zg=q.e_stopPropagation=function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},cc=q.e_stop=function(a){O(a);zg(a)},v=q.on=function(a,b,c){a.addEventListener?
a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):(a=a._handlers||(a._handlers={}),(a[b]||(a[b]=[])).push(c))},kf=[],ja=q.off=function(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else for(a=uc(a,b,!1),b=0;b<a.length;++b)if(a[b]==c){a.splice(b,1);break}},J=q.signal=function(a,b){var c=uc(a,b,!0);if(c.length)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)},Bb=null,Gd=30,Fe=q.Pass={toString:function(){return"CodeMirror.Pass"}},
ha={scroll:!1},id={origin:"*mouse"},Eb={origin:"+move"};ua.prototype.set=function(a,b){clearTimeout(this.id);this.id=setTimeout(b,a)};var aa=q.countColumn=function(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),-1==b&&(b=a.length));d=d||0;for(e=e||0;;){var f=a.indexOf("\t",d);if(0>f||f>=b)return e+(b-d);e+=f-d;e+=c-e%c;d=f+1}},De=q.findColumn=function(a,b,c){for(var d=0,e=0;;){var f=a.indexOf("\t",d);-1==f&&(f=a.length);var g=f-d;if(f==a.length||e+g>=b)return d+Math.min(g,b-e);e+=f-d;e+=c-e%c;d=f+
1;if(e>=b)return d}},vc=[""],Za=function(a){a.select()};ob?Za=function(a){a.selectionStart=0;a.selectionEnd=a.value.length}:A&&(Za=function(a){try{a.select()}catch(b){}});var Ag=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,mf=q.isWordChar=function(a){return/\w/.test(a)||""<a&&(a.toUpperCase()!=a.toLowerCase()||Ag.test(a))},qg=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
Sa;Sa=document.createRange?function(a,b,c,d){var e=document.createRange();e.setEnd(d||a,c);e.setStart(a,b);return e}:function(a,b,c){var d=document.body.createTextRange();try{d.moveToElementText(a.parentNode)}catch(e){return d}d.collapse(!0);d.moveEnd("character",c);d.moveStart("character",b);return d};var Wc=q.contains=function(a,b){3==b.nodeType&&(b=b.parentNode);if(a.contains)return a.contains(b);do if(11==b.nodeType&&(b=b.host),b==a)return!0;while(b=b.parentNode)};A&&11>B&&(fa=function(){try{return document.activeElement}catch(a){return document.body}});
var ib=q.rmClass=function(a,b){var c=a.className,d=Db(b).exec(c);if(d){var e=c.slice(d.index+d[0].length);a.className=c.slice(0,d.index)+(e?d[1]+e:"")}},kb=q.addClass=function(a,b){var c=a.className;Db(b).test(c)||(a.className+=(c?" ":"")+b)},Cd=!1,Sf=function(){if(A&&9>B)return!1;var a=s("div");return"draggable"in a||"dragDrop"in a}(),xd,ud,xg=q.splitLines=3!="\n\nb".split(/\n/).length?function(a){for(var b=0,c=[],d=a.length;b<=d;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var f=a.slice(b,"\r"==
a.charAt(e-1)?e-1:e),g=f.indexOf("\r");-1!=g?(c.push(f.slice(0,g)),b+=g+1):(c.push(f),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)},vg=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){try{var b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},He=function(){var a=s("div");if("oncopy"in a)return!0;a.setAttribute("oncopy","return;");return"function"==typeof a.oncopy}(),
ad=null,Ia=q.keyNames={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"\x3d",91:"Mod",92:"Mod",93:"Mod",106:"*",107:"\x3d",109:"-",110:".",111:"/",127:"Delete",173:"-",186:";",187:"\x3d",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",
63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"};(function(){for(var a=0;10>a;a++)Ia[a+48]=Ia[a+96]=String(a);for(a=65;90>=a;a++)Ia[a]=String.fromCharCode(a);for(a=1;12>=a;a++)Ia[a+111]=Ia[a+63235]="F"+a})();var ub,ng=function(){function a(a){return 247>=a?"bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN".charAt(a):
1424<=a&&1524>=a?"R":1536<=a&&1773>=a?"rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm".charAt(a-1536):1774<=a&&2220>=a?"r":8192<=a&&8203>=a?"w":8204==a?"b":"L"}function b(a,b,c){this.level=a;this.from=b;this.to=c}var c=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,d=/[stwN]/,e=/[LRr]/,f=/[Lb1n]/,g=/[1n]/;return function(h){if(!c.test(h))return!1;
for(var k=h.length,l=[],m=0,p;m<k;++m)l.push(a(h.charCodeAt(m)));for(var m=0,n="L";m<k;++m)p=l[m],"m"==p?l[m]=n:n=p;m=0;for(n="L";m<k;++m)p=l[m],"1"==p&&"r"==n?l[m]="n":e.test(p)&&(n=p,"r"==p&&(l[m]="R"));m=1;for(n=l[0];m<k-1;++m)p=l[m],"+"==p&&"1"==n&&"1"==l[m+1]?l[m]="1":","!=p||n!=l[m+1]||"1"!=n&&"n"!=n||(l[m]=n),n=p;for(m=0;m<k;++m)if(p=l[m],","==p)l[m]="N";else if("%"==p){for(n=m+1;n<k&&"%"==l[n];++n);var q=m&&"!"==l[m-1]||n<k&&"1"==l[n]?"1":"N";for(p=m;p<n;++p)l[p]=q;m=n-1}m=0;for(n="L";m<k;++m)p=
l[m],"L"==n&&"1"==p?l[m]="L":e.test(p)&&(n=p);for(m=0;m<k;++m)if(d.test(l[m])){for(n=m+1;n<k&&d.test(l[n]);++n);p="L"==(n<k?l[n]:"L");q="L"==(m?l[m-1]:"L")||p?"L":"R";for(p=m;p<n;++p)l[p]=q;m=n-1}for(var n=[],r,m=0;m<k;)if(f.test(l[m])){p=m;for(++m;m<k&&f.test(l[m]);++m);n.push(new b(0,p,m))}else{var s=m,q=n.length;for(++m;m<k&&"L"!=l[m];++m);for(p=s;p<m;)if(g.test(l[p])){s<p&&n.splice(q,0,new b(1,s,p));s=p;for(++p;p<m&&g.test(l[p]);++p);n.splice(q,0,new b(2,s,p));s=p}else++p;s<m&&n.splice(q,0,new b(1,
s,m))}1==n[0].level&&(r=h.match(/^\s+/))&&(n[0].from=r[0].length,n.unshift(new b(0,0,r[0].length)));1==z(n).level&&(r=h.match(/\s+$/))&&(z(n).to-=r[0].length,n.push(new b(0,k-r[0].length,k)));2==n[0].level&&n.unshift(new b(1,n[0].to,n[0].to));n[0].level!=z(n).level&&n.push(new b(n[0].level,k,k));return n}}();q.version="5.19.0";return q});
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
    fold: "brace"
  };
});

  function keySet(array) {
    var keys = {};
    for (var i = 0; i < array.length; ++i) {
      keys[array[i]] = true;
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
    "marker-offset", "marks", "marquee-direction", "marquee-loop",
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
    "vertical-align", "visibility", "voice-balance", "voice-duration",
    "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress",
    "voice-volume", "volume", "white-space", "widows", "width", "word-break",
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
    "arabic-indic", "armenian", "asterisks", "attr", "auto", "avoid", "avoid-column", "avoid-page",
    "avoid-region", "background", "backwards", "baseline", "below", "bidi-override", "binary",
    "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box",
    "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel",
    "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian",
    "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret",
    "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch",
    "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote",
    "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse",
    "compact", "condensed", "contain", "content",
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
    "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote",
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
    "scroll", "scrollbar", "se-resize", "searchfield",
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
    "trad-chinese-formal", "trad-chinese-informal",
    "translate", "translate3d", "translateX", "translateY", "translateZ",
    "transparent", "ultra-condensed", "ultra-expanded", "underline", "up",
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

    if (support.hexNumber == true &&
      ((ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/))
      || (ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]+'/))) {
      // hex
      // ref: http://dev.mysql.com/doc/refman/5.5/en/hexadecimal-literals.html
      return "number";
    } else if (support.binaryNumber == true &&
      (((ch == "b" || ch == "B") && stream.match(/^'[01]+'/))
      || (ch == "0" && stream.match(/^b[01]+/)))) {
      // bitstring
      // ref: http://dev.mysql.com/doc/refman/5.5/en/bit-field-literals.html
      return "number";
    } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
      // numbers
      // ref: http://dev.mysql.com/doc/refman/5.5/en/number-literals.html
          stream.match(/^[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/);
      support.decimallessFloat == true && stream.eat('.');
      return "number";
    } else if (ch == "?" && (stream.eatSpace() || stream.eol() || stream.eat(";"))) {
      // placeholders
      return "variable-3";
    } else if (ch == "'" || (ch == '"' && support.doubleQuote)) {
      // strings
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    } else if ((((support.nCharCast == true && (ch == "n" || ch == "N"))
        || (support.charsetCast == true && ch == "_" && stream.match(/[a-z][a-z0-9]*/i)))
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
      if (support.zerolessFloat == true && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i)) {
        return "number";
      }
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable == true && stream.match(/^[a-zA-Z_]+/)) {
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
    keywords: set(sqlKeywords + "begin trigger proc view index for add constraint key primary foreign collate clustered nonclustered declare"),
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
  return /^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
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
  function commasep(what, end) {
    function proceed(type, value) {
      if (type == ",") {
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
  function maybedefault(_, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function typeexpr(type) {
    if (type == "variable") {cx.marked = "variable-3"; return cont(afterType);}
    if (type == "{") return cont(commasep(typeprop, "}"))
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType)
  }
  function maybeReturnType(type) {
    if (type == "=>") return cont(typeexpr)
  }
  function typeprop(type) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property"
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
    if (value == "<") return cont(commasep(typeexpr, ">"), afterType)
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
    return pass(pattern, maybetype, maybedefault);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "extends") return cont(isTS ? typeexpr : expression, classNameAfter);
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      if ((value == "static" || value == "get" || value == "set" ||
           (isTS && (value == "public" || value == "private" || value == "protected"))) &&
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
  function classfield(type) {
    if (type == ":") return cont(typeexpr)
    return pass(functiondef)
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
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
  ,   ulRE = /^[*\-+]\s+/
  ,   olRE = /^[0-9]+([.)])\s+/
  ,   taskListRE = /^\[(x| )\](?=\s)/ // Must follow ulRE or olRE
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
    } else if ((lineIsEmpty(state.prevLine) || prevLineIsList) && (stream.match(ulRE, false) || stream.match(olRE, false))) {
      var listType = null;
      if (stream.match(ulRE, true)) {
        listType = 'ul';
      } else {
        stream.match(olRE, true);
        listType = 'ol';
      }
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
    if (state.fencedChars && stream.match(state.fencedChars, false)) {
      state.localMode = state.localState = null;
      state.f = state.block = leavingLocal;
      return null;
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

    if (ch === '[' && state.imageMarker) {
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

    if (ch === '<' && stream.match(/^(!--|\w)/, false)) {
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
      state.tokens.unshift(tokenString(ch));
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

  function tokenString(quote) {
    return function(stream, state) {
      var next, end = false, escaped = false;
      while ((next = stream.next()) != null) {
        if (next === quote && !escaped) {
          end = true;
          break;
        }
        if (next === '$' && !escaped && quote !== '\'') {
          escaped = true;
          stream.backUp(1);
          state.tokens.unshift(tokenDollar);
          break;
        }
        escaped = !escaped && next === '\\';
      }
      if (end || !escaped) {
        state.tokens.shift();
      }
      return (quote === '`' || quote === ')' ? 'quote' : 'string');
    };
  };

  var tokenDollar = function(stream, state) {
    if (state.tokens.length > 1) stream.eat('$');
    var ch = stream.next(), hungry = /\w/;
    if (ch === '{') hungry = /[^}]/;
    if (ch === '(') {
      state.tokens[0] = tokenString(')');
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
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("sass", function(config) {
  function tokenRegexp(words) {
    return new RegExp("^" + words.join("|"));
  }

  var keywords = ["true", "false", "null", "auto"];
  var keywordsRegexp = new RegExp("^" + keywords.join("|"));

  var operators = ["\\(", "\\)", "=", ">", "<", "==", ">=", "<=", "\\+", "-",
                   "\\!=", "/", "\\*", "%", "and", "or", "not", ";","\\{","\\}",":"];
  var opRegexp = tokenRegexp(operators);

  var pseudoElementsRegexp = /^::?[a-zA-Z_][\w\-]*/;

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

      if (ch === ".") {
        stream.next();
        if (stream.match(/^[\w-]+/)) {
          indent(state);
          return "atom";
        } else if (stream.peek() === "#") {
          indent(state);
          return "atom";
        }
      }

      if (ch === "#") {
        stream.next();
        // ID selectors
        if (stream.match(/^[\w-]+/)) {
          indent(state);
          return "atom";
        }
        if (stream.peek() === "#") {
          indent(state);
          return "atom";
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
        return "meta";
      }

      // Other Directives
      if (ch === "@") {
        stream.next();
        stream.eatWhile(/[\w-]/);
        return "meta";
      }

      if (stream.eatWhile(/[\w-]/)){
        if(stream.match(/ *: *[\w-\+\$#!\("']/,false)){
          return "property";
        }
        else if(stream.match(/ *:/,false)){
          indent(state);
          state.cursorHalf = 1;
          return "atom";
        }
        else if(stream.match(/ *,/,false)){
          return "atom";
        }
        else{
          indent(state);
          return "atom";
        }
      }

      if(ch === ":"){
        if (stream.match(pseudoElementsRegexp)){ // could be a pseudo-element
          return "keyword";
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
          if(!stream.peek()){
            state.cursorHalf = 0;
          }
          return "number";
        }
      }

      // Numbers
      if (stream.match(/^-?[0-9\.]+/)){
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "number";
      }

      // Units
      if (stream.match(/^(px|em|in)\b/)){
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "unit";
      }

      if (stream.match(keywordsRegexp)){
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "keyword";
      }

      if (stream.match(/^url/) && stream.peek() === "(") {
        state.tokenizer = urlTokens;
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "atom";
      }

      // Variables
      if (ch === "$") {
        stream.next();
        stream.eatWhile(/[\w-]/);
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "variable-3";
      }

      // bang character for !important, !default, etc.
      if (ch === "!") {
        stream.next();
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return stream.match(/^[\w]+/) ? "keyword": "operator";
      }

      if (stream.match(opRegexp)){
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "operator";
      }

      // attributes
      if (stream.eatWhile(/[\w-]/)) {
        if(!stream.peek()){
          state.cursorHalf = 0;
        }
        return "attribute";
      }

      //stream.eatSpace();
      if(!stream.peek()){
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

var f,ba=this;
function q(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ca="closure_uid_"+(1E9*Math.random()>>>0),ea=0;var ga=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function ha(a,b){return a<b?-1:a>b?1:0};function la(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ma(a,b){this.N=[];this.Ra=b;for(var c=!0,d=a.length-1;0<=d;d--){var e=a[d]|0;c&&e==b||(this.N[d]=e,c=!1)}}var na={};function oa(a){if(-128<=a&&128>a){var b=na[a];if(b)return b}b=new ma([a|0],0>a?-1:0);-128<=a&&128>a&&(na[a]=b);return b}function qa(a){if(isNaN(a)||!isFinite(a))return ra;if(0>a)return qa(-a).$();for(var b=[],c=1,d=0;a>=c;d++)b[d]=a/c|0,c*=sa;return new ma(b,0)}var sa=4294967296,ra=oa(0),ta=oa(1),va=oa(16777216);f=ma.prototype;
f.Yb=function(){return 0<this.N.length?this.N[0]:this.Ra};f.bb=function(){if(this.ha())return-this.$().bb();for(var a=0,b=1,c=0;c<this.N.length;c++)var d=xa(this,c),a=a+(0<=d?d:sa+d)*b,b=b*sa;return a};
f.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(this.Ga())return"0";if(this.ha())return"-"+this.$().toString(a);for(var b=qa(Math.pow(a,6)),c=this,d="";;){var e=ya(c,b),g=(c.pb(e.multiply(b)).Yb()>>>0).toString(a),c=e;if(c.Ga())return g+d;for(;6>g.length;)g="0"+g;d=""+g+d}};function xa(a,b){return 0>b?0:b<a.N.length?a.N[b]:a.Ra}f.Ga=function(){if(0!=this.Ra)return!1;for(var a=0;a<this.N.length;a++)if(0!=this.N[a])return!1;return!0};f.ha=function(){return-1==this.Ra};
f.Tb=function(a){return 0<this.compare(a)};f.Ub=function(a){return 0<=this.compare(a)};f.wb=function(){return 0>this.compare(va)};f.xb=function(a){return 0>=this.compare(a)};f.compare=function(a){a=this.pb(a);return a.ha()?-1:a.Ga()?0:1};f.$=function(){return this.Wb().add(ta)};
f.add=function(a){for(var b=Math.max(this.N.length,a.N.length),c=[],d=0,e=0;e<=b;e++){var g=d+(xa(this,e)&65535)+(xa(a,e)&65535),h=(g>>>16)+(xa(this,e)>>>16)+(xa(a,e)>>>16),d=h>>>16,g=g&65535,h=h&65535;c[e]=h<<16|g}return new ma(c,c[c.length-1]&-2147483648?-1:0)};f.pb=function(a){return this.add(a.$())};
f.multiply=function(a){if(this.Ga()||a.Ga())return ra;if(this.ha())return a.ha()?this.$().multiply(a.$()):this.$().multiply(a).$();if(a.ha())return this.multiply(a.$()).$();if(this.wb()&&a.wb())return qa(this.bb()*a.bb());for(var b=this.N.length+a.N.length,c=[],d=0;d<2*b;d++)c[d]=0;for(d=0;d<this.N.length;d++)for(var e=0;e<a.N.length;e++){var g=xa(this,d)>>>16,h=xa(this,d)&65535,k=xa(a,e)>>>16,l=xa(a,e)&65535;c[2*d+2*e]+=h*l;za(c,2*d+2*e);c[2*d+2*e+1]+=g*l;za(c,2*d+2*e+1);c[2*d+2*e+1]+=h*k;za(c,2*
d+2*e+1);c[2*d+2*e+2]+=g*k;za(c,2*d+2*e+2)}for(d=0;d<b;d++)c[d]=c[2*d+1]<<16|c[2*d];for(d=b;d<2*b;d++)c[d]=0;return new ma(c,0)};function za(a,b){for(;(a[b]&65535)!=a[b];)a[b+1]+=a[b]>>>16,a[b]&=65535}
function ya(a,b){if(b.Ga())throw Error("division by zero");if(a.Ga())return ra;if(a.ha())return b.ha()?ya(a.$(),b.$()):ya(a.$(),b).$();if(b.ha())return ya(a,b.$()).$();if(30<a.N.length){if(a.ha()||b.ha())throw Error("slowDivide_ only works with positive integers.");for(var c=ta,d=b;d.xb(a);)c=c.shiftLeft(1),d=d.shiftLeft(1);for(var e=c.Va(1),g=d.Va(1),h,d=d.Va(2),c=c.Va(2);!d.Ga();)h=g.add(d),h.xb(a)&&(e=e.add(c),g=h),d=d.Va(1),c=c.Va(1);return e}c=ra;for(d=a;d.Ub(b);){e=Math.max(1,Math.floor(d.bb()/
b.bb()));g=Math.ceil(Math.log(e)/Math.LN2);g=48>=g?1:Math.pow(2,g-48);h=qa(e);for(var k=h.multiply(b);k.ha()||k.Tb(d);)e-=g,h=qa(e),k=h.multiply(b);h.Ga()&&(h=ta);c=c.add(h);d=d.pb(k)}return c}f.Wb=function(){for(var a=this.N.length,b=[],c=0;c<a;c++)b[c]=~this.N[c];return new ma(b,~this.Ra)};f.shiftLeft=function(a){var b=a>>5;a%=32;for(var c=this.N.length+b+(0<a?1:0),d=[],e=0;e<c;e++)d[e]=0<a?xa(this,e-b)<<a|xa(this,e-b-1)>>>32-a:xa(this,e-b);return new ma(d,this.Ra)};
f.Va=function(a){var b=a>>5;a%=32;for(var c=this.N.length-b,d=[],e=0;e<c;e++)d[e]=0<a?xa(this,e+b)>>>a|xa(this,e+b+1)<<32-a:xa(this,e+b);return new ma(d,this.Ra)};function Aa(a,b){null!=a&&this.append.apply(this,arguments)}f=Aa.prototype;f.Ma="";f.set=function(a){this.Ma=""+a};f.append=function(a,b,c){this.Ma+=String(a);if(null!=b)for(var d=1;d<arguments.length;d++)this.Ma+=arguments[d];return this};f.clear=function(){this.Ma=""};f.toString=function(){return this.Ma};var Ba;if("undefined"===typeof v)var v={};if("undefined"===typeof Da)var Da=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Ea)var Ea=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Fa=null;if("undefined"===typeof Ha)var Ha=null;function Ia(){return new Ja(null,5,[Ka,!0,La,!0,Ma,!1,Na,!1,Pa,null],null)}function x(a){return null!=a&&!1!==a}function Qa(a){return a instanceof Array}
function z(a,b){return a[q(null==b?null:b)]?!0:a._?!0:!1}function A(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.vb:c)?c.ib:q(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ra(a){var b=a.ib;return x(b)?b:""+C.a(a)}var Sa="undefined"!==typeof Symbol&&"function"===q(Symbol)?Symbol.iterator:"@@iterator";function Ta(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}function Va(){}
var Wa=function Wa(b){if(null!=b&&null!=b.T)return b.T(b);var c=Wa[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Wa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("ICounted.-count",b);};function Xa(){}var Ya=function Ya(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=Ya[q(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ya._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw A("ICollection.-conj",b);};function Za(){}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return E.b(arguments[0],arguments[1]);case 3:return E.g(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(c.length)].join(""));}};
E.b=function(a,b){if(null!=a&&null!=a.G)return a.G(a,b);var c=E[q(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=E._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw A("IIndexed.-nth",a);};E.g=function(a,b,c){if(null!=a&&null!=a.Y)return a.Y(a,b,c);var d=E[q(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=E._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw A("IIndexed.-nth",a);};E.P=3;
var F=function F(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=F[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=F._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("ISeq.-first",b);},G=function G(b){if(null!=b&&null!=b.ca)return b.ca(b);var c=G[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=G._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("ISeq.-rest",b);};function $a(){}function bb(){}
var cb=function cb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cb.b(arguments[0],arguments[1]);case 3:return cb.g(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(c.length)].join(""));}};
cb.b=function(a,b){if(null!=a&&null!=a.S)return a.S(a,b);var c=cb[q(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=cb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw A("ILookup.-lookup",a);};cb.g=function(a,b,c){if(null!=a&&null!=a.B)return a.B(a,b,c);var d=cb[q(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=cb._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw A("ILookup.-lookup",a);};cb.P=3;
var db=function db(b,c,d){if(null!=b&&null!=b.qa)return b.qa(b,c,d);var e=db[q(null==b?null:b)];if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);e=db._;if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);throw A("IAssociative.-assoc",b);};function eb(){}function fb(){}
var gb=function gb(b){if(null!=b&&null!=b.mb)return b.mb();var c=gb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IMapEntry.-key",b);},jb=function jb(b){if(null!=b&&null!=b.nb)return b.nb();var c=jb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IMapEntry.-val",b);};function kb(){}
var lb=function lb(b,c,d){if(null!=b&&null!=b.Ya)return b.Ya(b,c,d);var e=lb[q(null==b?null:b)];if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);e=lb._;if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);throw A("IVector.-assoc-n",b);},mb=function mb(b){if(null!=b&&null!=b.Bb)return b.state;var c=mb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IDeref.-deref",b);};function nb(){}
var ob=function ob(b){if(null!=b&&null!=b.I)return b.I(b);var c=ob[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IMeta.-meta",b);},pb=function pb(b,c){if(null!=b&&null!=b.M)return b.M(b,c);var d=pb[q(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=pb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw A("IWithMeta.-with-meta",b);};function qb(){}
var rb=function rb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return rb.b(arguments[0],arguments[1]);case 3:return rb.g(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(c.length)].join(""));}};
rb.b=function(a,b){if(null!=a&&null!=a.V)return a.V(a,b);var c=rb[q(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=rb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw A("IReduce.-reduce",a);};rb.g=function(a,b,c){if(null!=a&&null!=a.W)return a.W(a,b,c);var d=rb[q(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=rb._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw A("IReduce.-reduce",a);};rb.P=3;
var sb=function sb(b,c){if(null!=b&&null!=b.o)return b.o(b,c);var d=sb[q(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=sb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw A("IEquiv.-equiv",b);},tb=function tb(b){if(null!=b&&null!=b.H)return b.H(b);var c=tb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IHash.-hash",b);};function ub(){}
var wb=function wb(b){if(null!=b&&null!=b.J)return b.J(b);var c=wb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("ISeqable.-seq",b);};function xb(){}function yb(){}
var H=function H(b,c){if(null!=b&&null!=b.ub)return b.ub(0,c);var d=H[q(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=H._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw A("IWriter.-write",b);},zb=function zb(b,c,d){if(null!=b&&null!=b.tb)return b.tb(0,c,d);var e=zb[q(null==b?null:b)];if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);e=zb._;if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);throw A("IWatchable.-notify-watches",b);},Ab=function Ab(b){if(null!=b&&null!=
b.eb)return b.eb(b);var c=Ab[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ab._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IEditableCollection.-as-transient",b);},Bb=function Bb(b,c){if(null!=b&&null!=b.Xa)return b.Xa(b,c);var d=Bb[q(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Bb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw A("ITransientCollection.-conj!",b);},Cb=function Cb(b){if(null!=b&&null!=b.hb)return b.hb(b);var c=Cb[q(null==b?
null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Cb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("ITransientCollection.-persistent!",b);},Db=function Db(b,c,d){if(null!=b&&null!=b.Na)return b.Na(b,c,d);var e=Db[q(null==b?null:b)];if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);e=Db._;if(null!=e)return e.g?e.g(b,c,d):e.call(null,b,c,d);throw A("ITransientAssociative.-assoc!",b);},Eb=function Eb(b){if(null!=b&&null!=b.qb)return b.qb();var c=Eb[q(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Eb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IChunk.-drop-first",b);},Fb=function Fb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Fb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Fb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IChunkedSeq.-chunked-first",b);},Gb=function Gb(b){if(null!=b&&null!=b.cb)return b.cb(b);var c=Gb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Gb._;if(null!=c)return c.a?c.a(b):c.call(null,
b);throw A("IChunkedSeq.-chunked-rest",b);},Hb=function Hb(b,c){if(null!=b&&null!=b.Lb)return b.Lb(b,c);var d=Hb[q(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Hb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw A("IReset.-reset!",b);},I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return I.b(arguments[0],arguments[1]);case 3:return I.g(arguments[0],arguments[1],arguments[2]);case 4:return I.u(arguments[0],
arguments[1],arguments[2],arguments[3]);case 5:return I.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([C.a("Invalid arity: "),C.a(c.length)].join(""));}};I.b=function(a,b){if(null!=a&&null!=a.Nb)return a.Nb(a,b);var c=I[q(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=I._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw A("ISwap.-swap!",a);};
I.g=function(a,b,c){if(null!=a&&null!=a.Ob)return a.Ob(a,b,c);var d=I[q(null==a?null:a)];if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);d=I._;if(null!=d)return d.g?d.g(a,b,c):d.call(null,a,b,c);throw A("ISwap.-swap!",a);};I.u=function(a,b,c,d){if(null!=a&&null!=a.Pb)return a.Pb(a,b,c,d);var e=I[q(null==a?null:a)];if(null!=e)return e.u?e.u(a,b,c,d):e.call(null,a,b,c,d);e=I._;if(null!=e)return e.u?e.u(a,b,c,d):e.call(null,a,b,c,d);throw A("ISwap.-swap!",a);};
I.D=function(a,b,c,d,e){if(null!=a&&null!=a.Qb)return a.Qb(a,b,c,d,e);var g=I[q(null==a?null:a)];if(null!=g)return g.D?g.D(a,b,c,d,e):g.call(null,a,b,c,d,e);g=I._;if(null!=g)return g.D?g.D(a,b,c,d,e):g.call(null,a,b,c,d,e);throw A("ISwap.-swap!",a);};I.P=5;var Jb=function Jb(b){if(null!=b&&null!=b.ma)return b.ma(b);var c=Jb[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IIterable.-iterator",b);};
function Kb(a){this.Xb=a;this.i=1073741824;this.w=0}Kb.prototype.ub=function(a,b){return this.Xb.append(b)};function Lb(a){var b=new Aa;a.L(null,new Kb(b),Ia());return""+C.a(b)}var Mb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Nb(a){a=Mb(a|0,-862048943);return Mb(a<<15|a>>>-15,461845907)}
function Ob(a,b){var c=(a|0)^(b|0);return Mb(c<<13|c>>>-13,5)+-430675100|0}function Pb(a,b){var c=(a|0)^b,c=Mb(c^c>>>16,-2048144789),c=Mb(c^c>>>13,-1028477387);return c^c>>>16}function Qb(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Ob(c,Nb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Nb(a.charCodeAt(a.length-1)):b;return Pb(b,Mb(2,a.length))}var Rb={},Sb=0;
function Tb(a){255<Sb&&(Rb={},Sb=0);if(null==a)return 0;var b=Rb[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Mb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;Rb[a]=b;Sb+=1}return a=b}
function Ub(a){if(null!=a&&(a.i&4194304||v===a.cc))return a.H(null)^0;if("number"===typeof a){if(x(isFinite(a)))return Math.floor(a)%2147483647;switch(a){case Infinity:return 2146435072;case -Infinity:return-1048576;default:return 2146959360}}else return!0===a?a=1231:!1===a?a=1237:"string"===typeof a?(a=Tb(a),0!==a&&(a=Nb(a),a=Ob(0,a),a=Pb(a,4))):a=a instanceof Date?a.valueOf()^0:null==a?0:tb(a)^0,a}function Vb(a,b){return a^b+2654435769+(a<<6)+(a>>2)}
function Wb(a,b,c,d,e){this.ab=a;this.name=b;this.La=c;this.Sa=d;this.fa=e;this.i=2154168321;this.w=4096}f=Wb.prototype;f.toString=function(){return this.La};f.equiv=function(a){return this.o(null,a)};f.o=function(a,b){return b instanceof Wb?this.La===b.La:!1};
f.call=function(){function a(a,b,c){return K.g?K.g(b,this,c):K.call(null,b,this,c)}function b(a,b){return K.b?K.b(b,this):K.call(null,b,this)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,g)}throw Error("Invalid arity: "+(arguments.length-1));};c.b=b;c.g=a;return c}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return K.b?K.b(a,this):K.call(null,a,this)};
f.b=function(a,b){return K.g?K.g(a,this,b):K.call(null,a,this,b)};f.I=function(){return this.fa};f.M=function(a,b){return new Wb(this.ab,this.name,this.La,this.Sa,b)};f.H=function(){var a=this.Sa;return null!=a?a:this.Sa=a=Vb(Qb(this.name),Tb(this.ab))};f.L=function(a,b){return H(b,this.La)};
function L(a){if(null==a)return null;if(null!=a&&(a.i&8388608||v===a.Mb))return a.J(null);if(Qa(a)||"string"===typeof a)return 0===a.length?null:new M(a,0,null);if(z(ub,a))return wb(a);throw Error([C.a(a),C.a(" is not ISeqable")].join(""));}function N(a){if(null==a)return null;if(null!=a&&(a.i&64||v===a.Wa))return a.Z(null);a=L(a);return null==a?null:F(a)}function Xb(a){return null!=a?null!=a&&(a.i&64||v===a.Wa)?a.ca(null):(a=L(a))?G(a):Yb:Yb}
function O(a){return null==a?null:null!=a&&(a.i&128||v===a.gb)?a.ba(null):L(Xb(a))}var P=function P(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return P.a(arguments[0]);case 2:return P.b(arguments[0],arguments[1]);default:return P.C(arguments[0],arguments[1],new M(c.slice(2),0,null))}};P.a=function(){return!0};P.b=function(a,b){return null==a?null==b:a===b||sb(a,b)};
P.C=function(a,b,c){for(;;)if(P.b(a,b))if(O(c))a=b,b=N(c),c=O(c);else return P.b(b,N(c));else return!1};P.O=function(a){var b=N(a),c=O(a);a=N(c);c=O(c);return P.C(b,a,c)};P.P=2;function Zb(a){this.v=a}Zb.prototype.next=function(){if(null!=this.v){var a=N(this.v);this.v=O(this.v);return{value:a,done:!1}}return{value:null,done:!0}};function $b(a){return new Zb(L(a))}function ac(a,b){var c=Nb(a),c=Ob(0,c);return Pb(c,b)}
function bc(a){var b=0,c=1;for(a=L(a);;)if(null!=a)b+=1,c=Mb(31,c)+Ub(N(a))|0,a=O(a);else return ac(c,b)}var cc=ac(1,0);function dc(a){var b=0,c=0;for(a=L(a);;)if(null!=a)b+=1,c=c+Ub(N(a))|0,a=O(a);else return ac(c,b)}var ec=ac(0,0);Va["null"]=!0;Wa["null"]=function(){return 0};Date.prototype.o=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};sb.number=function(a,b){return a===b};nb["function"]=!0;ob["function"]=function(){return null};tb._=function(a){return a[ca]||(a[ca]=++ea)};
function R(a){return mb(a)}function fc(a,b){var c=Wa(a);if(0===c)return b.F?b.F():b.call(null);for(var d=E.b(a,0),e=1;;)if(e<c)var g=E.b(a,e),d=b.b?b.b(d,g):b.call(null,d,g),e=e+1;else return d}function gc(a,b,c){var d=Wa(a),e=c;for(c=0;;)if(c<d){var g=E.b(a,c),e=b.b?b.b(e,g):b.call(null,e,g);c+=1}else return e}function hc(a,b){var c=a.length;if(0===a.length)return b.F?b.F():b.call(null);for(var d=a[0],e=1;;)if(e<c)var g=a[e],d=b.b?b.b(d,g):b.call(null,d,g),e=e+1;else return d}
function ic(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var g=a[c],e=b.b?b.b(e,g):b.call(null,e,g);c+=1}else return e}function kc(a,b,c,d){for(var e=a.length;;)if(d<e){var g=a[d];c=b.b?b.b(c,g):b.call(null,c,g);d+=1}else return c}function lc(a){return null!=a?a.i&2||v===a.Ab?!0:a.i?!1:z(Va,a):z(Va,a)}function mc(a){return null!=a?a.i&16||v===a.sb?!0:a.i?!1:z(Za,a):z(Za,a)}
function S(a,b,c){var d=T.a?T.a(a):T.call(null,a);if(c>=d)return-1;!(0<c)&&0>c&&(c+=d,c=0>c?0:c);for(;;)if(c<d){if(P.b(nc?nc(a,c):oc.call(null,a,c),b))return c;c+=1}else return-1}function U(a,b,c){var d=T.a?T.a(a):T.call(null,a);if(0===d)return-1;0<c?(--d,c=d<c?d:c):c=0>c?d+c:c;for(;;)if(0<=c){if(P.b(nc?nc(a,c):oc.call(null,a,c),b))return c;--c}else return-1}function pc(a,b){this.c=a;this.j=b}pc.prototype.ga=function(){return this.j<this.c.length};
pc.prototype.next=function(){var a=this.c[this.j];this.j+=1;return a};function M(a,b,c){this.c=a;this.j=b;this.l=c;this.i=166592766;this.w=8192}f=M.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T.a?T.a(this):T.call(null,this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.G=function(a,b){var c=b+this.j;if(0<=c&&c<this.c.length)return this.c[c];throw Error("Index out of bounds");};f.Y=function(a,b,c){a=b+this.j;return 0<=a&&a<this.c.length?this.c[a]:c};
f.ma=function(){return new pc(this.c,this.j)};f.I=function(){return this.l};f.ba=function(){return this.j+1<this.c.length?new M(this.c,this.j+1,null):null};f.T=function(){var a=this.c.length-this.j;return 0>a?0:a};f.H=function(){return bc(this)};f.o=function(a,b){return qc.b?qc.b(this,b):qc.call(null,this,b)};f.V=function(a,b){return kc(this.c,b,this.c[this.j],this.j+1)};f.W=function(a,b,c){return kc(this.c,b,c,this.j)};f.Z=function(){return this.c[this.j]};
f.ca=function(){return this.j+1<this.c.length?new M(this.c,this.j+1,null):Yb};f.J=function(){return this.j<this.c.length?this:null};f.M=function(a,b){return new M(this.c,this.j,b)};f.R=function(a,b){return V.b?V.b(b,this):V.call(null,b,this)};M.prototype[Sa]=function(){return $b(this)};function rc(a,b){return b<a.length?new M(a,b,null):null}
function sc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return rc(arguments[0],0);case 2:return rc(arguments[0],arguments[1]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}sb._=function(a,b){return a===b};
var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return tc.F();case 1:return tc.a(arguments[0]);case 2:return tc.b(arguments[0],arguments[1]);default:return tc.C(arguments[0],arguments[1],new M(c.slice(2),0,null))}};tc.F=function(){return uc};tc.a=function(a){return a};tc.b=function(a,b){return null!=a?Ya(a,b):Ya(Yb,b)};tc.C=function(a,b,c){for(;;)if(x(c))a=tc.b(a,b),b=N(c),c=O(c);else return tc.b(a,b)};
tc.O=function(a){var b=N(a),c=O(a);a=N(c);c=O(c);return tc.C(b,a,c)};tc.P=2;function T(a){if(null!=a)if(null!=a&&(a.i&2||v===a.Ab))a=a.T(null);else if(Qa(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||v===a.Mb))a:{a=L(a);for(var b=0;;){if(lc(a)){a=b+Wa(a);break a}a=O(a);b+=1}}else a=Wa(a);else a=0;return a}function vc(a,b,c){for(;;){if(null==a)return c;if(0===b)return L(a)?N(a):c;if(mc(a))return E.g(a,b,c);if(L(a))a=O(a),--b;else return c}}
function oc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return nc(arguments[0],arguments[1]);case 3:return W(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}
function nc(a,b){if("number"!==typeof b)throw Error("Index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||v===a.sb))return a.G(null,b);if(Qa(a)){if(0<=b&&b<a.length)return a[b];throw Error("Index out of bounds");}if("string"===typeof a){if(0<=b&&b<a.length)return a.charAt(b);throw Error("Index out of bounds");}if(null!=a&&(a.i&64||v===a.Wa)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(L(c)){c=N(c);break a}throw Error("Index out of bounds");
}if(mc(c)){c=E.b(c,d);break a}if(L(c))c=O(c),--d;else throw Error("Index out of bounds");}}return c}if(z(Za,a))return E.b(a,b);throw Error([C.a("nth not supported on this type "),C.a(Ra(null==a?null:a.constructor))].join(""));}
function W(a,b,c){if("number"!==typeof b)throw Error("Index argument to nth must be a number.");if(null==a)return c;if(null!=a&&(a.i&16||v===a.sb))return a.Y(null,b,c);if(Qa(a))return 0<=b&&b<a.length?a[b]:c;if("string"===typeof a)return 0<=b&&b<a.length?a.charAt(b):c;if(null!=a&&(a.i&64||v===a.Wa))return vc(a,b,c);if(z(Za,a))return E.b(a,b);throw Error([C.a("nth not supported on this type "),C.a(Ra(null==a?null:a.constructor))].join(""));}
var K=function K(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return K.b(arguments[0],arguments[1]);case 3:return K.g(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(c.length)].join(""));}};K.b=function(a,b){return null==a?null:null!=a&&(a.i&256||v===a.Fb)?a.S(null,b):Qa(a)?null!=b&&b<a.length?a[b|0]:null:"string"===typeof a?null!=b&&b<a.length?a.charAt(b|0):null:z(bb,a)?cb.b(a,b):null};
K.g=function(a,b,c){return null!=a?null!=a&&(a.i&256||v===a.Fb)?a.B(null,b,c):Qa(a)?null!=b&&0<=b&&b<a.length?a[b|0]:c:"string"===typeof a?null!=b&&0<=b&&b<a.length?a.charAt(b|0):c:z(bb,a)?cb.g(a,b,c):c:c};K.P=3;var wc=function wc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return wc.g(arguments[0],arguments[1],arguments[2]);default:return wc.C(arguments[0],arguments[1],arguments[2],new M(c.slice(3),0,null))}};
wc.g=function(a,b,c){if(null!=a)a=db(a,b,c);else{a=[b,c];b=[];for(c=0;;)if(c<a.length){var d=a[c],e=a[c+1],g=xc(b,d);-1===g?(g=b,g.push(d),g.push(e)):b[g+1]=e;c+=2}else break;a=new Ja(null,b.length/2,b,null)}return a};wc.C=function(a,b,c,d){for(;;)if(a=wc.g(a,b,c),x(d))b=N(d),c=N(O(d)),d=O(O(d));else return a};wc.O=function(a){var b=N(a),c=O(a);a=N(c);var d=O(c),c=N(d),d=O(d);return wc.C(b,a,c,d)};wc.P=3;function yc(a,b){this.f=a;this.l=b;this.i=393217;this.w=0}f=yc.prototype;f.I=function(){return this.l};
f.M=function(a,b){return new yc(this.f,b)};
f.call=function(){function a(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J,Q,ja){a=this;return zc.fb?zc.fb(a.f,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J,Q,ja):zc.call(null,a.f,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J,Q,ja)}function b(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J,Q){a=this;return a.f.Ba?a.f.Ba(b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J,Q):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J,Q)}function c(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J){a=this;return a.f.Aa?a.f.Aa(b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,
y,J):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y,J)}function d(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y){a=this;return a.f.za?a.f.za(b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,y)}function e(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D){a=this;return a.f.ya?a.f.ya(b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D)}function g(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B){a=this;return a.f.xa?a.f.xa(b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B):a.f.call(null,
b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B)}function h(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w){a=this;return a.f.wa?a.f.wa(b,c,d,e,g,h,k,l,m,n,p,r,t,u,w):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w)}function k(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u){a=this;return a.f.va?a.f.va(b,c,d,e,g,h,k,l,m,n,p,r,t,u):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t,u)}function l(a,b,c,d,e,g,h,k,l,m,n,p,r,t){a=this;return a.f.ua?a.f.ua(b,c,d,e,g,h,k,l,m,n,p,r,t):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r,t)}function m(a,b,c,d,e,g,h,k,l,m,n,p,r){a=this;
return a.f.ta?a.f.ta(b,c,d,e,g,h,k,l,m,n,p,r):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p,r)}function n(a,b,c,d,e,g,h,k,l,m,n,p){a=this;return a.f.sa?a.f.sa(b,c,d,e,g,h,k,l,m,n,p):a.f.call(null,b,c,d,e,g,h,k,l,m,n,p)}function p(a,b,c,d,e,g,h,k,l,m,n){a=this;return a.f.ra?a.f.ra(b,c,d,e,g,h,k,l,m,n):a.f.call(null,b,c,d,e,g,h,k,l,m,n)}function r(a,b,c,d,e,g,h,k,l,m){a=this;return a.f.Fa?a.f.Fa(b,c,d,e,g,h,k,l,m):a.f.call(null,b,c,d,e,g,h,k,l,m)}function t(a,b,c,d,e,g,h,k,l){a=this;return a.f.Ea?a.f.Ea(b,c,
d,e,g,h,k,l):a.f.call(null,b,c,d,e,g,h,k,l)}function u(a,b,c,d,e,g,h,k){a=this;return a.f.Da?a.f.Da(b,c,d,e,g,h,k):a.f.call(null,b,c,d,e,g,h,k)}function w(a,b,c,d,e,g,h){a=this;return a.f.Ca?a.f.Ca(b,c,d,e,g,h):a.f.call(null,b,c,d,e,g,h)}function B(a,b,c,d,e,g){a=this;return a.f.D?a.f.D(b,c,d,e,g):a.f.call(null,b,c,d,e,g)}function D(a,b,c,d,e){a=this;return a.f.u?a.f.u(b,c,d,e):a.f.call(null,b,c,d,e)}function J(a,b,c,d){a=this;return a.f.g?a.f.g(b,c,d):a.f.call(null,b,c,d)}function Q(a,b,c){a=this;
return a.f.b?a.f.b(b,c):a.f.call(null,b,c)}function ja(a,b){a=this;return a.f.a?a.f.a(b):a.f.call(null,b)}function ib(a){a=this;return a.f.F?a.f.F():a.f.call(null)}var y=null,y=function(y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib,jc,Qc,vd,we,qf){switch(arguments.length){case 1:return ib.call(this,y);case 2:return ja.call(this,y,aa);case 3:return Q.call(this,y,aa,da);case 4:return J.call(this,y,aa,da,fa);case 5:return D.call(this,y,aa,da,fa,ia);case 6:return B.call(this,y,aa,da,fa,ia,ka);case 7:return w.call(this,
y,aa,da,fa,ia,ka,pa);case 8:return u.call(this,y,aa,da,fa,ia,ka,pa,ua);case 9:return t.call(this,y,aa,da,fa,ia,ka,pa,ua,wa);case 10:return r.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca);case 11:return p.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga);case 12:return n.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa);case 13:return m.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua);case 14:return l.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab);case 15:return k.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,
Ua,ab,hb);case 16:return h.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb);case 17:return g.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib);case 18:return e.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib,jc);case 19:return d.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib,jc,Qc);case 20:return c.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib,jc,Qc,vd);case 21:return b.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib,jc,Qc,vd,
we);case 22:return a.call(this,y,aa,da,fa,ia,ka,pa,ua,wa,Ca,Ga,Oa,Ua,ab,hb,vb,Ib,jc,Qc,vd,we,qf)}throw Error("Invalid arity: "+(arguments.length-1));};y.a=ib;y.b=ja;y.g=Q;y.u=J;y.D=D;y.Ca=B;y.Da=w;y.Ea=u;y.Fa=t;y.ra=r;y.sa=p;y.ta=n;y.ua=m;y.va=l;y.wa=k;y.xa=h;y.ya=g;y.za=e;y.Aa=d;y.Ba=c;y.Eb=b;y.fb=a;return y}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.F=function(){return this.f.F?this.f.F():this.f.call(null)};
f.a=function(a){return this.f.a?this.f.a(a):this.f.call(null,a)};f.b=function(a,b){return this.f.b?this.f.b(a,b):this.f.call(null,a,b)};f.g=function(a,b,c){return this.f.g?this.f.g(a,b,c):this.f.call(null,a,b,c)};f.u=function(a,b,c,d){return this.f.u?this.f.u(a,b,c,d):this.f.call(null,a,b,c,d)};f.D=function(a,b,c,d,e){return this.f.D?this.f.D(a,b,c,d,e):this.f.call(null,a,b,c,d,e)};f.Ca=function(a,b,c,d,e,g){return this.f.Ca?this.f.Ca(a,b,c,d,e,g):this.f.call(null,a,b,c,d,e,g)};
f.Da=function(a,b,c,d,e,g,h){return this.f.Da?this.f.Da(a,b,c,d,e,g,h):this.f.call(null,a,b,c,d,e,g,h)};f.Ea=function(a,b,c,d,e,g,h,k){return this.f.Ea?this.f.Ea(a,b,c,d,e,g,h,k):this.f.call(null,a,b,c,d,e,g,h,k)};f.Fa=function(a,b,c,d,e,g,h,k,l){return this.f.Fa?this.f.Fa(a,b,c,d,e,g,h,k,l):this.f.call(null,a,b,c,d,e,g,h,k,l)};f.ra=function(a,b,c,d,e,g,h,k,l,m){return this.f.ra?this.f.ra(a,b,c,d,e,g,h,k,l,m):this.f.call(null,a,b,c,d,e,g,h,k,l,m)};
f.sa=function(a,b,c,d,e,g,h,k,l,m,n){return this.f.sa?this.f.sa(a,b,c,d,e,g,h,k,l,m,n):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n)};f.ta=function(a,b,c,d,e,g,h,k,l,m,n,p){return this.f.ta?this.f.ta(a,b,c,d,e,g,h,k,l,m,n,p):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p)};f.ua=function(a,b,c,d,e,g,h,k,l,m,n,p,r){return this.f.ua?this.f.ua(a,b,c,d,e,g,h,k,l,m,n,p,r):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r)};
f.va=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t){return this.f.va?this.f.va(a,b,c,d,e,g,h,k,l,m,n,p,r,t):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t)};f.wa=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u){return this.f.wa?this.f.wa(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u)};f.xa=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w){return this.f.xa?this.f.xa(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w)};
f.ya=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B){return this.f.ya?this.f.ya(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B)};f.za=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D){return this.f.za?this.f.za(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D)};
f.Aa=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J){return this.f.Aa?this.f.Aa(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J)};f.Ba=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q){return this.f.Ba?this.f.Ba(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q):this.f.call(null,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q)};
f.Eb=function(a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja){return zc.fb?zc.fb(this.f,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja):zc.call(null,this.f,a,b,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja)};function Ac(a){var b=null!=a;return(b?null!=a?a.i&131072||v===a.Ib||(a.i?0:z(nb,a)):z(nb,a):b)?ob(a):null}function Bc(a){return null!=a?a.i&16777216||v===a.ec?!0:a.i?!1:z(xb,a):z(xb,a)}function Cc(a){return null==a?!1:null!=a?a.i&1024||v===a.Gb?!0:a.i?!1:z(eb,a):z(eb,a)}
function Dc(a){return null!=a?a.i&16384||v===a.fc?!0:a.i?!1:z(kb,a):z(kb,a)}function Ec(a){return null!=a?a.w&512||v===a.$b?!0:!1:!1}function Fc(a){var b=[];la(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Gc(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Hc={};function Ic(a){return null==a?!1:!1===a?!1:!0}function Jc(a,b){var c=L(b);if(c){var d=N(c),c=O(c);return Kc?Kc(a,d,c):Lc.call(null,a,d,c)}return a.F?a.F():a.call(null)}
function Mc(a,b,c){for(c=L(c);;)if(c){var d=N(c);b=a.b?a.b(b,d):a.call(null,b,d);c=O(c)}else return b}function Lc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return b=arguments[0],c=arguments[1],null!=c&&(c.i&524288||v===c.Kb)?c.V(null,b):Qa(c)?hc(c,b):"string"===typeof c?hc(c,b):z(qb,c)?rb.b(c,b):Jc(b,c);case 3:return Kc(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}
function Kc(a,b,c){return null!=c&&(c.i&524288||v===c.Kb)?c.W(null,a,b):Qa(c)?ic(c,a,b):"string"===typeof c?ic(c,a,b):z(qb,c)?rb.g(c,a,b):Mc(a,b,c)}function Nc(a){return a}function Oc(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Pc(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return C.F();case 1:return C.a(arguments[0]);default:return C.C(arguments[0],new M(c.slice(1),0,null))}};C.F=function(){return""};C.a=function(a){return null==a?"":""+a};C.C=function(a,b){for(var c=new Aa(""+C.a(a)),d=b;;)if(x(d))c=c.append(""+C.a(N(d))),d=O(d);else return c.toString()};C.O=function(a){var b=N(a);a=O(a);return C.C(b,a)};C.P=1;
function qc(a,b){var c;if(Bc(b))if(lc(a)&&lc(b)&&T(a)!==T(b))c=!1;else a:{c=L(a);for(var d=L(b);;){if(null==c){c=null==d;break a}if(null!=d&&P.b(N(c),N(d)))c=O(c),d=O(d);else{c=!1;break a}}}else c=null;return Ic(c)}function Rc(a,b,c,d,e){this.l=a;this.first=b;this.Ha=c;this.count=d;this.m=e;this.i=65937646;this.w=8192}f=Rc.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,this.count)}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.ba=function(){return 1===this.count?null:this.Ha};f.T=function(){return this.count};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};
f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return this.first};f.ca=function(){return 1===this.count?Yb:this.Ha};f.J=function(){return this};f.M=function(a,b){return new Rc(b,this.first,this.Ha,this.count,this.m)};f.R=function(a,b){return new Rc(this.l,b,this,this.count+1,null)};Rc.prototype[Sa]=function(){return $b(this)};function Sc(a){this.l=a;this.i=65937614;this.w=8192}f=Sc.prototype;f.toString=function(){return Lb(this)};
f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.ba=function(){return null};f.T=function(){return 0};f.H=function(){return cc};f.o=function(a,b){return(null!=b?b.i&33554432||v===b.dc||(b.i?0:z(yb,b)):z(yb,b))||Bc(b)?null==L(b):!1};
f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return null};f.ca=function(){return Yb};f.J=function(){return null};f.M=function(a,b){return new Sc(b)};f.R=function(a,b){return new Rc(this.l,b,null,1,null)};var Yb=new Sc(null);Sc.prototype[Sa]=function(){return $b(this)};function Tc(a,b,c,d){this.l=a;this.first=b;this.Ha=c;this.m=d;this.i=65929452;this.w=8192}f=Tc.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.ba=function(){return null==this.Ha?null:L(this.Ha)};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return Jc(b,this)};
f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return this.first};f.ca=function(){return null==this.Ha?Yb:this.Ha};f.J=function(){return this};f.M=function(a,b){return new Tc(b,this.first,this.Ha,this.m)};f.R=function(a,b){return new Tc(null,b,this,null)};Tc.prototype[Sa]=function(){return $b(this)};function V(a,b){return null==b||null!=b&&(b.i&64||v===b.Wa)?new Tc(null,a,b,null):new Tc(null,a,L(b),null)}
function X(a,b,c,d){this.ab=a;this.name=b;this.Ja=c;this.Sa=d;this.i=2153775105;this.w=4096}f=X.prototype;f.toString=function(){return[C.a(":"),C.a(this.Ja)].join("")};f.equiv=function(a){return this.o(null,a)};f.o=function(a,b){return b instanceof X?this.Ja===b.Ja:!1};
f.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return K.b(c,this);case 3:return K.g(c,this,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return K.b(c,this)};a.g=function(a,c,d){return K.g(c,this,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return K.b(a,this)};f.b=function(a,b){return K.g(a,this,b)};
f.H=function(){var a=this.Sa;return null!=a?a:this.Sa=a=Vb(Qb(this.name),Tb(this.ab))+2654435769|0};f.L=function(a,b){return H(b,[C.a(":"),C.a(this.Ja)].join(""))};var Uc=function Uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Uc.a(arguments[0]);case 2:return Uc.b(arguments[0],arguments[1]);default:throw Error([C.a("Invalid arity: "),C.a(c.length)].join(""));}};
Uc.a=function(a){if(a instanceof X)return a;if(a instanceof Wb){var b;if(null!=a&&(a.w&4096||v===a.Jb))b=a.ab;else throw Error([C.a("Doesn't support namespace: "),C.a(a)].join(""));return new X(b,Vc.a?Vc.a(a):Vc.call(null,a),a.La,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new X(b[0],b[1],a,null):new X(null,b[0],a,null)):null};
Uc.b=function(a,b){var c=a instanceof X?Vc.a?Vc.a(a):Vc.call(null,a):a instanceof Wb?Vc.a?Vc.a(a):Vc.call(null,a):a,d=b instanceof X?Vc.a?Vc.a(b):Vc.call(null,b):b instanceof Wb?Vc.a?Vc.a(b):Vc.call(null,b):b;return new X(c,d,[C.a(x(c)?[C.a(c),C.a("/")].join(""):null),C.a(d)].join(""),null)};Uc.P=2;function Wc(a,b,c,d){this.l=a;this.Ua=b;this.v=c;this.m=d;this.i=32374988;this.w=1}f=Wc.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
function Xc(a){null!=a.Ua&&(a.v=a.Ua.F?a.Ua.F():a.Ua.call(null),a.Ua=null);return a.v}f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.ba=function(){this.J(null);return null==this.v?null:O(this.v)};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};
f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){this.J(null);return null==this.v?null:N(this.v)};f.ca=function(){this.J(null);return null!=this.v?Xb(this.v):Yb};f.J=function(){Xc(this);if(null==this.v)return null;for(var a=this.v;;)if(a instanceof Wc)a=Xc(a);else return this.v=a,L(this.v)};f.M=function(a,b){return new Wc(b,this.Ua,this.v,this.m)};f.R=function(a,b){return V(b,this)};Wc.prototype[Sa]=function(){return $b(this)};
function Yc(a,b){this.kb=a;this.end=b;this.i=2;this.w=0}Yc.prototype.add=function(a){this.kb[this.end]=a;return this.end+=1};Yc.prototype.pa=function(){var a=new Zc(this.kb,0,this.end);this.kb=null;return a};Yc.prototype.T=function(){return this.end};function Zc(a,b,c){this.c=a;this.off=b;this.end=c;this.i=524306;this.w=0}f=Zc.prototype;f.T=function(){return this.end-this.off};f.G=function(a,b){return this.c[this.off+b]};f.Y=function(a,b,c){return 0<=b&&b<this.end-this.off?this.c[this.off+b]:c};
f.qb=function(){if(this.off===this.end)throw Error("-drop-first of empty chunk");return new Zc(this.c,this.off+1,this.end)};f.V=function(a,b){return kc(this.c,b,this.c[this.off],this.off+1)};f.W=function(a,b,c){return kc(this.c,b,c,this.off)};function $c(a,b,c,d){this.pa=a;this.na=b;this.l=c;this.m=d;this.i=31850732;this.w=1536}f=$c.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.ba=function(){if(1<Wa(this.pa))return new $c(Eb(this.pa),this.na,this.l,null);var a=wb(this.na);return null==a?null:a};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};
f.o=function(a,b){return qc(this,b)};f.Z=function(){return E.b(this.pa,0)};f.ca=function(){return 1<Wa(this.pa)?new $c(Eb(this.pa),this.na,this.l,null):null==this.na?Yb:this.na};f.J=function(){return this};f.lb=function(){return this.pa};f.cb=function(){return null==this.na?Yb:this.na};f.M=function(a,b){return new $c(this.pa,this.na,b,this.m)};f.R=function(a,b){return V(b,this)};f.rb=function(){return null==this.na?null:this.na};$c.prototype[Sa]=function(){return $b(this)};
function ad(a,b){return 0===Wa(a)?b:new $c(a,b,null,null)}function bd(a,b){a.add(b)}function cd(a){for(var b=[];;)if(L(a))b.push(N(a)),a=O(a);else return b}function dd(a,b){if(lc(b))return T(b);for(var c=0,d=L(b);;)if(null!=d&&c<a)c+=1,d=O(d);else return c}var ed=function ed(b){var c;if(null==b)c=null;else if(null==O(b))c=L(N(b));else{c=V;var d=N(b);b=O(b);b=ed.a?ed.a(b):ed.call(null,b);c=c(d,b)}return c};
function fd(a,b,c){var d=L(c);if(0===b)return a.F?a.F():a.call(null);c=F(d);var e=G(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=F(e),g=G(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=F(g),h=G(g);if(3===b)return a.g?a.g(c,d,e):a.g?a.g(c,d,e):a.call(null,c,d,e);var g=F(h),k=G(h);if(4===b)return a.u?a.u(c,d,e,g):a.u?a.u(c,d,e,g):a.call(null,c,d,e,g);var h=F(k),l=G(k);if(5===b)return a.D?a.D(c,d,e,g,h):a.D?a.D(c,d,e,g,h):a.call(null,c,d,e,g,h);var k=F(l),m=G(l);
if(6===b)return a.Ca?a.Ca(c,d,e,g,h,k):a.Ca?a.Ca(c,d,e,g,h,k):a.call(null,c,d,e,g,h,k);var l=F(m),n=G(m);if(7===b)return a.Da?a.Da(c,d,e,g,h,k,l):a.Da?a.Da(c,d,e,g,h,k,l):a.call(null,c,d,e,g,h,k,l);var m=F(n),p=G(n);if(8===b)return a.Ea?a.Ea(c,d,e,g,h,k,l,m):a.Ea?a.Ea(c,d,e,g,h,k,l,m):a.call(null,c,d,e,g,h,k,l,m);var n=F(p),r=G(p);if(9===b)return a.Fa?a.Fa(c,d,e,g,h,k,l,m,n):a.Fa?a.Fa(c,d,e,g,h,k,l,m,n):a.call(null,c,d,e,g,h,k,l,m,n);var p=F(r),t=G(r);if(10===b)return a.ra?a.ra(c,d,e,g,h,k,l,m,n,
p):a.ra?a.ra(c,d,e,g,h,k,l,m,n,p):a.call(null,c,d,e,g,h,k,l,m,n,p);var r=F(t),u=G(t);if(11===b)return a.sa?a.sa(c,d,e,g,h,k,l,m,n,p,r):a.sa?a.sa(c,d,e,g,h,k,l,m,n,p,r):a.call(null,c,d,e,g,h,k,l,m,n,p,r);var t=F(u),w=G(u);if(12===b)return a.ta?a.ta(c,d,e,g,h,k,l,m,n,p,r,t):a.ta?a.ta(c,d,e,g,h,k,l,m,n,p,r,t):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t);var u=F(w),B=G(w);if(13===b)return a.ua?a.ua(c,d,e,g,h,k,l,m,n,p,r,t,u):a.ua?a.ua(c,d,e,g,h,k,l,m,n,p,r,t,u):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u);var w=F(B),
D=G(B);if(14===b)return a.va?a.va(c,d,e,g,h,k,l,m,n,p,r,t,u,w):a.va?a.va(c,d,e,g,h,k,l,m,n,p,r,t,u,w):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w);var B=F(D),J=G(D);if(15===b)return a.wa?a.wa(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B):a.wa?a.wa(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B);var D=F(J),Q=G(J);if(16===b)return a.xa?a.xa(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D):a.xa?a.xa(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D);var J=F(Q),ja=G(Q);if(17===b)return a.ya?
a.ya(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J):a.ya?a.ya(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J);var Q=F(ja),ib=G(ja);if(18===b)return a.za?a.za(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q):a.za?a.za(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q);ja=F(ib);ib=G(ib);if(19===b)return a.Aa?a.Aa(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja):a.Aa?a.Aa(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja);var y=
F(ib);G(ib);if(20===b)return a.Ba?a.Ba(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja,y):a.Ba?a.Ba(c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja,y):a.call(null,c,d,e,g,h,k,l,m,n,p,r,t,u,w,B,D,J,Q,ja,y);throw Error("Only up to 20 arguments supported on functions");}
function zc(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return gd(arguments[0],arguments[1]);case 3:return hd(arguments[0],arguments[1],arguments[2]);case 4:c=arguments[0];b=V(arguments[1],V(arguments[2],arguments[3]));d=c.P;if(c.O)var e=dd(d+1,b),c=e<=d?fd(c,e,b):c.O(b);else c=c.apply(c,cd(b));return c;case 5:return id(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return c=arguments[0],b=V(arguments[1],V(arguments[2],
V(arguments[3],V(arguments[4],ed(new M(b.slice(5),0,null)))))),d=c.P,c.O?(e=dd(d+1,b),c=e<=d?fd(c,e,b):c.O(b)):c=c.apply(c,cd(b)),c}}function gd(a,b){var c=a.P;if(a.O){var d=dd(c+1,b);return d<=c?fd(a,d,b):a.O(b)}return a.apply(a,cd(b))}function hd(a,b,c){b=V(b,c);c=a.P;if(a.O){var d=dd(c+1,b);return d<=c?fd(a,d,b):a.O(b)}return a.apply(a,cd(b))}function id(a,b,c,d,e){b=V(b,V(c,V(d,e)));c=a.P;return a.O?(d=dd(c+1,b),d<=c?fd(a,d,b):a.O(b)):a.apply(a,cd(b))}
function jd(){"undefined"===typeof Ba&&(Ba=function(a){this.Vb=a;this.i=393216;this.w=0},Ba.prototype.M=function(a,b){return new Ba(b)},Ba.prototype.I=function(){return this.Vb},Ba.prototype.ga=function(){return!1},Ba.prototype.next=function(){return Error("No such element")},Ba.prototype.remove=function(){return Error("Unsupported operation")},Ba.gc=function(){return new kd(null,1,5,ld,[md],null)},Ba.vb=!0,Ba.ib="cljs.core/t_cljs$core11893",Ba.Rb=function(a){return H(a,"cljs.core/t_cljs$core11893")});
return new Ba(nd)}function od(a,b){for(;;){if(null==L(b))return!0;var c;c=N(b);c=a.a?a.a(c):a.call(null,c);if(x(c)){c=a;var d=O(b);a=c;b=d}else return!1}}function pd(a,b,c,d){this.state=a;this.l=b;this.Zb=c;this.zb=d;this.w=16386;this.i=6455296}f=pd.prototype;f.equiv=function(a){return this.o(null,a)};f.o=function(a,b){return this===b};f.Bb=function(){return this.state};f.I=function(){return this.l};
f.tb=function(a,b,c){a=L(this.zb);for(var d=null,e=0,g=0;;)if(g<e){var h=d.G(null,g),k=W(h,0,null),h=W(h,1,null);h.u?h.u(k,this,b,c):h.call(null,k,this,b,c);g+=1}else if(a=L(a))Ec(a)?(d=Fb(a),a=Gb(a),k=d,e=T(d),d=k):(d=N(a),k=W(d,0,null),h=W(d,1,null),h.u?h.u(k,this,b,c):h.call(null,k,this,b,c),a=O(a),d=null,e=0),g=0;else return null};f.H=function(){return this[ca]||(this[ca]=++ea)};
function qd(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return rd(arguments[0]);default:return c=arguments[0],b=new M(b.slice(1),0,null),d=null!=b&&(b.i&64||v===b.Wa)?gd(sd,b):b,b=K.b(d,Ma),d=K.b(d,td),new pd(c,b,d,null)}}function rd(a){return new pd(a,null,null,null)}
function ud(a,b){if(a instanceof pd){var c=a.Zb;if(null!=c&&!x(c.a?c.a(b):c.call(null,b)))throw Error("Validator rejected reference state");c=a.state;a.state=b;null!=a.zb&&zb(a,c,b);return b}return Hb(a,b)}
var wd=function wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return wd.b(arguments[0],arguments[1]);case 3:return wd.g(arguments[0],arguments[1],arguments[2]);case 4:return wd.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:return wd.C(arguments[0],arguments[1],arguments[2],arguments[3],new M(c.slice(4),0,null))}};wd.b=function(a,b){var c;a instanceof pd?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=ud(a,c)):c=I.b(a,b);return c};
wd.g=function(a,b,c){if(a instanceof pd){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=ud(a,b)}else a=I.g(a,b,c);return a};wd.u=function(a,b,c,d){if(a instanceof pd){var e=a.state;b=b.g?b.g(e,c,d):b.call(null,e,c,d);a=ud(a,b)}else a=I.u(a,b,c,d);return a};wd.C=function(a,b,c,d,e){return a instanceof pd?ud(a,id(b,a.state,c,d,e)):I.D(a,b,c,d,e)};wd.O=function(a){var b=N(a),c=O(a);a=N(c);var d=O(c),c=N(d),e=O(d),d=N(e),e=O(e);return wd.C(b,a,c,d,e)};wd.P=4;
var Y=function Y(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Y.a(arguments[0]);case 2:return Y.b(arguments[0],arguments[1]);case 3:return Y.g(arguments[0],arguments[1],arguments[2]);case 4:return Y.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Y.C(arguments[0],arguments[1],arguments[2],arguments[3],new M(c.slice(4),0,null))}};
Y.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.F?b.F():b.call(null)}var g=null,h=function(){function c(a,b,c){var e=null;if(2<arguments.length){for(var e=0,g=Array(arguments.length-2);e<g.length;)g[e]=arguments[e+2],++e;e=new M(g,0)}return d.call(this,a,b,e)}function d(c,d,e){d=hd(a,d,e);return b.b?b.b(c,d):b.call(null,c,d)}c.P=2;c.O=function(a){var b=
N(a);a=O(a);var c=N(a);a=Xb(a);return d(b,c,a)};c.C=d;return c}(),g=function(a,b,g){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var k=null;if(2<arguments.length){for(var k=0,l=Array(arguments.length-2);k<l.length;)l[k]=arguments[k+2],++k;k=new M(l,0)}return h.C(a,b,k)}throw Error("Invalid arity: "+(arguments.length-1));};g.P=2;g.O=h.O;g.F=e;g.a=d;g.b=c;g.C=h.C;return g}()}};
Y.b=function(a,b){return new Wc(null,function(){var c=L(b);if(c){if(Ec(c)){for(var d=Fb(c),e=T(d),g=new Yc(Array(e),0),h=0;;)if(h<e)bd(g,function(){var b=E.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return ad(g.pa(),Y.b(a,Gb(c)))}return V(function(){var b=N(c);return a.a?a.a(b):a.call(null,b)}(),Y.b(a,Xb(c)))}return null},null,null)};
Y.g=function(a,b,c){return new Wc(null,function(){var d=L(b),e=L(c);if(d&&e){var g=V,h;h=N(d);var k=N(e);h=a.b?a.b(h,k):a.call(null,h,k);d=g(h,Y.g(a,Xb(d),Xb(e)))}else d=null;return d},null,null)};Y.u=function(a,b,c,d){return new Wc(null,function(){var e=L(b),g=L(c),h=L(d);if(e&&g&&h){var k=V,l;l=N(e);var m=N(g),n=N(h);l=a.g?a.g(l,m,n):a.call(null,l,m,n);e=k(l,Y.u(a,Xb(e),Xb(g),Xb(h)))}else e=null;return e},null,null)};
Y.C=function(a,b,c,d,e){var g=function k(a){return new Wc(null,function(){var b=Y.b(L,a);return od(Nc,b)?V(Y.b(N,b),k(Y.b(Xb,b))):null},null,null)};return Y.b(function(){return function(b){return gd(a,b)}}(g),g(tc.C(e,d,sc([c,b],0))))};Y.O=function(a){var b=N(a),c=O(a);a=N(c);var d=O(c),c=N(d),e=O(d),d=N(e),e=O(e);return Y.C(b,a,c,d,e)};Y.P=4;function xd(a,b){this.A=a;this.c=b}
function yd(a){return new xd(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function zd(a,b,c){a.c[b]=c}function Ad(a){a=a.h;return 32>a?0:a-1>>>5<<5}function Bd(a,b,c){for(;;){if(0===b)return c;var d=yd(a);d.c[0]=c;c=d;b-=5}}
var Cd=function Cd(b,c,d,e){var g=new xd(d.A,Ta(d.c)),h=b.h-1>>>c&31;5===c?g.c[h]=e:(d=d.c[h],null!=d?(c-=5,b=Cd.u?Cd.u(b,c,d,e):Cd.call(null,b,c,d,e)):b=Bd(null,c-5,e),g.c[h]=b);return g};function Dd(a,b){throw Error([C.a("No item "),C.a(a),C.a(" in vector of length "),C.a(b)].join(""));}function Ed(a,b){if(b>=Ad(a))return a.X;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.c[b>>>d&31],d=e;else return c.c}function Fd(a,b){return 0<=b&&b<a.h?Ed(a,b):Dd(b,a.h)}
var Gd=function Gd(b,c,d,e,g){var h=new xd(d.A,Ta(d.c));if(0===c)h.c[e&31]=g;else{var k=e>>>c&31;c-=5;d=d.c[k];b=Gd.D?Gd.D(b,c,d,e,g):Gd.call(null,b,c,d,e,g);zd(h,k,b)}return h};function Hd(a,b,c,d,e,g){this.j=a;this.jb=b;this.c=c;this.la=d;this.start=e;this.end=g}Hd.prototype.ga=function(){return this.j<this.end};Hd.prototype.next=function(){32===this.j-this.jb&&(this.c=Ed(this.la,this.j),this.jb+=32);var a=this.c[this.j&31];this.j+=1;return a};
function Id(a,b,c){return new Hd(b,b-b%32,b<T(a)?Ed(a,b):null,a,b,c)}function kd(a,b,c,d,e,g){this.l=a;this.h=b;this.shift=c;this.root=d;this.X=e;this.m=g;this.i=167668511;this.w=8196}f=kd.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.S=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return"number"===typeof b?this.Y(null,b,c):c};f.G=function(a,b){return Fd(this,b)[b&31]};f.Y=function(a,b,c){return 0<=b&&b<this.h?Ed(this,b)[b&31]:c};
f.Ya=function(a,b,c){if(0<=b&&b<this.h)return Ad(this)<=b?(a=Ta(this.X),a[b&31]=c,new kd(this.l,this.h,this.shift,this.root,a,null)):new kd(this.l,this.h,this.shift,Gd(this,this.shift,this.root,b,c),this.X,null);if(b===this.h)return this.R(null,c);throw Error([C.a("Index "),C.a(b),C.a(" out of bounds  [0,"),C.a(this.h),C.a("]")].join(""));};f.ma=function(){return Id(this,0,this.h)};f.I=function(){return this.l};f.T=function(){return this.h};f.mb=function(){return this.G(null,0)};
f.nb=function(){return this.G(null,1)};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){if(b instanceof kd)if(this.h===T(b))for(var c=this.ma(null),d=Jb(b);;)if(c.ga()){var e=c.next(),g=d.next();if(!P.b(e,g))return!1}else return!0;else return!1;else return qc(this,b)};f.eb=function(){return new Jd(this.h,this.shift,Kd.a?Kd.a(this.root):Kd.call(null,this.root),Ld.a?Ld.a(this.X):Ld.call(null,this.X))};f.V=function(a,b){return fc(this,b)};
f.W=function(a,b,c){a=0;for(var d=c;;)if(a<this.h){var e=Ed(this,a);c=e.length;a:for(var g=0;;)if(g<c)var h=e[g],d=b.b?b.b(d,h):b.call(null,d,h),g=g+1;else{e=d;break a}a+=c;d=e}else return d};f.qa=function(a,b,c){if("number"===typeof b)return this.Ya(null,b,c);throw Error("Vector's key for assoc must be a number.");};
f.J=function(){if(0===this.h)return null;if(32>=this.h)return new M(this.X,0,null);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.c[0];else{a=a.c;break a}}return Md?Md(this,a,0,0):Nd.call(null,this,a,0,0)};f.M=function(a,b){return new kd(b,this.h,this.shift,this.root,this.X,this.m)};
f.R=function(a,b){if(32>this.h-Ad(this)){for(var c=this.X.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.X[e],e+=1;else break;d[c]=b;return new kd(this.l,this.h+1,this.shift,this.root,d,null)}c=(d=this.h>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=yd(null),zd(d,0,this.root),zd(d,1,Bd(null,this.shift,new xd(null,this.X)))):d=Cd(this,this.shift,this.root,new xd(null,this.X));return new kd(this.l,this.h+1,c,d,[b],null)};
f.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.G(null,c);case 3:return this.Y(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.G(null,c)};a.g=function(a,c,d){return this.Y(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return this.G(null,a)};f.b=function(a,b){return this.Y(null,a,b)};
var ld=new xd(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),uc=new kd(null,0,5,ld,[],cc);kd.prototype[Sa]=function(){return $b(this)};function Od(a,b,c,d,e,g){this.ea=a;this.node=b;this.j=c;this.off=d;this.l=e;this.m=g;this.i=32375020;this.w=1536}f=Od.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.ba=function(){if(this.off+1<this.node.length){var a;a=this.ea;var b=this.node,c=this.j,d=this.off+1;a=Md?Md(a,b,c,d):Nd.call(null,a,b,c,d);return null==a?null:a}return this.rb(null)};
f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};f.V=function(a,b){var c;c=this.ea;var d=this.j+this.off,e=T(this.ea);c=Pd?Pd(c,d,e):Qd.call(null,c,d,e);return fc(c,b)};f.W=function(a,b,c){a=this.ea;var d=this.j+this.off,e=T(this.ea);a=Pd?Pd(a,d,e):Qd.call(null,a,d,e);return gc(a,b,c)};f.Z=function(){return this.node[this.off]};
f.ca=function(){if(this.off+1<this.node.length){var a;a=this.ea;var b=this.node,c=this.j,d=this.off+1;a=Md?Md(a,b,c,d):Nd.call(null,a,b,c,d);return null==a?Yb:a}return this.cb(null)};f.J=function(){return this};f.lb=function(){var a=this.node;return new Zc(a,this.off,a.length)};f.cb=function(){var a=this.j+this.node.length;if(a<Wa(this.ea)){var b=this.ea,c=Ed(this.ea,a);return Md?Md(b,c,a,0):Nd.call(null,b,c,a,0)}return Yb};
f.M=function(a,b){return Rd?Rd(this.ea,this.node,this.j,this.off,b):Nd.call(null,this.ea,this.node,this.j,this.off,b)};f.R=function(a,b){return V(b,this)};f.rb=function(){var a=this.j+this.node.length;if(a<Wa(this.ea)){var b=this.ea,c=Ed(this.ea,a);return Md?Md(b,c,a,0):Nd.call(null,b,c,a,0)}return null};Od.prototype[Sa]=function(){return $b(this)};
function Nd(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 3:return b=arguments[0],c=arguments[1],d=arguments[2],new Od(b,Fd(b,c),c,d,null,null);case 4:return Md(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Rd(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}function Md(a,b,c,d){return new Od(a,b,c,d,null,null)}
function Rd(a,b,c,d,e){return new Od(a,b,c,d,e,null)}function Sd(a,b,c,d,e){this.l=a;this.la=b;this.start=c;this.end=d;this.m=e;this.i=167666463;this.w=8192}f=Sd.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.S=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return"number"===typeof b?this.Y(null,b,c):c};f.G=function(a,b){return 0>b||this.end<=this.start+b?Dd(b,this.end-this.start):E.b(this.la,this.start+b)};
f.Y=function(a,b,c){return 0>b||this.end<=this.start+b?c:E.g(this.la,this.start+b,c)};f.Ya=function(a,b,c){a=this.start+b;if(0>b||this.end+1<=a)throw Error([C.a("Index "),C.a(b),C.a(" out of bounds [0,"),C.a(this.T(null)),C.a("]")].join(""));b=this.l;c=wc.g(this.la,a,c);var d=this.start,e=this.end;a+=1;a=e>a?e:a;return Td.D?Td.D(b,c,d,a,null):Td.call(null,b,c,d,a,null)};f.ma=function(){return Id(this.la,this.start,this.end)};f.I=function(){return this.l};f.T=function(){return this.end-this.start};
f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return fc(this,b)};f.W=function(a,b,c){return gc(this,b,c)};f.qa=function(a,b,c){if("number"===typeof b)return this.Ya(null,b,c);throw Error("Subvec's key for assoc must be a number.");};f.J=function(){var a=this;return function(b){return function d(e){return e===a.end?null:V(E.b(a.la,e),new Wc(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
f.M=function(a,b){return Td.D?Td.D(b,this.la,this.start,this.end,this.m):Td.call(null,b,this.la,this.start,this.end,this.m)};f.R=function(a,b){var c=this.l,d=lb(this.la,this.end,b),e=this.start,g=this.end+1;return Td.D?Td.D(c,d,e,g,null):Td.call(null,c,d,e,g,null)};
f.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.G(null,c);case 3:return this.Y(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.G(null,c)};a.g=function(a,c,d){return this.Y(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return this.G(null,a)};f.b=function(a,b){return this.Y(null,a,b)};Sd.prototype[Sa]=function(){return $b(this)};
function Td(a,b,c,d,e){for(;;)if(b instanceof Sd)c=b.start+c,d=b.start+d,b=b.la;else{var g=T(b);if(0>c||0>d||c>g||d>g)throw Error("Index out of bounds");return new Sd(a,b,c,d,e)}}function Qd(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 2:return b=arguments[0],Pd(b,arguments[1],T(b));case 3:return Pd(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}
function Pd(a,b,c){return Td(null,a,b,c,null)}function Ud(a,b){return a===b.A?b:new xd(a,Ta(b.c))}function Kd(a){return new xd({},Ta(a.c))}function Ld(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Gc(a,0,b,0,a.length);return b}
var Vd=function Vd(b,c,d,e){d=Ud(b.root.A,d);var g=b.h-1>>>c&31;if(5===c)b=e;else{var h=d.c[g];null!=h?(c-=5,b=Vd.u?Vd.u(b,c,h,e):Vd.call(null,b,c,h,e)):b=Bd(b.root.A,c-5,e)}zd(d,g,b);return d};function Jd(a,b,c,d){this.h=a;this.shift=b;this.root=c;this.X=d;this.w=88;this.i=275}f=Jd.prototype;
f.Xa=function(a,b){if(this.root.A){if(32>this.h-Ad(this))this.X[this.h&31]=b;else{var c=new xd(this.root.A,this.X),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.X=d;if(this.h>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Bd(this.root.A,this.shift,c);this.root=new xd(this.root.A,d);this.shift=e}else this.root=Vd(this,this.shift,this.root,c)}this.h+=1;return this}throw Error("conj! after persistent!");};f.hb=function(){if(this.root.A){this.root.A=null;var a=this.h-Ad(this),b=Array(a);Gc(this.X,0,b,0,a);return new kd(null,this.h,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
f.Na=function(a,b,c){if("number"===typeof b)return Wd(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
function Wd(a,b,c){if(a.root.A){if(0<=b&&b<a.h){if(Ad(a)<=b)a.X[b&31]=c;else{var d=function(){return function g(d,k){var h=Ud(a.root.A,k);if(0===d)h.c[b&31]=c;else{var m=b>>>d&31;zd(h,m,g(d-5,h.c[m]))}return h}}(a).call(null,a.shift,a.root);a.root=d}return a}if(b===a.h)return a.Xa(null,c);throw Error([C.a("Index "),C.a(b),C.a(" out of bounds for TransientVector of length"),C.a(a.h)].join(""));}throw Error("assoc! after persistent!");}
f.T=function(){if(this.root.A)return this.h;throw Error("count after persistent!");};f.G=function(a,b){if(this.root.A)return Fd(this,b)[b&31];throw Error("nth after persistent!");};f.Y=function(a,b,c){return 0<=b&&b<this.h?this.G(null,b):c};f.S=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return"number"===typeof b?this.Y(null,b,c):c};
f.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.S(null,c);case 3:return this.B(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.S(null,c)};a.g=function(a,c,d){return this.B(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return this.S(null,a)};f.b=function(a,b){return this.B(null,a,b)};function Xd(){this.i=2097152;this.w=0}
Xd.prototype.equiv=function(a){return this.o(null,a)};Xd.prototype.o=function(){return!1};var Yd=new Xd;function Zd(a,b){return Ic(Cc(b)?T(a)===T(b)?od(function(a){return P.b(K.g(b,N(a),Yd),N(O(a)))},a):null:null)}function $d(a){this.v=a}$d.prototype.next=function(){if(null!=this.v){var a=N(this.v),b=W(a,0,null),a=W(a,1,null);this.v=O(this.v);return{value:[b,a],done:!1}}return{value:null,done:!0}};
function xc(a,b){var c;if(b instanceof X)a:{c=a.length;for(var d=b.Ja,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof X&&d===a[e].Ja){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof Wb)a:for(c=a.length,d=b.La,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof Wb&&d===a[e].La){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(P.b(b,a[d])){c=d;break a}d+=2}return c}function ae(a,b,c){this.c=a;this.j=b;this.fa=c;this.i=32374990;this.w=0}f=ae.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.fa};f.ba=function(){return this.j<this.c.length-2?new ae(this.c,this.j+2,this.fa):null};f.T=function(){return(this.c.length-this.j)/2};f.H=function(){return bc(this)};
f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return new kd(null,2,5,ld,[this.c[this.j],this.c[this.j+1]],null)};f.ca=function(){return this.j<this.c.length-2?new ae(this.c,this.j+2,this.fa):Yb};f.J=function(){return this};f.M=function(a,b){return new ae(this.c,this.j,b)};f.R=function(a,b){return V(b,this)};ae.prototype[Sa]=function(){return $b(this)};function be(a,b,c){this.c=a;this.j=b;this.h=c}
be.prototype.ga=function(){return this.j<this.h};be.prototype.next=function(){var a=new kd(null,2,5,ld,[this.c[this.j],this.c[this.j+1]],null);this.j+=2;return a};function Ja(a,b,c,d){this.l=a;this.h=b;this.c=c;this.m=d;this.i=16647951;this.w=8196}f=Ja.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};f.keys=function(){return $b(ce.a?ce.a(this):ce.call(null,this))};f.entries=function(){return new $d(L(L(this)))};
f.values=function(){return $b(de.a?de.a(this):de.call(null,this))};f.has=function(a){return K.g(this,a,Hc)===Hc?!1:!0};f.get=function(a,b){return this.B(null,a,b)};f.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var g=c.G(null,e),h=W(g,0,null),g=W(g,1,null);a.b?a.b(g,h):a.call(null,g,h);e+=1}else if(b=L(b))Ec(b)?(c=Fb(b),b=Gb(b),h=c,d=T(c),c=h):(c=N(b),h=W(c,0,null),g=W(c,1,null),a.b?a.b(g,h):a.call(null,g,h),b=O(b),c=null,d=0),e=0;else return null};
f.S=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){a=xc(this.c,b);return-1===a?c:this.c[a+1]};f.ma=function(){return new be(this.c,0,2*this.h)};f.I=function(){return this.l};f.T=function(){return this.h};f.H=function(){var a=this.m;return null!=a?a:this.m=a=dc(this)};
f.o=function(a,b){if(null!=b&&(b.i&1024||v===b.Gb)){var c=this.c.length;if(this.h===b.T(null))for(var d=0;;)if(d<c){var e=b.B(null,this.c[d],Hc);if(e!==Hc)if(P.b(this.c[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Zd(this,b)};f.eb=function(){return new ee({},this.c.length,Ta(this.c))};f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};
f.qa=function(a,b,c){a=xc(this.c,b);if(-1===a){if(this.h<fe){a=this.c;for(var d=a.length,e=Array(d+2),g=0;;)if(g<d)e[g]=a[g],g+=1;else break;e[d]=b;e[d+1]=c;return new Ja(this.l,this.h+1,e,null)}d=ge;null!=d?null!=d&&(d.w&4||v===d.bc)?(a=Cb(Kc(Bb,Ab(d),this)),d=Ac(d),a="function"==q(a)?new yc(a,d):null==a?null:pb(a,d)):a=Kc(Ya,d,this):a=Kc(tc,Yb,this);return pb(db(a,b,c),this.l)}if(c===this.c[a+1])return this;b=Ta(this.c);b[a+1]=c;return new Ja(this.l,this.h,b,null)};
f.J=function(){var a=this.c;return 0<=a.length-2?new ae(a,0,null):null};f.M=function(a,b){return new Ja(b,this.h,this.c,this.m)};f.R=function(a,b){if(Dc(b))return this.qa(null,E.b(b,0),E.b(b,1));for(var c=this,d=L(b);;){if(null==d)return c;var e=N(d);if(Dc(e))c=c.qa(null,E.b(e,0),E.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.S(null,c);case 3:return this.B(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.S(null,c)};a.g=function(a,c,d){return this.B(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return this.S(null,a)};f.b=function(a,b){return this.B(null,a,b)};var nd=new Ja(null,0,[],ec),fe=8;Ja.prototype[Sa]=function(){return $b(this)};
function ee(a,b,c){this.Ta=a;this.Qa=b;this.c=c;this.i=258;this.w=56}f=ee.prototype;f.T=function(){if(x(this.Ta))return Oc(this.Qa);throw Error("count after persistent!");};f.S=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){if(x(this.Ta))return a=xc(this.c,b),-1===a?c:this.c[a+1];throw Error("lookup after persistent!");};
f.Xa=function(a,b){if(x(this.Ta)){if(null!=b?b.i&2048||v===b.Hb||(b.i?0:z(fb,b)):z(fb,b))return this.Na(null,he.a?he.a(b):he.call(null,b),ie.a?ie.a(b):ie.call(null,b));for(var c=L(b),d=this;;){var e=N(c);if(x(e))c=O(c),d=d.Na(null,he.a?he.a(e):he.call(null,e),ie.a?ie.a(e):ie.call(null,e));else return d}}else throw Error("conj! after persistent!");};f.hb=function(){if(x(this.Ta))return this.Ta=!1,new Ja(null,Oc(this.Qa),this.c,null);throw Error("persistent! called twice");};
f.Na=function(a,b,c){if(x(this.Ta)){a=xc(this.c,b);if(-1===a){if(this.Qa+2<=2*fe)return this.Qa+=2,this.c.push(b),this.c.push(c),this;a=je.b?je.b(this.Qa,this.c):je.call(null,this.Qa,this.c);return Db(a,b,c)}c!==this.c[a+1]&&(this.c[a+1]=c);return this}throw Error("assoc! after persistent!");};function je(a,b){for(var c=Ab(ge),d=0;;)if(d<a)c=Db(c,b[d],b[d+1]),d+=2;else return c}function ke(){this.oa=!1}
function le(a,b){return a===b?!0:a===b||a instanceof X&&b instanceof X&&a.Ja===b.Ja?!0:P.b(a,b)}function me(a,b,c){a=Ta(a);a[b]=c;return a}function ne(a,b,c,d){a=a.Oa(b);a.c[c]=d;return a}function oe(a,b,c,d){this.c=a;this.j=b;this.$a=c;this.ka=d}oe.prototype.advance=function(){for(var a=this.c.length;;)if(this.j<a){var b=this.c[this.j],c=this.c[this.j+1];null!=b?b=this.$a=new kd(null,2,5,ld,[b,c],null):null!=c?(b=Jb(c),b=b.ga()?this.ka=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
oe.prototype.ga=function(){var a=null!=this.$a;return a?a:(a=null!=this.ka)?a:this.advance()};oe.prototype.next=function(){if(null!=this.$a){var a=this.$a;this.$a=null;return a}if(null!=this.ka)return a=this.ka.next(),this.ka.ga()||(this.ka=null),a;if(this.advance())return this.next();throw Error("No such element");};oe.prototype.remove=function(){return Error("Unsupported operation")};function pe(a,b,c){this.A=a;this.K=b;this.c=c}f=pe.prototype;
f.Oa=function(a){if(a===this.A)return this;var b=Pc(this.K),c=Array(0>b?4:2*(b+1));Gc(this.c,0,c,0,2*b);return new pe(a,this.K,c)};f.Za=function(){return qe?qe(this.c):re.call(null,this.c)};f.Pa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.K&e))return d;var g=Pc(this.K&e-1),e=this.c[2*g],g=this.c[2*g+1];return null==e?g.Pa(a+5,b,c,d):le(c,e)?g:d};
f.ja=function(a,b,c,d,e,g){var h=1<<(c>>>b&31),k=Pc(this.K&h-1);if(0===(this.K&h)){var l=Pc(this.K);if(2*l<this.c.length){a=this.Oa(a);b=a.c;g.oa=!0;a:for(c=2*(l-k),g=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[g];--l;--c;--g}b[2*k]=d;b[2*k+1]=e;a.K|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=se.ja(a,b+5,c,d,e,g);for(e=d=0;;)if(32>d)0!==
(this.K>>>d&1)&&(k[d]=null!=this.c[e]?se.ja(a,b+5,Ub(this.c[e]),this.c[e],this.c[e+1],g):this.c[e+1],e+=2),d+=1;else break;return new te(a,l+1,k)}b=Array(2*(l+4));Gc(this.c,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;Gc(this.c,2*k,b,2*(k+1),2*(l-k));g.oa=!0;a=this.Oa(a);a.c=b;a.K|=h;return a}l=this.c[2*k];h=this.c[2*k+1];if(null==l)return l=h.ja(a,b+5,c,d,e,g),l===h?this:ne(this,a,2*k+1,l);if(le(d,l))return e===h?this:ne(this,a,2*k+1,e);g.oa=!0;g=b+5;d=ue?ue(a,g,l,h,c,d,e):ve.call(null,a,g,l,h,c,d,e);e=2*k;k=
2*k+1;a=this.Oa(a);a.c[e]=null;a.c[k]=d;return a};
f.ia=function(a,b,c,d,e){var g=1<<(b>>>a&31),h=Pc(this.K&g-1);if(0===(this.K&g)){var k=Pc(this.K);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=se.ia(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.K>>>c&1)&&(h[c]=null!=this.c[d]?se.ia(a+5,Ub(this.c[d]),this.c[d],this.c[d+1],e):this.c[d+1],d+=2),c+=1;else break;return new te(null,k+1,h)}a=Array(2*(k+1));Gc(this.c,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;Gc(this.c,2*h,a,2*(h+1),2*(k-h));e.oa=!0;return new pe(null,this.K|g,a)}var l=this.c[2*h],g=this.c[2*h+1];if(null==l)return k=g.ia(a+5,b,c,d,e),k===g?this:new pe(null,this.K,me(this.c,2*h+1,k));if(le(c,l))return d===g?this:new pe(null,this.K,me(this.c,2*h+1,d));e.oa=!0;e=this.K;k=this.c;a+=5;a=xe?xe(a,l,g,b,c,d):ve.call(null,a,l,g,b,c,d);c=2*h;h=2*h+1;d=Ta(k);d[c]=null;d[h]=a;return new pe(null,e,d)};f.ma=function(){return new oe(this.c,0,null,null)};
var se=new pe(null,0,[]);function ye(a,b,c){this.c=a;this.j=b;this.ka=c}ye.prototype.ga=function(){for(var a=this.c.length;;){if(null!=this.ka&&this.ka.ga())return!0;if(this.j<a){var b=this.c[this.j];this.j+=1;null!=b&&(this.ka=Jb(b))}else return!1}};ye.prototype.next=function(){if(this.ga())return this.ka.next();throw Error("No such element");};ye.prototype.remove=function(){return Error("Unsupported operation")};function te(a,b,c){this.A=a;this.h=b;this.c=c}f=te.prototype;
f.Oa=function(a){return a===this.A?this:new te(a,this.h,Ta(this.c))};f.Za=function(){return ze?ze(this.c):Ae.call(null,this.c)};f.Pa=function(a,b,c,d){var e=this.c[b>>>a&31];return null!=e?e.Pa(a+5,b,c,d):d};f.ja=function(a,b,c,d,e,g){var h=c>>>b&31,k=this.c[h];if(null==k)return a=ne(this,a,h,se.ja(a,b+5,c,d,e,g)),a.h+=1,a;b=k.ja(a,b+5,c,d,e,g);return b===k?this:ne(this,a,h,b)};
f.ia=function(a,b,c,d,e){var g=b>>>a&31,h=this.c[g];if(null==h)return new te(null,this.h+1,me(this.c,g,se.ia(a+5,b,c,d,e)));a=h.ia(a+5,b,c,d,e);return a===h?this:new te(null,this.h,me(this.c,g,a))};f.ma=function(){return new ye(this.c,0,null)};function Be(a,b,c){b*=2;for(var d=0;;)if(d<b){if(le(c,a[d]))return d;d+=2}else return-1}function Ce(a,b,c,d){this.A=a;this.Ia=b;this.h=c;this.c=d}f=Ce.prototype;
f.Oa=function(a){if(a===this.A)return this;var b=Array(2*(this.h+1));Gc(this.c,0,b,0,2*this.h);return new Ce(a,this.Ia,this.h,b)};f.Za=function(){return qe?qe(this.c):re.call(null,this.c)};f.Pa=function(a,b,c,d){a=Be(this.c,this.h,c);return 0>a?d:le(c,this.c[a])?this.c[a+1]:d};
f.ja=function(a,b,c,d,e,g){if(c===this.Ia){b=Be(this.c,this.h,d);if(-1===b){if(this.c.length>2*this.h)return b=2*this.h,c=2*this.h+1,a=this.Oa(a),a.c[b]=d,a.c[c]=e,g.oa=!0,a.h+=1,a;c=this.c.length;b=Array(c+2);Gc(this.c,0,b,0,c);b[c]=d;b[c+1]=e;g.oa=!0;d=this.h+1;a===this.A?(this.c=b,this.h=d,a=this):a=new Ce(this.A,this.Ia,d,b);return a}return this.c[b+1]===e?this:ne(this,a,b+1,e)}return(new pe(a,1<<(this.Ia>>>b&31),[null,this,null,null])).ja(a,b,c,d,e,g)};
f.ia=function(a,b,c,d,e){return b===this.Ia?(a=Be(this.c,this.h,c),-1===a?(a=2*this.h,b=Array(a+2),Gc(this.c,0,b,0,a),b[a]=c,b[a+1]=d,e.oa=!0,new Ce(null,this.Ia,this.h+1,b)):P.b(this.c[a+1],d)?this:new Ce(null,this.Ia,this.h,me(this.c,a+1,d))):(new pe(null,1<<(this.Ia>>>a&31),[null,this])).ia(a,b,c,d,e)};f.ma=function(){return new oe(this.c,0,null,null)};
function ve(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 6:return xe(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return ue(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}
function xe(a,b,c,d,e,g){var h=Ub(b);if(h===d)return new Ce(null,h,2,[b,c,e,g]);var k=new ke;return se.ia(a,h,b,c,k).ia(a,d,e,g,k)}function ue(a,b,c,d,e,g,h){var k=Ub(c);if(k===e)return new Ce(null,k,2,[c,d,g,h]);var l=new ke;return se.ja(a,b,k,c,d,l).ja(a,b,e,g,h,l)}function De(a,b,c,d,e){this.l=a;this.Ka=b;this.j=c;this.v=d;this.m=e;this.i=32374860;this.w=0}f=De.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};
f.Z=function(){return null==this.v?new kd(null,2,5,ld,[this.Ka[this.j],this.Ka[this.j+1]],null):N(this.v)};f.ca=function(){var a=this,b=null==a.v?function(){var b=a.Ka,d=a.j+2;return Ee?Ee(b,d,null):re.call(null,b,d,null)}():function(){var b=a.Ka,d=a.j,e=O(a.v);return Ee?Ee(b,d,e):re.call(null,b,d,e)}();return null!=b?b:Yb};f.J=function(){return this};f.M=function(a,b){return new De(b,this.Ka,this.j,this.v,this.m)};f.R=function(a,b){return V(b,this)};De.prototype[Sa]=function(){return $b(this)};
function re(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return qe(arguments[0]);case 3:return Ee(arguments[0],arguments[1],arguments[2]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}function qe(a){return Ee(a,0,null)}
function Ee(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new De(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Za(),x(d)))return new De(null,a,b+2,d,null);b+=2}else return null;else return new De(null,a,b,c,null)}function Fe(a,b,c,d,e){this.l=a;this.Ka=b;this.j=c;this.v=d;this.m=e;this.i=32374860;this.w=0}f=Fe.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};
f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.l};f.H=function(){var a=this.m;return null!=a?a:this.m=a=bc(this)};f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return N(this.v)};
f.ca=function(){var a;a=this.Ka;var b=this.j,c=O(this.v);a=Ge?Ge(null,a,b,c):Ae.call(null,null,a,b,c);return null!=a?a:Yb};f.J=function(){return this};f.M=function(a,b){return new Fe(b,this.Ka,this.j,this.v,this.m)};f.R=function(a,b){return V(b,this)};Fe.prototype[Sa]=function(){return $b(this)};
function Ae(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;switch(b.length){case 1:return ze(arguments[0]);case 4:return Ge(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([C.a("Invalid arity: "),C.a(b.length)].join(""));}}function ze(a){return Ge(null,a,0,null)}
function Ge(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Za(),x(e)))return new Fe(a,b,c+1,e,null);c+=1}else return null;else return new Fe(a,b,c,d,null)}function He(a,b,c){this.aa=a;this.yb=b;this.ob=c}He.prototype.ga=function(){return!this.ob||this.yb.ga()};He.prototype.next=function(){if(this.ob)return this.yb.next();this.ob=!0;return new kd(null,2,5,ld,[null,this.aa],null)};He.prototype.remove=function(){return Error("Unsupported operation")};
function Ie(a,b,c,d,e,g){this.l=a;this.h=b;this.root=c;this.da=d;this.aa=e;this.m=g;this.i=16123663;this.w=8196}f=Ie.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};f.keys=function(){return $b(ce.a?ce.a(this):ce.call(null,this))};f.entries=function(){return new $d(L(L(this)))};f.values=function(){return $b(de.a?de.a(this):de.call(null,this))};f.has=function(a){return K.g(this,a,Hc)===Hc?!1:!0};f.get=function(a,b){return this.B(null,a,b)};
f.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var g=c.G(null,e),h=W(g,0,null),g=W(g,1,null);a.b?a.b(g,h):a.call(null,g,h);e+=1}else if(b=L(b))Ec(b)?(c=Fb(b),b=Gb(b),h=c,d=T(c),c=h):(c=N(b),h=W(c,0,null),g=W(c,1,null),a.b?a.b(g,h):a.call(null,g,h),b=O(b),c=null,d=0),e=0;else return null};f.S=function(a,b){return this.B(null,b,null)};f.B=function(a,b,c){return null==b?this.da?this.aa:c:null==this.root?c:this.root.Pa(0,Ub(b),b,c)};
f.ma=function(){var a=this.root?Jb(this.root):jd();return this.da?new He(this.aa,a,!1):a};f.I=function(){return this.l};f.T=function(){return this.h};f.H=function(){var a=this.m;return null!=a?a:this.m=a=dc(this)};f.o=function(a,b){return Zd(this,b)};f.eb=function(){return new Je({},this.root,this.h,this.da,this.aa)};
f.qa=function(a,b,c){if(null==b)return this.da&&c===this.aa?this:new Ie(this.l,this.da?this.h:this.h+1,this.root,!0,c,null);a=new ke;b=(null==this.root?se:this.root).ia(0,Ub(b),b,c,a);return b===this.root?this:new Ie(this.l,a.oa?this.h+1:this.h,b,this.da,this.aa,null)};f.J=function(){if(0<this.h){var a=null!=this.root?this.root.Za():null;return this.da?V(new kd(null,2,5,ld,[null,this.aa],null),a):a}return null};f.M=function(a,b){return new Ie(b,this.h,this.root,this.da,this.aa,this.m)};
f.R=function(a,b){if(Dc(b))return this.qa(null,E.b(b,0),E.b(b,1));for(var c=this,d=L(b);;){if(null==d)return c;var e=N(d);if(Dc(e))c=c.qa(null,E.b(e,0),E.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.S(null,c);case 3:return this.B(null,c,d)}throw Error("Invalid arity: "+(arguments.length-1));};a.b=function(a,c){return this.S(null,c)};a.g=function(a,c,d){return this.B(null,c,d)};return a}();f.apply=function(a,b){return this.call.apply(this,[this].concat(Ta(b)))};f.a=function(a){return this.S(null,a)};f.b=function(a,b){return this.B(null,a,b)};var ge=new Ie(null,0,null,!1,null,ec);Ie.prototype[Sa]=function(){return $b(this)};
function Je(a,b,c,d,e){this.A=a;this.root=b;this.count=c;this.da=d;this.aa=e;this.i=258;this.w=56}function Ke(a,b,c){if(a.A){if(null==b)a.aa!==c&&(a.aa=c),a.da||(a.count+=1,a.da=!0);else{var d=new ke;b=(null==a.root?se:a.root).ja(a.A,0,Ub(b),b,c,d);b!==a.root&&(a.root=b);d.oa&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}f=Je.prototype;f.T=function(){if(this.A)return this.count;throw Error("count after persistent!");};
f.S=function(a,b){return null==b?this.da?this.aa:null:null==this.root?null:this.root.Pa(0,Ub(b),b)};f.B=function(a,b,c){return null==b?this.da?this.aa:c:null==this.root?c:this.root.Pa(0,Ub(b),b,c)};
f.Xa=function(a,b){var c;a:if(this.A)if(null!=b?b.i&2048||v===b.Hb||(b.i?0:z(fb,b)):z(fb,b))c=Ke(this,he.a?he.a(b):he.call(null,b),ie.a?ie.a(b):ie.call(null,b));else{c=L(b);for(var d=this;;){var e=N(c);if(x(e))c=O(c),d=Ke(d,he.a?he.a(e):he.call(null,e),ie.a?ie.a(e):ie.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};
f.hb=function(){var a;if(this.A)this.A=null,a=new Ie(null,this.count,this.root,this.da,this.aa,null);else throw Error("persistent! called twice");return a};f.Na=function(a,b,c){return Ke(this,b,c)};var sd=function sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return sd.C(0<c.length?new M(c.slice(0),0,null):null)};sd.C=function(a){for(var b=L(a),c=Ab(ge);;)if(b){a=O(O(b));var d=N(b),b=N(O(b)),c=Db(c,d,b),b=a}else return Cb(c)};sd.P=0;sd.O=function(a){return sd.C(L(a))};
function Le(a,b){this.s=a;this.fa=b;this.i=32374988;this.w=0}f=Le.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.fa};f.ba=function(){var a=(null!=this.s?this.s.i&128||v===this.s.gb||(this.s.i?0:z($a,this.s)):z($a,this.s))?this.s.ba(null):O(this.s);return null==a?null:new Le(a,this.fa)};f.H=function(){return bc(this)};
f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return this.s.Z(null).mb()};f.ca=function(){var a=(null!=this.s?this.s.i&128||v===this.s.gb||(this.s.i?0:z($a,this.s)):z($a,this.s))?this.s.ba(null):O(this.s);return null!=a?new Le(a,this.fa):Yb};f.J=function(){return this};f.M=function(a,b){return new Le(this.s,b)};f.R=function(a,b){return V(b,this)};Le.prototype[Sa]=function(){return $b(this)};
function ce(a){return(a=L(a))?new Le(a,null):null}function he(a){return gb(a)}function Me(a,b){this.s=a;this.fa=b;this.i=32374988;this.w=0}f=Me.prototype;f.toString=function(){return Lb(this)};f.equiv=function(a){return this.o(null,a)};f.indexOf=function(){var a=null,a=function(a,c){switch(arguments.length){case 1:return S(this,a,0);case 2:return S(this,a,c)}throw Error("Invalid arity: "+(arguments.length-1));};a.a=function(a){return S(this,a,0)};a.b=function(a,c){return S(this,a,c)};return a}();
f.lastIndexOf=function(){function a(a){return U(this,a,T(this))}var b=null,b=function(b,d){switch(arguments.length){case 1:return a.call(this,b);case 2:return U(this,b,d)}throw Error("Invalid arity: "+(arguments.length-1));};b.a=a;b.b=function(a,b){return U(this,a,b)};return b}();f.I=function(){return this.fa};f.ba=function(){var a=(null!=this.s?this.s.i&128||v===this.s.gb||(this.s.i?0:z($a,this.s)):z($a,this.s))?this.s.ba(null):O(this.s);return null==a?null:new Me(a,this.fa)};f.H=function(){return bc(this)};
f.o=function(a,b){return qc(this,b)};f.V=function(a,b){return Jc(b,this)};f.W=function(a,b,c){return Mc(b,c,this)};f.Z=function(){return this.s.Z(null).nb()};f.ca=function(){var a=(null!=this.s?this.s.i&128||v===this.s.gb||(this.s.i?0:z($a,this.s)):z($a,this.s))?this.s.ba(null):O(this.s);return null!=a?new Me(a,this.fa):Yb};f.J=function(){return this};f.M=function(a,b){return new Me(this.s,b)};f.R=function(a,b){return V(b,this)};Me.prototype[Sa]=function(){return $b(this)};
function de(a){return(a=L(a))?new Me(a,null):null}function ie(a){return jb(a)}function Vc(a){if(null!=a&&(a.w&4096||v===a.Jb))return a.name;if("string"===typeof a)return a;throw Error([C.a("Doesn't support name: "),C.a(a)].join(""));}
function Ne(a,b,c,d,e,g,h){var k=Fa;Fa=null==Fa?null:Fa-1;try{if(null!=Fa&&0>Fa)return H(a,"#");H(a,c);if(0===Pa.a(g))L(h)&&H(a,function(){var a=Oe.a(g);return x(a)?a:"..."}());else{if(L(h)){var l=N(h);b.g?b.g(l,a,g):b.call(null,l,a,g)}for(var m=O(h),n=Pa.a(g)-1;;)if(!m||null!=n&&0===n){L(m)&&0===n&&(H(a,d),H(a,function(){var a=Oe.a(g);return x(a)?a:"..."}()));break}else{H(a,d);var p=N(m);c=a;h=g;b.g?b.g(p,c,h):b.call(null,p,c,h);var r=O(m);c=n-1;m=r;n=c}}return H(a,e)}finally{Fa=k}}
function Pe(a,b){for(var c=L(b),d=null,e=0,g=0;;)if(g<e){var h=d.G(null,g);H(a,h);g+=1}else if(c=L(c))d=c,Ec(d)?(c=Fb(d),e=Gb(d),d=c,h=T(c),c=e,e=h):(h=N(d),H(a,h),c=O(d),d=null,e=0),g=0;else return null}var Qe={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Re(a){return[C.a('"'),C.a(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Qe[a]})),C.a('"')].join("")}
function Se(a,b){var c=Ic(K.b(a,Ma));return c?(c=null!=b?b.i&131072||v===b.Ib?!0:!1:!1)?null!=Ac(b):c:c}
function Te(a,b,c){if(null==a)return H(b,"nil");if(Se(c,a)){H(b,"^");var d=Ac(a);Z.g?Z.g(d,b,c):Z.call(null,d,b,c);H(b," ")}if(a.vb)return a.Rb(b);if(null!=a&&(a.i&2147483648||v===a.U))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return H(b,""+C.a(a));if(null!=a&&a.constructor===Object)return H(b,"#js "),d=Y.b(function(b){return new kd(null,2,5,ld,[Uc.a(b),a[b]],null)},Fc(a)),Ue.u?Ue.u(d,Z,b,c):Ue.call(null,d,Z,b,c);if(Qa(a))return Ne(b,Z,"#js ["," ","]",c,a);if("string"==typeof a)return x(La.a(c))?
H(b,Re(a)):H(b,a);if("function"==q(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Pe(b,sc(["#object[",c,' "',""+C.a(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+C.a(a);;)if(T(c)<b)c=[C.a("0"),C.a(c)].join("");else return c},Pe(b,sc(['#inst "',""+C.a(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Pe(b,sc(['#"',a.source,'"'],0));if(x(a.constructor.ib))return Pe(b,sc(["#object[",a.constructor.ib.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Pe(b,sc(["#object[",c," ",""+C.a(a),"]"],0))}function Z(a,b,c){var d=Ve.a(c);return x(d)?(c=wc.g(c,We,Te),d.g?d.g(a,b,c):d.call(null,a,b,c)):Te(a,b,c)}
function Xe(a,b){var c=new Aa;a:{var d=new Kb(c);Z(N(a),d,b);for(var e=L(O(a)),g=null,h=0,k=0;;)if(k<h){var l=g.G(null,k);H(d," ");Z(l,d,b);k+=1}else if(e=L(e))g=e,Ec(g)?(e=Fb(g),h=Gb(g),g=e,l=T(e),e=h,h=l):(l=N(g),H(d," "),Z(l,d,b),e=O(g),g=null,h=0),k=0;else break a}return c}function Ye(a,b,c,d,e){return Ne(d,function(a,b,d){var e=gb(a);c.g?c.g(e,b,d):c.call(null,e,b,d);H(b," ");a=jb(a);return c.g?c.g(a,b,d):c.call(null,a,b,d)},[C.a(a),C.a("{")].join(""),", ","}",e,L(b))}
function Ue(a,b,c,d){var e=W(null,0,null),g=W(null,1,null);return x(e)?Ye([C.a("#:"),C.a(e)].join(""),g,b,c,d):Ye(null,a,b,c,d)}M.prototype.U=v;M.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};Wc.prototype.U=v;Wc.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};De.prototype.U=v;De.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};ae.prototype.U=v;ae.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};Od.prototype.U=v;
Od.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};Tc.prototype.U=v;Tc.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};Ie.prototype.U=v;Ie.prototype.L=function(a,b,c){return Ue(this,Z,b,c)};Fe.prototype.U=v;Fe.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};Sd.prototype.U=v;Sd.prototype.L=function(a,b,c){return Ne(b,Z,"["," ","]",c,this)};$c.prototype.U=v;$c.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};pd.prototype.U=v;
pd.prototype.L=function(a,b,c){H(b,"#object [cljs.core.Atom ");Z(new Ja(null,1,[Ze,this.state],null),b,c);return H(b,"]")};Me.prototype.U=v;Me.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};kd.prototype.U=v;kd.prototype.L=function(a,b,c){return Ne(b,Z,"["," ","]",c,this)};Sc.prototype.U=v;Sc.prototype.L=function(a,b){return H(b,"()")};Ja.prototype.U=v;Ja.prototype.L=function(a,b,c){return Ue(this,Z,b,c)};Le.prototype.U=v;Le.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};
Rc.prototype.U=v;Rc.prototype.L=function(a,b,c){return Ne(b,Z,"("," ",")",c,this)};function $e(){}var af=function af(b){if(null!=b&&null!=b.Db)return b.Db(b);var c=af[q(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=af._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw A("IEncodeJS.-clj-\x3ejs",b);};
function bf(a){if(null!=a?v===a.Cb||(a.Sb?0:z($e,a)):z($e,a))a=af(a);else if("string"===typeof a||"number"===typeof a||a instanceof X||a instanceof Wb)a=cf.a?cf.a(a):cf.call(null,a);else{a=sc([a],0);var b=Ia(),c;(c=null==a)||(c=L(a),c=null==c?!0:!1===c?!0:!1);a=c?"":""+C.a(Xe(a,b))}return a}
var cf=function cf(b){if(null==b)return null;if(null!=b?v===b.Cb||(b.Sb?0:z($e,b)):z($e,b))return af(b);if(b instanceof X)return Vc(b);if(b instanceof Wb)return""+C.a(b);if(Cc(b)){var c={};b=L(b);for(var d=null,e=0,g=0;;)if(g<e){var h=d.G(null,g),k=W(h,0,null),h=W(h,1,null);c[bf(k)]=cf.a?cf.a(h):cf.call(null,h);g+=1}else if(b=L(b))Ec(b)?(e=Fb(b),b=Gb(b),d=e,e=T(e)):(e=N(b),d=W(e,0,null),e=W(e,1,null),c[bf(d)]=cf.a?cf.a(e):cf.call(null,e),b=O(b),d=null,e=0),g=0;else break;return c}if(null==b?0:null!=
b?b.i&8||v===b.ac||(b.i?0:z(Xa,b)):z(Xa,b)){c=[];b=L(Y.b(cf,b));d=null;for(g=e=0;;)if(g<e)k=d.G(null,g),c.push(k),g+=1;else if(b=L(b))d=b,Ec(d)?(b=Fb(d),g=Gb(d),d=b,e=T(b),b=g):(b=N(d),c.push(b),b=O(d),d=null,e=0),g=0;else break;return c}return b};var df=new X(null,"text-content","text-content",-2126072735),Ma=new X(null,"meta","meta",1499536964),Na=new X(null,"dup","dup",556298533),td=new X(null,"validator","validator",-1966190681),ef=new X(null,"value","value",305978217),ff=new X(null,"mode","mode",654403691),Ze=new X(null,"val","val",128701612),We=new X(null,"fallback-impl","fallback-impl",-1501286995),Ka=new X(null,"flush-on-newline","flush-on-newline",-151457939),md=new Wb(null,"meta11894","meta11894",-1011378705,null),La=new X(null,"readably",
"readably",1129599760),Oe=new X(null,"more-marker","more-marker",-14717935),Pa=new X(null,"print-length","print-length",1931866356),gf=new X(null,"editor","editor",-989377770),Ve=new X(null,"alt-impl","alt-impl",670969595),hf=new X(null,"lineNumbers","lineNumbers",1374890941);var jf;a:{var kf=ba.navigator;if(kf){var lf=kf.userAgent;if(lf){jf=lf;break a}}jf=""}function mf(a){return-1!=jf.indexOf(a)};var nf=mf("Opera"),of=mf("Trident")||mf("MSIE"),pf=mf("Edge"),rf=mf("Gecko")&&!(-1!=jf.toLowerCase().indexOf("webkit")&&!mf("Edge"))&&!(mf("Trident")||mf("MSIE"))&&!mf("Edge"),sf=-1!=jf.toLowerCase().indexOf("webkit")&&!mf("Edge");sf&&mf("Mobile");mf("Macintosh");mf("Windows");mf("Linux")||mf("CrOS");var tf=ba.navigator||null;tf&&(tf.appVersion||"").indexOf("X11");mf("Android");!mf("iPhone")||mf("iPod")||mf("iPad");mf("iPad");mf("iPod");
function uf(){var a=ba.document;return a?a.documentMode:void 0}var vf;a:{var wf="",xf=function(){var a=jf;if(rf)return/rv\:([^\);]+)(\)|;)/.exec(a);if(pf)return/Edge\/([\d\.]+)/.exec(a);if(of)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(sf)return/WebKit\/(\S+)/.exec(a);if(nf)return/(?:Version)[ \/]?(\S+)/.exec(a)}();xf&&(wf=xf?xf[1]:"");if(of){var yf=uf();if(null!=yf&&yf>parseFloat(wf)){vf=String(yf);break a}}vf=wf}var zf={};
function Af(a){if(!zf[a]){for(var b=0,c=ga(String(vf)).split("."),d=ga(String(a)).split("."),e=Math.max(c.length,d.length),g=0;0==b&&g<e;g++){var h=c[g]||"",k=d[g]||"",l=RegExp("(\\d*)(\\D*)","g"),m=RegExp("(\\d*)(\\D*)","g");do{var n=l.exec(h)||["","",""],p=m.exec(k)||["","",""];if(0==n[0].length&&0==p[0].length)break;b=ha(0==n[1].length?0:parseInt(n[1],10),0==p[1].length?0:parseInt(p[1],10))||ha(0==n[2].length,0==p[2].length)||ha(n[2],p[2])}while(0==b)}zf[a]=0<=b}}var Bf;var Cf=ba.document;
Bf=Cf&&of?uf()||("CSS1Compat"==Cf.compatMode?parseInt(vf,10):5):void 0;var Df;if(!(Df=!rf&&!of)){var Ef;if(Ef=of)Ef=9<=Number(Bf);Df=Ef}Df||rf&&Af("1.9.1");of&&Af("9");var Ff;a:for(var Gf="js md xml css sass markdown sh html sql".split(" "),Hf="javascript markdown xml css sass markdown shell xml sql".split(" "),If=Gf.length,Jf=0,Kf=Ab(ge);;)if(Jf<If)var Lf=Jf+1,Mf=Kf.Na(null,Gf[Jf],Hf[Jf]),Jf=Lf,Kf=Mf;else{Ff=Cb(Kf);break a}var Nf,Of=new Ja(null,2,[df,"",gf,null],null);Nf=rd?rd(Of):qd.call(null,Of);var Pf=function(a){var b=null;return function(c){ba.clearTimeout(b);var d=arguments;b=ba.setTimeout(function(){a.apply(null,d)},1E3)}}(function(){return window.java.onautosave()});
function Qf(){var a=R.a?R.a(Nf):R.call(null,Nf),a=null==a?null:gf.a(a);return null==a?null:a.getValue()}function Rf(){wd.u(Nf,wc,df,Qf());return window.java.onchange()}var Sf=window;Sf.undo=function(){var a=R.a?R.a(Nf):R.call(null,Nf),a=null==a?null:gf.a(a);null!=a&&a.undo();return window.java.onautosave()};Sf.redo=function(){var a=R.a?R.a(Nf):R.call(null,Nf),a=null==a?null:gf.a(a);null!=a&&a.redo();return window.java.onautosave()};
Sf.canUndo=function(){var a=R.a?R.a(Nf):R.call(null,Nf),a=null==a?null:gf.a(a),a=null==a?null:a.historySize(),a=null==a?null:a.undo;return null==a?null:0<a};Sf.canRedo=function(){var a=R.a?R.a(Nf):R.call(null,Nf),a=null==a?null:gf.a(a),a=null==a?null:a.historySize(),a=null==a?null:a.redo;return null==a?null:0<a};
Sf.setTextContent=function(a){var b=document.querySelector("#content");if("textContent"in b)b.textContent=a;else if(3==b.nodeType)b.data=a;else if(b.firstChild&&3==b.firstChild.nodeType){for(;b.lastChild!=b.firstChild;)b.removeChild(b.lastChild);b.firstChild.data=a}else{for(var c;c=b.firstChild;)b.removeChild(c);b.appendChild((9==b.nodeType?b:b.ownerDocument||b.document).createTextNode(String(a)))}};Sf.getTextContent=Qf;Sf.getSelectedText=function(){return null};Sf.markClean=Rf;
Sf.isClean=function(){var a=R.a?R.a(Nf):R.call(null,Nf),a=null==a?null:df.a(a);return null==a?null:P.b(a,Qf())};Sf.changeTheme=function(a){var b=R.a?R.a(Nf):R.call(null,Nf),b=null==b?null:gf.a(b);return null==b?null:b.setOption("theme",x(a)?"lesser-dark":"default")};Sf.setTextSize=function(a){return document.querySelector(".CodeMirror").style.fontSize=[C.a(a),C.a("px")].join("")};
Sf.init=function(a){var b=document.querySelector("#content");wd.u(Nf,wc,gf,function(){var c=window.CodeMirror(document.body,cf(new Ja(null,3,[ef,b.textContent,hf,!0,ff,Ff.a?Ff.a(a):Ff.call(null,a)],null)));c.on("change",function(){return function(){Pf.F?Pf.F():Pf.call(null);return window.java.onchange()}}(c,b));c.setOption("extraKeys",cf(new Ja(null,4,["Ctrl-Z",!1,"Cmd-Z",!1,"Shift-Ctrl-Z",!1,"Shift-Cmd-Z",!1],null)));return c}());document.body.removeChild(b);return Rf()};
window.onload=function(){window.status="MY-MAGIC-VALUE";window.status="";window.java.onload();return window.java.onchange()};