(ns nightcode.builders
  (:require [nightcode.shortcuts :as shortcuts]
            [nightcode.lein :as l]
            [nightcode.spec :as spec]
            [nightcode.utils :as u]
            [nightcode.process :as proc]
            [clojure.spec.alpha :as s :refer [fdef]]
            [clojure.set :as set]
            [clojure.string :as str])
  (:import [clojure.lang LineNumberingPushbackReader]
           [javafx.scene.web WebEngine]
           [javafx.scene.control Button]
           [java.io PipedWriter PipedReader PrintWriter]
           [javafx.application Platform]
           [javafx.beans.value ChangeListener]
           [javafx.event EventHandler]
           [nightcode.utils Bridge]))

(fdef pipe-into-console!
  :args (s/cat :engine any? :in-pipe #(instance? java.io.Reader %)))

(defn pipe-into-console! [^WebEngine engine in-pipe]
  (let [ca (char-array 256)]
    (.start
      (Thread.
        (fn []
          (loop []
            (when-let [read (try (.read in-pipe ca)
                              (catch Exception _))]
              (when (pos? read)
                (let [s (u/remove-returns (String. ca 0 read))]
                  (Platform/runLater
                    (fn []
                      (-> engine
                          (.executeScript "window")
                          (.call "append" (into-array [s])))))
                  (Thread/sleep 100) ; prevent application thread from being flooded
                  (recur))))))))))

(fdef create-pipes
  :args (s/cat)
  :ret map?)

(defn create-pipes []
  (let [out-pipe (PipedWriter.)
        in (LineNumberingPushbackReader. (PipedReader. out-pipe))
        pout (PipedWriter.)
        out (PrintWriter. pout)
        in-pipe (PipedReader. pout)]
    {:in in :out out :in-pipe in-pipe :out-pipe out-pipe}))

(fdef start-builder-thread!
  :args (s/cat :webview spec/node? :pipes map? :finish-str (s/nilable string?) :work-fn fn?))

(defn start-builder-thread! [webview pipes finish-str work-fn]
  (let [engine (.getEngine webview)
        {:keys [in-pipe in out]} pipes]
    (pipe-into-console! engine in-pipe)
    (.start
      (Thread.
        (fn []
          (binding [*out* out
                    *err* out
                    *in* in]
            (try
              (work-fn)
              (catch Exception e (some-> (.getMessage e) println))
              (finally (some-> finish-str println)))))))))

(fdef start-builder-process!
  :args (s/alt
          :args (s/cat  :webview spec/node? :pipes map? :*process spec/atom? :start-str (s/nilable string?) :project-path string? :args (s/coll-of string?))
          :start-fn (s/cat :webview spec/node? :pipes map? :*process spec/atom? :start-str (s/nilable string?) :start-fn fn?)))

(defn start-builder-process!
  ([webview pipes *process start-str project-path args]
   (start-builder-process! webview pipes *process start-str
     #(proc/start-java-process! *process project-path args)))
  ([webview pipes *process start-str start-fn]
   (proc/stop-process! *process)
   (start-builder-thread! webview pipes "\n=== Finished ==="
     (fn []
       (some-> start-str println)
       (start-fn)))))

(fdef stop-builder-process!
  :args (s/cat :runtime-state map? :project-path string?))

(defn stop-builder-process! [runtime-state project-path]
  (when-let [*process (get-in runtime-state [:processes project-path])]
    (proc/stop-process! *process)))

(fdef init-console!
  :args (s/cat :project-path string? :*runtime-state spec/atom? :webview spec/node? :pipes map? :web-port number? :callback fn?))

(defn init-console! [project-path *runtime-state webview pipes web-port cb]
  (doto webview
    (.setVisible true)
    (.setContextMenuEnabled false))
  (let [engine (.getEngine webview)]
    (.setOnStatusChanged engine
      (reify EventHandler
        (handle [this event]
          (let [bridge (reify Bridge
                         (onload [this]
                           (try
                             (cb)
                             (catch Exception e (.printStackTrace e))))
                         (onautosave [this])
                         (onchange [this])
                         (onenter [this text]
                           (doto (:out-pipe pipes)
                             (.write text)
                             (.flush)))
                         (oneval [this code]))]
            ; prevent bridge from being GC'ed
            (swap! *runtime-state update :bridges assoc project-path bridge)
            (-> engine
                (.executeScript "window")
                (.setMember "java" bridge))))))
    (.load engine (str "http://localhost:" web-port "/paren-soup.html"))))

(def index->system {0 :boot 1 :lein})
(def system->index (set/map-invert index->system))

(fdef get-tab
  :args (s/cat :pane spec/pane? :system keyword?)
  :ret #(instance? javafx.scene.control.Tab %))

(defn get-tab [pane system]
  (-> (.lookup pane "#build_tabs")
      .getTabs
      (.get (system->index system))))

(fdef get-selected-build-system
  :args (s/cat :pane spec/pane?)
  :ret (s/nilable keyword?))

(defn get-selected-build-system [pane]
  (-> (.lookup pane "#build_tabs") .getSelectionModel .getSelectedIndex index->system))

(fdef select-build-system!
  :args (s/cat :pane spec/pane? :system keyword? :ids (s/coll-of keyword?)))

(defn select-build-system! [pane system ids]
  (-> (.lookup pane "#build_tabs") .getSelectionModel (.select (system->index system)))
  (-> (get-tab pane system) .getContent (shortcuts/add-tooltips! ids)))

(fdef refresh-builder!
  :args (s/cat :webview spec/node? :repl? boolean? :pref-state map?))

(defn refresh-builder! [webview repl? pref-state]
  (doto (.getEngine webview)
    (.executeScript (if repl? "initConsole(true)" "initConsole(false)"))
    (.executeScript (case (:theme pref-state)
                      :dark "changeTheme(true)"
                      :light "changeTheme(false)"))
    (.executeScript (format "setTextSize(%s)" (:text-size pref-state)))))

(def ^:const ids [:.run :.build :.run-with-repl :.reload-file :.reload-selection :.clean :.test :.stop])
(def ^:const disable-when-running [:.run :.build :.run-with-repl :.clean :.test :.custom])
(def ^:const disable-when-not-running [:.reload-file :.reload-selection :.stop])
(def ^:const custom-task-ids [:.run :.build])

(fdef update-when-process-changes!
  :args (s/cat :pane spec/pane? :process-running? boolean?))

(defn update-when-process-changes! [pane process-running?]
  (doseq [id disable-when-running]
    (doseq [node (.lookupAll pane (name id))]
      (.setDisable node process-running?)))
  (doseq [id disable-when-not-running]
    (doseq [node (.lookupAll pane (name id))]
      (.setDisable node (not process-running?)))))

(fdef get-builder-webview
  :args (s/cat :pref-state map? :runtime-state map?)
  :ret spec/node?)

(defn get-builder-webview [pref-state runtime-state]
  (when-let [project-path (u/get-project-path pref-state)]
    (when-let [pane (get-in runtime-state [:projects project-path :pane])]
      (when-let [system (get-selected-build-system pane)]
        (let [tab-content (.getContent (get-tab pane system))]
          (.lookup tab-content "#build_webview"))))))

(fdef start-builder!
  :args (s/cat :pref-state map? :*runtime-state spec/atom? :start-str string? :cmd string?))

(defn start-builder! [pref-state *runtime-state start-str cmd]
  (when-let [project-path (u/get-project-path pref-state)]
    (when-let [pane (get-in @*runtime-state [:projects project-path :pane])]
      (when-let [system (get-selected-build-system pane)]
        (let [tab-content (.getContent (get-tab pane system))
              webview (.lookup tab-content "#build_webview")
              pipes (create-pipes)
              *process (or (get-in @*runtime-state [:processes project-path])
                          (doto (atom nil)
                            (add-watch :process-changed
                              (fn [_ _ _ new-process]
                                (update-when-process-changes! pane (some? new-process))))))]
          (init-console! project-path *runtime-state webview pipes (:web-port @*runtime-state)
            (fn []
              (refresh-builder! webview (= cmd "repl") pref-state)
              (start-builder-process! webview pipes *process start-str
                (case system
                  :lein #(proc/start-java-process! *process project-path [l/class-name cmd])
                  :boot #(proc/start-process! *process project-path [(u/get-boot-path) "--no-colors" cmd])))))
          (swap! *runtime-state assoc-in [:processes project-path] *process))))))

(fdef stop-builder!
  :args (s/cat :pref-state map? :runtime-state map?))

(defn stop-builder! [pref-state runtime-state]
  (when-let [project-path (u/get-project-path pref-state)]
    (stop-builder-process! runtime-state project-path)))

(fdef show-boot-buttons!
  :args (s/cat :pane spec/pane? :path string? :pref-state map? :*runtime-state spec/atom?))

(defn show-boot-buttons! [pane path pref-state *runtime-state]
  (when-let [task-buttons (some-> (get-tab pane :boot) .getContent (.lookup "#tasks"))]
    (when-let [perm-tasks (.lookup task-buttons "#permanent_tasks")]
      (doto task-buttons
        shortcuts/hide-tooltips!
        (shortcuts/remove-tooltips! custom-task-ids))
      (-> task-buttons .getChildren .clear)
      (doseq [task-name (u/get-boot-tasks path)]
        (let [btn (Button.)]
          (doto (.getStyleClass btn)
            (.add task-name)
            (.add "custom"))
          (doto btn
            (.setText (->> (str/split task-name #"-")
                           (map str/capitalize)
                           (str/join " ")))
            (.setOnAction
              (reify EventHandler
                (handle [this event]
                  (start-builder! pref-state *runtime-state (str "Starting " task-name " task...") task-name)))))
          (-> task-buttons .getChildren (.add btn))))
      (-> task-buttons .getChildren (.add perm-tasks))
      ; for certain custom tasks, add tooltips
      (doto task-buttons
        (shortcuts/add-tooltips! custom-task-ids)
        shortcuts/hide-tooltips!))))

(fdef init-builder!
  :args (s/cat :pane spec/pane? :path string? :pref-state map? :*runtime-state spec/atom?))

(defn init-builder! [pane path pref-state *runtime-state]
  (let [systems (u/build-systems path)]
    ; add/remove tooltips
    (.addListener (-> (.lookup pane "#build_tabs") .getSelectionModel .selectedItemProperty)
      (reify ChangeListener
        (changed [this observable old-value new-value]
          (some-> old-value .getContent shortcuts/hide-tooltips!)
          (some-> old-value .getContent (shortcuts/remove-tooltips! ids))
          (some-> new-value .getContent (shortcuts/add-tooltips! ids)))))
    ; select/disable build tabs
    (cond
      (:boot systems) (do
                        (select-build-system! pane :boot ids)
                        (show-boot-buttons! pane path pref-state *runtime-state))
      (:lein systems) (select-build-system! pane :lein ids))
    (.setDisable (get-tab pane :boot) (not (:boot systems)))
    (.setDisable (get-tab pane :lein) (not (:lein systems)))
    ; init the tabs
    (doseq [system systems]
      (.setDisable (get-tab pane system) false))))

