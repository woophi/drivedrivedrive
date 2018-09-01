import * as React from 'react';
import { Alert } from '../Alert';

export const Empty: React.SFC<{ info?: string }> = ({ info }) => (
  <div className="m-auto">
    <Alert mssg={info || 'Нет данных'} type={'info'} />
  </div>
);
