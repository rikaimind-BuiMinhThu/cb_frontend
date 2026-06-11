import React from 'react';
import InputCustom from '../scenarioComon/InputCustom';

export const createRenderPaymentMethodDescriptionInput = ({ setDataMessages }) => ({ selectedItem, dataMessages }) => {
  if (!selectedItem.isUsedHTMLDescription) return null;
  return (
    <InputCustom
      maxLength={10000}
      style={{ width: '100%', marginBottom: '5px' }}
      label="HTMLの説明をカスタマイズする"
      inline={false}
      placeholder="ここにHTMLを入力してください"
      value={selectedItem.descriptionContent}
      onChange={(value) => {
        selectedItem.descriptionContent = value;
        setDataMessages([...dataMessages]);
      }}
    />
  );
};
