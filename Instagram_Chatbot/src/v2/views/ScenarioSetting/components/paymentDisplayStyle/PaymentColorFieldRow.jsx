import React from 'react';
import PropTypes from 'prop-types';

const PaymentColorFieldRow = ({ label, value, colorPickerValue, onChange }) => (
  <div className="ss-user-setting__item-bottom ss-payment-display-style__color-row">
    <span className="ss-payment-display-style__color-label">{label}</span>
    <input
      type="color"
      value={colorPickerValue}
      onChange={(e) => onChange(e.target.value)}
    />
    <input
      type="text"
      className="input-field ss-payment-display-style__color-text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

PaymentColorFieldRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  colorPickerValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentColorFieldRow;
