import React from 'react';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';
import RadioButtonItemsList from './RadioButtonItemsList';

const BlockStyleTypeSetting = (props) => {
  const { radioButton } = props;
  const { toggleInitialSelection } = buildRadioButtonSettingContext(props);

  const renderItemExtra = (itemRadio) => (
    <InitialSelectionCheckbox
      item={itemRadio}
      radioButton={radioButton}
      toggleInitialSelection={toggleInitialSelection}
    />
  );

  return (
    <RadioButtonItemsList
      {...props}
      renderItemExtra={renderItemExtra}
    />
  );
};

export default BlockStyleTypeSetting;
