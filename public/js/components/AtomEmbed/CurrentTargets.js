import React from 'react';
import {PropTypes} from 'prop-types';
import { atomPropType } from '../../constants/atomPropType';
import {
  fetchTargetsForAtomPath,
  deleteTarget,
} from '../../services/TargetingApi';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import CreateTargetForm from './CreateTargetForm';
import { connect } from 'react-redux';
import { updateFormErrors } from '../../actions/FormErrorActions/updateFormErrors';
import { doesAtomTypeRequireTagging } from '../../constants/atomData';

const taggingRequiredError = {
  title: 'required',
  message: 'You must add at least one tag before publishing your atom',
};

class CurrentTargets extends React.Component {
  static propTypes = {
    atom: atomPropType,
    dispatch: PropTypes.func,
  };

  state = {
    targets: [],
    fetching: false,
    editing: false,
  };

  componentDidMount() {
    this.fetchTargets();
  }

  calculateAtomPath = () => {
    const atom = this.props.atom;
    return `/atom/${atom.atomType.toLowerCase()}/${atom.id}`;
  };

  fetchTargets = () => {
    this.setState({ fetching: true });
    fetchTargetsForAtomPath(this.calculateAtomPath()).then(targets => {
      this.setState({
        targets: targets,
        fetching: false,
      });
    });
  };

  componentDidUpdate = () => {
    if (doesAtomTypeRequireTagging(this.props.atom.atomType)) {
      this.props.dispatch(
        updateFormErrors({
          currentTargets: {
            'Tags required':
              this.state.targets.length > 0 ? [] : [taggingRequiredError],
          },
        })
      );
    }
  };

  toggleEditMode = () => {
    this.setState({
      editing: !this.state.editing,
      currentTarget: {},
    });
  };

  deleteTarget = target => {
    deleteTarget(target.id).then(() => {
      this.fetchTargets();
    });
  };

  renderTarget = (target, i) => {
    return (
      <div className="targeting__target">
        <div className="targeting__target__title">Target {i + 1}</div>
        <a
          className="targeting__target__delete"
          onClick={this.deleteTarget.bind(this, target)}
        >
          <img
            className="targeting__target__delete"
            src="/assets/images/delete-icon.svg"
          />
        </a>
        <ul className="targeting__target__tags">
          {target.tagPaths.map(tagPath => (
            <li key={tagPath}>{tagPath}</li>
          ))}
        </ul>
        <div>
          Expires{' '}
          {distanceInWordsToNow(target.activeUntil, { addSuffix: true })}{' '}
        </div>
      </div>
    );
  };

  renderTargets() {
    if (this.state.fetching) {
      return <div>Fetching...</div>;
    }

    if (!this.state.targets || !this.state.targets.length) {
      return;
    }

    return (
      <div className="targeting__targets">
        {this.state.targets.map(this.renderTarget)}
      </div>
    );
  }

  render() {
    return (
      <div className="targeting">
        {this.renderTargets()}
        {this.state.editing ? (
          <CreateTargetForm
            atomPath={this.calculateAtomPath()}
            title={this.props.atom.title}
            triggerTargetFetch={this.fetchTargets}
            toggleEditMode={this.toggleEditMode}
          />
        ) : (
          <button className="btn" onClick={this.toggleEditMode}>
            Add tag
          </button>
        )}
      </div>
    );
  }
}

export default connect()(CurrentTargets);
