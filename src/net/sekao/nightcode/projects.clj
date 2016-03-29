(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.utils :as u])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control TreeItem TreeCell]
           [javafx.collections FXCollections]))

(declare file-node)

(defn get-children [files]
  (let [children (FXCollections/observableArrayList)]
    (run! #(.add children (file-node %)) files)
    children))

(defn file-node [file]
  (let [path (.getCanonicalPath file)
        custom-file (proxy [File] [path]
                      (toString []
                        (.getName this)))
        children (->> (reify FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles file)
                      get-children
                      delay)]
    (proxy [TreeItem] [custom-file]
      (getChildren []
        (if-not (realized? children)
          (doto (proxy-super getChildren)
            (.addAll @children))
          (proxy-super getChildren)))
      (isLeaf []
        (not (.isDirectory file))))))

(defn root-node [state]
  (let [project-files (->> (:project-set state)
                           (map #(io/file %))
                           (sort-by #(.getName %)))
        children (delay (get-children project-files))]
    (proxy [TreeItem] []
      (getChildren []
        (if-not (realized? children)
          (doto (proxy-super getChildren)
            (.addAll @children))
          (proxy-super getChildren)))
      (isLeaf []
        false))))

(defn add-to-project-tree! [state-atom path]
  (->> (swap! state-atom update :project-set conj path)
       :project-set
       (u/write-pref! :project-set)))

(defn update-project-tree! [state tree]
  (doto tree
    (.setShowRoot false)
    (.setRoot (root-node state))))
