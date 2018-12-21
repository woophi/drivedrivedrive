import * as React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Profile from 'material-ui/svg-icons/social/person';
import Receipts from 'material-ui/svg-icons/action/receipt';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import FontIcon from 'material-ui/FontIcon';
import { blue500 } from 'material-ui/styles/colors';
import { Link } from 'ui/app/components/Links';
import { AppState } from 'core/models/app';
import { signOut } from 'core/app/login';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import { getSelectedPath, getSelectedSubPath } from '../selectors';
import { getCheckRoles } from 'core/app/selectors';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  currentPath: getSelectedPath(state),
  subPath: getSelectedSubPath(state),
  getRoles: getCheckRoles(state)
});
const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;

class DroppingMenuComponent extends React.Component<Props> {
  changeIconOnPath = (icon: JSX.Element, btnName: string) => {
    const { currentPath, subPath } = this.props;
    if (`${currentPath}/${subPath}` === `${btnName}/`) {
      return <ArrowRight color={blue500} />;
    } else {
      return icon;
    }
  };

  get logInOutBtn() {
    if (this.props.authInfo) {
      return (
        <MenuItem
          onClick={signOut}
          className={'tD-none'}
          leftIcon={<FontIcon className="fas fa-sign-out-alt" />}
          primaryText="Выйти"
        />
      );
    } else {
      return (
        <Link className={'tD-none'} to={'/signin'}>
          <MenuItem
            disabled={this.props.currentPath === 'signin'}
            leftIcon={this.changeIconOnPath(
              <FontIcon className="fas fa-sign-in-alt" />,
              'signin'
            )}
            primaryText="Войти"
          />
        </Link>
      );
    }
  }

  get menuIcon() {
    return (
      <IconButton>
        <MenuIcon />
      </IconButton>
    );
  }

  get joinLink() {
    return (
      <Link className={'tD-none'} to={'/join'}>
        <MenuItem
          leftIcon={this.changeIconOnPath(<PersonAdd />, 'join')}
          primaryText="Регистрация"
        />
      </Link>
    );
  }

  get requestsLink() {
    return (
      <Link className={'tD-none'} to={'/requests'}>
        <MenuItem
          leftIcon={this.changeIconOnPath(<Receipts />, 'requests')}
          primaryText="Заявки"
        />
      </Link>
    );
  }

  get profileLink() {
    return (
      <Link className={'tD-none'} to={'/me'}>
        <MenuItem
          leftIcon={this.changeIconOnPath(<Profile />, 'me')}
          primaryText="Профиль"
        />
      </Link>
    );
  }

  get manageLinks() {
    const { admin } = this.props.getRoles;

    return (
      admin && (
        <Link className={'tD-none'} to={'/adm'}>
          <MenuItem
            leftIcon={this.changeIconOnPath(
              <FontIcon className={'fas fa-cogs'} />,
              'adm'
            )}
            primaryText="Управление"
          />
        </Link>
      )
    );
  }

  render() {
    const { authInfo } = this.props;
    return (
      <IconMenu
        iconButtonElement={this.menuIcon}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Link className={'tD-none'} to={'/'}>
          <MenuItem leftIcon={<ActionHome />} primaryText="Главная" />
        </Link>
        {this.manageLinks}
        {!authInfo && this.joinLink}
        {authInfo && this.requestsLink}
        {authInfo && this.profileLink}
        {this.logInOutBtn}
      </IconMenu>
    );
  }
}

export const DroppingMenu = compose(ReduxConnect(mapStateToProps))(
  DroppingMenuComponent
);
