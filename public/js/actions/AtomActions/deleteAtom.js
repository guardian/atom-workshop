import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomDelete(atom) {
  return {
    type:       'ATOM_DELETE_REQUEST',
    atom:        atom,
    receivedAt: Date.now()
  };
}

function errorDeletingAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not delete atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function deleteAtom(atom) {
  return dispatch => {
    dispatch(requestAtomDelete(atom));

    return AtomsApi.deleteAtom(atom)
        .then(res => res.json())
        .then(() =>
          window.location.href = window.location.origin + '/'
        ).catch(error =>
          dispatch(errorDeletingAtom(error))
        );
  };
}
