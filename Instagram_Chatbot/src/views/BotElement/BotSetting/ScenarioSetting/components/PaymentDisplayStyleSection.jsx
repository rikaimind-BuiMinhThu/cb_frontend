import React from 'react';
import PropTypes from 'prop-types';
import PaymentLayoutPicker from './PaymentLayoutPicker';
import {
  DEFAULT_DISPLAY_STYLE,
  DEFAULT_PAYMENT_LAYOUT,
  PAYMENT_DISPLAY_STYLE_FIELDS,
} from '../constants/paymentStyleConstants';

const PaymentDisplayStyleSection = ({ cardPaymentRadioButton, onChange }) => {
  const layout = cardPaymentRadioButton?.layout || DEFAULT_PAYMENT_LAYOUT;
  const displayStyle = {
    ...DEFAULT_DISPLAY_STYLE,
    ...(cardPaymentRadioButton?.display_style || {}),
  };

  const handleDisplayStyleChange = (key, value) => {
    onChange({
      ...displayStyle,
      [key]: value,
    }, 'display_style');
  };

  return (
    <div className="ss-user-setting__item-bottom" style={{ marginTop: '12px' }}>
      <div style={{ width: '95%', marginBottom: '8px' }}>
        <span style={{ fontWeight: 600 }}>決済方法選択の表示スタイル</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <span style={{ display: 'block', marginBottom: '8px' }}>レイアウト</span>
        <PaymentLayoutPicker
          layout={layout}
          onChange={(value) => onChange(value, 'layout')}
        />
      </div>
      {PAYMENT_DISPLAY_STYLE_FIELDS.map(({ key, label }) => (
        <div key={key} className="ss-user-setting__item-bottom" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ minWidth: '180px', fontSize: '13px' }}>{label}</span>
          <input
            type="color"
            value={displayStyle[key] || '#ffffff'}
            onChange={(e) => handleDisplayStyleChange(key, e.target.value)}
          />
          <input
            type="text"
            className="input-field"
            style={{ flex: 1 }}
            value={displayStyle[key] || ''}
            onChange={(e) => handleDisplayStyleChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

PaymentDisplayStyleSection.propTypes = {
  cardPaymentRadioButton: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentDisplayStyleSection;
