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

  private get children() {
    const child = React.Children.only(this.props.children) as React.ReactElement;

    if (React.isValidElement(child)) {
      return React.cloneElement<SectionChildProps>(child, {
        match: this.props.match
      });
    }

    return child;
  }

  render() {
    return this.children
  }
}
