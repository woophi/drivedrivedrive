import { Dimensions } from 'react-virtualized';
import { store } from 'core/shared/store';

let timeout: number = null;

export const setDimestions = (dimensions: Dimensions): null => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = window.setTimeout(() => {
    store.dispatch({ type: 'setScreenDimensions', payload: dimensions });
  }, 600);
  return null;
};
