import React from 'react';
import {render} from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';

import configurePresence from './util/configurePresence';
import {configureStore} from './util/store';
import {setStore} from './util/storeAccessor';
import {paramStringToObject} from './util/urlParameters';

import {BaseApp} from './BaseApp.js';

import '../styles/main.scss';
import '@guardian/prosemirror-editor/dist/style.css'

function extractConfigFromPage() {
  const configEl = document.getElementById('config');
  if (!configEl) {
    return {};
  }
  return JSON.parse(configEl.innerHTML);
}

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const config = extractConfigFromPage();
const presenceClient = config.presenceEnabled ? configurePresence(config.presenceDomain, config.user) : {};

setStore(store);

// Send config to store on init
store.dispatch({
  type:       'CONFIG_RECEIVED',
  config:     config,
  receivedAt: Date.now()
});

// Start presence on init
store.dispatch({
  type: 'PRESENCE_CLIENT_STARTED',
  presenceClient: presenceClient,
  receivedAt: Date.now()
});

// Get initial URL params
store.dispatch({
  type: "QUERYPARAMS_UPDATE",
  queryParams: paramStringToObject(location.search),
  receivedAt: Date.now()
});

const renderComponent = Component => {
  render(
    <AppContainer>
        <Component store={store} history={history}/>
    </AppContainer>
  , document.getElementById('react-mount'));
};

renderComponent(BaseApp);

/* global module:false */
if (module.hot) {
  module.hot.accept('./BaseApp', () => {
    renderComponent(BaseApp);
  });
}