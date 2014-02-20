(ns nightcode.projects
  (:require [clojure.java.io :as io]
            [nightcode.builders :as builders]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.chooser :as chooser]
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
  (let [project-set (utils/read-pref :project-set)]
    (utils/write-pref! :project-set (set (conj project-set path)))))

(defn remove-from-project-tree!
  [path]
  (let [is-project? (contains? @ui/tree-projects path)]
    (when (dialogs/show-remove-dialog! is-project?)
      (editors/remove-editors! path)
      (if is-project?
        (do
          (utils/write-pref! :project-set
                             (->> (utils/read-pref :project-set)
                                  (remove #(= % path))
                                  set))
          (builders/remove-builders! path))
        (utils/delete-file-recursively! @ui/tree-projects path))
      true)))

(defn enter-file-path!
  [default-file-name]
  (let [selected-path @ui/tree-selection
        project-path (ui/get-project-root-path)
        default-path (str (utils/get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (io/file selected-path))))]
    (dialogs/show-file-path-dialog! default-path)))

; actions for project tree buttons

(defn new-project!
  [console-io]
  (when-let [dir (chooser/choose-file :type :save)]
    (when-let [[project-type project-name package-name project-dir]
               (dialogs/show-project-type-dialog! dir)]
      (lein/new-project! console-io
                         (.getParent dir)
                         project-type
                         project-name
                         package-name)
      (when (.exists (io/file project-dir))
        (add-to-project-tree! project-dir)
        (ui/update-project-tree! project-dir)))))

(defn new-file!
  [e]
  (let [default-file-name (if (-> @ui/tree-selection
                                  ui/get-project-path
                                  lein/is-java-project?)
                            "Example.java" "example.clj")]
    (when-let [leaf-path (enter-file-path! default-file-name)]
      (let [new-file (io/file (ui/get-project-root-path) leaf-path)]
        (if (.exists new-file)
          (s/alert (utils/get-string :file_exists))
          (do
            (io!
              (.mkdirs (.getParentFile new-file))
              (.createNewFile new-file))
            (ui/update-project-tree! (.getCanonicalPath new-file))))))))

(defn rename-file!
  [e]
  (when-let [leaf-path (enter-file-path! nil)]
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
  (when-let [dir (chooser/choose-file :type :open :selection-mode :dirs-only)]
    ; offer to create project.clj if necessary
    (when (and (.exists (io/file dir "src"))
               (not (.exists (io/file dir "project.clj")))
               (dialogs/show-project-clj-dialog!))
      (->> {:app-name (.getName dir)
            :namespace "put.your.main.class.here"
            :target-sdk "15"}
           (lein/create-file-from-template! dir
                                            "project.clj"
                                            (if (lein/is-android-project? dir)
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

(def ^:dynamic *project-widgets* [:new-project :new-file :rename-file
                                  :import :remove :fill-h])

(defn create-action
  [k console console-io]
  (case k
    :new-project (fn [& _]
                   (try (new-project! @console-io)
                     (catch Exception _ (.enterLine console ""))))
    :new-file new-file!
    :rename-file rename-file!
    :import import-project!
    :remove remove-item!
    nil))

(defn create-widget
  [k action-fn!]
  (case k
    :new-project (ui/button :id k
                            :text (utils/get-string :new_project)
                            :listen [:action action-fn!]
                            :focusable? false)
    :new-file (ui/button :id k
                         :text (utils/get-string :new_file)
                         :listen [:action action-fn!]
                         :focusable? false)
    :rename-file (ui/button :id k
                            :text (utils/get-string :rename_file)
                            :listen [:action action-fn!]
                            :focusable? false
                            :visible? false)
    :import (ui/button :id k
                       :text (utils/get-string :import)
                       :listen [:action action-fn!]
                       :focusable? false)
    :remove (ui/button :id k
                       :text (utils/get-string :remove)
                       :listen [:action action-fn!]
                       :focusable? false)
    (s/make-widget k)))

(defn create-pane
  "Returns the pane with the project tree."
  [console console-io]
  (let [project-tree (s/tree :id :project-tree :focusable? true)
        btn-group (s/horizontal-panel
                    :items (map (fn [k]
                                  (let [a (create-action k console console-io)]
                                    (doto (create-widget k a)
                                      (shortcuts/create-mapping! a))))
                                *project-widgets*))
        project-pane (s/vertical-panel
                       :id :project-pane
                       :items [btn-group (s/scrollable project-tree)])]
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
    project-pane))

; watchers

(add-watch ui/tree-selection
           :update-project-buttons
           (fn [_ _ _ path]
             (s/config! (s/select @ui/ui-root [:#remove])
                        :enabled? (and (not (nil? path))
                                       (or (contains? @ui/tree-projects path)
                                           (.isFile (io/file path)))))
             (s/config! (s/select @ui/ui-root [:#new-file])
                        :visible? (and (not (nil? path))
                                       (.isDirectory (io/file path))))
             (s/config! (s/select @ui/ui-root [:#rename-file])
                        :visible? (and (not (nil? path))
                                       (.isFile (io/file path))))))
