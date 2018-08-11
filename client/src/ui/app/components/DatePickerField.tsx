import * as React from 'react';
import { SingleDatePicker } from 'react-dates';
import { WrappedFieldProps } from 'redux-form';
import * as moment from 'moment';
import 'moment/locale/ru';

type Props = {
  uniqId: string;
} & WrappedFieldProps;

type LocalState = {
  focus: boolean;
  date: moment.Moment;
};

export class DatePickerComponent extends React.PureComponent<
  Props,
  LocalState
> {
  state: LocalState = {
    date: null,
    focus: false
  };

  handleFocus = (arg?: any) => {
    this.setState({ focus: !this.state.focus });

    const nothing: any = '';
    if (this.state.focus) {
      this.props.input.onFocus(nothing);
    } else {
      this.props.input.onBlur(nothing);
    }
  }

  handleDate = (dateObj: moment.Moment) => {
    this.setState({ date: dateObj });
    if (dateObj) {
      this.props.input.onChange(dateObj.format('YYYY-MM-DD'));
    } else {
      this.props.input.onChange('');
    }
  }

  localeDate = (day: moment.Moment) => day.locale('ru').format('DD');

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
        showClearDate
        showDefaultInputIcon
        noBorder
        withPortal
        hideKeyboardShortcutsPanel
        placeholder={'дд/мм/гггг'}
        block
        required
        renderDayContents={this.localeDate}
      />
    );
  }
}
