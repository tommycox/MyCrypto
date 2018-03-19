import TranslateMarkdown from 'components/Translate';
import React from 'react';
import { State as ConfigState } from 'reducers/config';
import { loadStatePropertyOrEmptyObject } from 'utils/localStorage';
const en = require('./lang/en.json');
const fallbackLanguage = 'en';
const repository: {
  [language: string]: {
    [translationName: string]: string;
  };
} = {};

interface ILanguage {
  code: string;
  data: {
    [translationName: string]: string;
  };
}

const languages: ILanguage[] = [
  en,
  require('./lang/de.json'),
  require('./lang/el.json'),
  require('./lang/es.json'),
  require('./lang/fi.json'),
  require('./lang/fr.json'),
  require('./lang/ht.json'),
  require('./lang/hu.json'),
  require('./lang/id.json'),
  require('./lang/it.json'),
  require('./lang/ja.json'),
  require('./lang/nl.json'),
  require('./lang/no.json'),
  require('./lang/pl.json'),
  require('./lang/pt.json'),
  require('./lang/ru.json') /*sk, sl, sv */,
  require('./lang/ko.json'),
  require('./lang/tr.json'),
  require('./lang/vi.json'),
  require('./lang/zhcn.json'),
  require('./lang/zhtw.json')
];

languages.forEach(l => {
  repository[l.code] = l.data;
});

export function getTranslators() {
  return [
    'TranslatorName_1',
    'TranslatorName_2',
    'TranslatorName_3',
    'TranslatorName_4',
    'TranslatorName_5'
  ].filter(x => {
    const translated = translate(x);
    return !!translated;
  });
}

export const translateRaw = (key: string, variables?: { [name: string]: string }) => {
  // redux store isn't initialized in time which throws errors, instead we get the language selection from localstorage
  const lsConfig = loadStatePropertyOrEmptyObject('config');
  const language = !!lsConfig ? (lsConfig as ConfigState).meta.languageSelection : fallbackLanguage;
  const translatedString =
    (repository[language] && repository[language][key]) || repository[fallbackLanguage][key] || key;

  if (!!variables) {
    // Find each variable and replace it in the translated string
    let str = translatedString;
    Object.keys(variables).forEach(v => {
      str = str.replace(v, variables[v]);
    });
    return str;
  }

  return translatedString;
};

export type TranslatedText = React.ReactElement<any> | string;

function translate(key: string, variable?: { [name: string]: string }, md?: false): string;
function translate(
  key: string,
  variables?: { [name: string]: string },
  md?: true
): React.ReactElement<any>;
function translate(
  key: string,
  variables?: { [name: string]: string },
  md?: boolean
): string | React.ReactElement<any> {
  return md ? (
    <TranslateMarkdown source={translateRaw(key, variables)} />
  ) : (
    translateRaw(key, variables)
  );
}

export default translate;
