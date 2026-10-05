import React from 'react';
import InputNum from './InputNum';

const OrderConfirmAdvancedSettings = ({
  normalizedConfig,
  onUpdateConfigValue,
  className = '',
}) => (
  <div className={className}>
    <span className="ss-config-section-label">リトライ</span>
    <div className="ss-order-confirm-retry-row">
      <div>
        <span className="ss-order-confirm-retry-row__label">最大回数</span>
        <InputNum
          min={1}
          max={50}
          value={normalizedConfig.retry?.maxRetry ?? 20}
          onChange={(value) => onUpdateConfigValue('retry', value, 'maxRetry')}
        />
      </div>
      <div>
        <span className="ss-order-confirm-retry-row__label">間隔 (ms)</span>
        <InputNum
          min={100}
          max={5000}
          step={100}
          value={normalizedConfig.retry?.delay ?? 500}
          onChange={(value) => onUpdateConfigValue('retry', value, 'delay')}
        />
      </div>
    </div>

    <span className="ss-config-section-label">エラーメッセージ</span>
    <textarea
      className="ss-bot-statement-type-text-content ss-input-value"
      rows={3}
      value={normalizedConfig.error_message || ''}
      onChange={(e) => onUpdateConfigValue('error_message', e.target.value)}
    />
  </div>
);

export default OrderConfirmAdvancedSettings;
