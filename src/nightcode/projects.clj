(ns nightcode.projects
  (:use [seesaw.core :only [dialog
                            button
                            return-from-dialog
                            pack!
                            show!
                            select
                            to-root]]
        [seesaw.chooser :only [choose-file]]
        [clojure.java.io :only [file]]
        [nightcode.utils :only [write-pref
                                read-pref
                                tree-path-to-str]]))

; keep track of expansions and selections

(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn add-expansion
  [e]
  (swap! tree-expansions
         conj
         (-> e
             .getPath
             tree-path-to-str))
  (write-pref :expansion-set @tree-expansions))

(defn remove-expansion
  [e]
  (swap! tree-expansions
         disj
         (-> e
             .getPath
             tree-path-to-str))
  (write-pref :expansion-set @tree-expansions))

(defn set-selection
  [e]
  (reset! tree-selection
          (-> e
              .getPath
              tree-path-to-str))
  (write-pref :selection @tree-selection))

; create and manipulate project tree

(defn file-node
  [file-obj]
  (let [children (->> (reify java.io.FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles file-obj)
                      delay)]
    (proxy [javax.swing.tree.DefaultMutableTreeNode] [file-obj]
      (getChildAt [i] (file-node (get @children i)))
      (getChildCount [] (count @children))
      (isLeaf [] (not (.isDirectory file-obj)))
      (toString [] (.getName file-obj)))))

(defn root-node
  [project-vec]
  (proxy [javax.swing.tree.DefaultMutableTreeNode] []
    (getChildAt [i] (file-node (file (nth project-vec i))))
    (getChildCount [] (count project-vec))))

(defn init-project-tree
  []
  (when-let [expansion-set (read-pref :expansion-set)]
    (reset! tree-expansions expansion-set))
  (when-let [selection (read-pref :selection)]
    (reset! tree-selection selection)))

(defn create-project-tree
  []
  (-> #(.getName (file %))
      (sort-by (read-pref :project-set))
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))

(defn add-to-project-tree
  [path]
  (let [project-set (read-pref :project-set)]
    (write-pref :project-set (set (conj project-set path)))))

(defn remove-from-project-tree
  [path]
  (let [cancel-button (button :text "Cancel"
                              :listen [:action #(return-from-dialog % :cancel)])
        remove-button (button :text "Remove Project"
                              :listen [:action #(return-from-dialog % :remove)])
        dialog-text "Remove this project? It WILL NOT be deleted from the disk."
        project-set (read-pref :project-set)]
    (when (= :remove
             (-> (dialog :content dialog-text
                         :options [remove-button
                                   cancel-button]
                         :default-option remove-button)
                 pack!
                 show!))
      (write-pref :project-set (set (remove #(= % path) project-set)))
      true)))

(defn update-project-tree
  [tree]
  (.setModel tree (create-project-tree))
  (doseq [i (range) :while (< i (.getRowCount tree))]
    (let [tree-path (.getPathForRow tree i)
          str-path (tree-path-to-str tree-path)]
      (when (contains? @tree-expansions str-path)
        (.expandPath tree tree-path))
      (when (= @tree-selection str-path)
        (.setSelectionPath tree tree-path)))))

; actions for project tree buttons

(defn new-project
  [e]
  (when-let [dir (choose-file :type :save)]
    (add-to-project-tree (.getAbsolutePath dir))
    (update-project-tree (select (to-root e) [:#project-tree]))))

(defn new-file
  [e])

(defn import-project
  [e]
  (when-let [dir (choose-file :type :open
                              :selection-mode :dirs-only)]
    (add-to-project-tree (.getAbsolutePath dir))
    (update-project-tree (select (to-root e) [:#project-tree]))))

(defn remove-project
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])
        selection-path (.getSelectionPath project-tree)]
    (when (and selection-path
               (-> selection-path
                   tree-path-to-str
                   remove-from-project-tree))
      (update-project-tree project-tree))))
