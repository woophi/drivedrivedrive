import * as React from 'react';
import { composeTable, tableConnect, TableMargin } from 'ui/app/modules/tables';
import Loader from 'ui/app/components/loader';
import * as operations from '../../operations';
import { getOpenRequestsData } from '../../selectors';
import { OpenRequest } from 'core/models/api';

const TC = composeTable<OpenRequest>({
  model: [{
    label: 'Из',
    dataKey: 'from'
  }, {
    label: 'В',
    dataKey: 'to'
  }],
  showRowDividers: true,
  showRowArrows: true,
  // onRowClick: ({ event, rowData }) => {
  //   if ((event.target as HTMLElement).nodeName === 'I') { return; }
  //   changeUrl(`/settings/application/api-keys/edit/${rowData.id}`);
  // }
});

const OpenRequestsConnectedList = tableConnect({
  dataName: 'openRequests',
  tableName: 'openRequests',
  searchFields: ['from']
})(TC);

const OpenRequestsContainer = Loader({
  loadData: operations.getOpenRequests,
  dataSelector: getOpenRequestsData,
  component: OpenRequestsConnectedList
});

export const OpenRequestsList: React.SFC = () => {
  return (
    <div className="d-flex flex-1 flex-column">
      <div className="flex-1">
        <TableMargin>
          <OpenRequestsContainer />
        </TableMargin>
      </div>
    </div>
  );
};
