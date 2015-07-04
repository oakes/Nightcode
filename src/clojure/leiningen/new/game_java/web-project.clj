(defproject {{app-name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies [[com.badlogicgames.gdx/gdx "1.6.0"]
                 [com.badlogicgames.gdx/gdx "1.6.0"
                  :classifier "sources"]
                 [com.badlogicgames.gdx/gdx-backend-gwt "1.6.0"]
                 [com.badlogicgames.gdx/gdx-backend-gwt "1.6.0"
                  :classifier "sources"]
                 [com.badlogicgames.gdx/gdx-box2d "1.6.0"]
                 [com.badlogicgames.gdx/gdx-box2d-gwt "1.6.0"]
                 [com.badlogicgames.gdx/gdx-box2d-gwt "1.6.0"
                  :classifier "sources"]
                 [com.google.gwt/gwt-dev "2.6.1"]]
  :java-source-paths ["src" "../desktop/src-common"]
  :javac-options ["-target" "1.7" "-source" "1.7" "-Xlint:-options"]
  :gwt {:module "GdxDefinition"
        :war "{{web-app-dir}}"
        :src "src"})
