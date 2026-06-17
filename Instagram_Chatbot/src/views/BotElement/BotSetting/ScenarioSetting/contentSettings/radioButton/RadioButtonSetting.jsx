import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import { LABELS } from '../../../PreviewComponent/Constants';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { RADIO_BUTTON_TYPES } from '../../constants/contentTypeConstants';
import { typeRadio } from '../../constants/scenarioFormConstants';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import DefaultTypeSetting from './DefaultTypeSetting';
import RadioButtonImgTypeSetting from './RadioButtonImgTypeSetting';
import BlockStyleTypeSetting from './BlockStyleTypeSetting';
import ConsumeApiResponseTypeSetting from './ConsumeApiResponseTypeSetting';
import '../../styles/contentSettings/radioButton.css';

const RadioButtonSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    radioButton,
    dataMessages,
    setDataMessages,
    onChangeValueMessageContent,
    renderRootFaqOption,
    dataInputVar,
    setIsOpenAddVariable,
    isUseFukushashiki,
    handleDragEndRadioCheckbox,
    handleRemoveItemContent,
    handleAddItemRadioCheckbox,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;

  const {
    changeContent,
    renderInitialSelectionFukushashiki,
    renderGenderDisplayType,
  } = buildRadioButtonSettingContext(props);

  const renderGenderOption = () => (
    <CheckboxCustom
      label={LABELS.GENDER_OPTIONS.CHECKBOX_USE_AS_GENDER}
      onChange={changeContent('use_as_gender')}
      value={!!radioButton.use_as_gender}
    />
  );

  const renderTypeSelector = () => (
    <ContentTypeSelector
      titleRequire={radioButton?.title_require}
      typeValue={radioButton?.type}
      typeOptions={typeRadio}
      onTitleRequireChange={changeContent('title_require')}
      onTypeChange={changeContent('type')}
    />
  );

  const renderTitle = () => {
    if (radioButton.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={radioButton?.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderFukushashikiSection = () => {
    if (!isUseFukushashiki) return null;
    return (
      <>
        {renderInitialSelectionFukushashiki()}
        {renderGenderDisplayType()}
      </>
    );
  };

  const renderApiTypeBody = () => {
    if (radioButton.type !== RADIO_BUTTON_TYPES.CONSUME_API_RESPONSE) return null;
    return <ConsumeApiResponseTypeSetting {...props} />;
  };

  const renderItemsTypeBody = () => {
    if (radioButton.type === RADIO_BUTTON_TYPES.CONSUME_API_RESPONSE) return null;
    switch (radioButton.type) {
      case RADIO_BUTTON_TYPES.DEFAULT:
        return (
          <DefaultTypeSetting
            {...props}
            handleDragEndRadioCheckbox={handleDragEndRadioCheckbox}
            handleRemoveItemContent={handleRemoveItemContent}
            handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
          />
        );
      case RADIO_BUTTON_TYPES.RADIO_BUTTON_IMG:
        return (
          <RadioButtonImgTypeSetting
            {...props}
            handleDragEndRadioCheckbox={handleDragEndRadioCheckbox}
            handleRemoveItemContent={handleRemoveItemContent}
            handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
            setIsOpenFileReference={setIsOpenFileReference}
            setVarFileReference={setVarFileReference}
            setAcceptFile={setAcceptFile}
          />
        );
      case RADIO_BUTTON_TYPES.BLOCK_STYLE:
        return (
          <BlockStyleTypeSetting
            {...props}
            handleDragEndRadioCheckbox={handleDragEndRadioCheckbox}
            handleRemoveItemContent={handleRemoveItemContent}
            handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType="radio_button"
      contentData={radioButton}
      indexMessageSelect={indexMessageSelect}
      indexContent={indexContent}
      dataMessages={dataMessages}
      setDataMessages={setDataMessages}
      onChangeValueMessageContent={onChangeValueMessageContent}
      renderRootFaqOption={renderRootFaqOption}
      dataInputVar={dataInputVar}
      setIsOpenAddVariable={setIsOpenAddVariable}
      className="ss-radio-button-setting"
    >
      {renderGenderOption()}
      {renderTypeSelector()}
      {renderTitle()}
      {renderApiTypeBody()}
      {renderFukushashikiSection()}
      {renderItemsTypeBody()}
    </ContentSettingShell>
  );
};

export default RadioButtonSetting;
