import * as React from 'react';
import { createComponent } from 'react-fela';

const Container = createComponent(
  () => ({
    width: '100%',
    padding: '0 0.5rem'
  }),
  'div',
  ['className', 'title']
);

export const DefaultTableCell: React.SFC<{ title: string }> = ({
  children,
  title
}) => (
  <Container className="text-truncate" title={title}>
    {children}
  </Container>
);
