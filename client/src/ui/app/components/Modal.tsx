import * as React from 'react';
import Dialog from 'material-ui/Dialog';

type Props = {
  title: string;
  open: boolean;
  handleClose: () => void;
  actions: any[];
  body: any;
  isModal?: boolean;
};

class DialogComponent extends React.PureComponent<Props> {
  render() {
    return (
      <Dialog
        title={this.props.title}
        actions={this.props.actions}
        modal={this.props.isModal}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        {this.props.body}
      </Dialog>
    );
  }
}

export const Modal = DialogComponent;
