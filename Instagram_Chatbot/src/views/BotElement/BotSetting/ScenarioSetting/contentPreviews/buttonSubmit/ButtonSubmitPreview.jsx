import React from 'react';
import { Button } from 'reactstrap';
import ContentPreviewShell from '../shared/ContentPreviewShell';
import { BUTTON_SUBMIT_LABELS } from '../../constants/scenarioSettingLabels';
import '../../styles/contentPreviews/buttonSubmit.css';

const ButtonSubmitPreview = ({ content, message, indexContent }) => {
  const buttonSubmit = content.button_submit;

  if (content.type !== 'button_submit' || !buttonSubmit) return null;

  const renderErrorMessage = () => {
    if (!buttonSubmit.is_display_error_message) return null;
    return (
      <div className="ss-user-setting__item-text_input-top">
        <div className="ss-button-submit-preview__error">
          {BUTTON_SUBMIT_LABELS.sampleError}
        </div>
      </div>
    );
  };

  const renderSubmitButton = () => (
    <div className="ss-user-setting__item-text_input-top">
      <Button
        data-id={message?.message_content[indexContent]?.button_submit_id ?? content.button_submit_id}
        className="ss-user-setting__select-btn-add chatbot-submit-button ss-button-submit-preview__button"
        onClick={(e) => e.stopPropagation()}
      >
        {content.button_submit_name}
      </Button>
    </div>
  );

  return (
    <ContentPreviewShell>
      {renderErrorMessage()}
      {renderSubmitButton()}
    </ContentPreviewShell>
  );
};

export default ButtonSubmitPreview;
