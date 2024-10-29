import React from 'react';
import {PropTypes} from 'prop-types';
import ShowErrors from '../Utilities/ShowErrors';
import { errorPropType } from '../../constants/errorPropType';
import moment from 'moment';

export default class FormFieldDateTextInput extends React.Component {

    static propTypes = {
        fieldLabel: PropTypes.string,
        fieldName: PropTypes.string,
        fieldValue: PropTypes.number,
        fieldErrors: PropTypes.arrayOf(errorPropType),
        formRowClass: PropTypes.string,
        onUpdateField: PropTypes.func,
        disabled: PropTypes.bool
    };

    millisecondsToString = (ms) => moment.utc(ms).format("YYYY-MM-DD");

    state = {
        fieldDisplayValue: this.millisecondsToString(this.props.fieldValue)
    };

    onUpdate = (e) => {
        let momentDate = moment.utc(e.target.value, "YYYY-MM-DD", true);
        if (momentDate.isValid()) {
            this.setState({
                fieldDisplayValue: e.target.value
            });
            this.props.onUpdateField(momentDate.valueOf());
        }
    };

    render() {
        return (
            <div className={this.props.formRowClass || "form__row"}>
                {this.props.fieldLabel ? <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label> : false}
                <input
                    type="date"
                    className={"form__field " + (this.props.fieldErrors && this.props.fieldErrors.length ? "form__field--error" : "")}
                    id={this.props.fieldName}
                    onChange={this.onUpdate}
                    value={this.state.fieldDisplayValue || ""}
                    disabled={this.props.disabled}
                />
                <ShowErrors errors={this.props.fieldErrors}/>
            </div>

        );
    }
}