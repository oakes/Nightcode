(ns {{namespace}}
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.resource :as resources]
            [ring.util.response :as response])
  (:gen-class))

(defn handler [request]
  (response/redirect "/index.html"))

(def app (resources/wrap-resource handler "public"))

(defn -main [& args]
  (jetty/run-jetty app {:port 3000}))
