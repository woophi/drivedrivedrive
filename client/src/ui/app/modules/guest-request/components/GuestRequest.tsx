import * as React from 'react';
import { IStyle } from 'react-fela';
import { FormEdit } from './Form';
import { Transition } from 'react-spring';
import { getGuestRequest, deleteHashId } from '../operations';
import { getGuestRequestData } from '../selectors';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import { DataStatus } from 'core/models/api';
import { Paper } from 'material-ui';

type Props = {
  hashId: string;
  requestUpdates: boolean;
};

class GuestRequestComponent extends React.PureComponent<Props> {

  componentDidMount() {
    if (this.props.hashId) {
      getGuestRequest(this.props.hashId)
        .then(r => {
          if (r === null) {
            deleteHashId();
          }
        });
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (!!this.props.hashId && this.props.hashId !== prevProps.hashId) {
      getGuestRequest(this.props.hashId);
    }
  }


  getTopView = (style: IStyle) => <FormEdit style={style} />;

  get paperStyle(): React.CSSProperties {
    return {
      margin: '1rem',
      padding: '1rem'
    }
  }
  render() {
    const { hashId } = this.props;

    // if (!hashId) {
    //   return null;
    // }
    return (
      <Paper zDepth={2} style={this.paperStyle}>
        <Transition
          from={{ opacity: 0, transform: 'scale(0)' }}
          enter={{ opacity: 1, transform: 'scale(1)' }}
        >
          {this.getTopView}
        </Transition>
      </Paper>
    );
  }
}

export const GuestRequest = ReduxConnect((state: AppState) => ({
  hashId: state.ui.guests.hashId,
  requestUpdates:
    getGuestRequestData(state).status ===  DataStatus.FETCHING ||
    getGuestRequestData(state).status === DataStatus.QUIET_FETCHING ||
    getGuestRequestData(state).status === DataStatus.UPDATING,
}))(GuestRequestComponent);
