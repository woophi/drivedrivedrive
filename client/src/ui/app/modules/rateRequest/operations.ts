import store from 'core/shared/store';
import { UserAuthInfo } from 'core/models';
import { RateRequest } from 'core/models/api';
import { api, loadData } from 'core/app/api';

const state = () => store.getState();

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

