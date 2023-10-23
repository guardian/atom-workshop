import React from 'react';
import {PropTypes} from 'prop-types';
import _isEqual from 'lodash/fp/isEqual';

import {allAtomTypes} from '../../constants/atomData';
import {getAtomByType} from '../../constants/atomData';
import {searchParams} from '../../constants/queryParams';
import {ManagedField} from '../ManagedEditor';
import SearchTextInput from '../FormFields/SearchFields/SearchTextInput';
import SearchCheckboxGroup from '../FormFields/SearchFields/SearchCheckboxGroup';
import SearchSelectBox from '../FormFields/SearchFields/SearchSelectBox';
import AtomListItem from '../AtomListItem/AtomListItem';


class AtomList extends React.Component {

  static propTypes = {
    config: PropTypes.shape({
      atomEditorUrls: PropTypes.shape({
        media: PropTypes.string
      }),
      isEmbedded: PropTypes.bool.isRequired
    }),
    queryParams: PropTypes.shape({
      q: PropTypes.string,
      types: PropTypes.array,
      'page-size': PropTypes.string
    }),
    atomListActions: PropTypes.shape({
      getAtomList: PropTypes.func.isRequired
    }).isRequired,
    queryParamsActions: PropTypes.shape({
      updateQueryParams: PropTypes.func.isRequired
    }),
    atomList: PropTypes.array
  };

  triggerSearch(overrideSearchQuery) {
    const searchQuery = overrideSearchQuery || this.props.queryParams;
    this.props.atomListActions.getAtomList(searchQuery);
  }

  componentDidMount() {
    this.props.queryParamsActions.updateQueryParams(Object.assign({}, searchParams, this.props.queryParams));
    this.triggerSearch();
  }

  componentWillReceiveProps(newProps) {
    if (!_isEqual(newProps.queryParams, this.props.queryParams)) {
      this.triggerSearch(Object.assign({}, searchParams, newProps.queryParams));
    }
  }

  updateAtomList = (newParams) => {
    this.props.queryParamsActions.updateQueryParams(newParams);
  };

  render () {

    if (!this.props.atomList) {
      return <div>Loading...</div>;
    }

    return (
      <div className="page__section">

        <div className="atom-search">

          <ManagedField data={this.props.queryParams} updateData={this.updateAtomList} fieldLocation="q" name="Search atoms">
            <SearchTextInput fieldPlaceholder="Search for atoms" />
          </ManagedField>

          <div className="atom-search__filters">
            <ManagedField data={this.props.queryParams}
              updateData={this.updateAtomList}
              fieldLocation="types"
              name="Atom Types">
              <SearchCheckboxGroup checkValues={allAtomTypes.reduce((o, t) => {o[t.type] = t.fullName; return o;}, {})}/>
            </ManagedField>

            <ManagedField data={this.props.queryParams} updateData={this.updateAtomList} fieldLocation="page-size" name="Page size">
              <SearchSelectBox selectValues={["20","50","100","150","200"]} />
            </ManagedField>
          </div>

        </div>

        <div className="atom-list">
          {this.props.atomList.filter((atom) => getAtomByType(atom.atomType) !== undefined).map((atom) => <AtomListItem atom={atom} config={this.props.config} key={atom.id}/>)}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomListActions from '../../actions/AtomListActions/getAtomList';
import * as updateQueryParamsActions from '../../actions/QueryParamsActions/updateQueryParams';

function mapStateToProps(state) {
  return {
    atomList: state.atomList,
    config: state.config,
    queryParams: state.queryParams
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomListActions: bindActionCreators(Object.assign({}, getAtomListActions), dispatch),
    queryParamsActions: bindActionCreators(Object.assign({}, updateQueryParamsActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomList);
