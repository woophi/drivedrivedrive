import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Profile } from './Profile';
import { Notifications } from './Notifications';
import { Car } from './Car';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import ResetPassword from 'ui/app/modules/password/reset';
import { getProfile } from '../operations';

type FelaProps = FelaStyles<typeof mapStylesToProps>;
const MOBILE_SCREEN_WIDTH = 768;
type Props = {
  isMobile: boolean;
};
class TabsComp extends React.PureComponent<FelaProps & Props> {
  async componentDidMount() {
    await getProfile();
  }
  render() {
    const { isMobile, styles } = this.props;
    const driverLabel = isMobile ? (
      <i className={'fas fa-user-edit'} />
    ) : (
      <div>
        <i className={'fas fa-user-edit mr-1'} />
        Данные водителя
      </div>
    );
    const notifyLabel = isMobile ? (
      <i className={'fas fa-bell'}  />
    ) : (
      <div>
        <i className={'fas fa-bell mr-1'} />
        Рассылка уведомлений
      </div>
    );
    const carLabel = isMobile ? (
      <i className={'fas fa-car'} />
    ) : (
      <div>
        <i className={'fas fa-car mr-1'} />
        Машина
      </div>
    );
    const resetPasswordLabel = isMobile ? (
      <i className={'fas fa-key'} />
    ) : (
      <div>
        <i className={'fas fa-key mr-1'} />
        Изменить пароль
      </div>
    );
    return (
      <Tabs className={styles.container}>
        <Tab label={driverLabel}>
          <Profile />
        </Tab>
        <Tab label={notifyLabel}>
          <Notifications />
        </Tab>
        <Tab label={carLabel}>
          <Car />
        </Tab>
        <Tab label={resetPasswordLabel}>
          <ResetPassword />
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

export const TabsProfile = compose(
  FelaConnect(mapStylesToProps),
  ReduxConnect((state: AppState) => ({
    isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
  }))
)(TabsComp);
