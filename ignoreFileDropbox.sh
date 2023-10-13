#!/bin/sh

attr -s com.dropbox.ignored -V 1 ${PWD}/node_modules
attr -s com.dropbox.ignored -V 1 ${PWD}/dist
attr -s com.dropbox.ignored -V 1 ${PWD}/dist_electron
