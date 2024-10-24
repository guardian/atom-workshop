import { PropTypes } from 'prop-types';

export const errorPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
});
