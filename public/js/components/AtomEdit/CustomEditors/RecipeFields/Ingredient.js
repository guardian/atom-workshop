import React from 'react';
import {PropTypes} from 'prop-types';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldSelectBox from '../../../FormFields/FormFieldSelectBox';
import FormFieldNumericInput from '../../../FormFields/FormFieldNumericInput';

export class Ingredient extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      item: PropTypes.string,
      comment: PropTypes.string,
      quantity: PropTypes.number,
      quantityRange: PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number
      }),
      unit: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateQuantity = (newQuantity, newQuantityRange) => {
    this.props.onUpdateField(Object.assign({}, this.props.fieldValue, {
      quantity: newQuantity,
      quantityRange: newQuantityRange
    }));
  }

  updateUnit = (newValue) => {
    this.props.onUpdateField(Object.assign({}, this.props.fieldValue, {
      unit: newValue
    }));
  }

  render () {
    return (
      <ManagedForm data={this.props.fieldValue} updateData={this.props.onUpdateField} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="recipeEditor">
        <ManagedField fieldLocation="item" name="Ingredient Name" isRequired={true}>
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="comment" name="Comment">
          <FormFieldTextInput />
        </ManagedField>
        <Quantity
          quantity={this.props.fieldValue && this.props.fieldValue.quantity}
          quantityRange={this.props.fieldValue && this.props.fieldValue.quantityRange}
          unit={this.props.fieldValue ? this.props.fieldValue.unit : ""}
          updateQuantity={this.updateQuantity}
          updateUnit={this.updateUnit}/>
      </ManagedForm>
    );
  }
}


class Quantity extends React.Component {

  static propTypes = {
    quantity: PropTypes.number,
    quantityRange: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number
    }),
    updateQuantity: PropTypes.func.isRequired,
    unit: PropTypes.string,
    updateUnit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isRange: !props.quantityRange
    };
  }

  toggleRange = () => {
    this.setState({
      isRange: !this.state.isRange
    });

    //Reset Quantity and do the right thing with the current value
    if (this.props.quantity) { // We have an absolute... copy to from
      this.props.updateQuantity(undefined, {
        from: this.props.quantity
      });
    } else if (this.props.quantityRange && this.props.quantityRange.from) {
      // we have a from, copy to absolute
      this.props.updateQuantity(this.props.quantityRange.from, undefined);
    } else {
      this.props.updateQuantity(undefined, undefined);
    }
  }

  updateFrom = (value) => {
    const newRange = Object.assign({}, this.props.quantityRange, {
      from: value
    });
    this.props.updateQuantity(undefined, newRange);
  }

  updateTo = (value) => {
    const newRange = Object.assign({}, this.props.quantityRange, {
      to: value
    });
    this.props.updateQuantity(undefined, newRange);
  }

  updateAbsoluteQuantity = (value) => {
    this.props.updateQuantity(value, undefined);
  }


  renderRange() {
    return (
      <div className="form__flex-container">
        <div className="form__flex-container__item">
          <FormFieldNumericInput
            fieldLabel="from"
            fieldValue={this.props.quantityRange && this.props.quantityRange.from}
            onUpdateField={this.updateFrom}/>
        </div>
        <div className="form__flex-container__item">
          <FormFieldNumericInput
            fieldLabel="to"
            fieldValue={this.props.quantityRange && this.props.quantityRange.to}
            onUpdateField={this.updateTo}/>
        </div>
        <div className="form__flex-container__item">
          <Units
            updateUnit={this.props.updateUnit}
            fieldValue={this.props.unit}/>
        </div>
      </div>
    );
  }

  renderNonRange() {
    return (
      <div className="form__flex-container">
        <div className="form__flex-container__item">
          <FormFieldNumericInput
            fieldLabel="quantity"
            fieldValue={this.props.quantity}
            onUpdateField={this.updateAbsoluteQuantity}/>
        </div>
        <div className="form__flex-container__item">
          <Units
            updateUnit={this.props.updateUnit}
            fieldValue={this.props.unit}/>
        </div>
      </div>
    );
  }

  render () {
    return (
      <div className="form__group">
        <input className="form__checkbox" type="checkbox" checked={this.state.isRange} onChange={this.toggleRange} />
        <span className="form__label form__label--checkbox">Range?</span>
        {this.state.isRange ? this.renderRange() : this.renderNonRange()}
      </div>
    );
  }
}

class Units extends React.Component {
  unitTypes = ['cup', 'g', 'kg', 'oz', 'lb', 'bottle', 'floz', 'l', 'litre', 'ml', 'tsp', 'tbsp', 'dsp', 'bunch', 'cm', 'can', 'clove', 'dash', 'grating', 'handful', 'packet', 'piece', 'pinch', 'sheet', 'sprig', 'stick'];

  static propTypes = {
    fieldValue: PropTypes.string,
    updateUnit: PropTypes.func.isRequired
  };

  updateIngredientUnit = (value) => {
    this.props.updateUnit(value);
  }

  render () {
    return (
      <FormFieldSelectBox
        fieldValue={this.props.fieldValue}
        selectValues={this.unitTypes}
        onUpdateField={this.updateIngredientUnit} />
    );
  }
}
