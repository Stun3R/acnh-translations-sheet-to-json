#!/usr/bin/env bash

yarn ts-node index.ts

yarn prettier:fix
yarn prettier "out/*.json" --write