(ns nightcode.shortcuts
  (:require [clojure.string :as str]
            [clojure.set :as set]
            [clojure.java.io :as io]
            [nightcode.spec :as spec]
            [clojure.spec.alpha :as s :refer [fdef]]
            [nightcode.utils :as u])
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
                   :.reload-file "S"
                   :.reload-selection "R"
                   :.build "b"
                   :.clean "L"
                   :.test "t"
                   :.stop "i"
                   ; directory pane
                   :#new_file "n"
                   :#open_in_file_browser "F"})

(def key-char->id (set/map-invert id->key-char))

(fdef add-tooltip!
  :args (s/cat :node spec/node? :text string?))

(defn add-tooltip! [^Node node ^String text]
  (.setTooltip node
    (doto (Tooltip.)
      (.setOpacity 0)
      (.setText text))))

(fdef add-tooltips!
  :args (s/cat :node (s/or :node spec/node? :stage spec/scene?) :ids (s/coll-of keyword?)))

(defn add-tooltips!
  [node ids]
  (doseq [id ids]
    (let [node (.lookup node (name id))
          text (id->key-char id)]
      (when (and node text)
        (add-tooltip! node text)))))

(fdef remove-tooltip!
  :args (s/cat :node spec/node?))

(defn remove-tooltip! [node]
  (.setTooltip node nil))

(fdef remove-tooltips!
  :args (s/cat :node spec/node? :ids (s/coll-of keyword?)))

(defn remove-tooltips! [node ids]
  (doseq [id ids]
    (when-let [node (.lookup node (name id))]
      (remove-tooltip! node))))

(fdef show-tooltip!
  :args (s/alt
          :two-args (s/cat :stage spec/stage? :node spec/node?)
          :three-args (s/cat :stage spec/stage? :node spec/node? :relative-node (s/nilable spec/node?))))

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

(fdef show-tooltips!
  :args (s/cat :stage spec/stage? :node spec/node?))

(defn show-tooltips! [^Stage stage ^Node node]
  (doseq [id (keys id->key-char)]
    (doseq [node (.lookupAll node (name id))]
      (show-tooltip! stage node))))

(fdef hide-tooltip!
  :args (s/cat :node spec/node?))

(defn hide-tooltip! [^Node node]
  (when-let [tooltip (.getTooltip node)]
    (doto tooltip
      (.setOpacity 0)
      (.hide))))

(fdef hide-tooltips!
  :args (s/cat :node spec/node?))

(defn hide-tooltips! [^Node node]
  (doseq [id (keys id->key-char)]
    (doseq [node (.lookupAll node (name id))]
      (hide-tooltip! node))))

(fdef init-tabs!
  :args (s/cat :scene spec/scene?))

(defn init-tabs! [^Scene scene]
  (doto (.lookup scene "#tabs")
    (.setManaged false)
    (add-tooltip! "")))

(fdef update-tabs!
  :args (s/cat :scene spec/scene? :pref-state map? :runtime-state map?))

(defn update-tabs! [^Scene scene pref-state runtime-state]
  (when-let [tabs (.lookup scene "#tabs")]
    (let [tooltip (.getTooltip tabs)
          selected-path (:selection pref-state)
          names (map (fn [path]
                       (let [format-str (if (u/parent-path? selected-path path) "-> %s <-" "   %s   ")
                             file-name (-> path io/file .getName)]
                         (format format-str file-name)))
                  (-> runtime-state :editor-panes keys))
          names (str/join "\n" names)]
      (.setText tooltip (str "   PgUp PgDn   \n\n" names)))))

(fdef show-tabs!
  :args (s/cat :stage spec/stage? :node spec/node?))

(defn show-tabs! [^Stage stage ^Node node]
  (when-let [tabs (.lookup node "#tabs")]
    (when-let [content (.lookup node "#content")]
      (show-tooltip! stage tabs content))))

(fdef hide-tabs!
  :args (s/cat :node spec/node?))

(defn hide-tabs! [^Node node]
  (when-let [tabs (.lookup node "#tabs")]
    (hide-tooltip! tabs)))

(fdef run-shortcut!
  :args (s/cat :scene spec/scene? :actions map? :text string? :shift? boolean?))

(defn run-shortcut! [^Scene scene actions ^String text shift?]
  (when-let [id (key-char->id (if shift? text (.toLowerCase text)))]
    (when-let [action (get actions id)]
      (when (->> (.lookupAll (.getRoot scene) (name id))
                 (filter #(and (not (.isDisabled %))
                               (.isManaged %)
                               (some? (.getTooltip %))))
                 first)
        (Platform/runLater
          (fn []
            (action scene)))))))

(fdef set-shortcut-listeners!
  :args (s/cat :stage spec/stage? :*pref-state spec/atom? :*runtime-state spec/atom? :actions map?))

(defn set-shortcut-listeners! [^Stage stage *pref-state *runtime-state actions]
  (let [^Scene scene (.getScene stage)]
    ; show exit dialog
    (.setOnCloseRequest stage
      (reify EventHandler
        (handle [this e]
          (if (u/show-warning! (.getScene stage) "Quit" "Are you sure you want to quit?")
            (do
              (Platform/exit)
              (System/exit 0))
            (.consume e)))))
    ; update tabs when editor panes change
    (add-watch *runtime-state :runtime-state-changed
      (fn [_ _ _ new-runtime-state]
        (update-tabs! scene @*pref-state new-runtime-state)))
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
              (run-shortcut! scene actions (-> e .getCode .getName) (.isShiftDown e)))))))
    ; hide tooltips on window focus
    (.addListener (.focusedProperty stage)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (doto (.getRoot scene)
              hide-tooltips!
              hide-tabs!)))))))

