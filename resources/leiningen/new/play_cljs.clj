(ns leiningen.new.play-cljs
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

(defn play-cljs
  [name & _]
  (let [render (t/renderer "play-cljs")
        sanitized-name (sanitize-name name)
        _ (when-not (seq sanitized-name)
            (throw (Exception. (str "Invalid name: " name))))
        data {:name sanitized-name
              :dir (str/replace sanitized-name "-" "_")}]
    (t/->files data
      ["README.md" (render "README.md" data)]
      [".gitignore" (render "gitignore" data)]
      ["build.boot" (render "build.boot" data)]
      ["boot.properties" (render "boot.properties" data)]
      ["src/{{dir}}/core.cljs" (render "core.cljs" data)]
      ["src/{{dir}}/music.clj" (render "music.clj" data)]
      ["resources/public/index.html" (render "index.html" data)]
      ["dev-resources/public/main.cljs.edn" (render "main.cljs.edn.dev" data)]
      ["prod-resources/public/main.cljs.edn" (render "main.cljs.edn.prod" data)])))

