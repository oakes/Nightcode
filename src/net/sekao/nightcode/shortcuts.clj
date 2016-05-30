(ns net.sekao.nightcode.shortcuts
  (:require [clojure.string :as str]
            [clojure.set :as set]
            [net.sekao.nightcode.spec :as spec]
            [clojure.spec :as s :refer [fdef]])
  (:import [javafx.scene Node]
           [javafx.scene Scene]
           [javafx.scene.control Tooltip]
           [javafx.scene.input KeyEvent KeyCode]
           [javafx.stage Stage]
           [javafx.event EventHandler]
           [javafx.beans.value ChangeListener]
           [javafx.application Platform]))

(def mappings {:new-project "p"
               :import-project "o"
               :rename "m"
               :remove "g"
               :run "r"
               :run-repl "X"
               :reload "S"
               :eval "e"
               :build "b"
               :test "t"
               :clean "l"
               :stop "i"
               :up "u"
               :save "s"
               :undo "z"
               :redo "y"
               :font-dec "-"
               :font-inc "="
               :find "f"
               :replace "R"
               :close "w"
               :repl-console "E"
               :project-tree "↑ ↓ ↲"
               :new-file "n"
               :edit "M"
               :open-in-browser "F"
               :cancel "C"
               :build-console "A"})

(def reverse-mappings (set/map-invert mappings))

(fdef keyword->fx-id
  :args (s/cat :k keyword?)
  :ret string?)
(defn keyword->fx-id [k]
  (str "#" (str/replace (name k) #"-" "_")))

(fdef fx-id->keyword
  :args (s/cat :s string?)
  :ret keyword?)
(defn fx-id->keyword [s]
  (-> s (str/replace #"_" "-") keyword))

(fdef add-tooltip!
  :args (s/cat :control spec/node? :text string?))
(defn ^:no-check add-tooltip! [^Node control ^String text]
  (.setTooltip control
    (doto (Tooltip.)
      (.setText text)
      (.setAutoHide false))))

(fdef add-tooltips!
  :args (s/alt
          :nodes (s/cat :nodes (s/coll-of spec/node? []))
          :ids (s/cat :scene spec/scene? :ids (s/coll-of keyword? []))))
(defn ^:no-check add-tooltips!
  ([nodes]
   (doseq [node nodes]
     (let [id (.getId node)
           key (fx-id->keyword id)]
       (when-let [text (get mappings key)]
         (add-tooltip! node text)))))
  ([^Scene scene ids]
   (doseq [id ids]
     (let [control (.lookup scene (keyword->fx-id id))
           text (get mappings id)]
       (when (and control text)
         (add-tooltip! control text))))))

(fdef show-tooltip!
  :args (s/cat :stage spec/stage? :control spec/node?))
(defn ^:no-check show-tooltip! [^Stage stage ^Node control]
  (when-let [^Tooltip tooltip (.getTooltip control)]
    (let [point (.localToScene control (double 0) (double 0))
          scene (.getScene stage)
          _ (.show tooltip stage (double 0) (double 0))
          half-width (- (/ (.getWidth control) 2)
                        (/ (.getWidth tooltip) 4))
          half-height (- (/ (.getHeight control) 2)
                         (/ (.getHeight tooltip) 4))]
      (.show tooltip stage
        (double (+ (.getX point) (.getX scene) (-> scene .getWindow .getX) half-width))
        (double (+ (.getY point) (.getY scene) (-> scene .getWindow .getY) half-height))))))

(fdef show-tooltips!
  :args (s/cat :node (s/or :node spec/node? :stage spec/scene?) :stage spec/stage?))
(defn ^:no-check show-tooltips! [node ^Stage stage]
  (doseq [id (keys mappings)]
    (when-let [control (.lookup node (keyword->fx-id id))]
      (show-tooltip! stage control))))

(fdef hide-tooltip!
  :args (s/cat :control spec/node?))
(defn ^:no-check hide-tooltip! [^Node control]
  (some-> control .getTooltip .hide))

(fdef hide-tooltips!
  :args (s/cat :node (s/or :node spec/node? :stage spec/scene?)))
(defn ^:no-check hide-tooltips! [node]
  (doseq [id (keys mappings)]
    (when-let [control (.lookup node (keyword->fx-id id))]
      (hide-tooltip! control))))

(fdef run-shortcut!
  :args (s/cat :scene spec/scene? :actions map? :text string? :shift? spec/boolean?))
(defn ^:no-check run-shortcut! [^Scene scene actions ^String text shift?]
  (when-let [id (get reverse-mappings (if shift? (.toUpperCase text) text))]
    (when-let [action (get actions id)]
      (Platform/runLater
        (fn []
          (action scene))))))

(fdef set-shortcut-listeners!
  :args (s/cat :stage spec/stage? :actions map?))
(defn ^:no-check set-shortcut-listeners! [^Stage stage actions]
  (let [^Scene scene (.getScene stage)]
    ; show tooltips on key pressed
    (.addEventHandler scene KeyEvent/KEY_PRESSED
      (proxy [EventHandler] []
        (handle [^KeyEvent e]
          (when (#{KeyCode/COMMAND KeyCode/CONTROL} (.getCode e))
            (show-tooltips! scene stage)))))
    ; hide tooltips and run shortcut on key released
    (.addEventHandler scene KeyEvent/KEY_RELEASED
      (proxy [EventHandler] []
        (handle [^KeyEvent e]
          (cond
            (#{KeyCode/COMMAND KeyCode/CONTROL} (.getCode e))
            (hide-tooltips! scene)
            (.isShortcutDown e)
            (run-shortcut! scene actions (.getText e) (.isShiftDown e))))))
    ; hide tooltips on window focus
    (.addListener (.focusedProperty stage)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (hide-tooltips! scene)))))))
