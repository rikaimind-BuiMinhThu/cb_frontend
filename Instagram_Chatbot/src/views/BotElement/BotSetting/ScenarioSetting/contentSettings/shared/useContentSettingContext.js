import { useScenarioContentSettingProps } from '../../hooks/useScenarioContentSettingProps';

/**
 * Unified change helpers for content setting components.
 */
export const useContentSettingContext = (props) => {
  const { indexMessageSelect, indexContent, content } = props;
  const ctx = useScenarioContentSettingProps(indexMessageSelect, indexContent, content);

  const changeContent = (...path) => (value) =>
    ctx.onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeContentField = (field) => (value) =>
    ctx.onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const changeMessageField = (field) => (value) =>
    ctx.onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const updateMessageField = (field, value) => {
    Object.assign(ctx.dataMessages[indexMessageSelect], { [field]: value });
    ctx.setDataMessages([...ctx.dataMessages]);
  };

  return {
    ...ctx,
    changeContent,
    changeContentField,
    changeMessageField,
    updateMessageField,
  };
};
