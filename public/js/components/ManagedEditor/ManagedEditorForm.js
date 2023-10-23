import React from 'react';
import {PropTypes} from 'prop-types';

export class ManagedForm extends React.Component {

  static propTypes = {
    formName: PropTypes.string,
    data: PropTypes.object,
    updateData: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    formErrors: PropTypes.object,
    onFormErrorsUpdate: PropTypes.func,
    onFormErrorStateUpdate: PropTypes.func // Helper method that just returns true/false
  };

  hasFormErrors(formErrorsObject) {
    const fieldWithError = Object.keys(formErrorsObject).find((key) => formErrorsObject[key].length > 0);
    return !!fieldWithError;
  }

  updateFormErrors = (fieldErrors, fieldName) => {

    const formErrors = Object.assign({}, this.props.formErrors, {
      [this.props.formName]: { [fieldName]: fieldErrors }
    });

    this.props.onFormErrorsUpdate && this.props.onFormErrorsUpdate(formErrors);
    this.props.onFormErrorStateUpdate && this.props.onFormErrorStateUpdate(this.hasFormErrors(formErrors));
  }


  render() {
    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        data: this.props.data,
        updateData: this.props.updateData,
        updateFormErrors: this.updateFormErrors
      });
    });

    return <div className="form">{hydratedChildren}</div>;
  }
}
