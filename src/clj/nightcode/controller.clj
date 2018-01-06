(ns nightcode.controller
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [nightcode.builders :as b]
            [nightcode.editors :as e]
            [nightcode.git :as git]
            [nightcode.lein :as lein]
            [nightcode.process :as proc]
            [nightcode.projects :as p]
            [nightcode.state :refer [*pref-state *runtime-state]]
            [nightcode.utils :as u]
            [eval-soup.core :as es])
  (:import [javafx.event ActionEvent]
           [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage DirectoryChooser FileChooser StageStyle Window Modality]
           [javafx.application Platform]
           [javafx.scene Scene]
           [javafx.scene.input KeyEvent KeyCode]
           [java.awt Desktop])
  (:gen-class
   :methods [[onNewConsoleProject [javafx.event.ActionEvent] void]
             [onNewGraphicsProject [javafx.event.ActionEvent] void]
             [onNewWebProject [javafx.event.ActionEvent] void]
             [onNewGameProject [javafx.event.ActionEvent] void]
             [onNewAudioProject [javafx.event.ActionEvent] void]
             [onCloneFromGit [javafx.event.ActionEvent] void]
             [onImport [javafx.event.ActionEvent] void]
             [onRename [javafx.event.ActionEvent] void]
             [onRemove [javafx.event.ActionEvent] void]
             [onUp [javafx.event.ActionEvent] void]
             [onSave [javafx.event.ActionEvent] void]
             [onUndo [javafx.event.ActionEvent] void]
             [onRedo [javafx.event.ActionEvent] void]
             [onInstaRepl [javafx.event.ActionEvent] void]
             [onFind [javafx.scene.input.KeyEvent] void]
             [onClose [javafx.event.ActionEvent] void]
             [onRun [javafx.event.ActionEvent] void]
             [onRunWithRepl [javafx.event.ActionEvent] void]
             [onReloadFile [javafx.event.ActionEvent] void]
             [onReloadSelection [javafx.event.ActionEvent] void]
             [onBuild [javafx.event.ActionEvent] void]
             [onClean [javafx.event.ActionEvent] void]
             [onTest [javafx.event.ActionEvent] void]
             [onStop [javafx.event.ActionEvent] void]
             [onDarkTheme [javafx.event.ActionEvent] void]
             [onLightTheme [javafx.event.ActionEvent] void]
             [onFontDec [javafx.event.ActionEvent] void]
             [onFontInc [javafx.event.ActionEvent] void]
             [onAutoSave [javafx.event.ActionEvent] void]
             [onNewFile [javafx.event.ActionEvent] void]
             [onOpenInFileBrowser [javafx.event.ActionEvent] void]]))

; new project

(defn show-start-menu! [^Scene scene]
  (some-> (.lookup scene "#start") .show))

(defn new-project! [^Scene scene project-type]
  (let [chooser (doto (FileChooser.)
                  (.setTitle "New Project"))
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showSaveDialog chooser (.getWindow scene))]
      (let [dir (-> file .getParentFile .getCanonicalPath)
            project-name (-> file .getName str/lower-case)
            file (io/file dir project-name)]
        (try
          (cond-> (fn []
                    (lein/new! dir project-type project-name)
                    (when (.exists file)
                      (swap! *pref-state update :project-set conj (.getCanonicalPath file))
                      (p/update-project-tree! *pref-state project-tree (.getCanonicalPath file))))
                  (not (:dev? @*runtime-state))
                  es/wrap-security
                  true
                  (apply []))
          (catch Exception _))))))

(defn -onNewConsoleProject [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene (new-project! :console)))

(defn -onNewGraphicsProject [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene (new-project! :graphics)))

(defn -onNewWebProject [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene (new-project! :web)))

(defn -onNewGameProject [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene (new-project! :play-cljs)))

(defn -onNewAudioProject [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene (new-project! :audio)))

; clone from git

(defn clone-from-git! [^Scene scene]
  (when-let [path (git/clone-with-dialog! scene)]
    (swap! *pref-state update :project-set conj path)
    (p/update-project-tree! *pref-state (.lookup scene "#project_tree") path)))

