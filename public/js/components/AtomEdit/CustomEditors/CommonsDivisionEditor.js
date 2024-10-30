import React from 'react';
import {PropTypes} from 'prop-types';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import moment from 'moment';
import {atomPropType} from '../../../constants/atomPropType';

export class CommonsDivisionEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  };

  renderDetails(details) {
    return (
      <div>
        <div>
          <b>Date of vote: </b>
          <span>{moment(details.date).format("DD/MM/YYYY")}</span>
        </div>
        <div>
          <table className={"divisions-table"}>
            <tbody>
              <tr>
                <th>Ayes</th>
                <th>Noes</th>
              </tr>
              <tr>
                <td>{details.votes.ayes.length}</td>
                <td>{details.votes.noes.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="commonsDivisionEditor">
          <ManagedField fieldLocation="data.commonsDivision.description" name="Description">
            <FormFieldTextInput />
          </ManagedField>
        </ManagedForm>
        {this.props.atom.data.commonsDivision ? this.renderDetails(this.props.atom.data.commonsDivision) : null }
      </div>
    );
  }
}
