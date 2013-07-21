(ns nightcode.shortcuts
  (:require [seesaw.core :as s]
            [seesaw.keymap :as keymap])
  (:import [java.awt Color KeyboardFocusManager KeyEventDispatcher]
           [java.awt.event ActionEvent KeyEvent]
           [net.java.balloontip BalloonTip]
           [net.java.balloontip.positioners CenteredPositioner]
           [net.java.balloontip.styles ToolTipBalloonStyle]))

(def ^:const mappings
  {:new-project-button "P"
   :new-file-button "N"
   :rename-file-button "M"
   :import-button "O"
   :remove-button "I"
   :run-button "R"
   :run-repl-button "E"
   :build-button "B"
   :test-button "T"
   :clean-button "L"
   :stop-button "Q"
   :save-button "S"
   :undo-button "Z"
   :redo-button "Y"
   :repl-console "W"})

(defn create-mappings
  [panel pairs]
  (doseq [[id func] pairs]
    (when-let [mapping (get mappings id)]
      (keymap/map-key panel
                      (str "control " mapping)
                      (fn [e]
                        ; only run the function if the button is enabled
                        (when (-> panel
                                  (s/select [(keyword (str "#" (name id)))])
                                  (s/config :enabled?))
                          (func e)))
                      :scope :global)))
  panel)

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
  [btn text]
  (when text
    (let [style (ToolTipBalloonStyle. Color/DARK_GRAY Color/DARK_GRAY)
          positioner (CenteredPositioner. 0)]
      (doto (BalloonTip. btn text style false)
        (.setPositioner positioner)
        (.setVisible false)))))

(defn create-hints
  [target]
  ; create hints and initially hide them
  (doseq [[id mapping] mappings]
    (when-let [btn (s/select target [(keyword (str "#" (name id)))])]
      (create-hint btn mapping)))
  ; toggle hints when control key is up/down
  (.addKeyEventDispatcher
    (KeyboardFocusManager/getCurrentKeyboardFocusManager)
    (proxy [KeyEventDispatcher] []
      (dispatchKeyEvent [e]
        (when (= (.getKeyCode e) 17)
          (toggle-hints target (.isControlDown e)))
        false)))
  ; return target
  target)
