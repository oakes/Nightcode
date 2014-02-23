(ns nightcode.sandbox
  (:require [clojure.java.io :as io]
            [nightcode.utils :as utils]))

; filesystem

(defn get-dir
  []
  (System/getProperty "SandboxDirectory"))

(defn get-path
  [& dirs]
  (let [home (System/getProperty "user.home")
        dir (get-dir)]
    (when (and home dir)
      (->> (apply io/file home dir dirs)
           .getCanonicalPath))))

(defn add-local-repo
  [project]
  (let [path (get-path ".m2")]
    (if (and path (nil? (:local-repo project)))
      (assoc project :local-repo path)
      project)))

(defn add-props
  [args]
  (if-let [dir (get-dir)]
    (concat [(first args) (str "-DSandboxDirectory=" dir)] (rest args))
    args))

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
            (object-array [nil nil nil nil]))
          (.sendString "base64Encoding" (object-array []))))

(defn read-file-permission!
  [text]
  (some-> (get-objc-client)
          (.sendProxy "NSURL" "URLByResolvingBookmarkData:options:relativeToURL:bookmarkDataIsStale:error:"
            (object-array [(base64->nsdata text) nil nil false nil]))
          (.send "startAccessingSecurityScopedResource" (object-array []))))

(defn read-file-permissions!
  []
  (doseq [[path text] (utils/read-pref :permission-map)]
    (read-file-permission! text)))

(defn add-to-permission-map!
  [path]
  (some->> (write-file-permission! path)
           (assoc (utils/read-pref :permission-map) path)
           (utils/write-pref! :permission-map)))

(defn remove-from-permission-map!
  [path]
  (some->> (dissoc (utils/read-pref :permission-map) path)
           (utils/write-pref! :permission-map)))

(defn update-permission-map!
  [k path]
  (when-let [old-path (utils/read-pref k)]
    (remove-from-permission-map! old-path))
  (add-to-permission-map! path))
