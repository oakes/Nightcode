(require
  '[leiningen.core.project :as p :refer [defproject]]
  '[leiningen.clean :refer [clean]]
  '[leiningen.install :refer [install]]
  '[leiningen.deploy :refer [deploy]]
  '[leiningen.uberjar :refer [uberjar]])

(defn read-project-clj []
  (p/ensure-dynamic-classloader)
  (-> "project.clj" load-file var-get))

(defn read-deps-edn [aliases-to-include]
  (let [{:keys [paths deps aliases]} (-> "deps.edn" slurp clojure.edn/read-string)
        deps (->> (select-keys aliases aliases-to-include)
                  vals
                  (mapcat :extra-deps)
                  (into deps)
                  (reduce
                    (fn [deps [artifact info]]
                      (if-let [version (:mvn/version info)]
                        (conj deps
                          (transduce cat conj [artifact version]
                            (select-keys info [:scope :exclusions])))
                        deps))
                    []))]
    {:dependencies deps
     :source-paths []
     :resource-paths paths}))

(defmulti task first)

(defmethod task :default
  [_]
  (let [all-tasks  (-> task methods (dissoc :default) keys sort)
        interposed (->> all-tasks (interpose ", ") (apply str))]
    (println "Unknown or missing task. Choose one of:" interposed)
    (System/exit 1)))

(defmethod task "uberjar"
  [_]
  (let [project (-> (read-project-clj)
                    (merge (read-deps-edn []))
                    (update :dependencies into
                            '[[org.openjfx/javafx-graphics "11.0.2" :classifier "win"]
                              [org.openjfx/javafx-graphics "11.0.2" :classifier "linux"]
                              [org.openjfx/javafx-graphics "11.0.2" :classifier "mac"]
                              [org.openjfx/javafx-web "11.0.2" :classifier "win"]
                              [org.openjfx/javafx-web "11.0.2" :classifier "linux"]
                              [org.openjfx/javafx-web "11.0.2" :classifier "mac"]])
                    p/init-project)]
    (clean project)
    (uberjar project)))

(defmethod task "install"
  [_]
  (-> (read-project-clj)
      (merge (read-deps-edn []))
      p/init-project
      install)
  (System/exit 0))

(defmethod task "deploy"
  [_]
  (-> (read-project-clj)
      (merge (read-deps-edn []))
      p/init-project
      (deploy "clojars"))
  (System/exit 0))

;; entry point

(task *command-line-args*)

