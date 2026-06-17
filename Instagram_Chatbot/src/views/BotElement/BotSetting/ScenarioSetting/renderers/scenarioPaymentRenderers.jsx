import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';
import { SETTING_LABELS, SETTING_PLACEHOLDERS } from '../constants/scenarioSettingLabels';

export const createRenderPaymentMethodDescriptionInput = ({ setDataMessages }) => {
  const renderPaymentMethodDescriptionInput = ({ selectedItem, dataMessages }) => {
    if (!selectedItem.isUsedHTMLDescription) return null;
    return (
      <InputCustom
        maxLength={10000}
        className="ss-input--full-mb"
        label={SETTING_LABELS.htmlDescriptionCustomize}
        inline={false}
        placeholder={SETTING_PLACEHOLDERS.htmlDescription}
        value={selectedItem.descriptionContent}
        onChange={(value) => {
          selectedItem.descriptionContent = value;
          setDataMessages([...dataMessages]);
        }}
      />
    );
  };
  return renderPaymentMethodDescriptionInput;
};
