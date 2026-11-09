import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RADIO_BUTTON_LABELS } from '../../constants/scenarioSettingLabels';
import {
  RADIO_OPTION_DESIGN_STATES,
  RADIO_OPTION_DESIGN_TYPES,
  getRadioOptionDesignType,
  getRadioOptionNormalImage,
  mergeRadioOptionDesignExceptImage,
  sanitizeRadioOptionDesign,
} from '../../utils/radioOptionDesign';
import { getGenderOptions, isGenderRadio } from '../../utils/radioButtonGenderUtils';
import RadioOptionDesignModal from './RadioOptionDesignModal';

const ACCEPT_IMAGE_FILES = ['image'];

const getRadioOptions = (radioButton) => {
  if (isGenderRadio(radioButton)) return getGenderOptions(radioButton);
  const key = radioButton?.type;
  return Array.isArray(radioButton?.[key]) ? radioButton[key] : [];
};

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
  const options = getRadioOptions(radioButton);
  const optionListKey = radioButton?.type;
  const previewLabel = item?.text || item?.value || '';
  const previewImage = getRadioOptionNormalImage(item);
  const canSyncToOthers = options.length > 1;

  const persistDesign = (sparseDesign) => {
    const nextDesign = sanitizeRadioOptionDesign(sparseDesign, designType);
    changeContent(optionListKey, optionIndex, 'design')(nextDesign);
    if (designType === RADIO_OPTION_DESIGN_TYPES.DEFAULT) return;
    const normalImage = nextDesign?.[RADIO_OPTION_DESIGN_STATES.NORMAL]?.image || '';
    changeContent(optionListKey, optionIndex, 'img')(normalImage);
  };

  const syncDesignToOthers = (sourceDesign) => {
    const sanitizedSource = sanitizeRadioOptionDesign(sourceDesign, designType);
    persistDesign(sanitizedSource);
    options.forEach((sibling, siblingIndex) => {
      if (siblingIndex === optionIndex) return;
      const merged = mergeRadioOptionDesignExceptImage(
        sanitizedSource,
        sibling?.design,
        designType,
      );
      changeContent(optionListKey, siblingIndex, 'design')(merged);
    });
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
        onSyncToOthers={canSyncToOthers ? syncDesignToOthers : undefined}
        canSyncToOthers={canSyncToOthers}
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
