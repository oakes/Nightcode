(defproject {{app-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [com.badlogicgames.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-backend-lwjgl "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-platform "0.9.9-SNAPSHOT"
                  :classifier "natives-desktop"]]
  :repositories [["sonatype"
                  "https://oss.sonatype.org/content/repositories/snapshots/"]
                 ["mini2Dx-thirdparty"
                  "http://mini2dx.org/nexus/content/repositories/thirdparty"]
                 ["mini2Dx"
                  "http://mini2dx.org/nexus/content/repositories/releases"]]
  
  :source-paths ["src/clojure" "src-common/clojure"]
  :java-source-paths ["src/java" "src-common/java"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot [{{desktop-namespace}}]
  :main {{desktop-namespace}})
