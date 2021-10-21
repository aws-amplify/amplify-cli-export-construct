#!/bin/bash

version=$(curl "https://raw.githubusercontent.com/aws-amplify/amplify-cli/tagged-release-without-e2e-tests/amplify-export2/packages/amplify-e2e-core/package.json" | jq .version | tr -d '"')
echo $version

npm i https://github.com/aws-amplify/amplify-cli/archive/refs/tags/amplify-e2e-core@1.31.0-amplify-export2.0.tar.gz

cd ./node_modules/amplify-cli/packages/amplify-e2e-core
yarn build
pwd