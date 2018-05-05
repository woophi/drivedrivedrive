import * as React from "react";
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { compose } from 'redux';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import Info from './Info';
import Form from './Form';
import Points from './Points';

const MOBILE_SCREEN_WIDTH = 973;
type OwnProps = {
  isMobile: boolean
};
type Props =  OwnProps;

type FelaProps = FelaStyles<typeof mapStylesToProps>;

const Index: React.SFC<Props & FelaProps> = props => {

  const { isMobile, styles } = props;

  return (
    <React.Fragment>
      <div className={styles.container}>
        <Info />
        <Form />
      </div>
      {!isMobile && <Points />}
    </React.Fragment>
  );
}

const container: FelaRule<Props> = ({theme}) => ({
  display: 'flex',
  color: '#fff',
  justifyContent: 'center',
  marginTop: '6rem',
  flexWrap: 'wrap',
  ...theme.mobileEarly({
    marginTop: '8rem'
  })
});

const mapStylesToProps = {
  container
};

export default compose(
  FelaConnect(mapStylesToProps),
  ReduxConnect((state: AppState) => ({
    isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
  }))
)(Index);
