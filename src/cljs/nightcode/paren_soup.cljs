(ns nightcode.paren-soup
  (:require [goog.functions :refer [debounce]]
            [paren-soup.core :as p]
            [mistakes-were-made.core :as mwm]
            [cross-parinfer.core :as cp]
            [cljs.reader :refer [read-string]]
            [goog.dom :as gdom]
            [goog.object :as gobj])
  (:import goog.net.XhrIo))

(def state (atom {:text-content "" :editor nil}))

(def modal (.querySelector js/document "#modal"))

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
  (gdom/setTextContent (.querySelector js/document "#content") content))

(defn get-text-content []
  (.-textContent (.querySelector js/document "#content")))

(defn get-saved-text []
  (:text-content @state))

(defn get-selected-text []
  (when-let [text (or (p/selected-text) (p/focused-text))]
    (:text (cp/mode :both text 0 0))))

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
      .-fontSize
      (set! (str size "px"))))

(defn open-modal []
  (-> modal
      .-style
      .-display
      (set! "block")))

(defn compiler-fn [forms cb]
  (->> (pr-str (into [] forms))
       (.oneval js/window.java)
       read-string
       (mapv #(if (vector? %) (into-array %) %))
       cb))

(defn init []
  (mark-clean)
  (let [paren-soup (.querySelector js/document "#paren-soup")
        content (.querySelector js/document "#content")
        _ (-> content .-style .-whiteSpace (set! "pre"))
        editor (p/init paren-soup
                 (clj->js {:before-change-callback
                           (fn [e]
                             ; don't refresh editor when this is true
                             (and (= (.-type e) "keyup")
                                  (= (.-keyCode e) 0)))
                           :change-callback
                           (fn [e]
                             (let [{:keys [text-after-parinfer]} @state]
                               (when (= (.-type e) "keyup")
                                 (cond
                                   (nil? text-after-parinfer)
                                   (auto-save)
                                   ; if parinfer changed the initial text,
                                   ; don't autosave unless user changed
                                   ; the text afterwards
                                   (not= text-after-parinfer (get-text-content))
                                   (do
                                     (swap! state dissoc :text-after-parinfer)
                                     (auto-save)))))
                             (.onchange js/window.java))
                           :disable-undo-redo? true
                           :compiler-fn compiler-fn
                           :edit-history (:edit-history @state)}))
        text-after-parinfer (when-not (clean?)
                              (get-text-content))]
    (swap! state assoc
      :editor editor
      :text-after-parinfer text-after-parinfer
      :edit-history (mwm/create-edit-history))
    (.focus content)))

(defn init-console [repl?]
  (let [paren-soup (.querySelector js/document "#paren-soup")
        content (.querySelector js/document "#content")]
    (-> content .-style .-whiteSpace (set! "pre-wrap"))
    (swap! state assoc :editor
      (p/init paren-soup
        (clj->js {:before-change-callback
                  (fn [e]
                    ; don't refresh editor when this is true
                    (and (= (.-type e) "keyup")
                         (= (.-keyCode e) 0)))
                  :change-callback
                  (fn [e]
                    (when (= (.-type e) "keyup")
                      (set! (.-scrollTop paren-soup) (.-scrollHeight paren-soup)))
                    (.onchange js/window.java))
                  :disable-undo-redo? true
                  :console-callback
                  (fn [text]
                    (.onenter js/window.java (str text "\n")))
                  :disable-clj? (not repl?)
                  :append-limit 10000})))))

(defn show-instarepl []
  (-> (.querySelector js/document "#instarepl")
      .-style
      .-display
      (set! "list-item"))
  (init))

(defn hide-instarepl []
  (-> (.querySelector js/document "#instarepl")
      .-style
      .-display
      (set! "none"))
  (init))

(doto js/window
  (gobj/set "undo" undo)
  (gobj/set "redo" redo)
  (gobj/set "canUndo" can-undo?)
  (gobj/set "canRedo" can-redo?)
  (gobj/set "setTextContent" set-text-content)
  (gobj/set "getTextContent" get-text-content)
  (gobj/set "getSelectedText" get-selected-text)
  (gobj/set "getSavedText" get-saved-text)
  (gobj/set "markClean" mark-clean)
  (gobj/set "isClean" clean?)
  (gobj/set "append" append)
  (gobj/set "changeTheme" change-theme)
  (gobj/set "setTextSize" set-text-size)
  (gobj/set "openModal" open-modal)
  (gobj/set "init" init)
  (gobj/set "initConsole" init-console)
  (gobj/set "showInstaRepl" show-instarepl)
  (gobj/set "hideInstaRepl" hide-instarepl))

(set! (.-onload js/window)
  (fn []
    ; hack thanks to http://stackoverflow.com/a/28414332/1663009
    (set! (.-status js/window) "MY-MAGIC-VALUE")
    (set! (.-status js/window) "")
    (.onload js/window.java)
    (.onchange js/window.java)))

(set! (.-onkeydown js/window)
  (fn [e]
    (when (or (and (or (.-metaKey e) (.-ctrlKey e))
                   (#{38 40} (.-keyCode e)))
              (-> modal
                  .-style
                  .-display
                  (= "block")))
      (.preventDefault e))))

