import { GetRequest } from 'core/models/api';
import { api, loadData } from 'core/app/api';

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
