import React from 'react';
import {PropTypes} from 'prop-types';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldNumericInput from '../../FormFields/FormFieldNumericInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldMultiSelect from '../../FormFields/FormFieldMultiSelect';
import {RecipeServings} from './RecipeFields/Servings';
import {IngredientList} from './RecipeFields/IngredientList';
import * as recipeData from '../../../constants/recipeData';

export class RecipeEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    return (

      <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="recipeEditor">

        <ManagedField fieldLocation="data.recipe.tags.cuisine" name="Cuisine" isRequired={true}>
          <FormFieldMultiSelect selectValues={recipeData.cuisineList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.tags.category" name="Category" isRequired={true}>
          <FormFieldMultiSelect selectValues={recipeData.categoryList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.tags.celebration" name="Celebration" isRequired={true}>
          <FormFieldMultiSelect selectValues={recipeData.celebrationList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.tags.dietary" name="Dietary info" isRequired={true}>
          <FormFieldMultiSelect selectValues={recipeData.dietaryList}/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.time.preparation" name="Preparation Time (mins)">
          <FormFieldNumericInput/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.time.cooking" name="Cooking Time (mins)">
          <FormFieldNumericInput/>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.serves" name="Serving Information" isRequired={true}>
          <RecipeServings />
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.ingredientsLists" name="Ingredient Lists">
          <FormFieldArrayWrapper>
            <IngredientList onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
          </FormFieldArrayWrapper>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.steps" name="Steps" isRequired={true}>
          <FormFieldArrayWrapper numbered={true} fieldClass="form__group form__group--flex">
            <FormFieldTextInput />
          </FormFieldArrayWrapper>
        </ManagedField>

        <ManagedField fieldLocation="data.recipe.credits" name="Chefs" isRequired={true}>
          <FormFieldMultiSelect selectValues={recipeData.chefs}/>
        </ManagedField>
        
        <ManagedField fieldLocation="data.recipe.images" name="Images" isRequired={true}>
          <FormFieldArrayWrapper>
            <FormFieldImageSelect gridUrl={this.props.config.gridUrl}/>
          </FormFieldArrayWrapper>
        </ManagedField>
      </ManagedForm>
    );
  }
}
