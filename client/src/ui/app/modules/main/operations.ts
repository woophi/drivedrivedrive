import store from 'core/shared/store';
import { GuestDispatch, HandlePoints } from './types';
import { api, loadData } from 'core/app/api';

const state = () => store.getState();

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
