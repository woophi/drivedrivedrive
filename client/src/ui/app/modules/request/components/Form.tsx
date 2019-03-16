import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { validatePrice, submitPrice } from '../form';
import { Alert } from 'ui/app/components/Alert';
import { getRequestId } from '../selectors';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CustomInputField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';

const mapStateToProps = (state: AppState) => ({
  requestId: getRequestId(state)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<
  Props & FelaProps & InjectedFormProps<{ requestPrice: number }, Props>
> {
  render() {
    const { styles, handleSubmit, error, pristine, submitting, t } = this.props;
    return (
      <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
        <h1 className={styles.heading}>{t('answerReq:offerPrice')}</h1>
        {error && <Alert mssg={error} type={'error'} />}
        <Field
          name="requestPrice"
          component={CustomInputField}
          type="number"
          {...{
            floatingLabelText: t('common:price'),
            fullWidth: true
          }}
        />
        <FormButtonsRow
          labelSubmit={'app::common:button:answer'}
          labelCancel={'app::common:button:cancel'}
          pristine={pristine}
          resetForm={'assignRequest'}
          submitting={submitting}
        />
      </form>
    );
  }
}

const container: FelaRule<Props> = () => ({
  maxWidth: 650,
  margin: 'auto',
  minWidth: 320,
  width: '100%'
});

const form: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem'
});

const heading: FelaRule<Props> = () => ({
  alignSelf: 'flex-start'
});

const subContainer: FelaRule<Props> = () => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between'
});

const mapStylesToProps = {
  container,
  heading,
  form,
  subContainer
};

export default compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<{ requestPrice: number }, Props>({
    form: 'assignRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validatePrice,
    onSubmit: submitPrice
  })
)(Index);
