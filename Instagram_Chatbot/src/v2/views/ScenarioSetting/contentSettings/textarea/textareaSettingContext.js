import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import { FUKUSHASHIKI_VARIANTS } from '../../constants/scenarioSettingLabels';

export const buildTextareaSettingContext = ({
  indexMessageSelect,
  indexContent,
  content,
  textarea,
  dataMessages,
  onChangeValueMessageContent,
}) => {
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];
  const typeConfig = textarea?.[textarea?.type];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const renderFukushashikiRow = () => (
    <FukushashikiSearchRow
      variant={FUKUSHASHIKI_VARIANTS.COMPACT}
      mode={messageContent?.fukushashiki_search_mode}
      inputValue={messageContent?.fukushashiki_search_value ?? ''}
      onModeChange={changeMessageField('fukushashiki_search_mode')}
      onInputChange={changeMessageField('fukushashiki_search_value')}
      useFukushashiki
      rowClassName="ss-user-setting__item-bottom"
    />
  );

  return {
    indexMessageSelect,
    indexContent,
    content,
    textarea,
    typeConfig,
    changeContent,
    changeMessageField,
    renderFukushashikiRow,
  };
};
