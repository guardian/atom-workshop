import React from 'react';
import { PropTypes } from 'prop-types';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import { SlideItem } from './MultimediaSlideshowFields/SlideItem';
import { ManagedField, ManagedForm } from '../../ManagedEditor';
import { atomPropType } from '../../../constants/atomPropType';

const MAX_SLIDES = 10;

export class MultimediaSlideshowEditor extends React.Component {
  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired,
      videoBaseUrl: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    return (
      <div className="form">
        <ManagedForm
          data={this.props.atom}
          updateData={this.props.onUpdate}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="multimediaSlideshowEditor"
        >
          <ManagedField
            fieldLocation="data.multimediaSlideshow.title"
            name="Title"
          >
            <FormFieldTextInput fieldPlaceholder="An optional title for the slideshow" />
          </ManagedField>
          <ManagedField
            fieldLocation="data.multimediaSlideshow.slides"
            name={`Slides (up to ${MAX_SLIDES})`}
          >
            <FormFieldArrayWrapper
              maxItems={MAX_SLIDES}
              numbered={true}
              fieldClass="slideshow-editor__slide"
            >
              <SlideItem
                gridUrl={this.props.config.gridUrl}
                videoBaseUrl={this.props.config.videoBaseUrl}
                onFormErrorsUpdate={this.props.onFormErrorsUpdate}
              />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
