import { createSelector, Selector } from 'reselect';
import { TablesState } from './types';
import { AppState } from 'core/models/app';
import * as isEmpty from 'ramda/src/isEmpty';
import { filterByName } from 'ui/shared/transforms';
import { filtersObjectParser } from './filters';
import { returntypeof } from 'react-redux-typescript';
import { SortDirection } from 'react-virtualized';
import * as prop from 'ramda/src/prop';
import * as propIs from 'ramda/src/propIs';
import * as ascend from 'ramda/src/ascend';
import * as descend from 'ramda/src/descend';
import * as sortWith from 'ramda/src/sortWith';
import * as compose from 'ramda/src/compose';
import * as toLower from 'ramda/src/toLower';
import { Morphism, Ordered } from 'ramda';

export const getTableByName = (tableName: keyof TablesState) => (
  state: AppState
) => state.ui.tables[tableName];

export const createTableSelectors = <T>(
  tableName: keyof TablesState,
  getData: Selector<AppState, T[]>,
  searchFields?: (keyof T)[]
) => {
  const getTable = getTableByName(tableName);
  const getFilters = createSelector(getTable, table => table.filters);

  const getSearchQuery = createSelector(getTable, table => table.search);

  const getSortBy = createSelector(getTable, table => table.sortBy);

  const getSortDirection = createSelector(
    getTable,
    table => table.sortDirection
  );

  const getColumnWidths = createSelector(getTable, table => table.columnWidth);

  const getFilteredList = createSelector(
    getData,
    getFilters,
    (list, filters) => list ?
      ((isEmpty(filters) ? list : list.filter(row => filtersObjectParser(row, filters)))) : [] as T[]
  );

  const getSearchedList = createSelector(
    getFilteredList,
    getSearchQuery,
    (list, q) =>
      q && searchFields
        ? list.filter(row =>
            filterByName(searchFields.map(f => row[f]).join(), ...q.split(' '))
          )
        : list
  );

  const getSortedList = createSelector(
    getSortBy,
    getSortDirection,
    getSearchedList,
    (sortBy, sortDirection, list) => {
      if ((!sortBy || !sortDirection) && list.length) {
        return list;
      }

      if (list.length) {
        const normalized = propIs(String, sortBy, list[0])
          ? compose((a: any) => a
            ? toLower(a)
            : '', prop(sortBy))
          : prop(sortBy) as Morphism<{}, Ordered>;

        const sortAsc = sortWith([
          ascend(normalized),
          // ascend(prop('userId'))
        ]);
        const sortDesc = sortWith([
          descend(normalized),
          // ascend(prop('userId'))
        ]);
        return sortDirection === SortDirection.ASC
          ? (sortAsc(list) as T[])
          : (sortDesc(list) as T[]);
      }

      return [];
    }
  );

  return {
    getFilters,
    getSearchQuery,
    getSortBy,
    getSortDirection,
    getSortedList,
    getColumnWidths
  };
};

const t = returntypeof(createTableSelectors);
export type TableSelectors = typeof t;
