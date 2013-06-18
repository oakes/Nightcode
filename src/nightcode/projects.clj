(ns nightcode.projects
  (:require [seesaw.chooser :as chooser]
            [seesaw.core :as s]
            [clojure.java.io :as java.io]
            [nightcode.editors :as editors]
            [nightcode.utils :as utils]))

; keep track of projects, expansions and the selection

(def tree-projects (atom #{}))
(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn add-expansion
  [e]
  (swap! tree-expansions conj (-> e .getPath utils/tree-path-to-str))
  (utils/write-pref :expansion-set @tree-expansions))

(defn remove-expansion
  [e]
  (swap! tree-expansions disj (-> e .getPath utils/tree-path-to-str))
  (utils/write-pref :expansion-set @tree-expansions))

(defn set-selection
  [e]
  (let [path (-> e .getPath utils/tree-path-to-str)]
    (s/config! (s/select @utils/ui-root [:#remove-button])
               :enabled?
               (or (contains? @tree-projects path)
                   (.isFile (java.io/file path))))
    (s/config! (s/select @utils/ui-root [:#new-file-button])
               :visible? (.isDirectory (java.io/file path)))
    (s/config! (s/select @utils/ui-root [:#rename-file-button])
               :visible? (.isFile (java.io/file path)))
    (reset! tree-selection path)
    (editors/show-editor path))
  (utils/write-pref :selection @tree-selection))

; create and manipulate project tree

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
    (getChildAt [i] (file-node (java.io/file (nth project-vec i))))
    (getChildCount [] (count project-vec))))

(defn create-project-tree
  []
  (reset! tree-projects
          (-> #(.getName (java.io/file %))
              (sort-by (utils/read-pref :project-set))
              (set)))
  (-> @tree-projects
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))

(defn add-to-project-tree
  [path]
  (let [project-set (utils/read-pref :project-set)]
    (utils/write-pref :project-set (set (conj project-set path)))))

(defn remove-from-project-tree
  [path]
  (let [is-project? (contains? @tree-projects path)
        cancel-btn (s/button :text "Cancel"
                             :listen [:action
                                      #(s/return-from-dialog % :cancel)])
        remove-btn (s/button :text (if is-project?
                                     "Remove Project"
                                     "Remove File")
                             :listen [:action
                                      #(s/return-from-dialog % :remove)])
        dialog-text
        (if is-project?
          "Remove this project? It WILL NOT be deleted from the disk."
          "Remove this file? It WILL be deleted from the disk.")
        project-set (utils/read-pref :project-set)]
    (when (= :remove
             (-> (s/dialog :content dialog-text
                           :options [remove-btn
                                     cancel-btn]
                           :default-option remove-btn)
                 s/pack!
                 s/show!))
      (if is-project?
        (utils/write-pref :project-set (set (remove #(= % path) project-set)))
        (utils/delete-file-recursively (-> #(.startsWith path %)
                                           (filter @tree-projects)
                                           first)
                                       path))
      true)))

(defn update-project-tree
  ([tree] (update-project-tree tree nil))
  ([tree new-selection]
   ; put new data in the tree
   (.setModel tree (create-project-tree))
   ; wipe out the in-memory expansion/selection
   (reset! tree-expansions #{})
   (reset! tree-selection nil)
   ; read the on-disk expansion/selection and apply them to the tree
   (let [expansion-set (utils/read-pref :expansion-set)
         selection (or new-selection (utils/read-pref :selection))]
     (doseq [i (range) :while (< i (.getRowCount tree))]
       (let [tree-path (.getPathForRow tree i)
             str-path (utils/tree-path-to-str tree-path)]
         (when (or (contains? expansion-set str-path)
                   (and new-selection
                        (.startsWith new-selection str-path)))
           (.expandPath tree tree-path)
           (swap! tree-expansions conj str-path))
         (when (= selection str-path)
           (.setSelectionPath tree tree-path)
           (reset! tree-selection str-path)))))
   ; select the first project if there is nothing selected
   (when (nil? @tree-selection)
     (.setSelectionRow tree 0))
   ; disable buttons if there is still nothing selected
   (doseq [btn [:#remove-button :#new-file-button :#rename-file-button]]
     (s/config! (s/select @utils/ui-root [btn])
              :enabled? (not (nil? @tree-selection))))))

(defn enter-file-path
  [project-tree default-file-name callback]
  (let [selected-path (-> (.getSelectionPath project-tree)
                          utils/tree-path-to-str)
        project-path (-> #(.startsWith selected-path %)
                         (filter @tree-projects)
                         first)
        default-path (str (utils/get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (java.io/file selected-path))))]
    (-> (s/dialog :content (s/vertical-panel
                             :items ["Enter a path relative to the project."
                                     (s/text :id :new-file-path
                                             :text default-path)])
                  :option-type :ok-cancel
                  :success-fn
                  (fn [pane]
                    (let [new-file (->> (s/select pane [:#new-file-path])
                                        s/text
                                        (java.io/file project-path))]
                      (callback project-path
                                selected-path
                                (.getCanonicalPath new-file)))))
        s/pack!
        s/show!)))

; actions for project tree buttons

(defn new-project
  [e]
  (let [project-tree (s/select (s/to-root e) [:#project-tree])]
    (when-let [dir (chooser/choose-file :type :save)]
      (let [dir-path (.getCanonicalPath dir)]
        (add-to-project-tree dir-path)
        (update-project-tree project-tree dir-path)))
      (s/request-focus! project-tree)))

(defn new-file
  [e]
  (let [project-tree (s/select (s/to-root e) [:#project-tree])]
    (enter-file-path
      project-tree
      "example.clj"
      (fn [project-path selected-path new-path]
        (if (.exists (java.io/file new-path))
          (s/alert "File already exists.")
          (do
            (.mkdirs (.getParentFile (java.io/file new-path)))
            (.createNewFile (java.io/file new-path))
            (update-project-tree project-tree new-path)))))))

(defn rename-file
  [e]
  (let [project-tree (s/select (s/to-root e) [:#project-tree])]
    (enter-file-path project-tree
                     nil
                     (fn [project-path selected-path new-path]
                       (.mkdirs (.getParentFile (java.io/file new-path)))
                       (.renameTo (java.io/file selected-path)
                                  (java.io/file new-path))
                       (utils/delete-file-recursively project-path
                                                      selected-path)
                       (update-project-tree project-tree new-path)))))

(defn import-project
  [e]
  (let [project-tree (s/select (s/to-root e) [:#project-tree])]
    (when-let [dir (chooser/choose-file :type :open
                                        :selection-mode :dirs-only)]
      (let [dir-path (.getCanonicalPath dir)]
        (add-to-project-tree dir-path)
        (update-project-tree project-tree dir-path)))
    (s/request-focus! project-tree)))

(defn remove-project-or-file
  [e]
  (let [project-tree (s/select (s/to-root e) [:#project-tree])
        selected-path (-> (.getSelectionPath project-tree)
                          utils/tree-path-to-str)
        project-path (-> #(.startsWith selected-path %)
                         (filter @tree-projects)
                         first)]
    (when (remove-from-project-tree selected-path)
      (update-project-tree project-tree project-path))
    (s/request-focus! project-tree)))
