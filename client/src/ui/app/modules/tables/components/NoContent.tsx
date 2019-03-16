import * as React from 'react';
import { Alert } from 'ui/app/components/Alert';
import { useTranslation } from 'react-i18next';

export const NoContent: React.SFC = () => {
  const { t } = useTranslation();
  return (
    <Alert
      mssg={t('app::noData')}
      type={'info'}
    />
  );
}
