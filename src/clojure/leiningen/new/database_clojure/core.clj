(ns {{namespace}}
  (:require [clojure.java.jdbc :as jdbc])
  (:gen-class))

(def ^:const db-path "./main")
(def ^:const spec {:classname "org.h2.Driver"
                   :subprotocol "h2"
                   :subname db-path})

(defn table-exists?
  [table-name]
  (try
    (jdbc/query spec [(str "SELECT COUNT(*) FROM " table-name)])
    true
    (catch Exception _ false)))

(defn create-table!
  [table-name]
  (->> (jdbc/create-table-ddl
         table-name
         [:id "BIGINT" "PRIMARY KEY AUTO_INCREMENT"]
         [:title "VARCHAR"]
         [:body "VARCHAR"]
         [:time "BIGINT"])
       (jdbc/db-do-commands spec)))

(defn populate-table!
  [table-name & rows]
  (when-not (table-exists? table-name)
    (create-table! table-name)
    (doseq [r rows]
      (jdbc/insert! spec table-name r))))

(defn -main
  []
  (populate-table! "posts"
                   {:title "First post!"
                    :body "This is my first post."
                    :time (System/currentTimeMillis)}
                   {:title "Second post!"
                    :body "This is my second post."
                    :time (System/currentTimeMillis)})
  (->> ["SELECT * FROM posts WHERE title = ?"
        "First post!"]
       (jdbc/query spec)
       println))
