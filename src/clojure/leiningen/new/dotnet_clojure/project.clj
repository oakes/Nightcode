(defproject {{app-name}} "0.0.1-SNAPSHOT"
  :description "FIXME: write description"
  :dependencies []
  :warn-on-reflection true
  :plugins [[lein-clr "0.2.1"]]
  :clr {:cmd-templates {:clj-exe [["target" "clr" "lib" "{{internal-dir}}" %1]]
                        :clj-zip [".." ".." ".." "{{zip-path}}"]
                        :unzip ["jar" "xf" %2]}
        :deps-cmds [[:unzip "" :clj-zip]]
        :main-cmd [:clj-exe "Clojure.Main.exe"]
        :compile-cmd [:clj-exe "Clojure.Compile.exe"]}
  :aot [{{namespace}}]
  :main {{namespace}})
