import * as common from 'core/shared/common';
import * as models from 'core/models';

export function forgotPassword(email: models.PasswordForgot): Promise<Boolean> {
  return common.callApi<any>('/api/user/password/forgot', email);
}

export function resetPassword(params: models.PasswordReset): Promise<Boolean> {
  return common.callApi<any>('/api/user/password/reset', params);
}

export function getPasswordKey(params: models.PasswordKey): Promise<any> {
  return common.callApi<any>('/api/user/password/key', params);
}
