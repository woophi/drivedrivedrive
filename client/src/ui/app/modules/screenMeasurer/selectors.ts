import { AppState } from 'core/models/app';
import { createSelector } from 'reselect';

export const settings = {
  MOBILE_SCREEN_WIDTH: 768
};

export const getScreenSize = (state: AppState) => state.screen;

export const getScreenWidth = createSelector(
  getScreenSize,
  ({ width, height}) => width
);

export const isMobile = createSelector(
  getScreenSize,
  ({ width, height}) => {

    return width < settings.MOBILE_SCREEN_WIDTH;
  }
);
