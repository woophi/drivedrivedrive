import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';

const state = store.getState();

export const getRequests = () => {
  const userId = (state.authInfo && state.authInfo.userId) || '';
  return loadData('allRequests', () => api.requests.all(userId));
};
