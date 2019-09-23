![screenshot](screenshot.png)

## Introduction

Nightcode is a simple IDE for Clojure and ClojureScript. See [the website](https://sekao.net/nightcode/) for more information.

## Development

* Install JDK 11 or above
* Install [the Clojure CLI tool](https://clojure.org/guides/getting_started#_clojure_installer_and_cli_tools)
* To develop: `clj -A:dev`
* To build the ClojureScript files: `clj -A:cljs`
* To build the uberjar for each OS:
  * `clj -A:prod uberjar windows`
  * `clj -A:prod uberjar macos`
  * `clj -A:prod uberjar linux`

## Licensing

All files that originate from this project are dedicated to the public domain. I would love pull requests, and will assume that they are also dedicated to the public domain.
