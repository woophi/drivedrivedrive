import * as models from 'core/models';
import { SharedDispatch } from 'core/models/shared';

const defaultState = {
  localAppState: {

  } as models.LocalAppState,
  authInfo: null as models.UserAuthInfo,
};

export const localAppState = (state = defaultState.localAppState, dispatch: SharedDispatch): models.LocalAppState => {
  switch (dispatch.type) {
    case 'appInit':
      return {
        ...state,
        isMobile: dispatch.isMobile
      };
    case 'setLoginProcessStep':
      return {
        ...state,
        loginProcessStep: dispatch.step,
        loginFailMsg: dispatch.failMsg || null
      };
    case 'setResourcesLanguage':
      return {
        ...state,
        lang: dispatch.payload
      };
    default:
      return state;
  }
};

export const authInfo = (state = defaultState.authInfo, dispatch: SharedDispatch): models.AuthInfo => {
  switch (dispatch.type) {
    case 'setAuthInfo':
      return dispatch.payload;
    case 'removeAuthInfo':
      return null;
    default:
      return state;
  }
};
