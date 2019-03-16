import * as React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { RegisterModules } from './RegisterModules';
import { withTranslation, WithTranslation } from 'react-i18next';

class AdminComponent extends React.PureComponent<WithTranslation> {
  get paperStyle(): React.CSSProperties {
    return {
      margin: '1rem',
      padding: '1rem'
    };
  }
  render() {
    const { t } = this.props;
    return (
      <>
        <Paper zDepth={2} style={this.paperStyle}>
          <Link className={'tD-none'} to={'/adm/requests/edit'}>
            <RaisedButton label={t('admin:requests:title')} primary />
          </Link>
        </Paper>
        <RegisterModules />
      </>
    );
  }
}

export const Admin = withTranslation('app')(AdminComponent);
