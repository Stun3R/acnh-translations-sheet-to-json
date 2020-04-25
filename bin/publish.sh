#!/usr/bin/env bash

cp package.json out && cp README.md out

npm publish out --access=public

rm out/package.json out/README.md
