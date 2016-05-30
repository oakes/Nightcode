(ns net.sekao.nightcode.editors
  (:require [clojure.java.io :as io]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [cross-parinfer.core :as cp]
            [html-soup.core :as hs]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.utils :as u]
            [net.sekao.nightcode.spec :as spec])
  (:import [javafx.fxml FXMLLoader]))

(fdef handler
  :args (s/cat :request map?)
  :ret (s/nilable map?))
(defn handler [request]
  (when (= (:uri request) "/")
    (redirect "/index.html")))

(fdef start-web-server!
  :args (s/cat)
  :ret integer?)
(defn ^:no-check start-web-server! []
  (-> handler
      (wrap-resource "public")
      (wrap-content-type)
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))

(fdef remove-editors!
  :args (s/cat :path string? :state spec/atom?))
(defn ^:no-check remove-editors! [^String path state-atom]
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
(defn ^:no-check editor-pane [state file]
  (let [pane (FXMLLoader/load (io/resource "editor.fxml"))
        buttons (-> pane .getChildren (.get 0) .getChildren seq)
        webview (-> pane .getChildren (.get 1))
        engine (.getEngine webview)]
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
              ; refresh paren-soup
              (let [body (-> engine .getDocument (.getElementsByTagName "body") (.item 0))
                    old-elem (-> body (.getElementsByTagName "script") (.item 0))
                    new-elem (-> engine .getDocument (.createElement "script"))]
                (.setAttribute new-elem "src" "paren-soup.js")
                (doto body
                  (.removeChild old-elem)
                  (.appendChild new-elem)))))))
    (.load engine (str "http://localhost:" (:web-port state)))
    pane))
