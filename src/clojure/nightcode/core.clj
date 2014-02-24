(ns nightcode.core
  (:require [nightcode.builders :as builders]
            [nightcode.dialogs :as dialogs]
            [nightcode.editors :as editors]
            [nightcode.logcat :as logcat]
            [nightcode.projects :as projects]
            [nightcode.repl :as repl]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [nightcode.window :as window]
            [seesaw.core :as s])
  (:gen-class))

(defn create-window-content
  "Returns the entire window with all panes."
  []
  (let [console (editors/create-console "clj")
        one-touch! #(doto % (.setOneTouchExpandable true))]
    (one-touch!
      (s/left-right-split
        (one-touch!
          (s/top-bottom-split (projects/create-pane console)
                              (repl/create-pane console)
                              :divider-location 0.8
                              :resize-weight 0.5))
        (one-touch!
          (s/top-bottom-split (editors/create-pane)
                              (builders/create-pane)
                              :divider-location 0.8
                              :resize-weight 0.5))
        :divider-location 0.35
        :resize-weight 0))))

(defn create-window
  "Creates the main window."
  []
  (doto (s/frame :title (str (utils/get-string :app_name)
                             " "
                             (if-let [p (utils/get-project "nightcode.core")]
                               (nth p 2)
                               "beta"))
                 :content (create-window-content)
                 :width 1242
                 :height 768
                 :on-close :nothing)
    ; listen for keys while modifier is down
    (shortcuts/listen-for-shortcuts!
      (fn [key-code]
        (case key-code
          ; enter
          10 (projects/toggle-project-tree-selection!)
          ; page up
          33 (editors/move-tab-selection! -1)
          ; page down
          34 (editors/move-tab-selection! 1)
          ; up
          38 (projects/move-project-tree-selection! -1)
          ; down
          40 (projects/move-project-tree-selection! 1)
          ; Q
          81 (window/confirm-exit-app!)
          ; W
          87 (editors/close-selected-editor!)
          ; else
          false)))
    ; set various window properties
    window/enable-full-screen!
    window/add-listener!))

(defn -main
  "Launches the main window."
  [& args]
  (window/set-theme! args)
  (s/invoke-later
    ; create and show the frame
    (s/show! (reset! ui/root (create-window)))
    ; initialize the project pane
    (ui/update-project-tree!)))
