import {OAuth2Client} from 'google-auth-library';
import {google, sheets_v4} from 'googleapis';
import fs from 'fs';
import {camelCase, isEqual, omit, pick, zipObject} from 'lodash';
import {addMinutes, format, parse} from 'date-fns';

const SHEET_ID = '1BjqVeqIrfEezvyrWLUrwMjmK_UbY2LXkZ12mttamTtk';

const LOCALE = [
  {name: 'English', iso: 'en_US'},
  {name: 'English (Europe)', iso: 'en_GB'},
  {name: 'German', iso: 'de_DE'},
  {name: 'Spanish', iso: 'es_ES'},
  {name: 'French', iso: 'fr_FR'},
  {name: 'French (US)', iso: 'fr_CA'},
  {name: 'Italian', iso: 'it_IT'},
  {name: 'Dutch', iso: 'nl_NL'},
  {name: 'Chinese', iso: 'zh_CN'},
  {name: 'Chinese (Traditional)', iso: 'zh_TW'},
  {name: 'Japanese', iso: 'ja_JP'},
  {name: 'Korean', iso: 'ko_KR'},
];

const ITEM_SHEETS = [
  'Furniture',
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
  'K.K. Albums',
  'Tools',
  'Plants',
  'Fish Models',
  'Bugs Models',
];

const CREATURE_SHEETS = ['Bugs', 'Fish'];

const VILLAGERS_SHEETS = ['Villagers'];

const SPECIALNPC_SHEETS = ['Special NPCs'];

const CONSTRUCTION_SHEETS = ['Bridge & Inclines'];

const REACTIONS_SHEETS = ['Reactions'];

type ItemData = any[];

export async function main(auth: OAuth2Client) {
  const sheets = google.sheets({version: 'v4', auth});

  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache');
  }

  if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
  }

  const workSet: Array<[string, string[]]> = [
    ['items', ITEM_SHEETS],
    ['creatures', CREATURE_SHEETS],
    ['villagers', VILLAGERS_SHEETS],
    ['construction', CONSTRUCTION_SHEETS],
    ['specialnpc', SPECIALNPC_SHEETS],
    ['reactions', REACTIONS_SHEETS],
  ];

  for (const [key, sheetNames] of workSet) {
    console.log(`Loading ${key}`);

    console.log('Loading Data from spreadsheet...');
    let data = await loadData(sheets, sheetNames, key);
    console.log('Normalizing Data...');
    data = await normalizeData(data, key);

    console.log(`Writing data to disk`);
    fs.writeFileSync(`out/${key}.json`, JSON.stringify(data, undefined, ' '), {
      flag: 'w+',
    });

    console.log(`Finished ${key}`);
  }

  const all = [];

  for (const [key] of workSet) {
    const data = require(`../out/${key}.json`);

    all.push(...data);
  }

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
      data.push({SourceSheet: sheetName, ...zipObject(header, row)});
    }
  }

  fs.writeFileSync(cacheFile, JSON.stringify(data, undefined, '  '));

  return data;
}

export async function normalizeData(data: ItemData, sheetKey: string) {
  for (const item of data) {
    item.ref = item['English (Europe)'];
    item.localization = {};
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
