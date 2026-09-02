export const buildAddressFieldSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    onChangeValueMessageContent,
    handleRemoveItemZipCodeAddress,
    isUseFukushashiki,
    dataPrefectures,
  } = props;

  const contentType = content.type;
  const addressData = content[contentType];
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const changeAddressField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, value, field);

  const changeMessageFukushashiki = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const removeField = (field) =>
    handleRemoveItemZipCodeAddress(indexMessageSelect, indexContent, contentType, field);

  const getFukushashikiProps = (modeKey, valueKey, selectId) => ({
    mode: messageContent?.[modeKey],
    inputValue: messageContent?.[valueKey] ?? '',
    onModeChange: changeMessageFukushashiki(modeKey),
    onInputChange: changeMessageFukushashiki(valueKey),
    selectId,
  });

  const isAddressFieldVisible = (fieldKey) => {
    if (addressData[fieldKey] === undefined) return false;
    if (fieldKey === 'address') {
      return !addressData.compact_municipality_and_address
        && !addressData.compact_municipality_and_address_and_building_name;
    }
    if (fieldKey === 'building_name') {
      return !addressData.compact_municipality_and_address_and_building_name;
    }
    return true;
  };

  return {
    contentType,
    addressData,
    messageContent,
    changeAddressField,
    changeMessageFukushashiki,
    removeField,
    getFukushashikiProps,
    isAddressFieldVisible,
    isUseFukushashiki,
    dataPrefectures,
    indexMessageSelect,
    indexContent,
    onChangeValueMessageContent,
  };
};
