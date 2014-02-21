(ns nightpad.core
  (:require [nightcode.editors :as editors]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.window :as window]
            [seesaw.core :as s])
  (:gen-class))

(defn init-completer!
  [text-area]
  (->> (editors/create-completer text-area "clj")
       (editors/install-completer! text-area)))

(defn create-window-content
  []
  (doto (editors/create-text-area)
    (.setSyntaxEditingStyle (get editors/styles "clj"))
    (.setTabSize 2)
    init-completer!
    (editors/init-paredit! true true)
    (.setText "(println \"Hello, world!\")")))

(defn create-window
  []
  (doto (s/frame :title "Nightpad"
                 :content (create-window-content)
                 :on-close :exit
                 :size [800 :by 600])
    ; listen for keys while modifier is down
    (shortcuts/listen-for-shortcuts!
      (fn [key-code]
        (case key-code
          ; Q
          81 (window/confirm-exit-app!)
          ; else
          false)))
    ; set various window properties
    window/enable-full-screen!
    window/add-listener!))

(defn -main [& args]
  ; this will give us a nice dark theme by default, or allow a lighter theme
  ; by adding "-s light" to the command line invocation
  (window/set-theme! args)
  ; create and display the window
  ; it's important to save the window in the ui/root atom
  (s/invoke-later
    (s/show! (reset! ui/root (create-window)))))
