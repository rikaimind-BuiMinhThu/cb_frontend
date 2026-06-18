import React from 'react';
import { Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AdminFormRow } from '../../../../components/AdminShell';

function SpecifyGatewaySection({
  noCan,
  setNoCan,
  listvar,
  payment,
  paymentGateway,
  customDivSpecifyPaymentGW,
  onAdd,
  onDelete,
  onSave,
}) {
  return (
    <div className="payment-setting-section">
      <h3 className="payment-setting-section-title">決済ゲートウェイ指定</h3>
      <div className="payment-setting-section-body">
        <div className="payment-native-radio-group">
          <label>
            <input
              type="radio"
              name="specify_payment_gateway"
              id="specify_pg_none"
              value="no"
              defaultChecked={noCan}
              onChange={() => setNoCan(true)}
            />
            無し
          </label>
          <label>
            <input
              type="radio"
              id="specify_pg_canbe"
              name="specify_payment_gateway"
              value="yes"
              defaultChecked={!noCan}
              onChange={() => setNoCan(false)}
            />
            あり
          </label>
        </div>
        {!noCan && (
          <div className="payment-conditional-block">
            <AdminFormRow label="決済方法の変数名">
              <select
                name="specify_payment_method_variable"
                id="specify_payment_method_variable"
                className="payment-native-select"
                style={{ width: '100%', maxWidth: 320 }}
                defaultValue={
                  payment?.specify_payment_variable?.id
                    ? payment?.specify_payment_variable?.id
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
            <form id="customSPGW">
              {customDivSpecifyPaymentGW?.map((cdiv, i) => (
                <div key={i} id={`specifyPGW${i}`} className="payment-dynamic-row">
                  <div className="payment-dynamic-row-field">
                    <div className="payment-dynamic-row-label">
                      変数値 <span style={{ color: '#ff4d4f' }}>*</span>
                    </div>
                    <input
                      className="payment-native-input"
                      style={{ width: '100%' }}
                      name={`spgw_variable_${i}`}
                      type="text"
                      defaultValue={
                        payment?.specify_payment_variables?.length > 0
                          ? payment?.specify_payment_variables[i]?.variable_value
                          : ''
                      }
                    />
                    <span className="payment-error-text" id={`err_specifypgw_variable${i}`} />
                  </div>
                  <div className="payment-dynamic-row-field">
                    <div className="payment-dynamic-row-label">決済ゲートウェイ</div>
                    <select
                      className="payment-native-select"
                      style={{ width: '100%' }}
                      name={`spgw_gateway_${i}`}
                      defaultValue={
                        payment?.specify_payment_variables?.length > 0
                          ? payment?.specify_payment_variables[i]?.payment_gateway_name
                          : ''
                      }
                    >
                      {paymentGateway?.map((item, gi) => (
                        <option key={gi} value={item.id}>
                          {item.gateway_name}
                        </option>
                      ))}
                    </select>
                    <span className="payment-error-text" id={`err_specifypgw_gw${i}`} />
                  </div>
                  {i > 0 && (
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(i)}
                    />
                  )}
                </div>
              ))}
            </form>
            <Button icon={<PlusOutlined />} onClick={onAdd}>
              行を追加
            </Button>
          </div>
        )}
        <div className="payment-setting-actions">
          <Button type="primary" onClick={onSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SpecifyGatewaySection;
