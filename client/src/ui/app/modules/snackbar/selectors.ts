import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getApiData = (state: AppState) => state.ui.api;

export const getGdprCookieData = createSelector(
  getApiData,
  data => data.cookieGdpr
);

export const getGdprCookieResult = createSelector(
  getApiData,
  data => data.cookieGdpr.result
);
