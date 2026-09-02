import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';

const CheckboxAddButton = ({
  indexMessageSelect,
  indexContent,
  content,
  checkbox,
  handleAddItemRadioCheckbox,
}) => (
  <div className="ss-user-setting__item-bottom ss-checkbox-setting__add-row">
    <MDBIcon
      fas
      icon="plus-circle"
      className="ss-plus-circle-option-icon"
      onClick={() => handleAddItemRadioCheckbox(
        indexMessageSelect,
        indexContent,
        content.type,
        checkbox.type,
      )}
    />
  </div>
);

CheckboxAddButton.propTypes = {
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  checkbox: PropTypes.object.isRequired,
  handleAddItemRadioCheckbox: PropTypes.func.isRequired,
};

export default CheckboxAddButton;
