import * as React from 'react';
import { Section } from 'ui/app/admin';
import { RequestsList } from './components/List';
import { EditRequest } from './components/EditRequest';

export const Index: React.SFC = () => (
  <>
    <Section
      path={'requests/edit'}
    >
      <RequestsList />
    </Section>
    <Section
      path={'requests/edit/request/:id'}
    >
      <EditRequest />
    </Section>

  </>
)
