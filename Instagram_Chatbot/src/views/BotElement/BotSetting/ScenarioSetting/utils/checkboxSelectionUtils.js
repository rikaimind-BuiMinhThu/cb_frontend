export function getCheckboxOptionSelectionKey(item) {
  const value = item?.value;
  if (value !== undefined && value !== null && String(value).trim() !== '') {
    return value;
  }
  return item?.id;
}

export function getCheckboxImgSelectionKey(group, content) {
  return `${group?.id}-${content?.id}`;
}

export function isCheckboxOptionChecked(checkbox, item) {
  const key = getCheckboxOptionSelectionKey(item);
  if (key === undefined || key === null || key === '') return false;
  const checkedValue = checkbox?.checkedValue ?? [];
  return checkedValue.some((value) => String(value) === String(key));
}

export function isCheckboxImgContentChecked(checkbox, group, content) {
  const key = getCheckboxImgSelectionKey(group, content);
  const initialSelection = checkbox?.initial_selection_picture ?? [];
  return initialSelection.some((value) => String(value) === String(key));
}

export function isEditorCheckboxOptionHighlighted(
  editorSelectedCheckboxOption,
  indexMessageSelect,
  indexContent,
  subContentType,
  optionId,
) {
  if (!editorSelectedCheckboxOption || optionId == null) return false;
  return (
    editorSelectedCheckboxOption.indexMessageSelect === indexMessageSelect
    && editorSelectedCheckboxOption.indexContent === indexContent
    && editorSelectedCheckboxOption.subContentType === subContentType
    && String(editorSelectedCheckboxOption.optionId) === String(optionId)
  );
}

export function buildEditorCheckboxOptionDataAttr(indexContent, optionId) {
  return `${indexContent}-${optionId ?? ''}`;
}
