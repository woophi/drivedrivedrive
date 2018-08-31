import * as React from 'react';
import { SortDirection, SortDirectionType } from 'react-virtualized';
import { createComponent } from 'react-fela';

const IconArrow = createComponent(
  () => ({
    margin: 'auto 0 auto auto'
  }),
  'i',
  ['className']
);
export const SortArrow: React.SFC<{
  sortDirection: SortDirectionType | null;
}> = ({ sortDirection }) => {
  const [isAsc, isDesc] = [
    sortDirection === SortDirection.ASC,
    sortDirection === SortDirection.DESC
  ];
  const iconClassName = `fa-long-arrow-alt${
    isAsc ? '-down' : isDesc ? '-up' : ''
  } ${isAsc ? 'text-muted' : ''}`;

  return <IconArrow className={`fas ${iconClassName}`} />;
};
