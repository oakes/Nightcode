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
           [org.eclipse.jgit.api Git ResetCommand$ResetType]
           [org.eclipse.jgit.diff DiffEntry DiffFormatter]
           [org.eclipse.jgit.dircache DirCacheIterator]
           [org.eclipse.jgit.internal.storage.file FileRepository]
           [org.eclipse.jgit.lib PersonIdent ProgressMonitor Repository]
           [org.eclipse.jgit.revwalk RevCommit]
           [org.eclipse.jgit.transport CredentialItem$CharArrayType
            CredentialItem$StringType CredentialsProvider
            CredentialsProviderUserInfo URIish]
           [org.eclipse.jgit.treewalk CanonicalTreeParser EmptyTreeIterator
            FileTreeIterator]))

(def ^:const git-name "Git")
(def ^:const max-commits 50)

; utils

(defn address->name
  [s]
  (when (.endsWith s ".git")
    (-> s URIish. .getHumanishName)))

(defn remote-url
  [^FileRepository repo]
  (-> repo .getConfig (.getString "remote" "origin" "url")))

(def creds
  (delay
    (proxy [CredentialsProvider] []
      (isInteractive [] false)
      (supports [& items] true)
      (get [uri items]
        (let [success? (promise)]
          (s/invoke-later
            (doseq [item items]
              (when-not (realized? success?)
                (if-let [s (dialogs/show-input-dialog! (.getPromptText item)
                                                       (.isValueSecure item))]
                  (cond
                    (isa? (type item) CredentialItem$CharArrayType)
                    (.setValue item (char-array s))
                    (isa? (type item) CredentialItem$StringType)
                    (.setValue item s))
                  (deliver success? false))))
            (deliver success? true))
          @success?)))))

