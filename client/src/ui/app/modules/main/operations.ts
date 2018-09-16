import { store } from 'core/shared/store';
import { GuestDispatch, HandlePoints } from './types';
import { api, loadData } from 'core/app/api';
import { LocalStorageManager } from 'core/localStorageManager';
import { UpdateRequestInfo } from 'core/models';

export const getGdprGuest = async () => {
  try {
    await loadData('guestGdpr', () => api.gdrp.getGuestGdpr());
  } catch (error) {
    throw error;
  }
};

export const triggerForm = (payload: boolean) =>
  store.dispatch({ type: 'guest/changeFormState', payload } as GuestDispatch);

export const handlePoints = (payload: HandlePoints) =>
  store.dispatch({ type: 'guest/handlePoint', payload } as GuestDispatch);

export const handleTriggerGDPRDialog = (payload: boolean) =>
  store.dispatch({ type: 'guest/openModalDialog', payload } as GuestDispatch);

export const triggerCheckEmail = (payload: boolean) =>
  store.dispatch({ type: 'guest/checkForEmail', payload } as GuestDispatch);

export const setHashId = (hashId: string) => {
  store.dispatch({ type: 'guest/setHashId', payload: hashId } as GuestDispatch);
  LocalStorageManager.set('uniqGuest', 'hashId', hashId);
};
export const deleteHashId = () => {
  store.dispatch({ type: 'guest/setHashId', payload: '' } as GuestDispatch);
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
