import { pandaFetch } from './pandaFetch';

export default {

  getAtom: (atomType, atomId) => {
    return pandaFetch(
      `/api/preview/${atomType}/${atomId}`,
      {
        method: 'get',
        credentials: 'same-origin'
      }
    );
  },


  createAtom: (atomType, atomInfo) => {
    return pandaFetch(
      `/api/preview/${atomType}`,
      {
        method: 'post',
        credentials: 'same-origin',
        body: JSON.stringify(atomInfo),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },

  updateAtom: (atom) => {
    return pandaFetch(
      `/api/preview/${atom.atomType}/${atom.id}`,
      {
        method: 'put',
        credentials: 'same-origin',
        body: JSON.stringify(atom),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },

  publishAtom: (atom) => {
    return pandaFetch(
      `/api/live/${atom.atomType}/${atom.id}`,
      {
        method: 'post',
        credentials: 'same-origin',
        body: JSON.stringify(atom),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
