import React from 'react';
import { CONTENT_SETTING_TYPES } from '../constants/contentTypeConstants';
import '../styles/base/preview-common.css';

const SmsVerifyPreview = ({ content }) => {
  const smsVerify = content.sms_verify;
  if (content.type !== CONTENT_SETTING_TYPES.SMS_VERIFY || !smsVerify) return null;

  return (
    <div className="ss-content-preview">
      {smsVerify.title_require && (
        <div className="ss-message__content--user-checkbox-top ss-content-preview__header--no-mb">
          <span className="ss-message__content--user-checkbox-title">
            {smsVerify.title}
          </span>
        </div>
      )}
    </div>
  );
};

export default SmsVerifyPreview;
