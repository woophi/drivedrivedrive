import * as React from 'react';
import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { DataState } from 'core/models/api';
import { bindActionCreators } from 'redux';
import { createTableActions } from '../actions';
import { createTableSelectors } from '../selectors';
import { ComposedTableProps, TablesState } from '../types';

interface TableConnectProps<T> {
  dataSelector?: (state: AppState) => T[] | string[];
  dataName?: keyof DataState;
  tableName: keyof TablesState;
  searchFields?: (keyof T)[] | string[];
  filteredOnServer?: boolean;
  selectedRowIdSelector?: (state: AppState) => any;
}

export function tableConnect<T>({ tableName, dataName, dataSelector, searchFields, filteredOnServer, selectedRowIdSelector }: TableConnectProps<T>) {
  return (component: React.ComponentClass<ComposedTableProps<T>> | React.StatelessComponent<ComposedTableProps<T>>) => {
    const tableDataSelector = dataSelector || ((state: AppState) => state.ui.api && state.ui.api[dataName].result);
    const tableActions = createTableActions(tableName);

    const tableSelectors = createTableSelectors(tableName, tableDataSelector as () => any[], searchFields);

    const mapStateToProps = (state: AppState) => {

      return ({
        filters: tableSelectors.getFilters(state),
        searchQuery: tableSelectors.getSearchQuery(state),
        sortBy: tableSelectors.getSortBy(state),
        sortDirection: tableSelectors.getSortDirection(state),
        list: filteredOnServer ? tableDataSelector(state) : tableSelectors.getSortedList(state) as T[],
        columnWidths: tableSelectors.getColumnWidths(state),
        selectedRowId: selectedRowIdSelector ? selectedRowIdSelector(state) : null
      });
    }

    const mapDispatchToProps = (dispatch: any) => bindActionCreators(tableActions, dispatch) as any;

    return ReduxConnect(mapStateToProps, mapDispatchToProps)(component);
  };
}
