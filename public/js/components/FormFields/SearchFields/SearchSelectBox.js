import React from 'react';
import {PropTypes} from 'prop-types';

export default class SearchSelectBox extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    selectValues: PropTypes.array,
    onUpdateField: PropTypes.func
  };

  renderOption(option) {
    return (
        <option key={option} value={option}>{option}</option>
    );
  }

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  };


  renderOptions() {
    return this.props.selectValues.map(this.renderOption);
  }

  render() {
    return (
        <div className="atom-search__dropdown atom-search__dropdown--select">
          <label htmlFor={this.props.fieldName} className="atom-search__dropdown__label">{this.props.fieldLabel}</label>
          <select id={this.props.fieldName} className="atom-search__dropdown__value atom-search__dropdown__value--select" value={this.props.fieldValue} onChange={this.onUpdate}>
            {this.renderOptions()}
          </select>
        </div>
    );
  }
}
