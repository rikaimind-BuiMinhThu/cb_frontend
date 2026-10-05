import React from 'react';
import CheckboxCustom from '../scenarioCommon/CheckboxCustom';
import { SETTING_LABELS } from '../constants/scenarioSettingLabels';

export const createRenderRootFaqOption = ({
  scenarioType,
  dataMessages,
  indexMessageSelect,
  setDataMessages,
}) => {
  const renderRootFaqCheckbox = () => (
    <CheckboxCustom
      label={SETTING_LABELS.rootFaqMessage}
      onChange={(value) => {
        const updatedMessages = dataMessages.map((msg, idx) => {
          if (idx === indexMessageSelect) {
            return { ...msg, is_root_faq_msg: value };
          }
          return { ...msg, is_root_faq_msg: false };
        });
        setDataMessages(updatedMessages);
      }}
      value={dataMessages[indexMessageSelect].is_root_faq_msg || false}
    />
  );

  const renderRootFaqOption = (wrapperClassName = null) => {
    if (scenarioType !== 'faq') return null;

    if (wrapperClassName) {
      return (
        <div className={wrapperClassName}>
          {renderRootFaqCheckbox()}
        </div>
      );
    }

    return renderRootFaqCheckbox();
  };

  return renderRootFaqOption;
};
