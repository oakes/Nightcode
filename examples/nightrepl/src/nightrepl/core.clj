(ns nightrepl.core
  (:require [nightcode.editors :as editors]
            [nightcode.repl :as repl]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.window :as window]
            [seesaw.core :as s])
  (:gen-class))

(defn create-window
  []
  (doto (s/frame :title "Nightrepl"
                 :content (repl/create-pane (editors/create-console "clj"))
                 :on-close :exit
                 :size [800 :by 600])
    ; set various window properties
    window/enable-full-screen!
    window/add-listener!))

(defn -main [& args]
  ; listen for keys while modifier is down
  (shortcuts/listen-for-shortcuts!
    (fn [key-code]
      (case key-code
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
