import {allAtomTypes, workshopEditableAtomTypes} from '../constants/atomData.js';
import {logInfo} from './logger';
import { getStore } from './storeAccessor';


export function getTitleForAtom(atom) {

    if (atom.title) {
        return atom.title;
    }

    switch(atom.atomType) {
        case ("cta"): return atom.data.cta.label;
        case ("media"): return atom.data.media.title;
        case ("qanda"): return atom.title;
        case ("guide"): return atom.title;
        case ("profile"): return atom.title;
        case ("timeline"): return atom.title;
        case ("explainer"): return atom.data.explainer.title;
    }
}

export function getAtomTypeForAtom(atom) {
  const atomTypeString = atom.atomType.toLowerCase();
  return allAtomTypes.find((atomType) => atomType.type.toLowerCase() === atomTypeString);
}

export function isAtomWorkshopEditable(atom) {
  const atomTypeString = atom.atomType.toLowerCase();
  const matchingAtomType = workshopEditableAtomTypes.find((atomType) => atomType.type.toLowerCase() === atomTypeString);

  return matchingAtomType ? true : false;
}

export function getAtomEditorUrl(atom) {

  if (isAtomWorkshopEditable(atom)) {
    logInfo("Atom Editor Url requested for AtomWorkshop atom.");
    logInfo("You should probably use isAtomWorkshopEditable and switch to a react-route <Link /> instead");
    return `/atom/${atom.atomType}/${atom.id}`;
  }

  const atomType = getAtomTypeForAtom(atom);

  if (atomType.editorUri) {

    const store = getStore();
    const state = store.getState();

    return atomType.editorUri({
      atomId: atom.id,
      atomType: atom.type,
      gutoolsDomain: state.config.atomEditorGutoolsDomain
    });
  }
}
