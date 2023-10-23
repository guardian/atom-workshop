import React from 'react';
import {PropTypes} from 'prop-types';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import {Ingredient} from './Ingredient';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../../FormFields/FormFieldArrayWrapper';

export class IngredientList extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
      ingredients: PropTypes.array
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  render () {
    return (
      <div>
        <ManagedForm data={this.props.fieldValue} updateData={this.props.onUpdateField} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="recipeEditor">
          <ManagedField fieldLocation="title" name="Ingredients List Title (e.g. for the filling)">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="ingredients" name="Ingredients" isRequired={true}>
            <FormFieldArrayWrapper fieldClass="form__section" nested={true}>
              <Ingredient />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
