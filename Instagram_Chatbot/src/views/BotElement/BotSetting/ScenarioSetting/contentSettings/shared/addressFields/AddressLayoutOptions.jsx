import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalCheckbox from '../../../components/modals/shared/ScenarioModalCheckbox';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';

const AddressLayoutOptions = (props) => {
  const { addressData, changeAddressField } = buildAddressFieldSettingContext(props);
  const { showDisplayAddressField = false } = props;

  return (
    <div className="ss-address-layout-options">
      <ScenarioModalCheckbox
        checked={!!addressData.split_postal_code}
        onChange={(checked) => changeAddressField('split_postal_code')(checked)}
        label="郵便番号を3桁+4桁に分割する"
      />
      <ScenarioModalCheckbox
        checked={!!addressData.compact_municipality_and_address}
        onChange={(checked) => {
          changeAddressField('compact_municipality_and_address')(checked);
          if (checked) {
            changeAddressField('compact_municipality_and_address_and_building_name')(false);
          }
        }}
        label="市区町村と番地を１フィールドで利用"
      />
      {showDisplayAddressField && (
        <ScenarioModalCheckbox
          checked={!!addressData.compact_municipality_and_address && !!addressData.is_display_address_field}
          disabled={!addressData.compact_municipality_and_address}
          onChange={(checked) => changeAddressField('is_display_address_field')(checked)}
          label="番地入力欄表示"
        />
      )}
      <ScenarioModalCheckbox
        checked={!!addressData.compact_municipality_and_address_and_building_name}
        onChange={(checked) => {
          changeAddressField('compact_municipality_and_address_and_building_name')(checked);
          if (checked) {
            changeAddressField('compact_municipality_and_address')(false);
          }
        }}
        label="市区町村・番地・建物名を１フィールドで利用"
      />
    </div>
  );
};

AddressLayoutOptions.propTypes = {
  showDisplayAddressField: PropTypes.bool,
};

export default AddressLayoutOptions;
