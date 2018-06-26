import store from 'core/shared/store';
import { UserDispatch } from './types';
import { api, loadData } from 'core/app/api';

const state = () => store.getState();

export const getGdprUser = async () => {
  try {
    await loadData('userGdpr', () => api.gdrp.getUserGdpr());
  } catch (error) {
    throw error;
  }
};

export const handleTriggerGDPRDialog = (payload: boolean) =>
  store.dispatch({ type: 'user/openModalDialog', payload } as UserDispatch);
