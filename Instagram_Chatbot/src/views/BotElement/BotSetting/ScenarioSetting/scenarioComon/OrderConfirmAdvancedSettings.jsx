import React from 'react';
import InputNum from './InputNum';

const fieldLabelStyle = { fontSize: '12px', marginBottom: '4px', display: 'block' };
const sectionLabelStyle = { fontWeight: 600, marginTop: '12px', marginBottom: '6px', display: 'block', fontSize: '12px' };

export default function OrderConfirmAdvancedSettings({
  normalizedConfig,
  onUpdateConfigValue,
  className = '',
}) {
  return (
    <div className={className}>
      <span style={sectionLabelStyle}>リトライ</span>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
        <div>
          <span style={fieldLabelStyle}>最大回数</span>
          <InputNum
            min={1}
            max={50}
            value={normalizedConfig.retry?.maxRetry ?? 20}
            onChange={(value) => onUpdateConfigValue('retry', value, 'maxRetry')}
          />
        </div>
        <div>
          <span style={fieldLabelStyle}>間隔 (ms)</span>
          <InputNum
            min={100}
            max={5000}
            step={100}
            value={normalizedConfig.retry?.delay ?? 500}
            onChange={(value) => onUpdateConfigValue('retry', value, 'delay')}
          />
        </div>
      </div>

      <span style={sectionLabelStyle}>エラーメッセージ</span>
      <textarea
        className="ss-bot-statement-type-text-content ss-input-value"
        rows={3}
        value={normalizedConfig.error_message || ''}
        onChange={(e) => onUpdateConfigValue('error_message', e.target.value)}
      />
    </div>
  );
}
