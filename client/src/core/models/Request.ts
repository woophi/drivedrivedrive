export interface RequestInfo {
  name: string;
  email: string;
  count: number;
  from: string;
  to: string;
  date: string;
  time: string;
  gdpr?: string;
  comment?: string;
  phone?: string;
}

export interface UpdateRequestInfo extends RequestInfo {
  hash: string;
}
