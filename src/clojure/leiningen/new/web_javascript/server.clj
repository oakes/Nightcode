(ns {{namespace}}
  (:require [compojure.core :as c]
            [ring.adapter.jetty :refer [run-jetty]]
            [ring.middleware.params :refer [wrap-params]]
            [ring.middleware.resource :refer [wrap-resource]]
            [hiccup.core :as h])
  (:gen-class))

(def ^:const port 3000)
(defonce server (atom nil))

(c/defroutes app
  (c/GET "/" request
    (h/html [:html
             [:head
              [:link {:rel "stylesheet" :href "page.css"}]]
             [:body
              [:div
               [:p {:id "clickable"} "Click me!"]]
              [:script {:src "main.js"}]]])))

(defn -main [& args]
  (when @server
    (.stop @server))
  (reset! server
          (-> app
              (wrap-resource "public")
              (wrap-params)
              (run-jetty {:port port :join? false})))
  (println "Running on" (str "http://localhost:" port)))