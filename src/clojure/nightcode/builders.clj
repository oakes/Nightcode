(ns nightcode.builders
  (:require [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
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

(defn eval-in-repl
  [console]
  (let [code (or (editors/get-editor-selected-text)
                 (editors/get-editor-text))]
    (.enterLine console (str "(do " code ")")))
  (s/request-focus! (.getView (.getViewport console))))

(defn create-builder
  [path]
  (let [console (ui/create-console)
        process (atom nil)
        in (ui/get-console-input console)
        out (ui/get-console-output console)
        build-group (s/border-panel
                      :center (s/config! console :id :build-console))
        run-action (fn [e]
                     (lein/run-project process in out path))
        run-repl-action (fn [e]
                          (lein/run-repl-project process in out path)
                          (s/request-focus! (.getView (.getViewport console))))
        reload-action (fn [e]
                        (if (lein/is-java-project? path)
                          (lein/run-hot-swap in out path)
                          (eval-in-repl console)))
        build-action (fn [e]
                       (lein/build-project process in out path))
        test-action (fn [e]
                      (lein/test-project process in out path))
        clean-action (fn [e]
                       (lein/clean-project process in out path))
        stop-action (fn [e]
                      (lein/stop-process process))
        btn-group (ui/wrap-panel
                    :items [(s/button :id :run-button
                                      :text (utils/get-string :run)
                                      :listen [:action run-action]
                                      :focusable? false)
                            (s/button :id :run-repl-button
                                      :text (utils/get-string :run_with_repl)
                                      :listen [:action run-repl-action]
                                      :focusable? false)
                            (s/button :id :reload-button
                                      :text (utils/get-string :reload)
                                      :listen [:action reload-action]
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
                                      :focusable? false)])]
    (s/config! build-group :north btn-group)
    (shortcuts/create-mappings build-group
                               {:run-button run-action
                                :run-repl-button run-repl-action
                                :reload-button reload-action
                                :build-button build-action
                                :test-button test-action
                                :clean-button clean-action
                                :stop-button stop-action
                                :sdk-button set-android-sdk})
    (shortcuts/create-hints build-group)
    build-group))

(defn show-builder
  [path]
  (let [pane (s/select @ui/ui-root [:#builder-pane])]
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
      (let [project-map (lein/add-sdk-path (lein/read-project-clj path))
            is-clojure-project? (not (lein/is-java-project? path))
            is-android-project? (lein/is-android-project? path)
            buttons {:#run-repl-button is-clojure-project?
                     :#reload-button (or is-clojure-project?
                                         (not is-android-project?))
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

(defn remove-builders
  [path]
  (let [pane (s/select @ui/ui-root [:#builder-pane])]
    (doseq [[builder-path builder] @builders]
      (when (.startsWith builder-path path)
        (swap! builders dissoc builder-path)
        (.remove pane builder)))))
