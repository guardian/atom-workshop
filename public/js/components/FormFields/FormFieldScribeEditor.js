import React from 'react';
import {PropTypes} from 'prop-types';
import Scribe from 'scribe-editor';
import scribeKeyboardShortcutsPlugin from 'scribe-plugin-keyboard-shortcuts';
import scribePluginToolbar from 'scribe-plugin-toolbar';
import scribePluginLinkPromptCommand from 'scribe-plugin-link-prompt-command';
import scribePluginSanitizer from 'scribe-plugin-sanitizer';
import { errorPropType } from '../../constants/errorPropType';
import ShowErrors from '../Utilities/ShowErrors';
import uuidv4 from 'uuid/v4';

export default class FormFieldsScribeEditor extends React.Component {

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
  }

  constructor(props) {
    super(props);
    this.tooLongMsg = props.tooLongMsg || 'too long';
  }

  state = {
    wordCount: 0
  }

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
  }


  render() {
    return (
      <div className={(this.props.formRowClass || "form__row") + " scribe"}>
        {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
        <ScribeEditor
          key={this.props.fieldName}
          fieldName={this.props.fieldName}
          value={this.props.fieldValue ? this.props.fieldValue : " "}
          onUpdate={this.props.onUpdateField}
          showToolbar={this.props.showToolbar}
        />
        {this.props.showWordCount ? this.renderWordCount() : false}
        <ShowErrors errors={this.props.fieldErrors} />
      </div>
    );
  }
}

export class ScribeEditor extends React.Component {

  static propTypes = {
    fieldName: PropTypes.string,
    value: PropTypes.string,
    onUpdate: PropTypes.func,
    showToolbar: PropTypes.bool
  };

  state = {
    scribeElement: null
  };

  uuid = uuidv4();

  componentDidMount() {
    this.setState({ scribeElement: document.getElementById(this.props.fieldName + this.uuid) }, () => {
      this.configureScribe();
    });

  }

  configureScribe = () => {

    this.scribe = new Scribe(this.state.scribeElement);

    // Create an instance of the Scribe toolbar
    if (this.props.showToolbar !== false) {
      const toolbar = document.getElementById(`scribe__toolbar-${this.uuid}`);
      this.scribe.use(scribePluginToolbar(toolbar));
    }

    // Configure Scribe plugins
    this.scribe.use(scribePluginLinkPromptCommand());
    this.scribe.use(scribeKeyboardShortcutsPlugin({
      bold: function (event) { return event.metaKey && event.keyCode === 66; }, // b
      italic: function (event) { return event.metaKey && event.keyCode === 73; }, // i
      linkPrompt: function (event) { return event.metaKey && !event.shiftKey && event.keyCode === 75; }, // k
      unlink: function (event) { return event.metaKey && event.shiftKey && event.keyCode === 75; } // shft + k
    }));

    this.scribe.use(scribePluginSanitizer({
      tags: {
        p: {},
        i: {},
        b: {},
        a: {
          href: true
        },
        ul: {},
        ol: {},
        li: {}
      }
    }));

    this.scribe.on('content-changed', this.onContentChange);

    this.setState({
      scribeElement: Object.assign(this.state.scribeElement, { innerHTML: this.props.value })
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.state.scribeElement !== null && nextProps.value !== this.state.scribeElement.innerHTML;
  }

  onContentChange = () => {
    const newContent = this.state.scribeElement.innerHTML;
    if (newContent !== this.props.value) {
      this.props.onUpdate(newContent);
    }
  }

  render() {
    return (
      <div>
        {this.props.showToolbar === false ? null :
          <div id={`scribe__toolbar-${this.uuid}`} className="scribe__toolbar">
            <button type="button" data-command-name="bold" className="scribe__toolbar__item">Bold</button>
            <button type="button" data-command-name="italic" className="scribe__toolbar__item">Italic</button>
            <button type="button" data-command-name="linkPrompt" className="scribe__toolbar__item">Link</button>
            <button type="button" data-command-name="unlink" className="scribe__toolbar__item">Unlink</button>
          </div>
        }

        <div id={this.props.fieldName + this.uuid} className="scribe__editor"></div>
      </div>
    );
  }
}
