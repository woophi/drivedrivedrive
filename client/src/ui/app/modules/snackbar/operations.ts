import store from 'core/shared/store';
import { CookieDispatch } from './types';
import { api, loadData } from 'core/app/api';
import { LocalStorageManager } from 'core/localStorageManager';

const state = () => store.getState();

export const getGdprCookie = async () => {
  try {
    await loadData('cookieGdpr', () => api.gdrp.getCookieGdpr());
  } catch (error) {
    throw error;
  }
};

export const handleTriggerCookieModal = (payload: boolean) =>
  store.dispatch({ type: 'cookie/stateModal', payload } as CookieDispatch);

export const confirmCookie = async () => {
  try {
    await api.gdrp.setUniqVisitor()
      .then(() => {
        LocalStorageManager.set('uniqGuest', 'cookiesConfirmed', true);
        store.dispatch({ type: 'cookie/confirmed', payload: true } as CookieDispatch);
      });
  } catch (error) {
    throw error;
  }
};
