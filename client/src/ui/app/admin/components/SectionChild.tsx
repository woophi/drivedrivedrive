import * as React from 'react';
import * as equals from 'ramda/src/equals';
import { SectionChildProps } from 'ui/SectionChildType';

type ChildrenProps =
  | React.ReactNode
  | React.ComponentClass<SectionChildProps>
  | React.StatelessComponent<SectionChildProps>
;

type Props = {
  children: ChildrenProps;
} & SectionChildProps;

export class SectionChild extends React.Component<Props> {
  shouldComponentUpdate(nextProps: SectionChildProps) {
    return !equals(this.props, nextProps);
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), this.props);
  }
}
