import React from 'react';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../../constants/atomPropType';
import AutomaticDataFetch from "./AudioFields/AutomaticDataFetch";

export class AudioEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
  };

  render () {
    return (
      <div>
        <AutomaticDataFetch onUpdate={this.props.onUpdate} atom={this.props.atom} />
      </div>
    );
  }
}