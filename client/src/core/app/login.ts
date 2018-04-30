import * as common from 'core/shared/common';
import store from 'core/shared/store';
import * as models from 'core/models';

export interface LoginParams {
  secret: string;
  userName?: string;
};

export async function login(token: string) {

  const postData = {
    token
  };

  store.dispatch({ type: 'setLoginProcessStep', step: 1 });

  console.debug('Logging in…');

  const authResult = await common.callApi<models.UserAuthInfo>('/api/user/auth/user', postData).then(re => re, err => {
    // TODO: var msg = i18n.t('loginModal.loginFailed');
    const msg = 'fail';
    if (err && err.statusText && err.statusText.indexOf('ONLINE_LIMIT_EXCEEDED') !== -1) {
      // TODO: msg = i18n.t('loginModal.loginFailedOpLimitEx');
    }

    store.dispatch({ type: 'setLoginProcessStep', step: 2, failMsg: msg });
    return Promise.reject(null);
  });

  console.debug('authResult >>', authResult);

  store.dispatch({ type: 'setAuthInfo', payload: authResult });

  store.dispatch({ type: 'setLoginProcessStep', step: 0 });
}

function issueLoginTokenFromSecret(secretParams: LoginParams): Promise<string> {
  return common.callApi<any>('/api/user/signin', secretParams)
    .then(result => {
      console.warn(result);
      return result.token;
    });
}

export function loginSecret(loginParams: LoginParams) {
  issueLoginTokenFromSecret(loginParams)
    .then(token => login(token), () => loginFailed());
}

function loginFailed() {
  store.dispatch({ type: 'setLoginProcessStep', step: 2, failMsg: '' });
}

