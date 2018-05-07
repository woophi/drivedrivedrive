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
            <div>
              {admin && <NavLink to={`/admin/`} className={'mr-1'}>
                <RaisedButton>{'Админ кабинет'}</RaisedButton>
              </NavLink>}
              Привет {authInfo && authInfo.fullName.toString()}, это ваш профиль!
              {!activeDriver &&
                'Ваш профиль до сих пор не активен. Необходимо заполнить все поля и фото, получить разрешение от администратора, выбрать способ рассылки уведомлений.'
              }
              kek
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

const form: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem'
});

const heading: FelaRule<Props> = () => ({
  alignSelf:  'flex-start'
});

const subContainer: FelaRule<Props> = () => ({
  display:  'flex',
  width:  '100%',
  justifyContent: 'space-between'
});

const btnContainer: FelaRule<Props> = () => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
});

const mapStylesToProps = {
  container,
  heading,
  form,
  subContainer,
  btnContainer
};

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
)(Index);
