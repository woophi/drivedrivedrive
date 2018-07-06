import { CookieState, CookieDispatch } from './types';
import { LocalStorageManager } from 'core/localStorageManager';

const isSaveConfirmed =  LocalStorageManager.get('uniqGuest', 'cookiesConfirmed');

const defaultState: CookieState = {
  open: false,
  confirmed: isSaveConfirmed ? isSaveConfirmed : false
};

export const reducer = (
  state = defaultState,
  dispatch: CookieDispatch
): CookieState => {
  switch (dispatch.type) {
    case 'cookie/stateModal':
      return {
        ...state,
        open: dispatch.payload
      };
    case 'cookie/confirmed':
      return {
        ...state,
        confirmed: dispatch.payload
      };

    default:
      return state;
  }
};
