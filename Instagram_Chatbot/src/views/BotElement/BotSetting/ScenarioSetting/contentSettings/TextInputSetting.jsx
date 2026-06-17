import React from 'react';
import SelectCustom from '../scenarioComon/SelectCustom';
import InputCustom from '../scenarioComon/InputCustom';
import UserContentCommonOptions from './shared/UserContentCommonOptions';
import { dropDownTitle, type as textInputTypeOptions } from '../constants/scenarioFormConstants';
import TextTypeSetting from './textInput/TextTypeSetting';
import UrlsTypeSetting from './textInput/UrlsTypeSetting';
import EmailAddressTypeSetting from './textInput/EmailAddressTypeSetting';
import EmailConfirmationTypeSetting from './textInput/EmailConfirmationTypeSetting';
import PhoneNumberTypeSetting from './textInput/PhoneNumberTypeSetting';
import PasswordTypeSetting from './textInput/PasswordTypeSetting';
import { buildTextInputSettingContext } from './textInput/textInputSettingContext';

const TYPE_SETTING_MAP = {
  text: TextTypeSetting,
  urls: UrlsTypeSetting,
  email_address: EmailAddressTypeSetting,
  email_confirmation: EmailConfirmationTypeSetting,
  phone_number: PhoneNumberTypeSetting,
  password: PasswordTypeSetting,
  password_confirmation: PasswordTypeSetting,
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
  const TypeComponent = TYPE_SETTING_MAP[textInput.type];

  return (
    <>
      <UserContentCommonOptions
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
      />
      <div className="ss-text-input-setting">
        <div className="ss-user-setting__item-bottom">
          <div className="ss-user-setting__item-select-bottom-wrapper-flex">
            <SelectCustom
              id="title"
              value={textInput.title_require}
              data={dropDownTitle}
              onChange={changeContent('title_require')}
              keyValue="key"
            />
            <SelectCustom
              id="type"
              allowClear={false}
              value={textInput.type}
              data={textInputTypeOptions}
              onChange={changeContent('type')}
              keyValue="key"
            />
          </div>
        </div>
        {textInput?.title_require === true && (
          <div className="ss-user-setting__item-bottom">
            <InputCustom
              placeholder="タイトル"
              onChange={changeContent('title')}
              value={textInput.title}
            />
          </div>
        )}
        {TypeComponent && <TypeComponent {...props} />}
      </div>
    </>
  );
};

export default TextInputSetting;
