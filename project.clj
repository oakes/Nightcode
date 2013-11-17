(defproject nightcode "0.1.5"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :dependencies [[com.github.insubstantial/substance "7.2.1"]
                 [com.fifesoft/autocomplete "2.5.0"]
                 [com.fifesoft/rsyntaxtextarea "2.5.0"]
                 [compliment "0.0.3"]
                 [leiningen "2.3.3"]
                 [lein-cljsbuild "1.0.0-alpha2"]
                 [lein-droid "0.2.0-preview4"]
                 [lein-fruit "0.1.1"]
                 [org.apache.bcel/bcel "5.2"]
                 [org.clojure/clojure "1.5.1"]
                 [org.clojure/core.incubator "0.1.3"]
                 [org.flatland/ordered "1.5.2"]
                 [org.lpetit/paredit.clj "0.19.3"]
                 [net.java.balloontip/balloontip "1.2.4"]
                 [seesaw "1.4.4"]]
  :resource-paths ["resources" "tools"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [clojure.main nightcode.core nightcode.lein]
  :main nightcode.core)
