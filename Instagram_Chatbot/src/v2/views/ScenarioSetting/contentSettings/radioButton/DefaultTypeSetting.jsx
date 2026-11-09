import React from 'react';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';
import RadioButtonItemsList from './RadioButtonItemsList';
import RadioOptionDesignControls from './RadioOptionDesignControls';

const DefaultTypeSetting = (props) => {
  const {
    radioButton,
    indexContent,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const { content, changeContent, toggleInitialSelection } = buildRadioButtonSettingContext(props);

  const renderItemExtra = (itemRadio, indexRadio) => (
    <div className="ss-radio-button-setting__default-item-extra">
      <InitialSelectionCheckbox
        item={itemRadio}
        radioButton={radioButton}
        toggleInitialSelection={toggleInitialSelection}
      />
      <RadioOptionDesignControls
        radioButton={radioButton}
        item={itemRadio}
        optionIndex={indexRadio}
        indexContent={indexContent}
        contentType={content.type}
        changeContent={changeContent}
        setIsOpenFileReference={setIsOpenFileReference}
        setVarFileReference={setVarFileReference}
        setAcceptFile={setAcceptFile}
      />
    </div>
  );

  return (
    <RadioButtonItemsList
      {...props}
      renderItemExtra={renderItemExtra}
    />
  );
};

export default DefaultTypeSetting;
