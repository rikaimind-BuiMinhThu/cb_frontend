import React from 'react';
import PropTypes from 'prop-types';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';
import {
  ADD_ROW_LABEL,
  COMMISSION_LABEL,
  FREE_LABEL,
  PAID_LABEL,
  PAYMENT_METHOD_VARIABLE_LABEL,
  REQUIRED_BADGE,
  SETTLEMENT_FEE_TITLE,
  VARIABLE_VALUE_LABEL,
  YEN_TAX_INCLUDED,
  ZERO_PLACEHOLDER,
} from '../paymentConstants';

const SettlementFeeSection = ({
  noPaid,
  setNoPaid,
  listvar,
  settlementVariableId,
  setSettlementVariableId,
  settlementRows,
  settlementErrors,
  onUpdateSettlementRow,
  onAdd,
  onDelete,
  onSave,
}) => (
  <div className="payment-setting-section">
    <h3 className="payment-setting-section-title">{SETTLEMENT_FEE_TITLE}</h3>
    <div className="payment-setting-section-body">
      <div className="payment-native-radio-group">
        <label>
          <input
            type="radio"
            name="settlement_fee"
            checked={noPaid}
            onChange={() => setNoPaid(true)}
          />
          {FREE_LABEL}
        </label>
        <label>
          <input
            type="radio"
            name="settlement_fee"
            checked={!noPaid}
            onChange={() => setNoPaid(false)}
          />
          {PAID_LABEL}
        </label>
      </div>
      {!noPaid && (
        <div className="payment-conditional-block">
          <AdminFormRow label={PAYMENT_METHOD_VARIABLE_LABEL}>
            <select
              className="payment-native-select payment-native-select--wide"
              value={settlementVariableId}
              onChange={(e) => setSettlementVariableId(e.target.value)}
            >
              {listvar?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.variable_name}
                </option>
              ))}
            </select>
          </AdminFormRow>
          {settlementRows.map((row, index) => (
            <div key={`settlement-row-${index}`} className="payment-dynamic-row">
              <div className="payment-dynamic-row-field">
                <div className="payment-dynamic-row-label">
                  {VARIABLE_VALUE_LABEL} <span className="required-badge">{REQUIRED_BADGE}</span>
                </div>
                <input
                  className="payment-native-input payment-native-input--full"
                  type="text"
                  value={row.variableValue}
                  onChange={(e) => onUpdateSettlementRow(index, 'variableValue', e.target.value)}
                />
                <span className="payment-error-text">{settlementErrors[index]?.variable}</span>
              </div>
              <div className="payment-dynamic-row-field">
                <div className="payment-dynamic-row-label">{COMMISSION_LABEL}</div>
                <div className="payment-inline-field">
                  <input
                    className="payment-native-input payment-native-input--sm"
                    type="number"
                    placeholder={ZERO_PLACEHOLDER}
                    value={row.commission}
                    onChange={(e) => onUpdateSettlementRow(index, 'commission', e.target.value)}
                  />
                  <span className="payment-hint-text">{YEN_TAX_INCLUDED}</span>
                </div>
                <span className="payment-error-text">{settlementErrors[index]?.commission}</span>
              </div>
              {index > 0 && (
                <AdminActionButton action="delete" iconOnly onClick={() => onDelete(index)} />
              )}
            </div>
          ))}
          <AdminActionButton action="create" label={ADD_ROW_LABEL} onClick={onAdd} />
        </div>
      )}
      <div className="payment-setting-actions admin-form-actions">
        <AdminActionButton action="save" onClick={onSave} />
      </div>
    </div>
  </div>
);

SettlementFeeSection.propTypes = {
  noPaid: PropTypes.bool,
  setNoPaid: PropTypes.func,
  listvar: PropTypes.array,
  settlementVariableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSettlementVariableId: PropTypes.func,
  settlementRows: PropTypes.array,
  settlementErrors: PropTypes.array,
  onUpdateSettlementRow: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

export default SettlementFeeSection;
