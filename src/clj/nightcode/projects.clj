(ns nightcode.projects
  (:require [clojure.java.io :as io]
            [nightcode.builders :as b]
            [nightcode.editors :as e]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.process :as proc]
            [nightcode.spec :as spec]
            [nightcode.utils :as u]
            [hawk.core :as hawk]
            [clojure.spec.alpha :as s :refer [fdef]])
  (:import [java.io File FilenameFilter]
           [javafx.scene.control Button ContentDisplay Label TreeItem TreeCell]
           [javafx.scene.image ImageView]
           [javafx.collections FXCollections]
           [javafx.beans.value ChangeListener]
           [javafx.event EventHandler]
           [javafx.fxml FXMLLoader]
           [javafx.concurrent Worker$State]
           [javafx.scene Scene]
           [javafx.stage Stage]
           [javafx.scene.input KeyEvent KeyCode]
           [javafx.application Platform]))

(definterface ProjectTreeItem
  (getPath [] "Unique path representing this item")
  (getPane [*pref-state *runtime-state parent-path] "The pane for the given item")
  (focus [pane] "Focuses on something inside the pane"))

(declare get-children update-project-tree!)

(fdef project-pane
  :args (s/cat :path string? :pref-state map? :*runtime-state spec/atom?)
  :ret spec/pane?)

(defn project-pane [path pref-state *runtime-state]
  (let [pane (FXMLLoader/load (io/resource "project.fxml"))
        builder (-> pane .getItems (.get 1))]
    (b/init-builder! builder path pref-state *runtime-state)
    pane))

(fdef dir-pane
  :args (s/cat :file spec/file? :*pref-state spec/atom? :*runtime-state spec/atom?)
  :ret spec/pane?)

