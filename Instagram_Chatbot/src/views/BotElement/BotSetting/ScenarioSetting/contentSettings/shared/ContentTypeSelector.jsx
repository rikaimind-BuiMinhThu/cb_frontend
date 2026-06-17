import React from 'react';
import PropTypes from 'prop-types';
import SelectCustom from '../../scenarioComon/SelectCustom';
import InputCustom from '../../scenarioComon/InputCustom';
import { dropDownTitle } from '../../constants/scenarioFormConstants';
import { SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';

const ContentTypeSelector = ({
  titleRequire,
  typeValue,
  typeOptions,
  onTitleRequireChange,
  onTypeChange,
  typePlaceholder = SETTING_PLACEHOLDERS.type,
  titleSelectClassName = 'ss-select--half',
  typeSelectClassName = 'ss-select--half',
}) => (
  <div className="ss-user-setting__item-bottom">
    <div className="ss-user-setting__item-select-bottom-wrapper-flex">
      <SelectCustom
        id="title"
        className={titleSelectClassName}
        value={titleRequire}
        data={dropDownTitle}
        onChange={onTitleRequireChange}
        keyValue="key"
      />
      <SelectCustom
        id="type"
        allowClear={false}
        className={typeSelectClassName}
        value={typeValue}
        data={typeOptions}
        placeholder={typePlaceholder}
        onChange={onTypeChange}
        keyValue="key"
      />
    </div>
  </div>
);

ContentTypeSelector.propTypes = {
  titleRequire: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  typeValue: PropTypes.string,
  typeOptions: PropTypes.array.isRequired,
  onTitleRequireChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  typePlaceholder: PropTypes.string,
  titleSelectClassName: PropTypes.string,
  typeSelectClassName: PropTypes.string,
};

export default ContentTypeSelector;

export const ContentTitleInput = ({ title, onChange, placeholder = SETTING_PLACEHOLDERS.title }) => (
  <div className="ss-user-setting__item-bottom">
    <InputCustom
      placeholder={placeholder}
      onChange={onChange}
      value={title}
      className="ss-input--full"
    />
  </div>
);

ContentTitleInput.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
