import React from 'react';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../scenarioCommon/InputCustom';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import {
  getRadioOptionDesignType,
  getRadioOptionNormalImage,
  mirrorRadioOptionNormalImage,
} from '../../utils/radioOptionDesign';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';
import RadioButtonItemsList from './RadioButtonItemsList';
import RadioButtonImgLayoutSection from './RadioButtonImgLayoutSection';
import RadioOptionDesignControls from './RadioOptionDesignControls';

const RadioButtonImgTypeSetting = (props) => {
  const {
    radioButton,
    indexContent,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const { content, changeContent, toggleInitialSelection } = buildRadioButtonSettingContext(props);
  const designType = getRadioOptionDesignType(radioButton);

  const updateNormalImage = (indexRadio, itemRadio) => (value) => {
    const nextOption = mirrorRadioOptionNormalImage(itemRadio, value, designType);
    changeContent(radioButton.type, indexRadio, 'img')(nextOption.img);
    changeContent(radioButton.type, indexRadio, 'design')(nextOption.design);
  };

  const renderItemGrip = () => (
    <MDBIcon fas icon="grip-horizontal" className="ss-radio-button-setting__img-grip" />
  );

  const renderItemPrefix = (itemRadio, indexRadio) => (
    <div className="ss-radio-button-setting__img-file-row">
      <InputCustom
        className="ss-radio-button-setting__img-file-input"
        placeholder={RADIO_BUTTON_LABELS.fileUrl}
        onChange={updateNormalImage(indexRadio, itemRadio)}
        value={getRadioOptionNormalImage(itemRadio)}
      />
      <MDBIcon
        onClick={(e) => {
          e.stopPropagation();
          setIsOpenFileReference(true);
          setVarFileReference({
            radioDesign: true,
            designState: 'normal',
            indexContent,
            contentType: content.type,
            subContentType: radioButton.type,
            indexSubContent: indexRadio,
          });
          setAcceptFile(['image']);
        }}
        fas
        icon="paperclip"
        className="ss-radio-button-setting__paperclip"
      />
    </div>
  );

  const renderItemExtra = (itemRadio, indexRadio) => (
    <div className="ss-radio-button-setting__img-item-footer">
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
    <>
      <RadioButtonImgLayoutSection
        radioButton={radioButton}
        changeContent={changeContent}
      />
      <RadioButtonItemsList
        {...props}
        showGripOnInputRow={false}
        showTextInput={false}
        renderItemGrip={renderItemGrip}
        itemBodyClassName="ss-radio-button-setting__img-item-body"
        renderItemPrefix={renderItemPrefix}
        renderItemExtra={renderItemExtra}
      />
    </>
  );
};

export default RadioButtonImgTypeSetting;
