import { AppState } from 'core/models/app';
import * as React from "react";
import { connect as ReduxConnect } from 'react-redux';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Location } from 'history';
import LoadableComponent from './LoadableComponent';
import TopBar from 'ui/app/modules/topBar';
import { Redirect } from 'react-router';
// import PermissionDenied from 'ui/application/components/PermissionDenied';

export default ReduxConnect((state: AppState) => ({
  location: state.router.location as Location
}))(
  ({ location }) => (
    <div style={styles(location)}>
      {location.pathname !== '/' && <TopBar />}

      {/* <PermissionDenied waitForAdminState> */}
        <Route component={AppRoutes} location={location} />
      {/* </PermissionDenied> */}
      {location.pathname === '/admin' && window.location.reload()}
    </div>
  )
);

const styles = (location: Location): React.CSSProperties => ({
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: location.pathname !== '/' ? 850 : 'unset'
});

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

    <Route exact strict path="/join" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/join'), 'app.join')}
        />}
    </Route>

    <Route exact strict path="/forgot-password" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/password/forgot'), 'app.password')}
        />}
    </Route>

    <Route exact strict path="/reset-password/:key" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/password/reset'), 'app.password')}
        />}
    </Route>

    <Route exact strict path="/me" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/me'), 'app.driver')}
        />}
    </Route>

    <Route exact strict path="/request/:key" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/request'), 'app.request')}
        />}
    </Route>

    <Route exact strict path="/request/:id/accept/:driverId" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/acceptRequest'), 'app.request')}
        />}
    </Route>

    <Route exact strict path="/request/:id/confirm" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/confirmRequest'), 'app.request')}
        />}
    </Route>

  </React.Fragment>
);
