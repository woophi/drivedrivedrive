import { api, loadData } from 'core/app/api';

export const confirmAndGetRequestState = async (requestId: string) => {
  try {
    await loadData('requsetState', () => api.request.confirmRequest(requestId));
  } catch (error) {
    throw error;
  }
};
