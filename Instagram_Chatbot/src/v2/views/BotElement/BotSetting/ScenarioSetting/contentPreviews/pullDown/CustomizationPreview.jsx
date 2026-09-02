import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { SETTING_PLACEHOLDERS } from '../../constants/scenarioSettingLabels';

const VALUE2_KEY = 'value2';
const TEXT_NAME_KEY = 'text';
const TEXT2_NAME_KEY = 'text2';

const CustomizationPreview = ({ pullDown }) => {
  const typeConfig = pullDown[pullDown.type];

  const renderCommentTop = () => (
    <div className="ss-message__content--user-pull_down-comment ss-pull-down-preview__comment--top">
      <span>{typeConfig.title_comment}</span>
    </div>
  );

  const renderSelectWithoutComment = () => (
    <div className="ss-message__content--user-pull_down-col col-12 ss-pull-down-preview__select-col--full">
      <SelectCustom
        data={typeConfig.options_without_comment}
        keyValue={SETTING_PLACEHOLDERS.value}
        className="ss-pull-down-preview__select--full"
        placeholder={typeConfig.display_unselected}
        nameValue={TEXT_NAME_KEY}
      />
    </div>
  );

  const renderSelectWithComment = () => (
    <div className="ss-message__content--user-pull_down-col col-12 ss-pull-down-preview__select-col--dual">
      <SelectCustom
        data={typeConfig.options_with_comment}
        keyValue={SETTING_PLACEHOLDERS.value}
        className="ss-pull-down-preview__select--half"
        placeholder={typeConfig.display_unselected}
        nameValue={TEXT_NAME_KEY}
      />
      <SelectCustom
        data={typeConfig.options_with_comment}
        keyValue={VALUE2_KEY}
        className="ss-pull-down-preview__select--half"
        placeholder={typeConfig.display_unselected}
        nameValue={TEXT2_NAME_KEY}
      />
    </div>
  );

  const renderSelects = () => (
    typeConfig.is_comment === false ? renderSelectWithoutComment() : renderSelectWithComment()
  );

  const renderCommentBottom = () => (
    <div className="ss-message__content--user-pull_down-comment ss-pull-down-preview__comment--bottom">
      <span>{typeConfig.comment}</span>
    </div>
  );

  return (
    <div className="ss-message__content--user-pull_down--customization">
      {renderCommentTop()}
      {renderSelects()}
      {renderCommentBottom()}
    </div>
  );
};

export default CustomizationPreview;
