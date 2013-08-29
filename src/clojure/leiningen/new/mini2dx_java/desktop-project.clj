(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogicgames.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-backend-lwjgl "0.9.9-SNAPSHOT"]
                 [com.badlogicgames.gdx/gdx-platform "0.9.9-SNAPSHOT"
                  :classifier "natives-desktop"]
                 [org.mini2Dx/mini2Dx-core "0.8"]
                 [org.mini2Dx/mini2Dx-tiled "0.8"]
                 [org.mini2Dx/mini2Dx-dependency-injection "0.8"]]
  :repositories [["sonatype" "https://oss.sonatype.org/content/repositories/snapshots/"]
                 ["mini2Dx-thirdparty"
                  "http://mini2dx.org/nexus/content/repositories/thirdparty"]
                 ["mini2Dx"
                  "http://mini2dx.org/nexus/content/repositories/releases"]]
  :java-source-paths ["src" "src-common"]
  :aot :all
  :main {{desktop-namespace}})
