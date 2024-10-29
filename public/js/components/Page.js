import React from 'react';
import {PropTypes} from 'prop-types';
import Header from './Header/Header';
import AppMessage from './AppMessage/AppMessage';

import { routerShape } from 'react-router/lib/PropTypes';

class Page extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired
    }),
    error: PropTypes.string,
    router: routerShape
  };

  isFindPage() {
    return this.props.router.isActive("/find");
  }

  render() {
    return (
      <div className={this.props.config.isEmbedded ? "page is-embedded" : "page"}>
        <div className="page__header">
          <Header router={this.props.router} isFindPage={this.isFindPage()} />
          <AppMessage error={this.props.error} />
        </div>
        <div className="page__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    config: state.config,
    error: state.error
  };
}


export default connect(mapStateToProps)(Page);
