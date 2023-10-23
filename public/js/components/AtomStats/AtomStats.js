import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import {FrontendIcon, ComposerIcon, ViewerIcon} from '../../util/icons.js';

class AtomStats extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      getAtomUsages: PropTypes.func.isRequired,
      getSuggestedContent: PropTypes.func.isRequired
    }).isRequired,
    atom: atomPropType,
    atomUsages: PropTypes.array,
    suggestedContent: PropTypes.array,
    config: PropTypes.shape({
      composerUrl: PropTypes.string.isRequired,
      viewerUrl: PropTypes.string.isRequired
    }).isRequired
  }

  componentWillMount() {
    this.props.atomActions.getAtomUsages(this.props.routeParams.atomType, this.props.routeParams.id);
    this.props.atomActions.getSuggestedContent(this.props.routeParams.id, this.props.routeParams.atomType);
  }

  renderContent = (usage, i) => {
    const headline = usage.fields.headline;
    if (headline) {
      const composerLink = `${this.props.config.composerUrl}/content/${usage.fields.internalComposerCode}`;
      const viewerLink = `${this.props.config.viewerUrl}/preview/${usage.id}`;
      const websiteLink = `https://www.theguardian.com/${usage.id}`;

      return (
        <li className="usages-list__item" key={`usage-${i}`}>
          <p className="usages-list__item__name">{headline}</p>
          <div className="usages-list__links">
            <p className="usages-list__item__date">
              Created: {distanceInWordsToNow(usage.fields.creationDate, {addSuffix: true})}
              <a className="usages-list__link" href={websiteLink} title="Open on theguardian.com" target="_blank">
                <FrontendIcon />
              </a>
              <a className="usages-list__link" href={composerLink} title="Open in Composer" target="_blank">
                <ComposerIcon />
              </a>
              <a className="usages-list__link" href={viewerLink} title="Open in Viewer" target="_blank">
                <ViewerIcon />
              </a></p>
          </div>
        </li>
      );
    }
  }

  renderAtomUsages = () => {
    if (this.props.atomUsages && this.props.atomUsages.length > 0) {
        return (
          <ul className="usages-list">
            {this.props.atomUsages.map((usage, i) => this.renderContent(usage, i))}
          </ul>
        );
    } else {
      return (
        <div>This atom is not currently used in any content.</div>
      );
    }
  }

  renderSuggestedContent = () => {
    if (this.props.suggestedContent && this.props.suggestedContent.length > 0) {
      return (
        <ul className="usages-list">
          {this.props.suggestedContent.map((usage, i) => this.renderContent(usage, i))}
        </ul>
      );
    } else {
      return (
        <div>No suggested content for the last 7 days.</div>
      );
    }
  }

  render() {
    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{this.props.atom ? this.props.atom.title : ''}</h1>
        <h2>Usages</h2>
        <div className="atom-editor__section">
          {this.renderAtomUsages()}
        </div>
        <h2>Not yet included</h2>
        <div className="atom-editor__section">
          {this.renderSuggestedContent()}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomUsagesActions from '../../actions/AtomActions/getAtomUsages.js';
import * as getSuggestedContentActions from '../../actions/AtomActions/getSuggestedContent.js';

function mapStateToProps(state) {
  return {
    atom: state.atom,
    atomUsages: state.atomUsages,
    suggestedContent: state.suggestedContent,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getAtomUsagesActions, getSuggestedContentActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomStats);
