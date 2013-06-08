(ns nightcode.actions
  (:use [seesaw.core :only [select
                            to-root]]
        [seesaw.chooser :only [choose-file]]
        [nightcode.utils :only [get-tree-model
                                add-to-tree
                                remove-from-tree]]))

(defn new-project
  [e]
  (when-let [dir (choose-file :type :save)]
    (add-to-tree (.getAbsolutePath dir))
    (.setModel (select (to-root e) [:#project-tree])
               (get-tree-model))))

(defn remove-project
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])
        selection-path (.getSelectionPath project-tree)]
    (when (and selection-path (-> selection-path
                                  .getPath
                                  second
                                  .getUserObject
                                  .getAbsolutePath
                                  remove-from-tree))
      (.setModel project-tree (get-tree-model)))))
