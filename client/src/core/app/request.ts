import * as common from 'core/shared/common';
import * as models from 'core/models';
import { checkAuth } from './login';

const sendRequestParams = (
  requestParams: models.RequestInfo
): Promise<string> => {
  return common.callApi<any>('/api/sendRequest', requestParams).then(result => {
    return result;
  });
};

export const newTransferRequest = async (requestParams: models.RequestInfo) => {
  try {
    return await sendRequestParams(requestParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerNewUser = (
  userParams: models.NewUser
): Promise<boolean> => {
  return common.callApi<any>('/api/user/join', userParams).then(async r => {
    await checkAuth();
    return r;
  });
};

export const validateEmail = (email: string) => {
  return common.callApi<boolean>('/api/checkEmail', { email })
    .then(r => {
      return r;
    });
};
