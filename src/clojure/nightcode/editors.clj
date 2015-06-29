(ns nightcode.editors
  (:require [clojure.java.io :as io]
            [flatland.ordered.map :as flatland]
            [nightcode.completions :as completions]
            [nightcode.dialogs :as dialogs]
            [nightcode.file-browser :as file-browser]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [paredit.loc-utils]
            [paredit.parser]
            [paredit.static-analysis]
            [paredit-widget.core :as pw]
            [seesaw.color :as color]
            [seesaw.core :as s])
  (:import [java.awt.event KeyEvent KeyListener]
           [javax.swing.event DocumentListener HyperlinkEvent$EventType]
           [nightcode.ui JConsole]
           [org.fife.ui.rsyntaxtextarea FileLocation TextEditorPane Theme]
           [org.fife.ui.rtextarea RTextScrollPane SearchContext SearchEngine
            SearchResult]))

(def ^:const min-font-size 8)
(def editors (atom (flatland/ordered-map)))
(def font-size (atom (max min-font-size (utils/read-pref :font-size 14))))
(def paredit-enabled? (atom (utils/read-pref :enable-paredit false)))
(def tabs (atom nil))
(def paredit-help-frame (s/frame))

; basic getters

(defn get-text-area
  [view]
  (when view
    (->> [:<org.fife.ui.rsyntaxtextarea.TextEditorPane>]
         (s/select view)
         first)))

(defn get-text-area-from-path
  [path]
  (get-text-area (get-in @editors [path :view])))

(defn get-selected-text-area
  []
  (get-text-area-from-path @ui/tree-selection))

(defn get-selected-editor
  []
  (get-in @editors [@ui/tree-selection :view]))

(defn unsaved?
  [path]
  (when-let [text-area (get-text-area-from-path path)]
    (.isDirty text-area)))

