import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getDataApi = (state: AppState) => state.ui.api;

export const getOpenRequestsData = createSelector(
  getDataApi,
  data => data.openRequests
);
export const getActiveRequestsData = createSelector(
  getDataApi,
  data => data.activeRequests
);
export const getHistoryRequestsData = createSelector(
  getDataApi,
  data => data.historyRequests
);
export const getInProcessRequestsData = createSelector(
  getDataApi,
  data => data.inProcessRequests
);

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
