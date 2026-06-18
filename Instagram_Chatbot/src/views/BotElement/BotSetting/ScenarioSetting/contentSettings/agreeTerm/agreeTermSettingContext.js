import React from 'react';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../scenarioComon/InputCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import FukushashikiSearchRow from '../shared/FukushashikiSearchRow';
import {
  AGREE_TERM_LABELS,
  FUKUSHASHIKI_VARIANTS,
  SETTING_LABELS,
  SETTING_PLACEHOLDERS,
} from '../../constants/scenarioSettingLabels';

export const buildAgreeTermSettingContext = (props) => {
  const {
    indexMessageSelect,
    indexContent,
    content,
    dataMessages,
    onChangeValueMessageContent,
  } = props;

  const agreeTerm = content.agree_term;
  const messageContent = dataMessages[indexMessageSelect]?.message_content?.[indexContent];

  const changeContent = (...path) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, content.type, value, ...path);

  const changeMessageField = (field) => (value) =>
    onChangeValueMessageContent(indexMessageSelect, indexContent, field, value);

  return {
    agreeTerm,
    messageContent,
    changeContent,
    changeMessageField,
  };
};

export const renderAgreeTermFukushashikiRow = (ctx) => (
  <div className="ss-agree-term-setting__fukushashiki">
    <FukushashikiSearchRow
      variant={FUKUSHASHIKI_VARIANTS.DEFAULT}
      mode={ctx.messageContent?.fukushashiki_search_mode}
      inputValue={ctx.messageContent?.fukushashiki_search_value ?? ''}
      onModeChange={ctx.changeMessageField('fukushashiki_search_mode')}
      onInputChange={ctx.changeMessageField('fukushashiki_search_value')}
      rowClassName="ss-user-setting__item-row"
    />
  </div>
);

export const renderAgreeTermCheckbox = (ctx) => (
  <div className="ss-user-setting__item-bottom">
    <CheckboxCustom
      className="ss-user-setting__item-custom-input-checkbox"
      styleSpan={{ width: '100%' }}
      disabled
      label={(
        <InputCustom
          maxLength={Number.MAX_SAFE_INTEGER}
          placeholder={AGREE_TERM_LABELS.termText}
          className="ss-agree-term-setting__term-input"
          value={ctx.agreeTerm?.term ?? ''}
          onChange={ctx.changeContent('term')}
        />
      )}
      onChange={(value) => console.log(value)}
      value={false}
    />
  </div>
);
