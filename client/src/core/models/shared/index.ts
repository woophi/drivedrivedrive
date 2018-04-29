import * as models from 'core/models';

export type SharedState = {
  localAppState: models.LocalAppState
};


export type SharedDispatch =
  | { type: 'appInit', isMobile: boolean }
;
