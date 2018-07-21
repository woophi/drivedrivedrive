import { RateRequest } from 'core/models/api';
import { api, loadData } from 'core/app/api';

export const rateRequest = async (data: RateRequest) => {
  try {
    await api.request.rateRequest(data);
  } catch (error) {
    throw error;
  }
};

export const getRequestToRate = async (requestId: string, query: number) => {
  try {
    await loadData('requsetState', () => api.request.getRequestToRate(requestId, query));
  } catch (error) {
    throw error;
  }
};
