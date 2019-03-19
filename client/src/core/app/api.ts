import { store } from 'core/shared/store';
import * as models from 'core/models';
import * as apiData from 'core/models/api';
import * as adminData from 'core/models/admin';
import * as isEmpty from 'ramda/src/isEmpty';
import { callApi, HTTPMethod } from 'core/shared/common';

const a = <T>(action: string, model?: object, method: HTTPMethod = 'post') =>
  callApi<T>(method, `/api/${action}`, model, store.getState().authInfo.token);
const c = <T>(action: string, model?: object, method: HTTPMethod = 'post') =>
  callApi<T>(method, `/api/${action}`, model);

export const api = {
  user: {
    getProfile: (data: Partial<models.UserAuthInfo>) =>
      a<apiData.UserProfile>('user/profile', data),
    updateProfile: (data: apiData.UserProfile) =>
      a<null>('user/profile/update', data),
    unsubFromMails: () => a<apiData.StateUnsub>('user/unsub'),
    subscribeState: () => c<apiData.StateUnsub>('user/subState'),
    updateLanguage: (language: string) => a('user/language/update', {language}),
  },
  request: {
    getRequestState: (data: apiData.GetRequest) =>
      c<apiData.StateRequest>('request/get/state', data),
    getRequest: (requestId: string) =>
      a<apiData.NewRequest>('request/get', { requestId }),
    assignRequest: (data: apiData.AssignRequest) =>
      a<boolean>('request/driver/answer', data),
    acceptRequest: (data: apiData.AcceptRequest) =>
      c<boolean>('request/guest/answer', data),
    confirmRequest: (requestId: string) =>
      a<apiData.StateRequest>('request/confirm', { requestId }),
    getRequestToRate: (requestId: string, query: number) =>
      c<apiData.StateRequest>('request/get/rate', { requestId, query }),
    rateRequest: (data: apiData.RateRequest) =>
      c<boolean>('request/rate', data),
    getRequestStateToAccept: (data: apiData.GetRequest) =>
      c<apiData.StateRequest>('request/get/accept/state', data)
  },
  gdrp: {
    getGdprData: (lang: string, keyName: apiData.KeyName) =>
      c<apiData.Gdpr>('gdpr', { lang, keyName }),
  },
  guest: {
    unsubFromMails: (data: { hash: string }) =>
      c<apiData.StateUnsub>('guest/unsub', data),
    subscribeState: (data: { hash: string }) =>
      c<apiData.StateUnsub>('guest/subState', data),
    updateRequest: (data: models.UpdateRequestInfo) =>
      c<null>('guest/update/request', data),
    getRequest: (data: { hash: string }) =>
      c<models.RequestInfo>('guest/get/request', data),
  },
  requests: {
    open: (userId: string) =>
      a<apiData.TableRequest[]>('requests/open', { userId }),
    active: (userId: string) =>
      a<apiData.TableRequest[]>('requests/active', { userId }),
    history: (userId: string) =>
      a<apiData.TableRequest[]>('requests/history', { userId }),
    inProcess: (userId: string) =>
      a<apiData.TableRequest[]>('requests/process', { userId })
  },
  admin: {
    requests: {
      all: () =>
        a<apiData.TableRequest[]>('adm/requests/all')
    },
    request: {
      get: (requestId: string) =>
        a<adminData.Request>('adm/request/get', { requestId }),
      update: (requestId: string, data: adminData.GuestRequest) =>
        a<void>('adm/request/update', { requestId, data }),
      approve: (requestId: string) =>
        a<void>('adm/request/approve', { requestId })
    }
  }
};

interface DeliveryParams<A> {
  checker?: (data: A) => boolean;
  logging?: boolean;
}

const QUIET_FETCH_TIMEOUT = 500;
type ResultType = apiData.DataState[keyof apiData.DataState]['result'];

