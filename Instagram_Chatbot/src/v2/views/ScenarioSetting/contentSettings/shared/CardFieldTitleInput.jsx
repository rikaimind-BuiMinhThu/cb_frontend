import React from 'react';
import PropTypes from 'prop-types';
import InputCustom from '../../scenarioCommon/InputCustom';
import { CREDIT_CARD_SETTING_LABELS } from '../../constants/scenarioSettingLabels';

const CardFieldTitleInput = ({ value, onChange, placeholder }) => (
  <InputCustom
    labelClassName="ss-input-custom-label--wide"
    label={CREDIT_CARD_SETTING_LABELS.fieldTitle}
    inline={false}
    placeholder={placeholder}
    value={value || ''}
    onChange={onChange}
  />
);

CardFieldTitleInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};

CardFieldTitleInput.defaultProps = {
  value: '',
};

export default CardFieldTitleInput;
