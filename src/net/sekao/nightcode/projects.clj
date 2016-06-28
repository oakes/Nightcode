(ns net.sekao.nightcode.projects
  (:require [clojure.java.io :as io]
            [net.sekao.nightcode.builders :as b]
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

(defn project-pane [path]
  (let [pane (FXMLLoader/load (io/resource "project.fxml"))
        builder (-> pane .getItems (.get 1))]
    (b/init-builder! builder path)
    pane))

(defn dir-pane []
  (FXMLLoader/load (io/resource "dir.fxml")))

(defn home-pane [runtime-state]
  (let [pane (FXMLLoader/load (io/resource "home.fxml"))
        docs (-> pane .getChildren (.get 1) .getItems (.get 0))
        repl (-> pane .getChildren (.get 1) .getItems (.get 1))
        process (atom nil)
        web-port (:web-port runtime-state)
        load-repl! (fn []
                     (let [pipes (b/create-pipes)]
                       (b/init-console! repl pipes web-port
                         (fn []
                           (b/refresh-builder! repl true)
                           (b/start-builder-process! repl pipes process "." nil ["clojure.main"])))))]
    ; load the panes
    (.load (.getEngine docs) (str "http://localhost:" web-port "/cheatsheet-full.html"))
    (load-repl!)
    ; set button actions
    (let [back-btn (doto (.lookup pane "#back") (.setDisable true))
          forward-btn (doto (.lookup pane "#forward") (.setDisable true))
          restart-btn (.lookup pane "#restart")
          history (-> docs .getEngine .getHistory)]
      (.setOnAction back-btn
        (reify EventHandler
          (handle [this event]
            (.go history -1))))
      (.setOnAction forward-btn
        (reify EventHandler
          (handle [this event]
            (.go history 1))))
      (.setOnAction restart-btn
        (reify EventHandler
          (handle [this event]
            (load-repl!))))
      (-> history
          .currentIndexProperty
          (.addListener
            (reify ChangeListener
              (changed [this observable old-value new-value]
                (.setDisable back-btn (= 0 (.getCurrentIndex history)))
                (.setDisable forward-btn (-> history .getEntries count dec (= (.getCurrentIndex history)))))))))
    ; return the pane
    pane))

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
                       (home-pane @runtime-state-atom))]
          (swap! runtime-state-atom update :editor-panes assoc path pane)
          pane)))))

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

(defn get-children [files]
  (let [children (FXCollections/observableArrayList)]
    (run! #(.add children (file-node %)) files)
    children))

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

(defn update-project-buttons! [pref-state ^Scene scene]
  (when-let [path (:selection pref-state)]
    (let [rename-button (.lookup scene "#rename")
          remove-button (.lookup scene "#remove")
          file (io/file path)]
      (.setDisable rename-button (not (.isFile file)))
      (.setDisable remove-button
        (and (not (contains? (:project-set pref-state) path))
             (not (.isFile file)))))))

(defn move-project-tree-selection! [^Scene scene diff]
  (let [project-tree (.lookup scene "#project_tree")
        selection-model (.getSelectionModel project-tree)
        index (+ diff (.getSelectedIndex selection-model))]
    (when (>= index 0)
      (.select selection-model index))))

(defn toggle-project-tree-selection! [^Scene scene]
  (let [project-tree (.lookup scene "#project_tree")
        selection-model (.getSelectionModel project-tree)]
    (when-let [item (.getSelectedItem selection-model)]
      (.setExpanded item (not (.isExpanded item))))))

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

(defn set-selection-listener! [pref-state-atom runtime-state-atom ^Stage stage]
  (let [scene (.getScene stage)
        project-tree (.lookup scene "#project_tree")
        content (.lookup scene "#content")
        selection-model (.getSelectionModel project-tree)]
    (.addListener (.selectedItemProperty selection-model)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (-> (swap! pref-state-atom assoc :selection (.getPath new-value))
                (update-project-buttons! scene))
            (let [parent-path (u/get-project-path @pref-state-atom)]
              (when-let [new-pane (.getPane new-value runtime-state-atom parent-path)]
                (doto (.getChildren content)
                  (.clear)
                  (.add new-pane))))))))))

(defn set-focused-listener! [pref-state-atom ^Stage stage project-tree]
  (.addListener (.focusedProperty stage)
    (reify ChangeListener
      (changed [this observable old-value new-value]
        (when new-value
          (update-project-tree! pref-state-atom project-tree))))))

(defn remove-from-project-tree! [pref-state-atom ^String path]
  (let [{:keys [project-set]} @pref-state-atom]
    (if (contains? project-set path)
      (swap! pref-state-atom update :project-set disj path)
      (u/delete-parents-recursively! project-set path))))

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

; specs

(fdef project-pane
  :args (s/cat :path string?)
  :ret spec/pane?)

(fdef dir-pane
  :args (s/cat)
  :ret spec/pane?)

(fdef home-pane
  :args (s/cat :runtime-state map?)
  :ret spec/pane?)

(fdef file-node
  :args (s/cat :file spec/file?)
  :ret spec/tree-item?)

(fdef home-node
  :args (s/cat)
  :ret spec/tree-item?)

(fdef root-node
  :args (s/cat :pref-state map?)
  :ret spec/tree-item?)

(fdef get-children
  :args (s/cat :files :net.sekao.nightcode.spec/files)
  :ret spec/obs-list?)

(fdef set-expanded-listener!
  :args (s/cat :pref-state-atom spec/atom? :tree spec/pane?))

(fdef update-project-tree!
  :args (s/alt
          :args2 (s/cat :pref-state-atom spec/atom? :tree spec/pane?)
          :args3 (s/cat :pref-state-atom spec/atom? :tree spec/pane? :selection (s/nilable string?))))

(fdef update-project-tree-selection!
  :args (s/cat :tree spec/pane? :selection string?))

(fdef update-project-buttons!
  :args (s/cat :pref-state map? :scene spec/scene?))

(fdef move-project-tree-selection!
  :args (s/cat :scene spec/scene? :diff integer?))

(fdef toggle-project-tree-selection!
  :args (s/cat :scene spec/scene?))

(fdef move-tab-selection!
  :args (s/cat :scene spec/scene? :pref-state-atom spec/atom? :runtime-state-atom spec/atom? :diff integer?))

(fdef set-selection-listener!
  :args (s/cat :pref-state-atom spec/atom? :runtime-state-atom spec/atom? :stage spec/stage?))

(fdef set-focused-listener!
  :args (s/cat :pref-state-atom spec/atom? :stage spec/stage? :project-tree spec/pane?))

(fdef remove-from-project-tree!
  :args (s/cat :pref-state-atom spec/atom? :path string?))

(fdef set-project-key-listener!
  :args (s/cat :stage spec/stage? :pref-state-atom spec/atom? :runtime-state-atom spec/atom?))

