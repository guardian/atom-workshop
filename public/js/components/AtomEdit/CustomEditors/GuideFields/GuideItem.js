import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldsScribeEditor from '../../../FormFields/FormFieldScribeEditor';
import ShowErrors from '../../../Utilities/ShowErrors';
import { errorPropType } from '../../../../constants/errorPropType';

export class GuideItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
      body: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateItem = (item) => {
    this.props.onUpdateField(item);
  }

  render () {
    const value = this.props.fieldValue || {
      title: null,
      body: "-"
    };
    return (
      <div className="form__field form__field--nested">
        <ManagedForm data={value} updateData={this.updateItem} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="guideEditor">
          <ManagedField fieldLocation="title" name="Title">
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="body" name="Body" isRequired={true}>
            <FormFieldsScribeEditor showWordCount={true} showToolbar={false} tooLongMsg={"Remember that snippets should be concise"}/>
          </ManagedField>
        </ManagedForm>
        <ShowErrors errors={this.props.fieldErrors}/>
      </div>
    );
  }
}
