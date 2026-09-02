import React from 'react';
import PropTypes from 'prop-types';
import {
  PAYMENT_LAYOUT_HORIZONTAL,
  PAYMENT_LAYOUT_VERTICAL,
} from '../constants/paymentStyleConstants';

const HorizontalSketch = () => (
  <svg width="80" height="48" viewBox="0 0 80 48" aria-hidden="true">
    <rect x="4" y="12" width="20" height="20" rx="10" fill="#e8e8e8" stroke="#999" />
    <rect x="30" y="12" width="20" height="20" rx="10" fill="#e8e8e8" stroke="#999" />
    <rect x="56" y="12" width="20" height="20" rx="10" fill="#e8e8e8" stroke="#999" />
  </svg>
);

const VerticalSketch = () => (
  <svg width="48" height="72" viewBox="0 0 48 72" aria-hidden="true">
    <rect x="14" y="4" width="20" height="20" rx="10" fill="#e8e8e8" stroke="#999" />
    <rect x="14" y="28" width="20" height="20" rx="10" fill="#e8e8e8" stroke="#999" />
    <rect x="14" y="52" width="20" height="20" rx="10" fill="#e8e8e8" stroke="#999" />
  </svg>
);

const OPTIONS = [
  { value: PAYMENT_LAYOUT_HORIZONTAL, label: '横並び', Sketch: HorizontalSketch },
  { value: PAYMENT_LAYOUT_VERTICAL, label: '縦並び', Sketch: VerticalSketch },
];

const PaymentLayoutPicker = ({ layout, onChange }) => (
  <div className="payment-layout-picker">
    {OPTIONS.map(({ value, label, Sketch }) => (
      <div
        key={value}
        role="button"
        tabIndex={0}
        className={`payment-layout-option${layout === value ? ' active' : ''}`}
        onClick={() => onChange(value)}
        onKeyDown={(e) => e.key === 'Enter' && onChange(value)}
      >
        <Sketch />
        <div className="payment-layout-option__label">{label}</div>
      </div>
    ))}
  </div>
);

PaymentLayoutPicker.propTypes = {
  layout: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentLayoutPicker;
