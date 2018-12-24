import { match } from 'react-router';

export type SectionChildProps<T = { id: string }> = {
  match?: match<T>;
};
