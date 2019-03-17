import * as React from 'react';
import { SectionChildProps } from 'ui/SectionChildType';
import { getRequest, approveRequest } from '../operations';
import { compose } from 'redux';
import { Request } from 'core/models/admin';
import { AppState } from 'core/models/app';
import {
  Field,
  InjectedFormProps,
  reduxForm
} from 'redux-form';
import { connect as redux } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Alert } from 'ui/app/components/Alert';
import { Preloader } from 'ui/app/components/preloader';
import { DataStatus } from 'core/models/api';
import { createComponent, IStyle } from 'react-fela';
import { updateRequest } from '../form';
import { parseToInt } from 'ui/shared/transforms';
import { CustomInputField, CustomCheckBoxField, CustomDateField } from 'ui/atoms/fields';
import { FormButtonsRow } from 'ui/atoms/buttons';
import { withTranslation, WithTranslation } from 'react-i18next';

type Props = {
  fetchingRequest: boolean;
  initialValues: Request;
  getRequestErr: any;
} & SectionChildProps & WithTranslation;

class EditRequestComponent extends React.Component<
  Props & InjectedFormProps<Request, Props>
> {
  async componentDidMount() {
    const { match } = this.props;
    await getRequest(match.params.id);
  }

  handleApproveRequest = () => {
    const { match } = this.props;
    approveRequest(match.params.id);
  }
  get fields() {
    const {
      pristine,
      submitting,
      initialValues,
      t
    } = this.props;
    return (initialValues &&
      <>
        <Field
          name="guest.name"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: t('common:name'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.email"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: t('common:email'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.phone"
          component={CustomInputField}
          type="tel"
          {...{
            floatingLabelText: t('common:phone'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.count"
          component={CustomInputField}
          type="number"
          parse={parseToInt}
          {...{
            floatingLabelText: t('common:count'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.from"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: t('common:from'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.to"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: t('common:to'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.date"
          component={CustomDateField}
          type="date"
          id={'adm_request_date'}
          {...{
            floatingLabelText: t('common:date'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.time"
          component={CustomInputField}
          type="time"
          {...{
            floatingLabelText: t('common:time'),
            fullWidth: true
          }}
        />
        <Field
          name="guest.comment"
          component={CustomInputField}
          type="text"
          {...{
            floatingLabelText: t('common:comment'),
            fullWidth: true,
            multiLine: true,
            rows: 4
          }}
        />
        <Field
          name="guest.notify"
          component={CustomCheckBoxField}
          type="checkbox"
          {...{
            floatingLabelText: t('common:notify'),
            disabled: true
          }}
        />
        <FormButtonsRow
          labelCancel={'app::common:button:resetChanges'}
          labelSubmit={'app::common:button:update'}
          pristine={pristine}
          resetForm={'editRequest'}
          submitting={submitting}
        />
      </>
    )
  }

  get approveBtn() {
    const { initialValues, t } = this.props;
    return (initialValues && !initialValues.approved &&
      <RaisedButton
        onClick={this.handleApproveRequest}
        disabled={!!initialValues.approved}
      >
        {t('common:button:approve')}
      </RaisedButton>
    )
  }
  get approved() {
    const { initialValues, t } = this.props;
    return (initialValues && initialValues.approved &&
      <ApprovedContainer>
        <i className="far fa-check-circle" />
        {t('admin:requests:sucApproved')}
      </ApprovedContainer>
    )
  }

  render() {
    const {
      handleSubmit,
      error,
      fetchingRequest,
      getRequestErr,
      initialValues
    } = this.props;
    return (
      <Container>
        <Paper zDepth={2}>
          <Form onSubmit={handleSubmit} autoComplete={''}>
            {(error || getRequestErr) && <Alert mssg={error || getRequestErr} type={'error'} />}
            {this.approved}
            {this.approveBtn}
            {this.fields}
          </Form>
          <Preloader isShow={fetchingRequest || !initialValues} />

        </Paper>
      </Container>
    );
  }
}


const Container = createComponent(() => ({
  '>div': {
    margin: '0 1rem 1rem',
    width: 'auto',
    height: '100%'
  }
}) as IStyle, 'div');

const Form = createComponent(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  padding: '1rem',
  height: '100%',
  maxWidth: 700
}), 'form', ['onSubmit','autoComplete']);

const ApprovedContainer = createComponent(() => ({
  '>i': {
    color: '#43A047',
    marginRight: '1rem',
    fontWeight: 600
  },
  fontSize: 18
}) as IStyle, 'p');

export const EditRequest = compose(
  withTranslation('app'),
  redux((state: AppState) => ({
    fetchingRequest: state.ui.api.adminRequest.status === DataStatus.QUIET_FETCHING,
    initialValues: state.ui.api.adminRequest.result,
    getRequestErr: state.ui.api.adminRequest.errorInfo &&
      JSON.stringify(state.ui.api.adminRequest.errorInfo)
  })),
  reduxForm<Request, Props>({
    form: 'editRequest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    onSubmit: updateRequest
  })
)(EditRequestComponent);
