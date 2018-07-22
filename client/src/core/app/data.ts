import * as data from 'core/models/api';

export function defaultStateItem<T>(result: T) {
  return {
    result,
    status: data.DataStatus.INITIAL,
    errorInfo: null as any
  };
}

const defaultState: data.DataState = {
  userProfile: defaultStateItem<data.UserProfile>(null),
  requsetState: defaultStateItem<data.StateRequest>(null),
  selectedRequest: defaultStateItem<data.NewRequest>(null),
  guestGdpr: defaultStateItem<data.Gdpr>(null),
  userGdpr: defaultStateItem<data.Gdpr>(null),
  cookieGdpr: defaultStateItem<data.Gdpr>(null),
  subscribeState: defaultStateItem<data.StateUnsub>(null)
};

export const reducer = (state = defaultState, dispatch: data.DataDispatch): data.DataState => {
  switch (dispatch.type) {
    case 'api/data/setResult':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          result: dispatch.payload
        }
      };

    case 'api/data/setStatus':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          status: dispatch.payload
        }
      };

    case 'api/data/setError':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          errorInfo: dispatch.payload
        }
      };

    case 'api/data/reset':
      return {
        ...state,
        [dispatch.name]: defaultState[dispatch.name]
      };

    default:
      return state;
  }
};
