import React from 'react';
import {PropTypes} from 'prop-types';

import FormFieldRadioButtons from '../../../FormFields/FormFieldRadioButtons';
import FormFieldNumericInput from '../../../FormFields/FormFieldNumericInput';
import FormFieldSelectBox from '../../../FormFields/FormFieldSelectBox';
import {logError} from '../../../../util/logger';

export class RecipeServings extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      type: PropTypes.string,
      from: PropTypes.number,
      to: PropTypes.number,
      unit: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  servingTypes = [
    {
      value: 'serves',
      name: 'Serves a specfic number of people (e.g. serves 4 people)',
      hasUnits: false
    },
    {
      value: 'makes',
      name: 'Makes a specific number (e.g. 3 mince pies)',
      hasUnits: false
    },
    {
      value: 'quantity',
      name: 'Produces a specific quantity (e.g. produces 1kg of icing)',
      hasUnits: true
    }
  ]

  units = [
    "kilograms", "litres"
  ];

  updateServingType = (fieldValue) => {
    const servingType = this.servingTypes.find(servingType => servingType.name === fieldValue);

    if (!servingType) {
      logError("Couldn't find serving type matching value", fieldValue);
      return;
    }

    this.props.onUpdateField({
      type: servingType.value
    });
  }

  updateFromField = (fieldValue) => {
    const existingData = this.props.fieldValue || {};

    this.props.onUpdateField(Object.assign({}, existingData, {
      from: fieldValue
    }));
  }

  updateToField = (fieldValue) => {
    const existingData = this.props.fieldValue || {};

    this.props.onUpdateField(Object.assign({}, existingData, {
      to: fieldValue
    }));
  }

  updateUnits = (fieldValue) => {
    const existingData = this.props.fieldValue || {};

    this.props.onUpdateField(Object.assign({}, existingData, {
      units: fieldValue
    }));
  }

  getActiveServingType = () => {
    const existingData = this.props.fieldValue || {};
    return this.servingTypes.find(servingType => servingType.value === existingData.type);
  }

  shouldShowUnitsPicker = () => {
    const currentServingType = this.getActiveServingType();
    return currentServingType && currentServingType.hasUnits;
  }

  render () {
    return (
      <div className="form__row">
        <h3 className="form__subheading">Servings</h3>
        <FormFieldRadioButtons
          onUpdateField={this.updateServingType}
          selectValues={this.servingTypes.map(servingType => servingType.name)}
          fieldValue={this.getActiveServingType() ? this.getActiveServingType().name : ""}/>

        <div className="form__flex-container">
          <div className="form__flex-container__item">
            <FormFieldNumericInput
              fieldLabel="From"
              fieldName="From"
              fieldValue={this.props.fieldValue && this.props.fieldValue.from}
              onUpdateField={this.updateFromField} />
          </div>
          <div className="form__flex-container__item">
            <FormFieldNumericInput
              fieldLabel="To"
              fieldName="To"
              fieldValue={this.props.fieldValue && this.props.fieldValue.to}
              onUpdateField={this.updateToField} />
          </div>

          { this.shouldShowUnitsPicker() ?
            <div className="form__flex-container__item">
            <FormFieldSelectBox
              onUpdateField={this.updateUnits}
              selectValues={this.units}
              fieldValue={this.props.fieldValue ? this.props.fieldValue.unit : ""}/>
            </div> : false
          }
        </div>

      </div>
    );
  }
}
