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
      wait: false,
      nsMode: 'default'
    },
  });

export default i18n;

