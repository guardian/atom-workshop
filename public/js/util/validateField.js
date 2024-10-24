import FieldError from '../constants/FieldError';
import {logError} from './logger';

const validateField = (fieldValue, isRequired, customValidation) => {
  const errors = [];

  const checkValidation = (res) => {
    // Validate functions either return true for a pass or a FieldError on a fail
    if (!(res instanceof FieldError) && res !== true) {
      logError('Invalid error format', res);
      throw res;
    }
    return res !== true ? res : false;
  };

  // isRequired check
  if(isRequired && !fieldValue) {
    const error = new FieldError('required', 'This field is required');
    errors.push(error);
  }

  // Custom validators
  if(customValidation) {
    const customValidationResults = customValidation.map((validator) => validator(fieldValue));

    return Promise.all(customValidationResults)
      .then(res => res.filter(checkValidation))
      .then(customErrors => Promise.resolve(errors.concat(customErrors)))
      .catch(err => logError('Validation error', err));
  }

  return Promise.resolve(errors);
};

export default validateField;
