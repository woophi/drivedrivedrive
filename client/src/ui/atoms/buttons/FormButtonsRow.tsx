import * as React from 'react';
import { createComponent } from 'react-fela';
import { RaisedButton } from 'material-ui';
import { resetForm } from 'ui/app/operations';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = {
  pristine: boolean;
  submitting: boolean;
  resetForm: string;
  labelSubmit?: string;
  labelCancel?: string;
  noCancel?: boolean;
} & WithTranslation

class FormButtonsRowComponent extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    labelCancel: 'app::common:button:reset',
    labelSubmit: 'app::common:button:save',
    resetForm: '',
    noCancel: false
  }

  handleResetForm = () => resetForm(this.props.resetForm);

  render() {
    const { pristine, submitting, labelSubmit, labelCancel, t } = this.props;
    return (
      <BtnContainer>
        {!this.props.noCancel &&
          <RaisedButton
            onClick={this.handleResetForm}
            style={{ marginRight: '1rem' }}
            buttonStyle={{ padding: '0' }}
          >
            {t(labelCancel)}
          </RaisedButton>
        }
        <RaisedButton
          type="submit"
          primary
          disabled={pristine || submitting}
        >
          {submitting ? (
            <i className="fas fa-circle-notch fa-spin" />
          ) : (
            <span style={{margin: 8}}>
              {t(labelSubmit)}
            </span>
          )}
        </RaisedButton>
      </BtnContainer>
    )
  }
}

export const FormButtonsRow = withTranslation()(FormButtonsRowComponent);

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
