(defproject {{name}} "0.1.0-SNAPSHOT"
  :repositories [["clojars" {:url "https://clojars.org/repo"
                             :sign-releases false}]]
  :clean-targets ^{:protect false} ["target"]
  :dependencies [[org.clojure/clojure "1.10.1"]
                 [edna "1.6.0"]]
  :jvm-opts ~(if (= "Mac OS X" (System/getProperty "os.name"))
               ["-XstartOnFirstThread"]
               [])
  :profiles {:dev {:main {{name}}.start-dev
                   :dependencies [[paravim "RELEASE"]
                                  [orchestra "2018.12.06-2"]
                                  [expound "0.7.2"]]}
             :uberjar {:main {{name}}.start
                       :aot [{{name}}.start]
                       :dependencies [[play-cljc "0.8.5"]
                                      [org.lwjgl/lwjgl "3.2.3"]
                                      [org.lwjgl/lwjgl-glfw "3.2.3"]
                                      [org.lwjgl/lwjgl-opengl "3.2.3"]
                                      [org.lwjgl/lwjgl-stb "3.2.3"]
                                      [org.lwjgl/lwjgl "3.2.3" :classifier "natives-linux"]
                                      [org.lwjgl/lwjgl-glfw "3.2.3" :classifier "natives-linux"]
                                      [org.lwjgl/lwjgl-opengl "3.2.3" :classifier "natives-linux"]
                                      [org.lwjgl/lwjgl-stb "3.2.3" :classifier "natives-linux"]
                                      [org.lwjgl/lwjgl "3.2.3" :classifier "natives-macos"]
                                      [org.lwjgl/lwjgl-glfw "3.2.3" :classifier "natives-macos"]
                                      [org.lwjgl/lwjgl-opengl "3.2.3" :classifier "natives-macos"]
                                      [org.lwjgl/lwjgl-stb "3.2.3" :classifier "natives-macos"]
                                      [org.lwjgl/lwjgl "3.2.3" :classifier "natives-windows"]
                                      [org.lwjgl/lwjgl-glfw "3.2.3" :classifier "natives-windows"]
                                      [org.lwjgl/lwjgl-opengl "3.2.3" :classifier "natives-windows"]
                                      [org.lwjgl/lwjgl-stb "3.2.3" :classifier "natives-windows"]]}})
