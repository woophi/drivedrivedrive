import { combineEpics, Epic } from 'redux-observable';
import { State } from 'core/models/application';
import { AdminDispatch } from 'ui/admin/types';
import { ContextInfo, DataDispatch } from 'core/models/admin';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/debounceTime';
import { LOCATION_CHANGE, RouterAction } from 'react-router-redux';
import { restoreState, saveState } from './operations';

const SAVING_DEBOUNCE = 750;

const saveTablesState: Epic<AdminDispatch, State> = (action$, store) => action$
  .filter(a => a.type.indexOf('admin/tables/') === 0 && a.type !== 'admin/tables/setSearch')
  .debounceTime(SAVING_DEBOUNCE)
  .do(saveState)
  .ignoreElements();

let currentLocation = {
  companyId: null as number,
  tenantId: null as number
};

const shouldRestore = (contextInfo: any): contextInfo is ContextInfo => (
  !currentLocation.companyId ||
  !currentLocation.tenantId ||
  (contextInfo.companyId !== currentLocation.companyId &&
    contextInfo.tenantId !== currentLocation.tenantId)
);

const restoreOnContextChange: Epic<DataDispatch & { payload: { companyId: number, tenantId: number } }, State> = (action$, store) => action$
  .filter(a => (
    a.type === 'admin/data/setResult' &&
    a.name === 'contextInfo'
  ))
  .do(a => {
    if (shouldRestore(a.payload)) {
      restoreState();
      currentLocation = {
        companyId: a.payload.companyId,
        tenantId: a.payload.tenantId
      };
    }
  })
  .ignoreElements();

const restoreOnLocationChange: Epic<AdminDispatch & RouterAction, State> = (action$, store) => action$
  .filter(a => a.type === LOCATION_CHANGE)
  .do(a => {
    const spl = a.payload.pathname.split('/');
    if (
      spl.length > 1 &&
      (spl[1] !== `${currentLocation.companyId}` ||
      spl[2] !== `${currentLocation.tenantId}`)
    ) {
      restoreState();
      console.error('restored on ', spl[1], spl[2]);
      currentLocation.companyId = spl[1];
      currentLocation.tenantId = spl[2];
    }
  })
  .ignoreElements();

export const tablesEpic = combineEpics(
  saveTablesState,
  restoreOnContextChange,
  restoreOnLocationChange
);

export default tablesEpic;
