import i18n from 'i18next';
import { setLocale } from 'core/shared/common';
import { deleteCookie } from 'core/cookieManager';
import { LanguageId } from 'core/models';

export const changeLanguage = (lang: LanguageId) => {
  i18n.changeLanguage(lang, (err, _) => {
    if (err) {
      return console.error(err);
    }
    deleteCookie('prefLang');
    setLocale(lang);
  })
}
