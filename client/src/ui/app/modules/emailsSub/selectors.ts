import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getApiData = (state: AppState) => state.ui.api;

export const getSubStateDataResult = createSelector(
  getApiData,
  data => data.subscribeState.result && data.subscribeState.result.SubStatus
);
