import React from 'react';
import OptionGenderConfig from '../../OptionGenderConfig';
import { isGenderRadio } from '../../utils/radioButtonGenderUtils';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';
import RadioButtonItemsList from './RadioButtonItemsList';

const ACCEPT_IMAGE_FILES = ['image'];

const DefaultTypeSetting = (props) => {
  const {
    radioButton,
    indexContent,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const { content, changeContent, toggleInitialSelection } = buildRadioButtonSettingContext(props);

  const openGenderIconFilePicker = (indexRadio) => (event) => {
    event.stopPropagation();
    if (!setIsOpenFileReference || !setVarFileReference) return;
    setAcceptFile?.(ACCEPT_IMAGE_FILES);
    setIsOpenFileReference(true);
    setVarFileReference({
      genderIconUrl: true,
      indexContent,
      contentType: content.type,
      subContentType: radioButton.type,
      indexSubContent: indexRadio,
    });
  };

  const renderItemExtra = (itemRadio, indexRadio) => (
    <div className="ss-radio-button-setting__default-item-extra">
      <InitialSelectionCheckbox
        item={itemRadio}
        radioButton={radioButton}
        toggleInitialSelection={toggleInitialSelection}
      />
      {isGenderRadio(radioButton) && (
        <OptionGenderConfig
          value={itemRadio.preset_config}
          onChange={changeContent(radioButton.type, indexRadio, 'preset_config')}
          onOpenIconFilePicker={openGenderIconFilePicker(indexRadio)}
        />
      )}
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
