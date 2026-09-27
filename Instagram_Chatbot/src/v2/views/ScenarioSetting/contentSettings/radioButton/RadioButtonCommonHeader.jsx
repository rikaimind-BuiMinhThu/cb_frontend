import React from 'react';
import PropTypes from 'prop-types';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { typeRadio } from '../../constants/scenarioFormConstants';
import { RADIO_BUTTON_TYPES } from '../../constants/contentTypeConstants';
import { ensureUpsellButtonDefaults } from '../../constants/upsellButtonDefaults';
import { ensureGenderOptions } from '../../utils/radioButtonGenderUtils';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';

const RadioButtonCommonHeader = (props) => {
  const { radioButton } = props;
  const { changeContent } = buildRadioButtonSettingContext(props);

  const handleTypeChange = (value) => {
    const previousType = radioButton?.type;

    if (value === RADIO_BUTTON_TYPES.GENDER) {
      const patch = ensureGenderOptions(radioButton);
      changeContent()({
        ...radioButton,
        type: value,
        gender: patch.gender,
        use_as_gender: true,
      });
      return;
    }

    if (previousType === RADIO_BUTTON_TYPES.GENDER) {
      const nextRadio = {
        ...radioButton,
        type: value,
        use_as_gender: false,
      };
      if (value === RADIO_BUTTON_TYPES.UPSELL_BUTTON) {
        const normalized = ensureUpsellButtonDefaults(nextRadio);
        changeContent()({
          ...nextRadio,
          [RADIO_BUTTON_TYPES.UPSELL_BUTTON]: normalized[RADIO_BUTTON_TYPES.UPSELL_BUTTON],
          img_layout: normalized.img_layout,
        });
        return;
      }
      changeContent()(nextRadio);
      return;
    }

    changeContent('type')(value);
    if (value === RADIO_BUTTON_TYPES.UPSELL_BUTTON) {
      const normalized = ensureUpsellButtonDefaults({ ...radioButton, type: value });
      changeContent(RADIO_BUTTON_TYPES.UPSELL_BUTTON)(normalized[RADIO_BUTTON_TYPES.UPSELL_BUTTON]);
      changeContent('img_layout')(normalized.img_layout);
    }
  };

  return (
    <>
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
