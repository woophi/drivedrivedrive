import { GuestDispatch, GuestState, HandlePoints } from './types';

const defaultState: GuestState = {
  guestSubmitForm: false,
  handlePoint: HandlePoints.none,
  openPrivacyPolicy: false,
  validEmail: true
};

export const reducer = (
  state = defaultState,
  dispatch: GuestDispatch
): GuestState => {
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
    case 'guest/openModalDialog':
      return {
        ...state,
        openPrivacyPolicy: dispatch.payload
      };
    case 'guest/checkForEmail':
      return {
        ...state,
        validEmail: dispatch.payload
      };

    default:
      return state;
  }
};
