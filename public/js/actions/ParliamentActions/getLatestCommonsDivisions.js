import {latestCommonsDivisions} from '../../services/Parliament';
import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';
import {PropTypes} from 'prop-types';
import {atomPropType} from '../../constants/atomPropType';

const MPPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired
});

export const CommonsDivisionPropType = PropTypes.shape({
  parliamentId: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  votes: PropTypes.shape({
    ayes: PropTypes.arrayOf(MPPropType),
    noes: PropTypes.arrayOf(MPPropType)
  })
});

export const CommonsDivisionResultPropType = PropTypes.shape({
  division: CommonsDivisionPropType.required,
  atom: atomPropType
});

function requestLatestCommonsDivisions() {
  return {
    type:       'COMMONS_DIVISIONS_GET_REQUEST',
    receivedAt: Date.now()
  };
}

function receiveLatestCommonsDivisions(commonsDivisions) {
  return {
    type:       'COMMONS_DIVISIONS_GET_RECEIVE',
    commonsDivisions: commonsDivisions,
    receivedAt: Date.now()
  };
}

function errorReceivingLatestCommonsDivisions(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get latest commons divisions',
    error:      error,
    receivedAt: Date.now()
  };
}

/**
 * Gets latest divisions from parliament api, and checks for existing atoms.
 * Returns an array of CommonsDivisionResultPropType
 */
export function getLatestCommonsDivisions() {
  return dispatch => {
    dispatch(requestLatestCommonsDivisions());

    return latestCommonsDivisions()
      .then(data => {
        const items = data.result.items;
        return Promise.all(items.map(item => {
          const parliamentId = item["_about"].split("/").pop();
          const id = `division-${parliamentId}`;

          const divisionData = {
            division: {
              parliamentId: parliamentId,
              date: item.date["_value"],
              title: item.title
            }
          };

          return AtomsApi.getAtom("commonsdivision", id)
            .then(res => res.json())
            .then(atom => {
              divisionData.atom = atom;
              return divisionData;
            })
            .catch(() => divisionData); //No atom exists, this is fine
        }));
      })
      .then(results => {
        dispatch(receiveLatestCommonsDivisions(results));
      })
      .catch(error => {
        dispatch(errorReceivingLatestCommonsDivisions(error));
      });
  };
}
