import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import {searchTags} from '../../services/capi';

export default class FormFieldTagPicker extends React.Component {


  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldPlaceholder: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func,
  };

  state = {
    suggestions: null,
    searchText: ""
  };

  selectTag = (id) => {
    this.props.onUpdateField(id);

    this.setState({
      suggestions: null,
      searchText: ""
    });
  };

  resetTag = () => {
    this.props.onUpdateField(undefined);
  };

  updateSearchSuggestions = (e) => {

    const searchText = e.target.value;

    if (searchText.length > 0) {
      this.setState({
        searchText: searchText
      });
    
      searchTags(searchText).then((results) => {
        this.setState({
          suggestions: results
        });
      })
      .catch(() => {
        this.setState({
          suggestions: null
        });
      });
    } else {
      this.setState({
        searchText: "",
        suggestions: []
      });
    }

  };

  renderSuggestions() {
    if (!this.state.suggestions) {
      return false;
    }

    if (!this.state.suggestions.length) {
      return <div>No tags found</div>;
    }

    return (
      <div className="form__field__suggestions">
        {this.state.suggestions.map((suggestion) => {
          const updateFn = () => {
            this.selectTag(suggestion.id);
          };

          return (
            <a className="form__field__suggestion" key={suggestion.id} title={suggestion.id} onClick={updateFn}>{suggestion.internalName || suggestion.webTitle} ({suggestion.type})</a>
          );
        })}
      </div>
    );
  }

  render() {

    if (this.props.fieldValue) {
      return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <input className="form__field" value={`Currently selected tag: ${this.props.fieldValue}`} disabled={true} />
          <button className="btn" onClick={this.resetTag}>Change Tag</button>
        </div>
      );
    }

    return (
        <div className={this.props.formRowClass || "form__row"}>
          {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
          <input
            type="text"
            className={"form__field " + (this.props.fieldErrors && this.props.fieldErrors.length ? "form__field--error" : "")}
            id={this.props.fieldName}
            onChange={this.updateSearchSuggestions}
            value={this.state.searchText}
            />
          {this.renderSuggestions()}
          <ShowErrors errors={this.props.fieldErrors}/>
        </div>
    );
  }
}
