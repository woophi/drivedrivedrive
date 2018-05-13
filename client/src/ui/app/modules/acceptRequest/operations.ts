import store from 'core/shared/store';
import { UserAuthInfo } from 'core/models';
import { GetRequest } from 'core/models/api';
import { api, loadData } from 'core/app/api';

const state = () => store.getState();

export const getRequestState = async (requestId: string) => {
  try {
    const payload: GetRequest = {
      requestId
    };
    await loadData('requsetState', () => api.request.getRequestStateToAccept(payload));
  } catch (error) {
    throw error;
  }
};
