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

; keep track of open builders

(def builders (atom {}))

(defn get-builder
  [path]
  (when (contains? @builders path)
    (->> [:#build-console]
         (s/select (get-in @builders [path :view]))
         first)))

; actions for builder buttons

(defn set-android-sdk
  [_]
  (when-let [dir (chooser/choose-file :dir (utils/read-pref :android-sdk)
                                      :selection-mode :dirs-only
                                      :remember-directory? false)]
    (utils/write-pref :android-sdk (.getCanonicalPath dir))))

(defn set-robovm
  [_]
  (when-let [dir (chooser/choose-file :dir (utils/read-pref :robovm)
                                      :selection-mode :dirs-only
                                      :remember-directory? false)]
    (utils/write-pref :robovm (.getCanonicalPath dir))))

(defn eval-in-repl
  [console path timestamp]
  (doseq [code (if-let [selected (editors/get-editor-selected-text)]
                 [selected]
                 (for [source (-> (lein/read-project-clj path)
                                  (lein/stale-clojure-sources timestamp))]
                   (str (slurp source) " nil")))]
    (->> (str "(do " (clojure.string/replace code "\n" " ") ")")
         (.enterLine console)))
  (s/request-focus! (-> console .getViewport .getView)))

(defn toggle-reload
  [target enable?]
  (-> (s/select target [:#reload-button])
      (s/config! :enabled? enable?)))

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
        last-reload (atom 0)
        ; create the main panel that will hold the console and buttons
        build-group (s/border-panel
                      :center (s/config! console :id :build-console))
        ; create the actions for each button
        run-action (fn [_]
                     (lein/run-project process in out path)
                     (toggle-reload build-group (lein/is-java-project? path)))
        run-repl-action (fn [_]
                          (lein/run-repl-project process in out path)
                          (s/request-focus! (-> console .getViewport .getView))
                          (toggle-reload build-group
                                         (not (lein/is-java-project? path)))
                          (reset! last-reload (System/currentTimeMillis)))
        reload-action (fn [_]
                        (if (lein/is-java-project? path)
                          (lein/run-hot-swap in out path)
                          (eval-in-repl console path @last-reload))
                        (reset! last-reload (System/currentTimeMillis)))
        build-action (fn [_]
                       (lein/build-project process in out path))
        test-action (fn [_]
                      (lein/test-project process in out path))
        clean-action (fn [_]
                       (lein/clean-project process in out path))
        stop-action (fn [_]
                      (lein/stop-process process))
        auto-action (fn [_]
                      (-> (s/select build-group [:#auto-button])
                          (s/config! :selected? (nil? @auto-process)))
                      (if (nil? @auto-process)
                        (lein/cljsbuild-project auto-process in out path)
                        (lein/stop-process auto-process)))
        ; create the buttons with their actions attached
        btn-group (ui/wrap-panel
                    :items [(ui/button :id :run-button
                                       :text (utils/get-string :run)
                                       :listen [:action run-action]
                                       :focusable? false)
                            (ui/button :id :run-repl-button
                                       :text (utils/get-string :run_with_repl)
                                       :listen [:action run-repl-action]
                                       :focusable? false)
                            (ui/button :id :reload-button
                                       :text (utils/get-string :reload)
                                       :listen [:action reload-action]
                                       :focusable? false
                                       :enabled? false)
                            (ui/button :id :build-button
                                       :text (utils/get-string :build)
                                       :listen [:action build-action]
                                       :focusable? false)
                            (ui/button :id :test-button
                                       :text (utils/get-string :test)
                                       :listen [:action test-action]
                                       :focusable? false)
                            (ui/button :id :clean-button
                                       :text (utils/get-string :clean)
                                       :listen [:action clean-action]
                                       :focusable? false)
                            (ui/button :id :stop-button
                                       :text (utils/get-string :stop)
                                       :listen [:action stop-action]
                                       :focusable? false)
                            (ui/button :id :sdk-button
                                       :text (utils/get-string :android_sdk)
                                       :listen [:action set-android-sdk]
                                       :focusable? false)
                            (ui/button :id :robovm-button
                                       :text (utils/get-string :robovm)
                                       :listen [:action set-robovm]
                                       :focusable? false)
                            (ui/toggle :id :auto-button
                                       :text (utils/get-string :auto)
                                       :listen [:action auto-action]
                                       :focusable? false)])]
    ; disable the reload button when the process ends
    (add-watch process
               :toggle-reload
               (fn [_ _ _ new-state]
                 (when-not new-state (toggle-reload build-group false))))
    ; add the buttons to the main panel and create shortcuts
    (doto build-group
      (s/config! :north btn-group)
      (shortcuts/create-mappings {:run-button run-action
                                  :run-repl-button run-repl-action
                                  :reload-button reload-action
                                  :build-button build-action
                                  :test-button test-action
                                  :clean-button clean-action
                                  :stop-button stop-action
                                  :sdk-button set-android-sdk
                                  :robovm-button set-robovm
                                  :auto-button auto-action})
      shortcuts/create-hints)
    ; return a map describing the builder
    {:view build-group
     :close-fn #(stop-action nil)
     :should-remove-fn #(not (utils/is-project-path? path))}))

(defn show-builder
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
    (when (contains? @builders path)
      (let [project-map (lein/read-project-clj path)
            is-android-project? (lein/is-android-project? path)
            is-ios-project? (lein/is-ios-project? path)
            is-java-project? (lein/is-java-project? path)
            is-clojurescript-project? (lein/is-clojurescript-project? path)
            buttons {:#run-repl-button (and (not is-ios-project?)
                                            (not is-java-project?))
                     :#reload-button (and (not is-ios-project?)
                                          (not (and is-java-project?
                                                    is-android-project?)))
                     :#test-button (not is-java-project?)
                     :#sdk-button is-android-project?
                     :#robovm-button is-ios-project?
                     :#auto-button is-clojurescript-project?}
            sdk (get-in project-map [:android :sdk-path])
            robovm (get-in project-map [:ios :robovm-path])]
        ; show/hide buttons
        (doseq [[id should-show?] buttons]
          (-> (s/select (get-in @builders [path :view]) [id])
              (s/config! :visible? should-show?)))
        ; make buttons red if they aren't set
        (doseq [[button set?]
                {:#sdk-button (and sdk (.exists (io/file sdk)))
                 :#robovm-button (and robovm (.exists (io/file robovm)))}]
          (-> (s/select (get-in @builders [path :view]) [button])
              (s/config! :background (when-not set? (color/color :red)))))))))

(defn remove-builders
  [path]
  (let [pane (s/select @ui/ui-root [:#builder-pane])]
    (doseq [[builder-path {:keys [view close-fn should-remove-fn]}] @builders]
      (when (or (utils/is-parent-path? path builder-path)
                (should-remove-fn))
        (swap! builders dissoc builder-path)
        (close-fn)
        (.remove pane view)))))

; watchers

(add-watch ui/tree-selection
           :show-builder
           (fn [_ _ _ path]
             ; remove any builders that aren't valid anymore
             (remove-builders nil)
             ; show the selected builder
             (show-builder (ui/get-project-path path))))
