import React from 'react';
import PropTypes from 'prop-types';
import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import SelectCustom from '../../scenarioCommon/SelectCustom';
import { LABELS } from 'v2/views/Preview/PreviewComponent/Constants';
import { FUKUSHASHIKI_VARIANTS } from '../../constants/scenarioSettingLabels';
import { buildRadioButtonSettingContext } from './radioButtonSettingContext';

const RadioButtonFukushashikiSection = (props) => {
  const { radioButton, dataMessages, indexMessageSelect, indexContent } = props;
  const { changeContent, changeMessageField } = buildRadioButtonSettingContext(props);

  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  return (
    <>
      <div className="ss-user-setting__item-bottom">
        <div className="ss-radio-button-setting__fukushashiki-spacer" />
        <FukushashikiSearchRow
          variant={FUKUSHASHIKI_VARIANTS.COMPACT}
          mode={messageContent?.initial_selection_fukushashiki_search_mode}
          inputValue={messageContent?.initial_selection_fukushashiki_search_value ?? ''}
          onModeChange={changeMessageField('initial_selection_fukushashiki_search_mode')}
          onInputChange={changeMessageField('initial_selection_fukushashiki_search_value')}
          useFukushashiki
          rowClassName="ss-radio-button-setting__fukushashiki-row"
        />
        <div className="ss-radio-button-setting__fukushashiki-spacer" />
      </div>
      {radioButton.use_as_gender && (
        <div className="ss-radio-button-setting__gender-display">
          <SelectCustom
            data={[
              { key: LABELS.GENDER_OPTIONS.VERTICAL, value: 'vertical' },
              { key: LABELS.GENDER_OPTIONS.HORIZONTAL, value: 'horizontal' },
            ]}
            value={radioButton?.gender_display_type}
            onChange={changeContent('gender_display_type')}
            keyValue="value"
            nameValue="key"
            label={LABELS.GENDER_OPTIONS.LABEL_GENDER_DISPLAY_TYPE}
            className="ss-select--full"
          />
        </div>
      )}
    </>
  );
};

RadioButtonFukushashikiSection.propTypes = {
  radioButton: PropTypes.object.isRequired,
  dataMessages: PropTypes.array.isRequired,
  indexMessageSelect: PropTypes.number.isRequired,
  indexContent: PropTypes.number.isRequired,
};

export default RadioButtonFukushashikiSection;
