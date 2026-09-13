import React from 'react';
import OptionGenderConfig from '../../OptionGenderConfig';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';
import { InitialSelectionCheckbox } from './radioButtonShared';
import RadioButtonItemsList from './RadioButtonItemsList';

const DefaultTypeSetting = (props) => {
  const { radioButton } = props;
  const { changeContent, toggleInitialSelection } = buildRadioButtonSettingContext(props);

  const renderItemExtra = (itemRadio, indexRadio) => (
    <>
      <InitialSelectionCheckbox
        item={itemRadio}
        radioButton={radioButton}
        toggleInitialSelection={toggleInitialSelection}
      />
      {radioButton.use_as_gender && (
        <OptionGenderConfig
          value={itemRadio.preset_config}
          onChange={changeContent(radioButton.type, indexRadio, 'preset_config')}
        />
      )}
    </>
  );

  return (
    <RadioButtonItemsList
      {...props}
      renderItemExtra={renderItemExtra}
    />
  );
};

export default DefaultTypeSetting;
