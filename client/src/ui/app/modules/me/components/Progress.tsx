import * as React from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';

type Props = {
  uploadProgress: number
};

const ProgressComponent: React.SFC<Props> = ({uploadProgress}) => {

  return uploadProgress ? <LinearProgress mode="determinate" value={uploadProgress} /> : null
}

export const Progress = ReduxConnect((state: AppState) => ({
  uploadProgress: state.ui.profile.uploadProgress
}))(ProgressComponent)
