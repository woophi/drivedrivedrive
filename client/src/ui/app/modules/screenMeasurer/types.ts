import { Dimensions } from 'react-virtualized';

export type ScreenState = {
  width: number,
  height: number
};

export type ScreenDispatch =
  | { type: 'setScreenDimensions', payload: Dimensions }
;
