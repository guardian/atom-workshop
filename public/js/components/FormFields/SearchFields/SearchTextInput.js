import React from 'react';
import {PropTypes} from 'prop-types';

export default class SearchTextInput extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onKeyUp: PropTypes.func
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  onKeyUp = (e) => {
    this.props.onKeyUp(e.keyCode);
  }

  render() {
    return (
        <div className="atom-search__row">
          <label htmlFor={this.props.fieldName} className="visually-hidden">{this.props.fieldLabel}</label>
          <input type="search" 
                 className="atom-search__input"  
                 id={this.props.fieldName} 
                 placeholder={this.props.fieldPlaceholder || ''} 
                 onChange={this.onUpdate}  
                 onKeyUp={this.onKeyUp}
                 value={this.props.fieldValue || ""}
                 />
        </div>

    );
  }
}
