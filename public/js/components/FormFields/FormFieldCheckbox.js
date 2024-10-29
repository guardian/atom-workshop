import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldCheckbox extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string.isRequired,
    fieldValue: PropTypes.bool.isRequired,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func.isRequired
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.checked);
  };

  render() {
    return (
      <div className={'form__ group form__group--checkbox--' + this.props.fieldName}>
        {this.props.fieldLabel ? <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label> : false}
        <input className="form__checkbox" type="checkbox" checked={this.props.fieldValue} name={this.props.fieldName} value={this.props.fieldValue} onChange={this.onUpdate} />
        {!this.props.fieldLabel ? <span className="form__label form__label--checkbox">{this.props.fieldName}</span> : false}
        <ShowErrors errors={this.props.fieldErrors}/>
      </div>
    );
  }
}
