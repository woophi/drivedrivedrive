import * as React from 'react';
import { SectionChildProps } from 'ui/SectionChildType';
import { getRequest } from '../operations';

type Props = {

} & SectionChildProps;

export class EditRequest extends React.Component<Props> {
  data: any;
  async componentDidMount() {
    const { match } = this.props;
    this.data = await getRequest(match.params.id)
  }

  render() {
    const { match } = this.props;
    console.warn(this.data);
    return (
      <div>
        kek
      </div>
    )
  }
}
