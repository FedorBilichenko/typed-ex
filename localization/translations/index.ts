import _ from "lodash";
import * as common from "./common";
import * as auth from "./auth";

const loadedNameSpaces = {
  common,
  auth,
  // .... add your modules
};
 
export const defaultNameSpace: NameSpace = "common";
type SupportedLocale = "en" | "fr";

export const defaultLanguage: SupportedLocale = "fr";
export const keySeparator = ".";

export type NameSpace = keyof typeof loadedNameSpaces;
type LoadedResources = { [locale in SupportedLocale]: Translation };

type Translation = { [key: string]: string | Translation };

type Translations = {
  [nameSpace in NameSpace]: Translation;
};

type I18nResource = {
  [locale in SupportedLocale]: Translations;
};

function adaptLoadedResources() {
  const flatNameSpaces = Object.entries(loadedNameSpaces) as [
    NameSpace,
    LoadedResources
  ][];
  const flatResources = flatNameSpaces.map((nameSpace) => {
    const locales = Object.entries(nameSpace[1]) as [
      SupportedLocale,
      Translation
    ][];
    return locales.reduce<I18nResource>((accumulator, locale) => {
      accumulator[locale[0]] = {
        [`${nameSpace[0]}`]: locale[1],
      } as Translations;
      return accumulator;
    }, {} as I18nResource);
  });

  return _.spread(_.partial(_.merge, {}))(flatResources);
}

type AllLoadedNameSpaceType<N extends NameSpace> = typeof loadedNameSpaces[N];
type AllLoadedNameSpaceTypeByLanguage<N extends NameSpace> = AllLoadedNameSpaceType<N>[typeof defaultLanguage];

export type RecursiveKeyOf<TObj extends Record<string, unknown>> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends unknown[]
    ? `${TKey}`
    : TObj[TKey] extends Record<string, unknown>
    ? `${TKey}${typeof keySeparator}${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & (string | number)];

type FlattenTypedKey<N extends NameSpace> = AllLoadedNameSpaceTypeByLanguage<N>;

// to type translation keys 
export type TranslationKey<N extends NameSpace> = RecursiveKeyOf<FlattenTypedKey<N>>;

// to init i18next 
export const resources: I18nResource = adaptLoadedResources();
export const nameSpaceNames = Object.keys(loadedNameSpaces) as NameSpace[];
