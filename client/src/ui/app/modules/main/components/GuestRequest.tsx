import * as React from 'react';
import { createComponent, FelaThemeProps } from 'react-fela';
import IconButton from 'material-ui/IconButton';
import NavigationLogo from 'material-ui/svg-icons/notification/drive-eta';

export class GuestRequestComponent extends React.PureComponent {

  render() {
    return (
      <Container>
        <Wrapper>
          <Widget>
            <IconButton>
              <NavigationLogo />
            </IconButton>
          </Widget>
          <Pointer>
            <span>
              Ваша заявка
            </span>
          </Pointer>
          <Svg>
            <marker id="arrow20-16-right" markerHeight="16" markerUnits="strokeWidth" markerWidth="20" orient="auto" refX="-3" refY="0" viewBox="-15 -5 20 20">
              <path d="M -15 -5 L 0 0 L -15 5 z" />
            </marker>
            <path d="M35,53a122.090213,122.090213,0,0,0,-20,74" id="e1_circleArc"/>
          </Svg>
        </Wrapper>
      </Container>
    )
  }
}

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
    alignItems: 'center',
  }),
  'div'
);
const Svg = createComponent<{} & Partial<FelaThemeProps>>(
  ({ theme }) => ({
    position: 'absolute',
    bottom: '46px',
    left: '16px',
    '>marker > path': {
      fill: theme.palette.dark
    },
    '>path': {
      stroke: theme.palette.dark,
      markerEnd: 'url(#arrow20-16-right)',
      fill: 'none',
      strokeWidth: '1px'
    }
  }),
  'svg'
);
const Pointer = createComponent<{} & Partial<FelaThemeProps>>(
  ({ theme }) => ({
    backgroundColor: theme.palette.green,
    position: 'absolute',
    bottom: '111px',
    width: '110px',
    left: '-23px',
    color: '#fff',
    zIndex: 1,
    height: '40px',
    padding: '4px',
    border: `1px solid ${theme.palette.dark}`,
    boxSizing: 'border-box',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1rem',
  }),
  'div'
);
