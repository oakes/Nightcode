(ns nightcode.editors
  (:use [seesaw.core :only [vertical-panel
                            horizontal-panel
                            add!
                            show-card!
                            remove!
                            select
                            button]]
        [clojure.java.io :only [file
                                resource
                                input-stream
                                reader]]
        [nightcode.utils :only [ui-root]])
  (:import org.fife.ui.rsyntaxtextarea.SyntaxConstants))

(def editors (atom {}))
(def ^:const styles {"clj" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "cljs" SyntaxConstants/SYNTAX_STYLE_CLOJURE
                     "js" SyntaxConstants/SYNTAX_STYLE_JAVASCRIPT
                     "java" SyntaxConstants/SYNTAX_STYLE_JAVA})

(defn get-syntax-style
  [path]
  (let [ext (->> (.lastIndexOf path ".")
                 (+ 1)
                 (subs path))]
    (if (contains? styles ext)
      (get styles ext)
      SyntaxConstants/SYNTAX_STYLE_NONE)))

(defn show-editor
  [path]
  (let [editor-pane (select @ui-root [:#editor-pane])]
    (if (.isFile (file path))
      (if (contains? @editors path)
        (show-card! editor-pane path)
        (let [text-area (org.fife.ui.rsyntaxtextarea.RSyntaxTextArea.)
              text-area-scroll (org.fife.ui.rtextarea.RTextScrollPane. text-area)
              text-area-group (vertical-panel
                                :items [(horizontal-panel
                                          :items [(button :text "Save")
                                                  (button :text "Move/Rename")
                                                  (button :text "Undo")
                                                  (button :text "Redo")
                                                  :fill-h])
                                        text-area-scroll])]
          (.read text-area (reader (file path)) nil)
          (.setSyntaxEditingStyle text-area (get-syntax-style path))
          (-> (resource "dark.xml")
              (input-stream)
              (org.fife.ui.rsyntaxtextarea.Theme/load)
              (.apply text-area))
          (swap! editors assoc path text-area-group)
          (.add editor-pane text-area-group path)
          (show-card! editor-pane path)))
      (show-card! editor-pane :default-card))))
