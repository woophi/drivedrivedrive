import i18n from 'i18next';
import { setLocale } from 'core/shared/common';

export const changeLanguage = (lang: 'en' | 'ru') => {
  i18n.changeLanguage(lang, (err, _) => {
    if (err) {
      return console.error(err);
    }
    setLocale(lang);
    console.debug('Language changed to: ', lang);
  });
}
