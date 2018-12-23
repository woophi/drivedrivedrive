import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getRequests } from '../operations';
import { getRequestsData } from '../selectors';
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

const RequestsConnectedList = tableConnect({
  dataName: 'allRequests',
  tableName: 'allRequests'
})(TC);

const RequestsContainer = Loader({
  loadData: getRequests,
  dataSelector: getRequestsData,
  component: RequestsConnectedList as any
});

export const RequestsList: React.SFC = () => {
  return <RequestsContainer />;
};
