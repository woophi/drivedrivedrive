import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getPathName = (state: AppState) => state.router.location.pathname;

export const getKeyFromPath = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ key: string }>(path, { path: '/reset-password/:key' });
    return match ? match.params.key : null;
  }
);
