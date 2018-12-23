import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getPendingRequests } from '../operations';
import { getPendingRequestsData } from '../selectors';
import { TableRequest } from 'core/models/api';
import { changeUrl } from 'ui/app/operations';

const TC = composeTable<TableRequest>({
  model: [{
    label: 'Пункт отправления',
    dataKey: 'from'
  }, {
    label: 'Пункт прибытия',
    dataKey: 'to'
  }, {
    label: 'Дата',
    dataKey: 'date'
  }, {
    label: 'Время',
    dataKey: 'time'
  }],
  showRowDividers: true,
  showRowArrows: true,
  showHeaderDividers: true,
  showHeaderSortControls: true,
  onRowClick: ({ rowData }) => {
    changeUrl(`/requests/edit/${rowData.id}`);
  }
});

const PendingRequestsConnectedList = tableConnect({
  dataName: 'pendingRequests',
  tableName: 'pendingRequests'
})(TC);

const PendingRequestsContainer = Loader({
  loadData: getPendingRequests,
  dataSelector: getPendingRequestsData,
  component: PendingRequestsConnectedList as any
});

export const PendingRequestsList: React.SFC = () => {
  return <PendingRequestsContainer />;
};
