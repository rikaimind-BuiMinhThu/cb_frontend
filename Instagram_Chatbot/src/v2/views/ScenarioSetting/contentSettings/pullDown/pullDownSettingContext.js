export const buildPullDownSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    pullDown,
    dataMessages,
    onChangeValueMessageContent,
    onChangeTimePullDown,
  } = props;

  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];
  const typeConfig = pullDown?.[pullDown?.type];
  const pullDownType = pullDown?.type;

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const changeTypeField = (field) => (value) =>
    changeContent(pullDownType, field)(value);

  const changeTimeField = (field, dataKey) => (value) =>
    onChangeTimePullDown(
      indexMessageSelect,
      indexContent,
      content.type,
      value,
      pullDownType,
      field,
      dataKey,
    );

  return {
    ...props,
    messageContent,
    typeConfig,
    pullDownType,
    changeContent,
    changeMessageField,
    changeTypeField,
    changeTimeField,
  };
};
