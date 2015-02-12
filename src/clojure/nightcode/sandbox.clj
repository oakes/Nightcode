(ns nightcode.sandbox
  (:require [clojure.java.io :as io]
            [nightcode.utils :as utils]))

; filesystem

(defn get-dir
  []
  (System/getProperty "SandboxDirectory"))

(defn get-path
  [& dirs]
  (.getCanonicalPath (apply io/file (System/getProperty "user.home") dirs)))

(defn add-dir
  [args]
  (if-let [dir (get-dir)]
    (concat [(first args) (str "-DSandboxDirectory=" dir)] (rest args))
    args))

(defn get-env
  []
  (when (get-dir)
    (let [path (get-path ".lein")]
      (into-array String [(str "LEIN_HOME=" path)]))))

(defn set-home!
  []
  (some->> (get-dir) get-path (System/setProperty "user.home")))

(defn set-temp-dir!
  []
  (when (get-dir)
    (let [dir (get-path ".temp")]
      (-> dir io/file .mkdir)
      (System/setProperty "java.io.tmpdir" dir))))

(defn create-profiles-clj!
  []
  (when (get-dir)
    (let [profiles-clj (get-path ".lein" "profiles.clj")
          m2 (get-path ".m2")
          tmp (get-path ".temp")
          jvm-opts [(str "-Djava.io.tmpdir=" tmp)
                    (str "-Duser.home=" (get-path (get-dir)))]
          profile {:local-repo m2
                   :jvm-opts jvm-opts
                   :gwt {:extraJvmArgs (clojure.string/join " " jvm-opts)}}
          profiles {:user profile
                    :uberjar profile}]
      (doto (io/file profiles-clj)
        (-> .getParentFile .mkdir)
        (spit (pr-str profiles))))))

; objc

(defn get-objc-client
  []
  (some-> (try (Class/forName "ca.weblite.objc.Client")
            (catch Exception _))
          (.getMethod "getInstance" (into-array Class []))
          (.invoke nil (object-array []))))

(defn base64->nsdata
  [text]
  (some-> (get-objc-client)
          (.sendProxy "NSData" "data" (object-array []))
          (.send "initWithBase64Encoding:" (object-array [text]))))

(defn write-file-permission!
  [path]
  (some-> (get-objc-client)
          (.sendProxy "NSURL" "fileURLWithPath:" (object-array [path]))
          (.sendProxy "bookmarkDataWithOptions:includingResourceValuesForKeys:relativeToURL:error:"
            (object-array [2048 nil nil nil]))
          (.sendString "base64Encoding" (object-array []))))

(defn read-file-permission!
  [text]
  (some-> (get-objc-client)
          (.sendProxy "NSURL" "URLByResolvingBookmarkData:options:relativeToURL:bookmarkDataIsStale:error:"
            (object-array [(base64->nsdata text) 1024 nil false nil]))
          (.send "startAccessingSecurityScopedResource" (object-array []))))

; permissions used to be stored in a monolithic "permission map"
; but now they are stored as individual key-value pairs.

(defn read-file-permissions!
  []
  (let [permission-map (delay (utils/read-pref :permission-map))]
    (doseq [path (utils/read-pref :project-set)]
      (some-> (or (utils/read-pref path)
                  (get @permission-map path))
              read-file-permission!))))

(defn save-file-permission!
  [path]
  (some->> (write-file-permission! path)
           (utils/write-pref! path)))

(defn remove-file-permission!
  [path]
  (if (utils/read-pref path)
    (utils/remove-pref! path)
    (some->> (dissoc (utils/read-pref :permission-map) path)
             (utils/write-pref! :permission-map))))
