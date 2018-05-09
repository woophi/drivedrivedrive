import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getPathName = (state: AppState) => state.router.location.pathname;

export const getRequestId = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ key: string }>(path, { path: '/request/:key' });
    return match ? match.params.key : null;
  }
);


export const getRequestQuery = createSelector(
  (state: AppState) => state.router.location,
  location => {
    const match = matchPath<{ query: number }>(location.search, { path: '?s=:query' });
    return match ? Number(match.params.query) : null;
  }
);
