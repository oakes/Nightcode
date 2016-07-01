var editor = null;
var lastTextContent = "";

window.onkeydown = function(e) {
    if ((e.metaKey || e.ctrlKey) && (e.keyCode == 38 || e.keyCode == 40)) {
        e.preventDefault();
    }
};

function init() {
    markClean();
    var parent = document.getElementById('paren-soup');
    editor = paren_soup.core.init(parent, {
        "change-callback": function(e) {
            if (window.java) {
                window.java.onchange();
            }
        },
        "disable-undo-redo?": true
    });
}

function initConsole(isRepl) {
    var parent = document.getElementById('paren-soup');
    editor = paren_soup.core.init(parent, {
        "change-callback": function(e) {
            if (window.java) {
                window.java.onchange();
            }
            if (e.type == "keyup") {
            	parent.scrollTop = parent.scrollHeight;
    		}
        },
        "disable-undo-redo?": true,
        "console-callback": function(text) {
            window.java.onenter(text + "\n");
        },
        "disable-clj?": !isRepl
    });
}

function undo() {
    paren_soup.core.undo(editor);
}

function redo() {
    paren_soup.core.redo(editor);
}

function canUndo() {
    if (editor == null) {
        return false;
    }
    return paren_soup.core.can_undo(editor);
}

function canRedo() {
    if (editor == null) {
        return false;
    }
    return paren_soup.core.can_redo(editor);
}

function getTextContent() {
    return document.getElementById('content').textContent;
}

function markClean() {
    if (window.java) {
    	lastTextContent = getTextContent();
    	window.java.onchange();
    }
}

function isClean() {
    return lastTextContent == getTextContent();
}

function showInstaRepl() {
    var parent = document.getElementById('paren-soup');
    var numbers = document.getElementById('numbers');
    var instarepl = document.createElement('div');
    instarepl.className = 'instarepl';
    instarepl.id = 'instarepl';
    parent.insertBefore(instarepl, numbers);
    init();
}

function hideInstaRepl() {
    var parent = document.getElementById('paren-soup');
    var instarepl = document.getElementById('instarepl');
    parent.removeChild(instarepl);
    init();
}

function append(text) {
    paren_soup.core.append_text(editor, text);
    var parent = document.getElementById('paren-soup');
    parent.scrollTop = parent.scrollHeight;
}

function changeTheme(isDark) {
	var oldlink = document.getElementsByTagName("link").item(0);
	var newlink = document.createElement("link");
	newlink.setAttribute("rel", "stylesheet");
	newlink.setAttribute("type", "text/css");
	newlink.setAttribute("href", isDark ? "paren-soup-dark.css" : "paren-soup-light.css");
	document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function setTextSize(size) {
	document.getElementById('paren-soup').style.fontSize = size + 'px';
}

window.onload = function() {
    // hack thanks to http://stackoverflow.com/a/28414332/1663009
    window.status = "MY-MAGIC-VALUE";
    window.status = "";
    
    if (window.java) {
        window.java.onload();
        window.java.onchange();
    }
    else {
        init();
    }
};
