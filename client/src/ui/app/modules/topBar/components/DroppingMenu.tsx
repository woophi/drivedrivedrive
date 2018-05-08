import * as React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Receipts from 'material-ui/svg-icons/action/receipt';
import Profile from 'material-ui/svg-icons/social/person';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import FontIcon from 'material-ui/FontIcon';
import {blue500} from 'material-ui/styles/colors';
import { Link } from 'ui/app/components/Links';
import { AppState } from 'core/models/app';
import { signOut } from 'core/app/login';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import { getSelectedPath } from '../selectors';

const mapStateToProps = (state: AppState) => ({
  authInfo: state.authInfo,
  slectedPath: getSelectedPath(state)
});
const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;

class DroppingMenu extends React.Component<Props> {

  changeIconOnPath = (icon: JSX.Element, btnName: string) => {
    if (this.props.slectedPath === btnName) {
      return <ArrowRight color={blue500} />;
    } else {
      return icon;
    }
  }

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
            disabled={this.props.slectedPath === 'signin'}
            leftIcon={this.changeIconOnPath(<FontIcon className="fas fa-sign-in-alt" />, 'signin')}
            primaryText="Войти"
          />
        </Link>
      );
    }
  }


  render() {
    const { authInfo } = this.props;
    return (
      <IconMenu
        iconButtonElement={
          <IconButton><MenuIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <Link className={'tD-none'} to={'/'}>
          <MenuItem leftIcon={<ActionHome />} primaryText="Главная" />
        </Link>
        {!authInfo &&
          <Link className={'tD-none'} to={'/join'}>
            <MenuItem leftIcon={this.changeIconOnPath(<PersonAdd />, 'join')} primaryText="Регистрация" />
          </Link>
        }
        {/* {authInfo &&
          <Link className={'tD-none'} to={'/request'}>
            <MenuItem leftIcon={this.changeIconOnPath(<Receipts />, 'request')} primaryText="Заявки" />
          </Link>
        } */}
        {authInfo &&
          <Link className={'tD-none'} to={'/me'}>
            <MenuItem leftIcon={this.changeIconOnPath(<Profile />, 'me')} primaryText="Профиль" />
            </Link>
        }
        {this.logInOutBtn}
      </IconMenu>
    )
  }
}

export default compose(
  ReduxConnect(mapStateToProps)
)(DroppingMenu);
