import { AppState } from 'core/models/app';
import { LocationChangeAction, RouterState } from 'react-router-redux';
import { FormAction } from 'redux-form';
import { UIDispatch, UIState } from 'ui/types';
import { ScreenDispatch, ScreenState } from 'ui/app/modules/screenMeasurer/types';
import * as models from 'core/models';

export type AppState = {
  router: RouterState,
  screen: ScreenState,
  form: any | null,
  ui: UIState | null,
  localAppState: models.LocalAppState,
  authInfo: models.UserAuthInfo,
};

export type AppEntrySettings = {
  isMobile: boolean
};

export type AppDispatch =
  | UIDispatch
  | ScreenDispatch
  | LocationChangeAction
  | FormAction
;
