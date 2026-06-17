import React from 'react';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputCustom from '../scenarioComon/InputCustom';
import { AFTEE_PAYMENT_TYPE_OPTIONS, SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';
import '../styles/contentSettings/aftee.css';

const AfteePaymentModuleSetting = ({
  content,
  indexMessageSelect,
  indexContent,
  onChangeValueMessageContent,
}) => {
  const afteePaymentModule = content.AFTEE_payment_module;

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const renderTypeSelect = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          className="ss-select--half"
          value={afteePaymentModule.type}
          data={AFTEE_PAYMENT_TYPE_OPTIONS}
          onChange={changeField('type')}
        />
      </div>
    </div>
  );

  const renderContentTextarea = () => (
    <div className="ss-user-setting__item-bottom">
      <textarea
        className="ss-user-setting-item-textarea-label ss-input-value ss-aftee-setting__textarea"
        placeholder={SETTING_PLACEHOLDERS.text}
        rows="5"
        value={afteePaymentModule.content}
        onChange={(e) => changeField('content')(e.target.value)}
      />
    </div>
  );

  return (
    <>
      {renderTypeSelect()}
      {renderContentTextarea()}
    </>
  );
};

export default AfteePaymentModuleSetting;
