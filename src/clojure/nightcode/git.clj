(ns nightcode.git
  (:require [clojure.java.io :as io]
            [clojure.string :as string]
            [hiccup.core :as h]
            [hiccup.util :as hu]
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
           [org.eclipse.jgit.internal.storage.file FileRepository]
           [org.eclipse.jgit.lib PersonIdent Repository]
           [org.eclipse.jgit.revwalk RevCommit]
           [org.eclipse.jgit.treewalk CanonicalTreeParser EmptyTreeIterator
            FileTreeIterator]))

(def ^:const git-name "*Git*")
(def ^:const max-commits 50)

(defn git-file
  [path]
  (io/file path ".git"))

(defn git-project?
  [path]
  (.exists (git-file path)))

(defn format-diff!
  [^ByteArrayOutputStream out ^DiffFormatter df ^DiffEntry diff]
  (.format df diff)
  (let [s (.toString out "UTF-8")]
    (.reset out)
    s))

(defn add-bold
  [s]
  [:pre {:style "font-family: monospace; font-weight: bold;"} s])

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
    [(some-> commit (.getParent 0) .getTree)
     (some-> commit .getTree)]
    ; the first commit
    commit
    [(EmptyTreeIterator.)
     (FileTreeIterator. repo)]
    ; uncommitted changes
    :else
    [(doto (CanonicalTreeParser.)
       (.reset (.newObjectReader repo) (.resolve repo "HEAD^{tree}")))
     (FileTreeIterator. repo)]))

(defn ident->str
  [^PersonIdent ident]
  (hu/escape-html (str (.getName ident) " <" (.getEmailAddress ident) ">")))

(defn clj->html
  [& forms]
  (h/html [:html
           [:body {:style (format "color: %s" (ui/html-color))}
            forms]]))

(defn create-html
  [^Git git ^RevCommit commit]
  (clj->html
    [:div {:class "head"} (or (some-> commit .getFullMessage hu/escape-html)
                              (utils/get-string :uncommitted-changes))]
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
             (map hu/escape-html)
             (map add-formatting)
             (#(conj % [:br] [:br])))))))

(defn commit-node
  [^RevCommit commit]
  (proxy [DefaultMutableTreeNode] [commit]
    (toString [] (or (some-> commit .getShortMessage)
                     (h/html [:html
                              [:div {:style "color: orange; font-weight: bold;"}
                               (utils/get-string :uncommitted-changes)]])))))

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
  (future
    (.setText content (clj->html (utils/get-string :loading)))
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
        (update-sidebar! sidebar content offset path))))
  ([^JTree sidebar content offset path]
    ; remove existing listener
    (doseq [l (.getTreeSelectionListeners sidebar)]
      (.removeTreeSelectionListener sidebar l))
    ; add model and listener, then re-select the row
    (let [repo (FileRepository. (git-file path))
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

(def ^:dynamic *widgets* [])

(defn create-actions
  []
  {:pull (fn [& _])
   :push (fn [& _])
   :reset (fn [& _])
   :revert (fn [& _])
   :configure (fn [& _])})

(defn create-widgets
  [actions]
  {:pull (ui/button :id :pull
                    :text (utils/get-string :pull)
                    :listen [:action (:pull actions)])
   :push (ui/button :id :push
                    :text (utils/get-string :push)
                    :listen [:action (:push actions)])
   :reset (ui/button :id :reset
                     :text (utils/get-string :reset)
                     :listen [:action (:reset actions)])
   :revert (ui/button :id :revert
                      :text (utils/get-string :revert)
                      :listen [:action (:revert actions)])
   :configure (ui/button :id :configure
                         :text (utils/get-string :configure)
                         :listen [:action (:configure actions)])})

(defn update-paging-buttons!
  ([offset-atom]
    (some-> @ui/root (update-paging-buttons! offset-atom)))
  ([panel offset-atom]
    (let [back (s/select panel [:#git-back])
          forward (s/select panel [:#git-forward])]
      (s/config! back :enabled? (> @offset-atom 0)))))

(defn create-paging-buttons
  [offset-atom]
  [(doto (s/button :id :git-back
                   :listen [:action (fn [& _]
                                      (swap! offset-atom - max-commits)
                                      (update-paging-buttons! offset-atom)
                                      (some-> (update-sidebar!)
                                              (s/scroll! :to :top)))])
     (s/text! (shortcuts/wrap-hint-text "&larr;")))
   (doto (s/button :id :git-forward
                   :listen [:action (fn [& _]
                                      (swap! offset-atom + max-commits)
                                      (update-paging-buttons! offset-atom)
                                      (some-> (update-sidebar!)
                                              (s/scroll! :to :top)))])
     (s/text! (shortcuts/wrap-hint-text "&rarr;")))])

(defmethod editors/create-editor :git [_ path]
  (when (= (.getName (io/file path)) git-name)
    (let [; get the path of the parent directory
          path (-> path io/file .getParentFile .getCanonicalPath)
          ; create the pane
          offset-atom (atom 0)
          content (create-content)
          sidebar (doto (create-sidebar)
                    (update-sidebar! content offset-atom path))
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
          actions (create-actions)
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
       :should-remove-fn #(not (git-project? path))
       :italicize-fn (fn [] false)})))

(defmethod ui/adjust-nodes :git [_ parent children]
  (if (some-> (:file parent) .getCanonicalPath git-project?)
    (cons {:html "<html><b><font color='orange'>Git</font></b></html>"
           :name "Git"
           :file (io/file (:file parent) git-name)}
          children)
    children))

(add-watch ui/tree-selection
           :update-git
           (fn [_ _ _ _]
             (update-sidebar!)))
