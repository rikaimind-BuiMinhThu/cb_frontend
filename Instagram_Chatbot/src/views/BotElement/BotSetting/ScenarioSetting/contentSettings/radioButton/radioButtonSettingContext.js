import React from 'react';
import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { LABELS } from '../../../PreviewComponent/Constants';
import { FUKUSHASHIKI_VARIANTS } from '../../constants/scenarioSettingLabels';

export const buildRadioButtonSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    radioButton,
    dataMessages,
    onChangeValueMessageContent,
  } = props;

  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  const renderInitialSelectionFukushashiki = () => (
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
  );

  const renderGenderDisplayType = () => {
    if (!radioButton.use_as_gender) return null;
    return (
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
    );
  };

  const toggleInitialSelection = (itemValue) => {
    if (radioButton.initial_selection !== itemValue) {
      changeContent('initial_selection')(itemValue);
    } else {
      changeContent('initial_selection')('');
    }
  };

  return {
    indexMessageSelect,
    indexContent,
    content,
    radioButton,
    changeContent,
    renderInitialSelectionFukushashiki,
    renderGenderDisplayType,
    toggleInitialSelection,
  };
};
