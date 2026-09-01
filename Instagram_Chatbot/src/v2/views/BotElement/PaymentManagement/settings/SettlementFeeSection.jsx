import React from 'react';
import { AdminFormRow, AdminActionButton } from '../../../../components/AdminShell';

function SettlementFeeSection({
  noPaid,
  setNoPaid,
  listvar,
  payment,
  customDivSettlementPaymentGW,
  onAdd,
  onDelete,
  onSave,
}) {
  return (
    <div className="payment-setting-section">
      <h3 className="payment-setting-section-title">決済手数料（税込）</h3>
      <div className="payment-setting-section-body">
        <div className="payment-native-radio-group">
          <label>
            <input
              type="radio"
              name="settlement_fee"
              id="settlement_fee_free"
              value="free"
              checked={noPaid}
              onChange={() => setNoPaid(true)}
            />
            無料
          </label>
          <label>
            <input
              type="radio"
              name="settlement_fee"
              id="settlement_fee_paid"
              checked={!noPaid}
              onChange={() => setNoPaid(false)}
            />
            有料
          </label>
        </div>
        {!noPaid && (
          <div className="payment-conditional-block">
            <AdminFormRow label="決済方法の変数名">
              <select
                name="settlement_payment_method_variable"
                id="settlement_payment_method_variable"
                className="payment-native-select"
                style={{ width: '100%', maxWidth: 320 }}
                defaultValue={
                  payment?.settlement_fee_variable?.id
                    ? payment?.settlement_fee_variable?.id
                    : 1
                }
              >
                {listvar?.map((item, i) => (
                  <option key={i} value={item.id}>
                    {item.variable_name}
                  </option>
                ))}
              </select>
            </AdminFormRow>
            <form id="settlement_PMGW">
              {customDivSettlementPaymentGW?.map((cdiv, i) => (
                <div key={i} id={`settlementPGW${i}`} className="payment-dynamic-row">
                  <div className="payment-dynamic-row-field">
                    <div className="payment-dynamic-row-label">
                      変数値 <span className="required-badge">必須</span>
                    </div>
                    <input
                      className="payment-native-input"
                      style={{ width: '100%' }}
                      type="text"
                      name={`settpgw_variable${i}`}
                      defaultValue={
                        payment?.settlement_fee_variables?.length > 0
                          ? payment?.settlement_fee_variables[i]?.variable_value
                          : ''
                      }
                    />
                    <span className="payment-error-text" id={`err_settpgw_variable${i}`} />
                  </div>
                  <div className="payment-dynamic-row-field">
                    <div className="payment-dynamic-row-label">手数料</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        className="payment-native-input"
                        style={{ width: 120 }}
                        type="number"
                        name={`settpgw_commission${i}`}
                        placeholder="0"
                        defaultValue={
                          payment?.settlement_fee_variables?.length > 0
                            ? payment?.settlement_fee_variables[i]?.commission
                            : ''
                        }
                      />
                      <span className="payment-hint-text">円（税込）</span>
                    </div>
                    <span className="payment-error-text" id={`err_settpgw_commission${i}`} />
                  </div>
                  {i > 0 && (
                    <AdminActionButton action="delete" iconOnly onClick={() => onDelete(i)} />
                  )}
                </div>
              ))}
            </form>
            <AdminActionButton action="create" label="行を追加" onClick={onAdd} />
          </div>
        )}
        <div className="payment-setting-actions admin-form-actions">
          <AdminActionButton action="save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
}

export default SettlementFeeSection;
