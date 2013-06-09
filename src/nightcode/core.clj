(ns nightcode.core
  (:use [seesaw.core :only [invoke-later
                            frame
                            select
                            native!
                            show!
                            request-focus!
                            horizontal-panel
                            vertical-panel
                            left-right-split
                            top-bottom-split
                            scrollable
                            button
                            text
                            tree
                            tabbed-panel]]
        [clojure.java.io :only [resource
                                input-stream]]
        [nightcode.projects :only [add-expansion
                                   remove-expansion
                                   set-selection
                                   update-project-tree
                                   new-project
                                   new-file
                                   import-project
                                   remove-project]])
  (:gen-class))

(defn get-project-pane
  []
  (let [project-tree (tree :id :project-tree
                           :focusable? true)]
    (doto project-tree
          (.setRootVisible false)
          (.setShowsRootHandles true)
          (.addTreeExpansionListener
            (proxy [javax.swing.event.TreeExpansionListener] []
              (treeCollapsed [e] (remove-expansion e))
              (treeExpanded [e] (add-expansion e))))
          (.addTreeSelectionListener
            (proxy [javax.swing.event.TreeSelectionListener] []
              (valueChanged [e] (set-selection e))))
          update-project-tree)
    (vertical-panel
      :items [(horizontal-panel
                :items [(button :text "New Project"
                                :listen [:action new-project])
                        (button :text "New File"
                                :listen [:action new-file])
                        (button :text "Import"
                                :listen [:action import-project])
                        (button :text "Remove"
                                :listen [:action remove-project])
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
  (let [text-area (org.fife.ui.rsyntaxtextarea.RSyntaxTextArea.)
        text-area-scroll (org.fife.ui.rtextarea.RTextScrollPane. text-area)]
    (-> (resource "dark.xml")
        (input-stream)
        (org.fife.ui.rsyntaxtextarea.Theme/load)
        (.apply text-area))
    (vertical-panel
      :items [(horizontal-panel
                :items [(button :text "Save")
                        (button :text "Move/Rename")
                        (button :text "Undo")
                        (button :text "Redo")
                        :fill-h])
              text-area-scroll])))

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
    (let [root (-> (frame :title "Nightcode"
                          :content (get-window-content)
                          :width 1024
                          :height 768
                          :on-close :exit)
                   show!)]
      (request-focus! (select root [:#project-tree])))))
