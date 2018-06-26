import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getApiData = (state: AppState) => state.ui.api;

export const getGdprUserData = createSelector(
  getApiData,
  data => data.userGdpr
);

export const getGdprUserResult = createSelector(
  getApiData,
  data => data.userGdpr.result
);
