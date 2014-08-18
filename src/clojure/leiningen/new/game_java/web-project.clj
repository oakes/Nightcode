(defproject {{app-name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogicgames.gdx/gdx "1.3.0"]
                 [com.badlogicgames.gdx/gdx "1.3.0"
                  :classifier "sources"]
                 [com.badlogicgames.gdx/gdx-backend-gwt "1.3.0"]
                 [com.badlogicgames.gdx/gdx-backend-gwt "1.3.0"
                  :classifier "sources"]
                 [com.badlogicgames.gdx/gdx-box2d "1.3.0"]
                 [com.badlogicgames.gdx/gdx-box2d-gwt "1.3.0"]
                 [com.badlogicgames.gdx/gdx-box2d-gwt "1.3.0"
                  :classifier "sources"]
                 [com.google.gwt/gwt-dev "2.6.0"]]
  :java-source-paths ["src" "../desktop/src-common"]
  :javac-options ["-target" "1.7" "-source" "1.7" "-Xlint:-options"]
  :plugins [[gwt-plugin "0.1.6"]]
  :gwt {:module "GdxDefinition"
        :war "webapp"
        :extraJvmArgs "-XX:MaxPermSize=512m"
        :src "src"})
