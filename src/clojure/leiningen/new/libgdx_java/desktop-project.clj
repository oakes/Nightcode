(defproject {{app-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  
  :dependencies [[com.badlogicgames.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-backend-lwjgl "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-platform "0.9.9-SNAPSHOT"
                  :classifier "natives-desktop"]]
  :repositories [["sonatype"
                  "https://oss.sonatype.org/content/repositories/snapshots/"]]
  
  :java-source-paths ["src" "src-common"]
  :javac-options ["-target" "1.6" "-source" "1.6" "-Xlint:-options"]
  :aot :all
  :main {{desktop-namespace}})
