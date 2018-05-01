import { AppState } from 'core/models/app';
import * as React from "react";
import { connect as ReduxConnect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Location } from 'history';
import LoadableComponent from './LoadableComponent';
// import TopBarMobile from 'ui/application/modules/TopBarMobile';
import { Redirect } from 'react-router';
// import PermissionDenied from 'ui/application/components/PermissionDenied';

export default ReduxConnect((state: AppState) => ({
  location: state.router.location as Location
}))(
  ({ location }) => (
    <div style={styles}>
      {/* <TopBarMobile /> */}

      {/* <PermissionDenied waitForAdminState> */}
        <Route component={AppRoutes} location={location} />
      {/* </PermissionDenied> */}
    </div>
  )
);

const styles: React.CSSProperties = {
  flex: 1,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
};

const AppRoutes: React.SFC<RouteComponentProps<any>> = ({ location }) => (
  <React.Fragment>
    <Route exact strict path="/" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/main'), 'app.index')}
        />}
    </Route>

    <Route exact strict path="/signin" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/login'), 'app.login')}
        />}
    </Route>

    {/* <Route path="/:companyId/:tenantId/users" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/admin/modules/users'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/wallboard" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/admin/modules/wallboard'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/operators" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], require => require('ui/admin/modules/operators'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/companies" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], require => require('ui/admin/modules/companies'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/sessions" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], require => require('ui/admin/modules/sessions'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/:userId(\\d+)/sessions" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], require => require('ui/admin/modules/sessions'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/visitors" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], require => require('ui/admin/modules/visitors'), 'app.admin')}
        />}
    </Route>

    <Route path="/:companyId/:tenantId/settings" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], require => require('ui/admin'), 'app.admin')}
        />}
    </Route> */}
  </React.Fragment>
);
