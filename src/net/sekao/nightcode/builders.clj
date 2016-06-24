(ns net.sekao.nightcode.builders
  (:require [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.process :as proc]
            [clojure.spec :as s :refer [fdef]])
  (:import [clojure.lang LineNumberingPushbackReader]
           [javafx.scene.web WebEngine]
           [java.io PipedWriter PipedReader PrintWriter]
           [javafx.application Platform]))

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

(defn start-builder! [runtime-state-atom project-path work-fn]
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

(defn start-builder-process! [runtime-state-atom project-path command print-str]
  (let [process (get-in @runtime-state-atom [:processes project-path :process] (atom nil))]
    (proc/stop-process! process)
    (swap! runtime-state-atom assoc-in [:processes project-path :process] process)
    (start-builder! runtime-state-atom project-path
      (fn []
        (println print-str)
        (proc/start-java-process! process project-path "Boot" command)))))

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

(defn init-builder! [pane runtime-state-atom path]
  (let [buttons (-> pane .getChildren (.get 0) .getChildren seq)
        webview (-> pane .getChildren (.get 1))]
    (shortcuts/add-tooltips! buttons)
    (init-console! webview runtime-state-atom path)))

; specs

(fdef pipe-into-console!
  :args (s/cat :engine :clojure.spec/any :in-pipe #(instance? java.io.Reader %)))

(fdef start-builder!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string? :work-fn fn?))

(fdef start-builder-process!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string? :command string? :print-str string?))

(fdef stop-builder-process!
  :args (s/cat :runtime-state-atom spec/atom? :project-path string?))

(fdef refresh-builder!
  :args (s/cat :runtime-state map? :project-path string? :repl? boolean?))

(fdef init-console!
  :args (s/cat :webview spec/node? :runtime-state-atom spec/atom? :path string?))

(fdef init-builder!
  :args (s/cat :pane spec/pane? :runtime-state-atom spec/atom? :path string?))

