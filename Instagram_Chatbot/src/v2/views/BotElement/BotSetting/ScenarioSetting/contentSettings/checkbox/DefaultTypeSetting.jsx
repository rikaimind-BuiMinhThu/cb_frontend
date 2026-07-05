import React from 'react';
import { buildCheckboxSettingContext } from './checkboxSettingContext';
import { InitialCheckedCheckbox } from './checkboxShared';
import CheckboxItemsList from './CheckboxItemsList';

const DefaultTypeSetting = (props) => {
  const { checkbox } = props;
  const { toggleCheckedValue } = buildCheckboxSettingContext(props);

  const renderItemExtra = (itemCheckbox) => (
    <InitialCheckedCheckbox
      item={itemCheckbox}
      checkbox={checkbox}
      toggleCheckedValue={toggleCheckedValue}
    />
  );

  return (
    <CheckboxItemsList
      {...props}
      renderItemExtra={renderItemExtra}
    />
  );
};

export default DefaultTypeSetting;