(defn -onCloneFromGit [this ^ActionEvent event]
  (-> event .getSource .getParentPopup .getOwnerWindow .getScene clone-from-git!))

; import

(defn import! [^Scene scene]
  (let [chooser (doto (DirectoryChooser.)
                  (.setTitle "Import"))
        project-tree (.lookup scene "#project_tree")]
    (when-let [file (.showDialog chooser (.getWindow scene))]
      (let [path (.getCanonicalPath file)]
        (swap! *pref-state update :project-set conj path)
        (p/update-project-tree! *pref-state project-tree path)))))

(defn -onImport [this ^ActionEvent event]
  (-> event .getSource .getScene import!))

; rename

(defn rename! [^Scene scene]
  (let [dialog (doto (TextInputDialog.)
                 (.setTitle "Rename")
                 (.setHeaderText "Enter a path relative to the project root.")
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene))
                 (.initModality Modality/WINDOW_MODAL))
        project-root-path (u/get-project-root-path @*pref-state)
        selected-path (:selection @*pref-state)
        relative-path (u/get-relative-path project-root-path selected-path)]
    (-> dialog .getEditor (.setText relative-path))
    (when-let [new-relative-path (-> dialog .showAndWait (.orElse nil))]
      (when (not= relative-path new-relative-path)
        (let [new-file (io/file project-root-path new-relative-path)
              new-path (.getCanonicalPath new-file)
              project-tree (.lookup scene "#project_tree")]
          (.mkdirs (.getParentFile new-file))
          (.renameTo (io/file selected-path) new-file)
          (u/delete-parents-recursively! (:project-set @*pref-state) selected-path)
          (e/remove-editors! selected-path *runtime-state)
          (p/update-project-tree! *pref-state project-tree new-path))))))

(defn -onRename [this ^ActionEvent event]
  (-> event .getSource .getScene rename!))

; remove

(defn should-remove? [^Scene scene ^String path]
  (let [paths-to-delete (->> @*runtime-state :editor-panes keys (filter #(u/parent-path? path %)))
        get-pane #(get-in @*runtime-state [:editor-panes %])
        get-engine #(-> % get-pane (.lookup "#webview") .getEngine)
        unsaved? #(-> % get-engine (.executeScript "isClean()") not)
        unsaved-paths (filter unsaved? paths-to-delete)]
    (or (empty? unsaved-paths)
        (->> (map #(-> % io/file .getName) unsaved-paths)
             (str/join \newline)
             (str "The below files are not saved. Proceed?" \newline \newline)
             (u/show-warning! scene "Unsaved Files")))))

(defn remove! [^Scene scene]
  (let [{:keys [project-set selection]} @*pref-state
        message (if (contains? project-set selection)
                  "Remove this project? It WILL NOT be deleted from the disk."
                  "Remove this file? It WILL be deleted from the disk.")
        dialog (doto (Alert. Alert$AlertType/CONFIRMATION)
                 (.setTitle "Remove")
                 (.setHeaderText message)
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene))
                 (.initModality Modality/WINDOW_MODAL))
        project-tree (.lookup scene "#project_tree")]
    (when (and (-> dialog .showAndWait (.orElse nil) (= ButtonType/OK))
               (should-remove? scene selection))
      (p/remove-from-project-tree! *pref-state selection)
      (e/remove-editors! selection *runtime-state)
      (p/remove-project! selection *runtime-state)
      (p/update-project-tree! *pref-state project-tree))))

(defn -onRemove [this ^ActionEvent event]
  (-> event .getSource .getScene remove!))

; up

(defn up! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (let [project-tree (.lookup scene "#project_tree")]
      (->> path io/file .getParentFile .getCanonicalPath
           (p/update-project-tree! *pref-state project-tree)))))

(defn -onUp [this ^ActionEvent event]
  (-> event .getSource .getScene up!))

; save

(defn save! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (when-let [pane (get-in @*runtime-state [:editor-panes path])]
      (when-let [engine (some-> pane (.lookup "#webview") .getEngine)]
        (e/save-file! path engine)))
    ; if saving a build.boot file, refresh the build buttons
    (let [file (io/file path)
          parent-path (-> file .getParentFile .getCanonicalPath)]
      (when (-> file .getName (= "build.boot"))
        (when-let [pane (.lookup scene "#content")]
          (b/show-boot-buttons! pane parent-path @*pref-state *runtime-state))))))

