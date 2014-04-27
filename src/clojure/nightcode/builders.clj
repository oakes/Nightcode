(ns nightcode.builders
  (:require [clojure.java.io :as io]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.sandbox :as sandbox]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.chooser :as chooser]
            [seesaw.color :as color]
            [seesaw.core :as s]))

(declare show-builder!)

; keep track of open builders

(def builders (atom {}))

(defn get-builder
  [path]
  (when (contains? @builders path)
    (->> [:#build-console]
         (s/select (get-in @builders [path :view]))
         first)))

; actions for builder buttons

(defn set-android-sdk!
  [& _]
  (if (sandbox/get-dir)
    (dialogs/show-simple-dialog! (utils/get-string :sandbox-apology))
    (when-let [d (dialogs/show-open-dialog! (utils/read-pref :android-sdk))]
      (utils/write-pref! :android-sdk (.getCanonicalPath d))
      (show-builder! (ui/get-project-path @ui/tree-selection)))))

(defn set-robovm!
  [& _]
  (if (sandbox/get-dir)
    (dialogs/show-simple-dialog! (utils/get-string :sandbox-apology))
    (when-let [d (dialogs/show-open-dialog! (utils/read-pref :android-sdk))]
      (utils/write-pref! :robovm (.getCanonicalPath d))
      (show-builder! (ui/get-project-path @ui/tree-selection)))))

(defn eval-in-repl!
  [console path timestamp]
  (let [source-paths (-> (lein/read-project-clj path)
                         (lein/stale-clojure-sources timestamp)
                         utils/sort-by-dependency)
        commands (map #(read-string (str \( 'do (slurp %) \newline \)))
                      source-paths)
        names (map #(-> % io/file .getName) source-paths)]
    (->> (conj (vec commands) (vec names))
         (cons 'do)
         pr-str
         (.enterLine console)
         (binding [*read-eval* false]))))

; button toggling functions

(defn toggle-visible!
  [{:keys [view]} path]
  (let [android-project? (lein/android-project? path)
        ios-project? (lein/ios-project? path)
        java-project? (lein/java-project? path)
        clojurescript-project? (lein/clojurescript-project? path)
        project-clj? (-> @ui/tree-selection
                         io/file
                         .getName
                         (= "project.clj"))
        buttons {:#run-repl (and (not ios-project?)
                                 (not java-project?))
                 :#reload (and (not ios-project?)
                               (not (and java-project? android-project?)))
                 :#test (not java-project?)
                 :#sdk android-project?
                 :#robovm ios-project?
                 :#auto clojurescript-project?
                 :#check-versions project-clj?}]
    (doseq [[id should-show?] buttons]
      (ui/config! view id :visible? should-show?))))

(defn toggle-color!
  [{:keys [view]} path]
  (let [project-map (lein/read-project-clj path)
        sdk (get-in project-map [:android :sdk-path])
        robovm (get-in project-map [:ios :robovm-path])
        buttons {:#sdk (and sdk (.exists (io/file sdk)))
                 :#robovm (and robovm (.exists (io/file robovm)))}]
    (doseq [[id set?] buttons]
      (ui/config! view id :background (when-not set? (color/color :red))))))

(defn toggle-enable!
  [{:keys [view process last-reload]} path]
  (let [java-project? (lein/java-project? path)
        running? (not (nil? @process))
        buttons {:#run (not running?)
                 :#run-repl (not running?)
                 :#reload (not (nil? @last-reload))
                 :#build (not running?)
                 :#test (not running?)
                 :#clean (not running?)
                 :#stop running?
                 :#check-versions (not running?)}]
    (doseq [[id should-enable?] buttons]
      (ui/config! view id :enabled? should-enable?))))

; create and show/hide builders for each project

(def ^:dynamic *widgets* [:run :run-repl :reload :build :test
                          :clean :check-versions :stop
                          :sdk :robovm :auto])

(defn create-actions
  [path console build-pane process auto-process last-reload]
  {:run (fn [& _]
          (lein/run-project! process (ui/get-io! console) path)
          (when (lein/java-project? path)
            (reset! last-reload (System/currentTimeMillis))))
   :run-repl (fn [& _]
               (lein/run-repl-project! process (ui/get-io! console) path)
               (when (not (lein/java-project? path))
                 (reset! last-reload (System/currentTimeMillis))))
   :reload (fn [& _]
             (if (lein/java-project? path)
               (lein/run-hot-swap! (ui/get-io! console) path)
               (eval-in-repl! console path @last-reload))
             (reset! last-reload (System/currentTimeMillis)))
   :build (fn [& _]
            (lein/build-project! process (ui/get-io! console) path))
   :test (fn [& _]
           (lein/test-project! process (ui/get-io! console) path))
   :clean (fn [& _]
            (lein/clean-project! process (ui/get-io! console) path))
   :check-versions (fn [& _]
                     (lein/check-versions-in-project!
                       process (ui/get-io! console) path))
   :stop (fn [& _]
           (lein/stop-process! process))
   :sdk set-android-sdk!
   :robovm set-robovm!
   :auto (fn [& _]
           (ui/config! build-pane :#auto :selected? (nil? @auto-process))
           (if (nil? @auto-process)
             (lein/cljsbuild-project!
               auto-process (ui/get-io! console) path)
             (lein/stop-process! auto-process)))})

(defn create-widgets
  [actions]
  {:run (ui/button :id :run
                   :text (utils/get-string :run)
                   :listen [:action (:run actions)]
                   :focusable? false)
   :run-repl (ui/button :id :run-repl
                        :text (utils/get-string :run-with-repl)
                        :listen [:action (:run-repl actions)]
                        :focusable? false)
   :reload (ui/button :id :reload
                      :text (utils/get-string :reload)
                      :listen [:action (:reload actions)]
                      :focusable? false)
   :build (ui/button :id :build
                     :text (utils/get-string :build)
                     :listen [:action (:build actions)]
                     :focusable? false)
   :test (ui/button :id :test
                    :text (utils/get-string :test)
                    :listen [:action (:test actions)]
                    :focusable? false)
   :clean (ui/button :id :clean
                     :text (utils/get-string :clean)
                     :listen [:action (:clean actions)]
                     :focusable? false)
   :check-versions (ui/button :id :check-versions
                              :text (utils/get-string :check-versions)
                              :listen [:action (:check-versions actions)]
                              :focusable? false)
   :stop (ui/button :id :stop
                    :text (utils/get-string :stop)
                    :listen [:action (:stop actions)]
                    :focusable? false)
   :sdk (ui/button :id :sdk
                   :text (utils/get-string :android-sdk)
                   :listen [:action (:sdk actions)]
                   :focusable? false)
   :robovm (ui/button :id :robovm
                      :text (utils/get-string :robovm)
                      :listen [:action (:robovm actions)]
                      :focusable? false)
   :auto (ui/toggle :id :auto
                    :text (utils/get-string :auto-build)
                    :listen [:action (:auto actions)]
                    :focusable? false)})

(defn create-builder
  [path]
  (let [; create console and the pane that will hold it
        console (editors/create-console path)
        build-pane (s/border-panel
                     :center (s/config! console :id :build-console))
        ; create atoms to hold important values
        process (atom nil)
        auto-process (atom nil)
        last-reload (atom nil)
        ; create the actions and widgets
        actions (create-actions path console build-pane
                                process auto-process last-reload)
        widgets (create-widgets actions)
        ; create the bar that holds the widgets
        widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
    ; add the widget bar if necessary
    (when (> (count *widgets*) 0)
      (doto build-pane
        (s/config! :north widget-bar)
        shortcuts/create-hints!
        (shortcuts/create-mappings! actions)))
    ; refresh the builder when the process state changes
    (add-watch process
               :refresh-builder
               (fn [_ _ _ new-state]
                 (when (nil? new-state)
                   (reset! last-reload nil))
                 (show-builder! (ui/get-project-path @ui/tree-selection))))
    ; return a map describing the builder
    {:view build-pane
     :close-fn! (:stop actions)
     :should-remove-fn #(not (utils/project-path? path))
     :process process
     :last-reload last-reload
     :toggle-paredit-fn! (editors/init-paredit!
                           (.getTextArea console) false true)}))

(defn show-builder!
  [path]
  (when-let [pane (ui/get-builder-pane)]
    ; create new builder if necessary
    (when (and path
               (utils/project-path? path)
               (not (contains? @builders path)))
      (when-let [builder (create-builder path)]
        (swap! builders assoc path builder)
        (.add pane (:view builder) path)))
    ; display the correct card
    (s/show-card! pane (if (contains? @builders path) path :default-card))
    ; modify pane based on the project
    (when-let [builder (get @builders path)]
      (doto builder
        (toggle-visible! path)
        (toggle-color! path)
        (toggle-enable! path)))))

(defn remove-builders!
  [path]
  (let [pane (s/select @ui/root [:#builder-pane])]
    (doseq [[builder-path {:keys [view close-fn! should-remove-fn]}] @builders]
      (when (or (utils/parent-path? path builder-path)
                (should-remove-fn))
        (swap! builders dissoc builder-path)
        (close-fn!)
        (editors/remove-watchers! builder-path)
        (.remove pane view)))))

; pane

(defn create-pane
  "Returns the pane with the builders."
  []
  (s/card-panel :id :builder-pane :items [["" :default-card]]))

; watchers

(add-watch ui/tree-selection
           :show-builder
           (fn [_ _ _ path]
             ; remove any builders that aren't valid anymore
             (remove-builders! nil)
             ; show the selected builder
             (show-builder! (ui/get-project-path path))))
