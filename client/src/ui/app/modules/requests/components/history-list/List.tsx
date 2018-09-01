import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getHistoryRequests } from '../../operations';
import { getHistoryRequestsData } from '../../selectors';
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

const HistoryRequestsConnectedList = tableConnect({
  dataName: 'historyRequests',
  tableName: 'historyRequests'
})(TC);

const HistoryRequestsContainer = Loader({
  loadData: getHistoryRequests,
  dataSelector: getHistoryRequestsData,
  component: HistoryRequestsConnectedList as any
});

export const HistoryRequestsList: React.SFC = () => {
  return <HistoryRequestsContainer />;
};
