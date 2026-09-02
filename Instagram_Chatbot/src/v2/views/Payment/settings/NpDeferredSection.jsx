import React from 'react';
import PropTypes from 'prop-types';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';
import {
  ADD_ROW_LABEL,
  INVOICE_ENCLOSED_LABEL,
  INVOICE_INCLUDED_LABEL,
  INVOICE_NOT_INCLUDED_LABEL,
  NONE_LABEL,
  NP_CONTRACT_HINT,
  NP_DEFERRED_TITLE,
  NP_INVOICE_ENCLOSED,
  NP_INVOICE_NOT_INCLUDE,
  NP_MAX_AMOUNT_LABEL,
  NP_SETTLEMENT_FEE_LABEL,
  RANGE_SEPARATOR,
  YEN_LABEL,
  YES_LABEL,
  ZERO_PLACEHOLDER,
} from '../paymentConstants';

const NpDeferredSection = ({
  noNP,
  setNoNP,
  npInvoiceIncluded,
  setNpInvoiceIncluded,
  npMaximumAmount,
  setNpMaximumAmount,
  npMaxAmountError,
  npRows,
  npErrors,
  onUpdateNpRow,
  onAdd,
  onDelete,
  onSave,
}) => (
  <div className="payment-setting-section">
    <h3 className="payment-setting-section-title">{NP_DEFERRED_TITLE}</h3>
    <div className="payment-setting-section-body">
      <div className="payment-native-radio-group">
        <label>
          <input
            type="radio"
            name="np_deferred"
            checked={noNP}
            onChange={() => setNoNP(true)}
          />
          {NONE_LABEL}
        </label>
        <label>
          <input
            type="radio"
            name="np_deferred"
            checked={!noNP}
            onChange={() => setNoNP(false)}
          />
          {YES_LABEL}
        </label>
      </div>
      {!noNP && (
        <div className="payment-conditional-block">
          <AdminFormRow label={INVOICE_INCLUDED_LABEL}>
            <div className="payment-native-radio-group">
              <label>
                <input
                  type="radio"
                  name="invoice_included"
                  checked={npInvoiceIncluded === NP_INVOICE_NOT_INCLUDE}
                  onChange={() => setNpInvoiceIncluded(NP_INVOICE_NOT_INCLUDE)}
                />
                {INVOICE_NOT_INCLUDED_LABEL}
              </label>
              <label>
                <input
                  type="radio"
                  name="invoice_included"
                  checked={npInvoiceIncluded === NP_INVOICE_ENCLOSED}
                  onChange={() => setNpInvoiceIncluded(NP_INVOICE_ENCLOSED)}
                />
                {INVOICE_ENCLOSED_LABEL}
              </label>
            </div>
            <p className="payment-hint-text payment-hint-text--spaced">{NP_CONTRACT_HINT}</p>
          </AdminFormRow>
          <AdminFormRow label={NP_MAX_AMOUNT_LABEL} required>
            <div className="payment-inline-field">
              <input
                className="payment-native-input payment-native-input--md"
                type="number"
                placeholder={ZERO_PLACEHOLDER}
                value={npMaximumAmount}
                onChange={(e) => setNpMaximumAmount(e.target.value)}
              />
              <span className="payment-hint-text">{YEN_LABEL}</span>
            </div>
            <span className="payment-error-text">{npMaxAmountError}</span>
          </AdminFormRow>
          <AdminFormRow label={NP_SETTLEMENT_FEE_LABEL} required>
            {npRows.map((row, index) => (
              <div className="payment-np-fee-row" key={`np-row-${index}`}>
                <div className="payment-np-fee-field">
                  <input
                    className="payment-native-input payment-native-input--xs"
                    type="number"
                    placeholder={ZERO_PLACEHOLDER}
                    value={row.feeValue}
                    onChange={(e) => onUpdateNpRow(index, 'feeValue', e.target.value)}
                  />
                  <span className="payment-hint-text">{RANGE_SEPARATOR}</span>
                  <span className="payment-error-text">{npErrors[index]?.fee}</span>
                </div>
                <div className="payment-np-fee-field">
                  <div className="payment-inline-field--tight">
                    <input
                      className="payment-native-input payment-native-input--xs"
                      type="number"
                      placeholder={ZERO_PLACEHOLDER}
                      value={row.maxValue}
                      onChange={(e) => onUpdateNpRow(index, 'maxValue', e.target.value)}
                    />
                    <span className="payment-hint-text">{YEN_LABEL}</span>
                  </div>
                  <span className="payment-error-text">{npErrors[index]?.max}</span>
                </div>
                <div className="payment-np-fee-field">
                  <div className="payment-inline-field--tight">
                    <input
                      className="payment-native-input payment-native-input--xs"
                      type="number"
                      placeholder={ZERO_PLACEHOLDER}
                      value={row.minValue}
                      onChange={(e) => onUpdateNpRow(index, 'minValue', e.target.value)}
                    />
                    <span className="payment-hint-text">{YEN_LABEL}</span>
                  </div>
                  <span className="payment-error-text">{npErrors[index]?.min}</span>
                </div>
                {index > 0 && (
                  <AdminActionButton action="delete" iconOnly onClick={() => onDelete(index)} />
                )}
              </div>
            ))}
            <AdminActionButton action="create" label={ADD_ROW_LABEL} onClick={onAdd} />
          </AdminFormRow>
        </div>
      )}
      <div className="payment-setting-actions admin-form-actions">
        <AdminActionButton action="save" onClick={onSave} />
      </div>
    </div>
  </div>
);

NpDeferredSection.propTypes = {
  noNP: PropTypes.bool,
  setNoNP: PropTypes.func,
  npInvoiceIncluded: PropTypes.string,
  setNpInvoiceIncluded: PropTypes.func,
  npMaximumAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setNpMaximumAmount: PropTypes.func,
  npMaxAmountError: PropTypes.string,
  npRows: PropTypes.array,
  npErrors: PropTypes.array,
  onUpdateNpRow: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
};

export default NpDeferredSection;
