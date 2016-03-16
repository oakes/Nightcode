(ns nightbuild.core
  (:require [nightcode.customizations :as custom]
            [nightcode.builders :as builders]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.window :as window]
            [seesaw.chooser :as chooser]
            [seesaw.core :as s])
  (:gen-class))

(defn open-dir!
  [_]
  ; show a dialog to get a file
  (when-let [f (chooser/choose-file :type :open :selection-mode :dirs-only)]
    ; the binding allows you to remove and/or rearrange widgets
    (binding [builders/*widgets* [:run :run-repl :reload :eval :build :test
                                  :clean :check-versions :stop :auto]]
      ; resetting this atom is all you need to do to open the dir
      (reset! ui/tree-selection (.getCanonicalPath f)))))

(defn create-menubar
  []
  (let [open-menu-item (s/menu-item :text "Open" :listen [:action open-dir!])
        file-menu (s/menu :text "File" :items [open-menu-item])]
    (s/menubar :items [file-menu])))

(defn create-window
  []
  (doto (s/frame :title "Nightbuild"
                 :content (builders/create-pane)
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
        ; Q
        81 (window/confirm-exit-app!)
        ; else
        false)))
  ; this will give us a nice dark theme by default, or allow a lighter theme
  ; by adding "-s light" to the command line invocation
  (window/set-theme! (custom/parse-args args))
  ; create and display the window
  ; it's important to save the window in the ui/root atom
  (s/invoke-later
    (s/show! (reset! ui/root (create-window)))))
