import React from 'react';
import { Button } from 'reactstrap';
import InputCustom from './InputCustom';
import FukushashikiSearchRow from '../contentSettings/shared/FukushashikiSearchRow';
import { DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL } from 'v2/variables/amazonPayConstants';
import { BOT_MESSAGE_TYPES } from 'v2/views/Preview/PreviewComponent/Constants';
import { FUKUSHASHIKI_VARIANTS, SETTING_BUTTON_LABELS } from '../constants/scenarioSettingLabels';

const AMAZON_PAY_BUTTON_LABELS = {
  textAbove: 'ボタン上のテキスト',
  textAbovePlaceholder: 'ボタンの上に表示するテキスト',
  textBelow: 'ボタン下のテキスト',
  textBelowPlaceholder: 'ボタンの下に表示するテキスト',
  buttonImage: 'ボタン画像',
  buttonImageAlt: 'Amazon Pay button preview',
  buttonImageWidth: 'ボタン画像幅',
  buttonImageWidthPlaceholder: '80%',
  fukushashikiClickTarget: 'クリック先（複写式）',
  htmlHint: 'HTMLコードを手動入力する場合は、従来の「HTMLコード」タイプをご利用ください。',
};

const BUTTON_IMAGE_URL_FIELD = 'button_image_url';
const DEFAULT_BUTTON_IMAGE_WIDTH = '80%';
const FUKUSHASHIKI_SELECT_ID = 'amazon-pay-button-fukushashiki-mode';

const AmazonPayButtonConfig = ({
  indexMessageSelect,
  indexContent = 0,
  config,
  onChangeValue,
  isUseFukushashiki,
  setIsOpenFileReference,
  setVarFileReference,
}) => {
  const messageType = BOT_MESSAGE_TYPES.AMAZON_PAY_BUTTON;
  const imageUrl = config?.button_image_url || DEFAULT_AMAZON_PAY_BUTTON_IMAGE_URL;
  const buttonImageWidth = config?.button_image_width || DEFAULT_BUTTON_IMAGE_WIDTH;

  const handleFieldChange = (fieldName) => (value) => {
    onChangeValue(indexMessageSelect, indexContent, messageType, value, fieldName);
  };

  const openButtonImageFileReference = () => {
    setVarFileReference({
      indexContent,
      contentType: messageType,
      fieldName: BUTTON_IMAGE_URL_FIELD,
    });
    setIsOpenFileReference(true);
  };

  return (
    <div className="ss-bot-statement-wrapper ss-bot-statement-type">
      <div className="ss-config-field">
        <span className="ss-config-field__label">{AMAZON_PAY_BUTTON_LABELS.textAbove}</span>
        <textarea
          className="ss-input-value ss-textarea--setting"
          rows={3}
          placeholder={AMAZON_PAY_BUTTON_LABELS.textAbovePlaceholder}
          value={config?.text_above || ''}
          onChange={(e) => handleFieldChange('text_above')(e.target.value)}
        />
      </div>
      <div className="ss-config-field">
        <span className="ss-config-field__label">{AMAZON_PAY_BUTTON_LABELS.textBelow}</span>
        <textarea
          className="ss-input-value ss-textarea--setting"
          rows={2}
          placeholder={AMAZON_PAY_BUTTON_LABELS.textBelowPlaceholder}
          value={config?.text_below || ''}
          onChange={(e) => handleFieldChange('text_below')(e.target.value)}
        />
      </div>
      <div className="ss-config-field">
        <span className="ss-config-field__label">{AMAZON_PAY_BUTTON_LABELS.buttonImage}</span>
        {imageUrl && (
          <div
            className="ss-amazon-pay-button-preview"
            style={{ '--ss-amazon-pay-btn-width': buttonImageWidth }}
          >
            <img
              src={imageUrl}
              alt={AMAZON_PAY_BUTTON_LABELS.buttonImageAlt}
              className="ss-amazon-pay-button-img"
            />
          </div>
        )}
        <div className="ss-file-upload-wrapper">
          <Button
            className="ss-bot-file-reference-btn"
            onClick={openButtonImageFileReference}
          >
            {SETTING_BUTTON_LABELS.fileReference}
          </Button>
        </div>
      </div>
      <div className="ss-config-field">
        <span className="ss-config-field__label">{AMAZON_PAY_BUTTON_LABELS.buttonImageWidth}</span>
        <InputCustom
          value={buttonImageWidth}
          placeholder={AMAZON_PAY_BUTTON_LABELS.buttonImageWidthPlaceholder}
          onChange={handleFieldChange('button_image_width')}
        />
      </div>
      {isUseFukushashiki && (
        <div className="ss-config-field">
          <span className="ss-config-field__label">{AMAZON_PAY_BUTTON_LABELS.fukushashikiClickTarget}</span>
          <FukushashikiSearchRow
            mode={config?.button_fukushashiki_search_mode}
            inputValue={config?.button_fukushashiki_search_value || ''}
            onModeChange={handleFieldChange('button_fukushashiki_search_mode')}
            onInputChange={handleFieldChange('button_fukushashiki_search_value')}
            variant={FUKUSHASHIKI_VARIANTS.DEFAULT}
            useFukushashiki
            selectId={FUKUSHASHIKI_SELECT_ID}
          />
        </div>
      )}
      <p className="ss-amazon-pay-hint">
        {AMAZON_PAY_BUTTON_LABELS.htmlHint}
      </p>
    </div>
  );
};

export default AmazonPayButtonConfig;
