import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType.js';
import {allAtomTypes} from '../../constants/atomData.js';

import {ManagedForm, ManagedField} from '../ManagedEditor';
import {getTitleForAtom, isAtomWorkshopEditable} from '../../util/atomDataExtractors';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../FormFields/FormFieldArrayWrapper';
import FormFieldTagPicker from '../FormFields/FormFieldTagPicker';

export default class AtomEditHeader extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func
  }

  renderDate(dateType) {

    const dateInfo = this.props.atom.contentChangeDetails[dateType];

    if (!dateInfo) {
      return 'Never';
    }

    const date = new Date(dateInfo.date);
    const nameOfUser = dateInfo.user ? ` by ${dateInfo.user.firstName} ${dateInfo.user.lastName}` : '';
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} ${nameOfUser}`;
  }

  renderAtomTitleEdit = (atom) => {
    if(isAtomWorkshopEditable(atom)) {
      return (
        <ManagedForm data={atom} updateData={this.props.onUpdate} formName={`${atom.atomType.toLowerCase()}Editor`}>
          <ManagedField fieldLocation="title" name="Public title:">
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="commissioningDesks" name="Commissioning desks:">
            <FormFieldArrayWrapper>
              <FormFieldTagPicker tagType="tracking" />
            </FormFieldArrayWrapper>
        </ManagedField>
        </ManagedForm>
      );
    }

    return (
      <h4 className="atom-card__subheading">Title: {getTitleForAtom(atom)}</h4>
    );
  }


  render () {

    const atomTypeData = allAtomTypes.filter(atomData => {
      return atomData.type.toLowerCase() === this.props.atom.atomType.toLowerCase();
    })[0];

    const atomTypeName = atomTypeData ? atomTypeData.fullName : this.props.atom.atomType;

    return (
      <div className="atom-card--header" key={this.props.atom.atomType}>
        <div className="atom-card__icon">
          <img src={`/assets/images/typeicons/${this.props.atom.atomType.toLowerCase()}-icon.svg`} />
        </div>
        <div className="atom-card__details">
          <h3 className="atom-card__heading">{atomTypeName} Atom</h3>
          {this.renderAtomTitleEdit(this.props.atom)}
          <ul className="atom-card__dates">
            <li><b>Created: </b>{this.renderDate('created')}</li>
            <li><b>Last Modified: </b>{this.renderDate('lastModified')}</li>
            <li><b>Published: </b>{this.renderDate('published')}</li>
          </ul>
        </div>
      </div>
    );
  }
}
