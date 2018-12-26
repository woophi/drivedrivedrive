import * as React from 'react';
import { SingleDatePicker } from 'react-dates';
import { WrappedFieldProps } from 'redux-form';
import * as moment from 'moment';

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
      this.handleDate(this.initialDate())
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
