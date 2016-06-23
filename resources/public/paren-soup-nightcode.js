var editor = null;
var lastTextContent = "";

function init() {
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
    lastTextContent = getTextContent();
    window.java.onchange();
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

window.onload = function() {
    if (window.java) {
        window.java.onload();
        markClean();
        if (window.java.isConsole()) {
        	var parent = document.getElementById('paren-soup');
        	var numbers = document.getElementById('numbers');
            parent.removeChild(numbers);
            initConsole(false);
        }
        else {
            init();
        }
        window.java.onchange();
    }
    else {
        init();
    }
};