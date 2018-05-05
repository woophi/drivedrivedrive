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
