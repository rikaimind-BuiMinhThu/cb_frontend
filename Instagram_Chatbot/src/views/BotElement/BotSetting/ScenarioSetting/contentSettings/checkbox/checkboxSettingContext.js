import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from '../../constants/scenarioSettingLabels';
import {
  getCheckboxImgSelectionKey,
  getCheckboxOptionSelectionKey,
} from '../../utils/checkboxSelectionUtils';

export const buildCheckboxSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    checkbox,
    dataMessages,
    onChangeValueMessageContent,
  } = props;

  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const renderCheckedValueFukushashiki = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-checkbox-setting__fukushashiki-spacer" />
      <FukushashikiSearchRow
        variant={FUKUSHASHIKI_VARIANTS.COMPACT}
        mode={messageContent?.checkedValue_fukushashiki_search_mode}
        inputValue={messageContent?.checkedValue_fukushashiki_search_value ?? ''}
        onModeChange={changeMessageField('checkedValue_fukushashiki_search_mode')}
        onInputChange={changeMessageField('checkedValue_fukushashiki_search_value')}
        useFukushashiki
        rowClassName="ss-checkbox-setting__fukushashiki-row"
      />
      <div className="ss-checkbox-setting__fukushashiki-spacer" />
    </div>
  );

  const toggleCheckedValue = (item) => {
    const selectionKey = getCheckboxOptionSelectionKey(item);
    const current = [...(checkbox.checkedValue ?? [])];
    const index = current.findIndex((value) => String(value) === String(selectionKey));
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(selectionKey);
    }
    changeContent('checkedValue')(current);
  };

  const toggleInitialSelectionPicture = (group, content) => {
    const selectionKey = getCheckboxImgSelectionKey(group, content);
    const current = [...(checkbox.initial_selection_picture ?? [])];
    const index = current.findIndex((value) => String(value) === String(selectionKey));
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(selectionKey);
    }
    changeContent('initial_selection_picture')(current);
  };

  return {
    indexMessageSelect,
    indexContent,
    content,
    checkbox,
    dataMessages,
    changeContent,
    changeMessageField,
    renderCheckedValueFukushashiki,
    toggleCheckedValue,
    toggleInitialSelectionPicture,
  };
};
