import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';

const state = () => store.getState();

export const getOpenRequests = () => {
  const userId = state().authInfo && state().authInfo.userId || '';
  return loadData('openRequests', () => api.requests.open(userId));
};
