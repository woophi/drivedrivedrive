import store from 'core/shared/store';
import * as models from 'core/models';
import * as apiData from 'core/models/api';
import * as isEmpty from 'ramda/src/isEmpty';
import { callApi } from 'core/shared/common';


const a = <T>(action: string, model?: object) => callApi<T>(`/api/${action}`, model);

export const api = {
  user: {
    getProfile: (data: Partial<models.UserAuthInfo>) => a<apiData.UserProfile>('user/profile', data),
    updateProfile: (data: apiData.UserProfile) => a<null>('user/profile/update', data)
  },
  request: {
    getRequestState: (data: apiData.GetRequest) => a<apiData.StateRequest>('request/get/state', data),
    getRequest: (requestId: string) => a<apiData.NewRequest>('request/get', { requestId }),
    assignRequest: (data: apiData.AssignRequest) => a<boolean>('request/driver/answer', data),
    acceptRequest: (data: apiData.AcceptRequest) => a<boolean>('request/guest/answer', data),
    confirmRequest: (requestId: string) => a<apiData.StateRequest>('request/confirm', { requestId }),
    getRequestToRate: (requestId: string, query: number) => a<apiData.StateRequest>('request/get/rate', { requestId, query }),
    rateRequest: (data: apiData.RateRequest) => a<boolean>('request/rate', data),
    getRequestStateToAccept: (data: apiData.GetRequest) => a<apiData.StateRequest>('request/get/accept/state', data),
  },
  gdrp: {
    getGuestGdpr: () => a<apiData.Gdpr>('gdpr/guest')
  }
};

interface DeliveryParams<A> {
  checker?: (data: A) => boolean;
  logging?: boolean;
}

const QUIET_FETCH_TIMEOUT = 500;
type ResultType = apiData.DataState[keyof apiData.DataState]["result"];

const loadDataImpl = async (name: keyof apiData.DataState, apiCallerDataDeliverer: () => Promise<ResultType>, config?: DeliveryParams<ResultType>) => {
  const log = (...args: any[]) => (!!config && config.logging) ? console.debug(`loadData[${name}]>`, ...args) : undefined;

  const checkData = (data: ResultType) => {
    if (config.checker(data)) {
      store.dispatch({ type: 'api/data/setResult', name, payload: data });
      store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.SUCCESS });
      return data;
    } else {
      store.dispatch({ type: 'api/data/setError', name, payload: 'Bad data from server ;(' });
      store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.ERROR });
      return data;
    }
  };

  log('state:', store.getState().ui.api[name]);

  let timeout: number = null;
  switch (store.getState().ui.api[name].status) {
    case (apiData.DataStatus.FETCHING || apiData.DataStatus.QUIET_FETCHING): {
      throw new Error('Unable to call: Already fetching data');
    }

    case (apiData.DataStatus.UPDATING): {
      return store.getState().ui.api[name].result;
    }

    case apiData.DataStatus.SUCCESS:
    case apiData.DataStatus.EMPTY: {
      store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.UPDATING });
      break;
    }

    default: {
      store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.QUIET_FETCHING });
      timeout = window.setTimeout(() => {
        store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.FETCHING });
        timeout = null;
      }, QUIET_FETCH_TIMEOUT);
      break;
    }
  }

  try {
    log('calling api');

    const response = await apiCallerDataDeliverer();
    clearTimeout(timeout);

    log('response:', response);

    if (store.getState().ui.api[name].errorInfo) {
      store.dispatch({ type: 'api/data/setError', name, payload: null });
    }

    if (isEmpty(response)) {
      store.dispatch({ type: 'api/data/setResult', name, payload: response });
      store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.EMPTY });
      log('newState:', store.getState().ui.api[name]);
      return response;
    } else if (!!config && !!config.checker) {
      log('newState:', store.getState().ui.api[name]);
      return checkData(response);
    }

    store.dispatch({ type: 'api/data/setResult', name, payload: response });
    store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.SUCCESS });
    log('newState:', store.getState().ui.api[name]);
    return response;

  } catch (e) {
    clearTimeout(timeout);
    store.dispatch({ type: 'api/data/setError', name, payload: e });
    store.dispatch({ type: 'api/data/setStatus', name, payload: apiData.DataStatus.ERROR });
    log('API call error:', e);
    throw e;
  }
};

type DLF<N extends keyof apiData.DataState, T extends ResultType> = (name: N, apiCallerDataDeliverer: () => Promise<T>, config?: DeliveryParams<T>) => Promise<T>;
type DataLoader =
  DLF<'userProfile', apiData.DataState['userProfile']['result']> &
  DLF<'requsetState', apiData.DataState['requsetState']['result']> &
  DLF<'selectedRequest', apiData.DataState['selectedRequest']['result']> &
  DLF<'guestGdpr', apiData.DataState['guestGdpr']['result']>
  ;

export const loadData: DataLoader = loadDataImpl as any;
