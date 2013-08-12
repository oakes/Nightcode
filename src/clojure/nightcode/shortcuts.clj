(ns nightcode.shortcuts
  (:require [nightcode.utils :as utils]
            [seesaw.core :as s]
            [seesaw.keymap :as keymap])
  (:import [java.awt Toolkit]
           [java.awt Color KeyboardFocusManager KeyEventDispatcher]
           [java.awt.event ActionEvent KeyEvent]
           [net.java.balloontip BalloonTip]
           [net.java.balloontip.positioners CenteredPositioner]
           [net.java.balloontip.styles ToolTipBalloonStyle]))

(def is-down? (atom false))
(def ^:const mappings
  {:new-project-button "P"
   :new-file-button "N"
   :rename-file-button "M"
   :import-button "O"
   :remove-button "U"
   :run-button "R"
   :run-repl-button "E"
   :eval-repl-button "shift S"
   :build-button "B"
   :test-button "T"
   :clean-button "L"
   :stop-button "I"
   :sdk-button "shift A"
   :save-button "S"
   :undo-button "Z"
   :redo-button "Y"
   :repl-console "G"
   :find-field "F"
   :project-pane "↑ ↓ ↵"
   :toggle-logcat-button "S"
   :font-inc-button "EQUALS"
   :font-dec-button "MINUS"})

(defn create-mappings
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
  [widget]
  (if widget
    (and (.isVisible widget)
         (is-visible? (.getParent widget)))
    true))

(defn toggle-hints
  [target show?]
  (doseq [hint (s/select target [:BalloonTip])]
    (if (and show? (is-visible? (.getAttachedComponent hint)))
      (s/show! hint)
      (s/hide! hint))))

(defn create-hint
  [view text]
  (when text
    (let [style (ToolTipBalloonStyle. Color/DARK_GRAY Color/DARK_GRAY)
          positioner (CenteredPositioner. 0)]
      (.enableFixedAttachLocation positioner true)
      (.setAttachLocation positioner 0.5 0.5)
      (doto (BalloonTip. view text style false)
        (.setPositioner positioner)
        (.setVisible false)))))

(defn create-hints
  [target]
  (doseq [[id mapping] mappings]
    (when-let [btn (s/select target [(keyword (str "#" (name id)))])]
      (create-hint btn mapping)))
  target)

(defn listen-for-shortcuts
  [target func]
  (.addKeyEventDispatcher
    (KeyboardFocusManager/getCurrentKeyboardFocusManager)
    (proxy [KeyEventDispatcher] []
      (dispatchKeyEvent [e]
        (let [modifier (.getMenuShortcutKeyMask (Toolkit/getDefaultToolkit))
              current-modifier (.getModifiers e)]
          (reset! is-down? (= (bit-and modifier current-modifier) modifier))
          ; show or hide the shortcut hints
          (when (or (= (.getKeyCode e) KeyEvent/VK_CONTROL)
                    (= (.getKeyCode e) KeyEvent/VK_META))
            (toggle-hints target @is-down?)))
        ; provide special actions for certain keys
        (if (and @is-down?
                 (not (.isShiftDown e))
                 (= (.getID e) KeyEvent/KEY_PRESSED))
          (func (.getKeyCode e))
          false))))
  target)
