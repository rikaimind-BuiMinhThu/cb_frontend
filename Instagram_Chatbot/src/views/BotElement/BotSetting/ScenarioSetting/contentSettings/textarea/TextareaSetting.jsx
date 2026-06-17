import React from 'react';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { TEXTAREA_TYPES } from '../../constants/contentTypeConstants';
import { typeTextarea } from '../../constants/scenarioFormConstants';
import { buildTextareaSettingContext } from './textareaSettingContext';
import TextInputTypeSetting from './TextInputTypeSetting';
import InvalidInputTypeSetting from './InvalidInputTypeSetting';
import ConsumeApiResponseTypeSetting from './ConsumeApiResponseTypeSetting';
import '../../styles/contentSettings/textarea.css';

const TYPE_SETTING_MAP = {
  [TEXTAREA_TYPES.TEXT_INPUT]: TextInputTypeSetting,
  [TEXTAREA_TYPES.INVALID_INPUT]: InvalidInputTypeSetting,
  [TEXTAREA_TYPES.CONSUME_API_RESPONSE]: ConsumeApiResponseTypeSetting,
};

const TextareaSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    textarea,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
  } = props;

  const { changeContent } = buildTextareaSettingContext(props);
  const TypeComponent = TYPE_SETTING_MAP[textarea.type];

  const renderTypeSelector = () => (
    <ContentTypeSelector
      titleRequire={textarea?.title_require}
      typeValue={textarea.type}
      typeOptions={typeTextarea}
      onTitleRequireChange={changeContent('title_require')}
      onTypeChange={changeContent('type')}
    />
  );

  const renderTitle = () => {
    if (textarea.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={textarea?.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderTypeBody = () => {
    if (!TypeComponent) return null;
    return <TypeComponent {...props} />;
  };

  return (
    <ContentSettingShell
      contentType="textarea"
      contentData={textarea}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
    >
      {renderTypeSelector()}
      {renderTitle()}
      {renderTypeBody()}
    </ContentSettingShell>
  );
};

export default TextareaSetting;
