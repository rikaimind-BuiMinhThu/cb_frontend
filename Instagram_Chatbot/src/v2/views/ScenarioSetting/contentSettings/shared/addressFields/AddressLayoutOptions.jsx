import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalCheckbox from '../../../components/modals/shared/ScenarioModalCheckbox';
import { ADDRESS_FIELD_MODAL_LABELS } from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';

const AddressLayoutOptions = (props) => {
  const { addressData, changeAddressField } = buildAddressFieldSettingContext(props);
  const { showDisplayAddressField = false } = props;

  return (
    <div className="ss-address-layout-options">
      <ScenarioModalCheckbox
        checked={!!addressData.split_postal_code}
        onChange={(checked) => changeAddressField('split_postal_code')(checked)}
        label={ADDRESS_FIELD_MODAL_LABELS.splitPostalCode}
      />
      <ScenarioModalCheckbox
        checked={!!addressData.compact_municipality_and_address}
        onChange={(checked) => {
          changeAddressField('compact_municipality_and_address')(checked);
          if (checked) {
            changeAddressField('compact_municipality_and_address_and_building_name')(false);
          }
        }}
        label={ADDRESS_FIELD_MODAL_LABELS.compactMunicipalityAndAddress}
      />
      {showDisplayAddressField && (
        <ScenarioModalCheckbox
          checked={!!addressData.compact_municipality_and_address && !!addressData.is_display_address_field}
          disabled={!addressData.compact_municipality_and_address}
          onChange={(checked) => changeAddressField('is_display_address_field')(checked)}
          label={ADDRESS_FIELD_MODAL_LABELS.displayAddressField}
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
        label={ADDRESS_FIELD_MODAL_LABELS.compactAll}
      />
    </div>
  );
};

AddressLayoutOptions.propTypes = {
  showDisplayAddressField: PropTypes.bool,
};

export default AddressLayoutOptions;
