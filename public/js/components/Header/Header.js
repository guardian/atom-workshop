import React from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router';
import {routerShape} from 'react-router/lib/PropTypes';

import {atomPropType} from '../../constants/atomPropType';
import EditHeader from './EditHeader';
import BrowseHeader from './BrowseHeader';

class Header extends React.Component {

  static propTypes = {
    atom: atomPropType,
    presence: PropTypes.bool,
    config: PropTypes.shape({
      isEmbedded: PropTypes.bool.isRequired
    }),
    router: routerShape,
    isFindPage: PropTypes.bool.isRequired
  };

  render () {

    return (
        <div className={this.props.config.isEmbedded ? 'toolbar toolbar--embedded' : 'toolbar'}>
          {!this.props.config.isEmbedded ?
            <header className="toolbar__container">
              <Link className="toolbar__title" href="/">
                <div className="toolbar__page-icon"></div>
                <div className="toolbar__logo"></div>
                <div className="toolbar__title__hover-state">
                  <span className="toolbar__title__hover-state__title">
                    Back to <strong>dashboard</strong>
                  </span>
                </div>
              </Link>
            </header>
          : false}
          {this.props.isFindPage ? <BrowseHeader /> : <EditHeader atom={this.props.atom} presence={this.props.presence}/>}
        </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return {
    atom: state.atom,
    config: state.config
  };
}

export default connect(mapStateToProps)(Header);
