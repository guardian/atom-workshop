import React from 'react';
import {PropTypes} from 'prop-types';
import SearchTextInput from './SearchTextInput';

class SearchSuggestions extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    filters: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    results: PropTypes.array,
    queryStr: PropTypes.string,
    searchActions: PropTypes.shape({
      update: PropTypes.func.isRequired,
      cancel: PropTypes.func.isRequired,
      search: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    timer: undefined
  };
  
  onChange = (query) => {
    this.props.searchActions.update(this.props.id, query);
    this.isTyping();
  }

  onKey = (key) => {
    if (key === 27) {
      this.reset();
    }
  }

  onClick = (i) => () => {
    this.props.searchActions.cancel(this.props.id);
    this.props.onSelect(this.props.results[i]);
  }

  reset = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: undefined });
    }
    
    this.props.searchActions.cancel(this.props.id);
  }

  isTyping = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }

    this.setState({
      timer: setTimeout(this.search, 300)
    });
  }

  search = () => {
    const query = Object.assign({}, this.props.filters, {
      q: this.props.queryStr
    });

    this.props.searchActions.search(this.props.id, query);
  }

  renderResults() {
    if (this.props.results && this.props.queryStr) {
      const results = this.props.results.map((result, i) =>
        <li onClick={this.onClick(i)} key={result.title}>{result.title}</li>
      );
      const noresult = this.props.results.length === 0 ?
        <li className="disabled">No snippet found matching the word &quot;{this.props.queryStr}&quot;</li> : null;

      return (
        <ul>
          {results}
          {noresult}
        </ul>
      );
    }
  }

  render() {
    return (
      <div id={this.props.id} className="search-suggestions">
        <SearchTextInput fieldValue={this.props.queryStr} 
                         fieldPlaceholder={this.props.placeholder} 
                         onUpdateField={this.onChange} 
                         onKeyUp={this.onKey} 
                         />
        {this.renderResults()}
      </div>
    );
  }
}

//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as cancel from '../../../actions/SearchSuggestionsActions/cancel.js';
import * as search from '../../../actions/SearchSuggestionsActions/search.js';
import * as update from '../../../actions/SearchSuggestionsActions/update.js';

function mapStateToProps(state, props) {
  return state.searchSuggestions[props.id] ? {
    queryStr: state.searchSuggestions[props.id].queryStr,
    results: state.searchSuggestions[props.id].results
  } : {
    queryStr: '',
    results: []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchActions: bindActionCreators(Object.assign({}, cancel, search, update), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSuggestions);
