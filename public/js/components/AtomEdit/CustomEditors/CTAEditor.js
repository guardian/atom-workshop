import React from 'react';
import {PropTypes} from 'prop-types';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import {isHttpsUrl} from '../../../util/validators';

export class CTAEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  };

  render () {

    return (
      <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="ctaEditor">
        <ManagedField fieldLocation="data.cta.url" name="Link Url" isRequired={true}>
          <FormFieldTextInput/>
        </ManagedField>
        <ManagedField fieldLocation="labels" name="Campaign Labels">
          <FormFieldArrayWrapper>
            <FormFieldTextInput />
          </FormFieldArrayWrapper>
        </ManagedField>
        <ManagedField fieldLocation="data.cta.backgroundImage" name="Background Image Url" customValidation={[isHttpsUrl]}>
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.cta.btnText" name="Button Text">
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.cta.label" name="Label">
          <FormFieldTextInput />
        </ManagedField>
        <ManagedField fieldLocation="data.cta.trackingCode" name="Tracking Code">
          <FormFieldTextInput />
        </ManagedField>
      </ManagedForm>
    );
  }
}
