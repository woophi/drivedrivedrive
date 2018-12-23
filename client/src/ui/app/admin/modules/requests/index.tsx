import * as React from 'react';
import { Section } from 'ui/app/admin';
import { RequestsList } from './components/List';

export const Index: React.SFC = () => (

  <Section
    path={'requests/edit'}
  >
    <RequestsList />
  </Section>
)
