import React from "react";
import {PropTypes} from "prop-types";
import { ManagedForm, ManagedField } from "../../../ManagedEditor";
import FormFieldsScribeEditor from "../../../FormFields/FormFieldScribeEditor";
import { wordLimits, tooLongMsg } from "../../../../util/wordLimits";

export class QAItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.date,
      body: PropTypes.string,
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func,
  };

  updateItem = item => {
    this.props.onUpdateField(item);
  };

  render() {
    const value = this.props.fieldValue || {
      title: "",
      body: "",
    };
    return (
      <div className="form__field">
        <ManagedForm
          data={value}
          updateData={this.updateItem}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="qaEditor"
        >
          <ManagedField fieldLocation="body" name="Answer" isRequired={true}>
            <FormFieldsScribeEditor
              showWordCount={true}
              showToolbar={true}
              suggestedLength={wordLimits.qanda}
              tooLongMsg={tooLongMsg(wordLimits.qanda)}
            />
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
