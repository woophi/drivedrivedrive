import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getDataApi = (state: AppState) => state.ui.api;

export const getOpenRequestsData = createSelector(
  getDataApi,
  data => data.openRequests
);
