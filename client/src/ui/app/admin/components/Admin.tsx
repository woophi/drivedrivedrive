import * as React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { RegisterModules } from './RegisterModules';

class AdminComponent extends React.PureComponent {

  get paperStyle(): React.CSSProperties {
    return {
      margin: '1rem',
      padding: '1rem'
    }
  }
  render() {
    return (
      <>
        <Paper zDepth={2} style={this.paperStyle}>
          <Link className={'tD-none'} to={'/adm/requests/edit'}>
            <RaisedButton label="Заявки" primary />
          </Link>
        </Paper>
        <RegisterModules />
      </>
    )
  }
}

export const Admin = AdminComponent;
