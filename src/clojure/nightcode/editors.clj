(ns nightcode.editors
  (:require [clojure.java.io :as java.io]
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
           [org.fife.ui.rsyntaxtextarea
            FileLocation SyntaxConstants TextEditorPane Theme]
           [org.fife.ui.rtextarea RTextScrollPane SearchContext SearchEngine]))

; dealing with currently-open editors

(def editors (atom (flatland/ordered-map)))
(def font-size (atom (utils/read-pref :font-size)))
(def tabs (atom nil))
(def ^:dynamic *reorder-tabs?* true)

(defn get-editor
  [path]
  (when (contains? @editors path)
    (->> [:<org.fife.ui.rsyntaxtextarea.TextEditorPane>]
         (s/select (get @editors path))
         first)))

(defn get-selected-editor
  []
  (get-editor (ui/get-selected-path)))

(defn get-selected-editor-pane
  []
  (get @editors (ui/get-selected-path)))

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

(defn update-buttons
  [pane editor]
  (-> (s/select pane [:#save-button])
      (s/config! :enabled? (.isDirty editor)))
  (-> (s/select pane [:#undo-button])
      (s/config! :enabled? (.canUndo editor)))
  (-> (s/select pane [:#redo-button])
      (s/config! :enabled? (.canRedo editor))))

(defn save-file
  [e]
  (when-let [editor (get-selected-editor)]
    (with-open [w (java.io/writer (java.io/file (ui/get-selected-path)))]
      (.write editor w))
    (.setDirty editor false)
    (s/request-focus! editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn undo-file
  [e]
  (when-let [editor (get-selected-editor)]
    (.undoLastAction editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn redo-file
  [e]
  (when-let [editor (get-selected-editor)]
    (.redoLastAction editor)
    (update-buttons (get-selected-editor-pane) editor)))

(defn set-font-size
  [editor size]
  (.setFont editor (-> editor .getFont (.deriveFont (float size)))))

(defn set-font-sizes
  [size]
  (when-let [selected-editor (get-selected-editor)]
    (doseq [[path editor-pane] @editors]
      (when-let [editor (get-editor path)]
        (set-font-size editor size)))))

(add-watch font-size :set-size (fn [_ _ _ x] (set-font-sizes x)))

(defn save-font-size
  [size]
  (utils/write-pref :font-size size))

(add-watch font-size :save-size (fn [_ _ _ x] (save-font-size x)))

(defn decrease-font-size
  [_]
  (swap! font-size dec))

(defn increase-font-size
  [_]
  (swap! font-size inc))

(defn focus-on-field
  [id]
  (when-let [pane (get-selected-editor-pane)]
    (doto (s/select pane [id])
      s/request-focus!
      .selectAll)))

(defn focus-on-find
  [e]
  (focus-on-field :#find-field))

(defn focus-on-replace
  [e]
  (focus-on-field :#replace-field))

(defn close-file
  [e])

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
               (-> (try (SearchEngine/find editor context)
                     (catch Exception e 0))
                   (= 0)))
        (s/config! e :background (color/color :red)
        (s/config! e :background nil))))))

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
                   (-> (try (SearchEngine/replaceAll editor context)
                         (catch Exception e 0))
                       (= 0))))
        (s/config! e :background (color/color :red))
        (s/config! e :background nil))
      (when is-enter-key?
        (update-buttons pane editor)))))

; create and show editors for each file

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

(defn create-editor
  [path]
  (when (and (.isFile (java.io/file path))
             (contains? styles (get-extension path)))
    (let [is-clojure? (contains? clojure-exts (get-extension path))
          text-area (if is-clojure?
                      (paredit/paredit-widget (get-text-area))
                      (get-text-area))
          btn-group (ui/wrap-panel
                      :items [(s/button :id :save-button
                                        :text (utils/get-string :save)
                                        :focusable? false
                                        :listen [:action save-file])
                              (s/button :id :undo-button
                                        :text (utils/get-string :undo)
                                        :focusable? false
                                        :listen [:action undo-file])
                              (s/button :id :redo-button
                                        :text (utils/get-string :redo)
                                        :focusable? false
                                        :listen [:action redo-file])
                              (s/button :id :font-dec-button
                                        :text (utils/get-string :font_dec)
                                        :focusable? false
                                        :listen [:action decrease-font-size])
                              (s/button :id :font-inc-button
                                        :text (utils/get-string :font_inc)
                                        :focusable? false
                                        :listen [:action increase-font-size])
                              (s/text :id :find-field
                                      :columns 8
                                      :listen [:key-released find-text])
                              (s/text :id :replace-field
                                      :columns 8
                                      :listen [:key-released replace-text])])
          text-group (s/border-panel
                       :north btn-group
                       :center (RTextScrollPane. text-area))]
      ; create shortcuts
      (doto text-group
        (shortcuts/create-mappings {:save-button save-file
                                    :undo-button undo-file
                                    :redo-button redo-file
                                    :font-dec-button decrease-font-size
                                    :font-inc-button increase-font-size
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
      ; return the entire panel
      text-group)))

(defn create-logcat
  [path]
  (when (= (.getName (java.io/file path)) "*LogCat*")
    (let [console (ui/create-console)
          process (atom nil)
          in (ui/get-console-input console)
          out (ui/get-console-output console)
          toggle-btn (s/button :id :toggle-logcat-button
                               :text (utils/get-string :start))
          btn-group (s/horizontal-panel :items [toggle-btn])
          start (fn []
                  (->> (.getParent (java.io/file path))
                       (lein/run-logcat process in out))
                  (s/config! toggle-btn :text (utils/get-string :stop)))
          stop (fn []
                 (lein/stop-process process)
                 (s/config! toggle-btn :text (utils/get-string :start)))
          toggle (fn [e]
                   (if (nil? @process) (start) (stop)))]
      (s/listen toggle-btn :action toggle)
      (shortcuts/create-mappings btn-group {:toggle-logcat-button toggle})
      (shortcuts/create-hints btn-group)
      (s/border-panel :north btn-group
                      :center console))))

(defn show-editor
  [path]
  (let [editor-pane (s/select @ui/ui-root [:#editor-pane])]
    ; create new editor if necessary
    (when (and path (not (contains? @editors path)))
      (when-let [view (or (create-editor path)
                          (create-logcat path))]
        (swap! editors assoc path view)
        (.add editor-pane view path)))
    ; display the correct card
    (->> (or (when-let [editor (get @editors path)]
               (when *reorder-tabs?*
                 (swap! editors dissoc path)
                 (swap! editors assoc path editor))
               path)
             :default-card)
         (s/show-card! editor-pane))
    ; update tabs
    (when @tabs (.closeBalloon @tabs))
    (->> (for [editor-path (reverse (keys @editors))]
           (let [file-name (.getName (java.io/file editor-path))]
             (if (= path editor-path)
               (str "<u>" file-name "</u>")
               file-name)))
         (cons "<center>← →</center>")
         (clojure.string/join "<br/>")
         (str "<html>")
         (shortcuts/create-hint editor-pane)
         (reset! tabs))
    (when @shortcuts/is-down? (s/show! @tabs))
    ; give the editor focus if it exists
    (when-let [editor (get-editor path)]
      (s/request-focus! editor))))

(defn remove-editors
  [path]
  (let [editor-pane (s/select @ui/ui-root [:#editor-pane])]
    (doseq [[editor-path editor] @editors]
      (when (.startsWith editor-path path)
        (swap! editors dissoc editor-path)
        (.remove editor-pane editor)))))
