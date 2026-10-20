import React from 'react';
import {PropTypes} from 'prop-types';
import Modal from '../Utilities/Modal';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import {logInfo} from '../../util/logger';

const mediaAtomPropType = PropTypes.shape({
  mediaAtomId: PropTypes.string.isRequired
});

class FormFieldMediaAtomSelect extends React.Component {

  static propTypes = {
    onUpdateField: PropTypes.func,
    fieldValue: mediaAtomPropType,
    fieldName: PropTypes.string,
    fieldLabel: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    videoBaseUrl: PropTypes.string.isRequired
  };

  state = {
    modalOpen: false
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
    window.removeEventListener('message', this.onMessage, false);
  };

  openModal = () => {
    this.setState({ modalOpen: true });
    window.addEventListener('message', this.onMessage, false);
  };

  removeVideo = () => {
    this.props.onUpdateField(null);
  };

  onMessage = (event) => {

    if (event.origin !== this.props.videoBaseUrl) {
      logInfo("didn't come from media atom maker");
      return;
    }

    const data = event.data;

    if (!data) {
      logInfo("got no data...");
      return;
    }

    // The media atom maker iframe swallows keypress events when focussed, so it
    // propagates them up via the message API. Handle the Escape shortcut here.
    if (data.eventKey === 'Escape') {
      this.closeModal();
      return;
    }

    if (!data.atomId) {
      logInfo("no atomId in message...");
      return;
    }

    this.closeModal();
    this.props.onUpdateField({ mediaAtomId: data.atomId });
  };

  renderWithoutVideo() {
    return (
      <button className="image-select__button" type="button" onClick={this.openModal}>
          + Select Video from Media Atom Maker
      </button>
    );
  }

  renderWithVideo() {
    const mediaAtomId = this.props.fieldValue.mediaAtomId;
    return (
      <div className="image-select__image-display">
        <div className="image-select__image-details">
          <div className="image-select__image-details__detail">
            <a target="_blank" rel="noreferrer" href={`${this.props.videoBaseUrl}/videos/${mediaAtomId}`}>View video in Media Atom Maker</a>
          </div>
          <div className="image-select__image-details__detail">
            Atom id: {mediaAtomId}
          </div>
          <button className="image-select__button image-select__replace-button" type="button" onClick={this.openModal}>
              Replace Video
          </button>
          <button className="image-select__remove-button btn--red" type="button" onClick={this.removeVideo}>
              Remove Video
          </button>
        </div>
      </div>
    );
  }

  render () {
    return (
      <div className={this.props.formRowClass || "form__row"}>
        {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
        <div className="image-select">
            {this.props.fieldValue ? this.renderWithVideo() : this.renderWithoutVideo()}

            <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
                <iframe className="image-select__modal" src={`${this.props.videoBaseUrl}/videos?embeddedMode=live`}></iframe>
            </Modal>
        </div>
        <ShowErrors errors={this.props.fieldErrors}/>
      </div>
    );
  }
}

export default FormFieldMediaAtomSelect;
