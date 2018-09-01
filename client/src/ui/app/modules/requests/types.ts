export type RequestsState = {
  view: ViewRequests
};

export type ViewRequests = 'open' | 'inProcess' | 'active' | 'history';

export type RequestsDispatch =
  | { type: 'requests/setView'; payload: ViewRequests }
;
