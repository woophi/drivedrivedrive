import { AppDispatch, AppState } from 'core/models/app';
import { combineEpics, Epic } from 'redux-observable';
import { HandlePointAction, HandlePoints } from './types';

const checkGuestClickShit: Epic<AppDispatch, AppState> = (action$, store) => action$
  .filter(d => d.type === 'guest/handlePoint')
  .do((dispatch: HandlePointAction) => {
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

      store.dispatch({ type: '@@redux-form/CHANGE', meta: metaTo, payload: 'Карловы Вары' });
    } else if (payload === HandlePoints.p_v) {

      store.dispatch({ type: '@@redux-form/CHANGE', meta: metaTo, payload: 'Вена' });
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
