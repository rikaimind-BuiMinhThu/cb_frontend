import React from 'react';
import PropTypes from 'prop-types';
import PaymentLayoutPicker from '../PaymentLayoutPicker';
import PaymentColorFieldRow from './PaymentColorFieldRow';
import {
  DEFAULT_COLOR_PICKER_VALUE,
  PAYMENT_DISPLAY_STYLE_CHANGE_FIELDS,
  PAYMENT_DISPLAY_STYLE_FIELDS,
  PAYMENT_DISPLAY_STYLE_SECTION_LABELS,
} from '../../constants/paymentStyleConstants';
import { normalizePaymentConfig } from '../../utils/paymentStyleUtils';
import '../../styles/components/paymentDisplayStyle.css';

const PaymentDisplayStyleSection = ({ cardPaymentRadioButton, onChange }) => {
  const { layout, display_style: displayStyle } = normalizePaymentConfig(cardPaymentRadioButton);

  const handleFieldChange = (field, value) => {
    switch (field) {
      case PAYMENT_DISPLAY_STYLE_CHANGE_FIELDS.LAYOUT:
        onChange(value, field);
        break;
      case PAYMENT_DISPLAY_STYLE_CHANGE_FIELDS.DISPLAY_STYLE:
        onChange(value, field);
        break;
      default:
        break;
    }
  };

  const handleDisplayStyleKeyChange = (key, value) => {
    handleFieldChange(PAYMENT_DISPLAY_STYLE_CHANGE_FIELDS.DISPLAY_STYLE, {
      ...displayStyle,
      [key]: value,
    });
  };

  const renderSectionTitle = () => (
    <div className="ss-payment-display-style__title-wrap">
      <span className="ss-payment-display-style__title">
        {PAYMENT_DISPLAY_STYLE_SECTION_LABELS.title}
      </span>
    </div>
  );

  const renderLayoutSection = () => (
    <div className="ss-payment-display-style__layout-section">
      <span className="ss-payment-display-style__layout-label">
        {PAYMENT_DISPLAY_STYLE_SECTION_LABELS.layout}
      </span>
      <PaymentLayoutPicker
        layout={layout}
        onChange={(value) => handleFieldChange(PAYMENT_DISPLAY_STYLE_CHANGE_FIELDS.LAYOUT, value)}
      />
    </div>
  );

  const renderColorFieldRow = (fieldKey) => {
    switch (fieldKey) {
      case 'selected_bg_color':
      case 'selected_border_color':
      case 'unselected_bg_color':
      case 'unselected_border_color': {
        const field = PAYMENT_DISPLAY_STYLE_FIELDS.find((f) => f.key === fieldKey);
        if (!field) return null;
        return (
          <PaymentColorFieldRow
            key={fieldKey}
            label={field.label}
            value={displayStyle[fieldKey] || ''}
            colorPickerValue={displayStyle[fieldKey] || DEFAULT_COLOR_PICKER_VALUE}
            onChange={(value) => handleDisplayStyleKeyChange(fieldKey, value)}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderColorFieldsSection = () =>
    PAYMENT_DISPLAY_STYLE_FIELDS.map(({ key }) => renderColorFieldRow(key));

  return (
    <div className="ss-user-setting__item-bottom ss-payment-display-style">
      {renderSectionTitle()}
      {renderLayoutSection()}
      {renderColorFieldsSection()}
    </div>
  );
};

PaymentDisplayStyleSection.propTypes = {
  cardPaymentRadioButton: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentDisplayStyleSection;
