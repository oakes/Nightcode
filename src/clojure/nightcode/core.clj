(ns nightcode.core
  (:require [seesaw.core :as s]
            [nightcode.lein :as lein]
            [nightcode.utils :as utils]
            [nightcode.projects :as p])
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

(defn get-repl-pane
  []
  (s/config! (JConsole.) :id :repl-console))

(defn get-editor-pane
  []
  (s/card-panel :id :editor-pane
                :items [["" :default-card]]))

(defn get-build-pane
  []
  (let [console (JConsole.)
        in (LineNumberingPushbackReader. (.getIn console))
        out (.getOut console)]
    (s/vertical-panel
      :items [(s/horizontal-panel
                :items [(s/button :id :run-button
                                  :text "Run"
                                  :listen [:action (fn [e]
                                                     (lein/run-project
                                                       in
                                                       out
                                                       (p/get-project-path)))])
                        (s/button :id :build-button
                                  :text "Build"
                                  :listen [:action (fn [e]
                                                     (lein/build-project
                                                       in
                                                       out
                                                       (p/get-project-path)))])
                        (s/button :id :test-button
                                  :text "Test"
                                  :listen [:action (fn [e]
                                                     (lein/test-project
                                                       in
                                                       out
                                                       (p/get-project-path)))])
                        (s/button :id :clean-button
                                  :text "Clean"
                                  :listen [:action (fn [e]
                                                     (lein/clean-project
                                                       in
                                                       out
                                                       (p/get-project-path)))])
                        (s/button :id :halt-button
                                  :text "Halt"
                                  :listen [:action (fn [e]
                                                     (lein/halt-project))])
                        :fill-h])
              (s/config! console :id :build-console)])))

(defn get-window-content []
  (s/left-right-split
    (s/top-bottom-split
      (get-project-pane)
      (get-repl-pane)
      :divider-location 0.5
      :resize-weight 0.5)
    (s/top-bottom-split
      (get-editor-pane)
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
    (reset! utils/ui-root
            (-> (s/frame :title "Nightcode"
                         :content (get-window-content)
                         :width 1024
                         :height 768
                         :on-close :exit)
                s/show!))
    (p/update-project-tree)
    (let [repl-console (s/select @utils/ui-root [:#repl-console])]
      (lein/run-repl (LineNumberingPushbackReader. (.getIn repl-console))
                     (.getOut repl-console)))))
