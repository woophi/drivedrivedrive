import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';

const getPathName = (state: AppState) => state.router.location.pathname;

const getAuthInfo = (state: AppState) => state.authInfo;

export const getCheckRoles = createSelector(
  getAuthInfo,
  info => {
    const admin = info && info.roles.find(r => r === 'Admin' || r === 'Godlike');
    const activeDriver = info && info.roles.find(r => r === 'Driver');
    return { admin, activeDriver };
  }
);

export const getRequestId = createSelector(
  getPathName,
  path => {
    const match = matchPath<{ key: string }>(path, { path: '/request/:key' });
    return match ? match.params.key : null;
  }
);
