(ns nightcode.editors
  (:require [clojure.java.io :as io]
            [clojure.pprint :as pp]
            [clojure.zip :as zip]
            [compliment.core :as compliment]
            [flatland.ordered.map :as flatland]
            [nightcode.lein :as lein]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [paredit.loc-utils :as loc-utils]
            [paredit.static-analysis :as static-analysis]
            [paredit.parser :as parser]
            [paredit-widget.core :as pw]
            [seesaw.color :as color]
            [seesaw.core :as s])
  (:import [com.camick TextPrompt]
           [java.awt.event KeyEvent KeyListener]
           [javax.swing JComponent KeyStroke]
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

(def theme-resource (atom "dark.xml"))

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

(defn update-tabs!
  [path]
  (doto @ui/ui-root .invalidate .validate)
  (let [editor-pane (ui/get-editor-pane)]
    (when @tabs (.closeBalloon @tabs))
    (->> (for [[editor-path {:keys [italicize-fn]}] (reverse @editors)]
           (let [underline-fn #(utils/is-parent-path? path editor-path)
                 add-italics #(if (italicize-fn) (str "<i>" % "</i>") %)
                 add-underline #(if (underline-fn) (str "<u>" % "</u>") %)]
             (-> editor-path io/file .getName add-italics add-underline)))
         (cons "<center>PgUp PgDn</center>")
         (clojure.string/join "<br/>")
         (str "<html>")
         (shortcuts/create-hint! true editor-pane)
         (reset! tabs))
    (shortcuts/toggle-hint! @tabs @shortcuts/is-down?)))

(defn update-buttons!
  [pane ^TextEditorPane editor]
  (when (ui/config! pane :#save-button :enabled? (.isDirty editor))
    (update-tabs! (ui/get-selected-path)))
  (ui/config! pane :#undo-button :enabled? (.canUndo editor))
  (ui/config! pane :#redo-button :enabled? (.canRedo editor)))

(defn save-file!
  [_]
  (when-let [editor (get-selected-editor)]
    (io!
      (with-open [w (io/writer (io/file (ui/get-selected-path)))]
        (.write editor w)))
    (.setDirty editor false)
    (s/request-focus! editor)
    (update-buttons! (get-selected-editor-pane) editor))
  true)

(defn undo-file!
  [_]
  (when-let [editor (get-selected-editor)]
    (.undoLastAction editor)
    (update-buttons! (get-selected-editor-pane) editor)))

(defn redo-file!
  [_]
  (when-let [editor (get-selected-editor)]
    (.redoLastAction editor)
    (update-buttons! (get-selected-editor-pane) editor)))

(defn set-font-size!
  [editor size]
  (.setFont editor (-> editor .getFont (.deriveFont (float size)))))

(defn set-font-sizes!
  [size]
  (doseq [[path editor-map] @editors]
    (when-let [editor (get-editor path)]
      (set-font-size! editor size))))

(defn save-font-size!
  [size]
  (utils/write-pref! :font-size size))

(defn decrease-font-size!
  [_]
  (swap! font-size dec))

(defn increase-font-size!
  [_]
  (swap! font-size inc))

(defn set-paredit!
  [enable?]
  (doseq [[path editor-map] @editors]
    (when-let [toggle-paredit-fn! (:toggle-paredit-fn! editor-map)]
      (toggle-paredit-fn! enable?))
    (-> (s/select (:view editor-map) [:#paredit-button])
        (s/config! :selected? enable?))))

(defn save-paredit!
  [enable?]
  (utils/write-pref! :enable-paredit enable?))

(defn toggle-paredit!
  [_]
  (reset! paredit-enabled? (not @paredit-enabled?)))

(defn show-paredit-help!
  [_]
  (let [commands (->> pw/advanced-keymap
                      (apply concat)
                      (cons #(compare %1 %2))
                      (apply sorted-map-by))
        modifiers {"M" (utils/get-string :alt)
                   "C" (utils/get-string :ctrl)}]
    (->> (doseq [[k v] commands]
           (when-let [modifier (get modifiers (first k))]
             (println modifier "+" (second k) " " (name v))))
         with-out-str
         s/alert)))

(defn focus-on-field!
  [id]
  (when-let [pane (get-selected-editor-pane)]
    (doto (s/select pane [id])
      s/request-focus!
      .selectAll)))

(defn focus-on-find!
  [_]
  (focus-on-field! :#find-field))

(defn focus-on-replace!
  [_]
  (focus-on-field! :#replace-field))

(defn find-text!
  [e]
  (when-let [editor (get-selected-editor)]
    (let [key-code (.getKeyCode e)
          is-enter-key? (= key-code 10)
          find-text (s/text e)
          is-printable-char? (-> editor .getFont (.canDisplay key-code))
          is-valid-search? (and (> (count find-text) 0)
                                is-printable-char?
                                (not @shortcuts/is-down?))
          context (SearchContext. find-text)]
      (when is-valid-search?
        (.setRegularExpression context true)
        (when-not is-enter-key?
          (.setCaretPosition editor 0))
        (when (.isShiftDown e)
          (.setSearchForward context false)))
      (if (and is-valid-search?
               (not (try (SearchEngine/find editor context)
                      (catch Exception e false))))
        (s/config! e :background (color/color :red))
        (s/config! e :background nil)))))

(defn replace-text!
  [e]
  (when-let [editor (get-selected-editor)]
    (let [key-code (.getKeyCode e)
          is-enter-key? (= key-code 10)
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
        (update-buttons! pane editor)))))

; create and show/hide editors for each file

(def ^:const styles {"clj" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "cljs" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "cljx" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "edn" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "js" SyntaxConstants/SYNTAX_STYLE_JAVASCRIPT
                     "java" SyntaxConstants/SYNTAX_STYLE_JAVA
                     "xml" SyntaxConstants/SYNTAX_STYLE_XML
                     "html" SyntaxConstants/SYNTAX_STYLE_HTML
                     "htm" SyntaxConstants/SYNTAX_STYLE_HTML
                     "css" SyntaxConstants/SYNTAX_STYLE_CSS
                     "json" SyntaxConstants/SYNTAX_STYLE_NONE
                     "md" SyntaxConstants/SYNTAX_STYLE_NONE
                     "txt" SyntaxConstants/SYNTAX_STYLE_NONE})
(def ^:const clojure-exts #{"clj" "cljs" "cljx" "edn"})
(def ^:const wrap-exts #{"md" "txt"})

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
  [path]
  (doto (proxy [TextEditorPane] []
          (setMarginLineEnabled [is-enabled?]
            (proxy-super setMarginLineEnabled is-enabled?))
          (setMarginLinePosition [size]
            (proxy-super setMarginLinePosition size))
          (processKeyBinding [ks e condition pressed]
            (proxy-super processKeyBinding ks e condition pressed)))
    (.load (FileLocation/create path) nil)
    .discardAllEdits
    (.setAntiAliasingEnabled true)
    (.setSyntaxEditingStyle (get-syntax-style path))
    (.setLineWrap (contains? wrap-exts (get-extension path)))
    (.setMarginLineEnabled true)
    (.setMarginLinePosition 80)))

(defn get-completion-context
  [prefix]
  (when-let [editor (get-selected-editor)]
    (let [caretpos (.getCaretPosition editor)
          all-text (.getText editor)
          first-str (subs all-text 0 (- caretpos (count prefix)))
          second-str (subs all-text caretpos)]
      (-> (str first-str "__prefix__" second-str)
          parser/parse
          loc-utils/parsed-root-loc
          (static-analysis/top-level-code-form caretpos)
          first
          loc-utils/node-text
          read-string
          (try (catch Exception _))))))

(defn get-completion-provider
  [extension]
  (cond
    ; clojure
    (contains? clojure-exts extension)
    (proxy [DefaultCompletionProvider] []
      (getCompletions [comp]
        (let [prefix (.getAlreadyEnteredText this comp)
              context (get-completion-context prefix)]
          (for [symbol-str (compliment/completions prefix context)]
            (->> (str "<html><body><pre><span style='font-size: 11px;'>"
                      (compliment/documentation symbol-str)
                      "</span></pre></body></html>")
                 (BasicCompletion. this symbol-str nil)))))
      (isValidChar [ch]
        (or (Character/isLetterOrDigit ch)
            (contains? #{\* \+ \! \- \_ \? \/ \. \: \< \>} ch))))
    ; anything else
    :else nil))

(defn set-completion-listener!
  [completer text-area]
  ; this is an ugly way of making sure paredit-widget doesn't
  ; receive the KeyEvent if the AutoComplete window is visible
  (.addKeyListener text-area
    (reify KeyListener
      (keyReleased [this e] nil)
      (keyTyped [this e] nil)
      (keyPressed [this e]
        (when (and (= (.getKeyCode e) 10)
                   (-> @ui/ui-root .getOwnedWindows alength (> 0))
                   (-> @ui/ui-root .getOwnedWindows (aget 0) .isVisible))
          (let [ks (KeyStroke/getKeyStroke KeyEvent/VK_ENTER 0)
                condition JComponent/WHEN_FOCUSED]
            (.processKeyBinding text-area ks e condition true))
          (.consume e))))))

(defn get-completer
  [text-area extension]
  (when-let [provider (get-completion-provider extension)]
    (doto (AutoCompletion. provider)
      (.setShowDescWindow true)
      (.setAutoCompleteSingleChoices false)
      (.setChoicesWindowSize 150 300)
      (.setDescriptionWindowSize 600 300)
      (.install text-area)
      (set-completion-listener! text-area))))

(defn create-editor
  [path extension]
  (when (let [pathfile (io/file path)]
          (and (.isFile pathfile) (or (contains? styles extension)
                                      (utils/is-text-file? pathfile))))
    (let [; create the text editor object
          ^TextEditorPane text-area (get-text-area path)
          ; get the functions for performing completion and toggling paredit
          completer (get-completer text-area extension)
          do-completion-fn! (fn [_]
                              (s/request-focus! text-area)
                              (when completer (.doCompletion completer)))
          is-clojure? (contains? clojure-exts extension)
          toggle-paredit-fn! (when is-clojure? (pw/get-toggle-fn text-area))
          ; create the buttons with their actions attached
          btn-group (ui/wrap-panel
                      :items [(ui/button :id :save-button
                                         :text (utils/get-string :save)
                                         :focusable? false
                                         :listen [:action save-file!])
                              (ui/button :id :undo-button
                                         :text (utils/get-string :undo)
                                         :focusable? false
                                         :listen [:action undo-file!])
                              (ui/button :id :redo-button
                                         :text (utils/get-string :redo)
                                         :focusable? false
                                         :listen [:action redo-file!])
                              (ui/button :id :font-dec-button
                                         :text (utils/get-string :font_dec)
                                         :focusable? false
                                         :listen [:action decrease-font-size!])
                              (ui/button :id :font-inc-button
                                         :text (utils/get-string :font_inc)
                                         :focusable? false
                                         :listen [:action increase-font-size!])
                              (ui/button :id :doc-button
                                         :text (utils/get-string :doc)
                                         :focusable? false
                                         :visible? (not (nil? completer))
                                         :listen [:action do-completion-fn!])
                              (ui/toggle :id :paredit-button
                                         :text (utils/get-string :paredit)
                                         :focusable? false
                                         :visible? is-clojure?
                                         :selected? @paredit-enabled?
                                         :listen [:action toggle-paredit!])
                              (ui/button :id :paredit-help-button
                                         :text (utils/get-string :paredit_help)
                                         :focusable? false
                                         :visible? is-clojure?
                                         :listen [:action show-paredit-help!])
                              (s/text :id :find-field
                                      :columns 8
                                      :listen [:key-released find-text!])
                              (s/text :id :replace-field
                                      :columns 8
                                      :listen [:key-released replace-text!])])
          ; create the main panel
          text-group (s/border-panel
                       :north btn-group
                       :center (RTextScrollPane. text-area))]
      ; enable paredit if necessary
      (when toggle-paredit-fn! (toggle-paredit-fn! @paredit-enabled?))
      ; create shortcuts
      (doto text-group
        (shortcuts/create-mappings! {:save-button save-file!
                                     :undo-button undo-file!
                                     :redo-button redo-file!
                                     :font-dec-button decrease-font-size!
                                     :font-inc-button increase-font-size!
                                     :doc-button do-completion-fn!
                                     :paredit-button toggle-paredit!
                                     :find-field focus-on-find!
                                     :replace-field focus-on-replace!})
        shortcuts/create-hints!
        (update-buttons! text-area))
      ; add prompt text to the fields
      (doseq [[id text] {:#find-field (utils/get-string :find)
                         :#replace-field (utils/get-string :replace)}]
        (doto (TextPrompt. text (s/select text-group [id]))
          (.changeAlpha 0.5)))
      ; set more properties of the text area
      (when is-clojure? (.setTabSize text-area 2))
      (s/listen text-area
                :key-released
                (fn [e] (update-buttons! text-group text-area)))
      ; enable/disable buttons while typing
      (.addDocumentListener (.getDocument text-area)
                            (reify DocumentListener
                              (changedUpdate [this e]
                                (update-buttons! text-group text-area))
                              (insertUpdate [this e]
                                (update-buttons! text-group text-area))
                              (removeUpdate [this e]
                                (update-buttons! text-group text-area))))
      ; load the appropriate (default: dark) theme
      (-> (io/resource @theme-resource)
          io/input-stream
          Theme/load
          (.apply text-area))
      ; set the font size from preferences
      (if @font-size
        (set-font-size! text-area @font-size)
        (reset! font-size (-> text-area .getFont .getSize)))
      ; return a map describing the editor
      {:view text-group
       :close-fn! #(when (.isDirty text-area)
                     (save-file! nil))
       :italicize-fn #(.isDirty text-area)
       :should-remove-fn #(not (.exists (io/file path)))
       :toggle-paredit-fn! toggle-paredit-fn!})))

(defn create-logcat
  [path]
  (when (= (.getName (io/file path)) ui/logcat-name)
    (let [; create new console object with a reader/writer
          console (ui/create-console)
          in (ui/get-console-input console)
          out (ui/get-console-output console)
          ; keep track of the process and whether it's running
          process (atom nil)
          is-running? (atom false)
          ; create the start/stop button
          toggle-btn (s/button :id :toggle-logcat-button
                               :text (utils/get-string :start))
          ; create the main panel
          btn-group (ui/wrap-panel :items [toggle-btn])
          ; create the toggle action
          parent-path (-> path io/file .getParentFile .getCanonicalPath)
          start! (fn []
                   (lein/run-logcat! process in out parent-path)
                   (s/config! toggle-btn :text (utils/get-string :stop))
                   true)
          stop! (fn []
                  (lein/stop-process! process)
                  (s/config! toggle-btn :text (utils/get-string :start))
                  false)
          toggle! (fn [_]
                    (reset! is-running? (if @is-running? (stop!) (start!)))
                    (update-tabs! path))]
      ; add the toggle action to the button
      (s/listen toggle-btn :action toggle!)
      ; create shortcuts
      (doto btn-group
        (shortcuts/create-mappings! {:toggle-logcat-button toggle!})
        shortcuts/create-hints!)
      ; return a map describing the logcat view
      {:view (s/border-panel :north btn-group :center console)
       :close-fn! #(stop!)
       :should-remove-fn #(not (lein/is-android-project? parent-path))
       :italicize-fn (fn [] @is-running?)})))

(defn show-editor!
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
    (update-tabs! path)
    ; give the editor focus if it exists
    (when-let [editor (get-editor path)]
      (s/request-focus! editor))))

(defn remove-editors!
  [path]
  (let [editor-pane (ui/get-editor-pane)]
    (doseq [[editor-path {:keys [view close-fn! should-remove-fn]}] @editors]
      (when (or (utils/is-parent-path? path editor-path)
                (should-remove-fn))
        (swap! editors dissoc editor-path)
        (close-fn!)
        (.remove editor-pane view)))))

(defn close-selected-editor!
  []
  (let [path (ui/get-selected-path)
        file (io/file path)
        new-path (if (.isDirectory file)
                   path
                   (.getCanonicalPath (.getParentFile file)))]
    (remove-editors! path)
    (update-tabs! new-path)
    (ui/update-project-tree! new-path))
  true)

; watchers

(add-watch ui/tree-selection
           :show-editor
           (fn [_ _ _ path]
             ; remove any editors that aren't valid anymore
             (remove-editors! nil)
             ; show the selected editor
             (show-editor! path)))
(add-watch font-size :set-size (fn [_ _ _ x] (set-font-sizes! x)))
(add-watch font-size :save-size (fn [_ _ _ x] (save-font-size! x)))
(add-watch paredit-enabled?
           :set-paredit
           (fn [_ _ _ enable?] (set-paredit! enable?)))
(add-watch paredit-enabled?
           :save-paredit
           (fn [_ _ _ enable?] (save-paredit! enable?)))
