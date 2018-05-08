import store from 'core/shared/store';
import { UserAuthInfo } from 'core/models';
import { GetRequest } from 'core/models/api';
import { api, loadData } from 'core/app/api';

const state = () => store.getState();

export const confirmAndGetRequestState = async (requestId: string) => {
  try {
    await loadData('requsetState', () => api.request.confirmRequest(requestId));
  } catch (error) {
    throw error;
  }
};
