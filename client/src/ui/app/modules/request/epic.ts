import { AppState } from 'core/models/app';
import { Epic, combineEpics } from 'redux-observable';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import { Rstatus } from 'core/models/api';
import { changeUrl } from 'ui/app/operations';
import { saveUnauthPath } from 'ui/app/modules/me/operations';


const checkRequestStatus: Epic<any, AppState> = (action$, store) => action$
  .filter(d => d.type === 'api/data/setResult' && d.name === 'requsetState')
  .do((dispatch) => {
    const payload = dispatch.payload;
    const currentPath = store.getState().router.location.pathname;

    if (payload.Rstatus === Rstatus.UNAUTHORIZED) {
      saveUnauthPath(currentPath);
      changeUrl('/signin');
    } else if (payload.Rstatus === Rstatus.FORBIDDEN) {
      changeUrl('/');
    }
  })
  .ignoreElements();

export default combineEpics(
  checkRequestStatus
);
