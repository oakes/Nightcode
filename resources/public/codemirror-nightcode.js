var editor = null;
var lastTextContent = "";

function init() {
    var content = document.getElementById("content");
    editor = CodeMirror(document.body, {
        value: content.textContent,
        lineNumbers: true
    });
    if (window.java) {
        editor.on("change", function(editor, change) {
            window.java.onchange(change);
        });
    }
    document.body.removeChild(content);
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

function getTextContent() {
    return editor.getValue();
}

function markClean() {
    lastTextContent = getTextContent();
    window.java.onchange();
}

function isClean() {
    return lastTextContent == getTextContent();
}

window.onload = function() {
    if (window.java) {
        window.java.onload();
        init();
        markClean();
    }
    else {
        init();
    }
};