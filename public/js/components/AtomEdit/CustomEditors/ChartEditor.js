import React from 'react';
import {PropTypes} from 'prop-types';
import Modal from '../../Utilities/Modal';
import {atomPropType} from '../../../constants/atomPropType';
import {logInfo, logError} from '../../../util/logger';

export class ChartEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    config: PropTypes.shape({
      visualsUrl: PropTypes.string.isRequired,
      stage: PropTypes.string.isRequired
    }).isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  state = {
    modalOpen: false
  };

  toggleModal = (e) => {
    e.preventDefault();
    if (this.state.modalOpen) {
      this.closeModal();
    } else {
      this.openModal();
    }
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
    window.removeEventListener('message', this.onMessage, false);
    this.props.onUpdate();
  };

  openModal = () => {
    this.setState({ modalOpen: true });
    window.addEventListener('message', this.onMessage, false);
  };

  validMessage(data) {
    return data === "saving_atom";
  }

  onMessage = event => {
    if (event.origin !== this.props.config.visualsUrl) {
      logInfo("Event did not come from visuals tool.");
      return;
    }

    const data = event.data;

    if (!data) {
      logInfo("No data from event");
      return;
    }

    if (!this.validMessage(data)) {
      logError("Invalid message");
      return;
    }

    this.closeModal();
  };

  render () {
    const chartHtml = {
      __html: this.props.atom.defaultHtml
    };

    const iFrameSrc = `${this.props.config.visualsUrl}/`;

    return (
      <div>
        <button className="btn" onClick={this.toggleModal}>
          Edit Chart
        </button>
        <Modal isOpen={this.state.modalOpen} dismiss={this.closeModal}>
          <iframe className="chartembedder__modal" src={`${iFrameSrc}?atom=${this.props.atom.id}`} />
        </Modal>
        <div dangerouslySetInnerHTML={chartHtml}></div>
      </div>
    );
  }
}
