import React from 'react';
import {PropTypes} from 'prop-types';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldNumericInput from '../../../FormFields/FormFieldNumericInput';
import {isHttpsUrl} from "../../../../util/validators";
import {atomPropType} from "../../../../constants/atomPropType";


export class ManualDataInput extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  render () {
    return (
      <div>
        <ManagedForm formName="audioEditor" data={this.props.atom} updateData={this.props.onUpdate}>
          <ManagedField fieldLocation="data.audio.kicker" name="Label (eg name of podcast series)" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.trackUrl" name="Track url" isRequired={true} customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.contentId" name="Audio ID" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.duration" name="Duration (seconds)" isRequired={true}>
            <FormFieldNumericInput  />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.coverUrl" name="Image url" isRequired={true} customValidation={[isHttpsUrl]}>
            <FormFieldTextInput  />
          </ManagedField>

          <ManagedField fieldLocation="data.audio.subscriptionLinks.apple" name="Subscription: Apple Podcasts" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.subscriptionLinks.google" name="Subscription: Google Podcasts" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.subscriptionLinks.spotify" name="Subscription: Spotify" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}


