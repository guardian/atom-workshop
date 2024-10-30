import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldNumericInput extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.number,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  onUpdate = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);

    if (parsedValue) {
      this.props.onUpdateField(parsedValue);
    } else if (value === "") {
      this.props.onUpdateField(undefined);
    }
  };

  render() {
    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <input type="number" className="form__field" id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} value={this.props.fieldValue || ''} onChange={this.onUpdate}/>
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>

    );
  }
}
