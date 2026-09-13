import React from 'react';
import PropTypes from 'prop-types';
import { DESIGN_TYPES } from '../constants/designChatbotConstants';

const DesignTypePicker = ({ designType, onChange }) => (
  <div className="design-types">
    {DESIGN_TYPES.map(({ value, label }) => (
      <div
        key={value}
        className={designType === value ? 'type active' : 'type'}
        onClick={() => onChange(value)}
      >
        <span>{label}</span>
      </div>
    ))}
  </div>
);

DesignTypePicker.propTypes = {
  designType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DesignTypePicker;
