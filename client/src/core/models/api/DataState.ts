import * as data from '.';
import { RequestInfo } from 'core/models/Request';

export const enum DataStatus {
  INITIAL = 'initial',
  QUIET_FETCHING = 'quiet_fetching',
  FETCHING = 'fetching',
  UPDATING = 'updating',
  SUCCESS = 'success',
  EMPTY = 'empty',
  ERROR = 'error'
}

export type DataState = {
  userProfile: DataStateItem<data.UserProfile>,
  requsetState: DataStateItem<data.StateRequest>,
  selectedRequest: DataStateItem<data.NewRequest>,
  guestGdpr: DataStateItem<data.Gdpr>,
  userGdpr: DataStateItem<data.Gdpr>,
  cookieGdpr: DataStateItem<data.Gdpr>,
  subscribeState: DataStateItem<data.StateUnsub>,
  openRequests: DataStateItem<data.TableRequest[]>,
  activeRequests: DataStateItem<data.TableRequest[]>,
  historyRequests: DataStateItem<data.TableRequest[]>,
  inProcessRequests: DataStateItem<data.TableRequest[]>,
  guestRequest: DataStateItem<RequestInfo>,
  allRequests: DataStateItem<data.TableRequest[]>,
};

export type DataStateItem<T> = {
  result: T,
  status: DataStatus,
  errorInfo: object
};

export type DataDispatch =
  | DataResultDispatch
  | { type: 'api/data/setStatus', name: keyof DataState, payload: DataStatus }
  | { type: 'api/data/setError', name: keyof DataState, payload: any }
  | { type: 'api/data/reset', name: keyof DataState }
;

export type DataResultDispatch =
  { type: 'api/data/setResult', name: keyof DataState, payload: DataState[keyof DataState]["result"] };
