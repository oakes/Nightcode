(ns net.sekao.nightcode.editors
  (:require [clojure.java.io :as io]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.spec :as spec])
  (:import [javafx.fxml FXMLLoader]))

(def ^:const clojure-exts #{"boot" "clj" "cljc" "cljs" "cljx" "edn" "pxi"})
(def ^:const wrap-exts #{"md" "txt"})

(fdef handler
  :args (s/cat :request map?)
  :ret (s/nilable map?))
(defn handler [request]
  (when (= (:uri request) "/")
    (redirect "/index.html")))

(fdef start-web-server!
  :args (s/cat)
  :ret integer?)
(defn start-web-server! []
  (-> handler
      (wrap-resource "public")
      (wrap-content-type)
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))

(fdef remove-editors!
  :args (s/cat :path string? :state spec/atom?))
(defn remove-editors! [^String path state-atom]
  (doseq [[editor-path pane] (:editor-panes @state-atom)]
    (when (u/parent-path? path editor-path)
      (swap! state-atom update :editor-panes dissoc editor-path)
      (shortcuts/hide-tooltips! pane)
      (-> pane .getParent .getChildren (.remove pane)))))

(definterface Bridge
  (onload []))

(fdef editor-pane
  :args (s/cat :state map? :file spec/file?)
  :ret spec/pane?)
(defn editor-pane [state file]
  (let [pane (FXMLLoader/load (io/resource "editor.fxml"))
        buttons (-> pane .getChildren (.get 0) .getChildren seq)
        webview (-> pane .getChildren (.get 1))
        engine (.getEngine webview)
        clojure? (-> file .getName u/get-extension clojure-exts)]
    (shortcuts/add-tooltips! buttons)
    (-> engine
        (.executeScript "window")
        (.setMember "java"
          (proxy [Bridge] []
            (onload []
              ; set the page content
              (-> engine
                  .getDocument
                  (.getElementById "content")
                  (.setTextContent (slurp file)))
              ; inject paren-soup
              (when clojure?
                (let [body (-> engine .getDocument (.getElementsByTagName "body") (.item 0))
                      script (-> engine .getDocument (.createElement "script"))]
                  (.setAttribute script "src" "paren-soup.js")
                  (.appendChild body script)))))))
    (.load engine (str "http://localhost:"
                    (:web-port state)
                    (if clojure? "/index.html" "/index2.html")))
    pane))
