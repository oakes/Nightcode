(ns net.sekao.nightcode.editors
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [cross-parinfer.core :as cp]
            [html-soup.core :as hs]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.projects :as p]
            [net.sekao.nightcode.shortcuts :as shortcuts]
            [net.sekao.nightcode.spec :as spec]))

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
    (when (p/parent-path? path editor-path)
      (swap! state-atom update :editor-panes dissoc editor-path)
      (shortcuts/hide-tooltips! pane)
      (-> pane .getParent .getChildren (.remove pane)))))
