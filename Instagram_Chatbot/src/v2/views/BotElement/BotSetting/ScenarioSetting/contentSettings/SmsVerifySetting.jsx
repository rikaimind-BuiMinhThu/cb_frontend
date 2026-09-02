import React from 'react';
import ContentSettingShell from './shared/ContentSettingShell';
import { ContentTitleInput } from './shared/ContentTypeSelector';
import SelectCustom from '../scenarioCommon/SelectCustom';
import { dropDownTitle } from '../constants/scenarioFormConstants';

const SmsVerifySetting = ({
  content,
  indexMessageSelect,
  indexContent,
  dataMessages,
  setDataMessages,
  onChangeValueMessageContent,
  renderRootFaqOption,
  dataInputVar,
  setIsOpenAddVariable,
}) => {
  const smsVerify = content.sms_verify;

  const changeField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, field);

  const renderTitleRequire = () => (
    <div className="ss-user-setting__item-bottom">
      <div className="ss-user-setting__item-select-bottom-wrapper-flex">
        <SelectCustom
          id="title"
          className="ss-select--half"
          value={smsVerify.title_require}
          data={dropDownTitle}
          onChange={changeField('title_require')}
          keyValue="key"
        />
      </div>
    </div>
  );

  const renderTitle = () => {
    if (smsVerify?.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={smsVerify.title}
        onChange={changeField('title')}
      />
    );
  };

  return (
    <ContentSettingShell
      contentType="sms_verify"
      contentData={smsVerify}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderTitleRequire()}
      {renderTitle()}
    </ContentSettingShell>
  );
};

export default SmsVerifySetting;
