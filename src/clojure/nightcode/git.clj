(ns nightcode.git
  (:require [clojure.java.io :as io]
            [clojure.string :as string]
            [hiccup.core :as h]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [seesaw.core :as s])
  (:import [java.io ByteArrayOutputStream]
           [javax.swing JTree]
           [javax.swing.event HyperlinkEvent$EventType TreeSelectionListener]
           [javax.swing.text.html HTMLEditorKit StyleSheet]
           [javax.swing.tree DefaultMutableTreeNode DefaultTreeModel
            TreeSelectionModel]
           [org.eclipse.jgit.api Git]
           [org.eclipse.jgit.diff DiffEntry DiffFormatter]
           [org.eclipse.jgit.dircache DirCacheIterator]
           [org.eclipse.jgit.internal.storage.file FileRepository]
           [org.eclipse.jgit.lib PersonIdent ProgressMonitor Repository]
           [org.eclipse.jgit.revwalk RevCommit]
           [org.eclipse.jgit.transport URIish]
           [org.eclipse.jgit.treewalk CanonicalTreeParser EmptyTreeIterator
            FileTreeIterator]))

(def ^:const git-name "Git")
(def ^:const max-commits 50)

; commands

(defn address->name
  [s]
  (when (.endsWith s ".git")
    (-> s URIish. .getHumanishName)))

(defn progress-monitor
  [dialog cancelled?]
  (reify ProgressMonitor
    (beginTask [this title total-work])
    (endTask [this]
      (s/invoke-later
        (s/dispose! dialog)))
    (isCancelled [this] @cancelled?)
    (start [this total-tasks])
    (update [this completed])))

(defn clone!
  [^String uri f progress]
  (-> (Git/cloneRepository)
      (.setURI uri)
      (.setDirectory f)
      (.setProgressMonitor progress)
      .call
      .close))

(defn clone-with-dialog!
  [^String uri f]
  (let [cancelled? (atom false)
        exception (atom nil)
        path (promise)
        d (dialogs/cancel-dialog (str (utils/get-string :cloning-project)
                                      \newline
                                      \newline
                                      (format (utils/get-string :from) uri)
                                      \newline
                                      (format (utils/get-string :to)
                                              (.getCanonicalPath f))))]
    (future (try (clone! uri f (progress-monitor d cancelled?))
              (catch Exception e
                (when-not @cancelled?
                  (reset! exception e)
                  (s/invoke-later
                    (s/dispose! d)
                    (dialogs/show-simple-dialog! (.getMessage e)))))
              (finally
                (if (or @cancelled? @exception)
                  (do
                    (deliver path nil)
                    (utils/delete-children-recursively! f))
                  (deliver path (.getCanonicalPath f))))))
    (reset! cancelled? (some? (s/show! d)))
    @path))

(defn do-with-dialog!
  [git-fn f dialog-text]
  (let [cancelled? (atom false)
        exception (atom nil)
        d (dialogs/cancel-dialog dialog-text)]
    (future (try (git-fn f (progress-monitor d cancelled?))
              (catch Exception e
                (when-not @cancelled?
                  (reset! exception e)
                  (s/invoke-later
                    (s/dispose! d)
                    (dialogs/show-simple-dialog! (.getMessage e)))))))
    (reset! cancelled? (some? (s/show! d)))))

(defn pull!
  [f progress]
  (-> f FileRepository. Git. .pull (.setProgressMonitor progress) .call .close))

(defn push!
  [f progress]
  (-> f FileRepository. Git. .push (.setProgressMonitor progress) .call .close))

; ui

(defn git-file
  [f]
  (io/file f ".git"))

(defn escape-html
  [text]
  (-> text
      (string/replace "&" "&amp;")
      (string/replace "<" "&lt;")
      (string/replace ">" "&gt;")))

(defn format-diff!
  [^ByteArrayOutputStream out ^DiffFormatter df ^DiffEntry diff]
  (.format df diff)
  (let [s (.toString out "UTF-8")]
    (.reset out)
    s))

(defn add-formatting
  [s]
  (cond
    (or (.startsWith s "+++")
        (.startsWith s "---"))
    [:pre {:style "font-family: monospace"} s]
    
    (.startsWith s "+")
    [:pre {:style (format "font-family: monospace; color: %s;"
                          (ui/green-html-color))} s]
    
    (.startsWith s "-")
    [:pre {:style (format "font-family: monospace; color: %s;"
                          (ui/red-html-color))} s]
    
    :else
    [:pre {:style "font-family: monospace"} s]))

