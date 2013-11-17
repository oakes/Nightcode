(ns nightcode.shortcuts
  (:require [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.keymap :as keymap])
  (:import [java.awt Color Component KeyboardFocusManager KeyEventDispatcher
            Toolkit]
           [java.awt.event ActionEvent KeyEvent]
           [javax.swing JComponent]
           [net.java.balloontip BalloonTip]
           [net.java.balloontip.positioners CenteredPositioner]
           [net.java.balloontip.styles ToolTipBalloonStyle]))

(def is-down? (atom false))
(def ^:const mappings
  {:new-project-button "P"
   :new-file-button "N"
   :rename-file-button "M"
   :import-button "O"
   :remove-button "G"
   :run-button "R"
   :run-repl-button "E"
   :reload-button "shift S"
   :build-button "B"
   :test-button "T"
   :clean-button "L"
   :stop-button "I"
   :sdk-button "shift K"
   :auto-button "shift A"
   :save-button "S"
   :undo-button "Z"
   :redo-button "Y"
   :font-dec-button "MINUS"
   :font-inc-button "EQUALS"
   :doc-button "SPACE"
   :paredit-button "shift P"
   :find-field "F"
   :replace-field "shift R"
   :repl-console "shift E"
   :project-pane "&uarr; &darr; &crarr;"
   :toggle-logcat-button "S"})

(defn create-mappings
  "Maps the given pair of widget IDs and functions together."
  [panel pairs]
  (doseq [[id func] pairs]
    (when-let [mapping (get mappings id)]
      (keymap/map-key panel
                      (str "menu " mapping)
                      (fn [e]
                        ; only run the function if the button is enabled
                        (let [button-id (keyword (str "#" (name id)))
                              button (s/select panel [button-id])]
                          (when (and (s/config button :enabled?)
                                     (s/config button :visible?))
                            (func e))))
                      :scope :global))))

(defn is-visible?
  "Determines whether the given widget is visible."
  [^Component widget]
  (if widget
    (and (.isVisible widget)
         (is-visible? (.getParent widget)))
    true))

(defn toggle-hint
  "Shows or hides the given hint."
  [^BalloonTip hint show?]
  (.refreshLocation hint)
  (if (and show? (is-visible? (.getAttachedComponent hint)))
    (s/show! hint)
    (s/hide! hint)))

(defn toggle-hints
  "Shows or hides all hints in the given target."
  [target show?]
  (doseq [hint (s/select target [:BalloonTip])]
    (toggle-hint hint show?)))

(defn create-hint
  "Creates a new hint on the given view with the given text."
  [^JComponent view ^String text]
  (when text
    (let [text (str "<html><font face='Lucida Sans' color='#d3d3d3'>"
                    text
                    "</font></html>")
          style (ToolTipBalloonStyle. Color/DARK_GRAY Color/DARK_GRAY)
          ^CenteredPositioner positioner (CenteredPositioner. 0)]
      (.enableFixedAttachLocation positioner true)
      (.setAttachLocation positioner 0.5 0.5)
      (doto (BalloonTip. view text style false)
        (.setPositioner positioner)
        (.setVisible false)))))

(defn create-hints
  "Creates hints for all widgets within given target with IDs in `mappings`."
  [target]
  (doseq [[id mapping] mappings]
    (when-let [btn (s/select target [(keyword (str "#" (name id)))])]
      (create-hint btn mapping))))

(defn listen-for-shortcuts
  "Creates a global listener for shortcuts."
  [target func]
  (.addKeyEventDispatcher
    (KeyboardFocusManager/getCurrentKeyboardFocusManager)
    (proxy [KeyEventDispatcher] []
      (dispatchKeyEvent [^KeyEvent e]
        (let [modifier (.getMenuShortcutKeyMask (Toolkit/getDefaultToolkit))
              current-modifier (.getModifiers e)]
          (reset! is-down? (= (bit-and modifier current-modifier) modifier))
          ; show or hide the shortcut hints
          (when (or (= (.getKeyCode e) KeyEvent/VK_CONTROL)
                    (= (.getKeyCode e) KeyEvent/VK_META)
                    @is-down?)
            (toggle-hints target @is-down?)))
        ; provide special actions for certain keys
        (if (and @is-down?
                 (not (.isShiftDown e))
                 (= (.getID e) KeyEvent/KEY_PRESSED))
          (func (.getKeyCode e))
          false)))))
