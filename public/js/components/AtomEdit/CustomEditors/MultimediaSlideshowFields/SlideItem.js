import React from "react";
import { PropTypes } from "prop-types";
import { ManagedForm, ManagedField } from "../../../ManagedEditor";
import FormFieldImageSelect from "../../../FormFields/FormFieldImageSelect";
import FormFieldTextInput from "../../../FormFields/FormFieldTextInput";
import ShowErrors from "../../../Utilities/ShowErrors";
import { errorPropType } from "../../../../constants/errorPropType";

export class SlideItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      content: PropTypes.shape({
        image: PropTypes.object,
      }),
      caption: PropTypes.string,
      label: PropTypes.string,
      credit: PropTypes.string,
    }),
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func,
    gridUrl: PropTypes.string.isRequired,
  };

  updateItem = item => {
    this.props.onUpdateField(item);
  };

  render() {
    const value = this.props.fieldValue || {
      content: {},
    };
    return (
      <div className="form__field form__field--nested">
        <ManagedForm
          data={value}
          updateData={this.updateItem}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="multimediaSlideshowEditor"
        >
          <ManagedField
            fieldLocation="content.image"
            name="Image"
            isRequired={true}
          >
            <FormFieldImageSelect gridUrl={this.props.gridUrl} />
          </ManagedField>
          <ManagedField fieldLocation="caption" name="Caption">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="label" name="Label">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="credit" name="Credit">
            <FormFieldTextInput />
          </ManagedField>
        </ManagedForm>
        <ShowErrors errors={this.props.fieldErrors} />
      </div>
    );
  }
}
