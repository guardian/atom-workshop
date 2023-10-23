import React from 'react';
import {PropTypes} from 'prop-types';
import CopyUrlButton from './CopyUrlButton';
import {FrontendIcon, ComposerIcon, ViewerIcon} from '../../util/icons.js';
import {SuggestedAtomsPropType} from '../../actions/AtomActions/getSuggestionsForLatestContent.js';

class ContentSuggestions extends React.Component {

  static propTypes = {
    suggestionsForLatestContent: PropTypes.arrayOf(SuggestedAtomsPropType),
    atomActions: PropTypes.shape({
      getSuggestionsForLatestContent: PropTypes.func.isRequired
    }).isRequired,
    config: PropTypes.shape({
      composerUrl: PropTypes.string.isRequired,
      viewerUrl: PropTypes.string.isRequired,
      liveCapiUrl: PropTypes.string
    }).isRequired
  }

  UNSAFE_componentWillMount() {
    this.props.atomActions.getSuggestionsForLatestContent();
  }

  renderAtom = atom => {
    const workshopUrl = `/atoms/${ atom.atomType }/${ atom.id }/edit`;
    return (
      <li className="suggestions-content" key={`suggested-atom-${atom.id}`}>
        <div className="suggestions-atom">
          <div className="suggestions-atom-details">
            <a className="suggestions-atom-title atom-list__link" href={ workshopUrl } target="_blank" rel="noreferrer">{ atom.title }</a>
            <span className="suggestions-atom-type">({ atom.atomType.charAt(0) + atom.atomType.slice(1).toLowerCase() } atom)</span>
          </div>
          <CopyUrlButton config={this.props.config} atom={atom}/>
        </div>
      </li>
    );
  }

  renderContent = content => {
    const composerLink = `${this.props.config.composerUrl}/content/${content.internalComposerCode}`;
    const viewerLink = `${this.props.config.viewerUrl}/preview/${content.contentId}`;
    const websiteLink = `https://www.theguardian.com/${content.contentId}`;

    return (
      <div className="suggestions-content-container">
        <div className="suggestions-headline">
          <span className="suggestions-list__item__name">{content.headline}</span>
        </div>
        <div className="suggestions-list__links">
          <p className="suggestions-list__item__date">
            <a className="suggestions-list__link" href={websiteLink} title="Open on theguardian.com" target="_blank" rel="noreferrer">
              <FrontendIcon />
            </a>
            <a className="suggestions-list__link" href={composerLink} title="Open in Composer" target="_blank" rel="noreferrer">
              <ComposerIcon />
            </a>
            <a className="suggestions-list__link" href={viewerLink} title="Open in Viewer" target="_blank" rel="noreferrer">
              <ViewerIcon />
            </a></p>
        </div>
      </div>
    );
  }

  renderAtomsArray = (atomsArray) => {
    return (
      <div className="suggestions-atom-container">
        <div className="suggestions-atom-container-heading">Suggested atoms:</div>
        <ul className="suggestions-list">
          {atomsArray.map(atom => this.renderAtom(atom))}
        </ul>
      </div>
    );
  }

  renderContentAndSuggestions = (item, i) => {
    return (
      <li className="suggestions-list__item" key={`usage-${i}`}>
        { this.renderContent(item) }
        { this.renderAtomsArray(item.atoms) }
      </li>
    );
  }

  renderSuggestionsForLatestContent() {
    if (this.props.suggestionsForLatestContent) {
      return (
        <ul className="suggestions-list">
          { this.props.suggestionsForLatestContent
            .filter(item => item.atoms.length > 0)
            .map((item, i) => this.renderContentAndSuggestions(item, i))
          }
        </ul>
      );
    } else {
      return (
        <div>Loading atom suggestions for most viewed content...</div>
      );
    }
  }

  render() {
    return (
      <div className="atom-editor suggestions-container">
        {this.renderSuggestionsForLatestContent()}
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getSuggestionsForLatestContent from '../../actions/AtomActions/getSuggestionsForLatestContent.js';

function mapStateToProps(state) {
  return {
    suggestionsForLatestContent: state.suggestionsForLatestContent,
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getSuggestionsForLatestContent), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentSuggestions);