(defn diff-trees
  [^Repository repo ^RevCommit commit]
  (cond
    ; a non-first commit
    (some-> commit .getParentCount (> 0))
    [(.getParent commit 0)
     commit]
    ; the first commit
    commit
    [(EmptyTreeIterator.)
     (doto (CanonicalTreeParser.)
       (.reset (.newObjectReader repo) (.getTree commit)))]
    ; uncommitted changes
    :else
    [(if-let [head (.resolve repo "HEAD^{tree}")]
       (doto (CanonicalTreeParser.)
         (.reset (.newObjectReader repo) head))
       (-> repo .readDirCache DirCacheIterator.))
     (FileTreeIterator. repo)]))

(defn ident->str
  [^PersonIdent ident]
  (escape-html (str (.getName ident) " <" (.getEmailAddress ident) ">")))

(defn clj->html
  [& forms]
  (h/html [:html
           [:body {:style (format "color: %s" (ui/html-color))}
            forms]]))

(defn create-html
  [^Git git ^RevCommit commit]
  (clj->html
    [:div {:class "head"} (or (some-> commit .getFullMessage escape-html)
                              (utils/get-string :changes))]
    (when commit
      (list [:div (format (utils/get-string :author)
                          (-> commit .getAuthorIdent ident->str))]
            [:div (format (utils/get-string :committer)
                          (-> commit .getCommitterIdent ident->str))]
            [:div (format (utils/get-string :commit-time)
                          (-> commit .getCommitTime utils/format-date))]))
    (let [out (ByteArrayOutputStream.)
          repo (.getRepository git)
          df (doto (DiffFormatter. out)
               (.setRepository repo))
          [old-tree new-tree] (diff-trees repo commit)]
      (for [diff (.scan df old-tree new-tree)]
        (->> (format-diff! out df diff)
             string/split-lines
             (map escape-html)
             (map add-formatting)
             (#(conj % [:br] [:br])))))))

(defn commit-node
  [^RevCommit commit]
  (proxy [DefaultMutableTreeNode] [commit]
    (toString [] (if-not commit
                   (h/html [:html
                            [:div {:style "color: orange; font-weight: bold;"}
                             (utils/get-string :changes)]])
                   (let [msg (.getShortMessage commit)]
                     (if (seq msg)
                       msg
                       (-> commit .getCommitTime utils/format-date)))))))

(defn root-node
  [commits]
  (proxy [DefaultMutableTreeNode] []
    (getChildAt [i] (commit-node (nth commits i)))
    (getChildCount [] (count commits))))

(defn selected-commit
  [^JTree sidebar]
  (some-> sidebar .getSelectionPath .getLastPathComponent .getUserObject))

(defn selected-row
  [^JTree sidebar commits]
  (when-let [^RevCommit selected-commit (selected-commit sidebar)]
    (->> (map-indexed vector commits)
         (filter (fn [[index ^RevCommit commit]]
                   (= (some-> commit .getId)
                      (some-> selected-commit .getId))))
         first
         first)))

(defn create-content
  []
  (let [css (doto (StyleSheet.) (.importStyleSheet (io/resource "git.css")))
        kit (doto (HTMLEditorKit.) (.setStyleSheet css))]
    (doto (s/editor-pane :id :git-content
                         :editable? false
                         :content-type "text/html")
      (.setEditorKit kit)
      (.setBackground (ui/background-color)))))

(defn create-sidebar
  []
  (doto (s/tree :id :git-sidebar)
    (.setRootVisible false)
    (.setShowsRootHandles false)
    (-> .getSelectionModel
        (.setSelectionMode TreeSelectionModel/SINGLE_TREE_SELECTION))))

(defn update-content!
  [^JTree sidebar content ^Git git ^RevCommit commit]
  (.setText content (clj->html (utils/get-string :loading)))
  (future
    (let [s (create-html git commit)]
      (s/invoke-later
        (when (= commit (selected-commit sidebar))
          (doto content
            (.setText s)
            (.setCaretPosition 0)))))))

(defn update-sidebar!
  ([]
    (let [{:keys [sidebar
                  content
                  offset]} (get @editors/editors @ui/tree-selection)
          path (ui/get-project-root-path)]
      (when (and sidebar content offset path)
        (update-sidebar! sidebar content offset (git-file path)))))
  ([^JTree sidebar content offset f]
    ; remove existing listener
    (doseq [l (.getTreeSelectionListeners sidebar)]
      (.removeTreeSelectionListener sidebar l))
    ; add model and listener, then re-select the row
    (let [repo (FileRepository. f)
          git (Git. repo)
          commits (cons nil ; represents uncommitted changes
                        (try
                          (-> git .log (.setMaxCount max-commits)
                              (.setSkip @offset) .call .iterator iterator-seq)
                          (catch Exception _ [])))
          selected-row (selected-row sidebar commits)]
      (doto sidebar
        (.setModel (DefaultTreeModel. (root-node commits)))
        (.addTreeSelectionListener
          (reify TreeSelectionListener
            (valueChanged [this e]
              (->> (some-> e .getPath .getLastPathComponent .getUserObject)
                   (update-content! sidebar content git)))))
        (.setSelectionRow (or selected-row 0))))))

(def ^:dynamic *widgets* [:pull :push :close])

(defn create-actions
  [f]
  {:pull (fn [& _]
           (do-with-dialog! pull! f (utils/get-string :pulling-changes)))
   :push (fn [& _]
           (do-with-dialog! push! f (utils/get-string :pushing-changes)))
   :configure (fn [& _])
   :close editors/close-selected-editor!})

(defn create-widgets
  [actions]
  {:pull (ui/button :id :pull
                    :text (utils/get-string :pull)
                    :listen [:action (:pull actions)])
   :push (ui/button :id :push
                    :text (utils/get-string :push)
                    :listen [:action (:push actions)])
   :configure (ui/button :id :configure
                         :text (utils/get-string :configure)
                         :listen [:action (:configure actions)])
   :close (ui/button :id :close
                     :text "X"
                     :listen [:action (:close actions)])})

(defn update-paging-buttons!
  ([offset-atom]
    (some-> @ui/root (update-paging-buttons! offset-atom)))
  ([panel offset-atom]
    (let [back (s/select panel [:#git-back])]
      (s/config! back :enabled? (> @offset-atom 0)))))

(defn create-paging-buttons
  [offset-atom]
  [(s/button :id :git-back
             :text (shortcuts/wrap-hint-text "&larr;")
             :listen [:action (fn [& _]
                                (swap! offset-atom - max-commits)
                                (update-paging-buttons! offset-atom)
                                (some-> (update-sidebar!)
                                        (s/scroll! :to :top)))])
   (s/button :id :git-forward
             :text (shortcuts/wrap-hint-text "&rarr;")
             :listen [:action (fn [& _]
                                (swap! offset-atom + max-commits)
                                (update-paging-buttons! offset-atom)
                                (some-> (update-sidebar!)
                                        (s/scroll! :to :top)))])])

(defmethod editors/create-editor :git [_ path]
  (when (= (.getName (io/file path)) git-name)
    (let [; get the file object of the .git directory
          f (-> path io/file .getParentFile git-file)
          ; create the pane
          offset-atom (atom 0)
          content (create-content)
          sidebar (doto (create-sidebar)
                    (update-sidebar! content offset-atom f))
          paging-panel (doto (s/horizontal-panel
                               :items (create-paging-buttons offset-atom))
                         (update-paging-buttons! offset-atom))
          git-pane (s/border-panel
                     :west (s/border-panel :center (s/scrollable
                                                     sidebar :hscroll :never)
                                           :south paging-panel
                                           :size [200 :by 0])
                     :center (s/scrollable content))
          ; create the actions and widgets
          actions (create-actions f)
          widgets (create-widgets actions)
          ; create the bar that holds the widgets
          widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
      ; add the widget bar if necessary
      (when (> (count *widgets*) 0)
        (doto git-pane
          (s/config! :north widget-bar)
          shortcuts/create-hints!
          (shortcuts/create-mappings! actions)))
      ; return a map describing the view
      {:view git-pane
       :sidebar sidebar
       :content content
       :offset offset-atom
       :close-fn! (fn [])
       :should-remove-fn #(not (.exists f))
       :italicize-fn (fn [] false)})))

(defmethod ui/adjust-nodes :git [_ parent children]
  (if (some-> (:file parent) git-file .exists)
    (cons {:html "<html><b><font color='orange'>Git</font></b></html>"
           :name git-name
           :file (io/file (:file parent) git-name)}
          children)
    children))

(add-watch ui/tree-selection
           :update-git
           (fn [_ _ _ _]
             (update-sidebar!)))
