import { api, loadData } from 'core/app/api';

export const getRequests = () =>
  loadData('allRequests', () => api.admin.requests.all());

export const getRequest = (requestId: string) =>
  loadData('adminRequest', () => api.admin.request.get(requestId));

export const approveRequest = (requestId: string) =>
  api.admin.request.approve(requestId)
    .then(() => getRequest(requestId));
