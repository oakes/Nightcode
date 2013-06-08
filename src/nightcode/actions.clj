(ns nightcode.actions
  (:use [seesaw.core :only [select
                            to-root]]
        [seesaw.chooser :only [choose-file]]
        [nightcode.utils :only [get-tree-model
                                add-to-tree
                                remove-from-tree
                                get-path-from-tree-path]]))

(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn add-expansion
  [e]
  (swap! tree-expansions
         conj
         (-> e
             .getPath
             get-path-from-tree-path)))

(defn remove-expansion
  [e]
  (swap! tree-expansions
         disj
         (-> e
             .getPath
             get-path-from-tree-path)))

(defn set-selection
  [e]
  (reset! tree-selection
          (-> e
              .getPath
              get-path-from-tree-path)))

(defn update-project-tree
  [tree]
  (.setModel tree (get-tree-model))
  (doseq [i (range) :while (< i (.getRowCount tree))]
    (when (contains? @tree-expansions
                     (get-path-from-tree-path (.getPathForRow tree i)))
      (.expandPath tree (.getPathForRow tree i)))
    (when (= @tree-selection
             (get-path-from-tree-path (.getPathForRow tree i)))
      (.setSelectionPath tree (.getPathForRow tree i)))))

(defn new-project
  [e]
  (when-let [dir (choose-file :type :save)]
    (add-to-tree (.getAbsolutePath dir))
    (update-project-tree (select (to-root e) [:#project-tree]))))

(defn new-file
  [e])

(defn import-project
  [e]
  (when-let [dir (choose-file :type :open
                              :selection-mode :dirs-only)]
    (add-to-tree (.getAbsolutePath dir))
    (update-project-tree (select (to-root e) [:#project-tree]))))

(defn remove-project
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])
        selection-path (.getSelectionPath project-tree)]
    (when (and selection-path
               (-> selection-path
                   get-path-from-tree-path
                   remove-from-tree))
      (update-project-tree project-tree))))
