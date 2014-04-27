(ns nightcode.projects
  (:require [clojure.java.io :as io]
            [nightcode.builders :as builders]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.sandbox :as sandbox]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [javax.swing.event TreeExpansionListener TreeSelectionListener]
           [javax.swing.tree TreeSelectionModel]))

; manipulate expansions and selection

(defn add-expansion!
  [e]
  (swap! ui/tree-expansions conj (-> e .getPath utils/tree-path-to-str))
  (utils/write-pref! :expansion-set @ui/tree-expansions))

(defn remove-expansion!
  [e]
  (swap! ui/tree-expansions disj (-> e .getPath utils/tree-path-to-str))
  (utils/write-pref! :expansion-set @ui/tree-expansions))

(defn set-selection!
  [e]
  (when-let [path (-> e .getPath utils/tree-path-to-str)]
    (when (not= path @ui/tree-selection)
      (reset! ui/tree-selection path)
      (utils/write-pref! :selection @ui/tree-selection))))

(defn move-project-tree-selection!
  [diff]
  (let [project-tree (ui/get-project-tree)
        new-row (-> project-tree
                    .getSelectionRows
                    first
                    (or 0)
                    (+ diff))]
    (when (and (>= new-row 0) (< new-row (.getRowCount project-tree)))
      (.setSelectionRow project-tree new-row)))
  true)

(defn toggle-project-tree-selection!
  []
  (let [project-tree (ui/get-project-tree)]
    (when-let [path (.getSelectionPath project-tree)]
      (->> (not (.isExpanded project-tree path))
           (.setExpandedState project-tree path))))
  true)

; manipulate project tree

(defn add-to-project-tree!
  [path]
  (->> (conj (utils/read-pref :project-set) path)
       set
       (utils/write-pref! :project-set))
  (sandbox/add-to-permission-map! path))

(defn remove-from-project-tree!
  [path]
  (let [project? (contains? @ui/tree-projects path)]
    (when (dialogs/show-remove-dialog! project?)
      (editors/remove-editors! path)
      (if project?
        (do
          (->> (utils/read-pref :project-set)
               (remove #(= % path))
               set
               (utils/write-pref! :project-set))
          (sandbox/remove-from-permission-map! path)
          (builders/remove-builders! path))
        (utils/delete-file-recursively! @ui/tree-projects path))
      true)))

(defn enter-relative-file-path!
  [default-file-name]
  (let [selected-path @ui/tree-selection
        project-path (ui/get-project-root-path)
        default-path (str (utils/get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (io/file selected-path))))]
    (dialogs/show-file-path-dialog! default-path)))

; actions for project tree buttons

(defn new-project!
  [console]
  (when-let [dir (dialogs/show-save-dialog!)]
    (when-let [[project-type project-name package-name project-dir]
               (dialogs/show-project-type-dialog! dir)]
      (lein/new-project! (ui/get-io console)
                         (.getParent dir)
                         project-type
                         project-name
                         package-name)
      (when (.exists (io/file project-dir))
        (add-to-project-tree! project-dir)
        (ui/update-project-tree! project-dir)))))

(defn rename-file!
  [e]
  (when-let [leaf-path (enter-relative-file-path! nil)]
    (let [project-path (ui/get-project-root-path)
          new-file (io/file project-path leaf-path)
          new-path (.getCanonicalPath new-file)
          selected-path @ui/tree-selection]
      (when (not= new-path selected-path)
        (editors/remove-editors! selected-path)
        (io!
          (.mkdirs (.getParentFile new-file))
          (.renameTo (io/file selected-path) new-file))
        (utils/delete-file-recursively! @ui/tree-projects selected-path)
        (ui/update-project-tree! new-path)))))

(defn import-project!
  [e]
  (when-let [dir (dialogs/show-open-dialog!)]
    ; offer to create project.clj if necessary
    (when (and (.exists (io/file dir "src"))
               (not (.exists (io/file dir "project.clj")))
               (dialogs/show-project-clj-dialog!))
      (->> {:app-name (.getName dir)
            :namespace "put.your.main.class.here"
            :target-sdk "15"}
           (lein/create-file-from-template! dir
                                            "project.clj"
                                            (if (lein/android-project? dir)
                                              "android-java"
                                              "console-java"))))
    ; show project root in the tree
    (let [dir-path (.getCanonicalPath dir)]
      (add-to-project-tree! dir-path)
      (ui/update-project-tree! dir-path))))

(defn remove-item!
  [e]
  (when (remove-from-project-tree! @ui/tree-selection)
    (ui/update-project-tree! (ui/get-project-root-path))))

; pane

(def ^:dynamic *widgets* [:new-project :import :rename :remove :fill-h])

(defn create-actions
  [console]
  {:new-project (fn [& _]
                  (try (new-project! console)
                    (catch Exception _ (.enterLine console ""))))
   :rename rename-file!
   :import import-project!
   :remove remove-item!})

(defn create-widgets
  [actions]
  {:new-project (ui/button :id :new-project
                           :text (utils/get-string :new-project)
                           :listen [:action (:new-project actions)]
                           :focusable? false)
   :rename (ui/button :id :rename
                      :text (utils/get-string :rename)
                      :listen [:action (:rename actions)]
                      :focusable? false)
   :import (ui/button :id :import
                      :text (utils/get-string :import)
                      :listen [:action (:import actions)]
                      :focusable? false)
   :remove (ui/button :id :remove
                      :text (utils/get-string :remove)
                      :listen [:action (:remove actions)]
                      :focusable? false)})

(defn create-pane
  "Returns the pane with the project tree."
  [console]
  (let [; create the project tree and the pane that will hold it
        project-tree (s/tree :id :project-tree :focusable? true)
        project-pane (s/border-panel
                       :id :project-pane
                       :center (s/scrollable project-tree))
        ; create the actions and widgets
        actions (create-actions console)
        widgets (create-widgets actions)
        ; create the bar that holds the widgets
        widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
    ; add the widget bar if necessary
    (when (> (count *widgets*) 0)
      (doto project-pane
        (s/config! :north widget-bar)
        shortcuts/create-hints!
        (shortcuts/create-mappings! actions)))
    ; set properties of the project tree
    (doto project-tree
      (.setRootVisible false)
      (.setShowsRootHandles true)
      (.addTreeExpansionListener
        (reify TreeExpansionListener
          (treeCollapsed [this e] (remove-expansion! e))
          (treeExpanded [this e] (add-expansion! e))))
      (.addTreeSelectionListener
        (reify TreeSelectionListener
          (valueChanged [this e] (set-selection! e))))
      (-> .getSelectionModel
          (.setSelectionMode TreeSelectionModel/SINGLE_TREE_SELECTION)))
    ; return the project pane
    project-pane))

; watchers

(add-watch ui/tree-selection
           :update-project-buttons
           (fn [_ _ _ path]
             (s/config! (s/select @ui/root [:#remove])
                        :enabled? (and (not (nil? path))
                                       (or (contains? @ui/tree-projects path)
                                           (.isFile (io/file path)))))
             (s/config! (s/select @ui/root [:#rename])
                        :enabled? (and (not (nil? path))
                                       (.isFile (io/file path))))))
