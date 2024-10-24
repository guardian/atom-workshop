import FieldError from '../constants/FieldError';

/**
 *
 * Validator should return a promise resolved with true for a pass and a new FieldError('error', 'message') if false
 *
 **/

export const isHttpsUrl = value => {
  const stringValue = typeof value === 'string' ? value : '';

  try {

    const url = new URL(stringValue);

    if (url.protocol !== "https:") {
      const error = new FieldError('not-https', 'Not a HTTPS url');
      return Promise.resolve(error);
    }

    return Promise.resolve(true);

  }
  catch (e) {
    const error = new FieldError('not-url', 'Not a valid url');
    return Promise.resolve(error);
  }
};
