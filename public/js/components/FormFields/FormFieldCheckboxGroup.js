import React, {PropTypes} from 'react';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import FormFieldCheckbox from './FormFieldCheckbox';

export default class FormFieldCheckboxGroup extends React.Component {

  static propTypes = {

    fieldLabel: PropTypes.string.isRequired,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.array.isRequired,
    checkValues: PropTypes.array.isRequired,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func.isRequired
  };

  isChecked = (checkValue) => {
    return this.props.fieldValue.includes(checkValue);
  }

  renderCheckbox(fieldName, i) {
    const updateFn = (newValue) => {
      let newFieldValue = [];
      if(newValue && !this.isChecked(newValue)) {
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
        fieldName={`${this.props.fieldName}-${i}`}
        fieldValue={this.isChecked(fieldName)}
        onUpdateField={updateFn}
        checkGroup="true" />
    );
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.props.checkValues.map((fieldName, i) => this.renderCheckbox(fieldName, i))}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
