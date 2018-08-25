import { AppState } from 'core/models/app';
import * as React from "react";
import { connect as ReduxConnect } from 'react-redux';
import { Route, RouteComponentProps } from 'react-router';
import { Location } from 'history';
import LoadableComponent from './LoadableComponent';
import { TopBar } from 'ui/app/modules/topBar';
import { SnackBar } from 'ui/app/modules/snackbar';

export default ReduxConnect((state: AppState) => ({
  location: state.router.location as Location,
  isCookieConfirmed: state.ui.cookie.confirmed,
}))(
  ({ location, isCookieConfirmed }) => (
    <div style={styles(location)}>
      {location.pathname !== '/' && <TopBar />}
      <Route component={AppRoutes} location={location} />
      {location.pathname === '/admin' && window.location.reload()}
      {!isCookieConfirmed && <SnackBar />}
    </div>
  )
);

const styles = (location: Location): React.CSSProperties => ({
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
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

    <Route exact strict path="/request/:id/rate" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/rateRequest'), 'app.request')}
        />}
    </Route>

    <Route exact strict path="/unsubscribe/driver" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/emailsSub/components/driver'), 'app.emails')}
        />}
    </Route>

    <Route exact strict path="/unsubscribe/guest/:hash" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/emailsSub/components/guest'), 'app.emails')}
        />}
    </Route>

    {/* <Route exact strict path="/requests" location={location}>
      {({ match }) =>
        <LoadableComponent
          visibility={!!match}
          props={{ match }}
          loader={async () => require.ensure([], (require: any) => require('ui/app/modules/requests'), 'app.requests')}
        />}
    </Route> */}

  </React.Fragment>
);
