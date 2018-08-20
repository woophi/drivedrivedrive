import { store } from 'core/application/store';
import { LocalStorageManager } from 'core/localStorageManager';
import { getTablesLSkey } from './selectors';
import { TABLES_LS_STORE_KEY } from './constants';
import { TablesState } from './types';
import { tablesDefaultState } from './reducer';

export function saveState() {
  const state = store.getState();

  const tablesState = state.admin && state.admin.tables;

  const savedColumns: TablesState = {
    ...tablesDefaultState,
    visitors: {
      ...tablesDefaultState.visitors,
      columns: tablesState.visitors.columns
    },
    sessions: {
      ...tablesDefaultState.sessions,
      columns: tablesState.sessions.columns
    }
  };

  if (savedColumns) {
    LocalStorageManager.set(TABLES_LS_STORE_KEY, getTablesLSkey(state), savedColumns);
  }
}

export function restoreState() {
  const state = store.getState();

  const savedTablesState = LocalStorageManager.get(TABLES_LS_STORE_KEY, getTablesLSkey(state));
  if (savedTablesState) {
    store.dispatch({
      type: 'admin/tables/restoreSavedState',
      payload: savedTablesState
    });
  }
}
