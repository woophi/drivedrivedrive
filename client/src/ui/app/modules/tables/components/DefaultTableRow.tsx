import * as React from 'react';
import { connect as fela, FelaRule, FelaStyles, IStyle } from 'react-fela';

export interface DefaultTableRowProps {
  style: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
  withArrow?: boolean;
  withBorder?: boolean;
}

export const DefaultTableRowComponent: React.SFC<
  DefaultTableRowProps & FelaStyles<typeof mapStylesToProps>
> = ({ children, style, onClick, selected, withArrow, withBorder, styles }) => {
  const className = 'd-flex px-2'.concat(
    withBorder ? ' border border-left-0 border-top-0 border-right-0' : '',
    withArrow ? ' with-arrow' : '',
    !!onClick ? ' list-group-item-action curp' : '',
    selected ? ' list-group-item active' : ''
  );

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
  const withArrow: IStyle = props.withArrow && {
    position: 'relative',

    '&:before': {
      content: 'F0DA',
      font: 'normal normal normal 12px/1 FontAwesome',
      position: 'absolute',
      width: 4,
      height: 4,
      top: 0,
      right: 0
      // width: 6,
      // height: 12,
      // top: 'calc(50% - 6px)',
      // right: 9,
    }
  };
  const onClick: IStyle = !!props.onClick && {
    cursor: 'pointer'
  };
  return {
    display: 'flex',
    padding: '0 0.5rem',
    ...withBorder,
    ...withArrow,
    ...onClick
  };
};

const mapStylesToProps = {
  container
};

export const DefaultTableRow = fela(mapStylesToProps)(DefaultTableRowComponent);
