import { PasswordDispatch, PasswordState } from './types';

const defaultState: PasswordState = {
  key: {
    message: '',
    status: false
  }
};

export const reducer = (state = defaultState, dispatch: PasswordDispatch): PasswordState => {
  switch (dispatch.type) {
    case 'ui/getKey':
      return {
        ...state,
        key: dispatch.payload
      };

    default:
      return state;
  }
};
