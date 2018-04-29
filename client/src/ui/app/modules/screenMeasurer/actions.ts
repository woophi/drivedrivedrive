import { Dimensions } from 'react-virtualized';

let timeout: number = null;

export const setDimestions = (dimensions: Dimensions) => (dispatch: any) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = window.setTimeout(() => {
    dispatch({ type: 'setScreenDimensions', payload: dimensions });
  }, 600);
};
