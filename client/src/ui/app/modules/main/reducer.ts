import { GuestDispatch, GuestState } from './types';

const defaultState: GuestState = {
  guestSubmitForm: false
};

export const reducer = (state = defaultState, dispatch: GuestDispatch): GuestState => {
  switch (dispatch.type) {
    case 'guest/changeFormState':
      return {
        ...state,
        guestSubmitForm: dispatch.payload
      };

    default:
      return state;
  }
};
