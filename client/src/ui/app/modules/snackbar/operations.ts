import { store } from 'core/shared/store';
import { CookieDispatch } from './types';
import { api, loadData } from 'core/app/api';
import { setCookie, getCookie } from 'core/cookieManager';
import { KeyName } from 'core/models/api';

export const getGdprCookie = async () => {
  try {
    await loadData('cookieGdpr', () =>
      api.gdrp.getGdprData(getCookie('prefLang') || 'ru', KeyName.VISITOR)
    );
  } catch (error) {
    throw error;
  }
};

export const handleTriggerCookieModal = (payload: boolean) =>
  store.dispatch({ type: 'cookie/stateModal', payload } as CookieDispatch);

export const confirmCookie = async () => {
  try {
    setCookie('uniqGuest', 'cookiesConfirmed', 128);
    store.dispatch({
      type: 'cookie/confirmed',
      payload: true
    } as CookieDispatch);
  } catch (error) {
    throw error;
  }
};
