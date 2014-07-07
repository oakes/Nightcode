(ns nightcode.shortcuts
  (:require [nightcode.ui :as ui]
            [seesaw.core :as s]
            [seesaw.keymap :as keymap])
  (:import [java.awt Color Component KeyboardFocusManager KeyEventDispatcher
            Toolkit]
           [java.awt.event ActionEvent InputEvent KeyEvent]
           [javax.swing JComponent]
           [net.java.balloontip BalloonTip]
           [net.java.balloontip.positioners CenteredPositioner]
           [net.java.balloontip.styles ToolTipBalloonStyle]))

(def down? (atom false))
(def ^:dynamic *hint-container* nil)

(def ^:const mappings (merge {:new-project "P"
                       :rename "M"
                       :import "O"
                       :remove "G"
                       :run "R"
                       :run-repl "E"
                       :reload "shift S"
                       :eval "shift X"
                       :build "B"
                       :test "T"
                       :clean "L"
                       :check-versions "shift V"
                       :stop "I"
                       :sdk "shift K"
                       :auto "shift O"
                       :up "U"
                       :save "S"
                       :undo "Z"
                       :redo "Y"
                       :font-dec "MINUS"
                       :font-inc "EQUALS"
                       :doc "shift D"
                       :paredit "shift P"
                       :find "F"
                       :replace "shift R"
                       :close "W"
                       :repl-console "shift E"
                       :project-pane "&uarr; &darr; &crarr;"
                       :toggle-logcat "S"
                       :new-file "N"
                       :edit "shift M"
                       :open-in-browser "shift F"
                       :cancel "shift C"
                       :build-console "shift A"}
                      (try (read-string (slurp "keys.clj")) (catch Exception e {}))))

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
        (some->> *hint-container* (.setTopLevelContainer tip))
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
    (reset! down? (and (= (bit-and modifier current-modifier) modifier)
                       (contains? #{InputEvent/CTRL_MASK InputEvent/META_MASK}
                                  current-modifier)))
    (when (or (contains? #{KeyEvent/VK_CONTROL KeyEvent/VK_META}
                         (.getKeyCode e))
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
  (if (and @down? (= (.getID e) KeyEvent/KEY_PRESSED))
    (func (.getKeyCode e))
    false))

(defn listen-for-shortcuts!
  "Creates a global listener for shortcuts."
  [func]
  (.addKeyEventDispatcher
    (KeyboardFocusManager/getCurrentKeyboardFocusManager)
    (proxy [KeyEventDispatcher] []
      (dispatchKeyEvent [^KeyEvent e]
        (update-hints! @ui/root e)
        (if (focused-window? @ui/root)
          (run-shortcut! @ui/root func e)
          false)))))
