(ns nightcode.builders
  (:require [clojure.java.io :as io]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
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
  [_]
  (when-let [dir (chooser/choose-file :dir (utils/read-pref :android-sdk)
                                      :selection-mode :dirs-only
                                      :remember-directory? false)]
    (utils/write-pref! :android-sdk (.getCanonicalPath dir))
    (show-builder! (ui/get-selected-path))))

(defn set-robovm!
  [_]
  (when-let [dir (chooser/choose-file :dir (utils/read-pref :robovm)
                                      :selection-mode :dirs-only
                                      :remember-directory? false)]
    (utils/write-pref! :robovm (.getCanonicalPath dir))
    (show-builder! (ui/get-selected-path))))

(defn eval-in-repl!
  [console path timestamp]
  (let [source-paths (-> (lein/read-project-clj path)
                         (lein/stale-clojure-sources timestamp))
        contents (for [source-path source-paths]
                   (slurp source-path))
        names (for [source-path source-paths]
                (.getName (io/file source-path)))]
    (->> (format "(do %s\n\"%s\")"
                 (clojure.string/join "\n" contents)
                 (clojure.string/join ", " names))
         read-string
         pr-str
         (.enterLine console)
         (binding [*read-eval* false])))
  (s/request-focus! (-> console .getViewport .getView)))

; button toggling functions

(defn toggle-visible!
  [{:keys [view]} path]
  (let [is-android-project? (lein/is-android-project? path)
        is-ios-project? (lein/is-ios-project? path)
        is-java-project? (lein/is-java-project? path)
        is-clojurescript-project? (lein/is-clojurescript-project? path)
        is-project-clj? (-> (ui/get-selected-path)
                            io/file
                            .getName
                            (= "project.clj"))
        buttons {:#run-repl-button (and (not is-ios-project?)
                                        (not is-java-project?))
                 :#reload-button (and (not is-ios-project?)
                                      (not (and is-java-project?
                                                is-android-project?)))
                 :#test-button (not is-java-project?)
                 :#sdk-button is-android-project?
                 :#robovm-button is-ios-project?
                 :#auto-button is-clojurescript-project?
                 :#check-versions-button is-project-clj?}]
    (doseq [[id should-show?] buttons]
      (ui/config! view id :visible? should-show?))))

(defn toggle-color!
  [{:keys [view]} path]
  (let [project-map (lein/read-project-clj path)
        sdk (get-in project-map [:android :sdk-path])
        robovm (get-in project-map [:ios :robovm-path])
        buttons {:#sdk-button (and sdk (.exists (io/file sdk)))
                 :#robovm-button (and robovm (.exists (io/file robovm)))}]
    (doseq [[id is-set?] buttons]
      (ui/config! view id :background (when-not is-set? (color/color :red))))))

(defn toggle-enable!
  [{:keys [view process last-reload]} path]
  (let [is-java-project? (lein/is-java-project? path)
        is-running? (not (nil? @process))
        buttons {:#run-button (not is-running?)
                 :#run-repl-button (not is-running?)
                 :#reload-button (not (nil? @last-reload))
                 :#build-button (not is-running?)
                 :#test-button (not is-running?)
                 :#clean-button (not is-running?)
                 :#stop-button is-running?
                 :#check-versions-button (not is-running?)}]
    (doseq [[id should-enable?] buttons]
      (ui/config! view id :enabled? should-enable?))))

; create and show/hide builders for each project

(defn create-builder
  [path]
  (let [; create new console object with a reader/writer
        console (ui/create-console)
        in (ui/get-console-input console)
        out (ui/get-console-output console)
        ; keep track of the processes and the last reload timestamp
        process (atom nil)
        auto-process (atom nil)
        last-reload (atom nil)
        ; create the main panel that will hold the console and buttons
        build-group (s/border-panel
                      :center (s/config! console :id :build-console))
        ; create the actions for each button
        run! (fn [_]
               (when (lein/is-java-project? path)
                 (reset! last-reload (System/currentTimeMillis)))
               (lein/run-project! process in out path))
        run-repl! (fn [_]
                    (when (not (lein/is-java-project? path))
                      (reset! last-reload (System/currentTimeMillis)))
                    (lein/run-repl-project! process in out path)
                    (s/request-focus! (-> console .getViewport .getView)))
        reload! (fn [_]
                  (if (lein/is-java-project? path)
                    (lein/run-hot-swap! in out path)
                    (eval-in-repl! console path @last-reload))
                  (reset! last-reload (System/currentTimeMillis)))
        build! (fn [_]
                 (lein/build-project! process in out path))
        test! (fn [_]
                (lein/test-project! process in out path))
        clean! (fn [_]
                 (lein/clean-project! process in out path))
        check-versions! (fn [_]
                          (lein/check-versions-in-project! process in out path))
        stop! (fn [_]
                (lein/stop-process! process))
        auto-build! (fn [_]
                      (ui/config! build-group :#auto-button
                                  :selected? (nil? @auto-process))
                      (if (nil? @auto-process)
                        (lein/cljsbuild-project! auto-process in out path)
                        (lein/stop-process! auto-process)))
        ; create the buttons with their actions attached
        btn-group (ui/wrap-panel
                    :items [(ui/button :id :run-button
                                       :text (utils/get-string :run)
                                       :listen [:action run!]
                                       :focusable? false)
                            (ui/button :id :run-repl-button
                                       :text (utils/get-string :run_with_repl)
                                       :listen [:action run-repl!]
                                       :focusable? false)
                            (ui/button :id :reload-button
                                       :text (utils/get-string :reload)
                                       :listen [:action reload!]
                                       :focusable? false)
                            (ui/button :id :build-button
                                       :text (utils/get-string :build)
                                       :listen [:action build!]
                                       :focusable? false)
                            (ui/button :id :test-button
                                       :text (utils/get-string :test)
                                       :listen [:action test!]
                                       :focusable? false)
                            (ui/button :id :clean-button
                                       :text (utils/get-string :clean)
                                       :listen [:action clean!]
                                       :focusable? false)
                            (ui/button :id :check-versions-button
                                       :text (utils/get-string :check_versions)
                                       :listen [:action check-versions!]
                                       :focusable? false)
                            (ui/button :id :stop-button
                                       :text (utils/get-string :stop)
                                       :listen [:action stop!]
                                       :focusable? false)
                            (ui/button :id :sdk-button
                                       :text (utils/get-string :android_sdk)
                                       :listen [:action set-android-sdk!]
                                       :focusable? false)
                            (ui/button :id :robovm-button
                                       :text (utils/get-string :robovm)
                                       :listen [:action set-robovm!]
                                       :focusable? false)
                            (ui/toggle :id :auto-button
                                       :text (utils/get-string :auto_build)
                                       :listen [:action auto-build!]
                                       :focusable? false)])]
    ; refresh the builder when the process state changes
    (add-watch process
               :refresh-builder
               (fn [_ _ _ new-state]
                 (when (nil? new-state) (reset! last-reload nil))
                 (show-builder! path)))
    ; add the buttons to the main panel and create shortcuts
    (doto build-group
      (s/config! :north btn-group)
      (shortcuts/create-mappings! {:run-button run!
                                   :run-repl-button run-repl!
                                   :reload-button reload!
                                   :build-button build!
                                   :test-button test!
                                   :clean-button clean!
                                   :check-versions-button check-versions!
                                   :stop-button stop!
                                   :sdk-button set-android-sdk!
                                   :robovm-button set-robovm!
                                   :auto-button auto-build!})
      shortcuts/create-hints!)
    ; return a map describing the builder
    {:view build-group
     :close-fn! #(stop! nil)
     :should-remove-fn #(not (utils/is-project-path? path))
     :process process
     :last-reload last-reload}))

(defn show-builder!
  [path]
  (let [pane (s/select @ui/ui-root [:#builder-pane])]
    ; create new builder if necessary
    (when (and path
               (utils/is-project-path? path)
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
  (let [pane (s/select @ui/ui-root [:#builder-pane])]
    (doseq [[builder-path {:keys [view close-fn! should-remove-fn]}] @builders]
      (when (or (utils/is-parent-path? path builder-path)
                (should-remove-fn))
        (swap! builders dissoc builder-path)
        (close-fn!)
        (.remove pane view)))))

; watchers

(add-watch ui/tree-selection
           :show-builder
           (fn [_ _ _ path]
             ; remove any builders that aren't valid anymore
             (remove-builders! nil)
             ; show the selected builder
             (show-builder! (ui/get-project-path path))))
