import * as React from 'react';
import { createComponent } from 'react-fela';
import { RaisedButton } from 'material-ui';

type Props = {
  pristine: boolean;
  submitting: boolean;
  resetForm: () => void;
  labelSubmit: string;
  labelCancel: string;
}

export class FormButtonsRow extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    labelCancel: 'Сбросить',
    labelSubmit: 'Сохранить'
  }

  render() {
    const { pristine, submitting, resetForm, labelSubmit, labelCancel } = this.props;
    return (
      <BtnContainer>
        <RaisedButton
          disabled={pristine || submitting}
          onClick={resetForm}
          style={{ marginRight: '1rem' }}
          buttonStyle={{ padding: '0' }}
        >
          {labelCancel}
        </RaisedButton>
        <RaisedButton
          type="submit"
          primary
          disabled={pristine || submitting}
        >
          {submitting ? (
            <i className="fas fa-circle-notch fa-spin" />
          ) : (
            labelSubmit
          )}
        </RaisedButton>
      </BtnContainer>
    )
  }
}

const BtnContainer = createComponent(() => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
  '>div>button>div>div': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: '0 .5rem'
  }
}), 'div');
