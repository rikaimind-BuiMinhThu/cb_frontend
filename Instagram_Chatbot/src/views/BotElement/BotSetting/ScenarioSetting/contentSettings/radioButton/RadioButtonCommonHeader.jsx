import React from 'react';
import PropTypes from 'prop-types';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import { LABELS } from '../../../PreviewComponent/Constants';
import ContentTypeSelector, { ContentTitleInput } from '../shared/ContentTypeSelector';
import { typeRadio } from '../../constants/scenarioFormConstants';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';

const RadioButtonCommonHeader = (props) => {
  const { radioButton } = props;
  const { changeContent } = buildRadioButtonSettingContext(props);

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
        onTypeChange={changeContent('type')}
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
