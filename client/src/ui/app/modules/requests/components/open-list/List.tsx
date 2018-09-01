import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getOpenRequests } from '../../operations';
import { getOpenRequestsData } from '../../selectors';
import { OpenRequest } from 'core/models/api';
import { changeUrl } from 'ui/app/operations';

const TC = composeTable<OpenRequest>({
  model: [{
    label: 'Из',
    dataKey: 'from'
  }, {
    label: 'В',
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
  onRowClick: ({ event, rowData }) => {
    // if ((event.target as HTMLElement).nodeName === 'I') { return; }
    changeUrl(`/request/${rowData.id}`);
  }
});

const OpenRequestsConnectedList = tableConnect({
  dataName: 'openRequests',
  tableName: 'openRequests'
})(TC);

const OpenRequestsContainer = Loader({
  loadData: getOpenRequests,
  dataSelector: getOpenRequestsData,
  component: OpenRequestsConnectedList as any
});

export const OpenRequestsList: React.SFC = () => {
  return <OpenRequestsContainer />;
};
