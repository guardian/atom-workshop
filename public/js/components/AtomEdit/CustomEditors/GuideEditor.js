import React from "react";
import {PropTypes} from "prop-types";
import FormFieldImageSelect from "../../FormFields/FormFieldImageSelect";
import FormFieldArrayWrapper from "../../FormFields/FormFieldArrayWrapper";
import { GuideItem } from "./GuideFields/GuideItem";
import { ManagedField, ManagedForm } from "../../ManagedEditor";
import { atomPropType } from "../../../constants/atomPropType";

export class GuideEditor extends React.Component {
  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <div className="form">
        <ManagedForm
          data={this.props.atom}
          updateData={this.props.onUpdate}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="guideEditor"
        >
          <ManagedField
            fieldLocation="data.guide.guideImage"
            name="Guide Image"
          >
            <FormFieldImageSelect gridUrl={this.props.config.gridUrl} />
          </ManagedField>
          <ManagedField fieldLocation="data.guide.items" name="Items">
            <FormFieldArrayWrapper>
              <GuideItem onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