(defn -onSave [this ^ActionEvent event]
  (-> event .getSource .getScene save!))

; undo

(defn undo! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (when-let [pane (get-in @*runtime-state [:editor-panes path])]
      (let [webview (.lookup pane "#webview")
            engine (.getEngine webview)]
        (.executeScript engine "undo()")
        (e/update-editor-buttons! pane engine)))))

(defn -onUndo [this ^ActionEvent event]
  (-> event .getSource .getScene undo!))

; redo

(defn redo! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (when-let [pane (get-in @*runtime-state [:editor-panes path])]
      (let [webview (.lookup pane "#webview")
            engine (.getEngine webview)]
        (.executeScript engine "redo()")
        (e/update-editor-buttons! pane engine)))))

(defn -onRedo [this ^ActionEvent event]
  (-> event .getSource .getScene redo!))

; instaREPL

(defn toggle-instarepl! [^Scene scene & [from-button?]]
  (when-let [path (:selection @*pref-state)]
    (when-let [pane (get-in @*runtime-state [:editor-panes path])]
      (let [webview (.lookup pane "#webview")
            instarepl (.lookup pane "#instarepl")]
        (when-not from-button?
          (.setSelected instarepl (not (.isSelected instarepl))))
        (e/toggle-instarepl! (.getEngine webview) (.isSelected instarepl))))))

(defn -onInstaRepl [this ^ActionEvent event]
  (-> event .getSource .getScene (toggle-instarepl! true)))

; find

(defn focus-on-find! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (when-let [pane (get-in @*runtime-state [:editor-panes path])]
      (when-let [find (.lookup pane "#find")]
        (doto find .requestFocus .selectAll)))))

(defn find! [^Scene scene ^KeyEvent event]
  (when (= KeyCode/ENTER (.getCode event))
    (when-let [path (:selection @*pref-state)]
      (when-let [pane (get-in @*runtime-state [:editor-panes path])]
        (let [webview (.lookup pane "#webview")
              engine (.getEngine webview)
              find (.lookup pane "#find")
              find-text (.getText find)]
          (-> engine
              (.executeScript "window")
              (.call "find" (into-array Object [find-text true (.isShiftDown event)]))))))))

(defn -onFind [this ^KeyEvent event]
  (-> event .getSource .getScene (find! event)))

; close

(defn close! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (when (should-remove? scene path)
      (let [file (io/file path)
            new-path (if (.isDirectory file)
                       path
                       (.getCanonicalPath (.getParentFile file)))
            project-tree (.lookup scene "#project_tree")]
        (e/remove-editors! path *runtime-state)
        (p/update-project-tree-selection! project-tree new-path))
      (p/remove-project! path *runtime-state))))

(defn -onClose [this ^ActionEvent event]
  (-> event .getSource .getScene close!))

; run

(defn run-normal! [^Scene scene]
  (b/start-builder! @*pref-state *runtime-state "Running..." "run"))

(defn -onRun [this ^ActionEvent event]
  (-> event .getSource .getScene run-normal!))

; run with repl

(defn run-with-repl! [^Scene scene]
  (b/start-builder! @*pref-state *runtime-state "Running with REPL..." "repl"))

(defn -onRunWithRepl [this ^ActionEvent event]
  (-> event .getSource .getScene run-with-repl!))

; reload file

(defn reload-file! [^Scene scene]
  (when-let [webview (.lookup scene "#webview")]
    (let [text (.executeScript (.getEngine webview) "getTextContent()")
          text (str "(do" \newline text \newline ")" \newline)
          bridge (e/get-bridge @*pref-state @*runtime-state)]
      (.onenter bridge text))))

(defn -onReloadFile [this ^ActionEvent event]
  (-> event .getSource .getScene reload-file!))

; reload selection

