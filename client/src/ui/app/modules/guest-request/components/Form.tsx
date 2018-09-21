import * as React from 'react';
import { compose } from 'redux';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { connect as ReduxConnect } from 'react-redux';
import { IStyle, FelaThemeProps, createComponent } from 'react-fela';
import { RequestFields } from 'ui/app/components/RequestFields';
import { AppState } from 'core/models/app';
import { RequestInfo } from 'core/models';
import { getGuestRequestResult } from '../selectors';
import { validateRequest, submitEditRequest } from '../form';
import { Alert } from 'ui/app/components/Alert';

type OwnProps = {
  style: IStyle;
  handleClose?: () => void;
};

type Props = {} & OwnProps;

class FormComponent extends React.Component<
  Props & InjectedFormProps<RequestInfo, Props>
> {
  render() {
    const {
      style,
      initialValues,
      submitting,
      pristine,
      handleSubmit,
      error
    } = this.props;
    const phone = initialValues && initialValues.phone;
    const submittingButton = submitting ? (
      <i className="fas fa-circle-notch fa-spin" />
    ) : (
      'Обновить'
    );
    return (
      <Form style={style} onSubmit={handleSubmit}>
        <div>
          {error && <Alert mssg={error} type={'error'} />}
          <RequestFields withPhone={!!phone} />
          <Button disabled={submitting || pristine}>{submittingButton}</Button>
        </div>
      </Form>
    );
  }
}

export const FormEdit = compose(
  ReduxConnect((state: AppState, props: OwnProps) => ({
    initialValues: getGuestRequestResult(state),
    hashId: state.ui.guests.hashId
  })),
  reduxForm<RequestInfo, Props>({
    form: 'guestRequest',
    enableReinitialize: true,
    destroyOnUnmount: false,
    validate: validateRequest,
    onSubmit: submitEditRequest
  })
)(FormComponent);

const Form = createComponent<{} & Partial<FelaThemeProps>>(
  () => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(85, 85, 85, 0.7)',
    width: 281,
    right: -40,
    height: 540,
    position: 'relative',
    bottom: 80,
    color: '#fff',
    cursor: 'default',
    justifyContent: 'center',
    '>div': {
      display: 'flex',
      flexDirection: 'column',
      margin: '1rem'
    }
  }),
  'form',
  ['style', 'onSubmit']
);
const Button = createComponent<{} & Partial<FelaThemeProps>>(
  ({ theme }) => ({
    ...theme.items.flatButton,
    margin: '5px 5px 0',
    backgroundColor: theme.palette.lightYellow,
    color: '#fff'
  }),
  'button',
  ['disabled']
);
