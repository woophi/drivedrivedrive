import { api, loadData } from 'core/app/api';
import { store } from 'core/shared/store';
import { reset } from 'redux-form';

export const getRequests = () =>
  loadData('allRequests', () => api.admin.requests.all());

export const getRequest = (requestId: string) =>
  loadData('adminRequest', () => api.admin.request.get(requestId));

export const approveRequest = (requestId: string) => {
  try {
    api.admin.request.approve(requestId)
      .then(() => getRequest(requestId));
  } catch (error) {
    console.error(error);
  }
}

export const resetForm = (form: string) =>
  store.dispatch(reset(form));
