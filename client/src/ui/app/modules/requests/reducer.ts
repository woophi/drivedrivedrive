import { RequestsDispatch, RequestsState } from './types';

const defaultState: RequestsState = {
  view: 'open'
};

export const reducer = (state = defaultState, dispatch: RequestsDispatch): RequestsState => {
  switch (dispatch.type) {
    case 'requests/setView':
      return {
        ...state,
        view: dispatch.payload
      };

    default:
      return state;
  }
};
