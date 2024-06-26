import React from "react";
import {PropTypes} from "prop-types";
import { ManagedForm, ManagedField } from "../../../ManagedEditor";
import FormFieldTextInput from "../../../FormFields/FormFieldTextInput";
import FormFieldsRichTextEditor from "../../../FormFields/FormFieldRichTextEditor";
import ShowErrors from "../../../Utilities/ShowErrors";
import { errorPropType } from "../../../../constants/errorPropType";
import { wordLimits, tooLongMsg } from "../../../../util/wordLimits";

export class GuideItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
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
      title: null,
      body: "-",
    };
    return (
      <div className="form__field form__field--nested">
        <ManagedForm
          data={value}
          updateData={this.updateItem}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="guideEditor"
        >
          <ManagedField fieldLocation="title" name="Title">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="body" name="Body" isRequired={true}>
            <FormFieldsRichTextEditor
              showWordCount={true}
              showToolbar={true}
              suggestedLength={wordLimits.default}
              tooLongMsg={tooLongMsg(wordLimits.default)}
            />
          </ManagedField>
        </ManagedForm>
        <ShowErrors errors={this.props.fieldErrors} />
      </div>
    );
  }
}