(defn dir-pane [f *pref-state *runtime-state]
  (let [pane (FXMLLoader/load (io/resource "dir.fxml"))]
    (shortcuts/add-tooltips! pane [:#up :#new_file :#open_in_file_browser :#close])
    (doseq [file (.listFiles f)
            :when (-> file .getName (.startsWith ".") not)]
      (-> (.lookup pane "#filegrid")
          .getContent
          .getChildren
          (.add (doto (if-let [icon (u/get-icon-path file)]
                        (Button. "" (doto (Label. (.getName file)
                                            (doto (ImageView. icon)
                                              (.setFitWidth 90)
                                              (.setPreserveRatio true)))
                                      (.setContentDisplay ContentDisplay/TOP)))
                        (Button. (.getName file)))
                  (.setPrefWidth 150)
                  (.setPrefHeight 150)
                  (.setOnAction (reify EventHandler
                                  (handle [this event]
                                    (when-let [project-tree (-> @*runtime-state
                                                                :stage
                                                                .getScene
                                                                (.lookup "#project_tree"))]
                                      (->> file .getCanonicalPath
                                           (update-project-tree! *pref-state project-tree))))))))))
    pane))

(fdef home-pane
  :args (s/cat :*pref-state spec/atom? :*runtime-state spec/atom?)
  :ret spec/pane?)

(defn home-pane [*pref-state *runtime-state]
  (let [pane (FXMLLoader/load (io/resource "home.fxml"))
        docs (-> pane .getChildren (.get 1) .getItems (.get 0))
        repl (-> pane .getChildren (.get 1) .getItems (.get 1))
        *process (atom nil)
        web-port (:web-port @*runtime-state)
        load-repl! (fn []
                     (let [pipes (b/create-pipes)]
                       (b/init-console! "*Home*" *runtime-state repl pipes web-port
                         (fn []
                           (b/refresh-builder! repl true @*pref-state)
                           (b/start-builder-process! repl pipes *process "Starting REPL..." "." ["clojure.main"])))))]
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

(fdef file-node
  :args (s/cat :file spec/file?)
  :ret spec/tree-item?)

(defn file-node [file]
  (let [path (.getCanonicalPath file)
        value (proxy [File] [path]
                (toString []
                  (.getName this)))
        *children (->> (reify FilenameFilter
                         (accept [this dir filename]
                           (not (.startsWith filename "."))))
                       (.listFiles file)
                       get-children
                       delay)]
    (proxy [TreeItem ProjectTreeItem] [value]
      (getChildren []
        (if-not (realized? *children)
          (doto (proxy-super getChildren)
            (.addAll @*children))
          (proxy-super getChildren)))
      (isLeaf []
        (not (.isDirectory file)))
      (getPath []
        path)
      (getPane [*pref-state *runtime-state parent-path]
        (when parent-path
          (let [runtime-state @*runtime-state
                project-pane (or (get-in runtime-state [:projects parent-path :pane])
                                 (project-pane parent-path @*pref-state *runtime-state))
                editors (-> project-pane .getItems (.get 0))]
            (-> editors .getChildren .clear)
            (cond
              (.isDirectory file)
              (-> editors .getChildren (.add (dir-pane file *pref-state *runtime-state)))
              (.isFile file)
              (when-let [pane (or (get-in runtime-state [:editor-panes path])
                                  (e/editor-pane *pref-state *runtime-state file
                                    (when (#{"clj" "cljc"} (-> file .getName u/get-extension))
                                      (partial e/eval-code (:dev? runtime-state)))))]
                (-> editors .getChildren (.add pane))
                (swap! *runtime-state update :editor-panes assoc path pane)))
            (swap! *runtime-state update-in [:projects parent-path]
              (fn [project]
                (assoc project
                  :pane project-pane
                  :file-watcher (or (:file-watcher project)
                                    (e/create-file-watcher parent-path *runtime-state)))))
            project-pane)))
      (focus [pane]
        (some-> (.lookup pane "#webview") .requestFocus)))))

(fdef home-node
  :args (s/cat)
  :ret spec/tree-item?)

(defn home-node []
  (let [path "*Home*"
        value (proxy [Object] []
                (toString []
                  "Home"))]
    (proxy [TreeItem ProjectTreeItem] [value]
      (isLeaf []
        true)
      (getPath []
        path)
      (getPane [*pref-state *runtime-state _]
        (let [pane (or (get-in @*runtime-state [:projects path :pane])
                       (home-pane *pref-state *runtime-state))]
          (swap! *runtime-state assoc-in [:projects path :pane] pane)
          pane))
      (focus [pane]
        (some-> (.lookup pane "#repl") .requestFocus)))))

(fdef root-node
  :args (s/cat :pref-state map?)
  :ret spec/tree-item?)

(defn root-node [pref-state]
  (let [project-files (->> (:project-set pref-state)
                           (map #(io/file %))
                           (sort-by #(.getName %)))
        *children (delay (doto (get-children project-files)
                           (.add 0 (home-node))))]
    (proxy [TreeItem] []
      (getChildren []
        (if-not (realized? *children)
          (doto (proxy-super getChildren)
            (.addAll @*children))
          (proxy-super getChildren)))
      (isLeaf []
        false))))

(fdef get-children
  :args (s/cat :files :nightcode.spec/files)
  :ret spec/obs-list?)

(defn get-children [files]
  (let [children (FXCollections/observableArrayList)]
    (run! #(.add children (file-node %)) files)
    children))

(fdef set-expanded-listener!
  :args (s/cat :*pref-state spec/atom? :tree spec/pane?))

(defn set-expanded-listener! [*pref-state tree]
  (let [root-item (.getRoot tree)]
    (.addEventHandler root-item
      (TreeItem/branchExpandedEvent)
      (reify EventHandler
        (handle [this event]
          (when-let [path (-> event .getTreeItem .getPath)]
            (swap! *pref-state update :expansion-set conj path)))))
    (.addEventHandler root-item
      (TreeItem/branchCollapsedEvent)
      (reify EventHandler
        (handle [this event]
          (when-let [path (-> event .getTreeItem .getPath)]
            (swap! *pref-state update :expansion-set disj path)))))))

(fdef update-project-tree!
  :args (s/alt
          :args2 (s/cat :*pref-state spec/atom? :tree spec/pane?)
          :args3 (s/cat :*pref-state spec/atom? :tree spec/pane? :selection (s/nilable string?))))

(defn update-project-tree!
  ([*pref-state tree]
   (update-project-tree! *pref-state tree nil))
  ([*pref-state tree new-selection]
   (let [state @*pref-state
         _ (doto tree
             (.setShowRoot false)
             (.setRoot (root-node state)))
         _ (set-expanded-listener! *pref-state tree)
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
  :args (s/cat :scene spec/scene? :*pref-state spec/atom? :*runtime-state spec/atom? :diff integer?))

(defn move-tab-selection!
  [scene *pref-state *runtime-state diff]
  (when-let [selection (:selection @*pref-state)]
    (let [paths (-> @*runtime-state :editor-panes keys)
          index (.indexOf paths selection)
          max-index (dec (count paths))
          new-index (+ index diff)
          new-index (cond
                      (neg? new-index) max-index
                      (> new-index max-index) 0
                      :else new-index)
          project-tree (.lookup scene "#project_tree")]
      (when (pos? (count paths))
        (update-project-tree-selection! project-tree (nth paths new-index))))))

(fdef set-selection-listener!
  :args (s/cat :*pref-state spec/atom? :*runtime-state spec/atom? :stage spec/stage?))

(defn set-selection-listener! [*pref-state *runtime-state ^Stage stage]
  (let [scene (.getScene stage)
        project-tree (.lookup scene "#project_tree")
        content (.lookup scene "#content")
        selection-model (.getSelectionModel project-tree)]
    (.addListener (.selectedItemProperty selection-model)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (when new-value
            (-> (swap! *pref-state assoc :selection (.getPath new-value))
                (update-project-buttons! scene))
            (let [parent-path (u/get-project-path @*pref-state)]
              (shortcuts/hide-tooltips! content)
              (shortcuts/update-tabs! scene @*pref-state @*runtime-state)
              (when-let [new-pane (.getPane new-value *pref-state *runtime-state parent-path)]
                (doto (.getChildren content)
                  (.clear)
                  (.add new-pane))
                (Platform/runLater
                  (fn []
                    (.focus new-value new-pane)))))))))))

(fdef set-focused-listener!
  :args (s/cat :*pref-state spec/atom? :*runtime-state spec/atom? :stage spec/stage? :project-tree spec/pane?))

(defn set-focused-listener! [*pref-state *runtime-state ^Stage stage project-tree]
  (.addListener (.focusedProperty stage)
    (reify ChangeListener
      (changed [this observable old-value new-value]
        (when new-value
          (e/remove-non-existing-editors! *runtime-state)
          (update-project-tree! *pref-state project-tree))))))

(fdef remove-from-project-tree!
  :args (s/cat :*pref-state spec/atom? :path string?))

(defn remove-from-project-tree! [*pref-state ^String path]
  (let [{:keys [project-set]} @*pref-state]
    (if (contains? project-set path)
      (swap! *pref-state update :project-set disj path)
      (u/delete-parents-recursively! project-set path))))

(fdef set-project-key-listener!
  :args (s/cat :stage spec/stage? :*pref-state spec/atom? :*runtime-state spec/atom?))

(defn set-project-key-listener! [^Stage stage *pref-state *runtime-state]
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
              (move-tab-selection! scene *pref-state *runtime-state -1)
              (= (.getCode e) KeyCode/PAGE_DOWN)
              (move-tab-selection! scene *pref-state *runtime-state 1))))))))

(fdef remove-project!
  :args (s/cat :path string? :*runtime-state spec/atom?))

(defn remove-project! [^String path *runtime-state]
  (when-let [{:keys [pane file-watcher]} (get-in @*runtime-state [:projects path])]
    (swap! *runtime-state update :projects dissoc path)
    (shortcuts/hide-tooltips! pane)
    (-> pane .getParent .getChildren (.remove pane))
    (hawk/stop! file-watcher))
  (when-let [*process (get-in @*runtime-state [:processes path])]
    (proc/stop-process! *process)
    (swap! *runtime-state update :processes dissoc path)))

