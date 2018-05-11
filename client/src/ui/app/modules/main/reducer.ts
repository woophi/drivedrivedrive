import { GuestDispatch, GuestState, HandlePoints } from './types';

const defaultState: GuestState = {
  guestSubmitForm: false,
  handlePoint: HandlePoints.none
};

export const reducer = (state = defaultState, dispatch: GuestDispatch): GuestState => {
  switch (dispatch.type) {
    case 'guest/changeFormState':
      return {
        ...state,
        guestSubmitForm: dispatch.payload
      };
    case 'guest/handlePoint':
      return {
        ...state,
        handlePoint: dispatch.payload
      };

    default:
      return state;
  }
};
