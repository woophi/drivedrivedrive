import * as React from 'react';
import { AppDispatch } from 'core/models/app';
import { connect as reduxConnect, Dispatch } from 'react-redux';
import { AutoSizer, Dimensions } from 'react-virtualized';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

export default reduxConnect(null, (dispatch: Dispatch<AppDispatch>) =>
  bindActionCreators({ ...actions }, dispatch)
)(({ setDimestions }) => {
  return (
    <AutoSizer>
      {dimensions => setDimestions(dimensions)}
    </AutoSizer>
  );
});
