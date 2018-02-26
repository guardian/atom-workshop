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

  takeDownAtom: (atom) => {
    return pandaFetch(
      `/api/live/${atom.atomType}/${atom.id}`,
      {
        method: 'delete',
        credentials: 'same-origin',
        body: JSON.stringify(atom),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },

  deleteAtom: (atom) => {
    return pandaFetch(
      `/api/preview/${atom.atomType}/${atom.id}`,
      {
        method: 'delete',
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
  },

  createNotificationList: (atom) =>
      pandaFetch(
        `/api/live/${atom.atomType}/${atom.id}/custom/notifications`,
        {
          method: 'post',
          credentials: 'same-origin'
        }
      )
  ,

  deleteNotificationList: (atom) =>
      pandaFetch(
        `/api/live/${atom.atomType}/${atom.id}/custom/notifications`,
        {
          method: 'delete',
          credentials: 'same-origin'
        }
      )
  ,

  sendNotificationList: (atom) =>
      pandaFetch(
        `/api/live/${atom.atomType}/${atom.id}/custom/notifications/send`,
        {
          method: 'post',
          credentials: 'same-origin'
        }
      ),

  hasNotificationBeenSent: (atomId, questionId) =>
      pandaFetch(
        `/api/live/storyquestions/${atomId}/${questionId}/notifications/sent`,
        {
          method: 'get',
          credentials: 'same-origin'
        }
      )
};
