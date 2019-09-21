(ns leiningen.new.edna
  (:require [leiningen.new.templates :as t]
            [clojure.string :as str]))

(defn sanitize-name [s]
  (as-> s $
        (str/trim $)
        (str/lower-case $)
        (str/replace $ "'" "")
        (str/replace $ #"[^a-z0-9]" " ")
        (str/split $ #" ")
        (remove empty? $)
        (str/join "-" $)))

(def initial-score
  "[:piano {:octave 4
         :tempo 74}
 
 1/8 #{:-d :-a :e :f#} :a 1/2 #{:f# :+d}
 1/8 #{:-e :e :+c} :a 1/2 #{:c :e}
 
 1/8 #{:-d :-a :e :f#} :a :+d :+c# :+e :+d :b :+c#
 1/2 #{:-e :c :a} 1/2 #{:c :e}]")

(defn edna-data [name]
  (let [sanitized-name (sanitize-name name)]
    (when-not (seq sanitized-name)
      (throw (Exception. (str "Invalid name: " name))))
    {:name sanitized-name
     :dir (str/replace sanitized-name "-" "_")
     :initial-score initial-score}))

(defn edna*
  [{:keys [dir] :as data}]
  (let [render (t/renderer "edna")
        music (str "(ns " (:name data) ".music)\n\n" (:initial-score data))]
    {"README.md" (render "README.md" data)
     ".gitignore" (render "gitignore" data)
     "build.boot" (render "build.boot" data)
     "boot.properties" (render "boot.properties" data)
     (str "src/" dir "/music.clj") music
     (str "src/" dir "/core.cljs") (render "core.cljs" data)
     (str "src/" dir "/core.clj") (render "core.clj" data)
     "resources/public/index.html" (render "index.html" data)
     "resources/public/main.cljs.edn" (render "main.cljs.edn" data)}))

(defn edna
  [name & _]
  (let [data (edna-data name)
        path->content (edna* data)]
    (apply t/->files data (vec path->content))))

