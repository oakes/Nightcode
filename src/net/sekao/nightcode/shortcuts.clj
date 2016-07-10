(ns net.sekao.nightcode.shortcuts
  (:require [clojure.string :as str]
            [clojure.set :as set]
            [clojure.java.io :as io]
            [net.sekao.nightcode.spec :as spec]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.utils :as u])
  (:import [javafx.scene Node]
           [javafx.scene Scene]
           [javafx.scene.control Tooltip]
           [javafx.scene.input KeyEvent KeyCode]
           [javafx.stage Stage]
           [javafx.event EventHandler]
           [javafx.beans.value ChangeListener]
           [javafx.application Platform]))

(def id->key-char {; project pane
                   :#start "p"
                   :#import_project "o"
                   :#rename "m"
                   :#remove "g"
                   :#project_tree "↑ ↓ ↲"
                   ; editor pane
                   :#up "u"
                   :#save "s"
                   :#undo "z"
                   :#redo "Z"
                   :#instarepl "l"
                   :#find "f"
                   :#close "w"
                   ; build pane
                   :.run "r"
                   :.run-with-repl "X"
                   :.reload "S"
                   :.build "b"
                   :.clean "L"
                   :.stop "i"
                   ; directory pane
                   :#new_file "n"
                   :#open_in_file_browser "F"})

(def key-char->id (set/map-invert id->key-char))

(defn add-tooltip! [^Node node ^String text]
  (.setTooltip node
    (doto (Tooltip.)
      (.setOpacity 0)
      (.setText text))))

(defn add-tooltips!
  [node ids]
  (doseq [id ids]
    (let [node (.lookup node (name id))
          text (id->key-char id)]
      (when (and node text)
        (add-tooltip! node text)))))

(defn remove-tooltips!
  [node ids]
  (doseq [id ids]
    (when-let [node (.lookup node (name id))]
      (.setTooltip node nil))))

(defn show-tooltip!
  ([^Stage stage ^Node node]
   (show-tooltip! stage node node))
  ([^Stage stage ^Node node ^Node relative-node]
   (when (.isManaged relative-node)
     (when-let [^Tooltip tooltip (.getTooltip node)]
       (let [node relative-node
             point (.localToScene node (double 0) (double 0))
             scene (.getScene stage)
             _ (.show tooltip stage (double 0) (double 0))
             half-width (- (/ (.getWidth node) 2)
                           (/ (.getWidth tooltip) 4))
             half-height (- (/ (.getHeight node) 2)
                            (/ (.getHeight tooltip) 4))]
         (doto tooltip
           (.setOpacity 1)
           (.show stage
             (double (+ (.getX point) (.getX scene) (-> scene .getWindow .getX) half-width))
             (double (+ (.getY point) (.getY scene) (-> scene .getWindow .getY) half-height)))))))))

(defn show-tooltips! [^Stage stage ^Node node]
  (doseq [id (keys id->key-char)]
    (doseq [node (.lookupAll node (name id))]
      (show-tooltip! stage node))))

(defn hide-tooltip! [^Node node]
  (when-let [tooltip (.getTooltip node)]
    (doto tooltip
      (.setOpacity 0)
      (.hide))))

(defn hide-tooltips! [^Node node]
  (doseq [id (keys id->key-char)]
    (doseq [node (.lookupAll node (name id))]
      (hide-tooltip! node))))

(defn init-tabs! [^Scene scene]
  (doto (.lookup scene "#tabs")
    (.setManaged false)
    (add-tooltip! "")))

(defn update-tabs! [^Scene scene pref-state runtime-state]
  (let [tabs (.lookup scene "#tabs")
        tooltip (.getTooltip tabs)
        selected-path (:selection pref-state)
        names (map (fn [path]
                     (let [format-str (if (u/parent-path? selected-path path) "-> %s <-" "   %s   ")
                           file-name (-> path io/file .getName)]
                       (format format-str file-name)))
                (-> runtime-state :editor-panes keys))
        names (str/join "\n" names)]
    (.setText tooltip (str "   PgUp PgDn   \n\n" names))))

(defn show-tabs! [^Stage stage ^Node node]
  (let [tabs (.lookup node "#tabs")
        content (.lookup node "#content")]
    (show-tooltip! stage tabs content)))

(defn hide-tabs! [^Node node]
  (hide-tooltip! (.lookup node "#tabs")))

(defn run-shortcut! [^Scene scene actions ^String text shift?]
  (when-let [id (key-char->id (if shift? (.toUpperCase text) text))]
    (when-let [action (get actions id)]
      (when (->> (.lookupAll (.getRoot scene) (name id))
                 (filter #(and (not (.isDisabled %))
                               (.isManaged %)
                               (some? (.getTooltip %))))
                 first)
        (Platform/runLater
          (fn []
            (action scene)))))))

(defn set-shortcut-listeners! [^Stage stage pref-state-atom runtime-state-atom actions]
  (let [^Scene scene (.getScene stage)]
    ; update tabs when editor panes change
    (add-watch runtime-state-atom :runtime-state-changed
      (fn [_ _ _ new-runtime-state]
        (update-tabs! scene @pref-state-atom new-runtime-state)))
    ; show tooltips on key pressed
    (.addEventHandler scene KeyEvent/KEY_PRESSED
      (reify EventHandler
        (handle [this e]
          (when (#{KeyCode/COMMAND KeyCode/CONTROL} (.getCode e))
            (Platform/runLater
              (fn []
                (show-tooltips! stage (.getRoot scene))
                (show-tabs! stage (.getRoot scene))))))))
    ; hide tooltips and run shortcut on key released
    (.addEventHandler scene KeyEvent/KEY_RELEASED
      (reify EventHandler
        (handle [this e]
          (cond
            (#{KeyCode/COMMAND KeyCode/CONTROL} (.getCode e))
            (Platform/runLater
              (fn []
                (doto (.getRoot scene)
                  hide-tooltips!
                  hide-tabs!)))
            (.isShortcutDown e)
            (if (#{KeyCode/UP KeyCode/DOWN KeyCode/PAGE_UP KeyCode/PAGE_DOWN} (.getCode e))
              ; if any new nodes have appeared, make sure their tooltips are showing
              (Platform/runLater
                (fn []
                  (show-tooltips! stage (.getRoot scene))
                  (show-tabs! stage (.getRoot scene))))
              ; run the action for the given key
              (run-shortcut! scene actions (.getText e) (.isShiftDown e)))))))
    ; hide tooltips on window focus
    (.addListener (.focusedProperty stage)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (doto (.getRoot scene)
              hide-tooltips!
              hide-tabs!)))))))

; specs

(fdef add-tooltip!
  :args (s/cat :node spec/node? :text string?))

(fdef add-tooltips!
  :args (s/cat :node (s/or :node spec/node? :stage spec/scene?) :ids (s/coll-of keyword?)))

(fdef remove-tooltips!
  :args (s/cat :node spec/node? :ids (s/coll-of keyword?)))

(fdef show-tooltip!
  :args (s/alt
          :two-args (s/cat :stage spec/stage? :node spec/node?)
          :three-args (s/cat :stage spec/stage? :node spec/node? :relative-node (s/nilable spec/node?))))

(fdef show-tooltips!
  :args (s/cat :stage spec/stage? :node spec/node?))

(fdef hide-tooltip!
  :args (s/cat :node spec/node?))

(fdef hide-tooltips!
  :args (s/cat :node spec/node?))

(fdef init-tabs!
  :args (s/cat :scene spec/scene?))

(fdef update-tabs!
  :args (s/cat :scene spec/scene? :pref-state map? :runtime-state map?))

(fdef show-tabs!
  :args (s/cat :stage spec/stage? :node spec/node?))

(fdef hide-tabs!
  :args (s/cat :node spec/node?))

(fdef run-shortcut!
  :args (s/cat :scene spec/scene? :actions map? :text string? :shift? boolean?))

(fdef set-shortcut-listeners!
  :args (s/cat :stage spec/stage? :pref-state-atom spec/atom? :runtime-state-atom spec/atom? :actions map?))

