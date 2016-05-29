(ns net.sekao.nightcode.editors
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [redirect]]
            [cross-parinfer.core :as cp]
            [html-soup.core :as hs]
            [clojure.spec :as s :refer [fdef]]))

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