import React from 'react';
import { Button } from 'reactstrap';
import InputCustom from './InputCustom';
import FukushashikiSearchRow from '../contentSettings/shared/FukushashikiSearchRow';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from '../../../../../variables/amazonPayConstants';
import { FUKUSHASHIKI_VARIANTS, SETTING_BUTTON_LABELS } from '../constants/scenarioSettingLabels';

export default function AmazonPayButtonConfig({
  indexMessageSelect,
  indexContent = 0,
  config,
  onChangeValue,
  isUseFukushashiki,
  setIsOpenFileReference,
  setVarFileReference,
}) {
  const messageType = 'amazon_pay_button';
  const imageUrl = config?.button_image_url || DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL;

  const handleFieldChange = (fieldName) => (value) => {
    onChangeValue(indexMessageSelect, indexContent, messageType, value, fieldName);
  };

  return (
    <div className="ss-bot-statement-wrapper ss-bot-statement-type">
      <div style={{ marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '6px' }}>ボタン上のテキスト</span>
        <textarea
          className="ss-input-value"
          rows={3}
          placeholder="ボタンの上に表示するテキスト"
          value={config?.text_above || ''}
          onChange={(e) => handleFieldChange('text_above')(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '6px' }}>ボタン下のテキスト</span>
        <textarea
          className="ss-input-value"
          rows={2}
          placeholder="ボタンの下に表示するテキスト"
          value={config?.text_below || ''}
          onChange={(e) => handleFieldChange('text_below')(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '6px' }}>ボタン画像</span>
        {imageUrl && (
          <div style={{ marginBottom: '8px', textAlign: 'center' }}>
            <img
              src={imageUrl}
              alt="Amazon Pay button preview"
              style={{ width: config?.button_image_width || '80%', maxWidth: '280px' }}
            />
          </div>
        )}
        <div className="ss-file-upload-wrapper">
          <Button
            className="ss-bot-file-reference-btn"
            onClick={() => {
              setVarFileReference({ fieldName: 'button_image_url' });
              setIsOpenFileReference(true);
            }}
          >
            {SETTING_BUTTON_LABELS.fileReference}
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <span style={{ display: 'block', marginBottom: '6px' }}>ボタン画像幅</span>
        <InputCustom
          style={{ width: '100%' }}
          value={config?.button_image_width || '80%'}
          placeholder="80%"
          onChange={handleFieldChange('button_image_width')}
        />
      </div>
      {isUseFukushashiki && (
        <div style={{ marginTop: '10px' }}>
          <span style={{ display: 'block', marginBottom: '6px' }}>クリック先（複写式）</span>
          <FukushashikiSearchRow
            mode={config?.button_fukushashiki_search_mode}
            inputValue={config?.button_fukushashiki_search_value || ''}
            onModeChange={handleFieldChange('button_fukushashiki_search_mode')}
            onInputChange={handleFieldChange('button_fukushashiki_search_value')}
            variant={FUKUSHASHIKI_VARIANTS.DEFAULT}
            useFukushashiki
            selectId="amazon-pay-button-fukushashiki-mode"
          />
        </div>
      )}
      <p style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
        HTMLコードを手動入力する場合は、従来の「HTMLコード」タイプをご利用ください。
      </p>
    </div>
  );
}
