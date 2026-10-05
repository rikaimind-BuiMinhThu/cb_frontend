import React from 'react';
import CheckboxCustom from '../../scenarioComon/CheckboxCustom';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { AGREE_TERM_TYPES } from '../../constants/contentTypeConstants';
import { PREVIEW_LABELS } from '../../constants/scenarioSettingLabels';
import '../../styles/contentPreviews/agreeTerm.css';

const AgreeTermPreview = ({ content }) => {
  const agreeTerm = content.agree_term;

  if (content.type !== 'agree_term') return null;

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
    <div className="ss-message__content--user-agree_to_term-detail_content">
      <textarea
        name="ss-message__content--user-agree_to_term-detail_content"
        rows="5"
        value={agreeTerm[agreeTerm.type].content}
        className="ss-input-value"
        readOnly
      />
      <CheckboxCustom onChange={(value) => console.log(value)} label={agreeTerm.term} />
    </div>
  );

  const renderPostLinkOnly = () => (
    <div>
      {agreeTerm[agreeTerm.type].map((item, index) => (
        <div key={index} className="ss-message__content--user-agree_to_term-post_link_only">
          <span className="ss-agree-term-preview__link-comment">{item.title_comment}</span>
          <a href={item.urls} target="_blank" rel="noreferrer">{item.title}</a>
          <span className="ss-agree-term-preview__url-comment">{item.url_comment}</span>
        </div>
      ))}
      <CheckboxCustom onChange={(value) => console.log(value)} label={agreeTerm.term} />
    </div>
  );

  const renderTypeBody = () => {
    switch (agreeTerm.type) {
      case AGREE_TERM_TYPES.DETAIL_CONTENT:
        return renderDetailContent();
      case AGREE_TERM_TYPES.POST_LINK_ONLY:
        return renderPostLinkOnly();
      default:
        return null;
    }
  };

  return (
    <ContentPreviewShell className="ss-agree-term-preview">
      {renderHeader()}
      {renderTypeBody()}
    </ContentPreviewShell>
  );
};

export default AgreeTermPreview;
