import React from 'react';
import PropTypes from 'prop-types';
import { SETTING_LABELS } from '../../../constants/scenarioSettingLabels';
import PostCodeFieldSection from './PostCodeFieldSection';
import PrefectureFieldSection from './PrefectureFieldSection';
import LabeledAddressFieldSection from './LabeledAddressFieldSection';

const AddressFieldsGroup = ({
  labelMode = 'static',
  showRemoveIcon = true,
  ...props
}) => (
  <div className="ss-address-fields-group">
    <PostCodeFieldSection
      labelMode={labelMode}
      showRemoveIcon={showRemoveIcon}
      {...props}
    />
    <PrefectureFieldSection
      labelMode={labelMode}
      showRemoveIcon={showRemoveIcon}
      {...props}
    />
    <LabeledAddressFieldSection
      fieldKey="municipality"
      labelKey="municipality_label"
      staticLabel={SETTING_LABELS.municipality}
      fukushashikiModeKey="municipality_fukushashiki_search_mode"
      fukushashikiValueKey="municipality_fukushashiki_search_value"
      fukushashikiSelectId="municipality-fukushashiki"
      labelMode={labelMode}
      showRemoveIcon={showRemoveIcon}
      {...props}
    />
    <LabeledAddressFieldSection
      fieldKey="address"
      labelKey="address_label"
      staticLabel={SETTING_LABELS.address}
      fukushashikiModeKey="address_fukushashiki_search_mode"
      fukushashikiValueKey="address_fukushashiki_search_value"
      fukushashikiSelectId="address-fukushashiki"
      labelMode={labelMode}
      showRemoveIcon={showRemoveIcon}
      {...props}
    />
    <LabeledAddressFieldSection
      fieldKey="building_name"
      labelKey="building_name_label"
      staticLabel={SETTING_LABELS.buildingName}
      fukushashikiModeKey="building_name_fukushashiki_search_mode"
      fukushashikiValueKey="building_name_fukushashiki_search_value"
      fukushashikiSelectId="building-name-fukushashiki"
      labelMode={labelMode}
      showRemoveIcon={showRemoveIcon}
      {...props}
    />
  </div>
);

AddressFieldsGroup.propTypes = {
  labelMode: PropTypes.oneOf(['static', 'editable']),
  showRemoveIcon: PropTypes.bool,
};

export default AddressFieldsGroup;
