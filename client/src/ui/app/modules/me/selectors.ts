import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getAuthInfo = (state: AppState) => state.authInfo;
const getDataProfile = (state: AppState) => state.ui.api.userProfile.result;

export const getCheckRoles = createSelector(getAuthInfo, info => {
  const admin =
    info &&
    info.roles &&
    info.roles.find(r => r === 'Admin' || r === 'Godlike');
  const activeDriver =
    info && info.roles && info.roles.find(r => r === 'Driver');
  return { admin, activeDriver };
});

export const getRating = createSelector(
  getDataProfile,
  profile => profile && profile.rating
);
