import React from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router';
import {getAtomByType, isAtomTypeEditable} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard.js';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../FormFields/FormFieldArrayWrapper';
import FormFieldTagPicker from '../FormFields/FormFieldTagPicker';
import AtomCreateExternalApp from './AtomCreateExternalApp';

class AtomCreateGenericInfo extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.String
    }).isRequired,
    atomActions: PropTypes.shape({
      createAtom: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    title: "",
    commissioningDesks: []
  }

  updateTitle = (newTitle) => {
    this.setState({
      title: newTitle
    });
  }

  updateTags = (tags) => {
    this.setState({
      commissioningDesks: tags
    });
  }

  triggerAtomCreate = (e) => {
    e.preventDefault();

    this.props.atomActions.createAtom(this.props.routeParams.atomType, {
      title: this.state.title,
      commissioningDesks: this.state.commissioningDesks
    });
  }

  shouldEnableCreateButton = () => {
    if (!this.state.title || !this.state.title.length) {
      return false;
    }

    return true;
  }

  render () {

    const atomType = getAtomByType(this.props.routeParams.atomType);

    if (!atomType) {
      return <div>Unrecognised Atom Type</div>;
    }

    if (!isAtomTypeEditable(this.props.routeParams.atomType)) {
      return <AtomCreateExternalApp atomType={atomType} />;
    }

    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{`Create new ${this.props.routeParams.atomType}`}</h1>
        <div className="atom-editor__section">
          <AtomTypeCard atomType={atomType} />
          <Link className="atom-editor__switchtype" to="/create">Select different atom</Link>
        </div>
        <form className="form">
          <FormFieldTextInput
            fieldLabel="Public title"
            fieldName="title"
            fieldValue={this.state.title}
            fieldPlaceholder="Enter a title for this atom"
            onUpdateField={this.updateTitle}
          />
          <FormFieldArrayWrapper 
            onUpdateField={this.updateTags}
            fieldName="commissioningDesks" 
            fieldLabel="Commissioning desks:" 
            fieldValue={this.state.commissioningDesks}
            >
            <FormFieldTagPicker tagType="tracking" />
          </FormFieldArrayWrapper>
          <button className="btn" type="submit" disabled={!this.shouldEnableCreateButton()} onClick={this.triggerAtomCreate}>Create Atom</button>
        </form>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as createAtomActions from '../../actions/AtomActions/createAtom.js';

function mapStateToProps(state) {
  return {
    config: state.config
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, createAtomActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomCreateGenericInfo);
