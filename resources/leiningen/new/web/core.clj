(ns {{namespace}}
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.middleware.content-type :refer [wrap-content-type]]
            [ring.util.response :refer [not-found]]
            [clojure.java.io :as io])
  (:gen-class))

(defn start-web-server! [handler]
  (run-jetty handler {:port 3000 :join? false}))

(defn web-handler [request]
  (case (:uri request)
    "/" {:status 200
         :headers {"Content-Type" "text/html"}
         :body (-> "public/index.html" io/resource slurp)}
    (not-found "Page not found")))

(defn dev-main []
  (.mkdirs (io/file "target" "public"))
  (start-web-server! (-> web-handler
                         (wrap-content-type)
                         (wrap-file "target/public"))))

(defn -main [& args]
  (start-web-server! (-> web-handler
                         (wrap-content-type)
                         (wrap-resource "public"))))

