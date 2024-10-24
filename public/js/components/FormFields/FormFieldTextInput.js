import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldTextInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  render() {

    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <input
              type="text"
              className={"form__field " + (this.props.fieldErrors && this.props.fieldErrors.length ? "form__field--error" : "")}
              id={this.props.fieldName}
              placeholder={this.props.fieldPlaceholder || ''}
              onChange={this.onUpdate}
              value={this.props.fieldValue || ""}
          />
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>

    );
  }
}
