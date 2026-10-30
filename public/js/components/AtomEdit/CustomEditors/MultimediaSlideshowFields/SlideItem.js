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

function mediaType(content) {
  if (content.mediaAtom) {
    return SLIDE_TYPE_VIDEO;
  }
  if (content.image) {
    return SLIDE_TYPE_IMAGE;
  }
  return null;
}

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
      // Edits to a slide that has no media yet, held back until it does.
      draft: null,
    };
  }

  componentDidUpdate(prevProps) {
    // Slides are index-keyed, so deleting one above hands this component a different slide.
    if (this.state.draft && prevProps.fieldValue !== this.props.fieldValue) {
      this.setState({ draft: null });
    }
  }

  componentWillUnmount() {
    // Otherwise a removed slide's "required" error would keep blocking publish.
    if (this.props.onFormErrorsUpdate) {
      this.props.onFormErrorsUpdate({
        [this.formName()]: { Image: [], Video: [] },
      });
    }
  }

  formName() {
    return `multimediaSlideshowEditor-${this.props.fieldName}`;
  }

  currentSlide() {
    return this.state.draft || this.props.fieldValue || { content: {} };
  }

  // SlideContent is a thrift union, so the API rejects (autosaved) slides without media.
  updateSlide = (slide) => {
    if (mediaType(slide.content || {})) {
      this.setState({ draft: null });
      this.props.onUpdateField(slide);
    } else {
      this.setState({ draft: slide });
    }
  };

  toggleExpanded = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  // Local state goes stale when a slide above is deleted, so prefer the slide's media.
  getSlideType(content) {
    return mediaType(content) || this.state.slideType;
  }

  changeSlideType = (slideType) => {
    const slide = this.currentSlide();
    if (slideType === this.getSlideType(slide.content || {})) {
      return;
    }
    const savedContent =
      (this.props.fieldValue && this.props.fieldValue.content) || {};
    this.setState({ slideType });
    // Switching back to the saved media's type restores it, otherwise wait for new media.
    const content = mediaType(savedContent) === slideType ? savedContent : {};
    this.updateSlide(Object.assign({}, slide, { content }));
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
        <FormFieldImageSelect
          gridUrl={this.props.gridUrl}
          hideSizeAndDimensions={true}
          hideRemoveButton={true}
        />
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
    const value = this.currentSlide();
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
            {/* Label, credit and video captions are hidden until platforms render them.
            {value.label ? (
              <strong className="slide__label">{value.label}</strong>
            ) : (
              false
            )}
            */}
            {slideType === SLIDE_TYPE_IMAGE &&
              (value.caption || <span className="slide__muted">No caption</span>)}
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
              updateData={this.updateSlide}
              onFormErrorsUpdate={this.props.onFormErrorsUpdate}
              formName={this.formName()}
            >
              {this.renderContentField(slideType)}
            </ManagedForm>
          </div>
          {slideType === SLIDE_TYPE_IMAGE && (
            <div className="slide__text">
              <ManagedForm
                data={value}
                updateData={this.updateSlide}
                onFormErrorsUpdate={this.props.onFormErrorsUpdate}
                formName={this.formName()}
              >
                <ManagedField fieldLocation="caption" name="Caption">
                  <FormFieldTextInput />
                </ManagedField>
                {/*
                <ManagedField fieldLocation="label" name="Label">
                  <FormFieldTextInput />
                </ManagedField>
                <ManagedField fieldLocation="credit" name="Credit">
                  <FormFieldTextInput />
                </ManagedField>
                */}
              </ManagedForm>
            </div>
          )}
          <ShowErrors errors={this.props.fieldErrors} />
        </div>
      </>
    );
  }
}
