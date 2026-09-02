import React from 'react';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';

const NpDeferredSection = ({
  noNP,
  setNoNP,
  payment,
  customDivSettlementFee,
  onAdd,
  onDelete,
  onSave,
}) => {
  return (
    <div className="payment-setting-section">
      <h3 className="payment-setting-section-title">NP後払い</h3>
      <div className="payment-setting-section-body">
        <div className="payment-native-radio-group">
          <label>
            <input
              type="radio"
              name="np_deferred"
              id="np_deferred_no"
              value="no"
              checked={noNP}
              onChange={() => setNoNP(true)}
            />
            無し
          </label>
          <label>
            <input
              type="radio"
              name="np_deferred"
              id="np_deferred_can"
              checked={!noNP}
              onChange={() => setNoNP(false)}
            />
            あり
          </label>
        </div>
        {!noNP && (
          <div className="payment-conditional-block">
            <AdminFormRow label="請求書の同梱">
              <div className="payment-native-radio-group">
                <label>
                  <input
                    type="radio"
                    name="invoice_included"
                    id="not_included"
                    value="not_included"
                    defaultChecked={
                      payment.np_invoice_included === 'not_include' ||
                      payment.np_invoice_included == null
                    }
                  />
                  同梱しない
                </label>
                <label>
                  <input
                    type="radio"
                    name="invoice_included"
                    id="enclosed"
                    value="enclosed"
                    defaultChecked={payment.np_invoice_included === 'enclosed'}
                  />
                  同梱する（NP後払いwiz）
                </label>
              </div>
              <p className="payment-hint-text" style={{ marginTop: 8 }}>
                ※別途ヤマトクレジットファイナンスとの契約が必要になります。
              </p>
            </AdminFormRow>
            <AdminFormRow label="上限金額" required>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  className="payment-native-input"
                  style={{ width: 160 }}
                  type="number"
                  placeholder="0"
                  id="np_maximum_amount"
                  defaultValue={payment.np_maximum_amount}
                />
                <span className="payment-hint-text">円</span>
              </div>
              <span className="payment-error-text" id="err_np_maximum_amount" />
            </AdminFormRow>
            <AdminFormRow label="決済手数料（税込）" required>
              <form id="customNP">
                {customDivSettlementFee.map((cdiv, i) => (
                  <div className="payment-np-fee-row" key={i} id={`settlementFee${i}`}>
                    <div className="payment-np-fee-field">
                      <input
                        className="payment-native-input"
                        style={{ width: 100 }}
                        type="number"
                        placeholder="0"
                        name={`np_settlement_fee_value${i}`}
                        defaultValue={
                          payment?.np_value_settlements?.length > 0
                            ? payment?.np_value_settlements[i]?.np_settlement_fee_value
                            : ''
                        }
                      />
                      <span className="payment-hint-text">~</span>
                      <span className="payment-error-text" id={`err_np_settlement_fee_value_${i}`} />
                    </div>
                    <div className="payment-np-fee-field">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                          className="payment-native-input"
                          style={{ width: 100 }}
                          type="number"
                          placeholder="0"
                          name={`np_settlement_max_value${i}`}
                          defaultValue={
                            payment?.np_value_settlements?.length > 0
                              ? payment?.np_value_settlements[i]?.np_settlement_max_value
                              : ''
                          }
                        />
                        <span className="payment-hint-text">円</span>
                      </div>
                      <span className="payment-error-text" id={`err_np_settlement_max_value_${i}`} />
                    </div>
                    <div className="payment-np-fee-field">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                          className="payment-native-input"
                          style={{ width: 100 }}
                          type="number"
                          placeholder="0"
                          name={`np_settlement_min_value${i}`}
                          defaultValue={
                            payment?.np_value_settlements?.length > 0
                              ? payment?.np_value_settlements[i]?.np_settlement_min_value
                              : ''
                          }
                        />
                        <span className="payment-hint-text">円</span>
                      </div>
                      <span className="payment-error-text" id={`err_np_settlement_min_value_${i}`} />
                    </div>
                    {i > 0 && (
                      <AdminActionButton action="delete" iconOnly onClick={() => onDelete(i)} />
                    )}
                  </div>
                ))}
              </form>
              <AdminActionButton action="create" label="行を追加" onClick={onAdd} />
            </AdminFormRow>
          </div>
        )}
        <div className="payment-setting-actions admin-form-actions">
          <AdminActionButton action="save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
};

export default NpDeferredSection;
