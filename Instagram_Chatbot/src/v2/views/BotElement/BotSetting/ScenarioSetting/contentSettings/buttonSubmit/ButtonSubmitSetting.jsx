import React from 'react';
import { Button } from 'reactstrap';
import InputCustom from '../../scenarioCommon/InputCustom';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import ContentSettingShell from '../shared/ContentSettingShell';
import SubmitButtonConfig from '../../SubmitButtonConfig';
import {
  BUTTON_SUBMIT_LABELS,
  FUKUSHASHIKI_VARIANTS,
  SETTING_BUTTON_LABELS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';
import '../../styles/contentSettings/buttonSubmit.css';

const ButtonSubmitSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
  setIsOpenFileReference,
  setVarFileReference,
  setAcceptFile,
}) => {
  const buttonSubmit = content.button_submit;
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  if (content.type !== 'button_submit') return null;

  const changeContent = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const updateMessageField = (field, value) => {
    setDataMessages(dataMessages.map((msg, i) => (
      i === indexMessageSelect ? { ...msg, [field]: value } : msg
    )));
  };

  const renderOptionCheckbox = (label, field, useMessageField = false) => (
    <div className="ss-button-submit-setting__option-col">
      <CheckboxCustom
        label={label}
        onChange={useMessageField
          ? (value) => updateMessageField(field, value)
          : changeContent(field)}
        value={useMessageField
          ? dataMessages[indexMessageSelect][field]
          : buttonSubmit[field]}
        isOnChange={field === 'is_save_input_content' ? false : undefined}
      />
    </div>
  );

  const renderOptionsRow = () => (
    <div className="ss-user-setting__item-bottom ss-button-submit-setting__options-row">
      {renderOptionCheckbox(BUTTON_SUBMIT_LABELS.displayErrorMessage, 'is_display_error_message')}
      {renderOptionCheckbox(BUTTON_SUBMIT_LABELS.useJs, 'is_use_js')}
      {renderOptionCheckbox(SETTING_LABELS.saveToVariable, 'is_save_input_content')}
      {renderOptionCheckbox(BUTTON_SUBMIT_LABELS.confirmOrder, 'use_for_confirm_order')}
      {renderOptionCheckbox(BUTTON_SUBMIT_LABELS.confirmDisplayOnly, 'only_display_when_confirm', true)}
    </div>
  );

  const renderSaveVariableSelect = () => {
    if (!buttonSubmit.is_save_input_content) return null;
    return (
      <div className="ss-user-setting__item-bottom">
        <div className="ss-user-setting__item-select-bottom-wrapper-flex">
          <SelectCustom
            className="ss-select--full-mr"
            id="title"
            value={buttonSubmit.save_input_content}
            data={dataInputVar}
            keyValue="variable_name"
            nameValue="variable_name"
            onChange={changeContent('save_input_content')}
          />
          <Button
            className="ss-user-setting__select-btn-add ss-drag-add-btn"
            onClick={() => setIsOpenAddVariable(true)}
          >
            {SETTING_BUTTON_LABELS.add}
          </Button>
        </div>
      </div>
    );
  };

  const renderErrorMessageRow = () => {
    if (!buttonSubmit.is_display_error_message) return null;
    return (
      <div className="ss-user-setting__item-bottom ss-button-submit-setting__error-row">
        <FukushashikiSearchRow
          variant={FUKUSHASHIKI_VARIANTS.COMPACT}
          selectId="title"
          mode={messageContent?.error_message_display_element_search_type}
          inputValue={messageContent?.error_message_display_element_search_value ?? ''}
          onModeChange={changeMessageField('error_message_display_element_search_type')}
          onInputChange={changeMessageField('error_message_display_element_search_value')}
          useFukushashiki
          rowClassName="ss-button-submit-setting__error-row"
        />
      </div>
    );
  };

  const renderJsCode = () => {
    if (!buttonSubmit.is_use_js) return null;
    return (
      <>
        <div className="ss-user-setting__item-bottom ss-button-submit-setting__js-label">
          {BUTTON_SUBMIT_LABELS.jsCode}
        </div>
        <div className="ss-user-setting__item-bottom">
          <textarea
            className="ss-user-setting-item-textarea-label ss-input-value ss-button-submit-setting__js-textarea"
            placeholder={SETTING_PLACEHOLDERS.text}
            rows="8"
            value={buttonSubmit.jscode}
            onChange={(e) => changeContent('jscode')(e.target.value)}
          />
        </div>
      </>
    );
  };

  const renderImageSettings = () => (
    <div className="ss-button-submit-setting__image-section">
      <div className="ss-button-submit-setting__field-label ss-button-submit-setting__field-label--spaced">
        {BUTTON_SUBMIT_LABELS.buttonImage}
      </div>
      {buttonSubmit.button_image_url && (
        <div className="ss-button-submit-setting__image-preview-card">
          <img
            className="ss-button-submit-setting__image-preview"
            src={buttonSubmit.button_image_url}
            alt=""
          />
        </div>
      )}
      <div className="ss-setting-file-upload-wrapper ss-button-submit-setting__image-actions">
        <Button
          className="ss-bot-file-reference-btn ss-setting-file-upload-btn--spaced"
          onClick={() => {
            setIsOpenFileReference(true);
            setVarFileReference({
              indexContent,
              contentType: content.type,
              subContentType: 'button_image_url',
            });
            setAcceptFile(['image']);
          }}
        >
          {SETTING_BUTTON_LABELS.fileReference}
        </Button>
        {buttonSubmit.button_image_url && (
          <Button
            className="ss-bot-file-reference-btn"
            onClick={() => changeContent('button_image_url')('')}
          >
            {BUTTON_SUBMIT_LABELS.clearImage}
          </Button>
        )}
      </div>
      <InputCustom
        className="ss-user-setting-input-overview ss-button-submit-setting__field-input"
        labelClassName="ss-input-custom-label--spaced"
        label={BUTTON_SUBMIT_LABELS.buttonImageWidth}
        inline={false}
        placeholder="80%"
        onChange={changeContent('button_image_width')}
        value={buttonSubmit.button_image_width || '80%'}
      />
    </div>
  );

  const renderButtonFields = () => (
    <div className="ss-user-setting__item-text_input-top ss-button-submit-setting__fields">
      <InputCustom
        className="ss-user-setting-input-overview ss-button-submit-setting__field-input"
        labelClassName="ss-input-custom-label--wide"
        label={BUTTON_SUBMIT_LABELS.buttonId}
        inline={false}
        placeholder={SETTING_PLACEHOLDERS.buttonId}
        onChange={changeMessageField('button_submit_id')}
        value={messageContent?.button_submit_id}
      />
      <InputCustom
        className="ss-user-setting-input-overview ss-button-submit-setting__field-input"
        labelClassName="ss-input-custom-label--spaced"
        label={BUTTON_SUBMIT_LABELS.buttonName}
        inline={false}
        placeholder={SETTING_PLACEHOLDERS.buttonName}
        onChange={changeMessageField('button_submit_name')}
        value={content.button_submit_name}
      />
      {renderImageSettings()}
      <SubmitButtonConfig
        content={content}
        onChange={onChangeValueMessageContent}
        indexMessageSelect={indexMessageSelect}
        indexContent={indexContent}
        buttonSubmit={buttonSubmit}
      />
    </div>
  );

  return (
    <ContentSettingShell
      contentType="button_submit"
      contentData={buttonSubmit}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderOptionsRow()}
      {renderSaveVariableSelect()}
      {renderErrorMessageRow()}
      {renderJsCode()}
      {renderButtonFields()}
    </ContentSettingShell>
  );
};

export default ButtonSubmitSetting;
