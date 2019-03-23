export interface TableRequest {
  from: string;
  to: string;
  date: string;
  time: string;
  id: string;
  approved?: boolean;
  created?: string;
}
