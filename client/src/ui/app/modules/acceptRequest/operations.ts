import { GetRequest, AcceptRequest } from 'core/models/api';
import { api, loadData } from 'core/app/api';

export const acceptDriverAndGetRequestState = async (requestId: string, driverId: string) => {
  try {
    const payloadGet: GetRequest = {
      requestId
    };
    const payloadAccept: AcceptRequest = {
      requestId,
      driverId
    };
    await loadData('requsetState', () => {
      return api.request.acceptRequest(payloadAccept)
        .then(() =>
          api.request.getRequestStateToAccept(payloadGet))
    });
  } catch (error) {
    throw error;
  }
};
