import React from 'react';
import {PropTypes} from 'prop-types';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import {TimelineItem} from './TimelineFields/TimelineItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';
import FormFieldsRichTextEditor from '../../FormFields/FormFieldRichTextEditor';

export class TimelineEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  };

  render () {

    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="timelineEditor">
          <ManagedField fieldLocation="data.timeline.description" name="Description - optional" isRequired={false}>
            <FormFieldsRichTextEditor showWordCount={true} suggestedLength={50} showToolbar={true} tooLongMsg={"Remember that snippets should be concise"}/>
          </ManagedField>
          <ManagedField fieldLocation="data.timeline.events" name="Events">
            <FormFieldArrayWrapper>
              <TimelineItem onFormErrorsUpdate={this.props.onFormErrorsUpdate}/>
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
