(ns {{namespace}}
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [ring.middleware.resource :refer [wrap-resource]]
            [clojure.java.io :as io])
  (:gen-class))

(defn start-web-server! [handler]
  (run-jetty handler {:port 3000 :join? false}))

(defn web-handler [request]
  (when (= (:uri request) "/")
    {:status 200
     :headers {"Content-Type" "text/html"}
     :body (-> "public/index.html" io/resource slurp)}))

(defn dev-main []
  (.mkdirs (io/file "target" "public"))
  (start-web-server! (wrap-file web-handler "target/public")))

(defn -main [& args]
  (start-web-server! (wrap-resource web-handler "public")))

