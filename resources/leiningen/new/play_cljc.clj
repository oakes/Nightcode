(ns leiningen.new.play-cljc
  (:require [leiningen.new.templates :as t]
            [clojure.string :as str]
            [clojure.java.io :as io]))

(defn sanitize-name [s]
  (as-> s $
        (str/trim $)
        (str/lower-case $)
        (str/replace $ "'" "")
        (str/replace $ #"[^a-z0-9]" " ")
        (str/split $ #" ")
        (remove empty? $)
        (str/join "-" $)))

(defn play-cljc-data [name]
  (let [project-name (sanitize-name name)
        core-name "core"]
    (when-not (seq project-name)
      (throw (Exception. (str "Invalid name: " name))))
    {:name project-name
     :core-name core-name
     :project_name (str/replace project-name "-" "_")
     :core_name (str/replace core-name "-" "_")}))

(defn play-cljc*
  [{:keys [project_name core_name] :as data}]
  (let [render (t/renderer "play-cljc")]
    {".gitignore" (render "gitignore" data)
     "project.clj" (render "project.clj" data)
     (str "src/" project_name "/music.clj") (render "music.clj" data)
     (str "src/" project_name "/" core_name ".cljc") (render "core.cljc" data)
     (str "src/" project_name "/utils.cljc") (render "utils.cljc" data)
     (str "src/" project_name "/move.cljc") (render "move.cljc" data)
     (str "src/" project_name "/start.clj") (render "start.clj" data)
     (str "src/" project_name "/start_dev.clj") (render "start_dev.clj" data)
     "resources/public/index.html" (render "index.html" data)
     "resources/public/player_walk1.png" (-> "images/player_walk1.png" io/resource io/input-stream)
     "resources/public/player_walk2.png" (-> "images/player_walk2.png" io/resource io/input-stream)
     "resources/public/player_walk3.png" (-> "images/player_walk3.png" io/resource io/input-stream)}))

(defn play-cljc
  [name & _]
  (let [data (play-cljc-data name)
        path->content (play-cljc* data)]
    (apply t/->files data (vec path->content))))

