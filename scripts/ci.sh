#!/usr/bin/env bash

set -e

setupNvm() {
    export NVM_DIR="$HOME/.nvm"
    [[ -s "$NVM_DIR/nvm.sh" ]] && . "$NVM_DIR/nvm.sh"  # This loads nvm

    nvm install
    nvm use
}

globalJsDependencies() {
    npm install -g yarn
}

yarnSetup() {
    yarn install --force --frozen-lockfile
    yarn lint
    yarn test
    yarn build
}

riffRaffUpload() {
    sbt clean compile riffRaffUpload
}

main() {
    setupNvm
    globalJsDependencies
    yarnSetup
    riffRaffUpload
}

main