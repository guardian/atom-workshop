import React from 'react';
import {Link} from 'react-router';
import {AtomTypePropType, getCreateUrlFromAtomType} from '../../constants/atomData';
import {AtomTypeCard} from '../AtomTypeCard/AtomTypeCard';

class AtomCreateExternalApp extends React.Component {

  static propTypes = {
    atomType: AtomTypePropType
  }

  render () {
    return (
      <div className="atom-editor">
        <h1 className="atom-editor__title">{`Create new ${this.props.atomType.name}`}</h1>
        <div className="atom-editor__section">
          <AtomTypeCard atomType={this.props.atomType} />
          <Link className="atom-editor__switchtype" to="/create">Select different atom</Link>
        </div>
        <div>
          Due to the complexity of this atom, it cannot be created from within the Atom Workshop directly.
        </div>
        <div className="center">
          <a className="atom-editor__external" target="_blank" rel="noreferrer" href={getCreateUrlFromAtomType(this.props.atomType)}>Open Dedicated Editor</a>
        </div>
      </div>
    );
  }
}

export default AtomCreateExternalApp;
