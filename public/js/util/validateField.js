import FieldError from '../constants/FieldError';
import {logError} from './logger';

const validateField = (fieldValue, isRequired: false, customValidation) => {
  const errors = [];

  const checkError = (err, resolve, reject) => {
    if (!(err instanceof FieldError)) {
      logError('Invalid error format', err);
      reject(err);
    }
    return err !== true ? err : false;
  }
  
  // isRequired check
  if(isRequired && !fieldValue) {
    const error = new FieldError('required', 'This field is required');
    errors.push(error);
  }

  // Custom validators
  if(customValidation) {

    const customValidationResults = customValidation.map((validator) => {
      const result = validator(fieldValue);

      if (result !== true) {

        if (!(result instanceof FieldError)) {


        }
        return result;
      }
    })

    Promise.all(customValidationResults)
      .then(res => res.filter(checkError))
      .then(customErrors => errors.concat(customErrors))
      .catch(err => logError('Validation error', err));

  }

  return errors;
};

export default validateField;
