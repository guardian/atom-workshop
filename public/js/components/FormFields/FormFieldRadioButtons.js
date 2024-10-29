import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';


export default class FormFieldRadioButtons extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    selectValues: PropTypes.arrayOf(PropTypes.string),
    selectLabels: PropTypes.arrayOf(PropTypes.string),
    fieldValue: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func,
    fieldCaption: PropTypes.string
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  };

  renderButton(value, label, i) {
    return (
      <div key={i} className="form__group--radio">
        <input className="form__radio-btn" type="radio" value={value} checked={this.props.fieldValue === value ? 'checked' : false} onChange={this.onUpdate} name={this.props.fieldName} />
        <span className="form__label form__label--radio">{label}</span>
      </div>
    );
  }

  renderButtons() {
    return this.props.selectValues.map(function(value, index) {
      return this.renderButton(value, this.props.selectLabels ? this.props.selectLabels[index] : value, index);
    }, this);
  }

  render() {

    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ?
              <label htmlFor={this.props.fieldName} className="form__label">
                {this.props.fieldLabel}
                {this.props.fieldCaption ? <small className="form__label--caption">{this.props.fieldCaption}</small> : false}
              </label>
              : false}
          {this.renderButtons()}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
