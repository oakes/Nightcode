(ns paredit.regex-utils
  (:refer-clojure :exclude [partition])
  (:import java.util.regex.Pattern))

(defprotocol Patternable (pattern [this] "given this, returns a String corresponding to the pattern"))

(extend-protocol Patternable
  Pattern
  (pattern [this] (.pattern this))
  String
  (pattern [this] this))

;; Copied from old clojure.contrib.str-utils2
;; Which (AFAIK) has not been ported to modular contribs
;; nor been integrated into clojure.string (or maybe in clojure 1.3?)
(defn partition
  "Splits the string into a lazy sequence of substrings, alternating
  between substrings that match the patthern and the substrings
  between the matches.  The sequence always starts with the substring
  before the first match, or an empty string if the beginning of the
  string matches.

  For example: (partition \"abc123def\" #\"[a-z]+\")
  returns: (\"\" \"abc\" \"123\" \"def\")"
  [^String s ^Pattern re]
  (let [m (re-matcher re s)]
    ((fn step [prevend]
       (lazy-seq
        (if (.find m)
          (cons (.subSequence s prevend (.start m))
                (cons (re-groups m)
                      (step (+ (.start m) (count (.group m))))))
          (when (< prevend (.length s))
            (list (.subSequence s prevend (.length s)))))))
     0)))

(defmacro interpol-regex
  "delim: literal char (or one-char String) for delimiting where the variables are. Optional, defaults to \\`
   regex: literal regex, or an object which implements protocol Patternable
   Usage: (interpol-regex \"foo\") => #\"foo\"
          (interpol-regex #\"foo\" => #\"foo\"
          (let [x #\"baz\\(\" y \"bar\"] (interpol-regex #\"(?:a|`x`|`y`)\") 
            => #\"(?:a|baz\\(|bar)\""
  ([regex] `(interpol-regex \` ~regex))
  ([delim regex]
    (let [escaped-delim (str \\ delim)
          partitioning-pattern (Pattern/compile (str escaped-delim "([^" escaped-delim "]+)" escaped-delim))
          exploded-pattern (partition (pattern regex) partitioning-pattern)]
      `(java.util.regex.Pattern/compile (str ~@(map #(if (string? %) % `(str "(?:" (pattern ~(symbol (get % 1))) ")")) exploded-pattern))))))

