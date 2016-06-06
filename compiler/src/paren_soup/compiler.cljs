(ns paren-soup.compiler)

(set! (.-onmessage js/self)
      (fn [e]
        (let [forms (.-data e)]
          (.postMessage js/self (into-array [])))))
