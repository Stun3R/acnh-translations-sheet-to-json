export interface Villagers {
  SourceSheet: SourceSheet;
  id: string;
  Russian: string;
  ref: string;
  localization: Localization;
}
export declare enum SourceSheet {
  Villagers = 'Villagers',
}
export interface Localization {
  en_US: string;
  en_GB: string;
  de_DE: string;
  es_ES: string;
  es_US: string;
  fr_FR: string;
  fr_CA: string;
  it_IT: string;
  nl_NL: string;
  zh_CN: string;
  zh_TW: string;
  ja_JP: string;
  ko_KR: string;
}
