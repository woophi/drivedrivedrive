export interface StateUnsub {
  SubStatus: SubStatus;
}

export const enum SubStatus {
  INVALID = 0,
  DONE = 1,
  PROCESS = 2,
  UNAUTHORIZED = -1,
  FORBIDDEN = -2
}
