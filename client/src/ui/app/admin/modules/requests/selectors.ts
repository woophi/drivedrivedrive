import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getDataApi = (state: AppState) => state.ui.api;

export const getRequestsData = createSelector(
  getDataApi,
  data => data.allRequests
);
export const getRequestToApprove = createSelector(
  getDataApi,
  data => data.adminRequest.result || {}
);
