import { AppState } from 'core/models/app';
import { combineEpics, Epic } from 'redux-observable';
import { SubStatus } from 'core/models/api';
import { changeUrl } from 'ui/app/operations';
import { saveUnauthPath } from 'ui/app/modules/me/operations';

const checkRequestStatus: Epic<any, AppState> = (action$, store) => action$
  .filter(d => d.type === 'api/data/setResult' && d.name === 'subscribeState')
  .do((dispatch: any) => {
    const payload = dispatch.payload;
    const currentPath = store.getState().router.location.pathname;

    if (payload.SubStatus === SubStatus.UNAUTHORIZED) {
      saveUnauthPath(currentPath);
      changeUrl('/signin');
    }
  })
  .ignoreElements();

export const emailsSubEpics = combineEpics(
  checkRequestStatus
);
