import { renderFukushashikiSetting } from '../../ScenarioUtils';
import { createDefaultDomainSuggestion } from 'v2/views/Preview/PreviewComponent/emailDomainDefaults';

export const buildTextInputSettingContext = ({
  indexMessageSelect,
  indexContent,
  content,
  textInput,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
}) => {
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];
  const typeConfig = textInput?.[textInput?.type];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const ensureEmailDomainSuggestion = (emailType) => {
    const textInputData = dataMessages[indexMessageSelect].message_content[indexContent].text_input;
    if (!textInputData[emailType] || typeof textInputData[emailType] !== 'object') {
      textInputData[emailType] = {};
    }
    if (!textInputData[emailType].domain_suggestion) {
      textInputData[emailType].domain_suggestion = createDefaultDomainSuggestion();
    }
  };

  const handleChangeTextInputType = (value) => {
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, 'type');
    if (value === 'email_address' || value === 'email_confirmation') {
      ensureEmailDomainSuggestion(value);
      setDataMessages([...dataMessages]);
    }
  };

  const handleAddEmailDomain = (emailType) => {
    ensureEmailDomainSuggestion(emailType);
    const domains =
      dataMessages[indexMessageSelect].message_content[indexContent].text_input[emailType]
        .domain_suggestion.domains;
    const idMax = domains.length > 0 ? Math.max(...domains.map((item) => item.id)) + 1 : 1;
    domains.push({ id: idMax, domain: '' });
    setDataMessages([...dataMessages]);
  };

  const handleRemoveEmailDomain = (emailType, indexDomain) => {
    const domains =
      dataMessages[indexMessageSelect].message_content[indexContent].text_input[emailType]
        .domain_suggestion.domains;
    dataMessages[indexMessageSelect].message_content[indexContent].text_input[
      emailType
    ].domain_suggestion.domains = domains.filter((_, index) => index !== indexDomain);
    setDataMessages([...dataMessages]);
  };

  const handleResetEmailDomains = (emailType) => {
    ensureEmailDomainSuggestion(emailType);
    dataMessages[indexMessageSelect].message_content[indexContent].text_input[
      emailType
    ].domain_suggestion.domains = createDefaultDomainSuggestion().domains;
    setDataMessages([...dataMessages]);
  };

  const handleChangeEmailDomainSuggestion = (emailType, field, value) => {
    ensureEmailDomainSuggestion(emailType);
    dataMessages[indexMessageSelect].message_content[indexContent].text_input[
      emailType
    ].domain_suggestion[field] = value;
    setDataMessages([...dataMessages]);
  };

  const handleChangeEmailDomainValue = (emailType, indexDomain, value) => {
    ensureEmailDomainSuggestion(emailType);
    dataMessages[indexMessageSelect].message_content[indexContent].text_input[
      emailType
    ].domain_suggestion.domains[indexDomain].domain = value;
    setDataMessages([...dataMessages]);
  };

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
    handleChangeTextInputType,
    ensureEmailDomainSuggestion,
    handleAddEmailDomain,
    handleRemoveEmailDomain,
    handleResetEmailDomains,
    handleChangeEmailDomainSuggestion,
    handleChangeEmailDomainValue,
    renderFukushashikiRow,
  };
};
