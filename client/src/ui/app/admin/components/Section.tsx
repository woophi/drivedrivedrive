import * as React from 'react';
import { connect as redux } from 'react-redux';
import { Route } from 'react-router';
import { getLocation } from 'core/app/selectors';
import { Location } from 'history';
import { AppState } from 'core/models/app';
import { SectionChild } from './SectionChild';

type OwnProps = {
  path: string
};

type Props = {
  location: Location;
} & OwnProps;

class SectionComponent extends React.PureComponent<Props> {

  render() {
    const { location, path, children } = this.props;
    return(
      <Route
        exact
        strict
        location={location}
        path={`/adm/${path}`}
      >
        {({ match }) =>
          !!match ?
            <SectionChild
              match={match}
            >
              {children}
            </SectionChild>
          : null
        }
      </Route>
    )
  }
}

export const Section = redux(
  (state: AppState, _: OwnProps) => ({
    location: getLocation(state)
  })
)(SectionComponent)
