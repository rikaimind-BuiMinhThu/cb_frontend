import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../../scenarioComon/InputCustom';
import { SETTING_PLACEHOLDERS } from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';
import AddressFukushashikiRow from './AddressFukushashikiRow';

const LabeledAddressFieldSection = ({
  fieldKey,
  labelKey,
  fukushashikiModeKey,
  fukushashikiValueKey,
  fukushashikiSelectId,
  staticLabel,
  labelMode = 'static',
  showRemoveIcon = true,
  ...props
}) => {
  const {
    addressData,
    changeAddressField,
    removeField,
    isAddressFieldVisible,
  } = buildAddressFieldSettingContext(props);

  if (!isAddressFieldVisible(fieldKey)) return null;

  const labelValue = labelKey ? addressData[labelKey] ?? '' : staticLabel;

  return (
    <div className="ss-address-field-section">
      {labelMode === 'editable' && labelKey ? (
        <input
          type="text"
          value={labelValue}
          onChange={(e) => changeAddressField(labelKey)(e.target.value)}
          className="ss-address-field-section__editable-label"
        />
      ) : (
        <span className="ss-address-field-section__static-label">{staticLabel}</span>
      )}
      <div className="ss-address-field-section__input-row">
        <InputCustom
          inline={false}
          className="ss-input--full"
          containerClassName="ss-address-field-section__input"
          onChange={changeAddressField(fieldKey)}
          value={addressData[fieldKey] ?? ''}
          placeholder={SETTING_PLACEHOLDERS.placeholder}
        />
        {showRemoveIcon && (
          <MDBIcon
            fas
            icon="times-circle"
            className="ss-address-field-section__remove-icon"
            onClick={() => removeField(fieldKey)}
          />
        )}
      </div>
      <AddressFukushashikiRow
        modeKey={fukushashikiModeKey}
        valueKey={fukushashikiValueKey}
        selectId={fukushashikiSelectId}
        {...props}
      />
    </div>
  );
};

LabeledAddressFieldSection.propTypes = {
  fieldKey: PropTypes.string.isRequired,
  labelKey: PropTypes.string,
  fukushashikiModeKey: PropTypes.string.isRequired,
  fukushashikiValueKey: PropTypes.string.isRequired,
  fukushashikiSelectId: PropTypes.string.isRequired,
  staticLabel: PropTypes.string,
  labelMode: PropTypes.oneOf(['static', 'editable']),
  showRemoveIcon: PropTypes.bool,
};

export default LabeledAddressFieldSection;
