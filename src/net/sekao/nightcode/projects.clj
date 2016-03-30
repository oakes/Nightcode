(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.utils :as u])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control TreeItem TreeCell]
           [javafx.collections FXCollections]
           [javafx.beans.value ChangeListener]))

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

(defn update-project-tree! [state tree]
  (doto tree
    (.setShowRoot false)
    (.setRoot (root-node state)))
  (let [expansions (:expansion-set state)
        selection (:selection state)
        selection-model (.getSelectionModel tree)]
    ; set expansions and selection
    (doseq [i (range) :while (< i (.getExpandedItemCount tree))]
      (let [item (.getTreeItem tree i)
            path (-> item .getValue .getCanonicalPath)]
        (when (contains? expansions path)
          (.setExpanded item true))
        (when (= selection path)
          (.select selection-model item))))
    ; select the first project if there is nothing selected
    (when (= -1 (.getSelectedIndex selection-model))
      (.select selection-model (int 0)))))

(defn set-selection-listener! [state-atom scene tree]
  (let [selection-model (.getSelectionModel tree)]
    (.addListener (.selectedItemProperty selection-model)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when-let [path (some-> new-value .getValue .getCanonicalPath)]
            ; save the new selection
            (swap! state-atom assoc :selection path)
            ; disable project tree buttons if necessary
            (let [rename-button (.lookup scene "#rename_button")
                  remove-button (.lookup scene "#remove_button")
                  file (io/file path)]
              (.setDisable rename-button (not (.isFile file)))
              (.setDisable remove-button
                (and (not (contains? (:project-set @state-atom) path))
                  (not (.isFile file)))))))))))