(defn reload-selection! [^Scene scene]
  (when-let [webview (.lookup scene "#webview")]
    (when-let [text (.executeScript (.getEngine webview) "getSelectedText()")]
      (let [text (str "(do" \newline text \newline ")" \newline)
            bridge (e/get-bridge @*pref-state @*runtime-state)]
        (.onenter bridge text)))))

(defn -onReloadSelection [this ^ActionEvent event]
  (-> event .getSource .getScene reload-selection!))

; build

(defn build! [^Scene scene]
  (b/start-builder! @*pref-state *runtime-state "Building..." "build"))

(defn -onBuild [this ^ActionEvent event]
  (-> event .getSource .getScene build!))

; clean

(defn clean! [^Scene scene]
  (b/start-builder! @*pref-state *runtime-state "Cleaning..." "clean"))

(defn -onClean [this ^ActionEvent event]
  (-> event .getSource .getScene clean!))

; test

(defn test! [^Scene scene]
  (b/start-builder! @*pref-state *runtime-state "Testing..." "test"))

(defn -onTest [this ^ActionEvent event]
  (-> event .getSource .getScene test!))

; stop

(defn stop! [^Scene scene]
  (b/stop-builder! @*pref-state @*runtime-state))

(defn -onStop [this ^ActionEvent event]
  (-> event .getSource .getScene stop!))

; theme

(defn dark-theme! [^Scene scene]
  (swap! *pref-state assoc :theme :dark)
  (-> scene .getStylesheets (.add "dark.css"))
  (u/update-webviews! @*pref-state @*runtime-state))

(defn -onDarkTheme [this ^ActionEvent event]
  (-> @*runtime-state :stage .getScene dark-theme!))

(defn light-theme! [^Scene scene]
  (swap! *pref-state assoc :theme :light)
  (-> scene .getStylesheets .clear)
  (u/update-webviews! @*pref-state @*runtime-state))

(defn -onLightTheme [this ^ActionEvent event]
  (-> @*runtime-state :stage .getScene light-theme!))

; font

(defn font! [^Scene scene]
  (-> scene .getRoot (.setStyle (str "-fx-font-size: " (u/normalize-text-size (:text-size @*pref-state)))))
  (u/update-webviews! @*pref-state @*runtime-state))

(defn font-dec! [^Scene scene]
  (swap! *pref-state update :text-size #(-> % (- 2) u/normalize-text-size))
  (font! scene))

(defn -onFontDec [this ^ActionEvent event]
  (-> @*runtime-state :stage .getScene font-dec!))

(defn font-inc! [^Scene scene]
  (swap! *pref-state update :text-size #(-> % (+ 2) u/normalize-text-size))
  (font! scene))

(defn -onFontInc [this ^ActionEvent event]
  (-> @*runtime-state :stage .getScene font-inc!))

; auto save

(defn -onAutoSave [this ^ActionEvent event]
  (swap! *pref-state assoc :auto-save? (-> event .getTarget .isSelected)))

; new file

(defn new-file! [^Scene scene]
  (let [dialog (doto (TextInputDialog.)
                 (.setTitle "New File")
                 (.setHeaderText "Enter a path relative to the selected directory.")
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene))
                 (.initModality Modality/WINDOW_MODAL))
        selected-path (:selection @*pref-state)]
    (-> dialog .getEditor (.setText "example.clj"))
    (when-let [new-relative-path (-> dialog .showAndWait (.orElse nil))]
      (let [new-file (io/file selected-path new-relative-path)
            new-path (.getCanonicalPath new-file)
            project-tree (.lookup scene "#project_tree")]
        (.mkdirs (.getParentFile new-file))
        (.createNewFile new-file)
        (p/update-project-tree! *pref-state project-tree new-path)))))

(defn -onNewFile [this ^ActionEvent event]
  (-> event .getSource .getScene new-file!))

; open in file browser

(defn open-in-file-browser! [^Scene scene]
  (when-let [path (:selection @*pref-state)]
    (javax.swing.SwingUtilities/invokeLater
      (fn []
        (when (Desktop/isDesktopSupported)
          (.open (Desktop/getDesktop) (io/file path)))))))

(defn -onOpenInFileBrowser [this ^ActionEvent event]
  (-> event .getSource .getScene open-in-file-browser!))

