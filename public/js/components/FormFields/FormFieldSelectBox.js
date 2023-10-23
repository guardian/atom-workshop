import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldSelectBox extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    fieldErrors: PropTypes.arrayOf(errorPropType),
    selectValues: PropTypes.array,
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func,
    optionsAsObject: PropTypes.bool,
    displayEmptyOption: PropTypes.bool
  };

  renderOption(option) {
    if (option.id) {
      return (
        <option key={option.id} value={option.id}>{option.name}</option>
      );
    }

    if (option.name) {
        return (
            <option key={option.name} value={option.value}>{option.name}</option>
        );
    }

    return (
      <option key={option} value={option}>{option}</option>
    );
  }

  onUpdate = (e) => {
    if (this.props.optionsAsObject) {
      const id = parseInt(e.target.value);
      const newValue = this.props.selectValues.find(value => {
        return value.id === id;
      });

      this.props.onUpdateField(newValue);

    } else {
      this.props.onUpdateField(e.target.value);
    }
  }


  renderDefaultOption() {
    if (this.props.displayEmptyOption && !this.props.fieldValue) {
      return (
        <option value={null}>
          Please select...
        </option>
      );
    }
  }

  renderOptions() {
    return this.props.selectValues.map(this.renderOption);
  }

  render() {
    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <select className="form__field form__field--select" value={this.props.optionsAsObject ? this.props.fieldValue.id : this.props.fieldValue} onChange={this.onUpdate}>
            {this.renderDefaultOption()}
            {this.renderOptions()}
          </select>
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
