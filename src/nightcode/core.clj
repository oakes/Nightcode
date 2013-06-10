(ns nightcode.core
  (:use [seesaw.core :only [invoke-later
                            frame
                            select
                            native!
                            show!
                            horizontal-panel
                            vertical-panel
                            left-right-split
                            top-bottom-split
                            scrollable
                            button
                            text
                            label
                            tree
                            tabbed-panel
                            card-panel]]
        [nightcode.utils :only [ui-root]]
        [nightcode.projects :only [add-expansion
                                   remove-expansion
                                   set-selection
                                   update-project-tree
                                   new-project
                                   new-file
                                   rename-file
                                   import-project
                                   remove-project-or-file]])
  (:gen-class))

(defn get-project-pane
  []
  (let [project-tree (tree :id :project-tree
                           :focusable? true)]
    (doto project-tree
          (.setRootVisible false)
          (.setShowsRootHandles true)
          (.addTreeExpansionListener
            (reify javax.swing.event.TreeExpansionListener
              (treeCollapsed [this e] (remove-expansion e))
              (treeExpanded [this e] (add-expansion e))))
          (.addTreeSelectionListener
            (reify javax.swing.event.TreeSelectionListener
              (valueChanged [this e] (set-selection e)))))
    (vertical-panel
      :items [(horizontal-panel
                :items [(button :id :new-project-button
                                :text "New Project"
                                :listen [:action new-project])
                        (button :id :new-file-button
                                :text "New File"
                                :listen [:action new-file])
                        (button :id :rename-file-button
                                :text "Rename File"
                                :listen [:action rename-file]
                                :visible? false)
                        (button :id :import-button
                                :text "Import"
                                :listen [:action import-project])
                        (button :id :remove-button
                                :text "Remove"
                                :listen [:action remove-project-or-file])
                        :fill-h])
              (scrollable project-tree)])))

(defn get-tool-pane
  []
  (let [run-tab (vertical-panel
                  :items [(horizontal-panel
                            :items [(button :text "Run")
                                    (button :text "Build")
                                    (button :text "Test")
                                    (button :text "Halt")
                                    (button :text "Clean")
                                    :fill-h])])
        repl-tab (vertical-panel
                  :items [(horizontal-panel
                            :items [(button :text "Restart")
                                    (button :text "Clear")
                                    :fill-h])])
        docs-tab (vertical-panel
                  :items [(horizontal-panel
                            :items [])])]
    (tabbed-panel :placement :top
                  :overflow :scroll
                  :tabs [{:title "Run"
                          :content run-tab}
                         {:title "REPL"
                          :content repl-tab}
                         {:title "Docs"
                          :content docs-tab}])))

(defn get-editor-pane
  []
  (card-panel :id :editor-pane
              :items [["" :default-card]]))

(defn get-window-content []
  (left-right-split
    (top-bottom-split
      (get-project-pane)
      (get-tool-pane)
      :divider-location 0.5)
    (get-editor-pane)
    :divider-location 0.4))

(defn -main
  "Launches the main window."
  [& args]
  (native!)
  (org.pushingpixels.substance.api.SubstanceLookAndFeel/setSkin
    (org.pushingpixels.substance.api.skin.GraphiteSkin.))
  (invoke-later
    (reset! ui-root (-> (frame :title "Nightcode"
                          :content (get-window-content)
                          :width 1024
                          :height 768
                          :on-close :exit)
                    show!))
    (let [project-tree (select @ui-root [:#project-tree])]
      (update-project-tree project-tree))))
