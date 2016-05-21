(ns net.sekao.nightcode.editors
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [cross-parinfer.core :as cp]
            [html-soup.core :as hs]))

(defn handler [request]
  (when (= (:uri request) "/")
    (redirect "/index.html")))

(defn start-web-server! []
  (-> handler
      (wrap-resource "public")
      (wrap-content-type)
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))