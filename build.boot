(set-env!
  :source-paths #{"src"}
  :resource-paths #{"resources"}
  :dependencies '[[org.clojure/test.check "0.9.0" :scope "test"]
                  ; project deps
                  [org.clojure/clojure "1.9.0-alpha3"]
                  [boot/core "2.5.5"]
                  [ring "1.4.0"]
                  [cross-parinfer "1.1.6"]
                  [html-soup "1.2.2"]])

(task-options!
  pom {:project 'nightcode
       :version "2.0.0-SNAPSHOT"}
  aot {:namespace '#{net.sekao.nightcode.core
                     net.sekao.nightcode.controller}}
  jar {:main 'net.sekao.nightcode.core
       :manifest {"Description" "An IDE for Clojure and ClojureScript"
                  "Url" "https://github.com/oakes/Nightcode"}})

(require '[clojure.spec :as s]
         '[clojure.spec.test :as t])

(deftask run []
  (comp
    (aot)
    (with-pre-wrap fileset
      (require '[net.sekao.nightcode.core :refer [dev-main]])
      ((resolve 'dev-main))
      fileset)))

(deftask run-repl []
  (comp
    (aot)
    (repl :init-ns 'net.sekao.nightcode.core)))

(deftask build []
  (comp (aot) (pom) (uber) (jar)))

(deftask spec []
  (comp
    (aot)
    (with-pre-wrap fileset
      (require '[net.sekao.nightcode.core])
      (let [vs (s/speced-vars)
            reporter-fn println]
        (reduce
          (fn [totals v]
            (if (-> v meta :no-check)
              totals
              (let [_  (println "Checking" v)
                    ret (t/check-var v :reporter-fn reporter-fn)]
                (prn ret)
                (cond-> totals
                        true (update :test inc)
                        (true? (:result ret)) (update :pass inc)
                        (:clojure.spec.test/problems (:result ret)) (update :fail inc)
                        (instance? Throwable (:result ret)) (update :error inc)))))
          {:test 0, :pass 0, :fail 0, :error 0}
          vs))
      fileset)))
