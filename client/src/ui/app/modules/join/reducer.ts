import { UserDispatch, UserState } from './types';

const defaultState: UserState = {
  openPrivacyPolicy: false
};

export const reducer = (
  state = defaultState,
  dispatch: UserDispatch
): UserState => {
  switch (dispatch.type) {
    case 'user/openModalDialog':
      return {
        ...state,
        openPrivacyPolicy: dispatch.payload
      };

    default:
      return state;
  }
};
