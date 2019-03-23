import { store } from 'core/shared/store';
import { UserDispatch } from './types';
import { api, loadData } from 'core/app/api';
import { getCookie } from 'core/cookieManager';
import { KeyName } from 'core/models/api';
import { LanguageId } from 'core/models';

export const getGdprUser = async () => {
  try {
    await loadData('userGdpr', () =>
      api.gdrp.getGdprData(
        (getCookie('prefLang') as LanguageId) || 'ru',
        KeyName.USER
      )
    );
  } catch (error) {
    throw error;
  }
};

export const handleTriggerGDPRDialog = (payload: boolean) =>
  store.dispatch({ type: 'user/openModalDialog', payload } as UserDispatch);
