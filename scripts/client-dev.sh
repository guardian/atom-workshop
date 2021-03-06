#!/usr/bin/env bash

echo "Running client-dev script"
node_version=`cat .nvmrc`
echo "This project requires Node version" $node_version ". If the build fails, try running 'nvm use' to make sure you are on the correct version"

IS_DEBUG=false
for arg in "$@"
do
    if [ "$arg" == "--debug" ]; then
        IS_DEBUG=true
        shift
    fi
done

fileExists() {
  test -e "$1"
}

export JS_ASSET_HOST="https://atomworkshop.local.dev-gutools.co.uk/assets/"

if [ "$IS_DEBUG" = true ] ; then
    yarn start & sbt -jvm-debug 5055 "run 9050"
else
    yarn start & sbt "run 9050"
fi
