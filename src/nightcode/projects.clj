(ns nightcode.projects
  (:use nightcode.editors
        nightcode.utils
        [seesaw.core :only [alert
                            dialog
                            button
                            return-from-dialog
                            pack!
                            show!
                            config!
                            request-focus!
                            select
                            to-root
                            text
                            vertical-panel]]
        [seesaw.chooser :only [choose-file]]
        [clojure.java.io :only [file]]))

; keep track of projects, expansions and the selection

(def tree-projects (atom #{}))
(def tree-expansions (atom #{}))
(def tree-selection (atom nil))

(defn add-expansion
  [e]
  (swap! tree-expansions conj (-> e .getPath tree-path-to-str))
  (write-pref :expansion-set @tree-expansions))

(defn remove-expansion
  [e]
  (swap! tree-expansions disj (-> e .getPath tree-path-to-str))
  (write-pref :expansion-set @tree-expansions))

(defn set-selection
  [e]
  (let [path (-> e .getPath tree-path-to-str)]
    (config! (select @ui-root [:#remove-button])
             :enabled?
             (or (contains? @tree-projects path)
                 (.isFile (file path))))
    (config! (select @ui-root [:#new-file-button])
             :visible? (.isDirectory (file path)))
    (config! (select @ui-root [:#rename-file-button])
             :visible? (.isFile (file path)))
    (reset! tree-selection path)
    (show-editor path))
  (write-pref :selection @tree-selection))

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
    (getChildAt [i] (file-node (file (nth project-vec i))))
    (getChildCount [] (count project-vec))))

(defn create-project-tree
  []
  (reset! tree-projects
          (-> #(.getName (file %))
              (sort-by (read-pref :project-set))
              (set)))
  (-> @tree-projects
      vec
      root-node
      (javax.swing.tree.DefaultTreeModel. false)))

(defn add-to-project-tree
  [path]
  (let [project-set (read-pref :project-set)]
    (write-pref :project-set (set (conj project-set path)))))

(defn remove-from-project-tree
  [path]
  (let [is-project? (contains? @tree-projects path)
        cancel-button (button :text "Cancel"
                              :listen [:action #(return-from-dialog % :cancel)])
        remove-button (button :text (if is-project?
                                      "Remove Project"
                                      "Remove File")
                              :listen [:action #(return-from-dialog % :remove)])
        dialog-text
        (if is-project?
          "Remove this project? It WILL NOT be deleted from the disk."
          "Remove this file? It WILL be deleted from the disk.")
        project-set (read-pref :project-set)]
    (when (= :remove
             (-> (dialog :content dialog-text
                         :options [remove-button
                                   cancel-button]
                         :default-option remove-button)
                 pack!
                 show!))
      (if is-project?
        (write-pref :project-set (set (remove #(= % path) project-set)))
        (delete-file-recursively (-> #(.startsWith path %)
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
   (let [expansion-set (read-pref :expansion-set)
         selection (or new-selection (read-pref :selection))]
     (doseq [i (range) :while (< i (.getRowCount tree))]
       (let [tree-path (.getPathForRow tree i)
             str-path (tree-path-to-str tree-path)]
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
     (config! (select @ui-root [btn])
              :enabled? (not (nil? @tree-selection))))))

(defn enter-file-path
  [project-tree default-file-name callback]
  (let [selected-path (-> (.getSelectionPath project-tree)
                          tree-path-to-str)
        project-path (-> #(.startsWith selected-path %)
                         (filter @tree-projects)
                         first)
        default-path (str (get-relative-dir project-path selected-path)
                          (or default-file-name
                              (.getName (file selected-path))))]
    (-> (dialog :content (vertical-panel
                           :items ["Enter a path relative to the project."
                                   (text :id :new-file-path
                                         :text default-path)])
                :option-type :ok-cancel
                :success-fn
                (fn [pane]
                  (let [new-file (->> (text (select pane [:#new-file-path]))
                                      (file project-path))]
                    (callback project-path
                              selected-path
                              (.getCanonicalPath new-file)))))
        pack!
        show!)))

; actions for project tree buttons

(defn new-project
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])]
    (when-let [dir (choose-file :type :save)]
      (let [dir-path (.getCanonicalPath dir)]
        (add-to-project-tree dir-path)
        (update-project-tree project-tree dir-path)))
      (request-focus! project-tree)))

(defn new-file
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])]
    (enter-file-path
      project-tree
      "example.clj"
      (fn [project-path selected-path new-path]
        (if (.exists (file new-path))
          (alert "File already exists.")
          (do
            (.mkdirs (.getParentFile (file new-path)))
            (.createNewFile (file new-path))
            (update-project-tree project-tree new-path)))))))

(defn rename-file
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])]
    (enter-file-path project-tree
                     nil
                     (fn [project-path selected-path new-path]
                       (.mkdirs (.getParentFile (file new-path)))
                       (.renameTo (file selected-path) (file new-path))
                       (delete-file-recursively project-path selected-path)
                       (update-project-tree project-tree new-path)))))

(defn import-project
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])]
    (when-let [dir (choose-file :type :open
                                :selection-mode :dirs-only)]
      (let [dir-path (.getCanonicalPath dir)]
        (add-to-project-tree dir-path)
        (update-project-tree project-tree dir-path)))
    (request-focus! project-tree)))

(defn remove-project-or-file
  [e]
  (let [project-tree (select (to-root e) [:#project-tree])
        selected-path (-> (.getSelectionPath project-tree)
                          tree-path-to-str)
        project-path (-> #(.startsWith selected-path %)
                         (filter @tree-projects)
                         first)]
    (when (remove-from-project-tree selected-path)
      (update-project-tree project-tree project-path))
    (request-focus! project-tree)))