(defn unsaved-paths
  ([]
    (filter unsaved? (keys @editors)))
  ([path]
    (filter #(.startsWith % path) (unsaved-paths))))

(defn get-editor-text
  []
  (when-let [text-area (get-selected-text-area)]
    (.getText text-area)))

(defn get-editor-selected-text
  []
  (when-let [text-area (get-selected-text-area)]
    (.getSelectedText text-area)))

(defn get-tle-under-caret
  "Finds the top-level-expression under the caret and returns it as a string."
  []
  (when-let [text-area (get-selected-text-area)]
    (when-let [point (.getCaretPosition text-area)]
      (-> (.getText text-area)
          paredit.parser/parse
          paredit.loc-utils/parsed-root-loc
          (paredit.static-analysis/top-level-code-form point)
          paredit.loc-utils/loc-text))))

; tabs

(def ^:dynamic *reorder-tabs?* true)

(defn move-tab-selection!
  [diff]
  (let [paths (reverse (keys @editors))
        index (.indexOf paths @ui/tree-selection)
        max-index (dec (count paths))
        new-index (+ index diff)
        new-index (cond
                    (neg? new-index) max-index
                    (> new-index max-index) 0
                    :else new-index)]
    (when (pos? (count paths))
      (binding [*reorder-tabs?* false]
        (ui/update-project-tree! (nth paths new-index)))))
  true)

(defn update-tabs!
  [path]
  (doto @ui/root .invalidate .validate)
  (let [editor-pane (ui/get-editor-pane)]
    (when @tabs (.closeBalloon @tabs))
    (->> (for [[e-path {:keys [italicize-fn]}] (reverse @editors)]
           (format "<a href='%s' style='text-decoration: %s;
                                        font-style: %s;'>%s</a>"
                   e-path
                   (if (utils/parent-path? path e-path) "underline" "none")
                   (if (italicize-fn) "italic" "normal")
                   (-> e-path io/file .getName)))
         (cons "<center>PgUp PgDn</center>")
         (clojure.string/join "<br/>")
         shortcuts/wrap-hint-text
         (s/editor-pane :editable? false :content-type "text/html" :text)
         (shortcuts/create-hint! true editor-pane)
         (reset! tabs))
    (s/listen (.getContents @tabs)
              :hyperlink
              (fn [e]
                (when (= (.getEventType e) HyperlinkEvent$EventType/ACTIVATED)
                  (binding [*reorder-tabs?* false]
                    (ui/update-project-tree! (.getDescription e))))))
    (shortcuts/toggle-hint! @tabs @shortcuts/down?)))

; button bar actions

(defn update-buttons!
  [editor ^TextEditorPane text-area]
  (when (ui/config! editor :#save :enabled? (.isDirty text-area))
    (update-tabs! @ui/tree-selection))
  (ui/config! editor :#undo :enabled? (.canUndo text-area))
  (ui/config! editor :#redo :enabled? (.canRedo text-area)))

(defn save-file!
  [& _]
  (when-let [text-area (get-selected-text-area)]
    (io!
      (with-open [w (io/writer (io/file @ui/tree-selection))]
        (.write text-area w)))
    (.setDirty text-area false)
    (s/request-focus! text-area)
    (update-buttons! (get-selected-editor) text-area))
  true)

(defn undo-file!
  [& _]
  (when-let [text-area (get-selected-text-area)]
    (.undoLastAction text-area)
    (s/request-focus! text-area)
    (update-buttons! (get-selected-editor) text-area)))

(defn redo-file!
  [& _]
  (when-let [text-area (get-selected-text-area)]
    (.redoLastAction text-area)
    (s/request-focus! text-area)
    (update-buttons! (get-selected-editor) text-area)))

(defn set-font-size!
  [text-area size]
  (.setFont text-area (-> text-area .getFont (.deriveFont (float size))))
  (s/request-focus! text-area))

(defn save-font-size!
  [size]
  (utils/write-pref! :font-size size))

(defn decrease-font-size!
  [& _]
  (swap! font-size (comp #(max min-font-size %) dec)))

(defn increase-font-size!
  [& _]
  (swap! font-size inc))

(defn save-paredit!
  [enable?]
  (utils/write-pref! :enable-paredit enable?))

(defn save-doc!
  [enabled?]
  (utils/write-pref! :enable-doc enabled?))

(defn toggle-paredit!
  [& _]
  (reset! paredit-enabled? (not @paredit-enabled?))
  (some-> (get-selected-text-area) s/request-focus!))

(defn toggle-doc!
  [& _]
  (reset! completions/doc-enabled? (not @completions/doc-enabled?))
  (some-> (get-selected-text-area) s/request-focus!))

(defn show-paredit-help!
  [& _]
  (some-> (get-selected-text-area) s/request-focus!)
  (let [commands (->> pw/advanced-keymap
                      (apply concat)
                      (apply sorted-map-by compare))
        modifiers {"M" (utils/get-string :alt)
                   "C" (utils/get-string :ctrl)}
        frame-function (fn [text] 
                         (dialogs/show-simple-table! text 
                                   :container        paredit-help-frame
                                   :column-delimiter " "
                                   :title            "Paredit Keys"))]
    (->> (doseq [[k v] commands]
           (when-let [modifier (get modifiers (first k))]
             (println modifier  "+" (second k) (name v))))
         with-out-str
         frame-function)))

(defn focus-on-field!
  [id]
  (when-let [editor (get-selected-editor)]
    (when-let [widget (s/select editor [id])]
      (doto widget
        s/request-focus!
        .selectAll))))

(defn focus-on-find!
  [& _]
  (focus-on-field! :#find))

(defn focus-on-replace!
  [& _]
  (focus-on-field! :#replace))

(defn find-text!
  [e]
  (when-let [text-area (get-selected-text-area)]
    (let [key-code (.getKeyCode e)
          enter-key? (= key-code 10)
          find-text (s/text e)
          printable-char? (-> text-area .getFont (.canDisplay key-code))
          meta-keys #{KeyEvent/VK_SHIFT KeyEvent/VK_CONTROL KeyEvent/VK_META}
          valid-search? (and (pos? (count find-text))
                             printable-char?
                             (not @shortcuts/down?)
                             (not (contains? meta-keys (.getKeyCode e))))
          context (doto (SearchContext. find-text)
                    (.setMatchCase true))]
      (when valid-search?
        (when-not enter-key?
          (.setCaretPosition text-area 0))
        (when (.isShiftDown e)
          (.setSearchForward context false)))
      (if (or (not valid-search?)
              (let [result (SearchEngine/find text-area context)]
                (if (isa? (type result) SearchResult)
                  (-> result .getCount (> 0))
                  result)))
        (s/config! e :background nil)
        (s/config! e :background (color/color :red)))
      (when (= (count find-text) 0)
        (SearchEngine/find text-area context)))))

(defn replace-text!
  [e]
  (when-let [text-area (get-selected-text-area)]
    (let [key-code (.getKeyCode e)
          enter-key? (= key-code 10)
          editor (get-selected-editor)
          find-text (s/text (s/select editor [:#find]))
          replace-text (s/text e)
          context (doto (SearchContext. find-text)
                    (.setMatchCase true))]
      (.setReplaceWith context replace-text)
      (if (and enter-key?
               (or (zero? (count find-text))
                   (not (try (SearchEngine/replaceAll text-area context)
                          (catch Exception _ false)))))
        (s/config! e :background (color/color :red))
        (s/config! e :background nil))
      (when enter-key?
        (update-buttons! editor text-area)))))

; create and display editors

(def ^:const console-ignore-shortcut-keys #{KeyEvent/VK_Z
                                            KeyEvent/VK_Y})

(defn init-paredit!
  [text-area enable-default? enable-advanced?]
  (let [toggle-paredit-fn! (pw/init-paredit! text-area enable-default?)]
    (toggle-paredit-fn! (and enable-advanced? @paredit-enabled?))
    (when enable-advanced? toggle-paredit-fn!)))

(defn add-watchers!
  [path extension text-area completer]
  (let [clojure? (contains? utils/clojure-exts extension)
        clojure-file? (and clojure? (.isFile (io/file path)))]
    (add-watch font-size
               (utils/hashed-keyword path)
               (fn [_ _ _ x]
                 (set-font-size! text-area x)))
    (when completer
      (add-watch completions/doc-enabled?
                 (utils/hashed-keyword path)
                 (fn [_ _ _ enable?]
                   (.setAutoActivationEnabled completer enable?))))
    (when-let [toggle-fn! (init-paredit! text-area clojure-file? clojure?)]
      (add-watch paredit-enabled?
                 (utils/hashed-keyword path)
                 (fn [_ _ _ enable?]
                   (toggle-fn! enable?))))))

(defn add-button-watchers!
  [path pane]
  (add-watch completions/doc-enabled?
             (utils/hashed-keyword (str "button:" path))
             (fn [_ _ _ enable?]
               (some-> (s/select pane [:#doc])
                       (s/config! :selected? enable?))))
  (add-watch paredit-enabled?
             (utils/hashed-keyword (str "button:" path))
             (fn [_ _ _ enable?]
               (some-> (s/select pane [:#paredit])
                       (s/config! :selected? enable?)))))

(defn remove-watchers!
  [path]
  (remove-watch font-size (utils/hashed-keyword path))
  (remove-watch paredit-enabled? (utils/hashed-keyword path))
  (remove-watch completions/doc-enabled? (utils/hashed-keyword path))
  (remove-watch paredit-enabled? (utils/hashed-keyword (str "button:" path)))
  (remove-watch completions/doc-enabled?
                (utils/hashed-keyword (str "button:" path))))

(defn apply-settings!
  [text-area]
  (-> @ui/theme-resource
      io/input-stream
      Theme/load
      (.apply text-area))
  (set-font-size! text-area @font-size))

(defn create-text-area
  ([]
    (doto (proxy [TextEditorPane] []
            (setMarginLineEnabled [enabled?]
              (proxy-super setMarginLineEnabled enabled?))
            (setMarginLinePosition [size]
              (proxy-super setMarginLinePosition size))
            (processKeyBinding [ks e condition pressed]
              (proxy-super processKeyBinding ks e condition pressed)))
      (.setAntiAliasingEnabled true)
      apply-settings!))
  ([path]
    (let [extension (utils/get-extension path)]
      (doto (create-text-area)
        (.load (FileLocation/create path) "UTF-8")
        .discardAllEdits
        (.setSyntaxEditingStyle (get utils/styles extension))
        (.setLineWrap (contains? utils/wrap-exts extension))
        (.setMarginLineEnabled true)
        (.setMarginLinePosition 80)
        (.setTabSize (if (contains? utils/clojure-exts extension) 2 4))))))

(defn create-console
  ([path]
    (create-console path "clj"))
  ([path extension]
    (let [text-area (create-text-area)
          completer (completions/create-completer text-area extension)]
      (add-watchers! path extension text-area completer)
      (doto text-area
        (.setSyntaxEditingStyle (get utils/styles extension))
        (.setLineWrap true)
        (.addKeyListener
          (reify KeyListener
            (keyReleased [this e] nil)
            (keyTyped [this e] nil)
            (keyPressed [this e]
              (when (and @shortcuts/down?
                         (contains? console-ignore-shortcut-keys
                                    (.getKeyCode e)))
                (.consume e))))))
      (some->> completer (completions/install-completer! text-area))
      (JConsole. text-area))))

(defn remove-editors!
  [path]
  (let [editor-pane (ui/get-editor-pane)]
    (doseq [[editor-path {:keys [view close-fn! should-remove-fn]}] @editors]
      (when (or (utils/parent-path? path editor-path)
                (should-remove-fn))
        (swap! editors dissoc editor-path)
        (close-fn!)
        (remove-watchers! editor-path)
        (.remove editor-pane view)))))

(defn close-selected-editor!
  [& _]
  (let [path @ui/tree-selection
        file (io/file path)
        new-path (if (.isDirectory file)
                   path
                   (.getCanonicalPath (.getParentFile file)))
        unsaved-paths (unsaved-paths path)]
    (when (or (zero? (count unsaved-paths))
              (dialogs/show-close-file-dialog! unsaved-paths))
      (remove-editors! path)
      (update-tabs! new-path)
      (ui/update-project-tree! new-path)))
  true)

(def ^:dynamic *widgets* [:up :save :undo :redo :font-dec :font-inc
                          :doc :paredit :paredit-help :find :replace :close])

(defn create-actions
  []
  {:up file-browser/go-up!
   :save save-file!
   :undo undo-file!
   :redo redo-file!
   :font-dec decrease-font-size!
   :font-inc increase-font-size!
   :doc toggle-doc!
   :paredit toggle-paredit!
   :paredit-help show-paredit-help!
   :find focus-on-find!
   :replace focus-on-replace!
   :close close-selected-editor!})

(defn create-widgets
  [actions]
  {:up (file-browser/create-up-button)
   :save (ui/button :id :save
                    :text (utils/get-string :save)
                    :listen [:action (:save actions)])
   :undo (ui/button :id :undo
                    :text (utils/get-string :undo)
                    :listen [:action (:undo actions)])
   :redo (ui/button :id :redo
                    :text (utils/get-string :redo)
                    :listen [:action (:redo actions)])
   :font-dec (ui/button :id :font-dec
                        :text (utils/get-string :font-dec)
                        :listen [:action (:font-dec actions)])
   :font-inc (ui/button :id :font-inc
                        :text (utils/get-string :font-inc)
                        :listen [:action (:font-inc actions)])
   :doc (ui/toggle :id :doc
                   :text (utils/get-string :doc)
                   :selected? @completions/doc-enabled?
                   :listen [:action (:doc actions)])
   :paredit (ui/toggle :id :paredit
                       :text (utils/get-string :paredit)
                       :selected? @paredit-enabled?
                       :listen [:action (:paredit actions)])
   :paredit-help (doto (ui/button :id :paredit-help
                                  :text "?"
                                  :listen [:action (:paredit-help actions)])
                   (utils/set-accessible-name! :paredit-help))
   :find (doto (s/text :id :find
                       :columns 8
                       :listen [:key-released find-text!])
           (utils/set-accessible-name! :find)
           (ui/text-prompt! (utils/get-string :find)))
   :replace (doto (s/text :id :replace
                          :columns 8
                          :listen [:key-released replace-text!])
              (utils/set-accessible-name! :replace)
              (ui/text-prompt! (utils/get-string :replace)))
   :close (doto (ui/button :id :close
                           :text "X"
                           :listen [:action (:close actions)])
            (utils/set-accessible-name! :close))})

(defmulti create-editor (fn [type _] type) :default nil)

(defmethod create-editor nil [_ _])

(defmethod create-editor :text [_ path]
  (when (utils/valid-file? (io/file path))
    (let [; create the text editor and the pane that will hold it
          text-area (create-text-area path)
          extension (utils/get-extension path)
          clojure? (contains? utils/clojure-exts extension)
          completer (completions/create-completer text-area extension)
          editor-pane (s/border-panel :center (RTextScrollPane. text-area))
          ; create the actions and widgets
          actions (create-actions)
          widgets (create-widgets actions)
          ; remove buttons if they aren't applicable
          *widgets* (remove (fn [k]
                              (-> (concat []
                                          (if-not clojure?
                                            [:paredit :paredit-help])
                                          (if-not completer
                                            [:doc]))
                                set
                                (contains? k)))
                            *widgets*)
          ; create the bar that holds the widgets
          widget-bar (ui/wrap-panel :items (map #(get widgets % %) *widgets*))]
      (utils/set-accessible-name! text-area (.getName (io/file path)))
      ; add the widget bar if necessary
      (when (pos? (count *widgets*))
        (doto editor-pane
          (s/config! :north widget-bar)
          shortcuts/create-hints!
          (shortcuts/create-mappings! actions)
          (update-buttons! text-area)))
      ; update buttons every time a key is typed
      (s/listen text-area
                :key-released
                (fn [e] (update-buttons! editor-pane text-area)))
      ; install completer if it exists
      (some->> completer (completions/install-completer! text-area))
      ; add watchers
      (add-watchers! path extension text-area completer)
      (add-button-watchers! path editor-pane)
      ; enable/disable buttons while typing
      (.addDocumentListener (.getDocument text-area)
        (reify DocumentListener
          (changedUpdate [this e]
            (update-buttons! editor-pane text-area))
          (insertUpdate [this e]
            (update-buttons! editor-pane text-area))
          (removeUpdate [this e]
            (update-buttons! editor-pane text-area))))
      ; return a map describing the editor
      {:view editor-pane
       :text-area text-area
       :close-fn! (fn [])
       :italicize-fn #(.isDirty text-area)
       :should-remove-fn #(not (.exists (io/file path)))})))

(def ^:dynamic *types* [:text :logcat :git])

(defn show-editor!
  [path]
  (when-let [editor-pane (ui/get-editor-pane)]
    ; create new editor if necessary
    (when (and path (not (contains? @editors path)))
      (when-let [editor-map (some #(if-not (nil? %) %)
                                  (map #(create-editor % path) *types*))]
        (swap! editors assoc path editor-map)
        (.add editor-pane (:view editor-map) path)))
    ; display the correct card
    (->> (or (when-let [editor-map (get @editors path)]
               (when *reorder-tabs?*
                 (swap! editors dissoc path)
                 (swap! editors assoc path editor-map))
               path)
             (when path :file-browser-card)
             :default-card)
         (s/show-card! editor-pane))
    ; update tabs
    (update-tabs! path)
    ; give the editor focus if it exists
    (when-let [text-area (get-text-area-from-path path)]
      (s/request-focus! text-area))))

; pane

(defn create-pane
  "Returns the pane with the editors."
  []
  (s/card-panel :id :editor-pane
                :items [["" :default-card]
                        [(file-browser/create-card) :file-browser-card]]))

; watchers

(add-watch ui/tree-selection
           :show-editor
           (fn [_ _ _ path]
             ; remove any editors that aren't valid anymore
             (remove-editors! nil)
             ; show the selected editor
             (show-editor! path)))
(add-watch font-size
           :save-font-size
           (fn [_ _ _ x]
             (save-font-size! x)))
(add-watch paredit-enabled?
           :save-paredit
           (fn [_ _ _ enable?]
             (save-paredit! enable?)))
(add-watch completions/doc-enabled?
           :save-doc
           (fn [_ _ _ enable?]
             (save-doc! enable?)))
