(ns nightcode.core
  (:require [clojure.java.io :as io]
            [nightcode.controller :as c]
            [nightcode.editors :as e]
            [nightcode.projects :as p]
            [nightcode.shortcuts :as shortcuts]
            [nightcode.state :refer [*pref-state *runtime-state init-pref-state!]]
            [nightcode.utils :as u])
  (:import [javafx.application Application]
           [javafx.fxml FXMLLoader]
           [javafx.stage Stage]
           [javafx.scene Scene]
           [java.util.prefs Preferences])
  (:gen-class :extends javafx.application.Application))

(def actions {:#start c/show-start-menu!
              :#import_project c/import!
              :#rename c/rename!
              :#remove c/remove!
              :#up c/up!
              :#save c/save!
              :#undo c/undo!
              :#redo c/redo!
              :#instarepl c/toggle-instarepl!
              :#find c/focus-on-find!
              :#close c/close!
              :.run c/run-normal!
              :.run-with-repl c/run-with-repl!
              :.reload-file c/reload-file!
              :.reload-selection c/reload-selection!
              :.build c/build!
              :.clean c/clean!
              :.test c/test!
              :.stop c/stop!
              :#new_file c/new-file!
              :#open_in_file_browser c/open-in-file-browser!})

(defn -start [^nightcode.core app ^Stage stage]
  (let [root (FXMLLoader/load (io/resource "main.fxml"))
        scene (Scene. root 1242 768)
        project-tree (.lookup scene "#project_tree")
        content (.lookup scene "#content")]
    (swap! *runtime-state assoc
      :stage stage
      :prefs (.node (Preferences/userRoot) "nightcode"))
    (init-pref-state! {:project-set #{}
                       :expansion-set #{}
                       :selection nil
                       :theme :dark
                       :text-size 16
                       :auto-save? true})
    (swap! *pref-state update :expansion-set u/filter-paths)
    (doto stage
      (.setTitle "Nightcode 2.5.6")
      (.setScene scene)
      (.show))
    (shortcuts/init-tabs! scene)
    (shortcuts/add-tooltips! scene [:#project_tree :#start :#import_project :#rename :#remove])
    (-> content .getChildren .clear)
    ; create listeners
    (p/set-selection-listener! *pref-state *runtime-state stage)
    (p/set-focused-listener! *pref-state *runtime-state stage project-tree)
    (p/set-project-key-listener! stage *pref-state *runtime-state)
    (shortcuts/set-shortcut-listeners! stage *pref-state *runtime-state actions)
    ; update the ui
    (p/update-project-tree! *pref-state project-tree)
    (p/update-project-buttons! @*pref-state scene)
    ; apply the prefs
    (let [theme-buttons (->> (.lookup scene "#start")
                             .getItems
                             (filter #(= "theme_buttons" (.getId %)))
                             first
                             .getContent
                             .getChildren)]
      (case (:theme @*pref-state)
        :dark (.fire (.get theme-buttons 0))
        :light (.fire (.get theme-buttons 1))
        nil))
    (c/font! scene)
    (let [auto-save-button (->> (.lookup scene "#start")
                                .getItems
                                (filter #(= "auto_save" (.getId %)))
                                first)]
      (.setSelected auto-save-button (:auto-save? @*pref-state)))))

(defn -main [& args]
  (when (= "Linux" (System/getProperty "os.name"))
    (System/setProperty "prism.lcdtext" "false")
    (System/setProperty "prism.text" "t2k"))
  (swap! *runtime-state assoc :web-port (e/start-web-server!))
  (Application/launch nightcode.core (into-array String args)))

(defn dev-main []
  (swap! *runtime-state assoc :dev? true)
  (-main))

