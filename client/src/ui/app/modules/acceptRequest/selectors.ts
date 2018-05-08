import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getPathName = (state: AppState) => state.router.location.pathname;

export const getDriverId = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ driverId: string }>(path, { path: '/request/:key/accept/:driverId' });
    return match ? match.params.driverId : null;
  }
);

export const getRequestId = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ key: string }>(path, { path: '/request/:key' });
    return match ? match.params.key : null;
  }
);
