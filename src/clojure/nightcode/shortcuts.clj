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

(def down? (atom false))
(def ^:const mappings {:new-project "P"
                       :new-file "N"
                       :rename "M"
                       :import "O"
                       :remove "G"
                       :run "R"
                       :run-repl "E"
                       :reload "shift S"
                       :build "B"
                       :test "T"
                       :clean "L"
                       :check-versions "shift V"
                       :stop "I"
                       :sdk "shift K"
                       :auto "shift A"
                       :save "S"
                       :undo "Z"
                       :redo "Y"
                       :font-dec "MINUS"
                       :font-inc "EQUALS"
                       :doc "SPACE"
                       :paredit "shift P"
                       :find "F"
                       :replace "shift R"
                       :close "W"
                       :repl-console "shift E"
                       :project-pane "&uarr; &darr; &crarr;"
                       :toggle-logcat "S"})

(defn create-mapping!
  "Maps `func` to the key combo associated with `id`."
  [panel id func]
  (when-let [mapping (get mappings id)]
    (keymap/map-key panel
                    (str "menu " mapping)
                    (fn [e]
                      ; only run the function if the widget is enabled
                      (let [widget-id (keyword (str "#" (name id)))
                            widget (s/select panel [widget-id])]
                        (when (and widget
                                   (s/config widget :enabled?)
                                   (s/config widget :visible?))
                          (func e))))
                    :scope :global)))

(defn create-mappings!
  "Maps key combos associated with each id and func pairs."
  [panel pairs]
  (doseq [[id func] pairs]
    (create-mapping! panel id func)))

(defn visible?
  "Determines whether the given widget is visible."
  [^Component widget]
  (if widget
    (and (.isVisible widget)
         (visible? (.getParent widget)))
    true))

(defn toggle-hint!
  "Shows or hides the given hint."
  [^BalloonTip hint show?]
  (when hint
    (.refreshLocation hint)
    (if (and show? (visible? (.getAttachedComponent hint)))
      (s/show! hint)
      (s/hide! hint))))

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
  ([vertically-centered? view contents]
    (when contents
      (let [style (ToolTipBalloonStyle. Color/DARK_GRAY Color/DARK_GRAY)
            ^CenteredPositioner positioner (CenteredPositioner. 0)
            ^BalloonTip tip (BalloonTip. view contents style false)
            view-height (.getHeight view)
            tip-height (.getHeight tip)
            y (if (and (> view-height 0) vertically-centered?)
                (-> (/ view-height 2)
                    (+ (/ tip-height 2))
                    (/ view-height))
                0.5)]
        (doto positioner
          (.enableFixedAttachLocation true)
          (.setAttachLocation 0.5 y))
        (when-let [container (some-> @ui/root
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

(defn update-hints!
  "Shows or hides the hints based on the key event."
  [target e]
  (let [modifier (.getMenuShortcutKeyMask (Toolkit/getDefaultToolkit))
        current-modifier (.getModifiers e)]
    (reset! down? (= (bit-and modifier current-modifier) modifier))
    (when (or (= (.getKeyCode e) KeyEvent/VK_CONTROL)
              (= (.getKeyCode e) KeyEvent/VK_META)
              @down?)
      (toggle-hints! target @down?))))

(defn focused-window?
  "Returns true if `window` is currently in focus."
  [window]
  (-> (KeyboardFocusManager/getCurrentKeyboardFocusManager)
      .getFocusedWindow
      (= window)))

(defn run-shortcut!
  "Runs shortcut command if applicable, returning a boolean indicating success."
  [target func e]
  (if (and @down?
           (not (.isShiftDown e))
           (= (.getID e) KeyEvent/KEY_PRESSED))
    (func (.getKeyCode e))
    false))

(defn listen-for-shortcuts!
  "Creates a global listener for shortcuts."
  [target func]
  (.addKeyEventDispatcher
    (KeyboardFocusManager/getCurrentKeyboardFocusManager)
    (proxy [KeyEventDispatcher] []
      (dispatchKeyEvent [^KeyEvent e]
        (update-hints! target e)
        (if (focused-window? target)
          (run-shortcut! target func e)
          false)))))
