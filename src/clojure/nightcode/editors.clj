(ns nightcode.editors
  (:require [clojure.java.io :as java.io]
            [compliment.core :as compliment]
            [flatland.ordered.map :as flatland]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [paredit-widget.core :as paredit]
            [seesaw.color :as color]
            [seesaw.core :as s])
  (:import [com.camick TextPrompt]
           [javax.swing.event DocumentListener]
           [org.fife.ui.autocomplete
            AutoCompletion BasicCompletion DefaultCompletionProvider]
           [org.fife.ui.rsyntaxtextarea
            FileLocation SyntaxConstants TextEditorPane Theme]
           [org.fife.ui.rtextarea RTextScrollPane SearchContext SearchEngine]))

; keep track of open editors

(def editors (atom (flatland/ordered-map)))
(def font-size (atom (utils/read-pref :font-size)))
(def paredit-enabled? (atom (utils/read-pref :enable-paredit)))
(def tabs (atom nil))
(def ^:dynamic *reorder-tabs?* true)

(defn get-editor
  [path]
  (when (contains? @editors path)
    (->> [:<org.fife.ui.rsyntaxtextarea.TextEditorPane>]
         (s/select (get-in @editors [path :view]))
         first)))

(defn get-selected-editor
  []
  (get-editor (ui/get-selected-path)))

(defn get-selected-editor-pane
  []
  (get-in @editors [(ui/get-selected-path) :view]))

(defn is-unsaved?
  [path]
  (when-let [editor (get-editor path)]
    (.isDirty editor)))

(defn get-editor-text
  []
  (when-let [editor (get-selected-editor)]
    (.getText editor)))

(defn get-editor-selected-text
  []
  (when-let [editor (get-selected-editor)]
    (.getSelectedText editor)))

; actions for editor buttons

