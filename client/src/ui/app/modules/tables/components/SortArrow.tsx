import * as React from 'react';
import { SortDirection, SortDirectionType } from 'react-virtualized';

export const SortArrow: React.SFC<{ sortDirection: SortDirectionType | null }> = ({ sortDirection }) => {
  const [ isAsc, isDesc ] = [ sortDirection === SortDirection.ASC, sortDirection === SortDirection.DESC ];
  const iconClassName = `fa-long-arrow${isAsc ? '-down' : isDesc ? '-up' : ''} ${isAsc ? 'text-muted' : ''}`;

  return (
    <i className={`fa ${iconClassName} my-auto ml-auto`} />
  );
};
