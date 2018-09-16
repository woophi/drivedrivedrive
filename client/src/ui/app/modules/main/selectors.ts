import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getApiData = (state: AppState) => state.ui.api;

export const getGdprGuestData = createSelector(
  getApiData,
  data => data.guestGdpr
);

export const getGdprGuestResult = createSelector(
  getApiData,
  data => data.guestGdpr.result
);
export const getGuestRequestData = createSelector(
  getApiData,
  data => data.guestRequest
);
export const getGuestRequestResult = createSelector(
  getApiData,
  data => data.guestRequest.result
);
