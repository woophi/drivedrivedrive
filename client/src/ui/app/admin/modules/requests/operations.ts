import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';

const state = store.getState();

export const getRequests = () =>
  loadData('allRequests', () => api.admin.requests.all());

export const getRequest = (requestId: string) =>
  loadData('adminRequest', () => api.admin.request.get(requestId));
