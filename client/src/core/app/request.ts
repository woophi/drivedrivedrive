import * as common from 'core/shared/common';
import * as models from 'core/models';
import { checkAuth } from './login';

function sendRequestParams(requestParams: models.RequestInfo): Promise<boolean> {
  return common.callApi<any>('/api/sendRequest', requestParams)
    .then(result => {
      return result;
    });
}

export async function newTransferRequest(requestParams: models.RequestInfo) {
  try {
    const result = await sendRequestParams(requestParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function registerNewUser(userParams: models.NewUser): Promise<boolean> {
  return common.callApi<any>('/api/user/join', userParams)
  .then(async r => {
    await checkAuth();
    return r;
  });
}
