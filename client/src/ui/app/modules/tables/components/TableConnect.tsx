import * as React from 'react';
import { ApplicationState } from 'core/models/application';
import { connect as ReduxConnect } from 'react-redux';
import { DataState } from 'core/models/admin';
import { bindActionCreators } from 'redux';
import { createTableActions, TableActions } from '../actions';
import { createTableSelectors } from '../selectors';
import { ComposedTableProps, TablesState } from '../types';

interface TableConnectProps<T> {
  dataSelector?: (state: ApplicationState) => T[] | string[];
  dataName?: keyof DataState;
  tableName: keyof TablesState;
  searchFields?: (keyof T)[] | string[];
  filteredOnServer?: boolean;
  selectedRowIdSelector?: (state: ApplicationState) => any;
}

export function tableConnect<T>({ tableName, dataName, dataSelector, searchFields, filteredOnServer, selectedRowIdSelector }: TableConnectProps<T>) {
  return (component: React.ComponentClass<ComposedTableProps<T>> | React.StatelessComponent<ComposedTableProps<T>>) => {
    const tableDataSelector = dataSelector || ((state: ApplicationState) => state.admin && state.admin.data[dataName].result);

    const tableActions = createTableActions(tableName);

    const tableSelectors = createTableSelectors(tableName, tableDataSelector as () => any[], searchFields);

    const mapStateToProps = (state: ApplicationState) => ({
      filters: tableSelectors.getFilters(state),
      searchQuery: tableSelectors.getSearchQuery(state),
      sortBy: tableSelectors.getSortBy(state),
      sortDirection: tableSelectors.getSortDirection(state),
      list: filteredOnServer ? tableDataSelector(state) : tableSelectors.getSortedList(state) as T[],
      columnWidths: tableSelectors.getColumnWidths(state),
      selectedRowId: selectedRowIdSelector ? selectedRowIdSelector(state) : null
    });

    const mapDispatchToProps = (dispatch: any) => bindActionCreators(tableActions, dispatch) as any; // TODO: upgrade react-redux & d.ts

    return ReduxConnect(mapStateToProps, mapDispatchToProps)(component);
  };
}
