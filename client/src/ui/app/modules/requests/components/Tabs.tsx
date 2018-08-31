import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles, createComponent } from 'react-fela';
import { Tabs, Tab } from 'material-ui/Tabs';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import Paper from 'material-ui/Paper';
import { OpenRequestsList } from './open-list/List';

type FelaProps = FelaStyles<typeof mapStylesToProps>;

type Props = {
  isMobile: boolean;
};

const Container = createComponent(
  () => ({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '79vh'
  }),
  'div'
);
class TabsComp extends React.PureComponent<FelaProps & Props> {
  render() {
    const { isMobile, styles } = this.props;
    const requestsOpenLabel = isMobile ? (
      <i className={'fas fa-taxi'} />
    ) : (
      <div>
        <i className={'fas fa-taxi mr-1'} />
        Открытые
      </div>
    );
    const requestsProgressLabel = isMobile ? (
      <i className={'fas fa-users'}  />
    ) : (
      <div>
        <i className={'fas fa-users mr-1'} />
        В обработке
      </div>
    );
    const requestsSubmitedLabel = isMobile ? (
      <i className={'fas fa-car-side'} />
    ) : (
      <div>
        <i className={'fas fa-car-side mr-1'} />
        Предстоящие
      </div>
    );
    const requestsHistoryLabel = isMobile ? (
      <i className={'fas fa-history'} />
    ) : (
      <div>
        <i className={'fas fa-history mr-1'} />
        История
      </div>
    );
    return (
      <Tabs className={styles.container}>
        <Tab label={requestsOpenLabel}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <Container>
              <OpenRequestsList />
            </Container>
          </Paper>
        </Tab>
        <Tab label={requestsProgressLabel}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <div>kek</div>
          </Paper>
        </Tab>
        <Tab label={requestsSubmitedLabel}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <div>kek</div>
          </Paper>
        </Tab>
        <Tab label={requestsHistoryLabel}>
          <Paper zDepth={2} style={{margin: '1rem'}}>
            <div>kek</div>
          </Paper>
        </Tab>
      </Tabs>
    );
  }
}

const container: FelaRule = () => ({
  width: '100%',
  height: 500
});

const mapStylesToProps = {
  container
};

export const TabsRequests = compose(
  FelaConnect(mapStylesToProps),
  ReduxConnect((state: AppState) => {
    const MOBILE_SCREEN_WIDTH = 768;
    return ({
      isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
    });
  })
)(TabsComp);
