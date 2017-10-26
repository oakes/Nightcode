(ns nightcode.codemirror
  (:require [goog.functions :refer [debounce]]
            [cljsjs.codemirror]
            [cljsjs.codemirror.mode.css]
            [cljsjs.codemirror.mode.javascript]
            [cljsjs.codemirror.mode.markdown]
            [cljsjs.codemirror.mode.sass]
            [cljsjs.codemirror.mode.shell]
            [cljsjs.codemirror.mode.sql]
            [cljsjs.codemirror.mode.xml]
            [goog.dom :as gdom]
            [goog.object :as gobj]))

(def ^:const extension->mode
  {"css" "css"
   "js" "javascript"
   "md" "markdown"
   "markdown" "markdown"
   "sass" "sass"
   "sh" "shell"
   "sql" "sql"
   "html" "xml"
   "xml" "xml"})

(def state (atom {:text-content "" :editor nil}))

(def modal (.querySelector js/document "#modal"))

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
  (gdom/setTextContent (.querySelector js/document "#content") content))

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
      .-fontSize
      (set! (str size "px"))))

(defn open-modal []
  (-> modal
      .-style
      .-display
      (set! "block")))

(defn init [extension]
  (let [content (.querySelector js/document "#content")]
    (swap! state update :editor
      (fn [editor]
        (when editor
          (->> editor
               .getWrapperElement
               (.removeChild js/document.body)))
        (doto
          (.CodeMirror js/window
            js/document.body
            (clj->js {:value (.-textContent content)
                      :lineNumbers true
                      :mode (extension->mode extension)}))
          (.on "change"
            (fn [editor-object change]
              (auto-save)
              (.onchange js/window.java)))
          (.on "beforeChange"
            (fn [editor-object change]
              (when (-> modal
                        .-style
                        .-display
                        (= "block"))
                (.cancel change))))
          (.setOption "extraKeys"
            (clj->js {"Ctrl-Z" false
                      "Cmd-Z" false
                      "Shift-Ctrl-Z" false
                      "Shift-Cmd-Z" false})))))
    (gdom/setTextContent content ""))
  (mark-clean))

(doto js/window
  (gobj/set "undo" undo)
  (gobj/set "redo" redo)
  (gobj/set "canUndo" can-undo?)
  (gobj/set "canRedo" can-redo?)
  (gobj/set "setTextContent" set-text-content)
  (gobj/set "getTextContent" get-text-content)
  (gobj/set "getSelectedText" get-selected-text)
  (gobj/set "markClean" mark-clean)
  (gobj/set "isClean" clean?)
  (gobj/set "changeTheme" change-theme)
  (gobj/set "setTextSize" set-text-size)
  (gobj/set "openModal" open-modal)
  (gobj/set "init" init))

(set! (.-onload js/window)
  (fn []
    ; hack thanks to http://stackoverflow.com/a/28414332/1663009
    (set! (.-status js/window) "MY-MAGIC-VALUE")
    (set! (.-status js/window) "")
    (.onload js/window.java)
    (.onchange js/window.java)))

