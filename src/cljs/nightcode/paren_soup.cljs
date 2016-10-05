(ns nightcode.paren-soup
  (:require [goog.functions :refer [debounce]]
            [paren-soup.core :as p]
            [cross-parinfer.core :as cp]))

(def state (atom {:text-content "" :editor nil}))

(def auto-save
  (debounce
    #(.onautosave js/window.java)
    1000))

(defn undo []
  (some-> @state :editor p/undo)
  (.onautosave js/window.java))

(defn redo []
  (some-> @state :editor p/redo)
  (.onautosave js/window.java))

(defn can-undo? []
  (some-> @state :editor p/can-undo?))

(defn can-redo? []
  (some-> @state :editor p/can-redo?))

(defn set-text-content [content]
  (set! (.-textContent (.querySelector js/document "#content"))
    content))

(defn get-text-content []
  (.-textContent (.querySelector js/document "#content")))

(defn get-selected-text []
  (when-let [text (or (p/selected-text) (p/focused-text))]
    (cp/mode :both text 0 0)))

(defn mark-clean []
  (swap! state assoc :text-content (get-text-content))
  (.onchange js/window.java))

(defn clean? []
  (some-> @state :text-content (= (get-text-content))))

(defn append [text]
  (some-> @state :editor (p/append-text! text))
  (let [paren-soup (.querySelector js/document "#paren-soup")]
    (set! (.-scrollTop paren-soup) (.-scrollHeight paren-soup))))

(defn change-theme [dark?]
  (let [old-link (-> js/document (.getElementsByTagName "link") (.item 0))
        new-link (.createElement js/document "link")]
    (doto new-link
      (.setAttribute "rel" "stylesheet")
      (.setAttribute "type" "text/css")
      (.setAttribute "href" (if dark? "paren-soup-dark.css" "paren-soup-light.css")))
    (-> js/document (.getElementsByTagName "head") (.item 0) (.replaceChild new-link old-link))))

(defn set-text-size [size]
  (-> js/document
      (.querySelector "#paren-soup")
      .-style
      (aset "fontSize" (str size "px"))))

(defn init []
  (mark-clean)
  (let [paren-soup (.querySelector js/document "#paren-soup")
        content (.querySelector js/document "#content")]
    (swap! state assoc :editor
      (p/init paren-soup
        (clj->js {:change-callback
                  (fn [e]
                    (when (= (.-type e) "keyup")
                      (auto-save))
                    (.onchange js/window.java))
                  :disable-undo-redo? true})))
    (-> content .-style (aset "whiteSpace" "pre"))
    (.focus content)))

(defn init-console [repl?]
  (let [paren-soup (.querySelector js/document "#paren-soup")
        content (.querySelector js/document "#content")]
    (swap! state assoc :editor
      (p/init paren-soup
        (clj->js {:change-callback
                  (fn [e]
                    (when (= (.-type e) "keyup")
                      (set! (.-scrollTop paren-soup) (.-scrollHeight paren-soup)))
                    (.onchange js/window.java))
                  :disable-undo-redo? true
                  :console-callback
                  (fn [text]
                    (.onenter js/window.java (str text "\n")))
                  :disable-clj? (not repl?)
                  :append-limit 2000})))))

(defn show-instarepl []
  (-> (.querySelector js/document "#instarepl")
      .-style
      (aset "display" "list-item"))
  (init))

(defn hide-instarepl []
  (-> (.querySelector js/document "#instarepl")
      .-style
      (aset "display" "none"))
  (init))

(doto js/window
  (aset "undo" undo)
  (aset "redo" redo)
  (aset "canUndo" can-undo?)
  (aset "canRedo" can-redo?)
  (aset "setTextContent" set-text-content)
  (aset "getTextContent" get-text-content)
  (aset "getSelectedText" get-selected-text)
  (aset "markClean" mark-clean)
  (aset "isClean" clean?)
  (aset "append" append)
  (aset "changeTheme" change-theme)
  (aset "setTextSize" set-text-size)
  (aset "init" init)
  (aset "initConsole" init-console)
  (aset "showInstaRepl" show-instarepl)
  (aset "hideInstaRepl" hide-instarepl))

(set! (.-onload js/window)
  (fn []
    ; hack thanks to http://stackoverflow.com/a/28414332/1663009
    (set! (.-status js/window) "MY-MAGIC-VALUE")
    (set! (.-status js/window) "")
    (.onload js/window.java)
    (.onchange js/window.java)))

(set! (.-onkeydown js/window)
  (fn [e]
    (when (and (or (.-metaKey e) (.-ctrlKey e))
               (#{38 40} (.-keyCode e)))
      (.preventDefault e))))

