import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import {Tabs, Tab} from 'material-ui/Tabs';
import Profile from './Profile';

type FelaProps = FelaStyles<typeof mapStylesToProps>;
type OwnProps = {
}

const TabsComp: React.SFC<FelaProps & OwnProps> = ({ styles }) => {
  const headline: React.CSSProperties = {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  };

  return (
    <Tabs>
      <Tab label="Данные водителя" >
        <Profile />
      </Tab>
      <Tab label="Изменить пароль" >
        <div>
          <h2 style={headline}>Tab One</h2>
          <p>
            This is an example tab.
          </p>
          <p>
            You can put any sort of HTML or react component in here. It even keeps the component state!
          </p>
        </div>
      </Tab>
    </Tabs>
  );
};

const container: FelaRule = () => ({

});

const mapStylesToProps = {
  container
};

export default compose(
  FelaConnect(mapStylesToProps)
)(TabsComp);
