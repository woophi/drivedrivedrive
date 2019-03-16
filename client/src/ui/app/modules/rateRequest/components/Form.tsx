import { AppState } from 'core/models/app';
import { RateRequest } from 'core/models/api';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import {
  Field,
  InjectedFormProps,
  reduxForm,
  WrappedFieldProps
} from 'redux-form';
import { validateRR, submitRR } from '../form';
import { Alert } from 'ui/app/components/Alert';
import { getRequestId, getRequestQuery } from '../selectors';
const Rating = require('react-rating');
import { TextFieldProps } from 'ui/formTypes';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CustomInputField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';

const StarEmpty = require('../../../../assets/starEmpty.png');
const StarFull = require('../../../../assets/starFull.png');

const mapStateToProps = (state: AppState) => ({
  requestId: getRequestId(state),
  query: getRequestQuery(state)
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps & WithTranslation;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class Index extends React.Component<
  Props & FelaProps & InjectedFormProps<RateRequest, Props>
> {
  ratingComponent = (props: WrappedFieldProps & TextFieldProps) => {
    return (
      <div className={this.props.styles.containerRating}>
        <span className={this.props.styles.subContainer}>
          {props.floatingLabelText}
        </span>
        <Rating
          emptySymbol={
            <img src={StarEmpty} style={{ width: 25, height: 25 }} />
          }
          fullSymbol={<img src={StarFull} style={{ width: 25, height: 25 }} />}
          start={0}
          stop={5}
          fractions={2}
          initialRating={Number(props.input.value) || 0}
          onChange={props.input.onChange}
        />
        {props.meta.touched && props.meta.error && (
          <span style={{ fontSize: 11, color: '#cc0000' }}>
            {props.meta.error}
          </span>
        )}
      </div>
    );
  };

  render() {
    const { styles, handleSubmit, error, pristine, submitting, t } = this.props;
    return (
      <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
        {error && <Alert mssg={error} type={'error'} />}
        <Field
          name="ratingTrip"
          component={this.ratingComponent}
          type="number"
          {...{
            floatingLabelText: t('rateReq:trip')
          }}
        />
        <Field
          name="ratingCar"
          component={this.ratingComponent}
          type="number"
          {...{
            floatingLabelText: t('rateReq:car')
          }}
        />
        <Field
          name="ratingDriver"
          component={this.ratingComponent}
          type="number"
          {...{
            floatingLabelText: t('rateReq:driver')
          }}
        />

        <Field
          name="ratingComment"
          component={CustomInputField}
          type="textarea"
          {...{
            floatingLabelText: t('common:comment'),
            fullWidth: false
          }}
        />
        <FormButtonsRow
          labelSubmit={'app::common:button:send'}
          labelCancel={'app::common:button:cancel'}
          pristine={pristine}
          resetForm={'rateRequest'}
          submitting={submitting}
        />
      </form>
    );
  }
}

const containerRating: FelaRule<Props> = () => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  margin: '.5rem 0'
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
  marginBottom: '.5rem'
});

const mapStylesToProps = {
  containerRating,
  heading,
  form,
  subContainer
};

export default compose(
  withTranslation('app'),
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<RateRequest, Props>({
    form: 'rateRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validateRR,
    onSubmit: submitRR
  })
)(Index);
