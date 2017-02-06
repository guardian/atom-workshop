import React, { PropTypes } from 'react';
import filesize from 'filesize';
import Modal from '../Utilities/Modal';
import {parseImageFromGridCrop, findSmallestAssetAboveWidth, gridUrlFromApiUrl} from '../../util/imageHelpers';


const assetPropType = PropTypes.shape({
  mimeType: PropTypes.string.isRequired,
  file: PropTypes.string.isRequired,
  dimensions: PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired,
  size: PropTypes.number.isRequired
});

const gridImagePropType = PropTypes.shape({
  mediaId: PropTypes.string.isRequired,
  assets: PropTypes.arrayOf(assetPropType).isRequired,
  master: assetPropType.isRequired
});

class FormFieldImageSelect extends React.Component {

  static propTypes = {
    onUpdateField: PropTypes.func.isRequired,
    fieldValue: gridImagePropType,
    fieldName: PropTypes.string.isRequired,
    fieldLabel: PropTypes.string.isRequired,
    gridUrl: PropTypes.string.isRequired
  }

  state = {
    modalOpen: false
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
    window.removeEventListener('message', this.onMessage, false);
  }

  openModal = () => {
      this.setState({ modalOpen: true });
      window.addEventListener('message', this.onMessage, false);
  }

  validMessage(data) {
    return data && data.crop && data.crop.data && data.image && data.image.data;
  }

  onMessage = (event) => {

      if (event.origin !== this.props.gridUrl) {
          console.log("didn't come from the grid");
          return;
      }

      const data = event.data;

      if (!data) {
          console.log("got no data...");
          return;
      }

      if (!this.validMessage(data)) {
          console.log("not a valid message...");
          return;
      }

      this.closeModal();
      this.props.onUpdateField(parseImageFromGridCrop(data.crop.data));
  }

  renderWithoutImage() {
    return (
      <button className="image-select__button" onClick={this.openModal}>
          + Add Image from Grid
      </button>
    )
  }

  renderWithImage() {
    const thumbnail = findSmallestAssetAboveWidth(this.props.fieldValue.assets, 200);
    return (
      <div className="image-select__image-display">
        <div className="image-select__image">
          <img src={thumbnail.file} />
        </div>
        <div className="image-select__image-details">
          <div className="image-select__image-details__detail">
            <a target="_blank" href={gridUrlFromApiUrl(this.props.fieldValue.mediaId)}>View image in the Grid</a>
          </div>
          <div className="image-select__image-details__detail">
            Size: {filesize(this.props.fieldValue.master.size)}
          </div>
          <div className="image-select__image-details__detail">
            Dimensions: {this.props.fieldValue.master.dimensions.width} x {this.props.fieldValue.master.dimensions.height}
          </div>
          <button className="image-select__button" onClick={this.openModal}>
              Replace Image
          </button>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        <label className="form__label">{this.props.fieldLabel}</label>
        <div className="image-select form__group">
            {this.props.fieldValue ? this.renderWithImage() : this.renderWithoutImage()}

            <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
                <iframe className="image-select__modal" src={this.props.gridUrl}></iframe>
            </Modal>
        </div>
      </div>
    )
  }
}

export default FormFieldImageSelect;
