(ns net.sekao.nightcode.boot
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [clojure.spec :as s :refer [fdef]]
            [net.sekao.nightcode.spec :as spec])
  (:import [boot.App]))

(fdef boot!
  :args (s/cat :dir string? :args (s/* string?)))
(defn ^:no-check boot! [dir & args]
  (let [old-dir (System/getProperty "user.dir")]
    (System/setProperty "user.dir" dir)
    (System/setProperty "java.security.policy"
                        (-> "java.policy" io/resource .toString))
    (System/setSecurityManager
      (proxy [SecurityManager] []
        (checkExit [status]
          (throw (Exception.)))))
    (try
      (boot.App/main (into-array String args))
      (catch Exception _)
      (finally
        (System/setSecurityManager nil)
        (System/setProperty "user.dir" old-dir)))))

(fdef new-project!
  :args (s/cat :file spec/file? :template string?))
(defn ^:no-check new-project! [file template]
  (let [dir (-> file .getParentFile .getCanonicalPath)
        project-name (-> file .getName str/lower-case)]
    (boot! dir
      "--no-boot-script"
      "-d" "seancorfield/boot-new:0.4.2" "new"
      "-t" template
      "-n" project-name)))
