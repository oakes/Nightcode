(ns nightcode.core
  (:require [seesaw.core :as s]
            [nightcode.shortcuts :as shortcuts]
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
                             :focusable? true)
        btn-group (s/horizontal-panel
                    :items [(s/button :id :new-project-button
                                      :text (utils/get-string :new_project)
                                      :listen [:action p/new-project]
                                      :focusable? false)
                            (s/button :id :new-file-button
                                      :text (utils/get-string :new_file)
                                      :listen [:action p/new-file]
                                      :focusable? false)
                            (s/button :id :rename-file-button
                                      :text (utils/get-string :rename_file)
                                      :listen [:action p/rename-file]
                                      :focusable? false
                                      :visible? false)
                            (s/button :id :import-button
                                      :text (utils/get-string :import)
                                      :listen [:action p/import-project]
                                      :focusable? false)
                            (s/button :id :remove-button
                                      :text (utils/get-string :remove)
                                      :listen [:action p/remove-item]
                                      :focusable? false)
                            :fill-h])
        project-group (s/vertical-panel
                        :items [btn-group
                                (s/scrollable project-tree)])]
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
    (shortcuts/create-mappings project-group
                               {:new-project-button p/new-project
                                :new-file-button p/new-file
                                :rename-file-button p/rename-file
                                :import-button p/import-project
                                :remove-button p/remove-item})
    project-group))

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
         (shortcuts/create-mappings console))
    console))

(defn get-editor-pane
  "Returns the pane with the editors."
  []
  (s/card-panel :id :editor-pane
                :items [["" :default-card]]))

(defn get-builder-pane
  "Returns the pane with the builders."
  []
  (s/card-panel :id :builder-pane
                :items [["" :default-card]]))

(defn get-window-content []
  "Returns the entire window with all panes."
  (s/left-right-split
    (s/top-bottom-split (get-project-pane)
                        (get-repl-pane)
                        :divider-location 0.8
                        :resize-weight 0.5)
    (s/top-bottom-split (get-editor-pane)
                        (get-builder-pane)
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
