import * as React from 'react';
import { connect as fela, FelaRule, FelaStyles, IStyle } from 'react-fela';

export interface DefaultTableRowProps {
  style: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
  withArrow?: boolean;
  withBorder?: boolean;
}

const DefaultTableRowComponent: React.SFC<
  DefaultTableRowProps & FelaStyles<typeof mapStylesToProps>
> = ({ children, style, onClick, styles }) => {

  return (
    <div className={styles.container} style={style} onClick={onClick}>
      {children}
    </div>
  );
};

const container: FelaRule<DefaultTableRowProps> = props => {
  const withBorder: IStyle = props.withBorder && {
    border: `1px solid ${props.theme.palette.line}`,
    borderTop: 0,
    borderBottom: 0,
    borderLeft: 0
  };
  const onClick: IStyle = !!props.onClick && {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: props.theme.palette.light
    }
  };
  return {
    display: 'flex',
    padding: '0 0.5rem',
    ...withBorder,
    ...onClick
  };
};

const mapStylesToProps = {
  container
};

export const DefaultTableRow = fela(mapStylesToProps)(DefaultTableRowComponent);
