import * as common from 'core/shared/common';
import store from 'core/shared/store';
import * as models from 'core/models';
import { changeUrl } from 'ui/app/operations';

export interface LoginParams {
  secret: string;
  email?: string;
};

export async function login(token: string) {

  const postData = {
    token
  };

  store.dispatch({ type: 'setLoginProcessStep', step: 1 });

  console.debug('Logging in…');

  const authResult = await common.callApi<models.UserAuthInfo>('/api/user/auth', postData).then(re => re, err => {
    // TODO: var msg = i18n.t('loginModal.loginFailed');
    const msg = 'fail';

    store.dispatch({ type: 'setLoginProcessStep', step: 2, failMsg: msg });
    return Promise.reject(err);
  });

  console.debug('authResult >>', authResult);

  store.dispatch({ type: 'setAuthInfo', payload: authResult });

  store.dispatch({ type: 'setLoginProcessStep', step: 0 });
}

function issueLoginTokenFromSecret(secretParams: LoginParams): Promise<string> {
  return common.callApi<any>('/api/user/signin', secretParams)
    .then(result => {
      return result.token;
    });
}

export async function signOut() {
  await common.callApi<any>('/api/user/signout', {})
    .then(() => store.dispatch({ type: 'setAuthInfo', payload: null }))
    .then(() => changeUrl('/signin'));
  return true;
}

export async function loginSecret(loginParams: LoginParams) {
  try {
    const token = await issueLoginTokenFromSecret(loginParams);
    await login(token);
  } catch (error) {
    loginFailed(error);
    throw error;
  }
}

function loginFailed(e: any) {
  store.dispatch({ type: 'setLoginProcessStep', step: 2, failMsg: JSON.stringify(e) });
}

export function checkAuth() {
  return common.callApi<any>('/api/user/check', {})
    .then(result => {
      store.dispatch({ type: 'setAuthInfo', payload: result });
    });
}

