(defproject nightcode "0.0.9"
  :license {:name "Public Domain"
            :url "http://unlicense.org/UNLICENSE"}
  :dependencies [[com.github.insubstantial/substance "7.1"]
                 [com.fifesoft/rsyntaxtextarea "2.0.6"]
                 [leiningen "2.3.1"]
                 [lein-cljsbuild "0.3.2"]
                 [lein-droid "0.2.0-beta1"]
                 [org.clojure/clojure "1.5.1"]
                 [org.flatland/ordered "1.5.1"]
                 [org.kovas/paredit-widget "0.1.1-SNAPSHOT"]
                 [net.java.balloontip/balloontip "1.2.1"]
                 [seesaw "1.4.3"]]
  :resource-paths ["resources" "tools"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :aot  [nightcode.core nightcode.lein]
  :main nightcode.core)
