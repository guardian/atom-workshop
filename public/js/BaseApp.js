import React, {PropTypes} from 'react';
import { Provider } from 'react-redux';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router';

import {Page} from './components/Page';
import {AtomCreateTypeSelect} from './components/AtomCreate/AtomCreateTypeSelect';
import AtomCreateGenericInfo from './components/AtomCreate/AtomCreateGenericInfo';
import AtomEdit from './components/AtomEdit/AtomEdit';

export class BaseApp extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory}>
          <Route path="/" component={Page}>
            <Route path="/create" component={AtomCreateTypeSelect} />
            <Route path="/create/:atomType" component={AtomCreateGenericInfo} />
            <Route path="/atoms/:atomType/:id/edit" component={AtomEdit} />
            <IndexRedirect to="/create" />
          </Route>
        </Router>
      </Provider>
    );
  }
}
