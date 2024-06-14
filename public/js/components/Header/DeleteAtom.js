import React from 'react';
import {PropTypes} from 'prop-types';
import { getStore } from '../../util/storeAccessor';

export default class DeleteAtom extends React.Component {
  static propTypes = {
    atom: PropTypes.object.isRequired,
    deleteAtom: PropTypes.func.isRequired
  };

  // the permissions are also validated on the server-side for each request
  // TODO not currently true - must update server to actually do the validation!! ^
  permissions = getStore().getState().config.permissions;
  showActions = this.permissions.deleteAtom;

  state = { deleteDoubleCheck: false };

  renderDelete() {
    if (!this.permissions.deleteAtom) {
      return false;
    }

    const deleteMsg = this.state.deleteDoubleCheck
      ? 'Confirm delete from database'
      : 'Delete from database';

    const doDelete = () => {
      if (this.state.deleteDoubleCheck) {
        this.props.deleteAtom(this.props.atom);
      } else {
        this.setState({ deleteDoubleCheck: true });
      }
    };

    return (
      <button
        className="btn btn--margin btn--red"
        onClick={doDelete}
      >
        {deleteMsg}
      </button>
    );
  }

  render() {
    if (!this.showActions) {
      return false;
    }

    return this.renderDelete();
  }
}
