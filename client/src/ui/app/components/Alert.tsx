import * as React from 'react';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import Paper from 'material-ui/Paper';

type Props = {
  mssg: string;
  type: 'info' | 'warning' | 'error' | 'success'
};

type FelaProps = FelaStyles<typeof mapStylesToProps>;

const AlertComponent: React.SFC<Props & FelaProps> = props => {
  const color = () => {
    switch (props.type) {
      case 'error':
        return '#721c24';
      case 'success':
        return '#155724';
      case 'warning':
        return '#856404';
      case 'info':
        return '#1b1e21';
      default:
        return '#1b1e21';
    }
  };

  const backgroundColor = () => {
    switch (props.type) {
      case 'error':
        return '#f8d7da';
      case 'success':
        return '#d4edda';
      case 'warning':
        return '#fff3cd';
      case 'info':
        return '#d6d8d9';
      default:
        return '#d6d8d9';
    }
  };

  const borderColor = () => {
    switch (props.type) {
      case 'error':
        return '#f5c6cb';
      case 'success':
        return '#c3e6cb';
      case 'warning':
        return '#ffeeba';
      case 'info':
        return '#c6c8ca';
      default:
        return '#c6c8ca';
    }
  };
  const style: React.CSSProperties = {
    color: color(),
    backgroundColor: backgroundColor(),
    borderColor: borderColor()
  };
  return (
    <Paper
      className={props.styles.container}
      zDepth={2}
      style={style}
    >
      {props.mssg}
    </Paper>
  );
};

const container: FelaRule<Props> = () => ({
  width: '100%',
  height: 'auto',
  padding: '1rem .5rem',
  border: '1px solid transparent',
  borderRadius: '.25rem',
  boxSizing: 'border-box',
  minHeight: '3rem'
});

const mapStylesToProps = {
  container
};

const Alert = FelaConnect(mapStylesToProps)(AlertComponent);

export { Alert };
