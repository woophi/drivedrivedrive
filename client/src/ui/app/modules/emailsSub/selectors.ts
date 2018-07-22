import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getPathName = (state: AppState) => state.router.location.pathname;
const getApiData = (state: AppState) => state.ui.api;

export const getSubStateDataResult = createSelector(
  getApiData,
  data => data.subscribeState.result && data.subscribeState.result.SubStatus
);

export const getHash = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ hash: string }>(path, { path: '/unsubscribe/guest/:hash' });
    return match ? match.params.hash : null;
  }
);
