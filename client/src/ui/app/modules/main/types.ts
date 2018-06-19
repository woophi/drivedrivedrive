export type GuestState = {
  guestSubmitForm: boolean;
  handlePoint: HandlePoints
};

export const enum HandlePoints {
  p_d = 'Praha-dresden',
  p_kv = 'Praha-KarlovyVary',
  p_v = 'Praha-vena',
  none = ''
}

export type GuestDispatch =
  | { type: 'guest/changeFormState', payload: boolean }
  | HandlePointAction
;

export type HandlePointAction = { type: 'guest/handlePoint', payload: HandlePoints };
