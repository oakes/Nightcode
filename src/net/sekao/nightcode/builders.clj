(ns net.sekao.nightcode.builders
  (:require [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]
            [clojure.spec :as s :refer [fdef]])
  (:import [clojure.lang LineNumberingPushbackReader]
           [javafx.scene.web WebEngine]
           [java.io PipedWriter PipedReader PrintWriter]
           [javafx.application Platform]
           [net.sekao.nightcode.editors Bridge]))

(fdef onload
  :args (s/cat :engine :clojure.spec/any :out-pipe spec/writer? :work-fn fn?))
(defn onload [^WebEngine engine out-pipe work-fn]
  (let [in (LineNumberingPushbackReader. (PipedReader. out-pipe))
        pout (PipedWriter.)
        out (PrintWriter. pout)
        in-pipe (PipedReader. pout)
        ca (char-array 256)]
    ; thread that runs the work fn
    (.start
      (Thread.
        (fn []
          (binding [*out* out
                    *err* out
                    *in* in]
            (work-fn)))))
    ; thread that pipes the work fn's output into the webview
    (.start
      (Thread.
        (fn []
          (loop [read (.read in-pipe ca)]
            (when (pos? read)
              (let [s (String. ca 0 read)
                    cmd (format "append('%s')" (u/escape-js s))]
                (Platform/runLater
                  (fn []
                    (.executeScript engine cmd)))
                (recur (.read in-pipe ca))))))))))

(fdef init-console!
  :args (s/cat :webview spec/node? :runtime-state map? :work-fn fn?))
(defn init-console! [webview runtime-state work-fn]
  (.setContextMenuEnabled webview false)
  (let [engine (.getEngine webview)
        out-pipe (PipedWriter.)]
    (.load engine (str "http://localhost:"
                       (:web-port runtime-state)
                       "/paren-soup.html"))
    (-> engine
        (.executeScript "window")
        (.setMember "java"
          (proxy [Bridge] []
            (onload []
              (try
                (onload engine out-pipe work-fn)
                (catch Exception e (.printStackTrace e))))
            (onchange [])
            (onenter [text]
              (.write out-pipe (str text "\n"))
              (.flush out-pipe))
            (isConsole []
              true))))))

(fdef init-builder!
  :args (s/cat :pane spec/pane? :runtime-state map? :path string?))
(defn init-builder! [pane runtime-state path]
  (let [buttons (-> pane .getChildren (.get 0) .getChildren seq)
        webview (-> pane .getChildren (.get 1))]
    (shortcuts/add-tooltips! buttons)
    (init-console! webview runtime-state clojure.main/repl)))
