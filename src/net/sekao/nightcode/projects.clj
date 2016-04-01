(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control TreeItem TreeCell]
           [javafx.collections FXCollections]
           [javafx.beans.value ChangeListener]
           [javafx.event EventHandler]
           [javafx.fxml FXMLLoader]))

; paths

(defn get-relative-path
  "Returns the selected path as a relative URI to the project path."
  [project-path selected-path]
  (-> (.toURI (io/file project-path))
      (.relativize (.toURI (io/file selected-path)))
      (.getPath)))

(defn delete-parents-recursively!
  "Deletes the given file along with all empty parents unless they are in project-set."
  [project-set path]
  (let [f (io/file path)]
    (when (and (zero? (count (.listFiles f)))
               (not (contains? project-set path)))
      (io/delete-file f true)
      (->> f
           .getParentFile
           .getCanonicalPath
           (delete-parents-recursively! project-set))))
  nil)

(defn delete-children-recursively!
  "Deletes the children of the given dir along with the dir itself."
  [path]
  (let [f (io/file path)]
    (when (.isDirectory f)
      (doseq [f2 (.listFiles f)]
        (delete-children-recursively! f2)))
    (io/delete-file f))
  nil)

(defn get-project-root-path
  "Returns the root path that the selected path is contained within."
  [state]
  (when-let [^String selected-path (:selection state)]
    (-> #(or (.startsWith selected-path (str % File/separator))
           (= selected-path %))
        (filter (:project-set state))
        first)))

(defn parent-path?
  "Determines if the given parent path is equal to or a parent of the child."
  [^String parent-path ^String child-path]
  (or (= parent-path child-path)
      (and parent-path
           child-path
           (.isDirectory (io/file parent-path))
           (.startsWith child-path (str parent-path File/separator)))))

; tree

(definterface ProjectTreeItem
  (getPath [] "Unique path representing this item")
  (getPane [] "The pane for the given item"))

(declare file-node)

(defn get-children [files]
  (let [children (FXCollections/observableArrayList)]
    (run! #(.add children (file-node %)) files)
    children))

(defn file-node [file]
  (let [path (.getCanonicalPath file)
        value (proxy [File] [path]
                (toString []
                  (.getName this)))
        children (->> (reify FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles file)
                      get-children
                      delay)
        pane (delay (doto (FXMLLoader/load (io/resource "project.fxml"))
                      (->
                        .getItems
                        (.get 0)
                        .getChildren
                        (.get 0)
                        .getEngine
                        (.load (.toExternalForm (io/resource "public/index.html"))))))]
    (proxy [TreeItem ProjectTreeItem] [value]
      (getChildren []
        (if-not (realized? children)
          (doto (proxy-super getChildren)
            (.addAll @children))
          (proxy-super getChildren)))
      (isLeaf []
        (not (.isDirectory file)))
      (getPath []
        path)
      (getPane []
        @pane))))

(defn home-node []
  (let [value (proxy [Object] []
                (toString []
                  "Home"))
        pane (delay (FXMLLoader/load (io/resource "home.fxml")))]
    (proxy [TreeItem ProjectTreeItem] [value]
      (isLeaf []
        true)
      (getPath []
        "**Home**")
      (getPane []
        @pane))))

(defn root-node [state]
  (let [project-files (->> (:project-set state)
                           (map #(io/file %))
                           (sort-by #(.getName %)))
        children (delay (doto (get-children project-files)
                          (.add 0 (home-node))))]
    (proxy [TreeItem] []
      (getChildren []
        (if-not (realized? children)
          (doto (proxy-super getChildren)
            (.addAll @children))
          (proxy-super getChildren)))
      (isLeaf []
        false))))

(defn set-expanded-listener! [state-atom tree]
  (let [root-item (.getRoot tree)]
    (.addEventHandler root-item
      (TreeItem/branchExpandedEvent)
      (reify EventHandler
        (handle [this event]
          (when-let [path (-> event .getTreeItem .getPath)]
            (swap! state-atom update :expansion-set conj path)))))
    (.addEventHandler root-item
      (TreeItem/branchCollapsedEvent)
      (reify EventHandler
        (handle [this event]
          (when-let [path (-> event .getTreeItem .getPath)]
            (swap! state-atom update :expansion-set disj path)))))))

(defn update-project-tree!
  ([state-atom tree]
   (update-project-tree! state-atom tree nil))
  ([state-atom tree new-selection]
   (let [state @state-atom
         _ (doto tree
             (.setShowRoot false)
             (.setRoot (root-node state)))
         _ (set-expanded-listener! state-atom tree)
         expansions (:expansion-set state)
         selection (or new-selection (:selection state))
         selection-model (.getSelectionModel tree)]
     ; set expansions and selection
     (doseq [i (range) :while (< i (.getExpandedItemCount tree))]
       (let [item (.getTreeItem tree i)
             path (.getPath item)]
         (when (or (contains? expansions path)
                 (parent-path? path new-selection))
           (.setExpanded item true))
         (when (= selection path)
           (.select selection-model item))))
     ; select the first project if there is nothing selected
     (when (= -1 (.getSelectedIndex selection-model))
       (.select selection-model (int 0))))))

(defn update-project-buttons! [state scene]
  (let [rename-button (.lookup scene "#rename_button")
        remove-button (.lookup scene "#remove_button")
        path (:selection state)
        file (io/file path)]
    (.setDisable rename-button (not (.isFile file)))
    (.setDisable remove-button
      (and (not (contains? (:project-set state) path))
        (not (.isFile file))))))

(defn set-selection-listener! [state-atom scene tree content]
  (let [selection-model (.getSelectionModel tree)]
    (.addListener (.selectedItemProperty selection-model)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (-> (swap! state-atom assoc :selection (.getPath new-value))
                (update-project-buttons! scene))
            (doto (.getChildren content)
              (.clear)
              (.add (.getPane new-value)))))))))

(defn set-focused-listener! [state-atom stage project-tree]
  (.addListener (.focusedProperty stage)
    (reify ChangeListener
      (changed [this observable old-value new-value]
        (when new-value
          (update-project-tree! state-atom project-tree))))))

(defn remove-from-project-tree! [state-atom path]
  (let [{:keys [project-set]} @state-atom]
    (if (contains? project-set path)
      (swap! state-atom update :project-set disj path)
      (delete-parents-recursively! project-set path))))
