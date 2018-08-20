import * as React from 'react';

export interface DefaultTableRowProps {
  style: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
  withArrow?: boolean;
  withBorder?: boolean;
}

export const DefaultTableRow: React.SFC<DefaultTableRowProps> = ({ children, style, onClick, selected, withArrow, withBorder }) => {
  const className = 'd-flex px-2'.concat(
    withBorder ? ' border border-left-0 border-top-0 border-right-0' : '',
    withArrow ? ' with-arrow' : '',
    !!onClick ? ' list-group-item-action curp' : '',
    selected ? ' list-group-item active' : ''
  );

  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
