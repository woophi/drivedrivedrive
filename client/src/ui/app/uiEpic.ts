import { combineEpics, Epic } from 'redux-observable';

import RequestEpic from 'ui/app/modules/request/epic';
import MainEpic from 'ui/app/modules/main/epic';

export default combineEpics(
  RequestEpic,
  MainEpic
);
