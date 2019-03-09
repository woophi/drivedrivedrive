import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getApiData = (state: AppState) => state.ui.api;

export const getGuestRequestData = createSelector(
  getApiData,
  data => data.guestRequest
);
export const getGuestRequestResult = createSelector(
  getApiData,
  data => data.guestRequest.result
);

const getPathName = (state: AppState) => state.router.location.pathname;

export const getRequestIdAndHash = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ id: string; hash: string }>(path, {
      path: '/guest/:id/:hash'
    });
    return match
      ? { requestId: match.params.id, hash: match.params.hash }
      : ({} as { requestId: string; hash: string });
  }
);
