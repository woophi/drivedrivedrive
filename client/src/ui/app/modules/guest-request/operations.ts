import { store } from 'core/shared/store';
import { api, loadData } from 'core/app/api';
import { LocalStorageManager } from 'core/localStorageManager';
import { UpdateRequestInfo } from 'core/models';
import { getRequestIdAndHash } from './selectors';
import { changeUrl } from 'ui/app/operations';

export const setHashId = (hashId: string) => {
  store.dispatch({ type: 'guest/setHashId', payload: hashId });
  LocalStorageManager.set('uniqGuest', 'hashId', hashId);
};
export const deleteHashId = () => {
  store.dispatch({ type: 'guest/setHashId', payload: '' });
  LocalStorageManager.set('uniqGuest', 'hashId', '');
};

export const getGuestRequest = (hash: string) =>
  loadData('guestRequest', () => api.guest.getRequest({ hash }));

export const updateGuestRequest = async (payload: UpdateRequestInfo) =>
  api.guest.updateRequest(payload);

export const checkGuestAuth = () => {
  const { hash } = getRequestIdAndHash(store.getState());

  const savedHash = LocalStorageManager.get('uniqGuest', 'hashId');
  if (
    !savedHash ||
    (!!savedHash && hash && savedHash !== hash)
  ) {
    setHashId(hash);
  } else {
    store.dispatch({ type: 'guest/setHashId', payload: savedHash });
  }
  changeUrl('/guest');
};
