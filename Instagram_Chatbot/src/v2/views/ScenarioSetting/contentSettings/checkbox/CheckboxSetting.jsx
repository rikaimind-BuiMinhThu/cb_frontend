import React from 'react';
import ContentSettingShell from '../shared/ContentSettingShell';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { CHECKBOX_TYPES } from '../../constants/contentTypeConstants';
import { typeCheckbox } from '../../constants/scenarioFormConstants';
import { buildCheckboxSettingContext } from './checkboxSettingContext';
import CheckboxSelectionOptions from './CheckboxSelectionOptions';
import DefaultTypeSetting from './DefaultTypeSetting';
import CheckboxImgTypeSetting from './CheckboxImgTypeSetting';
import ConsumeApiResponseTypeSetting from './ConsumeApiResponseTypeSetting';
import '../../styles/contentSettings/checkbox.css';

const CheckboxSetting = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    checkbox,
    numberMaxLength,
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

  const { changeContent, renderCheckedValueFukushashiki } = buildCheckboxSettingContext(props);

  const renderTypeSelector = () => (
    <ContentTypeSelector
      titleRequire={checkbox?.title_require}
      typeValue={checkbox?.type}
      typeOptions={typeCheckbox}
      onTitleRequireChange={changeContent('title_require')}
      onTypeChange={changeContent('type')}
    />
  );

  const renderTitle = () => {
    if (checkbox.title_require !== true) return null;
    return (
      <ContentTitleInput
        title={checkbox.title}
        onChange={changeContent('title')}
      />
    );
  };

  const renderSelectionOptions = () => {
    if (checkbox.type === CHECKBOX_TYPES.CONSUME_API_RESPONSE) return null;
    return <CheckboxSelectionOptions {...props} numberMaxLength={numberMaxLength} />;
  };

  const renderFukushashiki = () => {
    if (!isUseFukushashiki) return null;
    return renderCheckedValueFukushashiki();
  };

  const renderTypeBody = () => {
    switch (checkbox.type) {
      case CHECKBOX_TYPES.DEFAULT:
        return (
          <DefaultTypeSetting
            {...props}
            handleDragEndRadioCheckbox={handleDragEndRadioCheckbox}
            handleRemoveItemContent={handleRemoveItemContent}
            handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
          />
        );
      case CHECKBOX_TYPES.CHECKBOX_IMG:
        return (
          <CheckboxImgTypeSetting
            {...props}
            handleDragEndRadioCheckbox={handleDragEndRadioCheckbox}
            handleRemoveItemContent={handleRemoveItemContent}
            handleAddItemRadioCheckbox={handleAddItemRadioCheckbox}
            setIsOpenFileReference={setIsOpenFileReference}
            setVarFileReference={setVarFileReference}
            setAcceptFile={setAcceptFile}
          />
        );
      case CHECKBOX_TYPES.CONSUME_API_RESPONSE:
        return <ConsumeApiResponseTypeSetting {...props} />;
      default:
        return null;
    }
  };

  return (
    <ContentSettingShell
      contentType="checkbox"
      contentData={checkbox}
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
      {renderSelectionOptions()}
      {renderFukushashiki()}
      {renderTypeBody()}
    </ContentSettingShell>
  );
};

export default CheckboxSetting;
