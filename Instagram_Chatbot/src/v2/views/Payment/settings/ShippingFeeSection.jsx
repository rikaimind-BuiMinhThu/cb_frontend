import React from 'react';
import PropTypes from 'prop-types';
import { AdminFormRow, AdminActionButton } from 'v2/components/AdminShell';
import {
  ADDRESS_VARIABLE_LABEL,
  AMOUNT_COLUMN,
  FREE_LABEL,
  PAID_LABEL,
  PREFECTURE_COLUMN,
  SHIPPING_FEE_TITLE,
  YEN_TAX_INCLUDED,
} from '../paymentConstants';

const ShippingFeeSection = ({
  noShip,
  setNoShip,
  listvar,
  prefectures,
  shippingVariableId,
  setShippingVariableId,
  shippingRows,
  shippingErrors,
  onUpdateShippingRow,
  onSave,
}) => (
  <div className="payment-setting-section">
    <h3 className="payment-setting-section-title">{SHIPPING_FEE_TITLE}</h3>
    <div className="payment-setting-section-body">
      <div className="payment-native-radio-group">
        <label>
          <input
            type="radio"
            name="shipping_tax"
            checked={noShip}
            onChange={() => setNoShip(true)}
          />
          {FREE_LABEL}
        </label>
        <label>
          <input
            type="radio"
            name="shipping_tax"
            checked={!noShip}
            onChange={() => setNoShip(false)}
          />
          {PAID_LABEL}
        </label>
      </div>
      {!noShip && (
        <div className="payment-conditional-block">
          <AdminFormRow label={ADDRESS_VARIABLE_LABEL}>
            <select
              className="payment-native-select payment-native-select--wide"
              value={shippingVariableId}
              onChange={(e) => setShippingVariableId(e.target.value)}
            >
              {listvar?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.variable_name}
                </option>
              ))}
            </select>
          </AdminFormRow>
          <div className="payment-prefecture-table">
            <div className="payment-prefecture-table-header">
              <span className="payment-prefecture-name">{PREFECTURE_COLUMN}</span>
              <span className="payment-prefecture-amount">{AMOUNT_COLUMN}</span>
            </div>
            <div className="payment-prefecture-table-body">
              {prefectures.map((item, index) => (
                <div className="payment-prefecture-table-row" key={item.prefectur}>
                  <span className="payment-prefecture-name">{item.prefectureName}</span>
                  <div className="payment-prefecture-amount">
                    <input
                      className="payment-native-input payment-native-input--sm"
                      type="number"
                      value={shippingRows[index]?.amount ?? 0}
                      onChange={(e) => onUpdateShippingRow(index, e.target.value)}
                    />
                    <span className="payment-hint-text">{YEN_TAX_INCLUDED}</span>
                    <span className="payment-error-text">{shippingErrors[index]}</span>
                  </div>
                </div>
              ))}
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

ShippingFeeSection.propTypes = {
  noShip: PropTypes.bool,
  setNoShip: PropTypes.func,
  listvar: PropTypes.array,
  prefectures: PropTypes.array,
  shippingVariableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setShippingVariableId: PropTypes.func,
  shippingRows: PropTypes.array,
  shippingErrors: PropTypes.array,
  onUpdateShippingRow: PropTypes.func,
  onSave: PropTypes.func,
};

export default ShippingFeeSection;
