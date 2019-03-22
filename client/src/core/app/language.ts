import i18n from 'i18next';
import { setLocale } from 'core/shared/common';
import { deleteCookie } from 'core/cookieManager';
import { store } from 'core/shared/store';
import { api } from 'core/app/api';

export const changeLanguage = (lang: 'en' | 'ru') => {
  i18n.changeLanguage(lang, (err, _) => {
    if (err) {
      return console.error(err);
    }
    deleteCookie('prefLang');
    setLocale(lang);
  })
  .then(() => {
    const authInfo = store.getState().authInfo;
    const hasLang = authInfo.language;
    if (!!authInfo && hasLang !== lang) {
      api.user.updateLanguage(lang)
    }
  });
}
