(ns nightcode.core
  (:require [seesaw.core :as s]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.projects :as p]
            [nightcode.utils :as utils])
  (:import [bsh.util JConsole]
           [clojure.lang LineNumberingPushbackReader]
           [org.pushingpixels.substance.api SubstanceLookAndFeel]
           [org.pushingpixels.substance.api.skin GraphiteSkin])
  (:gen-class))

(defn get-project-pane
  []
  (let [project-tree (s/tree :id :project-tree
                             :focusable? true)]
    (doto project-tree
          (.setRootVisible false)
          (.setShowsRootHandles true)
          (.addTreeExpansionListener
            (reify javax.swing.event.TreeExpansionListener
              (treeCollapsed [this e] (p/remove-expansion e))
              (treeExpanded [this e] (p/add-expansion e))))
          (.addTreeSelectionListener
            (reify javax.swing.event.TreeSelectionListener
              (valueChanged [this e] (p/set-selection e)))))
    (-> (s/vertical-panel
          :items [(s/horizontal-panel
                    :items [(s/button :id :new-project-button
                                      :text "New Project"
                                      :listen [:action p/new-project])
                            (s/button :id :new-file-button
                                      :text "New File"
                                      :listen [:action p/new-file])
                            (s/button :id :rename-file-button
                                      :text "Rename File"
                                      :listen [:action p/rename-file]
                                      :visible? false)
                            (s/button :id :import-button
                                      :text "Import"
                                      :listen [:action p/import-project])
                            (s/button :id :remove-button
                                      :text "Remove"
                                      :listen [:action p/remove-item])
                            :fill-h])
                  (s/scrollable project-tree)])
        (shortcuts/create-mappings {:new-project-button p/new-project
                                    :new-file-button p/new-file
                                    :rename-file-button p/rename-file
                                    :import-button p/import-project
                                    :remove-button p/remove-item}))))

(defn get-repl-pane
  []
  (s/config! (JConsole.) :id :repl-console))

(defn get-editor-pane
  []
  (-> (s/card-panel :id :editor-pane
                    :items [["" :default-card]])
      (shortcuts/create-mappings {:save-button editors/save-file})))

(defn get-build-pane
  []
  (let [console (JConsole.)
        in (LineNumberingPushbackReader. (.getIn console))
        out (.getOut console)
        run-action (fn [e]
                     (lein/run-project in out (p/get-project-path)))
        run-repl-action (fn [e]
                          (lein/run-repl-project in out (p/get-project-path))
                          (s/request-focus! (.getView (.getViewport console))))
        build-action (fn [e]
                       (lein/build-project in out (p/get-project-path)))
        test-action (fn [e]
                      (lein/test-project in out (p/get-project-path)))
        clean-action (fn [e]
                       (lein/clean-project in out (p/get-project-path)))
        stop-action (fn [e]
                      (lein/stop-project))]
    (-> (s/vertical-panel
          :items [(s/horizontal-panel
                    :items [(s/button :id :run-button
                                      :text "Run"
                                      :listen [:action run-action])
                            (s/button :id :run-repl-button
                                      :text "Run with REPL"
                                      :listen [:action run-repl-action])
                            (s/button :id :build-button
                                      :text "Build"
                                      :listen [:action build-action])
                            (s/button :id :test-button
                                      :text "Test"
                                      :listen [:action test-action])
                            (s/button :id :clean-button
                                      :text "Clean"
                                      :listen [:action clean-action])
                            (s/button :id :stop-button
                                      :text "Stop"
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
  (s/left-right-split
    (s/top-bottom-split (get-project-pane)
                        (get-repl-pane)
                        :divider-location 0.5
                        :resize-weight 0.5)
    (s/top-bottom-split (get-editor-pane)
                        (get-build-pane)
                        :divider-location 0.8
                        :resize-weight 1)
    :divider-location 0.4))

(defn -main
  "Launches the main window."
  [& args]
  (s/native!)
  (SubstanceLookAndFeel/setSkin (GraphiteSkin.))
  (s/invoke-later
    ; show the frame
    (reset! utils/ui-root
            (-> (s/frame :title "Nightcode"
                         :content (get-window-content)
                         :width 1024
                         :height 768
                         :on-close :exit)
                shortcuts/create-hints
                s/show!))
    ; initialize the project pane
    (p/update-project-tree)
    ; initialize the repl pane
    (let [repl-console (s/select @utils/ui-root [:#repl-console])
          in (LineNumberingPushbackReader. (.getIn repl-console))
          out (.getOut repl-console)]
      (lein/repl in out))))
