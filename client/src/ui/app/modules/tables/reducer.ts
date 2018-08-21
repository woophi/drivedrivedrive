import { SortDirection } from 'react-virtualized';
import { TablesDispatch, TablesState, TableState } from './types';

const tableDefaultState: TableState = {
  search: '',
  sortBy: '',
  sortDirection: SortDirection.ASC,
  filters: { },
  columnWidth: { }
};

export const tablesDefaultState: TablesState = {
  openRequests: {
    ...tableDefaultState,
    sortBy: 'from',
  }
};

export const reducer = (state = tablesDefaultState, dispatch: TablesDispatch): TablesState => {
  switch (dispatch.type) {
    case 'admin/tables/restoreSavedState':
      return {
        ...state,
        ...dispatch.payload
      };

    case 'admin/tables/setSearch':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          search: dispatch.payload
        }
      };

    case 'admin/tables/setColumns':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          columns: dispatch.payload
        }
      };

    case 'admin/tables/setSort':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          ...dispatch.payload
        }
      };

    case 'admin/tables/setFilter':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          filters: {
            ...state[dispatch.name].filters,
            [dispatch.filter]: dispatch.payload
          }
        }
      };

    case 'admin/tables/setFilters':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          filters: dispatch.payload
        }
      };

    case 'admin/tables/resetFilters':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          filters: { }
        }
      };

    case 'admin/tables/columnWidth':
      return {
        ...state,
        [dispatch.name]: {
          ...state[dispatch.name],
          columnWidth: {
            ...state[dispatch.name].columnWidth,
            [dispatch.dataKey]: dispatch.payload
          }
        }
      };

    default:
      return state;
  }
};
