import * as React from 'react';
import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { DataState } from 'core/models/api';
import { bindActionCreators } from 'redux';
import { createTableActions } from '../actions';
import { createTableSelectors } from '../selectors';
import { TablesState } from '../types';

type DataSelector<T> = (state: AppState) => T[];

interface TableConnectProps<T> {
  dataSelector?: DataSelector<T>;
  dataName?: keyof DataState;
  tableName: keyof TablesState;
  searchFields?: (keyof T)[];
  selectedRowIdSelector?: (state: AppState) => any;
}

export function tableConnect<T>(props: TableConnectProps<T>) {
  const {
    tableName, dataName, dataSelector, searchFields, selectedRowIdSelector
  } = props;

  return (component: React.ComponentType) => {
    const defaultDataSelector: DataSelector<T> = state => state.ui.api[dataName].result as T[];
    const tableDataSelector = dataSelector || defaultDataSelector;
    const tableActions = createTableActions(tableName);
    const tableSelectors = createTableSelectors<T>(tableName, tableDataSelector, searchFields);

    const mapStateToProps = (state: AppState) => {
      return {
        sortBy: tableSelectors.getSortBy(state),
        filters: tableSelectors.getFilters(state),
        searchQuery: tableSelectors.getSearchQuery(state),
        list: tableSelectors.getSortedList(state),
        columnWidths: tableSelectors.getColumnWidths(state),
        sortDirection: tableSelectors.getSortDirection(state),
        selectedRowId: selectedRowIdSelector ? selectedRowIdSelector(state) : null,
      };
    };

    const mapDispatchToProps = (dispatch: any) => bindActionCreators(tableActions, dispatch) as any;

    return ReduxConnect(mapStateToProps, mapDispatchToProps)(component);
  };
}
