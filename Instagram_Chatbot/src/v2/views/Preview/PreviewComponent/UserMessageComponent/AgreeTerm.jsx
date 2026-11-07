import React from 'react';
import AgreeTermDetailBody from 'v2/components/BotMessages/AgreeTermDetailBody';
import CheckboxCustom from 'v2/components/BotMessages/CheckboxCustom';
import {
  AGREE_TERM_DETAIL_TYPE,
  AGREE_TERM_POST_LINK_TYPE,
  AGREE_TERM_VALUE_FIELD,
  agreeTermPostLinkKey,
  stampAgreeTermPostLinkIds,
} from 'v2/components/BotMessages/agreeTermDesign';
import { MESSAGE_CONTENT_TYPES, REQUIRED_FIELD_LABEL } from '../Constants';
import { baseUserMessageComponentPropTypes } from './userMessageComponentPropTypes';
import 'v2/assets/css/bot/preview-chat-bot.css';

const LINK_TARGET_BLANK = '_blank';
const REL_NOREFERRER = 'noreferrer';
const PREVIEW_BLOCK_CLASS = 'm-b-10';
const LINK_COMMENT_CLASS = 'm-r-8';
const URL_COMMENT_CLASS = 'm-l-8';
const HEADER_CLASS = 'ss-message__content--user-agree_to_term-top m-b-0';

const AgreeTerm = ({
  content,
  messageIndex,
  contentIndex,
  onChangeValue,
  errors,
  disabled,
}) => {
  if (!content || content.type !== MESSAGE_CONTENT_TYPES.AGREE_TERM) return null;

  const agreeTerm = content.agree_term;
  if (!agreeTerm) return null;

  const errorKey = `message${messageIndex}_content${contentIndex}_${content.type}`;
  const requiredLabel = agreeTerm.require ? REQUIRED_FIELD_LABEL : '';

  const handleAgreeChange = (value) => {
    onChangeValue(
      contentIndex,
      content.type,
      value,
      AGREE_TERM_VALUE_FIELD,
    );
  };

  const renderTitle = () => {
    if (!agreeTerm.title_require && !agreeTerm.require) return null;

    return (
      <div className={HEADER_CLASS}>
        {agreeTerm.title_require && (
          <span className="ss-message__content--user-agree_to_term-title">
            {agreeTerm.title}
          </span>
        )}
        {agreeTerm.require && (
          <span className="ss-message__content--user-text-input-required">
            {REQUIRED_FIELD_LABEL}
          </span>
        )}
      </div>
    );
  };

  const renderDetailContent = () => (
    <AgreeTermDetailBody
      title={agreeTerm.title}
      titleRequire={agreeTerm.title_require === true}
      requiredLabel={requiredLabel}
      headerClassName={HEADER_CLASS}
      content={agreeTerm.detail_content?.content ?? ''}
      term={agreeTerm.term ?? ''}
      isAgree={agreeTerm.isAgree === true}
      onAgreeChange={handleAgreeChange}
      checkboxDisabled={disabled}
      design={agreeTerm.design}
    />
  );

  const renderPostLinkOnly = () => (
    <div>
      {stampAgreeTermPostLinkIds(agreeTerm.post_link_only).map((item) => (
        <div key={agreeTermPostLinkKey(item)} className="ss-message__content--user-agree_to_term-post_link_only">
          <span className={LINK_COMMENT_CLASS}>{item.title_comment}</span>
          <a href={item.urls} target={LINK_TARGET_BLANK} rel={REL_NOREFERRER}>{item.title}</a>
          <span className={URL_COMMENT_CLASS}>{item.url_comment}</span>
        </div>
      ))}
      <CheckboxCustom
        disabled={disabled}
        onChange={handleAgreeChange}
        value={agreeTerm.isAgree === true}
        label={agreeTerm.term}
      />
    </div>
  );

  const renderErrorMessage = () => {
    if (!errors?.[errorKey]) return null;
    return (
      <div className="validation-error-message">
        {errors[errorKey]}
      </div>
    );
  };

  const renderBody = () => {
    if (agreeTerm.type === AGREE_TERM_DETAIL_TYPE) return renderDetailContent();
    if (agreeTerm.type === AGREE_TERM_POST_LINK_TYPE) {
      return (
        <>
          {renderTitle()}
          {renderPostLinkOnly()}
        </>
      );
    }
    return null;
  };

  return (
    <div className={PREVIEW_BLOCK_CLASS}>
      {renderBody()}
      {renderErrorMessage()}
    </div>
  );
};

AgreeTerm.propTypes = {
  ...baseUserMessageComponentPropTypes,
};

export default AgreeTerm;
