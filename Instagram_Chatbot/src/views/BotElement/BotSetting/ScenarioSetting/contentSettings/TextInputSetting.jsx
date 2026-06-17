import React from 'react';
import ContentSettingShell from './shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from './shared/ContentTypeSelector';
import { type as textInputTypeOptions } from '../constants/scenarioFormConstants';
import { TEXT_INPUT_TYPES } from '../constants/contentTypeConstants';
import TextTypeSetting from './textInput/TextTypeSetting';
import UrlsTypeSetting from './textInput/UrlsTypeSetting';
import EmailAddressTypeSetting from './textInput/EmailAddressTypeSetting';
import EmailConfirmationTypeSetting from './textInput/EmailConfirmationTypeSetting';
import PhoneNumberTypeSetting from './textInput/PhoneNumberTypeSetting';
import PasswordTypeSetting from './textInput/PasswordTypeSetting';
import { buildTextInputSettingContext } from './textInput/textInputSettingContext';
import '../styles/contentSettings/textInput.css';

const TYPE_SETTING_MAP = {
  [TEXT_INPUT_TYPES.TEXT]: TextTypeSetting,
  [TEXT_INPUT_TYPES.URLS]: UrlsTypeSetting,
  [TEXT_INPUT_TYPES.EMAIL_ADDRESS]: EmailAddressTypeSetting,
  [TEXT_INPUT_TYPES.EMAIL_CONFIRMATION]: EmailConfirmationTypeSetting,
  [TEXT_INPUT_TYPES.PHONE_NUMBER]: PhoneNumberTypeSetting,
  [TEXT_INPUT_TYPES.PASSWORD]: PasswordTypeSetting,
  [TEXT_INPUT_TYPES.PASSWORD_CONFIRMATION]: PasswordTypeSetting,
};

const TextInputSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    textInput,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  const { changeContent } = buildTextInputSettingContext(props);

  const renderTitleInput = () => {
    if (textInput?.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={textInput.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderTypeContent = () => {
    const TypeComponent = TYPE_SETTING_MAP[textInput.type];
    if (!TypeComponent) return null;
    return <TypeComponent {...props} />;
  };

  return (
    <ContentSettingShell
      contentType="text_input"
      contentData={textInput}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-text-input-setting"
    >
      <ContentTypeSelector
        titleRequire={textInput.title_require}
        typeValue={textInput.type}
        typeOptions={textInputTypeOptions}
        onTitleRequireChange={changeContent('title_require')}
        onTypeChange={changeContent('type')}
      />
      {renderTitleInput()}
      {renderTypeContent()}
    </ContentSettingShell>
  );
};

export default TextInputSetting;
