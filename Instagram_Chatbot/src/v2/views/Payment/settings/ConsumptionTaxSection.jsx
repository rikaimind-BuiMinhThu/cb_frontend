import React from 'react';
import PropTypes from 'prop-types';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';
import {
  CONSUMPTION_TAX_TITLE,
  TAX_EXCLUDED_HINT,
  TAX_EXCLUDED_LABEL,
  TAX_INCLUDED_HINT,
  TAX_INCLUDED_LABEL,
  TAX_RATE_EIGHT,
  TAX_RATE_EIGHT_LABEL,
  TAX_RATE_LABEL,
  TAX_RATE_TEN,
  TAX_RATE_TEN_LABEL,
  TAX_ROUNDED_UP,
  TAX_ROUNDED_UP_LABEL,
  TAX_ROUNDING_LABEL,
  TAX_TRUNCATION,
  TAX_TRUNCATION_LABEL,
} from '../paymentConstants';

const ConsumptionTaxSection = ({
  openTax,
  setOpenTax,
  saleTaxRate,
  setSaleTaxRate,
  calculateOneYen,
  setCalculateOneYen,
  taxSaving,
  onSave,
}) => (
  <div className="payment-setting-section">
    <h3 className="payment-setting-section-title">{CONSUMPTION_TAX_TITLE}</h3>
    <div className="payment-setting-section-body">
      <div className="payment-native-radio-group">
        <label>
          <input
            type="radio"
            name="included_outside_tax"
            checked={openTax}
            onChange={() => setOpenTax(true)}
          />
          {TAX_INCLUDED_LABEL}
        </label>
        <label>
          <input
            type="radio"
            name="included_outside_tax"
            checked={!openTax}
            onChange={() => setOpenTax(false)}
          />
          {TAX_EXCLUDED_LABEL}
        </label>
      </div>
      {!openTax && (
        <div className="payment-conditional-block">
          <AdminFormRow label={TAX_RATE_LABEL}>
            <select
              className="payment-native-select"
              value={saleTaxRate || TAX_RATE_EIGHT}
              onChange={(e) => setSaleTaxRate(e.target.value)}
            >
              <option value={TAX_RATE_EIGHT}>{TAX_RATE_EIGHT_LABEL}</option>
              <option value={TAX_RATE_TEN}>{TAX_RATE_TEN_LABEL}</option>
            </select>
          </AdminFormRow>
          <AdminFormRow label={TAX_ROUNDING_LABEL}>
            <div className="payment-native-radio-group">
              <label>
                <input
                  type="radio"
                  name="truncation_rounded"
                  checked={calculateOneYen !== TAX_ROUNDED_UP}
                  onChange={() => setCalculateOneYen(TAX_TRUNCATION)}
                />
                {TAX_TRUNCATION_LABEL}
              </label>
              <label>
                <input
                  type="radio"
                  name="truncation_rounded"
                  checked={calculateOneYen === TAX_ROUNDED_UP}
                  onChange={() => setCalculateOneYen(TAX_ROUNDED_UP)}
                />
                {TAX_ROUNDED_UP_LABEL}
              </label>
            </div>
          </AdminFormRow>
        </div>
      )}
      <p className="payment-hint-text">{TAX_INCLUDED_HINT}</p>
      <p className="payment-hint-text">{TAX_EXCLUDED_HINT}</p>
      <div className="payment-setting-actions admin-form-actions">
        <AdminActionButton action="save" loading={taxSaving} onClick={onSave} />
      </div>
    </div>
  </div>
);

ConsumptionTaxSection.propTypes = {
  openTax: PropTypes.bool,
  setOpenTax: PropTypes.func,
  saleTaxRate: PropTypes.string,
  setSaleTaxRate: PropTypes.func,
  calculateOneYen: PropTypes.string,
  setCalculateOneYen: PropTypes.func,
  taxSaving: PropTypes.bool,
  onSave: PropTypes.func,
};

export default ConsumptionTaxSection;
