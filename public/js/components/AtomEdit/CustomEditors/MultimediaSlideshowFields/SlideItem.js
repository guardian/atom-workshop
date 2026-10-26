import React from 'react';
import { PropTypes } from 'prop-types';
import { ManagedForm, ManagedField } from '../../../ManagedEditor';
import FormFieldImageSelect from '../../../FormFields/FormFieldImageSelect';
import FormFieldMediaAtomSelect from '../../../FormFields/FormFieldMediaAtomSelect';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldRadioButtons from '../../../FormFields/FormFieldRadioButtons';
import ShowErrors from '../../../Utilities/ShowErrors';
import { errorPropType } from '../../../../constants/errorPropType';
import { findSmallestAssetAboveWidth } from '../../../../util/imageHelpers';
import { VideoThumbnail } from './VideoThumbnail';

const SLIDE_TYPE_IMAGE = 'image';
const SLIDE_TYPE_VIDEO = 'video';

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
      // Slides that already have media start collapsed so the whole list fits on screen.
      expanded: !content.image && !content.mediaAtom,
    };
  }

  updateItem = (item) => {
    this.props.onUpdateField(item);
  };

  toggleExpanded = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  // Local state goes stale when a slide above is deleted, so prefer the saved content.
  getSlideType(content) {
    if (content.mediaAtom) {
      return SLIDE_TYPE_VIDEO;
    }
    if (content.image) {
      return SLIDE_TYPE_IMAGE;
    }
    return this.state.slideType;
  }

  changeSlideType = (slideType) => {
    const content =
      (this.props.fieldValue && this.props.fieldValue.content) || {};
    if (slideType === this.getSlideType(content)) {
      return;
    }
    this.setState({ slideType });
    // Clear the previous content so a slide never holds both an image and a
    // media atom reference.
    const value = this.props.fieldValue || {};
    this.props.onUpdateField(Object.assign({}, value, { content: {} }));
  };

  renderContentField(slideType) {
    if (slideType === SLIDE_TYPE_VIDEO) {
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
        <FormFieldImageSelect gridUrl={this.props.gridUrl} hideSizeAndDimensions={true} />
      </ManagedField>
    );
  }

  renderThumbnail(content, slideType) {
    if (content.image) {
      const thumbnail = findSmallestAssetAboveWidth(content.image.assets, 100);
      return <img className="slide__thumbnail" src={thumbnail.file} alt="" />;
    }
    if (content.mediaAtom) {
      const mediaAtomId = content.mediaAtom.mediaAtomId;
      return <VideoThumbnail key={mediaAtomId} mediaAtomId={mediaAtomId} />;
    }
    return (
      <span className="slide__thumbnail slide__thumbnail--missing">{`No ${slideType}`}</span>
    );
  }

  render() {
    const value = this.props.fieldValue || {
      content: {},
    };
    const content = value.content || {};
    const slideType = this.getSlideType(content);
    const expanded = this.state.expanded;

    // A fragment, so the header can share a line with FormFieldArrayWrapper's Move/Delete buttons.
    return (
      <>
        <button
          type="button"
          className="slide__header"
          aria-expanded={expanded}
          onClick={this.toggleExpanded}
        >
          <span className="slide__toggle" aria-hidden="true">
            {expanded ? '▾' : '▸'}
          </span>
          {this.renderThumbnail(content, slideType)}
          <span className="slide__summary">
            {value.label ? (
              <strong className="slide__label">{value.label}</strong>
            ) : (
              false
            )}
            {value.caption || <span className="slide__muted">No caption</span>}
          </span>
        </button>
        <div className="slide__body" hidden={!expanded}>
          <div className="slide__media">
            <FormFieldRadioButtons
              fieldLabel="Slide type"
              fieldName={`${this.props.fieldName}-slideType`}
              formRowClass="form__row slide__type-picker"
              selectValues={[SLIDE_TYPE_IMAGE, SLIDE_TYPE_VIDEO]}
              selectLabels={['Image', 'Video']}
              fieldValue={slideType}
              onUpdateField={this.changeSlideType}
            />
            <ManagedForm
              data={value}
              updateData={this.updateItem}
              onFormErrorsUpdate={this.props.onFormErrorsUpdate}
              formName="multimediaSlideshowEditor"
            >
              {this.renderContentField(slideType)}
            </ManagedForm>
          </div>
          <div className="slide__text">
            <ManagedForm
              data={value}
              updateData={this.updateItem}
              onFormErrorsUpdate={this.props.onFormErrorsUpdate}
              formName="multimediaSlideshowEditor"
            >
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
          </div>
          <ShowErrors errors={this.props.fieldErrors} />
        </div>
      </>
    );
  }
}
