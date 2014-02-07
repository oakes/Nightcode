(ns nightcode.core
  (:require [seesaw.core :as s]
            [nightcode.cli-args :as cli-args]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.projects :as p]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils])
  (:import [java.awt.event WindowAdapter]
           [javax.swing.event TreeExpansionListener TreeSelectionListener]
           [javax.swing.tree TreeSelectionModel]
           [org.pushingpixels.substance.api SubstanceLookAndFeel]
           [org.pushingpixels.substance.api.skin GraphiteSkin])
  (:gen-class))

(defn create-project-pane
  "Returns the pane with the project tree."
  [console console-io]
  (let [project-tree (s/tree :id :project-tree :focusable? true)
        create-new-project! (fn [_]
                              (try (p/new-project! @console-io)
                                (catch Exception e (.enterLine console ""))))
        btn-group (s/horizontal-panel
                    :items [(ui/button :id :new-project-button
                                       :text (utils/get-string :new_project)
                                       :listen [:action create-new-project!]
                                       :focusable? false)
                            (ui/button :id :new-file-button
                                       :text (utils/get-string :new_file)
                                       :listen [:action p/new-file!]
                                       :focusable? false)
                            (ui/button :id :rename-file-button
                                       :text (utils/get-string :rename_file)
                                       :listen [:action p/rename-file!]
                                       :focusable? false
                                       :visible? false)
                            (ui/button :id :import-button
                                       :text (utils/get-string :import)
                                       :listen [:action p/import-project!]
                                       :focusable? false)
                            (ui/button :id :remove-button
                                       :text (utils/get-string :remove)
                                       :listen [:action p/remove-item!]
                                       :focusable? false)
                            :fill-h])
        project-pane (s/vertical-panel
                       :id :project-pane
                       :items [btn-group
                               (s/scrollable project-tree)])]
    (doto project-tree
      (.setRootVisible false)
      (.setShowsRootHandles true)
      (.addTreeExpansionListener
        (reify TreeExpansionListener
          (treeCollapsed [this e] (p/remove-expansion! e))
          (treeExpanded [this e] (p/add-expansion! e))))
      (.addTreeSelectionListener
        (reify TreeSelectionListener
          (valueChanged [this e] (p/set-selection! e))))
      (-> .getSelectionModel
          (.setSelectionMode TreeSelectionModel/SINGLE_TREE_SELECTION)))
    (shortcuts/create-mappings! project-pane
                                {:new-project-button create-new-project!
                                 :new-file-button p/new-file!
                                 :rename-file-button p/rename-file!
                                 :import-button p/import-project!
                                 :remove-button p/remove-item!})
    project-pane))

(defn create-repl-pane
  "Returns the pane with the REPL."
  [process console console-io]
  (let [run! (fn [& _]
               (s/request-focus! (-> console .getViewport .getView))
               (reset! console-io (ui/get-io! console))
               (lein/run-repl! process @console-io))
        console-map {:view console
                     :toggle-paredit-fn! (editors/init-paredit!
                                           (.getTextArea console) false true)}]
    ; set the font size and paredit
    (add-watch editors/font-size
               :set-repl-font-size
               (fn [_ _ _ x]
                 (editors/set-font-sizes! x console-map)))
    (add-watch editors/paredit-enabled?
               :set-repl-paredit
               (fn [_ _ _ enable?]
                 (editors/set-paredit! enable? console-map)))
    ; start the repl
    (run!)
    ; create a shortcut to restart the repl
    (doto (s/config! console :id :repl-console)
      (shortcuts/create-mappings! {:repl-console run!}))))

(defn create-editor-pane
  "Returns the pane with the editors."
  []
  (s/card-panel :id :editor-pane :items [["" :default-card]]))

(defn create-builder-pane
  "Returns the pane with the builders."
  []
  (s/card-panel :id :builder-pane :items [["" :default-card]]))

(defn create-window-content
  "Returns the entire window with all panes."
  []
  (let [process (atom nil)
        console (editors/create-console "clj")
        console-io (atom nil)
        one-touch! #(doto % (.setOneTouchExpandable true))]
    (one-touch!
      (s/left-right-split
        (one-touch!
          (s/top-bottom-split (create-project-pane console console-io)
                              (create-repl-pane process console console-io)
                              :divider-location 0.8
                              :resize-weight 0.5))
        (one-touch!
          (s/top-bottom-split (create-editor-pane)
                              (create-builder-pane)
                              :divider-location 0.8
                              :resize-weight 0.5))
        :divider-location 0.35
        :resize-weight 0))))

(defn confirm-exit-app!
  "Displays a dialog confirming whether the program should shut down."
  []
  (let [unsaved-paths (->> (keys @editors/editors)
                           (filter editors/is-unsaved?)
                           doall)]
    (if (dialogs/show-shut-down-dialog! unsaved-paths)
      (System/exit 0)
      true)))

(defn create-window
  "Creates the main window."
  []
  (doto (s/frame :title (str (utils/get-string :app_name)
                             " "
                             (utils/get-version))
                 :content (create-window-content)
                 :width 1200
                 :height 768
                 :on-close :nothing)
    ; create the shortcut hints for the main buttons
    shortcuts/create-hints!
    ; listen for keys while modifier is down
    (shortcuts/listen-for-shortcuts!
      (fn [key-code]
        (case key-code
          ; enter
          10 (p/toggle-project-tree-selection!)
          ; page up
          33 (p/move-tab-selection! -1)
          ; page down
          34 (p/move-tab-selection! 1)
          ; up
          38 (p/move-project-tree-selection! -1)
          ; down
          40 (p/move-project-tree-selection! 1)
          ; Q
          81 (confirm-exit-app!)
          ; W
          87 (editors/close-selected-editor!)
          ; else
          false)))
    ; when the window state changes
    (.addWindowListener (proxy [WindowAdapter] []
                          (windowActivated [e]
                            (ui/update-project-tree!))
                          (windowClosing [e]
                            (confirm-exit-app!))))))

(defn -main
  "Launches the main window."
  [& args]
  (s/native!)
  (let [{:keys [shade skin-object theme-resource]} (cli-args/parse-args args)]
    (when theme-resource (reset! editors/theme-resource theme-resource))
    (SubstanceLookAndFeel/setSkin (or skin-object (GraphiteSkin.))))
  (s/invoke-later
    ; create and show the frame
    (s/show! (reset! ui/ui-root (create-window)))
    ; initialize the project pane
    (ui/update-project-tree!)))
