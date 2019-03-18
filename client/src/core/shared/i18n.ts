import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = i18next
  .use(initReactI18next)
  .init({
    ns: 'app',
    fallbackLng: 'ru',
    lng: 'ru',
    keySeparator: ':',
    nsSeparator: '::',

    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
      useSuspense: false,
      nsMode: 'default'
    },
  });

export default i18n;

type Shortcuts = { [key: string]: string | ((...args: any[]) => string)};

export const proxyI18n = <T extends Shortcuts>(getShortcuts: (t: i18next.TFunction) => T) => {
  const shortcuts = getShortcuts(i18next.t) as Shortcuts;
  const result = { ...shortcuts };

  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string') {
      result[key] = i18next.t(result[key] as string);
    }
  }

  return result as T;
};
