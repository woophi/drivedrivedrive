import i18n from 'i18next';
import { setLocale } from 'core/shared/common';
import { deleteCookie } from 'core/cookieManager';

export const changeLanguage = (lang: 'en' | 'ru') => {
  i18n.changeLanguage(lang, (err, _) => {
    if (err) {
      return console.error(err);
    }
    deleteCookie('prefLang');
    setLocale(lang);
    console.debug('Language changed to: ', lang);
  });
}
