(ns nightcode.utils
  (:use [clojure.java.io :only [file]]))

(def prefs (.node (java.util.prefs.Preferences/userRoot) "nightcode"))

(defn write-pref
  [k v]
  (.put prefs k (pr-str v)))

(defn read-pref
  [k]
  (read-string (.get prefs k nil)))

(defn file-node
  [file-obj]
  (let [children (delay (vec (.listFiles file-obj)))]
    (proxy [javax.swing.tree.DefaultMutableTreeNode] [file-obj]
      (getChildAt [i] (file-node (@children i)))
      (getChildCount [] (count @children))
      (isLeaf [] (not (.isDirectory file-obj)))
      (toString [] (.getName file-obj)))))

(defn root-node
  [project-vec]
  (proxy [javax.swing.tree.DefaultMutableTreeNode] []
    (getChildAt [i] (file-node (file (nth project-vec i))))
    (getChildCount [] (count project-vec))))

(defn get-tree-model
  [tree]
  (-> (read-pref "project-set")
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))
