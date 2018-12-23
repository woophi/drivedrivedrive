import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';

const state = store.getState();

export const getPendingRequests = () => {
  const userId = (state.authInfo && state.authInfo.userId) || '';
  return loadData('pendingRequests', () => api.requests.pending(userId));
};
