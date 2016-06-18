(ns net.sekao.nightcode.builders
  (:require [clojure.string :as str]
            [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.spec :as spec]
            [clojure.spec :as s :refer [fdef]])
  (:import [clojure.lang LineNumberingPushbackReader]
           [javafx.scene.web WebEngine]
           [java.io PipedWriter PipedReader PrintWriter]
           [javafx.application Platform]
           [net.sekao.nightcode.editors Bridge]))

(fdef onload
  :args (s/cat :engine :clojure.spec/any :work-fn fn?))
(defn onload [^WebEngine engine work-fn]
  (let [out-pipe (PipedWriter.)
        in (PipedReader. out-pipe)
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
                    *in* (LineNumberingPushbackReader. in)]
            (work-fn)))))
    ; thread that pipes the work fn's output into the webview
    (.start
      (Thread.
        (fn []
          (loop [read (.read in-pipe ca)]
            (when (pos? read)
              (let [s (String. ca 0 read)
                    cmd (format "append('%s')"
                          (str/escape s {\' "\\'"}))]
                (Platform/runLater
                  (fn []
                    (.executeScript engine cmd)))
                (recur (.read in-pipe ca))))))))))

(fdef init-console!
  :args (s/cat :webview spec/node? :runtime-state map? :work-fn fn?))
(defn init-console! [webview runtime-state work-fn]
  (let [engine (.getEngine webview)]
    (.load engine (str "http://localhost:"
                      (:web-port runtime-state)
                      "/paren-soup.html"))
    (-> engine
        (.executeScript "window")
        (.setMember "java"
          (proxy [Bridge] []
            (onload []
              (try
                (onload engine work-fn)
                (catch Exception e (.printStackTrace e)))))))))

(fdef init-builder!
  :args (s/cat :pane spec/pane? :runtime-state map? :path string?))
(defn init-builder! [pane runtime-state path]
  (let [buttons (-> pane .getChildren (.get 0) .getChildren seq)
        webview (-> pane .getChildren (.get 1))]
    (shortcuts/add-tooltips! buttons)
    (init-console! webview runtime-state clojure.main/repl)))
