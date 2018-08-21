import { createComponent, FelaRule } from 'react-fela';

const style: FelaRule = () => ({
  margin: '0 -1rem',
  height: '100%'
});

export const TableMargin = createComponent<{}>(style, 'div');
