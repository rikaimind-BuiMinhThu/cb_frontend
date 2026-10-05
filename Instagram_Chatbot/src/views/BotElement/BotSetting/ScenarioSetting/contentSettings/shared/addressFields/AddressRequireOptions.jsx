import React from 'react';
import PropTypes from 'prop-types';
import ScenarioModalCheckbox from '../../../components/modals/shared/ScenarioModalCheckbox';
import { SETTING_LABELS } from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';

const PER_FIELD_REQUIRE_LABELS = {
  postCode: SETTING_LABELS.postCode,
  prefecture: SETTING_LABELS.prefecture,
  municipality: SETTING_LABELS.municipality,
  address: SETTING_LABELS.address,
  buildingName: SETTING_LABELS.buildingName,
};

const AddressRequireOptions = ({ children, ...props }) => {
  const {
    contentType,
    addressData,
    indexMessageSelect,
    indexContent,
    onChangeValueMessageContent,
  } = buildAddressFieldSettingContext(props);

  const changeRequireMode = (mode) => {
    const nextValue = addressData.isCheckRequire === mode ? '' : mode;
    onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, nextValue, 'isCheckRequire');
  };

  const changeFieldRequire = (field, checked) => {
    onChangeValueMessageContent(indexMessageSelect, indexContent, contentType, checked, field);
  };

  return (
    <div className="ss-address-require-options">
      <ScenarioModalCheckbox
        checked={addressData.isCheckRequire === 'require'}
        onChange={() => changeRequireMode('require')}
        label={SETTING_LABELS.require}
      />
      <ScenarioModalCheckbox
        checked={addressData.isCheckRequire === 'all_items_require'}
        onChange={() => changeRequireMode('all_items_require')}
        label="全項目必須"
      />
      <ScenarioModalCheckbox
        checked={addressData.isCheckRequire === 'set_required_for_each_item'}
        onChange={() => changeRequireMode('set_required_for_each_item')}
        label="項目ごとに必須設定"
      />
      {addressData.isCheckRequire === 'set_required_for_each_item' && (
        <div className="ss-address-require-options__per-field">
          {Object.entries(PER_FIELD_REQUIRE_LABELS).map(([key, label]) => {
            const attrName = `${key}Required`;
            return (
              <ScenarioModalCheckbox
                key={key}
                checked={!!addressData[attrName]}
                onChange={(checked) => changeFieldRequire(attrName, checked)}
                label={label}
              />
            );
          })}
        </div>
      )}
      {children}
    </div>
  );
};

AddressRequireOptions.propTypes = {
  children: PropTypes.node,
};

export default AddressRequireOptions;
