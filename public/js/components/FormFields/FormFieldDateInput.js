import React from 'react';
import {PropTypes} from 'prop-types';

import {SingleDatePicker} from 'react-dates';
import format from 'date-fns/format';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';


export default class FormFieldDateInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.number,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func,
    isOutsideRange: PropTypes.func,
    placeholder: PropTypes.string
  };

  state = {
    focused: false
  };

  onDateChange = (momentDate) => {
    this.props.onUpdateField(momentDate.valueOf());
  }

  getPlaceholder = () => {
    if (this.props.fieldValue) {
      return format(this.props.fieldValue, 'DD/MM/YYYY');
    }
    if (this.props.placeholder) {
      return this.props.placeholder;
    }
    return 'Pick Expiry Date';

  }

  render() {
    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <SingleDatePicker
            id="date_input"
            date={this.state.fieldValue}
            focused={this.state.focused}
            onDateChange={this.onDateChange}
            onFocusChange={({ focused }) => { this.setState({ focused }); }}
            numberOfMonths={1}
            placeholder={this.getPlaceholder()}
            isOutsideRange={this.props.isOutsideRange}
          />
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>

    );
  }
}
