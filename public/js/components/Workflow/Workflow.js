import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType.js';
import {WorkflowStatus} from '../../constants/workflow';
import WorkflowApi from '../../services/WorkflowApi';
import { getStore } from '../../util/storeAccessor';
import {ManagedForm, ManagedField} from '../ManagedEditor';
import FormFieldSelectBox from '../FormFields/FormFieldSelectBox';
import FormFieldDateInput from '../FormFields/FormFieldDateInput';
import format from 'date-fns/format';
import _ from 'lodash';

class Workflow extends React.Component {

  static propTypes = {
    atom: atomPropType,
    config: PropTypes.shape({
      capiLiveUrl: PropTypes.string.isRequired,
      isEmbedded: PropTypes.bool.isRequired
    }),
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
    })])
  }

  state = {
    workflowSections: [],
    trackableAtomTypes: [],
    atomWorkflowInfo: {
      section: ''
    }
  }

  componentWillMount() {
    WorkflowApi.getTrackableAtomTypes()
    .then(atomTypes => {
      this.setState({
        trackableAtomTypes: atomTypes
      });

      if (this.state.trackableAtomTypes.includes(_.camelCase(this.props.atom.atomType))) {
        WorkflowApi.getSections()
        .then(sections => {
          this.setState({
            workflowSections: sections
          });
        });
      }
    });
  }

  updateWorkflowInfo = (info) => {
    this.setState({
      atomWorkflowInfo: info
    });
  }

  trackInWorkflow = () => {
    this.props.workflowActions.trackInWorkflow(
        this.props.atom,
        this.state.atomWorkflowInfo.section,
        this.state.atomWorkflowInfo.scheduledLaunchDate
    )
    .then(() => this.props.workflowActions.getWorkflowStatus(this.props.atom));
  }

  getWorkflowLink = () => {
    if (this.props.atom) {
      const workflowUrl = getStore().getState().config.workflowUrl;
      return `${workflowUrl}/dashboard?editorId=${this.props.atom.id}`;
    } return '';
  }

  getScheduledLaunchDate = () => {
    if (this.props.workflow.scheduledLaunchDate) {
      return format(this.props.workflow.scheduledLaunchDate, 'DD/MM/YYYY');
    }
    return 'Not set';
  }

  render() {
    const atomType = _.camelCase(this.props.atom.atomType);

    if (!this.state.trackableAtomTypes.includes(atomType)) {
      return (
        <div>Atoms with this type are not supported by workflow</div>
      );
    }

    if (this.props.workflow && this.props.workflow !== WorkflowStatus.notInWorkflow) {
      return (
        <div>
          <table className="workflow__info">
            <thead>
              <tr>
                <th>Title</th>
                <th>Production Office</th>
                <th>Section</th>
                <th>Status</th>
                <th>Scheduled Launch</th>
              </tr>
             </thead>
             <tbody>
               <tr>
                 <td>{this.props.workflow.title}</td>
                 <td>{this.props.workflow.prodOffice}</td>
                 <td>{this.props.workflow.section}</td>
                 <td>{this.props.workflow.status}</td>
                 <td>{this.getScheduledLaunchDate()}</td>
               </tr>
             </tbody>
           </table>
           <a target="_blank"
             rel="noopener noreferrer"
             href={this.getWorkflowLink()}>
             Open in Workflow
           </a>
         </div>
        );
    }

    return (
      <div>
        <ManagedForm data={this.state.atomWorkflowInfo} updateData={this.updateWorkflowInfo}>
          <ManagedField fieldLocation="section" name="Section">
            <FormFieldSelectBox selectValues={this.state.workflowSections} optionsAsObject={true} displayEmptyOption={true}/>
          </ManagedField>
          <ManagedField fieldLocation="scheduledLaunchDate" name="Scheduled Launch Date">
            <FormFieldDateInput placeholder="Pick launch date"/>
          </ManagedField>
        </ManagedForm>
        <button className="btn" onClick={this.trackInWorkflow} disabled={!this.state.atomWorkflowInfo.section}>
          Track in Workflow
        </button>
      </div>
    );
  }
}

export default Workflow;