const loadDataImpl = async (
  name: keyof apiData.DataState,
  apiCallerDataDeliverer: () => Promise<ResultType>,
  config?: DeliveryParams<ResultType>
) => {

  const checkData = (data: ResultType) => {
    if (config.checker(data)) {
      store.dispatch({ type: 'api/data/setResult', name, payload: data });
      store.dispatch({
        type: 'api/data/setStatus',
        name,
        payload: apiData.DataStatus.SUCCESS
      });
      return data;
    } else {
      store.dispatch({
        type: 'api/data/setError',
        name,
        payload: 'Bad data from server ;('
      });
      store.dispatch({
        type: 'api/data/setStatus',
        name,
        payload: apiData.DataStatus.ERROR
      });
      return data;
    }
  };

  let timeout: number = null;
  switch (store.getState().ui.api[name].status) {
    case apiData.DataStatus.FETCHING || apiData.DataStatus.QUIET_FETCHING: {
      throw new Error('Unable to call: Already fetching data');
    }

    case apiData.DataStatus.UPDATING: {
      return store.getState().ui.api[name].result;
    }

    case apiData.DataStatus.SUCCESS:
    case apiData.DataStatus.EMPTY: {
      store.dispatch({
        type: 'api/data/setStatus',
        name,
        payload: apiData.DataStatus.UPDATING
      });
      break;
    }

    default: {
      store.dispatch({
        type: 'api/data/setStatus',
        name,
        payload: apiData.DataStatus.QUIET_FETCHING
      });
      timeout = window.setTimeout(() => {
        store.dispatch({
          type: 'api/data/setStatus',
          name,
          payload: apiData.DataStatus.FETCHING
        });
        timeout = null;
      }, QUIET_FETCH_TIMEOUT);
      break;
    }
  }

  try {
    const response = await apiCallerDataDeliverer();
    clearTimeout(timeout);

    if (store.getState().ui.api[name].errorInfo) {
      store.dispatch({ type: 'api/data/setError', name, payload: null });
    }

    if (isEmpty(response)) {
      store.dispatch({ type: 'api/data/setResult', name, payload: response });
      store.dispatch({
        type: 'api/data/setStatus',
        name,
        payload: apiData.DataStatus.EMPTY
      });
      return response;
    } else if (!!config && !!config.checker) {
      return checkData(response);
    }

    store.dispatch({ type: 'api/data/setResult', name, payload: response });
    store.dispatch({
      type: 'api/data/setStatus',
      name,
      payload: apiData.DataStatus.SUCCESS
    });
    return response;
  } catch (e) {
    clearTimeout(timeout);
    store.dispatch({ type: 'api/data/setError', name, payload: e });
    store.dispatch({
      type: 'api/data/setStatus',
      name,
      payload: apiData.DataStatus.ERROR
    });
    throw e;
  }
};

type DLF<N extends keyof apiData.DataState, T extends ResultType> = (
  name: N,
  apiCallerDataDeliverer: () => Promise<T>,
  config?: DeliveryParams<T>
) => Promise<T>;
type DataLoader = DLF<
  'userProfile',
  apiData.DataState['userProfile']['result']
> &
  DLF<'requsetState', apiData.DataState['requsetState']['result']> &
  DLF<'selectedRequest', apiData.DataState['selectedRequest']['result']> &
  DLF<'guestGdpr', apiData.DataState['guestGdpr']['result']> &
  DLF<'userGdpr', apiData.DataState['userGdpr']['result']> &
  DLF<'cookieGdpr', apiData.DataState['cookieGdpr']['result']> &
  DLF<'openRequests', apiData.DataState['openRequests']['result']> &
  DLF<'activeRequests', apiData.DataState['activeRequests']['result']> &
  DLF<'historyRequests', apiData.DataState['historyRequests']['result']> &
  DLF<'inProcessRequests', apiData.DataState['inProcessRequests']['result']> &
  DLF<'guestRequest', apiData.DataState['guestRequest']['result']> &
  DLF<'allRequests', apiData.DataState['allRequests']['result']> &
  DLF<'adminRequest', apiData.DataState['adminRequest']['result']> &
  DLF<'subscribeState', apiData.DataState['subscribeState']['result']>;

export const loadData: DataLoader = loadDataImpl;
