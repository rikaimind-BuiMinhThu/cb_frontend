import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import {
  RADIO_OPTION_DESIGN_STATES,
  RADIO_OPTION_DESIGN_TYPES,
  getRadioOptionDesignType,
  getRadioOptionNormalImage,
  sanitizeRadioOptionDesign,
} from '../../utils/radioOptionDesign';
import RadioOptionDesignModal from './RadioOptionDesignModal';

const ACCEPT_IMAGE_FILES = ['image'];

const RadioOptionDesignControls = ({
  radioButton,
  item,
  optionIndex,
  indexContent,
  contentType,
  changeContent,
  setIsOpenFileReference,
  setVarFileReference,
  setAcceptFile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const designType = getRadioOptionDesignType(radioButton);
  const previewLabel = item?.text || item?.value || '';
  const previewImage = getRadioOptionNormalImage(item);

  const persistDesign = (sparseDesign) => {
    const nextDesign = sanitizeRadioOptionDesign(sparseDesign, designType);
    changeContent(radioButton.type, optionIndex, 'design')(nextDesign);
    if (designType === RADIO_OPTION_DESIGN_TYPES.DEFAULT) return;
    const normalImage = nextDesign?.[RADIO_OPTION_DESIGN_STATES.NORMAL]?.image || '';
    changeContent(radioButton.type, optionIndex, 'img')(normalImage);
  };

  const openImagePicker = (designState) => {
    if (!setIsOpenFileReference || !setVarFileReference) return;
    setAcceptFile?.(ACCEPT_IMAGE_FILES);
    setIsOpenFileReference(true);
    setVarFileReference({
      radioDesign: true,
      designState,
      indexContent,
      contentType,
      subContentType: radioButton.type,
      indexSubContent: optionIndex,
    });
  };

  return (
    <>
      <button
        type="button"
        className="ss-radio-button-setting__design-link"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
      >
        {RADIO_BUTTON_LABELS.designButton}
      </button>
      <RadioOptionDesignModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={persistDesign}
        design={item?.design}
        designType={designType}
        onOpenImagePicker={openImagePicker}
        previewLabel={previewLabel}
        previewImage={previewImage}
      />
    </>
  );
};

RadioOptionDesignControls.propTypes = {
  radioButton: PropTypes.object.isRequired,
  item: PropTypes.object,
  optionIndex: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  changeContent: PropTypes.func.isRequired,
  setIsOpenFileReference: PropTypes.func,
  setVarFileReference: PropTypes.func,
  setAcceptFile: PropTypes.func,
};

RadioOptionDesignControls.defaultProps = {
  item: {},
  setIsOpenFileReference: undefined,
  setVarFileReference: undefined,
  setAcceptFile: undefined,
};

export default RadioOptionDesignControls;
