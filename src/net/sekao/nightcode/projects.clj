(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.editors :as editors]
            [net.sekao.nightcode.spec :as spec]
            [clojure.spec :as s :refer [fdef]])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control TreeItem TreeCell]
           [javafx.collections FXCollections]
           [javafx.beans.value ChangeListener]
           [javafx.event EventHandler]
           [javafx.fxml FXMLLoader]
           [javafx.concurrent Worker$State]
           [javafx.scene Scene]
           [javafx.stage Stage]))

; paths

(fdef get-relative-path
  :args (s/cat :project-path string? :selected-path string?)
  :ret string?)
(defn get-relative-path
  "Returns the selected path as a relative URI to the project path."
  [project-path selected-path]
  (-> (.toURI (io/file project-path))
      (.relativize (.toURI (io/file selected-path)))
      (.getPath)))

(fdef delete-parents-recursively!
  :args (s/cat :project-set set? :path string?))
(defn ^:no-check delete-parents-recursively!
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

(fdef delete-children-recursively!
  :args (s/cat :path string?))
(defn ^:no-check delete-children-recursively!
  "Deletes the children of the given dir along with the dir itself."
  [path]
  (let [f (io/file path)]
    (when (.isDirectory f)
      (doseq [f2 (.listFiles f)]
        (delete-children-recursively! f2)))
    (io/delete-file f))
  nil)

(fdef get-project-root-path
  :args (s/cat :state map?)
  :ret string?)
(defn ^:no-check get-project-root-path
  "Returns the root path that the selected path is contained within."
  [state]
  (when-let [^String selected-path (:selection state)]
    (-> #(or (.startsWith selected-path (str % File/separator))
           (= selected-path %))
        (filter (:project-set state))
        first)))

(fdef parent-path?
  :args (s/cat :parent-path string? :child-path (s/nilable string?))
  :ret spec/boolean?)
(defn parent-path?
  "Determines if the given parent path is equal to or a parent of the child."
  [^String parent-path ^String child-path]
  (or (= parent-path child-path)
      (and parent-path
           child-path
           (.isDirectory (io/file parent-path))
           (.startsWith child-path (str parent-path File/separator)))
      false))

; tree

(definterface ProjectTreeItem
  (getPath [] "Unique path representing this item")
  (getPane [state-atom] "The pane for the given item"))

(declare get-children)

(fdef file-pane
  :args (s/cat :state map? :file spec/file?)
  :ret spec/pane?)
(defn ^:no-check file-pane [state file]
  (let [pane (FXMLLoader/load (io/resource "project.fxml"))
        engine (-> pane .getItems (.get 0) .getChildren (.get 0) .getEngine)]
    (.load engine (str "http://localhost:" (:web-port state)))
    (-> engine .getLoadWorker .stateProperty
        (.addListener
          (proxy [ChangeListener] []
            (changed [ov old-state new-state]
              (when (= new-state Worker$State/SUCCEEDED)
                ; set the page content
                (-> engine
                    .getDocument
                    (.getElementById "content")
                    (.setTextContent (slurp file)))
                ; refresh paren-soup
                (let [body (-> engine .getDocument (.getElementsByTagName "body") (.item 0))
                      old-elem (-> body (.getElementsByTagName "script") (.item 0))
                      new-elem (-> engine .getDocument (.createElement "script"))]
                  (.setAttribute new-elem "src" "paren-soup.js")
                  (doto body
                    (.removeChild old-elem)
                    (.appendChild new-elem))))))))
    pane))

(fdef dir-pane
  :args (s/cat)
  :ret spec/pane?)
(defn ^:no-check dir-pane []
  (FXMLLoader/load (io/resource "dir.fxml")))

(fdef home-pane
  :args (s/cat)
  :ret spec/pane?)
(defn ^:no-check home-pane []
  (FXMLLoader/load (io/resource "home.fxml")))

(fdef file-node
  :args (s/cat :file spec/file?)
  :ret spec/tree-item?)
(defn ^:no-check file-node [file]
  (let [path (.getCanonicalPath file)
        value (proxy [File] [path]
                (toString []
                  (.getName this)))
        children (->> (reify FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles file)
                      get-children
                      delay)]
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
      (getPane [state-atom]
        (if (.isDirectory file)
          (dir-pane)
          (let [state @state-atom
                pane (or (get-in state [:panes path]) (file-pane state file))]
            (swap! state-atom update :panes assoc path pane)
            pane))))))

