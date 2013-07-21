(ns nightcode.projects
  (:require [clojure.java.io :as java.io]
            [nightcode.editors :as editors]
            [nightcode.lein :as lein]
            [nightcode.utils :as utils]
            [seesaw.chooser :as chooser]
            [seesaw.core :as s]
            [seesaw.icon :as icon])
  (:import [javax.swing JRadioButton]))

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

; get project tree and items within it

(defn is-project-path?
  [file]
  (and (.isDirectory file)
       (.exists (java.io/file file "project.clj"))))

(defn get-project-tree
  []
  (s/select @utils/ui-root [:#project-tree]))

(defn get-selected-path
  []
  (utils/tree-path-to-str (.getSelectionPath (get-project-tree))))

(defn get-project-path
  ([] (get-project-path (java.io/file (get-selected-path))))
  ([file]
   (when file
     (if (or (is-project-path? file)
             (contains? @tree-projects (.getCanonicalPath file)))
       (.getCanonicalPath file)
       (get-project-path (.getParentFile file))))))

(defn get-project-root-path
  []
  (-> #(.startsWith (get-selected-path) %)
      (filter @tree-projects)
      first))

; create and manipulate project tree

(defn get-node
  [file]
  {:name (if (is-project-path? file)
           (str "<html><b><font color='gray'>"
                (.getName file)
                "</font></b></html>")
           (.getName file))
   :file file})

(defn get-nodes
  [node children]
  (->> (for [child children]
         (get-node child))
       (cons (when (and (:file node)
                        (-> (.getCanonicalPath (:file node))
                            lein/is-android-project?))
               {:name "<html><b><font color='green'>LogCat</font></b></html>"
                :file (java.io/file "*LogCat*")}))
       (remove nil?)
       vec))

(defn file-node
  [node]
  (let [children (->> (reify java.io.FilenameFilter
                        (accept [this dir filename]
                          (not (.startsWith filename "."))))
                      (.listFiles (:file node))
                      (get-nodes node)
                      delay)]
    (proxy [javax.swing.tree.DefaultMutableTreeNode] [node]
      (getChildAt [i] (file-node (get @children i)))
      (getChildCount [] (count @children))
      (isLeaf [] (or (nil? (:file node))
                     (not (.isDirectory (:file node)))))
      (toString [] (:name node)))))

(defn root-node
  [project-vec]
  (proxy [javax.swing.tree.DefaultMutableTreeNode] []
    (getChildAt [i] (file-node (get-node (java.io/file (nth project-vec i)))))
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
    (-> (s/dialog :content dialog-text
                  :options [remove-btn
                            cancel-btn])
        s/pack!
        s/show!
        (= :remove)
        (when
          (if is-project?
            (utils/write-pref :project-set
                              (set (remove #(= % path) project-set)))
            (utils/delete-file-recursively (-> #(.startsWith path %)
                                               (filter @tree-projects)
                                               first)
                                           path))
          true))))

(defn update-project-tree
  ([]
   (update-project-tree (get-project-tree) nil))
  ([new-selection]
   (update-project-tree (get-project-tree) new-selection))
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
         (when (contains? expansion-set str-path)
           (.expandPath tree tree-path)
           (swap! tree-expansions conj str-path))
         (when (= selection str-path)
           (.setSelectionPath tree tree-path)
           (reset! tree-selection str-path)))))
   ; select the first project if there is nothing selected
   (when (nil? @tree-selection)
     (.setSelectionRow tree 0))
   ; disable buttons if there is still nothing selected
   (when (nil? @tree-selection)
     (doseq [btn [:#remove-button :#new-file-button :#rename-file-button]]
       (s/config! (s/select @utils/ui-root [btn]) :enabled? false)))))

(defn enter-file-path
  ([callback]
   (enter-file-path callback nil))
  ([callback default-file-name]
   (let [selected-path (get-selected-path)
         project-path (get-project-root-path)
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
         s/show!))))

; actions for project tree buttons

(defn new-project
  [e]
  (when-let [dir (chooser/choose-file :type :save)]
    (let [raw-project-name (.getName dir)
          parent-dir (.getParent dir)
          group (s/button-group)
          package-name-text (s/text :visible? false :columns 20)
          types [[:console "Console" "Clojure"]
                 [:seesaw "Desktop" "Clojure"]
                 [:cljs-kickoff "Web" "ClojureScript"]
                 [:android "Android" "Clojure"]
                 [:console-java "Console" "Java"]
                 [:mini2dx-java "Simple Game" "Java"]
                 [:libgdx-java "Advanced Game" "Java"]
                 [:android-java "Android" "Java"]]
          toggle (fn [e]
                   (s/config! package-name-text
                              :visible?
                              (let [id (name (s/id-of e))]
                                (or (>= (.indexOf id "java") 0)
                                    (>= (.indexOf id "android") 0))))
                   (s/text! package-name-text
                            (utils/format-name (str "com." raw-project-name)
                                               (s/id-of (s/selection group))))
                   (s/pack! (s/to-root e)))
          buttons (for [[id name-str lang-str] types]
                    (doto (s/radio :id id
                                   :text (str "<html>"
                                              "<center>"
                                              name-str "<br>"
                                              "<i>" lang-str "</i>"
                                              "</center>")
                                   :group group
                                   :selected? (= id :console)
                                   :valign :center
                                   :halign :center
                                   :listen [:action toggle])
                          (.setSelectedIcon (icon/icon (str (name id) "2.png")))
                          (.setIcon (icon/icon (str (name id) ".png")))
                          (.setVerticalTextPosition JRadioButton/BOTTOM)
                          (.setHorizontalTextPosition JRadioButton/CENTER)))]
      (s/invoke-later
        (-> (s/dialog
              :title "Specify Project Type"
              :content (s/vertical-panel
                         :items [(s/grid-panel :columns 4
                                               :rows 2
                                               :items buttons)
                                 (s/flow-panel :items [package-name-text])])
              :success-fn (fn [pane]
                            (let [project-type (s/id-of (s/selection group))
                                  project-name (-> raw-project-name
                                                   (utils/format-name nil))
                                  package-name (-> (s/text package-name-text)
                                                   (utils/format-name
                                                     project-type))
                                  project-dir (-> parent-dir
                                                  (java.io/file project-name)
                                                  .getCanonicalPath)]
                              (lein/new-project parent-dir project-type
                                                project-name package-name)
                              (add-to-project-tree project-dir)
                              (update-project-tree project-dir))))
            s/pack!
            s/show!)))))

(defn new-file
  [e]
  (enter-file-path (fn [project-path selected-path new-path]
                     (if (.exists (java.io/file new-path))
                       (s/alert "File already exists.")
                       (do
                         (.mkdirs (.getParentFile (java.io/file new-path)))
                         (.createNewFile (java.io/file new-path))
                         (update-project-tree new-path))))
                   "example.clj"))

(defn rename-file
  [e]
  (enter-file-path (fn [project-path selected-path new-path]
                     (.mkdirs (.getParentFile (java.io/file new-path)))
                     (.renameTo (java.io/file selected-path)
                                (java.io/file new-path))
                     (utils/delete-file-recursively project-path selected-path)
                     (update-project-tree new-path))))

(defn import-project
  [e]
  (when-let [dir (chooser/choose-file :type :open :selection-mode :dirs-only)]
    ; offer to create project.clj if necessary
    (when (and (.exists (java.io/file dir "src"))
               (not (.exists (java.io/file dir "project.clj"))))
      (let [cont-btn (s/button :text "Continue"
                               :listen [:action
                                        #(s/return-from-dialog % :cont)])
            create-btn (s/button :text "Create project.clj"
                                 :listen [:action
                                          #(s/return-from-dialog % :create)])]
        (-> (s/dialog :content
                      "You need a project.clj file to build this project."
                      :options [create-btn cont-btn])
            s/pack!
            s/show!
            (= :create)
            (when
              (let [template-name (if (lein/is-android-project? dir)
                                    "android-java"
                                    "console-java")]
                (->> {:raw-name (.getName dir)
                      :namespace "put.your.main.namespace.here"}
                     (lein/create-file-from-template dir
                                                     "project.clj"
                                                     template-name)))))))
    ; show project root in the tree
    (let [dir-path (.getCanonicalPath dir)]
      (add-to-project-tree dir-path)
      (update-project-tree dir-path))))

(defn remove-item
  [e]
  (when (remove-from-project-tree (get-selected-path))
    (update-project-tree (get-project-root-path))))
