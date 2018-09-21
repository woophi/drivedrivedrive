import { store } from 'core/shared/store';
import { api, loadData } from 'core/app/api';
import { LocalStorageManager } from 'core/localStorageManager';
import { UpdateRequestInfo } from 'core/models';

export const setHashId = (hashId: string) => {
  store.dispatch({ type: 'guest/setHashId', payload: hashId });
  LocalStorageManager.set('uniqGuest', 'hashId', hashId);
};
export const deleteHashId = () => {
  store.dispatch({ type: 'guest/setHashId', payload: '' });
  LocalStorageManager.set('uniqGuest', 'hashId', '');
};

export const getGuestRequest = async (hash: string) => {
  try {
    return await loadData('guestRequest', () => api.guest.getRequest({ hash }));
  } catch (error) {
    throw error;
  }
};
export const updateGuestRequest = async (payload: UpdateRequestInfo) =>
  api.guest.updateRequest(payload);
