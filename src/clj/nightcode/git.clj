(ns nightcode.git
  (:import [javafx.scene.control Alert Alert$AlertType ButtonType TextInputDialog]
           [javafx.stage FileChooser Modality]
           [javafx.application Platform]
           [javafx.scene Scene]
           [org.eclipse.jgit.api Git]
           [org.eclipse.jgit.lib ProgressMonitor]
           [org.eclipse.jgit.transport
            CredentialItem
            CredentialItem$CharArrayType
            CredentialItem$StringType
            CredentialItem$YesNoType
            CredentialsProvider
            CredentialsProviderUserInfo
            URIish]))

(defn boolean-dialog! [^Scene scene ^String text]
  (-> (doto (Alert. Alert$AlertType/CONFIRMATION)
        (.setHeaderText text)
        (.setGraphic nil)
        (.initOwner (.getWindow scene))
        (.initModality Modality/WINDOW_MODAL))
      .showAndWait
      (.orElse nil)
      (= ButtonType/OK)))

(defn input-dialog! [^Scene scene ^String text]
  (-> (doto (TextInputDialog.)
        (.setHeaderText text)
        (.setGraphic nil)
        (.initOwner (.getWindow scene))
        (.initModality Modality/WINDOW_MODAL))
      .showAndWait
      (.orElse nil)))

(defn progress-dialog [^Scene scene]
  (let [dialog (doto (Alert. Alert$AlertType/CONFIRMATION)
                 (.setTitle "Cloning...")
                 (.setGraphic nil)
                 (.initOwner (.getWindow scene))
                 (.initModality Modality/WINDOW_MODAL))]
    (doto (.getButtonTypes dialog)
      .clear
      (.add ButtonType/CANCEL))
    dialog))

(defn create-creds [^Scene scene]
  (proxy [CredentialsProvider] []
    (isInteractive [] false)
    (supports [& items] true)
    (get [uri items]
      (let [success? (promise)]
        (Platform/runLater
          (fn []
            (doseq [item items]
              (when-not (realized? success?)
                (if-let [ret (if (isa? (type item) CredentialItem$YesNoType)
                               (boolean-dialog! scene (.getPromptText item))
                               (input-dialog! scene (.getPromptText item)))]
                  (cond
                    (isa? (type item) CredentialItem$CharArrayType)
                    (.setValue item (char-array ret))
                    (or (isa? (type item) CredentialItem$StringType)
                        (isa? (type item) CredentialItem$YesNoType))
                    (.setValue item ret))
                  (deliver success? false))))
            (deliver success? true)))
        @success?))))

(defn progress-monitor [^Alert dialog cancelled?]
  (reify ProgressMonitor
    (beginTask [this title total-work]
      (Platform/runLater #(.setHeaderText dialog title)))
    (endTask [this])
    (isCancelled [this] @cancelled?)
    (start [this total-tasks])
    (update [this unit])))

(defn clone! [^Scene scene ^String uri f progress]
  (-> (Git/cloneRepository)
      (.setURI uri)
      (.setDirectory f)
      (.setCredentialsProvider (create-creds scene))
      (.setProgressMonitor progress)
      .call
      .close))

(defn address->name [^String s]
  (when (.endsWith s ".git")
    (-> s URIish. .getHumanishName)))

(defn clone-with-dialog!
  ([^Scene scene]
   (let [dialog (doto (TextInputDialog.)
                  (.setTitle "Clone from Git")
                  (.setHeaderText "Enter a URL that ends in \".git\"")
                  (.setGraphic nil)
                  (.initOwner (.getWindow scene))
                  (.initModality Modality/WINDOW_MODAL))]
     (when-let [git-url (-> dialog .showAndWait (.orElse nil))]
       (when-let [dir (-> (doto (FileChooser.)
                            (.setInitialFileName (address->name git-url))
                            (.setTitle "Choose directory to clone into"))
                          (.showSaveDialog (.getWindow scene)))]
         (clone-with-dialog! scene git-url dir)))))
  ([^Scene scene ^String uri f]
   (let [cancelled? (atom false)
         exception (atom nil)
         path (promise)
         dialog (progress-dialog scene)
         monitor (progress-monitor dialog cancelled?)]
     (future (try
               (clone! scene uri f monitor)
               (catch Exception e
                 (when-not @cancelled?
                   (reset! exception e)))
               (finally
                 (Platform/runLater #(.close dialog))
                 (if (or @cancelled? @exception)
                   (deliver path nil)
                   (deliver path (.getCanonicalPath f))))))
     (reset! cancelled? (-> dialog .showAndWait (.orElse nil) (= ButtonType/CANCEL)))
     (when-let [e @exception]
       (doto (Alert. Alert$AlertType/ERROR)
         (.setContentText (.getMessage e))
         (.setGraphic nil)
         (.initOwner (.getWindow scene))
         (.initModality Modality/WINDOW_MODAL)
         .showAndWait))
     @path)))

