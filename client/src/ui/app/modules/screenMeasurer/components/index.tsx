import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { setDimestions } from '../actions';

export const ScreenMeasurer = () =>
  <AutoSizer>
    {setDimestions}
  </AutoSizer>;
