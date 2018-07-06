export type CookieState = {
  open: boolean;
  confirmed: boolean;
};

export type CookieDispatch =
  | { type: 'cookie/stateModal'; payload: boolean }
  | { type: 'cookie/confirmed'; payload: boolean }
;
