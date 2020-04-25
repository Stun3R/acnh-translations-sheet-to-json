#!/usr/bin/env bash

yarn ts-node index.ts

yarn quicktype out/items.json -o out/items.ts --just-types -t Items
yarn quicktype out/creatures.json -o out/creatures.ts --just-types -t Creatures
yarn quicktype out/villagers.json -o out/villagers.ts --just-types -t Villagers
yarn quicktype out/construction.json -o out/construction.ts --just-types -t Construction
yarn quicktype out/specialnpc.json -o out/specialnpc.ts --just-types -t SpecialNpc
yarn quicktype out/reactions.json -o out/reactions.ts --just-types -t Reactions
yarn quicktype out/all.json -o out/all.ts --just-types -t Item

yarn prettier:fix
yarn prettier "out/*.json" --write

yarn tsc -p tsconfig.types.json
