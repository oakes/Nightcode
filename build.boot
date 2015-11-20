(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/clojure "1.7.0"]
                  [prismatic/schema "0.4.3"]])

(require
  '[net.sekao.nightcode.core :as app])

(deftask run []
  (with-pre-wrap fileset
    (app/-main)
    fileset))

(deftask build []
  (comp
   (aot :namespace '#{net.sekao.nightcode.core})
   (pom :project 'nightcode
        :version "1.0.0-SNAPSHOT")
   (uber)
   (jar :main 'net.sekao.nightcode.core)))
