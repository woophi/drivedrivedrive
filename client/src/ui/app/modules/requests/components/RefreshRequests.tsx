import * as React from 'react';
import { getOpenRequestsNumber, getOpenRequests } from '../operations';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import { getOpenRequestsData } from '../selectors';
import { DataStatus } from 'core/models/api';
import { createComponent, FelaThemeProps } from 'react-fela';

type Props = {
  openRequestsPrevNumber: number;
  updatingOpenRequests: boolean;
  tabViewOpenRs: boolean;
};

type LocalState = {
  openRequestsNumber: number;
};

const Indicator = createComponent<{}>(
  ({ theme }: FelaThemeProps) => ({
    backgroundColor: theme.palette.red,
    color: '#fff',
    height: '18px',
    minWidth: '18px',
    position: 'absolute',
    textAlign: 'center',
    boxSizing: 'border-box',
    borderRadius: '50%',
    bottom: '10px',
    left: '23px',
    fontSize: '12px',
    padding: '3px'
  }),
  'span',
  ['data-rh', 'data-rh-at']
);
const Container = createComponent(
  () => ({
    position: 'relative',
    marginRight: 'calc(1rem + 5px)'
  }),
  'span'
);

class OpenRequestsNumberComponent extends React.Component<Props, LocalState> {
  updateInterval = 60000;
  interval: number = null;
  state: LocalState = {
    openRequestsNumber: null
  };

  createInterval = () => {
    this.interval = window.setInterval(() => {
      getOpenRequestsNumber().then(result =>
        this.setState({ openRequestsNumber: result })
      );
    }, this.updateInterval);
  };

  removeInterval = () => {
    if (!!this.interval) {
      window.clearInterval(this.interval);
    }
  };
  async componentDidMount() {
    await getOpenRequestsNumber()
      .then(result => this.setState({ openRequestsNumber: result }))
      .then(this.createInterval);
  }
  componentWillUnmount() {
    this.removeInterval();
  }

  updateOpenRequests = () => {
    if (this.props.tabViewOpenRs) {
      getOpenRequests();
    }
  }

  render() {
    const { openRequestsPrevNumber, updatingOpenRequests } = this.props;
    const { openRequestsNumber } = this.state;

    const diffOpenRequests =
      !!openRequestsNumber && !!openRequestsPrevNumber
        ? openRequestsNumber - openRequestsPrevNumber
        : 0;
    const spin = updatingOpenRequests ? 'fa-spin' : '';
    const click = updatingOpenRequests ? undefined : this.updateOpenRequests;

    const showIndicator = diffOpenRequests > 0 && (
      <Indicator data-rh={'Новые заявки'} data-rh-at="top">
        {diffOpenRequests}
      </Indicator>
    )

    const getView = !!diffOpenRequests && (
      <Container>
        <i
          data-rh={'Обновить'}
          data-rh-at="bottom"
          className={`fas fa-sync ${spin}`}
          onClick={click}
        />
        {showIndicator}
      </Container>
    );

    return getView;
  }
}

export const OpenRequestsNumber = ReduxConnect((state: AppState) => {
  return {
    openRequestsPrevNumber: getOpenRequestsData(state).result.length,
    updatingOpenRequests:
      getOpenRequestsData(state).status === DataStatus.UPDATING ||
      getOpenRequestsData(state).status === DataStatus.QUIET_FETCHING ||
      getOpenRequestsData(state).status === DataStatus.FETCHING,
    tabViewOpenRs: state.ui.requests.view === 'open'
  };
})(OpenRequestsNumberComponent);
