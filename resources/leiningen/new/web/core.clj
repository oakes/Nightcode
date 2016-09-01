(ns {{namespace}}
  (:require [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.file :refer [wrap-file]]
            [ring.middleware.resource :refer [wrap-resource]]
            [ring.util.response :refer [redirect]]
            [clojure.java.io :as io])
  (:gen-class))

(defonce web-server (atom nil))

(defn start-web-server! [handler]
  (reset! web-server (run-jetty handler {:port 3000 :join? false})))

(defn web-handler [request]
  (when (= (:uri request) "/")
    (redirect "/index.html")))

(defn dev-main []
  (when-not @web-server
    (.mkdirs (io/file "target" "public"))
    (start-web-server! (wrap-file web-handler "target/public"))))

(defn -main [& args]
  (start-web-server! (wrap-resource web-handler "public")))

