import * as data from '.';

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
  userProfile: DataStateItem<data.UserProfile>
};

export type DataStateItem<T> = {
  result: T,
  status: DataStatus,
  errorInfo: object
};

export type DataDispatch =
  | { type: 'api/data/setResult', name: keyof DataState, payload: DataState[keyof DataState]["result"] }
  | { type: 'api/data/setStatus', name: keyof DataState, payload: DataStatus }
  | { type: 'api/data/setError', name: keyof DataState, payload: any }
  | { type: 'api/data/reset', name: keyof DataState }
;
