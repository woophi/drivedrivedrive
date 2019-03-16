import * as React from 'react';
import { Alert } from '../Alert';
import { useTranslation } from 'react-i18next';

export const Empty: React.SFC<{ info?: string }> = ({ info }) => {
  const { t } = useTranslation();
  return (
    <div className="m-auto">
      <Alert mssg={info || t('app::noData')} type={'info'} />
    </div>
  );
}