(defn update-tabs
  [path]
  (doto @ui/ui-root .invalidate .validate)
  (let [editor-pane (ui/get-editor-pane)]
    (when @tabs (.closeBalloon @tabs))
    (->> (for [[editor-path {:keys [italicize-fn]}] (reverse @editors)]
           (let [underline-fn #(utils/is-parent-path? path editor-path)
                 add-italics #(if (italicize-fn) (str "<i>" % "</i>") %)
                 add-underline #(if (underline-fn) (str "<u>" % "</u>") %)]
             (-> editor-path java.io/file .getName add-italics add-underline)))
         (cons "<center>← →</center>")
         (clojure.string/join "<br/>")
         (str "<html>")
         (shortcuts/create-hint editor-pane)
         (reset! tabs))
    (shortcuts/toggle-hints @ui/ui-root @shortcuts/is-down?)))

(defn toggle-button
  [pane id should-enable?]
  (let [button (s/select pane [id])
        is-enabled? (s/config button :enabled?)]
    (when (not= should-enable? is-enabled?)
      (s/config! button :enabled? should-enable?)
      true)))

(defn update-buttons
  [pane editor]
  (when (toggle-button pane :#save-button (.isDirty editor))
    (update-tabs (ui/get-selected-path)))
  (toggle-button pane :#undo-button (.canUndo editor))
  (toggle-button pane :#redo-button (.canRedo editor)))

(defn save-file
  [_]
  (when-let [editor (get-selected-editor)]
    (with-open [w (java.io/writer (java.io/file (ui/get-selected-path)))]
      (.write editor w))
    (.setDirty editor false)
    (s/request-focus! editor)
    (update-buttons (get-selected-editor-pane) editor))
  true)

(defn undo-file
  [_]
  (when-let [editor (get-selected-editor)]
    (.undoLastAction editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn redo-file
  [_]
  (when-let [editor (get-selected-editor)]
    (.redoLastAction editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn set-font-size
  [editor size]
  (.setFont editor (-> editor .getFont (.deriveFont (float size)))))

(defn set-font-sizes
  [size]
  (doseq [[path editor-map] @editors]
    (when-let [editor (get-editor path)]
      (set-font-size editor size))))

(defn save-font-size
  [size]
  (utils/write-pref :font-size size))

(defn decrease-font-size
  [_]
  (swap! font-size dec))

(defn increase-font-size
  [_]
  (swap! font-size inc))

(defn set-paredit
  [enable?]
  (doseq [[path editor-map] @editors]
    (when-let [toggle-paredit-fn (:toggle-paredit-fn editor-map)]
      (toggle-paredit-fn enable?))
    (-> (s/select (:view editor-map) [:#paredit-button])
        (s/config! :selected? enable?))))

(defn save-paredit
  [enable?]
  (utils/write-pref :enable-paredit enable?))

(defn toggle-paredit
  [_]
  (reset! paredit-enabled? (not @paredit-enabled?)))

(defn focus-on-field
  [id]
  (when-let [pane (get-selected-editor-pane)]
    (doto (s/select pane [id])
      s/request-focus!
      .selectAll)))

(defn focus-on-find
  [_]
  (focus-on-field :#find-field))

(defn focus-on-replace
  [_]
  (focus-on-field :#replace-field))

(defn find-text
  [e]
  (when-let [editor (get-selected-editor)]
    (let [is-enter-key? (= (.getKeyCode e) 10)
          find-text (s/text e)
          context (SearchContext. find-text)]
      (.setRegularExpression context true)
      (when (and (not is-enter-key?) (> (count find-text) 0))
        (.setCaretPosition editor 0))
      (when (and is-enter-key? (.isShiftDown e))
        (.setSearchForward context false))
      (if (and (> (count find-text) 0)
               (not (try (SearchEngine/find editor context)
                      (catch Exception e false))))
        (s/config! e :background (color/color :red))
        (s/config! e :background nil)))))

(defn replace-text
  [e]
  (when-let [editor (get-selected-editor)]
    (let [is-enter-key? (= (.getKeyCode e) 10)
          pane (get-selected-editor-pane)
          find-text (s/text (s/select pane [:#find-field]))
          replace-text (s/text e)
          context (SearchContext. find-text)]
      (.setReplaceWith context replace-text)
      (if (and is-enter-key?
               (or (= (count find-text) 0)
                   (not (try (SearchEngine/replaceAll editor context)
                          (catch Exception e false)))))
        (s/config! e :background (color/color :red))
        (s/config! e :background nil))
      (when is-enter-key?
        (update-buttons pane editor)))))

; create and show/hide editors for each file

(def ^:const styles {"clj" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "cljs" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "js" SyntaxConstants/SYNTAX_STYLE_JAVASCRIPT
                     "java" SyntaxConstants/SYNTAX_STYLE_JAVA
                     "xml" SyntaxConstants/SYNTAX_STYLE_XML
                     "html" SyntaxConstants/SYNTAX_STYLE_HTML
                     "htm" SyntaxConstants/SYNTAX_STYLE_HTML
                     "css" SyntaxConstants/SYNTAX_STYLE_CSS
                     "json" SyntaxConstants/SYNTAX_STYLE_NONE
                     "md" SyntaxConstants/SYNTAX_STYLE_NONE
                     "txt" SyntaxConstants/SYNTAX_STYLE_NONE})
(def ^:const clojure-exts #{"clj" "cljs"})

(defn get-extension
  [path]
  (->> (.lastIndexOf path ".")
       (+ 1)
       (subs path)
       clojure.string/lower-case))

(defn get-syntax-style
  [path]
  (or (get styles (get-extension path))
      SyntaxConstants/SYNTAX_STYLE_NONE))

(defn get-text-area
  []
  (proxy [TextEditorPane] []
    (setMarginLineEnabled [is-enabled?]
      (proxy-super setMarginLineEnabled is-enabled?))
    (setMarginLinePosition [size]
      (proxy-super setMarginLinePosition size))))

(defn get-completion-provider
  [extension]
  (cond
    ; clojure
    (contains? clojure-exts extension)
    (proxy [DefaultCompletionProvider] []
      (getCompletions [comp]
        (if-let [prefix (.getAlreadyEnteredText this comp)]
          (for [symbol-str (compliment/completions prefix nil)]
            (->> (compliment/documentation symbol-str)
                 (BasicCompletion. this symbol-str nil)))
          '()))
      (isValidChar [ch]
        (or (Character/isLetterOrDigit ch)
            (contains? #{\* \+ \! \- \_ \? \/ \. \: \< \>} ch))))
    ; anything else
    :else nil))

(defn get-completer
  [text-area extension]
  (when-let [provider (get-completion-provider extension)]
    (doto (AutoCompletion. provider)
      (.setShowDescWindow true)
      (.setAutoCompleteSingleChoices false)
      (.setChoicesWindowSize 150 300)
      (.setDescriptionWindowSize 300 300)
      (.install text-area))))

(defn create-editor
  [path extension]
  (when (and (.isFile (java.io/file path)) (contains? styles extension))
    (let [is-clojure? (contains? clojure-exts extension)
          text-area (get-text-area)
          toggle-paredit-fn (when is-clojure? (paredit/get-toggle-fn text-area))
          completer (get-completer text-area extension)
          do-completion-fn (fn [_]
                             (s/request-focus! text-area)
                             (when completer (.doCompletion completer)))
          btn-group (ui/wrap-panel
                      :items [(ui/button :id :save-button
                                         :text (utils/get-string :save)
                                         :focusable? false
                                         :listen [:action save-file])
                              (ui/button :id :undo-button
                                         :text (utils/get-string :undo)
                                         :focusable? false
                                         :listen [:action undo-file])
                              (ui/button :id :redo-button
                                         :text (utils/get-string :redo)
                                         :focusable? false
                                         :listen [:action redo-file])
                              (ui/button :id :font-dec-button
                                         :text (utils/get-string :font_dec)
                                         :focusable? false
                                         :listen [:action decrease-font-size])
                              (ui/button :id :font-inc-button
                                         :text (utils/get-string :font_inc)
                                         :focusable? false
                                         :listen [:action increase-font-size])
                              (ui/button :id :doc-button
                                         :text (utils/get-string :doc)
                                         :focusable? false
                                         :visible? (not (nil? completer))
                                         :listen [:action do-completion-fn])
                              (ui/toggle :id :paredit-button
                                         :text (utils/get-string :paredit)
                                         :focusable? false
                                         :visible? is-clojure?
                                         :selected? @paredit-enabled?
                                         :listen [:action toggle-paredit])
                              (s/text :id :find-field
                                      :columns 8
                                      :listen [:key-released find-text])
                              (s/text :id :replace-field
                                      :columns 8
                                      :listen [:key-released replace-text])])
          text-group (s/border-panel
                       :north btn-group
                       :center (RTextScrollPane. text-area))]
      ; enable paredit if necessary
      (when toggle-paredit-fn
        (toggle-paredit-fn @paredit-enabled?))
      ; create shortcuts
      (doto text-group
        (shortcuts/create-mappings {:save-button save-file
                                    :undo-button undo-file
                                    :redo-button redo-file
                                    :font-dec-button decrease-font-size
                                    :font-inc-button increase-font-size
                                    :doc-button do-completion-fn
                                    :paredit-button toggle-paredit
                                    :find-field focus-on-find
                                    :replace-field focus-on-replace})
        shortcuts/create-hints
        (update-buttons text-area))
      ; add prompt text to the fields
      (doseq [[id text] {:#find-field (utils/get-string :find)
                         :#replace-field (utils/get-string :replace)}]
        (doto (TextPrompt. text (s/select text-group [id]))
          (.changeAlpha 0.5)))
      ; load file and set properties for the text area
      (doto text-area
        (.load (FileLocation/create path) nil)
        .discardAllEdits
        (.setAntiAliasingEnabled true)
        (s/listen :key-released
                  (fn [e] (update-buttons text-group text-area)))
        (.setSyntaxEditingStyle (get-syntax-style path))
        (.setMarginLineEnabled true)
        (.setMarginLinePosition 80))
      (when is-clojure? (.setTabSize text-area 2))
      ; enable/disable buttons while typing
      (.addDocumentListener (.getDocument text-area)
                            (reify DocumentListener
                              (changedUpdate [this e]
                                (update-buttons text-group text-area))
                              (insertUpdate [this e]
                                (update-buttons text-group text-area))
                              (removeUpdate [this e]
                                (update-buttons text-group text-area))))
      ; load the dark theme
      (-> (java.io/resource "dark.xml")
          java.io/input-stream
          Theme/load
          (.apply text-area))
      ; set the font size from preferences
      (if @font-size
        (set-font-size text-area @font-size)
        (reset! font-size (-> text-area .getFont .getSize)))
      ; return the object
      {:view text-group
       :close-fn #(when (.isDirty text-area)
                    (save-file nil))
       :italicize-fn #(.isDirty text-area)
       :toggle-paredit-fn toggle-paredit-fn})))

(defn create-logcat
  [path]
  (when (= (.getName (java.io/file path)) ui/logcat-name)
    (let [console (ui/create-console)
          process (atom nil)
          is-running? (atom false)
          in (ui/get-console-input console)
          out (ui/get-console-output console)
          toggle-btn (s/button :id :toggle-logcat-button
                               :text (utils/get-string :start))
          btn-group (ui/wrap-panel :items [toggle-btn])
          start (fn []
                  (->> (.getParent (java.io/file path))
                       (lein/run-logcat process in out))
                  (s/config! toggle-btn :text (utils/get-string :stop))
                  true)
          stop (fn []
                 (lein/stop-process process)
                 (s/config! toggle-btn :text (utils/get-string :start))
                 false)
          toggle (fn [_]
                   (reset! is-running? (if @is-running? (stop) (start)))
                   (update-tabs path))]
      (s/listen toggle-btn :action toggle)
      (doto btn-group
        (shortcuts/create-mappings {:toggle-logcat-button toggle})
        shortcuts/create-hints)
      {:view (s/border-panel :north btn-group :center console)
       :close-fn #(stop)
       :italicize-fn (fn [] @is-running?)})))

(defn show-editor
  [path]
  (let [editor-pane (ui/get-editor-pane)]
    ; create new editor if necessary
    (when (and path (not (contains? @editors path)))
      (when-let [editor (or (create-editor path (get-extension path))
                            (create-logcat path))]
        (swap! editors assoc path editor)
        (.add editor-pane (:view editor) path)))
    ; display the correct card
    (->> (or (when-let [editor (get @editors path)]
               (when *reorder-tabs?*
                 (swap! editors dissoc path)
                 (swap! editors assoc path editor))
               path)
             :default-card)
         (s/show-card! editor-pane))
    ; update tabs
    (update-tabs path)
    ; give the editor focus if it exists
    (when-let [editor (get-editor path)]
      (s/request-focus! editor))))

(defn remove-editors
  [path]
  (let [editor-pane (ui/get-editor-pane)]
    (doseq [[editor-path {:keys [view close-fn]}] @editors]
      (when (utils/is-parent-path? path editor-path)
        (swap! editors dissoc editor-path)
        (close-fn)
        (.remove editor-pane view)))))

(defn close-selected-editor
  []
  (let [path (ui/get-selected-path)
        file (java.io/file path)]
    (remove-editors path)
    (ui/update-project-tree (if (.isDirectory file)
                              path
                              (.getCanonicalPath (.getParentFile file)))))
  true)

; watchers

(add-watch ui/tree-selection :show-editor (fn [_ _ _ path] (show-editor path)))
(add-watch font-size :set-size (fn [_ _ _ x] (set-font-sizes x)))
(add-watch font-size :save-size (fn [_ _ _ x] (save-font-size x)))
(add-watch paredit-enabled?
           :set-paredit
           (fn [_ _ _ enable?] (set-paredit enable?)))
(add-watch paredit-enabled?
           :save-paredit
           (fn [_ _ _ enable?] (save-paredit enable?)))
