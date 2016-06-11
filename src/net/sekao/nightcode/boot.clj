(ns net.sekao.nightcode.boot
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.spec :as spec]
            [net.sekao.nightcode.utils :as u])
  (:import [boot.App]))

(fdef boot!
  :args (s/cat :dir string? :args (s/* string?)))
(defn boot! [dir & args]
  (let [old-dir (System/getProperty "user.dir")]
    (System/setProperty "user.dir" dir)
    (u/with-security
      (boot.App/main (into-array String args)))
    (System/setProperty "user.dir" old-dir)))

(fdef new-project!
  :args (s/cat :file spec/file? :template string?))
(defn new-project! [file template]
  (let [dir (-> file .getParentFile .getCanonicalPath)
        project-name (-> file .getName str/lower-case)]
    (boot! dir
      "--no-boot-script"
      "-d" "seancorfield/boot-new" "new"
      "-t" template
      "-n" project-name)))
