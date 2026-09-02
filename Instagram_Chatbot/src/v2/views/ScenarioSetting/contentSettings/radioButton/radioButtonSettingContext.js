import { getRadioOptionSelectionKey } from 'v2/views/ScenarioSetting/utils/radioButtonSelectionUtils';

export const buildRadioButtonSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    radioButton,
    onChangeValueMessageContent,
  } = props;

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const toggleInitialSelection = (item) => {
    const selectionKey = getRadioOptionSelectionKey(item);
    if (String(radioButton.initial_selection) !== String(selectionKey)) {
      changeContent('initial_selection')(selectionKey);
    } else {
      changeContent('initial_selection')('');
    }
  };

  return {
    indexMessageSelect,
    indexContent,
    content,
    radioButton,
    changeContent,
    changeMessageField,
    toggleInitialSelection,
  };
};
