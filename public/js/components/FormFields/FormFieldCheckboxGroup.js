import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import FormFieldCheckbox from './FormFieldCheckbox';

export default class FormFieldCheckboxGroup extends React.Component {

  static propTypes = {

    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    checkValues: PropTypes.array.isRequired,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  isChecked = (checkValue) => {
    return this.props.fieldValue.indexOf(checkValue) !== -1;
  }

  renderCheckbox(fieldName, i) {

    const updateFn = (newValue) => {
      let newFieldValue = [];

      if(newValue && !this.isChecked(fieldName)) {
        newFieldValue = this.props.fieldValue.concat([fieldName]);
      } else {
        newFieldValue = this.props.fieldValue.filter((oldFieldName) => {
          return fieldName !== oldFieldName;
        });
      }
      this.props.onUpdateField(newFieldValue);
    };

    return (
      <FormFieldCheckbox
        key={`${this.props.fieldName}-${i}`}
        fieldName={`${fieldName}`}
        fieldValue={this.isChecked(fieldName)}
        onUpdateField={updateFn}
        checkGroup="true" />
    );
  }

  render() {
    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          {this.props.checkValues.map((fieldName, i) => this.renderCheckbox(fieldName, i))}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
