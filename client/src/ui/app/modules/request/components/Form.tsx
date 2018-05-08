import { AppState } from 'core/models/app';
import { connect as ReduxConnect } from 'react-redux';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { returntypeof } from 'react-redux-typescript';
import * as React from 'react';
import { compose } from 'redux';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import * as data from 'core/models/api';
import { validatePrice, submitPrice } from '../form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';
import { changeUrl } from 'ui/app/operations';
import { Alert } from 'ui/app/components/Alert';
import { getRequestId } from '../selectors';

const mapStateToProps = (state: AppState) => ({
  requestId: getRequestId(state),
});

const StateProps = returntypeof(mapStateToProps);
type Props = typeof StateProps;
type FelaProps = FelaStyles<typeof mapStylesToProps>;

type TextFieldProps = {
  hintText?: string;
  floatingLabelText?: string;
  errorText?: string;
  type?: string
}

class Index extends React.Component<Props & FelaProps & InjectedFormProps<{requestPrice: number}, Props>> {

  render() {
    const { styles, handleSubmit, error, pristine, submitting } = this.props;
    return (
      <form className={styles.form} onSubmit={handleSubmit} autoComplete={''}>
        <h1 className={styles.heading}>Предложить цену</h1>
        {error && <Alert mssg={error} type={'error'} />}
        <Field
          name="requestPrice"
          component={CustomInputField}
          type="number"
          {...{
            floatingLabelText: 'Цена в €(евро)',
            fullWidth: true
          }}
        />
        <div className={styles.btnContainer}>
          <RaisedButton type="submit" primary disabled={pristine || submitting}>
            {submitting ? <i className="fas fa-circle-notch fa-spin" /> : <span style={{margin: 8}}>Откликнуться</span>}
          </RaisedButton>
        </div>
      </form>
    );
  }
}


const CustomInputField: React.SFC<WrappedFieldProps & TextFieldProps> = props =>
    <TextField
      {...props.input}
      {...props}
      min={0}
      errorText={!!(props.meta.touched && props.meta.error) ? props.meta.error : ''}
    />
;

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
  alignSelf:  'flex-start'
});

const subContainer: FelaRule<Props> = () => ({
  display:  'flex',
  width:  '100%',
  justifyContent: 'space-between'
});

const btnContainer: FelaRule<Props> = () => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
});

const mapStylesToProps = {
  container,
  heading,
  form,
  subContainer,
  btnContainer
};

export default compose (
  ReduxConnect(mapStateToProps),
  FelaConnect(mapStylesToProps),
  reduxForm<{requestPrice: number}, Props>({
    form: 'assignRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    validate: validatePrice,
    onSubmit: submitPrice
  })
)(Index);
