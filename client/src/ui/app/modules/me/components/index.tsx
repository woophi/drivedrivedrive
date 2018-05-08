import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import TabsComp from './Tabs';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { NavLink } from 'ui/app/components/Links';
import { getCheckRoles } from '../selectors';

const mapStateToProps = (state: AppState) => ({
  getRoles: getCheckRoles(state),
  authInfo: state.authInfo
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {

  render() {
    const { styles, getRoles, authInfo } = this.props;
    const { admin, activeDriver } = getRoles;
    return (
        <div className={styles.container}>
          <Paper zDepth={2}>
            <div className={styles.headBox}>
              <span className={styles.texts}>
                {admin && <NavLink to={`/admin`} className={'mr-1'}>
                  <RaisedButton primary>
                    <span style={{margin: 8}}>Админ кабинет</span>
                  </RaisedButton>
                </NavLink>}
                <span>Привет {authInfo && authInfo.fullName.first}, это ваш профиль!</span>
              </span>
              {!activeDriver &&
                <span className={styles.texts}>
                  Ваш профиль до сих пор не активен. Необходимо заполнить все поля и фото, получить разрешение от администратора, выбрать способ рассылки уведомлений.
                </span>
              }
            </div>
          </Paper>
          <TabsComp />
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

const texts: FelaRule<Props> = () => ({
  margin: '1rem 0'
});

const mapStylesToProps = {
  container,
  headBox,
  texts
};

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
)(Index);
