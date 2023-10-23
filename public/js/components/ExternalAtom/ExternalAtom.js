import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType.js';
import {getAtomEditorUrl} from '../../util/atomDataExtractors';
import _capitalize from 'lodash/fp/capitalize';
import AtomEditHeader from '../AtomEdit/AtomEditHeader';

class ExternalAtom extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }),
    externalAtom: atomPropType,
    externalAtomActions: PropTypes.shape({
      getExternalAtom: PropTypes.func.isRequired
    })
  }

  UNSAFE_componentWillMount() {
      this.props.externalAtomActions.getExternalAtom(this.props.routeParams.atomType, this.props.routeParams.id);
  }

  renderEditorLink = (atom) => {
    return (
      <div>
        <p>Due to the complexity of this atom, it cannot be created from within the Atom Workshop directly.</p>
        <a target="_blank" href={getAtomEditorUrl(atom)} className="link">Open dedicated {_capitalize(atom.atomType)} atom editor</a>
      </div>
    );
  }

  render () {

    if(!this.props.externalAtom) {
      return (
        <div className="page__section page__section--centered">
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="atom-editor">
        <AtomEditHeader atom={this.props.externalAtom}/>
        <div className="atom-editor__form">
          {this.renderEditorLink(this.props.externalAtom)}
        </div>
      </div>
    );

  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as externalAtomActions from '../../actions/ExternalAtomActions/getExternalAtom';

function mapStateToProps(state) {
    return {
        externalAtom: state.externalAtom
    };
}

function mapDispatchToProps(dispatch) {
    return {
        externalAtomActions: bindActionCreators(Object.assign({}, externalAtomActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExternalAtom);
