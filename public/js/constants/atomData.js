//Add a defition for each atom here
//typeName - should match name in thrift definition
//fullName - The human readable name (Don't include "Atom")
//description - A brief description of what they are and when you use them
//editorUri - a lodash template that will be passed gutoolsDomain, atomId, atomType
//createUri - a lodash template that will be passed gutoolsDomain.
//statsUrl - a lodash template that will be passed atomId, atomType

import { PropTypes } from 'prop-types';
import _template from 'lodash/fp/template';
import { logInfo } from '../util/logger';
import { getStore } from '../util/storeAccessor';

export const cta = {
  type: 'cta',
  fullName: 'Call To Action',
  description: 'A call to action designed for use in GLabs Hosted Content',
};

export const quiz = {
  type: 'quiz',
  fullName: 'Quiz',
  description:
    'Questions and Answer format, allowing both knowledge and personality type quizzes',
  editorUri: _template('https://quizzes.${gutoolsDomain}/quiz/${atomId}'),
  createUri: _template('https://quizzes.${gutoolsDomain}'),
};

export const media = {
  type: 'media',
  fullName: 'Video',
  description:
    'A Guardian produced video, with rich tracking and thumbnail. Generally hosted on YouTube',
  editorUri: _template('https://video.${gutoolsDomain}/videos/${atomId}'),
  createUri: _template('https://video.${gutoolsDomain}/videos/create'),
};

export const qa = {
  type: 'qanda',
  fullName: 'Q & A',
  description: 'A <b>single</b> question with a <b>single</b> answer',
};

export const guide = {
  type: 'guide',
  fullName: 'Quick Guide',
  description: '<b>Multiple</b> questions and answers on a single theme',
};

export const profile = {
  type: 'profile',
  fullName: 'Profile',
  description: 'A quick guide for a person or institution',
};

export const timeline = {
  type: 'timeline',
  fullName: 'Timeline',
  description:
    'A series of key events to help readers navigate an ongoing story',
};

export const explainer = {
  type: 'explainer',
  fullName: 'Explainer Text',
  description:
    'Edit legacy Explainer snippets - (creating new ones is not supported)',
};

export const commonsDivision = {
  type: 'commonsdivision',
  fullName: 'Commons Division',
  description: 'House of Commons division results',
};

export const audio = {
  type: 'audio',
  fullName: 'Audio',
  description: 'An audio player for clips or full podcasts',
};

export const allAtomTypes = [
  qa,
  guide,
  profile,
  timeline,
  media,
  cta,
  audio,
  quiz,
  explainer,
  commonsDivision,
];
export const workshopEditableAtomTypes = [
  qa,
  guide,
  profile,
  timeline,
  explainer,
  commonsDivision,
  cta,
  audio,
];

export const snippetAtomTypes = [qa, guide, profile, timeline];
export const legacyAtomTypes = [explainer];
export const experimentalAtomTypes = [commonsDivision];

export function getNonEditableAtomTypes() {
  return allAtomTypes.filter(atomType => {
    return (
      !workshopEditableAtomTypes.includes(atomType) &&
      !legacyAtomTypes.includes(atomType)
    );
  });
}

export const editableNonSnippetAtomTypes = workshopEditableAtomTypes.filter(
  atomType => {
    return (
      !snippetAtomTypes.includes(atomType) &&
      !legacyAtomTypes.includes(atomType) &&
      !experimentalAtomTypes.includes(atomType)
    );
  }
);

export function getAtomByType(typeString) {
  return allAtomTypes.find(
    atomData => atomData.type.toLowerCase() === typeString.toLowerCase()
  );
}

export function isAtomTypeEditable(typeString) {
  const matchingType = workshopEditableAtomTypes.find(
    atomData => atomData.type.toLowerCase() === typeString.toLowerCase()
  );
  return !!matchingType;
}

export function doesAtomTypeRequireTagging(typeString) {
  return snippetAtomTypes.find(
    atomData => atomData.type.toLowerCase() === typeString.toLowerCase()
  );
}

export function getCreateUrlFromAtomType(atomType) {
  if (isAtomTypeEditable(atomType.type)) {
    return `/create/${atomType.type}`;
  } else if (!atomType.createUri) {
    logInfo(`Create URI requested for type ${atomType.type}, none found`);
    return;
  }

  const store = getStore();
  const state = store.getState();

  return atomType.createUri({
    gutoolsDomain: state.config.atomEditorGutoolsDomain,
  });
}

//Keep this together with the data
export const AtomTypePropType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});
