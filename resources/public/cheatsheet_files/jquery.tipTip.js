 /*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will create a custom tooltip to replace the default
 * browser tooltip. It is extremely lightweight and very smart in
 * that it detects the edges of the browser window and will make sure
 * the tooltip stays within the current window size. As a result the
 * tooltip will adjust itself to be displayed above, below, to the left
 * or to the right depending on what is necessary to stay within the
 * browser window. It is completely customizable as well via CSS.
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
    $.fn.tipTip = function(options) {
	var defaults = {
	    activation: "hover",
	    keepAlive: false,
	    maxWidth: "620px",
	    edgeOffset: 3,
	    defaultPosition: "bottom",
	    delay: 200,
	    fadeIn: 100,
	    fadeOut: 100,
	    attribute: "title",
	    content: false, // HTML or String to fill TipTIp with
	    enter: function(){},
	    exit: function(){}
	};
	var opts = $.extend(defaults, options);

	// Setup tip tip elements and render them to the DOM
	if($("#tiptip_holder").length <= 0){
	    var tiptip_holder = $('<div id="tiptip_holder" style="max-width:'+ opts.maxWidth +';"></div>');
	    var tiptip_content = $('<div id="tiptip_content"></div>');
	    var tiptip_arrow = $('<div id="tiptip_arrow"></div>');
	    $("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>')));
	} else {
	    var tiptip_holder = $("#tiptip_holder");
	    var tiptip_content = $("#tiptip_content");
	    var tiptip_arrow = $("#tiptip_arrow");
	}

	return this.each(function(){
	    var org_elem = $(this);
	    if(opts.content){
		var org_title = opts.content;
	    } else {
		var org_title = org_elem.attr(opts.attribute);
	    }
	    if(org_title != ""){
		if(!opts.content){
		    org_elem.removeAttr(opts.attribute); //remove original Attribute
		}
		var timeout = false;

		if(opts.activation == "hover"){
		    org_elem.hover(function(){
			active_tiptip();
		    }, function(){
			if(!opts.keepAlive){
			    deactive_tiptip();
			}
		    });
		    if(opts.keepAlive){
			tiptip_holder.hover(function(){}, function(){
			    deactive_tiptip();
			});
		    }
		} else if(opts.activation == "focus"){
		    org_elem.focus(function(){
			active_tiptip();
		    }).blur(function(){
			deactive_tiptip();
		    });
		} else if(opts.activation == "click"){
		    org_elem.click(function(){
			active_tiptip();
			return false;
		    }).hover(function(){},function(){
			if(!opts.keepAlive){
			    deactive_tiptip();
			}
		    });
		    if(opts.keepAlive){
			tiptip_holder.hover(function(){}, function(){
			    deactive_tiptip();
			});
		    }
		}

		function active_tiptip(){
		    opts.enter.call(this);
		    tiptip_content.html(org_title);
		    tiptip_holder.hide().removeAttr("class").css("margin","0");
		    tiptip_arrow.removeAttr("style");

		    var top = parseInt(org_elem.offset()['top']);
		    var left = parseInt(org_elem.offset()['left']);
		    var org_width = parseInt(org_elem.outerWidth());
		    var org_height = parseInt(org_elem.outerHeight());
		    var tip_w = tiptip_holder.outerWidth();
		    var tip_h = tiptip_holder.outerHeight();
		    var w_compare = Math.round((org_width - tip_w) / 2);
		    var t_class = "";

		    var tip_height_with_margin = (tip_h + 15);
		    var tip_top_if_below = Math.round(top + org_height + opts.edgeOffset);
		    var tip_top_if_above = Math.round(top - (opts.edgeOffset + tip_height_with_margin));
		    var window_top = parseInt($(window).scrollTop());
		    var window_bottom = window_top + parseInt($(window).height());

		    if ((tip_top_if_below + tip_height_with_margin) <= window_bottom){
			t_class = "_bottom";
			marg_top = tip_top_if_below;
			arrow_top = -12;
		    } else if (tip_top_if_above >= window_top){
			t_class = "_top";
			marg_top = tip_top_if_above;
			arrow_top = tip_h;
		    } else {
			t_class = "_bottom";
			marg_top = tip_top_if_below;
			arrow_top = -12;
		    }

		    var window_left = parseInt($(window).scrollLeft());
		    var window_right = window_left + parseInt($(window).width());
		    var marg_left = Math.round(left + w_compare);
		    if (marg_left < window_left + 10){
			marg_left = window_left + 10;
		    } else if ((marg_left + tip_w) > window_right - 10){
			marg_left = window_right - 10 - tip_w;
		    }
		    var arrow_left = Math.round(left + (org_width / 2) - marg_left);

		    tiptip_arrow.css({"margin-left": arrow_left+"px", "margin-top": arrow_top+"px"});
		    tiptip_holder.css({"margin-left": marg_left+"px", "margin-top": marg_top+"px"}).attr("class","tip"+t_class);

		    if (timeout){ clearTimeout(timeout); }
		    timeout = setTimeout(function(){ tiptip_holder.stop(true,true).fadeIn(opts.fadeIn); }, opts.delay);
		}

		function deactive_tiptip(){
		    opts.exit.call(this);
		    if (timeout){ clearTimeout(timeout); }
		    tiptip_holder.fadeOut(opts.fadeOut);
		}
	    }
	});
    }
})(jQuery);
