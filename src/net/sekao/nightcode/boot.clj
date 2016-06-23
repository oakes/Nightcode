(ns net.sekao.nightcode.boot
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u]))

(defn boot! [args]
  (let [c (Class/forName "boot.App")
        m (->> c .getMethods (filter #(= "main" (.getName %))) first)
        args (into-array String args)]
    (.invoke m nil (into-array Object [args]))))

(defn boot-in-process! [dir & args]
  (let [old-dir (System/getProperty "user.dir")]
    (System/setProperty "user.dir" dir)
    (try
      (u/with-security (boot! args))
      (catch SecurityException _))
    (System/setProperty "user.dir" old-dir)))

(defn new-project! [file template]
  (let [dir (-> file .getParentFile .getCanonicalPath)
        project-name (-> file .getName str/lower-case)]
    (boot-in-process! dir
      "--no-boot-script"
      "-d" "seancorfield/boot-new" "new"
      "-t" template
      "-n" project-name)))

; specs

(fdef boot!
  :args (s/cat :args (s/coll-of string? [])))

(fdef boot-in-process!
  :args (s/cat :dir string? :args (s/* string?)))

(fdef new-project!
  :args (s/cat :file spec/file? :template string?))

