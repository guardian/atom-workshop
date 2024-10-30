import { pandaFetch } from './pandaFetch';
import {getStore} from '../util/storeAccessor';
import _ from 'lodash';
import getProductionOffice from '../util/getProductionOffice';
import moment from 'moment';

function getWorkflowUrl() { return getStore().getState().config.workflowUrl; }

export default {

  trackInWorkflow: (atom, section, scheduledLaunchDate, status) => {

    const getWorkflowPayload = (atom, section, scheduledLaunchDate, status) => {

      const prodOffice = getProductionOffice();
      const { contentChangeDetails } = atom;

      const lastModifiedDate = contentChangeDetails.lastModified
        ? moment(contentChangeDetails.lastModified.date)
        : null;

      const publishedDate = contentChangeDetails.published
        ? moment(contentChangeDetails.published.date)
        : null;

      const atomType = atom.atomType.toLowerCase();

      const headline = atom.data[atomType] && atom.data[atomType].title;

      const data = {
        contentType: _.camelCase(atom.atomType),
        editorId: atom.id,
        title: atom.title,
        priority: 0,
        needsLegal: 'NA',
        section: section,
        status: status,
        prodOffice: prodOffice,
        commissioningDesks: atom.commissioningDesks.join(),
        lastModified: lastModifiedDate,
        published: !!contentChangeDetails.published,
        timePublished: publishedDate,
        headline: headline,
        path: `atoms/${atom.atomType}/${atom.id}/edit`
      };

      if (!scheduledLaunchDate) {
        return data;
      }

      const momentLaunchDate = moment(scheduledLaunchDate);
      return Object.assign({}, data, {
        scheduledLaunchDate: moment(momentLaunchDate),
        note: `Launching ${momentLaunchDate.format("DD MMM YYYY HH:mm")}`
      });
    };

    const workflowUrl = getWorkflowUrl();
    const payload = getWorkflowPayload(atom, section, scheduledLaunchDate, status);

    return pandaFetch(
      `${workflowUrl}/api/stubs`,
      {
        method: 'post',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'Csrf-Token': window.guardian.csrf.token
        }
      }
    );
  },

  getSections() {

    const workflowUrl = getWorkflowUrl();

    return pandaFetch(
      `${workflowUrl}/api/sections`,
      {
        method: 'get',
        credentials: 'include',
        mode: 'cors',
        cache: 'default'
      }
    ).then(response => {
      return response.json();
    }).then(sections => {
      return _.orderBy(sections.data, 'name');
    });
  },

  getWorkflowStatus: (atom) => {

    const workflowUrl = getWorkflowUrl();

    return pandaFetch(
        `${workflowUrl}/api/atom/${atom.id}`,
        {
          method: 'get',
          credentials: 'include',
          mode: 'cors',
          cache: 'default'
        }
        ).then(response => {
          return response.json();
        });
  },

  getTrackableAtomTypes: () => {

    const workflowUrl = getWorkflowUrl();

    return pandaFetch(
        `${workflowUrl}/api/allowedAtomTypes`,
        {
          method: 'get',
          credentials: 'include',
          mode: 'cors',
          cache: 'default'
        }
        ).then(response => {
          return response.json();
        });
  }

};
