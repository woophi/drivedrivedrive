import * as React from 'react';
import { composeTable, tableConnect } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import { getRequests } from '../operations';
import { getRequestsData } from '../selectors';
import { TableRequest } from 'core/models/api';
import { changeUrl } from 'ui/app/operations';
import { Paper } from 'material-ui';

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
    changeUrl(`/adm/requests/edit/request/${rowData.id}`);
  }
});

const RequestsConnectedList = tableConnect({
  dataName: 'allRequests',
  tableName: 'allRequests'
})(TC);

const RequestsContainer = Loader({
  loadData: getRequests,
  dataSelector: getRequestsData,
  component: RequestsConnectedList
});

export const RequestsList: React.SFC = () => {
  return (
    <Paper zDepth={2} style={{ height: 'calc(100% - 140px)', margin: '0 1rem 1rem'}}>
      <RequestsContainer />
    </Paper>
  );
};
