(ns {{namespace}}
  (:require [pink.oscillators :refer [sine]]
            [pink.simple :refer :all]
            [pink.space :refer [pan]]))

(defn play []
  ; start audio engine
  (start-engine)
  
  ; create panned, sine audio function
  (def audio-fn (pan (sine 340.0) 0.0))
  
  ; add audio function to engine
  (add-afunc audio-fn)
  
  ; sleep for a bit
  (Thread/sleep 2000)
  
  ; remove audio function from engine
  (remove-afunc audio-fn)
  
  ; stop audio engine
  (stop-engine))

(defn -main [& args]
  (play))
