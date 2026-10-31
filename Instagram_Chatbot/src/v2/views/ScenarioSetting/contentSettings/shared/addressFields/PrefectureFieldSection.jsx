import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../../../scenarioCommon/SelectCustom';
import InputCustom from '../../../scenarioCommon/InputCustom';
import OverviewCheckboxRow from '../../../components/OverviewCheckboxRow';
import ScenarioModalShell from '../../../components/modals/shared/ScenarioModalShell';
import ScenarioModalFooter from '../../../components/modals/shared/ScenarioModalFooter';
import ScenarioModalCheckbox from '../../../components/modals/shared/ScenarioModalCheckbox';
import {
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
  SHIPPING_ADDRESS_SETTING_LABELS,
  LP_PREFECTURE_OPTION_VALUE_TYPES,
  DEFAULT_LP_PREFECTURE_OPTION_VALUE_TYPE,
} from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';
import AddressFukushashikiRow from './AddressFukushashikiRow';

const PrefectureFieldSection = ({
  labelMode = 'static',
  showRemoveIcon = true,
  ...props
}) => {
  const [isLpOptionTypeModalOpen, setIsLpOptionTypeModalOpen] = useState(false);
  const {
    addressData,
    changeAddressField,
    removeField,
    isAddressFieldVisible,
    dataPrefectures,
  } = buildAddressFieldSettingContext(props);

  if (!isAddressFieldVisible('prefecture')) return null;

  const isUseDropdown = !!addressData.is_use_dropdown;
  const lpPrefectureOptionValueType = addressData.lp_prefecture_option_value_type
    || DEFAULT_LP_PREFECTURE_OPTION_VALUE_TYPE;

  const setLpPrefectureOptionValueType = (nextType) => {
    changeAddressField('lp_prefecture_option_value_type')(nextType);
  };

  const closeLpOptionTypeModal = () => setIsLpOptionTypeModalOpen(false);

  const handleUseDropdownChange = (checked) => {
    changeAddressField('is_use_dropdown')(checked);
    if (!checked) {
      setIsLpOptionTypeModalOpen(false);
    }
  };

  return (
    <div className="ss-address-field-section">
      {labelMode === 'editable' ? (
        <input
          type="text"
          value={addressData.prefecture_label ?? ''}
          onChange={(e) => changeAddressField('prefecture_label')(e.target.value)}
          className="ss-address-field-section__editable-label"
        />
      ) : (
        <span className="ss-address-field-section__static-label">{SETTING_LABELS.prefecture}</span>
      )}
      <div className="ss-address-field-section__input-row">
        {isUseDropdown ? (
          <SelectCustom
            id="prefecture-select"
            className="ss-select--full ss-address-field-section__input"
            value={addressData.prefecture}
            data={dataPrefectures}
            keyValue="name"
            nameValue="name"
            placeholder={SETTING_PLACEHOLDERS.placeholder}
            onChange={(value) => changeAddressField('prefecture')(value || null)}
          />
        ) : (
          <InputCustom
            inline={false}
            className="ss-input--full"
            containerClassName="ss-address-field-section__input"
            onChange={changeAddressField('prefecture')}
            value={addressData.prefecture ?? ''}
            placeholder={SETTING_PLACEHOLDERS.placeholder}
          />
        )}
        {showRemoveIcon && (
          <MDBIcon
            fas
            icon="times-circle"
            className="ss-address-field-section__remove-icon"
            onClick={() => removeField('prefecture')}
          />
        )}
      </div>
      <div className="ss-address-field-section__dropdown-option">
        <OverviewCheckboxRow
          checked={isUseDropdown}
          onChange={handleUseDropdownChange}
          label={SHIPPING_ADDRESS_SETTING_LABELS.useDropdown}
          actionButton={isUseDropdown && (
            <button
              type="button"
              className="ss-settings-modal-action-link"
              onClick={() => setIsLpOptionTypeModalOpen(true)}
            >
              {SHIPPING_ADDRESS_SETTING_LABELS.lpPrefectureOptionValueTypeOpenSettings}
            </button>
          )}
        />
      </div>
      {isUseDropdown && (
        <ScenarioModalShell
          open={isLpOptionTypeModalOpen}
          onClose={closeLpOptionTypeModal}
          title={SHIPPING_ADDRESS_SETTING_LABELS.lpPrefectureOptionValueType}
          width={560}
          className="ss-lp-prefecture-option-type-modal"
          footer={(
            <ScenarioModalFooter
              onClose={closeLpOptionTypeModal}
              showConfirm={false}
            />
          )}
        >
          <div className="ss-lp-prefecture-option-type-modal__body">
            <ScenarioModalCheckbox
              checked={lpPrefectureOptionValueType === LP_PREFECTURE_OPTION_VALUE_TYPES.ID}
              onChange={(checked) => {
                if (checked) {
                  setLpPrefectureOptionValueType(LP_PREFECTURE_OPTION_VALUE_TYPES.ID);
                }
              }}
              label={SHIPPING_ADDRESS_SETTING_LABELS.lpPrefectureOptionValueTypeId}
            />
            <ScenarioModalCheckbox
              checked={lpPrefectureOptionValueType === LP_PREFECTURE_OPTION_VALUE_TYPES.NAME}
              onChange={(checked) => {
                if (checked) {
                  setLpPrefectureOptionValueType(LP_PREFECTURE_OPTION_VALUE_TYPES.NAME);
                }
              }}
              label={SHIPPING_ADDRESS_SETTING_LABELS.lpPrefectureOptionValueTypeName}
            />
          </div>
        </ScenarioModalShell>
      )}
      <AddressFukushashikiRow modeKey="prefecture_fukushashiki_search_mode" valueKey="prefecture_fukushashiki_search_value" selectId="prefecture-fukushashiki" {...props} />
    </div>
  );
};

PrefectureFieldSection.propTypes = {
  labelMode: PropTypes.oneOf(['static', 'editable']),
  showRemoveIcon: PropTypes.bool,
};

export default PrefectureFieldSection;
