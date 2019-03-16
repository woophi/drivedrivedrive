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
import { withTranslation, WithTranslation } from 'react-i18next';

const mapStateToProps = (state: AppState) => ({
  getRoles: getCheckRoles(state),
  authInfo: state.authInfo,
  rating: getRating(state)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;
class Index extends React.Component<Props & FelaProps> {
  get adminButton() {
    const { admin } = this.props.getRoles;
    return (
      admin && (
        <NavLink to={`/admin`} className={'mr-1'}>
          <RaisedButton primary>
            <span style={{ margin: 8 }}>{this.props.t('profile:adminCab')}</span>
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
          {this.props.t('profile:notActive')}
        </span>
      )
    );
  }

  get ratingDriver() {
    const { activeDriver } = this.props.getRoles;
    const { styles, rating, t } = this.props;
    return (
      rating &&
      activeDriver && (
        <span className={styles.texts}>
          {t('profile:rating')} {rating.toFixed(1)}
          <i className={'fas fa-star'} />
        </span>
      )
    );
  }

  render() {
    const { styles, authInfo, t } = this.props;
    return (
      <div className={styles.container}>
        <Paper zDepth={2} style={{margin: '1rem'}}>
          <div className={styles.headBox}>
            <span className={styles.texts}>
              {this.adminButton}
              <span>
                {t('profile:username', {name: authInfo && authInfo.fullName.first})}
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
  withTranslation('app'),
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Index);
