(ns nightcode.core
  (:require [seesaw.core :as s]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.projects :as p]
            [nightcode.utils :as utils])
  (:import [java.awt.event WindowAdapter]
           [javax.swing.event TreeExpansionListener TreeSelectionListener]
           [org.pushingpixels.substance.api SubstanceLookAndFeel]
           [org.pushingpixels.substance.api.skin GraphiteSkin])
  (:gen-class))

(defn get-project-pane
  "Returns the pane with the project tree."
  []
  (let [project-tree (s/tree :id :project-tree
                             :focusable? true)]
    (doto project-tree
          (.setRootVisible false)
          (.setShowsRootHandles true)
          (.addTreeExpansionListener
            (reify TreeExpansionListener
              (treeCollapsed [this e] (p/remove-expansion e))
              (treeExpanded [this e] (p/add-expansion e))))
          (.addTreeSelectionListener
            (reify TreeSelectionListener
              (valueChanged [this e] (p/set-selection e)))))
    (-> (s/vertical-panel
          :items [(s/horizontal-panel
                    :items [(s/button :id :new-project-button
                                      :text (utils/get-string :new_project)
                                      :listen [:action p/new-project])
                            (s/button :id :new-file-button
                                      :text (utils/get-string :new_file)
                                      :listen [:action p/new-file])
                            (s/button :id :rename-file-button
                                      :text (utils/get-string :rename_file)
                                      :listen [:action p/rename-file]
                                      :visible? false)
                            (s/button :id :import-button
                                      :text (utils/get-string :import)
                                      :listen [:action p/import-project])
                            (s/button :id :remove-button
                                      :text (utils/get-string :remove)
                                      :listen [:action p/remove-item])
                            :fill-h])
                  (s/scrollable project-tree)])
        (shortcuts/create-mappings {:new-project-button p/new-project
                                    :new-file-button p/new-file
                                    :rename-file-button p/rename-file
                                    :import-button p/import-project
                                    :remove-button p/remove-item}))))

(defn get-repl-pane
  "Returns the pane with the REPL."
  []
  (let [console (s/config! (utils/create-console) :id :repl-console)
        thread (atom nil)
        out (utils/get-console-output console)]
    (lein/run-repl thread (utils/get-console-input console) out)
    (->> {:repl-console
          (fn [e]
            (s/request-focus! (.getView (.getViewport console)))
            (lein/run-repl thread (utils/get-console-input console) out))}
         (shortcuts/create-mappings console))))

(defn get-editor-pane
  "Returns the pane with the editors."
  []
  (-> (s/card-panel :id :editor-pane
                    :items [["" :default-card]])
      (shortcuts/create-mappings {:save-button editors/save-file
                                  :undo-button editors/undo-file
                                  :redo-button editors/redo-file
                                  :find-field editors/focus-on-find})))

(defn get-build-pane
  "Returns the pane with the build actions."
  []
  (let [console (utils/create-console)
        process (atom nil)
        thread (atom nil)
        in (utils/get-console-input console)
        out (utils/get-console-output console)
        run-action (fn [e]
                     (lein/run-project
                       process thread in out (p/get-project-path)))
        run-repl-action (fn [e]
                          (lein/run-repl-project
                            process thread in out (p/get-project-path))
                          (s/request-focus! (.getView (.getViewport console))))
        build-action (fn [e]
                       (lein/build-project
                         process thread in out (p/get-project-path)))
        test-action (fn [e]
                      (lein/test-project thread in out (p/get-project-path)))
        clean-action (fn [e]
                       (lein/clean-project thread in out (p/get-project-path)))
        stop-action (fn [e]
                      (lein/stop-process process)
                      (lein/stop-thread thread))]
    (-> (s/vertical-panel
          :items [(s/horizontal-panel
                    :items [(s/button :id :run-button
                                      :text (utils/get-string :run)
                                      :listen [:action run-action])
                            (s/button :id :run-repl-button
                                      :text (utils/get-string :run_with_repl)
                                      :listen [:action run-repl-action])
                            (s/button :id :build-button
                                      :text (utils/get-string :build)
                                      :listen [:action build-action])
                            (s/button :id :test-button
                                      :text (utils/get-string :test)
                                      :listen [:action test-action])
                            (s/button :id :clean-button
                                      :text (utils/get-string :clean)
                                      :listen [:action clean-action])
                            (s/button :id :stop-button
                                      :text (utils/get-string :stop)
                                      :listen [:action stop-action])
                            :fill-h])
                  (s/config! console :id :build-console)])
        (shortcuts/create-mappings {:run-button run-action
                                    :run-repl-button run-repl-action
                                    :build-button build-action
                                    :test-button test-action
                                    :clean-button clean-action
                                    :stop-button stop-action}))))

(defn get-window-content []
  "Returns the entire window with all panes."
  (s/left-right-split
    (s/top-bottom-split (get-project-pane)
                        (get-repl-pane)
                        :divider-location 0.8
                        :resize-weight 0.5)
    (s/top-bottom-split (get-editor-pane)
                        (get-build-pane)
                        :divider-location 0.8
                        :resize-weight 0.5)
    :divider-location 0.4))

(defn -main
  "Launches the main window."
  [& args]
  (s/native!)
  (SubstanceLookAndFeel/setSkin (GraphiteSkin.))
  (s/invoke-later
    ; show the frame
    (reset! utils/ui-root
            (-> (s/frame :title (utils/get-string :app_name)
                         :content (get-window-content)
                         :width 1024
                         :height 768
                         :on-close :exit)
                shortcuts/create-hints
                (doto (.addWindowListener
                        (proxy [WindowAdapter] []
                          (windowActivated [e]
                            (p/update-project-tree)))))
                s/show!))
    ; initialize the project pane
    (p/update-project-tree)))
