import * as models from 'core/models';

export type SharedState = {
  localAppState: models.LocalAppState,
  authInfo: models.AuthInfo
};


export type SharedDispatch =
  | { type: 'appInit', isMobile: boolean, lang: string }
  | { type: 'setLoginProcessStep', step: number, failMsg?: string }
  | { type: 'setAuthInfo', payload: models.AuthInfo }
  | { type: 'removeAuthInfo' }
;
