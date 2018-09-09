import { AppDispatch, AppState } from 'core/models/app';
import { validateEmail } from 'core/app/request';
import { combineEpics, Epic } from 'redux-observable';
import { FormAction } from 'redux-form';
import { HandlePointAction, HandlePoints } from './types';
import { triggerCheckEmail } from './operations';

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

const checkGuestEmail: Epic<AppDispatch, AppState> = (action$, store) => action$
  .filter((d: any) => d.type === '@@redux-form/CHANGE' && d.meta.field === 'email')
  .debounceTime(3000)
  .do(async (dispatch: FormAction) => {
    const payload = dispatch.payload;
    const meta = dispatch.meta;
    const state = store.getState();
    if (
      meta.form === 'newRequest' &&
      state.form.newRequest &&
      !state.form.newRequest.syncErrors.email &&
      state.form.newRequest.fields &&
      state.form.newRequest.fields.email.visited &&
      !!payload
    ) {
      const validation = await validateEmail(payload);
      triggerCheckEmail(validation);
    }
  });

export const guestEpic =  combineEpics(
  checkGuestClickShit,
  checkGuestEmail
);
