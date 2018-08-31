import * as React from 'react';
import { createComponent } from 'react-fela';

const Container = createComponent(
  () => ({
    width: '100%',
    padding: '0 0.5rem'
  }),
  'div',
  ['className']
);

export const DefaultTableCell: React.SFC = ({ children }) => (
  <Container className="text-truncate">
    {children}
  </Container>
);
