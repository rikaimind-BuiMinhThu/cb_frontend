import React from 'react';
import { MDBIcon } from 'mdbreact';
import InputCustom from '../../scenarioComon/InputCustom';
import InputDouble from '../../scenarioComon/InputDouble';
import {
  AGREE_TERM_LABELS,
  SETTING_LABELS,
} from '../../constants/scenarioSettingLabels';
import { buildAgreeTermSettingContext } from './agreeTermSettingContext';

const PostLinkOnlyTypeSetting = ({
  indexMessageSelect,
  indexContent,
  content,
  handleRemoveItemContent,
  handleAddItemAgreeTerm,
  ...rest
}) => {
  const props = {
    indexMessageSelect,
    indexContent,
    content,
    ...rest,
  };
  const { agreeTerm, changeContent } = buildAgreeTermSettingContext(props);

  const renderLinkItem = (agreeTermItem, indexAgree, array) => (
    <div key={indexAgree} className="ss-user-setting__item-bottom">
      <div className="ss-user-setting-item-radio-button-drag ss-agree-term-setting__link-item">
        <div className="ss-agree-term-setting__link-panel">
          <InputCustom
            icon={array.length >= 2 ? 'times-circle' : ''}
            classIcon="ss-plus-circle-option-icon-times"
            onClickIcon={() => handleRemoveItemContent(
              indexMessageSelect,
              indexContent,
              content.type,
              agreeTerm.type,
              indexAgree,
            )}
            className="ss-agree-term-setting__link-comment"
            placeholder={SETTING_LABELS.comment}
            value={agreeTermItem.title_comment}
            onChange={changeContent(agreeTerm.type, indexAgree, 'title_comment')}
          />
          <InputDouble
            classCustom="ss-user-setting-custom-double-input"
            onChange={(value, name) => changeContent(
              agreeTerm.type,
              indexAgree,
              name === 'left' ? 'title' : 'urls',
            )(value)}
            valueLeft={agreeTermItem.title}
            valueRight={agreeTermItem.urls}
            placeholder={AGREE_TERM_LABELS.urlTitleUrls}
          />
          <InputCustom
            className="ss-agree-term-setting__url-comment"
            placeholder={SETTING_LABELS.comment}
            value={agreeTermItem.url_comment}
            onChange={changeContent(agreeTerm.type, indexAgree, 'url_comment')}
          />
        </div>
      </div>
    </div>
  );

  const renderLinkList = () => {
    if (!Array.isArray(agreeTerm.post_link_only)) return null;
    return agreeTerm.post_link_only.map(renderLinkItem);
  };

  const renderAddButton = () => (
    <div className="ss-user-setting__item-bottom ss-agree-term-setting__add-row">
      <MDBIcon
        fas
        icon="plus-circle"
        className="ss-plus-circle-option-icon"
        onClick={() => handleAddItemAgreeTerm(
          indexMessageSelect,
          indexContent,
          content.type,
          agreeTerm.type,
        )}
      />
    </div>
  );

  return (
    <>
      {renderLinkList()}
      {renderAddButton()}
    </>
  );
};

export default PostLinkOnlyTypeSetting;
