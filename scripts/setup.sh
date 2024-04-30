#!/usr/bin/env bash

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR=${DIR}/..

fileExists() {
  test -e "$1"
}

echo "Running setup script"
node_version=`cat .nvmrc`
echo "This project requires Node version" $node_version " Run 'nvm use' or use another node version manager to get the correct version"

brew bundle --file=${ROOT_DIR}/Brewfile

dev-nginx setup-app ${ROOT_DIR}/nginx/nginx-mapping.yml

printf "\n\rSetting up client side dependancies... \n\r\n\r"
printf "\n\rInstalling NPM packages via yarn... \n\r\n\r"

yarn

printf "\n\Compiling Javascript... \n\r\n\r"

yarn build

printf "\n\rDone.\n\r\n\r"
