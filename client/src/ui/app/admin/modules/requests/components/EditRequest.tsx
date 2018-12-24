import * as React from 'react';
import { SectionChildProps } from 'ui/SectionChildType';
import { getRequest } from '../operations';

type Props = {

} & SectionChildProps;

export class EditRequest extends React.Component<Props> {
  async componentDidMount() {
    const { match } = this.props;
    await getRequest(match.params.id)
  }

  render() {
    return (
      <div>
        kek
      </div>
    )
  }
}
