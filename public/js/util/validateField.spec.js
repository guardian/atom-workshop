import validateField from './validateField';
import FieldError from '../constants/FieldError';

test('Should return no errors', () => {
  let fieldValue = 'test',
      isRequired = false,
      customValidation = [];

  return validateField(fieldValue, isRequired, customValidation)
    .then(res => {
      expect(Array.isArray(res) && res.length === 0).toBe(true);
    });
});

test('Should return "required" error', () => {
  let fieldValue = '',
      isRequired = true,
      customValidation = [];

    return validateField(fieldValue, isRequired, customValidation)
      .then(res => {
        expect(res[0].title).toBe('required');
      });
});

test('Should return "testing" error', () => {
  let failMessage = new FieldError('testing', 'This is a test message'),
      failFunc = () => failMessage,
      fieldValue = 'test',
      isRequired = false,
      customValidation = [failFunc];

      return validateField(fieldValue, isRequired, customValidation)
        .then(res => {
          expect(res[0].title).toBe('testing');
        });

});

test('Should throw on incorrectly formatted error', () => {
    let failFunc = () => false,
        fieldValue = 'test',
        isRequired = false,
        customValidation = [failFunc];

    return validateField(fieldValue, isRequired, customValidation)
      .then(res => {
        expect(res).toThrow();
      });
});
