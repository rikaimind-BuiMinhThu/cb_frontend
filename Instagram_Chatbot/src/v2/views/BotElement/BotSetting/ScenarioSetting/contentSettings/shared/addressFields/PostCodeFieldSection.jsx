import React from 'react';
import PropTypes from 'prop-types';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../../scenarioCommon/InputCustom';
import { SETTING_LABELS } from '../../../constants/scenarioSettingLabels';
import { buildAddressFieldSettingContext } from './addressFieldSettingContext';
import AddressFukushashikiRow from './AddressFukushashikiRow';

const PostCodeFieldSection = ({
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

  if (!isAddressFieldVisible('post_code')) return null;

  const renderLabel = () => {
    if (labelMode === 'editable') {
      return (
        <input
          type="text"
          value={addressData.post_code_label ?? ''}
          onChange={(e) => changeAddressField('post_code_label')(e.target.value)}
          className="ss-address-field-section__editable-label"
        />
      );
    }
    return <span className="ss-address-field-section__static-label">{SETTING_LABELS.postCode}</span>;
  };

  if (addressData.split_postal_code) {
    return (
      <div className="ss-address-field-section">
        {renderLabel()}
        <div className="ss-address-field-section__input-row ss-address-field-section__input-row--split">
          <InputCustom
            inline={false}
            className="ss-address-field-section__post-code-left"
            containerClassName="ss-address-field-section__input"
            onChange={changeAddressField('post_code_left')}
            value={addressData.post_code_left ?? ''}
            placeholder="000"
          />
          <InputCustom
            inline={false}
            className="ss-address-field-section__post-code-right"
            containerClassName="ss-address-field-section__input"
            onChange={changeAddressField('post_code_right')}
            value={addressData.post_code_right ?? ''}
            placeholder="0000"
          />
          {showRemoveIcon && (
            <MDBIcon
              fas
              icon="times-circle"
              className="ss-address-field-section__remove-icon"
              onClick={() => removeField('post_code')}
            />
          )}
        </div>
        <AddressFukushashikiRow modeKey="post_code_left_fukushashiki_search_mode" valueKey="post_code_left_fukushashiki_search_value" selectId="post-code-left-fukushashiki" {...props} />
        <AddressFukushashikiRow modeKey="post_code_right_fukushashiki_search_mode" valueKey="post_code_right_fukushashiki_search_value" selectId="post-code-right-fukushashiki" {...props} />
      </div>
    );
  }

  return (
    <div className="ss-address-field-section">
      {renderLabel()}
      <div className="ss-address-field-section__input-row">
        <InputCustom
          inline={false}
          className="ss-input--full"
          containerClassName="ss-address-field-section__input"
          onChange={changeAddressField('post_code')}
          value={addressData.post_code ?? ''}
          placeholder="000 000"
        />
        {showRemoveIcon && (
          <MDBIcon
            fas
            icon="times-circle"
            className="ss-address-field-section__remove-icon"
            onClick={() => removeField('post_code')}
          />
        )}
      </div>
      <AddressFukushashikiRow modeKey="post_code_fukushashiki_search_mode" valueKey="post_code_fukushashiki_search_value" selectId="post-code-fukushashiki" {...props} />
    </div>
  );
};

PostCodeFieldSection.propTypes = {
  labelMode: PropTypes.oneOf(['static', 'editable']),
  showRemoveIcon: PropTypes.bool,
};

export default PostCodeFieldSection;
