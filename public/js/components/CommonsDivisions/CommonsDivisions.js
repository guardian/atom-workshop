import React from 'react';
import {PropTypes} from 'prop-types';
import {CommonsDivisionResultPropType} from '../../actions/ParliamentActions/getLatestCommonsDivisions.js';
import CommonsDivision from './CommonsDivision';
import moment from 'moment';

class CommonsDivisions extends React.Component {
  static propTypes = {
    commonsDivisions: PropTypes.arrayOf(CommonsDivisionResultPropType),
    atomActions: PropTypes.shape({
      getLatestCommonsDivisions: PropTypes.func.isRequired
    }).isRequired
  };

  componentWillMount() {
    this.props.atomActions.getLatestCommonsDivisions();
  }

  render() {
    if (this.props.commonsDivisions) {
      return (
        <div>
          <h2 className="divisions-heading">Latest Commons Divisions (as of {moment().format("HH:mm")})</h2>
          <div className="atom-editor divisions-container">
            <ul className="divisions-list">
            {
              this.props.commonsDivisions.map(data => {
                return (<CommonsDivision key={data.division.parliamentId} atom={data.atom} division={data.division}/>);
              })
            }
            </ul>
          </div>
        </div>
      );
    } else {
      return (<div>Loading the latest commons divisions from data.parliament.uk...</div>);
    }
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getLatestCommonsDivisions from '../../actions/ParliamentActions/getLatestCommonsDivisions.js';

function mapStateToProps(state) {
  return {
    commonsDivisions: state.commonsDivisions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getLatestCommonsDivisions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommonsDivisions);
