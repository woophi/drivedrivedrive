import * as React from 'react';
import { SingleDatePicker } from 'react-dates';
import { WrappedFieldProps } from 'redux-form';
import * as moment from 'moment';
import { compose } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect as redux } from 'react-redux';
import { AppState } from 'core/models/app';
import { LanguageId } from 'core/models';

type OwnProps = {
  uniqId: string;
} & WrappedFieldProps;

type LocalState = {
  focus: boolean;
  date: moment.Moment;
};

type Props = {
  lang: LanguageId;
} & OwnProps & WithTranslation;

class DatePickerComponent extends React.PureComponent<
  Props,
  LocalState
> {
  initialDate = () => {
    const { input } = this.props;
    return input.value
      ? moment(input.value)
      : null;
  }
  state: LocalState = {
    date: this.initialDate(),
    focus: false
  };

  componentDidUpdate() {
    const { meta: { pristine, initial } } = this.props;
    if (!!this.state.date && pristine && initial !== this.state.date.toISOString()) {
      this.handleDate(this.initialDate());
    }
    if (!this.state.date && pristine && initial) {
      this.handleDate(this.initialDate());
    }
  }


  handleFocus = () => {
    this.setState({ focus: !this.state.focus });
  }

  handleDate = (dateObj: moment.Moment) => {
    this.setState({ date: dateObj });
    if (dateObj) {
      this.props.input.onChange(dateObj.format('YYYY-MM-DD') + 'T00:00:00.000Z');
    } else {
      this.props.input.onChange('');
    }
  }

  localeDate = (day: moment.Moment) => day.locale(this.props.lang).format('DD');

  render() {
    const { focus, date } = this.state;
    const dateValue = this.props.input.value ? date : null;
    return (
      <SingleDatePicker
        id={this.props.uniqId}
        date={dateValue}
        onDateChange={this.handleDate}
        focused={focus}
        onFocusChange={this.handleFocus}
        numberOfMonths={1}
        noBorder
        withPortal
        hideKeyboardShortcutsPanel
        placeholder={this.props.t('datePicker:placeholder')}
        block
        required
        renderDayContents={this.localeDate}
      />
    );
  }
}

export const DatePicker = compose<React.ComponentClass<OwnProps>>(
  withTranslation('app'),
  redux((state: AppState) => ({
    lang: state.localAppState.lang
  }))
)(DatePickerComponent);
