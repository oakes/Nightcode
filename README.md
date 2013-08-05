## Introduction

Nightcode is a simple IDE for Clojure and Java. It integrates a copy of Leiningen as well as the lein-droid and lein-cljsbuild plugins. The goal is to provide a simple, all-in-one solution to get started with Clojure/Java programming for the console, the desktop, the web, and Android.

## Working With Source

Nichtcode can be built and run with [Leiningen](http://leiningen.org/), [git](http://git-scm.com/), and the [JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) on your path.

the following commands can be used to build and run Nightcode

    $ git clone https://github.com/oakes/Nightcode.git
    $ cd Nightcode
    $ lein run (this may take a while to compile)

and when you want to get the latest source from the repository:

    $ git pull
    

## Licensing

All source files that originate from this project are dedicated to the public domain. That particularly includes the files in `src/clojure/nightcode`. All third-party code in this project remains under their original licenses. I would love pull requests, and will assume that any Clojure contributions are also dedicated to the public domain.
