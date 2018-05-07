import * as common from 'core/shared/common';
import * as models from 'core/models';

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

export function registerNewUser(userParams: models.NewUser): Promise<null> {
  return common.callApi<any>('/api/user/join', userParams);
}

export function getUserProfile(params: Partial<models.UserAuthInfo>): Promise<models.UseProfile> {
  return common.callApi<any>('/api/user/profile', params)
    .then(result => {
      return result;
    });
}
