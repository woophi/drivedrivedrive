import * as React from 'react';
import { AppState } from 'core/models/app';
import { compose } from 'redux';
import { returntypeof } from 'react-redux-typescript';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import FlatButton from 'material-ui/FlatButton';
import IconButton  from 'material-ui/IconButton';
import * as FlipMove from 'react-flip-move';
import { connect as ReduxConnect } from 'react-redux';

type OwnProps = {
  parallaxRef: any
};

const MOBILE_SCREEN_WIDTH = 834;
const mapStateToProps = (state: AppState, props: OwnProps) => ({
  isMobile: state.screen.width <= MOBILE_SCREEN_WIDTH
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & OwnProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type LocalState = {
  open: boolean;
};
class Header extends React.Component<Props & FelaProps, LocalState> {

  state: LocalState = {
    open: false
  };

  handleMenuClick = () => {
    this.setState(state => {
      if (state.open) {
        return ({
          open: false
        })
      } else {
        return ({
          open: true
        })
      }
    })
  }

  labelStyle = () => this.state.open ? {fontSize: '1.5rem'} : {fontSize: 'inherit'};

  navButtons = (styles: React.CSSProperties) => [
    <FlatButton
      key={'b-n-1'}
      label="Главная"
      style={styles}
      labelStyle={this.labelStyle()}
      onClick={() => {
        this.props.parallaxRef.scrollTo(0);
        if (this.props.isMobile) {
          this.handleMenuClick();
        }
      }}
    />,
    <FlatButton
      key={'b-n-2'}
      label="Как мы работаем"
      style={styles}
      labelStyle={this.labelStyle()}
      onClick={() => {
        this.props.parallaxRef.scrollTo(this.props.isMobile ? 0.7 : 1);
        if (this.props.isMobile) {
          this.handleMenuClick();
        }
      }}
    />,
    <FlatButton
      key={'b-n-3'}
      label="Узнать цену"
      style={styles}
      labelStyle={this.labelStyle()}
      onClick={() => {
        this.props.parallaxRef.scrollTo(1.8);
        if (this.props.isMobile) {
          this.handleMenuClick();
        }
      }}
    />
  ];

  renderBtns = () => {
    const { styles, parallaxRef, isMobile } = this.props;

    const transitionCont: React.CSSProperties = {
      overflow: 'hidden',
      position: 'absolute',
      top: '3rem',
      height: '100vh',
      width: '100%',
      opacity: 1,
      left: 0,
      zIndex: 900,
      transition: '0.5s',
      backgroundColor: !this.state.open ? 'transparent' : '#F0F4F7',
      pointerEvents: !this.state.open ? 'none' : 'all'
    };

    const customNavButSt: React.CSSProperties = {
      margin: this.state.open ? '2rem 2rem 0' : 'auto 3rem',
      height: this.state.open ? '4rem' : 'inherit',
      textTransform: 'uppercase'
    };

    if (!isMobile) {
      return this.navButtons(customNavButSt);
    } else {
      return (
        <React.Fragment>
          {!this.state.open ?
            <IconButton
              iconClassName="fa fa-bars fa-2"
              style={{margin: 'auto 2rem'}}
              onClick={this.handleMenuClick}
            />
          :
            <IconButton
              iconClassName="fa fa-times fa-2"
              style={{margin: 'auto 2rem'}}
              onClick={this.handleMenuClick}
            />
          }
          <div style={transitionCont}>
            <div
              className={styles.relativeContainer}
            >
              {this.state.open ? this.navButtons(customNavButSt) : null}
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    const { styles, parallaxRef } = this.props;
    return (
      <header className={styles.container}>
        {this.renderBtns()}
      </header>
    )
  }
}

const container: FelaRule<Props> = ({ isMobile }) => ({
    position: 'absolute',
    display: 'flex',
    zIndex: 100,
    height: '3rem',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: !isMobile ? 'center' : 'flex-end'
});

const relativeContainer: FelaRule<Props> = () => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
});

const mapStylesToProps = { container, relativeContainer };

export default compose(
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps)
)(Header);
