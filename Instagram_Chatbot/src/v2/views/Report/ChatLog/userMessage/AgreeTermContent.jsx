import React from 'react';
import PropTypes from 'prop-types';
import AgreeTermDetailBody from 'v2/components/BotMessages/AgreeTermDetailBody';
import CheckboxCustom from 'v2/components/BotMessages/CheckboxCustom';
import {
  AGREE_TERM_VALUE_FIELD,
  agreeTermPostLinkKey,
  stampAgreeTermPostLinkIds,
} from 'v2/components/BotMessages/agreeTermDesign';
import { agreeTermContentPropType } from 'v2/components/BotMessages/agreeTermPropTypes';
import {
  REQUIRED_LABEL,
  AGREE_TERM_TYPE,
  LINK_TARGET_BLANK,
  REL_NOREFERRER,
} from './constants';

const HEADER_CLASS = 'ss-message__content--user-agree_to_term-top chat-log-um-mb-0';

const AgreeTermContent = ({
  content,
  indexContent,
  indexMessage,
  errors,
  onChangeValue,
}) => {
  const agreeTerm = content.agree_term;
  if (!agreeTerm) return null;

  const errorKey = `message${indexMessage}_content${indexContent}_${content.type}`;

  const handleAgreeChange = (value) => {
    onChangeValue(
      indexContent,
      content.type,
      value,
      AGREE_TERM_VALUE_FIELD,
    );
  };

  const renderDetailContent = () => (
    <AgreeTermDetailBody
      title={agreeTerm.title}
      titleRequire={agreeTerm.title_require === true}
      requiredLabel={REQUIRED_LABEL}
      headerClassName={HEADER_CLASS}
      content={agreeTerm.detail_content?.content ?? ''}
      term={agreeTerm.term ?? ''}
      isAgree={agreeTerm.isAgree === true}
      onAgreeChange={handleAgreeChange}
      checkboxDisabled
      design={agreeTerm.design}
    />
  );

  const renderPostLinkOnly = () => (
    <div>
      <div className={HEADER_CLASS}>
        {agreeTerm.title_require && (
          <span className="ss-message__content--user-agree_to_term-title">
            {agreeTerm.title}
          </span>
        )}
        <span className="ss-message__content--user-text-input-required">
          {REQUIRED_LABEL}
        </span>
      </div>
      {stampAgreeTermPostLinkIds(agreeTerm.post_link_only).map((item) => (
        <div key={agreeTermPostLinkKey(item)} className="ss-message__content--user-agree_to_term-post_link_only">
          <span className="chat-log-um-mr-8">{item.title_comment}</span>
          <a href={item.urls} target={LINK_TARGET_BLANK} rel={REL_NOREFERRER}>{item.title}</a>
          <span className="chat-log-um-ml-8">{item.url_comment}</span>
        </div>
      ))}
      <CheckboxCustom
        disabled
        onChange={handleAgreeChange}
        value={agreeTerm.isAgree === true}
        label={agreeTerm.term}
      />
    </div>
  );

  const renderBody = () => {
    if (agreeTerm.type === AGREE_TERM_TYPE.DETAIL_CONTENT) return renderDetailContent();
    if (agreeTerm.type === AGREE_TERM_TYPE.POST_LINK_ONLY) return renderPostLinkOnly();
    return null;
  };

  return (
    <div className="chat-log-um-block">
      {renderBody()}
      {errors?.[errorKey] && (
        <div className="chat-log-um-error">{errors[errorKey]}</div>
      )}
    </div>
  );
};

AgreeTermContent.propTypes = {
  content: agreeTermContentPropType,
  indexContent: PropTypes.number,
  indexMessage: PropTypes.number,
  errors: PropTypes.object,
  onChangeValue: PropTypes.func,
};

export default AgreeTermContent;
