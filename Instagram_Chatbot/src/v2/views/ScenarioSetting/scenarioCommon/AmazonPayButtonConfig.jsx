import React from 'react';
import { Button } from 'reactstrap';
import InputCustom from './InputCustom';
import FukushashikiSearchRow from '../contentSettings/shared/FukushashikiSearchRow';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from 'v2/variables/amazonPayConstants';
import { FUKUSHASHIKI_VARIANTS, SETTING_BUTTON_LABELS } from '../constants/scenarioSettingLabels';

const AmazonPayButtonConfig = ({
  indexMessageSelect,
  indexContent = 0,
  config,
  onChangeValue,
  isUseFukushashiki,
  setIsOpenFileReference,
  setVarFileReference,
}) => {
  const messageType = 'amazon_pay_button';
  const imageUrl = config?.button_image_url || DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL;

  const handleFieldChange = (fieldName) => (value) => {
    onChangeValue(indexMessageSelect, indexContent, messageType, value, fieldName);
  };

  return (
    <div className="ss-bot-statement-wrapper ss-bot-statement-type">
      <div className="ss-config-field">
        <span className="ss-config-field__label">ボタン上のテキスト</span>
        <textarea
          className="ss-input-value ss-textarea--setting"
          rows={3}
          placeholder="ボタンの上に表示するテキスト"
          value={config?.text_above || ''}
          onChange={(e) => handleFieldChange('text_above')(e.target.value)}
        />
      </div>
      <div className="ss-config-field">
        <span className="ss-config-field__label">ボタン下のテキスト</span>
        <textarea
          className="ss-input-value ss-textarea--setting"
          rows={2}
          placeholder="ボタンの下に表示するテキスト"
          value={config?.text_below || ''}
          onChange={(e) => handleFieldChange('text_below')(e.target.value)}
        />
      </div>
      <div className="ss-config-field">
        <span className="ss-config-field__label">ボタン画像</span>
        {imageUrl && (
          <div className="ss-amazon-pay-button-preview">
            <img
              src={imageUrl}
              alt="Amazon Pay button preview"
              className="ss-amazon-pay-button-img"
              style={{ '--ss-amazon-pay-btn-width': config?.button_image_width || '80%' }}
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
      <div className="ss-config-field">
        <span className="ss-config-field__label">ボタン画像幅</span>
        <InputCustom
          value={config?.button_image_width || '80%'}
          placeholder="80%"
          onChange={handleFieldChange('button_image_width')}
        />
      </div>
      {isUseFukushashiki && (
        <div className="ss-config-field">
          <span className="ss-config-field__label">クリック先（複写式）</span>
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
      <p className="ss-amazon-pay-hint">
        HTMLコードを手動入力する場合は、従来の「HTMLコード」タイプをご利用ください。
      </p>
    </div>
  );
};

export default AmazonPayButtonConfig;
