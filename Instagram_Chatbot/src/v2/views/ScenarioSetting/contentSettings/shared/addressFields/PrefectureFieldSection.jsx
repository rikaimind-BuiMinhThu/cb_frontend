import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import SelectCustom from '../../../scenarioCommon/SelectCustom';
import InputCustom from '../../../scenarioCommon/InputCustom';
import ScenarioModalCheckbox from '../../../components/modals/shared/ScenarioModalCheckbox';
import { SETTING_LABELS, SETTING_PLACEHOLDERS, SHIPPING_ADDRESS_SETTING_LABELS } from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';
import AddressFukushashikiRow from './AddressFukushashikiRow';

const PrefectureFieldSection = ({
  labelMode = 'static',
  showRemoveIcon = true,
  ...props
}) => {
  const {
    addressData,
    changeAddressField,
    removeField,
    isAddressFieldVisible,
    dataPrefectures,
  } = buildAddressFieldSettingContext(props);

  if (!isAddressFieldVisible('prefecture')) return null;

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
        {addressData.is_use_dropdown ? (
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
      <div className="ss-user-setting-option-row ss-address-field-section__dropdown-option">
        <div className="ss-user-setting-option-row__checkbox">
          <ScenarioModalCheckbox
            checked={!!addressData.is_use_dropdown}
            onChange={(checked) => changeAddressField('is_use_dropdown')(checked)}
            label={SHIPPING_ADDRESS_SETTING_LABELS.useDropdown}
          />
        </div>
      </div>
      <AddressFukushashikiRow modeKey="prefecture_fukushashiki_search_mode" valueKey="prefecture_fukushashiki_search_value" selectId="prefecture-fukushashiki" {...props} />
    </div>
  );
};

PrefectureFieldSection.propTypes = {
  labelMode: PropTypes.oneOf(['static', 'editable']),
  showRemoveIcon: PropTypes.bool,
};

export default PrefectureFieldSection;
