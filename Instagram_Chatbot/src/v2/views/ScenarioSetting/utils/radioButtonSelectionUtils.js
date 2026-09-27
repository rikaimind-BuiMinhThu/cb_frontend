const EMPTY_SELECTION_VALUE = '';
const PLACEHOLDER_VALUE_LABEL = '値';

export const getRadioOptionSelectionKey = (item) => {
  const value = item?.value;
  if (value !== undefined && value !== null) {
    const trimmed = String(value).trim();
    if (trimmed !== EMPTY_SELECTION_VALUE && trimmed !== PLACEHOLDER_VALUE_LABEL) {
      return value;
    }
  }
  return item?.id;
};

export const isRadioOptionInitiallySelected = (radioButton, item) => {
  const key = getRadioOptionSelectionKey(item);
  if (key === undefined || key === null || key === '') return false;
  return String(radioButton?.initial_selection) === String(key);
};

export const isEditorRadioOptionHighlighted = (
  editorSelectedRadioOption,
  indexMessageSelect,
  indexContent,
  subContentType,
  item,
) => {
  if (!editorSelectedRadioOption || !item) return false;
  return (
    editorSelectedRadioOption.indexMessageSelect === indexMessageSelect
    && editorSelectedRadioOption.indexContent === indexContent
    && editorSelectedRadioOption.subContentType === subContentType
    && editorSelectedRadioOption.optionId === item.id
  );
};

export const buildEditorRadioOptionDataAttr = (indexContent, item) => (
  `${indexContent}-${item?.id ?? ''}`
);
