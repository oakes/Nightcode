(ns nightcode.projects
  (:require [clojure.java.io :as java.io]
            [nightcode.builders :as builders]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.utils :as utils]
            [seesaw.chooser :as chooser]
            [seesaw.core :as s]))

; keep track of projects, expansions and the selection

(def tree-projects (atom #{}))
(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn get-project-path
  ([]
   (get-project-path (utils/get-selected-path)))
  ([path]
   (when path
     (when-let [file (java.io/file path)]
       (if (or (utils/is-project-path? (.getCanonicalPath file))
               (contains? @tree-projects (.getCanonicalPath file)))
         (.getCanonicalPath file)
         (when-let [parent-file (.getParentFile file)]
           (get-project-path (.getCanonicalPath parent-file))))))))

(defn get-project-root-path
  []
  (-> #(.startsWith (utils/get-selected-path) %)
      (filter @tree-projects)
      first))

(defn add-expansion
  [e]
  (swap! tree-expansions conj (-> e .getPath utils/tree-path-to-str))
  (utils/write-pref :expansion-set @tree-expansions))

(defn remove-expansion
  [e]
  (swap! tree-expansions disj (-> e .getPath utils/tree-path-to-str))
  (utils/write-pref :expansion-set @tree-expansions))

(defn set-selection
  [e]
  (when-let [path (-> e .getPath utils/tree-path-to-str)]
    (s/config! (s/select @utils/ui-root [:#remove-button])
               :enabled?
               (or (contains? @tree-projects path)
                   (.isFile (java.io/file path))))
    (s/config! (s/select @utils/ui-root [:#new-file-button])
               :visible? (.isDirectory (java.io/file path)))
    (s/config! (s/select @utils/ui-root [:#rename-file-button])
               :visible? (.isFile (java.io/file path)))
    (reset! tree-selection path)
    (editors/show-editor path)
    (builders/show-builder (get-project-path path)))
  (utils/write-pref :selection @tree-selection))

; create and manipulate project tree

(defn get-node
  [file]
  (let [path (.getCanonicalPath file)
        file-name (.getName file)]
    {:html (cond
             (utils/is-project-path? path) (str "<html><b><font color='gray'>"
                                                file-name
                                                "</font></b></html>"))
     :name file-name
     :file file}))

(defn get-nodes
  [node children]
  (->> (for [child children]
         (get-node child))
       (sort-by #(:name %))
       (cons (when (and (:file node)
                        (-> (.getCanonicalPath (:file node))
                            lein/is-android-project?))
               {:html "<html><b><font color='green'>LogCat</font></b></html>"
                :name "LogCat"
                :file (java.io/file (:file node) "*LogCat*")}))
       (remove nil?)
       vec))

(defn file-node
  [node]
  (let [children (->> (reify java.io.FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles (:file node))
                      (get-nodes node)
                      delay)]
    (proxy [javax.swing.tree.DefaultMutableTreeNode] [node]
      (getChildAt [i] (file-node (get @children i)))
      (getChildCount [] (count @children))
      (isLeaf [] (or (nil? (:file node))
                     (not (.isDirectory (:file node)))))
      (toString [] (or (:html node) (:name node))))))

(defn root-node
  [project-vec]
  (proxy [javax.swing.tree.DefaultMutableTreeNode] []
    (getChildAt [i] (file-node (get-node (java.io/file (nth project-vec i)))))
    (getChildCount [] (count project-vec))))

(defn create-project-tree
  []
  (reset! tree-projects
          (-> #(.getName (java.io/file %))
              (sort-by (utils/read-pref :project-set))
              (set)))
  (-> @tree-projects
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))

(defn add-to-project-tree
  [path]
  (let [project-set (utils/read-pref :project-set)]
    (utils/write-pref :project-set (set (conj project-set path)))))

(defn remove-from-project-tree
  [path]
  (let [is-project? (contains? @tree-projects path)]
    (when (dialogs/show-remove-dialog is-project?)
      (if is-project?
        (utils/write-pref :project-set
                          (->> (utils/read-pref :project-set)
                               (remove #(= % path))
                               set))
        (utils/delete-file-recursively (-> #(.startsWith path %)
                                           (filter @tree-projects)
                                           first)
                                       path))
      true)))

(defn update-project-tree
  ([]
   (update-project-tree (utils/get-project-tree) nil))
  ([new-selection]
   (update-project-tree (utils/get-project-tree) new-selection))
  ([tree new-selection]
   ; put new data in the tree
   (.setModel tree (create-project-tree))
   ; wipe out the in-memory expansion/selection
   (reset! tree-expansions #{})
   (reset! tree-selection nil)
   ; read the on-disk expansion/selection and apply them to the tree
   (let [expansion-set (utils/read-pref :expansion-set)
         selection (or new-selection (utils/read-pref :selection))]
     (doseq [i (range) :while (< i (.getRowCount tree))]
       (let [tree-path (.getPathForRow tree i)
             str-path (utils/tree-path-to-str tree-path)]
         (when (or (contains? expansion-set str-path)
                   (and new-selection (.startsWith new-selection str-path)))
           (.expandPath tree tree-path)
           (swap! tree-expansions conj str-path))
         (when (= selection str-path)
           (.setSelectionPath tree tree-path)
           (reset! tree-selection str-path)))))
   ; select the first project if there is nothing selected
   (when (nil? @tree-selection)
     (.setSelectionRow tree 0))
   ; hide panes and disable buttons if there is still nothing selected
   (when (nil? @tree-selection)
     (editors/show-editor nil)
     (builders/show-builder nil)
     (doseq [btn [:#remove-button :#new-file-button :#rename-file-button]]
       (s/config! (s/select @utils/ui-root [btn]) :enabled? false)))))

(defn enter-file-path
  [default-file-name]
  (let [selected-path (utils/get-selected-path)
        project-path (get-project-root-path)
        default-path (str (utils/get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (java.io/file selected-path))))]
    (dialogs/show-file-path-dialog default-path)))

; actions for project tree buttons

(defn new-project
  [thread console]
  (when-let [dir (chooser/choose-file :type :save)]
    (when-let [[project-type project-name package-name project-dir]
               (dialogs/show-project-type-dialog dir)]
      (lein/stop-thread thread)
      (lein/new-project (utils/get-console-input console)
                        (utils/get-console-output console)
                        (.getParent dir)
                        project-type
                        project-name
                        package-name)
      (when (.exists (java.io/file project-dir))
        (add-to-project-tree project-dir)
        (update-project-tree project-dir))
      console)))

(defn new-file
  [e]
  (let [project-path (get-project-root-path)
        default-file-name (if (lein/is-java-project? project-path)
                            "Example.java" "example.clj")]
    (when-let [leaf-path (enter-file-path default-file-name)]
      (let [new-file (java.io/file project-path leaf-path)]
        (if (.exists new-file)
          (s/alert (utils/get-string :file_exists))
          (do
            (.mkdirs (.getParentFile new-file))
            (.createNewFile new-file)
            (update-project-tree (.getCanonicalPath new-file))))))))

(defn rename-file
  [e]
  (when-let [leaf-path (enter-file-path nil)]
    (let [project-path (get-project-root-path)
          new-file (java.io/file project-path leaf-path)
          new-path (.getCanonicalPath new-file)
          selected-path (utils/get-selected-path)]
      (when (not= new-path selected-path)
        (editors/save-file e)
        (.mkdirs (.getParentFile new-file))
        (.renameTo (java.io/file selected-path) new-file)
        (utils/delete-file-recursively project-path selected-path)
        (update-project-tree new-path)))))

(defn import-project
  [e]
  (when-let [dir (chooser/choose-file :type :open :selection-mode :dirs-only)]
    ; offer to create project.clj if necessary
    (when (and (.exists (java.io/file dir "src"))
               (not (.exists (java.io/file dir "project.clj")))
               (dialogs/show-project-clj-dialog))
      (->> {:raw-name (.getName dir)
            :namespace "put.your.main.namespace.here"}
           (lein/create-file-from-template dir
                                           "project.clj"
                                           (if (lein/is-android-project? dir)
                                             "android-java"
                                             "console-java"))))
    ; show project root in the tree
    (let [dir-path (.getCanonicalPath dir)]
      (add-to-project-tree dir-path)
      (update-project-tree dir-path))))

(defn remove-item
  [e]
  (when (remove-from-project-tree (utils/get-selected-path))
    (update-project-tree (get-project-root-path))))
