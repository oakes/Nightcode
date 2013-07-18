(defproject {{raw-name}} "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogic.gdx/gdx "0.9.9-SNAPSHOT"]
                 [com.badlogic.gdx/gdx-backend-lwjgl "0.9.9-SNAPSHOT"]]
  :repositories [["libgdx" "http://libgdx.badlogicgames.com/nightlies/maven/"]]
  :java-source-paths ["src" "../common"]
  :main {{desktop-namespace}})
