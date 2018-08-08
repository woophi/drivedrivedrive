import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import * as React from 'react';
import { compose } from 'redux';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { submitSubGuest } from '../../form';
import { Alert } from 'ui/app/components/Alert';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'ui/app/components/Links';

type Props = {};
type FelaProps = FelaStyles<typeof mapStylesToProps>;

class FormComponent extends React.PureComponent<
  Props & FelaProps & InjectedFormProps<null, Props>
> {
  render() {
    const { styles, error, submitting, handleSubmit } = this.props;
    return (
      <form className={styles.container} onSubmit={handleSubmit} autoComplete={''}>
        {error && <Alert mssg={error} type={'error'} />}
        <div className={styles.btnContainer}>
          <Link to={`/`} className={'mr-1'}>
            <RaisedButton>{'На главную'}</RaisedButton>
          </Link>
          <RaisedButton type="submit" primary disabled={submitting}>
            {submitting ? <i className="fas fa-circle-notch fa-spin" /> : 'Отписаться'}
          </RaisedButton>
        </div>
      </form>
    );
  }
}

const container: FelaRule<Props> = () => ({
  height: '100%',
  width: '100%'
});

const btnContainer: FelaRule<Props> = () => ({
  margin: '2rem 0',
  justifyContent: 'center',
  display: 'flex',
  width: '100%',
});

const mapStylesToProps = {
  container,
  btnContainer
};

export const Form = compose(
  FelaConnect(mapStylesToProps),
  reduxForm<null, Props>({
    form: 'emailSubGuest',
    enableReinitialize: true,
    destroyOnUnmount: true,
    onSubmit: submitSubGuest
  })
)(FormComponent);