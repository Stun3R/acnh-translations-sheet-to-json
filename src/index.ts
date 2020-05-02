import {OAuth2Client} from 'google-auth-library';
import {google, sheets_v4} from 'googleapis';
import fs from 'fs';
import {zipObject} from 'lodash';
import {oslogin} from 'googleapis/build/src/apis/oslogin';

const SHEET_ID = '1BjqVeqIrfEezvyrWLUrwMjmK_UbY2LXkZ12mttamTtk';

const LOCALE = [
  {name: 'English', iso: 'en_US'},
  {name: 'English (Europe)', iso: 'en_GB'},
  {name: 'German', iso: 'de_DE'},
  {name: 'Spanish', iso: 'es_ES'},
  {name: 'Spanish (US)', iso: 'es_US'},
  {name: 'French', iso: 'fr_FR'},
  {name: 'French (US)', iso: 'fr_CA'},
  {name: 'Italian', iso: 'it_IT'},
  {name: 'Dutch', iso: 'nl_NL'},
  {name: 'Chinese', iso: 'zh_CN'},
  {name: 'Chinese (Traditional)', iso: 'zh_TW'},
  {name: 'Japanese', iso: 'ja_JP'},
  {name: 'Korean', iso: 'ko_KR'},
  {name: 'Russian', iso: 'ru_RU'},
];

const CONSTELLATIONS_SHEETS = ['Constellations'];

const CONSTRUCTION_SHEETS = ['Bridge & Inclines'];

const CRAFT_SHEETS = ['Craft'];

const FISH_SHEETS = ['Fish'];

const BUGS_SHEETS = ['Bugs'];

const DINOSAURS_SHEETS = ['Dinosaurs'];

const ETC_SHEETS = ['ETC'];

const EVENTS_SHEETS = ['Events'];

const FASHION_SHEETS = ['Fashion Themes'];

const HHA_SHEETS = ['HHA Themes'];

const HOUSEDOOR_SHEETS = ['House Door'];

const HOUSEROOF_SHEETS = ['House Roof'];

const HOUSEWALL_SHEETS = ['House Wall'];

const HOUSEMAILBOX_SHEETS = ['House Mailbox'];

const FURNITURE_SHEETS = ['Furniture'];

const EVENTITEMS_SHEETS = ['Event Items'];

const ART_SHEETS = ['Art'];

const FLOORS_SHEETS = ['Floors'];

const WALLS_SHEETS = ['Walls'];

const RUGS_SHEETS = ['Rugs'];

const FENCE_SHEETS = ['Fence'];

const FOSSILS_SHEETS = ['Fossils'];

const SHELLS_SHEETS = ['Shells'];

const ACCESSORIES_SHEETS = ['Accessories'];

const BAGS_SHEETS = ['Bags'];

const BOTTOMS_SHEETS = ['Bottoms'];

const CAPS_SHEETS = ['Caps'];

const MASKS_SHEETS = ['Masks'];

const DRESSES_SHEETS = ['Dresses'];

const SHOES_SHEETS = ['Socks'];

const TOPS_SHEETS = ['Tops'];

const SOCKS_SHEETS = ['Socks'];

const UMBRELLA_SHEETS = ['Umbrella'];

const DOORPLATES_SHEETS = ['Doorplates'];

const POSTERS_SHEETS = ['Posters'];

const PICTURES_SHEETS = ['Pictures'];

const MUSIC_SHEETS = ['K.K. Albums'];

const TOOLS_SHEETS = ['Tools'];

const PLANTS_SHEETS = ['Plants'];

const FISHMODELS_SHEETS = ['Fish Models'];

const BUGSMODELS_SHEETS = ['Bugs Models'];

const REACTIONS_SHEETS = ['Reactions'];

const SPECIALNPC_SHEETS = ['Special NPCs'];

const VILLAGERS_SHEETS = ['Villagers'];

const CATCHPHRASE_SHEETS = ['Villagers Catch Phrase'];

const ITEM_SHEETS = [
  'Furniture',
  'Event Items',
  'Art',
  'Floors',
  'Walls',
  'Rugs',
  'Fence',
  'Fossils',
  'Shells',
  'Accessories',
  'Bags',
  'Bottoms',
  'Caps',
  'Masks',
  'Dresses',
  'Shoes',
  'Socks',
  'Tops',
  'Umbrella',
  'Doorplates',
  'Posters',
  'Pictures',
  'K.K. Albums',
  'Tools',
  'Plants',
  'Fish Models',
  'Bugs Models',
];

const VARIANTS_SHEETS = ['Furniture Variants'];

type ItemData = any[];

