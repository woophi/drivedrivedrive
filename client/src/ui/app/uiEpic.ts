import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';

import RequestEpic from 'ui/app/modules/request/epic';
import { guestEpic } from 'ui/app/modules/main/epic';
import { emailsSubEpics } from 'ui/app/modules/emailsSub/epic';

export const applicationEpic = combineEpics(
  guestEpic,
  RequestEpic,
  emailsSubEpics
);
