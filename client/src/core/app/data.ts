import * as data from 'core/models/api';

export function defaultStateItem<T>(result: T) {
  return {
    result,
    status: data.DataStatus.INITIAL,
    errorInfo: null as any
  };
}

const defaultState: data.DataState = {
  userProfile: defaultStateItem<data.UseProfile>(null),
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
