import React from 'react';
import {PropTypes} from 'prop-types';
import { Link } from 'react-router';

import { atomPropType } from '../../constants/atomPropType';
import publishState from '../../util/publishState';
import PresenceIndicator from '../Utilities/PresenceIndicator';
import { saveStateVals } from '../../constants/saveStateVals';
import distanceInWords from 'date-fns/distance_in_words';
import DeleteAtom from './DeleteAtom';
import flattenFormErrors from '../../util/flattenFormErrors';
import HoverExpander from '../Utilities/HoverExpander';
import List from '../List/List';

class EditHeader extends React.Component {
  static propTypes = {
    atom: atomPropType,
    presence: PropTypes.bool,
    saveState: PropTypes.object,
    formErrors: PropTypes.array,
    atomActions: PropTypes.shape({
      publishAtom: PropTypes.func.isRequired,
      takeDownAtom: PropTypes.func.isRequired,
      deleteAtom: PropTypes.func.isRequired,
    }).isRequired,
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired,
      embeddedMode: PropTypes.string,
    }),
  };

  publishAtom = () => {
    this.props.atomActions.publishAtom(this.props.atom);
  };

  takeDownAtom = () => {
    this.props.atomActions.takeDownAtom(this.props.atom);
  };

  isEditor = () => {
    return location.pathname.search(new RegExp('/atoms/.*/.*/edit', 'g')) >= 0;
  };

  timeSinceLastModified = () => {
    if (
      this.props.atom.contentChangeDetails.created ||
      this.props.atom.contentChangeDetails.lastModified
    ) {
      const dateNow = Date.now();
      const lastModified = this.props.atom.contentChangeDetails.lastModified
        ? this.props.atom.contentChangeDetails.lastModified.date
        : this.props.atom.contentChangeDetails.created.date;
      return distanceInWords(dateNow, lastModified, { addSuffix: true });
    }
    return false;
  };

  renderSaveState = () => {
    if (this.props.saveState.saving === saveStateVals.inprogress) {
      return <span className="loader save-state__loader">Saving</span>;
    }
    return (
      <span>
        <span className="save-state">Saved</span> {this.timeSinceLastModified()}
      </span>
    );
  };

  renderPublishedState = () => {
    const atomPublishState = publishState(this.props.atom);
    return (
      <span className={`publish-state publish-state--${atomPublishState.id}`}>
        {atomPublishState.text}
      </span>
    );
  };

  renderTakeDownButton = atomPublishState => {
    if (atomPublishState.id !== 'draft') {
      return (
        <button
          type="button"
          disabled={atomPublishState.id === 'taken-down'}
          onClick={this.takeDownAtom}
          className="btn btn--red btn--margin"
        >
          Take down
        </button>
      );
    }
    return false;
  };

  isPublishingDisabled = () => {
    const atomPublishState = publishState(this.props.atom);
    return (
      atomPublishState.id === 'published' || this.props.formErrors.length > 0
    );
  };

  renderHeaderRight = () => {
    const atomPublishState = publishState(this.props.atom);

    return (
      <div className="toolbar__container">
        {this.props.presence ? (
          <PresenceIndicator presence={this.props.presence} />
        ) : (
          false
        )}

        <HoverExpander
          proxy={
            <button
              disabled={this.isPublishingDisabled()}
              type="button"
              onClick={this.publishAtom}
              className="btn btn--green btn--margin"
            >
              Publish
            </button>
          }
        >
          <List
            items={this.props.formErrors.map(({ title, message }) => ({
              title,
              body: message,
              type: 'error',
            }))}
          />
        </HoverExpander>

        {this.renderTakeDownButton(atomPublishState)}

        <DeleteAtom
          atom={this.props.atom}
          deleteAtom={this.props.atomActions.deleteAtom}
        />
      </div>
    );
  };

  renderAtomStates = () => {
    return (
      <div className="toolbar__container">
        <div className="toolbar__item">{this.renderPublishedState()}</div>
        <div className="toolbar__item">{this.renderSaveState()}</div>
      </div>
    );
  };

  renderEmbeddedheader = () => {
    if (this.props.config.embeddedMode === 'edit') {
      return false;
    }

    return (
      <Link to="/find" className="toolbar__button">
        Back to Atom Search
      </Link>
    );
  };

  render() {
    if (this.props.config.isEmbedded) {
      return <div>{this.renderEmbeddedheader()}</div>;
    }

    if (this.props.atom) {
      return (
        <div className="toolbar__container toolbar__container--main">
          {this.renderAtomStates()}
          {this.renderHeaderRight()}
        </div>
      );
    }

    return false;
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as publishAtomActions from '../../actions/AtomActions/publishAtom.js';
import * as takeDownAtomActions from '../../actions/AtomActions/takeDownAtom.js';
import * as deleteAtomActions from '../../actions/AtomActions/deleteAtom.js';

function mapStateToProps(state) {
  return {
    formErrors: flattenFormErrors(state.formErrors),
    saveState: state.saveState,
    config: state.config,
    presence: state.presence,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(
      Object.assign(
        {},
        publishAtomActions,
        takeDownAtomActions,
        deleteAtomActions
      ),
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHeader);
