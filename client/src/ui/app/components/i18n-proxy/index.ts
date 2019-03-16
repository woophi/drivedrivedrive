import { proxyI18n } from 'core/shared/i18n';
import i18next from 'i18next';

const getI18n = () => proxyI18n(t => ({
  required: 'app::validation:required',
  invalidEmail: 'app::validation:invalidEmail',
  noGDPR: 'app::validation:noGDPR',
  invalidPassword: 'app::validation:invalidPassword',
  rateIt: 'app::validation:rateIt',
  commentRating: 'app::validation:commentRating',
}));

let i18n = getI18n();
i18next.on('languageChanged', () => { i18n = getI18n(); });

export { i18n };
