(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogic.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogic.gdx/gdx-backend-lwjgl "0.9.9-SNAPSHOT"]
                 [org.mini2Dx/mini2Dx-core "0.8"]
                 [org.mini2Dx/mini2Dx-tiled "0.8"]
                 [org.mini2Dx/mini2Dx-dependency-injection "0.8"]]
  :repositories [["libgdx" "http://libgdx.badlogicgames.com/nightlies/maven/"]
                 ["mini2Dx-thirdparty"
                  "http://mini2dx.org/nexus/content/repositories/thirdparty"]
                 ["mini2Dx"
                  "http://mini2dx.org/nexus/content/repositories/releases"]]
  :java-source-paths ["src" "../common"]
  :main {{desktop-namespace}})
