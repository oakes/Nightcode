(ns nightcode.builders
  (:require [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.utils :as utils]
            [seesaw.core :as s]))

(def builders (atom {}))

(defn get-builder
  [path]
  (when (contains? @builders path)
    (->> [:#build-console]
         (s/select (get @builders path))
         first)))

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
                          (s/request-focus! (.getView (.getViewport console))))
        build-action (fn [e]
                       (lein/build-project process thread in out path))
        test-action (fn [e]
                      (lein/test-project thread in out path))
        clean-action (fn [e]
                       (lein/clean-project thread in out path))
        stop-action (fn [e]
                      (lein/stop-process process)
                      (lein/stop-thread thread))
        is-clojure-project? (not (lein/is-java-project? path))
        btn-group (s/horizontal-panel
                    :items [(s/button :id :run-button
                                      :text (utils/get-string :run)
                                      :listen [:action run-action]
                                      :focusable? false)
                            (s/button :id :run-repl-button
                                      :text (utils/get-string :run_with_repl)
                                      :listen [:action run-repl-action]
                                      :focusable? false
                                      :visible? is-clojure-project?)
                            (s/button :id :build-button
                                      :text (utils/get-string :build)
                                      :listen [:action build-action]
                                      :focusable? false)
                            (s/button :id :test-button
                                      :text (utils/get-string :test)
                                      :listen [:action test-action]
                                      :focusable? false
                                      :visible? is-clojure-project?)
                            (s/button :id :clean-button
                                      :text (utils/get-string :clean)
                                      :listen [:action clean-action]
                                      :focusable? false)
                            (s/button :id :stop-button
                                      :text (utils/get-string :stop)
                                      :listen [:action stop-action]
                                      :focusable? false)
                            :fill-h])
        build-group (s/vertical-panel
                      :items [btn-group
                              (s/config! console :id :build-console)])]
    (shortcuts/create-mappings build-group
                               {:run-button run-action
                                :run-repl-button run-repl-action
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
    (when (and (utils/is-project-path? path)
               (not (contains? @builders path)))
      (when-let [view (create-builder path)]
        (swap! builders assoc path view)
        (.add pane view path)))
    ; display the correct card
    (s/show-card! pane (if (contains? @builders path) path :default-card))))
