import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { TabsProfile } from './Tabs';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { NavLink } from 'ui/app/components/Links';
import { getRating } from '../selectors';
import { getCheckRoles } from 'core/app/selectors';

const mapStateToProps = (state: AppState) => ({
  getRoles: getCheckRoles(state),
  authInfo: state.authInfo,
  rating: getRating(state)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {
  get adminButton() {
    const { admin } = this.props.getRoles;
    return (
      admin && (
        <NavLink to={`/admin`} className={'mr-1'}>
          <RaisedButton primary>
            <span style={{ margin: 8 }}>Админ кабинет</span>
          </RaisedButton>
        </NavLink>
      )
    );
  }

  get activeDriver() {
    const { activeDriver } = this.props.getRoles;
    return (
      !activeDriver && (
        <span className={this.props.styles.texts}>
          Ваш профиль до сих пор не активен. Необходимо заполнить все поля и
          фото, получить разрешение от администратора, выбрать способ рассылки
          уведомлений.
        </span>
      )
    );
  }

  get ratingDriver() {
    const { activeDriver } = this.props.getRoles;
    const { styles, rating } = this.props;
    return (
      rating &&
      activeDriver && (
        <span className={styles.texts}>
          Ваш рейтинг {rating.toFixed(1)}
          <i className={'fas fa-star'} />
        </span>
      )
    );
  }

  render() {
    const { styles, authInfo } = this.props;
    return (
      <div className={styles.container}>
        <Paper zDepth={2} style={{margin: '1rem'}}>
          <div className={styles.headBox}>
            <span className={styles.texts}>
              {this.adminButton}
              <span>
                Привет {authInfo && authInfo.fullName.first}, это ваш профиль!
              </span>
            </span>
            {this.activeDriver}
            {this.ratingDriver}
          </div>
        </Paper>
        <TabsProfile />
      </div>
    );
  }
}

const container: FelaRule<Props> = () => ({
  height: '100%',
  width: '100%'
});

const headBox: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1rem',
  padding: '1rem'
});

const texts: FelaRule<Props> = props => ({
  margin: '1rem 0',
  '>i': {
    color: props.theme.palette.yellow,
    marginLeft: '0.5rem'
  }
});

const mapStylesToProps = {
  container,
  headBox,
  texts
};

export default compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Index);
