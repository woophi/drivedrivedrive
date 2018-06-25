import * as React from 'react';
import Snackbar from 'material-ui/Snackbar';

type Props = {

};

class SnackbarComponent extends React.PureComponent<Props> {
  render() {
    return (
      <Snackbar
        open
        message={'pnx'}
      />
    )
  }
}

export const SnackBar = SnackbarComponent;
