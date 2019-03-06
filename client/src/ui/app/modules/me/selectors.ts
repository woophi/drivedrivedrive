import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

const getDataProfile = (state: AppState) => state.ui.api.userProfile.result;

export const getRating = createSelector(
  getDataProfile,
  profile => profile && profile.rating
);