export async function main(auth: OAuth2Client) {
  const sheets = google.sheets({version: 'v4', auth});

  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache');
  }

  if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
  }

  let workSet: Array<[string, string[]]> = [
    ['variants', VARIANTS_SHEETS],
    ['constellations', CONSTELLATIONS_SHEETS],
    ['bridgeslopes', CONSTRUCTION_SHEETS],
    ['doorplates', DOORPLATES_SHEETS],
    ['posters', POSTERS_SHEETS],
    ['pictures', PICTURES_SHEETS],
    ['music', MUSIC_SHEETS],
    ['tools', TOOLS_SHEETS],
    ['plants', PLANTS_SHEETS],
    ['fishmodels', FISHMODELS_SHEETS],
    ['bugsmodels', BUGSMODELS_SHEETS],
    ['catchphrases', CATCHPHRASE_SHEETS],
    ['crafts', CRAFT_SHEETS],
    ['fish', FISH_SHEETS],
    ['bugs', BUGS_SHEETS],
    ['fossils', FOSSILS_SHEETS],
    ['hhathemes', HHA_SHEETS],
    ['housedoor', HOUSEDOOR_SHEETS],
    ['housewall', HOUSEWALL_SHEETS],
    ['housemailbox', HOUSEMAILBOX_SHEETS],
    ['houseroof', HOUSEROOF_SHEETS],
    ['furniture', FURNITURE_SHEETS],
    ['eventitems', EVENTITEMS_SHEETS],
    ['arts', ART_SHEETS],
    ['fences', FENCE_SHEETS],
    ['shells', SHELLS_SHEETS],
    ['accessories', ACCESSORIES_SHEETS],
    ['bags', BAGS_SHEETS],
    ['bottoms', BOTTOMS_SHEETS],
    ['caps', CAPS_SHEETS],
    ['masks', MASKS_SHEETS],
    ['dresses', DRESSES_SHEETS],
    ['shoes', SHOES_SHEETS],
    ['tops', TOPS_SHEETS],
    ['socks', SOCKS_SHEETS],
    ['umbrella', UMBRELLA_SHEETS],
    ['floors', FLOORS_SHEETS],
    ['walls', WALLS_SHEETS],
    ['rugs', RUGS_SHEETS],
    ['dinosaurs', DINOSAURS_SHEETS],
    ['etc', ETC_SHEETS],
    ['events', EVENTS_SHEETS],
    ['fashion', FASHION_SHEETS],
    ['villagers', VILLAGERS_SHEETS],
    ['specialnpcs', SPECIALNPC_SHEETS],
    ['reactions', REACTIONS_SHEETS],
  ];

  const items = [];

  for (const [key, sheetNames] of workSet) {
    console.log(`Loading ${key}`);

    console.log('Loading Data from spreadsheet...');
    let data = await loadData(sheets, sheetNames, key);
    console.log('Normalizing Data...');
    data = await normalizeData(data, key);

    if (ITEM_SHEETS.includes(sheetNames[0])) {
      data = await variantsInData(data);
      items.push(...data);
    }

    console.log(`Writing data to disk`);
    fs.writeFileSync(`out/${key}.json`, JSON.stringify(data, undefined, ' '), {
      flag: 'w+',
    });

    console.log(`Finished ${key}`);
  }

  const all = [];

  for (const [key] of workSet) {
    if (key !== 'items') {
      const data = require(`../out/${key}.json`);

      all.push(...data);
    }
  }

  fs.writeFileSync(`out/items.json`, JSON.stringify(items, undefined, ' '), {
    flag: 'w+',
  });

  fs.writeFileSync(`out/all.json`, JSON.stringify(all, undefined, ' '), {
    flag: 'w+',
  });
}

export async function loadData(
  sheets: sheets_v4.Sheets,
  sheetNames: string[],
  key: string,
) {
  const cacheFile = `cache/${key}.json`;

  try {
    const file = fs.readFileSync(cacheFile);

    return JSON.parse(file.toString());
  } catch (e) {} // ignored

  let data: ItemData = [];

  for (const sheetName of sheetNames) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: sheetName,
      valueRenderOption: 'FORMULA',
    });

    const [header, ...rows] = response.data.values!;

    for (const row of rows) {
      data.push({source: sheetName, ...zipObject(header, row)});
    }
  }

  fs.writeFileSync(cacheFile, JSON.stringify(data, undefined, '  '));

  return data;
}

export async function normalizeData(data: ItemData, sheetKey: string) {
  for (const item of data) {
    item.version = item.Version;
    item.ref = item['English (Europe)'];

    if (sheetKey === 'variants') {
      item.originID = item.id;
      item.id = item['Variant ID'];
      item.furnitureName = item['Furniture Name'];
      delete item['Variant ID'];
      delete item['Furniture Name'];
    }
    item.localization = {};

    delete item.Version;

    // normalize Key to fit the ISO language code
    for (const objectKey of Object.keys(item)) {
      const locale = LOCALE.filter(item => item.name === objectKey);

      if (locale.length !== 0) {
        // Save value
        let value = item[objectKey];
        // Delete key to enable overwritting
        delete item[objectKey];
        // Get new key with iso name
        let key = locale[0].iso;
        // Create new key with iso name
        item.localization[key] = value;
      }
    }
  }
  return data;
}

export async function variantsInData(data: ItemData) {
  const variants = require('../out/variants.json');
  for (const item of data) {
    item.variants = [];
    for (const variant of variants) {
      if (item.id === variant.originID) {
        item.variants.push({
          id: variant.id,
          originID: variant.originID,
          ref: variant['ref'],
          localization: variant['localization'],
        });
      }
    }
  }
  return data;
}
