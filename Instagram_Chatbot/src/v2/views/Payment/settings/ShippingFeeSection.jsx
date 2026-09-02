import React from 'react';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';

const ShippingFeeSection = ({
  noShip,
  setNoShip,
  listvar,
  payment,
  prefectures,
  onSave,
}) => {
  return (
    <div className="payment-setting-section">
      <h3 className="payment-setting-section-title">送料（税込）</h3>
      <div className="payment-setting-section-body">
        <div className="payment-native-radio-group">
          <label>
            <input
              type="radio"
              name="shipping_tax"
              id="shipping_tax_free"
              value="free"
              checked={noShip}
              onChange={() => setNoShip(true)}
            />
            無料
          </label>
          <label>
            <input
              type="radio"
              name="shipping_tax"
              id="shipping_tax_paid"
              checked={!noShip}
              onChange={() => setNoShip(false)}
            />
            有料
          </label>
        </div>
        {!noShip && (
          <div className="payment-conditional-block">
            <AdminFormRow label="住所の変数名">
              <select
                name="shipping_fee_address_variable"
                id="shipping_fee_address_variable"
                className="payment-native-select"
                style={{ width: '100%', maxWidth: 320 }}
                defaultValue={payment?.shipping_fee_variable?.id}
              >
                {listvar?.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.variable_name}
                  </option>
                ))}
              </select>
            </AdminFormRow>
            <div className="payment-prefecture-table">
              <div className="payment-prefecture-table-header">
                <span className="payment-prefecture-name" style={{ padding: '10px 16px' }}>
                  都道府県
                </span>
                <span className="payment-prefecture-amount" style={{ padding: '10px 16px' }}>
                  金額
                </span>
              </div>
              <div className="payment-prefecture-table-body">
                <form id="shipping_fee_tax">
                  {prefectures.map((item, i) => (
                    <div className="payment-prefecture-table-row" key={i}>
                      <span className="payment-prefecture-name">{item.prefectureName}</span>
                      <div className="payment-prefecture-amount">
                        <input
                          className="payment-native-input"
                          style={{ width: 120 }}
                          type="number"
                          name={payment?.shipping_fee_variables?.[i]?.prefecture_id}
                          defaultValue={
                            payment?.shipping_fee_variables?.[i]?.value
                              ? payment?.shipping_fee_variables[i]?.value
                              : 0
                          }
                        />
                        <span className="payment-hint-text">円（税込）</span>
                        <span className="payment-error-text" id={`err_amount_of_money_${i}`} />
                      </div>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="payment-setting-actions admin-form-actions">
          <AdminActionButton action="save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
};

export default ShippingFeeSection;
