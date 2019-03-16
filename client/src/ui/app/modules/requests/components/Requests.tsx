import * as React from 'react';
import { createComponent } from 'react-fela';
import { TabsRequests } from './Tabs';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import { getCheckRoles } from 'core/app/selectors';
import Paper from 'material-ui/Paper';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = {
  roles: {
    admin: boolean,
    activeDriver: boolean
  }
} & WithTranslation;

const Container = createComponent(
  () => ({
    height: '100%',
  width: '100%'
  }),
  'div',
  ['className']
);
const Wrapper = createComponent(
  () => ({
    display: 'flex',
    justifyContent: 'center',
    flex: 1
  }),
  'div'
);

class RequestsComponent extends React.PureComponent<Props> {

  get view() {
    const { roles, t } = this.props;
    const { activeDriver, admin } = roles;
    if (activeDriver || admin) {
      return <TabsRequests />;
    } else {
      return (
        <Paper zDepth={2} style={{margin: '1rem'}}>
          <Wrapper>
            <h1>{t('errors:accessDenied')}</h1>
          </Wrapper>
        </Paper>
      )
    }
  }

  render() {
    return (
      <Container>
        {this.view}
      </Container>
    );
  }
}

export const Requests = compose(
  withTranslation('app'),
  ReduxConnect((state: AppState) => {
    return ({
      roles: getCheckRoles(state)
    });
  })
)(RequestsComponent);
