import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';
import { matchPath } from 'react-router';
import { authInfo } from 'core/shared/reducers';

const getAuthInfo = (state: AppState) => state.authInfo;

export const getCheckRoles = createSelector(getAuthInfo, info => {
  const admin =
    info &&
    info.roles &&
    info.roles.find(r => r === 'Admin' || r === 'Godlike');
  const activeDriver =
    info && info.roles && info.roles.find(r => r === 'Driver');
  return { admin, activeDriver };
});
