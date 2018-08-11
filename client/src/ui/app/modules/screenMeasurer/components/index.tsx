import * as React from 'react';
import { AppDispatch } from 'core/models/app';
import { connect as reduxConnect, DispatchProp } from 'react-redux';
import { AutoSizer } from 'react-virtualized';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

export const ScreenMeasurer = reduxConnect(null, (dispatch: DispatchProp<AppDispatch>) =>
  bindActionCreators({ ...actions }, dispatch as any)
)(({ setDimestions }) => {
  return (
    <AutoSizer>
      {dimensions => setDimestions(dimensions)}
    </AutoSizer>
  );
});
