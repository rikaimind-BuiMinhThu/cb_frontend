import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from '../../constants/scenarioSettingLabels';

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

  return {
    indexMessageSelect,
    indexContent,
    content,
    checkbox,
    dataMessages,
    changeContent,
    changeMessageField,
    renderCheckedValueFukushashiki,
  };
};
