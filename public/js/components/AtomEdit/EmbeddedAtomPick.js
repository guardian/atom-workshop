import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType.js';

class EmbeddedAtomPick extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    publishAtom: PropTypes.func.isRequired
  }

  triggerEmbedMessage = () => {
    window.parent.postMessage({
      atomId: this.props.atom.id,
      atomType: this.props.atom.atomType
    }, '*');
  }

  triggerAtomPublished = () => {
    this.props.publishAtom(this.props.atom);
  }

  atomHasBeenPublished(){
    return !!this.props.atom.contentChangeDetails.published;
  }

  render () {

    if (!this.atomHasBeenPublished()) {
      return (
        <div className="atom-editor__embed-pick">
          <button className="btn" onClick={this.triggerAtomPublished}>
            Publish this atom
          </button>
          <span> - This atom has not been published, once published it can be embedded</span>
        </div>
      );
    }

    return (
      <div className="atom-editor__embed-pick">
        <button className="btn" onClick={this.triggerAtomPublished}>
          Publish this atom
        </button>
        <button className="btn right" onClick={this.triggerEmbedMessage}>
          Pick this atom
        </button>
      </div>
    );
  }
}

export default EmbeddedAtomPick;
