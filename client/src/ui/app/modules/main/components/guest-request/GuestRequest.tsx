import * as React from 'react';
import { createComponent, FelaThemeProps, IStyle } from 'react-fela';
import IconButton from 'material-ui/IconButton';
import NavigationLogo from 'material-ui/svg-icons/notification/drive-eta';
import { FormEdit } from './Form';
import { Transition } from 'react-spring';
import { getGuestRequest, deleteHashId } from '../../operations';
import { getGuestRequestData } from '../../selectors';
import { connect as ReduxConnect } from 'react-redux';
import { AppState } from 'core/models/app';
import { DataStatus } from 'core/models/api';

type LocalState = {
  openForm: boolean;
};
type Props = {
  hashId: string;
  requestUpdates: boolean;
};

export class GuestRequestComponent extends React.PureComponent<Props, LocalState> {
  state: LocalState = {
    openForm: false
  };

  componentDidMount() {
    if (this.props.hashId) {
      getGuestRequest(this.props.hashId)
        .then(r => {
          if (r === null) {
            deleteHashId();
          }
        });
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (!!this.props.hashId && this.props.hashId !== prevProps.hashId) {
      getGuestRequest(this.props.hashId);
    }
  }

  handleForm = () => this.setState({ openForm: !this.state.openForm });

  pointer = (style: IStyle) => {
    return (
      <div style={style} onClick={this.handleForm}>
        <Pointer>
          <span>Ваша заявка</span>
        </Pointer>
        <Svg>
          <marker
            id="arrow20-16-right"
            markerHeight="16"
            markerUnits="strokeWidth"
            markerWidth="20"
            orient="auto"
            refX="-3"
            refY="0"
            viewBox="-15 -5 20 20"
          >
            <path d="M -15 -5 L 0 0 L -15 5 z" />
          </marker>
          <path
            d="M35,53a122.090213,122.090213,0,0,0,-20,74"
            id="e1_circleArc"
          />
        </Svg>
      </div>
    );
  }

  getIconButton = () => {
    const { requestUpdates } = this.props;
    const { openForm } = this.state;
    return (!requestUpdates && !openForm ?
      (style: IStyle) => <IconButton style={style} onClick={this.handleForm}>
        <NavigationLogo />
      </IconButton>
      : openForm && !requestUpdates ?
      (style: IStyle) => <IconButton
        style={style}
        onClick={this.handleForm}
        iconClassName={'fas fa-times'}
      />
      :
      (style: IStyle) => <IconButton
        style={style}
        iconClassName={'fas fa-circle-notch fa-spin'}
      />
    );
  }

  render() {
    const { hashId } = this.props;
    const getTopView = this.state.openForm
      ? (style: IStyle) => <FormEdit style={style} />
      : this.pointer;

    if (!hashId) {
      return null;
    }
    return (
      <Container>
        <Wrapper>
          <Widget>
            <Transition
              from={{ position: 'absolute', opacity: 0, transform: 'scale(0)' }}
              enter={{ opacity: 1, transform: 'scale(1)' }}
              leave={{ opacity: 0, transform: 'scale(0)' }}
            >
              {this.getIconButton()}
            </Transition>
          </Widget>
          <Transition
            from={{ position: 'absolute', opacity: 0, transform: 'scale(0)' }}
            enter={{ opacity: 1, transform: 'scale(1)' }}
            leave={{ opacity: 0, transform: 'scale(0)' }}
          >
            {getTopView}
          </Transition>
        </Wrapper>
      </Container>
    );
  }
}

export const GuestRequest = ReduxConnect((state: AppState) => ({
  hashId: state.ui.guests.hashId,
  requestUpdates:
    getGuestRequestData(state).status ===  DataStatus.FETCHING ||
    getGuestRequestData(state).status === DataStatus.QUIET_FETCHING ||
    getGuestRequestData(state).status === DataStatus.UPDATING,
}))(GuestRequestComponent);

const Container = createComponent<{} & Partial<FelaThemeProps>>(
  () => ({
    position: 'fixed',
    zIndex: 666,
    bottom: '10px',
    right: '60px',
    width: '65px',
    height: '65px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 1px 12px 0 rgba(0, 0, 0, 0.7)',
    cursor: 'pointer',
    userSelect: 'none'
  }),
  'div'
);
const Wrapper = createComponent<{} & Partial<FelaThemeProps>>(
  () => ({
    width: '100%',
    height: '100%',
    position: 'relative'
  }),
  'div'
);
const Widget = createComponent<{} & Partial<FelaThemeProps>>(
  () => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  }),
  'div',
  ['onClick']
);
const Svg = createComponent<{} & Partial<FelaThemeProps>>(
  ({ theme }) => ({
    position: 'absolute',
    bottom: '46px',
    left: '16px',
    '>marker > path': {
      fill: theme.palette.brand
    },
    '>path': {
      stroke: theme.palette.brand,
      markerEnd: 'url(#arrow20-16-right)',
      fill: 'none',
      strokeWidth: '1px'
    }
  }),
  'svg'
);
const Pointer = createComponent<{} & Partial<FelaThemeProps>>(
  ({ theme }) => ({
    backgroundColor: theme.palette.brand,
    position: 'absolute',
    bottom: '111px',
    width: '110px',
    left: '-23px',
    color: '#fff',
    zIndex: 1,
    height: '40px',
    padding: '4px',
    border: `1px solid ${theme.palette.brand}`,
    boxSizing: 'border-box',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem'
  }),
  'div'
);
