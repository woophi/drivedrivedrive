import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getActiveRequests } from '../../operations';
import { getActiveRequestsData } from '../../selectors';
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
    // changeUrl(`/request/${rowData.id}`);
  }
});

const ActiveRequestsConnectedList = tableConnect({
  dataName: 'activeRequests',
  tableName: 'activeRequests'
})(TC);

const ActiveRequestsContainer = Loader({
  loadData: getActiveRequests,
  dataSelector: getActiveRequestsData,
  component: ActiveRequestsConnectedList
});

export const ActiveRequestsList: React.SFC = () => {
  return <ActiveRequestsContainer />;
};
