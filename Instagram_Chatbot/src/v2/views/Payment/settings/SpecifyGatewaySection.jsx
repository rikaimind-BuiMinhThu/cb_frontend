import React from 'react';
import PropTypes from 'prop-types';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';
import {
  ADD_ROW_LABEL,
  EMPTY_VALUE,
  GATEWAY_LABEL,
  NONE_LABEL,
  PAYMENT_METHOD_VARIABLE_LABEL,
  SPECIFY_GATEWAY_TITLE,
  REQUIRED_BADGE,
  VARIABLE_VALUE_LABEL,
  YES_LABEL,
} from '../paymentConstants';

const SpecifyGatewaySection = ({
  noCan,
  setNoCan,
  listvar,
  paymentGateway,
  specifyVariableId,
  setSpecifyVariableId,
  specifyRows,
  specifyErrors,
  onUpdateSpecifyRow,
  onAdd,
  onDelete,
  onSave,
}) => (
  <div className="payment-setting-section">
    <h3 className="payment-setting-section-title">{SPECIFY_GATEWAY_TITLE}</h3>
    <div className="payment-setting-section-body">
      <div className="payment-native-radio-group">
        <label>
          <input
            type="radio"
            name="specify_payment_gateway"
            checked={noCan}
            onChange={() => setNoCan(true)}
          />
          {NONE_LABEL}
        </label>
        <label>
          <input
            type="radio"
            name="specify_payment_gateway"
            checked={!noCan}
            onChange={() => setNoCan(false)}
          />
          {YES_LABEL}
        </label>
      </div>
      {!noCan && (
        <div className="payment-conditional-block">
          <AdminFormRow label={PAYMENT_METHOD_VARIABLE_LABEL}>
            <select
              className="payment-native-select payment-native-select--wide"
              value={specifyVariableId}
              onChange={(e) => setSpecifyVariableId(e.target.value)}
            >
              {listvar?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.variable_name}
                </option>
              ))}
            </select>
          </AdminFormRow>
          {specifyRows.map((row, index) => (
            <div key={`specify-row-${index}`} className="payment-dynamic-row">
              <div className="payment-dynamic-row-field">
                <div className="payment-dynamic-row-label">
                  {VARIABLE_VALUE_LABEL} <span className="required-badge">{REQUIRED_BADGE}</span>
                </div>
                <input
                  className="payment-native-input payment-native-input--full"
                  type="text"
                  value={row.variableValue}
                  onChange={(e) => onUpdateSpecifyRow(index, 'variableValue', e.target.value)}
                />
                <span className="payment-error-text">{specifyErrors[index]?.variable}</span>
              </div>
              <div className="payment-dynamic-row-field">
                <div className="payment-dynamic-row-label">{GATEWAY_LABEL}</div>
                <select
                  className="payment-native-select payment-native-input--full"
                  value={row.gatewayId}
                  onChange={(e) => onUpdateSpecifyRow(index, 'gatewayId', e.target.value)}
                >
                  <option value={EMPTY_VALUE} />
                  {paymentGateway?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.gateway_name}
                    </option>
                  ))}
                </select>
                <span className="payment-error-text">{specifyErrors[index]?.gateway}</span>
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

SpecifyGatewaySection.propTypes = {
  noCan: PropTypes.bool,
  setNoCan: PropTypes.func,
  listvar: PropTypes.array,
  paymentGateway: PropTypes.array,
  specifyVariableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSpecifyVariableId: PropTypes.func,
  specifyRows: PropTypes.array,
  specifyErrors: PropTypes.array,
  onUpdateSpecifyRow: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

export default SpecifyGatewaySection;
