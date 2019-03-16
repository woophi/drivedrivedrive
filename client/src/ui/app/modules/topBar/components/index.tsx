import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationLogo from 'material-ui/svg-icons/notification/drive-eta';
import { changeUrl } from 'ui/app/operations';
import { AppState } from 'core/models/app';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import { DroppingMenu } from './DroppingMenu';
import { withTranslation, WithTranslation } from 'react-i18next';

const MOBILE_SCREEN_WIDTH = 450;
const mapStateToProps = (state: AppState) => ({
  path: state.router.location.pathname,
  isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
});
const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;

class Index extends React.Component<Props> {

  handleHome = () => changeUrl('/');

  get titleChange() {
    const { path } = this.props;
    const splitPath = path.split('/');
    switch (splitPath[1]) {
      case 'signin':
        return 'topBar:signin';

      case 'join':
        return 'common:button:registerSyn';

      case 'forgot-password':
        return 'topBar:passwordRecovery';

      case 'reset-password':
        return 'topBar:passwordRecovery';

      case 'me':
        return 'common:button:profile';

      case 'request':
        return 'topBar:transfer';

      case 'requests':
        return 'topBar:requests';

      case 'unsubscribe':
        return 'topBar:unsub';

      case 'adm':
        return 'common:button:manage';

      case 'guest':
        return 'topBar:guest';

      default:
        return '';
    }
  }

  render() {
    const { isMobile, t } = this.props;
    return (
      <AppBar
        style={{minHeight: 60}}
        titleStyle={{maxWidth: isMobile ? 200 : 'unset'}}
        title={t(this.titleChange)}
        iconElementLeft={<IconButton><NavigationLogo /></IconButton>}
        iconElementRight={<DroppingMenu />}
      />
    )
  }
}

export const TopBar = compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps)
)(Index);
