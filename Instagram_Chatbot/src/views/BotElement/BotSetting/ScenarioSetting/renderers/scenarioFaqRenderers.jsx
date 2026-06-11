import React from 'react';
import CheckboxCustom from '../scenarioComon/CheckboxCustom';

export const createRenderRootFaqOption = ({
  scenarioType,
  dataMessages,
  indexMessageSelect,
  setDataMessages,
}) => (wrapperClassName = null) => {
  if (scenarioType !== 'faq') return null;

  const checkbox = (
    <CheckboxCustom
      label="Root FAQ Message"
      onChange={(value) => {
        // Uncheck all other messages
        const updatedMessages = dataMessages.map((msg, idx) => {
          if (idx === indexMessageSelect) {
            return { ...msg, is_root_faq_msg: value };
          } else {
            return { ...msg, is_root_faq_msg: false };
          }
        });
        setDataMessages(updatedMessages);
      }}
      value={dataMessages[indexMessageSelect].is_root_faq_msg || false}
    />
  );

  if (wrapperClassName) {
    return (
      <div className={wrapperClassName}>
        {checkbox}
      </div>
    );
  }

  return checkbox;
};
