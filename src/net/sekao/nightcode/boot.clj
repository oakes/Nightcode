(ns net.sekao.nightcode.boot
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]
            [boot.core]
            [boot.main]
            [boot.aether])
  (:import [boot.App])
  (:gen-class))

(fdef boot!
  :args (s/cat :args (s/coll-of string? [])))
(defn boot! [args]
  (boot.App/main (into-array String args)))

(fdef boot-in-process!
  :args (s/cat :dir string? :args (s/* string?)))
(defn boot-in-process! [dir & args]
  (let [old-dir (System/getProperty "user.dir")]
    (System/setProperty "user.dir" dir)
    (try
      (u/with-security (boot! args))
      (catch SecurityException _))
    (System/setProperty "user.dir" old-dir)))

(fdef new-project!
  :args (s/cat :file spec/file? :template string?))
(defn new-project! [file template]
  (let [dir (-> file .getParentFile .getCanonicalPath)
        project-name (-> file .getName str/lower-case)]
    (boot-in-process! dir
      "--no-boot-script"
      "-d" "seancorfield/boot-new" "new"
      "-t" template
      "-n" project-name)))

