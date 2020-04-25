#!/usr/bin/env bash

cp package.json out && README.md

npm publish out --access=public

rm out/package.json out/README.md
