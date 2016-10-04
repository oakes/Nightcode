(ns nightcode.lein
  (:require [clojure.java.io :as io]
            [leiningen.core.project]
            [leiningen.clean]
            [leiningen.repl]
            [leiningen.run]
            [leiningen.uberjar]
            [leiningen.new]
            [clojure.spec :as s :refer [fdef]]
            [nightcode.spec :as spec])
  (:gen-class))

(def class-name (str *ns*))

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (io/file path "project.clj")))

(defn read-project-clj
  [path]
  (-> path
      get-project-clj-path
      leiningen.core.project/read-raw
      (assoc-in [:repl-options :subsequent-prompt] (fn [ns] ""))))

(defn lein! [[cmd & args]]
  (let [path "."
        project (-> path read-project-clj leiningen.core.project/init-project)]
    (case cmd
      "run" (leiningen.run/run project)
      "repl" (leiningen.repl/repl project)
      "build" (leiningen.uberjar/uberjar project)
      "clean" (leiningen.clean/clean project))))

(defn -main [& args]
  (System/setProperty "jline.terminal" "dumb")
  (lein! args)
  (System/exit 0))

(defn new! [parent-path project-type project-name]
  (System/setProperty "leiningen.original.pwd" parent-path)
  (leiningen.new/new {} (name project-type) project-name (str project-name ".core")))

; specs

(fdef get-project-clj-path
  :args (s/cat :path string?)
  :ret string?)

(fdef read-project-clj
  :args (s/cat :path string?)
  :ret map?)

(fdef lein!
  :args (s/cat :args (s/coll-of string?)))

(fdef new!
  :args (s/cat :parent-path string? :project-type keyword? :project-name string?))

