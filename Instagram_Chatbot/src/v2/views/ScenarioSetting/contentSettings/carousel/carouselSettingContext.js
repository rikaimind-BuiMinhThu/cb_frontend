export const buildCarouselSettingContext = (props) => {
  const { indexMessageSelect, indexContent, content, onChangeValueMessageContent } = props;

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  return { changeContent };
};