(fdef home-node
  :args (s/cat)
  :ret spec/tree-item?)
(defn ^:no-check home-node []
  (let [path "**Home**"
        value (proxy [Object] []
                (toString []
                  "Home"))]
    (proxy [TreeItem ProjectTreeItem] [value]
      (isLeaf []
        true)
      (getPath []
        path)
      (getPane [state-atom]
        (let [pane (or (get-in @state-atom [:panes path]) (home-pane))]
          (swap! state-atom update :panes assoc path pane)
          pane)))))

(fdef root-node
  :args (s/cat :state map?)
  :ret spec/tree-item?)
(defn ^:no-check root-node [state]
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

(fdef get-children
  :args (s/cat :files :net.sekao.nightcode.spec/files)
  :ret spec/obs-list?)
(defn ^:no-check get-children [files]
  (let [children (FXCollections/observableArrayList)]
    (run! #(.add children (file-node %)) files)
    children))

(fdef set-expanded-listener!
  :args (s/cat :state-atom spec/atom? :tree spec/pane?))
(defn ^:no-check set-expanded-listener! [state-atom tree]
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

(fdef update-project-tree!
  :args (s/alt
          :args2 (s/cat :state-atom spec/atom? :tree spec/pane?)
          :args3 (s/cat :state-atom spec/atom? :tree spec/pane? :selection (s/nilable string?))))
(defn ^:no-check update-project-tree!
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

(fdef update-project-buttons!
  :args (s/cat :state map? :scene spec/scene?))
(defn ^:no-check update-project-buttons! [state ^Scene scene]
  (let [rename-button (.lookup scene "#rename")
        remove-button (.lookup scene "#remove")
        path (:selection state)
        file (io/file path)]
    (.setDisable rename-button (not (.isFile file)))
    (.setDisable remove-button
      (and (not (contains? (:project-set state) path))
        (not (.isFile file))))))

(fdef move-project-tree-selection!
  :args (s/cat :scene spec/scene? :diff integer?))
(defn ^:no-check move-project-tree-selection! [^Scene scene diff]
  (let [project-tree (.lookup scene "#project_tree")
        selection-model (.getSelectionModel project-tree)
        index (+ diff (.getSelectedIndex selection-model))]
    (when (>= index 0)
      (.select selection-model index))))

(fdef toggle-project-tree-selection!
  :args (s/cat :scene spec/scene?))
(defn ^:no-check toggle-project-tree-selection! [^Scene scene]
  (let [project-tree (.lookup scene "#project_tree")
        selection-model (.getSelectionModel project-tree)]
    (when-let [item (.getSelectedItem selection-model)]
      (.setExpanded item (not (.isExpanded item))))))

(fdef set-selection-listener!
  :args (s/cat :state-atom spec/atom? :scene spec/scene? :tree spec/pane? :content spec/pane?))
(defn ^:no-check set-selection-listener! [state-atom ^Scene scene tree content]
  (let [selection-model (.getSelectionModel tree)]
    (.addListener (.selectedItemProperty selection-model)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (-> (swap! state-atom assoc :selection (.getPath new-value))
                (update-project-buttons! scene))
            (doto (.getChildren content)
              (.clear)
              (.add (.getPane new-value state-atom)))))))))

(fdef set-focused-listener!
  :args (s/cat :state-atom spec/atom? :stage spec/stage? :project-tree spec/pane?))
(defn ^:no-check set-focused-listener! [state-atom ^Stage stage project-tree]
  (.addListener (.focusedProperty stage)
    (reify ChangeListener
      (changed [this observable old-value new-value]
        (when new-value
          (update-project-tree! state-atom project-tree))))))

(fdef remove-from-project-tree!
  :args (s/cat :state-atom spec/atom? :path string?))
(defn ^:no-check remove-from-project-tree! [state-atom ^String path]
  (let [{:keys [project-set]} @state-atom]
    (if (contains? project-set path)
      (swap! state-atom update :project-set disj path)
      (delete-parents-recursively! project-set path))))
