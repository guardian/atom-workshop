import { pandaFetch } from './pandaFetch';
import {getStore} from '../util/storeAccessor';

//expect atomPath in format atom/${AtomType}/${AtomId}
export const fetchTargetsForAtomPath = (atomPath) => {

  const store = getStore();
  const state = store.getState();
  const targetingUrl = state.config.targetingUrl;

  return pandaFetch(
    `${targetingUrl}api/suggestions/search?url=${atomPath}`,
    {
      method: 'get',
      credentials: 'include',
      mode: 'cors'
    }
  ).then(res => res.json());
};

export const createTarget = (targetObject) => {
  const store = getStore();
  const state = store.getState();
  const targetingUrl = state.config.targetingUrl;

  const targetingObjectWithContentChange = Object.assign({}, targetObject, {
    createdBy: state.config.user.email,
    createdAt: Date.now(),
    updatedBy: state.config.user.email,
    updatedAt: Date.now()
  });

  return pandaFetch(
    `${targetingUrl}api/suggestions`,
    {
      method: 'post',
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(targetingObjectWithContentChange),
      headers: {
        'Content-Type': 'application/json',
        'Csrf-Token': window.guardian.csrf.token
      }
    }
  );
};

export const deleteTarget = (targetId) => {

  const store = getStore();
  const state = store.getState();
  const targetingUrl = state.config.targetingUrl;

  return pandaFetch(
    `${targetingUrl}api/suggestions/${targetId}`,
    {
      method: 'delete',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

export const fetchTargetsForTags = (tags) => {

  const store = getStore();
  const state = store.getState();
  const targetingUrl = state.config.targetingUrl;

  const tagsParams = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');

  return pandaFetch(
    `${targetingUrl}api/suggestions/search?${tagsParams}`,
    {
      method: 'get',
      credentials: 'include',
      mode: 'cors'
    }
  ).then(res => res.json());
};
