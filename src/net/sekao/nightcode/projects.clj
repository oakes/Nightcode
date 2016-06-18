(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.editors :as e]
            [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]
            [clojure.spec :as s :refer [fdef]])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control TreeItem TreeCell]
           [javafx.collections FXCollections]
           [javafx.beans.value ChangeListener]
           [javafx.event EventHandler]
           [javafx.fxml FXMLLoader]
           [javafx.concurrent Worker$State]
           [javafx.scene Scene]
           [javafx.stage Stage]
           [javafx.scene.input KeyEvent KeyCode]))

(definterface ProjectTreeItem
  (getPath [] "Unique path representing this item")
  (getPane [runtime-state-atom parent-path] "The pane for the given item"))

(declare get-children)

(fdef project-pane
  :args (s/cat :path string?)
  :ret spec/pane?)
(defn project-pane [path]
  (let [pane (FXMLLoader/load (io/resource "project.fxml"))
        builder (-> pane .getItems (.get 1))]
    pane))

(fdef dir-pane
  :args (s/cat)
  :ret spec/pane?)
(defn dir-pane []
  (FXMLLoader/load (io/resource "dir.fxml")))

(fdef home-pane
  :args (s/cat)
  :ret spec/pane?)
(defn home-pane []
  (FXMLLoader/load (io/resource "home.fxml")))

(fdef file-node
  :args (s/cat :file spec/file?)
  :ret spec/tree-item?)
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
      (getPane [runtime-state-atom parent-path]
        (when parent-path
          (let [state @runtime-state-atom
                project-pane (or (get-in state [:project-panes parent-path])
                                 (project-pane parent-path))
                editors (-> project-pane .getItems (.get 0))]
            (-> editors .getChildren .clear)
            (when-let [pane (if (.isDirectory file)
                              (dir-pane)
                              (or (get-in state [:editor-panes path])
                                  (e/editor-pane state file)))]
              (-> editors .getChildren (.add pane))
              (swap! runtime-state-atom update :project-panes assoc parent-path project-pane)
              (swap! runtime-state-atom update :editor-panes assoc path pane))
            project-pane))))))

(fdef home-node
  :args (s/cat)
  :ret spec/tree-item?)
(defn home-node []
  (let [path "**Home**"
        value (proxy [Object] []
                (toString []
                  "Home"))]
    (proxy [TreeItem ProjectTreeItem] [value]
      (isLeaf []
        true)
      (getPath []
        path)
      (getPane [runtime-state-atom _]
        (let [pane (or (get-in @runtime-state-atom [:editor-panes path])
                       (home-pane))]
          (swap! runtime-state-atom update :editor-panes assoc path pane)
          pane)))))

(fdef root-node
  :args (s/cat :pref-state map?)
  :ret spec/tree-item?)
