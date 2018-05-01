import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getPathName = (state: AppState) => state.router.location.pathname;

export const getSelectedPath = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ currentPath: string }>(path, { path: '/:currentPath' });
    return match ? match.params.currentPath : null;
  }
);
