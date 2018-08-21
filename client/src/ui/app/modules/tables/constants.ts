import { SortDirection, SortDirectionType } from 'react-virtualized';
import { driveTheme } from 'ui/shared/driveUI';

export const HEADER_GRID_STYLE: React.CSSProperties = {
  overflowX: 'hidden',
  overflowY: 'hidden'
};

export const MAIN_GRID_STYLE: any = {
  overflowX: false,
  overflowY: false,
  fontSize: 13
};

export const ROW_HEIGHT = 32;
export const DEFAULT_COLUMN_MIN_WIDTH = 90;
export const OVERSCAN_ROW_COUNT = 5;

export const RESIZER_LINE_STYLE = `1px dashed ${driveTheme.palette.grayBg}`;
export const RESIZE_MIN_WIDTH = 75;

/**
 * helpers
 */
export const px = (value?: number) => value && `${value}px`;

export const getNextSortDirection = (currentSortDir: SortDirectionType | null) =>
  !currentSortDir ? SortDirection.ASC :
  currentSortDir === SortDirection.ASC ? SortDirection.DESC :
  null;
