import React from 'react';
import {PropTypes} from 'prop-types';
import { errorPropType } from '../../constants/errorPropType';
import ShowErrors from '../Utilities/ShowErrors';
import { RichTextEditor, customMultiBlockTextConfig, transformToLegacyMarkup } from '@guardian/prosemirror-editor';

const config = customMultiBlockTextConfig({ 
  allowedNodes: ["text", "paragraph", "hard_break"],
  allowedMarks: ["strong", "em", "link"]
});

export default class FormFieldsRichTextEditor extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    formRowClass: PropTypes.string,
    onUpdateField: PropTypes.func,
    showWordCount: PropTypes.bool,
    suggestedLength: PropTypes.number,
    showToolbar: PropTypes.bool,
    tooLongMsg: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.tooLongMsg = props.tooLongMsg || 'too long';
  }

  state = {
    wordCount: 0
  };

  wordCount = text => text.trim().replace(/<(?:.|\n)*?>/gm, '').split(/\s+/).filter(_ => _.length !== 0).length;

  isTooLong = (wordCount) => this.props.suggestedLength && wordCount > this.props.suggestedLength;

  renderWordCount = () => {
    const wordCount = this.props.fieldValue ? this.wordCount(this.props.fieldValue) : 0;

    const tooLong = this.isTooLong(wordCount);

    return (
      <div className="form__message" data-highlighted={tooLong}>
        <span className="form__message__title">{wordCount} words</span>
        {tooLong ? <div className="form__message__text"> {this.tooLongMsg}</div> : false}
      </div>
    );
  };


  render() {
    return (
      <div className={(this.props.formRowClass || "form__row")}>
        {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
        <RichTextEditor
          key={this.props.fieldName}
          id={this.props.fieldName + this.uuid}
          value={this.props.fieldValue ? this.props.fieldValue : ""}
          onUpdate={(value) => this.props.onUpdateField(transformToLegacyMarkup(value))}
          config={config}
        />
        {this.props.showWordCount ? this.renderWordCount() : false}
        <ShowErrors errors={this.props.fieldErrors} />
      </div>
    );
  }
}
