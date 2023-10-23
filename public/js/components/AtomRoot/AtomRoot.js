import React from 'react';
import {PropTypes} from 'prop-types';
import AtomEmbed from '../AtomEmbed/AtomEmbed';
import {atomPropType} from '../../constants/atomPropType.js';

class AtomRoot extends React.Component {

  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atomActions: PropTypes.shape({
      getAtom: PropTypes.func.isRequired,
    }).isRequired,
    workflowActions: PropTypes.shape({
      getWorkflowStatus: PropTypes.func.isRequired,
      trackInWorkflow: PropTypes.func.isRequired
    }),
    workflow: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
      title: PropTypes.string,
      prodOffice: PropTypes.string,
      section: PropTypes.string,
      status: PropTypes.string,
      scheduledLaunch: PropTypes.string
    })]),
    atom: atomPropType,
    config: PropTypes.shape({
      liveCapiUrl: PropTypes.string
    }),
    children: PropTypes.element.isRequired
  }


  componentWillMount() {
    this.props.atomActions.getAtom(this.props.routeParams.atomType, this.props.routeParams.id)
    .then(() => {
      this.props.workflowActions.getWorkflowStatus(this.props.atom);
    });
  }


  render () {

    return (
      <div className="atom">
        <AtomEmbed atom={this.props.atom} config={this.props.config} workflow={this.props.workflow} workflowActions={this.props.workflowActions}/>
        <div className="atom__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomActions from '../../actions/AtomActions/getAtom.js';
import * as trackInWorkflowActions from '../../actions/WorkflowActions/trackInWorkflow.js';
import * as getStatusActions from '../../actions/WorkflowActions/getStatus.js';

function mapStateToProps(state) {
  return {
    config: state.config,
    atom: state.atom,
    workflow: state.workflow
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getAtomActions), dispatch),
    workflowActions: bindActionCreators(Object.assign({}, trackInWorkflowActions, getStatusActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomRoot);
