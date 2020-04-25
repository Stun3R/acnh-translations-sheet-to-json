export interface Item {
  SourceSheet: SourceSheet;
  id?: number | string;
  Version?: Version;
  ref: string;
  localization: Localization;
  ID?: string;
  Russian?: string;
  'Spanish (US)'?: string;
}

export enum SourceSheet {
  Accessories = 'Accessories',
  Art = 'Art',
  Bags = 'Bags',
  Bottoms = 'Bottoms',
  BridgeInclines = 'Bridge & Inclines',
  Bugs = 'Bugs',
  BugsModels = 'Bugs Models',
  Caps = 'Caps',
  Doorplates = 'Doorplates',
  Dresses = 'Dresses',
  Fence = 'Fence',
  Fish = 'Fish',
  FishModels = 'Fish Models',
  Floors = 'Floors',
  Fossils = 'Fossils',
  Furniture = 'Furniture',
  KKAlbums = 'K.K. Albums',
  Masks = 'Masks',
  Plants = 'Plants',
  Reactions = 'Reactions',
  Rugs = 'Rugs',
  Shells = 'Shells',
  Shoes = 'Shoes',
  Socks = 'Socks',
  SpecialNPCS = 'Special NPCs',
  Tools = 'Tools',
  Tops = 'Tops',
  Umbrella = 'Umbrella',
  Villagers = 'Villagers',
  Walls = 'Walls',
}

export enum Version {
  The100 = '1.0.0',
  The110 = '1.1.0',
  The120 = '1.2.0',
}

export interface Localization {
  en_US: string;
  en_GB: string;
  de_DE: string;
  es_ES: string;
  fr_FR: string;
  fr_CA: string;
  it_IT: string;
  nl_NL: string;
  zh_CN: string;
  zh_TW: string;
  ja_JP: string;
  ko_KR: string;
}
