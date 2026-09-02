import React from 'react';
import InputNum from 'v2/components/BotMessages/InputNum';
import {
  LABEL_ERROR_MESSAGE,
  LABEL_MAX_RETRY,
  LABEL_RETRY,
  LABEL_RETRY_DELAY,
  RETRY_DELAY_DEFAULT,
  RETRY_DELAY_MAX,
  RETRY_DELAY_MIN,
  RETRY_DELAY_STEP,
  RETRY_MAX_DEFAULT,
  RETRY_MAX_MAX,
  RETRY_MAX_MIN,
  TEXTAREA_ROWS,
} from './constants';

const OrderConfirmAdvancedSettings = ({
  normalizedConfig,
  onUpdateConfigValue,
  className = '',
}) => (
  <div className={className}>
    <span className="ss-order-confirm-fields-section-title">{LABEL_RETRY}</span>
    <div className="ss-order-confirm-retry-row">
      <div>
        <span className="ss-order-confirm-retry-row__label">{LABEL_MAX_RETRY}</span>
        <InputNum
          min={RETRY_MAX_MIN}
          max={RETRY_MAX_MAX}
          value={normalizedConfig.retry?.maxRetry ?? RETRY_MAX_DEFAULT}
          onChange={(value) => onUpdateConfigValue('retry', value, 'maxRetry')}
        />
      </div>
      <div>
        <span className="ss-order-confirm-retry-row__label">{LABEL_RETRY_DELAY}</span>
        <InputNum
          min={RETRY_DELAY_MIN}
          max={RETRY_DELAY_MAX}
          step={RETRY_DELAY_STEP}
          value={normalizedConfig.retry?.delay ?? RETRY_DELAY_DEFAULT}
          onChange={(value) => onUpdateConfigValue('retry', value, 'delay')}
        />
      </div>
    </div>

    <span className="ss-order-confirm-fields-section-title">{LABEL_ERROR_MESSAGE}</span>
    <textarea
      className="ss-bot-statement-type-text-content ss-input-value"
      rows={TEXTAREA_ROWS}
      value={normalizedConfig.error_message || ''}
      onChange={(event) => onUpdateConfigValue('error_message', event.target.value)}
    />
  </div>
);

export default OrderConfirmAdvancedSettings;
