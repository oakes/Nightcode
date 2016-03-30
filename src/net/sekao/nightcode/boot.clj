(ns net.sekao.nightcode.boot
  (:require [clojure.java.io :as io]
            [clojure.string :as str])
  (:import [boot.App]))

(defn boot! [dir & args]
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

(defn new-project! [file template]
  (let [dir (.getCanonicalPath (.getParentFile file))
        project-name (str/lower-case (.getName file))]
    (boot! dir
      "--no-boot-script"
      "-d" "seancorfield/boot-new:0.4.2" "new"
      "-t" template
      "-n" project-name)))
