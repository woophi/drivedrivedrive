import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';
import { RequestsDispatch, ViewRequests } from './types';

const state = () => store.getState();

export const getOpenRequests = () => {
  const userId = (state().authInfo && state().authInfo.userId) || '';
  return loadData('openRequests', () => api.requests.open(userId));
};
export const getActiveRequests = () => {
  const userId = (state().authInfo && state().authInfo.userId) || '';
  return loadData('activeRequests', () => api.requests.active(userId));
};
export const getHistoryRequests = () => {
  const userId = (state().authInfo && state().authInfo.userId) || '';
  return loadData('historyRequests', () => api.requests.history(userId));
};
export const getInProcessRequests = () => {
  const userId = (state().authInfo && state().authInfo.userId) || '';
  return loadData('inProcessRequests', () => api.requests.inProcess(userId));
};

export const getOpenRequestsNumber = async () => {
  try {
    const userId = (state().authInfo && state().authInfo.userId) || '';
    const data = await api.requests.open(userId);
    return data.length;
  } catch (error) {
    throw error;
  }
};

export const setViewOnRequests = (payload: ViewRequests) =>
  store.dispatch({ type: 'requests/setView', payload } as RequestsDispatch);
