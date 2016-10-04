(ns nightcode.codemirror
  (:require [goog.functions :refer [debounce]]
            [cljsjs.codemirror]))

(def state (atom {:text-content "" :editor nil}))

(def auto-save
  (debounce
    #(.onautosave js/window.java)
    1000))

(defn undo []
  (some-> @state :editor .undo)
  (.onautosave js/window.java))

(defn redo []
  (some-> @state :editor .redo)
  (.onautosave js/window.java))

(defn can-undo? []
  (some-> @state :editor .historySize .-undo (> 0)))

(defn can-redo? []
  (some-> @state :editor .historySize .-redo (> 0)))

(defn set-text-content [content]
  (set! (.-textContent (.querySelector js/document "#content"))
    content))

(defn get-text-content []
  (some-> @state :editor .getValue))

(defn get-selected-text [])

(defn mark-clean []
  (swap! state assoc :text-content (get-text-content))
  (.onchange js/window.java))

(defn clean? []
  (some-> @state :text-content (= (get-text-content))))

(defn change-theme [dark?]
  (some-> @state :editor (.setOption "theme" (if dark? "lesser-dark" "default"))))

(defn set-text-size [size]
  (-> js/document
      (.querySelector ".CodeMirror")
      .-style
      (aset "fontSize" (str size "px"))))

(defn init []
  (let [content (.querySelector js/document "#content")]
    (swap! state assoc :editor
      (doto
        (.CodeMirror js/window
          js/document.body
          (clj->js {:value (.-textContent content)
                    :lineNumbers true}))
        (.on "change"
          (fn [editor-object change]
            (auto-save)
            (.onchange js/window.java)))))
    (.removeChild js/document.body content))
  (mark-clean))

(aset js/window "undo" undo)
(aset js/window "redo" redo)
(aset js/window "canUndo" can-undo?)
(aset js/window "canRedo" can-redo?)
(aset js/window "setTextContent" set-text-content)
(aset js/window "getTextContent" get-text-content)
(aset js/window "getSelectedText" get-selected-text)
(aset js/window "markClean" mark-clean)
(aset js/window "isClean" clean?)
(aset js/window "changeTheme" change-theme)
(aset js/window "setTextSize" set-text-size)
(aset js/window "init" init)

(set! (.-onload js/window)
  (fn []
    (.onload js/window.java)
    (.onchange js/window.java)))

