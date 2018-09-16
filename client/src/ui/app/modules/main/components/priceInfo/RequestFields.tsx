import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import { connect as FelaConnect, FelaRule, FelaStyles } from 'react-fela';
import { parseToInt } from 'ui/shared/transforms';
import { DatePickerComponent } from 'ui/app/components/DatePickerField';

type TextFieldProps = {
  type: string;
  label: any;
  placeHodler?: string;
  styleInput?: React.CSSProperties;
  styleLable?: React.CSSProperties;
  additionalClassName?: string;
  required?: boolean;
  id?: string;
};

type Props = {
  withGdpr?: boolean;
  clickOnGdpr?: () => void;
  withPhone?: boolean;
};

type FelaProps = FelaStyles<typeof mapStylesToProps>;

class RequestFieldsComponent extends React.Component<Props & FelaProps> {
  static defaultProps: Partial<Props> = {
    withGdpr: false,
    withPhone: false
  };

  componentInput = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
    const labelClassName =
      props.meta.touched && props.meta.error
        ? styles.errInputSt
        : styles.inputSt;
    return (
      <div className={styles.fieldSt}>
        <label
          className={`${props.additionalClassName || ''} ${styles.labelSt}`}
          style={props.styleLable || {}}
        >
          {props.label}
        </label>
        <input
          {...props.input}
          className={labelClassName}
          type={props.type}
          placeholder={props.placeHodler || ''}
          style={props.styleInput || {}}
          required={props.required || false}
          id={props.id || ''}
          autoComplete={props.input.name || ''}
          min={1}
        />
      </div>
    );
  }
  componentInputDate = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
    const labelClassName =
      props.meta.touched && props.meta.error
        ? styles.dateStInvalid
        : styles.dateSt;
    return (
      <div className={styles.fieldSt}>
        <label
          className={`${props.additionalClassName || ''} ${styles.labelSt}`}
          style={props.styleLable || {}}
        >
          {props.label}
        </label>
        <div className={labelClassName}>
          <DatePickerComponent
            uniqId={props.id}
            input={props.input}
            meta={props.meta}
          />
        </div>
      </div>
    );
  }

  componentCheckbox = (props: WrappedFieldProps & TextFieldProps) => {
    const { styles } = this.props;
    const labelClassName =
      props.meta.touched && props.meta.error
        ? styles.checkboxLabelErr
        : styles.checkboxLabel;
    return (
      <div className={styles.flexContainer}>
        <input
          {...props.input}
          type={props.type}
          id={props.id}
          className={styles.checkbox}
          required={props.required}
        />
        <label htmlFor={props.id} className={labelClassName}>
          <i className="fas fa-check" />
        </label>
        <label className={styles.checkboxLabel2}>{props.label}</label>
      </div>
    );
  }

  get gdprField() {
    const { clickOnGdpr, withGdpr } = this.props;
    const gdprLink = (
      <a style={{ textDecoration: 'underline' }} onClick={clickOnGdpr}>
        Согласие на обработку персональных данных
      </a>
    );
    return (withGdpr &&
      <Field
        name="gdpr"
        component={this.componentCheckbox}
        type="checkbox"
        label={gdprLink}
        {...{
          required: true,
          id: 'checkGDPR'
        }}
      />
    )
  }

  get phoneField() {
    const { withPhone } = this.props;

    return (withPhone &&
      <Field
        name="phone"
        component={this.componentInput}
        type="text"
        label={'Ваш номер телефона'}
      />
    );
  }

  render() {
    const { styles } = this.props;
    return (
      <>
        <Field
          name="name"
          component={this.componentInput}
          type="text"
          label={'Имя'}
          {...{
            required: true,
            id: 'guest_name_input'
          }}
        />
        <Field
          name="email"
          component={this.componentInput}
          type="email"
          label={'E-mail'}
          {...{
            required: true
          }}
        />
        <Field
          name="count"
          component={this.componentInput}
          type="number"
          parse={parseToInt}
          label={'Количество пассажиров'}
          {...{
            styleInput: {
              maxWidth: 150
            },
            required: true
          }}
        />
        <Field
          name="from"
          component={this.componentInput}
          type="text"
          label={'Отправление из'}
          {...{
            required: true
          }}
        />
        <Field
          name="to"
          component={this.componentInput}
          type="text"
          label={'Прибытие в'}
          {...{
            required: true
          }}
        />
        <Field
          name="date"
          component={this.componentInputDate}
          label={'Дата трансфера'}
          type={'date'}
          {...{
            required: true,
            id: 'datePcikerRequest'
          }}
        />

        <Field
          name="time"
          component={this.componentInput}
          type="time"
          label={'Время трансфера'}
          {...{
            required: true
          }}
        />

        <Field
          name="comment"
          component={this.componentInput}
          type="text"
          label={'Ваш комментарий'}
          {...{
            placeHodler: 'ваши пожелания или номер рейса',
            additionalClassName: styles.hideRequired
          }}
        />

       {this.gdprField}
       {this.phoneField}
      </>
    )
  }
}

