import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType.js';
import copy from 'copy-to-clipboard';

class CopyUrlButton extends React.Component {

  static propTypes = {
    atom: atomPropType,
    config: PropTypes.shape({
      capiLiveUrl: PropTypes.string
    }).isRequired
  };

  state = {
    copied: false
  };

  generateEmbedUrl() {
    if (!this.props.atom) {
      return "";
    }

    const atom = this.props.atom;
    return `${this.props.config.capiLiveUrl}/atom/${atom.atomType.toLowerCase()}/${atom.id}`;
  }

  copyUrl = () => {
    copy(this.generateEmbedUrl());

    this.setState({copied: true});

    setTimeout(() => {
      this.setState({copied: false});
    }, 5000);
  };

  render() {
    return (
      <button className="btn suggestions-copy-url" onClick={this.copyUrl}>
        {this.state.copied ? "Copied!" : "Copy atom URL"}
      </button>
    );
  }
}

export default CopyUrlButton;
