(ns nightcode.utils
  (:use [seesaw.core :only [dialog
                            button
                            return-from-dialog
                            pack!
                            show!]]
        [clojure.java.io :only [file]]))

(def prefs (.node (java.util.prefs.Preferences/userRoot) "nightcode"))

(defn write-pref
  [k v]
  (.put prefs (name k) (pr-str v)))

(defn read-pref
  [k]
  (read-string (.get prefs (name k) nil)))

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

(defn get-tree-model
  []
  (-> #(.getName (file %))
      (sort-by (read-pref :project-set))
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))

(defn add-to-tree
  [path]
  (let [project-set (read-pref :project-set)]
    (write-pref :project-set (set (conj project-set path)))))

(defn remove-from-tree
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

(defn get-path-from-tree-path
  [tree-path]
  (-> tree-path
      .getPath
      last
      .getUserObject
      .getAbsolutePath))
