import React from 'react';
import {PropTypes} from 'prop-types';
import {CTAEditor} from './CustomEditors/CTAEditor';
import {RecipeEditor} from './CustomEditors/RecipeEditor';
import {QAndAEditor} from './CustomEditors/QAndAEditor';
import {GuideEditor} from './CustomEditors/GuideEditor';
import {ProfileEditor} from './CustomEditors/ProfileEditor';
import {TimelineEditor} from './CustomEditors/TimelineEditor';
import {ExplainerEditor} from './CustomEditors/ExplainerEditor';
import {CommonsDivisionEditor} from './CustomEditors/CommonsDivisionEditor';
import {ChartEditor} from './CustomEditors/ChartEditor';
import {AudioEditor} from './CustomEditors/AudioEditor';
import EmbeddedAtomPick from './EmbeddedAtomPick';
import {subscribeToPresence, enterPresence} from '../../services/presence';
import AtomEditHeader from './AtomEditHeader';
import {atomPropType} from '../../constants/atomPropType';
import {logError} from '../../util/logger';
import AtomsApi from '../../services/AtomsApi';

class AtomEdit extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      defaultHtml: PropTypes.string
    }).isRequired,
    atomActions: PropTypes.shape({
      updateAtom: PropTypes.func.isRequired,
      publishAtom: PropTypes.func.isRequired
    }).isRequired,
    formErrorActions: PropTypes.shape({
      updateFormErrors: PropTypes.func
    }),
    atom: atomPropType,
    config: PropTypes.shape({
      gridUrl: PropTypes.string,
      visualsUrl: PropTypes.string,
      embeddedMode: PropTypes.string,
      isEmbedded: PropTypes.bool.isRequired
    })
  }

  UNSAFE_componentWillMount() {
    subscribeToPresence(this.props.routeParams.atomType, this.props.routeParams.id);
  }

  updateAtom = (newAtom) => {
    try {
        enterPresence(this.props.routeParams.atomType, this.props.routeParams.id);
    } catch (e) {
        logError(e);
    } finally {
        this.props.atomActions.updateAtom(newAtom);
    }
  }

  updateChartAtom = () => {
    try {
      enterPresence(this.props.routeParams.atomType, this.props.routeParams.id);
    } catch (e) {
      logError(e);
    } finally {
      AtomsApi.getAtom(this.props.routeParams.atomType, this.props.routeParams.id)
    .then(res => res.json()).then(atom => {
          this.props.atomActions.updateAtom(atom);
        });
    }
  }

  updateFormErrors = (errors) => {
    this.props.formErrorActions.updateFormErrors(errors);
  }

  renderSpecificEditor () {

    //TODO: This is brittle, can we improve?
    const atomType = this.props.atom.atomType.toLowerCase();

    switch (atomType) {
      case ("cta"):
        return <CTAEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("recipe"):
        return <RecipeEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("qanda"):
        return <QAndAEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("guide"):
        return <GuideEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("profile"):
        return <ProfileEditor atom={this.props.atom} onUpdate={this.updateAtom} config={this.props.config} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("timeline"):
        return <TimelineEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case("explainer"):
        return <ExplainerEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      case ("commonsdivision"):
        return <CommonsDivisionEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
       case ("chart"):
        return <ChartEditor atom={this.props.atom} config={this.props.config} onUpdate={this.updateChartAtom} />;
      case ("audio") :
        return <AudioEditor atom={this.props.atom} onUpdate={this.updateAtom} onFormErrorsUpdate={this.updateFormErrors} />;
      default:
        return (
          <div>Atom Workshop cannot edit this type of atom currently</div>
        );
    }
  }

  renderEmbeddedCreate() {
    if (!this.props.config.isEmbedded || this.props.config.embeddedMode !== "browse") {
      return false;
    }

    return <EmbeddedAtomPick atom={this.props.atom} publishAtom={this.props.atomActions.publishAtom}/>;
  }

  render() {
    if (!this.props.atom) {
      return <div>Loading...</div>;
    }

    return (
        <div className="atom-editor">
          {this.renderEmbeddedCreate()}
          <AtomEditHeader atom={this.props.atom} onUpdate={this.updateAtom}/>
          <form className="atom-editor__form">
            {this.renderSpecificEditor()}
          </form>
        </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as updateAtomActions from '../../actions/AtomActions/updateAtom.js';
import * as publishAtomActions from '../../actions/AtomActions/publishAtom.js';
import * as updateFormErrors from '../../actions/FormErrorActions/updateFormErrors.js';

function mapStateToProps(state) {
  return {
    config: state.config,
    atom: state.atom,
    presence: state.presence,
    formErrors: state.formErrors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, updateAtomActions, publishAtomActions), dispatch),
    formErrorActions: bindActionCreators(Object.assign({}, updateFormErrors), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomEdit);
