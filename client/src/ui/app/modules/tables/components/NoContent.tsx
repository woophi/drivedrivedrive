import * as React from 'react';
import { Alert } from 'ui/app/components/Alert';

export const NoContent: React.SFC = () => (
  <Alert
    mssg={'Нет данных'}
    type={'info'}
  />
);
