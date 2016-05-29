(ns net.sekao.nightcode.shortcuts
  (:require [clojure.string :as str]
            [clojure.set :as set]
            [net.sekao.nightcode.controller :as c]
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
               :project-pane "&uarr; &darr; &crarr;"
               :new-file "n"
               :edit "M"
               :open-in-browser "F"
               :cancel "C"
               :build-console "A"})

(def reverse-mappings (set/map-invert mappings))

(def actions {:new-project c/show-new-project!
              :import-project c/import!
              :rename c/rename!
              :remove c/remove!})

(fdef keyword->fx-id
  :args (s/cat :k keyword?)
  :ret string?)
(defn keyword->fx-id [k]
  (str "#" (str/replace (name k) #"-" "_")))

(fdef add-tooltip!
  :args (s/cat :control spec/node? :text string?))
(defn ^:no-check add-tooltip! [^Node control ^String text]
  (.setTooltip control
    (doto (Tooltip.)
      (.setText text)
      (.setAutoHide false))))

(fdef add-tooltips!
  :args (s/cat :scene spec/scene? :ids (s/coll-of keyword? [])))
(defn ^:no-check add-tooltips! [^Scene scene ids]
  (doseq [id ids]
    (let [control (.lookup scene (keyword->fx-id id))
          text (get mappings id)]
      (when (and control text)
        (add-tooltip! control text)))))

(fdef show-tooltip!
  :args (s/cat :stage spec/stage? :control spec/node?))
(defn ^:no-check show-tooltip! [^Stage stage ^Node control]
  (let [^Tooltip tooltip (.getTooltip control)
        point (.localToScene control (double 0) (double 0))
        scene (.getScene stage)
        _ (.show tooltip stage (double 0) (double 0))
        half-width (- (/ (.getWidth control) 2) (/ (.getWidth tooltip) 4))]
    (.show tooltip stage
      (double (+ (.getX point) (.getX scene) (-> scene .getWindow .getX) half-width))
      (double (+ (.getY point) (.getY scene) (-> scene .getWindow .getY))))))

(fdef hide-tooltip!
  :args (s/cat :control spec/node?))
(defn ^:no-check hide-tooltip! [^Node control]
  (-> control .getTooltip .hide))

(fdef toggle-tooltips!
  :args (s/cat :stage spec/stage? :show? spec/boolean?))
(defn ^:no-check toggle-tooltips! [^Stage stage show?]
  (let [^Scene scene (.getScene stage)]
    (doseq [id (keys mappings)]
      (when-let [control (.lookup scene (keyword->fx-id id))]
        (if show?
          (show-tooltip! stage control)
          (hide-tooltip! control))))))

(fdef run-shortcut!
  :args (s/cat :scene spec/scene? :text string? :shift? spec/boolean?))
(defn ^:no-check run-shortcut! [^Scene scene ^String text shift?]
  (when-let [id (get reverse-mappings (if shift? (.toUpperCase text) text))]
    (when-let [action (get actions id)]
      (Platform/runLater
        (fn []
          (action scene))))))

(fdef set-shortcut-listeners!
  :args (s/cat :stage spec/stage?))
(defn ^:no-check set-shortcut-listeners! [^Stage stage]
  (let [^Scene scene (.getScene stage)]
    ; show tooltips on key pressed
    (.addEventHandler scene KeyEvent/KEY_PRESSED
      (proxy [EventHandler] []
        (handle [^KeyEvent e]
          (when (#{KeyCode/COMMAND KeyCode/CONTROL} (.getCode e))
            (toggle-tooltips! stage true)))))
    ; hide tooltips and run shortcut on key released
    (.addEventHandler scene KeyEvent/KEY_RELEASED
      (proxy [EventHandler] []
        (handle [^KeyEvent e]
          (cond
            (#{KeyCode/COMMAND KeyCode/CONTROL} (.getCode e))
            (toggle-tooltips! stage false)
            (.isShortcutDown e)
            (run-shortcut! scene (.getText e) (.isShiftDown e))))))
    ; hide tooltips on window focus
    (.addListener (.focusedProperty stage)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (toggle-tooltips! stage false)))))))
