import { renderFukushashikiSetting } from '../../ScenarioUtils';

export const buildTextInputSettingContext = ({
  indexMessageSelect,
  indexContent,
  content,
  textInput,
  dataMessages,
  onChangeValueMessageContent,
}) => {
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];
  const typeConfig = textInput?.[textInput?.type];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const renderFukushashikiRow = (modeKey, valueKey, options = {}) =>
    renderFukushashikiSetting({
      mode: messageContent?.[modeKey],
      inputValue: messageContent?.[valueKey] ?? '',
      onModeChange: changeMessageField(modeKey),
      onInputChange: changeMessageField(valueKey),
      useFukushashiki: true,
      maxLength: 250,
      ...options,
    });

  return {
    indexMessageSelect,
    indexContent,
    content,
    textInput,
    messageContent,
    typeConfig,
    changeContent,
    changeMessageField,
    renderFukushashikiRow,
  };
};
