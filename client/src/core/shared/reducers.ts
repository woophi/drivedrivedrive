import * as models from 'core/models';
import { SharedDispatch } from 'core/models/shared';

const defaultState = {
  localAppState: {

  } as models.LocalAppState,
};

export const localAppState = (state = defaultState.localAppState, dispatch: SharedDispatch): models.LocalAppState => {
  switch (dispatch.type) {
    case 'appInit':
      return {
        ...state,
        isMobile: dispatch.isMobile
      };
    default:
      return state;
  }
};
