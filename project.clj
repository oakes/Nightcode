(defproject nightcode "0.4.8-SNAPSHOT"
  :description "An IDE for Clojure and Java"
  :url "https://github.com/oakes/Nightcode"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :dependencies [[com.fifesoft/autocomplete "2.5.7"]
                 [com.fifesoft/rsyntaxtextarea "2.5.7"]
                 [com.github.insubstantial/substance "7.3"]
                 [compliment "0.2.4"]
                 [gwt-plugin "0.1.6"]
                 [hiccup "1.0.5"]
                 [leiningen "2.5.1"
                  :exclusions [leiningen.search]]
                 [lein-ancient "0.5.4"
                  :exclusions [clj-aws-s3]]
                 [lein-cljsbuild "1.0.6"]
                 [lein-clr "0.2.2"]
                 [lein-droid "0.3.5"]
                 [lein-fruit "0.2.3"]
                 [lein-typed "0.3.5"]
                 [net.cgrand/parsley "0.9.3"
                  :exclusions [org.clojure/clojure]]
                 [net.java.balloontip/balloontip "1.2.4.1"]
                 [org.clojure/clojure "1.7.0"]
                 [org.clojure/core.incubator "0.1.3"]
                 [org.clojure/tools.cli "0.3.1"]
                 [org.clojure/tools.namespace "0.2.10"]
                 [org.eclipse.jgit "3.5.3.201412180710-r"
                  :exclusions [org.apache.httpcomponents/httpclient]]
                 [org.flatland/ordered "1.5.3"]
                 [org.lpetit/paredit.clj "0.19.3"
                  :exclusions [net.cgrand/parsley
                               org.clojure/clojure]]
                 [play-clj/lein-template "0.4.7"]
                 [seesaw "1.4.5"]]
  :uberjar-exclusions [#"PHPTokenMaker\.class"
                       #"org\/apache\/lucene"]
  :resource-paths ["resources"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [clojure.main nightcode.core nightcode.lein]
  :main ^:skip-aot nightcode.Nightcode)
