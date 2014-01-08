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
            [seesaw.core :as s]))

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
      (utils/write-pref! :selection @ui/tree-selection)
      (-> @ui/ui-root .getContentPane .resetToPreferredSizes))))

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

(defn move-tab-selection!
  [diff]
  (let [paths (reverse (keys @editors/editors))
        index (.indexOf paths (ui/get-selected-path))
        max-index (- (count paths) 1)
        new-index (+ index diff)
        new-index (cond
                    (< new-index 0) max-index
                    (> new-index max-index) 0
                    :else new-index)]
    (when (> (count paths) 0)
      (binding [editors/*reorder-tabs?* false]
        (ui/update-project-tree! (nth paths new-index)))))
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
  (let [selected-path (ui/get-selected-path)
        project-path (ui/get-project-root-path)
        default-path (str (utils/get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (io/file selected-path))))]
    (dialogs/show-file-path-dialog! default-path)))

; actions for project tree buttons

(defn new-project!
  [in out]
  (when-let [dir (chooser/choose-file :type :save)]
    (when-let [[project-type project-name package-name project-dir]
               (dialogs/show-project-type-dialog! dir)]
      (lein/new-project! in
                         out
                         (.getParent dir)
                         project-type
                         project-name
                         package-name)
      (when (.exists (io/file project-dir))
        (add-to-project-tree! project-dir)
        (ui/update-project-tree! project-dir)))))

(defn new-file!
  [e]
  (let [default-file-name (if (-> (ui/get-selected-path)
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
          selected-path (ui/get-selected-path)]
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
  (when (remove-from-project-tree! (ui/get-selected-path))
    (ui/update-project-tree! (ui/get-project-root-path))))

; watchers

(add-watch ui/tree-selection
           :update-project-buttons
           (fn [_ _ _ path]
             (s/config! (s/select @ui/ui-root [:#remove-button])
                        :enabled?
                        (and path (or (contains? @ui/tree-projects path)
                                      (.isFile (io/file path)))))
             (s/config! (s/select @ui/ui-root [:#new-file-button])
                        :visible? (and path (.isDirectory (io/file path))))
             (s/config! (s/select @ui/ui-root [:#rename-file-button])
                        :visible? (and path (.isFile (io/file path))))))
