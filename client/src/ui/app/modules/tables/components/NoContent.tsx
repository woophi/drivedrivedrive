import * as React from 'react';
import { Alert } from 'reactstrap';
import { Trans } from 'react-i18next';

export const NoContent: React.SFC = () => (
  <Alert color="info" className="m-3">
    <Trans i18nKey="admin::common:noResults" />
  </Alert>
);
