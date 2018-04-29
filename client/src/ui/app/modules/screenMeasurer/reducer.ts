import { ScreenDispatch, ScreenState } from './types';

const defaultState: ScreenState = {
  width: 0,
  height: 0
};

export default (state = defaultState, dispatch: ScreenDispatch) => {
  switch (dispatch.type) {
    case 'setScreenDimensions':
      return {
        ...state,
        ...dispatch.payload
      };

    default:
      return state;
  }
};
