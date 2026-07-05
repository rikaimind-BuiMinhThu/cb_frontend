import React from 'react';
import SelectCustom from '../../scenarioComon/SelectCustom';
import { PULL_DOWN_LABELS } from '../../constants/scenarioSettingLabels';

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
        keyValue="値"
        className="ss-pull-down-preview__select--full"
        placeholder={typeConfig.display_unselected}
        nameValue="text"
      />
    </div>
  );

  const renderSelectWithComment = () => (
    <div className="ss-message__content--user-pull_down-col col-12 ss-pull-down-preview__select-col--dual">
      <SelectCustom
        data={typeConfig.options_with_comment}
        keyValue="値"
        className="ss-pull-down-preview__select--half"
        placeholder={typeConfig.display_unselected}
        nameValue="text"
      />
      <SelectCustom
        data={typeConfig.options_with_comment}
        keyValue="value2"
        className="ss-pull-down-preview__select--half"
        placeholder={typeConfig.display_unselected}
        nameValue="text2"
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
