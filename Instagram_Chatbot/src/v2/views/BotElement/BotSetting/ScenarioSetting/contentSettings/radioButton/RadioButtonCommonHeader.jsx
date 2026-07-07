import React from 'react';
import PropTypes from 'prop-types';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import { LABELS } from '../../../PreviewComponent/Constants';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { typeRadio } from '../../constants/scenarioFormConstants';
import { RADIO_BUTTON_TYPES } from '../../constants/contentTypeConstants';
import { ensureUpsellButtonDefaults } from '../../constants/upsellButtonDefaults';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';

const RadioButtonCommonHeader = (props) => {
  const { radioButton } = props;
  const { changeContent } = buildRadioButtonSettingContext(props);

  const handleTypeChange = (value) => {
    changeContent('type')(value);
    if (value === RADIO_BUTTON_TYPES.UPSELL_BUTTON) {
      const normalized = ensureUpsellButtonDefaults({ ...radioButton, type: value });
      changeContent(RADIO_BUTTON_TYPES.UPSELL_BUTTON)(normalized[RADIO_BUTTON_TYPES.UPSELL_BUTTON]);
      changeContent('img_layout')(normalized.img_layout);
    }
  };

  return (
    <>
      <CheckboxCustom
        label={LABELS.GENDER_OPTIONS.CHECKBOX_USE_AS_GENDER}
        onChange={changeContent('use_as_gender')}
        value={!!radioButton.use_as_gender}
      />
      <ContentTypeSelector
        titleRequire={radioButton?.title_require}
        typeValue={radioButton?.type}
        typeOptions={typeRadio}
        onTitleRequireChange={changeContent('title_require')}
        onTypeChange={handleTypeChange}
      />
      {radioButton.title_require === true && (
        <ContentTitleInput
          title={radioButton?.title}
          onChange={changeContent('title')}
        />
      )}
    </>
  );
};

RadioButtonCommonHeader.propTypes = {
  radioButton: PropTypes.object.isRequired,
};

export default RadioButtonCommonHeader;
