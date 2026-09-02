import PropTypes from 'prop-types';

export const baseUserMessageComponentPropTypes = {
  content: PropTypes.object,
  messageIndex: PropTypes.number,
  contentIndex: PropTypes.number,
  onChangeValue: PropTypes.func,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
};

export const userMessageComponentWithErrorsPropTypes = {
  ...baseUserMessageComponentPropTypes,
  onChangeErrors: PropTypes.func,
};
