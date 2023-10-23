import React from 'react';
import {PropTypes} from 'prop-types';
import {createTarget} from '../../services/TargetingApi';

import {ManagedForm, ManagedField} from '../ManagedEditor';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';
import FormFieldTagPicker from '../FormFields/FormFieldTagPicker';
import FormFieldDateInput from '../FormFields/FormFieldDateInput';
import FormFieldArrayWrapper from '../FormFields/FormFieldArrayWrapper';


class CreateTargetForm extends React.Component {

  static propTypes = {
    atomPath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    triggerTargetFetch: PropTypes.func.isRequired,
    toggleEditMode: PropTypes.func.isRequired
  }

  state = {
    creating: false,
    currentTarget: {},
    formHasError: true
  }


  componentWillMount() {

    if (!this.state.currentTarget.title) {
      this.setState({
        currentTarget: {
          title: this.props.title
        }
      });
    }

  }

  createTarget = () => {

    this.setState({
      creating: true
    });

    const target = Object.assign({}, this.state.currentTarget, {
      url: this.props.atomPath
    });

    createTarget(target).then((response) => {
      if (response.status === 200) {
        this.props.triggerTargetFetch();
        this.props.toggleEditMode();
        this.setState({
          creating: false
        });
      }
    });
  }

  updateCurrentTarget = (newTarget) => {
    this.setState({
      currentTarget: newTarget
    });
  }

  updateFormErrorState = (errorState) => {
    this.setState({
      formHasError: errorState
    });
  }

  render() {
    return (
      <div className="targeting__form">
        <ManagedForm
          data={this.state.currentTarget}
          updateData={this.updateCurrentTarget}
          onFormErrorStateUpdate={this.updateFormErrorState}
          formName="targetingForm"
          >
          <ManagedField fieldLocation="title" name="Title" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="tagPaths" name="Target Tag" isRequired={true} >
            <FormFieldArrayWrapper>
              <FormFieldTagPicker/>
            </FormFieldArrayWrapper>
          </ManagedField>
          <ManagedField fieldLocation="activeUntil" name="Active Until" isRequired={true}>
            <FormFieldDateInput/>
          </ManagedField>
        </ManagedForm>
        <button
          className="btn"
          disabled={this.state.formHasError || this.state.creating}
          onClick={this.createTarget}
          >
          {this.state.creating ? "Creating..." : "Finish"}
        </button>
      </div>
    );
  }
}

export default CreateTargetForm;
