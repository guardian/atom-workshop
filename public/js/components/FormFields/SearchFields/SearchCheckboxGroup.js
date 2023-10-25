import React from 'react';
import {PropTypes} from 'prop-types';

export default class SearchCheckboxGroup extends React.Component {

  static propTypes = {

    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    checkValues: PropTypes.object.isRequired,
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func
  };

  state = {
    showOptions: false
  }

  isChecked = (checkValue) => {
    return this.props.fieldValue.indexOf(checkValue) !== -1;
  }

  toggleOptions = () => {
    this.setState({showOptions: !this.state.showOptions});
  }

  friendlyFieldValue = () => {
    if(!this.props.fieldValue.length) {
      return 'All types';
    }

    return this.props.fieldValue.reduce((acc, curr) => `${acc}, ${curr}`);
  }

  renderCheckbox(fieldName, displayName, i) {
    const updateFn = (e) => {
      let newFieldValue = [],
          newValue = e.target.value;

      if (newValue && !this.isChecked(fieldName)) {
        newFieldValue = this.props.fieldValue.concat([fieldName]);
      } else {
        newFieldValue = this.props.fieldValue.filter((oldFieldName) => {
          return fieldName !== oldFieldName;
        });
      }
      this.props.onUpdateField(newFieldValue);
    };

    return (
      <label className="atom-search__dropdown__item" key={i}>
        <input className="atom-search__dropdown__checkbox" type="checkbox" checked={this.isChecked(fieldName)} name={fieldName} value={this.isChecked(fieldName)} onChange={updateFn} />
        {displayName}
      </label>
    );
  }

  render() {
    return (
        <div className="atom-search__dropdown-container">
          <div className="atom-search__dropdown" onClick={this.toggleOptions}>
            <label htmlFor={this.props.fieldName} className="atom-search__dropdown__label">{this.props.fieldLabel}</label>
            <span className="atom-search__dropdown__value">{this.friendlyFieldValue()}</span>
          </div>
          <div className={"atom-search__dropdown__items " + (this.state.showOptions ? "" : "atom-search__dropdown__items--hidden")}>
            {Object.keys(this.props.checkValues).map((fieldName, i) => this.renderCheckbox(fieldName, this.props.checkValues[fieldName], i))}
          </div>
        </div>
    );
  }
}
