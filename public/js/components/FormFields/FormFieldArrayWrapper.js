import React from 'react';
import {PropTypes} from 'prop-types';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldArrayWrapper extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func,
    nested: PropTypes.bool,
    numbered: PropTypes.bool,
    fieldClass: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  }

  //We store new items in state to avoid sending invalid items back to the server before they're ready
  state = {
    newItems: [],
    childrenVisible: true
  }

  onAddClick = () => {
    this.setState({
      newItems: this.state.newItems.concat([undefined])
    });
  }

  renderValue(value, i) {

    const updateFn = (newValue) => {
      if (value === undefined) {
        //It's the first update to a new item - add it to props and remove from newItems
        this.setState({
          newItems: this.state.newItems.length > 1 ? this.state.newItems.slice(1) : []
        });

        const update = this.props.fieldValue ? this.props.fieldValue.concat([newValue]) : [newValue];
        this.props.onUpdateField(update);
      } else {
        //Find the value in the array to change
        const newFieldValue = this.props.fieldValue.map((oldValue) => {
          return value === oldValue ? newValue : oldValue;
        });

        this.props.onUpdateField(newFieldValue);
      }
    };

    const removeFn = (removeIndex) => {
      if (this.props.fieldValue && this.props.fieldValue.length > removeIndex) {
        const newFieldValue = this.props.fieldValue.filter((value, currentIndex) => {
          return currentIndex !== removeIndex;
        });

        this.props.onUpdateField(newFieldValue);
      } else {
        //It must be a new item
        this.setState({
          newItems: this.state.newItems.length > 1 ? this.state.newItems.slice(1) : []
        });
      }
    };

    const moveInArrayFn = (arr, fromIndex, toIndex) => {
      arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
    };
    
    const moveFn = (currentIndex, newIndex) => {

      this.setState({
          childrenVisible: false
      }, () => {
          /* we only allow to move if item has been updated and indices are within array bounds */
          if (value !== undefined && this.props.fieldValue && this.props.fieldValue.length > currentIndex && currentIndex >= 0 && this.props.fieldValue.length > newIndex && newIndex >= 0) {
              const arr = this.props.fieldValue.slice();
              moveInArrayFn(arr, currentIndex, newIndex);
              this.props.onUpdateField(arr);
          }
          
          // When reordering array elements & the child is a scribe editor, we have no way of passing information
          // down to scribe to force a re-render, as scribe cannot handle update changes once it has been
          // initialised. To trigger the visual change without a browser refresh, we need to unmount
          // and remount the child scribe component. However as we only render the root React component
          // with the DOM, and every other downstream component is rendered via React, there is no way to
          // remove the children components. Therefore we use this flag in state to identify whether
          // they should be visible or not. We hide the component until the updates have passed downstream,
          // and then the further change in state below will trigger a re-render & the lifecycle methods of any children.

          this.setState({
            childrenVisible: true
          });

        });
    };


    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        key: `${this.props.fieldName}-${i}`,
        fieldName: `${this.props.fieldName}-${i}`,
        fieldValue: value,
        fieldErrors: this.props.fieldErrors,
        formRowClass: 'form__row form__row--flex',
        onUpdateField: updateFn
      });
    });

    const renderMoveBtns = () => {
      if (i !== 0 && (i+1) < this.props.fieldValue.length) {
        return <div>
              <button className="btn form__field-btn form__field--move-btn" type="button" onClick= { moveFn.bind(this, i, (i-1) ) } >Move up</button>
              <button className="btn form__field-btn form__field--move-btn" type="button" onClick= { moveFn.bind(this, i, (i+1) ) } >Move down </button>
            </div>;
      } else if (i === 0) {
        return <div><button className="btn form__field-btn form__field--move-btn" type="button" onClick= { moveFn.bind(this, i, (i+1) ) } >Move down </button></div>;
      } else {
        return <div><button className="btn form__field-btn form__field--move-btn" type="button" onClick= { moveFn.bind(this, i, (i-1) ) } >Move up</button></div>;
      }
    };

    return (
      <div className={this.props.fieldClass ? this.props.fieldClass : null}>
        {this.props.numbered ? <span className="form__field-number">{`${i + 1}. `}</span> : false }
        {hydratedChildren}
        {renderMoveBtns()}
        <button className="btn form__field-btn btn--red" type="button" onClick={removeFn.bind(this, i)}>Delete</button>
      </div>
    );
  }

  render () {
   const values = (this.props.fieldValue || []).concat(this.state.newItems);

    return (
      <div className={this.props.nested ? 'form__row form__row--nested' : 'form__row'}>
        <div className="form__btn-heading">
          <span className="form__label">{this.props.fieldLabel}</span>
       </div>
          { this.state.childrenVisible ? values.map((value, i) => this.renderValue(value, i)) : false }
        <div className="form__btn-group">
          <button className="form__btn-heading__btn form__btn-heading__add" type="button" onClick={this.onAddClick}>Add</button>
        </div>
      </div>
    );
  }
}
