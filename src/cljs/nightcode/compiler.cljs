(ns nightcode.compiler
  (:require [cljs.reader :refer [read-string]])
  (:import goog.net.XhrIo))

(defn read-and-eval-forms [forms cb]
  (try
    (.send XhrIo
      "/eval"
      (fn [e]
        (if (.isSuccess (.-target e))
          (->> (.. e -target getResponseText)
               read-string
               (mapv #(if (vector? %) (into-array %) %))
               cb)
          (cb [])))
      "POST"
      (pr-str (into [] forms)))
    (catch js/Error _ (cb []))))

(set! (.-onmessage js/self)
      (fn [e]
        (let [forms (.-data e)]
          (read-and-eval-forms
            forms
            (fn [results]
              (.postMessage js/self (into-array results)))))))

