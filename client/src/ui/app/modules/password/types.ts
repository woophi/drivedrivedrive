export type PasswordState = {
  key: {
    status: boolean;
    message: string;
  }
};

export type PayloadKey = {
  status: boolean;
  message: string;
}

export type PasswordDispatch =
  | { type: 'ui/getKey', payload: PayloadKey }
;
