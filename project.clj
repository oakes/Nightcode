(defproject nightcode "1.3.2"
  :description "An IDE for Clojure and Java"
  :url "https://github.com/oakes/Nightcode"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :dependencies [[com.fifesoft/autocomplete "2.5.8"]
                 [com.fifesoft/rsyntaxtextarea "2.5.8"]
                 [com.github.insubstantial/substance "7.3"]
                 [compliment "0.2.7"]
                 [gwt-plugin "0.1.6"]
                 [hiccup "1.0.5"]
                 [leiningen "2.6.1"
                  :exclusions [leiningen.search]]
                 [lein-ancient "0.5.4"
                  :exclusions [clj-aws-s3]]
                 [lein-cljsbuild "1.1.3"]
                 [lein-clr "0.2.2"]
                 [lein-droid "0.4.3"]
                 [lein-typed "0.3.5"]
                 [lein-ring "0.9.7"]
                 [mistakes-were-made "1.6.3"]
                 [net.java.balloontip/balloontip "1.2.4.1"]
                 [org.clojure/clojure "1.8.0"]
                 [org.clojure/core.incubator "0.1.3"]
                 [org.clojure/tools.cli "0.3.5"]
                 [org.clojure/tools.namespace "0.2.10"]
                 [org.eclipse.jgit "3.5.3.201412180710-r"
                  :exclusions [org.apache.httpcomponents/httpclient]]
                 [org.flatland/ordered "1.5.3"]
                 [play-clj/lein-template "1.1.0.1"]
                 [seesaw "1.4.5"]
                 [cross-parinfer "1.1.8"]]
  :uberjar-exclusions [#"PHPTokenMaker\.class"
                       #"org\/apache\/lucene"]
  :resource-paths ["resources"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [clojure.main nightcode.core nightcode.lein]
  :main ^:skip-aot nightcode.Nightcode)
