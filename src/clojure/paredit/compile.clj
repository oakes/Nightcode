(ns paredit.compile)

(set! *warn-on-reflection* true)

(defn all []
  (compile 'paredit.loc-utils)
  (compile 'paredit.text-utils)
  (compile 'paredit.parser)
  (compile 'paredit.core-commands)
  (compile 'paredit.core))