import React from 'react';
import { AdminFormRow, AdminActionButton } from '../../../../components/AdminShell';

const ConsumptionTaxSection = ({
  openTax,
  setOpenTax,
  saleTaxRate,
  setSaleTaxRate,
  calculateOneYen,
  setCalculateOneYen,
  taxSaving,
  onSave,
}) => {
  return (
    <div className="payment-setting-section">
      <h3 className="payment-setting-section-title">消費税</h3>
      <div className="payment-setting-section-body">
        <form id="consumption_tax">
          <div className="payment-native-radio-group">
            <label>
              <input
                type="radio"
                name="included_outside_tax"
                id="included_tax"
                checked={openTax}
                value="internal_tax"
                onChange={() => setOpenTax(true)}
              />
              内税
            </label>
            <label>
              <input
                type="radio"
                id="outside_tax"
                name="included_outside_tax"
                value="outside"
                checked={!openTax}
                onChange={() => setOpenTax(false)}
              />
              外税
            </label>
          </div>
          {!openTax && (
            <div className="payment-conditional-block">
              <AdminFormRow label="消費税率（％）">
                <select
                  id="sales_tax_rate"
                  name="sales_tax_rate"
                  className="payment-native-select"
                  value={saleTaxRate || 'eight_percent'}
                  onChange={(e) => setSaleTaxRate(e.target.value)}
                >
                  <option value="eight_percent">8</option>
                  <option value="ten_percent">10</option>
                </select>
              </AdminFormRow>
              <AdminFormRow label="1円未満">
                <div className="payment-native-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="truncation_rounded"
                      id="truncation"
                      checked={calculateOneYen !== 'rounded_up'}
                      value="truncation"
                      onChange={() => setCalculateOneYen('truncation')}
                    />
                    切り捨て
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="truncation_rounded"
                      id="rounded"
                      checked={calculateOneYen === 'rounded_up'}
                      value="rounded_up"
                      onChange={() => setCalculateOneYen('rounded_up')}
                    />
                    切り上げ
                  </label>
                </div>
              </AdminFormRow>
            </div>
          )}
          <p className="payment-hint-text">
            内税の場合は、商品金額小計をそのまま注文金額とします。
          </p>
          <p className="payment-hint-text">
            外税の場合は、商品金額小計に税率を上乗せして注文金額とします。
          </p>
        </form>
        <div className="payment-setting-actions admin-form-actions">
          <AdminActionButton action="save" loading={taxSaving} onClick={onSave} />
        </div>
      </div>
    </div>
  );
};

export default ConsumptionTaxSection;
