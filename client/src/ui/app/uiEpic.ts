import { combineEpics, Epic } from 'redux-observable';

import RequestEpic from 'ui/app/modules/request/epic';

export default combineEpics(
  RequestEpic
);
