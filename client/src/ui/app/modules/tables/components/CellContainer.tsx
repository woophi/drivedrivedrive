import * as React from 'react';
import { DEFAULT_COLUMN_MIN_WIDTH, px } from '../constants';

export interface CellContainerProps {
  title?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flexGrow?: number;
  flexShrink?: number;
  cellRef?: React.RefObject<HTMLDivElement>;
}

export class CellContainer extends React.PureComponent<CellContainerProps> {
  render() {
    const {
      title,
      width,
      minWidth,
      maxWidth,
      flexGrow = 1,
      flexShrink = 1,
      children,
      cellRef
    } = this.props;

    const style: React.CSSProperties = {
      flex: `${flexGrow} ${flexShrink} 0`,
      display: 'flex',
      alignItems: 'center',
      minWidth: px(width || minWidth || DEFAULT_COLUMN_MIN_WIDTH),
      maxWidth: px(width || maxWidth),
      willChange: 'transform',
      boxSizing: 'border-box'
    };

    return (
      <div style={style} title={title} ref={cellRef}>
        {children}
      </div>
    );
  }
}
