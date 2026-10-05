import React from 'react';
import { AdminFormRow, AdminActionButton } from '../../../../components/AdminShell';

function ConsumptionTaxSection({ openTax, setOpenTax, payment, onSave }) {
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
                defaultChecked={openTax}
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
                defaultChecked={!openTax}
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
                  defaultValue={payment.sale_tax_rate ? payment.sale_tax_rate : 'eight_percent'}
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
                      defaultChecked={
                        payment.calculate_one_yen == 'truncation' ||
                        payment.calculate_one_yen == null
                      }
                      value="truncation"
                    />
                    切り捨て
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="truncation_rounded"
                      id="rounded"
                      defaultChecked={payment.calculate_one_yen == 'rounded_up'}
                      value="rounded_up"
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
          <AdminActionButton action="save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
}

export default ConsumptionTaxSection;
