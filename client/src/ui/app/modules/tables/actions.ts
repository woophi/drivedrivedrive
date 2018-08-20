import { SortDirectionType } from 'react-virtualized';
import { returntypeof } from 'react-redux-typescript';
import { TableFilterOptions, TablesDispatch, TablesState } from './types';

/**
 * Create action creators to specific table in state (admin.tables)
 * @param name table name
 */
export const createTableActions = (name: keyof TablesState) => {
  const setFilter = (fieldName: string, payload: TableFilterOptions): TablesDispatch => ({ type: 'admin/tables/setFilter', name, filter: fieldName, payload });
  const setSearch = (payload: string): TablesDispatch => ({ type: 'admin/tables/setSearch', name, payload });
  const setSort = (payload: { sortBy: string, sortDirection: SortDirectionType }): TablesDispatch => ({ type: 'admin/tables/setSort', name, payload });
  const setColumnWidth = (dataKey: string | number, payload: number): TablesDispatch => ({ type: 'admin/tables/columnWidth', name, dataKey, payload });

  return { setFilter, setSearch, setSort, setColumnWidth };
};

const t = returntypeof(createTableActions);
export type TableActions = typeof t;
