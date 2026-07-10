import React from 'react';
import { PropTypes } from 'prop-types';
import { ManagedForm, ManagedField } from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldsRichTextEditor from '../../FormFields/FormFieldRichTextEditor';
import { atomPropType } from '../../../constants/atomPropType';
import FormFieldSelectBox from '../../FormFields/FormFieldSelectBox';

export class FootballCompetitionEditor extends React.Component {
  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
  };

  render() {
    return (
      <ManagedForm
        data={this.props.atom}
        updateData={this.props.onUpdate}
        onFormErrorsUpdate={this.props.onFormErrorsUpdate}
        formName="footballCompetitionEditor"
      >
        <ManagedField
          fieldLocation="data.footballCompetition.componentType"
          name="Component Type"
        >
          <FormFieldSelectBox
            selectValues={[{ id: 'MATCHDAY', name: 'Match Day' }]}
            optionsAsObject={false} // Use simple values instead
            displayEmptyOption={true}
          />
        </ManagedField>
        <ManagedField
          fieldLocation="data.footballCompetition.competitionId"
          name="Competition"
        >
          <FormFieldSelectBox
            selectValues={[
              { id: '-', name: 'Not selected' },
              { id: '100', name: 'Premier League' },
              { id: '700', name: 'World Cup' },
            ]}
            optionsAsObject={false} // Use simple values instead
            displayEmptyOption={true}
          />
        </ManagedField>
      </ManagedForm>
    );
  }
}
