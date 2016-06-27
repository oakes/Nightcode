(ns net.sekao.nightcode.builders
  (:require [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.lein :as l]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.process :as proc]
            [clojure.spec :as s :refer [fdef]]
            [clojure.set :as set])
  (:import [clojure.lang LineNumberingPushbackReader]
           [javafx.scene.web WebEngine]
           [java.io PipedWriter PipedReader PrintWriter]
           [javafx.application Platform]
           [javafx.beans.value ChangeListener]))

(defn pipe-into-console! [^WebEngine engine in-pipe]
  (let [ca (char-array 256)]
    (.start
      (Thread.
        (fn []
          (loop []
            (when-let [read (try (.read in-pipe ca)
                              (catch Exception _))]
              (when (pos? read)
                (let [s (String. ca 0 read)
                      cmd (format "append('%s')" (u/escape-js s))]
                  (Platform/runLater
                    (fn []
                      (.executeScript engine cmd)))
                  (recur))))))))))

(defn start-builder-thread! [tab-content runtime-state-atom project-path work-fn]
  (let [webview (.lookup tab-content "#build_webview")
        engine (.getEngine webview)
        out-pipe (PipedWriter.)
        in (LineNumberingPushbackReader. (PipedReader. out-pipe))
        pout (PipedWriter.)
        out (PrintWriter. pout)
        in-pipe (PipedReader. pout)]
    (swap! runtime-state-atom
      (fn [runtime-state]
        (-> runtime-state
            (assoc-in [:processes project-path :in] in)
            (assoc-in [:processes project-path :out] out)
            (assoc-in [:processes project-path :in-pipe] in-pipe)
            (assoc-in [:processes project-path :out-pipe] out-pipe))))
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
              (finally (println "\n=== Finished ===")))))))))

(defn start-builder-process! [tab-content runtime-state-atom project-path print-str args]
  (let [process (get-in @runtime-state-atom [:processes project-path :process] (atom nil))]
    (proc/stop-process! process)
    (swap! runtime-state-atom assoc-in [:processes project-path :process] process)
    (start-builder-thread! tab-content runtime-state-atom project-path
      (fn []
        (println print-str)
        (proc/start-java-process! process project-path args)))))

(defn stop-builder-process! [runtime-state-atom project-path]
  (let [process (get-in @runtime-state-atom [:processes project-path :process])]
    (proc/stop-process! process)))

(definterface Bridge
  (onload [])
  (onchange [])
  (onenter [text])
  (isConsole []))

(defn init-console! [webview runtime-state-atom path]
  (.setContextMenuEnabled webview false)
  (let [engine (.getEngine webview)]
    (.load engine (str "http://localhost:"
                       (:web-port @runtime-state-atom)
                       "/paren-soup.html"))
    (-> engine
        (.executeScript "window")
        (.setMember "java"
          (proxy [Bridge] []
            (onload [])
            (onchange [])
            (onenter [text]
              (when-let [out-pipe (get-in @runtime-state-atom [:processes path :out-pipe])]
                (.write out-pipe text)
                (.flush out-pipe)))
            (isConsole []
              true))))))

(def index->system {0 :boot 1 :lein})
(def system->index (set/map-invert index->system))

(defn get-selected-build-system [pane]
  (-> (.lookup pane "#build_tabs") .getSelectionModel .getSelectedIndex index->system))

(defn select-build-system! [pane system]
  (-> (.lookup pane "#build_tabs") .getSelectionModel (.select (system->index system))))

(defn get-tab [pane system]
  (-> (.lookup pane "#build_tabs")
      .getTabs
      (.get (system->index system))))

(defn get-tab-content [pane system]
  (.getContent (get-tab pane system)))

(defn refresh-builder! [tab repl?]
  (some-> tab
          (.lookup "#build_webview")
          .getEngine
          (.executeScript (if repl? "initConsole(true)" "initConsole(false)"))))

(defn build-system->class-name [system]
  (case system
    :boot "Boot"
    :lein l/class-name))

(defn start-builder! [pref-state runtime-state-atom print-str cmd]
  (when-let [project-path (u/get-project-path pref-state)]
    (when-let [pane (get-in @runtime-state-atom [:project-panes project-path])]
      (when-let [system (get-selected-build-system pane)]
        (let [tab-content (get-tab-content pane system)]
          (refresh-builder! tab-content (= cmd "repl"))
          (start-builder-process! tab-content runtime-state-atom project-path print-str [(build-system->class-name system) cmd]))))))

(defn stop-builder! [pref-state runtime-state-atom]
  (when-let [project-path (u/get-project-path pref-state)]
    (stop-builder-process! runtime-state-atom project-path)))

(defn init-builder! [pane runtime-state-atom path]
  (let [systems (u/build-systems path)]
    ; select/disable build tabs
    (cond
      (:boot systems) (select-build-system! pane :boot)
      (:lein systems) (select-build-system! pane :lein))
    (.setDisable (get-tab pane :boot) (not (:boot systems)))
    (.setDisable (get-tab pane :lein) (not (:lein systems)))
    ; init the tabs
    (doseq [system systems]
      (let [tab (doto (get-tab pane system)
                  (.setDisable false))
            tab-content (.getContent tab)
            buttons (-> tab-content .getChildren (.get 0) .getChildren seq)
            webview (-> tab-content .getChildren (.get 1))]
        (shortcuts/add-tooltips! buttons)
        (init-console! webview runtime-state-atom path)))))

; specs

(fdef pipe-into-console!
  :args (s/cat :engine :clojure.spec/any :in-pipe #(instance? java.io.Reader %)))

(fdef start-builder-thread!
  :args (s/cat :tab-content spec/pane? :runtime-state-atom spec/atom? :project-path string? :work-fn fn?))

(fdef start-builder-process!
  :args (s/cat :tab-content spec/pane? :runtime-state-atom spec/atom? :project-path string? :print-str string? :args (s/coll-of string? [])))

(fdef stop-builder-process!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string?))

(fdef init-console!
  :args (s/cat :webview spec/node? :runtime-state-atom spec/atom? :path string?))

(fdef get-selected-build-system
  :args (s/cat :pane spec/pane?)
  :ret (s/nilable keyword?))

(fdef select-build-system!
  :args (s/cat :pane spec/pane? :system keyword?))

(fdef get-tab
  :args (s/cat :pane spec/pane? :system keyword?)
  :ret #(instance? javafx.scene.control.Tab %))

(fdef get-tab-content
  :args (s/cat :pane spec/pane? :system keyword?)
  :ret spec/pane?)

(fdef refresh-builder!
  :args (s/cat :tab-content spec/pane? :repl? boolean?))

(fdef build-system->class-name
  :args (s/cat :system keyword?)
  :ret string?)

(fdef start-builder!
  :args (s/cat :pref-state map? :runtime-state-atom spec/atom? :print-str string? :cmd string?))

(fdef stop-builder!
  :args (s/cat :pref-state map? :runtime-state-atom spec/atom?))

(fdef init-builder!
  :args (s/cat :pane spec/pane? :runtime-state-atom spec/atom? :path string?))

