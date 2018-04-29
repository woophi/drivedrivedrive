import * as React from 'react';
import { compose } from 'redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { Parallax } from 'react-spring';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  parallaxRef: any
};

type FelaProps = FelaStyles<typeof mapStylesToProps>;

type LocalState = {
  selectedLayer: number
};

class Header extends React.Component<Props & FelaProps, LocalState> {

  state: LocalState = {
    selectedLayer: 0
  }

  render() {
    const { styles, parallaxRef } = this.props;
    return (
      <div className={styles.container}>
        <FlatButton
          primary={this.state.selectedLayer === 0}
          label="Default"
          style={{margin: 'auto .5rem'}}
          onClick={() => {
            parallaxRef.scrollTo(0);
            this.setState({ selectedLayer: 0 })
          }}
        />
        <FlatButton
          primary={this.state.selectedLayer === 1}
          label="Default"
          style={{margin: 'auto .5rem'}}
          onClick={() => {
            parallaxRef.scrollTo(1);
            this.setState({ selectedLayer: 1 })
          }}
        />
        <FlatButton
          primary={this.state.selectedLayer === 2}
          label="Default"
          style={{margin: 'auto .5rem'}}
          onClick={() => {
            parallaxRef.scrollTo(2);
            this.setState({ selectedLayer: 2 })
          }}
        />
      </div>
    )
  }
}

const container: FelaRule<Props> = () => ({
    position: 'absolute',
    display: 'flex',
    zIndex: 100,
    height: '3rem',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center'
});


const mapStylesToProps = { container };

export default compose(
  FelaConnect(mapStylesToProps)
)(Header);
