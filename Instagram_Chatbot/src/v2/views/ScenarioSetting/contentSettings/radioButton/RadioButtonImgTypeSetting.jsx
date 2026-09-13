import React from 'react';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../scenarioCommon/InputCustom';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';
import RadioButtonItemsList from './RadioButtonItemsList';
import RadioButtonImgLayoutSection from './RadioButtonImgLayoutSection';

const RadioButtonImgTypeSetting = (props) => {
  const {
    radioButton,
    indexContent,
    setIsOpenFileReference,
    setVarFileReference,
    setAcceptFile,
  } = props;
  const { content, changeContent, toggleInitialSelection } = buildRadioButtonSettingContext(props);

  const renderItemGrip = () => (
    <MDBIcon fas icon="grip-horizontal" className="ss-radio-button-setting__img-grip" />
  );

  const renderItemPrefix = (itemRadio, indexRadio) => (
    <div className="ss-radio-button-setting__img-file-row">
      <InputCustom
        className="ss-radio-button-setting__img-file-input"
        placeholder={RADIO_BUTTON_LABELS.fileUrl}
        onChange={changeContent(radioButton.type, indexRadio, 'img')}
        value={itemRadio.img}
      />
      <MDBIcon
        onClick={(e) => {
          e.stopPropagation();
          setIsOpenFileReference(true);
          setVarFileReference({
            indexContent,
            contentType: content.type,
            subContentType: radioButton.type,
            indexSubContent: indexRadio,
            img: 'img',
          });
          setAcceptFile(['image']);
        }}
        fas
        icon="paperclip"
        className="ss-radio-button-setting__paperclip"
      />
    </div>
  );

  const renderItemExtra = (itemRadio) => (
    <div className="ss-radio-button-setting__img-item-footer">
      <InitialSelectionCheckbox
        item={itemRadio}
        radioButton={radioButton}
        toggleInitialSelection={toggleInitialSelection}
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
