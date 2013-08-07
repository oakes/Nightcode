(ns nightcode.builders
  (:require [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.utils :as utils]
            [seesaw.chooser :as chooser]
            [seesaw.color :as color]
            [seesaw.core :as s]))

(def builders (atom {}))

(defn get-builder
  [path]
  (when (contains? @builders path)
    (->> [:#build-console]
         (s/select (get @builders path))
         first)))

(defn set-android-sdk
  [e]
  (when-let [dir (chooser/choose-file :dir (utils/read-pref :android-sdk)
                                      :selection-mode :dirs-only
                                      :remember-directory? false)]
    (utils/write-pref :android-sdk (.getCanonicalPath dir))))

(defn toggle-repl-buttons
  [target is-running?]
  (-> (s/select target [:#run-repl-button])
      (s/config! :enabled? (not is-running?)))
  (-> (s/select target [:#eval-repl-button])
      (s/config! :enabled? is-running?)))

(defn create-builder
  [path]
  (let [console (utils/create-console)
        process (atom nil)
        thread (atom nil)
        in (utils/get-console-input console)
        out (utils/get-console-output console)
        run-action (fn [e]
                     (lein/run-project process thread in out path))
        run-repl-action (fn [e]
                          (lein/run-repl-project process thread in out path)
                          (s/request-focus! (.getView (.getViewport console)))
                          (toggle-repl-buttons @utils/ui-root true))
        eval-repl-action (fn [e]
                           (let [code (editors/get-editor-content)]
                             (.insertCode console (str "(do " code ")")))
                           (s/request-focus! (.getView (.getViewport console))))
        build-action (fn [e]
                       (lein/build-project process thread in out path))
        test-action (fn [e]
                      (lein/test-project process thread in out path))
        clean-action (fn [e]
                       (lein/clean-project process thread in out path))
        stop-action (fn [e]
                      (lein/stop-process process)
                      (lein/stop-thread thread)
                      (toggle-repl-buttons @utils/ui-root false))
        btn-group (utils/wrap-panel
                    :items [(s/button :id :run-button
                                      :text (utils/get-string :run)
                                      :listen [:action run-action]
                                      :focusable? false)
                            (s/button :id :run-repl-button
                                      :text (utils/get-string :run_with_repl)
                                      :listen [:action run-repl-action]
                                      :focusable? false)
                            (s/button :id :eval-repl-button
                                      :text (utils/get-string :eval_in_repl)
                                      :listen [:action eval-repl-action]
                                      :focusable? false)
                            (s/button :id :build-button
                                      :text (utils/get-string :build)
                                      :listen [:action build-action]
                                      :focusable? false)
                            (s/button :id :test-button
                                      :text (utils/get-string :test)
                                      :listen [:action test-action]
                                      :focusable? false)
                            (s/button :id :clean-button
                                      :text (utils/get-string :clean)
                                      :listen [:action clean-action]
                                      :focusable? false)
                            (s/button :id :stop-button
                                      :text (utils/get-string :stop)
                                      :listen [:action stop-action]
                                      :focusable? false)
                            (s/button :id :sdk-button
                                      :text (utils/get-string :android_sdk)
                                      :listen [:action set-android-sdk]
                                      :focusable? false)])
        build-group (s/border-panel
                      :north btn-group
                      :center (s/config! console :id :build-console))]
    (toggle-repl-buttons build-group false)
    (shortcuts/create-mappings build-group
                               {:run-button run-action
                                :run-repl-button run-repl-action
                                :eval-repl-button eval-repl-action
                                :build-button build-action
                                :test-button test-action
                                :clean-button clean-action
                                :stop-button stop-action})
    (shortcuts/create-hints build-group)
    build-group))

(defn show-builder
  [path]
  (let [pane (s/select @utils/ui-root [:#builder-pane])]
    ; create new builder if necessary
    (when (and path
               (utils/is-project-path? path)
               (not (contains? @builders path)))
      (when-let [view (create-builder path)]
        (swap! builders assoc path view)
        (.add pane view path)))
    ; display the correct card
    (s/show-card! pane (if (contains? @builders path) path :default-card))
    ; modify pane based on the project
    (when (contains? @builders path)
      (let [project-map (lein/read-project-clj path)
            is-clojure-project? (not (lein/is-java-project? path))
            is-android-project? (lein/is-android-project? path)
            buttons {:#run-repl-button is-clojure-project?
                     :#eval-repl-button is-clojure-project?
                     :#test-button is-clojure-project?
                     :#sdk-button is-android-project?}
            sdk-path (get-in project-map [:android :sdk-path])]
        ; show/hide buttons
        (doseq [[id should-show?] buttons]
          (-> (s/select (get @builders path) [id])
              (s/config! :visible? should-show?)))
        ; make SDK button red if it isn't set
        (-> (s/select (get @builders path) [:#sdk-button])
            (s/config! :background (when-not sdk-path (color/color :red))))))))
