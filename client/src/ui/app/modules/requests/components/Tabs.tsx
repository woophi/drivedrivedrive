import * as React from 'react';
import { compose } from 'redux';
import { createComponent } from 'react-fela';
import { Tabs, Tab } from 'material-ui/Tabs';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import Paper from 'material-ui/Paper';
import { OpenRequestsList } from './open-list/List';
import { ActiveRequestsList } from './active-list/List';
import { HistoryRequestsList } from './history-list/List';
import { InProcessRequestsList } from './in-process-list/List';
import { OpenRequestsNumber } from './RefreshRequests';
import { ViewRequests } from '../types';
import { setViewOnRequests } from '../operations';
import 'react-virtualized/styles.css';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = {
  isMobile: boolean;
  requestsView: ViewRequests;
} & WithTranslation;

const Container = createComponent(
  () => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '75vh'
  }),
  'div'
);
class TabsComp extends React.PureComponent<Props> {
  get requestsOpenLabel() {
    const { isMobile, t } = this.props;
    const label = isMobile ? (
      <i className={'fas fa-taxi'} />
    ) : (
      <>
        <i className={'fas fa-taxi mr-1'} />
        {t('requests:tab:open')}
      </>
    );

    return (
      <div>
        <OpenRequestsNumber />
        {label}
      </div>
    );
  }

  openRsClick = () => {
    setViewOnRequests('open');
  }
  inProcessRsClick = () => {
    setViewOnRequests('inProcess');
  }
  activeRsClick = () => {
    setViewOnRequests('active');
  }
  historyRsClick = () => {
    setViewOnRequests('history');
  }

  render() {
    const { isMobile, requestsView, t } = this.props;
    const requestsProgressLabel = isMobile ? (
      <i className={'fas fa-users'}  />
    ) : (
      <div>
        <i className={'fas fa-users mr-1'} />
        {t('requests:tab:progress')}
      </div>
    );
    const requestsActiveLabel = isMobile ? (
      <i className={'fas fa-car-side'} />
    ) : (
      <div>
        <i className={'fas fa-car-side mr-1'} />
        {t('requests:tab:active')}
      </div>
    );
    const requestsHistoryLabel = isMobile ? (
      <i className={'fas fa-history'} />
    ) : (
      <div>
        <i className={'fas fa-history mr-1'} />
        {t('requests:tab:history')}
      </div>
    );
    return (
      <Tabs>
        <Tab label={this.requestsOpenLabel} onActive={this.openRsClick}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <Container>
              {requestsView === 'open' && <OpenRequestsList />}
            </Container>
          </Paper>
        </Tab>
        <Tab label={requestsProgressLabel} onActive={this.inProcessRsClick}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <Container>
              {requestsView === 'inProcess' && <InProcessRequestsList />}
            </Container>
          </Paper>
        </Tab>
        <Tab label={requestsActiveLabel} onActive={this.activeRsClick}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <Container>
              {requestsView === 'active' && <ActiveRequestsList />}
            </Container>
          </Paper>
        </Tab>
        <Tab label={requestsHistoryLabel} onActive={this.historyRsClick}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <Container>
              {requestsView === 'history' && <HistoryRequestsList />}
            </Container>
          </Paper>
        </Tab>
      </Tabs>
    );
  }
}

export const TabsRequests = compose(
  withTranslation('app'),
  ReduxConnect((state: AppState) => {
    const MOBILE_SCREEN_WIDTH = 768;
    return ({
      isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH,
      requestsView: state.ui.requests.view
    });
  })
)(TabsComp);
