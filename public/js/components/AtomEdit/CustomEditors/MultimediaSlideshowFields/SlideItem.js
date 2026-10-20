import React from "react";
import { PropTypes } from "prop-types";
import { ManagedForm, ManagedField } from "../../../ManagedEditor";
import FormFieldImageSelect from "../../../FormFields/FormFieldImageSelect";
import FormFieldMediaAtomSelect from "../../../FormFields/FormFieldMediaAtomSelect";
import FormFieldTextInput from "../../../FormFields/FormFieldTextInput";
import FormFieldRadioButtons from "../../../FormFields/FormFieldRadioButtons";
import ShowErrors from "../../../Utilities/ShowErrors";
import { errorPropType } from "../../../../constants/errorPropType";

const SLIDE_TYPE_IMAGE = "image";
const SLIDE_TYPE_VIDEO = "video";

export class SlideItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      content: PropTypes.shape({
        image: PropTypes.object,
        mediaAtom: PropTypes.shape({
          mediaAtomId: PropTypes.string,
        }),
      }),
      caption: PropTypes.string,
      label: PropTypes.string,
      credit: PropTypes.string,
    }),
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func,
    gridUrl: PropTypes.string.isRequired,
    videoBaseUrl: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    const content = (props.fieldValue && props.fieldValue.content) || {};
    this.state = {
      slideType: content.mediaAtom ? SLIDE_TYPE_VIDEO : SLIDE_TYPE_IMAGE,
    };
  }

  updateItem = item => {
    this.props.onUpdateField(item);
  };

  changeSlideType = slideType => {
    if (slideType === this.state.slideType) {
      return;
    }
    this.setState({ slideType });
    // Clear the previous content so a slide never holds both an image and a
    // media atom reference.
    const value = this.props.fieldValue || {};
    this.props.onUpdateField(Object.assign({}, value, { content: {} }));
  };

  renderContentField() {
    if (this.state.slideType === SLIDE_TYPE_VIDEO) {
      return (
        <ManagedField
          fieldLocation="content.mediaAtom"
          name="Video"
          isRequired={true}
        >
          <FormFieldMediaAtomSelect videoBaseUrl={this.props.videoBaseUrl} />
        </ManagedField>
      );
    }
    return (
      <ManagedField
        fieldLocation="content.image"
        name="Image"
        isRequired={true}
      >
        <FormFieldImageSelect gridUrl={this.props.gridUrl} />
      </ManagedField>
    );
  }

  render() {
    const value = this.props.fieldValue || {
      content: {},
    };
    return (
      <div className="form__field form__field--nested">
        <FormFieldRadioButtons
          fieldLabel="Slide type"
          fieldName="slideType"
          selectValues={[SLIDE_TYPE_IMAGE, SLIDE_TYPE_VIDEO]}
          selectLabels={["Image", "Video"]}
          fieldValue={this.state.slideType}
          onUpdateField={this.changeSlideType}
        />
        <ManagedForm
          data={value}
          updateData={this.updateItem}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="multimediaSlideshowEditor"
        >
          {this.renderContentField()}
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
