import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getInProcessRequests } from '../../operations';
import { getInProcessRequestsData } from '../../selectors';
import { TableRequest } from 'core/models/api';
import { changeUrl } from 'ui/app/operations';

const TC = composeTable<TableRequest>({
  model: [{
    label: 'app::common:from',
    dataKey: 'from'
  }, {
    label: 'app::common:to',
    dataKey: 'to'
  }, {
    label: 'app::common:date',
    dataKey: 'date'
  }, {
    label: 'app::common:to',
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

const InProcessRequestsConnectedList = tableConnect({
  dataName: 'inProcessRequests',
  tableName: 'inProcessRequests'
})(TC);

const InProcessRequestsContainer = Loader({
  loadData: getInProcessRequests,
  dataSelector: getInProcessRequestsData,
  component: InProcessRequestsConnectedList
});

export const InProcessRequestsList: React.SFC = () => {
  return <InProcessRequestsContainer />;
};
