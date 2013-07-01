(ns nightcode.core
  (:require [seesaw.core :as s]
            [nightcode.utils :as utils]
            [nightcode.projects :as p])
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
    (s/vertical-panel
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
                                  :listen [:action p/remove-project-or-file])
                        :fill-h])
              (s/scrollable project-tree)])))

(defn get-tool-pane
  []
  (let [run-tab (s/vertical-panel
                  :items [(s/horizontal-panel
                            :items [(s/button :text "Run")
                                    (s/button :text "Build")
                                    (s/button :text "Test")
                                    (s/button :text "Halt")
                                    (s/button :text "Clean")
                                    :fill-h])])
        repl-tab (s/vertical-panel
                  :items [(s/horizontal-panel
                            :items [(s/button :text "Restart")
                                    (s/button :text "Clear")
                                    :fill-h])])
        docs-tab (s/vertical-panel
                  :items [(s/horizontal-panel
                            :items [])])]
    (s/tabbed-panel :placement :top
                    :overflow :scroll
                    :tabs [{:title "Run"
                            :content run-tab}
                           {:title "REPL"
                            :content repl-tab}
                           {:title "Docs"
                            :content docs-tab}])))

(defn get-editor-pane
  []
  (s/card-panel :id :editor-pane
                :items [["" :default-card]]))

(defn get-window-content []
  (s/left-right-split
    (s/top-bottom-split
      (get-project-pane)
      (get-tool-pane)
      :divider-location 0.5)
    (get-editor-pane)
    :divider-location 0.4))

(defn -main
  "Launches the main window."
  [& args]
  (s/native!)
  (org.pushingpixels.substance.api.SubstanceLookAndFeel/setSkin
    (org.pushingpixels.substance.api.skin.GraphiteSkin.))
  (s/invoke-later
    (reset! utils/ui-root
            (-> (s/frame :title "Nightcode"
                         :content (get-window-content)
                         :width 1024
                         :height 768
                         :on-close :exit)
              s/show!))
    (p/update-project-tree)))
