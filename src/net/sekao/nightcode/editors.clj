(ns net.sekao.nightcode.editors
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.util.response :refer [redirect]]))

(defn handler [request]
  (when (= (:uri request) "/")
    (redirect "/index.html")))

(defn start-web-server! []
  (-> handler
      (wrap-resource "public")
      (run-jetty {:port 0 :join? false})
      .getConnectors
      (aget 0)
      .getLocalPort))
