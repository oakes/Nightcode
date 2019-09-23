(defproject nightcode "2.8.2-SNAPSHOT"
  :description "An IDE for Clojure"
  :url "https://github.com/oakes/Nightcode"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :repositories [["clojars" {:url "https://clojars.org/repo"
                             :sign-releases false}]]
  :aot [nightcode.start nightcode.core nightcode.lein]
  :main nightcode.start)
