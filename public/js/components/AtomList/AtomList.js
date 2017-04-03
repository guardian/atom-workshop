import React, { PropTypes } from 'react';

import {allAtomTypes} from '../../constants/atomData';
import {ManagedField} from '../ManagedEditor';
import SearchTextInput from '../FormFields/SearchFields/SearchTextInput';
import SearchCheckboxGroup from '../FormFields/SearchFields/SearchCheckboxGroup';
import SearchSelectBox from '../FormFields/SearchFields/SearchSelectBox';
import AtomListItem from '../AtomListItem/AtomListItem';


class AtomList extends React.Component {

  static propTypes = {
    config: PropTypes.shape({
      atomEditorUrls: PropTypes.shape({
        explainer: PropTypes.string,
        media: PropTypes.string
      }),
      isEmbedded: PropTypes.bool.isRequired
    }),
    queryParams: PropTypes.object,
    atomListActions: PropTypes.shape({
      getAtomList: PropTypes.func.isRequired
    }).isRequired,
    queryParamsActions: PropTypes.shape({
      updateQueryParams: PropTypes.func.isRequired
    }).isRequired,
    atomList: PropTypes.array
  };

  componentWillMount() {
    this.props.atomListActions.getAtomList(this.props.queryParams);
  }

  updateAtomList = (newParams) => {
    this.props.atomListActions.getAtomList(newParams);
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
              <SearchCheckboxGroup checkValues={allAtomTypes.map((t)=>t.type)}/>
            </ManagedField>

            <ManagedField data={this.props.queryParams} updateData={this.updateAtomList} fieldLocation="page-size" name="Page size">
              <SearchSelectBox selectValues={["20","50","100","150","200"]} />
            </ManagedField>
          </div>

        </div>

        <div className="atom-list">
          {this.props.atomList.map((atom) => <AtomListItem atom={atom} config={this.props.config} key={atom.id}/>)}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomListActions from '../../actions/AtomListActions/getAtomList';
import * as updateQueryParamsActions from '../../actions/QueryParamActions/updateQueryParams';

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