const labelSt: FelaRule<Props> = () => ({
  font:
    'normal normal normal 11px/13px helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif',
  width: 'auto',
  paddingBottom: 5,
  letterSpacing: '.03em',
  verticalAlign: 'top',
  paddingRight: 5,
  '&:after': {
    content: '"*"',
    color: ' #cc0000',
    verticalAlign: 'top',
    margin: '0 3px'
  }
});

const fieldSt: FelaRule<Props> = () => ({
  margin: 5,
  width: 'calc(100% - 12px)',
  letterSpacing: '.03em',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
});

const inputSt: FelaRule<Props> = () => ({
  padding: '6px 12px',
  borderColor: 'rgba(186,218,85,1)',
  borderRadius: 7,
  borderWidth: 1,
  borderStyle: 'solid',
  width: '100%',
  boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
  transition: 'border-color linear .2s,box-shadow linear .2s',
  font:
    'normal normal normal 14px helvetica-w01-roman,helvetica-w02-roman,helvetica-lt-w10-roman,sans-serif',
  color: 'rgba(0,0,0,1)',
  boxSizing: 'border-box'
});

const errInputSt: FelaRule<Props> = () => ({
  ...inputSt(),
  borderColor: ' #cc0000'
});

const dateSt: FelaRule<Props> = () => ({
  '>div': {
    height: 33,
    '>div': {
      display: 'flex',
      borderRadius: 7,
      borderColor: 'rgba(186,218,85,1)',
      borderWidth: 1,
      borderStyle: 'solid',
      height: 33,
      boxSizing: 'border-box',
      '>button': {
        padding: '0px 10px 4px'
      },
      '>div>input': {
        padding: 1
      }
    }
  }
});
const dateStInvalid: FelaRule<Props> = () => ({
  '>div': {
    height: 33,
    '>div': {
      display: 'flex',
      borderRadius: 7,
      borderColor: '#cc0000',
      borderWidth: 1,
      borderStyle: 'solid',
      height: 33,
      boxSizing: 'border-box',
      '>button': {
        padding: '0px 10px 4px'
      },
      '>div>input': {
        padding: 1
      }
    }
  }
});

const hideRequired = () => ({
  '&:after': {
    content: '"" !important'
  }
});

const checkboxLabel: FelaRule = () => ({
  flexShrink: 0,
  display: 'block',
  cursor: 'pointer',
  outline: 'none',
  marginRight: '8px',
  height: '1.5rem',
  width: '1.5rem',
  borderRadius: '.5rem',
  boxShadow: '0px 0 5px rgba(0, 0, 0, 0.3)',
  boxSizing: 'border-box',
  backgroundColor: '#FFF',
  transition: '0.2s ease',
  borderColor: 'rgba(186,218,85,1)',
  borderWidth: 1,
  borderStyle: 'solid',
  position: 'relative',
  top: '-1px',
  '>i': {
    display: 'none'
  }
});

const checkboxLabelErr: FelaRule = () => ({
  ...checkboxLabel(),
  borderColor: ' #cc0000'
});

const checkbox: FelaRule = () => ({
  position: 'absolute',
  top: 5,
  left: 5,
  ':checked + label': {
    '>i': {
      display: 'inline-block',
      margin: 3,
      fontSize: '1rem',
      color: '#000'
    }
  }
});

const checkboxLabel2: FelaRule = () => ({
  display: 'block',
  marginBottom: '.25rem',
  cursor: 'pointer'
});

const flexContainer: FelaRule = () => ({
  display: 'flex',
  margin: '1rem 0 .25rem 0.35rem',
  position: 'relative'
});

const mapStylesToProps = {
  labelSt,
  fieldSt,
  inputSt,
  hideRequired,
  errInputSt,
  checkboxLabel,
  checkbox,
  checkboxLabel2,
  flexContainer,
  checkboxLabelErr,
  dateSt,
  dateStInvalid
};

export const RequestFields = FelaConnect(mapStylesToProps)(RequestFieldsComponent);
