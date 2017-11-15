(ns nightcode.lein
  (:require [clojure.java.io :as io]
            [leiningen.core.project :as project]
            [leiningen.clean]
            [leiningen.repl]
            [leiningen.run]
            [leiningen.uberjar]
            [leiningen.test]
            [leiningen.new]
            [clojure.spec.alpha :as s :refer [fdef]]
            [nightcode.spec :as spec])
  (:gen-class))

(def class-name (str *ns*))

(fdef get-project-clj-path
  :args (s/cat :path string?)
  :ret string?)

(defn get-project-clj-path
  [path]
  (.getCanonicalPath (io/file path "project.clj")))

(fdef read-project-clj
  :args (s/cat :path string?)
  :ret map?)

(defn read-project-clj
  [path]
  (-> path
      get-project-clj-path
      leiningen.core.project/read-raw
      (assoc-in [:repl-options :subsequent-prompt] (fn [ns] ""))))

(fdef lein!
  :args (s/cat :args (s/coll-of string?)))

(defn lein! [[cmd & args]]
  (try
    (project/ensure-dynamic-classloader)
    (catch Exception _))
  (let [path "."
        project (-> path read-project-clj leiningen.core.project/init-project)]
    (case cmd
      "run" (leiningen.run/run project)
      "repl" (leiningen.repl/repl project)
      "build" (leiningen.uberjar/uberjar project)
      "test" (leiningen.test/test project)
      "clean" (leiningen.clean/clean project))))

(fdef new!
  :args (s/cat :parent-path string? :project-type keyword? :project-name string?))

(defn new! [parent-path project-type project-name]
  (System/setProperty "leiningen.original.pwd" parent-path)
  (leiningen.new/new {} (name project-type) project-name (str project-name ".core")))

(defn -main [& args]
  (System/setProperty "jline.terminal" "dumb")
  (lein! args)
  (System/exit 0))