(defn progress-monitor
  [dialog cancelled?]
  (let [description (s/select dialog [:#description])
        bar (s/select dialog [:#progress-bar])]
    (reify ProgressMonitor
      (beginTask [this title total-work]
        (s/invoke-later
          (some-> description (s/config! :text title))
          (some-> bar (s/config! :value 0 :max total-work))
          (s/pack! dialog)))
      (endTask [this])
      (isCancelled [this] @cancelled?)
      (start [this total-tasks])
      (update [this unit]
        (s/invoke-later
          (some-> bar (s/config! :value (+ unit (s/config bar :value)))))))))

; commands

(defn clone!
  [^String uri f progress]
  (-> (Git/cloneRepository)
      (.setURI uri)
      (.setDirectory f)
      (.setCredentialsProvider @creds)
      (.setProgressMonitor progress)
      .call
      .close))

(defn clone-with-dialog!
  [^String uri f]
  (let [cancelled? (atom false)
        exception (atom nil)
        path (promise)
        d (dialogs/progress-dialog)]
    (future (try
              (clone! uri f (progress-monitor d cancelled?))
              (s/invoke-later (s/dispose! d))
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
  [git-fn! repo]
  (let [cancelled? (atom false)
        exception (atom nil)
        d (dialogs/progress-dialog)]
    (future (try
              (git-fn! repo (progress-monitor d cancelled?))
              (s/invoke-later (s/dispose! d))
              (catch Exception e
                (when-not @cancelled?
                  (reset! exception e)
                  (s/invoke-later
                    (s/dispose! d)
                    (dialogs/show-simple-dialog! (.getMessage e)))))))
    (reset! cancelled? (some? (s/show! d)))))

(defn pull!
  [^FileRepository repo ^ProgressMonitor progress]
  (-> repo Git. .pull
      (.setCredentialsProvider @creds)
      (.setProgressMonitor progress)
      .call))

(defn push!
  [^FileRepository repo ^ProgressMonitor progress]
  (-> repo Git. .push
      (.setCredentialsProvider @creds)
      (.setProgressMonitor progress)
      .call))

(defn add-all!
  [^FileRepository repo]
  (-> repo Git. .add (.addFilepattern ".") .call))

(defn reset-all!
  [^FileRepository repo]
  (-> repo Git. .reset (.setMode ResetCommand$ResetType/MIXED) .call))

(defn commit!
  [^FileRepository repo]
  (when-let [message (dialogs/show-input-dialog! (utils/get-string :message)
                                                 false)]
    (add-all! repo)
    (-> repo Git. .commit (.setMessage message) .call)))

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

(defn add-lines
  [lines]
  (concat [[:br] [:br]]
          lines))

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
  [^FileRepository repo ^RevCommit commit]
  (let [out (ByteArrayOutputStream.)
        df (doto (DiffFormatter. out)
             (.setRepository repo))
        [old-tree new-tree] (diff-trees repo commit)
        diffs (.scan df old-tree new-tree)]
    (clj->html
      (if commit
        (list [:div {:class "head"} (-> commit .getFullMessage escape-html)]
              [:div (format (utils/get-string :author)
                            (-> commit .getAuthorIdent ident->str))]
              [:div (format (utils/get-string :committer)
                            (-> commit .getCommitterIdent ident->str))]
              [:div (format (utils/get-string :commit-time)
                            (-> commit .getCommitTime utils/format-date))])
        (list [:div {:class "head"} (utils/get-string :changes)]
              (when (seq diffs)
                [:div {:class "link"}
                 [:a {:href "commit"} (utils/get-string :commit)]])))
      (for [diff diffs]
        (->> (format-diff! out df diff)
             string/split-lines
             (map escape-html)
             (map add-formatting)
             add-lines)))))

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
  [^FileRepository repo]
  (let [css (doto (StyleSheet.) (.importStyleSheet (io/resource "git.css")))
        kit (doto (HTMLEditorKit.) (.setStyleSheet css))]
    (doto (s/editor-pane :id :git-content
                         :editable? false
                         :content-type "text/html")
      (.setEditorKit kit)
      (s/listen :hyperlink
                (fn [e]
                  (when (= (.getEventType e)
                           HyperlinkEvent$EventType/ACTIVATED)
                    (when-let [command (.getDescription e)]
                      ; run the command
                      (case command
                        "commit" (commit! repo)
                        nil)
                      ; refresh the content
                      (reset! ui/tree-selection @ui/tree-selection)))))
      (.setBackground (ui/background-color)))))

(defn create-sidebar
  []
  (doto (s/tree :id :git-sidebar)
    (.setRootVisible false)
    (.setShowsRootHandles false)
    (-> .getSelectionModel
        (.setSelectionMode TreeSelectionModel/SINGLE_TREE_SELECTION))))

(defn update-content!
  [^JTree sidebar content ^FileRepository repo ^RevCommit commit]
  (.setText content (clj->html (utils/get-string :loading)))
  (future
    (let [s (create-html repo commit)]
      (s/invoke-later
        (when (= commit (selected-commit sidebar))
          (doto content
            (.setText s)
            (.setCaretPosition 0)))))))

(defn update-sidebar!
  ([]
    (let [{:keys [sidebar
                  repo
                  content
                  offset]} (get @editors/editors @ui/tree-selection)]
      (when (and sidebar repo content offset)
        (update-sidebar! sidebar repo content offset))))
  ([^JTree sidebar ^FileRepository repo content offset]
    ; remove existing listener
    (doseq [l (.getTreeSelectionListeners sidebar)]
      (.removeTreeSelectionListener sidebar l))
    ; add model and listener, then re-select the row
    (let [commits (cons nil ; represents uncommitted changes
                        (try
                          (-> repo Git. .log (.setMaxCount max-commits)
                              (.setSkip @offset) .call .iterator iterator-seq)
                          (catch Exception _ [])))
          selected-row (selected-row sidebar commits)]
      (doto sidebar
        (.setModel (DefaultTreeModel. (root-node commits)))
        (.addTreeSelectionListener
          (reify TreeSelectionListener
            (valueChanged [this e]
              (->> (some-> e .getPath .getLastPathComponent .getUserObject)
                   (update-content! sidebar content repo)))))
        (.setSelectionRow (or selected-row 0))))))

(def ^:dynamic *widgets* [:pull :push :close])

(defn create-actions
  [^FileRepository repo]
  {:pull (fn [& _]
           (do-with-dialog! pull! repo))
   :push (fn [& _]
           (do-with-dialog! push! repo))
   :close editors/close-selected-editor!})

(defn create-widgets
  [actions]
  {:pull (ui/button :id :pull
                    :text (utils/get-string :pull)
                    :listen [:action (:pull actions)])
   :push (ui/button :id :push
                    :text (utils/get-string :push)
                    :listen [:action (:push actions)])
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
    (let [; get the file object and repo
          f (-> path io/file .getParentFile git-file)
          repo (FileRepository. f)
          ; create the pane
          offset-atom (atom 0)
          content (create-content repo)
          sidebar (doto (create-sidebar)
                    (update-sidebar! repo content offset-atom))
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
          actions (create-actions repo)
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
       :repo repo
       :content content
       :offset offset-atom
       :close-fn! (fn []
                    (.close repo))
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
