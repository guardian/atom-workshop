import React from 'react';
import {PropTypes} from 'prop-types';
import { atomPropType } from '../../constants/atomPropType.js';
import copy from 'copy-to-clipboard';
import { Link } from 'react-router';
import Workflow from '../Workflow/Workflow';
import { doesAtomTypeRequireTagging } from '../../constants/atomData';

import CurrentTargets from './CurrentTargets';

class AtomEmbed extends React.Component {
  static propTypes = {
    atom: atomPropType,
    config: PropTypes.shape({
      capiLiveUrl: PropTypes.string.isRequired,
      isEmbedded: PropTypes.bool.isRequired,
    }),
    workflowActions: PropTypes.shape({
      getWorkflowStatus: PropTypes.func.isRequired,
      trackInWorkflow: PropTypes.func.isRequired,
    }),
    workflow: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string,
        prodOffice: PropTypes.string,
        section: PropTypes.string,
        status: PropTypes.string,
        scheduledLaunch: PropTypes.string,
      }),
    ]),
  };

  state = {
    copied: false,
  };

  generateEmbedUrl() {
    if (!this.props.atom) {
      return '';
    }

    const atom = this.props.atom;
    return `${
      this.props.config.capiLiveUrl
    }/atom/${atom.atomType.toLowerCase()}/${atom.id}`;
  }

  copyUrl = () => {
    copy(this.generateEmbedUrl());

    this.setState({ copied: true });

    setTimeout(() => {
      this.setState({ copied: false });
    }, 5000);
  };

  render() {
    if (this.props.config.isEmbedded) {
      return false;
    }

    if (!this.props.atom) {
      return false;
    }

    return (
      <div className="atom-embed">
        <div className="form">
          <div className="form__row">
            <h3 className="form__subheading">Embed This Atom</h3>
            <div className="form__row">
              <label htmlFor="embedUrl" className="form__label">
                Embed URL
              </label>
              <input
                id="embedUrl"
                className="form__field"
                value={this.generateEmbedUrl()}
                readOnly={true}
              />
              <button className="btn" onClick={this.copyUrl}>
                {this.state.copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
          <div className="form__row">
            <h3 className="form__subheading">Workflow</h3>
            <Workflow
              atom={this.props.atom}
              config={this.props.config}
              workflow={this.props.workflow}
              workflowActions={this.props.workflowActions}
            />
          </div>
          <div className="form__row">
            <h3 className="form__subheading">
              Tags
              {doesAtomTypeRequireTagging(this.props.atom.atomType) && ' *'}
            </h3>
            <div className="form__row">
              <CurrentTargets atom={this.props.atom} />
            </div>
          </div>
          <div className="form__row">
            <Link
              to={`/atoms/${this.props.atom.atomType}/${
                this.props.atom.id
              }/stats`}
              className="atom-list__link"
            >
              Where has this atom been used?
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default AtomEmbed;
