(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control TreeItem TreeCell]
           [javafx.collections FXCollections]))

(defn file-node [file]
  (let [path (.getCanonicalPath file)
        custom-file (proxy [File] [path]
                      (toString []
                        (.getName this)))]
    (proxy [TreeItem] [custom-file]
      (getChildren []
        (let [files (.listFiles file
                      (reify FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename ".")))))
              children (FXCollections/observableArrayList)]
          (run! #(.add children (file-node %)) files)
          children))
      (isLeaf []
        (not (.isDirectory file))))))

(defn root-node [state]
  (let [project-files (->> (:project-set state)
                           (map #(io/file %))
                           (sort-by #(.getName %)))]
    (proxy [TreeItem] []
      (getChildren []
        (let [children (FXCollections/observableArrayList)]
          (run! #(.add children (file-node %)) project-files)
          children))
      (isLeaf []
        false))))
