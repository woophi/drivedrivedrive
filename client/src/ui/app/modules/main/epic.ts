import { AppState } from 'core/models/app';
import { Epic, combineEpics } from 'redux-observable';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { HandlePoints } from './types';


const checkGuestClickShit: Epic<any, AppState> = (action$, store) => action$
  .filter(d => d.type === 'guest/handlePoint')
  .do((dispatch) => {
    const payload = dispatch.payload;
    const metaFrom = {
      form: "newRequest",
      field: "from",
      touch: false,
      persistentSubmitErrors: false
    };
    const metaTo = {
      form: "newRequest",
      field: "to",
      touch: false,
      persistentSubmitErrors: false
    };

    store.dispatch({ type: '@@redux-form/CHANGE', meta: metaFrom, payload: 'Прага' });

    if (payload === HandlePoints.p_d) {

      store.dispatch({ type: '@@redux-form/CHANGE', meta: metaTo, payload: 'Дрезден' });
    } else if (payload === HandlePoints.p_kv) {

      store.dispatch({ type: '@@redux-form/CHANGE', meta: metaTo, payload: 'Карловы Вары' })
    } else if (payload === HandlePoints.p_v) {

      store.dispatch({ type: '@@redux-form/CHANGE', meta: metaTo, payload: 'Вена' })
    }
    const nameInput = document.getElementById('guest_name_input');
    if (nameInput) {
      nameInput.focus();
    }
  })
  .ignoreElements();

export default combineEpics(
  checkGuestClickShit
);
