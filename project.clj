(defproject nightcode "1.3.2"
  :description "An IDE for Clojure and Java"
  :url "https://github.com/oakes/Nightcode"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :dependencies [[com.fifesoft/autocomplete "2.5.8"]
                 [com.fifesoft/rsyntaxtextarea "2.5.8"]
                 [org.pushing-pixels/radiance-substance "2.0.1"]
                 [compliment "0.2.7"]
                 [hiccup "1.0.5"]
                 [leiningen "2.9.5"
                  :exclusions [leiningen.search]]
                 [mistakes-were-made "1.6.3"]
                 [net.java.balloontip/balloontip "1.2.4.1"]
                 [org.clojure/clojure "1.10.1"]
                 [org.clojure/tools.cli "1.0.194"]
                 [org.clojure/tools.namespace "1.1.0"]
                 [org.eclipse.jgit "3.5.3.201412180710-r"
                  :exclusions [org.apache.httpcomponents/httpclient]]
                 [org.flatland/ordered "1.5.9"]
                 [seesaw "1.4.5"]
                 [cross-parinfer "1.1.8"]]
  :uberjar-exclusions [#"PHPTokenMaker\.class"
                       #"org\/apache\/lucene"]
  :resource-paths ["resources"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :aot [clojure.main nightcode.core nightcode.lein]
  :main ^:skip-aot nightcode.Nightcode)
