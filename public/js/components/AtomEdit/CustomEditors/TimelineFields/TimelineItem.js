import React from 'react';
import {PropTypes} from 'prop-types';
import { ManagedForm, ManagedField } from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldsRichTextEditor from '../../../FormFields/FormFieldScribeEditor';
import FormFieldDateTextInput from '../../../FormFields/FormFieldDateTextInput';
import FormFieldSelectBox from '../../../FormFields/FormFieldSelectBox';
// import FormFieldRadioButtons from '../../../FormFields/FormFieldRadioButtons';
import FormFieldCheckbox from '../../../FormFields/FormFieldCheckbox';
import ShowErrors from '../../../Utilities/ShowErrors';
import { errorPropType } from '../../../../constants/errorPropType';
import { wordLimits, tooLongMsg } from '../../../../util/wordLimits';

export class TimelineItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      toDate: PropTypes.number,
      body: PropTypes.string,
      dateFormat: PropTypes.string,
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func,
  };

  state = {
    dateRangeRequired: this.props.fieldValue && this.props.fieldValue.toDate,
  };

  // TODO:
  //  Remove the date format select option and replace with radio button lists
  //  Remove ID in dateFormats array as will be superfluous
  //
  //  See this PR for further info: https://github.com/facebook/react/pull/11227
  //
  //  The radio button code has been left in for now as React devs are working on this bug.
  //  React cannot handle multiple radio button lists and leaves only one button visibly checked
  //  regardless of the props. This is only a bug of UX, and the data is being stored correctly
  //  on the atom. We've chosen to release this feature with a select so to speed up delivery.

  dateFormats = [
    {
      value: 'day-month-year',
      name: 'Calendar date e.g. Monday 13th July 2017',
    },
    {
      value: 'month-year',
      name: 'Month & year e.g. July 2017',
    },
    {
      value: 'year',
      name: 'Year e.g. 2017',
    },
  ];

  updateItem = item => {
    this.props.onUpdateField(item);
  };

  // getDateFormat = () => {
  //     const existingData = this.props.fieldValue || {};
  //     return this.dateFormats.find(dateFormat => dateFormat.value === existingData.dateFormat);
  // }

  updateDateRange = dateRangeRequired => {
    this.setState({
      dateRangeRequired: dateRangeRequired,
    });

    //Remove the toDate if no longer set
    const updated = Object.assign({}, this.props.fieldValue, {
      toDate: dateRangeRequired ? this.props.fieldValue.toDate : null,
    });
    this.props.onUpdateField(updated);
  };

  renderDateRangeSelector = () => {
    if (this.state.dateRangeRequired) {
      return <FormFieldDateTextInput fieldName="ranged-date" />;
    }
  };

  render() {
    const value = this.props.fieldValue || {
      title: ' ',
      date: Date.now(),
      body: ' ',
      dateFormat: 'day-month-year',
    };

    return (
      <div className="form__field form__field--nested">
        <ManagedForm
          data={value}
          updateData={this.updateItem}
          onFormErrorsUpdate={this.props.onFormErrorsUpdate}
          formName="timelineEditor"
        >
          <ManagedField fieldLocation="date" name="Date" isRequired={true}>
            <FormFieldDateTextInput />
          </ManagedField>
          <FormFieldCheckbox
            fieldName="ranged-date"
            fieldLabel="Want a date range?"
            fieldValue={this.state.dateRangeRequired}
            onUpdateField={this.updateDateRange.bind(this)}
          />
          <div className={!this.state.dateRangeRequired ? 'form__row' : ' '} />
          <ManagedField isRequired={false} fieldLocation="toDate">
            {this.renderDateRangeSelector()}
          </ManagedField>
          <ManagedField
            fieldLocation="dateFormat"
            name="Date Format"
            isRequired={false}
          >
            <FormFieldSelectBox
              fieldLabel="Date Format"
              selectValues={this.dateFormats}
              optionsAsObject={false}
            />

            {/*<FormFieldRadioButtons*/}
            {/*fieldLabel="Date Format"*/}
            {/*selectValues={this.dateFormats.map(dateFormat => dateFormat.value)}*/}
            {/*selectLabels={this.dateFormats.map(dateFormat => dateFormat.name)}*/}
            {/*fieldValue={this.getDateFormat() ? this.getDateFormat().value : 'day-month-year'}*/}
            {/*fieldCaption="will default to calendar date if left blank"/>*/}
          </ManagedField>
          <ManagedField fieldLocation="title" name="Title" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="body" name="Body">
            <FormFieldsRichTextEditor
              showWordCount={true}
              showToolbar={true}
              suggestedLength={wordLimits.default}
              tooLongMsg={tooLongMsg(wordLimits.default)}
            />
          </ManagedField>
        </ManagedForm>
        <ShowErrors errors={this.props.fieldErrors} />
      </div>
    );
  }
}
