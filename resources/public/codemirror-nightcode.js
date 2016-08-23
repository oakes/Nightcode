var editor = null;
var lastTextContent = "";

var autosave = paren_soup.core.debounce_function(function() {window.java.onautosave();}, 1000);

function init() {
    var content = document.getElementById("content");
    editor = CodeMirror(document.body, {
        value: content.textContent,
        lineNumbers: true
    });
    if (window.java) {
        editor.on("change", function(editor, change) {
            autosave();
            window.java.onchange();
        });
    }
    document.body.removeChild(content);
    markClean();
}

function undo() {
    editor.undo();
}

function redo() {
    editor.redo();
}

function canUndo() {
    if (editor == null) {
        return false;
    }
    return editor.historySize().undo > 0;
}

function canRedo() {
    if (editor == null) {
        return false;
    }
    return editor.historySize().redo > 0;
}

function setTextContent(content) {
    document.getElementById('content').textContent = content;
}

function getTextContent() {
    return editor.getValue();
}

function getSelectedText() {
	return null;
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

function changeTheme(isDark) {
	editor.setOption("theme", isDark ? "lesser-dark" : "default");
}

function setTextSize(size) {
	document.querySelector(".CodeMirror").style.fontSize = size + 'px';
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
