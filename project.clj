(defproject nightcode "0.3.4-SNAPSHOT"
  :description "An IDE for Clojure and Java"
  :url "https://github.com/oakes/Nightcode"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :dependencies [[com.github.insubstantial/substance "7.2.1"]
                 [compliment "0.0.3"]
                 [leiningen "2.3.4"]
                 [lein-ancient "0.5.4" :exclusions [clj-aws-s3]]
                 [lein-cljsbuild "1.0.3"]
                 [lein-droid "0.2.3"]
                 [lein-fruit "0.2.0"]
                 [net.java.balloontip/balloontip "1.2.4.1"]
                 [org.apache.bcel/bcel "5.2"]
                 [org.clojars.oakes/autocomplete "2.5.2"]
                 [org.clojars.oakes/rsyntaxtextarea "2.5.2"]
                 [org.clojure/clojure "1.6.0"]
                 [org.clojure/core.incubator "0.1.3"]
                 [org.clojure/tools.cli "0.3.1"]
                 [org.clojure/tools.namespace "0.2.4"]
                 [org.flatland/ordered "1.5.2"]
                 [org.lpetit/paredit.clj "0.19.3"]
                 [play-clj/lein-template "0.3.1"]
                 [seesaw "1.4.4"]]
  :resource-paths ["resources" "tools"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [clojure.main nightcode.core nightcode.lein]
  :main ^:skip-aot nightcode.Nightcode)
