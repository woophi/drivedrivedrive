import { PureComponent } from 'react';
import { Grid, GridProps, SortDirectionType, TableCellProps } from 'react-virtualized';
import { AppState } from 'core/models/app';

export type EnumFilter = (string | number | boolean)[];
export type NumberFilter = { min?: number; max?: number };
export type DateFilter = { min?: string; max?: string };
export type SubstringFilter = string;
export type TimeSpanFilter = { min?: string; max?: string };

export type FilterTypes =
  | EnumFilter
  | NumberFilter
  | DateFilter
  | SubstringFilter
  | TimeSpanFilter;

/**
 * ONE OF enum/date/number/substring/etc.
 */
export type TableFilterOptions = {
  filterObjectProp?: string | number;
  isNull?: boolean;
  // This is ONE OF, but for typechecking written with '?'
  enum?: EnumFilter;
  date?: DateFilter;
  number?: NumberFilter;
  substring?: SubstringFilter;
  timespan?: TimeSpanFilter;
};

export type FiltersState = {
  [key: string]: TableFilterOptions;
};

export type TableState = {
  search: string;
  sortBy: string;
  sortDirection: SortDirectionType;
  filters: FiltersState;
  columnWidth: { [dataKey: string]: number };
  columns?: any[];
};

export type TableStateWithColumns<T> = TableState & {
  columns: (keyof T)[];
};

export type TablesState = {
  openRequests: TableState,
  activeRequests: TableState,
  historyRequests: TableState,
  inProcessRequests: TableState,
  allRequests: TableState,
};

export type FilterChangeDispatch = {
  type: 'admin/tables/setFilter';
  name: keyof TablesState;
  filter: string;
  payload: TableFilterOptions;
};

export type AllFiltersChangeDispatch = {
  type: 'admin/tables/setFilters';
  name: keyof TablesState;
  payload: FiltersState;
};

export type TablesDispatch =
  | { type: 'admin/tables/restoreSavedState'; payload: TablesState }
  | {
      type: 'admin/tables/setColumns';
      name: keyof TablesState;
      payload: string[];
    }
  | { type: 'admin/tables/setSearch'; name: keyof TablesState; payload: string }
  | {
      type: 'admin/tables/setSort';
      name: keyof TablesState;
      payload: { sortBy: string; sortDirection: SortDirectionType };
    }
  | { type: 'admin/tables/resetFilters'; name: keyof TablesState }
  | {
      type: 'admin/tables/columnWidth';
      name: keyof TablesState;
      dataKey: string | number;
      payload: number;
    }
  | FilterChangeDispatch
  | AllFiltersChangeDispatch;

export type EnumFilterModel = {
  label: string | number;
  value: string | number | boolean;
}[];

export type EnumFilterOption = {
  enum?: EnumFilterModel;
  enumSelector?: (state: AppState) => EnumFilterModel;
  searchable?: boolean;
};

export type FilterModel =
  | 'substring'
  | 'date'
  | 'timespan'
  | 'number'
  | 'browser'
  | 'os'
  | EnumFilterOption;

export type ColumnModel<T = {}, TP = {}, RP = {}> = {
  dataKey: Extract<keyof T, string>;
  label?: string;
  title?: boolean | ((cellData: any) => string);
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  flexGrow?: number;
  flexShrink?: number;
  disableSort?: boolean;
  filterType?: FilterModel | ((props: TP) => FilterModel);
  filterNullable?: boolean;
  filterObjectProp?: string | number;
  cellRenderer?: CellRenderer<T, TP, RP>;
};

interface ExtendedTableCellProps<T> extends TableCellProps {
  cellData: T[keyof T];
}

export type CellRenderer<T = {}, TP = {}, RP = {}> = (props: CellRendererProps<T, TP, RP>) => React.ReactNode;

export type CellRendererProps<T = {}, TP = {}, RP = {}> = {
  dataKey: Extract<keyof T, string>;
  rowData: T;
} & ExtendedTableCellProps<T> & TP & RP;

export type OnRowClick<T> = (
  props: {
    rowData: T;
    index: number;
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>;
  }
) => void;

export type TableModel<T = {}, P = {}, RP = {}> = ColumnModel<T, P, RP>[];
export interface TableConfig<T = {}, TP = {}, RP = {}> {
  model: TableModel<T, TP, RP> | ((tableProps: TP) => TableModel<T, TP, RP>);

  showRowArrows?: boolean;
  showRowDividers?: boolean;
  showHeaderDividers?: boolean;
  showHeaderSortControls?: boolean;
  hideHeader?: boolean;
  mainGridProps?: Partial<GridProps>;

  onRowClick?: OnRowClick<T>;
  onFiltersUpdated?: () => void;
  selectedRowGetter?: (rowData: T) => any;
  registerChild?: (ref: Grid) => void;
}

export type ISetSort = (
  params: { sortBy: string; sortDirection: SortDirectionType }
) => void;
export type ISetSearch = (payload: string) => void;
export type ISetFilter = (
  fieldName: string | number,
  params: TableFilterOptions
) => void;
export type ISetColumnWidth = (column: string | number, width: number) => void;

export type IColumnWidths = {
  [dataKey: string]: number;
};

export interface SortAndFilterState {
  sortBy: string;
  sortDirection: SortDirectionType;
  searchQuery?: string;
  filters: FiltersState;
  setSort: ISetSort;
  setSearch?: ISetSearch;
  setFilter: ISetFilter;
  setColumnWidth?: ISetColumnWidth;
  selectedRowId?: number | string;
  columnWidths: IColumnWidths;
}

export interface TableProps<T> {
  list: T[];
  config: TableConfig<T>;
  tableState: SortAndFilterState;
}

export interface ComposedTableProps<T> extends SortAndFilterState {
  list: T[];
}

export class ParentGrid extends PureComponent<GridProps & TableProps<any>> {}
