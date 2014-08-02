(ns nightcode.core
  (:require [nightcode.builders :as builders]
            [nightcode.dialogs :as dialogs]
            [nightcode.customizations :as custom]
            [nightcode.editors :as editors]
            [nightcode.logcat :as logcat]
            [nightcode.projects :as projects]
            [nightcode.repl :as repl]
            [nightcode.sandbox :as sandbox]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.ui :as ui]
            [nightcode.utils :as utils]
            [nightcode.window :as window]
            [seesaw.core :as s])
  (:gen-class))

(defn create-window-content
  "Returns the entire window with all panes."
  [args]
  (let [console (editors/create-console "*REPL*")
        one-touch! #(doto % (.setOneTouchExpandable true))]
    (one-touch!
      (s/left-right-split
        (one-touch!
          (s/top-bottom-split (projects/create-pane console)
                              (repl/create-pane console)
                              :divider-location 0.8
                              :resize-weight 0.5))
          (one-touch!
            (if (= (:panel args) "horizontal")
              (s/left-right-split (editors/create-pane)
                                  (builders/create-pane)
                                  :divider-location 0.5
                                  :resize-weight 0.5)
              (s/top-bottom-split (editors/create-pane)
                                  (builders/create-pane)
                                  :divider-location 0.8
                                  :resize-weight 0.5)))
        :divider-location 0.32
        :resize-weight 0))))

(defn create-window
  "Creates the main window."
  [args]
  (doto (s/frame :title (str "Nightcode " (or (some-> "nightcode.core"
                                                      utils/get-project
                                                      (nth 2))
                                              "beta"))
                 :content (create-window-content args)
                 :width 1242
                 :height 768
                 :icon "logo_launcher.png"
                 :on-close :nothing)
    ; set various window properties
    window/enable-full-screen!
    window/add-listener!))

(defn -main
  "Launches the main window."
  [& args]
  (let [parsed-args (custom/parse-args args)]
    (window/set-icon! "logo_launcher.png")
    (window/set-theme! parsed-args)
    (sandbox/create-profiles-clj!)
    (sandbox/read-file-permissions!)
    (s/invoke-later
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
      ; create and show the frame
      (s/show! (reset! ui/root (create-window parsed-args)))
      ; initialize the project pane
      (ui/update-project-tree!))))