(defn root-node [pref-state]
  (let [project-files (->> (:project-set pref-state)
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
(defn get-children [files]
  (let [children (FXCollections/observableArrayList)]
    (run! #(.add children (file-node %)) files)
    children))

(fdef set-expanded-listener!
  :args (s/cat :pref-state-atom spec/atom? :tree spec/pane?))
(defn set-expanded-listener! [pref-state-atom tree]
  (let [root-item (.getRoot tree)]
    (.addEventHandler root-item
      (TreeItem/branchExpandedEvent)
      (reify EventHandler
        (handle [this event]
          (when-let [path (-> event .getTreeItem .getPath)]
            (swap! pref-state-atom update :expansion-set conj path)))))
    (.addEventHandler root-item
      (TreeItem/branchCollapsedEvent)
      (reify EventHandler
        (handle [this event]
          (when-let [path (-> event .getTreeItem .getPath)]
            (swap! pref-state-atom update :expansion-set disj path)))))))

(fdef update-project-tree!
  :args (s/alt
          :args2 (s/cat :pref-state-atom spec/atom? :tree spec/pane?)
          :args3 (s/cat :pref-state-atom spec/atom? :tree spec/pane? :selection (s/nilable string?))))
(defn update-project-tree!
  ([pref-state-atom tree]
   (update-project-tree! pref-state-atom tree nil))
  ([pref-state-atom tree new-selection]
   (let [state @pref-state-atom
         _ (doto tree
             (.setShowRoot false)
             (.setRoot (root-node state)))
         _ (set-expanded-listener! pref-state-atom tree)
         expansions (:expansion-set state)
         selection (or new-selection (:selection state))
         selection-model (.getSelectionModel tree)]
     ; set expansions and selection
     (doseq [i (range) :while (< i (.getExpandedItemCount tree))]
       (let [item (.getTreeItem tree i)
             path (.getPath item)]
         (when (or (contains? expansions path)
                   (u/parent-path? path new-selection))
           (.setExpanded item true))
         (when (= selection path)
           (.select selection-model item))))
     ; select the first project if there is nothing selected
     (when (= -1 (.getSelectedIndex selection-model))
       (.select selection-model (int 0)))
     ; update scroll position
     (.scrollTo tree (.getSelectedIndex selection-model)))))

(fdef update-project-tree-selection!
  :args (s/cat :tree spec/pane? :selection string?))
(defn update-project-tree-selection! [tree new-selection]
  (let [selection-model (.getSelectionModel tree)]
    (loop [tree-items (-> tree .getRoot .getChildren seq)]
      (when-let [tree-item (first tree-items)]
        (cond
          (= new-selection (.getPath tree-item))
          (.select selection-model tree-item)
          (u/parent-path? (.getPath tree-item) new-selection)
          (recur (-> tree-item .getChildren seq))
          :else
          (recur (rest tree-items)))))))

(fdef update-project-buttons!
  :args (s/cat :pref-state map? :scene spec/scene?))
(defn update-project-buttons! [pref-state ^Scene scene]
  (when-let [path (:selection pref-state)]
    (let [rename-button (.lookup scene "#rename")
          remove-button (.lookup scene "#remove")
          file (io/file path)]
      (.setDisable rename-button (not (.isFile file)))
      (.setDisable remove-button
        (and (not (contains? (:project-set pref-state) path))
             (not (.isFile file)))))))

(fdef move-project-tree-selection!
  :args (s/cat :scene spec/scene? :diff integer?))
(defn move-project-tree-selection! [^Scene scene diff]
  (let [project-tree (.lookup scene "#project_tree")
        selection-model (.getSelectionModel project-tree)
        index (+ diff (.getSelectedIndex selection-model))]
    (when (>= index 0)
      (.select selection-model index))))

(fdef toggle-project-tree-selection!
  :args (s/cat :scene spec/scene?))
(defn toggle-project-tree-selection! [^Scene scene]
  (let [project-tree (.lookup scene "#project_tree")
        selection-model (.getSelectionModel project-tree)]
    (when-let [item (.getSelectedItem selection-model)]
      (.setExpanded item (not (.isExpanded item))))))

(fdef move-tab-selection!
  :args (s/cat :scene spec/scene? :pref-state-atom spec/atom? :runtime-state-atom spec/atom? :diff integer?))
(defn move-tab-selection!
  [scene pref-state-atom runtime-state-atom diff]
  (let [paths (map :path (shortcuts/get-tabs @runtime-state-atom))
        index (.indexOf paths (:selection @pref-state-atom))
        max-index (dec (count paths))
        new-index (+ index diff)
        new-index (cond
                    (neg? new-index) max-index
                    (> new-index max-index) 0
                    :else new-index)
        project-tree (.lookup scene "#project_tree")]
    (when (pos? (count paths))
      (update-project-tree-selection! project-tree (nth paths new-index)))))

(fdef set-selection-listener!
  :args (s/cat :pref-state-atom spec/atom? :runtime-state-atom spec/atom?
          :stage spec/stage? :tree spec/pane? :content spec/pane?))
(defn set-selection-listener! [pref-state-atom runtime-state-atom ^Stage stage tree content]
  (let [scene (.getScene stage)
        selection-model (.getSelectionModel tree)]
    (.addListener (.selectedItemProperty selection-model)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (let [parent-path (u/get-project-root-path @pref-state-atom)]
            (some->> old-value
                     .getPath
                     (get (:editor-panes @runtime-state-atom))
                     shortcuts/hide-tooltips!)
            (when new-value
              (-> (swap! pref-state-atom assoc :selection (.getPath new-value))
                  (update-project-buttons! scene))
              (when-let [new-pane (.getPane new-value runtime-state-atom parent-path)]
                (doto (.getChildren content)
                  (.clear)
                  (.add new-pane))))))))))

(fdef set-focused-listener!
  :args (s/cat :pref-state-atom spec/atom? :stage spec/stage? :project-tree spec/pane?))
(defn set-focused-listener! [pref-state-atom ^Stage stage project-tree]
  (.addListener (.focusedProperty stage)
    (reify ChangeListener
      (changed [this observable old-value new-value]
        (when new-value
          (update-project-tree! pref-state-atom project-tree))))))

(fdef remove-from-project-tree!
  :args (s/cat :pref-state-atom spec/atom? :path string?))
(defn remove-from-project-tree! [pref-state-atom ^String path]
  (let [{:keys [project-set]} @pref-state-atom]
    (if (contains? project-set path)
      (swap! pref-state-atom update :project-set disj path)
      (u/delete-parents-recursively! project-set path))))

(fdef set-project-key-listener!
  :args (s/cat :stage spec/stage? :pref-state-atom spec/atom? :runtime-state-atom spec/atom?))
(defn set-project-key-listener! [^Stage stage pref-state-atom runtime-state-atom]
  (let [^Scene scene (.getScene stage)]
    (.addEventHandler scene KeyEvent/KEY_RELEASED
      (reify EventHandler
        (handle [this e]
          (when (.isShortcutDown e)
            (cond
              (= (.getCode e) KeyCode/UP)
              (move-project-tree-selection! scene -1)
              (= (.getCode e) KeyCode/DOWN)
              (move-project-tree-selection! scene 1)
              (= (.getCode e) KeyCode/ENTER)
              (toggle-project-tree-selection! scene)
              (= (.getCode e) KeyCode/PAGE_UP)
              (move-tab-selection! scene pref-state-atom runtime-state-atom -1)
              (= (.getCode e) KeyCode/PAGE_DOWN)
              (move-tab-selection! scene pref-state-atom runtime-state-atom 1))))))))
