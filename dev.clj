(require
  '[orchestra.spec.test :as st]
  '[expound.alpha :as expound]
  '[clojure.spec.alpha :as s])

(st/instrument)
(alter-var-root #'s/*explain-out* (constantly expound/printer))

(-> "classes" java.io.File. .mkdir)
(compile 'nightcode.lein)
(compile 'nightcode.core)
(require '[nightcode.core :refer [dev-main]])
(dev-main)

