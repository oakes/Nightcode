(ns nightcode.shortcuts
  (:require [nightcode.ui :as ui]
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
   :check-versions-button "shift V"
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

(defn create-mappings!
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
                          (when (and button
                                     (s/config button :enabled?)
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

(defn toggle-hint!
  "Shows or hides the given hint."
  [^BalloonTip hint show?]
  (.refreshLocation hint)
  (if (and show? (is-visible? (.getAttachedComponent hint)))
    (s/show! hint)
    (s/hide! hint)))

(defn toggle-hints!
  "Shows or hides all hints in the given target."
  [target show?]
  (doseq [hint (s/select target [:BalloonTip])]
    (toggle-hint! hint show?)))

(defn wrap-hint-text
  [^String text]
  (str "<html><font face='Lucida Sans' color='#d3d3d3'>" text "</font></html>"))

(defn create-hint!
  "Creates a new hint on the given view with the given text."
  ([view contents]
    (create-hint! false view (wrap-hint-text contents)))
  ([is-vertically-centered? view contents]
    (when contents
      (let [style (ToolTipBalloonStyle. Color/DARK_GRAY Color/DARK_GRAY)
            ^CenteredPositioner positioner (CenteredPositioner. 0)
            ^BalloonTip tip (BalloonTip. view contents style false)
            view-height (.getHeight view)
            tip-height (.getHeight tip)
            y (if (and (> view-height 0) is-vertically-centered?)
                (-> (/ view-height 2)
                    (+ (/ tip-height 2))
                    (/ view-height))
                0.5)]
        (doto positioner
          (.enableFixedAttachLocation true)
          (.setAttachLocation 0.5 y))
        (when-let [container (some-> @ui/ui-root
                                     .getGlassPane
                                     (s/select [:JLayeredPane])
                                     first)]
          (.setTopLevelContainer tip container))
        (doto tip
          (.setPositioner positioner)
          (.setVisible false))))))

(defn create-hints!
  "Creates hints for all widgets within given target with IDs in `mappings`."
  [target]
  (doseq [[id mapping] mappings]
    (some-> (s/select target [(keyword (str "#" (name id)))])
            (create-hint! mapping))))

(defn listen-for-shortcuts!
  "Creates a global listener for shortcuts."
  [target func]
  (.addKeyEventDispatcher
    (KeyboardFocusManager/getCurrentKeyboardFocusManager)
    (proxy [KeyEventDispatcher] []
      (dispatchKeyEvent [^KeyEvent e]
        ; show or hide the shortcut hints
        (let [modifier (.getMenuShortcutKeyMask (Toolkit/getDefaultToolkit))
              current-modifier (.getModifiers e)]
          (reset! is-down? (= (bit-and modifier current-modifier) modifier))
          (when (or (= (.getKeyCode e) KeyEvent/VK_CONTROL)
                    (= (.getKeyCode e) KeyEvent/VK_META)
                    @is-down?)
            (toggle-hints! target @is-down?)))
        ; run the supplied function if Ctrl is pressed
        (if (and @is-down?
                 (not (.isShiftDown e))
                 (= (.getID e) KeyEvent/KEY_PRESSED))
          (func (.getKeyCode e))
          false)))))
