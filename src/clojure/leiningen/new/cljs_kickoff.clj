(ns leiningen.new.cljs-kickoff
  (:require [leiningen.new.templates :refer [renderer name-to-path ->files]]))

(def render (renderer "cljs-kickoff"))

(defn cljs-kickoff
  [name]
  (let [data {:name name
              :sanitized (name-to-path name)}]
    (->files data
             ["project.clj" (render "project.clj" data)]
             ["src/clj/{{sanitized}}/server.clj" (render "server.clj" data)]
             ["src/cljs/{{sanitized}}/client.cljs" (render "client.cljs" data)]
             ["resources/public/css/page.css" (render "page.css" data)]
             ["resources/public/help.html" (render "help.html" data)])))
