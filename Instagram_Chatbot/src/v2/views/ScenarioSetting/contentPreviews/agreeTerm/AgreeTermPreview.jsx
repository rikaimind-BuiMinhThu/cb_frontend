import React from 'react';
import AgreeTermDetailBody from 'v2/components/BotMessages/AgreeTermDetailBody';
import {
  AGREE_TERM_DETAIL_TYPE,
  AGREE_TERM_POST_LINK_TYPE,
  agreeTermPostLinkKey,
  stampAgreeTermPostLinkIds,
} from 'v2/components/BotMessages/agreeTermDesign';
import { agreeTermContentPropType } from 'v2/components/BotMessages/agreeTermPropTypes';
import CheckboxCustom from '../../scenarioCommon/CheckboxCustom';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { CONTENT_SETTING_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import '../../styles/contentPreviews/agreeTerm.css';

const LINK_TARGET_BLANK = '_blank';
const REL_NOREFERRER = 'noreferrer';

const ignoreAgreeChange = () => {};

const AgreeTermPreview = ({ content }) => {
  const agreeTerm = content.agree_term;

  if (content.type !== CONTENT_SETTING_TYPES.AGREE_TERM || !agreeTerm) return null;

  const renderHeader = () => (
    <div className="ss-message__content--user-agree_to_term-top ss-agree-term-preview__header">
      {agreeTerm.title_require && (
        <span className="ss-message__content--user-agree_to_term-title">
          {agreeTerm.title}
        </span>
      )}
      <span className="ss-message__content--user-text-input-required">
        {PREVIEW_LABELS.requiredMark}
      </span>
    </div>
  );

  const renderDetailContent = () => (
    <AgreeTermDetailBody
      title={agreeTerm.title}
      titleRequire={agreeTerm.title_require === true}
      requiredLabel={PREVIEW_LABELS.requiredMark}
      headerClassName="ss-message__content--user-agree_to_term-top ss-agree-term-preview__header"
      content={agreeTerm.detail_content?.content ?? ''}
      term={agreeTerm.term ?? ''}
      design={agreeTerm.design}
      onAgreeChange={ignoreAgreeChange}
    />
  );

  const renderPostLinkOnly = () => (
    <div>
      {stampAgreeTermPostLinkIds(agreeTerm.post_link_only).map((item) => (
        <div key={agreeTermPostLinkKey(item)} className="ss-message__content--user-agree_to_term-post_link_only">
          <span className="ss-agree-term-preview__link-comment">{item.title_comment}</span>
          <a href={item.urls} target={LINK_TARGET_BLANK} rel={REL_NOREFERRER}>{item.title}</a>
          <span className="ss-agree-term-preview__url-comment">{item.url_comment}</span>
        </div>
      ))}
      <CheckboxCustom label={agreeTerm.term} onChange={ignoreAgreeChange} />
    </div>
  );

  const renderTypeBody = () => {
    if (agreeTerm.type === AGREE_TERM_DETAIL_TYPE) return renderDetailContent();
    if (agreeTerm.type === AGREE_TERM_POST_LINK_TYPE) {
      return (
        <>
          {renderHeader()}
          {renderPostLinkOnly()}
        </>
      );
    }
    return null;
  };

  return (
    <ContentPreviewShell className="ss-agree-term-preview">
      {renderTypeBody()}
    </ContentPreviewShell>
  );
};

AgreeTermPreview.propTypes = {
  content: agreeTermContentPropType.isRequired,
};

export default AgreeTermPreview;
