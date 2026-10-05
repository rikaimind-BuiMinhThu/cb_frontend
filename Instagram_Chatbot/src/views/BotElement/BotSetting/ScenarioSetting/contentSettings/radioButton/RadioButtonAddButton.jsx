import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';

const RadioButtonAddButton = ({
  indexMessageSelect,
  indexContent,
  content,
  radioButton,
  handleAddItemRadioCheckbox,
}) => (
  <div className="ss-user-setting__item-bottom ss-radio-button-setting__add-row">
    <MDBIcon
      fas
      icon="plus-circle"
      className="ss-plus-circle-option-icon"
      onClick={() => handleAddItemRadioCheckbox(
        indexMessageSelect,
        indexContent,
        content.type,
        radioButton.type,
      )}
    />
  </div>
);

RadioButtonAddButton.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  radioButton: PropTypes.object.isRequired,
  handleAddItemRadioCheckbox: PropTypes.func.isRequired,
};

export default RadioButtonAddButton;
