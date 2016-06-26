(ns net.sekao.nightcode.lein
  (:require [clojure.java.io :as io]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.repl]
            [leiningen.run]
            [leiningen.uberjar]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.spec :as spec]))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (io/file path "project.clj")))

(defn read-project-clj
  [path]
  (-> path get-project-clj-path leiningen.core.project/read-raw))

(defn lein! [[cmd & args]]
  (let [path "."
        project (-> path read-project-clj leiningen.core.project/init-project)]
    (case cmd
      "run" (leiningen.run/run project)
      "repl" (leiningen.repl/repl project)
      "build" (leiningen.uberjar/uberjar project)
      "clean" (leiningen.clean/clean project))))

; specs

(fdef get-project-clj-path
  :args (s/cat :path string?)
  :ret string?)

(fdef read-project-clj
  :args (s/cat :path string?)
  :ret map?)

(fdef lein!
  :args (s/cat :args (s/coll-of string? [])))

