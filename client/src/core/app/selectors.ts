import { createSelector } from 'reselect';
import { AppState } from 'core/models/app';

const getAuthInfo = (state: AppState) => state.authInfo;

export const getCheckRoles = createSelector(getAuthInfo, info => {
  const admin =
    info &&
    info.roles &&
    !!info.roles.find(r => r === 'Admin' || r === 'Godlike');
  const activeDriver =
    info && info.roles && !!info.roles.find(r => r === 'Driver');
  return { admin, activeDriver };
});

const getRouter = (state: AppState) => state.router;

export const getLocation = createSelector(
  getRouter,
  router => router && router.location
);
