(ns net.sekao.nightcode.builders
  (:require [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.lein :as l]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.process :as proc]
            [clojure.spec :as s :refer [fdef]])
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

(defn start-builder-thread! [runtime-state-atom project-path work-fn]
  (let [project-pane (get-in @runtime-state-atom [:project-panes project-path])
        webview (.lookup project-pane "#build_webview")
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

(defn start-builder-process! [runtime-state-atom project-path print-str args]
  (let [process (get-in @runtime-state-atom [:processes project-path :process] (atom nil))]
    (proc/stop-process! process)
    (swap! runtime-state-atom assoc-in [:processes project-path :process] process)
    (start-builder-thread! runtime-state-atom project-path
      (fn []
        (println print-str)
        (proc/start-java-process! process project-path args)))))

(defn stop-builder-process! [runtime-state-atom project-path]
  (let [process (get-in @runtime-state-atom [:processes project-path :process])]
    (proc/stop-process! process)))

(defn refresh-builder! [runtime-state project-path repl?]
  (some-> runtime-state
          (get-in [:project-panes project-path])
          (.lookup "#build_webview")
          .getEngine
          (.executeScript (if repl? "initConsole(true)" "initConsole(false)"))))

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

(defn get-selected-build-system [pane]
  (cond
    (.isSelected (.lookup pane "#boot")) :boot
    (.isSelected (.lookup pane "#lein")) :lein))

(defn build-system->class-name [build-system]
  (case build-system
    :boot "Boot"
    :lein l/class-name))

(defn update-builder-buttons! [pane systems]
  (when (< (count systems) 2)
    (.setManaged (.lookup pane "#boot") false)
    (.setManaged (.lookup pane "#lein") false))
  (.addListener (-> (.lookup pane "#boot") .getToggleGroup .selectedToggleProperty)
    (reify ChangeListener
      (changed [this observable old-value new-value]
        (let [show? (-> pane get-selected-build-system (= :lein))]
          (doto (.lookup pane "#clean")
            (.setManaged show?)
            (.setVisible show?))))))
  (cond
    (:boot systems)
    (.setSelected (.lookup pane "#boot") true)
    (:lein systems)
    (.setSelected (.lookup pane "#lein") true)))

(defn start-builder! [pref-state runtime-state-atom print-str cmd]
  (when-let [project-path (u/get-project-path pref-state)]
    (refresh-builder! @runtime-state-atom project-path (= cmd "repl"))
    (when-let [pane (get-in @runtime-state-atom [:project-panes project-path])]
      (when-let [system (get-selected-build-system pane)]
        (start-builder-process! runtime-state-atom project-path print-str [(build-system->class-name system) cmd])))))

(defn stop-builder! [pref-state runtime-state-atom]
  (when-let [project-path (u/get-project-path pref-state)]
    (stop-builder-process! runtime-state-atom project-path)))

(defn init-builder! [pane runtime-state-atom path]
  (let [buttons (-> pane .getChildren (.get 0) .getChildren seq)
        webview (-> pane .getChildren (.get 1))
        systems (u/build-systems path)]
    (shortcuts/add-tooltips! buttons)
    (update-builder-buttons! pane systems)
    (init-console! webview runtime-state-atom path)))

; specs

(fdef pipe-into-console!
  :args (s/cat :engine :clojure.spec/any :in-pipe #(instance? java.io.Reader %)))

(fdef start-builder-thread!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string? :work-fn fn?))

(fdef start-builder-process!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string? :print-str string? :args (s/coll-of string? [])))

(fdef stop-builder-process!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string?))

(fdef refresh-builder!
  :args (s/cat :runtime-state map? :project-path string? :repl? boolean?))

(fdef init-console!
  :args (s/cat :webview spec/node? :runtime-state-atom spec/atom? :path string?))

(fdef update-builder-buttons!
  :args (s/cat :pane spec/pane? :systems (s/coll-of keyword? #{})))

(fdef get-selected-build-system
  :args (s/cat :pane spec/pane?)
  :ret (s/nilable keyword?))

(fdef start-builder!
  :args (s/cat :pref-state map? :runtime-state-atom spec/atom? :print-str string? :cmd string?))

(fdef stop-builder!
  :args (s/cat :pref-state map? :runtime-state-atom spec/atom?))

(fdef init-builder!
  :args (s/cat :pane spec/pane? :runtime-state-atom spec/atom? :path string?))

