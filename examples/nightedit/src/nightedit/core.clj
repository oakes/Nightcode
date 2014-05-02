(ns nightedit.core
  (:require [nightcode.editors :as editors]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.window :as window]
            [seesaw.chooser :as chooser]
            [seesaw.core :as s])
  (:gen-class))

(defn open-file!
  [_]
  ; show a dialog to get a file
  (when-let [f (chooser/choose-file :type :open)]
    ; the binding allows you to remove and/or rearrange widgets
    (binding [editors/*widgets* [:save :undo :redo :font-dec :font-inc
                                 :doc :paredit :paredit-help :find :replace
                                 :close]]
      ; resetting this atom is all you need to do to open the file
      (reset! ui/tree-selection (.getCanonicalPath f)))))

(defn create-menubar
  []
  (let [open-menu-item (s/menu-item :text "Open" :listen [:action open-file!])
        file-menu (s/menu :text "File" :items [open-menu-item])]
    (s/menubar :items [file-menu])))

(defn create-window
  []
  (doto (s/frame :title "Nightedit"
                 :content (editors/create-pane)
                 :on-close :exit
                 :size [800 :by 600]
                 :menubar (create-menubar))
    ; set various window properties
    window/enable-full-screen!
    window/add-listener!))

(defn -main [& args]
  ; listen for keys while modifier is down
  ; you can remove this to get rid of the modifier hints
  (shortcuts/listen-for-shortcuts!
    (fn [key-code]
      (case key-code
        ; page up
        33 (editors/move-tab-selection! -1)
        ; page down
        34 (editors/move-tab-selection! 1)
        ; Q
        81 (window/confirm-exit-app!)
        ; else
        false)))
  ; this will give us a nice dark theme by default, or allow a lighter theme
  ; by adding "-s light" to the command line invocation
  (window/set-theme! args)
  ; create and display the window
  ; it's important to save the window in the ui/root atom
  (s/invoke-later
    (s/show! (reset! ui/root (create-window)))))
